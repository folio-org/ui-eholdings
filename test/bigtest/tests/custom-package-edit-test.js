import { expect } from 'chai';
import { describe, beforeEach, it } from '@bigtest/mocha';

import setupApplication from '../helpers/setup-application';
import PackageShowPage from '../interactors/package-show';
import PackageEditPage from '../interactors/package-edit';

describe('CustomPackageEdit', () => {
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
      isCustom: true
    });
  });

  describe('visiting the package edit page without coverage dates', () => {
    beforeEach(function () {
      this.visit(`/eholdings/packages/${providerPackage.id}/edit`);
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

    describe('clicking close (navigate back) button', () => {
      beforeEach(() => {
        return PackageEditPage.clickBackButton();
      });

      it('goes to the package show page', () => {
        expect(PackageShowPage.$root).to.exist;
      });

      it('displays no custom coverage dates', () => {
        expect(PackageShowPage.hasCustomCoverage).to.be.false;
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
    beforeEach(function () {
      providerPackage.update('customCoverage', {
        beginCoverage: '1969-07-16',
        endCoverage: '1972-12-19'
      });
      providerPackage.update('contentType', 'E-Book');
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
          .name('')
          .dateRangeRowList(0).fillDates('12/18/2018', '12/16/2018')
          .clickSave();
      });

      it('displays a validation error for the name', () => {
        expect(PackageEditPage.nameHasError).to.be.true;
      });

      it('displays a validation error for coverage', () => {
        expect(PackageEditPage.dateRangeRowList(0).beginDate.isInvalid).to.be.true;
      });
    });

    describe('entering valid data', () => {
      beforeEach(() => {
        return PackageEditPage
          .name('A Different Name')
          .contentType('E-Journal')
          .dateRangeRowList(0).fillDates('12/16/2018', '12/18/2018');
      });

      describe('clicking close (navigate back) button', () => {
        beforeEach(() => {
          return PackageEditPage.clickBackButton();
        });

        it('shows a navigation confirmation modal', () => {
          expect(PackageEditPage.navigationModal.$root).to.exist;
        });

        describe('confirming to continue without saving', () => {
          beforeEach(() => {
            return PackageEditPage.navigationModal.clickContinue();
          });

          it('navigates from editing page', () => {
            expect(PackageShowPage.isPresent).to.eq(true);
          });
        });

        describe('confirming to keep editing', () => {
          beforeEach(() => {
            return PackageEditPage.navigationModal.clickDismiss();
          });

          it('reamins on the editing page', () => {
            expect(PackageEditPage.isPresent).to.eq(true);
          });
        });
      });

      describe('clicking save', () => {
        beforeEach(() => {
          return PackageEditPage.clickSave();
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
          .name('A Different Name')
          .dateRangeRowList(0).fillDates('12/16/2018', '12/18/2018')
          .clickSave();
      });

      it('pops up an error', () => {
        expect(PackageEditPage.toast.errorText).to.equal('There was an error');
      });
    });
  });
});
