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
      publicationType: 'report',
      subjects: [this.server.create('subject', { subject: 'FooBar' }).toJSON()],
    });

    resources[0].update({
      isSelected: true,
    });

    resources[1].title.update({
      name: 'My Title 2',
      publicationType: 'book',
      publisherName: 'The Frontside'
    });

    resources[1].update({
      isSelected: false
    });

    resources[2].title.update({
      name: 'SUPER Duper 3',
      publicationType: 'book'
    });

    resources[2].update({
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
      expect(PackageShowPage.searchModalBadge.filterText).to.equal('');
    });

    it('displays the number of relevant title records', () => {
      expect(PackageShowPage.searchResultsCount).to.equal('3');
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

    describe('searching for a title with the selected filter', () => {
      beforeEach(() => {
        return PackageShowPage.clickListSearch()
          .searchModal.clickFilter('selected', 'true')
          .searchModal.clickSearch();
      });

      it('properly filters the results', () => {
        expect(PackageShowPage.titleList().length).to.equal(1);
      });
    });

    describe('searching for a title with the publication type filter', () => {
      beforeEach(() => {
        return PackageShowPage.clickListSearch()
          .searchModal.clickFilter('type', 'report')
          .searchModal.clickSearch();
      });

      it('properly filters to one result', () => {
        expect(PackageShowPage.titleList().length).to.equal(1);
      });

      it('has the right title name', () => {
        expect(PackageShowPage.titleList(0).name).to.equal('My Title 1');
      });
    });

    describe('searching for a title by title publisher filter', () => {
      beforeEach(() => {
        return PackageShowPage.clickListSearch()
          .searchModal.selectSearchField('Publisher')
          .searchModal.searchTitles('The Frontside')
          .searchModal.clickSearch();
      });

      it('properly filters to one result', () => {
        expect(PackageShowPage.titleList().length).to.equal(1);
      });

      it('has the right title name', () => {
        expect(PackageShowPage.titleList(0).name).to.equal('My Title 2');
      });

      describe('changing the filter to subject', () => {
        beforeEach(() => {
          return PackageShowPage.clickListSearch()
            .searchModal.selectSearchField('Subject')
            .searchModal.searchTitles('FooBar')
            .searchModal.clickSearch();
        });

        it('properly filters to one result', () => {
          expect(PackageShowPage.titleList().length).to.equal(1);
        });

        it('has the right title name', () => {
          expect(PackageShowPage.titleList(0).name).to.equal('My Title 1');
        });
      });

      describe('resetting the search', () => {
        beforeEach(() => {
          return PackageShowPage.clickListSearch()
            .searchModal.clickResetAll();
        });

        it('properly filters to one result', () => {
          expect(PackageShowPage.titleList().length).to.equal(3);
        });
      });
    });
  });

  describe.skip('navigating to package show page with over 10k titles in package', () => {
    beforeEach(function () {
      this.server.get('/packages/19-5207', () => {
        return new Response(200, {}, { 'data':{ 'id':'19-5207',
          'type':'packages',
          'attributes':{ 'contentType':'E-Book',
            'customCoverage':{ 'beginCoverage':'', 'endCoverage':'' },
            'isCustom':false,
            'isSelected':true,
            'name':'EBSCO eBooks',
            'packageId':5207,
            'packageType':'Selectable',
            'providerId':19,
            'providerName':'EBSCO',
            'selectedCount':1,
            'titleCount':1554086,
            'vendorId':19,
            'vendorName':'EBSCO',
            'visibilityData':{ 'isHidden':false, 'reason':'' },
            'allowKbToAddTitles':false,
            'packageToken':null,
            'proxy':{ 'id':'EZProxy', 'inherited':true } },
          'relationships':{ 'resources':{ 'meta':{ 'included':false } }, 'vendor':{ 'meta':{ 'included':false } }, 'provider':{ 'meta':{ 'included':false } } } },
        'jsonapi':{ 'version':'1.0' } })
          .then(() => {
            this.server.get('packages/19-5207/resources?page=1', () => {
              return new Response(200, {}, { 'data':[],
                'meta':{ 'totalResults': 10000 },
                'jsonapi':{ 'version':'1.0' } });
            });
          });
      });

      return this.visit('/eholdings/packages/19-5207', () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    it('displays the proper title count', () => {
      expect(PackageShowPage.numTitles).to.equal('1,554,086');
    });

    it('displays the proper title count', () => {
      expect(PackageShowPage.titleList().length).to.equal(10000);
    });

    it('displays the number of relevant title records', () => {
      expect(PackageShowPage.searchResultsCount).to.equal('Over 10,000');
    });
  });

  describe('navigating to package show page with over 10k titles in package', () => {
    beforeEach(function () {
      this.server.get('/packages/19-5207', { 'data':{ 'id':'19-5207',
        'type':'packages',
        'attributes':{ 'contentType':'E-Book',
          'customCoverage':{ 'beginCoverage':'', 'endCoverage':'' },
          'isCustom':false,
          'isSelected':true,
          'name':'EBSCO eBooks',
          'packageId':5207,
          'packageType':'Selectable',
          'providerId':19,
          'providerName':'EBSCO',
          'selectedCount':1,
          'titleCount':1554086,
          'vendorId':19,
          'vendorName':'EBSCO',
          'visibilityData':{ 'isHidden':false, 'reason':'' },
          'allowKbToAddTitles':false,
          'packageToken':null,
          'proxy':{ 'id':'EZProxy', 'inherited':true } },
        'relationships':{ 'resources':{ 'meta':{ 'included':false } }, 'vendor':{ 'meta':{ 'included':false } }, 'provider':{ 'meta':{ 'included':false } } } },
      'jsonapi':{ 'version':'1.0' } }, 200);
    });
    describe('with a package that has only 10K titles in resource list', () => {
      beforeEach(() => {
        this.server.get('packages/19-5207/resources?page=1', { 'data':[],
          'meta':{ 'totalResults': 10000 },
          'jsonapi':{ 'version':'1.0' } }, 200);
      });
      it('displays the proper title count', () => {
        expect(PackageShowPage.numTitles).to.equal('1,554,086');
      });

      it('displays the proper title count', () => {
        expect(PackageShowPage.titleList().length).to.equal(10000);
      });

      it('displays the number of relevant title records', () => {
        expect(PackageShowPage.searchResultsCount).to.equal('Over 10,000');
      });
    });
  });
});
