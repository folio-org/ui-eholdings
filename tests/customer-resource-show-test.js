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

    let title = this.server.create('title', {
      package: vendorPackage
    });

    resource = this.server.create('customer-resource', {
      package: vendorPackage,
      isSelected: false,
      title
    });

  });

  describe("visiting the customer resource page", function() {
    beforeEach(function() {
      return this.visit(`/eholdings/vendors/${vendor.id}/packages/${vendorPackage.id}/titles/${resource.titleId}`, () => {
        expect(ResourcePage.$root).to.exist;
      });
    });

    it('displays the title name', function() {
      expect(ResourcePage.titleName).to.equal(resource.title.titleName);
    });

    it('displays the publisher name', function() {
      expect(ResourcePage.publisherName).to.equal(resource.title.publisherName);
    });

    it('displays the publication type', function() {
      expect(ResourcePage.publicationType).to.equal(resource.title.pubType);
    });

    it('displays the vendor name', function() {
      expect(ResourcePage.vendorName).to.equal(resource.package.vendor.vendorName);
    });

    it('displays the package name', function() {
      expect(ResourcePage.packageName).to.equal(resource.package.packageName);
    });

    it('displays the content type', function() {
      expect(ResourcePage.contentType).to.equal(resource.package.contentType);
    });

    it('displays the managed url', function() {
      expect(ResourcePage.managedUrl).to.equal(resource.url);
    });

    it('displays the subjects list', function() {
      expect(ResourcePage.subjectsList).to.equal(resource.title.subjects.models.map((subjectObj) => subjectObj.subject).join('; '));
    });

    it('indicates that the resource is not yet selected', function() {
      expect(ResourcePage.isSelected).to.equal(false);
    });

    describe("selecting a package title to add to my holdings", function() {
      beforeEach(function() {
        /*
         * The expectations in the convergent `it` blocks
         * get run once every 10ms.  We were seeing test flakiness
         * when a toggle action dispatched and resolved before an
         * expectation had the chance to run.  We sidestep this by
         * temporarily increasing the mirage server's response time
         * to 50ms.
         * TODO: control timing directly with Mirage
         */
        this.server.timing = 50;
        return ResourcePage.toggleIsSelected();
      });

      afterEach(function() {
        this.server.timing = 0;
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

  describe("encountering a server error", function() {
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
