import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import PackageShowPage from '../interactors/package-show';
import PackageEditPage from '../interactors/package-edit';
import { entityAuthorityTypes } from '../../../src/constants';

describe('PackageShow', () => {
  setupApplication();
  let provider;
  let providerPackage;
  let resources;
  let accessType;

  beforeEach(function () {
    provider = this.server.create('provider', {
      name: 'Cool Provider'
    });

    providerPackage = this.server.create('package', 'withTitles', 'withCustomCoverage', 'withProxy', {
      provider,
      name: 'Cool Package',
      contentType: 'E-Book',
      isSelected: false,
      titleCount: 5,
      packageType: 'Complete',
    });

    resources = this.server.schema.where('resource', { packageId: providerPackage.id }).models;

    accessType = this.server.create('access-type', {
      name: 'Trial',
    });
  });

  describe('visiting the package details page', () => {
    beforeEach(function () {
      this.visit(`/eholdings/packages/${providerPackage.id}`);
    });

    it('displays the package name in the pane header', () => {
      expect(PackageShowPage.paneTitle).to.equal('Cool Package');
    });

    it('does not display tags accordion', () => {
      expect(PackageShowPage.isTagsPresent).to.equal(false);
    });

    it('displays package name', () => {
      expect(PackageShowPage.name).to.equal('Cool Package');
    });

    it.skip('focuses on the package name', () => {
      expect(PackageShowPage.nameHasFocus).to.be.true;
    });

    it('displays the collapse all button', () => {
      expect(PackageShowPage.hasCollapseAllButton).to.be.true;
    });

    it('displays whether or not the package is selected', () => {
      expect(PackageShowPage.selectionStatus.isSelected).to.equal(false);
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

    it('displays the package type', () => {
      expect(PackageShowPage.packageType).to.equal('Complete');
    });

    it('displays a list of titles', () => {
      expect(PackageShowPage.titleList().length).to.equal(5);
    });

    it('displays name of a title in the title list', () => {
      expect(PackageShowPage.titleList(0).name).to.equal(resources[0].title.name);
    });

    it('displays whether the first title is selected', () => {
      expect(PackageShowPage.titleList(0).isSelectedLabel).to.equal((resources[0].isSelected ? 'Selected' : 'Not selected'));
    });

    it('should display a back (close) button', () => {
      expect(PackageShowPage.hasBackButton).to.be.true;
    });

    describe('when there is no access status types configured', () => {
      beforeEach(function () {
        this.server.get('/access-types', () => []);
        this.visit(`/eholdings/packages/${providerPackage.id}`);
      });

      it('should not render access status type section', () => {
        expect(PackageShowPage.isAccessTypeSectionPresent).to.be.false;
      });
    });

    describe('when there are access status types configured', () => {
      beforeEach(async function () {
        providerPackage.update('isSelected', true);
        this.visit(`/eholdings/packages/${providerPackage.id}`);
      });

      describe('and package has access status type unassigned', () => {
        it('should display the access type dash', () => {
          expect(PackageShowPage.accessType).to.equal('-');
        });
      });

      describe('and package has access status type assigned', () => {
        beforeEach(function () {
          const testPackage = this.server.create('package', 'withTitles', 'withProvider', {
            accessType,
          });
          providerPackage.save();
          this.visit(`/eholdings/packages/${testPackage.id}`);
        });

        it('displays the access type name', () => {
          expect(PackageShowPage.accessType).to.equal('Trial');
        });
      });
    });

    describe('agreements section', () => {
      it('should display open accordion by default', () => {
        expect(PackageShowPage.agreementsSection.isExpanded).to.be.true;
      });

      describe('when open', () => {
        it('should display "New" button', () => {
          expect(PackageShowPage.agreementsSection.hasNewButton).to.be.true;
        });

        describe('after click on "New" button', () => {
          beforeEach(async () => {
            await PackageShowPage.agreementsSection.clickNewButton();
          });

          it('should redirect to create page of agreements app', function () {
            const agreementCreatePageUrl = `/erm/agreements/create?authority=${entityAuthorityTypes.PACKAGE}&referenceId=${providerPackage.id}`;

            expect(this.location.pathname + this.location.search).to.contain(agreementCreatePageUrl);
          });
        });

        it('should not display badge with agreements quantity', () => {
          expect(PackageShowPage.agreementsSection.hasBadge).to.be.false;
        });

        it('should display a 3 items in the list of agreements', () => {
          expect(PackageShowPage.agreementsSection.agreements().length).to.equal(3);
        });

        describe('after click on first agreement', () => {
          beforeEach(async () => {
            await PackageShowPage.agreementsSection.agreements(0).click();
          });

          it('should redirect to agreement details page', function () {
            const itemDetailsUrl = '/erm/agreements/2c918098689ba8f70168a349f1160027';

            expect(this.location.pathname).to.contain(itemDetailsUrl);
          });
        });
      });

      describe('when closed', () => {
        beforeEach(async () => {
          await PackageShowPage.agreementsSection.clickSection();
        });

        it('should display badge with agreements quantity equal to 3', () => {
          expect(PackageShowPage.agreementsSection.agreementsQuantity).to.equal('3');
        });
      });
    });

    describe('clicking the collapse all button', () => {
      beforeEach(() => {
        return PackageShowPage.clickCollapseAllButton();
      });

      it('toggles the button text to expand all', () => {
        expect(PackageShowPage.collapseAllButtonText).to.equal('Expand all');
      });
    });

    describe('then visiting another package details page', () => {
      beforeEach(function () {
        const otherPackage = this.server.create('package', 'withTitles', {
          provider,
          name: 'Other Package',
          titleCount: 2
        });

        this.visit(`/eholdings/packages/${otherPackage.id}`);
      });

      it('displays the different package', () => {
        expect(PackageShowPage.name).to.equal('Other Package');
      });

      it('displays different titles', () => {
        expect(PackageShowPage.numTitles).to.equal('2');
        expect(PackageShowPage.titleList(0).name).to.not.equal(resources[0].title.name);
      });
    });
  });

  describe('viewing a partially selected package', () => {
    let pkg;

    beforeEach(function () {
      pkg = this.server.create('package', {
        provider,
        name: 'Partial Package',
        selectedCount: 5,
        titleCount: 10
      });
      this.server.createList('resource', 5, 'withTitle', {
        package: pkg,
        isSelected: true
      });
      this.server.createList('resource', 5, 'withTitle', {
        package: pkg,
        isSelected: false
      });
      this.visit(`/eholdings/packages/${pkg.id}`);
    });

    it('shows the selected # of titles and the total # of titles in the package', () => {
      expect(PackageShowPage.selectionStatus.text).to.equal('5 of 10 titles selected');
    });

    it('has a button to add all of the remaining titles by selecting the entire package directly in the detail record', () => {
      expect(PackageShowPage.selectionStatus.buttonText).to.equal('Add all to holdings');
    });

    it('does not display tags accordion', () => {
      expect(PackageShowPage.isTagsPresent).to.equal(false);
    });

    describe('inspecting the menu', () => {
      beforeEach(() => {
        return PackageShowPage.actionsDropDown.clickDropDownButton();
      });

      it('has menu item to add all remaining titles from this packages', () => {
        expect(PackageShowPage.dropDownMenu.addToHoldings.text).to.equal('Add all to holdings');
      });

      it('has menu item to remove the entire package from holdings just like a completely selected packages', () => {
        expect(PackageShowPage.dropDownMenu.removeFromHoldings.isPresent).to.equal(true);
      });
    });
  });

  describe('viewing a managed package details page', () => {
    beforeEach(function () {
      providerPackage.isSelected = true;
      this.visit(`/eholdings/packages/${providerPackage.id}`);
    });

    it('display tags accordion', () => {
      expect(PackageShowPage.isTagsPresent).to.equal(true);
    });

    it('displays the package type as complete', () => {
      expect(PackageShowPage.packageType).to.equal('Complete');
    });

    it('has package proxy details', () => {
      expect(PackageShowPage.hasProxy).to.be.true;
    });

    it('displays package proxy value', () => {
      expect(PackageShowPage.proxyValue).to.equal('microstates');
    });

    describe('when clicking Edit button', () => {
      beforeEach(async () => {
        await PackageShowPage.clickEditButton();
      });

      it('displays Package Edit page', function () {
        expect(this.location.pathname).to.equal(`/eholdings/packages/${providerPackage.id}/edit`);
      });
    });
  });

  describe('viewing a custom package details page', () => {
    beforeEach(function () {
      providerPackage.isCustom = true;
      providerPackage.packageType = 'Custom';
      providerPackage.isSelected = true;
      this.visit(`/eholdings/packages/${providerPackage.id}`);
    });

    it('display tags accordion', () => {
      expect(PackageShowPage.isTagsPresent).to.equal(true);
    });

    it('displays the package type as custom', () => {
      expect(PackageShowPage.packageType).to.equal('Custom');
    });

    it('has package proxy details', () => {
      expect(PackageShowPage.hasProxy).to.be.true;
    });

    it('displays package proxy value', () => {
      expect(PackageShowPage.proxyValue).to.equal('microstates');
    });
  });

  describe('visiting a managed package details page with an inherited proxy', () => {
    beforeEach(function () {
      provider = this.server.create('provider', 'withInheritedProxy', {
        name: 'Cool Provider'
      });

      providerPackage = this.server.create('package', 'withTitles', 'withCustomCoverage', 'withInheritedProxy', {
        provider,
        name: 'Cool Package',
        contentType: 'E-Book',
        isSelected: true,
        titleCount: 5,
        packageType: 'Complete'
      });
      this.visit(`/eholdings/packages/${providerPackage.id}`);
    });

    it('displays the proxy prepended with Inherited', () => {
      expect(PackageShowPage.hasProxy).to.be.true;
      expect(PackageShowPage.proxyValue).to.include('Inherited');
      expect(PackageShowPage.proxyValue).to.include(`${providerPackage.proxy.id}`);
    });
  });

  describe('visiting a custom package details page with an inherited proxy', () => {
    beforeEach(function () {
      provider = this.server.create('provider', 'withInheritedProxy', {
        name: 'Cool Provider'
      });

      providerPackage = this.server.create('package', 'withTitles', 'withCustomCoverage', 'withInheritedProxy', {
        provider,
        name: 'Cool Package',
        contentType: 'E-Book',
        isSelected: true,
        titleCount: 5,
        packageType: 'Custom',
        isCustom: true
      });

      this.visit(`/eholdings/packages/${providerPackage.id}`);
    });

    it('displays the package type as custom', () => {
      expect(PackageShowPage.packageType).to.equal('Custom');
    });

    it('displays the proxy prepended with Inherited', () => {
      expect(PackageShowPage.hasProxy).to.be.true;
      expect(PackageShowPage.proxyValue).to.include('Inherited');
      expect(PackageShowPage.proxyValue).to.include(`${providerPackage.proxy.id}`);
    });
  });

  describe('visiting a managed package details page with provider and package tokens', () => {
    beforeEach(function () {
      providerPackage.isSelected = true;

      this.visit(`/eholdings/packages/${providerPackage.id}`);
    });

    it('displays the provider token prompt and value', () => {
      expect(PackageShowPage.providerToken).to.include(`${provider.providerToken.prompt}`);
      expect(PackageShowPage.providerToken).to.include(`${provider.providerToken.value}`);
    });

    it('displays the package token prompt and value', () => {
      expect(PackageShowPage.packageToken).to.include(`${providerPackage.packageToken.prompt}`);
      expect(PackageShowPage.packageToken).to.include(`${providerPackage.packageToken.value}`);
    });
  });

  describe('visiting a managed package details page with provider token value set and package token without value', () => {
    beforeEach(function () {
      providerPackage.isSelected = true;

      const token = this.server.create('token', {
        factName: '[[mysiteid]]',
        prompt: '/test1/',
        helpText: '',
        value: ''
      });

      providerPackage.update('packageToken', token.toJSON());
      providerPackage.save();

      this.visit(`/eholdings/packages/${providerPackage.id}`);
    });

    it('does not display the package token', () => {
      expect(PackageShowPage.isPackageTokenPresent).to.equal(false);
    });

    it('displays a message that no package token has been set', () => {
      expect(PackageShowPage.packageTokenMessage).to.equal('No package token has been set.');
    });

    it('displays the provider token prompt and value', () => {
      expect(PackageShowPage.providerToken).to.include(`${provider.providerToken.prompt}`);
      expect(PackageShowPage.providerToken).to.include(`${provider.providerToken.value}`);
    });
  });

  describe('visiting a managed package details with no values set for provider token and package token', () => {
    beforeEach(function () {
      providerPackage.isSelected = true;

      const token = this.server.create('token', {
        factName: '[[mysiteid]]',
        prompt: '/test1/',
        helpText: '',
        value: ''
      });
      provider.update('providerToken', token.toJSON());
      provider.save();

      providerPackage.update('packageToken', token.toJSON());
      providerPackage.save();

      this.visit(`/eholdings/packages/${providerPackage.id}`);
    });

    it('does not display the provider token', () => {
      expect(PackageShowPage.isProviderTokenPresent).to.equal(false);
    });

    it('displays a message that no provider token has been set', () => {
      expect(PackageShowPage.providerTokenMessage).to.equal('No provider token has been set.');
    });

    it('does not display the package token', () => {
      expect(PackageShowPage.isPackageTokenPresent).to.equal(false);
    });

    it('displays a message that no package token has been set', () => {
      expect(PackageShowPage.packageTokenMessage).to.equal('No package token has been set.');
    });
  });

  describe('visiting a managed package details with package token value set and provider token without value', () => {
    beforeEach(function () {
      providerPackage.isSelected = true;

      const token = this.server.create('token', {
        factName: '[[mysiteid]]',
        prompt: '/test1/',
        helpText: '',
        value: ''
      });
      provider.update('providerToken', token.toJSON());
      provider.save();

      this.visit(`/eholdings/packages/${providerPackage.id}`);
    });

    it('displays the package token prompt and value', () => {
      expect(PackageShowPage.packageToken).to.include(`${providerPackage.packageToken.prompt}`);
      expect(PackageShowPage.packageToken).to.include(`${providerPackage.packageToken.value}`);
    });

    it('does not display the provider token', () => {
      expect(PackageShowPage.isProviderTokenPresent).to.equal(false);
    });

    it('displays a message that no provider token has been set', () => {
      expect(PackageShowPage.providerTokenMessage).to.equal('No provider token has been set.');
    });
  });

  describe('visiting a managed package details page without provider and package tokens', () => {
    beforeEach(function () {
      providerPackage.isSelected = true;

      provider.update('providerToken', null);
      provider.save();

      providerPackage.update('packageToken', null);
      providerPackage.save();

      this.visit(`/eholdings/packages/${providerPackage.id}`);
    });

    it('does not display both provider and package tokens', () => {
      expect(PackageShowPage.isProviderTokenPresent).to.equal(false);
      expect(PackageShowPage.isPackageTokenPresent).to.equal(false);
    });
  });

  describe('visiting the package details page with multiple pages of titles', () => {
    beforeEach(function () {
      this.server.loadFixtures();

      this.visit('/eholdings/packages/paged_pkg');
    });

    it('should display the first page of related titles', () => {
      expect(PackageShowPage.titleList(0).name).to.equal('Package Title 1');
    });

    describe.skip('scrolling down the list of titles', () => {
      beforeEach(() => {
        return PackageShowPage.scrollToTitleOffset(26);
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

      this.visit(`/eholdings/packages/${providerPackage.id}`);
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
      this.visit({
        pathname: `/eholdings/packages/${providerPackage.id}`,
        // our internal link component automatically sets the location state
        state: { eholdings: true }
      });
    });

    it('should display the back button in UI', () => {
      expect(PackageShowPage.hasBackButton).to.be.true;
    });
  });

  describe('toggling is selected successfully', () => {
    beforeEach(async function () {
      this.visit(`/eholdings/packages/${providerPackage.id}`);

      await PackageShowPage.selectPackage();
      await PackageShowPage.clickEditButton();
      await PackageEditPage.chooseProxy('microstates');
      return PackageEditPage.clickBackButton();
    });

    it('shows a navigation confirmation modal', () => {
      expect(PackageEditPage.navigationModal.$root).to.exist;
    });
  });

  describe('encountering a server error', () => {
    beforeEach(function () {
      this.server.get('/packages/:packageId', {
        errors: [{
          title: 'There was an error'
        }]
      }, 500);

      this.visit(`/eholdings/packages/${providerPackage.id}`);
    });

    it('displays the correct error text', () => {
      expect(PackageShowPage.toast.errorText).to.equal('There was an error');
    });

    it('only has one error', () => {
      expect(PackageShowPage.toast.errorToastCount).to.equal(1);
      expect(PackageShowPage.toast.totalToastCount).to.equal(1);
    });

    it('is positioned to the bottom', () => {
      expect(PackageShowPage.toast.isPositionedBottom).to.be.true;
      expect(PackageShowPage.toast.isPositionedTop).to.be.false;
    });

    it('dies with dignity', () => {
      expect(PackageShowPage.hasErrors).to.be.true;
    });
  });
});
