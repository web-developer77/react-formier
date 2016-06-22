(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["react"], factory);
	else if(typeof exports === 'object')
		exports["Formio"] = factory(require("react"));
	else
		root["Formio"] = factory(root["react"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(1);
	var Formiojs = __webpack_require__(2);
	var FormioComponent = __webpack_require__(3);
	var debounce = __webpack_require__(4);

	__webpack_require__(11);

	module.exports = React.createClass({
	  displayName: 'Formio',
	  getInitialState: function getInitialState() {
	    return {
	      form: this.props.form || {},
	      submission: this.props.submission || {},
	      submissions: this.props.submissions || [],
	      alerts: [],
	      isLoading: this.props.form ? false : true,
	      isSubmitting: false,
	      isValid: true
	    };
	  },
	  getDefaultProps: function getDefaultProps() {
	    return {
	      readOnly: false,
	      formAction: false
	    };
	  },
	  componentWillMount: function componentWillMount() {
	    this.data = {};
	    this.inputs = {};
	  },
	  attachToForm: function attachToForm(component) {
	    this.inputs[component.props.component.key] = component;
	    this.data[component.props.component.key] = component.state.value;
	    this.validate(component);
	  },
	  detachFromForm: function detachFromForm(component) {
	    delete this.inputs[component.props.name];
	    delete this.data[component.props.name];
	  },
	  change: function change() {
	    if (typeof this.props.onChange === 'function') {
	      this.updateData();
	      this.props.onChange(this.data);
	    }
	  },
	  validate: debounce(function (component) {
	    var state = {
	      isValid: true,
	      errorMessage: ''
	    };
	    // Validate each item if multiple.
	    if (component.props.component.multiple) {
	      component.state.value.forEach(function (item, index) {
	        if (state.isValid) {
	          state = this.validateItem(item, component);
	        }
	      }.bind(this));
	    } else {
	      state = this.validateItem(component.state.value, component);
	    }
	    component.setState(state, this.validateForm);
	  }, 500),
	  validateForm: function validateForm() {
	    var allIsValid = true;

	    var inputs = this.inputs;
	    Object.keys(inputs).forEach(function (name) {
	      if (!inputs[name].state.isValid) {
	        allIsValid = false;
	      }
	    });

	    this.setState({
	      isValid: allIsValid
	    });
	  },
	  validateItem: function validateItem(item, component) {
	    var state = {
	      isValid: true,
	      errorMessage: ''
	    };
	    if (item || component.props.component.validate && component.props.component.validate.required) {
	      if (item) {
	        if (state.isValid && component.props.component.type === 'email' && !item.match(/\S+@\S+/)) {
	          state.isValid = false;
	          state.errorMessage = (component.props.component.label || component.props.component.key) + ' must be a valid email.';
	        }
	        // MaxLength
	        if (state.isValid && component.props.component.validate && component.props.component.validate.maxLength && item.length > component.props.component.validate.maxLength) {
	          state.isValid = false;
	          state.errorMessage = (component.props.component.label || component.props.component.key) + ' must be shorter than ' + (component.props.component.validate.maxLength + 1) + ' characters';
	        }
	        // MinLength
	        if (state.isValid && component.props.component.validate && component.props.component.validate.minLength && item.length < component.props.component.validate.minLength) {
	          state.isValid = false;
	          state.errorMessage = (component.props.component.label || component.props.component.key) + ' must be longer than ' + (component.props.component.validate.minLength - 1) + ' characters';
	        }
	        // Regex
	        if (state.isValid && component.props.component.validate && component.props.component.validate.pattern) {
	          var re = new RegExp(component.props.component.validate.pattern, 'g');
	          state.isValid = item.match(re);
	          if (!state.isValid) {
	            state.errorMessage = (component.props.component.label || component.props.component.key) + ' must match the expression: ' + component.props.component.validate.pattern;
	          }
	        }
	        // Custom
	        if (state.isValid && component.props.component.validate && component.props.component.validate.custom) {
	          var custom = component.props.component.validate.custom;
	          this.updateData();
	          custom = custom.replace(/({{\s+(.*)\s+}})/, function (match, $1, $2) {
	            return this.data[$2];
	          }.bind(this));
	          var input = item;
	          /* jshint evil: true */
	          var valid = eval(custom);
	          state.isValid = valid === true;
	          if (!state.isValid) {
	            state.errorMessage = valid || (component.props.component.label || component.props.component.key) + 'is not a valid value.';
	          }
	        }
	      }
	      // Only gets here if required but no value.
	      else {
	          state.isValid = false;
	          state.errorMessage = (component.props.component.label || component.props.component.key) + ' is required.';
	        }
	    }
	    return state;
	  },
	  componentDidMount: function componentDidMount() {
	    if (this.props.src) {
	      this.formio = new Formiojs(this.props.src);
	      this.formio.loadForm().then(function (form) {
	        if (typeof this.props.onFormLoad === 'function') {
	          this.props.onFormLoad(form);
	        }
	        this.setState({
	          form: form,
	          isLoading: false
	        }, this.validateForm);
	      }.bind(this));
	      if (this.formio.submissionId) {
	        this.formio.loadSubmission().then(function (submission) {
	          if (typeof this.props.onSubmissionLoad === 'function') {
	            this.props.onSubmissionLoad(submission);
	          }
	          this.setState({
	            submission: submission
	          }, this.validateForm);
	        }.bind(this));
	      }
	    }
	  },
	  updateData: function updateData(component) {
	    Object.keys(this.inputs).forEach(function (name) {
	      this.data[name] = this.inputs[name].state.value;
	    }.bind(this));
	  },
	  showAlert: function showAlert(type, message) {
	    this.setState(function (previousState) {
	      previousState.alerts = previousState.alerts.concat({ type: type, message: message });
	      return previousState;
	    });
	  },
	  onSubmit: function onSubmit(event) {
	    event.preventDefault();
	    this.setState({
	      alerts: [],
	      isSubmitting: true
	    });
	    this.updateData();
	    var sub = this.state.submission;
	    sub.data = this.data;

	    var request;
	    var method;
	    // Do the submit here.
	    if (this.state.form.action) {
	      method = this.state.submission._id ? 'put' : 'post';
	      request = Formiojs.request(this.state.form.action, method, sub);
	    } else if (this.formio) {
	      request = this.formio.saveSubmission(sub);
	    }
	    if (request) {
	      request.then(function (submission) {
	        if (typeof this.props.onFormSubmit === 'function') {
	          this.props.onFormSubmit(submission);
	        }
	        this.setState({
	          isSubmitting: false,
	          alerts: [{
	            type: 'success',
	            message: 'Submission was ' + (method === 'put' ? 'updated' : 'created')
	          }]
	        });
	      }.bind(this)).catch(function (response) {
	        if (typeof this.props.onFormError === 'function') {
	          this.props.onFormError(response);
	        }
	        this.setState({
	          isSubmitting: false
	        });
	        if (response.hasOwnProperty('name') && response.name === 'ValidationError') {
	          response.details.forEach(function (detail) {
	            if (this.inputs[detail.path]) {
	              this.inputs[detail.path].setState({
	                isValid: false,
	                isPristine: false,
	                errorMessage: detail.message
	              });
	            }
	          }.bind(this));
	        } else {
	          this.showAlert('danger', response);
	        }
	      }.bind(this));
	    } else {
	      if (typeof this.props.onFormSubmit === 'function') {
	        this.props.onFormSubmit(sub);
	      }
	      this.setState({
	        alerts: [],
	        isSubmitting: false
	      });
	    }
	  },
	  resetForm: function resetForm() {
	    this.setState(function (previousState) {
	      for (var key in previousState.submission.data) {
	        delete previousState.submission.data[key];
	      }
	      return previousState;
	    });
	  },
	  render: function render() {
	    if (this.state.form.components) {
	      this.componentNodes = this.state.form.components.map(function (component, index) {
	        var value = this.state.submission.data && this.state.submission.data.hasOwnProperty(component.key) ? this.state.submission.data[component.key] : component.defaultValue || '';
	        var key = component.key || component.type + index;
	        return React.createElement(FormioComponent, {
	          key: key,
	          component: component,
	          value: value,
	          readOnly: this.props.readOnly,
	          attachToForm: this.attachToForm,
	          detachFromForm: this.detachFromForm,
	          validate: this.validate,
	          change: this.change,
	          isSubmitting: this.state.isSubmitting,
	          isFormValid: this.state.isValid,
	          data: this.state.submission.data,
	          onElementRender: this.props.onElementRender,
	          resetForm: this.resetForm,
	          formio: this.formio,
	          showAlert: this.showAlert
	        });
	      }.bind(this));
	    }
	    var loading = this.state.isLoading ? React.createElement('i', { id: 'formio-loading', className: 'glyphicon glyphicon-refresh glyphicon-spin' }) : '';
	    var alerts = this.state.alerts.map(function (alert, index) {
	      var className = 'alert alert-' + alert.type;
	      return React.createElement(
	        'div',
	        { className: className, role: 'alert', key: index },
	        alert.message
	      );
	    });

	    return React.createElement(
	      'form',
	      { role: 'form', name: 'formioForm', onSubmit: this.onSubmit },
	      loading,
	      alerts,
	      this.componentNodes
	    );
	  }
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports) {

	(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Formio = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
	(function (process){
	// vim:ts=4:sts=4:sw=4:
	/*!
	 *
	 * Copyright 2009-2012 Kris Kowal under the terms of the MIT
	 * license found at http://github.com/kriskowal/q/raw/master/LICENSE
	 *
	 * With parts by Tyler Close
	 * Copyright 2007-2009 Tyler Close under the terms of the MIT X license found
	 * at http://www.opensource.org/licenses/mit-license.html
	 * Forked at ref_send.js version: 2009-05-11
	 *
	 * With parts by Mark Miller
	 * Copyright (C) 2011 Google Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 *
	 */

	(function (definition) {
	    "use strict";

	    // This file will function properly as a <script> tag, or a module
	    // using CommonJS and NodeJS or RequireJS module formats.  In
	    // Common/Node/RequireJS, the module exports the Q API and when
	    // executed as a simple <script>, it creates a Q global instead.

	    // Montage Require
	    if (typeof bootstrap === "function") {
	        bootstrap("promise", definition);

	    // CommonJS
	    } else if (typeof exports === "object" && typeof module === "object") {
	        module.exports = definition();

	    // RequireJS
	    } else if (typeof define === "function" && define.amd) {
	        define(definition);

	    // SES (Secure EcmaScript)
	    } else if (typeof ses !== "undefined") {
	        if (!ses.ok()) {
	            return;
	        } else {
	            ses.makeQ = definition;
	        }

	    // <script>
	    } else if (typeof window !== "undefined" || typeof self !== "undefined") {
	        // Prefer window over self for add-on scripts. Use self for
	        // non-windowed contexts.
	        var global = typeof window !== "undefined" ? window : self;

	        // Get the `window` object, save the previous Q global
	        // and initialize Q as a global.
	        var previousQ = global.Q;
	        global.Q = definition();

	        // Add a noConflict function so Q can be removed from the
	        // global namespace.
	        global.Q.noConflict = function () {
	            global.Q = previousQ;
	            return this;
	        };

	    } else {
	        throw new Error("This environment was not anticipated by Q. Please file a bug.");
	    }

	})(function () {
	"use strict";

	var hasStacks = false;
	try {
	    throw new Error();
	} catch (e) {
	    hasStacks = !!e.stack;
	}

	// All code after this point will be filtered from stack traces reported
	// by Q.
	var qStartingLine = captureLine();
	var qFileName;

	// shims

	// used for fallback in "allResolved"
	var noop = function () {};

	// Use the fastest possible means to execute a task in a future turn
	// of the event loop.
	var nextTick =(function () {
	    // linked list of tasks (single, with head node)
	    var head = {task: void 0, next: null};
	    var tail = head;
	    var flushing = false;
	    var requestTick = void 0;
	    var isNodeJS = false;
	    // queue for late tasks, used by unhandled rejection tracking
	    var laterQueue = [];

	    function flush() {
	        /* jshint loopfunc: true */
	        var task, domain;

	        while (head.next) {
	            head = head.next;
	            task = head.task;
	            head.task = void 0;
	            domain = head.domain;

	            if (domain) {
	                head.domain = void 0;
	                domain.enter();
	            }
	            runSingle(task, domain);

	        }
	        while (laterQueue.length) {
	            task = laterQueue.pop();
	            runSingle(task);
	        }
	        flushing = false;
	    }
	    // runs a single function in the async queue
	    function runSingle(task, domain) {
	        try {
	            task();

	        } catch (e) {
	            if (isNodeJS) {
	                // In node, uncaught exceptions are considered fatal errors.
	                // Re-throw them synchronously to interrupt flushing!

	                // Ensure continuation if the uncaught exception is suppressed
	                // listening "uncaughtException" events (as domains does).
	                // Continue in next event to avoid tick recursion.
	                if (domain) {
	                    domain.exit();
	                }
	                setTimeout(flush, 0);
	                if (domain) {
	                    domain.enter();
	                }

	                throw e;

	            } else {
	                // In browsers, uncaught exceptions are not fatal.
	                // Re-throw them asynchronously to avoid slow-downs.
	                setTimeout(function () {
	                    throw e;
	                }, 0);
	            }
	        }

	        if (domain) {
	            domain.exit();
	        }
	    }

	    nextTick = function (task) {
	        tail = tail.next = {
	            task: task,
	            domain: isNodeJS && process.domain,
	            next: null
	        };

	        if (!flushing) {
	            flushing = true;
	            requestTick();
	        }
	    };

	    if (typeof process === "object" &&
	        process.toString() === "[object process]" && process.nextTick) {
	        // Ensure Q is in a real Node environment, with a `process.nextTick`.
	        // To see through fake Node environments:
	        // * Mocha test runner - exposes a `process` global without a `nextTick`
	        // * Browserify - exposes a `process.nexTick` function that uses
	        //   `setTimeout`. In this case `setImmediate` is preferred because
	        //    it is faster. Browserify's `process.toString()` yields
	        //   "[object Object]", while in a real Node environment
	        //   `process.nextTick()` yields "[object process]".
	        isNodeJS = true;

	        requestTick = function () {
	            process.nextTick(flush);
	        };

	    } else if (typeof setImmediate === "function") {
	        // In IE10, Node.js 0.9+, or https://github.com/NobleJS/setImmediate
	        if (typeof window !== "undefined") {
	            requestTick = setImmediate.bind(window, flush);
	        } else {
	            requestTick = function () {
	                setImmediate(flush);
	            };
	        }

	    } else if (typeof MessageChannel !== "undefined") {
	        // modern browsers
	        // http://www.nonblocking.io/2011/06/windownexttick.html
	        var channel = new MessageChannel();
	        // At least Safari Version 6.0.5 (8536.30.1) intermittently cannot create
	        // working message ports the first time a page loads.
	        channel.port1.onmessage = function () {
	            requestTick = requestPortTick;
	            channel.port1.onmessage = flush;
	            flush();
	        };
	        var requestPortTick = function () {
	            // Opera requires us to provide a message payload, regardless of
	            // whether we use it.
	            channel.port2.postMessage(0);
	        };
	        requestTick = function () {
	            setTimeout(flush, 0);
	            requestPortTick();
	        };

	    } else {
	        // old browsers
	        requestTick = function () {
	            setTimeout(flush, 0);
	        };
	    }
	    // runs a task after all other tasks have been run
	    // this is useful for unhandled rejection tracking that needs to happen
	    // after all `then`d tasks have been run.
	    nextTick.runAfter = function (task) {
	        laterQueue.push(task);
	        if (!flushing) {
	            flushing = true;
	            requestTick();
	        }
	    };
	    return nextTick;
	})();

	// Attempt to make generics safe in the face of downstream
	// modifications.
	// There is no situation where this is necessary.
	// If you need a security guarantee, these primordials need to be
	// deeply frozen anyway, and if you don’t need a security guarantee,
	// this is just plain paranoid.
	// However, this **might** have the nice side-effect of reducing the size of
	// the minified code by reducing x.call() to merely x()
	// See Mark Miller’s explanation of what this does.
	// http://wiki.ecmascript.org/doku.php?id=conventions:safe_meta_programming
	var call = Function.call;
	function uncurryThis(f) {
	    return function () {
	        return call.apply(f, arguments);
	    };
	}
	// This is equivalent, but slower:
	// uncurryThis = Function_bind.bind(Function_bind.call);
	// http://jsperf.com/uncurrythis

	var array_slice = uncurryThis(Array.prototype.slice);

	var array_reduce = uncurryThis(
	    Array.prototype.reduce || function (callback, basis) {
	        var index = 0,
	            length = this.length;
	        // concerning the initial value, if one is not provided
	        if (arguments.length === 1) {
	            // seek to the first value in the array, accounting
	            // for the possibility that is is a sparse array
	            do {
	                if (index in this) {
	                    basis = this[index++];
	                    break;
	                }
	                if (++index >= length) {
	                    throw new TypeError();
	                }
	            } while (1);
	        }
	        // reduce
	        for (; index < length; index++) {
	            // account for the possibility that the array is sparse
	            if (index in this) {
	                basis = callback(basis, this[index], index);
	            }
	        }
	        return basis;
	    }
	);

	var array_indexOf = uncurryThis(
	    Array.prototype.indexOf || function (value) {
	        // not a very good shim, but good enough for our one use of it
	        for (var i = 0; i < this.length; i++) {
	            if (this[i] === value) {
	                return i;
	            }
	        }
	        return -1;
	    }
	);

	var array_map = uncurryThis(
	    Array.prototype.map || function (callback, thisp) {
	        var self = this;
	        var collect = [];
	        array_reduce(self, function (undefined, value, index) {
	            collect.push(callback.call(thisp, value, index, self));
	        }, void 0);
	        return collect;
	    }
	);

	var object_create = Object.create || function (prototype) {
	    function Type() { }
	    Type.prototype = prototype;
	    return new Type();
	};

	var object_hasOwnProperty = uncurryThis(Object.prototype.hasOwnProperty);

	var object_keys = Object.keys || function (object) {
	    var keys = [];
	    for (var key in object) {
	        if (object_hasOwnProperty(object, key)) {
	            keys.push(key);
	        }
	    }
	    return keys;
	};

	var object_toString = uncurryThis(Object.prototype.toString);

	function isObject(value) {
	    return value === Object(value);
	}

	// generator related shims

	// FIXME: Remove this function once ES6 generators are in SpiderMonkey.
	function isStopIteration(exception) {
	    return (
	        object_toString(exception) === "[object StopIteration]" ||
	        exception instanceof QReturnValue
	    );
	}

	// FIXME: Remove this helper and Q.return once ES6 generators are in
	// SpiderMonkey.
	var QReturnValue;
	if (typeof ReturnValue !== "undefined") {
	    QReturnValue = ReturnValue;
	} else {
	    QReturnValue = function (value) {
	        this.value = value;
	    };
	}

	// long stack traces

	var STACK_JUMP_SEPARATOR = "From previous event:";

	function makeStackTraceLong(error, promise) {
	    // If possible, transform the error stack trace by removing Node and Q
	    // cruft, then concatenating with the stack trace of `promise`. See #57.
	    if (hasStacks &&
	        promise.stack &&
	        typeof error === "object" &&
	        error !== null &&
	        error.stack &&
	        error.stack.indexOf(STACK_JUMP_SEPARATOR) === -1
	    ) {
	        var stacks = [];
	        for (var p = promise; !!p; p = p.source) {
	            if (p.stack) {
	                stacks.unshift(p.stack);
	            }
	        }
	        stacks.unshift(error.stack);

	        var concatedStacks = stacks.join("\n" + STACK_JUMP_SEPARATOR + "\n");
	        error.stack = filterStackString(concatedStacks);
	    }
	}

	function filterStackString(stackString) {
	    var lines = stackString.split("\n");
	    var desiredLines = [];
	    for (var i = 0; i < lines.length; ++i) {
	        var line = lines[i];

	        if (!isInternalFrame(line) && !isNodeFrame(line) && line) {
	            desiredLines.push(line);
	        }
	    }
	    return desiredLines.join("\n");
	}

	function isNodeFrame(stackLine) {
	    return stackLine.indexOf("(module.js:") !== -1 ||
	           stackLine.indexOf("(node.js:") !== -1;
	}

	function getFileNameAndLineNumber(stackLine) {
	    // Named functions: "at functionName (filename:lineNumber:columnNumber)"
	    // In IE10 function name can have spaces ("Anonymous function") O_o
	    var attempt1 = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(stackLine);
	    if (attempt1) {
	        return [attempt1[1], Number(attempt1[2])];
	    }

	    // Anonymous functions: "at filename:lineNumber:columnNumber"
	    var attempt2 = /at ([^ ]+):(\d+):(?:\d+)$/.exec(stackLine);
	    if (attempt2) {
	        return [attempt2[1], Number(attempt2[2])];
	    }

	    // Firefox style: "function@filename:lineNumber or @filename:lineNumber"
	    var attempt3 = /.*@(.+):(\d+)$/.exec(stackLine);
	    if (attempt3) {
	        return [attempt3[1], Number(attempt3[2])];
	    }
	}

	function isInternalFrame(stackLine) {
	    var fileNameAndLineNumber = getFileNameAndLineNumber(stackLine);

	    if (!fileNameAndLineNumber) {
	        return false;
	    }

	    var fileName = fileNameAndLineNumber[0];
	    var lineNumber = fileNameAndLineNumber[1];

	    return fileName === qFileName &&
	        lineNumber >= qStartingLine &&
	        lineNumber <= qEndingLine;
	}

	// discover own file name and line number range for filtering stack
	// traces
	function captureLine() {
	    if (!hasStacks) {
	        return;
	    }

	    try {
	        throw new Error();
	    } catch (e) {
	        var lines = e.stack.split("\n");
	        var firstLine = lines[0].indexOf("@") > 0 ? lines[1] : lines[2];
	        var fileNameAndLineNumber = getFileNameAndLineNumber(firstLine);
	        if (!fileNameAndLineNumber) {
	            return;
	        }

	        qFileName = fileNameAndLineNumber[0];
	        return fileNameAndLineNumber[1];
	    }
	}

	function deprecate(callback, name, alternative) {
	    return function () {
	        if (typeof console !== "undefined" &&
	            typeof console.warn === "function") {
	            console.warn(name + " is deprecated, use " + alternative +
	                         " instead.", new Error("").stack);
	        }
	        return callback.apply(callback, arguments);
	    };
	}

	// end of shims
	// beginning of real work

	/**
	 * Constructs a promise for an immediate reference, passes promises through, or
	 * coerces promises from different systems.
	 * @param value immediate reference or promise
	 */
	function Q(value) {
	    // If the object is already a Promise, return it directly.  This enables
	    // the resolve function to both be used to created references from objects,
	    // but to tolerably coerce non-promises to promises.
	    if (value instanceof Promise) {
	        return value;
	    }

	    // assimilate thenables
	    if (isPromiseAlike(value)) {
	        return coerce(value);
	    } else {
	        return fulfill(value);
	    }
	}
	Q.resolve = Q;

	/**
	 * Performs a task in a future turn of the event loop.
	 * @param {Function} task
	 */
	Q.nextTick = nextTick;

	/**
	 * Controls whether or not long stack traces will be on
	 */
	Q.longStackSupport = false;

	// enable long stacks if Q_DEBUG is set
	if (typeof process === "object" && process && process.env && process.env.Q_DEBUG) {
	    Q.longStackSupport = true;
	}

	/**
	 * Constructs a {promise, resolve, reject} object.
	 *
	 * `resolve` is a callback to invoke with a more resolved value for the
	 * promise. To fulfill the promise, invoke `resolve` with any value that is
	 * not a thenable. To reject the promise, invoke `resolve` with a rejected
	 * thenable, or invoke `reject` with the reason directly. To resolve the
	 * promise to another thenable, thus putting it in the same state, invoke
	 * `resolve` with that other thenable.
	 */
	Q.defer = defer;
	function defer() {
	    // if "messages" is an "Array", that indicates that the promise has not yet
	    // been resolved.  If it is "undefined", it has been resolved.  Each
	    // element of the messages array is itself an array of complete arguments to
	    // forward to the resolved promise.  We coerce the resolution value to a
	    // promise using the `resolve` function because it handles both fully
	    // non-thenable values and other thenables gracefully.
	    var messages = [], progressListeners = [], resolvedPromise;

	    var deferred = object_create(defer.prototype);
	    var promise = object_create(Promise.prototype);

	    promise.promiseDispatch = function (resolve, op, operands) {
	        var args = array_slice(arguments);
	        if (messages) {
	            messages.push(args);
	            if (op === "when" && operands[1]) { // progress operand
	                progressListeners.push(operands[1]);
	            }
	        } else {
	            Q.nextTick(function () {
	                resolvedPromise.promiseDispatch.apply(resolvedPromise, args);
	            });
	        }
	    };

	    // XXX deprecated
	    promise.valueOf = function () {
	        if (messages) {
	            return promise;
	        }
	        var nearerValue = nearer(resolvedPromise);
	        if (isPromise(nearerValue)) {
	            resolvedPromise = nearerValue; // shorten chain
	        }
	        return nearerValue;
	    };

	    promise.inspect = function () {
	        if (!resolvedPromise) {
	            return { state: "pending" };
	        }
	        return resolvedPromise.inspect();
	    };

	    if (Q.longStackSupport && hasStacks) {
	        try {
	            throw new Error();
	        } catch (e) {
	            // NOTE: don't try to use `Error.captureStackTrace` or transfer the
	            // accessor around; that causes memory leaks as per GH-111. Just
	            // reify the stack trace as a string ASAP.
	            //
	            // At the same time, cut off the first line; it's always just
	            // "[object Promise]\n", as per the `toString`.
	            promise.stack = e.stack.substring(e.stack.indexOf("\n") + 1);
	        }
	    }

	    // NOTE: we do the checks for `resolvedPromise` in each method, instead of
	    // consolidating them into `become`, since otherwise we'd create new
	    // promises with the lines `become(whatever(value))`. See e.g. GH-252.

	    function become(newPromise) {
	        resolvedPromise = newPromise;
	        promise.source = newPromise;

	        array_reduce(messages, function (undefined, message) {
	            Q.nextTick(function () {
	                newPromise.promiseDispatch.apply(newPromise, message);
	            });
	        }, void 0);

	        messages = void 0;
	        progressListeners = void 0;
	    }

	    deferred.promise = promise;
	    deferred.resolve = function (value) {
	        if (resolvedPromise) {
	            return;
	        }

	        become(Q(value));
	    };

	    deferred.fulfill = function (value) {
	        if (resolvedPromise) {
	            return;
	        }

	        become(fulfill(value));
	    };
	    deferred.reject = function (reason) {
	        if (resolvedPromise) {
	            return;
	        }

	        become(reject(reason));
	    };
	    deferred.notify = function (progress) {
	        if (resolvedPromise) {
	            return;
	        }

	        array_reduce(progressListeners, function (undefined, progressListener) {
	            Q.nextTick(function () {
	                progressListener(progress);
	            });
	        }, void 0);
	    };

	    return deferred;
	}

	/**
	 * Creates a Node-style callback that will resolve or reject the deferred
	 * promise.
	 * @returns a nodeback
	 */
	defer.prototype.makeNodeResolver = function () {
	    var self = this;
	    return function (error, value) {
	        if (error) {
	            self.reject(error);
	        } else if (arguments.length > 2) {
	            self.resolve(array_slice(arguments, 1));
	        } else {
	            self.resolve(value);
	        }
	    };
	};

	/**
	 * @param resolver {Function} a function that returns nothing and accepts
	 * the resolve, reject, and notify functions for a deferred.
	 * @returns a promise that may be resolved with the given resolve and reject
	 * functions, or rejected by a thrown exception in resolver
	 */
	Q.Promise = promise; // ES6
	Q.promise = promise;
	function promise(resolver) {
	    if (typeof resolver !== "function") {
	        throw new TypeError("resolver must be a function.");
	    }
	    var deferred = defer();
	    try {
	        resolver(deferred.resolve, deferred.reject, deferred.notify);
	    } catch (reason) {
	        deferred.reject(reason);
	    }
	    return deferred.promise;
	}

	promise.race = race; // ES6
	promise.all = all; // ES6
	promise.reject = reject; // ES6
	promise.resolve = Q; // ES6

	// XXX experimental.  This method is a way to denote that a local value is
	// serializable and should be immediately dispatched to a remote upon request,
	// instead of passing a reference.
	Q.passByCopy = function (object) {
	    //freeze(object);
	    //passByCopies.set(object, true);
	    return object;
	};

	Promise.prototype.passByCopy = function () {
	    //freeze(object);
	    //passByCopies.set(object, true);
	    return this;
	};

	/**
	 * If two promises eventually fulfill to the same value, promises that value,
	 * but otherwise rejects.
	 * @param x {Any*}
	 * @param y {Any*}
	 * @returns {Any*} a promise for x and y if they are the same, but a rejection
	 * otherwise.
	 *
	 */
	Q.join = function (x, y) {
	    return Q(x).join(y);
	};

	Promise.prototype.join = function (that) {
	    return Q([this, that]).spread(function (x, y) {
	        if (x === y) {
	            // TODO: "===" should be Object.is or equiv
	            return x;
	        } else {
	            throw new Error("Can't join: not the same: " + x + " " + y);
	        }
	    });
	};

	/**
	 * Returns a promise for the first of an array of promises to become settled.
	 * @param answers {Array[Any*]} promises to race
	 * @returns {Any*} the first promise to be settled
	 */
	Q.race = race;
	function race(answerPs) {
	    return promise(function (resolve, reject) {
	        // Switch to this once we can assume at least ES5
	        // answerPs.forEach(function (answerP) {
	        //     Q(answerP).then(resolve, reject);
	        // });
	        // Use this in the meantime
	        for (var i = 0, len = answerPs.length; i < len; i++) {
	            Q(answerPs[i]).then(resolve, reject);
	        }
	    });
	}

	Promise.prototype.race = function () {
	    return this.then(Q.race);
	};

	/**
	 * Constructs a Promise with a promise descriptor object and optional fallback
	 * function.  The descriptor contains methods like when(rejected), get(name),
	 * set(name, value), post(name, args), and delete(name), which all
	 * return either a value, a promise for a value, or a rejection.  The fallback
	 * accepts the operation name, a resolver, and any further arguments that would
	 * have been forwarded to the appropriate method above had a method been
	 * provided with the proper name.  The API makes no guarantees about the nature
	 * of the returned object, apart from that it is usable whereever promises are
	 * bought and sold.
	 */
	Q.makePromise = Promise;
	function Promise(descriptor, fallback, inspect) {
	    if (fallback === void 0) {
	        fallback = function (op) {
	            return reject(new Error(
	                "Promise does not support operation: " + op
	            ));
	        };
	    }
	    if (inspect === void 0) {
	        inspect = function () {
	            return {state: "unknown"};
	        };
	    }

	    var promise = object_create(Promise.prototype);

	    promise.promiseDispatch = function (resolve, op, args) {
	        var result;
	        try {
	            if (descriptor[op]) {
	                result = descriptor[op].apply(promise, args);
	            } else {
	                result = fallback.call(promise, op, args);
	            }
	        } catch (exception) {
	            result = reject(exception);
	        }
	        if (resolve) {
	            resolve(result);
	        }
	    };

	    promise.inspect = inspect;

	    // XXX deprecated `valueOf` and `exception` support
	    if (inspect) {
	        var inspected = inspect();
	        if (inspected.state === "rejected") {
	            promise.exception = inspected.reason;
	        }

	        promise.valueOf = function () {
	            var inspected = inspect();
	            if (inspected.state === "pending" ||
	                inspected.state === "rejected") {
	                return promise;
	            }
	            return inspected.value;
	        };
	    }

	    return promise;
	}

	Promise.prototype.toString = function () {
	    return "[object Promise]";
	};

	Promise.prototype.then = function (fulfilled, rejected, progressed) {
	    var self = this;
	    var deferred = defer();
	    var done = false;   // ensure the untrusted promise makes at most a
	                        // single call to one of the callbacks

	    function _fulfilled(value) {
	        try {
	            return typeof fulfilled === "function" ? fulfilled(value) : value;
	        } catch (exception) {
	            return reject(exception);
	        }
	    }

	    function _rejected(exception) {
	        if (typeof rejected === "function") {
	            makeStackTraceLong(exception, self);
	            try {
	                return rejected(exception);
	            } catch (newException) {
	                return reject(newException);
	            }
	        }
	        return reject(exception);
	    }

	    function _progressed(value) {
	        return typeof progressed === "function" ? progressed(value) : value;
	    }

	    Q.nextTick(function () {
	        self.promiseDispatch(function (value) {
	            if (done) {
	                return;
	            }
	            done = true;

	            deferred.resolve(_fulfilled(value));
	        }, "when", [function (exception) {
	            if (done) {
	                return;
	            }
	            done = true;

	            deferred.resolve(_rejected(exception));
	        }]);
	    });

	    // Progress propagator need to be attached in the current tick.
	    self.promiseDispatch(void 0, "when", [void 0, function (value) {
	        var newValue;
	        var threw = false;
	        try {
	            newValue = _progressed(value);
	        } catch (e) {
	            threw = true;
	            if (Q.onerror) {
	                Q.onerror(e);
	            } else {
	                throw e;
	            }
	        }

	        if (!threw) {
	            deferred.notify(newValue);
	        }
	    }]);

	    return deferred.promise;
	};

	Q.tap = function (promise, callback) {
	    return Q(promise).tap(callback);
	};

	/**
	 * Works almost like "finally", but not called for rejections.
	 * Original resolution value is passed through callback unaffected.
	 * Callback may return a promise that will be awaited for.
	 * @param {Function} callback
	 * @returns {Q.Promise}
	 * @example
	 * doSomething()
	 *   .then(...)
	 *   .tap(console.log)
	 *   .then(...);
	 */
	Promise.prototype.tap = function (callback) {
	    callback = Q(callback);

	    return this.then(function (value) {
	        return callback.fcall(value).thenResolve(value);
	    });
	};

	/**
	 * Registers an observer on a promise.
	 *
	 * Guarantees:
	 *
	 * 1. that fulfilled and rejected will be called only once.
	 * 2. that either the fulfilled callback or the rejected callback will be
	 *    called, but not both.
	 * 3. that fulfilled and rejected will not be called in this turn.
	 *
	 * @param value      promise or immediate reference to observe
	 * @param fulfilled  function to be called with the fulfilled value
	 * @param rejected   function to be called with the rejection exception
	 * @param progressed function to be called on any progress notifications
	 * @return promise for the return value from the invoked callback
	 */
	Q.when = when;
	function when(value, fulfilled, rejected, progressed) {
	    return Q(value).then(fulfilled, rejected, progressed);
	}

	Promise.prototype.thenResolve = function (value) {
	    return this.then(function () { return value; });
	};

	Q.thenResolve = function (promise, value) {
	    return Q(promise).thenResolve(value);
	};

	Promise.prototype.thenReject = function (reason) {
	    return this.then(function () { throw reason; });
	};

	Q.thenReject = function (promise, reason) {
	    return Q(promise).thenReject(reason);
	};

	/**
	 * If an object is not a promise, it is as "near" as possible.
	 * If a promise is rejected, it is as "near" as possible too.
	 * If it’s a fulfilled promise, the fulfillment value is nearer.
	 * If it’s a deferred promise and the deferred has been resolved, the
	 * resolution is "nearer".
	 * @param object
	 * @returns most resolved (nearest) form of the object
	 */

	// XXX should we re-do this?
	Q.nearer = nearer;
	function nearer(value) {
	    if (isPromise(value)) {
	        var inspected = value.inspect();
	        if (inspected.state === "fulfilled") {
	            return inspected.value;
	        }
	    }
	    return value;
	}

	/**
	 * @returns whether the given object is a promise.
	 * Otherwise it is a fulfilled value.
	 */
	Q.isPromise = isPromise;
	function isPromise(object) {
	    return object instanceof Promise;
	}

	Q.isPromiseAlike = isPromiseAlike;
	function isPromiseAlike(object) {
	    return isObject(object) && typeof object.then === "function";
	}

	/**
	 * @returns whether the given object is a pending promise, meaning not
	 * fulfilled or rejected.
	 */
	Q.isPending = isPending;
	function isPending(object) {
	    return isPromise(object) && object.inspect().state === "pending";
	}

	Promise.prototype.isPending = function () {
	    return this.inspect().state === "pending";
	};

	/**
	 * @returns whether the given object is a value or fulfilled
	 * promise.
	 */
	Q.isFulfilled = isFulfilled;
	function isFulfilled(object) {
	    return !isPromise(object) || object.inspect().state === "fulfilled";
	}

	Promise.prototype.isFulfilled = function () {
	    return this.inspect().state === "fulfilled";
	};

	/**
	 * @returns whether the given object is a rejected promise.
	 */
	Q.isRejected = isRejected;
	function isRejected(object) {
	    return isPromise(object) && object.inspect().state === "rejected";
	}

	Promise.prototype.isRejected = function () {
	    return this.inspect().state === "rejected";
	};

	//// BEGIN UNHANDLED REJECTION TRACKING

	// This promise library consumes exceptions thrown in handlers so they can be
	// handled by a subsequent promise.  The exceptions get added to this array when
	// they are created, and removed when they are handled.  Note that in ES6 or
	// shimmed environments, this would naturally be a `Set`.
	var unhandledReasons = [];
	var unhandledRejections = [];
	var reportedUnhandledRejections = [];
	var trackUnhandledRejections = true;

	function resetUnhandledRejections() {
	    unhandledReasons.length = 0;
	    unhandledRejections.length = 0;

	    if (!trackUnhandledRejections) {
	        trackUnhandledRejections = true;
	    }
	}

	function trackRejection(promise, reason) {
	    if (!trackUnhandledRejections) {
	        return;
	    }
	    if (typeof process === "object" && typeof process.emit === "function") {
	        Q.nextTick.runAfter(function () {
	            if (array_indexOf(unhandledRejections, promise) !== -1) {
	                process.emit("unhandledRejection", reason, promise);
	                reportedUnhandledRejections.push(promise);
	            }
	        });
	    }

	    unhandledRejections.push(promise);
	    if (reason && typeof reason.stack !== "undefined") {
	        unhandledReasons.push(reason.stack);
	    } else {
	        unhandledReasons.push("(no stack) " + reason);
	    }
	}

	function untrackRejection(promise) {
	    if (!trackUnhandledRejections) {
	        return;
	    }

	    var at = array_indexOf(unhandledRejections, promise);
	    if (at !== -1) {
	        if (typeof process === "object" && typeof process.emit === "function") {
	            Q.nextTick.runAfter(function () {
	                var atReport = array_indexOf(reportedUnhandledRejections, promise);
	                if (atReport !== -1) {
	                    process.emit("rejectionHandled", unhandledReasons[at], promise);
	                    reportedUnhandledRejections.splice(atReport, 1);
	                }
	            });
	        }
	        unhandledRejections.splice(at, 1);
	        unhandledReasons.splice(at, 1);
	    }
	}

	Q.resetUnhandledRejections = resetUnhandledRejections;

	Q.getUnhandledReasons = function () {
	    // Make a copy so that consumers can't interfere with our internal state.
	    return unhandledReasons.slice();
	};

	Q.stopUnhandledRejectionTracking = function () {
	    resetUnhandledRejections();
	    trackUnhandledRejections = false;
	};

	resetUnhandledRejections();

	//// END UNHANDLED REJECTION TRACKING

	/**
	 * Constructs a rejected promise.
	 * @param reason value describing the failure
	 */
	Q.reject = reject;
	function reject(reason) {
	    var rejection = Promise({
	        "when": function (rejected) {
	            // note that the error has been handled
	            if (rejected) {
	                untrackRejection(this);
	            }
	            return rejected ? rejected(reason) : this;
	        }
	    }, function fallback() {
	        return this;
	    }, function inspect() {
	        return { state: "rejected", reason: reason };
	    });

	    // Note that the reason has not been handled.
	    trackRejection(rejection, reason);

	    return rejection;
	}

	/**
	 * Constructs a fulfilled promise for an immediate reference.
	 * @param value immediate reference
	 */
	Q.fulfill = fulfill;
	function fulfill(value) {
	    return Promise({
	        "when": function () {
	            return value;
	        },
	        "get": function (name) {
	            return value[name];
	        },
	        "set": function (name, rhs) {
	            value[name] = rhs;
	        },
	        "delete": function (name) {
	            delete value[name];
	        },
	        "post": function (name, args) {
	            // Mark Miller proposes that post with no name should apply a
	            // promised function.
	            if (name === null || name === void 0) {
	                return value.apply(void 0, args);
	            } else {
	                return value[name].apply(value, args);
	            }
	        },
	        "apply": function (thisp, args) {
	            return value.apply(thisp, args);
	        },
	        "keys": function () {
	            return object_keys(value);
	        }
	    }, void 0, function inspect() {
	        return { state: "fulfilled", value: value };
	    });
	}

	/**
	 * Converts thenables to Q promises.
	 * @param promise thenable promise
	 * @returns a Q promise
	 */
	function coerce(promise) {
	    var deferred = defer();
	    Q.nextTick(function () {
	        try {
	            promise.then(deferred.resolve, deferred.reject, deferred.notify);
	        } catch (exception) {
	            deferred.reject(exception);
	        }
	    });
	    return deferred.promise;
	}

	/**
	 * Annotates an object such that it will never be
	 * transferred away from this process over any promise
	 * communication channel.
	 * @param object
	 * @returns promise a wrapping of that object that
	 * additionally responds to the "isDef" message
	 * without a rejection.
	 */
	Q.master = master;
	function master(object) {
	    return Promise({
	        "isDef": function () {}
	    }, function fallback(op, args) {
	        return dispatch(object, op, args);
	    }, function () {
	        return Q(object).inspect();
	    });
	}

	/**
	 * Spreads the values of a promised array of arguments into the
	 * fulfillment callback.
	 * @param fulfilled callback that receives variadic arguments from the
	 * promised array
	 * @param rejected callback that receives the exception if the promise
	 * is rejected.
	 * @returns a promise for the return value or thrown exception of
	 * either callback.
	 */
	Q.spread = spread;
	function spread(value, fulfilled, rejected) {
	    return Q(value).spread(fulfilled, rejected);
	}

	Promise.prototype.spread = function (fulfilled, rejected) {
	    return this.all().then(function (array) {
	        return fulfilled.apply(void 0, array);
	    }, rejected);
	};

	/**
	 * The async function is a decorator for generator functions, turning
	 * them into asynchronous generators.  Although generators are only part
	 * of the newest ECMAScript 6 drafts, this code does not cause syntax
	 * errors in older engines.  This code should continue to work and will
	 * in fact improve over time as the language improves.
	 *
	 * ES6 generators are currently part of V8 version 3.19 with the
	 * --harmony-generators runtime flag enabled.  SpiderMonkey has had them
	 * for longer, but under an older Python-inspired form.  This function
	 * works on both kinds of generators.
	 *
	 * Decorates a generator function such that:
	 *  - it may yield promises
	 *  - execution will continue when that promise is fulfilled
	 *  - the value of the yield expression will be the fulfilled value
	 *  - it returns a promise for the return value (when the generator
	 *    stops iterating)
	 *  - the decorated function returns a promise for the return value
	 *    of the generator or the first rejected promise among those
	 *    yielded.
	 *  - if an error is thrown in the generator, it propagates through
	 *    every following yield until it is caught, or until it escapes
	 *    the generator function altogether, and is translated into a
	 *    rejection for the promise returned by the decorated generator.
	 */
	Q.async = async;
	function async(makeGenerator) {
	    return function () {
	        // when verb is "send", arg is a value
	        // when verb is "throw", arg is an exception
	        function continuer(verb, arg) {
	            var result;

	            // Until V8 3.19 / Chromium 29 is released, SpiderMonkey is the only
	            // engine that has a deployed base of browsers that support generators.
	            // However, SM's generators use the Python-inspired semantics of
	            // outdated ES6 drafts.  We would like to support ES6, but we'd also
	            // like to make it possible to use generators in deployed browsers, so
	            // we also support Python-style generators.  At some point we can remove
	            // this block.

	            if (typeof StopIteration === "undefined") {
	                // ES6 Generators
	                try {
	                    result = generator[verb](arg);
	                } catch (exception) {
	                    return reject(exception);
	                }
	                if (result.done) {
	                    return Q(result.value);
	                } else {
	                    return when(result.value, callback, errback);
	                }
	            } else {
	                // SpiderMonkey Generators
	                // FIXME: Remove this case when SM does ES6 generators.
	                try {
	                    result = generator[verb](arg);
	                } catch (exception) {
	                    if (isStopIteration(exception)) {
	                        return Q(exception.value);
	                    } else {
	                        return reject(exception);
	                    }
	                }
	                return when(result, callback, errback);
	            }
	        }
	        var generator = makeGenerator.apply(this, arguments);
	        var callback = continuer.bind(continuer, "next");
	        var errback = continuer.bind(continuer, "throw");
	        return callback();
	    };
	}

	/**
	 * The spawn function is a small wrapper around async that immediately
	 * calls the generator and also ends the promise chain, so that any
	 * unhandled errors are thrown instead of forwarded to the error
	 * handler. This is useful because it's extremely common to run
	 * generators at the top-level to work with libraries.
	 */
	Q.spawn = spawn;
	function spawn(makeGenerator) {
	    Q.done(Q.async(makeGenerator)());
	}

	// FIXME: Remove this interface once ES6 generators are in SpiderMonkey.
	/**
	 * Throws a ReturnValue exception to stop an asynchronous generator.
	 *
	 * This interface is a stop-gap measure to support generator return
	 * values in older Firefox/SpiderMonkey.  In browsers that support ES6
	 * generators like Chromium 29, just use "return" in your generator
	 * functions.
	 *
	 * @param value the return value for the surrounding generator
	 * @throws ReturnValue exception with the value.
	 * @example
	 * // ES6 style
	 * Q.async(function* () {
	 *      var foo = yield getFooPromise();
	 *      var bar = yield getBarPromise();
	 *      return foo + bar;
	 * })
	 * // Older SpiderMonkey style
	 * Q.async(function () {
	 *      var foo = yield getFooPromise();
	 *      var bar = yield getBarPromise();
	 *      Q.return(foo + bar);
	 * })
	 */
	Q["return"] = _return;
	function _return(value) {
	    throw new QReturnValue(value);
	}

	/**
	 * The promised function decorator ensures that any promise arguments
	 * are settled and passed as values (`this` is also settled and passed
	 * as a value).  It will also ensure that the result of a function is
	 * always a promise.
	 *
	 * @example
	 * var add = Q.promised(function (a, b) {
	 *     return a + b;
	 * });
	 * add(Q(a), Q(B));
	 *
	 * @param {function} callback The function to decorate
	 * @returns {function} a function that has been decorated.
	 */
	Q.promised = promised;
	function promised(callback) {
	    return function () {
	        return spread([this, all(arguments)], function (self, args) {
	            return callback.apply(self, args);
	        });
	    };
	}

	/**
	 * sends a message to a value in a future turn
	 * @param object* the recipient
	 * @param op the name of the message operation, e.g., "when",
	 * @param args further arguments to be forwarded to the operation
	 * @returns result {Promise} a promise for the result of the operation
	 */
	Q.dispatch = dispatch;
	function dispatch(object, op, args) {
	    return Q(object).dispatch(op, args);
	}

	Promise.prototype.dispatch = function (op, args) {
	    var self = this;
	    var deferred = defer();
	    Q.nextTick(function () {
	        self.promiseDispatch(deferred.resolve, op, args);
	    });
	    return deferred.promise;
	};

	/**
	 * Gets the value of a property in a future turn.
	 * @param object    promise or immediate reference for target object
	 * @param name      name of property to get
	 * @return promise for the property value
	 */
	Q.get = function (object, key) {
	    return Q(object).dispatch("get", [key]);
	};

	Promise.prototype.get = function (key) {
	    return this.dispatch("get", [key]);
	};

	/**
	 * Sets the value of a property in a future turn.
	 * @param object    promise or immediate reference for object object
	 * @param name      name of property to set
	 * @param value     new value of property
	 * @return promise for the return value
	 */
	Q.set = function (object, key, value) {
	    return Q(object).dispatch("set", [key, value]);
	};

	Promise.prototype.set = function (key, value) {
	    return this.dispatch("set", [key, value]);
	};

	/**
	 * Deletes a property in a future turn.
	 * @param object    promise or immediate reference for target object
	 * @param name      name of property to delete
	 * @return promise for the return value
	 */
	Q.del = // XXX legacy
	Q["delete"] = function (object, key) {
	    return Q(object).dispatch("delete", [key]);
	};

	Promise.prototype.del = // XXX legacy
	Promise.prototype["delete"] = function (key) {
	    return this.dispatch("delete", [key]);
	};

	/**
	 * Invokes a method in a future turn.
	 * @param object    promise or immediate reference for target object
	 * @param name      name of method to invoke
	 * @param value     a value to post, typically an array of
	 *                  invocation arguments for promises that
	 *                  are ultimately backed with `resolve` values,
	 *                  as opposed to those backed with URLs
	 *                  wherein the posted value can be any
	 *                  JSON serializable object.
	 * @return promise for the return value
	 */
	// bound locally because it is used by other methods
	Q.mapply = // XXX As proposed by "Redsandro"
	Q.post = function (object, name, args) {
	    return Q(object).dispatch("post", [name, args]);
	};

	Promise.prototype.mapply = // XXX As proposed by "Redsandro"
	Promise.prototype.post = function (name, args) {
	    return this.dispatch("post", [name, args]);
	};

	/**
	 * Invokes a method in a future turn.
	 * @param object    promise or immediate reference for target object
	 * @param name      name of method to invoke
	 * @param ...args   array of invocation arguments
	 * @return promise for the return value
	 */
	Q.send = // XXX Mark Miller's proposed parlance
	Q.mcall = // XXX As proposed by "Redsandro"
	Q.invoke = function (object, name /*...args*/) {
	    return Q(object).dispatch("post", [name, array_slice(arguments, 2)]);
	};

	Promise.prototype.send = // XXX Mark Miller's proposed parlance
	Promise.prototype.mcall = // XXX As proposed by "Redsandro"
	Promise.prototype.invoke = function (name /*...args*/) {
	    return this.dispatch("post", [name, array_slice(arguments, 1)]);
	};

	/**
	 * Applies the promised function in a future turn.
	 * @param object    promise or immediate reference for target function
	 * @param args      array of application arguments
	 */
	Q.fapply = function (object, args) {
	    return Q(object).dispatch("apply", [void 0, args]);
	};

	Promise.prototype.fapply = function (args) {
	    return this.dispatch("apply", [void 0, args]);
	};

	/**
	 * Calls the promised function in a future turn.
	 * @param object    promise or immediate reference for target function
	 * @param ...args   array of application arguments
	 */
	Q["try"] =
	Q.fcall = function (object /* ...args*/) {
	    return Q(object).dispatch("apply", [void 0, array_slice(arguments, 1)]);
	};

	Promise.prototype.fcall = function (/*...args*/) {
	    return this.dispatch("apply", [void 0, array_slice(arguments)]);
	};

	/**
	 * Binds the promised function, transforming return values into a fulfilled
	 * promise and thrown errors into a rejected one.
	 * @param object    promise or immediate reference for target function
	 * @param ...args   array of application arguments
	 */
	Q.fbind = function (object /*...args*/) {
	    var promise = Q(object);
	    var args = array_slice(arguments, 1);
	    return function fbound() {
	        return promise.dispatch("apply", [
	            this,
	            args.concat(array_slice(arguments))
	        ]);
	    };
	};
	Promise.prototype.fbind = function (/*...args*/) {
	    var promise = this;
	    var args = array_slice(arguments);
	    return function fbound() {
	        return promise.dispatch("apply", [
	            this,
	            args.concat(array_slice(arguments))
	        ]);
	    };
	};

	/**
	 * Requests the names of the owned properties of a promised
	 * object in a future turn.
	 * @param object    promise or immediate reference for target object
	 * @return promise for the keys of the eventually settled object
	 */
	Q.keys = function (object) {
	    return Q(object).dispatch("keys", []);
	};

	Promise.prototype.keys = function () {
	    return this.dispatch("keys", []);
	};

	/**
	 * Turns an array of promises into a promise for an array.  If any of
	 * the promises gets rejected, the whole array is rejected immediately.
	 * @param {Array*} an array (or promise for an array) of values (or
	 * promises for values)
	 * @returns a promise for an array of the corresponding values
	 */
	// By Mark Miller
	// http://wiki.ecmascript.org/doku.php?id=strawman:concurrency&rev=1308776521#allfulfilled
	Q.all = all;
	function all(promises) {
	    return when(promises, function (promises) {
	        var pendingCount = 0;
	        var deferred = defer();
	        array_reduce(promises, function (undefined, promise, index) {
	            var snapshot;
	            if (
	                isPromise(promise) &&
	                (snapshot = promise.inspect()).state === "fulfilled"
	            ) {
	                promises[index] = snapshot.value;
	            } else {
	                ++pendingCount;
	                when(
	                    promise,
	                    function (value) {
	                        promises[index] = value;
	                        if (--pendingCount === 0) {
	                            deferred.resolve(promises);
	                        }
	                    },
	                    deferred.reject,
	                    function (progress) {
	                        deferred.notify({ index: index, value: progress });
	                    }
	                );
	            }
	        }, void 0);
	        if (pendingCount === 0) {
	            deferred.resolve(promises);
	        }
	        return deferred.promise;
	    });
	}

	Promise.prototype.all = function () {
	    return all(this);
	};

	/**
	 * Returns the first resolved promise of an array. Prior rejected promises are
	 * ignored.  Rejects only if all promises are rejected.
	 * @param {Array*} an array containing values or promises for values
	 * @returns a promise fulfilled with the value of the first resolved promise,
	 * or a rejected promise if all promises are rejected.
	 */
	Q.any = any;

	function any(promises) {
	    if (promises.length === 0) {
	        return Q.resolve();
	    }

	    var deferred = Q.defer();
	    var pendingCount = 0;
	    array_reduce(promises, function (prev, current, index) {
	        var promise = promises[index];

	        pendingCount++;

	        when(promise, onFulfilled, onRejected, onProgress);
	        function onFulfilled(result) {
	            deferred.resolve(result);
	        }
	        function onRejected() {
	            pendingCount--;
	            if (pendingCount === 0) {
	                deferred.reject(new Error(
	                    "Can't get fulfillment value from any promise, all " +
	                    "promises were rejected."
	                ));
	            }
	        }
	        function onProgress(progress) {
	            deferred.notify({
	                index: index,
	                value: progress
	            });
	        }
	    }, undefined);

	    return deferred.promise;
	}

	Promise.prototype.any = function () {
	    return any(this);
	};

	/**
	 * Waits for all promises to be settled, either fulfilled or
	 * rejected.  This is distinct from `all` since that would stop
	 * waiting at the first rejection.  The promise returned by
	 * `allResolved` will never be rejected.
	 * @param promises a promise for an array (or an array) of promises
	 * (or values)
	 * @return a promise for an array of promises
	 */
	Q.allResolved = deprecate(allResolved, "allResolved", "allSettled");
	function allResolved(promises) {
	    return when(promises, function (promises) {
	        promises = array_map(promises, Q);
	        return when(all(array_map(promises, function (promise) {
	            return when(promise, noop, noop);
	        })), function () {
	            return promises;
	        });
	    });
	}

	Promise.prototype.allResolved = function () {
	    return allResolved(this);
	};

	/**
	 * @see Promise#allSettled
	 */
	Q.allSettled = allSettled;
	function allSettled(promises) {
	    return Q(promises).allSettled();
	}

	/**
	 * Turns an array of promises into a promise for an array of their states (as
	 * returned by `inspect`) when they have all settled.
	 * @param {Array[Any*]} values an array (or promise for an array) of values (or
	 * promises for values)
	 * @returns {Array[State]} an array of states for the respective values.
	 */
	Promise.prototype.allSettled = function () {
	    return this.then(function (promises) {
	        return all(array_map(promises, function (promise) {
	            promise = Q(promise);
	            function regardless() {
	                return promise.inspect();
	            }
	            return promise.then(regardless, regardless);
	        }));
	    });
	};

	/**
	 * Captures the failure of a promise, giving an oportunity to recover
	 * with a callback.  If the given promise is fulfilled, the returned
	 * promise is fulfilled.
	 * @param {Any*} promise for something
	 * @param {Function} callback to fulfill the returned promise if the
	 * given promise is rejected
	 * @returns a promise for the return value of the callback
	 */
	Q.fail = // XXX legacy
	Q["catch"] = function (object, rejected) {
	    return Q(object).then(void 0, rejected);
	};

	Promise.prototype.fail = // XXX legacy
	Promise.prototype["catch"] = function (rejected) {
	    return this.then(void 0, rejected);
	};

	/**
	 * Attaches a listener that can respond to progress notifications from a
	 * promise's originating deferred. This listener receives the exact arguments
	 * passed to ``deferred.notify``.
	 * @param {Any*} promise for something
	 * @param {Function} callback to receive any progress notifications
	 * @returns the given promise, unchanged
	 */
	Q.progress = progress;
	function progress(object, progressed) {
	    return Q(object).then(void 0, void 0, progressed);
	}

	Promise.prototype.progress = function (progressed) {
	    return this.then(void 0, void 0, progressed);
	};

	/**
	 * Provides an opportunity to observe the settling of a promise,
	 * regardless of whether the promise is fulfilled or rejected.  Forwards
	 * the resolution to the returned promise when the callback is done.
	 * The callback can return a promise to defer completion.
	 * @param {Any*} promise
	 * @param {Function} callback to observe the resolution of the given
	 * promise, takes no arguments.
	 * @returns a promise for the resolution of the given promise when
	 * ``fin`` is done.
	 */
	Q.fin = // XXX legacy
	Q["finally"] = function (object, callback) {
	    return Q(object)["finally"](callback);
	};

	Promise.prototype.fin = // XXX legacy
	Promise.prototype["finally"] = function (callback) {
	    callback = Q(callback);
	    return this.then(function (value) {
	        return callback.fcall().then(function () {
	            return value;
	        });
	    }, function (reason) {
	        // TODO attempt to recycle the rejection with "this".
	        return callback.fcall().then(function () {
	            throw reason;
	        });
	    });
	};

	/**
	 * Terminates a chain of promises, forcing rejections to be
	 * thrown as exceptions.
	 * @param {Any*} promise at the end of a chain of promises
	 * @returns nothing
	 */
	Q.done = function (object, fulfilled, rejected, progress) {
	    return Q(object).done(fulfilled, rejected, progress);
	};

	Promise.prototype.done = function (fulfilled, rejected, progress) {
	    var onUnhandledError = function (error) {
	        // forward to a future turn so that ``when``
	        // does not catch it and turn it into a rejection.
	        Q.nextTick(function () {
	            makeStackTraceLong(error, promise);
	            if (Q.onerror) {
	                Q.onerror(error);
	            } else {
	                throw error;
	            }
	        });
	    };

	    // Avoid unnecessary `nextTick`ing via an unnecessary `when`.
	    var promise = fulfilled || rejected || progress ?
	        this.then(fulfilled, rejected, progress) :
	        this;

	    if (typeof process === "object" && process && process.domain) {
	        onUnhandledError = process.domain.bind(onUnhandledError);
	    }

	    promise.then(void 0, onUnhandledError);
	};

	/**
	 * Causes a promise to be rejected if it does not get fulfilled before
	 * some milliseconds time out.
	 * @param {Any*} promise
	 * @param {Number} milliseconds timeout
	 * @param {Any*} custom error message or Error object (optional)
	 * @returns a promise for the resolution of the given promise if it is
	 * fulfilled before the timeout, otherwise rejected.
	 */
	Q.timeout = function (object, ms, error) {
	    return Q(object).timeout(ms, error);
	};

	Promise.prototype.timeout = function (ms, error) {
	    var deferred = defer();
	    var timeoutId = setTimeout(function () {
	        if (!error || "string" === typeof error) {
	            error = new Error(error || "Timed out after " + ms + " ms");
	            error.code = "ETIMEDOUT";
	        }
	        deferred.reject(error);
	    }, ms);

	    this.then(function (value) {
	        clearTimeout(timeoutId);
	        deferred.resolve(value);
	    }, function (exception) {
	        clearTimeout(timeoutId);
	        deferred.reject(exception);
	    }, deferred.notify);

	    return deferred.promise;
	};

	/**
	 * Returns a promise for the given value (or promised value), some
	 * milliseconds after it resolved. Passes rejections immediately.
	 * @param {Any*} promise
	 * @param {Number} milliseconds
	 * @returns a promise for the resolution of the given promise after milliseconds
	 * time has elapsed since the resolution of the given promise.
	 * If the given promise rejects, that is passed immediately.
	 */
	Q.delay = function (object, timeout) {
	    if (timeout === void 0) {
	        timeout = object;
	        object = void 0;
	    }
	    return Q(object).delay(timeout);
	};

	Promise.prototype.delay = function (timeout) {
	    return this.then(function (value) {
	        var deferred = defer();
	        setTimeout(function () {
	            deferred.resolve(value);
	        }, timeout);
	        return deferred.promise;
	    });
	};

	/**
	 * Passes a continuation to a Node function, which is called with the given
	 * arguments provided as an array, and returns a promise.
	 *
	 *      Q.nfapply(FS.readFile, [__filename])
	 *      .then(function (content) {
	 *      })
	 *
	 */
	Q.nfapply = function (callback, args) {
	    return Q(callback).nfapply(args);
	};

	Promise.prototype.nfapply = function (args) {
	    var deferred = defer();
	    var nodeArgs = array_slice(args);
	    nodeArgs.push(deferred.makeNodeResolver());
	    this.fapply(nodeArgs).fail(deferred.reject);
	    return deferred.promise;
	};

	/**
	 * Passes a continuation to a Node function, which is called with the given
	 * arguments provided individually, and returns a promise.
	 * @example
	 * Q.nfcall(FS.readFile, __filename)
	 * .then(function (content) {
	 * })
	 *
	 */
	Q.nfcall = function (callback /*...args*/) {
	    var args = array_slice(arguments, 1);
	    return Q(callback).nfapply(args);
	};

	Promise.prototype.nfcall = function (/*...args*/) {
	    var nodeArgs = array_slice(arguments);
	    var deferred = defer();
	    nodeArgs.push(deferred.makeNodeResolver());
	    this.fapply(nodeArgs).fail(deferred.reject);
	    return deferred.promise;
	};

	/**
	 * Wraps a NodeJS continuation passing function and returns an equivalent
	 * version that returns a promise.
	 * @example
	 * Q.nfbind(FS.readFile, __filename)("utf-8")
	 * .then(console.log)
	 * .done()
	 */
	Q.nfbind =
	Q.denodeify = function (callback /*...args*/) {
	    var baseArgs = array_slice(arguments, 1);
	    return function () {
	        var nodeArgs = baseArgs.concat(array_slice(arguments));
	        var deferred = defer();
	        nodeArgs.push(deferred.makeNodeResolver());
	        Q(callback).fapply(nodeArgs).fail(deferred.reject);
	        return deferred.promise;
	    };
	};

	Promise.prototype.nfbind =
	Promise.prototype.denodeify = function (/*...args*/) {
	    var args = array_slice(arguments);
	    args.unshift(this);
	    return Q.denodeify.apply(void 0, args);
	};

	Q.nbind = function (callback, thisp /*...args*/) {
	    var baseArgs = array_slice(arguments, 2);
	    return function () {
	        var nodeArgs = baseArgs.concat(array_slice(arguments));
	        var deferred = defer();
	        nodeArgs.push(deferred.makeNodeResolver());
	        function bound() {
	            return callback.apply(thisp, arguments);
	        }
	        Q(bound).fapply(nodeArgs).fail(deferred.reject);
	        return deferred.promise;
	    };
	};

	Promise.prototype.nbind = function (/*thisp, ...args*/) {
	    var args = array_slice(arguments, 0);
	    args.unshift(this);
	    return Q.nbind.apply(void 0, args);
	};

	/**
	 * Calls a method of a Node-style object that accepts a Node-style
	 * callback with a given array of arguments, plus a provided callback.
	 * @param object an object that has the named method
	 * @param {String} name name of the method of object
	 * @param {Array} args arguments to pass to the method; the callback
	 * will be provided by Q and appended to these arguments.
	 * @returns a promise for the value or error
	 */
	Q.nmapply = // XXX As proposed by "Redsandro"
	Q.npost = function (object, name, args) {
	    return Q(object).npost(name, args);
	};

	Promise.prototype.nmapply = // XXX As proposed by "Redsandro"
	Promise.prototype.npost = function (name, args) {
	    var nodeArgs = array_slice(args || []);
	    var deferred = defer();
	    nodeArgs.push(deferred.makeNodeResolver());
	    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
	    return deferred.promise;
	};

	/**
	 * Calls a method of a Node-style object that accepts a Node-style
	 * callback, forwarding the given variadic arguments, plus a provided
	 * callback argument.
	 * @param object an object that has the named method
	 * @param {String} name name of the method of object
	 * @param ...args arguments to pass to the method; the callback will
	 * be provided by Q and appended to these arguments.
	 * @returns a promise for the value or error
	 */
	Q.nsend = // XXX Based on Mark Miller's proposed "send"
	Q.nmcall = // XXX Based on "Redsandro's" proposal
	Q.ninvoke = function (object, name /*...args*/) {
	    var nodeArgs = array_slice(arguments, 2);
	    var deferred = defer();
	    nodeArgs.push(deferred.makeNodeResolver());
	    Q(object).dispatch("post", [name, nodeArgs]).fail(deferred.reject);
	    return deferred.promise;
	};

	Promise.prototype.nsend = // XXX Based on Mark Miller's proposed "send"
	Promise.prototype.nmcall = // XXX Based on "Redsandro's" proposal
	Promise.prototype.ninvoke = function (name /*...args*/) {
	    var nodeArgs = array_slice(arguments, 1);
	    var deferred = defer();
	    nodeArgs.push(deferred.makeNodeResolver());
	    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
	    return deferred.promise;
	};

	/**
	 * If a function would like to support both Node continuation-passing-style and
	 * promise-returning-style, it can end its internal promise chain with
	 * `nodeify(nodeback)`, forwarding the optional nodeback argument.  If the user
	 * elects to use a nodeback, the result will be sent there.  If they do not
	 * pass a nodeback, they will receive the result promise.
	 * @param object a result (or a promise for a result)
	 * @param {Function} nodeback a Node.js-style callback
	 * @returns either the promise or nothing
	 */
	Q.nodeify = nodeify;
	function nodeify(object, nodeback) {
	    return Q(object).nodeify(nodeback);
	}

	Promise.prototype.nodeify = function (nodeback) {
	    if (nodeback) {
	        this.then(function (value) {
	            Q.nextTick(function () {
	                nodeback(null, value);
	            });
	        }, function (error) {
	            Q.nextTick(function () {
	                nodeback(error);
	            });
	        });
	    } else {
	        return this;
	    }
	};

	Q.noConflict = function() {
	    throw new Error("Q.noConflict only works when Q is used as a global");
	};

	// All code before this point will be filtered from stack traces.
	var qEndingLine = captureLine();

	return Q;

	});

	}).call(this,require('_process'))
	},{"_process":3}],2:[function(require,module,exports){
	/*!
	 * EventEmitter2
	 * https://github.com/hij1nx/EventEmitter2
	 *
	 * Copyright (c) 2013 hij1nx
	 * Licensed under the MIT license.
	 */
	;!function(undefined) {

	  var isArray = Array.isArray ? Array.isArray : function _isArray(obj) {
	    return Object.prototype.toString.call(obj) === "[object Array]";
	  };
	  var defaultMaxListeners = 10;

	  function init() {
	    this._events = {};
	    if (this._conf) {
	      configure.call(this, this._conf);
	    }
	  }

	  function configure(conf) {
	    if (conf) {

	      this._conf = conf;

	      conf.delimiter && (this.delimiter = conf.delimiter);
	      conf.maxListeners && (this._events.maxListeners = conf.maxListeners);
	      conf.wildcard && (this.wildcard = conf.wildcard);
	      conf.newListener && (this.newListener = conf.newListener);

	      if (this.wildcard) {
	        this.listenerTree = {};
	      }
	    }
	  }

	  function EventEmitter(conf) {
	    this._events = {};
	    this.newListener = false;
	    configure.call(this, conf);
	  }

	  //
	  // Attention, function return type now is array, always !
	  // It has zero elements if no any matches found and one or more
	  // elements (leafs) if there are matches
	  //
	  function searchListenerTree(handlers, type, tree, i) {
	    if (!tree) {
	      return [];
	    }
	    var listeners=[], leaf, len, branch, xTree, xxTree, isolatedBranch, endReached,
	        typeLength = type.length, currentType = type[i], nextType = type[i+1];
	    if (i === typeLength && tree._listeners) {
	      //
	      // If at the end of the event(s) list and the tree has listeners
	      // invoke those listeners.
	      //
	      if (typeof tree._listeners === 'function') {
	        handlers && handlers.push(tree._listeners);
	        return [tree];
	      } else {
	        for (leaf = 0, len = tree._listeners.length; leaf < len; leaf++) {
	          handlers && handlers.push(tree._listeners[leaf]);
	        }
	        return [tree];
	      }
	    }

	    if ((currentType === '*' || currentType === '**') || tree[currentType]) {
	      //
	      // If the event emitted is '*' at this part
	      // or there is a concrete match at this patch
	      //
	      if (currentType === '*') {
	        for (branch in tree) {
	          if (branch !== '_listeners' && tree.hasOwnProperty(branch)) {
	            listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i+1));
	          }
	        }
	        return listeners;
	      } else if(currentType === '**') {
	        endReached = (i+1 === typeLength || (i+2 === typeLength && nextType === '*'));
	        if(endReached && tree._listeners) {
	          // The next element has a _listeners, add it to the handlers.
	          listeners = listeners.concat(searchListenerTree(handlers, type, tree, typeLength));
	        }

	        for (branch in tree) {
	          if (branch !== '_listeners' && tree.hasOwnProperty(branch)) {
	            if(branch === '*' || branch === '**') {
	              if(tree[branch]._listeners && !endReached) {
	                listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], typeLength));
	              }
	              listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i));
	            } else if(branch === nextType) {
	              listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i+2));
	            } else {
	              // No match on this one, shift into the tree but not in the type array.
	              listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i));
	            }
	          }
	        }
	        return listeners;
	      }

	      listeners = listeners.concat(searchListenerTree(handlers, type, tree[currentType], i+1));
	    }

	    xTree = tree['*'];
	    if (xTree) {
	      //
	      // If the listener tree will allow any match for this part,
	      // then recursively explore all branches of the tree
	      //
	      searchListenerTree(handlers, type, xTree, i+1);
	    }

	    xxTree = tree['**'];
	    if(xxTree) {
	      if(i < typeLength) {
	        if(xxTree._listeners) {
	          // If we have a listener on a '**', it will catch all, so add its handler.
	          searchListenerTree(handlers, type, xxTree, typeLength);
	        }

	        // Build arrays of matching next branches and others.
	        for(branch in xxTree) {
	          if(branch !== '_listeners' && xxTree.hasOwnProperty(branch)) {
	            if(branch === nextType) {
	              // We know the next element will match, so jump twice.
	              searchListenerTree(handlers, type, xxTree[branch], i+2);
	            } else if(branch === currentType) {
	              // Current node matches, move into the tree.
	              searchListenerTree(handlers, type, xxTree[branch], i+1);
	            } else {
	              isolatedBranch = {};
	              isolatedBranch[branch] = xxTree[branch];
	              searchListenerTree(handlers, type, { '**': isolatedBranch }, i+1);
	            }
	          }
	        }
	      } else if(xxTree._listeners) {
	        // We have reached the end and still on a '**'
	        searchListenerTree(handlers, type, xxTree, typeLength);
	      } else if(xxTree['*'] && xxTree['*']._listeners) {
	        searchListenerTree(handlers, type, xxTree['*'], typeLength);
	      }
	    }

	    return listeners;
	  }

	  function growListenerTree(type, listener) {

	    type = typeof type === 'string' ? type.split(this.delimiter) : type.slice();

	    //
	    // Looks for two consecutive '**', if so, don't add the event at all.
	    //
	    for(var i = 0, len = type.length; i+1 < len; i++) {
	      if(type[i] === '**' && type[i+1] === '**') {
	        return;
	      }
	    }

	    var tree = this.listenerTree;
	    var name = type.shift();

	    while (name) {

	      if (!tree[name]) {
	        tree[name] = {};
	      }

	      tree = tree[name];

	      if (type.length === 0) {

	        if (!tree._listeners) {
	          tree._listeners = listener;
	        }
	        else if(typeof tree._listeners === 'function') {
	          tree._listeners = [tree._listeners, listener];
	        }
	        else if (isArray(tree._listeners)) {

	          tree._listeners.push(listener);

	          if (!tree._listeners.warned) {

	            var m = defaultMaxListeners;

	            if (typeof this._events.maxListeners !== 'undefined') {
	              m = this._events.maxListeners;
	            }

	            if (m > 0 && tree._listeners.length > m) {

	              tree._listeners.warned = true;
	              console.error('(node) warning: possible EventEmitter memory ' +
	                            'leak detected. %d listeners added. ' +
	                            'Use emitter.setMaxListeners() to increase limit.',
	                            tree._listeners.length);
	              console.trace();
	            }
	          }
	        }
	        return true;
	      }
	      name = type.shift();
	    }
	    return true;
	  }

	  // By default EventEmitters will print a warning if more than
	  // 10 listeners are added to it. This is a useful default which
	  // helps finding memory leaks.
	  //
	  // Obviously not all Emitters should be limited to 10. This function allows
	  // that to be increased. Set to zero for unlimited.

	  EventEmitter.prototype.delimiter = '.';

	  EventEmitter.prototype.setMaxListeners = function(n) {
	    this._events || init.call(this);
	    this._events.maxListeners = n;
	    if (!this._conf) this._conf = {};
	    this._conf.maxListeners = n;
	  };

	  EventEmitter.prototype.event = '';

	  EventEmitter.prototype.once = function(event, fn) {
	    this.many(event, 1, fn);
	    return this;
	  };

	  EventEmitter.prototype.many = function(event, ttl, fn) {
	    var self = this;

	    if (typeof fn !== 'function') {
	      throw new Error('many only accepts instances of Function');
	    }

	    function listener() {
	      if (--ttl === 0) {
	        self.off(event, listener);
	      }
	      fn.apply(this, arguments);
	    }

	    listener._origin = fn;

	    this.on(event, listener);

	    return self;
	  };

	  EventEmitter.prototype.emit = function() {

	    this._events || init.call(this);

	    var type = arguments[0];

	    if (type === 'newListener' && !this.newListener) {
	      if (!this._events.newListener) { return false; }
	    }

	    // Loop through the *_all* functions and invoke them.
	    if (this._all) {
	      var l = arguments.length;
	      var args = new Array(l - 1);
	      for (var i = 1; i < l; i++) args[i - 1] = arguments[i];
	      for (i = 0, l = this._all.length; i < l; i++) {
	        this.event = type;
	        this._all[i].apply(this, args);
	      }
	    }

	    // If there is no 'error' event listener then throw.
	    if (type === 'error') {

	      if (!this._all &&
	        !this._events.error &&
	        !(this.wildcard && this.listenerTree.error)) {

	        if (arguments[1] instanceof Error) {
	          throw arguments[1]; // Unhandled 'error' event
	        } else {
	          throw new Error("Uncaught, unspecified 'error' event.");
	        }
	        return false;
	      }
	    }

	    var handler;

	    if(this.wildcard) {
	      handler = [];
	      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
	      searchListenerTree.call(this, handler, ns, this.listenerTree, 0);
	    }
	    else {
	      handler = this._events[type];
	    }

	    if (typeof handler === 'function') {
	      this.event = type;
	      if (arguments.length === 1) {
	        handler.call(this);
	      }
	      else if (arguments.length > 1)
	        switch (arguments.length) {
	          case 2:
	            handler.call(this, arguments[1]);
	            break;
	          case 3:
	            handler.call(this, arguments[1], arguments[2]);
	            break;
	          // slower
	          default:
	            var l = arguments.length;
	            var args = new Array(l - 1);
	            for (var i = 1; i < l; i++) args[i - 1] = arguments[i];
	            handler.apply(this, args);
	        }
	      return true;
	    }
	    else if (handler) {
	      var l = arguments.length;
	      var args = new Array(l - 1);
	      for (var i = 1; i < l; i++) args[i - 1] = arguments[i];

	      var listeners = handler.slice();
	      for (var i = 0, l = listeners.length; i < l; i++) {
	        this.event = type;
	        listeners[i].apply(this, args);
	      }
	      return (listeners.length > 0) || !!this._all;
	    }
	    else {
	      return !!this._all;
	    }

	  };

	  EventEmitter.prototype.on = function(type, listener) {

	    if (typeof type === 'function') {
	      this.onAny(type);
	      return this;
	    }

	    if (typeof listener !== 'function') {
	      throw new Error('on only accepts instances of Function');
	    }
	    this._events || init.call(this);

	    // To avoid recursion in the case that type == "newListeners"! Before
	    // adding it to the listeners, first emit "newListeners".
	    this.emit('newListener', type, listener);

	    if(this.wildcard) {
	      growListenerTree.call(this, type, listener);
	      return this;
	    }

	    if (!this._events[type]) {
	      // Optimize the case of one listener. Don't need the extra array object.
	      this._events[type] = listener;
	    }
	    else if(typeof this._events[type] === 'function') {
	      // Adding the second element, need to change to array.
	      this._events[type] = [this._events[type], listener];
	    }
	    else if (isArray(this._events[type])) {
	      // If we've already got an array, just append.
	      this._events[type].push(listener);

	      // Check for listener leak
	      if (!this._events[type].warned) {

	        var m = defaultMaxListeners;

	        if (typeof this._events.maxListeners !== 'undefined') {
	          m = this._events.maxListeners;
	        }

	        if (m > 0 && this._events[type].length > m) {

	          this._events[type].warned = true;
	          console.error('(node) warning: possible EventEmitter memory ' +
	                        'leak detected. %d listeners added. ' +
	                        'Use emitter.setMaxListeners() to increase limit.',
	                        this._events[type].length);
	          console.trace();
	        }
	      }
	    }
	    return this;
	  };

	  EventEmitter.prototype.onAny = function(fn) {

	    if (typeof fn !== 'function') {
	      throw new Error('onAny only accepts instances of Function');
	    }

	    if(!this._all) {
	      this._all = [];
	    }

	    // Add the function to the event listener collection.
	    this._all.push(fn);
	    return this;
	  };

	  EventEmitter.prototype.addListener = EventEmitter.prototype.on;

	  EventEmitter.prototype.off = function(type, listener) {
	    if (typeof listener !== 'function') {
	      throw new Error('removeListener only takes instances of Function');
	    }

	    var handlers,leafs=[];

	    if(this.wildcard) {
	      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
	      leafs = searchListenerTree.call(this, null, ns, this.listenerTree, 0);
	    }
	    else {
	      // does not use listeners(), so no side effect of creating _events[type]
	      if (!this._events[type]) return this;
	      handlers = this._events[type];
	      leafs.push({_listeners:handlers});
	    }

	    for (var iLeaf=0; iLeaf<leafs.length; iLeaf++) {
	      var leaf = leafs[iLeaf];
	      handlers = leaf._listeners;
	      if (isArray(handlers)) {

	        var position = -1;

	        for (var i = 0, length = handlers.length; i < length; i++) {
	          if (handlers[i] === listener ||
	            (handlers[i].listener && handlers[i].listener === listener) ||
	            (handlers[i]._origin && handlers[i]._origin === listener)) {
	            position = i;
	            break;
	          }
	        }

	        if (position < 0) {
	          continue;
	        }

	        if(this.wildcard) {
	          leaf._listeners.splice(position, 1);
	        }
	        else {
	          this._events[type].splice(position, 1);
	        }

	        if (handlers.length === 0) {
	          if(this.wildcard) {
	            delete leaf._listeners;
	          }
	          else {
	            delete this._events[type];
	          }
	        }
	        return this;
	      }
	      else if (handlers === listener ||
	        (handlers.listener && handlers.listener === listener) ||
	        (handlers._origin && handlers._origin === listener)) {
	        if(this.wildcard) {
	          delete leaf._listeners;
	        }
	        else {
	          delete this._events[type];
	        }
	      }
	    }

	    return this;
	  };

	  EventEmitter.prototype.offAny = function(fn) {
	    var i = 0, l = 0, fns;
	    if (fn && this._all && this._all.length > 0) {
	      fns = this._all;
	      for(i = 0, l = fns.length; i < l; i++) {
	        if(fn === fns[i]) {
	          fns.splice(i, 1);
	          return this;
	        }
	      }
	    } else {
	      this._all = [];
	    }
	    return this;
	  };

	  EventEmitter.prototype.removeListener = EventEmitter.prototype.off;

	  EventEmitter.prototype.removeAllListeners = function(type) {
	    if (arguments.length === 0) {
	      !this._events || init.call(this);
	      return this;
	    }

	    if(this.wildcard) {
	      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
	      var leafs = searchListenerTree.call(this, null, ns, this.listenerTree, 0);

	      for (var iLeaf=0; iLeaf<leafs.length; iLeaf++) {
	        var leaf = leafs[iLeaf];
	        leaf._listeners = null;
	      }
	    }
	    else {
	      if (!this._events[type]) return this;
	      this._events[type] = null;
	    }
	    return this;
	  };

	  EventEmitter.prototype.listeners = function(type) {
	    if(this.wildcard) {
	      var handlers = [];
	      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
	      searchListenerTree.call(this, handlers, ns, this.listenerTree, 0);
	      return handlers;
	    }

	    this._events || init.call(this);

	    if (!this._events[type]) this._events[type] = [];
	    if (!isArray(this._events[type])) {
	      this._events[type] = [this._events[type]];
	    }
	    return this._events[type];
	  };

	  EventEmitter.prototype.listenersAny = function() {

	    if(this._all) {
	      return this._all;
	    }
	    else {
	      return [];
	    }

	  };

	  if (typeof define === 'function' && define.amd) {
	     // AMD. Register as an anonymous module.
	    define(function() {
	      return EventEmitter;
	    });
	  } else if (typeof exports === 'object') {
	    // CommonJS
	    exports.EventEmitter2 = EventEmitter;
	  }
	  else {
	    // Browser global.
	    window.EventEmitter2 = EventEmitter;
	  }
	}();

	},{}],3:[function(require,module,exports){
	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };

	},{}],4:[function(require,module,exports){
	module.exports = function (obj) {
	    if (!obj || typeof obj !== 'object') return obj;
	    
	    var copy;
	    
	    if (isArray(obj)) {
	        var len = obj.length;
	        copy = Array(len);
	        for (var i = 0; i < len; i++) {
	            copy[i] = obj[i];
	        }
	    }
	    else {
	        var keys = objectKeys(obj);
	        copy = {};
	        
	        for (var i = 0, l = keys.length; i < l; i++) {
	            var key = keys[i];
	            copy[key] = obj[key];
	        }
	    }
	    return copy;
	};

	var objectKeys = Object.keys || function (obj) {
	    var keys = [];
	    for (var key in obj) {
	        if ({}.hasOwnProperty.call(obj, key)) keys.push(key);
	    }
	    return keys;
	};

	var isArray = Array.isArray || function (xs) {
	    return {}.toString.call(xs) === '[object Array]';
	};

	},{}],5:[function(require,module,exports){
	(function() {
	  'use strict';

	  if (self.fetch) {
	    return
	  }

	  function normalizeName(name) {
	    if (typeof name !== 'string') {
	      name = name.toString();
	    }
	    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
	      throw new TypeError('Invalid character in header field name')
	    }
	    return name.toLowerCase()
	  }

	  function normalizeValue(value) {
	    if (typeof value !== 'string') {
	      value = value.toString();
	    }
	    return value
	  }

	  function Headers(headers) {
	    this.map = {}

	    if (headers instanceof Headers) {
	      headers.forEach(function(value, name) {
	        this.append(name, value)
	      }, this)

	    } else if (headers) {
	      Object.getOwnPropertyNames(headers).forEach(function(name) {
	        this.append(name, headers[name])
	      }, this)
	    }
	  }

	  Headers.prototype.append = function(name, value) {
	    name = normalizeName(name)
	    value = normalizeValue(value)
	    var list = this.map[name]
	    if (!list) {
	      list = []
	      this.map[name] = list
	    }
	    list.push(value)
	  }

	  Headers.prototype['delete'] = function(name) {
	    delete this.map[normalizeName(name)]
	  }

	  Headers.prototype.get = function(name) {
	    var values = this.map[normalizeName(name)]
	    return values ? values[0] : null
	  }

	  Headers.prototype.getAll = function(name) {
	    return this.map[normalizeName(name)] || []
	  }

	  Headers.prototype.has = function(name) {
	    return this.map.hasOwnProperty(normalizeName(name))
	  }

	  Headers.prototype.set = function(name, value) {
	    this.map[normalizeName(name)] = [normalizeValue(value)]
	  }

	  Headers.prototype.forEach = function(callback, thisArg) {
	    Object.getOwnPropertyNames(this.map).forEach(function(name) {
	      this.map[name].forEach(function(value) {
	        callback.call(thisArg, value, name, this)
	      }, this)
	    }, this)
	  }

	  function consumed(body) {
	    if (body.bodyUsed) {
	      return Promise.reject(new TypeError('Already read'))
	    }
	    body.bodyUsed = true
	  }

	  function fileReaderReady(reader) {
	    return new Promise(function(resolve, reject) {
	      reader.onload = function() {
	        resolve(reader.result)
	      }
	      reader.onerror = function() {
	        reject(reader.error)
	      }
	    })
	  }

	  function readBlobAsArrayBuffer(blob) {
	    var reader = new FileReader()
	    reader.readAsArrayBuffer(blob)
	    return fileReaderReady(reader)
	  }

	  function readBlobAsText(blob) {
	    var reader = new FileReader()
	    reader.readAsText(blob)
	    return fileReaderReady(reader)
	  }

	  var support = {
	    blob: 'FileReader' in self && 'Blob' in self && (function() {
	      try {
	        new Blob();
	        return true
	      } catch(e) {
	        return false
	      }
	    })(),
	    formData: 'FormData' in self
	  }

	  function Body() {
	    this.bodyUsed = false


	    this._initBody = function(body) {
	      this._bodyInit = body
	      if (typeof body === 'string') {
	        this._bodyText = body
	      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
	        this._bodyBlob = body
	      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
	        this._bodyFormData = body
	      } else if (!body) {
	        this._bodyText = ''
	      } else {
	        throw new Error('unsupported BodyInit type')
	      }
	    }

	    if (support.blob) {
	      this.blob = function() {
	        var rejected = consumed(this)
	        if (rejected) {
	          return rejected
	        }

	        if (this._bodyBlob) {
	          return Promise.resolve(this._bodyBlob)
	        } else if (this._bodyFormData) {
	          throw new Error('could not read FormData body as blob')
	        } else {
	          return Promise.resolve(new Blob([this._bodyText]))
	        }
	      }

	      this.arrayBuffer = function() {
	        return this.blob().then(readBlobAsArrayBuffer)
	      }

	      this.text = function() {
	        var rejected = consumed(this)
	        if (rejected) {
	          return rejected
	        }

	        if (this._bodyBlob) {
	          return readBlobAsText(this._bodyBlob)
	        } else if (this._bodyFormData) {
	          throw new Error('could not read FormData body as text')
	        } else {
	          return Promise.resolve(this._bodyText)
	        }
	      }
	    } else {
	      this.text = function() {
	        var rejected = consumed(this)
	        return rejected ? rejected : Promise.resolve(this._bodyText)
	      }
	    }

	    if (support.formData) {
	      this.formData = function() {
	        return this.text().then(decode)
	      }
	    }

	    this.json = function() {
	      return this.text().then(JSON.parse)
	    }

	    return this
	  }

	  // HTTP methods whose capitalization should be normalized
	  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

	  function normalizeMethod(method) {
	    var upcased = method.toUpperCase()
	    return (methods.indexOf(upcased) > -1) ? upcased : method
	  }

	  function Request(url, options) {
	    options = options || {}
	    this.url = url

	    this.credentials = options.credentials || 'omit'
	    this.headers = new Headers(options.headers)
	    this.method = normalizeMethod(options.method || 'GET')
	    this.mode = options.mode || null
	    this.referrer = null

	    if ((this.method === 'GET' || this.method === 'HEAD') && options.body) {
	      throw new TypeError('Body not allowed for GET or HEAD requests')
	    }
	    this._initBody(options.body)
	  }

	  function decode(body) {
	    var form = new FormData()
	    body.trim().split('&').forEach(function(bytes) {
	      if (bytes) {
	        var split = bytes.split('=')
	        var name = split.shift().replace(/\+/g, ' ')
	        var value = split.join('=').replace(/\+/g, ' ')
	        form.append(decodeURIComponent(name), decodeURIComponent(value))
	      }
	    })
	    return form
	  }

	  function headers(xhr) {
	    var head = new Headers()
	    var pairs = xhr.getAllResponseHeaders().trim().split('\n')
	    pairs.forEach(function(header) {
	      var split = header.trim().split(':')
	      var key = split.shift().trim()
	      var value = split.join(':').trim()
	      head.append(key, value)
	    })
	    return head
	  }

	  Body.call(Request.prototype)

	  function Response(bodyInit, options) {
	    if (!options) {
	      options = {}
	    }

	    this._initBody(bodyInit)
	    this.type = 'default'
	    this.url = null
	    this.status = options.status
	    this.ok = this.status >= 200 && this.status < 300
	    this.statusText = options.statusText
	    this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers)
	    this.url = options.url || ''
	  }

	  Body.call(Response.prototype)

	  self.Headers = Headers;
	  self.Request = Request;
	  self.Response = Response;

	  self.fetch = function(input, init) {
	    // TODO: Request constructor should accept input, init
	    var request
	    if (Request.prototype.isPrototypeOf(input) && !init) {
	      request = input
	    } else {
	      request = new Request(input, init)
	    }

	    return new Promise(function(resolve, reject) {
	      var xhr = new XMLHttpRequest()

	      function responseURL() {
	        if ('responseURL' in xhr) {
	          return xhr.responseURL
	        }

	        // Avoid security warnings on getResponseHeader when not allowed by CORS
	        if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
	          return xhr.getResponseHeader('X-Request-URL')
	        }

	        return;
	      }

	      xhr.onload = function() {
	        var status = (xhr.status === 1223) ? 204 : xhr.status
	        if (status < 100 || status > 599) {
	          reject(new TypeError('Network request failed'))
	          return
	        }
	        var options = {
	          status: status,
	          statusText: xhr.statusText,
	          headers: headers(xhr),
	          url: responseURL()
	        }
	        var body = 'response' in xhr ? xhr.response : xhr.responseText;
	        resolve(new Response(body, options))
	      }

	      xhr.onerror = function() {
	        reject(new TypeError('Network request failed'))
	      }

	      xhr.open(request.method, request.url, true)

	      if (request.credentials === 'include') {
	        xhr.withCredentials = true
	      }

	      if ('responseType' in xhr && support.blob) {
	        xhr.responseType = 'blob'
	      }

	      request.headers.forEach(function(value, name) {
	        xhr.setRequestHeader(name, value)
	      })

	      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
	    })
	  }
	  self.fetch.polyfill = true
	})();

	},{}],6:[function(require,module,exports){
	'use strict';

	require('whatwg-fetch');
	var Q = require('Q');
	var EventEmitter = require('eventemitter2').EventEmitter2;
	var copy = require('shallow-copy');

	// The default base url.
	var baseUrl = 'https://api.form.io';
	var appUrl = baseUrl;
	var appUrlSet = false;

	var plugins = [];

	// The temporary GET request cache storage
	var cache = {};

	var noop = function(){};
	var identity = function(value) { return value; };

	// Will invoke a function on all plugins.
	// Returns a promise that resolves when all promises
	// returned by the plugins have resolved.
	// Should be used when you want plugins to prepare for an event
	// but don't want any data returned.
	var pluginWait = function(pluginFn) {
	  var args = [].slice.call(arguments, 1);
	  return Q.all(plugins.map(function(plugin) {
	    return (plugin[pluginFn] || noop).apply(plugin, args);
	  }));
	};

	// Will invoke a function on plugins from highest priority
	// to lowest until one returns a value. Returns null if no
	// plugins return a value.
	// Should be used when you want just one plugin to handle things.
	var pluginGet = function(pluginFn) {
	  var args = [].slice.call(arguments, 0);
	  var callPlugin = function(index, pluginFn) {
	    var plugin = plugins[index];
	    if (!plugin) return Q(null);
	    return Q((plugin && plugin[pluginFn] || noop).apply(plugin, [].slice.call(arguments, 2)))
	    .then(function(result) {
	      if (result !== null && result !== undefined) return result;
	      return callPlugin.apply(null, [index + 1].concat(args));
	    });
	  };
	  return callPlugin.apply(null, [0].concat(args));
	};

	// Will invoke a function on plugins from highest priority to
	// lowest, building a promise chain from their return values
	// Should be used when all plugins need to process a promise's
	// success or failure
	var pluginAlter = function(pluginFn, value) {
	  var args = [].slice.call(arguments, 2);
	  return plugins.reduce(function(value, plugin) {
	      return (plugin[pluginFn] || identity).apply(plugin, [value].concat(args));
	  }, value);
	};


	/**
	 * Returns parts of the URL that are important.
	 * Indexes
	 *  - 0: The full url
	 *  - 1: The protocol
	 *  - 2: The hostname
	 *  - 3: The rest
	 *
	 * @param url
	 * @returns {*}
	 */
	var getUrlParts = function(url) {
	  var regex = '^(http[s]?:\\/\\/)';
	  if (baseUrl && url.indexOf(baseUrl) === 0) {
	    regex += '(' + baseUrl.replace(/^http[s]?:\/\//, '') + ')';
	  }
	  else {
	    regex += '([^/]+)';
	  }
	  regex += '($|\\/.*)';
	  return url.match(new RegExp(regex));
	};

	var serialize = function(obj) {
	  var str = [];
	  for(var p in obj)
	    if (obj.hasOwnProperty(p)) {
	      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
	    }
	  return str.join("&");
	};

	// The formio class.
	var Formio = function(path) {

	  // Ensure we have an instance of Formio.
	  if (!(this instanceof Formio)) { return new Formio(path); }
	  if (!path) {
	    // Allow user to create new projects if this was instantiated without
	    // a url
	    this.projectUrl = baseUrl + '/project';
	    this.projectsUrl = baseUrl + '/project';
	    this.projectId = false;
	    this.query = '';
	    return;
	  }

	  // Initialize our variables.
	  this.projectsUrl = '';
	  this.projectUrl = '';
	  this.projectId = '';
	  this.formUrl = '';
	  this.formsUrl = '';
	  this.formId = '';
	  this.submissionsUrl = '';
	  this.submissionUrl = '';
	  this.submissionId = '';
	  this.actionsUrl = '';
	  this.actionId = '';
	  this.actionUrl = '';
	  this.query = '';

	  // Normalize to an absolute path.
	  if ((path.indexOf('http') !== 0) && (path.indexOf('//') !== 0)) {
	    baseUrl = baseUrl ? baseUrl : window.location.href.match(/http[s]?:\/\/api./)[0];
	    path = baseUrl + path;
	  }

	  var hostparts = getUrlParts(path);
	  var parts = [];
	  var hostName = hostparts[1] + hostparts[2];
	  path = hostparts.length > 3 ? hostparts[3] : '';
	  var queryparts = path.split('?');
	  if (queryparts.length > 1) {
	    path = queryparts[0];
	    this.query = '?' + queryparts[1];
	  }

	  // See if this is a form path.
	  if ((path.search(/(^|\/)(form|project)($|\/)/) !== -1)) {

	    // Register a specific path.
	    var registerPath = function(name, base) {
	      this[name + 'sUrl'] = base + '/' + name;
	      var regex = new RegExp('\/' + name + '\/([^/]+)');
	      if (path.search(regex) !== -1) {
	        parts = path.match(regex);
	        this[name + 'Url'] = parts ? (base + parts[0]) : '';
	        this[name + 'Id'] = (parts.length > 1) ? parts[1] : '';
	        base += parts[0];
	      }
	      return base;
	    }.bind(this);

	    // Register an array of items.
	    var registerItems = function(items, base, staticBase) {
	      for (var i in items) {
	        if (items.hasOwnProperty(i)) {
	          var item = items[i];
	          if (item instanceof Array) {
	            registerItems(item, base, true);
	          }
	          else {
	            var newBase = registerPath(item, base);
	            base = staticBase ? base : newBase;
	          }
	        }
	      }
	    };

	    registerItems(['project', 'form', ['submission', 'action']], hostName);

	    if (!this.projectId) {
	      if (hostparts.length > 2 && hostparts[2].split('.').length > 2) {
	        this.projectUrl = hostName;
	        this.projectId = hostparts[2].split('.')[0];
	      }
	    }
	  }
	  else {

	    // This is an aliased url.
	    this.projectUrl = hostName;
	    this.projectId = (hostparts.length > 2) ? hostparts[2].split('.')[0] : '';
	    var subRegEx = new RegExp('\/(submission|action)($|\/.*)');
	    var subs = path.match(subRegEx);
	    this.pathType = (subs && (subs.length > 1)) ? subs[1] : '';
	    path = path.replace(subRegEx, '');
	    path = path.replace(/\/$/, '');
	    this.formsUrl = hostName + '/form';
	    this.formUrl = hostName + path;
	    this.formId = path.replace(/^\/+|\/+$/g, '');
	    var items = ['submission', 'action'];
	    for (var i in items) {
	      if (items.hasOwnProperty(i)) {
	        var item = items[i];
	        this[item + 'sUrl'] = hostName + path + '/' + item;
	        if ((this.pathType === item) && (subs.length > 2) && subs[2]) {
	          this[item + 'Id'] = subs[2].replace(/^\/+|\/+$/g, '');
	          this[item + 'Url'] = hostName + path + subs[0];
	        }
	      }
	    }
	  }

	  // Set the app url if it is not set.
	  if (!appUrlSet) {
	    appUrl = this.projectUrl;
	  }
	};

	/**
	 * Load a resource.
	 *
	 * @param type
	 * @returns {Function}
	 * @private
	 */
	var _load = function(type) {
	  var _id = type + 'Id';
	  var _url = type + 'Url';
	  return function(query, opts) {
	    if (query && typeof query === 'object') {
	      query = serialize(query.params);
	    }
	    if (query) {
	      query = this.query ? (this.query + '&' + query) : ('?' + query);
	    }
	    else {
	      query = this.query;
	    }
	    if (!this[_id]) { return Q.reject('Missing ' + _id); }
	    return this.makeRequest(type, this[_url] + query, 'get', null, opts);
	  };
	};

	/**
	 * Save a resource.
	 *
	 * @param type
	 * @returns {Function}
	 * @private
	 */
	var _save = function(type) {
	  var _id = type + 'Id';
	  var _url = type + 'Url';
	  return function(data, opts) {
	    var method = this[_id] ? 'put' : 'post';
	    var reqUrl = this[_id] ? this[_url] : this[type + 'sUrl'];
	    cache = {};
	    return this.makeRequest(type, reqUrl + this.query, method, data, opts);
	  };
	};

	/**
	 * Delete a resource.
	 *
	 * @param type
	 * @returns {Function}
	 * @private
	 */
	var _delete = function(type) {
	  var _id = type + 'Id';
	  var _url = type + 'Url';
	  return function(opts) {
	    if (!this[_id]) { Q.reject('Nothing to delete'); }
	    cache = {};
	    return this.makeRequest(type, this[_url], 'delete', null, opts);
	  };
	};

	/**
	 * Resource index method.
	 *
	 * @param type
	 * @returns {Function}
	 * @private
	 */
	var _index = function(type) {
	  var _url = type + 'Url';
	  return function(query, opts) {
	    query = query || '';
	    if (query && typeof query === 'object') {
	      query = '?' + serialize(query.params);
	    }
	    return this.makeRequest(type, this[_url] + query, 'get', null, opts);
	  };
	};

	// Activates plugin hooks, makes Formio.request if no plugin provides a request
	Formio.prototype.makeRequest = function(type, url, method, data, opts) {
	  var self = this;
	  method = (method || 'GET').toUpperCase();
	  if(!opts || typeof opts !== 'object') {
	    opts = {};
	  }

	  var requestArgs = {
	    formio: self,
	    type: type,
	    url: url,
	    method: method,
	    data: data,
	    opts: opts
	  };

	  var request = pluginWait('preRequest', requestArgs)
	  .then(function() {
	    return pluginGet('request', requestArgs)
	    .then(function(result) {
	      if (result === null || result === undefined) {
	        return Formio.request(url, method, data);
	      }
	      return result;
	    });
	  });

	  return pluginAlter('wrapRequestPromise', request, requestArgs);
	};

	// Define specific CRUD methods.
	Formio.prototype.loadProject = _load('project');
	Formio.prototype.saveProject = _save('project');
	Formio.prototype.deleteProject = _delete('project');
	Formio.prototype.loadForm = _load('form');
	Formio.prototype.saveForm = _save('form');
	Formio.prototype.deleteForm = _delete('form');
	Formio.prototype.loadForms = _index('forms');
	Formio.prototype.loadSubmission = _load('submission');
	Formio.prototype.saveSubmission = _save('submission');
	Formio.prototype.deleteSubmission = _delete('submission');
	Formio.prototype.loadSubmissions = _index('submissions');
	Formio.prototype.loadAction = _load('action');
	Formio.prototype.saveAction = _save('action');
	Formio.prototype.deleteAction = _delete('action');
	Formio.prototype.loadActions = _index('actions');
	Formio.prototype.availableActions = function() { return this.makeRequest('availableActions', this.formUrl + '/actions'); };
	Formio.prototype.actionInfo = function(name) { return this.makeRequest('actionInfo', this.formUrl + '/actions/' + name); };

	Formio.makeStaticRequest = function(url, method, data) {
	  var self = this;
	  method = (method || 'GET').toUpperCase();

	  var requestArgs = {
	    url: url,
	    method: method,
	    data: data
	  };

	  var request = pluginWait('preStaticRequest', requestArgs)
	  .then(function() {
	    return pluginGet('staticRequest', requestArgs)
	    .then(function(result) {
	      if (result === null || result === undefined) {
	        return Formio.request(url, method, data);
	      }
	      return result;
	    });
	  });

	  return pluginAlter('wrapStaticRequestPromise', request, requestArgs);
	};

	// Static methods.
	Formio.loadProjects = function(query) {
	  query = query || '';
	  if (typeof query === 'object') {
	    query = '?' + serialize(query.params);
	  }
	  return this.makeStaticRequest(baseUrl + '/project' + query);
	};
	Formio.request = function(url, method, data) {
	  if (!url) { return Q.reject('No url provided'); }
	  method = (method || 'GET').toUpperCase();
	  var cacheKey = btoa(url);

	  return Q().then(function() {
	    // Get the cached promise to save multiple loads.
	    if (method === 'GET' && cache.hasOwnProperty(cacheKey)) {
	      return cache[cacheKey];
	    }
	    else {
	      return Q()
	      .then(function() {
	        // Set up and fetch request
	        var headers = new Headers({
	          'Accept': 'application/json',
	          'Content-type': 'application/json; charset=UTF-8'
	        });
	        var token = Formio.getToken();
	        if (token) {
	          headers.append('x-jwt-token', token);
	        }

	        var options = {
	          method: method,
	          headers: headers,
	          mode: 'cors'
	        };
	        if (data) {
	          options.body = JSON.stringify(data);
	        }

	        return fetch(url, options);
	      })
	      .catch(function(err) {
	        err.message = 'Could not connect to API server (' + err.message + ')';
	        err.networkError = true;
	        throw err;
	      })
	      .then(function(response) {
	        // Handle fetch results
	        if (response.ok) {
	          var token = response.headers.get('x-jwt-token');
	          if (response.status >= 200 && response.status < 300 && token && token !== '') {
	            Formio.setToken(token);
	          }
	          // 204 is no content. Don't try to .json() it.
	          if (response.status === 204) {
	            return {};
	          }
	          return (response.headers.get('content-type').indexOf('application/json') !== -1 ?
	            response.json() : response.text())
	          .then(function(result) {
	            // Add some content-range metadata to the result here
	            var range = response.headers.get('content-range');
	            if (range && typeof result === 'object') {
	              range = range.split('/');
	              if(range[0] !== '*') {
	                var skipLimit = range[0].split('-');
	                result.skip = Number(skipLimit[0]);
	                result.limit = skipLimit[1] - skipLimit[0] + 1;
	              }
	              result.serverCount = range[1] === '*' ? range[1] : Number(range[1]);
	            }
	            return result;
	          });
	        }
	        else {
	          if (response.status === 440) {
	            Formio.setToken(null);
	          }
	          // Parse and return the error as a rejected promise to reject this promise
	          return (response.headers.get('content-type').indexOf('application/json') !== -1 ?
	            response.json() : response.text())
	            .then(function(error){
	              throw error;
	            });
	        }
	      })
	      .catch(function(err) {
	        // Remove failed promises from cache
	        delete cache[cacheKey];
	        // Propagate error so client can handle accordingly
	        throw err;
	      });
	    }
	  })
	  .then(function(result) {
	    // Save the cache
	    if (method === 'GET') {
	      cache[cacheKey] = Q(result);
	    }

	    // Shallow copy result so modifications don't end up in cache
	    if(Array.isArray(result)) {
	      var resultCopy = result.map(copy);
	      resultCopy.skip = result.skip;
	      resultCopy.limit = result.limit;
	      resultCopy.serverCount = result.serverCount;
	      return resultCopy;
	    }
	    return copy(result);
	  });
	};

	Formio.setToken = function(token) {
	  token = token || '';
	  if (token === this.token) { return; }
	  this.token = token;
	  if (!token) {
	    Formio.setUser(null);
	    // iOS in private browse mode will throw an error but we can't detect ahead of time that we are in private mode.
	    try {
	      return localStorage.removeItem('formioToken');
	    }
	    catch(err) {
	      return;
	    }
	  }
	  // iOS in private browse mode will throw an error but we can't detect ahead of time that we are in private mode.
	  try {
	    localStorage.setItem('formioToken', token);
	  }
	  catch(err) {
	    // Do nothing.
	  }
	  Formio.currentUser(); // Run this so user is updated if null
	};
	Formio.getToken = function() {
	  if (this.token) { return this.token; }
	  var token = localStorage.getItem('formioToken') || '';
	  this.token = token;
	  return token;
	};
	Formio.setUser = function(user) {
	  if (!user) {
	    this.setToken(null);
	    // iOS in private browse mode will throw an error but we can't detect ahead of time that we are in private mode.
	    try {
	      return localStorage.removeItem('formioUser');
	    }
	    catch(err) {
	      return;
	    }
	  }
	  // iOS in private browse mode will throw an error but we can't detect ahead of time that we are in private mode.
	  try {
	    localStorage.setItem('formioUser', JSON.stringify(user));
	  }
	  catch(err) {
	    // Do nothing.
	  }
	};
	Formio.getUser = function() {
	  return JSON.parse(localStorage.getItem('formioUser') || null);
	};

	Formio.setBaseUrl = function(url) {
	  baseUrl = url;
	  if (!appUrlSet) {
	    appUrl = url;
	  }
	};
	Formio.getBaseUrl = function() {
	  return baseUrl;
	};
	Formio.setAppUrl = function(url) {
	  appUrl = url;
	  appUrlSet = true;
	};
	Formio.getAppUrl = function() {
	  return appUrl;
	};
	Formio.clearCache = function() { cache = {}; };

	Formio.currentUser = function() {
	  var url = baseUrl + '/current';
	  var user = this.getUser();
	  if (user) {
	    return pluginAlter('wrapStaticRequestPromise', Q(user), {
	      url: url,
	      method: 'GET'
	    })
	  }
	  var token = this.getToken();
	  if (!token) {
	    return pluginAlter('wrapStaticRequestPromise', Q(null), {
	      url: url,
	      method: 'GET'
	    })
	  }
	  return this.makeStaticRequest(url)
	  .then(function(response) {
	    Formio.setUser(response);
	    return response;
	  });
	};

	// Keep track of their logout callback.
	Formio.logout = function() {
	  return this.makeStaticRequest(baseUrl + '/logout').finally(function() {
	    this.setToken(null);
	    this.setUser(null);
	    Formio.clearCache();
	  }.bind(this));
	};
	Formio.fieldData = function(data, component) {
	  if (!data) { return ''; }
	  if (!component || !component.key) { return data; }
	  if (component.key.indexOf('.') !== -1) {
	    var value = data;
	    var parts = component.key.split('.');
	    var key = '';
	    for (var i = 0; i < parts.length; i++) {
	      key = parts[i];

	      // Handle nested resources
	      if (value.hasOwnProperty('_id')) {
	        value = value.data;
	      }

	      // Return if the key is not found on the value.
	      if (!value.hasOwnProperty(key)) {
	        return;
	      }

	      // Convert old single field data in submissions to multiple
	      if (key === parts[parts.length - 1] && component.multiple && !Array.isArray(value[key])) {
	        value[key] = [value[key]];
	      }

	      // Set the value of this key.
	      value = value[key];
	    }
	    return value;
	  }
	  else {
	    // Convert old single field data in submissions to multiple
	    if (component.multiple && !Array.isArray(data[component.key])) {
	      data[component.key] = [data[component.key]];
	    }
	    return data[component.key];
	  }
	};

	/**
	 * EventEmitter for Formio events.
	 * See Node.js documentation for API documentation: https://nodejs.org/api/events.html
	 */
	Formio.events = new EventEmitter({
	  wildcard: false,
	  maxListeners: 0
	});

	/**
	 * Register a plugin with Formio.js
	 * @param plugin The plugin to register. See plugin documentation.
	 * @param name   Optional name to later retrieve plugin with.
	 */
	Formio.registerPlugin = function(plugin, name) {
	  plugins.push(plugin);
	  plugins.sort(function(a, b) {
	    return (b.priority || 0) - (a.priority || 0);
	  });
	  plugin.__name = name;
	  (plugin.init || noop).call(plugin, Formio);
	};

	/**
	 * Returns the plugin registered with the given name.
	 */
	Formio.getPlugin = function(name) {
	  return plugins.reduce(function(result, plugin) {
	    if (result) return result;
	    if (plugin.__name === name) return plugin;
	  }, null);
	};

	/**
	 * Deregisters a plugin with Formio.js.
	 * @param  plugin The instance or name of the plugin
	 * @return true if deregistered, false otherwise
	 */
	Formio.deregisterPlugin = function(plugin) {
	  var beforeLength = plugins.length;
	  plugins = plugins.filter(function(p) {
	    if(p !== plugin && p.__name !== plugin) return true;
	    (p.deregister || noop).call(p, Formio);
	    return false;
	  });
	  return beforeLength !== plugins.length;
	};

	module.exports = Formio;

	},{"Q":1,"eventemitter2":2,"shallow-copy":4,"whatwg-fetch":5}]},{},[6])(6)
	});

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var React = __webpack_require__(1);

	module.exports = React.createClass({
	  displayName: 'FormioComponent',
	  render: function render() {
	    // FormioComponents is a global variable so external scripts can define custom components.
	    var FormioElement;
	    if (FormioComponents[this.props.component.type]) {
	      FormioElement = FormioComponents[this.props.component.type];
	    } else {
	      FormioElement = FormioComponents['custom'];
	    }
	    //console.log(this.props.component.type);
	    var className = 'form-group has-feedback form-field-type-' + this.props.component.type;
	    if (typeof this.props.onElementRender === 'function') {
	      this.props.onElementRender(this.props.component);
	    }
	    return React.createElement(
	      'div',
	      { className: className },
	      React.createElement(FormioElement, _extends({
	        name: this.props.component.key
	      }, this.props))
	    );
	  }
	});

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(5),
	    now = __webpack_require__(6),
	    toNumber = __webpack_require__(7);

	/** Used as the `TypeError` message for "Functions" methods. */
	var FUNC_ERROR_TEXT = 'Expected a function';

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeMax = Math.max,
	    nativeMin = Math.min;

	/**
	 * Creates a debounced function that delays invoking `func` until after `wait`
	 * milliseconds have elapsed since the last time the debounced function was
	 * invoked. The debounced function comes with a `cancel` method to cancel
	 * delayed `func` invocations and a `flush` method to immediately invoke them.
	 * Provide an options object to indicate whether `func` should be invoked on
	 * the leading and/or trailing edge of the `wait` timeout. The `func` is invoked
	 * with the last arguments provided to the debounced function. Subsequent calls
	 * to the debounced function return the result of the last `func` invocation.
	 *
	 * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
	 * on the trailing edge of the timeout only if the debounced function is
	 * invoked more than once during the `wait` timeout.
	 *
	 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
	 * for details over the differences between `_.debounce` and `_.throttle`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Function
	 * @param {Function} func The function to debounce.
	 * @param {number} [wait=0] The number of milliseconds to delay.
	 * @param {Object} [options={}] The options object.
	 * @param {boolean} [options.leading=false]
	 *  Specify invoking on the leading edge of the timeout.
	 * @param {number} [options.maxWait]
	 *  The maximum time `func` is allowed to be delayed before it's invoked.
	 * @param {boolean} [options.trailing=true]
	 *  Specify invoking on the trailing edge of the timeout.
	 * @returns {Function} Returns the new debounced function.
	 * @example
	 *
	 * // Avoid costly calculations while the window size is in flux.
	 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
	 *
	 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
	 * jQuery(element).on('click', _.debounce(sendMail, 300, {
	 *   'leading': true,
	 *   'trailing': false
	 * }));
	 *
	 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
	 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
	 * var source = new EventSource('/stream');
	 * jQuery(source).on('message', debounced);
	 *
	 * // Cancel the trailing debounced invocation.
	 * jQuery(window).on('popstate', debounced.cancel);
	 */
	function debounce(func, wait, options) {
	  var lastArgs,
	      lastThis,
	      maxWait,
	      result,
	      timerId,
	      lastCallTime,
	      lastInvokeTime = 0,
	      leading = false,
	      maxing = false,
	      trailing = true;

	  if (typeof func != 'function') {
	    throw new TypeError(FUNC_ERROR_TEXT);
	  }
	  wait = toNumber(wait) || 0;
	  if (isObject(options)) {
	    leading = !!options.leading;
	    maxing = 'maxWait' in options;
	    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
	    trailing = 'trailing' in options ? !!options.trailing : trailing;
	  }

	  function invokeFunc(time) {
	    var args = lastArgs,
	        thisArg = lastThis;

	    lastArgs = lastThis = undefined;
	    lastInvokeTime = time;
	    result = func.apply(thisArg, args);
	    return result;
	  }

	  function leadingEdge(time) {
	    // Reset any `maxWait` timer.
	    lastInvokeTime = time;
	    // Start the timer for the trailing edge.
	    timerId = setTimeout(timerExpired, wait);
	    // Invoke the leading edge.
	    return leading ? invokeFunc(time) : result;
	  }

	  function remainingWait(time) {
	    var timeSinceLastCall = time - lastCallTime,
	        timeSinceLastInvoke = time - lastInvokeTime,
	        result = wait - timeSinceLastCall;

	    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
	  }

	  function shouldInvoke(time) {
	    var timeSinceLastCall = time - lastCallTime,
	        timeSinceLastInvoke = time - lastInvokeTime;

	    // Either this is the first call, activity has stopped and we're at the
	    // trailing edge, the system time has gone backwards and we're treating
	    // it as the trailing edge, or we've hit the `maxWait` limit.
	    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
	      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
	  }

	  function timerExpired() {
	    var time = now();
	    if (shouldInvoke(time)) {
	      return trailingEdge(time);
	    }
	    // Restart the timer.
	    timerId = setTimeout(timerExpired, remainingWait(time));
	  }

	  function trailingEdge(time) {
	    timerId = undefined;

	    // Only invoke if we have `lastArgs` which means `func` has been
	    // debounced at least once.
	    if (trailing && lastArgs) {
	      return invokeFunc(time);
	    }
	    lastArgs = lastThis = undefined;
	    return result;
	  }

	  function cancel() {
	    lastInvokeTime = 0;
	    lastArgs = lastCallTime = lastThis = timerId = undefined;
	  }

	  function flush() {
	    return timerId === undefined ? result : trailingEdge(now());
	  }

	  function debounced() {
	    var time = now(),
	        isInvoking = shouldInvoke(time);

	    lastArgs = arguments;
	    lastThis = this;
	    lastCallTime = time;

	    if (isInvoking) {
	      if (timerId === undefined) {
	        return leadingEdge(lastCallTime);
	      }
	      if (maxing) {
	        // Handle invocations in a tight loop.
	        timerId = setTimeout(timerExpired, wait);
	        return invokeFunc(lastCallTime);
	      }
	    }
	    if (timerId === undefined) {
	      timerId = setTimeout(timerExpired, wait);
	    }
	    return result;
	  }
	  debounced.cancel = cancel;
	  debounced.flush = flush;
	  return debounced;
	}

	module.exports = debounce;


