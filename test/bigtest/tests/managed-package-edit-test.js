import { expect } from 'chai';
import { describe, beforeEach, it } from '@bigtest/mocha';

import setupApplication from '../helpers/setup-application';
import PackageShowPage from '../interactors/package-show';
import PackageEditPage from '../interactors/package-edit';

describe('ManagedPackageEdit', () => {
  setupApplication();
  let provider,
    providerPackage;

  beforeEach(function () {
    provider = this.server.create('provider', {
      name: 'Cool Provider'
    });

    providerPackage = this.server.create('package', {
      provider,
      name: 'Cool Package',
      contentType: 'E-Book',
      isSelected: true
    });
  });

  describe('visiting the package edit page without coverage dates', () => {
    beforeEach(function () {
      this.visit(`/eholdings/packages/${providerPackage.id}/edit`);
    });

    it('shows blank datepicker fields', () => {
      expect(PackageEditPage.dateRangeRowList(0).beginDate.inputValue).to.equal('');
      expect(PackageEditPage.dateRangeRowList(0).endDate.inputValue).to.equal('');
    });

    it('disables the save button', () => {
      expect(PackageEditPage.isSaveDisabled).to.be.true;
    });

    describe('clicking close (navigate back) button', () => {
      beforeEach(() => {
        return PackageEditPage.clickBackButton();
      });

      it('goes to the package show page', () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    describe('entering invalid data', () => {
      beforeEach(() => {
        return PackageEditPage
          .dateRangeRowList(0).fillDates('12/18/2018', '12/16/2018')
          .clickSave();
      });

      it('displays a validation error for coverage', () => {
        expect(PackageEditPage.dateRangeRowList(0).beginDate.isInvalid).to.be.true;
      });
    });

    describe('entering valid data', () => {
      beforeEach(() => {
        return PackageEditPage.dateRangeRowList(0).fillDates('12/16/2018', '12/18/2018');
      });

      describe('clicking close (navigate back) button', () => {
        beforeEach(() => {
          return PackageEditPage.clickBackButton();
        });

        it('shows a navigation confirmation modal', () => {
          expect(PackageEditPage.navigationModal.$root).to.exist;
        });
      });

      describe('clicking save', () => {
        beforeEach(async () => {
          await PackageEditPage.clickSave();
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

  describe('visiting the package edit page with coverage dates', () => {
    beforeEach(function () {
      providerPackage.update('customCoverage', {
        beginCoverage: '1969-07-16',
        endCoverage: '1972-12-19'
      });
      providerPackage.save();

      this.visit(`/eholdings/packages/${providerPackage.id}/edit`);
    });

    it('disables the save button', () => {
      expect(PackageEditPage.isSaveDisabled).to.be.true;
    });

    describe('clicking close (navigate back) button', () => {
      beforeEach(() => {
        return PackageEditPage.clickBackButton();
      });

      it('goes to the package show page', () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    describe('entering invalid data', () => {
      beforeEach(() => {
        return PackageEditPage
          .dateRangeRowList(0).fillDates('12/18/2018', '12/16/2018')
          .clickSave();
      });

      it('displays a validation error for coverage', () => {
        expect(PackageEditPage.dateRangeRowList(0).beginDate.isInvalid).to.be.true;
      });
    });

    describe('entering valid data', () => {
      beforeEach(() => {
        return PackageEditPage.dateRangeRowList(0).fillDates('12/16/2018', '12/18/2018');
      });

      describe('clicking close (navigate back) button', () => {
        beforeEach(() => {
          return PackageEditPage.clickBackButton();
        });

        it('shows a navigation confirmation modal', () => {
          expect(PackageEditPage.navigationModal.$root).to.exist;
        });
      });

      describe('clicking save', () => {
        beforeEach(() => {
          return PackageEditPage.clickSave();
        });

        it('goes to the package show page', () => {
          expect(PackageShowPage.$root).to.exist;
        });
      });
    });
  });

  describe('encountering a server error when GETting', () => {
    beforeEach(function () {
      this.server.get('/packages/:id', {
        errors: [{
          title: 'There was an error'
        }]
      }, 500);

      this.visit(`/eholdings/packages/${providerPackage.id}/edit`);
    });

    it('dies with dignity', () => {
      expect(PackageEditPage.hasErrors).to.be.true;
    });
  });

  describe('encountering a server error when PUTting', () => {
    beforeEach(function () {
      this.server.put('/packages/:id', {
        errors: [{
          title: 'There was an error'
        }]
      }, 500);

      this.visit(`/eholdings/packages/${providerPackage.id}/edit`);
    });

    describe('entering valid data and clicking save', () => {
      beforeEach(() => {
        return PackageEditPage
          .dateRangeRowList(0).fillDates('12/16/2018', '12/18/2018')
          .clickSave();
      });

      it('pops up an error', () => {
        expect(PackageEditPage.toast.errorText).to.equal('There was an error');
      });
    });
  });

  describe('visiting the package show page', () => {
    beforeEach(function () {
      this.visit(`/eholdings/packages/${providerPackage.id}`);
    });

    describe('clicking the edit button', () => {
      beforeEach(() => {
        return PackageShowPage.clickEditButton();
      });

      it('should display the back button in pane header', () => {
        expect(PackageEditPage.hasBackButton).to.be.true;
      });
    });
  });
});
