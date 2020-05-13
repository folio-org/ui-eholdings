import { expect } from 'chai';
import { describe, beforeEach, it } from '@bigtest/mocha';

import setupApplication from '../helpers/setup-application';
import ResourceShowPage from '../interactors/resource-show';
import ResourceEditPage from '../interactors/resource-edit';

describe('ResourceEditCustomTitle', () => {
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
    beforeEach(function () {
      const title = this.server.create('title', {
        name: 'Best Title Ever',
        publicationType: 'Streaming Video',
        publisherName: 'Amazing Publisher',
        isTitleCustom: true
      });

      title.save();

      resource = this.server.create('resource', {
        package: providerPackage,
        isSelected: false,
        visibilityData: {
          isHidden: true
        },
        title,
        url: 'https://frontside.io'
      });

      this.visit(`/eholdings/resources/${resource.titleId}/edit`);
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
    beforeEach(function () {
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
      beforeEach(() => {
        return ResourceEditPage.clickBackButton();
      });

      it('goes to the resource show page', () => {
        expect(ResourceShowPage.$root).to.exist;
      });
    });

    describe('entering an invalid url', () => {
      beforeEach(() => {
        return ResourceEditPage
          .inputCustomUrlValue('no-http.com')
          .clickSave();
      });

      it('displays a custom url validation error message', () => {
        expect(ResourceEditPage.validationErrorOnCustomUrl).to
          .equal('The URL should include http:// or https://');
      });
    });

    describe('entering a blank url', () => {
      beforeEach(() => {
        return ResourceEditPage
          .inputCustomUrlValue('')
          .clickSave();
      });

      it('goes to the show page & does not display a URL', () => {
        expect(ResourceShowPage.isUrlPresent).to.equal(false);
      });
    });

    describe('entering invalid data', () => {
      beforeEach(() => {
        return ResourceEditPage
          .clickAddRowButton()
          .dateRangeRowList(0).fillDates('12/18/2018', '12/16/2018')
          .clickAddCustomEmbargoButton()
          .inputEmbargoValue('')
          .inputCustomUrlValue(`http://${new Array(610 + 1).join('a')}`) // create a 610 char string
          .blurEmbargoValue()
          .selectEmbargoUnit('Weeks')
          .clickSave();
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
        beforeEach(() => {
          return ResourceEditPage.clickRemoveCustomEmbargoButton();
        });

        it.always('does not show a message that saving will remove embargo', () => {
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
            .inputCustomUrlValue('https://bigtestjs.io')
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
    });
  });

  describe('visiting the resource edit page with coverage dates, statements, and embargo', () => {
    beforeEach(function () {
      const customCoverages = [
        this.server.create('custom-coverage', {
          beginCoverage: '1969-07-16',
          endCoverage: '1972-12-19'
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

      it('displays the original date range', () => {
        expect(ResourceShowPage.customCoverageList).to.equal('1969 - 1972');
      });
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

    describe('entering invalid data', () => {
      beforeEach(() => {
        return ResourceEditPage
          .dateRangeRowList(0).fillDates('12/18/2018', '12/16/2018')
          .inputCoverageStatement(`Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
            Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis
            dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec,
            pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo,
            fringilla vel, aliquet nec, vulputate e`)
          .inputEmbargoValue('')
          .blurEmbargoValue()
          .selectEmbargoUnit('Weeks')
          .clickSave();
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
          .dateRangeRowList(0).fillDates('12/16/2018', '12/18/2018')
          .inputCoverageStatement('Refinance your home loans.')
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

  describe('visiting the resource edit page with custom labels', () => {
    beforeEach(function () {
      this.visit(`/eholdings/resources/${resource.titleId}/edit`);
    });

    it('custom labels accordion should be present', () => {
      expect(ResourceEditPage.resourceCustomLabelsAccordion.isPresent).to.be.true;
    });

    it('should show correct accordion name', () => {
      expect(ResourceEditPage.resourceCustomLabelsAccordion.label).to.equal('Custom labels');
    });

    describe('clicking the header', () => {
      beforeEach(async () => {
        await ResourceEditPage.resourceCustomLabelsAccordion.clickHeader();
      });

      it('collapses the section', () => {
        expect(ResourceEditPage.resourceCustomLabelsAccordion.isOpen).to.be.false;
      });

      describe('clicking the header again', () => {
        beforeEach(async () => {
          await ResourceEditPage.resourceCustomLabelsAccordion.clickHeader();
        });

        it('expands the section', () => {
          expect(ResourceEditPage.resourceCustomLabelsAccordion.isOpen).to.be.true;
        });
      });
    });

    it('correct length of custom labels inputs', () => {
      expect(ResourceEditPage.customLabelsFields().length).to.be.equal(4);
    });

    describe('fill input with unvalid string', () => {
      beforeEach(async () => {
        await ResourceEditPage.customLabelsFields(0).inputCustomLabel(`${new Array(102).join('a')}`); // create a 101 char string
        await ResourceEditPage.customLabelsFields(0).blurCustomLabel();
      });

      it('should show validation error message', () => {
        expect(ResourceEditPage.customLabelsFields(0).validationErrorMessage).to.be.equal('Value has exceeded 100 character limit. Please revise your value.');
      });
    });

    describe('fill input with valid values and save it', () => {
      beforeEach(async () => {
        await ResourceEditPage.customLabelsFields(0).inputCustomLabel('random value');
        await ResourceEditPage.customLabelsFields(0).blurCustomLabel();
        await ResourceEditPage.clickSave();
      });

      it('should show resource view page', () => {
        expect(ResourceShowPage.isPresent).to.be.true;
      });

      it('should show correct value of custom labels', () => {
        expect(ResourceShowPage.customLabels(0).value).to.be.equal('random value');
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
});
