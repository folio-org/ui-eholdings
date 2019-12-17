import { expect } from 'chai';
import { describe, beforeEach, it } from '@bigtest/mocha';

import setupApplication from '../helpers/setup-application';
import PackageShowPage from '../interactors/package-show';
import PackageEditPage from '../interactors/package-edit';

describe('CustomPackageEdit', function () {
  setupApplication();
  // some of the beforeEach blocks seem to timeout in CI
  this.timeout(5000);
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
      isCustom: true
    });
  });

  describe('visiting the package edit page without coverage dates', () => {
    beforeEach(async function () {
      this.visit(`/eholdings/packages/${providerPackage.id}/edit`);
      await PackageEditPage.whenLoaded();
    });

    it('displays the correct holdings status', () => {
      expect(PackageEditPage.selectionStatus.isSelected).to.equal(true);
    });

    it('shows blank datepicker fields', () => {
      expect(PackageEditPage.dateRangeRowList(0).beginDate.inputValue).to.equal('');
      expect(PackageEditPage.dateRangeRowList(0).endDate.inputValue).to.equal('');
    });

    it('disables the save button', () => {
      expect(PackageEditPage.isSaveDisabled).to.be.true;
    });

    describe('clicking cancel', () => {
      beforeEach(async () => {
        await PackageEditPage.clickCancel();
      });

      it('goes to the package show page', () => {
        expect(PackageShowPage.$root).to.exist;
      });

      it('displays no custom coverage dates', () => {
        expect(PackageShowPage.hasCustomCoverage).to.be.false;
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
        });

        it('goes to the package show page', () => {
          expect(PackageShowPage.$root).to.exist;
        });

        it('displays new coverage dates', () => {
          expect(PackageShowPage.customCoverage).to.equal('12/16/2018 - 12/18/2018');
        });

        it('shows a success toast message', () => {
          expect(PackageShowPage.toast.successText).to.equal('Package saved.');
        });
      });
    });
  });

  describe('visiting the package edit page with coverage dates and content type', () => {
    beforeEach(async function () {
      await providerPackage.update('customCoverage', {
        beginCoverage: '1969-07-16',
        endCoverage: '1972-12-19'
      });
      await providerPackage.update('contentType', 'E-Book');
      await providerPackage.save();

      this.visit(`/eholdings/packages/${providerPackage.id}/edit`);
      await PackageEditPage.whenLoaded();
    });

    it('disables the save button', () => {
      expect(PackageEditPage.isSaveDisabled).to.be.true;
    });

    describe('clicking cancel', () => {
      beforeEach(async () => {
        await PackageEditPage.clickCancel();
      });

      it('goes to the package show page', () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    describe('entering invalid data', () => {
      beforeEach(async () => {
        await PackageEditPage.name('');
        await PackageEditPage.dateRangeRowList(0).fillDates('12/18/2018', '12/16/2018');
        await PackageEditPage.clickSave();
      });

      it('displays a validation error for the name', () => {
        expect(PackageEditPage.nameHasError).to.be.true;
      });

      it('displays a validation error for coverage', () => {
        expect(PackageEditPage.dateRangeRowList(0).beginDate.isInvalid).to.be.true;
      });
    });

    describe('entering valid data', () => {
      beforeEach(async () => {
        await PackageEditPage.name('A Different Name');
        await PackageEditPage.contentType('E-Journal');
        await PackageEditPage.dateRangeRowList(0).fillDates('12/16/2018', '12/18/2018');
      });

      describe('clicking cancel', () => {
        beforeEach(async () => {
          await PackageEditPage.clickCancel();
        });

        it('shows a navigation confirmation modal', () => {
          expect(PackageEditPage.navigationModal.$root).to.exist;
        });

        describe('confirming to continue without saving', () => {
          beforeEach(async () => {
            await PackageEditPage.navigationModal.confirmNavigation();
          });

          it('navigates from editing page', () => {
            expect(PackageShowPage.isPresent).to.eq(true);
          });
        });

        describe('confirming to keep editing', () => {
          beforeEach(async () => {
            await PackageEditPage.navigationModal.cancelNavigation();
          });

          it('reamins on the editing page', () => {
            expect(PackageEditPage.isPresent).to.eq(true);
          });
        });
      });

      describe('clicking save', () => {
        beforeEach(async () => {
          await PackageEditPage.clickSave();
        });

        it('goes to the package show page', () => {
          expect(PackageShowPage.$root).to.exist;
        });

        it('reflects the new name', () => {
          expect(PackageShowPage.name).to.equal('A Different Name');
        });

        it('reflects the new content type', () => {
          expect(PackageShowPage.contentType).to.equal('E-Journal');
        });
      });
    });
  });

  describe('encountering a server error when GETting', () => {
    beforeEach(async function () {
      await this.server.get('/packages/:id', {
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
    beforeEach(async function () {
      await this.server.put('/packages/:id', {
        errors: [{
          title: 'There was an error'
        }]
      }, 500);

      this.visit(`/eholdings/packages/${providerPackage.id}/edit`);
      await PackageEditPage.whenLoaded();
    });

    describe('entering valid data and clicking save', () => {
      beforeEach(async () => {
        await PackageEditPage.name('A Different Name');
        await PackageEditPage.dateRangeRowList(0).fillDates('12/16/2018', '12/18/2018');
        await PackageEditPage.clickSave();
      });

      it('pops up an error', () => {
        expect(PackageEditPage.toast.errorText).to.equal('There was an error');
      });
    });
  });
});
