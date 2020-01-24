import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import ResourceEditPage from '../interactors/resource-edit';
import ResourceShowPage from '../interactors/resource-show';

describe('CustomResourceEditVisibility', () => {
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
  });

  describe('visiting the resource edit page and hiding a resource', () => {
    beforeEach(function () {
      resource = this.server.create('resource', {
        package: providerPackage,
        isSelected: true,
        title
      });

      this.visit(`/eholdings/resources/${resource.id}/edit`);
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
      beforeEach(() => {
        return ResourceEditPage.clickBackButton();
      });

      it('goes to the resource show page', () => {
        expect(ResourceShowPage.$root).to.exist;
      });
    });

    describe('editing', () => {
      beforeEach(async () => {
        await ResourceEditPage.whenLoaded();
      });

      describe('toggling the visibility toggle', () => {
        beforeEach(() => {
          return ResourceEditPage.toggleIsVisible();
        });

        describe('clicking cancel', () => {
          beforeEach(() => {
            return ResourceEditPage.clickBackButton();
          });

          it('shows a navigation confirmation modal', () => {
            expect(ResourceEditPage.navigationModal.$root).to.exist;
          });
        });

        describe('clicking save', () => {
          beforeEach(() => {
            return ResourceEditPage.clickSave();
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
    beforeEach(function () {
      resource = this.server.create('resource', 'isHiddenWithoutReason', {
        package: providerPackage,
        isSelected: true,
        title
      });

      this.visit(`/eholdings/resources/${resource.id}/edit`);
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

      describe('toggling the visibility toggle', () => {
        beforeEach(() => {
          return ResourceEditPage.toggleIsVisible();
        });

        describe('clicking save', () => {
          beforeEach(() => {
            return ResourceEditPage.clickSave();
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
    beforeEach(function () {
      resource = this.server.create('resource', 'isHidden', {
        package: providerPackage,
        isSelected: true,
        title
      });

      this.visit(`/eholdings/resources/${resource.id}/edit`);
    });

    it('displays the no visibility radio is selected', () => {
      expect(ResourceEditPage.isResourceVisible).to.be.false;
    });

    it('displays the hidden reason text', () => {
      expect(ResourceEditPage.isHiddenMessage).to.equal('The content is for mature audiences only.');
    });
  });

  describe('visiting the resource edit page and all titles in package are hidden', () => {
    beforeEach(function () {
      providerPackage.visibilityData.isHidden = true;
      providerPackage.visibilityData.reason = 'Hidden by EP';
      resource = this.server.create('resource', 'isHidden', {
        package: providerPackage,
        title,
        isSelected: true
      });
      this.visit(`/eholdings/resources/${resource.id}/edit`);
    });

    it('displays the no visibility radio is selected', () => {
      expect(ResourceEditPage.isResourceVisible).to.be.false;
    });

    it('displays the hidden reason text', () => {
      expect(ResourceEditPage.isHiddenMessage).to.equal('All titles in this package are hidden');
    });
  });

  describe('visiting the resource edit page with a custom (default selected) resource', () => {
    beforeEach(function () {
      resource = this.server.create('resource', {
        package: providerPackage,
        isSelected: true,
        title
      });

      this.visit(`/eholdings/resources/${resource.id}/edit`);
    });

    it('reflects the desired state of holding status', () => {
      expect(ResourceEditPage.isResourceSelected).to.equal('Selected');
    });

    it('disables the save button', () => {
      expect(ResourceEditPage.isSaveDisabled).to.be.true;
    });
  });
});
