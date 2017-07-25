/* global describe, beforeEach, afterEach */
import React from 'react';
import chai from 'chai';
import chaiJquery from 'chai-jquery';
import $ from 'jquery';
import { render, unmountComponentAtNode } from 'react-dom';

import App from '../src/components/app';

// use jquery matchers
chai.use((chai, utils) => chaiJquery(chai, utils, $));

/*
 * TODO: FIX THIS DESCRIPTION
 * Sets up the entire Folio application, mounts it with enzyme, and tears it down
 * Use this helper for end-to-end acceptance testing intead of the normal 'describe'
 *
 * The Enzyme wrapper instance is stored as `$` in the testing context so you can use
 * it inside of your assertions.
 *
 * ```
 * describeApplication('Acceptance', function() {
 *   it('should show something awesome', function() {
 *     expect(this.$.find('h1')).to.have.text('something awesome');
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
    });

    afterEach(function() {
      unmountComponentAtNode(rootElement);
      document.body.removeChild(rootElement);
      rootElement = null;
    });

    setup.call(this);
  });
}