/***/ },
/* 5 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is the
	 * [language type](http://www.ecma-international.org/ecma-262/6.0/#sec-ecmascript-language-types)
	 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(_.noop);
	 * // => true
	 *
	 * _.isObject(null);
	 * // => false
	 */
	function isObject(value) {
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}

	module.exports = isObject;


/***/ },
/* 6 */
/***/ function(module, exports) {

	/**
	 * Gets the timestamp of the number of milliseconds that have elapsed since
	 * the Unix epoch (1 January 1970 00:00:00 UTC).
	 *
	 * @static
	 * @memberOf _
	 * @since 2.4.0
	 * @category Date
	 * @returns {number} Returns the timestamp.
	 * @example
	 *
	 * _.defer(function(stamp) {
	 *   console.log(_.now() - stamp);
	 * }, _.now());
	 * // => Logs the number of milliseconds it took for the deferred invocation.
	 */
	function now() {
	  return Date.now();
	}

	module.exports = now;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var isFunction = __webpack_require__(8),
	    isObject = __webpack_require__(5),
	    isSymbol = __webpack_require__(9);

	/** Used as references for various `Number` constants. */
	var NAN = 0 / 0;

	/** Used to match leading and trailing whitespace. */
	var reTrim = /^\s+|\s+$/g;

	/** Used to detect bad signed hexadecimal string values. */
	var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

	/** Used to detect binary string values. */
	var reIsBinary = /^0b[01]+$/i;

	/** Used to detect octal string values. */
	var reIsOctal = /^0o[0-7]+$/i;

	/** Built-in method references without a dependency on `root`. */
	var freeParseInt = parseInt;

	/**
	 * Converts `value` to a number.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to process.
	 * @returns {number} Returns the number.
	 * @example
	 *
	 * _.toNumber(3.2);
	 * // => 3.2
	 *
	 * _.toNumber(Number.MIN_VALUE);
	 * // => 5e-324
	 *
	 * _.toNumber(Infinity);
	 * // => Infinity
	 *
	 * _.toNumber('3.2');
	 * // => 3.2
	 */
	function toNumber(value) {
	  if (typeof value == 'number') {
	    return value;
	  }
	  if (isSymbol(value)) {
	    return NAN;
	  }
	  if (isObject(value)) {
	    var other = isFunction(value.valueOf) ? value.valueOf() : value;
	    value = isObject(other) ? (other + '') : other;
	  }
	  if (typeof value != 'string') {
	    return value === 0 ? value : +value;
	  }
	  value = value.replace(reTrim, '');
	  var isBinary = reIsBinary.test(value);
	  return (isBinary || reIsOctal.test(value))
	    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
	    : (reIsBadHex.test(value) ? NAN : +value);
	}

	module.exports = toNumber;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(5);

	/** `Object#toString` result references. */
	var funcTag = '[object Function]',
	    genTag = '[object GeneratorFunction]';

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;

	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified,
	 *  else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in Safari 8 which returns 'object' for typed array and weak map constructors,
	  // and PhantomJS 1.9 which returns 'function' for `NodeList` instances.
	  var tag = isObject(value) ? objectToString.call(value) : '';
	  return tag == funcTag || tag == genTag;
	}

	module.exports = isFunction;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var isObjectLike = __webpack_require__(10);

	/** `Object#toString` result references. */
	var symbolTag = '[object Symbol]';

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;

	/**
	 * Checks if `value` is classified as a `Symbol` primitive or object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified,
	 *  else `false`.
	 * @example
	 *
	 * _.isSymbol(Symbol.iterator);
	 * // => true
	 *
	 * _.isSymbol('abc');
	 * // => false
	 */
	function isSymbol(value) {
	  return typeof value == 'symbol' ||
	    (isObjectLike(value) && objectToString.call(value) == symbolTag);
	}

	module.exports = isSymbol;


