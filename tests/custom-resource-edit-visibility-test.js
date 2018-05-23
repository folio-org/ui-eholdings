import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { describeApplication } from './helpers';
import ResourceEditPage from './pages/resource-edit';
import ResourceShowPage from './pages/resource-show';

describeApplication('CustomResourceEditVisibility', () => {
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

      return this.visit(`/eholdings/resources/${resource.id}/edit`, () => {
        expect(ResourceEditPage.$root).to.exist;
      });
    });

    it('displays an ON visibility toggle (Visible)', () => {
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
        return ResourceEditPage.clickCancel();
      });

      it('goes to the resource show page', () => {
        expect(ResourceShowPage.$root).to.exist;
      });
    });

    describe('toggling the visibility toggle', () => {
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

  describe('visiting the resource edit page and showing a hidden without reason resource', () => {
    beforeEach(function () {
      resource = this.server.create('resource', 'isHiddenWithoutReason', {
        package: providerPackage,
        isSelected: true,
        title
      });

      return this.visit(`/eholdings/resources/${resource.id}/edit`, () => {
        expect(ResourceEditPage.$root).to.exist;
      });
    });

    it('displays an OFF visibility toggle (Hidden)', () => {
      expect(ResourceEditPage.isResourceVisible).to.be.false;
    });

    it('does not display hidden message', () => {
      expect(ResourceEditPage.isHiddenMessagePresent).to.equal(false);
    });

    it('disables the save button', () => {
      expect(ResourceEditPage.isSaveDisabled).to.be.true;
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

  describe('visiting the resource edit page with a hidden resource and a reason', () => {
    beforeEach(function () {
      resource = this.server.create('resource', 'isHidden', {
        package: providerPackage,
        isSelected: true,
        title
      });

      return this.visit(`/eholdings/resources/${resource.id}/edit`, () => {
        expect(ResourceEditPage.$root).to.exist;
      });
    });

    it('displays an OFF visibility toggle (Hidden)', () => {
      expect(ResourceEditPage.isResourceVisible).to.be.false;
    });

    it('maps the hidden reason text', () => {
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
      return this.visit(`/eholdings/resources/${resource.id}/edit`, () => {
        expect(ResourceEditPage.$root).to.exist;
      });
    });

    it('displays an OFF visibility toggle (Hidden)', () => {
      expect(ResourceEditPage.isResourceVisible).to.be.false;
    });

    it('maps the hidden reason text', () => {
      expect(ResourceEditPage.isHiddenMessage).to.equal('All titles in this package are hidden.');
    });
  });

  describe('visiting the resource edit page with a custom (default selected) resource', () => {
    beforeEach(function () {
      resource = this.server.create('resource', {
        package: providerPackage,
        isSelected: true,
        title
      });

      return this.visit(`/eholdings/resources/${resource.id}/edit`, () => {
        expect(ResourceEditPage.$root).to.exist;
      });
    });
    it('reflects the desired state of holding status', () => {
      expect(ResourceEditPage.isSelected).to.equal(true);
    });

    it('disables the save button', () => {
      expect(ResourceEditPage.isSaveDisabled).to.be.true;
    });

    describe('toggling the selection toggle', () => {
      beforeEach(() => {
        return ResourceEditPage.toggleIsSelected();
      });

      it('cannot toggle visibility', () => {
        expect(ResourceEditPage.isVisibleTogglePresent).to.equal(false);
      });

      it('displays Visibility label as Not shown to patrons', () => {
        expect(ResourceEditPage.isResourceNotShownLabelPresent).to.be.true;
      });
    });
  });
});
