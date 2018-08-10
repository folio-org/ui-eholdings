import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { describeApplication } from '../helpers/describe-application';
import PackageShowPage from '../interactors/package-show';

describeApplication('Package Show Title Search', () => {
  let provider,
    resources,
    providerPackage;

  beforeEach(function () {
    provider = this.server.create('provider', {
      name: 'Cool Provider'
    });

    providerPackage = this.server.create(
      'package',
      'withTitles',
      'withCustomCoverage',
      {
        provider,
        name: 'Cool Package',
        contentType: 'E-Book',
        isSelected: false,
        titleCount: 3,
        packageType: 'Complete'
      }
    );

    resources = this.server.schema.where('resource', {
      packageId: providerPackage.id
    }).models;

    resources[0].title.update({
      name: 'My Title 1',
      isSelected: true
    });

    resources[1].title.update({
      name: 'My Title 2',
      isSelected: true
    });

    resources[2].title.update({
      name: 'SUPER Duper 3',
      isSelected: false
    });
  });

  describe('navigating to package show page to filter titles', () => {
    beforeEach(function () {
      return this.visit(
        {
          pathname: `/eholdings/packages/${providerPackage.id}`,
          // our internal link component automatically sets the location state
          state: { eholdings: true }
        },
        () => {
          expect(PackageShowPage.$root).to.exist;
        }
      );
    });

    it('displays the proper title count', () => {
      expect(PackageShowPage.titleList().length).to.equal(3);
    });

    it('has no filters by default', () => {
      expect(PackageShowPage.numFilters).to.equal('');
    });

    describe('searching for a title', () => {
      beforeEach(() => {
        return PackageShowPage.clickListSearch()
          .searchModal.searchTitles('My Title')
          .searchModal.clickSearch();
      });

      it('properly filters the results', () => {
        expect(PackageShowPage.titleList(0).name).to.equal('My Title 1');
        expect(PackageShowPage.titleList(1).name).to.equal('My Title 2');
      });

      it('has the right amount of titles displayed', () => {
        expect(PackageShowPage.titleList().length).to.equal(2);
      });
    });

    describe('searching for a title with filters', () => {
      beforeEach(() => {
        return PackageShowPage.clickListSearch()
          .searchModal.clickFilter('selected', 'true')
          .searchModal.clickSearch();
      });

      it('properly filters the results', () => {
        expect(PackageShowPage.titleList().length).to.equal(2);
      });
    });
  });
});
