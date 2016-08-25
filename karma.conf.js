module.exports = function (config) {
  config.set({
    frameworks: ['browserify', 'mocha'],
    files: [
      'test.js',
      'decorate-test.js'
    ],
    preprocessors: {
      '*.js': 'browserify'
    },
    reporters: ['progress', 'coverage'],
    browserify: {
      debug: true,
      transform: ['browserify-istanbul']
    },
    browsers: ['PhantomJS']
  })
}
