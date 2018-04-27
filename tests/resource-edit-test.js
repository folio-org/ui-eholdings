import { expect } from 'chai';
import { describe, beforeEach, it } from '@bigtest/mocha';

import { describeApplication } from './helpers';
import ResourceShowPage from './pages/resource-show';
import ResourceEditPage from './pages/resource-edit';

describeApplication('ResourceEdit', () => {
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
      publisherName: 'Amazing Publisher'
    });

    title.save();

    resource = this.server.create('resource', {
      package: providerPackage,
      isSelected: true,
      title,
      url: 'frontside.io'
    });
  });

  describe('visiting the resource edit page without coverage dates, statement, or embargo', () => {
    beforeEach(function () {
      return this.visit(`/eholdings/resources/${resource.titleId}/edit`, () => {
        expect(ResourceEditPage.$root).to.exist;
      });
    });

    it('shows a form with coverage statement', () => {
      expect(ResourceEditPage.coverageStatement).to.equal('');
    });

    it('shows a form with embargo fields', () => {
      expect(ResourceEditPage.customEmbargoTextFieldValue).to.equal('0');
      expect(ResourceEditPage.customEmbargoSelectValue).to.equal('');
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

    describe('entering invalid data', () => {
      beforeEach(() => {
        return ResourceEditPage
          .clickAddRowButton()
          .when(() => ResourceEditPage.dateRangeRowList().length > 0)
          .do(() => {
            return ResourceEditPage
              .inputCoverageStatement(`Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
                Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis
                dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec,
                pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo,
                fringilla vel, aliquet nec, vulputate e`)
              .append(ResourceEditPage.dateRangeRowList(0).fillDates('12/18/2018', '12/16/2018'))
              .inputEmbargoValue('')
              .blurEmbargoValue()
              .selectEmbargoUnit('Weeks')
              .clickSave();
          });
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
        expect(ResourceEditPage.validationErrorOnEmbargoTextField).to.equal('Value cannot be null');
      });
    });

    describe('entering valid data', () => {
      beforeEach(() => {
        return ResourceEditPage
          .clickAddRowButton()
          .when(() => ResourceEditPage.dateRangeRowList().length > 0)
          .do(() => {
            return ResourceEditPage
              .inputCoverageStatement('Only 90s kids would understand.')
              .append(ResourceEditPage.dateRangeRowList(0).fillDates('12/16/2018', '12/18/2018'))
              .inputEmbargoValue('27')
              .blurEmbargoValue()
              .selectEmbargoUnit('Weeks')
              .blurEmbargoUnit();
          });
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

        it('shows the new statement value', () => {
          expect(ResourceShowPage.coverageStatement).to.equal('Only 90s kids would understand.');
        });

        it('shows the new embargo value', () => {
          expect(ResourceShowPage.customEmbargoPeriod).to.equal('27 Weeks');
        });
      });
    });
  });

  describe('visiting the resource edit page with coverage dates, statement, and embargo', () => {
    beforeEach(function () {
      resource.coverageStatement = 'Use this one weird trick to get access.';
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

    describe('clicking cancel', () => {
      beforeEach(() => {
        return ResourceEditPage.clickCancel();
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
          .append(ResourceEditPage.dateRangeRowList(0).fillDates('12/18/2018', '12/16/2018'))
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
        expect(ResourceEditPage.validationErrorOnEmbargoTextField).to.equal('Value cannot be null');
      });
    });

    describe('entering valid data', () => {
      beforeEach(() => {
        return ResourceEditPage
          .inputCoverageStatement('Refinance your home loans.')
          .append(ResourceEditPage.dateRangeRowList(0).fillDates('12/16/2018', '12/18/2018'))
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

        it('shows the new statement value', () => {
          expect(ResourceShowPage.coverageStatement).to.equal('Refinance your home loans.');
        });

        it('shows the new embargo value', () => {
          expect(ResourceShowPage.customEmbargoPeriod).to.equal('27 Weeks');
        });
      });
    });
  });

  describe('encountering a server error', () => {
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

  describe('visiting the resource show page', () => {
    beforeEach(function () {
      return this.visit(`/eholdings/resources/${resource.id}`, () => {
        expect(ResourceShowPage.$root).to.exist;
      });
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
});
