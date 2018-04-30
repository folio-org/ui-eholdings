import { expect } from 'chai';
import { describe, beforeEach, afterEach, it } from '@bigtest/mocha';

import { describeApplication } from './helpers';
import PackageShowPage from './pages/package-show';
import PackageEditPage from './pages/package-edit';
import PackageSearchPage from './pages/package-search';

describeApplication('CustomPackageEdit', () => {
  let provider,
    providerPackage;

  beforeEach(function () {
    provider = this.server.create('provider', {
      name: 'Cool Provider'
    });

    providerPackage = this.server.create('package', {
      provider,
      name: 'Cool Package',
      contentType: 'E-Book',
      isCustom: true
    });
  });

  describe('visiting the package edit page without coverage dates', () => {
    beforeEach(function () {
      return this.visit(`/eholdings/packages/${providerPackage.id}/edit`, () => {
        expect(PackageEditPage.$root).to.exist;
      });
    });

    it('displays the correct holdings status', () => {
      expect(PackageEditPage.isSelected).to.equal(true);
    });

    it('shows blank datepicker fields', () => {
      expect(PackageEditPage.dateRangeRowList(0).beginDate.inputValue).to.equal('');
      expect(PackageEditPage.dateRangeRowList(0).endDate.inputValue).to.equal('');
    });

    it('disables the save button', () => {
      expect(PackageEditPage.isSaveDisabled).to.be.true;
    });

    describe('clicking cancel', () => {
      beforeEach(() => {
        return PackageEditPage.clickCancel();
      });

      it('goes to the package show page', () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    describe('toggling the selection toggle', () => {
      beforeEach(function () {
        /*
         * The expectations in the convergent `it` blocks
         * get run once every 10ms.  We were seeing test flakiness
         * when a toggle action dispatched and resolved before an
         * expectation had the chance to run.  We sidestep this by
         * temporarily increasing the mirage server's response time
         * to 50ms.
         * TODO: control timing directly with Mirage
         */
        this.server.timing = 50;
        return PackageEditPage.toggleIsSelected();
      });

      afterEach(function () {
        this.server.timing = 0;
      });

      describe('clicking save', () => {
        beforeEach(() => {
          return PackageEditPage.clickSave();
        });

        it('shows the modal', () => {
          expect(PackageEditPage.modal.isPresent).to.equal(true);
        });

        it('reflects the desired state of holding status', () => {
          expect(PackageEditPage.isSelected).to.equal(false);
        });

        describe('clicking confirm', () => {
          beforeEach(() => {
            return PackageEditPage
              .do(() => PackageEditPage.modal.confirmDeselection())
              .when(() => expect(PackageSearchPage.isPresent).to.equal(true));
          });

          it('transitions to the package search page', function () {
            expect(this.app.history.location.search).to.include('?searchType=packages');
          });

          describe('searching for package after confirming', () => {
            beforeEach(() => {
              return PackageSearchPage.search('Cool Package');
            });

            it('does not find package', () => {
              expect(PackageSearchPage.noResultsMessage).to.equal('No packages found for "Cool Package".');
            });
          });
        });

        describe('clicking cancel', () => {
          beforeEach(() => {
            return PackageEditPage.modal.cancelDeselection();
          });

          it('removes the modal', () => {
            expect(PackageEditPage.modal.isPresent).to.equal(false);
          });

          it('reflects the correct holding status', () => {
            expect(PackageEditPage.isSelected).to.equal(true);
          });
        });
      });
    });

    describe('entering invalid data', () => {
      beforeEach(() => {
        return PackageEditPage
          .when(() => PackageEditPage.dateRangeRowList().length > 0)
          .do(() => {
            return PackageEditPage
              .dateRangeRowList(0).fillDates('12/18/2018', '12/16/2018')
              .clickSave();
          });
      });

      it('displays a validation error for coverage', () => {
        expect(PackageEditPage.dateRangeRowList(0).beginDate.isInvalid).to.be.true;
      });
    });

    describe('entering valid data', () => {
      beforeEach(() => {
        return PackageEditPage
          .when(() => PackageEditPage.dateRangeRowList().length > 0)
          .do(() => {
            return PackageEditPage.dateRangeRowList(0).fillDates('12/16/2018', '12/18/2018');
          });
      });

      describe('clicking cancel', () => {
        beforeEach(() => {
          return PackageEditPage.clickCancel();
        });

        it('shows a navigation confirmation modal', () => {
          expect(PackageEditPage.navigationModal.$root).to.exist;
        });
      });

      describe('clicking save', () => {
        beforeEach(() => {
          return PackageEditPage.clickSave();
        });

        it('goes to the package show page', () => {
          expect(PackageShowPage.$root).to.exist;
        });

        it('displays the new coverage dates', () => {
          expect(PackageShowPage.customCoverage).to.equal('12/16/2018 - 12/18/2018');
        });
      });
    });
  });

  describe('visiting the package edit page with coverage dates and content type', () => {
    beforeEach(function () {
      providerPackage.update('customCoverage', {
        beginCoverage: '1969-07-16',
        endCoverage: '1972-12-19'
      });
      providerPackage.update('contentType', 'E-Book');
      providerPackage.save();

      return this.visit(`/eholdings/packages/${providerPackage.id}/edit`, () => {
        expect(PackageEditPage.$root).to.exist;
      });
    });

    it('disables the save button', () => {
      expect(PackageEditPage.isSaveDisabled).to.be.true;
    });

    describe('clicking cancel', () => {
      beforeEach(() => {
        return PackageEditPage.clickCancel();
      });

      it('goes to the package show page', () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    describe('entering invalid data', () => {
      beforeEach(() => {
        return PackageEditPage
          .name('')
          .dateRangeRowList(0).fillDates('12/18/2018', '12/16/2018')
          .clickSave();
      });

      it('displays a validation error for the name', () => {
        expect(PackageEditPage.nameHasError).to.be.true;
      });

      it('displays a validation error for coverage', () => {
        expect(PackageEditPage.dateRangeRowList(0).beginDate.isInvalid).to.be.true;
      });
    });

    describe('entering valid data', () => {
      beforeEach(() => {
        return PackageEditPage
          .name('A Different Name')
          .contentType('E-Journal')
          .dateRangeRowList(0).fillDates('12/16/2018', '12/18/2018');
      });

      describe('clicking cancel', () => {
        beforeEach(() => {
          return PackageEditPage.clickCancel();
        });

        it('shows a navigation confirmation modal', () => {
          expect(PackageEditPage.navigationModal.$root).to.exist;
        });

        describe('confirming to continue without saving', () => {
          beforeEach(() => {
            return PackageEditPage.navigationModal.confirmNavigation();
          });

          it('navigates from editing page', () => {
            expect(PackageShowPage.isPresent).to.eq(true);
          });
        });

        describe('confirming to keep editing', () => {
          beforeEach(() => {
            return PackageEditPage.navigationModal.cancelNavigation();
          });

          it('reamins on the editing page', () => {
            expect(PackageEditPage.isPresent).to.eq(true);
          });
        });
      });

      describe('clicking save', () => {
        beforeEach(() => {
          return PackageEditPage.clickSave();
        });

        it('goes to the package show page', () => {
          expect(PackageShowPage.$root).to.exist;
        });

        it('reflects the new name', () => {
          expect(PackageShowPage.name).to.equal('A Different Name');
        });

        it('reflects the new coverage dates', () => {
          expect(PackageShowPage.customCoverage).to.equal('12/16/2018 - 12/18/2018');
        });

        it('reflects the new content type', () => {
          expect(PackageShowPage.contentType).to.equal('E-Journal');
        });
      });
    });
  });

  describe('encountering a server error when GETting', () => {
    beforeEach(function () {
      this.server.get('/packages/:id', {
        errors: [{
          title: 'There was an error'
        }]
      }, 500);

      return this.visit(`/eholdings/packages/${providerPackage.id}/edit`, () => {
        expect(PackageEditPage.$root).to.exist;
      });
    });

    it('dies with dignity', () => {
      expect(PackageEditPage.hasErrors).to.be.true;
    });
  });

  describe('encountering a server error when PUTting', () => {
    beforeEach(function () {
      this.server.put('/packages/:id', {
        errors: [{
          title: 'There was an error'
        }]
      }, 500);

      return this.visit(`/eholdings/packages/${providerPackage.id}/edit`, () => {
        expect(PackageEditPage.$root).to.exist;
      });
    });

    describe('entering valid data and clicking save', () => {
      beforeEach(() => {
        return PackageEditPage
          .name('A Different Name')
          .dateRangeRowList(0).fillDates('12/16/2018', '12/18/2018')
          .clickSave();
      });

      it('pops up an error', () => {
        expect(PackageEditPage.toast.errorText).to.equal('There was an error');
      });
    });
  });
});
