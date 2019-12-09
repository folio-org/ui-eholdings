import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import ResourceEditPage from '../interactors/resource-edit';
import ResourceShowPage from '../interactors/resource-show';

describe('ManagedResourceEditVisibility', function () {
  // some of the beforeEach blocks seem to timeout in CI
  this.timeout(5000);
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
      contentType: 'Online'
    });

    title = this.server.create('title', {
      name: 'Hans Solo Director Cut',
      publicationType: 'Streaming Video',
      publisherName: 'Amazing Publisher'
    });

    title.save();
  });

  describe('visiting the managed resource edit page and hiding a resource', () => {
    beforeEach(async function () {
      resource = await this.server.create('resource', {
        package: providerPackage,
        isSelected: true,
        title
      });

      await this.visit(`/eholdings/resources/${resource.id}/edit`);
    });

    it('displays the yes visibility radio is selected', () => {
      expect(ResourceEditPage.isResourceVisible).to.be.true;
    });

    it('does not display hidden message', () => {
      expect(ResourceEditPage.isHiddenMessagePresent).to.equal(false);
    });

    it('disables the save button', () => {
      expect(ResourceEditPage.isSaveDisabled).to.be.true;
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

    describe('editing', () => {
      beforeEach(async () => {
        await ResourceEditPage.whenLoaded();
      });

      describe('toggling the visiblity toggle', () => {
        beforeEach(() => {
          return ResourceEditPage.toggleIsVisible();
        });

        describe('clicking cancel', () => {
          beforeEach(() => {
            return ResourceEditPage.clickCancel();
          });

          it('shows a navigation confirmation modal', () => {
            expect(ResourceEditPage.navigationModal.$root).to.exist;
          });
        });

        describe('clicking save', () => {
          beforeEach(async () => {
            await ResourceEditPage.clickSave();
            await ResourceShowPage.whenLoaded();
          });

          it('goes to the resource show page', () => {
            expect(ResourceShowPage.$root).to.exist;
          });

          it('displays the new visibility status', () => {
            expect(ResourceShowPage.isResourceHidden).to.be.true;
          });
        });
      });
    });
  });

  describe('visiting the resource edit page and showing a hidden without reason resource', () => {
    beforeEach(async function () {
      resource = await this.server.create('resource', 'isHiddenWithoutReason', {
        package: providerPackage,
        isSelected: true,
        title
      });

      await this.visit(`/eholdings/resources/${resource.id}/edit`);
    });

    it('displays the no visibility radio is selected', () => {
      expect(ResourceEditPage.isResourceVisible).to.be.false;
    });

    it('does not display hidden message', () => {
      expect(ResourceEditPage.isHiddenMessagePresent).to.equal(false);
    });

    it('disables the save button', () => {
      expect(ResourceEditPage.isSaveDisabled).to.be.true;
    });

    describe('editing', () => {
      beforeEach(async () => {
        await ResourceEditPage.whenLoaded();
      });

      describe('toggling the visiblity toggle', () => {
        beforeEach(() => {
          return ResourceEditPage.toggleIsVisible();
        });

        describe('clicking save', () => {
          beforeEach(async () => {
            await ResourceEditPage.clickSave();
            await ResourceShowPage.whenLoaded();
          });

          it('goes to the resource show page', () => {
            expect(ResourceShowPage.$root).to.exist;
          });

          it('displays the new visibility status', () => {
            expect(ResourceShowPage.isResourceVisible).to.be.true;
          });
        });
      });
    });
  });

  describe('visiting the resource edit page with a hidden resource and a reason', () => {
    beforeEach(async function () {
      resource = await this.server.create('resource', 'isHidden', {
        package: providerPackage,
        isSelected: true,
        title
      });

      await this.visit(`/eholdings/resources/${resource.id}/edit`);
      await ResourceEditPage.whenLoaded();
    });

    it('displays the no visibility radio is selected', () => {
      expect(ResourceEditPage.isResourceVisible).to.be.false;
    });

    it('maps the hidden reason text', () => {
      expect(ResourceEditPage.isHiddenMessage).to.equal('The content is for mature audiences only.');
    });
  });

  describe('visiting the resource edit page and all titles in package are hidden', () => {
    beforeEach(async function () {
      providerPackage.visibilityData.isHidden = true;
      providerPackage.visibilityData.reason = 'Hidden by EP';
      resource = await this.server.create('resource', 'isHidden', {
        package: providerPackage,
        title,
        isSelected: true
      });
      await this.visit(`/eholdings/resources/${resource.id}/edit`);
      await ResourceEditPage.whenLoaded();
    });

    it('displays the no visibility radio is selected', () => {
      expect(ResourceEditPage.isResourceVisible).to.be.false;
    });

    it('displays the hidden reason text', () => {
      expect(ResourceEditPage.isHiddenMessage).to.equal('All titles in this package are hidden');
    });
  });

  describe('visiting the resource edit page with a resource that is not selected', () => {
    beforeEach(async function () {
      resource = await this.server.create('resource', {
        package: providerPackage,
        isSelected: false,
        title
      });

      await this.visit(`/eholdings/resources/${resource.id}/edit`);
      await ResourceEditPage.whenLoaded();
    });

    it('does not show visibility section', () => {
      expect(ResourceEditPage.isVisibilityFieldPresent).to.be.false;
    });
  });
});
