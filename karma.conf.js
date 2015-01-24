module.exports = function (config) {
  config.set({
    frameworks: ['browserify', 'mocha'],
    files: [
      'node_modules/es5-shim/es5-shim.js',
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'test/*.js'
    ],
    preprocessors: {
      'test/*.js': 'browserify'
    },
    reporters: ['progress', 'coverage'],
    browserify: {
      debug: true
      transform: ['browserify-istanbul']
    },
    browsers: ['PhantomJS']
  });
}
