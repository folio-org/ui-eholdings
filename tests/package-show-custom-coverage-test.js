/* global describe, beforeEach */
import { expect } from 'chai';
import it from './it-will';

import { describeApplication } from './helpers';
import PackageShowPage from './pages/package-show';
import CustomCoverageForm from './pages/custom-coverage-form';

describeApplication('PackageShowCustomCoverage', () => {
  let vendor,
    pkg;

  beforeEach(function () {
    vendor = this.server.create('vendor', {
      name: 'Cool Vendor'
    });
  });

  describe('visiting the package show page and package is not selected', () => {
    beforeEach(function () {
      pkg = this.server.create('package', {
        vendor,
        name: 'Cool Package',
        contentType: 'ebook',
        isSelected: false
      });

      return this.visit(`/eholdings/packages/${pkg.id}`, () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    it('should not display custom coverage', () => {
      expect(CustomCoverageForm.customCoverageText).to.equal('');
    });
  });

  describe('visiting the package show page with custom coverage', () => {
    beforeEach(function () {
      let customCoverage = this.server.create('custom-coverage', {
        beginCoverage: '1969-07-16',
        endCoverage: '1972-12-19'
      }).toJSON();

      pkg = this.server.create('package', {
        customCoverage,
        vendor,
        name: 'Cool Package',
        contentType: 'E-Book',
        isSelected: true
      });

      return this.visit(`/eholdings/packages/${pkg.id}`, () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    it('displays the custom coverage section', () => {
      expect(CustomCoverageForm.customCoverageText).to.equal('7/16/1969 - 12/19/1972');
    });

    it('should not display a button to add custom coverage', () => {
      expect(CustomCoverageForm.$customCoverageButton).to.not.exist;
    });

    it('displays whether or not the package is selected', () => {
      expect(PackageShowPage.isSelected).to.equal(true);
    });

    describe('clicking to toggle and deselect package and confirming deselection', () => {
      beforeEach(() => {
        return PackageShowPage.toggleIsSelected().then(() => {
          return PackageShowPage.confirmDeselection();
        });
      });

      it('removes the custom coverage', () => {
        expect(CustomCoverageForm.customCoverageText).to.equal('');
      });
    });

    describe('clicking to toggle and deselect package and canceling deselection', () => {
      beforeEach(() => {
        return PackageShowPage.toggleIsSelected().then(() => {
          return PackageShowPage.cancelDeselection();
        });
      });

      it('does not remove the custom coverage', () => {
        expect(CustomCoverageForm.customCoverageText).to.equal('7/16/1969 - 12/19/1972');
      });
    });

    describe('clicking the edit button', () => {
      beforeEach(() => {
        return CustomCoverageForm.clickCustomCoverageEditButton();
      });

      it('displays the date input fields', () => {
        expect(CustomCoverageForm.$customCoverageInputs).to.exist;
      });

      it('contains the right value for beginCoverage', () => {
        expect(CustomCoverageForm.$beginCoverageField.val()).to.equal('07/16/1969');
      });

      it('contains the right value for endCoverage', () => {
        expect(CustomCoverageForm.$endCoverageField.val()).to.equal('12/19/1972');
      });

      describe('clicking the clear button', () => {
        beforeEach(() => {
          return CustomCoverageForm.clickCustomCoverageClearButton();
        });

        it('contains no value for beginCoverage', () => {
          expect(CustomCoverageForm.$beginCoverageField.val()).to.equal('');
        });

        it('contains no value for endCoverage', () => {
          expect(CustomCoverageForm.$endCoverageField.val()).to.equal('');
        });

        it('enables the save button', () => {
          expect(CustomCoverageForm.$customCoverageSaveButton).to.have.prop('disabled', false);
        });
      });
    });
  });

  describe('visiting the package show page with a package without custom coverage', () => {
    beforeEach(function () {
      pkg = this.server.create('package', {
        vendor,
        packageName: 'Cool Package',
        contentType: 'ebook',
        isSelected: true
      });

      return this.visit(`/eholdings/packages/${pkg.id}`, () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    it.still('does not display the custom coverage section', () => {
      expect(CustomCoverageForm.customCoverageText).to.equal('');
    });

    it('should display a button to add custom', () => {
      expect(CustomCoverageForm.$customCoverageAddButton).to.exist;
    });

    describe('clicking on the add custom coverage button', () => {
      beforeEach(() => {
        CustomCoverageForm.clickCustomCoverageAddButton();
      });

      it('should remove the add custom coverage button', () => {
        expect(CustomCoverageForm.$customCoverageAddButton).to.not.exist;
      });

      it('displays custom coverage date inputs', () => {
        expect(CustomCoverageForm.$customCoverageInputs).to.exist;
      });

      describe('clicking the cancel button', () => {
        beforeEach(() => {
          CustomCoverageForm.clickCustomCoverageCancelButton();
        });

        it('removes the custom coverage input fields', () => {
          expect(CustomCoverageForm.$customCoverageInputs).to.not.exist;
        });

        it('displays the button to add custom coverage', () => {
          expect(CustomCoverageForm.$customCoverageAddButton).to.exist;
        });
      });

      describe('submitting the form successfully', () => {
        beforeEach(() => {
          CustomCoverageForm.fillInCustomCoverage({
            beginCoverage: '01/01/2018',
            endCoverage: '02/01/2018'
          });
        });

        it('does not display an error for beginCoverage', () => {
          expect(CustomCoverageForm.beginCoverageFieldIsInvalid).to.be.false;
        });

        it('does not display an error for endCoverage', () => {
          expect(CustomCoverageForm.endCoverageFieldIsInvalid).to.be.false;
        });

        it('enables the save button', () => {
          expect(CustomCoverageForm.$customCoverageSaveButton).to.have.prop('disabled', false);
        });

        describe('saving the changes', () => {
          beforeEach(() => {
            CustomCoverageForm.clickCustomCoverageSaveButton();
          });

          // mirage may respond too quick to properly test loading states
          it.skip('disables the save button', () => {
            expect(CustomCoverageForm.$customCoverageSaveButton).to.have.prop('disabled', true);
          });

          describe('when the changes succeed', () => {
            it('hides the form actions', () => {
              expect(CustomCoverageForm.$customCoverageInputs).to.not.exist;
            });
          });
        });
      });

      describe('filling out the form with an invalid date pair', () => {
        beforeEach(() => {
          CustomCoverageForm.fillInCustomCoverage({
            beginCoverage: '03/01/2018',
            endCoverage: '02/01/2018'
          });
        });

        it('displays an error for beginCoverage', () => {
          expect(CustomCoverageForm.beginCoverageFieldIsInvalid).to.be.true;
        });

        it('does not enable the save button', () => {
          expect(CustomCoverageForm.$saveCustomCoverageButton).to.have.prop('disabled', true);
        });
      });

      describe('getting back an error from the server when submitting the form', () => {
        it.skip('shows an error state');
      });
    });
  });
});
