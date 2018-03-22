import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { describeApplication } from './helpers';
import CustomerResourceShowPage from './pages/bigtest/customer-resource-show';

describeApplication('CustomerResourceCoverageStatement', () => {
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

  describe('visiting the customer resource show page with a coverage statement', () => {
    beforeEach(function () {
      resource.coverageStatement = 'Only 90s kids would understand.';
      resource.save();

      return this.visit(`/eholdings/customer-resources/${resource.id}`, () => {
        expect(CustomerResourceShowPage.$root).to.exist;
      });
    });

    it('displays the coverage statement', () => {
      expect(CustomerResourceShowPage.coverageStatement).to.equal('Only 90s kids would understand.');
    });
  });

  describe('visiting the customer resource show page without a coverage statement', () => {
    beforeEach(function () {
      return this.visit(`/eholdings/customer-resources/${resource.id}`, () => {
        expect(CustomerResourceShowPage.$root).to.exist;
      });
    });

    it.always('does not display the coverage statement', () => {
      expect(CustomerResourceShowPage.hasCoverageStatement).to.be.false;
    });

    it('displays a button to add coverage statement', () => {
      expect(CustomerResourceShowPage.hasCoverageStatementAddButton).to.be.true;
    });

    describe('clicking on the add coverage statement button', () => {
      beforeEach(() => {
        return CustomerResourceShowPage.clickCoverageStatementAddButton();
      });

      it('should remove the add coverage statement button', () => {
        expect(CustomerResourceShowPage.hasCoverageStatementAddButton).to.be.false;
      });

      it('displays the coverage statement form', () => {
        expect(CustomerResourceShowPage.hasCoverageStatementForm).to.be.true;
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

      describe('entering valid coverage statement', () => {
        beforeEach(() => {
          return CustomerResourceShowPage.inputCoverageStatement('Use this one weird trick to get access.');
        });

        it('accepts valid coverage statement', () => {
          expect(CustomerResourceShowPage.coverageStatementFieldValue).to.equal('Use this one weird trick to get access.');
        });

        it('save button is present', () => {
          expect(CustomerResourceShowPage.hasCoverageStatementSaveButton).to.be.true;
        });

        it('save button is enabled', () => {
          expect(CustomerResourceShowPage.isCoverageStatementSaveDisabled).to.be.false;
        });

        it('cancel button is present', () => {
          expect(CustomerResourceShowPage.hasCoverageStatementCancelButton).to.be.true;
        });

        it('cancel button is enabled', () => {
          expect(CustomerResourceShowPage.isCoverageStatementCancelDisabled).to.be.false;
        });

        describe('saving updated coverage statement', () => {
          beforeEach(() => {
            return CustomerResourceShowPage.clickCoverageStatementSaveButton();
          });

          it('displays new coverage statement period', () => {
            expect(CustomerResourceShowPage.coverageStatement).to.equal('Use this one weird trick to get access.');
          });

          it('does not display button to add coverage statement', () => {
            expect(CustomerResourceShowPage.hasCoverageStatementAddButton).to.be.false;
          });

          it('removes the coverage statement form', () => {
            expect(CustomerResourceShowPage.hasCoverageStatementForm).to.be.false;
          });
        });

        describe('cancelling updated coverage statement', () => {
          beforeEach(() => {
            return CustomerResourceShowPage.clickCoverageStatementCancelButton();
          });

          it('displays existing coverage statement period (none)', () => {
            expect(CustomerResourceShowPage.hasCoverageStatement).to.be.false;
          });

          it('removes the coverage statement form', () => {
            expect(CustomerResourceShowPage.hasCoverageStatementForm).to.be.false;
          });

          it('displays the button to add coverage statement', () => {
            expect(CustomerResourceShowPage.hasCoverageStatementAddButton).to.be.true;
          });
        });

        describe('entering a coverage statement with too many characters', () => {
          beforeEach(() => {
            return CustomerResourceShowPage
              .inputCoverageStatement(`Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
                Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis
                dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec,
                pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo,
                fringilla vel, aliquet nec, vulputate e`)
              .clickCoverageStatementSaveButton();
          });

          it('highlights the textarea with an error state', () => {
            expect(CustomerResourceShowPage.coverageStatementHasError).to.be.true;
          });

          it('displays a validation error message', () => {
            expect(CustomerResourceShowPage.validationErrorOnCoverageStatement).to.equal('Statement must be 350 characters or less.');
          });
        });
      });
    });
  });

  describe('visiting the customer resource show page with no coverage statement', () => {
    beforeEach(function () {
      resource.coverageStatement = null;
      resource.save();
      return this.visit(`/eholdings/customer-resources/${resource.id}`, () => {
        expect(CustomerResourceShowPage.$root).to.exist;
      });
    });

    it.always('does not display the coverage statement section', () => {
      expect(CustomerResourceShowPage.hasCoverageStatement).to.be.false;
    });
  });

  describe('visiting the customer resource show page with title package not selected', () => {
    beforeEach(function () {
      resource.isSelected = false;
      resource.save();
      return this.visit(`/eholdings/customer-resources/${resource.id}`, () => {
        expect(CustomerResourceShowPage.$root).to.exist;
      });
    });

    it.always('does not display the coverage statement section', () => {
      expect(CustomerResourceShowPage.hasCoverageStatement).to.be.false;
    });
  });

  describe('visiting the customer resource show page with title package selected', () => {
    beforeEach(function () {
      resource.coverageStatement = 'Refinance your home loans.';
      resource.save();
      return this.visit(`/eholdings/customer-resources/${resource.id}`, () => {
        expect(CustomerResourceShowPage.$root).to.exist;
      });
    });

    it('displays the coverage statement section', () => {
      expect(CustomerResourceShowPage.coverageStatement).to.equal('Refinance your home loans.');
    });

    it('displays the edit button in the coverage statement section', () => {
      expect(CustomerResourceShowPage.hasCoverageStatementEditButton).to.be.true;
    });

    it('does not display the add coverage statement button', () => {
      expect(CustomerResourceShowPage.hasCoverageStatementAddButton).to.be.false;
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

        it('removes coverage statement', () => {
          expect(CustomerResourceShowPage.hasCoverageStatement).to.be.false;
        });
      });

      describe('and canceling deselection', () => {
        beforeEach(() => {
          return CustomerResourceShowPage.deselectionModal.cancelDeselection();
        });

        it('does not remove coverage statement', () => {
          expect(CustomerResourceShowPage.coverageStatement).to.equal('Refinance your home loans.');
        });

        it('displays the edit button in the coverage statement section', () => {
          expect(CustomerResourceShowPage.hasCoverageStatementEditButton).to.be.true;
        });
      });
    });

    describe('clicking the edit button', () => {
      beforeEach(() => {
        return CustomerResourceShowPage.clickCoverageStatementEditButton();
      });

      it('displays the coverage statement form', () => {
        expect(CustomerResourceShowPage.hasCoverageStatementForm).to.be.true;
      });
    });
  });
});
