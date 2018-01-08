/* global describe, beforeEach */
import { expect } from 'chai';
import it from './it-will';

import { describeApplication } from './helpers';
import PackageShowPage from './pages/package-show';

describeApplication('PackageShow', () => {
  let vendor,
    vendorPackage,
    customerResources;

  beforeEach(function () {
    vendor = this.server.create('vendor', {
      name: 'Cool Vendor'
    });

    vendorPackage = this.server.create('package', 'withTitles', {
      vendor,
      name: 'Cool Package',
      contentType: 'E-Book',
      isSelected: false,
      titleCount: 5
    });

    customerResources = this.server.schema.where('customer-resource', { packageId: vendorPackage.id }).models;
  });

  describe('visiting the package details page', () => {
    beforeEach(function () {
      return this.visit(`/eholdings/packages/${vendorPackage.id}`, () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    it('displays the package name', () => {
      expect(PackageShowPage.name).to.equal('Cool Package');
    });

    it('displays whether or not the package is selected', () => {
      expect(PackageShowPage.isSelected).to.equal(false);
    });

    it('displays the content type', () => {
      expect(PackageShowPage.contentType).to.equal('E-Book');
    });

    it('displays the total number of titles', () => {
      expect(PackageShowPage.numTitles).to.equal('5');
    });

    it('displays the number of selected titles', () => {
      expect(PackageShowPage.numTitlesSelected).to.equal(`${vendorPackage.selectedCount}`);
    });

    it('displays a list of titles', () => {
      expect(PackageShowPage.titleList).to.have.lengthOf(5);
    });

    it('displays name of a title in the title list', () => {
      expect(PackageShowPage.titleList[0].name).to.equal(customerResources[0].title.name);
    });

    it('displays whether the first title is selected', () => {
      expect(PackageShowPage.titleList[0].isSelected).to.equal(customerResources[0].isSelected);
    });

    it.still('should not display a back button', () => {
      expect(PackageShowPage.$backButton).to.not.exist;
    });
  });

  describe('navigating to package show page', () => {
    beforeEach(function () {
      return this.visit({
        pathname: `/eholdings/packages/${vendorPackage.id}`,
        // our internal link component automatically sets the location state
        state: { eholdings: true }
      }, () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    it('should display the back button in UI', () => {
      expect(PackageShowPage.$backButton).to.exist;
    });
  });


  describe('encountering a server error', () => {
    beforeEach(function () {
      this.server.get('/packages/:packageId', {
        errors: [{
          title: 'There was an error'
        }]
      }, 500);

      return this.visit(`/eholdings/packages/${vendorPackage.id}`, () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    it('dies with dignity', () => {
      expect(PackageShowPage.hasErrors).to.be.true;
    });
  });
});
