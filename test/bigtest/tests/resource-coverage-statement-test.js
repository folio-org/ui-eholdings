import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import ResourceShowPage from '../interactors/resource-show';

describe('ResourceCoverageStatement', () => {
  setupApplication();
  let pkg,
    title,
    resource;

  beforeEach(function () {
    pkg = this.server.create('package', 'withProvider');
    title = this.server.create('title');
    resource = this.server.create('resource', {
      package: pkg,
      title,
      isSelected: true
    });
  });

  describe('visiting the resource show page with a coverage statement', () => {
    beforeEach(function () {
      resource.coverageStatement = 'Only 90s kids would understand.';
      resource.save();

      this.visit(`/eholdings/resources/${resource.id}`);
    });

    it('displays the coverage statement', () => {
      expect(ResourceShowPage.coverageStatement).to.equal('Only 90s kids would understand.');
    });
  });

  describe('visiting the resource show page without a coverage statement', () => {
    beforeEach(function () {
      this.visit(`/eholdings/resources/${resource.id}`);
    });

    it.always('does not display the coverage statement', () => {
      expect(ResourceShowPage.hasCoverageStatement).to.be.false;
    });
  });

  describe('visiting the resource show page with title package not selected', () => {
    beforeEach(function () {
      resource.isSelected = false;
      resource.save();
      this.visit(`/eholdings/resources/${resource.id}`);
    });

    it.always('does not display the coverage statement section', () => {
      expect(ResourceShowPage.hasCoverageStatement).to.be.false;
    });

    it('displays a message that coverage cannot be edited on an unselected resource', () => {
      expect(ResourceShowPage.isNotSelectedCoverageMessagePresent).to.be.true;
    });
  });
});
