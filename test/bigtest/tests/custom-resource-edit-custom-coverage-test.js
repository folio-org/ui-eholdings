import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import moment from 'moment';

import setupApplication from '../helpers/setup-application';
import ResourceEditPage from '../interactors/resource-edit';

describe('CustomResourceEditCustomCoverage', function () {
  setupApplication({
    scenarios: ['customResourceEditCustomCoverageWithMultipleCustomCoverages']
  });

  describe('visiting a selected custom resource edit page with multiple custom coverages', () => {
    beforeEach(async function () {
      this.visit('/eholdings/resources/testId/edit');
      await ResourceEditPage.whenLoaded();
    });

    it('displays correct number of rows for date ranges', () => {
      expect(ResourceEditPage.dateRangeRowList().length).to.equal(2);
    });

    it('all rows are filled with dates', () => {
      expect(moment(ResourceEditPage.dateRangeRowList(0).beginDate.inputValue).isValid()).to.be.true;
      expect(moment(ResourceEditPage.dateRangeRowList(0).endDate.inputValue).isValid()).to.be.true;
      expect(moment(ResourceEditPage.dateRangeRowList(1).beginDate.inputValue).isValid()).to.be.true;
      expect(moment(ResourceEditPage.dateRangeRowList(1).endDate.inputValue).isValid()).to.be.true;
    });
  });
});
