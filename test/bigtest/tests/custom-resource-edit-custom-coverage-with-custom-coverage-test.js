import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import ResourceEditPage from '../interactors/resource-edit';
import ResourcePage from '../interactors/resource-show';

describe('CustomResourceEditCustomCoverage', function () {
  setupApplication({
    scenarios: ['customResourceEditCustomCoverageWithCustomCoverage']
  });

  describe('visiting a selected custom resource edit page with custom coverage', () => {
    beforeEach(async function () {
      await this.visit('/eholdings/resources/testId/edit');
      await ResourceEditPage.whenLoaded();
    });

    it('displays the date ranges', () => {
      expect(ResourceEditPage.dateRangeRowList(0).beginDate.inputValue).to.equal('12/16/2018');
      expect(ResourceEditPage.dateRangeRowList(0).endDate.inputValue).to.equal('12/19/2018');
    });

    describe('removing the only row', () => {
      beforeEach(async () => {
        await ResourceEditPage.dateRangeRowList(0).clickRemoveRowButton();
      });

      it('displays the saving will remove message', () => {
        expect(ResourceEditPage.hasSavingWillRemoveMessage).to.be.true;
      });

      it('enables the save button', () => {
        expect(ResourceEditPage.isSaveDisabled).to.be.false;
      });

      describe('clicking save', () => {
        beforeEach(async () => {
          await ResourceEditPage.clickSave();
          await ResourcePage.whenLoaded();
        });

        it('goes to the resource show page', () => {
          expect(ResourcePage.$root).to.exist;
        });

        it('does not display custom coverage dates', () => {
          expect(ResourcePage.hasCustomCoverageList).to.be.false;
        });
      });
    });
  });
});
