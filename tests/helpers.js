/* global describe, beforeEach, afterEach */
import React from 'react';
import chai from 'chai';
import chaiJquery from 'chai-jquery';
import $ from 'jquery';
import { render, unmountComponentAtNode } from 'react-dom';
import { convergeOn } from './it-will';
import TestHarness from './harness';

// use jquery matchers
chai.use((chai, utils) => chaiJquery(chai, utils, $)); // eslint-disable-line no-shadow

// helper to trigger native change events for react elements
export { default as triggerChange } from 'react-trigger-change';

/**
 * Sets up the entire Folio application with mirage, mounts it, and tears it down
 * Use this helper for end-to-end acceptance testing intead of the normal 'describe'
 *
 * ```
 * describeApplication('Acceptance', function() {
 *   it('should show something awesome', function() {
 *     expect($('h1')).to.have.text('something awesome');
 *   });
 * })
 * ```
 * @param {String} name - name of the test suite, passed to mocha's `describe`
 * @param {Function} setup - suite definition, also passed to `describe`
 */
export function describeApplication(name, setup, describe = window.describe) {
  describe(name, function () {
    let rootElement;

    beforeEach(function () {
      rootElement = document.createElement('div');
      rootElement.id = 'react-testing';
      document.body.appendChild(rootElement);

      this.app = render(<TestHarness />, rootElement);
      this.server = this.app.mirage;
      this.server.logging = false;

      this.visit = visit.bind(null, this); // eslint-disable-line no-use-before-define
    });

    afterEach(() => {
      unmountComponentAtNode(rootElement);
      document.body.removeChild(rootElement);
      rootElement = null;
    });

    setup.call(this);
  });
}

describeApplication.skip = describe.skip;
describeApplication.only = function (name, setup) {
  return describeApplication(name, setup, describe.only);
};


/**
 * Triggers a navigation, and ensures that it happens correctly.
 *
 * In order to run an acceptance test, you need to navigate to various
 * parts of the application and then make assertions on them. However,
 * you don't want to start making assertions until you know that you
 * went somewhere.
 *
 * `visit` return a promise that resolves when `convergenceCheck` has
 * been met.
 *
 *   // tests will not continue until the convergence check has been made.
 *   beforeEach(function() {
 *     this.app = render(<TestHarness/>, rootElement);
 *     return visit(this, '/eholdings', function() {
 *       expect($('[data-my-app]')).to.exist;
 *     });
 *   });
 *
 * @param {Object} context - a mocha test context.
 * @param {string|Location} - where to navigate.
 * @param {function} - assertion to run to ensure that the navigation
 * worked.
 * @return {Promise} resolved when navigation is complete.
 */
function visit(context, path, convergenceCheck) {
  if (context.app) {
    context.app.visit(path);
  }

  return convergeOn.call(context, convergenceCheck);
}

/**
 * Returns a promise that doesn't resolve to make the test wait forever
 */
window.pauseTest = pauseTest; // eslint-disable-line no-use-before-define
export function pauseTest(context) {
  if (context) context.timeout(0);
  return new Promise(() => {});
}
