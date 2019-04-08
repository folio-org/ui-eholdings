import { expect } from 'chai';
import { describe, beforeEach, it } from '@bigtest/mocha';

import setupApplication from '../helpers/setup-application';
import TitleShowPage from '../interactors/title-show';
import ResourceShowPage from '../interactors/resource-show';

describe('TitleShowAddToCustomPackage', () => {
  setupApplication();
  let title;

  beforeEach(function () {
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

  describe('clicking the add to custom package button', () => {
    beforeEach(() => {
      return TitleShowPage.clickAddToCustomPackageButton();
    });

    it('shows the modal for adding a custom package', () => {
      expect(TitleShowPage.customPackageModal.isPresent).to.be.true;
    });

    it('contains a list of custom packages with existing relationships disabled', () => {
      // index `0` is the "Choose a package" placeholder option
      const first = TitleShowPage.customPackageModal.packages(1);
      const second = TitleShowPage.customPackageModal.packages(2);

      expect(first.text).to.equal('Custom Package 1');
      expect(first.isDisabled).to.be.true;

      expect(second.text).to.equal('Custom Package 2');
      expect(second.isDisabled).to.be.false;
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
      beforeEach(() => {
        return TitleShowPage.customPackageModal.submit();
      });

      it('shows an error with no selected package', () => {
        expect(TitleShowPage.customPackageModal.hasPackageError).to.be.true;
      });
    });

    describe('selecting a package and clicking submit', () => {
      let customPackage;

      beforeEach(function () {
        customPackage = this.server.schema.packages.findBy({
          name: 'Custom Package 2'
        });

        return TitleShowPage
          .customPackageModal.choosePackage(customPackage.id)
          .customPackageModal.submit();
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
      let customPackage;

      beforeEach(function () {
        customPackage = this.server.schema.packages.findBy({
          name: 'Custom Package 2'
        });

        return TitleShowPage
          .customPackageModal.choosePackage(customPackage.id)
          .customPackageModal.fillUrl('http://my.url')
          .customPackageModal.submit();
      });

      it('Redirects to the newly created resource with the specified URL', function () {
        expect(this.location.pathname).to.match(/^\/eholdings\/resources\/\d{1,}/);
        expect(ResourceShowPage.url).to.equal('http://my.url');
      });
    });
  });
});
