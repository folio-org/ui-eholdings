# ui-eholdings

[![Build Status](https://travis-ci.org/folio-org/ui-eholdings.svg?branch=master)](https://travis-ci.org/folio-org/ui-eholdings)

Copyright (C) 2017-2018 The Open Library Foundation

This software is distributed under the terms of the Apache License,
Version 2.0. See the file "[LICENSE](LICENSE)" for more information.

## Introduction
The `ui-eholdings` module adds the ability to manage electronic holdings in FOLIO. The first supported knowledge base is from EBSCO.

## Prerequisites

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (at least version 8)
* [Yarn](https://yarnpkg.com/)

## Installation

* `git clone https://github.com/folio-org/ui-eholdings`
* `cd ui-eholdings`
* `yarn`

## Running

* `yarn start`
* Visit your app at [http://localhost:8080](http://localhost:8080).

On Windows: 
If you encounter problems trying to run your app on Windows, specifically, with NODE_ENV:

* Set environment variable NODE_ENV=development
  `SET NODE_ENV=development` if running from Windows command prompt
  `export NODE_ENV=development` if running from Cygwin on Windows
* Edit ui-eholdings/package.json to remove `NODE_ENV=development` from scripts object

By default, this will use the backend OKAPI cluster at
https://okapi.frontside.io However, if you want to run the application
against the mirage server contained within the browser, you can turn
it on with the `--mirage` option:

* `yarn start --mirage`

## Running Tests

* `yarn test` (uses Karma and Mocha to test the application)

To add Istanbul instrumentation and a code coverage report:
* `yarn test --coverage`

## Building

* `yarn build`
