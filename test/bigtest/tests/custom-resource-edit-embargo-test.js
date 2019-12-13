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

  beforeEach(async function () {
    provider = await this.server.create('provider', {
      name: 'Cool Provider'
    });

    providerPackage = await this.server.create('package', 'withTitles', {
      provider,
      name: 'Star Wars Custom Package',
      contentType: 'Online',
      isCustom: true
    });

    title = await this.server.create('title', {
      name: 'Hans Solo Director Cut',
      publicationType: 'Streaming Video',
      publisherName: 'Amazing Publisher',
      isTitleCustom: true
    });

    await title.save();

    resource = await this.server.create('resource', {
      package: providerPackage,
      isSelected: true,
      title
    });
  });

  describe('visiting the resource edit page with a custom embargo', () => {
    beforeEach(async function () {
      resource.customEmbargoPeriod = await this.server.create('embargo-period', {
        embargoUnit: 'Weeks',
        embargoValue: 9
      }).toJSON();

      await resource.save();
      await this.visit(`/eholdings/resources/${resource.id}/edit`);
      await ResourceEditPage.whenLoaded();
    });

    it('disables the save button', () => {
      expect(ResourceEditPage.isSaveDisabled).to.be.true;
    });

    it('shows a form with embargo fields', () => {
      expect(ResourceEditPage.customEmbargoTextFieldValue).to.equal('9');
      expect(ResourceEditPage.customEmbargoSelectValue).to.equal('Weeks');
    });

    describe('clicking (x) remove embargo button', () => {
      beforeEach(async () => {
        await ResourceEditPage.clickRemoveCustomEmbargoButton();
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
        beforeEach(async () => {
          await ResourceEditPage.clickSave();
          await ResourceShowPage.whenLoaded();
        });

        it('goes to the resource show page', () => {
          expect(ResourceShowPage.$root).to.exist;
        });

        it('does not show a custom embargo', () => {
          expect(ResourceShowPage.hasCustomEmbargoPeriod).to.be.false;
        });
      });
    });
  });

  describe('visiting the resource edit page without any embargos', () => {
    beforeEach(async function () {
      await this.visit(`/eholdings/resources/${resource.id}/edit`);
      await ResourceEditPage.whenLoaded();
    });

    it('disables the save button', () => {
      expect(ResourceEditPage.isSaveDisabled).to.be.true;
    });

    it('shows a button to add embargo fields', () => {
      expect(ResourceEditPage.hasAddCustomEmbargoButton).to.be.true;
    });

    describe('clicking the add custom embargo button', () => {
      beforeEach(async () => {
        await ResourceEditPage.clickAddCustomEmbargoButton();
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

      describe('clicking cancel', () => {
        beforeEach(async () => {
          await ResourceEditPage.clickCancel();
          await ResourceShowPage.whenLoaded();
        });

        it('goes to the resource show page', () => {
          expect(ResourceShowPage.$root).to.exist;
        });
      });

      describe('entering valid custom embargo value and selecting unit', () => {
        describe('with valid embargo value and unit', () => {
          beforeEach(async () => {
            await ResourceEditPage
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
            beforeEach(async () => {
              await ResourceEditPage.clickRemoveCustomEmbargoButton();
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
            beforeEach(async () => {
              await ResourceEditPage
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
            beforeEach(async () => {
              await ResourceEditPage
                .inputEmbargoValue(0)
                .selectEmbargoUnit('Months')
                .clickSave();
            });

            it('rejects embargo value', () => {
              expect(ResourceEditPage.validationErrorOnEmbargoTextField).to.equal('Enter number greater than 0');
            });
          });

          describe('custom embargo value that cannot be parsed as number should throw validation error', () => {
            beforeEach(async () => {
              await ResourceEditPage
                .inputEmbargoValue('abcdef')
                .selectEmbargoUnit('Months')
                .clickSave();
            });

            it('rejects embargo value', () => {
              expect(ResourceEditPage.validationErrorOnEmbargoTextField).to.equal('Must be a number');
            });
          });

          describe('decimal custom embargo value should throw validation error', () => {
            beforeEach(async () => {
              await ResourceEditPage
                .inputEmbargoValue('1.5')
                .selectEmbargoUnit('Months')
                .clickSave();
            });

            it('rejects embargo value', () => {
              expect(ResourceEditPage.validationErrorOnEmbargoTextField).to.equal('Decimal is not allowed');
            });
          });

          describe('blank custom embargo value should throw validation error', () => {
            beforeEach(async () => {
              await ResourceEditPage
                .inputEmbargoValue('')
                .selectEmbargoUnit('Months')
                .clickSave();
            });

            it('rejects embargo value', () => {
              expect(ResourceEditPage.validationErrorOnEmbargoTextField).to.equal('Must be a number');
            });
          });

          describe('custom embargo value greater than zero and empty unit should throw validation error', () => {
            beforeEach(async () => {
              await ResourceEditPage
                .selectEmbargoUnit('')
                .inputEmbargoValue('50')
                .clickSave();
            });

            it('rejects embargo value', () => {
              expect(ResourceEditPage.validationErrorOnEmbargoSelect).to.equal('Select a unit');
            });
          });

          describe('custom embargo value greater than zero and null unit should throw validation error', () => {
            beforeEach(async () => {
              await ResourceEditPage
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
    beforeEach(async function () {
      resource.customEmbargoPeriod = await this.server.create('embargo-period', {
        embargoUnit: 'Weeks',
        embargoValue: null
      }).toJSON();

      await resource.save();
      await this.visit(`/eholdings/resources/${resource.id}/edit`);
      await ResourceEditPage.whenLoaded();
    });

    it('shows a button to add embargo fields', () => {
      expect(ResourceEditPage.hasAddCustomEmbargoButton).to.be.true;
    });
  });

  describe('visiting the resource edit page with no embargos', () => {
    beforeEach(async function () {
      resource.managedEmbargoPeriod = null;
      resource.customEmbargoPeriod = null;

      await resource.save();
      await this.visit(`/eholdings/resources/${resource.id}/edit`);
      await ResourceEditPage.whenLoaded();
    });

    it('shows a button to add embargo fields', () => {
      expect(ResourceEditPage.hasAddCustomEmbargoButton).to.be.true;
    });
  });

  describe('visiting the resource edit page with title package selected', () => {
    beforeEach(async function () {
      resource.customEmbargoPeriod = await this.server.create('embargo-period', {
        embargoUnit: 'Weeks',
        embargoValue: 10
      }).toJSON();

      await resource.save();
      await this.visit(`/eholdings/resources/${resource.id}/edit`);
      await ResourceEditPage.whenLoaded();
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