/***/ },
/* 10 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}

	module.exports = isObjectLike;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// Is this the best way to create a registry? We don't have providers like Angular.
	window.FormioComponents = {};
	//FormioComponents.address = require('./address');
	FormioComponents.button = __webpack_require__(12);
	FormioComponents.checkbox = __webpack_require__(13);
	FormioComponents.columns = __webpack_require__(16);
	FormioComponents.content = __webpack_require__(17);
	FormioComponents.custom = __webpack_require__(18);
	//FormioComponents.datetime = require('./datetime');
	FormioComponents.email = __webpack_require__(19);
	FormioComponents.fieldset = __webpack_require__(22);
	FormioComponents.hidden = __webpack_require__(23);
	FormioComponents.number = __webpack_require__(24);
	FormioComponents.panel = __webpack_require__(25);
	FormioComponents.password = __webpack_require__(26);
	FormioComponents.phoneNumber = __webpack_require__(27);
	FormioComponents.radio = __webpack_require__(28);
	//FormioComponents.resource = require('./resource');
	//FormioComponents.select = require('./select');
	//FormioComponents.signature = require('./signature');
	FormioComponents.table = __webpack_require__(29);
	FormioComponents.textarea = __webpack_require__(30);
	FormioComponents.textfield = __webpack_require__(31);
	FormioComponents.well = __webpack_require__(32);

	module.exports = {};

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(1);

	// TODO: Support other button actions like reset.
	module.exports = React.createClass({
	  displayName: 'Button',
	  onClick: function onClick(event) {
	    switch (this.props.component.action) {
	      case 'submit':
	        // Allow default submit to continue.
	        break;
	      case 'reset':
	        event.preventDefault();
	        this.props.resetForm();
	        break;
	    }
	  },
	  render: function render() {
	    var classNames = 'btn btn-' + this.props.component.theme + ' btn-' + this.props.component.size;
	    classNames += this.props.component.block ? ' btn-block' : '';
	    var leftIcon = this.props.component.leftIcon ? React.createElement('span', { className: this.props.component.leftIcon, 'aria-hidden': 'true' }) : '';
	    var rightIcon = this.props.component.rightIcon ? React.createElement('span', { className: this.props.component.rightIcon, 'aria-hidden': 'true' }) : '';
	    var disabled = this.props.isSubmitting || this.props.component.disableOnInvalid && !this.props.isFormValid;
	    var submitting = this.props.isSubmitting && this.props.component.action === 'submit' ? React.createElement('i', { className: 'glyphicon glyphicon-refresh glyphicon-spin' }) : '';
	    return React.createElement(
	      'button',
	      {
	        className: classNames,
	        type: this.props.component.action === 'submit' ? 'submit' : 'button',
	        disabled: disabled,
	        onClick: this.onClick
	      },
	      submitting,
	      leftIcon,
	      this.props.component.label,
	      rightIcon
	    );
	  }
	});

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(1);
	var valueMixin = __webpack_require__(14);
	var multiMixin = __webpack_require__(15);

	module.exports = React.createClass({
	  displayName: 'Checkbox',
	  mixins: [valueMixin, multiMixin],
	  onChangeCheckbox: function onChangeCheckbox(event) {
	    var value = event.currentTarget.checked;
	    var index = this.props.component.multiple ? event.currentTarget.getAttribute('data-index') : null;
	    this.setValue(value, index);
	  },
	  getSingleElement: function getSingleElement(value, index) {
	    index = index || 0;
	    var required = this.props.component.validate.required ? 'field-required' : '';
	    return React.createElement(
	      'div',
	      { className: 'checkbox' },
	      React.createElement(
	        'label',
	        { className: required },
	        React.createElement('input', {
	          type: 'checkbox',
	          id: this.props.component.key,
	          'data-index': index,
	          name: this.props.name,
	          checked: value,
	          disabled: this.props.readOnly,
	          onChange: this.onChangeCheckbox
	        }),
	        this.props.component.label
	      )
	    );
	  }
	});

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(1);

	module.exports = {
	  getInitialState: function getInitialState() {
	    var value = this.props.value || '';
	    // Number and datetime expect null instead of empty.
	    if (value === '' && (this.props.component.type === 'number' || this.props.component.type === 'datetime')) {
	      value = null;
	    }
	    value = this.safeSingleToMultiple(value);
	    return {
	      value: value,
	      isValid: true,
	      errorMessage: '',
	      isPristine: true
	    };
	  },
	  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	    if (this.props.value !== nextProps.value) {
	      var value = this.safeSingleToMultiple(nextProps.value);
	      this.setState({
	        value: value
	      });
	    }
	  },
	  safeSingleToMultiple: function safeSingleToMultiple(value) {
	    // If this was a single but is not a multivalue.
	    if (this.props.component.multiple && !Array.isArray(value)) {
	      value = [value];
	    }
	    // If this was a multivalue but is now single value.
	    else if (!this.props.component.multiple && Array.isArray(value)) {
	        value = value[0];
	      }
	    // Set dates to Date object.
	    if (this.props.component.type === 'datetime' && value && !(value instanceof Date)) {
	      value = new Date(value);
	    }
	    return value;
	  },
	  componentWillMount: function componentWillMount() {
	    this.props.attachToForm(this);
	  },
	  componentWillUnmount: function componentWillUnmount() {
	    this.props.detachFromForm(this);
	  },
	  onChange: function onChange(event) {
	    var value = event.currentTarget.value;
	    var index = this.props.component.multiple ? event.currentTarget.getAttribute('data-index') : null;
	    this.setValue(value, index);
	  },
	  setValue: function setValue(value, index) {
	    this.setState(function (previousState) {
	      if (index) {
	        previousState.value[index] = value;
	      } else {
	        previousState.value = value;
	      }
	      previousState.isPristine = false;
	      return previousState;
	    }, function () {
	      if (typeof this.props.change === 'function') {
	        this.props.change();
	      }
	      if (typeof this.props.validate === 'function') {
	        this.props.validate(this);
	      }
	    }.bind(this));
	  },
	  getComponent: function getComponent() {
	    var classNames = 'form-group has-feedback form-field-type-' + this.props.component.type + (this.state.errorMessage !== '' && !this.state.isPristine ? ' has-error' : '');
	    var id = 'form-group-' + this.props.component.key;
	    var Elements = this.getElements();
	    var Error = this.state.errorMessage && !this.state.isPristine ? React.createElement(
	      'p',
	      { className: 'help-block' },
	      this.state.errorMessage
	    ) : '';
	    return React.createElement(
	      'div',
	      { className: classNames, id: id },
	      React.createElement(
	        'div',
	        null,
	        Elements
	      ),
	      Error
	    );
	  },
	  render: function render() {
	    return this.getComponent();
	  }
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(1);

	module.exports = {
	  addFieldValue: function addFieldValue() {
	    var values = this.state.value;
	    values.push(this.props.component.defaultValue);
	    this.setState({
	      value: values
	    });
	  },
	  removeFieldValue: function removeFieldValue(id) {
	    var values = this.state.value;
	    values.splice(id, 1);
	    this.setState({
	      value: values
	    });
	  },
	  getElements: function getElements() {
	    var Component;
	    var classLabel = 'control-label' + (this.props.component.validate && this.props.component.validate.required ? ' field-required' : '');
	    var inputLabel = this.props.component.label && !this.props.component.hideLabel ? React.createElement(
	      'label',
	      { htmlFor: this.props.component.key, className: classLabel },
	      this.props.component.label
	    ) : '';
	    var requiredInline = !this.props.component.label && this.props.component.validate && this.props.component.validate.required ? React.createElement('span', { className: 'glyphicon glyphicon-asterisk form-control-feedback field-required-inline', 'aria-hidden': 'true' }) : '';
	    var className = this.props.component.prefix || this.props.component.suffix ? 'input-group' : '';
	    var prefix = this.props.component.prefix ? React.createElement(
	      'div',
	      { className: 'input-group-addon' },
	      this.props.component.prefix
	    ) : '';
	    var suffix = this.props.component.suffix ? React.createElement(
	      'div',
	      { className: 'input-group-addon' },
	      this.props.component.suffix
	    ) : '';
	    var data = this.state.value;
	    if (this.props.component.multiple) {
	      var rows = data.map(function (value, id) {
	        var Element = this.getSingleElement(value, id);
	        return React.createElement(
	          'tr',
	          { key: id },
	          React.createElement(
	            'td',
	            null,
	            requiredInline,
	            React.createElement(
	              'div',
	              { className: className },
	              prefix,
	              ' ',
	              Element,
	              ' ',
	              suffix
	            )
	          ),
	          React.createElement(
	            'td',
	            null,
	            React.createElement(
	              'a',
	              { onClick: this.removeFieldValue.bind(null, id), className: 'btn btn-danger' },
	              React.createElement('span', { className: 'glyphicon glyphicon-remove-circle' })
	            )
	          )
	        );
	      }.bind(this));
	      Component = React.createElement(
	        'div',
	        null,
	        inputLabel,
	        React.createElement(
	          'table',
	          { className: 'table table-bordered' },
	          React.createElement(
	            'tbody',
	            null,
	            rows,
	            React.createElement(
	              'tr',
	              null,
	              React.createElement(
	                'td',
	                { colSpan: '2' },
	                React.createElement(
	                  'a',
	                  { onClick: this.addFieldValue, className: 'btn btn-primary' },
	                  React.createElement('span', { className: 'glyphicon glyphicon-plus', 'aria-hidden': 'true' }),
	                  ' Add another'
	                )
	              )
	            )
	          )
	        )
	      );
	    } else {
	      var Element = this.getSingleElement(data);
	      Component = React.createElement(
	        'div',
	        null,
	        inputLabel,
	        ' ',
	        requiredInline,
	        React.createElement(
	          'div',
	          { className: className },
	          prefix,
	          ' ',
	          Element,
	          ' ',
	          suffix
	        )
	      );
	    }
	    return Component;
	  }
	};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var React = __webpack_require__(1);
	var FormioComponent = __webpack_require__(3);

	module.exports = React.createClass({
	  displayName: 'Column',
	  render: function render() {
	    return React.createElement(
	      'div',
	      { className: 'row' },
	      this.props.component.columns.map(function (column, index) {
	        return React.createElement(
	          'div',
	          { key: index, className: 'col-xs-6' },
	          column.components.map(function (component) {
	            var value = this.props.data && this.props.data.hasOwnProperty(component.key) ? this.props.data[component.key] : component.defaultValue || '';
	            return React.createElement(FormioComponent, _extends({}, this.props, {
	              key: component.key,
	              name: component.key,
	              component: component,
	              value: value
	            }));
	          }.bind(this))
	        );
	      }.bind(this))
	    );
	  }
	});

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(1);

	module.exports = React.createClass({
	  displayName: 'Content',
	  render: function render() {
	    return React.createElement('div', { dangerouslySetInnerHTML: { __html: this.props.component.html } });
	  }
	});

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(1);

	module.exports = React.createClass({
	  displayName: 'Custom',
	  render: function render() {
	    var value = this.props.data && this.props.data.hasOwnProperty(this.props.component.key) ? this.props.data[this.props.component.key] : '';
	    return React.createElement(
	      'div',
	      { 'class': 'panel panel-default' },
	      React.createElement(
	        'div',
	        { 'class': 'panel-body text-muted text-center' },
	        'Custom Component (',
	        this.props.component.type,
	        ')'
	      )
	    );
	  }
	});

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(1);
	var valueMixin = __webpack_require__(14);
	var multiMixin = __webpack_require__(15);
	var inputMixin = __webpack_require__(20);

	module.exports = React.createClass({
	  displayName: 'Email',
	  mixins: [valueMixin, multiMixin, inputMixin]
	});

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(1);
	var Input = __webpack_require__(21);

	module.exports = {
	  getSingleElement: function getSingleElement(value, index) {
	    index = index || 0;
	    var mask = this.props.component.inputMask || '';
	    return React.createElement(Input, {
	      type: this.props.component.inputType,
	      key: index,
	      className: 'form-control',
	      id: this.props.component.key,
	      'data-index': index,
	      name: this.props.name,
	      value: value,
	      disabled: this.props.readOnly,
	      placeholder: this.props.component.placeholder,
	      mask: mask,
	      onChange: this.onChange
	    });
	  }
	};

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/sanniassin/react-input-mask

	"use strict";

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var React = __webpack_require__(1);

	var InputElement = React.createClass({
	    displayName: "InputElement",

	    defaultCharsRules: {
	        "9": "[0-9]",
	        "a": "[A-Za-z]",
	        "*": "[A-Za-z0-9]"
	    },
	    defaultMaskChar: "_",
	    lastCaretPos: null,
	    isAndroidBrowser: function () {
	        var windows = new RegExp("windows", "i");
	        var firefox = new RegExp("firefox", "i");
	        var android = new RegExp("android", "i");
	        var ua = navigator.userAgent;
	        return !windows.test(ua) && !firefox.test(ua) && android.test(ua);
	    },
	    isWindowsPhoneBrowser: function () {
	        var windows = new RegExp("windows", "i");
	        var phone = new RegExp("phone", "i");
	        var ua = navigator.userAgent;
	        return windows.test(ua) && phone.test(ua);
	    },
	    isAndroidFirefox: function () {
	        var windows = new RegExp("windows", "i");
	        var firefox = new RegExp("firefox", "i");
	        var android = new RegExp("android", "i");
	        var ua = navigator.userAgent;
	        return !windows.test(ua) && firefox.test(ua) && android.test(ua);
	    },
	    isDOMElement: function (element) {
	        return typeof HTMLElement === "object" ? element instanceof HTMLElement // DOM2
	        : element.nodeType === 1 && typeof element.nodeName === "string";
	    },
	    // getDOMNode is deprecated but we need it to stay compatible with React 0.12
	    getInputDOMNode: function () {
	        var input = this.refs.input;

	        if (!input) {
	            return null;
	        }

	        // React 0.14
	        if (this.isDOMElement(input)) {
	            return input;
	        }

	        return input.getDOMNode();
	    },
	    enableValueAccessors: function () {
	        var _this = this;

	        var canUseAccessors = !!(Object.getOwnPropertyDescriptor && Object.getPrototypeOf && Object.defineProperty);
	        if (canUseAccessors) {
	            var input = this.getInputDOMNode();
	            this.valueDescriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(input), 'value');
	            Object.defineProperty(input, 'value', {
	                configurable: true,
	                enumerable: true,
	                get: function () {
	                    return _this.value;
	                },
	                set: function (val) {
	                    _this.value = val;
	                    _this.valueDescriptor.set.call(input, val);
	                }
	            });
	        }
	    },
	    disableValueAccessors: function () {
	        var valueDescriptor = this.valueDescriptor;

	        if (!valueDescriptor) {
	            return;
	        }
	        this.valueDescriptor = null;
	        var input = this.getInputDOMNode();
	        Object.defineProperty(input, 'value', valueDescriptor);
	    },
	    getInputValue: function () {
	        var input = this.getInputDOMNode();
	        var valueDescriptor = this.valueDescriptor;

	        var value;
	        if (valueDescriptor) {
	            value = valueDescriptor.get.call(input);
	        } else {
	            value = input.value;
	        }

	        return value;
	    },
	    getPrefix: function () {
	        var prefix = "";
	        var mask = this.mask;

	        for (var i = 0; i < mask.length && this.isPermanentChar(i); ++i) {
	            prefix += mask[i];
	        }
	        return prefix;
	    },
	    getFilledLength: function () {
	        var value = arguments.length <= 0 || arguments[0] === undefined ? this.state.value : arguments[0];

	        var i;
	        var maskChar = this.maskChar;

	        if (!maskChar) {
	            return value.length;
	        }

	        for (i = value.length - 1; i >= 0; --i) {
	            var character = value[i];
	            if (!this.isPermanentChar(i) && this.isAllowedChar(character, i)) {
	                break;
	            }
	        }

	        return ++i || this.getPrefix().length;
	    },
	    getLeftEditablePos: function (pos) {
	        for (var i = pos; i >= 0; --i) {
	            if (!this.isPermanentChar(i)) {
	                return i;
	            }
	        }
	        return null;
	    },
	    getRightEditablePos: function (pos) {
	        var mask = this.mask;

	        for (var i = pos; i < mask.length; ++i) {
	            if (!this.isPermanentChar(i)) {
	                return i;
	            }
	        }
	        return null;
	    },
	    isEmpty: function () {
	        var _this2 = this;

	        var value = arguments.length <= 0 || arguments[0] === undefined ? this.state.value : arguments[0];

	        return !value.split("").some(function (character, i) {
	            return !_this2.isPermanentChar(i) && _this2.isAllowedChar(character, i);
	        });
	    },
	    isFilled: function () {
	        var value = arguments.length <= 0 || arguments[0] === undefined ? this.state.value : arguments[0];

	        return this.getFilledLength(value) === this.mask.length;
	    },
	    createFilledArray: function (length, val) {
	        var array = [];
	        for (var i = 0; i < length; i++) {
	            array[i] = val;
	        }
	        return array;
	    },
	    formatValue: function (value) {
	        var _this3 = this;

	        var maskChar = this.maskChar;
	        var mask = this.mask;

	        if (!maskChar) {
	            var prefix = this.getPrefix();
	            var prefixLen = prefix.length;
	            value = this.insertRawSubstr("", value, 0);
	            while (value.length > prefixLen && this.isPermanentChar(value.length - 1)) {
	                value = value.slice(0, value.length - 1);
	            }

	            if (value.length < prefixLen) {
	                value = prefix;
	            }

	            return value;
	        }
	        if (value) {
	            var emptyValue = this.formatValue("");
	            return this.insertRawSubstr(emptyValue, value, 0);
	        }
	        return value.split("").concat(this.createFilledArray(mask.length - value.length, null)).map(function (character, pos) {
	            if (_this3.isAllowedChar(character, pos)) {
	                return character;
	            } else if (_this3.isPermanentChar(pos)) {
	                return mask[pos];
	            }
	            return maskChar;
	        }).join("");
	    },
	    clearRange: function (value, start, len) {
	        var _this4 = this;

	        var end = start + len;
	        var maskChar = this.maskChar;
	        var mask = this.mask;

	        if (!maskChar) {
	            var prefixLen = this.getPrefix().length;
	            value = value.split("").filter(function (character, i) {
	                return i < prefixLen || i < start || i >= end;
	            }).join("");
	            return this.formatValue(value);
	        }
	        return value.split("").map(function (character, i) {
	            if (i < start || i >= end) {
	                return character;
	            }
	            if (_this4.isPermanentChar(i)) {
	                return mask[i];
	            }
	            return maskChar;
	        }).join("");
	    },
	    replaceSubstr: function (value, newSubstr, pos) {
	        return value.slice(0, pos) + newSubstr + value.slice(pos + newSubstr.length);
	    },
	    insertRawSubstr: function (value, substr, pos) {
	        var mask = this.mask;
	        var maskChar = this.maskChar;

	        var isFilled = this.isFilled(value);
	        var prefixLen = this.getPrefix().length;
	        substr = substr.split("");

	        if (!maskChar && pos > value.length) {
	            value += mask.slice(value.length, pos);
	        }

	        for (var i = pos; i < mask.length && substr.length;) {
	            var isPermanent = this.isPermanentChar(i);
	            if (!isPermanent || mask[i] === substr[0]) {
	                var character = substr.shift();
	                if (this.isAllowedChar(character, i, true)) {
	                    if (i < value.length) {
	                        if (maskChar || isFilled || i < prefixLen) {
	                            value = this.replaceSubstr(value, character, i);
	                        } else {
	                            value = this.formatValue(value.substr(0, i) + character + value.substr(i));
	                        }
	                    } else if (!maskChar) {
	                        value += character;
	                    }
	                    ++i;
	                }
	            } else {
	                if (!maskChar && i >= value.length) {
	                    value += mask[i];
	                } else if (maskChar && isPermanent && substr[0] === maskChar) {
	                    substr.shift();
	                }
	                ++i;
	            }
	        }
	        return value;
	    },
	    getRawSubstrLength: function (value, substr, pos) {
	        var mask = this.mask;
	        var maskChar = this.maskChar;

	        substr = substr.split("");
	        for (var i = pos; i < mask.length && substr.length;) {
	            if (!this.isPermanentChar(i) || mask[i] === substr[0]) {
	                var character = substr.shift();
	                if (this.isAllowedChar(character, i, true)) {
	                    ++i;
	                }
	            } else {
	                ++i;
	            }
	        }
	        return i - pos;
	    },
	    isAllowedChar: function (character, pos) {
	        var allowMaskChar = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
	        var mask = this.mask;
	        var maskChar = this.maskChar;

	        if (this.isPermanentChar(pos)) {
	            return mask[pos] === character;
	        }
	        var ruleChar = mask[pos];
	        var charRule = this.charsRules[ruleChar];
	        return new RegExp(charRule).test(character || "") || allowMaskChar && character === maskChar;
	    },
	    isPermanentChar: function (pos) {
	        return this.permanents.indexOf(pos) !== -1;
	    },
	    setCaretToEnd: function () {
	        var filledLen = this.getFilledLength();
	        var pos = this.getRightEditablePos(filledLen);
	        if (pos !== null) {
	            this.setCaretPos(pos);
	        }
	    },
	    setSelection: function (start) {
	        var len = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

	        var input = this.getInputDOMNode();
	        if (!input) {
	            return;
	        }

	        var end = start + len;
	        if ("selectionStart" in input && "selectionEnd" in input) {
	            input.selectionStart = start;
	            input.selectionEnd = end;
	        } else {
	            var range = input.createTextRange();
	            range.collapse(true);
	            range.moveStart("character", start);
	            range.moveEnd("character", end - start);
	            range.select();
	        }
	    },
	    getSelection: function () {
	        var input = this.getInputDOMNode();
	        var start = 0;
	        var end = 0;

	        if ("selectionStart" in input && "selectionEnd" in input) {
	            start = input.selectionStart;
	            end = input.selectionEnd;
	        } else {
	            var range = document.selection.createRange();
	            if (range.parentElement() === input) {
	                start = -range.moveStart("character", -input.value.length);
	                end = -range.moveEnd("character", -input.value.length);
	            }
	        }

	        return {
	            start: start,
	            end: end,
	            length: end - start
	        };
	    },
	    getCaretPos: function () {
	        return this.getSelection().start;
	    },
	    setCaretPos: function (pos) {
	        var raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (fn) {
	            return setTimeout(fn, 0);
	        };

	        var setPos = this.setSelection.bind(this, pos, 0);

	        setPos();
	        raf(setPos);

	        this.lastCaretPos = pos;
	    },
	    isFocused: function () {
	        return document.activeElement === this.getInputDOMNode();
	    },
	    parseMask: function (mask) {
	        var _this5 = this;

	        if (!mask || typeof mask !== "string") {
	            return {
	                mask: null,
	                lastEditablePos: null,
	                permanents: []
	            };
	        }
	        var str = "";
	        var permanents = [];
	        var isPermanent = false;
	        var lastEditablePos = null;

	        mask.split("").forEach(function (character) {
	            if (!isPermanent && character === "\\") {
	                isPermanent = true;
	            } else {
	                if (isPermanent || !_this5.charsRules[character]) {
	                    permanents.push(str.length);
	                } else {
	                    lastEditablePos = str.length;
	                }
	                str += character;
	                isPermanent = false;
	            }
	        });

	        return {
	            mask: str,
	            lastEditablePos: lastEditablePos,
	            permanents: permanents
	        };
	    },
	    getStringValue: function (value) {
	        return !value && value !== 0 ? "" : value + "";
	    },
	    getInitialState: function () {
	        this.hasValue = this.props.value != null;
	        this.charsRules = "formatChars" in this.props ? this.props.formatChars : this.defaultCharsRules;

	        var mask = this.parseMask(this.props.mask);
	        var defaultValue = this.props.defaultValue != null ? this.props.defaultValue : '';
	        var value = this.props.value != null ? this.props.value : defaultValue;

	        value = this.getStringValue(value);

	        this.mask = mask.mask;
	        this.permanents = mask.permanents;
	        this.lastEditablePos = mask.lastEditablePos;
	        this.maskChar = "maskChar" in this.props ? this.props.maskChar : this.defaultMaskChar;

	        if (this.mask && (this.props.alwaysShowMask || value)) {
	            value = this.formatValue(value);
	        }

	        return { value: value };
	    },
	    componentWillMount: function () {
	        var mask = this.mask;
	        var value = this.state.value;

	        if (mask && value) {
	            this.setState({ value: value });
	        }
	    },
	    componentWillReceiveProps: function (nextProps) {
	        this.hasValue = this.props.value != null;
	        this.charsRules = "formatChars" in nextProps ? nextProps.formatChars : this.defaultCharsRules;

	        var oldMask = this.mask;
	        var mask = this.parseMask(nextProps.mask);
	        var isMaskChanged = mask.mask && mask.mask !== this.mask;

	        this.mask = mask.mask;
	        this.permanents = mask.permanents;
	        this.lastEditablePos = mask.lastEditablePos;
	        this.maskChar = "maskChar" in nextProps ? nextProps.maskChar : this.defaultMaskChar;

	        if (!this.mask) {
	            return;
	        }

	        var newValue = nextProps.value != null ? this.getStringValue(nextProps.value) : this.state.value;

	        if (!oldMask && nextProps.value == null) {
	            newValue = this.getInputDOMNode().value;
	        }

	        var showEmpty = nextProps.alwaysShowMask || this.isFocused();
	        if (isMaskChanged || mask.mask && (newValue || showEmpty && !this.hasValue)) {
	            newValue = this.formatValue(newValue);

	            if (isMaskChanged) {
	                var pos = this.lastCaretPos;
	                var filledLen = this.getFilledLength(newValue);
	                if (filledLen < pos) {
	                    this.setCaretPos(this.getRightEditablePos(filledLen));
	                }
	            }
	        }
	        if (mask.mask && this.isEmpty(newValue) && !showEmpty && !this.hasValue) {
	            newValue = "";
	        }
	        this.value = newValue;
	        if (this.state.value !== newValue) {
	            this.setState({ value: newValue });
	        }
	    },
	    componentDidUpdate: function (prevProps, prevState) {
	        if ((this.mask || prevProps.mask) && this.props.value == null) {
	            this.updateUncontrolledInput();
	        }
	    },
	    updateUncontrolledInput: function () {
	        if (this.getInputDOMNode().value !== this.state.value) {
	            this.getInputDOMNode().value = this.state.value;
	        }
	    },
	    onKeyDown: function (event) {
	        var hasHandler = typeof this.props.onKeyDown === "function";
	        if (event.ctrlKey || event.metaKey) {
	            if (hasHandler) {
	                this.props.onKeyDown(event);
	            }
	            return;
	        }

	        var caretPos = this.getCaretPos();
	        var value = this.state.value;
	        var key = event.key;
	        var preventDefault = false;
	        switch (key) {
	            case "Backspace":
	            case "Delete":
	                var prefixLen = this.getPrefix().length;
	                var deleteFromRight = key === "Delete";
	                var selectionRange = this.getSelection();
	                if (selectionRange.length) {
	                    value = this.clearRange(value, selectionRange.start, selectionRange.length);
	                } else if (caretPos < prefixLen || !deleteFromRight && caretPos === prefixLen) {
	                    caretPos = prefixLen;
	                } else {
	                    var editablePos = deleteFromRight ? this.getRightEditablePos(caretPos) : this.getLeftEditablePos(caretPos - 1);
	                    if (editablePos !== null) {
	                        value = this.clearRange(value, editablePos, 1);
	                        caretPos = editablePos;
	                    }
	                }
	                preventDefault = true;
	                break;
	            default:
	                break;
	        }

	        if (hasHandler) {
	            this.props.onKeyDown(event);
	        }

	        if (value !== this.state.value) {
	            event.target.value = value;
	            this.setState({
	                value: this.hasValue ? this.state.value : value
	            });
	            preventDefault = true;
	            if (typeof this.props.onChange === "function") {
	                this.props.onChange(event);
	            }
	        }
	        if (preventDefault) {
	            event.preventDefault();
	            this.setCaretPos(caretPos);
	        }
	    },
	    onKeyPress: function (event) {
	        var key = event.key;
	        var hasHandler = typeof this.props.onKeyPress === "function";
	        if (key === "Enter" || event.ctrlKey || event.metaKey) {
	            if (hasHandler) {
	                this.props.onKeyPress(event);
	            }
	            return;
	        }

	        if (this.isWindowsPhoneBrowser) {
	            return;
	        }

	        var caretPos = this.getCaretPos();
	        var selection = this.getSelection();
	        var value = this.state.value;
	        var mask = this.mask;
	        var maskChar = this.maskChar;
	        var lastEditablePos = this.lastEditablePos;

	        var maskLen = mask.length;
	        var prefixLen = this.getPrefix().length;

	        if (this.isPermanentChar(caretPos) && mask[caretPos] === key) {
	            value = this.insertRawSubstr(value, key, caretPos);
	            ++caretPos;
	        } else {
	            var editablePos = this.getRightEditablePos(caretPos);
	            if (editablePos !== null && this.isAllowedChar(key, editablePos)) {
	                value = this.clearRange(value, selection.start, selection.length);
	                value = this.insertRawSubstr(value, key, editablePos);
	                caretPos = editablePos + 1;
	            }
	        }

	        if (value !== this.state.value) {
	            event.target.value = value;
	            this.setState({
	                value: this.hasValue ? this.state.value : value
	            });
	            if (typeof this.props.onChange === "function") {
	                this.props.onChange(event);
	            }
	        }
	        event.preventDefault();
	        if (caretPos < lastEditablePos && caretPos > prefixLen) {
	            caretPos = this.getRightEditablePos(caretPos);
	        }
	        this.setCaretPos(caretPos);
	    },
	    onChange: function (event) {
	        var _this6 = this;

	        var pasteSelection = this.pasteSelection;
	        var mask = this.mask;
	        var maskChar = this.maskChar;
	        var lastEditablePos = this.lastEditablePos;

	        var target = event.target;
	        var value = this.getInputValue();
	        if (!value && this.preventEmptyChange) {
	            this.disableValueAccessors();
	            this.preventEmptyChange = false;
	            target.value = this.state.value;
	            return;
	        }
	        var oldValue = this.state.value;
	        if (pasteSelection) {
	            this.pasteSelection = null;
	            this.pasteText(oldValue, value, pasteSelection, event);
	            return;
	        }
	        var selection = this.getSelection();
	        var caretPos = selection.end;
	        var maskLen = mask.length;
	        var valueLen = value.length;
	        var oldValueLen = oldValue.length;
	        var prefixLen = this.getPrefix().length;
	        var clearedValue;

	        if (valueLen > oldValueLen) {
	            var substrLen = valueLen - oldValueLen;
	            var startPos = selection.end - substrLen;
	            var enteredSubstr = value.substr(startPos, substrLen);

	            if (startPos < maskLen && (substrLen !== 1 || enteredSubstr !== mask[startPos])) {
	                caretPos = this.getRightEditablePos(startPos);
	            } else {
	                caretPos = startPos;
	            }

	            value = value.substr(0, startPos) + value.substr(startPos + substrLen);

	            clearedValue = this.clearRange(value, startPos, maskLen - startPos);
	            clearedValue = this.insertRawSubstr(clearedValue, enteredSubstr, caretPos);

	            value = this.insertRawSubstr(oldValue, enteredSubstr, caretPos);

	            if (substrLen !== 1 || caretPos >= prefixLen && caretPos < lastEditablePos) {
	                caretPos = this.getFilledLength(clearedValue);
	            } else if (caretPos < lastEditablePos) {
	                caretPos++;
	            }
	        } else if (valueLen < oldValueLen) {
	            var removedLen = maskLen - valueLen;
	            clearedValue = this.clearRange(oldValue, selection.end, removedLen);
	            var substr = value.substr(0, selection.end);
	            var clearOnly = substr === oldValue.substr(0, selection.end);

	            if (maskChar) {
	                value = this.insertRawSubstr(clearedValue, substr, 0);
	            }

	            clearedValue = this.clearRange(clearedValue, selection.end, maskLen - selection.end);
	            clearedValue = this.insertRawSubstr(clearedValue, substr, 0);

	            if (!clearOnly) {
	                caretPos = this.getFilledLength(clearedValue);
	            } else if (caretPos < prefixLen) {
	                caretPos = prefixLen;
	            }
	        }
	        value = this.formatValue(value);

	        // prevent android autocomplete insertion on backspace
	        // prevent hanging after first entered character on Windows 10 Mobile
	        if (!this.isAndroidBrowser && !this.isWindowsPhoneBrowser) {
	            target.value = value;

	            if (value && !this.getInputValue()) {
	                if (this.isAndroidFirefox) {
	                    this.value = value;
	                    this.enableValueAccessors();
	                }
	                this.preventEmptyChange = true;
	                setTimeout(function () {
	                    _this6.preventEmptyChange = false;
	                    _this6.disableValueAccessors();
	                }, 0);
	            }
	        }

	        this.setState({
	            value: this.hasValue ? this.state.value : value
	        });

	        if (typeof this.props.onChange === "function") {
	            this.props.onChange(event);
	        }
	        this.setCaretPos(caretPos);
	    },
	    onFocus: function (event) {
	        if (!this.state.value) {
	            var prefix = this.getPrefix();
	            var value = this.formatValue(prefix);
	            event.target.value = this.formatValue(value);

	            this.setState({
	                value: this.hasValue ? this.state.value : value
	            }, this.setCaretToEnd);

	            if (typeof this.props.onChange === "function") {
	                this.props.onChange(event);
	            }
	        } else if (this.getFilledLength() < this.mask.length) {
	            this.setCaretToEnd();
	        }

	        if (typeof this.props.onFocus === "function") {
	            this.props.onFocus(event);
	        }
	    },
	    onBlur: function (event) {
	        if (!this.props.alwaysShowMask && this.isEmpty(this.state.value)) {
	            event.target.value = "";
	            this.setState({
	                value: this.hasValue ? this.state.value : ""
	            });
	            if (typeof this.props.onChange === "function") {
	                this.props.onChange(event);
	            }
	        }

	        if (typeof this.props.onBlur === "function") {
	            this.props.onBlur(event);
	        }
	    },
	    onPaste: function (event) {
	        if (this.isAndroidBrowser) {
	            this.pasteSelection = this.getSelection();
	            event.target.value = "";
	            return;
	        }
	        var text;
	        if (window.clipboardData && window.clipboardData.getData) {
	            // IE
	            text = window.clipboardData.getData("Text");
	        } else if (event.clipboardData && event.clipboardData.getData) {
	            text = event.clipboardData.getData("text/plain");
	        }
	        if (text) {
	            var value = this.state.value;
	            var selection = this.getSelection();
	            this.pasteText(value, text, selection, event);
	        }
	        event.preventDefault();
	    },
	    pasteText: function (value, text, selection, event) {
	        var caretPos = selection.start;
	        if (selection.length) {
	            value = this.clearRange(value, caretPos, selection.length);
	        }
	        var textLen = this.getRawSubstrLength(value, text, caretPos);
	        value = this.insertRawSubstr(value, text, caretPos);
	        caretPos += textLen;
	        caretPos = this.getRightEditablePos(caretPos) || caretPos;
	        if (value !== this.getInputDOMNode().value) {
	            if (event) {
	                event.target.value = value;
	            }
	            this.setState({
	                value: this.hasValue ? this.state.value : value
	            });
	            if (event && typeof this.props.onChange === "function") {
	                this.props.onChange(event);
	            }
	        }
	        this.setCaretPos(caretPos);
	    },
	    componentDidMount: function () {
	        this.isAndroidBrowser = this.isAndroidBrowser();
	        this.isWindowsPhoneBrowser = this.isWindowsPhoneBrowser();
	        this.isAndroidFirefox = this.isAndroidFirefox();

	        if (this.mask && this.props.value == null) {
	            this.updateUncontrolledInput();
	        }
	    },
	    render: function () {
	        var _this7 = this;

	        var props = this.props;

	        if (this.mask) {
	            var componentKeys = ["mask", "alwaysShowMask", "maskChar", "formatChars"];
	            var handlersKeys = ["onFocus", "onBlur", "onChange", "onKeyDown", "onKeyPress", "onPaste"];
	            props = _extends({}, props);
	            componentKeys.forEach(function (key) {
	                delete props[key];
	            });
	            handlersKeys.forEach(function (key) {
	                props[key] = _this7[key];
	            });

	            if (props.value != null) {
	                props.value = this.state.value;
	            }
	        }
	        return React.createElement("input", _extends({ ref: "input" }, props));
	    }
	});

	module.exports = InputElement;

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var React = __webpack_require__(1);
	var FormioComponent = __webpack_require__(3);

	module.exports = React.createClass({
	  displayName: 'Fieldset',
	  render: function render() {
	    var legend = this.props.component.legend ? React.createElement(
	      'legend',
	      null,
	      this.props.component.legend
	    ) : '';
	    return React.createElement(
	      'fieldset',
	      null,
	      legend,
	      this.props.component.components.map(function (component) {
	        var value = this.props.data && this.props.data.hasOwnProperty(component.key) ? this.props.data[component.key] : component.defaultValue || '';
	        return React.createElement(FormioComponent, _extends({}, this.props, {
	          key: component.key,
	          name: component.key,
	          component: component,
	          value: value
	        }));
	      }.bind(this))
	    );
	  }
	});

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(1);

	module.exports = React.createClass({
	  displayName: 'Hidden',
	  render: function render() {
	    var value = this.props.data && this.props.data.hasOwnProperty(this.props.component.key) ? this.props.data[this.props.component.key] : '';
	    return React.createElement('input', { type: 'hidden', id: this.props.component.key, name: this.props.component.key, value: value });
	  }
	});

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(1);
	var valueMixin = __webpack_require__(14);
	var multiMixin = __webpack_require__(15);

	module.exports = React.createClass({
	  displayName: 'Number',
	  mixins: [valueMixin, multiMixin],
	  getSingleElement: function getSingleElement(value, index) {
	    index = index || 0;
	    value = value || 0;
	    return React.createElement('input', {
	      type: this.props.component.inputType,
	      className: 'form-control',
	      id: this.props.component.key,
	      'data-index': index,
	      name: this.props.name,
	      value: value,
	      disabled: this.props.readOnly,
	      placeholder: this.props.component.placeholder,
	      mask: this.props.component.inputMask,
	      min: this.props.component.validate.min,
	      max: this.props.component.validate.max,
	      step: this.props.component.validate.step,
	      onChange: this.onChange
	    });
	  }
	});

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var React = __webpack_require__(1);
	var FormioComponent = __webpack_require__(3);

	module.exports = React.createClass({
	  displayName: 'Panel',
	  render: function render() {
	    var title = this.props.component.title ? React.createElement(
	      'div',
	      { className: 'panel-heading' },
	      React.createElement(
	        'h3',
	        { className: 'panel-title' },
	        this.props.component.title
	      )
	    ) : '';
	    var className = 'panel panel-' + this.props.component.theme;
	    return React.createElement(
	      'div',
	      { className: className },
	      title,
	      React.createElement(
	        'div',
	        { className: 'panel-body' },
	        this.props.component.components.map(function (component, index) {
	          var value = this.props.data && this.props.data.hasOwnProperty(component.key) ? this.props.data[component.key] : component.defaultValue || '';
	          var key = this.props.component.key ? this.props.component.key : this.props.component.type + index;
	          return React.createElement(FormioComponent, _extends({}, this.props, {
	            key: key,
	            name: component.key,
	            component: component,
	            value: value
	          }));
	        }.bind(this))
	      )
	    );
	  }
	});

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(1);
	var valueMixin = __webpack_require__(14);
	var multiMixin = __webpack_require__(15);
	var inputMixin = __webpack_require__(20);

	module.exports = React.createClass({
	  displayName: 'Password',
	  mixins: [valueMixin, multiMixin, inputMixin]
	});

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(1);
	var valueMixin = __webpack_require__(14);
	var multiMixin = __webpack_require__(15);
	var inputMixin = __webpack_require__(20);

	module.exports = React.createClass({
	  displayName: 'PhoneNumber',
	  mixins: [valueMixin, multiMixin, inputMixin]
	});

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(1);
	var valueMixin = __webpack_require__(14);
	var multiMixin = __webpack_require__(15);

	module.exports = React.createClass({
	  displayName: 'Radio',
	  mixins: [valueMixin, multiMixin],
	  onChangeRadio: function onChangeRadio(event) {
	    var value = event.currentTarget.id;
	    this.setValue(value, 0);
	  },
	  getSingleElement: function getSingleElement(value, index) {
	    index = index || 0;
	    return React.createElement(
	      'div',
	      { className: 'radio-wrapper' },
	      this.props.component.values.map(function (v, id) {
	        return React.createElement(
	          'div',
	          { key: id, className: 'radio' },
	          React.createElement(
	            'label',
	            { className: 'control-label' },
	            React.createElement('input', {
	              type: this.props.component.inputType,
	              id: v.value,
	              'data-index': index,
	              name: this.props.component.key,
	              checked: v.value === this.state.value,
	              disabled: this.props.readOnly,
	              onChange: this.onChangeRadio
	            }),
	            v.label
	          )
	        );
	      }.bind(this))
	    );
	  }
	});

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var React = __webpack_require__(1);
	var FormioComponent = __webpack_require__(3);

	module.exports = React.createClass({
	  displayName: 'Panel',
	  render: function render() {
	    var title = this.props.component.title ? React.createElement(
	      'div',
	      { className: 'panel-heading' },
	      React.createElement(
	        'h3',
	        { className: 'panel-title' },
	        this.props.component.title
	      )
	    ) : '';
	    var tableClasses = 'table';
	    tableClasses += this.props.component.striped ? ' table-striped' : '';
	    tableClasses += this.props.component.bordered ? ' table-bordered' : '';
	    tableClasses += this.props.component.hover ? ' table-hover' : '';
	    tableClasses += this.props.component.condensed ? ' table-condensed' : '';
	    return React.createElement(
	      'div',
	      { className: 'table-responsive' },
	      title,
	      React.createElement(
	        'table',
	        { className: tableClasses },
	        React.createElement(
	          'thead',
	          null,
	          this.props.component.header.map(function (header, index) {
	            return React.createElement(
	              'th',
	              { key: index },
	              header
	            );
	          }.bind(this))
	        ),
	        React.createElement(
	          'tbody',
	          null,
	          this.props.component.rows.map(function (row, index) {
	            return React.createElement(
	              'tr',
	              { key: index },
	              row.map(function (column, index) {
	                return React.createElement(
	                  'td',
	                  { key: index },
	                  column.components.map(function (component, index) {
	                    var value = this.props.data && this.props.data.hasOwnProperty(component.key) ? this.props.data[component.key] : component.defaultValue || '';
	                    var key = component.key ? component.key : component.type + index;
	                    return React.createElement(FormioComponent, _extends({}, this.props, {
	                      key: key,
	                      name: component.key,
	                      component: component,
	                      value: value
	                    }));
	                  }.bind(this))
	                );
	              }.bind(this))
	            );
	          }.bind(this))
	        )
	      )
	    );
	  }
	});

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(1);
	var valueMixin = __webpack_require__(14);
	var multiMixin = __webpack_require__(15);

	module.exports = React.createClass({
	  displayName: 'Textarea',
	  mixins: [valueMixin, multiMixin],
	  getSingleElement: function getSingleElement(value, index) {
	    index = index || 0;
	    return React.createElement('textarea', {
	      className: 'form-control',
	      key: index,
	      id: this.props.component.key,
	      'data-index': index,
	      name: this.props.name,
	      value: value,
	      disabled: this.props.readOnly,
	      placeholder: this.props.component.placeholder,
	      rows: this.props.component.rows,
	      onChange: this.onChange
	    });
	  }
	});

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(1);
	var valueMixin = __webpack_require__(14);
	var multiMixin = __webpack_require__(15);
	var inputMixin = __webpack_require__(20);

	module.exports = React.createClass({
	  displayName: 'Textfield',
	  mixins: [valueMixin, multiMixin, inputMixin]
	});

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var React = __webpack_require__(1);
	var FormioComponent = __webpack_require__(3);

	module.exports = React.createClass({
	  displayName: 'Well',
	  render: function render() {
	    return React.createElement(
	      'div',
	      { className: 'well' },
	      this.props.component.components.map(function (component) {
	        var value = this.props.data && this.props.data.hasOwnProperty(component.key) ? this.props.data[component.key] : component.defaultValue || '';
	        return React.createElement(FormioComponent, _extends({}, this.props, {
	          key: component.key,
	          name: component.key,
	          component: component,
	          value: value
	        }));
	      }.bind(this))
	    );
	  }
	});

/***/ }
/******/ ])
});
;