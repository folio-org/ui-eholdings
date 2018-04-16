import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';
import { describeApplication } from './helpers';
import ResourcePage from './pages/resource-show';
import ResourceCoverage from './pages/resource-custom-coverage';

describeApplication('ResourceCustomCoverage', () => {
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

    resource = this.server.create('resource', {
      package: pkg,
      title
    });
  });

  describe('visiting an unselected resource show page', () => {
    beforeEach(function () {
      resource.isSelected = false;
      resource.save();

      return this.visit(`/eholdings/resources/${resource.id}`, () => {
        expect(ResourcePage.$root).to.exist;
      });
    });

    it('does not display coverage', () => {
      expect(ResourceCoverage.exists).to.be.false;
    });
  });

  describe('visiting a selected resource show page without custom coverage', () => {
    beforeEach(function () {
      resource.isSelected = true;
      resource.save();

      return this.visit(`/eholdings/resources/${resource.id}`, () => {
        expect(ResourcePage.$root).to.exist;
      });
    });

    it('displays an add custom coverage button', () => {
      expect(ResourceCoverage.hasAddButton).to.be.true;
    });

    describe('clicking the add custom coverage button', () => {
      beforeEach(() => {
        return ResourceCoverage.clickAddButton();
      });

      it('reveals the custom coverage form', () => {
        expect(ResourceCoverage.hasForm).to.be.true;
      });

      it('reveals a cancel button', () => {
        expect(ResourceCoverage.hasCancelButton).to.be.true;
      });

      it('shows a single row of inputs', () => {
        expect(ResourceCoverage.dateRangeRowList().length).to.equal(1);
      });

      it('reveals a save button', () => {
        expect(ResourceCoverage.hasSaveButton).to.be.true;
      });

      it('disables the save button', () => {
        expect(ResourceCoverage.isSaveButtonDisabled).to.be.true;
      });

      it('hides the add custom coverage button', () => {
        expect(ResourceCoverage.hasAddButton).to.be.false;
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
            .to.equal(`/eholdings/resources/${resource.id}`);
        });
      });

      describe('clicking cancel', () => {
        beforeEach(() => {
          return ResourceCoverage.clickCancelButton();
        });

        it('hides the custom coverage form', () => {
          expect(ResourceCoverage.hasForm).to.be.false;
        });

        it('displays an add custom coverage button', () => {
          expect(ResourceCoverage.hasAddButton).to.exist;
        });
      });

      describe('clicking the add row button', () => {
        beforeEach(() => {
          return ResourceCoverage.clickAddRowButton();
        });

        it('adds another row of date inputs', () => {
          expect(ResourceCoverage.dateRangeRowList().length).to.equal(2);
        });

        it('does not put any values in the new inputs', () => {
          expect(ResourceCoverage.dateRangeRowList(1).beginDate.value).to.equal('');
          expect(ResourceCoverage.dateRangeRowList(1).endDate.value).to.equal('');
        });

        describe('clicking the clear row button', () => {
          beforeEach(() => {
            return ResourceCoverage.dateRangeRowList(1).clickRemoveRowButton();
          });

          it('removes the new row', () => {
            expect(ResourceCoverage.dateRangeRowList().length).to.equal(1);
          });

          it.always('does not display the saving will remove message', () => {
            expect(ResourceCoverage.hasSavingWillRemoveMessage).to.be.false;
          });
        });
      });

      describe('entering a valid date range', () => {
        beforeEach(() => {
          return ResourceCoverage.dateRangeRowList(0)
            .fillDates('12/16/2018', '12/18/2018');
        });

        it('shows the input as changed', () => {
          expect(ResourceCoverage.dateRangeRowList(0).beginDate.isChanged).to.be.true;
        });

        it('enables the save button', () => {
          expect(ResourceCoverage.isSaveButtonDisabled).to.be.false;
        });

        describe('successfully submitting the form', () => {
          beforeEach(() => {
            return ResourceCoverage.clickSaveButton();
          });

          it('displays the saved date range', () => {
            expect(ResourceCoverage.displayText).to.equal('12/16/2018 - 12/18/2018');
          });

          it('displays an edit button', () => {
            expect(ResourceCoverage.hasEditButton).to.be.true;
          });
        });
      });

      describe('entering an invalid date range', () => {
        describe('entering an invalid begin date format', () => {
          beforeEach(() => {
            return ResourceCoverage.dateRangeRowList(0)
              .fillDates('16/12/2018', '')
              .append(ResourceCoverage.dateRangeRowList(0).beginDate.clearInput());
          });

          it('indicates validation error on begin date', () => {
            expect(ResourceCoverage.dateRangeRowList(0).beginDate.isInvalid).to.be.true;
          });

          it('displays messaging that date is invalid format', () => {
            expect(ResourceCoverage.dateRangeRowList(0).beginDate.validationError).to.eq(
              'Enter date in MM/DD/YYYY format.'
            );
          });
        });

        describe('entering an end date before a start date', () => {
          beforeEach(() => {
            return ResourceCoverage.dateRangeRowList(0)
              .fillDates('12/18/2018', '12/16/2018');
          });

          it('indicates validation error on begin date', () => {
            expect(ResourceCoverage.dateRangeRowList(0).beginDate.isInvalid).to.be.true;
          });

          it('displays messaging that end date is before start date', () => {
            expect(ResourceCoverage.dateRangeRowList(0).beginDate.validationError).to.eq(
              'Start date must be before end date'
            );
          });
        });

        describe('add row', () => {
          beforeEach(() => {
            return ResourceCoverage.clickAddRowButton();
          });

          it('adds another row of date inputs', () => {
            expect(ResourceCoverage.dateRangeRowList().length).to.equal(2);
          });

          describe.skip('entering overlapping ranges', () => {
            beforeEach(() => {
              return ResourceCoverage.dateRangeRowList(0).fillDates('12/16/2018', '12/20/2018')
                .append(ResourceCoverage.dateRangeRowList(1).fillDates('12/18/2018', '12/19/2018'));
            });

            it.pause('indicates validation error on begin dates', () => {
              expect(ResourceCoverage.dateRangeRowList(0).beginDate.isInvalid).to.be.true;
              expect(ResourceCoverage.dateRangeRowList(1).beginDate.isInvalid).to.be.true;
            });

            it('has messaging that dates overlap', () => {
              expect(ResourceCoverage.dateRangeRowList(0).beginDate.validationError).to.eq(
                'Date range overlaps with 12/18/2018 - 12/19/2018'
              );
              expect(ResourceCoverage.dateRangeRowList(1).beginDate.validationError).to.eq(
                'Date range overlaps with 12/16/2018 - 12/20/2018'
              );
            });
          });
        });

        describe('entering a date range outside of package coverage range', () => {
          beforeEach(() => {
            return ResourceCoverage.dateRangeRowList(0)
              .fillDates('11/16/2018', '01/14/2019');
          });

          it('indicates validation error on begin date', () => {
            expect(ResourceCoverage.dateRangeRowList(0).beginDate.isInvalid).to.be.true;
          });

          it('indicates validation error on end date', () => {
            expect(ResourceCoverage.dateRangeRowList(0).endDate.isInvalid).to.be.true;
          });

          it('displays messaging that begin date is outside of package coverage range', () => {
            expect(ResourceCoverage.dateRangeRowList(0).beginDate.validationError).to.eq(
              "Dates must be within package's date range (12/1/2018 - 12/31/2018)."
            );
          });

          it('displays messaging that end date is outside of package coverage range', () => {
            expect(ResourceCoverage.dateRangeRowList(0).endDate.validationError).to.eq(
              "Dates must be within package's date range (12/1/2018 - 12/31/2018)."
            );
          });
        });
      });
    });
  });

  describe('visiting a selected resource show page with custom coverage', () => {
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

      return this.visit(`/eholdings/resources/${resource.id}`, () => {
        expect(ResourcePage.$root).to.exist;
      });
    });

    it('displays the date ranges', () => {
      expect(ResourceCoverage.displayText).to.equal('7/16/1969 - 12/19/1972');
    });

    it('displays an edit button', () => {
      expect(ResourceCoverage.hasEditButton).to.be.true;
    });

    it('does not display an add custom coverage button', () => {
      expect(ResourceCoverage.hasAddButton).to.be.false;
    });

    describe('clicking the edit button', () => {
      beforeEach(() => {
        return ResourceCoverage.clickEditButton();
      });

      it('reveals the custom coverage form', () => {
        expect(ResourceCoverage.hasForm).to.be.true;
      });

      it('reveals a cancel button', () => {
        expect(ResourceCoverage.hasCancelButton).to.be.true;
      });

      it('shows a single row of inputs', () => {
        expect(ResourceCoverage.dateRangeRowList().length).to.equal(1);
      });

      it('reveals a save button', () => {
        expect(ResourceCoverage.hasSaveButton).to.be.true;
      });

      it('disables the save button', () => {
        expect(ResourceCoverage.isSaveButtonDisabled).to.be.true;
      });

      describe('editing one of the fields', () => {
        beforeEach(() => {
          return ResourceCoverage.dateRangeRowList(0)
            .fillDates('', '12/16/2018');
        });

        it('enables the save button', () => {
          expect(ResourceCoverage.isSaveButtonDisabled).to.be.false;
        });
      });

      describe('removing the only row', () => {
        beforeEach(() => {
          return ResourceCoverage.dateRangeRowList(0).clickRemoveRowButton();
        });

        it.always('displays the saving will remove message', () => {
          expect(ResourceCoverage.hasSavingWillRemoveMessage).to.be.true;
        });

        it('enables the save button', () => {
          expect(ResourceCoverage.isSaveButtonDisabled).to.be.false;
        });

        describe('successfully submitting the form', () => {
          beforeEach(() => {
            return ResourceCoverage.clickSaveButton();
          });

          it('displays an add custom coverage button', () => {
            expect(ResourceCoverage.hasAddButton).to.be.true;
          });
        });
      });
    });
  });
});
