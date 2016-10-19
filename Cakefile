fs = require 'fs'

{print} = require 'util'
{spawn,exec} = require 'child_process'

build = (dest, src, callback) ->
  coffee = spawn 'coffee', ['--compile', '--no-header', '-o', dest, src]
  coffee.stderr.on 'data', (data) ->
    process.stderr.write data.toString()
  coffee.stdout.on 'data', (data) ->
    print data.toString()
  coffee.on 'exit', (code) ->
    callback?() if code is 0

task 'build', 'Build project', (options, callback) ->
  invoke 'package'
  invoke 'buildAllJS'

task 'buildAllJS', 'Build js from coffee', (options, callback) ->
  build 'js', 'src', ->
    invoke 'buildLibs'
    invoke 'buildTests'
 
task 'buildTests', 'Build Tests', (options, callback) ->
   build('test/js', 'test/src')
   
task 'package', 'Convert package.coffee to package.json', (options, callback) ->
  coffee = spawn 'coffee', ['-c', 'package.coffee']
  coffee.on 'exit', (code) ->
    pkgInfo = require './package.js'
    fs.writeFile "package.json", JSON.stringify(pkgInfo, null, 2)
    spawn 'rm', ['package.js']
    
task 'buildLibs', 'Convert Node.JS libs for the browser', (options, callback) ->
  exec 'node ./node_modules/browserify/bin/cmd.js js/CanonicalXML.js -o js/CanonicalXML.converted.js', (err, stdout, stderr) ->
    if err
      console.log stdout + stderr
      throw err if err
    exec 'rm -f js/CanonicalXML.js', (err, stdout, stderr) ->
      exec 'mv js/CanonicalXML.converted.js js/CanonicalXML.js'
  exec 'node ./node_modules/browserify/bin/cmd.js ./node_modules/xml-c14n/index.js -o lib/xml-c14n.js', (err, stdout, stderr) ->
    if err
      console.log stdout + stderr
      throw err if err