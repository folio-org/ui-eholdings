/* global describe, beforeEach */
import { expect } from 'chai';
import it, { convergeOn } from './it-will';

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
      expect(PackageShowPage.customCoverage).to.equal('');
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

    it.still('should not display a button to add custom coverage', () => {
      expect(PackageShowPage.$customCoverageButton).to.not.exist;
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
        expect(PackageShowPage.customCoverage).to.equal('');
      });
    });

    describe('clicking to toggle and deselect package and canceling deselection', () => {
      beforeEach(() => {
        return PackageShowPage.toggleIsSelected().then(() => {
          return PackageShowPage.cancelDeselection();
        });
      });

      it.still('does not remove the custom coverage', () => {
        expect(PackageShowPage.customCoverage).to.equal('7/16/1969 - 12/19/1972');
      });
    });

    describe('clicking the edit button', () => {
      beforeEach(() => {
        return PackageShowPage.clickCustomCoverageEditButton();
      });

      it('displays the date input fields', () => {
        expect(PackageShowPage.$beginDateField).to.exist;
        expect(PackageShowPage.$endDateField).to.exist;
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

    it.still('does not display the custom coverage section', () => {
      expect(PackageShowPage.customCoverage).to.equal('');
    });

    it('should display a button to add custom', () => {
      expect(PackageShowPage.$customCoverageAddButton).to.exist;
    });

    describe('clicking on the add custom coverage button', () => {
      beforeEach(() => {
        PackageShowPage.clickCustomCoverageAddButton();
      });

      it('should remove the add custom coverage button', () => {
        expect(PackageShowPage.$customCoverageAddButton).to.not.exist;
      });

      it('displays custom coverage date inputs', () => {
        expect(PackageShowPage.$beginDateField).to.exist;
        expect(PackageShowPage.$endDateField).to.exist;
      });

      describe('entering valid coverage', () => {
        beforeEach(() => {
          return convergeOn(() => {
            expect(PackageShowPage.$beginDateField).to.exist;
            expect(PackageShowPage.$endDateField).to.exist;
          });
        });

        describe('with begin date and end date', () => {
          beforeEach(() => {
            PackageShowPage.inputBeginDate('12/16/2018');
            PackageShowPage.inputEndDate('12/24/2018');
          });
          it('accepts valid begin date', () => {
            expect(PackageShowPage.$beginDateField.value).to.equal('12/16/2018');
          });

          it('accepts valid end date', () => {
            expect(PackageShowPage.$endDateField.value).to.equal('12/24/2018');
          });

          it('save button is enabled', () => {
            expect(PackageShowPage.isCustomCoverageSavable).to.be.true;
          });

          describe('saving coverage', () => {
            beforeEach(() => {
              PackageShowPage.clickCustomCoverageSaveButton();
            });

            it('shows new custom coverage on detail record', () => {
              expect(PackageShowPage.customCoverage).to.equal('12/16/2018 - 12/24/2018');
            });

            it('removes the custom coverage input fields', () => {
              expect(PackageShowPage.$beginDateField).to.not.exist;
              expect(PackageShowPage.$endDateField).to.not.exist;
            });

            it('does not display the button to add custom coverage', () => {
              expect(PackageShowPage.$customCoverageAddButton).to.not.exist;
            });
          });
        });

        describe('with begin date and no end date', () => {
          beforeEach(() => {
            PackageShowPage.inputBeginDate('12/16/2018');
          });
          it('accepts valid begin date', () => {
            expect(PackageShowPage.$beginDateField.value).to.equal('12/16/2018');
          });

          it('save button is enabled', () => {
            expect(PackageShowPage.isCustomCoverageSavable).to.be.true;
          });

          describe('saving coverage', () => {
            beforeEach(() => {
              PackageShowPage.clickCustomCoverageSaveButton();
            });

            it('shows new custom coverage on detail record', () => {
              expect(PackageShowPage.customCoverage).to.equal('12/16/2018 - Present');
            });

            it('removes the custom coverage input fields', () => {
              expect(PackageShowPage.$beginDateField).to.not.exist;
              expect(PackageShowPage.$endDateField).to.not.exist;
            });

            it('does not display the button to add custom coverage', () => {
              expect(PackageShowPage.$customCoverageAddButton).to.not.exist;
            });
          });
        });
      });

      describe('entering invalid coverage', () => {
        beforeEach(() => {
          return convergeOn(() => {
            expect(PackageShowPage.$beginDateField).to.exist;
            expect(PackageShowPage.$endDateField).to.exist;
          });
        });

        describe('with no begin date', () => {
          beforeEach(() => {
            PackageShowPage.$beginDateField.click();
            PackageShowPage.inputBeginDate('12/16/2018');
            PackageShowPage.pressEnterBeginDate();
            PackageShowPage.clearBeginDate();
            PackageShowPage.blurBeginDate();
          });

          it('rejects invalid begin date', () => {
            convergeOn(() => {
              expect(PackageShowPage.validationError).to.exist;
            }).then(() => {
              expect(PackageShowPage.validationError).to.match(/\bEnter date in.*\b/);
            });
          });
        });

        describe('with begin date after end date', () => {
          beforeEach(() => {
            PackageShowPage.$beginDateField.click();
            PackageShowPage.inputBeginDate('12/24/2018');
            PackageShowPage.pressEnterBeginDate();
            PackageShowPage.blurBeginDate();

            PackageShowPage.$endDateField.click();
            PackageShowPage.inputEndDate('12/16/2018');
            PackageShowPage.pressEnterEndDate();
            PackageShowPage.blurEndDate();
          });


          it('throws validation error', () => {
            expect(PackageShowPage.validationError).to.include('Start date must be before end date.');
          });
        });
      });


      describe('clicking the cancel button', () => {
        beforeEach(() => {
          PackageShowPage.clickCustomCoverageCancelButton();
        });

        it('removes the custom coverage input fields', () => {
          expect(PackageShowPage.$beginDateField).to.not.exist;
          expect(PackageShowPage.$endDateField).to.not.exist;
        });

        it('displays the button to add custom coverage', () => {
          expect(PackageShowPage.$customCoverageAddButton).to.exist;
        });
      });
    });
  });
});
