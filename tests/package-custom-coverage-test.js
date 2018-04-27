import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { describeApplication } from './helpers';
import PackageShowPage from './pages/package-show';

describeApplication('PackageCustomCoverage', () => {
  let provider,
    pkg;

  beforeEach(function () {
    provider = this.server.create('provider', {
      name: 'Cool Provider'
    });
  });

  describe('visiting the package show page and package is not selected', () => {
    beforeEach(function () {
      pkg = this.server.create('package', {
        provider,
        name: 'Cool Package',
        contentType: 'ebook',
        isSelected: false
      });

      return this.visit(`/eholdings/packages/${pkg.id}`, () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    it('should not display custom coverage', () => {
      expect(PackageShowPage.hasCustomCoverage).to.be.false;
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
        provider,
        name: 'Cool Package',
        contentType: 'E-Book',
        isSelected: true
      });

      return this.visit(`/eholdings/packages/${pkg.id}`, () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    it('displays the custom coverage section', () => {
      expect(PackageShowPage.customCoverage).to.equal('7/16/1969 - 12/19/1972');
    });

    it.always('should not display a button to add custom coverage', () => {
      expect(PackageShowPage.$customCoverageButton).to.not.exist;
    });

    it('displays whether or not the package is selected', () => {
      expect(PackageShowPage.isSelected).to.equal(true);
    });

    describe('clicking to toggle and deselect package and confirming deselection', () => {
      beforeEach(() => {
        return PackageShowPage.deselectAndConfirmPackage();
      });

      it('removes the custom coverage', () => {
        expect(PackageShowPage.hasCustomCoverage).to.be.false;
      });
    });

    describe('clicking to toggle and deselect package and canceling deselection', () => {
      beforeEach(() => {
        return PackageShowPage.deselectAndCancelPackage();
      });

      it.always('does not remove the custom coverage', () => {
        expect(PackageShowPage.customCoverage).to.equal('7/16/1969 - 12/19/1972');
      });
    });

    describe('clicking the edit button', () => {
      beforeEach(() => {
        return PackageShowPage.clickCustomCoverageEditButton();
      });

      it('displays the date input fields', () => {
        expect(PackageShowPage.beginDate.exists).to.be.true;
        expect(PackageShowPage.endDate.exists).to.be.true;
      });
    });
  });

  describe('visiting the package show page with a package without custom coverage', () => {
    beforeEach(function () {
      pkg = this.server.create('package', {
        provider,
        packageName: 'Cool Package',
        contentType: 'ebook',
        isSelected: true
      });

      return this.visit(`/eholdings/packages/${pkg.id}`, () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    it.always('does not display the custom coverage section', () => {
      expect(PackageShowPage.hasCustomCoverage).to.be.false;
    });

    it('should display a button to add custom', () => {
      expect(PackageShowPage.hasCustomCoverageAddButton).to.be.true;
    });

    describe('clicking on the add custom coverage button', () => {
      beforeEach(() => {
        return PackageShowPage.clickCustomCoverageAddButton();
      });

      it('should remove the add custom coverage button', () => {
        expect(PackageShowPage.hasCustomCoverageAddButton).to.be.false;
      });

      it('displays custom coverage date inputs', () => {
        expect(PackageShowPage.beginDate.exists).to.be.true;
        expect(PackageShowPage.endDate.exists).to.be.true;
      });

      describe('entering valid coverage', () => {
        describe('with begin date and end date', () => {
          beforeEach(() => {
            return PackageShowPage.fillDates('12/16/2018', '12/24/2018');
          });

          it('accepts valid begin date', () => {
            expect(PackageShowPage.beginDate.inputValue).to.equal('12/16/2018');
          });

          it('accepts valid end date', () => {
            expect(PackageShowPage.endDate.inputValue).to.equal('12/24/2018');
          });

          it('save button is enabled', () => {
            expect(PackageShowPage.isCustomCoverageDisabled).to.be.false;
          });

          describe('saving coverage', () => {
            beforeEach(() => {
              return PackageShowPage.clickCustomCoverageSaveButton();
            });

            it('shows new custom coverage on detail record', () => {
              expect(PackageShowPage.customCoverage).to.equal('12/16/2018 - 12/24/2018');
            });

            it('removes the custom coverage input fields', () => {
              expect(PackageShowPage.beginDate.exists).to.be.false;
              expect(PackageShowPage.endDate.exists).to.be.false;
            });

            it('does not display the button to add custom coverage', () => {
              expect(PackageShowPage.hasCustomCoverageAddButton).to.be.false;
            });
          });
        });

        describe('with begin date and no end date', () => {
          beforeEach(() => {
            return PackageShowPage.beginDate.fillAndBlur('12/16/2018');
          });

          it('accepts valid begin date', () => {
            expect(PackageShowPage.beginDate.inputValue).to.equal('12/16/2018');
          });

          it('save button is enabled', () => {
            expect(PackageShowPage.isCustomCoverageDisabled).to.be.false;
          });

          describe('saving coverage', () => {
            beforeEach(() => {
              return PackageShowPage.clickCustomCoverageSaveButton();
            });

            it('shows new custom coverage on detail record', () => {
              expect(PackageShowPage.customCoverage).to.equal('12/16/2018 - Present');
            });

            it('removes the custom coverage input fields', () => {
              expect(PackageShowPage.beginDate.exists).to.be.false;
              expect(PackageShowPage.endDate.exists).to.be.false;
            });

            it('does not display the button to add custom coverage', () => {
              expect(PackageShowPage.hasCustomCoverageAddButton).to.be.false;
            });
          });
        });
      });

      describe('entering invalid coverage', () => {
        describe('with no begin date', () => {
          beforeEach(() => {
            return PackageShowPage
              .fillDates('12/24/2018', '12/16/2018')
              .append(PackageShowPage.beginDate.clearInput());
          });

          it('rejects invalid begin date', () => {
            expect(PackageShowPage.validationError).to.match(/\bEnter date in.*\b/);
          });
        });

        describe('with begin date after end date', () => {
          beforeEach(() => {
            return PackageShowPage.fillDates('12/24/2018', '12/16/2018');
          });


          it('throws validation error', () => {
            expect(PackageShowPage.validationError).to.include('Start date must be before end date.');
          });
        });
      });


      describe('clicking the cancel button', () => {
        beforeEach(() => {
          return PackageShowPage.clickCustomCoverageCancelButton();
        });

        it('removes the custom coverage input fields', () => {
          expect(PackageShowPage.beginDate.exists).to.be.false;
          expect(PackageShowPage.endDate.exists).to.be.false;
        });

        it('displays the button to add custom coverage', () => {
          expect(PackageShowPage.hasCustomCoverageAddButton).to.be.true;
        });
      });
    });
  });
});
