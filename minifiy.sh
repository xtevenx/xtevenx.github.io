#! /bin/bash

HTMLFullOpts="\
    --collapse-boolean-attributes \
    --collapse-inline-tag-whitespace \
    --collapse-whitespace \
    --conservative-collapse \
    --decode-entities  \
    --minify-css true \
    --minify-js true \
    --minify-urls true \
    --process-conditional-comments \
    --remove-attribute-quotes \
    --remove-comments \
    --remove-empty-attributes \
    --remove-empty-elements \
    --remove-optional-tags \
    --remove-redundant-attributes \
    --remove-script-type-attributes \
    --remove-style-link-type-attributes \
    --remove-tag-whitespace \
    --sort-attributes \
    --sort-class-name \
    --use-short-doctype"
HTMLCurrOpts="\
    --collapse-inline-tag-whitespace \
    --collapse-whitespace \
    --conservative-collapse \
    --minify-js true \
    --remove-attribute-quotes \
    --remove-comments
    --remove-optional-tags \
    --remove-tag-whitespace \
    --sort-attributes \
    --sort-class-name \
    --use-short-doctype"

# npm install html-minifier
html-minifier $HTMLCurrOpts index.dev.html > index.html
echo "index.dev.html:" `wc index.dev.html | awk '{print $3}'` "->" `wc index.html | awk '{print $3}'`

# npm install csso-cli
csso assets/css/style.css --output assets/css/style.min.css
echo "assets/css/style.css:" `wc assets/css/style.css | awk '{print $3}'` "->" `wc assets/css/style.min.css | awk '{print $3}'`

# npm install npx && npm install google-closure-compiler
npx google-closure-compiler --js=assets/js/echo-1.7.3.js --js_output_file=assets/js/echo-1.7.3.min.js --compilation_level SIMPLE
echo "assets/js/echo-1.7.3.js:" `wc assets/js/echo-1.7.3.js | awk '{print $3}'` "->" `wc assets/js/echo-1.7.3.min.js | awk '{print $3}'`

npx google-closure-compiler --js=assets/js/echo-driver.js --js_output_file=assets/js/echo-driver.min.js --compilation_level SIMPLE
echo "assets/js/echo-driver.js:" `wc assets/js/echo-driver.js | awk '{print $3}'` "->" `wc assets/js/echo-driver.min.js | awk '{print $3}'`

npx google-closure-compiler --js=assets/js/header-animation.js --js_output_file=assets/js/header-animation.min.js --compilation_level SIMPLE
echo "assets/js/header-animation.js:" `wc assets/js/header-animation.js | awk '{print $3}'` "->" `wc assets/js/header-animation.min.js | awk '{print $3}'`
