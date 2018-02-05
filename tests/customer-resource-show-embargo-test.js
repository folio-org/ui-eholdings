/* global describe, beforeEach */
import { expect } from 'chai';
import it, { convergeOn } from './it-will';

import { describeApplication } from './helpers';
import CustomerResourceShowPage from './pages/customer-resource-show';

describeApplication('CustomerResourceShowEmbargos', () => {
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

    it.still('does not display the managed embargo section', () => {
      expect(CustomerResourceShowPage.managedEmbargoPeriod).to.equal('');
    });

    it.still('does not display the custom embargo period', () => {
      expect(CustomerResourceShowPage.customEmbargoPeriod).to.equal('');
    });

    it('displays a button to add custom embargo', () => {
      expect(CustomerResourceShowPage.$customEmbargoAddButton).to.exist;
    });

    describe('clicking on the add custom embargo button', () => {
      beforeEach(() => {
        CustomerResourceShowPage.clickCustomEmbargoAddButton();
      });

      it('should remove the add custom embargo button', () => {
        expect(CustomerResourceShowPage.$customEmbargoAddButton).to.not.exist;
      });

      it('displays the custom embargo form', () => {
        expect(CustomerResourceShowPage.$customEmbargoForm).to.exist;
      });

      describe('entering valid custom embargo value and selecting unit', () => {
        beforeEach(() => {
          return convergeOn(() => {
            expect(CustomerResourceShowPage.$customEmbargoTextField).to.exist;
            expect(CustomerResourceShowPage.$customEmbargoSelect).to.exist;
          });
        });

        describe('with valid embargo value and unit', () => {
          beforeEach(() => {
            CustomerResourceShowPage.inputEmbargoValue('30');
            CustomerResourceShowPage.selectEmbargoUnit('Weeks');
          });

          it('accepts valid custom embargo value', () => {
            expect(CustomerResourceShowPage.$customEmbargoTextField.value).to.equal('30');
          });

          it('accepts valid custom embargo unit selection', () => {
            expect(CustomerResourceShowPage.$customEmbargoSelect.value).to.equal('Weeks');
          });

          it('save button is present', () => {
            expect(CustomerResourceShowPage.$customEmbargoSaveButton).to.exist;
          });

          it('save button is enabled', () => {
            expect(CustomerResourceShowPage.isCustomEmbargoSavable).to.be.true;
          });

          it('cancel button is present', () => {
            expect(CustomerResourceShowPage.$customEmbargoCancelButton).to.exist;
          });

          it('cancel button is enabled', () => {
            expect(CustomerResourceShowPage.isCustomEmbargoCancellable).to.be.true;
          });

          describe('saving updated custom embargo', () => {
            beforeEach(() => {
              CustomerResourceShowPage.clickCustomEmbargoSaveButton();
            });

            it('displays new custom embargo period', () => {
              expect(CustomerResourceShowPage.customEmbargoPeriod).to.equal('30 Weeks');
            });

            it('does not display button to add custom embargo', () => {
              expect(CustomerResourceShowPage.$customEmbargoAddButton).to.not.exist;
            });

            it('removes the custom embargo form', () => {
              expect(CustomerResourceShowPage.$customEmbargoForm).to.not.exist;
            });
          });

          describe('cancelling updated custom embargo', () => {
            beforeEach(() => {
              CustomerResourceShowPage.clickCustomEmbargoCancelButton();
            });

            it('displays existing custom embargo period', () => {
              expect(CustomerResourceShowPage.customEmbargoPeriod).to.equal('');
            });

            it('removes the custom embargo form', () => {
              expect(CustomerResourceShowPage.$customEmbargoForm).to.not.exist;
            });

            it('does not display the button to add custom embargo', () => {
              expect(CustomerResourceShowPage.$customEmbargoAddButton).to.not.exist;
            });
          });

          describe('selecting none as custom embargo unit should update value to zero', () => {
            beforeEach(() => {
              CustomerResourceShowPage.inputEmbargoValue(50);
              CustomerResourceShowPage.selectEmbargoUnit('None');
              CustomerResourceShowPage.clickCustomEmbargoSaveButton();
            });

            it('displays new custom embargo period', () => {
              expect(CustomerResourceShowPage.$customEmbargoTextField.value).to.equal('0');
            });
          });

          describe('custom embargo value as zero and unit as not None should throw validation error', () => {
            beforeEach(() => {
              CustomerResourceShowPage.inputEmbargoValue(0);
              CustomerResourceShowPage.selectEmbargoUnit('Months');
            });

            it('rejects embargo value', () => {
              convergeOn(() => {
                expect(CustomerResourceShowPage.validationErrorOnTextField).to.exist;
              }).then(() => {
                expect(CustomerResourceShowPage.validationErrorOnTextField).to.equal('Enter value greater than 0');
              });
            });
          });

          describe('custom embargo value that cannot be parsed as number should throw validation error', () => {
            beforeEach(() => {
              CustomerResourceShowPage.inputEmbargoValue('abcdef');
              CustomerResourceShowPage.selectEmbargoUnit('Months');
            });

            it('rejects embargo value', () => {
              convergeOn(() => {
                expect(CustomerResourceShowPage.validationErrorOnTextField).to.exist;
              }).then(() => {
                expect(CustomerResourceShowPage.validationErrorOnTextField).to.equal('Must be a number');
              });
            });
          });

          describe('blank custom embargo value should throw validation error', () => {
            beforeEach(() => {
              CustomerResourceShowPage.inputEmbargoValue('');
              CustomerResourceShowPage.selectEmbargoUnit('Months');
            });

            it('rejects embargo value', () => {
              convergeOn(() => {
                expect(CustomerResourceShowPage.validationErrorOnTextField).to.exist;
              }).then(() => {
                expect(CustomerResourceShowPage.validationErrorOnTextField).to.equal('Value cannot be null');
              });
            });
          });

          describe('custom embargo value greater than zero and unit as None should throw validation error', () => {
            beforeEach(() => {
              CustomerResourceShowPage.inputEmbargoValue(50);
              CustomerResourceShowPage.selectEmbargoUnit('None');
            });

            it('rejects embargo value', () => {
              convergeOn(() => {
                expect(CustomerResourceShowPage.validationErrorOnSelect).to.exist;
              }).then(() => {
                expect(CustomerResourceShowPage.validationErrorOnSelect).to.equal('Select a valid unit');
              });
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

    it.still('does not display the managed embargo section', () => {
      expect(CustomerResourceShowPage.managedEmbargoPeriod).to.equal('');
    });

    it.still('does not display the custom embargo section', () => {
      expect(CustomerResourceShowPage.customEmbargoPeriod).to.equal('');
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

    it.still('does not display the managed embargo section', () => {
      expect(CustomerResourceShowPage.managedEmbargoPeriod).to.equal('');
    });

    it.still('does not display the custom embargo section', () => {
      expect(CustomerResourceShowPage.customEmbargoPeriod).to.equal('');
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

    it.still('does not display the custom embargo section', () => {
      expect(CustomerResourceShowPage.customEmbargoPeriod).to.equal('');
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
      expect(CustomerResourceShowPage.$customEmbargoEditButton).to.exist;
    });

    it('does not display the add custom embargo button', () => {
      expect(CustomerResourceShowPage.$customEmbargoAddButton).to.not.exist;
    });

    it('displays whether the title package is selected', () => {
      expect(CustomerResourceShowPage.isSelected).to.equal(true);
    });

    describe('toggling to deselect a title package and confirming deselection', () => {
      beforeEach(() => {
        return CustomerResourceShowPage.toggleIsSelected().then(() => {
          return CustomerResourceShowPage.confirmDeselection();
        });
      });

      it('removes custom embargo', () => {
        expect(CustomerResourceShowPage.customEmbargoPeriod).to.equal('');
      });
    });

    describe('toggling to deselect a title package and canceling deselection', () => {
      beforeEach(() => {
        return CustomerResourceShowPage.toggleIsSelected().then(() => {
          return CustomerResourceShowPage.cancelDeselection();
        });
      });

      it('does not remove custom embargo', () => {
        expect(CustomerResourceShowPage.customEmbargoPeriod).to.equal('10 Weeks');
      });

      it('displays the edit button in the custom embargo section', () => {
        expect(CustomerResourceShowPage.$customEmbargoEditButton).to.exist;
      });
    });

    describe('clicking the edit button', () => {
      beforeEach(() => {
        return CustomerResourceShowPage.clickCustomEmbargoEditButton();
      });

      it('displays the custom embargo form', () => {
        expect(CustomerResourceShowPage.$customEmbargoForm).to.exist;
      });
    });
  });
});
