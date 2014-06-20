#!/usr/bin/env node

var docflux  = require('../lib/docflux')
var program  = require('commander')
var through2 = require('through2')
var fs       = require('fs')

program
  .usage('docflux <file>')
  .version(require('../package.json').version)
  .option('-m --markdown','Output a markdown formated documentation (default to json)')
  .option('-o --output <file>',  'Output to this file')
  .option('-i --indent [size]',  'Indent json output')
  .option('-d --depth  <size>',  'Minimal header depth for markdown output', 1)
  .parse(process.argv);


var filepath = program.args[0];

var inputStream   = filepath ? fs.createReadStream(filepath) : process.stdin;
var outputStream  = program.output ? fs.createWriteStream(program.output) : process.stdout;

if(program.markdown) {
  options = {
    depth: program.depth
  }
  inputStream
    .pipe(docflux())
    .pipe(docflux.markdown(options))
    .pipe(outputStream);
} else {
  var isFirst = true;
  var indent  = (program.indent === true) ? 2 : (program.indent ? parseInt(program.indent) : undefined);
  inputStream
    .pipe(docflux())
    .pipe(through2.obj(function(json, enc, done) {
      var out = (isFirst ? '' : '\n') + JSON.stringify(json, null, indent);
      isFirst = false;
      done(null, out )
    }))
    .pipe(outputStream);
}
