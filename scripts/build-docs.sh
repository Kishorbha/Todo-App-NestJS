#!/usr/bin/env sh

VERSION="$1";

if [ -z "$VERSION" ]; then 
  VERSION=$(npm pkg get version | cut -c 2); 
fi

pnpm --package=@redocly/cli dlx redocly build-docs openapi/v1/index.yml -o oas.html
