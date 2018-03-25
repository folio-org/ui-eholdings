import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { describeApplication } from './helpers';
import PackageShowPage from './pages/package-show';

describeApplication('PackageShow', () => {
  let provider,
    providerPackage,
    customerResources;

  beforeEach(function () {
    provider = this.server.create('provider', {
      name: 'Cool Provider'
    });

    providerPackage = this.server.create('package', 'withTitles', 'withCustomCoverage', {
      provider,
      name: 'Cool Package',
      contentType: 'E-Book',
      isSelected: false,
      titleCount: 5
    });

    customerResources = this.server.schema.where('customer-resource', { packageId: providerPackage.id }).models;
  });

  describe('visiting the package details page', () => {
    beforeEach(function () {
      return this.visit(`/eholdings/packages/${providerPackage.id}`, () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    it('displays the package name in the pane header', () => {
      expect(PackageShowPage.paneTitle).to.equal('Cool Package');
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
      expect(PackageShowPage.numTitlesSelected).to.equal(`${providerPackage.selectedCount}`);
    });

    it('displays a list of titles', () => {
      expect(PackageShowPage.titleList().length).to.equal(5);
    });

    it('displays name of a title in the title list', () => {
      expect(PackageShowPage.titleList(0).name).to.equal(customerResources[0].title.name);
    });

    it('displays whether the first title is selected', () => {
      expect(PackageShowPage.titleList(0).isSelectedLabel).to.equal((customerResources[0].isSelected ? 'Selected' : 'Not selected'));
    });

    it.always('should not display a back button', () => {
      expect(PackageShowPage.hasBackButton).to.be.false;
    });

    describe('then visiting another package details page', () => {
      beforeEach(function () {
        let otherPackage = this.server.create('package', 'withTitles', {
          provider,
          name: 'Other Package',
          titleCount: 2
        });

        // converge on the previous package loading first
        return PackageShowPage.interaction
          .once(() => PackageShowPage.titleList().length > 0)
          .do(() => {
            return this.visit(`/eholdings/packages/${otherPackage.id}`, () => {
              expect(PackageShowPage.$root).to.exist;
            });
          });
      });

      it('displays the different package', () => {
        expect(PackageShowPage.name).to.equal('Other Package');
      });

      it('displays different titles', () => {
        expect(PackageShowPage.numTitles).to.equal('2');
        expect(PackageShowPage.titleList(0).name).to.not.equal(customerResources[0].title.name);
      });
    });
  });

  describe('visiting the package details page with multiple pages of titles', () => {
    beforeEach(function () {
      this.server.loadFixtures();

      return this.visit('/eholdings/packages/paged_pkg', () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    it('should display the first page of related titles', () => {
      expect(PackageShowPage.titleList(0).name).to.equal('Package Title 1');
    });

    describe.skip('scrolling down the list of titles', () => {
      beforeEach(() => {
        return PackageShowPage.interaction
          .once(() => PackageShowPage.titleList().length > 0)
          .scrollToTitleOffset(26);
      });

      it('should display the next page of related titles', () => {
        // when the list is scrolled, it has a threshold of 5 items. index 4,
        // the 5th item, is the topmost visible item in the list
        expect(PackageShowPage.titleList(4).name).to.equal('Package Title 26');
      });
    });
  });

  describe('visiting the package details page for a large package', () => {
    beforeEach(function () {
      providerPackage.selectedCount = 9000;
      providerPackage.titleCount = 10000;

      return this.visit(`/eholdings/packages/${providerPackage.id}`, () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    describe('viewing large packages', () => {
      it('correctly formats the number for selected title count', () => {
        expect(PackageShowPage.numTitlesSelected).to.equal('9,000');
      });

      it('correctly formats the number for total title count', () => {
        expect(PackageShowPage.numTitles).to.equal('10,000');
      });
    });
  });

  describe('navigating to package show page', () => {
    beforeEach(function () {
      return this.visit({
        pathname: `/eholdings/packages/${providerPackage.id}`,
        // our internal link component automatically sets the location state
        state: { eholdings: true }
      }, () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    it('should display the back button in UI', () => {
      expect(PackageShowPage.hasBackButton).to.be.true;
    });
  });


  describe('encountering a server error', () => {
    beforeEach(function () {
      this.server.get('/packages/:packageId', {
        errors: [{
          title: 'There was an error'
        }]
      }, 500);

      return this.visit(`/eholdings/packages/${providerPackage.id}`, () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    it('dies with dignity', () => {
      expect(PackageShowPage.hasErrors).to.be.true;
    });
  });
});
