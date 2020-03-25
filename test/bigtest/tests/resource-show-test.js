import { expect } from 'chai';
import { describe, beforeEach, it } from '@bigtest/mocha';

import setupApplication from '../helpers/setup-application';
import ResourcePage from '../interactors/resource-show';
import PackageEditPage from '../interactors/package-edit';
import { entityAuthorityTypes } from '../../../src/constants';

describe('ResourceShow', () => {
  setupApplication();
  let provider;
  let providerPackage;
  let resource;
  let accessType;

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

    const packageProxy = this.server.create('proxy', {
      inherited: true,
      id: 'microstates'
    });

    providerPackage.update('proxy', packageProxy.toJSON());
    providerPackage.save();

    const title = this.server.create('title', {
      name: 'Best Title Ever',
      edition: 'Best Edition',
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

    accessType = this.server.create('access-type', {
      id: '1',
      name: 'Trial'
    });

    accessType.save();

    resource = this.server.create('resource', {
      package: providerPackage,
      isSelected: false,
      title,
      url: 'https://frontside.io',
      isTokenNeeded: false
    });

    const proxy = this.server.create('proxy', {
      inherited: true,
      id: 'microstates'
    });
    resource.update('proxy', proxy.toJSON());
    resource.save();
  });

  describe('visiting the resource page', () => {
    beforeEach(function () {
      this.visit(`/eholdings/resources/${resource.titleId}`);
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

    it('displays the collapse all button', () => {
      expect(ResourcePage.hasCollapseAllButton).to.be.true;
    });

    it('displays the edition', () => {
      expect(ResourcePage.edition).to.equal('Best Edition');
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

    it('does not displays custom labels accordion', () => {
      expect(ResourcePage.customLabelsAccordion.isPresent).to.be.false;
    });

    describe('agreements section', () => {
      it('should display open accordion by default', () => {
        expect(ResourcePage.agreementsSection.isExpanded).to.be.true;
      });

      describe('when open', () => {
        it('should display "New" button', () => {
          expect(ResourcePage.agreementsSection.hasNewButton).to.be.true;
        });

        describe('after click on "New" button', () => {
          beforeEach(async () => {
            await ResourcePage.agreementsSection.clickNewButton();
          });

          it('should redirect to create page of agreements app', function () {
            const agreementCreatePageUrl = `/erm/agreements/create?authority=${entityAuthorityTypes.RESOURCE}&referenceId=${resource.id}`;

            expect(this.location.pathname + this.location.search).to.contain(agreementCreatePageUrl);
          });
        });

        it('should not display badge with agreements quantity', () => {
          expect(ResourcePage.agreementsSection.hasBadge).to.be.false;
        });

        it('should display a 3 items in the list of agreements', () => {
          expect(ResourcePage.agreementsSection.agreements().length).to.equal(3);
        });

        describe('after click on first agreement', () => {
          beforeEach(async () => {
            await ResourcePage.agreementsSection.agreements(0).click();
          });

          it('should redirect to agreement details page', function () {
            const itemDetailsUrl = '/erm/agreements/2c918098689ba8f70168a349f1160027';

            expect(this.location.pathname).to.contain(itemDetailsUrl);
          });
        });
      });

      describe('when closed', () => {
        beforeEach(async () => {
          await ResourcePage.agreementsSection.clickSection();
        });

        it('should display badge with agreements quantity equal to 3', () => {
          expect(ResourcePage.agreementsSection.agreementsQuantity).to.equal('3');
        });
      });
    });

    describe('when token is not needed', () => {
      it('should not display "Add token" button', () => {
        expect(ResourcePage.hasAddTokenButton).to.be.false;
      });
    });

    describe('when resource is not selected', () => {
      it('should not display tags accordion', () => {
        expect(ResourcePage.isTagsPresent).to.be.false;
      });
    });

    describe('when resource is selected', () => {
      beforeEach(() => {
        resource.update('isSelected', true);
      });

      it('should display tags accordion', () => {
        expect(ResourcePage.isTagsPresent).to.be.true;
      });
    });

    describe('when token is needed', () => {
      beforeEach(() => {
        resource.update('isTokenNeeded', true);
      });

      it('should display "Add token" button', () => {
        expect(ResourcePage.hasAddTokenButton).to.be.true;
      });

      describe('clicking on "Add token" button', () => {
        beforeEach(async () => {
          await ResourcePage.clickAddTokenButton();
        });

        it('should redirect to package edit page', () => {
          expect(PackageEditPage.$root).to.exist;
        });
      });
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

    it('displays the external link icon', () => {
      expect(ResourcePage.isExternalLinkIconPresent).to.be.true;
    });

    it('displays the proxy', () => {
      expect(ResourcePage.proxy).to.include('Inherited');
      expect(ResourcePage.proxy).to.include(`${resource.proxy.id}`);
    });

    describe('clicking the collapse all button', () => {
      beforeEach(() => {
        return ResourcePage.clickCollapseAllButton();
      });

      it('toggles the button text to expand all', () => {
        expect(ResourcePage.collapseAllButtonText).to.equal('Expand all');
      });
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
      expect(ResourcePage.isResourceSelected).to.equal('Not selected');
    });

    it('should display the back (close) button', () => {
      expect(ResourcePage.hasBackButton).to.be.true;
    });

    describe('toggling is selected successfully', () => {
      beforeEach(() => {
        return ResourcePage.clickAddToHoldingsButton();
      });

      describe('and clicking Back button', () => {
        beforeEach(() => {
          return ResourcePage.clickBackButton();
        });

        it('should not return to same page', function () {
          expect(this.location.pathname).to.not.equal(`/eholdings/resources/${resource.id}`);
        });
      });
    });

    describe('toggling is selected with errors', () => {
      beforeEach(function () {
        this.server.put('/resources/:id', {
          errors: [{
            title: 'There was an error'
          }]
        }, 500);

        return ResourcePage.clickAddToHoldingsButton();
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

        return ResourcePage.clickAddToHoldingsButton();
      });

      it('has two errors', () => {
        expect(ResourcePage.toast.errorToastCount).to.equal(2);
        expect(ResourcePage.toast.totalToastCount).to.equal(2);
      });
    });
  });

  describe('navigating to resource page', () => {
    beforeEach(function () {
      this.visit({
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

      const title = this.server.create('title', {
        name: 'Best Title Ever',
        edition: 'Best Edition Ever',
        publicationType: ''
      });

      resource = this.server.create('resource', {
        package: providerPackage,
        isSelected: false,
        title
      });

      this.visit(`/eholdings/resources/${resource.id}`);
    });

    it('displays the title name', () => {
      expect(ResourcePage.titleName).to.equal('Best Title Ever');
    });

    it('displays the edition', () => {
      expect(ResourcePage.edition).to.equal('Best Edition Ever');
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

      const title = this.server.create('title', {
        name: 'Best Title Ever',
        publicationType: 'UnknownPublicationType'
      });

      resource = this.server.create('resource', {
        package: providerPackage,
        isSelected: false,
        title
      });

      this.visit(`/eholdings/resources/${resource.id}`);
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

  describe('visiting the resource page with custom labels', () => {
    beforeEach(function () {
      providerPackage = this.server.create('package', 'withTitles', {
        provider,
        name: 'Cool Package',
        contentType: '',
        titleCount: 5,
      });

      const title = this.server.create('title', {
        name: 'Best Title Ever',
        edition: 'Best Edition Ever',
        publicationType: '',
      });

      resource = this.server.create('resource', 'withTitleCustom', {
        package: providerPackage,
        title,
      });

      this.visit(`/eholdings/resources/${resource.id}`);
    });

    it('displays custom labels accordion', () => {
      expect(ResourcePage.customLabelsAccordion.isPresent).to.be.true;
    });

    it('custom labels accordion is open', () => {
      expect(ResourcePage.customLabelsAccordion.isOpen).to.be.true;
    });

    it('custom labels length', () => {
      expect(ResourcePage.customLabels().length).to.be.equal(4);
    });

    it('displays correct labels', () => {
      expect(ResourcePage.customLabels(0).label).to.be.equal('test label');
      expect(ResourcePage.customLabels(1).label).to.be.equal('some label');
      expect(ResourcePage.customLabels(2).label).to.be.equal('different label');
      expect(ResourcePage.customLabels(3).label).to.be.equal('another one');
    });

    it('last custom label without value', () => {
      expect(ResourcePage.customLabels(3).value).to.be.equal('-');
    });
  });

  describe('visiting the resource page without access types', () => {
    beforeEach(function () {
      this.server.get('/access-types', () => []);

      providerPackage = this.server.create('package', 'withTitles', {
        provider,
        name: 'Cool Package',
        contentType: '',
        titleCount: 5,
      });

      const title = this.server.create('title', {
        name: 'Best Title Ever',
        edition: 'Best Edition Ever',
        publicationType: '',
      });

      resource = this.server.create('resource', 'withTitleCustom', {
        package: providerPackage,
        title,
        accessType,
      });

      this.visit(`/eholdings/resources/${resource.id}`);
    });

    it('should not render Access status type section', () => {
      expect(ResourcePage.isAccessTypeSectionPresent).to.be.false;
    });
  });

  describe('visiting the resource page with access types', () => {
    let title;

    beforeEach(function () {
      providerPackage = this.server.create('package', 'withTitles', {
        provider,
        name: 'Cool Package',
        contentType: '',
        titleCount: 5,
      });

      title = this.server.create('title', {
        name: 'Best Title Ever',
        edition: 'Best Edition Ever',
        publicationType: '',
      });
    });

    describe('when resource has access status type unassigned', () => {
      beforeEach(function () {
        resource = this.server.create('resource', 'withTitleCustom', {
          package: providerPackage,
          title,
        });

        this.visit(`/eholdings/resources/${resource.id}`);
      });

      it('should display the access type dash', () => {
        expect(ResourcePage.accessType).to.equal('-');
      });
    });

    describe('when resource has access status type assigned', () => {
      beforeEach(function () {
        resource = this.server.create('resource', 'withTitleCustom', {
          package: providerPackage,
          title,
          accessType,
        });

        this.visit(`/eholdings/resources/${resource.id}`);
      });

      it('displays the access type name', () => {
        expect(ResourcePage.accessType).to.equal('Trial');
      });
    });
  });

  describe('custom labels with a server error', () => {
    beforeEach(function () {
      providerPackage = this.server.create('package', 'withTitles', {
        provider,
        name: 'Cool Package',
        contentType: '',
        titleCount: 5,
      });

      const title = this.server.create('title', {
        name: 'Best Title Ever',
        edition: 'Best Edition Ever',
        publicationType: '',
      });

      resource = this.server.create('resource', 'withTitleCustom', {
        package: providerPackage,
        title,
      });

      this.server.get('/custom-labels', {
        errors: [{
          title: 'There was an error',
        }]
      }, 500);

      this.visit(`/eholdings/resources/${resource.id}`);
    });

    it.skip('displays the correct error text', () => {
      expect(ResourcePage.toast.errorText).to.equal('There was an error');
    });

    it('sould not display custom labels accordion', () => {
      expect(ResourcePage.customLabelsAccordion.isPresent).to.be.false;
    });
  });

  describe('encountering a server error', () => {
    beforeEach(function () {
      this.server.get('/resources/:id', {
        errors: [{
          title: 'There was an error'
        }]
      }, 500);

      this.visit(`/eholdings/resources/${resource.id}`);
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
