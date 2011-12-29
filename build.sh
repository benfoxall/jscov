echo ';(function(){' > jscov.js

cat src/base.js >> jscov.js
cat src/instrument.js >> jscov.js
cat src/report.js >> jscov.js

echo '})();' >> jscov.js

# uglifyjs jscov.js > jscov.min.js