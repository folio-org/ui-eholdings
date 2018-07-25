/* global describe, beforeEach */
/* istanbul ignore file */
import chai from 'chai';
import chaiJquery from 'chai-jquery';
import $ from 'jquery';
import Convergence from '@bigtest/convergence';
import { setupAppForTesting } from '@bigtest/react';
import startMirage from '../network/start';
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
    beforeEach(async function () {
      this.app = await setupAppForTesting(TestHarness, {
        mountId: 'react-testing',

        setup: () => {
          this.server = startMirage(setup.scenarios);
          this.server.logging = false;

          this.server.block = function block() {
            let { pretender } = this;
            let blocks = [];
            let _handlerFor = pretender._handlerFor;
            pretender._handlerFor = (...args) => {
              return {
                handler(request) {
                  return new Promise((resolve, reject) => {
                    blocks.push(() => {
                      try {
                        resolve(_handlerFor.apply(pretender, args).handler(request));
                      } catch (error) {
                        reject(error);
                      }
                    });
                  });
                }
              };
            };
            this.block = () => { throw new Error('called block() when the mirage server is already blocked'); };
            this.unblock = function unblock() {
              pretender._handlerFor = _handlerFor;
              blocks.forEach(unblocker => unblocker());
              this.block = block;
              delete this.unblock;
            };
          };
        },

        teardown: () => {
          this.server.shutdown();
        }
      });

      document.getElementById('react-testing').style.height = '100%';
      this.visit = visit.bind(null, this); // eslint-disable-line no-use-before-define
    });

    let doSetup = typeof setup.suite === 'function' ? setup.suite : setup;
    doSetup.call(this);
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
 * @param {String|Location} path - where to navigate.
 * @param {Function} convergenceCheck - assertion to run to ensure
 * that the navigation worked.
 * @return {Promise} resolved when navigation is complete.
 */
function visit(context, path, convergenceCheck) {
  return new Convergence()
    .do(() => context.app.visit(path))
    .when(convergenceCheck);
}
