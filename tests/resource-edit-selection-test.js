import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { describeApplication } from './helpers';
import ResourceShowPage from './pages/resource-show';
import ResourceEditPage from './pages/resource-edit';

describeApplication('ResourceEditSelection', () => {
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
      publicationType: 'Streaming Video'
    });

    resource = this.server.create('resource', {
      package: providerPackage,
      isSelected: false,
      title
    });
  });

  describe('visiting the resource edit page', () => {
    beforeEach(function () {
      return this.visit(`/eholdings/resources/${resource.id}/edit`, () => {
        expect(ResourceEditPage.$root).to.exist;
      });
    });

    it('indicates that the resource is not yet selected', () => {
      expect(ResourceEditPage.isSelected).to.equal(false);
    });

    describe('successfully selecting a package title to add to my holdings', () => {
      beforeEach(() => {
        return ResourceEditPage.toggleIsSelected();
      });

      it('reflects the desired state (Selected)', () => {
        expect(ResourceEditPage.isSelected).to.equal(true);
      });

      describe('clicking cancel', () => {
        beforeEach(() => {
          return ResourceEditPage.clickCancel();
        });

        it('goes to the resource show page', () => {
          expect(ResourceShowPage.$root).to.exist;
        });
      });

      describe('when the request succeeds', () => {
        it('reflects the desired state was set', () => {
          expect(ResourceEditPage.isSelected).to.equal(true);
        });

        describe('clicking save', () => {
          beforeEach(() => {
            return ResourceEditPage.clickSave();
          });

          it('goes to the resource show page', () => {
            expect(ResourceShowPage.$root).to.exist;
          });

          it('reflects the new state', () => {
            expect(ResourceShowPage.isResourceSelected).to.equal('Selected');
          });
        });
      });
    });

    describe('unsuccessfully selecting a package title to add to my holdings', () => {
      beforeEach(function () {
        this.server.put('/resources/:id', {
          errors: [{
            title: 'There was an error'
          }]
        }, 500);
        return ResourceEditPage.toggleIsSelected();
      });

      it('reflects the desired state (Selected)', () => {
        expect(ResourceEditPage.isSelected).to.equal(true);
      });

      describe('clicking cancel', () => {
        beforeEach(() => {
          return ResourceEditPage.clickCancel();
        });

        it('goes to the resource show page', () => {
          expect(ResourceShowPage.$root).to.exist;
        });
      });

      describe('when the request succeeds', () => {
        it('reflects the desired state was set', () => {
          expect(ResourceEditPage.isSelected).to.equal(true);
        });

        describe('clicking save', () => {
          beforeEach(() => {
            return ResourceEditPage.clickSave();
          });

          it('goes to the resource show page', () => {
            expect(ResourceShowPage.$root).to.exist;
          });

          it('indicates it is no longer working', () => {
            expect(ResourceShowPage.isLoading).to.equal(false);
          });

          it('displays a toast error', () => {
            expect(ResourceShowPage.toast.errorText).to.equal('There was an error');
          });
        });
      });
    });
  });
});
