import { expect } from 'chai';
import { describe, beforeEach, it } from '@bigtest/mocha';

import setupApplication, { axe } from '../helpers/setup-application';
import TitleShowPage from '../interactors/title-show';
import ResourceShowPage from '../interactors/resource-show';

axe.configure({
  rules: [{
    id: 'aria-allowed-role',
    enabled: false,
  }],
});

describe('TitleShowAddToCustomPackage', () => {
  setupApplication();
  let title;

  let a11yResults = null;

  beforeEach(async function () {
    title = this.server.create('title', 'withPackages', {
      name: 'Cool Title',
      publisherName: 'Cool Publisher',
      publicationType: 'Website'
    });

    // make sure one of these packages are custom
    title.resources.models[0].package.update({
      name: 'Custom Package 1',
      isCustom: true
    });

    // new custom package for assignment
    this.server.create('package', {
      name: 'Custom Package 2',
      provider: this.server.create('provider'),
      isCustom: true
    });

    this.visit(`/eholdings/titles/${title.id}`);
  });

  describe('waiting for axe to run', () => {
    beforeEach(async () => {
      await TitleShowPage.whenLoaded();
      a11yResults = await axe.run();
    });

    it('should not have any a11y issues', () => {
      expect(a11yResults.violations).to.be.empty;
    });
  });

  describe('clicking the add to custom package button', () => {
    beforeEach(async () => {
      await TitleShowPage.clickAddToCustomPackageButton();
    });

    describe('waiting for axe to run', () => {
      beforeEach(async () => {
        a11yResults = await axe.run();
      });

      it('should not have any a11y issues', () => {
        expect(a11yResults.violations).to.be.empty;
      });
    });

    it('shows the modal for adding a custom package', () => {
      expect(TitleShowPage.customPackageModal.isPresent).to.be.true;
    });

    describe('clicking cancel', () => {
      beforeEach(() => {
        return TitleShowPage.customPackageModal.cancel();
      });

      it('dismisses the modal', () => {
        expect(TitleShowPage.customPackageModal.isPresent).to.be.false;
      });
    });

    describe('clicking submit', () => {
      beforeEach(async () => {
        await TitleShowPage.customPackageModal.submit();
      });

      describe('waiting for axe to run', () => {
        beforeEach(async () => {
          a11yResults = await axe.run();
        });

        it('should not have any a11y issues', () => {
          expect(a11yResults.violations).to.be.empty;
        });
      });

      it('shows an error with no selected package', () => {
        expect(TitleShowPage.customPackageModal.hasPackageError).to.be.true;
      });
    });

    describe('selecting a package and clicking submit', () => {
      let customPackage;

      beforeEach(async function () {
        customPackage = this.server.schema.packages.findBy({
          name: 'Custom Package 2'
        });

        await new Promise(r => setTimeout(r, 1000));
        await TitleShowPage.customPackageModal.packageSelection.expandAndClick(0);
        await TitleShowPage.customPackageModal.submit();
      });

      describe('waiting for axe to run', () => {
        beforeEach(async () => {
          a11yResults = await axe.run();
        });

        it('should not have any a11y issues', () => {
          expect(a11yResults.violations).to.be.empty;
        });
      });

      it('disables the submit button', () => {
        expect(TitleShowPage.customPackageModal.isSubmitDisabled).to.be.true;
      });

      it('disables the cancel button', () => {
        expect(TitleShowPage.customPackageModal.isCancelDisabled).to.be.true;
      });

      it('Redirects to the newly created resource', function () {
        expect(this.location.pathname).to.match(/^\/eholdings\/resources\/\d{1,}/);
        expect(ResourceShowPage.titleName).to.equal(title.name);
        expect(ResourceShowPage.packageName).to.equal(customPackage.name);
      });
    });

    describe('adding a URL and clicking submit', () => {
      beforeEach(async function () {
        this.server.schema.packages.findBy({
          name: 'Custom Package 2'
        });

        await new Promise(r => setTimeout(r, 1000));
        await TitleShowPage.customPackageModal.packageSelection.expandAndClick(0);
        await TitleShowPage.customPackageModal.fillUrl('http://my.url');
        await TitleShowPage.customPackageModal.submit();
      });

      describe('waiting for axe to run', () => {
        beforeEach(async () => {
          a11yResults = await axe.run();
        });

        it('should not have any a11y issues', () => {
          expect(a11yResults.violations).to.be.empty;
        });
      });

      it('Redirects to the newly created resource with the specified URL', function () {
        expect(this.location.pathname).to.match(/^\/eholdings\/resources\/\d{1,}/);
        expect(ResourceShowPage.url).to.equal('http://my.url');
      });
    });
  });
});
