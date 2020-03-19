import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import ResourceEditPage from '../interactors/resource-edit';
import ResourceShowPage from '../interactors/resource-show';

import { accessTypes } from '../../../src/constants';

describe('CustomResourceEditAccessType', () => {
  setupApplication();

  let provider;
  let providerPackage;
  let title;
  let resource;
  let accessType;

  beforeEach(function () {
    provider = this.server.create('provider', {
      name: 'Cool Provider'
    });

    providerPackage = this.server.create('package', 'withTitles', {
      provider,
      name: 'Cool Package',
      contentType: 'Online',
      isCustom: true,
    });

    providerPackage.save();

    title = this.server.create('title', {
      name: 'Best Title Ever',
      edition: 'Best Edition',
      publicationType: 'Streaming Video',
      publisherName: 'Amazing Publisher'
    });

    title.save();

    accessType = this.server.create('access-type', {
      name: 'Trial',
    });

    accessType.save();

    resource = this.server.create('resource', {
      package: providerPackage,
      isSelected: true,
      title
    });
  });

  describe('when Access status types were not set in settings', () => {
    beforeEach(function () {
      this.server.get('/access-types', () => []);
      this.visit(`/eholdings/resources/${resource.id}/edit`);
    });

    it('should not render Access type select', () => {
      expect(ResourceEditPage.hasAccessTypeSelect).to.be.false;
    });
  });

  describe('when Access status types were set in settings', () => {
    describe('when Resource does not have Access status type selected', () => {
      beforeEach(function () {
        this.visit(`/eholdings/resources/${resource.id}/edit`);
      });

      it('should have unselected option as default value', () => {
        expect(ResourceEditPage.accessTypeSelectValue).to.equal(accessTypes.ACCESS_TYPE_NONE_ID);
      });

      describe('when choosing a Access status type', () => {
        beforeEach(() => {
          return ResourceEditPage.chooseAccessType('Trial');
        });

        it('should enable save action button', () => {
          expect(ResourceEditPage.isSaveDisabled).to.be.false;
        });

        describe('clicking save to update Resource Access status type', () => {
          beforeEach(() => {
            return ResourceEditPage.clickSave();
          });

          it('disables the save button', () => {
            expect(ResourceEditPage.isSaveDisabled).to.be.true;
          });

          it('goes to the resource show page', () => {
            expect(ResourceShowPage.$root).to.exist;
          });

          it('shows newly saved Access status type', () => {
            expect(ResourceShowPage.accessType).to.equal('Trial');
          });

          it('shows a success toast message', () => {
            expect(ResourceShowPage.toast.successText).to.equal('Title was updated.');
          });
        });
      });
    });
  });
});
