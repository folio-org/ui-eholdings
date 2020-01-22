import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import ResourceEditPage from '../interactors/resource-edit';
import ResourceShowPage from '../interactors/resource-show';

describe('CustomResourceEditEmbargo', () => {
  setupApplication();
  let provider,
    providerPackage,
    title,
    resource;

  beforeEach(function () {
    provider = this.server.create('provider', {
      name: 'Cool Provider'
    });

    providerPackage = this.server.create('package', 'withTitles', {
      provider,
      name: 'Star Wars Custom Package',
      contentType: 'Online',
      isCustom: true
    });

    title = this.server.create('title', {
      name: 'Hans Solo Director Cut',
      publicationType: 'Streaming Video',
      publisherName: 'Amazing Publisher',
      isTitleCustom: true
    });

    title.save();

    resource = this.server.create('resource', {
      package: providerPackage,
      isSelected: true,
      title
    });
  });

  describe('visiting the resource edit page with a custom embargo', () => {
    beforeEach(function () {
      resource.customEmbargoPeriod = this.server.create('embargo-period', {
        embargoUnit: 'Weeks',
        embargoValue: 9
      }).toJSON();

      resource.save();

      this.visit(`/eholdings/resources/${resource.id}/edit`);
    });

    it('disables the save button', () => {
      expect(ResourceEditPage.isSaveDisabled).to.be.true;
    });

    it('shows a form with embargo fields', () => {
      expect(ResourceEditPage.customEmbargoTextFieldValue).to.equal('9');
      expect(ResourceEditPage.customEmbargoSelectValue).to.equal('Weeks');
    });

    describe('clicking (x) remove embargo button', () => {
      beforeEach(() => {
        return ResourceEditPage
          .clickRemoveCustomEmbargoButton();
      });

      it('does not show the custom embargo text field', () => {
        expect(ResourceEditPage.hasCustomEmbargoTextField).to.be.false;
      });

      it('does not show the custom embargo select', () => {
        expect(ResourceEditPage.hasCustomEmbargoSelect).to.be.false;
      });

      it('shows a button to add embargo fields', () => {
        expect(ResourceEditPage.hasAddCustomEmbargoButton).to.be.true;
      });

      describe('clicking save', () => {
        beforeEach(() => {
          return ResourceEditPage.clickSave();
        });

        it('goes to the resource show page', () => {
          expect(ResourceShowPage.isPresent).to.be.true;
        });

        it('does not show a custom embargo', () => {
          expect(ResourceShowPage.hasCustomEmbargoPeriod).to.be.false;
        });
      });
    });
  });

  describe('visiting the resource edit page without any embargos', () => {
    beforeEach(function () {
      this.visit(`/eholdings/resources/${resource.id}/edit`);
    });

    it('disables the save button', () => {
      expect(ResourceEditPage.isSaveDisabled).to.be.true;
    });

    it('shows a button to add embargo fields', () => {
      expect(ResourceEditPage.hasAddCustomEmbargoButton).to.be.true;
    });

    describe('clicking the add custom embargo button', () => {
      beforeEach(() => {
        return ResourceEditPage.clickAddCustomEmbargoButton();
      });

      it('removes the add custom embargo button', () => {
        expect(ResourceEditPage.hasAddCustomEmbargoButton).to.be.false;
      });

      it('shows the custom embargo text field', () => {
        expect(ResourceEditPage.hasCustomEmbargoTextField).to.be.true;
      });

      it('shows the custom embargo select', () => {
        expect(ResourceEditPage.hasCustomEmbargoSelect).to.be.true;
      });

      describe('entering valid custom embargo value and selecting unit', () => {
        describe('with valid embargo value and unit', () => {
          beforeEach(() => {
            return ResourceEditPage
              .inputEmbargoValue('30')
              .selectEmbargoUnit('Weeks');
          });

          it('accepts valid custom embargo value', () => {
            expect(ResourceEditPage.customEmbargoTextFieldValue).to.equal('30');
          });

          it('accepts valid custom select value', () => {
            expect(ResourceEditPage.customEmbargoSelectValue).to.equal('Weeks');
          });

          describe('cancelling updated custom embargo', () => {
            beforeEach(() => {
              return ResourceEditPage.clickRemoveCustomEmbargoButton();
            });

            it('displays the button to add custom embargo', () => {
              expect(ResourceEditPage.hasAddCustomEmbargoButton).to.be.true;
            });
            it('does not display custom embargo text field', () => {
              expect(ResourceEditPage.hasCustomEmbargoTextField).to.be.false;
            });

            it('does not display custom embargo select field', () => {
              expect(ResourceEditPage.hasCustomEmbargoSelect).to.be.false;
            });
          });

          describe('clicking (x) remove embargo button', () => {
            beforeEach(() => {
              return ResourceEditPage
                .inputEmbargoValue('50')
                .clickRemoveCustomEmbargoButton();
            });

            it('does not show the custom embargo text field', () => {
              expect(ResourceEditPage.hasCustomEmbargoTextField).to.be.false;
            });

            it('does not show the custom embargo select', () => {
              expect(ResourceEditPage.hasCustomEmbargoSelect).to.be.false;
            });
          });

          describe('custom embargo value as zero with a valid unit should throw validation error', () => {
            beforeEach(() => {
              return ResourceEditPage
                .inputEmbargoValue(0)
                .selectEmbargoUnit('Months')
                .clickSave();
            });

            it('rejects embargo value', () => {
              expect(ResourceEditPage.validationErrorOnEmbargoTextField).to.equal('Enter number greater than 0');
            });
          });

          describe('custom embargo value that cannot be parsed as number should throw validation error', () => {
            beforeEach(() => {
              return ResourceEditPage
                .inputEmbargoValue('abcdef')
                .selectEmbargoUnit('Months')
                .clickSave();
            });

            it('rejects embargo value', () => {
              expect(ResourceEditPage.validationErrorOnEmbargoTextField).to.equal('Must be a number');
            });
          });

          describe('decimal custom embargo value should throw validation error', () => {
            beforeEach(() => {
              return ResourceEditPage
                .inputEmbargoValue('1.5')
                .selectEmbargoUnit('Months')
                .clickSave();
            });

            it('rejects embargo value', () => {
              expect(ResourceEditPage.validationErrorOnEmbargoTextField).to.equal('Decimal is not allowed');
            });
          });

          describe('blank custom embargo value should throw validation error', () => {
            beforeEach(() => {
              return ResourceEditPage
                .inputEmbargoValue('')
                .selectEmbargoUnit('Months')
                .clickSave();
            });

            it('rejects embargo value', () => {
              expect(ResourceEditPage.validationErrorOnEmbargoTextField).to.equal('Must be a number');
            });
          });

          describe('custom embargo value greater than zero and empty unit should throw validation error', () => {
            beforeEach(() => {
              return ResourceEditPage
                .selectEmbargoUnit('')
                .inputEmbargoValue('50')
                .clickSave();
            });

            it('rejects embargo value', () => {
              expect(ResourceEditPage.validationErrorOnEmbargoSelect).to.equal('Select a unit');
            });
          });

          describe('custom embargo value greater than zero and null unit should throw validation error', () => {
            beforeEach(() => {
              return ResourceEditPage
                .selectEmbargoUnit(null)
                .inputEmbargoValue('50')
                .clickSave();
            });

            it('rejects embargo value', () => {
              expect(ResourceEditPage.validationErrorOnEmbargoSelect).to.equal('Select a unit');
            });
          });
        });
      });
    });
  });

  describe('visiting the resource edit page with embargos with null values', () => {
    beforeEach(function () {
      resource.customEmbargoPeriod = this.server.create('embargo-period', {
        embargoUnit: 'Weeks',
        embargoValue: null
      }).toJSON();

      resource.save();
      this.visit(`/eholdings/resources/${resource.id}/edit`);
    });

    it('shows a button to add embargo fields', () => {
      expect(ResourceEditPage.hasAddCustomEmbargoButton).to.be.true;
    });
  });

  describe('visiting the resource edit page with no embargos', () => {
    beforeEach(function () {
      resource.managedEmbargoPeriod = null;
      resource.customEmbargoPeriod = null;

      resource.save();
      this.visit(`/eholdings/resources/${resource.id}/edit`);
    });

    it('shows a button to add embargo fields', () => {
      expect(ResourceEditPage.hasAddCustomEmbargoButton).to.be.true;
    });
  });

  describe('visiting the resource edit page with title package selected', () => {
    beforeEach(function () {
      resource.customEmbargoPeriod = this.server.create('embargo-period', {
        embargoUnit: 'Weeks',
        embargoValue: 10
      }).toJSON();

      resource.save();
      this.visit(`/eholdings/resources/${resource.id}/edit`);
    });

    it('shows a form with embargo fields', () => {
      expect(ResourceEditPage.customEmbargoTextFieldValue).to.equal('10');
      expect(ResourceEditPage.customEmbargoSelectValue).to.equal('Weeks');
    });

    it('displays an indicator that the title package is selected', () => {
      expect(ResourceEditPage.isResourceSelected).to.equal('Selected');
    });
  });
});
