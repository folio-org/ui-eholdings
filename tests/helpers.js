/* global describe, beforeEach, afterEach */
import React from 'react';
import chai from 'chai';
import chaiJquery from 'chai-jquery';
import $ from 'jquery';
import { render, unmountComponentAtNode } from 'react-dom';
import startMirage from '../mirage';

import App from '../src/components/app';

// use jquery matchers
chai.use((chai, utils) => chaiJquery(chai, utils, $));

// helper to trigger native change events for react elements
export { default as triggerChange } from 'react-trigger-change';

/*
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
export function describeApplication(name, setup) {
  describe(name, function() {
    let rootElement;

    beforeEach(function() {
      rootElement = document.createElement('div');
      rootElement.id = 'react-testing';
      document.body.appendChild(rootElement);

      this.app = render(<App/>, rootElement);
      this.server = startMirage();
      this.server.logging = false;
    });

    afterEach(function() {
      this.server.shutdown();
      unmountComponentAtNode(rootElement);
      document.body.removeChild(rootElement);
      rootElement = null;
    });

    setup.call(this);
  });
}

/*
 * Returns a promise that doesn't resolve to make the test wait forever
 */
window.pauseTest = pauseTest;
export function pauseTest(context) {
  if (context) context.timeout(0);
  return new Promise(() => {});
}
