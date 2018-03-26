import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { describeApplication } from './helpers';
import CustomerResourceShowPage from './pages/customer-resource-show';

describeApplication('CustomerResourceEmbargo', () => {
  let pkg,
    title,
    resource;

  beforeEach(function () {
    pkg = this.server.create('package', 'withProvider');
    title = this.server.create('title');
    resource = this.server.create('customer-resource', {
      package: pkg,
      title,
      isSelected: true
    });
  });

  describe('visiting the customer resource show page with custom and managed embargos', () => {
    beforeEach(function () {
      resource.managedEmbargoPeriod = this.server.create('embargo-period', {
        embargoUnit: 'Months',
        embargoValue: 6
      }).toJSON();

      resource.customEmbargoPeriod = this.server.create('embargo-period', {
        embargoUnit: 'Weeks',
        embargoValue: 9
      }).toJSON();

      resource.save();

      return this.visit(`/eholdings/customer-resources/${resource.id}`, () => {
        expect(CustomerResourceShowPage.$root).to.exist;
      });
    });

    it('displays the managed embargo section', () => {
      expect(CustomerResourceShowPage.managedEmbargoPeriod).to.equal('6 Months');
    });

    it('displays the custom embargo section', () => {
      expect(CustomerResourceShowPage.customEmbargoPeriod).to.equal('9 Weeks');
    });
  });

  describe('visiting the customer resource show page without any embargos', () => {
    beforeEach(function () {
      return this.visit(`/eholdings/customer-resources/${resource.id}`, () => {
        expect(CustomerResourceShowPage.$root).to.exist;
      });
    });

    it.always('does not display the managed embargo section', () => {
      expect(CustomerResourceShowPage.hasManagedEmbargoPeriod).to.be.false;
    });

    it.always('does not display the custom embargo period', () => {
      expect(CustomerResourceShowPage.hasCustomEmbargoPeriod).to.be.false;
    });

    it('displays a button to add custom embargo', () => {
      expect(CustomerResourceShowPage.hasCustomEmbargoAddButton).to.be.true;
    });

    describe('clicking on the add custom embargo button', () => {
      beforeEach(() => {
        return CustomerResourceShowPage.clickCustomEmbargoAddButton();
      });

      it('should remove the add custom embargo button', () => {
        expect(CustomerResourceShowPage.hasCustomEmbargoAddButton).to.be.false;
      });

      it('displays the custom embargo form', () => {
        expect(CustomerResourceShowPage.hasCustomEmbargoForm).to.be.true;
      });

      describe('then trying to navigate away', () => {
        beforeEach(() => {
          return CustomerResourceShowPage.clickPackage();
        });

        it('shows a navigation confirmation modal', () => {
          expect(CustomerResourceShowPage.navigationModal.$root).to.exist;
        });

        it.always('does not navigate away', function () {
          expect(this.app.history.location.pathname)
            .to.equal(`/eholdings/customer-resources/${resource.id}`);
        });
      });

      describe('entering valid custom embargo value and selecting unit', () => {
        describe('with valid embargo value and unit', () => {
          beforeEach(() => {
            return CustomerResourceShowPage
              .inputEmbargoValue('30')
              .selectEmbargoUnit('Weeks');
          });

          it('accepts valid custom embargo value', () => {
            expect(CustomerResourceShowPage.customEmbargoTextFieldValue).to.equal('30');
          });

          it('accepts valid custom embargo unit selection', () => {
            expect(CustomerResourceShowPage.customEmbargoSelectValue).to.equal('Weeks');
          });

          it('save button is present', () => {
            expect(CustomerResourceShowPage.hasCustomEmbargoSaveButton).to.be.true;
          });

          it('save button is enabled', () => {
            expect(CustomerResourceShowPage.isCustomEmbargoSaveDisabled).to.be.false;
          });

          it('cancel button is present', () => {
            expect(CustomerResourceShowPage.hasCustomEmbargoCancelButton).to.be.true;
          });

          it('cancel button is enabled', () => {
            expect(CustomerResourceShowPage.isCustomEmbargoCancelDisabled).to.be.false;
          });

          describe('saving updated custom embargo', () => {
            beforeEach(() => {
              return CustomerResourceShowPage.clickCustomEmbargoSaveButton();
            });

            it('displays new custom embargo period', () => {
              expect(CustomerResourceShowPage.customEmbargoPeriod).to.equal('30 Weeks');
            });

            it('does not display button to add custom embargo', () => {
              expect(CustomerResourceShowPage.hasCustomEmbargoAddButton).to.be.false;
            });

            it('removes the custom embargo form', () => {
              expect(CustomerResourceShowPage.hasCustomEmbargoForm).to.be.false;
            });
          });

          describe('cancelling updated custom embargo', () => {
            beforeEach(() => {
              return CustomerResourceShowPage.clickCustomEmbargoCancelButton();
            });

            it('displays existing custom embargo period (none)', () => {
              expect(CustomerResourceShowPage.hasCustomEmbargoPeriod).to.be.false;
            });

            it('removes the custom embargo form', () => {
              expect(CustomerResourceShowPage.hasCustomEmbargoForm).to.be.false;
            });

            it('displays the button to add custom embargo', () => {
              expect(CustomerResourceShowPage.hasCustomEmbargoAddButton).to.be.true;
            });
          });

          describe('selecting none as custom embargo unit should update value to zero', () => {
            beforeEach(() => {
              return CustomerResourceShowPage
                .inputEmbargoValue('50')
                .selectEmbargoUnit('None')
                .clickCustomEmbargoSaveButton();
            });

            it('displays new custom embargo period', () => {
              expect(CustomerResourceShowPage.customEmbargoTextFieldValue).to.equal('0');
            });
          });

          describe('custom embargo value as zero and unit as not None should throw validation error', () => {
            beforeEach(() => {
              return CustomerResourceShowPage
                .inputEmbargoValue(0)
                .selectEmbargoUnit('Months')
                .clickCustomEmbargoSaveButton();
            });

            it('rejects embargo value', () => {
              expect(CustomerResourceShowPage.validationErrorOnTextField).to.equal('Enter value greater than 0');
            });
          });

          describe('custom embargo value that cannot be parsed as number should throw validation error', () => {
            beforeEach(() => {
              return CustomerResourceShowPage
                .inputEmbargoValue('abcdef')
                .selectEmbargoUnit('Months')
                .clickCustomEmbargoSaveButton();
            });

            it('rejects embargo value', () => {
              expect(CustomerResourceShowPage.customEmbargoTextFieldValue).to.equal('');
              expect(CustomerResourceShowPage.validationErrorOnTextField).to.equal('Value cannot be null');
            });
          });

          describe('blank custom embargo value should throw validation error', () => {
            beforeEach(() => {
              return CustomerResourceShowPage
                .inputEmbargoValue('')
                .selectEmbargoUnit('Months')
                .clickCustomEmbargoSaveButton();
            });

            it('rejects embargo value', () => {
              expect(CustomerResourceShowPage.validationErrorOnTextField).to.equal('Value cannot be null');
            });
          });

          describe('custom embargo value greater than zero and unit as None should throw validation error', () => {
            beforeEach(() => {
              return CustomerResourceShowPage
                .selectEmbargoUnit('None')
                .inputEmbargoValue('50')
                .clickCustomEmbargoSaveButton();
            });

            it('rejects embargo value', () => {
              expect(CustomerResourceShowPage.validationErrorOnSelect).to.equal('Select a valid unit');
            });
          });
        });
      });
    });
  });

  describe('visiting the customer resource show page with embargos with null values', () => {
    beforeEach(function () {
      resource.managedEmbargoPeriod = this.server.create('embargo-period', {
        embargoUnit: 'Months',
        embargoValue: null
      }).toJSON();

      resource.customEmbargoPeriod = this.server.create('embargo-period', {
        embargoUnit: 'Weeks',
        embargoValue: null
      }).toJSON();

      resource.save();
      return this.visit(`/eholdings/customer-resources/${resource.id}`, () => {
        expect(CustomerResourceShowPage.$root).to.exist;
      });
    });

    it.always('does not display the managed embargo section', () => {
      expect(CustomerResourceShowPage.hasManagedEmbargoPeriod).to.be.false;
    });

    it.always('does not display the custom embargo section', () => {
      expect(CustomerResourceShowPage.hasCustomEmbargoPeriod).to.be.false;
    });
  });

  describe('visiting the customer resource show page with no embargos', () => {
    beforeEach(function () {
      resource.managedEmbargoPeriod = null;
      resource.customEmbargoPeriod = null;

      resource.save();
      return this.visit(`/eholdings/customer-resources/${resource.id}`, () => {
        expect(CustomerResourceShowPage.$root).to.exist;
      });
    });

    it.always('does not display the managed embargo section', () => {
      expect(CustomerResourceShowPage.hasManagedEmbargoPeriod).to.be.false;
    });

    it.always('does not display the custom embargo section', () => {
      expect(CustomerResourceShowPage.hasCustomEmbargoPeriod).to.be.false;
    });
  });

  describe('visiting the customer resource show page with title package not selected', () => {
    beforeEach(function () {
      resource.isSelected = false;
      resource.customEmbargoPeriod = this.server.create('embargo-period', {
        embargoUnit: 'Weeks',
        embargoValue: null
      }).toJSON();

      resource.save();
      return this.visit(`/eholdings/customer-resources/${resource.id}`, () => {
        expect(CustomerResourceShowPage.$root).to.exist;
      });
    });

    it.always('does not display the custom embargo section', () => {
      expect(CustomerResourceShowPage.hasCustomEmbargoPeriod).to.be.false;
    });
  });

  describe('visiting the customer resource show page with title package selected', () => {
    beforeEach(function () {
      resource.customEmbargoPeriod = this.server.create('embargo-period', {
        embargoUnit: 'Weeks',
        embargoValue: 10
      }).toJSON();

      resource.save();
      return this.visit(`/eholdings/customer-resources/${resource.id}`, () => {
        expect(CustomerResourceShowPage.$root).to.exist;
      });
    });

    it('displays the custom embargo section', () => {
      expect(CustomerResourceShowPage.customEmbargoPeriod).to.equal('10 Weeks');
    });

    it('displays the edit button in the custom embargo section', () => {
      expect(CustomerResourceShowPage.hasCustomEmbargoEditButton).to.be.true;
    });

    it('does not display the add custom embargo button', () => {
      expect(CustomerResourceShowPage.hasCustomEmbargoAddButton).to.be.false;
    });

    it('displays whether the title package is selected', () => {
      expect(CustomerResourceShowPage.isSelected).to.equal(true);
    });

    describe('toggling to deselect a title package', () => {
      beforeEach(() => {
        return CustomerResourceShowPage.toggleIsSelected();
      });

      describe('and confirming deselection', () => {
        beforeEach(() => {
          return CustomerResourceShowPage.deselectionModal.confirmDeselection();
        });

        it('removes custom embargo', () => {
          expect(CustomerResourceShowPage.hasCustomEmbargoPeriod).to.be.false;
        });
      });

      describe('and canceling deselection', () => {
        beforeEach(() => {
          return CustomerResourceShowPage.deselectionModal.cancelDeselection();
        });

        it('does not remove custom embargo', () => {
          expect(CustomerResourceShowPage.customEmbargoPeriod).to.equal('10 Weeks');
        });

        it('displays the edit button in the custom embargo section', () => {
          expect(CustomerResourceShowPage.hasCustomEmbargoEditButton).to.be.true;
        });
      });
    });

    describe('clicking the edit button', () => {
      beforeEach(() => {
        return CustomerResourceShowPage.clickCustomEmbargoEditButton();
      });

      it('displays the custom embargo form', () => {
        expect(CustomerResourceShowPage.hasCustomEmbargoForm).to.be.true;
      });
    });
  });
});
