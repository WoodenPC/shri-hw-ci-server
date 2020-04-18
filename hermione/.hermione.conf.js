module.exports = {
  baseUrl: 'http://localhost:3000',
  gridUrl: 'http://0.0.0.0:4444/wd/hub',
  retry: 3,
  browsers: {
    chrome: {
      desiredCapabilities: {
        browserName: 'chrome',
      },
    },
  },
  sets: {
    common: {
      files: [
        'tests/*.hermione.js'
      ]
    }
  },
  plugins: {
    'html-reporter/hermione': {
      path: "tests/hermione-html-reporter"
    }
  },
};
