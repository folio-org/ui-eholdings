import { expect } from 'chai';
import { describe, beforeEach, it } from '@bigtest/mocha';

import { describeApplication } from './helpers';
import ResourcePage from './pages/resource-show';
import NavigationModal from './pages/navigation-modal';

describeApplication('ResourceShow', () => {
  let provider,
    providerPackage,
    resource;

  beforeEach(function () {
    provider = this.server.create('provider', {
      name: 'Cool Provider'
    });

    providerPackage = this.server.create('package', 'withTitles', {
      provider,
      name: 'Cool Package',
      contentType: 'E-Book',
      titleCount: 5
    });

    let title = this.server.create('title', {
      name: 'Best Title Ever',
      publicationType: 'Streaming Video',
      publisherName: 'Amazing Publisher'
    });

    title.identifiers = [
      this.server.create('identifier', { type: 'ISBN', subtype: 'Print', id: '978-0547928210' }),
      this.server.create('identifier', { type: 'ISBN', subtype: 'Print', id: '978-0547928203' }),
      this.server.create('identifier', { type: 'ISBN', subtype: 'Online', id: '978-0547928197' }),
      this.server.create('identifier', { type: 'ISBN', subtype: 'Empty', id: '978-0547928227' }),
      this.server.create('identifier', { type: 'Mid', subtype: 'someothersubtype', id: 'someothertypeofid' })
    ].map(m => m.toJSON());

    title.contributors = [
      this.server.create('contributor', { type: 'author', contributor: 'Writer, Sally' }),
      this.server.create('contributor', { type: 'author', contributor: 'Wordsmith, Jane' }),
      this.server.create('contributor', { type: 'illustrator', contributor: 'Artist, John' })
    ].map(m => m.toJSON());

    title.subjects = [
      this.server.create('subject', { type: 'TLI', subject: 'Writing' }),
      this.server.create('subject', { type: 'TLI', subject: 'Words' }),
    ].map(m => m.toJSON());

    title.save();

    resource = this.server.create('resource', {
      package: providerPackage,
      isSelected: false,
      title,
      url: 'https://frontside.io'
    });
  });

  describe('visiting the resource page', () => {
    beforeEach(function () {
      return this.visit(`/eholdings/resources/${resource.titleId}`, () => {
        expect(ResourcePage.$root).to.exist;
      });
    });

    it('displays the title name in the pane header', () => {
      expect(ResourcePage.paneTitle).to.equal('Best Title Ever');
    });

    it('displays the package name in the pane header', () => {
      expect(ResourcePage.paneSub).to.equal('Cool Package');
    });

    it('displays the title name', () => {
      expect(ResourcePage.titleName).to.equal('Best Title Ever');
    });

    it('displays the authors', () => {
      expect(ResourcePage.contributorsList(0).text).to.equal('AuthorsWriter, Sally; Wordsmith, Jane');
    });

    it('displays the illustrator', () => {
      expect(ResourcePage.contributorsList(1).text).to.equal('IllustratorArtist, John');
    });

    it('displays the publisher name', () => {
      expect(ResourcePage.publisherName).to.equal('Amazing Publisher');
    });

    it('displays the publication type', () => {
      expect(ResourcePage.publicationType).to.equal('Streaming Video');
    });

    it('does not group together identifiers of the same type, but not the same subtype', () => {
      expect(ResourcePage.identifiersList(1).text).to.equal('ISBN (Online)978-0547928197');
    });

    it('does not show a subtype for an identifier when none exists', () => {
      expect(ResourcePage.identifiersList(2).text).to.equal('ISBN978-0547928227');
    });

    it('does not show identifiers that are not ISSN or ISBN', () => {
      expect(ResourcePage.identifiersList().length).to.equal(3);
    });

    it('displays the subjects list', () => {
      expect(ResourcePage.subjectsList).to.equal('Writing; Words');
    });

    it('displays the package name', () => {
      expect(ResourcePage.packageName).to.equal('Cool Package');
    });

    it('displays the content type', () => {
      expect(ResourcePage.contentType).to.equal('E-Book');
    });

    it('displays the provider name', () => {
      expect(ResourcePage.providerName).to.equal('Cool Provider');
    });

    it('displays the managed url', () => {
      expect(ResourcePage.url).to.equal('https://frontside.io');
    });

    describe.skip('clicking the managed url opens link in new tab', () => {
      beforeEach(() => {
        ResourcePage.clickManagedURL();
      });

      it('opens in new tab', () => {
        expect(window.history.length).to.equal(1);
        expect(window.name.includes('ebscohost'));
      });
    });

    it('indicates that the resource is not yet selected', () => {
      expect(ResourcePage.isSelected).to.equal(false);
    });

    it.always('should not display the back button', () => {
      expect(ResourcePage.hasBackButton).to.be.false;
    });

    describe('toggling is selected with errors', () => {
      beforeEach(function () {
        this.server.put('/resources/:id', {
          errors: [{
            title: 'There was an error'
          }]
        }, 500);

        return ResourcePage.toggleIsSelected();
      });

      it('displays the correct error text', () => {
        expect(ResourcePage.toast.errorText).to.equal('There was an error');
      });

      it('only has one error', () => {
        expect(ResourcePage.toast.errorToastCount).to.equal(1);
        expect(ResourcePage.toast.totalToastCount).to.equal(1);
      });

      it('is positioned to the bottom', () => {
        expect(ResourcePage.toast.isPositionedBottom).to.be.true;
        expect(ResourcePage.toast.isPositionedTop).to.be.false;
      });
    });

    describe('toggling is selected with multiple errors', () => {
      beforeEach(function () {
        this.server.put('/resources/:id', {
          errors: [{
            title: 'There was an error'
          }, {
            title: 'There was another error!'
          }]
        }, 500);

        return ResourcePage.toggleIsSelected();
      });

      it('has two errors', () => {
        expect(ResourcePage.toast.errorToastCount).to.equal(2);
        expect(ResourcePage.toast.totalToastCount).to.equal(2);
      });
    });

    describe('navigating away when editing a field', () => {
      beforeEach(() => {
        return ResourcePage
          .toggleIsSelected()
          .addCoverage()
          .clickProvider();
      });

      it.always.skip('does not navigate away', function () {
        expect(this.app.history.location.pathname)
          .to.equal(`/eholdings/resources/${resource.titleId}`);
      });

      it('shows a navigation modal', () => {
        expect(NavigationModal.isVisible).to.be.true;
      });

      describe('when clicking continue', () => {
        beforeEach(() => {
          return NavigationModal.clickContinue();
        });

        it('closes the modal', () => {
          expect(NavigationModal.isPresent).to.be.false;
        });

        it('continues navigation', function () {
          expect(this.app.history.location.pathname)
            .to.equal(`/eholdings/providers/${resource.packageId}`);
        });
      });

      describe('when clicking dismiss', () => {
        beforeEach(() => {
          return NavigationModal.clickDismiss();
        });

        it('closes the modal', () => {
          expect(NavigationModal.isPresent).to.be.false;
        });

        it.always.skip('does not navigation away', function () {
          expect(this.app.history.location.pathname)
            .to.equal(`/eholdings/resources/${resource.titleId}`);
        });
      });
    });
  });

  describe('navigating to resource page', () => {
    beforeEach(function () {
      return this.visit({
        pathname: `/eholdings/resources/${resource.id}`,
        // our internal link component automatically sets the location state
        state: { eholdings: true }
      }, () => {
        expect(ResourcePage.$root).to.exist;
      });
    });

    it('should display the back button in UI', () => {
      expect(ResourcePage.hasBackButton).to.be.true;
    });
  });

  describe('visiting the resource page with some attributes undefined', () => {
    beforeEach(function () {
      providerPackage = this.server.create('package', 'withTitles', {
        provider,
        name: 'Cool Package',
        contentType: '',
        titleCount: 5
      });

      let title = this.server.create('title', {
        name: 'Best Title Ever',
        publicationType: ''
      });

      resource = this.server.create('resource', {
        package: providerPackage,
        isSelected: false,
        title
      });

      return this.visit(`/eholdings/resources/${resource.id}`, () => {
        expect(ResourcePage.$root).to.exist;
      });
    });

    it('displays the title name', () => {
      expect(ResourcePage.titleName).to.equal('Best Title Ever');
    });

    it.always('does not display a content type', () => {
      expect(ResourcePage.hasContentType).to.be.false;
    });

    it.always('does not display a publication type', () => {
      expect(ResourcePage.hasPublicationType).to.be.false;
    });
  });

  describe('visiting the resource page with unknown attribute values', () => {
    beforeEach(function () {
      providerPackage = this.server.create('package', 'withTitles', {
        provider,
        name: 'Cool Package',
        contentType: 'Isolinear Chip',
        titleCount: 5
      });

      let title = this.server.create('title', {
        name: 'Best Title Ever',
        publicationType: 'UnknownPublicationType'
      });

      resource = this.server.create('resource', {
        package: providerPackage,
        isSelected: false,
        title
      });

      return this.visit(`/eholdings/resources/${resource.id}`, () => {
        expect(ResourcePage.$root).to.exist;
      });
    });

    it('displays the title name', () => {
      expect(ResourcePage.titleName).to.equal('Best Title Ever');
    });

    it('displays a content type', () => {
      expect(ResourcePage.contentType).to.equal('Isolinear Chip');
    });

    it('displays the publication type without modification', () => {
      expect(ResourcePage.publicationType).to.equal('UnknownPublicationType');
    });
  });

  describe('encountering a server error', () => {
    beforeEach(function () {
      this.server.get('/resources/:id', {
        errors: [{
          title: 'There was an error'
        }]
      }, 500);

      return this.visit(`/eholdings/resources/${resource.id}`, () => {
        expect(ResourcePage.$root).to.exist;
      });
    });

    it('displays the correct error text', () => {
      expect(ResourcePage.toast.errorText).to.equal('There was an error');
    });

    it('only has one error', () => {
      expect(ResourcePage.toast.errorToastCount).to.equal(1);
      expect(ResourcePage.toast.totalToastCount).to.equal(1);
    });

    it('is positioned to the bottom', () => {
      expect(ResourcePage.toast.isPositionedBottom).to.be.true;
      expect(ResourcePage.toast.isPositionedTop).to.be.false;
    });

    it('dies with dignity', () => {
      expect(ResourcePage.hasErrors).to.be.true;
    });
  });
});
