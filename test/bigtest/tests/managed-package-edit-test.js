import { expect } from 'chai';
import { describe, beforeEach, it } from '@bigtest/mocha';

import setupApplication from '../helpers/setup-application';
import PackageShowPage from '../interactors/package-show';
import PackageEditPage from '../interactors/package-edit';

describe('ManagedPackageEdit', function () {
  setupApplication({
    scenarios: ['managedPackageEdit']
  });

  describe('visiting the package edit page without coverage dates', () => {
    beforeEach(async function () {
      this.visit('/eholdings/packages/testId/edit');
      await PackageEditPage.whenLoaded();
    });

    it('shows blank datepicker fields', () => {
      expect(PackageEditPage.dateRangeRowList(0).beginDate.inputValue).to.equal('');
      expect(PackageEditPage.dateRangeRowList(0).endDate.inputValue).to.equal('');
    });

    describe('clicking cancel', () => {
      beforeEach(async () => {
        await PackageEditPage.clickCancel();
        await PackageShowPage.whenLoaded();
      });

      it('goes to the package show page', () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    describe('entering invalid data', () => {
      beforeEach(async () => {
        await PackageEditPage.dateRangeRowList(0).fillDates('12/18/2018', '12/16/2018');
        await PackageEditPage.clickSave();
      });

      it('displays a validation error for coverage', () => {
        expect(PackageEditPage.dateRangeRowList(0).beginDate.isInvalid).to.be.true;
      });
    });

    describe('entering valid data', () => {
      beforeEach(async () => {
        await PackageEditPage.dateRangeRowList(0).fillDates('12/16/2018', '12/18/2018');
      });

      describe('clicking cancel', () => {
        beforeEach(async () => {
          await PackageEditPage.clickCancel();
        });

        it('shows a navigation confirmation modal', () => {
          expect(PackageEditPage.navigationModal.$root).to.exist;
        });
      });

      describe('clicking save', () => {
        beforeEach(async () => {
          await PackageEditPage.clickSave();
          await PackageShowPage.whenLoaded();
        });

        it('goes to the package show page', () => {
          expect(PackageShowPage.$root).to.exist;
        });

        it('displays the new coverage dates', () => {
          expect(PackageShowPage.customCoverage).to.equal('12/16/2018 - 12/18/2018');
        });

        it('shows a success toast message', () => {
          expect(PackageShowPage.toast.successText).to.equal('Package saved.');
        });
      });
    });
  });

  describe('encountering a server error when PUTting', () => {
    beforeEach(async function () {
      await this.server.put('/packages/:id', {
        errors: [{
          title: 'There was an error'
        }]
      }, 500);

      this.visit('/eholdings/packages/testId/edit');
      await PackageEditPage.whenLoaded();
    });

    describe('entering valid data and clicking save', () => {
      beforeEach(async () => {
        await PackageEditPage.dateRangeRowList(0).fillDates('12/16/2018', '12/18/2018');
        await PackageEditPage.clickSave();
      });

      it('pops up an error', () => {
        expect(PackageEditPage.toast.errorText).to.equal('There was an error');
      });
    });
  });

  describe('visiting the package show page', () => {
    beforeEach(async function () {
      this.visit('/eholdings/packages/testId');
      await PackageEditPage.whenLoaded();
    });

    describe('clicking the edit button', () => {
      beforeEach(async () => {
        await PackageShowPage.clickEditButton();
      });

      it('should display the back button in pane header', () => {
        expect(PackageEditPage.hasBackButton).to.be.true;
      });
    });
  });
});

describe('ManagedPackageEdit visiting the package edit page with coverage dates', () => {
  setupApplication({
    scenarios: ['managedPackageEditWithCustomCoverage']
  });

  beforeEach(async function () {
    this.visit('/eholdings/packages/managedPackageEditWithCustomCoverage/edit');
    await PackageEditPage.whenLoaded();
  });

  describe('clicking cancel', () => {
    beforeEach(async () => {
      await PackageEditPage.clickCancel();
      await PackageShowPage.whenLoaded();
    });

    it('goes to the package show page', () => {
      expect(PackageShowPage.$root).to.exist;
    });
  });

  describe('entering invalid data', () => {
    beforeEach(async () => {
      await PackageEditPage.dateRangeRowList(0).fillDates('12/18/2018', '12/16/2018');
      await PackageEditPage.clickSave();
    });

    it('displays a validation error for coverage', () => {
      expect(PackageEditPage.dateRangeRowList(0).beginDate.isInvalid).to.be.true;
    });
  });

  describe('entering valid data', () => {
    beforeEach(async () => {
      await PackageEditPage.dateRangeRowList(0).fillDates('12/16/2018', '12/18/2018');
    });

    describe('clicking cancel', () => {
      beforeEach(async () => {
        await PackageEditPage.clickCancel();
      });

      it('shows a navigation confirmation modal', () => {
        expect(PackageEditPage.navigationModal.$root).to.exist;
      });
    });

    describe('clicking save', () => {
      beforeEach(async () => {
        await PackageEditPage.clickSave();
        await PackageShowPage.whenLoaded();
      });

      it('goes to the package show page', () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });
  });
});

describe('ManagedPackageEdit encountering a server error when GETting', () => {
  setupApplication({
    scenarios: ['managedPackageEditError']
  });

  beforeEach(async function () {
    this.visit('/eholdings/packages/testId/edit');
  });

  it('dies with dignity', () => {
    expect(PackageEditPage.hasErrors).to.be.true;
  });
});
