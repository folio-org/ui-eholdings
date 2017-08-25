/* global describe, beforeEach */
import { expect } from 'chai';
import it from './it-will';

import { describeApplication } from './helpers';
import ResourcePage from './pages/customer-resource-show';

describeApplication('CustomerResourceShow', function() {
  let vendor, vendorPackage, resource;

  beforeEach(function() {
    vendor = this.server.create('vendor', {
      vendorName: 'Cool Vendor'
    });

    vendorPackage = this.server.create('package', 'withTitles', {
      vendor,
      packageName: 'Cool Package',
      contentType: 'e-book',
      titleCount: 5
    });

    resource = this.server.create('customer-resource', 'withTitle', {
      package: vendorPackage,
      isSelected: false
    });

  });

  describe("visiting the customer resource page", function() {
    beforeEach(function() {
      return this.visit(`/eholdings/vendors/${vendor.id}/packages/${vendorPackage.id}/titles/${resource.titleId}`, () => {
        expect(ResourcePage.$root).to.exist;
      });
    });

    it('displays the vendor name', function() {
      expect(ResourcePage.vendorName).to.equal('Cool Vendor');
    });

    it('displays the package name', function() {
      expect(ResourcePage.packageName).to.equal('Cool Package');
    });

    it('displays the title name', function() {
      expect(ResourcePage.titleName).to.equal(resource.title.titleName);
    });

    it('indicates that the resource is not yet selected', function() {
      expect(ResourcePage.isSelected).to.equal(false);
    });

    describe("selecting a package title to add to my holdings", function() {
      beforeEach(function() {
        ResourcePage.toggleIsSelected();
      });

      it('reflects the desired state (YES)', function() {
        expect(ResourcePage.isSelected).to.equal(true);
      });

      it('indicates it working to get to desired state', function() {
        expect(ResourcePage.isSelecting).to.equal(true);
      });

      it('cannot be interacted with while the request is in flight', function() {
        expect(ResourcePage.isSelectedToggleable).to.equal(false);
      });

      describe('when the request succeeds', function() {
        it('reflect the desired state was set', function() {
          expect(ResourcePage.isSelected).to.equal(true);
        });

        it('indicates it is no longer working', function() {
          expect(ResourcePage.isSelecting).to.equal(false);
        });
      });

      describe('when the request fails', function() {
        it('does not change to new state', function() {
          expect(ResourcePage.isSelected).to.equal(false);
        });

        it('indicates it is no longer working', function() {
          expect(ResourcePage.isSelecting).to.equal(false);
        });

        it.skip('logs an Error somewhere', function() {
          expect(ResourcePage.flashError).to.match(/unable to select/i);
        });
      });
    });
  });


  describe.skip("encountering a server error", function() {
    beforeEach(function() {
      this.server.get('/vendors/:vendorId/packages/:packageId/titles/:titleId', [{
        message: 'There was an error',
        code: "1000",
        subcode: 0
      }], 500);

      return this.visit(`/eholdings/vendors/${vendor.id}/packages/${vendorPackage.id}/titles/${resource.titleId}`, () => {
        expect(ResourcePage.$root).to.exist;
      });
    });

    it("dies with dignity", function() {
      expect(ResourcePage.hasErrors).to.be.true;
    });
  });
});
