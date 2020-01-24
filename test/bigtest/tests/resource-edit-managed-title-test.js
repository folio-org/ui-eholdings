import { expect } from 'chai';
import { describe, beforeEach, it } from '@bigtest/mocha';

import setupApplication from '../helpers/setup-application';
import ResourceShowPage from '../interactors/resource-show';
import ResourceEditPage from '../interactors/resource-edit';

describe('ResourceEditManagedTitleInManagedPackage', () => {
  setupApplication();
  let provider,
    providerPackage,
    resource;

  beforeEach(function () {
    provider = this.server.create('provider', {
      name: 'Cool Provider'
    });

    providerPackage = this.server.create('package', 'withTitles', {
      provider,
      name: 'Cool Package',
      contentType: 'E-Book',
      titleCount: 5
    });

    const title = this.server.create('title', {
      name: 'Best Title Ever',
      publicationType: 'Streaming Video',
      publisherName: 'Amazing Publisher'
    });

    title.save();

    resource = this.server.create('resource', {
      package: providerPackage,
      isSelected: true,
      title,
      url: 'https://www.frontside.io',
      visibilityData: {
        isHidden: true
      }
    });

    resource.save();
  });

  describe('visiting the resource edit page without coverage dates, statement, or embargo', () => {
    beforeEach(function () {
      resource.managedCoverages = this.server.createList('managed-coverage', 1, {
        beginCoverage: '1969-07-16',
        endCoverage: '1972-12-19'
      }).map(item => item.toJSON());

      resource.save();

      this.visit(`/eholdings/resources/${resource.titleId}/edit`);
    });

    it('displays the managed coverage dates in the form', () => {
      expect(ResourceEditPage.managedCoverageDisplay).to.equal('1969 - 1972');
    });

    it('shows a form with coverage statement', () => {
      expect(ResourceEditPage.coverageStatement).to.equal('');
    });

    it('shows a button to add embargo fields', () => {
      expect(ResourceEditPage.hasAddCustomEmbargoButton).to.be.true;
    });

    it('disables the save button', () => {
      expect(ResourceEditPage.isSaveDisabled).to.be.true;
    });

    describe('clicking cancel', () => {
      beforeEach(() => {
        return ResourceEditPage.clickBackButton();
      });

      it('goes to the resource show page', () => {
        expect(ResourceShowPage.$root).to.exist;
      });
    });

    describe('entering invalid data', () => {
      beforeEach(() => {
        return ResourceEditPage
          .clickAddRowButton()
          .dateRangeRowList(0).fillDates('12/18/2018', '12/16/2018')
          .inputCoverageStatement(`Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
            Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis
            dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec,
            pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo,
            fringilla vel, aliquet nec, vulputate e`)
          .clickAddCustomEmbargoButton()
          .inputEmbargoValue('')
          .blurEmbargoValue()
          .selectEmbargoUnit('Weeks')
          .clickSave();
      });

      it('highlights the textarea with an error state', () => {
        expect(ResourceEditPage.coverageStatementHasError).to.be.true;
      });

      it('displays a validation error message', () => {
        expect(ResourceEditPage.validationErrorOnCoverageStatement).to.equal('Statement must be 350 characters or less.');
      });

      it('displays a validation error for coverage', () => {
        expect(ResourceEditPage.dateRangeRowList(0).beginDate.isInvalid).to.be.true;
      });

      it('displays a validation error for embargo', () => {
        expect(ResourceEditPage.validationErrorOnEmbargoTextField).to.equal('Must be a number');
      });

      describe('removing custom embargo', () => {
        beforeEach(() => {
          return ResourceEditPage.clickRemoveCustomEmbargoButton();
        });

        it('does not show a message that saving will remove embargo', () => {
          expect(ResourceEditPage.hasSavingWillRemoveEmbargoMessage).to.be.false;
        });
      });
    });

    describe('valid data', () => {
      beforeEach(async function () {
        await ResourceEditPage.whenLoaded();
      });

      describe('entering it', () => {
        beforeEach(() => {
          return ResourceEditPage
            .clickAddRowButton()
            .toggleIsVisible()
            .dateRangeRowList(0).fillDates('12/16/2018', '12/18/2018')
            .inputCoverageStatement('Only 90s kids would understand.')
            .clickAddCustomEmbargoButton()
            .inputEmbargoValue('27')
            .blurEmbargoValue()
            .selectEmbargoUnit('Weeks')
            .blurEmbargoUnit();
        });

        describe('clicking cancel', () => {
          beforeEach(() => {
            return ResourceEditPage.clickBackButton();
          });

          it('shows a navigation confirmation modal', () => {
            expect(ResourceEditPage.navigationModal.$root).to.exist;
          });
        });

        describe('clicking save', () => {
          beforeEach(async () => {
            await ResourceEditPage.clickSave();
            await ResourceShowPage.whenLoaded();
          });

          it('goes to the resource show page', () => {
            expect(ResourceShowPage.$root).to.exist;
          });

          it('shows the new statement value', () => {
            expect(ResourceShowPage.coverageStatement).to.equal('Only 90s kids would understand.');
          });

          it('displays the saved visibility', () => {
            expect(ResourceShowPage.isResourceVisible).to.equal(true);
          });

          it('shows the new embargo value', () => {
            expect(ResourceShowPage.customEmbargoPeriod).to.equal('27 Weeks');
          });
        });
      });
    });
  });

  describe('visiting the resource edit page with coverage dates, statement, and embargo', () => {
    beforeEach(function () {
      resource.coverageStatement = 'Use this one weird trick to get access.';
      const customCoverages = [
        this.server.create('custom-coverage', {
          beginCoverage: '1969-07-16',
          endCoverage: '1972-12-19'
        }),
        this.server.create('custom-coverage', {
          beginCoverage: '1973-01-01',
          endCoverage: '1979-12-31'
        })
      ];
      resource.update('customCoverages', customCoverages.map(item => item.toJSON()));
      resource.customEmbargoPeriod = this.server.create('embargo-period', {
        embargoUnit: 'Months',
        embargoValue: 6
      }).toJSON();
      resource.save();

      this.visit(`/eholdings/resources/${resource.titleId}/edit`);
    });

    describe('section: holding status', () => {
      it('displays the title', () => {
        expect(ResourceEditPage.resourceHoldingStatusAccordion.label).to.equal('Holding status');
      });

      it('is expanded by default', () => {
        expect(ResourceEditPage.resourceHoldingStatusAccordion.isOpen).to.equal(true);
      });

      describe('clicking the header', () => {
        beforeEach(async () => {
          await ResourceEditPage.resourceHoldingStatusAccordion.clickHeader();
        });

        it('collapses the section', () => {
          expect(ResourceEditPage.resourceHoldingStatusAccordion.isOpen).to.be.false;
        });

        describe('clicking the header again', () => {
          beforeEach(async () => {
            await ResourceEditPage.resourceHoldingStatusAccordion.clickHeader();
          });

          it('expands the section', () => {
            expect(ResourceEditPage.resourceHoldingStatusAccordion.isOpen).to.be.true;
          });
        });
      });

      it('reflects the desired state of holding status', () => {
        expect(ResourceEditPage.isResourceSelectedBoolean).to.equal(true);
      });

      it('has hidden "Add to holdings" button', () => {
        expect(ResourceEditPage.addToHoldingsButton).to.equal(false);
      });
    });

    describe('section: resource settings', () => {
      it('displays the title', () => {
        expect(ResourceEditPage.resourceSettingsAccordion.label).to.equal('Resource settings');
      });

      it('is expanded by default', () => {
        expect(ResourceEditPage.resourceSettingsAccordion.isOpen).to.equal(true);
      });

      describe('clicking the header', () => {
        beforeEach(async () => {
          await ResourceEditPage.resourceSettingsAccordion.clickHeader();
        });

        it('collapses the section', () => {
          expect(ResourceEditPage.resourceSettingsAccordion.isOpen).to.be.false;
        });

        describe('clicking the header again', () => {
          beforeEach(async () => {
            await ResourceEditPage.resourceSettingsAccordion.clickHeader();
          });

          it('expands the section', () => {
            expect(ResourceEditPage.resourceSettingsAccordion.isOpen).to.be.true;
          });
        });
      });

      it('has "Show to Patrons" field', () => {
        expect(ResourceEditPage.isResourceShowToPatronsVisible).to.equal(true);
      });
    });

    describe('section: coverage settings', () => {
      it('displays the title', () => {
        expect(ResourceEditPage.resourceSettingsAccordion.label).to.equal('Resource settings');
      });

      it('is expanded by default', () => {
        expect(ResourceEditPage.resourceSettingsAccordion.isOpen).to.equal(true);
      });

      describe('clicking the header', () => {
        beforeEach(async () => {
          await ResourceEditPage.resourceSettingsAccordion.clickHeader();
        });

        it('collapses the section', () => {
          expect(ResourceEditPage.resourceSettingsAccordion.isOpen).to.be.false;
        });

        describe('clicking the header again', () => {
          beforeEach(async () => {
            await ResourceEditPage.resourceSettingsAccordion.clickHeader();
          });

          it('expands the section', () => {
            expect(ResourceEditPage.resourceSettingsAccordion.isOpen).to.be.true;
          });
        });
      });

      it('has "Dates" field', () => {
        expect(ResourceEditPage.isCoverageSettingsDatesField).to.equal(true);
      });

      describe('when there are only empty custom coverage date ranges', () => {
        beforeEach(function () {
          const customCoverages = [
            this.server.create('custom-coverage', {}),
            this.server.create('custom-coverage', {}),
          ];
          resource.update('customCoverages', customCoverages.map(item => item.toJSON()));
        });

        it('should display dates row as empty', () => {
          expect(ResourceEditPage.isCoverageDisplayDatesExists).to.equal(false);
        });
      });

      describe('when there is only 1 filled custom coverage date range', () => {
        beforeEach(function () {
          const customCoverages = [
            this.server.create('custom-coverage', {
              beginCoverage: '2018-01-01',
              endCoverage: '2019-12-31',
            }),
          ];
          resource.update('customCoverages', customCoverages.map(item => item.toJSON()));
        });

        it('should display the date range without a separator', () => {
          expect(ResourceEditPage.coverageDisplayDates).to.equal('2018 - 2019');
        });
      });

      describe('when there are at least 2 ranges are filled', () => {
        beforeEach(function () {
          const customCoverages = [
            this.server.create('custom-coverage', {
              beginCoverage: '2018-01-01',
              endCoverage: '2019-07-31'
            }),
            this.server.create('custom-coverage', {
              beginCoverage: '2019-01-01',
              endCoverage: '2020-12-31'
            }),
          ];
          resource.update('customCoverages', customCoverages.map(item => item.toJSON()));
        });

        it('should display ranges separated with comma', () => {
          expect(ResourceEditPage.coverageDisplayDates).to.equal('2019 - 2020, 2018 - 2019');
        });
      });
    });

    describe('clicking the "Collapse all" button', () => {
      beforeEach(async () => {
        await ResourceEditPage.toggleSectionButton.click();
      });

      it('collapses all sections', () => {
        expect(ResourceEditPage.resourceHoldingStatusAccordion.isOpen).to.equal(false);
        expect(ResourceEditPage.resourceSettingsAccordion.isOpen).to.equal(false);
        expect(ResourceEditPage.resourceCoverageSettingsAccordion.isOpen).to.equal(false);
      });

      describe('clicking the "Expand all" button ', () => {
        beforeEach(async () => {
          await ResourceEditPage.toggleSectionButton.click();
        });

        it('expands all sections', () => {
          expect(ResourceEditPage.resourceHoldingStatusAccordion.isOpen).to.equal(true);
          expect(ResourceEditPage.resourceSettingsAccordion.isOpen).to.equal(true);
          expect(ResourceEditPage.resourceCoverageSettingsAccordion.isOpen).to.equal(true);
        });
      });
    });

    it('shows a form with the coverage field', () => {
      expect(ResourceEditPage.coverageStatement).to.equal('Use this one weird trick to get access.');
    });

    it('shows a form with embargo fields', () => {
      expect(ResourceEditPage.customEmbargoTextFieldValue).to.equal('6');
      expect(ResourceEditPage.customEmbargoSelectValue).to.equal('Months');
    });

    it('disables the save button', () => {
      expect(ResourceEditPage.isSaveDisabled).to.be.true;
    });

    describe('removing custom embargo', () => {
      beforeEach(() => {
        return ResourceEditPage.clickRemoveCustomEmbargoButton();
      });

      it('shows a message that saving will remove embargo', () => {
        expect(ResourceEditPage.hasSavingWillRemoveEmbargoMessage).to.be.true;
      });
    });

    describe('clicking cancel', () => {
      beforeEach(() => {
        return ResourceEditPage.clickBackButton();
      });

      it('goes to the resource show page', () => {
        expect(ResourceShowPage.$root).to.exist;
      });
    });

    describe('entering invalid data', () => {
      beforeEach(() => {
        return ResourceEditPage
          .inputCoverageStatement(`Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
            Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis
            dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec,
            pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo,
            fringilla vel, aliquet nec, vulputate e`)
          .dateRangeRowList(0).fillDates('12/18/2018', '12/16/2018')
          .inputEmbargoValue('')
          .blurEmbargoValue()
          .selectEmbargoUnit('Weeks')
          .clickSave();
      });

      it('highlights the textarea with an error state', () => {
        expect(ResourceEditPage.coverageStatementHasError).to.be.true;
      });

      it('displays a validation error for coverage', () => {
        expect(ResourceEditPage.dateRangeRowList(0).beginDate.isInvalid).to.be.true;
      });

      it('displays a validation error message for coverage statement', () => {
        expect(ResourceEditPage.validationErrorOnCoverageStatement).to.equal('Statement must be 350 characters or less.');
      });

      it('displays a validation error for embargo', () => {
        expect(ResourceEditPage.validationErrorOnEmbargoTextField).to.equal('Must be a number');
      });
    });

    describe('entering valid data', () => {
      beforeEach(() => {
        return ResourceEditPage
          .inputCoverageStatement('Refinance your home loans.')
          .dateRangeRowList(0).fillDates('12/16/2018', '12/18/2018')
          .inputEmbargoValue('27')
          .blurEmbargoValue()
          .selectEmbargoUnit('Weeks')
          .blurEmbargoUnit();
      });

      describe('clicking cancel', () => {
        beforeEach(() => {
          return ResourceEditPage.clickBackButton();
        });

        it('shows a navigation confirmation modal', () => {
          expect(ResourceEditPage.navigationModal.$root).to.exist;
        });
      });

      describe('clicking save', () => {
        beforeEach(() => {
          return ResourceEditPage.clickSave();
        });

        it('goes to the resource show page', () => {
          expect(ResourceShowPage.$root).to.exist;
        });

        it('shows the new statement value', () => {
          expect(ResourceShowPage.coverageStatement).to.equal('Refinance your home loans.');
        });

        it('shows the new embargo value', () => {
          expect(ResourceShowPage.customEmbargoPeriod).to.equal('27 Weeks');
        });
      });
    });
  });

  describe('visiting the resource edit page with a coverage statement', () => {
    beforeEach(function () {
      resource.coverageStatement = 'test coverage statement';
      resource.save();
      this.visit(`/eholdings/resources/${resource.titleId}/edit`);
    });

    describe('entering an empty coverage statement', () => {
      beforeEach(() => {
        return ResourceEditPage
          .clickCoverageStatementRadio('yes')
          .inputCoverageStatement('')
          .clickCoverageStatementRadio('yes');
      });

      it('displays a validation error message for empty coverage statement', () => {
        expect(ResourceEditPage.validationErrorOnCoverageStatement).to.equal('Statement field cannot be blank if selected.');
      });
    });
  });

  describe('encountering a server error when GETting', () => {
    beforeEach(function () {
      this.server.get('/resources/:id', {
        errors: [{
          title: 'There was an error'
        }]
      }, 500);

      this.visit(`/eholdings/resources/${resource.id}/edit`);
    });

    it('dies with dignity', () => {
      expect(ResourceEditPage.hasErrors).to.be.true;
    });
  });

  describe('encountering a server error when PUTting', () => {
    beforeEach(function () {
      this.server.put('/resources/:id', {
        errors: [{
          title: 'There was an error'
        }]
      }, 500);

      this.visit(`/eholdings/resources/${resource.id}/edit`);
    });

    describe('entering valid data and clicking save', () => {
      beforeEach(() => {
        return ResourceEditPage
          .inputCoverageStatement('10 ways to fail at everything')
          .clickAddCustomEmbargoButton()
          .inputEmbargoValue('27')
          .blurEmbargoValue()
          .selectEmbargoUnit('Weeks')
          .blurEmbargoUnit()
          .clickSave();
      });

      it('pops up an error', () => {
        expect(ResourceEditPage.toast.errorText).to.equal('There was an error');
      });
    });
  });

  describe('visiting the resource show page', () => {
    beforeEach(function () {
      this.visit(`/eholdings/resources/${resource.id}`);
    });

    describe('clicking the edit button', () => {
      beforeEach(() => {
        return ResourceShowPage.clickEditButton();
      });

      it('should display the back button in pane header', () => {
        expect(ResourceEditPage.hasBackButton).to.be.true;
      });
    });
  });

  describe('visiting the resource edit page which is not selected', () => {
    beforeEach(function () {
      resource.isSelected = false;
      resource.save();
      this.visit(`/eholdings/resources/${resource.titleId}/edit`);
    });

    it('custom labels accordion should not be present', () => {
      expect(ResourceEditPage.resourceCustomLabelsAccordion.isPresent).to.be.false;
    });
  });
});
