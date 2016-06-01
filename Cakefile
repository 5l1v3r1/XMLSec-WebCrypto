fs = require 'fs'

{print} = require 'util'
{spawn} = require 'child_process'

build = (dest, src, callback) ->
  coffee = spawn 'coffee', ['-c', '-o', dest, src]
  coffee.stderr.on 'data', (data) ->
    process.stderr.write data.toString()
  coffee.stdout.on 'data', (data) ->
    print data.toString()
  coffee.on 'exit', (code) ->
    callback?() if code is 0

task 'build', 'Build js/ from coffee/', ->
  build('Prototype/js', 'Prototype/coffee')
  
task 'buildTestBench', 'Build TestBench', ->
   build('Prototype/TestBench/js', 'Prototype/TestBench/coffee')