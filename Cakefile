fs = require 'fs'
mkdirp = require 'mkdirp'
{print} = require 'util'
{exec, execSync, spawn} = require 'child_process'

compile = (dest, src, callback) ->
  coffee = spawn 'coffee', ['--compile', '--no-header', '-o', dest, src]
  coffee.stderr.on 'data', (data) ->
    process.stderr.write data.toString()
  coffee.stdout.on 'data', (data) ->
    print data.toString()
  coffee.on 'exit', (code) ->
    callback?() if code is 0

makeUgly = (infile, outfile) ->
  uglify = require('uglify-js')
  code = fs.readFileSync(infile).toString()
  code = uglify.minify(code).code
  fs.writeFileSync(outfile, code)
  console.log("Minified " + outfile)

task 'build', 'Build project', ->
  invoke 'package'
  build()
  
build = ->
  compile 'js', 'src', ->
    invoke 'buildTests'
    buildDist()

task 'buildTests', 'Build Tests', ->
   compile 'test/js', 'test/src'
   
task 'package', 'Convert package.coffee to package.json', ->
  coffee = spawn 'coffee', ['-c', 'package.coffee']
  coffee.on 'exit', (code) ->
    pkgInfo = require './package.js'
    fs.writeFile "package.json", JSON.stringify(pkgInfo, null, 2)
    spawn 'rm', ['package.js']
    
buildDist = ->
  buildLibs ->
    filenames = ['node_modules/xpath/xpath.js']
    filenames = filenames.concat "lib/#{file}" for file in fs.readdirSync 'lib'
    filenames = filenames.concat "js/helper/#{file}" for file in fs.readdirSync 'js/helper'
    filenames = filenames.concat "js/#{file}" for file in fs.readdirSync 'js'
    filenames = filenames.filter (element, index, array) ->
      return fs.statSync(element).isFile()
    dest = 'xmlsec-webcrypto'
    mkdirp 'dist', ->
      exec "cat #{filenames.join(' ')} > dist/#{dest}.uncompressed.js", (err, stdout, stderr) ->
        if err
          console.log stdout + stderr
          throw err if err
        console.log "Uglifying #{dest}"
        makeUgly "dist/#{dest}.uncompressed.js", "dist/#{dest}.js"
        execSync "rm dist/#{dest}.uncompressed.js"

buildLibs = (callback) ->
  exec 'node ./node_modules/browserify/bin/cmd.js js/CanonicalXML.js -o js/CanonicalXML.converted.js', (err, stdout, stderr) ->
    if err
      console.log stdout + stderr
      throw err if err
    exec 'rm -f js/CanonicalXML.js', (err, stdout, stderr) ->
      exec 'mv js/CanonicalXML.converted.js js/CanonicalXML.js', (err, stdout, stderr) ->
          mkdirp 'lib', ->
            exec 'node ./node_modules/browserify/bin/cmd.js ./node_modules/xml-c14n/index.js -o lib/xml-c14n.js', (err, stdout, stderr) ->
              if err
                console.log stdout + stderr
                throw err if err
              callback?()