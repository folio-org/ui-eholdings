import { expect } from 'chai';
import { describe, beforeEach, it } from '@bigtest/mocha';

import { describeApplication } from './helpers';
import ResourceShowPage from './pages/bigtest/customer-resource-show';
import ResourceEditPage from './pages/bigtest/customer-resource-edit';

describeApplication('CustomerResourceShow', () => {
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
      url: 'frontside.io'
    });
  });

  describe('visiting the customer resource edit page without an embargo', () => {
    beforeEach(function () {
      return this.visit(`/eholdings/customer-resources/${resource.titleId}/edit`, () => {
        expect(ResourceEditPage.$root).to.exist;
      });
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

      it('goes to the customer resource show page', () => {
        expect(ResourceShowPage.$root).to.exist;
      });
    });

    describe('entering invalid data', () => {
      beforeEach(() => {
        return ResourceEditPage
          .inputEmbargoValue('')
          .selectEmbargoUnit('Weeks')
          .clickSave();
      });

      it('displays a validation error', () => {
        expect(ResourceEditPage.validationErrorOnEmbargoTextField).to.equal('Value cannot be null');
      });
    });

    describe('entering valid data', () => {
      beforeEach(() => {
        return ResourceEditPage
          .inputEmbargoValue('27')
          .blurEmbargoValue()
          .selectEmbargoUnit('Weeks')
          .blurEmbargoUnit();
      });

      describe('clicking cancel', () => {
        beforeEach(() => {
          return ResourceEditPage.clickCancel();
        });

        it.skip('shows a navigation confirmation modal', () => {
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

        it('shows the new embargo value', () => {
          expect(ResourceShowPage.customEmbargoPeriod).to.equal('27 Weeks');
        });
      });
    });
  });

  describe('visiting the customer resource edit page with an existing embargo period', () => {
    beforeEach(function () {
      resource.customEmbargoPeriod = this.server.create('embargo-period', {
        embargoUnit: 'Months',
        embargoValue: 6
      }).toJSON();

      return this.visit(`/eholdings/customer-resources/${resource.titleId}/edit`, () => {
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
          .inputEmbargoValue('')
          .selectEmbargoUnit('Weeks')
          .clickSave();
      });

      it('displays a validation error', () => {
        expect(ResourceEditPage.validationErrorOnEmbargoTextField).to.equal('Value cannot be null');
      });
    });

    describe('entering valid data', () => {
      beforeEach(() => {
        return ResourceEditPage
          .inputEmbargoValue('27')
          .blurEmbargoValue()
          .selectEmbargoUnit('Weeks')
          .blurEmbargoUnit();
      });

      describe('clicking cancel', () => {
        beforeEach(() => {
          return ResourceEditPage.clickCancel();
        });

        it.skip('shows a navigation confirmation modal', () => {
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

        it('shows the new embargo value', () => {
          expect(ResourceShowPage.customEmbargoPeriod).to.equal('27 Weeks');
        });
      });
    });
  });

  describe('encountering a server error', () => {
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
});
