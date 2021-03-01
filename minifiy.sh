#! /usr/bin/env bash

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

# npm install html-minifier --global
html-minifier $HTMLCurrOpts index.dev.html >index.html
before=$(wc index.dev.html | awk '{print $3}')
after=$(wc index.html | awk '{print $3}')
change=$((100 * after / before - 100))
echo "index.dev.html: $before -> $after ($change%)"

# npm install csso-cli --global
csso assets/css/style.css --output assets/css/style.min.css
before=$(wc assets/css/style.css | awk '{print $3}')
after=$(wc assets/css/style.min.css | awk '{print $3}')
change=$((100 * after / before - 100))
echo "assets/css/style.css: $before -> $after ($change%)"

# npm install npx --global && npm install google-closure-compiler --global
npx google-closure-compiler \
  --js=assets/js/echo-1.7.3.js \
  --js_output_file=assets/js/echo-1.7.3.min.js \
  --compilation_level SIMPLE
before=$(wc assets/js/echo-1.7.3.js | awk '{print $3}')
after=$(wc assets/js/echo-1.7.3.min.js | awk '{print $3}')
change=$((100 * after / before - 100))
echo "assets/js/echo-1.7.3.js: $before -> $after ($change%)"

npx google-closure-compiler \
  --js=assets/js/echo-driver.js \
  --js_output_file=assets/js/echo-driver.min.js \
  --compilation_level SIMPLE
before=$(wc assets/js/echo-driver.js | awk '{print $3}')
after=$(wc assets/js/echo-driver.min.js | awk '{print $3}')
change=$((100 * after / before - 100))
echo "assets/js/echo-driver.js: $before -> $after ($change%)"

npx google-closure-compiler \
  --js=assets/js/header-animation.js \
  --js_output_file=assets/js/header-animation.min.js \
  --compilation_level SIMPLE
before=$(wc assets/js/header-animation.js | awk '{print $3}')
after=$(wc assets/js/header-animation.min.js | awk '{print $3}')
change=$((100 * after / before - 100))
echo "assets/js/header-animation.js: $before -> $after ($change%)"
