# vue-computed-promise
Plugin for Vue.js, allows promises to be returned for computed properties


[![NPM](https://nodei.co/npm/vue-computed-promise.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/vue-computed-promise/)


## Install

```
$ npm install vue-computed-promise
```

## Usage

Add the plugin:

```
const VueComputedPromise = require('vue-computed-promise'); // alternatively use script tag
Vue.use(VueComputedPromise);
```

Now you can return a Promise from a computed property:

```
var vue = new Vue({
  el: "#app",
  data: {
    one: 1,
    two: 2
  },
  computed: {
    oneplustwo: function() {
      var _one = this.$data.one;
      var _two = this.$data.two;
      return new Promise(function(resolve, reject) {
        setTimeout(0, function() {
          resolve(_one + _two);
        });
      });
    }
  }
})
```

Until the Promise resolves, the value of `null` is returned by the computed property.

In the example above `oneplustwo` is never re-computed. The Promise will only be called once (or never if the property is not used in the template).

To return a Promise which may be re-computed when reactive dependencies change, you will need to return a parameter-less function which in turn returns a Promise:

```
var vue = new Vue({
  el: "#app",
  data: {
    a: 1,
    b: 2,
    calculating: false,
    count: 0
  },
  computed: {
    result: function() {
      // these properties are reactive dependencies
      var _a = Number(this.a);
      var _b = Number(this.b);

      return () => {
        // properties only accessed within this function are not reactive dependencies
        var data = this.$data;
        data.calculating = true;

        return new Promise(function(resolve, reject) {
          setTimeout(function() {
            resolve(_a + _b);
            data.calculating = false;
            data.count++;
          }, 1000);
        });
      };
    }
  }
})
```

As the example shows, you also have control over which properties become dependencies: only properties accessed outside of the returned function will become dependencies.

## Contributions

I've only used this for a limited use case - but I'm happy to take pull requests to improve the plugin.
