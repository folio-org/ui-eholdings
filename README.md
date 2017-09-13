# Folio e-holdings application

[![Build Status](https://travis-ci.org/thefrontside/ui-eholdings.svg?branch=master)](https://travis-ci.org/thefrontside/ui-eholdings)

## Prerequisites

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (at least version 8)
* [Yarn](https://yarnpkg.com/)

## Installation

* `git clone https://github.com/thefrontside/ui-eholdings`
* `cd ui-eholdings`
* `yarn`

## Running

* `yarn start`
* Visit your app at [http://localhost:8080](http://localhost:8080).

By default, this will use the backend OKAPI cluster at
https://okapi.frontside.io However, if you want to run the application
against the mirage server contained within the browser, you can turn
it on with the `--mirage` option:

* `yarn start --mirage`

## Running Tests

* `yarn test` (uses Karma and Mocha to test the application)

## Building

* `yarn build`
