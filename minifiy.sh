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
html-minifier $HTMLCurrOpts _index.html > index.html
echo "_index.html:" `wc _index.html | awk '{print $3}'` "->" `wc index.html | awk '{print $3}'`

