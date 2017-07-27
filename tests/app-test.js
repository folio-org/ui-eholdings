/* global it */
import { expect } from 'chai';

import { describeApplication } from './helpers';

describeApplication('Acceptance', function() {
  it('should render the app', function() {
    expect(this.$.find('h1')).to.have.text('Folio Resource Management');
  });
});
