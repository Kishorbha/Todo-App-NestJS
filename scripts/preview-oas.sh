#!/usr/bin/env bash

VERSION="$1";

if [ -z "$VERSION" ]; then 
  VERSION=$(npm pkg get version | cut -c 2); 
fi

pnpm --package=@redocly/cli dlx redocly preview-docs openapi/v1/index.yml --port 8080
