import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import moment from 'moment';

import setupApplication from '../helpers/setup-application';
import ResourceEditPage from '../interactors/resource-edit';
import ResourcePage from '../interactors/resource-show';

describe('CustomResourceEditCustomCoverage', () => {
  setupApplication();
  let pkg,
    title,
    resource;

  beforeEach(function () {
    pkg = this.server.create('package', 'withProvider');

    pkg.customCoverage = {
      beginCoverage: '2018-12-01',
      endCoverage: '2018-12-31'
    };
    pkg.isCustom = true;
    pkg.save();

    title = this.server.create('title', {
      publicationType: 'Journal',
      isTitleCustom: true
    });

    resource = this.server.create('resource', {
      package: pkg,
      title
    });
  });

  describe('visiting a selected custom resource edit page without custom coverage', () => {
    beforeEach(function () {
      resource.isSelected = true;
      resource.save();

      this.visit(`/eholdings/resources/${resource.id}/edit`);
    });

    it('disables the save button', () => {
      expect(ResourceEditPage.isSaveDisabled).to.be.true;
    });

    it('displays an add custom coverage button', () => {
      expect(ResourceEditPage.hasAddCustomCoverageButton).to.be.true;
    });

    describe('clicking the add date range button', () => {
      beforeEach(() => {
        return ResourceEditPage.clickAddRowButton();
      });

      it('shows a single row of inputs', () => {
        expect(ResourceEditPage.dateRangeRowList().length).to.equal(1);
      });

      describe('clicking the add date range button', () => {
        beforeEach(() => {
          return ResourceEditPage.clickAddRowButton();
        });

        it('adds another row of date inputs', () => {
          expect(ResourceEditPage.dateRangeRowList().length).to.equal(2);
        });

        it('does not put any values in the new inputs', () => {
          expect(ResourceEditPage.dateRangeRowList(1).beginDate.inputValue).to.equal('');
          expect(ResourceEditPage.dateRangeRowList(1).endDate.inputValue).to.equal('');
        });

        describe('clicking the clear row button', () => {
          beforeEach(() => {
            return ResourceEditPage.dateRangeRowList(1).clickRemoveRowButton();
          });

          it('removes the new row', () => {
            expect(ResourceEditPage.dateRangeRowList().length).to.equal(1);
          });

          it.always('does not display the saving will remove message', () => {
            expect(ResourceEditPage.hasSavingWillRemoveMessage).to.be.false;
          });
        });
      });

      describe('entering a valid date range', () => {
        beforeEach(() => {
          return ResourceEditPage.dateRangeRowList(0)
            .fillDates('12/16/2018', '12/18/2018');
        });

        it('shows the input as changed', () => {
          expect(ResourceEditPage.dateRangeRowList(0).beginDate.inputValue).to.equal('12/16/2018');
          expect(ResourceEditPage.dateRangeRowList(0).endDate.inputValue).to.equal('12/18/2018');
        });

        describe('clicking save', () => {
          beforeEach(() => {
            return ResourceEditPage.clickSave();
          });

          it('goes to the resource show page', () => {
            expect(ResourcePage.$root).to.exist;
          });

          it('displays the customcoverage section for single date', () => {
            expect(ResourcePage.customCoverageList).to.equal('12/16/2018 - 12/18/2018');
          });
        });
      });

      describe('entering an invalid date range', () => {
        describe('entering an invalid begin date format', () => {
          beforeEach(() => {
            return ResourceEditPage.dateRangeRowList(0)
              .fillDates('16/12/2018', '')
              .dateRangeRowList(0).beginDate.clearInput()
              .clickSave();
          });

          it('indicates validation error on begin date', () => {
            expect(ResourceEditPage.dateRangeRowList(0).beginDate.isInvalid).to.be.true;
          });

          it('displays messaging that date is invalid format', () => {
            expect(ResourceEditPage.dateRangeRowList(0).beginDate.validationError).to.eq(
              'Enter date in MM/DD/YYYY format.'
            );
          });
        });

        describe('entering an end date before a start date', () => {
          beforeEach(() => {
            return ResourceEditPage.dateRangeRowList(0)
              .fillDates('12/18/2018', '12/16/2018')
              .clickSave();
          });

          it('indicates validation error on begin date', () => {
            expect(ResourceEditPage.dateRangeRowList(0).beginDate.isInvalid).to.be.true;
          });

          it('displays messaging that end date is before start date', () => {
            expect(ResourceEditPage.dateRangeRowList(0).beginDate.validationError).to.eq(
              'Start date must be before end date'
            );
          });
        });

        describe('entering a date range outside of package coverage range', () => {
          beforeEach(() => {
            return ResourceEditPage.dateRangeRowList(0)
              .fillDates('11/16/2018', '01/14/2019')
              .clickSave();
          });

          it('indicates validation error on begin date', () => {
            expect(ResourceEditPage.dateRangeRowList(0).beginDate.isInvalid).to.be.true;
          });

          it('indicates validation error on end date', () => {
            expect(ResourceEditPage.dateRangeRowList(0).endDate.isInvalid).to.be.true;
          });

          it('displays messaging that begin date is outside of package coverage range', () => {
            expect(ResourceEditPage.dateRangeRowList(0).beginDate.validationError).to.eq(
              "Dates must be within package's date range (12/1/2018 - 12/31/2018)."
            );
          });

          it('displays messaging that end date is outside of package coverage range', () => {
            expect(ResourceEditPage.dateRangeRowList(0).endDate.validationError).to.eq(
              "Dates must be within package's date range (12/1/2018 - 12/31/2018)."
            );
          });
        });

        describe('entering overlapping date ranges', () => {
          beforeEach(() => {
            return ResourceEditPage.dateRangeRowList(0)
              .fillDates('12/16/2018', '12/20/2018');
          });

          describe('clicking the add date range button', () => {
            beforeEach(() => {
              return ResourceEditPage.clickAddRowButton();
            });

            it('adds another row of date inputs', () => {
              expect(ResourceEditPage.dateRangeRowList().length).to.equal(2);
            });

            describe('entering overlapping ranges', () => {
              beforeEach(() => {
                return ResourceEditPage.dateRangeRowList(1)
                  .fillDates('12/18/2018', '12/19/2018')
                  .clickSave();
              });

              it('indicates validation error on begin dates', () => {
                expect(ResourceEditPage.dateRangeRowList(1).beginDate.isInvalid).to.be.true;
                expect(ResourceEditPage.dateRangeRowList(1).endDate.isInvalid).to.be.true;
              });

              it('has messaging that dates overlap', () => {
                expect(ResourceEditPage.dateRangeRowList(0).beginDate.validationError).to.eq(
                  'Date range overlaps with 12/18/2018 - 12/19/2018.'
                );
                expect(ResourceEditPage.dateRangeRowList(1).beginDate.validationError).to.eq(
                  'Date range overlaps with 12/16/2018 - 12/20/2018.'
                );
              });
            });
          });
        });
      });
    });
  });

  describe('visiting a selected custom resource edit page with custom coverage', () => {
    beforeEach(function () {
      resource.isSelected = true;
      const customCoverages = [
        this.server.create('custom-coverage', {
          beginCoverage: '2018-12-16',
          endCoverage: '2018-12-19'
        })
      ];
      resource.update('customCoverages', customCoverages.map(item => item.toJSON()));
      resource.save();

      this.visit(`/eholdings/resources/${resource.id}/edit`);
    });

    it('displays the date ranges', () => {
      expect(ResourceEditPage.dateRangeRowList(0).beginDate.inputValue).to.equal('12/16/2018');
      expect(ResourceEditPage.dateRangeRowList(0).endDate.inputValue).to.equal('12/19/2018');
    });

    describe('removing the only row', () => {
      beforeEach(() => {
        return ResourceEditPage.dateRangeRowList(0).clickRemoveRowButton();
      });

      it('displays the saving will remove message', () => {
        expect(ResourceEditPage.hasSavingWillRemoveMessage).to.be.true;
      });

      it('enables the save button', () => {
        expect(ResourceEditPage.isSaveDisabled).to.be.false;
      });

      describe('clicking save', () => {
        beforeEach(() => {
          return ResourceEditPage.clickSave();
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

  describe('visiting a selected custom resource edit page with multiple custom coverages', () => {
    beforeEach(function () {
      resource.isSelected = true;
      const customCoverages = [
        this.server.create('custom-coverage', {
          beginCoverage: '2018-12-17',
          endCoverage: '2018-12-20'
        }),
        this.server.create('custom-coverage', {
          beginCoverage: '2018-12-01',
          endCoverage: '2018-12-15'
        }),
      ];

      resource.update('customCoverages', customCoverages.map(item => item.toJSON()));
      resource.save();

      this.visit(`/eholdings/resources/${resource.id}/edit`);
    });

    it('displays correct number of rows for date ranges', () => {
      expect(ResourceEditPage.dateRangeRowList().length).to.equal(2);
    });

    it('all rows are filled with dates', () => {
      expect(moment(ResourceEditPage.dateRangeRowList(0).beginDate.inputValue).isValid()).to.be.true;
      expect(moment(ResourceEditPage.dateRangeRowList(0).endDate.inputValue).isValid()).to.be.true;
      expect(moment(ResourceEditPage.dateRangeRowList(1).beginDate.inputValue).isValid()).to.be.true;
      expect(moment(ResourceEditPage.dateRangeRowList(1).endDate.inputValue).isValid()).to.be.true;
    });
  });
});
