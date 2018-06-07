import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { describeApplication } from './helpers';
import ResourceShowPage from './pages/resource-show';
import ResourceEditPage from './pages/resource-edit';

describeApplication('ResourceEditDeselection', () => {
  let provider,
    title,
    providerPackage,
    resource;

  beforeEach(function () {
    provider = this.server.create('provider', {
      name: 'Neat Provider'
    });

    title = this.server.create('title', {
      publicationType: 'Streaming Video'
    });

    providerPackage = this.server.create('package', {
      provider,
      name: 'Awesome Package',
      contentType: 'EJournal',
      titleCount: 1,
      selectedCount: 1
    });

    resource = this.server.create('resource', {
      package: providerPackage,
      isSelected: true,
      title
    });
  });

  describe('visiting the resource page', () => {
    describe('part of a package with only one selected title', () => {
      beforeEach(function () {
        return this.visit(`/eholdings/resources/${resource.id}/edit`, () => {
          expect(ResourceEditPage.$root).to.exist;
        });
      });

      it('indicates that the resource is selected', () => {
        expect(ResourceEditPage.isSelected).to.equal(true);
      });

      describe('deselecting', () => {
        beforeEach(() => {
          return ResourceEditPage.toggleIsSelected();
        });

        it('hides custom url field', () => {
          expect(ResourceEditPage.hasCustomUrlField).to.equal(false);
        });

        it('hides visibility field', () => {
          expect(ResourceEditPage.isVisibilityFieldPresent).to.equal(false);
        });

        it('hides add date range button', () => {
          expect(ResourceEditPage.hasAddCustomCoverageButton).to.equal(false);
        });

        it('hides coverage statement input field', () => {
          expect(ResourceEditPage.hasCoverageStatementArea).to.equal(false);
        });

        it('hides add embargo period button', () => {
          expect(ResourceEditPage.hasAddCustomEmbargoButton).to.equal(false);
        });

        describe('clicking save', () => {
          beforeEach(() => {
            return ResourceEditPage.clickSave();
          });

          it('displays confirmation modal', () => {
            expect(ResourceEditPage.modal.$root).to.exist;
          });

          describe('clicking no', () => {
            beforeEach(() => {
              return ResourceEditPage.modal.cancelDeselection();
            });

            it('returns to the edit page', () => {
              expect(ResourceEditPage.$root).to.exist;
            });
          });

          describe('clicking yes', () => {
            beforeEach(() => {
              return ResourceEditPage.modal.confirmDeselection();
            });

            it('goes to the resource show page', () => {
              expect(ResourceShowPage.$root).to.exist;
            });
          });
        });
      });
    });
  });
});
