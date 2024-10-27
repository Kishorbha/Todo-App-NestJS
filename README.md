# Task Management API

This API is specifically built for the learning purpose.

## Table of Contents

- [Task Management API](#tasks-api)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Install dependencies](#install-dependencies)
  - [Setup local environment variables](#setup-local-environment-variables)
  - [Running locally](#running-locally)
  - [API documentation](#api-documentation)
    - [Preview docs](#preview-docs)
    - [Build docs](#build-docs)
  - [Testing](#testing)
  - [Code conventions](#code-conventions)
    - [Codebase](#codebase)
    - [Docs](#docs)
    - [Type safety](#type-safety)
  - [Miscellaneous](#miscellaneous)
    - [Tech Stack](#tech-stack)
    - [Third party services](#third-party-services)

## Prerequisites

- Install Node.js version 20.

## Install dependencies

1. Clone the repo.
2. Install the dependencies by running `pnpm install`.

## Setup local environment variables

1. Create `misc.env` file in root directory.
2. Get `NOTION_INTEGRATE_API_KEY` from your project mate and paste in `misc.env` file
3. Run `pnpm secrets local` to sync local envs from NOTION database.

## Running locally

Start the server:

```
pnpm local
```

API will be available at `http://localhost:9000`

## API documentation

This project uses OpenAPI Specification for API documentation. You can find the OpenAPI specification file inside `openapi/` folder and API changelog inside `changelog` folder.

### Preview docs

```
pnpm preview
```

Visit `http://localhost:8080` in your browser to view.

### Build docs

```
pnpm build-docs
```

You'll find `oas.html` file in the root directory.

## Testing

To run test suite:

```
pnpm test
```

## Code conventions

### Codebase

We have used Nest.js framework to this API with some addons.

1. Every modules are inside `modules/` folder.
2. Global code like config, constants (response messages), dto, filters, guards, middlewares, pipes, types, utils, validators are inside `src/` folder.
3. Scripts used in the npm scripts or to perform some miscellaneous task are inside `scripts/` folder.

### Docs

Since we use OpenAPI specification for writing API docs, we have our docs file structure similar to to Nest.js framework and can be found inside `openapi` folder.

1. Each major version will have different base folder named as `openapi/v1/**`, `openapi/v2/**`, `openapi/v3/**`.
2. Inside `openapi/v1/` folder, we should see `index.yml` which is the entry file. There is also a `description.yml` and `paths.yml` referenced in `index.yml` file so that it would be easier to maintain the docs.
3. `shared/` folder should exist inside each base folder which contains commonly used objects through out the API Docs.
4. Finally there is a `modules/` folder which is identical to our codebase `modules/` folder
5. API routes are inside the `openapi/v1/modules/controllers/` folder and the files are named after their route name.
6. Path name should be separated with `_` underscore instead of `/` slashes while naming filenames inside `controllers` folder. `{}` should be used for filenames that contain dynamic routes.
7. If the routes contain multiple methods, it should be inside same file.

### Type safety

1. `openapi-typescript` is used to generate oas types.
2. Every dto and serializers that exists in codebase should implement oas schema types.
3. Run `pnpm oas-types` to generate oas types. Types will be generated in `src/types/oas.type.ts`.

## Miscellaneous

### Tech Stack

1. NestJS
2. Typescript
3. MongoDB & Mongoose
4. JWT
5. class validator

### Third party services

1. Mongodb Atlas
