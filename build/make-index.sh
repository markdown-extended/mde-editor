#!/usr/bin/env bash

./vendor/piwi/markdown-extended/bin/markdown-extended -v --output=index.html --template=build/index-template.html README.md \
    && echo "OK - index.html rebuilt" \
    || echo "ERROR!";
