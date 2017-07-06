/* global describe, beforeEach, afterEach, it */
import { expect } from 'chai';

import { setupAppForAcceptanceTesting } from './helpers';

describe('Acceptance', function() {
  setupAppForAcceptanceTesting();

  it('should render the app', function() {
    expect(this.wrapper.find('h1')).to.have.text('Folio Resource Management');
  });
});
