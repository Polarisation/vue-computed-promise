(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.VueComputedPromise = factory());
}(this, (function () { 'use strict';

var VueComputedPromise = {
	install: function(Vue, options) {
		Vue.mixin({
			beforeCreate: function() {
				let oldData = this.$options.data;
				let oldComputed = this.$options.computed || {};

				// cerate placeholder data properties
				this.$options.data = function() {
					let newData = (
							(typeof oldData === 'function')
								? oldData.call(this)
								: oldData
						 ) || {};
					Object.keys(oldComputed).forEach(key => {
						newData[key + "VueComputedPromisePlaceholder"] = null;
					})
					return newData;
				};

				// wrap computed properties
				this.$options.computed = {};
				Object.keys(oldComputed).forEach(key => {
					let promiseInitiated = false;
					this.$options.computed[key] = function() {
						let data = this.$data;
						let result;
						// Computed property can be either object or function
						if (typeof oldComputed[key] === "object") {
							result = oldComputed[key];
						} else {
							result = oldComputed[key].call(this);
						}

						if(result && typeof result === "function" && result.length === 0) {
							if(!promiseInitiated) {
								promiseInitiated = true;
								var promise = result();
								if(promise && promise.then && promise.catch) { // looks like a Promise
										// var oldValue = data[key + "VueComputedPromisePlaceholder"];
										promise.then(r => {
											data[key + "VueComputedPromisePlaceholder"] = r;
										});
										// return placeholder until Promise result is ready
										return data[key + "VueComputedPromisePlaceholder"];
								} else { // not actually a promise
									throw new Error("VueComputedPromise: "+key+" function returned must return a Promise");
								}
							} else {
								promiseInitiated = false;
								return data[key + "VueComputedPromisePlaceholder"];
							}
						}

						if(result && result.then && result.catch) { // looks like a Promise
							result.then(r => {
								oldComputed[key] = () => r;  // ensure promise will not be called in loop

								// overwrite placeholder with final result of Promise
								data[key + "VueComputedPromisePlaceholder"] = r;
							})
							// return placeholder until Promise result is ready
							return data[key + "VueComputedPromisePlaceholder"];
						}

						else // standard vue behavior
							return result;
					}
				});
			}
		})
	}
};
return VueComputedPromise;

})));
