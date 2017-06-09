// require all modules except index.js from the current directory and all subdirectories
const testsContext = require.context(".", true);
testsContext.keys().forEach(path => {
  if (path !== './index' && path !== './index.js') {
	  testsContext(path);
  }
});
