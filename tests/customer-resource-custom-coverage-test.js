/* global describe, beforeEach */
import { expect } from 'chai';
import it, { convergeOn } from './it-will';

import { describeApplication } from './helpers';
import ResourcePage from './pages/customer-resource-show';
import CustomerResourceCoverage from './pages/customer-resource-coverage';

describeApplication('CustomerResourceCustomCoverage', () => {
  let pkg,
    title,
    resource;

  beforeEach(function () {
    pkg = this.server.create('package', 'withProvider');

    pkg.customCoverage = {
      beginCoverage: '12/01/2018',
      endCoverage: '12/31/2018'
    };
    pkg.save();

    title = this.server.create('title');

    resource = this.server.create('customer-resource', {
      package: pkg,
      title
    });
  });

  describe('visiting an unselected customer resource show page', () => {
    beforeEach(function () {
      resource.isSelected = false;
      resource.save();

      return this.visit(`/eholdings/customer-resources/${resource.id}`, () => {
        expect(ResourcePage.$root).to.exist;
      });
    });

    it('does not display coverage', () => {
      expect(CustomerResourceCoverage.$root).to.not.exist;
    });
  });

  describe('visiting a selected customer resource show page without custom coverage', () => {
    beforeEach(function () {
      resource.isSelected = true;
      resource.save();

      return this.visit(`/eholdings/customer-resources/${resource.id}`, () => {
        expect(ResourcePage.$root).to.exist;
      });
    });

    it('displays an add custom coverage button', () => {
      expect(CustomerResourceCoverage.$addButton).to.exist;
    });

    describe('clicking the add custom coverage button', () => {
      beforeEach(() => {
        CustomerResourceCoverage.clickAddButton();
      });

      it('reveals the custom coverage form', () => {
        expect(CustomerResourceCoverage.$form).to.exist;
      });

      it('reveals a cancel button', () => {
        expect(CustomerResourceCoverage.$cancelButton).to.exist;
      });

      it('shows a single row of inputs', () => {
        expect(CustomerResourceCoverage.dateRangeRowList.length).to.equal(1);
      });

      it('reveals a save button', () => {
        expect(CustomerResourceCoverage.$saveButton).to.exist;
      });

      it('disables the save button', () => {
        expect(CustomerResourceCoverage.isSaveButtonEnabled).to.be.false;
      });

      it('hides the add custom coverage button', () => {
        expect(CustomerResourceCoverage.$addButton).to.not.exist;
      });

      describe('clicking cancel', () => {
        it('hides the custom coverage form', () => {
          expect(CustomerResourceCoverage.$form).to.not.exist;
        });

        it('displays an add custom coverage button', () => {
          expect(CustomerResourceCoverage.$addButton).to.exist;
        });
      });

      describe('clicking the add row button', () => {
        beforeEach(() => {
          CustomerResourceCoverage.clickAddRowButton();
        });

        it('adds another row of date inputs', () => {
          expect(CustomerResourceCoverage.dateRangeRowList.length).to.equal(2);
        });

        it('does not put any values in the new inputs', () => {
          expect(CustomerResourceCoverage.dateRangeRowList[1].beginCoverage).equal('');
          expect(CustomerResourceCoverage.dateRangeRowList[1].endCoverage).equal('');
        });

        describe('clicking the clear row button', () => {
          beforeEach(() => {
            return convergeOn(() => {
              expect(CustomerResourceCoverage.dateRangeRowList.length).to.equal(2);
            }).then(() => {
              CustomerResourceCoverage.dateRangeRowList[1].clickRemoveRowButton();
            });
          });

          it('removes the new row', () => {
            expect(CustomerResourceCoverage.dateRangeRowList.length).to.equal(1);
          });
        });
      });

      describe('entering a valid date range', () => {
        beforeEach(() => {
          return convergeOn(() => {
            expect(CustomerResourceCoverage.dateRangeRowList[0].$beginCoverageField).to.exist;
            expect(CustomerResourceCoverage.dateRangeRowList[0].$endCoverageField).to.exist;
          }).then(() => {
            CustomerResourceCoverage.dateRangeRowList[0].$beginCoverageField.click();
            CustomerResourceCoverage.dateRangeRowList[0].inputBeginDate('12/16/2018');
            CustomerResourceCoverage.dateRangeRowList[0].pressEnterBeginDate();
            CustomerResourceCoverage.dateRangeRowList[0].$endCoverageField.click();
            CustomerResourceCoverage.dateRangeRowList[0].inputEndDate('12/18/2018');
            CustomerResourceCoverage.dateRangeRowList[0].pressEnterEndDate();
          });
        });

        it('enables the save button', () => {
          expect(CustomerResourceCoverage.isSaveButtonEnabled).to.be.true;
        });

        it('shows the input as valid', () => {
          expect(CustomerResourceCoverage.dateRangeRowList[0].beginCoverageFieldIsValid).to.be.true;
        });

        it('enables the save button', () => {
          expect(CustomerResourceCoverage.isSaveButtonEnabled).to.be.true;
        });

        describe('successfully submitting the form', () => {
          beforeEach(() => {
            CustomerResourceCoverage.clickSaveButton();
          });

          it('displays the saved date range', () => {
            expect(CustomerResourceCoverage.displayText).to.equal('12/16/2018 - 12/18/2018');
          });

          it('displays an edit button', () => {
            expect(CustomerResourceCoverage.$editButton).to.exist;
          });
        });
      });

      describe('entering an invalid date range', () => {
        beforeEach(() => {
          return convergeOn(() => {
            expect(CustomerResourceCoverage.dateRangeRowList[0].$beginCoverageField).to.exist;
            expect(CustomerResourceCoverage.dateRangeRowList[0].$endCoverageField).to.exist;
          });
        });

        describe('entering an invalid begin date format', () => {
          beforeEach(() => {
            CustomerResourceCoverage.dateRangeRowList[0].$beginCoverageField.click();
            CustomerResourceCoverage.dateRangeRowList[0].inputBeginDate('12/16/2018');
            CustomerResourceCoverage.dateRangeRowList[0].pressEnterBeginDate();

            CustomerResourceCoverage.dateRangeRowList[0].clearBeginDate();
          });

          it('indicates validation error on begin date', () => {
            expect(CustomerResourceCoverage.dateRangeRowList[0].beginCoverageFieldIsInvalid).to.be.true;
          });

          it('displays messaging that date is invalid format', () => {
            expect(CustomerResourceCoverage.dateRangeRowList[0].beginCoverageFieldValidationError).to.eq(
              'Enter date in MM/DD/YYYY format.'
            );
          });
        });

        describe('entering an end date before a start date', () => {
          beforeEach(() => {
            CustomerResourceCoverage.dateRangeRowList[0].$beginCoverageField.click();
            CustomerResourceCoverage.dateRangeRowList[0].inputBeginDate('12/16/2018');
            CustomerResourceCoverage.dateRangeRowList[0].pressEnterBeginDate();
            CustomerResourceCoverage.dateRangeRowList[0].$endCoverageField.click();
            CustomerResourceCoverage.dateRangeRowList[0].inputEndDate('12/14/2018');
            CustomerResourceCoverage.dateRangeRowList[0].pressEnterEndDate();
          });

          it('indicates validation error on begin date', () => {
            expect(CustomerResourceCoverage.dateRangeRowList[0].beginCoverageFieldIsInvalid).to.be.true;
          });

          it('displays messaging that end date is before start date', () => {
            expect(CustomerResourceCoverage.dateRangeRowList[0].beginCoverageFieldValidationError).to.eq(
              'Start date must be before end date'
            );
          });
        });

        describe('entering overlapping ranges', () => {
          beforeEach(() => {
            CustomerResourceCoverage.dateRangeRowList[0].$beginCoverageField.click();
            CustomerResourceCoverage.dateRangeRowList[0].inputBeginDate('12/16/2018');
            CustomerResourceCoverage.dateRangeRowList[0].pressEnterBeginDate();
            CustomerResourceCoverage.dateRangeRowList[0].$endCoverageField.click();
            CustomerResourceCoverage.dateRangeRowList[0].inputEndDate('12/20/2018');
            CustomerResourceCoverage.dateRangeRowList[0].pressEnterEndDate();

            CustomerResourceCoverage.clickAddRowButton();

            return convergeOn(() => {
              expect(CustomerResourceCoverage.dateRangeRowList[1].$beginCoverageField).to.exist;
              expect(CustomerResourceCoverage.dateRangeRowList[1].$endCoverageField).to.exist;
            }).then(() => {
              CustomerResourceCoverage.dateRangeRowList[1].$beginCoverageField.click();
              CustomerResourceCoverage.dateRangeRowList[1].inputBeginDate('12/18/2018');
              CustomerResourceCoverage.dateRangeRowList[1].pressEnterBeginDate();
              CustomerResourceCoverage.dateRangeRowList[1].$endCoverageField.click();
              CustomerResourceCoverage.dateRangeRowList[1].inputEndDate('12/19/2018');
              CustomerResourceCoverage.dateRangeRowList[1].pressEnterEndDate();
            });
          });

          it('indicates validation error on begin dates', () => {
            expect(CustomerResourceCoverage.dateRangeRowList[0].beginCoverageFieldIsInvalid).to.be.true;
            expect(CustomerResourceCoverage.dateRangeRowList[1].beginCoverageFieldIsInvalid).to.be.true;
          });

          it('has messaging that dates overlap', () => {
            expect(CustomerResourceCoverage.dateRangeRowList[0].beginCoverageFieldValidationError).to.eq(
              'Date range overlaps with 12/18/2018 - 12/19/2018'
            );
            expect(CustomerResourceCoverage.dateRangeRowList[1].beginCoverageFieldValidationError).to.eq(
              'Date range overlaps with 12/16/2018 - 12/20/2018'
            );
          });
        });

        describe('entering a date range outside of package coverage range', () => {
          beforeEach(() => {
            CustomerResourceCoverage.dateRangeRowList[0].$beginCoverageField.click();
            CustomerResourceCoverage.dateRangeRowList[0].inputBeginDate('11/16/2018');
            CustomerResourceCoverage.dateRangeRowList[0].pressEnterBeginDate();
            CustomerResourceCoverage.dateRangeRowList[0].$endCoverageField.click();
            CustomerResourceCoverage.dateRangeRowList[0].inputEndDate('01/14/2019');
            CustomerResourceCoverage.dateRangeRowList[0].pressEnterEndDate();
          });

          it('indicates validation error on begin date', function() {
            expect(CustomerResourceCoverage.dateRangeRowList[0].beginCoverageFieldIsInvalid).to.be.true;
          });
          it('indicates validation error on end date', function() {
            expect(CustomerResourceCoverage.dateRangeRowList[0].endCoverageFieldIsInvalid).to.be.true;
          });

          it('displays messaging that begin date is outside of package coverage range', () => {
            expect(CustomerResourceCoverage.dateRangeRowList[0].beginCoverageFieldValidationError).to.eq(
              "Dates must be within Package's date range (12/1/2018 - 12/31/2018)."
            );
          });
          it('displays messaging that end date is outside of package coverage range', () => {
            expect(CustomerResourceCoverage.dateRangeRowList[0].endCoverageFieldValidationError).to.eq(
              "Dates must be within Package's date range (12/1/2018 - 12/31/2018)."
            );
          });
        });
      });
    });
  });

  describe('visiting a selected customer resource show page with custom coverage', () => {
    beforeEach(function () {
      resource.isSelected = true;
      let customCoverages = [
        this.server.create('custom-coverage', {
          beginCoverage: '1969-07-16',
          endCoverage: '1972-12-19'
        })
      ];
      resource.update('customCoverages', customCoverages.map(item => item.toJSON()));
      resource.save();

      return this.visit(`/eholdings/customer-resources/${resource.id}`, () => {
        expect(ResourcePage.$root).to.exist;
      });
    });

    it('displays the date ranges', () => {
      expect(CustomerResourceCoverage.displayText).to.equal('7/16/1969 - 12/19/1972');
    });

    it('displays an edit button', () => {
      expect(CustomerResourceCoverage.$editButton).to.exist;
    });

    it('does not display an add custom coverage button', () => {
      expect(CustomerResourceCoverage.$addButton).to.not.exist;
    });

    describe('clicking the edit button', () => {
      beforeEach(() => {
        CustomerResourceCoverage.clickEditButton();
      });

      it('reveals the custom coverage form', () => {
        expect(CustomerResourceCoverage.$form).to.exist;
      });

      it('reveals a cancel button', () => {
        expect(CustomerResourceCoverage.$cancelButton).to.exist;
      });

      it('shows a single row of inputs', () => {
        expect(CustomerResourceCoverage.dateRangeRowList.length).to.equal(1);
      });

      it('reveals a save button', () => {
        expect(CustomerResourceCoverage.$saveButton).to.exist;
      });

      it('disables the save button', () => {
        expect(CustomerResourceCoverage.isSaveButtonEnabled).to.be.false;
      });

      describe('editing one of the fields', () => {
        beforeEach(() => {
          return convergeOn(() => {
            expect(CustomerResourceCoverage.dateRangeRowList[0].$beginCoverageField).to.exist;
            expect(CustomerResourceCoverage.dateRangeRowList[0].$endCoverageField).to.exist;
          }).then(() => {
            CustomerResourceCoverage.dateRangeRowList[0].$endCoverageField.click();
            CustomerResourceCoverage.dateRangeRowList[0].inputEndDate('12/16/2018');
            CustomerResourceCoverage.dateRangeRowList[0].pressEnterEndDate();
            CustomerResourceCoverage.dateRangeRowList[0].clearEndDate();
          });
        });

        it('enables the save button', () => {
          expect(CustomerResourceCoverage.isSaveButtonEnabled).to.be.true;
        });
      });

      describe('removing the only row', () => {
        beforeEach(() => {
          return convergeOn(() => {
            expect(CustomerResourceCoverage.dateRangeRowList.length).to.equal(1);
          }).then(() => {
            CustomerResourceCoverage.dateRangeRowList[0].clickRemoveRowButton();
          });
        });

        it('displays the no rows left message', () => {
          expect(CustomerResourceCoverage.$noRowsLeftMessage).to.exist;
        });

        it('enables the save button', () => {
          expect(CustomerResourceCoverage.isSaveButtonEnabled).to.be.true;
        });

        describe('successfully submitting the form', () => {
          beforeEach(() => {
            CustomerResourceCoverage.clickSaveButton();
          });

          it('displays an add custom coverage button', () => {
            expect(CustomerResourceCoverage.$addButton).to.exist;
          });
        });
      });
    });
  });
});
