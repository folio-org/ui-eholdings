import { expect } from 'chai';
import { describe, beforeEach, it } from '@bigtest/mocha';

import setupApplication from '../helpers/setup-application';
import ResourceShowPage from '../interactors/resource-show';
import ResourceEditPage from '../interactors/resource-edit';
import wait from '../helpers/wait';

describe.skip('ResourceEditCustomTitle', function () {
  setupApplication();
  // some of the beforeEach blocks seem to timeout in CI
  this.timeout(5000);
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
      publisherName: 'Amazing Publisher',
      isTitleCustom: true
    });

    title.save();

    resource = this.server.create('resource', {
      package: providerPackage,
      isSelected: true,
      visibilityData: {
        isHidden: true
      },
      title,
      url: 'https://frontside.io'
    });

    resource.managedCoverages = this.server.createList('managed-coverage', 1, {
      beginCoverage: '1969-07-16',
      endCoverage: '1972-12-19'
    }).map(m => m.toJSON());
    resource.save();
  });

  describe('visting the custom resource edit page but the resource is unselected', () => {
    beforeEach(async function () {
      const title = await this.server.create('title', {
        name: 'Best Title Ever',
        publicationType: 'Streaming Video',
        publisherName: 'Amazing Publisher',
        isTitleCustom: true
      });

      await title.save();

      resource = await this.server.create('resource', {
        package: providerPackage,
        isSelected: false,
        visibilityData: {
          isHidden: true
        },
        title,
        url: 'https://frontside.io'
      });

      this.visit(`/eholdings/resources/${resource.titleId}/edit`);
      await ResourceEditPage.whenLoaded();
    });

    describe('with the resource unselected', () => {
      it('should not display the coverage button', () => {
        expect(ResourceEditPage.hasAddCustomCoverageButton).to.be.false;
      });

      it('should not display the custom embargo button', () => {
        expect(ResourceEditPage.hasAddCustomEmbargoButton).to.be.false;
      });

      it('should not display the coverage statement textarea', () => {
        expect(ResourceEditPage.hasCoverageStatementArea).to.be.false;
      });
    });
  });

  describe('visiting the resource edit page without coverage dates or statements', () => {
    beforeEach(async function () {
      this.visit(`/eholdings/resources/${resource.titleId}/edit`);
      await ResourceEditPage.whenLoaded();
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

    it('shows a form with coverage statement', () => {
      expect(ResourceEditPage.coverageStatement).to.equal('');
    });

    it('shows a button to add embargo fields', () => {
      expect(ResourceEditPage.hasAddCustomEmbargoButton).to.be.true;
    });

    it('shows a form with custom url', () => {
      expect(ResourceEditPage.customUrlFieldValue).to.equal('https://frontside.io');
    });

    it('shows a form with a visibility field', () => {
      expect(ResourceEditPage.isResourceVisible).to.equal(false);
    });

    it('disables the save button', () => {
      expect(ResourceEditPage.isSaveDisabled).to.be.true;
    });

    describe('clicking cancel', () => {
      beforeEach(async () => {
        await ResourceEditPage.clickCancel();
        await ResourceShowPage.whenLoaded();
      });

      it('goes to the resource show page', () => {
        expect(ResourceShowPage.$root).to.exist;
      });
    });

    describe('entering an invalid url', () => {
      beforeEach(async () => {
        await ResourceEditPage.inputCustomUrlValue('no-http.com');
        await ResourceEditPage.clickSave();
        await wait(5000);
      });

      it('displays a custom url validation error message', () => {
        expect(ResourceEditPage.validationErrorOnCustomUrl).to
          .equal('The URL should include http:// or https://');
      });
    });

    describe('entering a blank url', () => {
      beforeEach(async () => {
        await ResourceEditPage.inputCustomUrlValue('');
        await ResourceEditPage.clickSave();
      });

      it('goes to the show page & does not display a URL', () => {
        expect(ResourceShowPage.isUrlPresent).to.equal(false);
      });
    });

    describe('entering invalid data', () => {
      beforeEach(async () => {
        await ResourceEditPage.clickAddRowButton();
        await ResourceEditPage.dateRangeRowList(0).fillDates('12/18/2018', '12/16/2018');
        await ResourceEditPage.clickAddCustomEmbargoButton();
        await ResourceEditPage.inputEmbargoValue('');
        await ResourceEditPage.inputCustomUrlValue(`http://${new Array(610 + 1).join('a')}`); // create a 610 char string
        await ResourceEditPage.blurEmbargoValue();
        await ResourceEditPage.selectEmbargoUnit('Weeks');
        await ResourceEditPage.clickSave();
        await wait(5000);
      });

      it('displays a validation error for coverage', () => {
        expect(ResourceEditPage.dateRangeRowList(0).beginDate.isInvalid).to.be.true;
      });

      it('displays a validation error for embargo', () => {
        expect(ResourceEditPage.validationErrorOnEmbargoTextField).to.equal('Must be a number');
      });

      it('displays a custom url validation error message', () => {
        expect(ResourceEditPage.validationErrorOnCustomUrl).to
          .equal('Custom URLs must be 600 characters or less.');
      });

      describe('removing custom embargo', () => {
        beforeEach(async () => {
          await ResourceEditPage.clickRemoveCustomEmbargoButton();
        });

        it.always('does not show a message that saving will remove embargo', () => {
          expect(ResourceEditPage.hasSavingWillRemoveEmbargoMessage).to.be.false;
        });
      });
    });

    describe('valid data', () => {
      beforeEach(async function () {
        await ResourceEditPage.whenLoaded();
        await ResourceEditPage.clickAddRowButton();
        await ResourceEditPage.toggleIsVisible();
        await ResourceEditPage.dateRangeRowList(0).fillDates('12/16/2018', '12/18/2018');
        await ResourceEditPage.inputCoverageStatement('Only 90s kids would understand.');
        await ResourceEditPage.clickAddCustomEmbargoButton();
        await ResourceEditPage.inputEmbargoValue('27');
        await ResourceEditPage.inputCustomUrlValue('https://bigtestjs.io');
        await ResourceEditPage.blurEmbargoValue();
        await ResourceEditPage.selectEmbargoUnit('Weeks');
        await ResourceEditPage.blurEmbargoUnit();
        await ResourceEditPage.clickSave();
        await ResourceShowPage.whenLoaded();
      });

      it('goes to the resource show page', () => {
        expect(ResourceShowPage.$root).to.exist;
      });

      it('displays the saved date range', () => {
        expect(ResourceShowPage.customCoverageList).to.equal('2018');
      });

      it('displays the saved visibility', () => {
        expect(ResourceShowPage.isResourceVisible).to.equal(true);
      });

      it('shows the new statement value', () => {
        expect(ResourceShowPage.coverageStatement).to.equal('Only 90s kids would understand.');
      });

      it('shows the new embargo value', () => {
        expect(ResourceShowPage.customEmbargoPeriod).to.equal('27 Weeks');
      });

      it('shows the new url value', () => {
        expect(ResourceShowPage.url).to.equal('https://bigtestjs.io');
      });
    });
  });

  describe('visiting the resource edit page with coverage dates, statements, and embargo', () => {
    beforeEach(async function () {
      const customCoverages = [
        await this.server.create('custom-coverage', {
          beginCoverage: '1969-07-16',
          endCoverage: '1972-12-19'
        })
      ];
      await resource.update('customCoverages', customCoverages.map(item => item.toJSON()));
      resource.customEmbargoPeriod = this.server.create('embargo-period', {
        embargoUnit: 'Months',
        embargoValue: 6
      }).toJSON();
      await resource.save();

      this.visit(`/eholdings/resources/${resource.titleId}/edit`);
      await ResourceEditPage.whenLoaded();
    });

    it('shows a form with embargo fields', () => {
      expect(ResourceEditPage.customEmbargoTextFieldValue).to.equal('6');
      expect(ResourceEditPage.customEmbargoSelectValue).to.equal('Months');
    });

    it('disables the save button', () => {
      expect(ResourceEditPage.isSaveDisabled).to.be.true;
    });

    describe('removing custom embargo', () => {
      beforeEach(async () => {
        await ResourceEditPage.clickRemoveCustomEmbargoButton();
      });

      it('shows a message that saving will remove embargo', () => {
        expect(ResourceEditPage.hasSavingWillRemoveEmbargoMessage).to.be.true;
      });
    });

    describe('clicking cancel', () => {
      beforeEach(async () => {
        await ResourceEditPage.clickCancel();
        await ResourceShowPage.whenLoaded();
      });

      it('goes to the resource show page', () => {
        expect(ResourceShowPage.$root).to.exist;
      });

      it('displays the original date range', () => {
        expect(ResourceShowPage.customCoverageList).to.equal('1969 - 1972');
      });
    });

    // TODO Refactor to move this test up to set the custom-coverage before the page visit
    describe.skip('when there are only empty custom coverage date ranges', () => {
      beforeEach(async function () {
        const customCoverages = [
          await this.server.create('custom-coverage', {}),
          await this.server.create('custom-coverage', {}),
        ];
        await resource.update('customCoverages', customCoverages.map(item => item.toJSON()));
      });

      it('should display dates row as empty', () => {
        expect(ResourceEditPage.isCoverageDisplayDatesExists).to.equal(false);
      });
    });

    // TODO Refactor to move this test up to set the custom-coverage before the page visit
    describe.skip('when there is only 1 filled custom coverage date range', () => {
      beforeEach(async function () {
        const customCoverages = [
          await this.server.create('custom-coverage', {
            beginCoverage: '2018-01-01',
            endCoverage: '2019-12-31',
          }),
        ];
        await resource.update('customCoverages', customCoverages.map(item => item.toJSON()));
      });

      it('should display the date range without a separator', () => {
        expect(ResourceEditPage.coverageDisplayDates).to.equal('2018 - 2019');
      });
    });

    // TODO refactor to move the test up to set custom coversges before the visit
    describe.skip('when there are at least 2 ranges are filled', () => {
      beforeEach(async function () {
        const customCoverages = [
          await this.server.create('custom-coverage', {
            beginCoverage: '2018-01-01',
            endCoverage: '2019-07-31'
          }),
          await this.server.create('custom-coverage', {
            beginCoverage: '2019-01-01',
            endCoverage: '2020-12-31'
          }),
        ];
        await resource.update('customCoverages', customCoverages.map(item => item.toJSON()));
      });

      it('should display ranges separated with comma', () => {
        expect(ResourceEditPage.coverageDisplayDates).to.equal('2019 - 2020, 2018 - 2019');
      });
    });

    describe('entering invalid data', () => {
      beforeEach(async () => {
        await ResourceEditPage.dateRangeRowList(0).fillDates('12/18/2018', '12/16/2018');
        await ResourceEditPage.inputCoverageStatement(`Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
            Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis
            dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec,
            pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo,
            fringilla vel, aliquet nec, vulputate e`);
        await ResourceEditPage.inputEmbargoValue('');
        await ResourceEditPage.blurEmbargoValue();
        await ResourceEditPage.selectEmbargoUnit('Weeks');
        await ResourceEditPage.clickSave();
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
      beforeEach(async () => {
        await ResourceEditPage.dateRangeRowList(0).fillDates('12/16/2018', '12/18/2018');
        await ResourceEditPage.inputCoverageStatement('Refinance your home loans.');
        await ResourceEditPage.inputEmbargoValue('27');
        await ResourceEditPage.blurEmbargoValue();
        await ResourceEditPage.selectEmbargoUnit('Weeks');
        await ResourceEditPage.blurEmbargoUnit();
      });

      describe('clicking cancel', () => {
        beforeEach(async () => {
          await ResourceEditPage.clickCancel();
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

        it('displays the saved date range', () => {
          expect(ResourceShowPage.customCoverageList).to.equal('2018');
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
    beforeEach(async function () {
      resource.coverageStatement = 'test coverage statement';
      await resource.save();
      this.visit(`/eholdings/resources/${resource.titleId}/edit`);
      await ResourceEditPage.whenLoaded();
    });

    describe('entering an empty coverage statement', () => {
      beforeEach(async () => {
        await ResourceEditPage.clickCoverageStatementRadio('yes');
        await ResourceEditPage.inputCoverageStatement('');
        await ResourceEditPage.clickCoverageStatementRadio('yes');
      });

      it('displays a validation error message for empty coverage statement', () => {
        expect(ResourceEditPage.validationErrorOnCoverageStatement).to.equal('Statement field cannot be blank if selected.');
      });
    });
  });

  describe('encountering a server error when GETting', () => {
    beforeEach(async function () {
      await this.server.get('/resources/:id', {
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
    beforeEach(async function () {
      await this.server.put('/resources/:id', {
        errors: [{
          title: 'There was an error'
        }]
      }, 500);

      this.visit(`/eholdings/resources/${resource.id}/edit`);
    });

    describe('entering valid data and clicking save', () => {
      beforeEach(async () => {
        await ResourceEditPage.inputCoverageStatement('10 ways to fail at everything');
        await ResourceEditPage.clickAddCustomEmbargoButton();
        await ResourceEditPage.inputEmbargoValue('27');
        await ResourceEditPage.blurEmbargoValue();
        await ResourceEditPage.selectEmbargoUnit('Weeks');
        await ResourceEditPage.blurEmbargoUnit();
        await ResourceEditPage.clickSave();
      });

      it('pops up an error', () => {
        expect(ResourceEditPage.toast.errorText).to.equal('There was an error');
      });
    });
  });
});
