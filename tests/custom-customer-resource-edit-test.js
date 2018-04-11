import { expect } from 'chai';
import { describe, beforeEach, it } from '@bigtest/mocha';

import { describeApplication } from './helpers';
import ResourceShowPage from './pages/customer-resource-show';
import ResourceEditPage from './pages/customer-resource-edit';
import CustomerResourceCoverage from './pages/customer-resource-custom-coverage';

describeApplication('CustomCustomerResourceEdit', () => {
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

    resource = this.server.create('customer-resource', {
      package: providerPackage,
      isSelected: true,
      title,
      url: 'frontside.io',
      isTitleCustom: true
    });
  });

  describe('visiting the customer resource edit page without coverage dates', () => {
    beforeEach(function () {
      return this.visit(`/eholdings/customer-resources/${resource.titleId}/edit`, () => {
        expect(ResourceEditPage.$root).to.exist;
      });
    });

    it('disables the save button', () => {
      expect(ResourceEditPage.isSaveDisabled).to.be.true;
    });

    describe('clicking cancel', () => {
      beforeEach(() => {
        return ResourceEditPage.clickCancel();
      });

      it('goes to the customer resource show page', () => {
        expect(ResourceShowPage.$root).to.exist;
      });
    });

    describe('entering invalid data', () => {
      beforeEach(() => {
        return ResourceEditPage
          .name('')
          .clickAddRowButton()
          .once(() => ResourceEditPage.dateRangeRowList().length > 0)
          .do(() => {
            return ResourceEditPage.interaction
              .append(ResourceEditPage.dateRangeRowList(0).fillDates('12/18/2018', '12/16/2018'))
              .clickSave();
          });
      });

      it('displays a validation error for the name', () => {
        expect(ResourceEditPage.nameHasError).to.be.true;
      });

      it('displays a validation error for coverage', () => {
        expect(ResourceEditPage.dateRangeRowList(0).beginDate.isInvalid).to.be.true;
      });
    });

    describe('entering valid data', () => {
      beforeEach(() => {
        return ResourceEditPage
          .clickAddRowButton()
          .once(() => ResourceEditPage.dateRangeRowList().length > 0)
          .do(() => {
            return ResourceEditPage.dateRangeRowList(0).fillDates('12/16/2018', '12/18/2018');
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

        it('goes to the customer resource show page', () => {
          expect(ResourceShowPage.$root).to.exist;
        });

        it('displays the saved date range', () => {
          expect(CustomerResourceCoverage.displayText).to.equal('12/16/2018 - 12/18/2018');
        });
      });
    });
  });

  describe('visiting the customer resource edit page with coverage dates', () => {
    beforeEach(function () {
      let customCoverages = [
        this.server.create('custom-coverage', {
          beginCoverage: '1969-07-16',
          endCoverage: '1972-12-19'
        })
      ];
      resource.update('customCoverages', customCoverages.map(item => item.toJSON()));
      resource.save();

      return this.visit(`/eholdings/customer-resources/${resource.titleId}/edit`, () => {
        expect(ResourceEditPage.$root).to.exist;
      });
    });

    it('disables the save button', () => {
      expect(ResourceEditPage.isSaveDisabled).to.be.true;
    });

    describe('clicking cancel', () => {
      beforeEach(() => {
        return ResourceEditPage.clickCancel();
      });

      it('goes to the customer resource show page', () => {
        expect(ResourceShowPage.$root).to.exist;
      });

      it('displays the original date range', () => {
        expect(CustomerResourceCoverage.displayText).to.equal('7/16/1969 - 12/19/1972');
      });
    });

    describe('entering invalid data', () => {
      beforeEach(() => {
        return ResourceEditPage
          .name('')
          .append(ResourceEditPage.dateRangeRowList(0).fillDates('12/18/2018', '12/16/2018'))
          .clickSave();
      });

      it('displays a validation error for the name', () => {
        expect(ResourceEditPage.nameHasError).to.be.true;
      });

      it('displays a validation error for coverage', () => {
        expect(ResourceEditPage.dateRangeRowList(0).beginDate.isInvalid).to.be.true;
      });
    });

    describe('entering valid data', () => {
      beforeEach(() => {
        return ResourceEditPage
          .name('A Different Name')
          .append(ResourceEditPage.dateRangeRowList(0).fillDates('12/16/2018', '12/18/2018'));
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

        it('goes to the customer resource show page', () => {
          expect(ResourceShowPage.$root).to.exist;
        });

        it('reflects the new name', () => {
          expect(ResourceShowPage.titleName).to.equal('A Different Name');
        });

        it('displays the saved date range', () => {
          expect(CustomerResourceCoverage.displayText).to.equal('12/16/2018 - 12/18/2018');
        });
      });
    });
  });

  describe('encountering a server error when GETting', () => {
    beforeEach(function () {
      this.server.get('/customer-resources/:id', {
        errors: [{
          title: 'There was an error'
        }]
      }, 500);

      return this.visit(`/eholdings/customer-resources/${resource.id}/edit`, () => {
        expect(ResourceEditPage.$root).to.exist;
      });
    });

    it('dies with dignity', () => {
      expect(ResourceEditPage.hasErrors).to.be.true;
    });
  });

  describe('encountering a server error when PUTting', () => {
    beforeEach(function () {
      this.server.put('/customer-resources/:id', {
        errors: [{
          title: 'There was an error'
        }]
      }, 500);

      return this.visit(`/eholdings/customer-resources/${resource.id}/edit`, () => {
        expect(ResourceEditPage.$root).to.exist;
      });
    });

    describe('entering valid data and clicking save', () => {
      beforeEach(() => {
        return ResourceEditPage
          .name('A Different Name')
          .clickSave();
      });

      it('pops up an error', () => {
        expect(ResourceEditPage.toast.errorText).to.equal('There was an error');
      });
    });
  });
});
