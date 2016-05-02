'use strict';
require('../common');
var assert = require('assert');
var EventEmitter = require('events').EventEmitter;

class MyEE extends EventEmitter {
  constructor(cb) {
    super();
    this.once(1, cb);
    this.emit(1);
    this.removeAllListeners();
  }
}

var called = false;
var myee = new MyEE(function() {
  called = true;
});


class ErrorEE extends EventEmitter {
  constructor() {
    super();
    this.emit('error', new Error('blerg'));
  }
}

assert.throws(function() {
  new ErrorEE();
}, /blerg/);

process.on('exit', function() {
  assert(called);
  assert(!(myee._events instanceof Object));
  assert.deepStrictEqual(Object.keys(myee._events), []);
  console.log('ok');
});


function MyEE2() {
  EventEmitter.call(this);
}

MyEE2.prototype = new EventEmitter();

var ee1 = new MyEE2();
var ee2 = new MyEE2();

ee1.on('x', function() {});

assert.equal(ee2.listenerCount('x'), 0);
