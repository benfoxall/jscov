## A tool for displaying code coverage of js files in the browser

Note. The current implementation is more 'proof of concept' and - ironically - totally untested.

The general idea is to convert the js into a format that will track which lines are executed (like [JSCoverage](http://siliconforks.com/jscoverage/)) - though instead of doing this server side, this script does the conversion in the browser on page load.

### usage

Include your js files with the type of 'text/x-cov-javascript' and then include jscov.js.

    <script src="yourcode.js" type="text/x-cov-javascript" charset="utf-8"></script>
    <script src="jscov.js" type="text/javascript" charset="utf-8"></script>

This will request 'yourcode.js' via xhr, add markers to the code and re-insert it into a new script tag.

Including this file also gives access to a hacky ui for displaying the files and their coverage, once you've tested your code, call `_$jscov.report();` to display list the js files and their code coverage

### current limitations

 * This currently won't work through `file:` protocol.
 * The instrumentation (adding markers) is massively basic, it might miss sections or even break stuff.
 * document.scripts won't work in FF < 9.

[![Alt text](http://s3.bfoxall.com/jscov/screenshot.png)](http://s3.bfoxall.com/jscov/example/example.html) 