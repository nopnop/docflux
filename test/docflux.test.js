/* jshint undef: false, unused: false */

var docflux  = require('../lib/docflux')
var expect   = require('expect.js')
var join     = require('path').join
var concat   = require('concat-stream')
var fs       = require('fs')
var read     = require('fs').readFileSync
var through2 = require('through2')


function fixp(filename) {
  return join(__dirname, '/fixtures', filename);
}

function fread(filename) {
  return fs.readFileSync(fixp(filename),'utf-8');
}

describe('docflux', function(){

  it('json acceptance test', function(done) {
    var isFirst = true;
    var indent  = 2;
    fs.createReadStream(fixp('source.js'))
      .pipe(docflux())
      .pipe(through2.obj(function(json, enc, next) {
        var out = (isFirst ? '' : '\n') + JSON.stringify(json, null, indent);
        isFirst = false;
        next(null, out )
      }))
      .pipe(concat(function(data) {
        expect(data).to.eql(fread('expect.json'))
        done()
      }))
  })

  it('markdown acceptance test', function(done) {
    fs.createReadStream(fixp('source.js'))
      .pipe(docflux())
      .pipe(docflux.markdown())
      .pipe(concat(function(data) {
        expect(data).to.eql(fread('expect.md'))
        done()
      }))
  })


})
