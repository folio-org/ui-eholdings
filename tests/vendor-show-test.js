/* global describe, beforeEach */
import { expect } from 'chai';
import it from './it-will';

import { describeApplication } from './helpers';
import VendorShowPage from './pages/vendor-show';

describeApplication('VendorShow', () => {
  let vendor,
    packages;

  beforeEach(function () {
    vendor = this.server.create('vendor', 'withPackagesAndTitles', {
      name: 'League of Ordinary Men',
      packagesTotal: 5
    });

    packages = this.server.schema.where('package', { vendorId: vendor.id }).models;
  });

  describe('visiting the vendor details page', () => {
    beforeEach(function () {
      return this.visit(`/eholdings/vendors/${vendor.id}`, () => {
        expect(VendorShowPage.$root).to.exist;
      });
    });

    it('displays the vendor name', () => {
      expect(VendorShowPage.name).to.equal('League of Ordinary Men');
    });

    it('displays the total number of packages', () => {
      expect(VendorShowPage.numPackages).to.equal(`${vendor.packagesTotal}`);
    });

    it('displays the number of selected packages', () => {
      expect(VendorShowPage.numPackagesSelected).to.equal(`${vendor.packagesSelected}`);
    });

    it('displays a list of packages', () => {
      expect(VendorShowPage.packageList).to.have.lengthOf(packages.length);
    });

    it('displays name of a package in the package list', () => {
      expect(VendorShowPage.packageList[0].name).to.equal(packages[0].packageName);
    });

    it('displays number of selected titles for a package', () => {
      expect(VendorShowPage.packageList[0].numTitlesSelected).to.equal(packages[0].selectedCount);
    });

    it('displays total number of titles for a package', () => {
      expect(VendorShowPage.packageList[0].numTitles).to.equal(packages[0].titleCount);
    });

    it.still('should not display the back button', () => {
      expect(VendorShowPage.$backButton).to.not.exist;
    });
  });

  describe('navigating to vendor details page', () => {
    beforeEach(function () {
      return this.visit({
        pathname: `/eholdings/vendors/${vendor.id}`,
        // our internal link component automatically sets the location state
        state: { eholdings: true }
      }, () => {
        expect(VendorShowPage.$root).to.exist;
      });
    });

    it('should display the back button in UI', () => {
      expect(VendorShowPage.$backButton).to.exist;
    });
  });


  describe('encountering a server error', () => {
    beforeEach(function () {
      this.server.get('/jsonapi/vendors/:id', {
        errors: [
          {
            title: 'There was an error'
          }
        ]
      }, 500);

      return this.visit(`/eholdings/vendors/${vendor.id}`, () => {
        expect(VendorShowPage.$root).to.exist;
      });
    });

    it('has an error', () => {
      expect(VendorShowPage.hasErrors).to.be.true;
    });

    it('displays the error message returned from the server', () => {
      expect(VendorShowPage.errorMessage).to.equal('There was an error');
    });
  });
});
