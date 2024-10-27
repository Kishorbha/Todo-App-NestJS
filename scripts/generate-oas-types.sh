#!/usr/bin/env bash

VERSION="$1";

if [ -z "$VERSION" ]; then 
  VERSION=$(npm pkg get version | cut -c 2); 
fi

pnpx openapi-typescript openapi/v1/index.yml --output src/types/oas.type.ts -t
