import { expect } from 'chai';
import { describe, beforeEach, it } from '@bigtest/mocha';

import { describeApplication } from './helpers';
import ResourceShowPage from './pages/resource-show';
import ResourceEditPage from './pages/resource-edit';
import ResourceCoverage from './pages/resource-custom-coverage';

describeApplication('ResourceEditCustomTitle', () => {
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

    let title = this.server.create('title', {
      name: 'Best Title Ever',
      publicationType: 'Streaming Video',
      publisherName: 'Amazing Publisher',
      isTitleCustom: true
    });

    title.save();

    resource = this.server.create('resource', {
      package: providerPackage,
      isSelected: true,
      title,
      url: 'https://frontside.io'
    });
  });

  describe('visiting the resource edit page without coverage dates or statements', () => {
    beforeEach(function () {
      return this.visit(`/eholdings/resources/${resource.titleId}/edit`, () => {
        expect(ResourceEditPage.$root).to.exist;
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

    it('disables the save button', () => {
      expect(ResourceEditPage.isSaveDisabled).to.be.true;
    });


    describe('clicking cancel', () => {
      beforeEach(() => {
        return ResourceEditPage.clickCancel();
      });

      it('goes to the resource show page', () => {
        expect(ResourceShowPage.$root).to.exist;
      });
    });

    describe('entering invalid an invalid url', () => {
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
        expect(ResourceEditPage.validationErrorOnEmbargoTextField).to.equal('Enter number greater than 0');
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

    describe('entering valid data', () => {
      beforeEach(() => {
        return ResourceEditPage
          .clickAddRowButton()
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
          return ResourceEditPage.clickCancel();
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
          expect(ResourceCoverage.displayText).to.equal('12/16/2018 - 12/18/2018');
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

  describe('visiting the resource edit page with coverage dates, statements, and embargo', () => {
    beforeEach(function () {
      let customCoverages = [
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

      return this.visit(`/eholdings/resources/${resource.titleId}/edit`, () => {
        expect(ResourceEditPage.$root).to.exist;
      });
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
        return ResourceEditPage.clickCancel();
      });

      it('goes to the resource show page', () => {
        expect(ResourceShowPage.$root).to.exist;
      });

      it('displays the original date range', () => {
        expect(ResourceCoverage.displayText).to.equal('7/16/1969 - 12/19/1972');
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
        expect(ResourceEditPage.validationErrorOnEmbargoTextField).to.equal('Enter number greater than 0');
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
          return ResourceEditPage.clickCancel();
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
          expect(ResourceCoverage.displayText).to.equal('12/16/2018 - 12/18/2018');
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

  describe('encountering a server error when GETting', () => {
    beforeEach(function () {
      this.server.get('/resources/:id', {
        errors: [{
          title: 'There was an error'
        }]
      }, 500);

      return this.visit(`/eholdings/resources/${resource.id}/edit`, () => {
        expect(ResourceEditPage.$root).to.exist;
      });
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

      return this.visit(`/eholdings/resources/${resource.id}/edit`, () => {
        expect(ResourceEditPage.$root).to.exist;
      });
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
