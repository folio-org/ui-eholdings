import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';
import { describeApplication } from './helpers';
import ResourcePage from './pages/bigtest/customer-resource-show';
import CustomerResourceCoverage from './pages/bigtest/customer-resource-custom-coverage';

describeApplication('CustomerResourceCustomCoverage', () => {
  let pkg,
    title,
    resource;

  beforeEach(function () {
    pkg = this.server.create('package', 'withProvider');

    pkg.customCoverage = {
      beginCoverage: '2018-12-01',
      endCoverage: '2018-12-31'
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
      expect(CustomerResourceCoverage.exists).to.be.false;
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
      expect(CustomerResourceCoverage.hasAddButton).to.be.true;
    });

    describe('clicking the add custom coverage button', () => {
      beforeEach(() => {
        return CustomerResourceCoverage.clickAddButton();
      });

      it('reveals the custom coverage form', () => {
        expect(CustomerResourceCoverage.hasForm).to.be.true;
      });

      it('reveals a cancel button', () => {
        expect(CustomerResourceCoverage.hasCancelButton).to.be.true;
      });

      it('shows a single row of inputs', () => {
        expect(CustomerResourceCoverage.dateRangeRowList().length).to.equal(1);
      });

      it('reveals a save button', () => {
        expect(CustomerResourceCoverage.hasSaveButton).to.be.true;
      });

      it('disables the save button', () => {
        expect(CustomerResourceCoverage.isSaveButtonDisabled).to.be.true;
      });

      it('hides the add custom coverage button', () => {
        expect(CustomerResourceCoverage.hasAddButton).to.be.false;
      });

      describe('then trying to navigate away', () => {
        beforeEach(() => {
          return ResourcePage.clickPackage();
        });

        it('shows a navigation confirmation modal', () => {
          expect(ResourcePage.navigationModal.exists).to.be.true;
        });

        it.always('does not navigate away', function () {
          expect(this.app.history.location.pathname)
            .to.equal(`/eholdings/customer-resources/${resource.id}`);
        });
      });

      describe('clicking cancel', () => {
        beforeEach(() => {
          return CustomerResourceCoverage.clickCancelButton();
        });

        it('hides the custom coverage form', () => {
          expect(CustomerResourceCoverage.hasForm).to.be.false;
        });

        it('displays an add custom coverage button', () => {
          expect(CustomerResourceCoverage.hasAddButton).to.exist;
        });
      });

      describe('clicking the add row button', () => {
        beforeEach(() => {
          return CustomerResourceCoverage.clickAddRowButton();
        });

        it('adds another row of date inputs', () => {
          expect(CustomerResourceCoverage.dateRangeRowList().length).to.equal(2);
        });

        it('does not put any values in the new inputs', () => {
          expect(CustomerResourceCoverage.dateRangeRowList(1).beginCoverageValue).to.equal('');
          expect(CustomerResourceCoverage.dateRangeRowList(1).endCoverageValue).to.equal('');
        });

        describe('clicking the clear row button', () => {
          beforeEach(() => {
            return CustomerResourceCoverage.dateRangeRowList(1).clickRemoveRowButton();
          });

          it('removes the new row', () => {
            expect(CustomerResourceCoverage.dateRangeRowList().length).to.equal(1);
          });
        });
      });

      describe('entering a valid date range', () => {
        beforeEach(() => {
          return CustomerResourceCoverage.dateRangeRowList(0)
            .fillInDateRange('12/16/2018', '12/18/2018');
        });

        it('shows the input as valid', () => {
          expect(CustomerResourceCoverage.dateRangeRowList(0).beginCoverageFieldIsValid).to.be.true;
        });

        it('enables the save button', () => {
          expect(CustomerResourceCoverage.isSaveButtonDisabled).to.be.false;
        });

        describe('successfully submitting the form', () => {
          beforeEach(() => {
            return CustomerResourceCoverage.clickSaveButton();
          });

          it('displays the saved date range', () => {
            expect(CustomerResourceCoverage.displayText).to.equal('12/16/2018 - 12/18/2018');
          });

          it('displays an edit button', () => {
            expect(CustomerResourceCoverage.hasEditButton).to.be.true;
          });
        });
      });

      describe('entering an invalid date range', () => {
        describe('entering an invalid begin date format', () => {
          beforeEach(() => {
            return CustomerResourceCoverage.dateRangeRowList(0)
              .fillInDateRange('16/12/2018', '')
              .append(CustomerResourceCoverage.dateRangeRowList(0).clearBeginDate());
          });

          it('indicates validation error on begin date', () => {
            expect(CustomerResourceCoverage.dateRangeRowList(0).beginCoverageFieldIsInvalid).to.be.true;
          });

          it('displays messaging that date is invalid format', () => {
            expect(CustomerResourceCoverage.dateRangeRowList(0).beginCoverageFieldValidationError).to.eq(
              'Enter date in MM/DD/YYYY format.'
            );
          });
        });

        describe('entering an end date before a start date', () => {
          beforeEach(() => {
            return CustomerResourceCoverage.dateRangeRowList(0)
              .fillInDateRange('12/18/2018', '12/16/2018');
          });

          it('indicates validation error on begin date', () => {
            expect(CustomerResourceCoverage.dateRangeRowList(0).beginCoverageFieldIsInvalid).to.be.true;
          });

          it('displays messaging that end date is before start date', () => {
            expect(CustomerResourceCoverage.dateRangeRowList(0).beginCoverageFieldValidationError).to.eq(
              'Start date must be before end date'
            );
          });
        });

        describe('add row', () => {
          beforeEach(() => {
            return CustomerResourceCoverage.clickAddRowButton();
          });

          it('adds another row of date inputs', () => {
            expect(CustomerResourceCoverage.dateRangeRowList().length).to.equal(2);
          });

          describe('entering overlapping ranges', () => {
            beforeEach(() => {
              return CustomerResourceCoverage.dateRangeRowList(0).fillInDateRange('12/16/2018', '12/20/2018')
                .append(CustomerResourceCoverage.dateRangeRowList(1).fillInDateRange('12/18/2018', '12/19/2018'));
            });

            it('indicates validation error on begin dates', () => {
              expect(CustomerResourceCoverage.dateRangeRowList(0).beginCoverageFieldIsInvalid).to.be.true;
              expect(CustomerResourceCoverage.dateRangeRowList(1).beginCoverageFieldIsInvalid).to.be.true;
            });

            it('has messaging that dates overlap', () => {
              expect(CustomerResourceCoverage.dateRangeRowList(0).beginCoverageFieldValidationError).to.eq(
                'Date range overlaps with 12/18/2018 - 12/19/2018'
              );
              expect(CustomerResourceCoverage.dateRangeRowList(1).beginCoverageFieldValidationError).to.eq(
                'Date range overlaps with 12/16/2018 - 12/20/2018'
              );
            });
          });
        });

        describe('entering a date range outside of package coverage range', () => {
          beforeEach(() => {
            return CustomerResourceCoverage.dateRangeRowList(0)
              .fillInDateRange('11/16/2018', '01/14/2019');
          });

          it('indicates validation error on begin date', () => {
            expect(CustomerResourceCoverage.dateRangeRowList(0).beginCoverageFieldIsInvalid).to.be.true;
          });

          it('indicates validation error on end date', () => {
            expect(CustomerResourceCoverage.dateRangeRowList(0).endCoverageFieldIsInvalid).to.be.true;
          });

          it('displays messaging that begin date is outside of package coverage range', () => {
            expect(CustomerResourceCoverage.dateRangeRowList(0).beginCoverageFieldValidationError).to.eq(
              "Dates must be within package's date range (12/1/2018 - 12/31/2018)."
            );
          });

          it('displays messaging that end date is outside of package coverage range', () => {
            expect(CustomerResourceCoverage.dateRangeRowList(0).endCoverageFieldValidationError).to.eq(
              "Dates must be within package's date range (12/1/2018 - 12/31/2018)."
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
      expect(CustomerResourceCoverage.hasEditButton).to.be.true;
    });

    it('does not display an add custom coverage button', () => {
      expect(CustomerResourceCoverage.hasAddButton).to.be.false;
    });

    describe('clicking the edit button', () => {
      beforeEach(() => {
        return CustomerResourceCoverage.clickEditButton();
      });

      it('reveals the custom coverage form', () => {
        expect(CustomerResourceCoverage.hasForm).to.be.true;
      });

      it('reveals a cancel button', () => {
        expect(CustomerResourceCoverage.hasCancelButton).to.be.true;
      });

      it('shows a single row of inputs', () => {
        expect(CustomerResourceCoverage.dateRangeRowList().length).to.equal(1);
      });

      it('reveals a save button', () => {
        expect(CustomerResourceCoverage.hasSaveButton).to.be.true;
      });

      it('disables the save button', () => {
        expect(CustomerResourceCoverage.isSaveButtonDisabled).to.be.true;
      });

      describe('editing one of the fields', () => {
        beforeEach(() => {
          return CustomerResourceCoverage.dateRangeRowList(0)
            .fillInDateRange('', '12/16/2018');
        });

        it('enables the save button', () => {
          expect(CustomerResourceCoverage.isSaveButtonDisabled).to.be.false;
        });
      });

      describe('removing the only row', () => {
        beforeEach(() => {
          return CustomerResourceCoverage.dateRangeRowList(0).clickRemoveRowButton();
        });

        it('displays the no rows left message', () => {
          expect(CustomerResourceCoverage.hasNoRowsLeftMessage).to.be.true;
        });

        it('enables the save button', () => {
          expect(CustomerResourceCoverage.isSaveButtonDisabled).to.be.false;
        });

        describe('successfully submitting the form', () => {
          beforeEach(() => {
            return CustomerResourceCoverage.clickSaveButton();
          });

          it('displays an add custom coverage button', () => {
            expect(CustomerResourceCoverage.hasAddButton).to.be.true;
          });
        });
      });
    });
  });
});
