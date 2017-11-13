/* global describe, beforeEach, afterEach */
import { expect } from 'chai';
import it from './it-will';

import { describeApplication } from './helpers';
import ResourcePage from './pages/customer-resource-show';

describeApplication('CustomerResourceShow', () => {
  let vendor,
    vendorPackage,
    resource;

  beforeEach(function () {
    vendor = this.server.create('vendor', {
      name: 'Cool Vendor'
    });

    vendorPackage = this.server.create('package', 'withTitles', {
      vendor,
      packageName: 'Cool Package',
      contentType: 'ebook',
      titleCount: 5
    });

    let title = this.server.create('title', {
      package: vendorPackage,
      pubType: 'StreamingVideo',
    });

    title.identifiers = [
      this.server.create('identifier', { type: 1, subtype: 1, id: '978-0547928210' }),
      this.server.create('identifier', { type: 1, subtype: 1, id: '978-0547928203' }),
      this.server.create('identifier', { type: 1, subtype: 2, id: '978-0547928197' }),
      this.server.create('identifier', { type: 1, subtype: 0, id: '978-0547928227' }),
      this.server.create('identifier', { type: 8, subtype: 49, id: 'someothertypeofid' })
    ];
    title.contributors = [
      this.server.create('contributor', { type: 'author', contributor: 'Writer, Sally' }),
      this.server.create('contributor', { type: 'author', contributor: 'Wordsmith, Jane' }),
      this.server.create('contributor', { type: 'illustrator', contributor: 'Artist, John' })
    ];
    title.save();

    resource = this.server.create('customer-resource', {
      package: vendorPackage,
      isSelected: false,
      title
    });
  });

  describe('visiting the customer resource page', () => {
    beforeEach(function () {
      return this.visit(`/eholdings/vendors/${vendor.id}/packages/${vendorPackage.id}/titles/${resource.titleId}`, () => {
        expect(ResourcePage.$root).to.exist;
      });
    });

    it('displays the title name', () => {
      expect(ResourcePage.titleName).to.equal(resource.title.titleName);
    });

    it('displays the authors', () => {
      expect(ResourcePage.contributorsList[0]).to.equal('AuthorsWriter, Sally; Wordsmith, Jane');
    });

    it('displays the illustrator', () => {
      expect(ResourcePage.contributorsList[1]).to.equal('IllustratorArtist, John');
    });

    it('displays the publisher name', () => {
      expect(ResourcePage.publisherName).to.equal(resource.title.publisherName);
    });

    it('displays the publication type', () => {
      expect(ResourcePage.publicationType).to.equal('Streaming Video');
    });

    it('does not group together identifiers of the same type, but not the same subtype', () => {
      expect(ResourcePage.identifiersList[1]).to.equal('ISBN (Online)978-0547928197');
    });

    it('does not show a subtype for an identifier when none exists', () => {
      expect(ResourcePage.identifiersList[2]).to.equal('ISBN978-0547928227');
    });

    it('does not show identifiers that are not ISSN or ISBN', () => {
      expect(ResourcePage.identifiersList.length).to.equal(3);
    });

    it('displays the subjects list', () => {
      expect(ResourcePage.subjectsList).to.equal(resource.title.subjects.models.map(subjectObj => subjectObj.subject).join('; '));
    });

    it('displays the package name', () => {
      expect(ResourcePage.packageName).to.equal(resource.package.packageName);
    });

    it('displays the content type', () => {
      expect(ResourcePage.contentType).to.equal('E-Book');
    });

    it('displays the vendor name', () => {
      expect(ResourcePage.vendorName).to.equal(resource.package.vendor.name);
    });

    it('displays the managed url', () => {
      expect(ResourcePage.managedUrl).to.equal(resource.url);
    });

    it('indicates that the resource is not yet selected', () => {
      expect(ResourcePage.isSelected).to.equal(false);
    });

    describe('successfully selecting a package title to add to my holdings', () => {
      beforeEach(function () {
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

      afterEach(function () {
        this.server.timing = 0;
      });

      it('reflects the desired state (Selected)', () => {
        expect(ResourcePage.isSelected).to.equal(true);
      });

      it('indicates it working to get to desired state', () => {
        expect(ResourcePage.isSelecting).to.equal(true);
      });

      it('cannot be interacted with while the request is in flight', () => {
        expect(ResourcePage.isSelectedToggleable).to.equal(false);
      });

      describe('when the request succeeds', () => {
        it('reflect the desired state was set', () => {
          expect(ResourcePage.isSelected).to.equal(true);
        });

        it('indicates it is no longer working', () => {
          expect(ResourcePage.isSelecting).to.equal(false);
        });
      });
    });

    describe('unsuccessfully selecting a package title to add to my holdings', () => {
      beforeEach(function () {
        this.server.put('/vendors/:vendorId/packages/:packageId/titles/:titleId', [{
          message: 'There was an error',
          code: '1000',
          subcode: 0
        }], 500);

        this.server.timing = 50;
        return ResourcePage.toggleIsSelected();
      });

      afterEach(function () {
        this.server.timing = 0;
      });

      it('reflects the desired state (Selected)', () => {
        expect(ResourcePage.isSelected).to.equal(true);
      });

      it('indicates it working to get to desired state', () => {
        expect(ResourcePage.isSelecting).to.equal(true);
      });

      it('cannot be interacted with while the request is in flight', () => {
        expect(ResourcePage.isSelectedToggleable).to.equal(false);
      });

      describe('when the request succeeds', () => {
        it('reflect the desired state was set', () => {
          expect(ResourcePage.isSelected).to.equal(false);
        });

        it('indicates it is no longer working', () => {
          expect(ResourcePage.isSelecting).to.equal(false);
        });

        it.skip('logs an Error somewhere', () => {
          expect(ResourcePage.flashError).to.match(/unable to select/i);
        });
      });
    });
  });

  describe('visiting the customer resource page with some attributes undefined', () => {
    beforeEach(function () {
      vendorPackage = this.server.create('package', 'withTitles', {
        vendor,
        packageName: 'Cool Package',
        contentType: '',
        titleCount: 5
      });

      let title = this.server.create('title', {
        package: vendorPackage,
        pubType: ''
      });

      resource = this.server.create('customer-resource', {
        package: vendorPackage,
        isSelected: false,
        title
      });

      return this.visit(`/eholdings/vendors/${vendor.id}/packages/${vendorPackage.id}/titles/${resource.titleId}`, () => {
        expect(ResourcePage.$root).to.exist;
      });
    });

    it('displays the title name', () => {
      expect(ResourcePage.titleName).to.equal(resource.title.titleName);
    });

    it('does not display a content type', () => {
      expect(ResourcePage.contentType).to.equal('');
    });

    it('does not display a publication type', () => {
      expect(ResourcePage.publicationType).to.equal('');
    });
  });

  describe('visiting the customer resource page with unknown attribute values', () => {
    beforeEach(function () {
      vendorPackage = this.server.create('package', 'withTitles', {
        vendor,
        packageName: 'Cool Package',
        contentType: 'Isolinear Chip',
        titleCount: 5
      });

      let title = this.server.create('title', {
        package: vendorPackage,
        pubType: 'UnknownPublicationType'
      });

      resource = this.server.create('customer-resource', {
        package: vendorPackage,
        isSelected: false,
        title
      });

      return this.visit(`/eholdings/vendors/${vendor.id}/packages/${vendorPackage.id}/titles/${resource.titleId}`, () => {
        expect(ResourcePage.$root).to.exist;
      });
    });

    it('displays the title name', () => {
      expect(ResourcePage.titleName).to.equal(resource.title.titleName);
    });

    it('does not display a content type', () => {
      expect(ResourcePage.contentType).to.equal('Isolinear Chip');
    });

    it('displays the publication type without modification', () => {
      expect(ResourcePage.publicationType).to.equal('UnknownPublicationType');
    });
  });

  describe('encountering a server error', () => {
    beforeEach(function () {
      this.server.get('/vendors/:vendorId/packages/:packageId/titles/:titleId', [{
        message: 'There was an error',
        code: '1000',
        subcode: 0
      }], 500);

      return this.visit(`/eholdings/vendors/${vendor.id}/packages/${vendorPackage.id}/titles/${resource.titleId}`, () => {
        expect(ResourcePage.$root).to.exist;
      });
    });

    it('dies with dignity', () => {
      expect(ResourcePage.hasErrors).to.be.true;
    });
  });
});
