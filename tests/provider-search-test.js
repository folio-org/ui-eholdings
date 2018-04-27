import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { describeApplication } from './helpers';
import ProviderSearchPage from './pages/provider-search';
import PackageShowPage from './pages/package-show';

window.ProviderSearchPage = ProviderSearchPage;

describeApplication('ProviderSearch', () => {
  beforeEach(function () {
    this.server.createList('provider', 3, 'withPackagesAndTitles', {
      name: i => `Provider${i + 1}`,
      packagesSelected: 1,
      packagesTotal: 3
    });

    this.server.create('provider', {
      name: 'Totally Awesome Co'
    });

    return this.visit('/eholdings/?searchType=providers', () => {
      expect(ProviderSearchPage.$root).to.exist;
    });
  });

  it('has a searchbox', () => {
    expect(ProviderSearchPage.hasSearchField).to.be.true;
  });

  it('has disabled search button', () => {
    expect(ProviderSearchPage.isSearchButtonDisabled).to.equal(true);
  });

  it('has a pre-results pane', () => {
    expect(ProviderSearchPage.hasPreSearchPane).to.equal(true);
  });

  describe('searching for a provider', () => {
    beforeEach(() => {
      return ProviderSearchPage.search('Provider');
    });

    it('removes the pre-results pane', () => {
      expect(ProviderSearchPage.hasPreSearchPane).to.equal(false);
    });

    it("displays provider entries related to 'Provider'", () => {
      expect(ProviderSearchPage.providerList()).to.have.lengthOf(3);
    });

    it('displays the provider name in the list', () => {
      expect(ProviderSearchPage.providerList(0).name).to.equal('Provider1');
    });

    it('displays the number of selected packages for a provider in the list', () => {
      expect(ProviderSearchPage.providerList(0).numPackagesSelected).to.equal('1');
    });

    it('displays the total number of packages for a provider in the list', () => {
      expect(ProviderSearchPage.providerList(0).numPackages).to.equal('3');
    });

    it('displays a loading indicator where the total results will be', () => {
      expect(ProviderSearchPage.totalResults).to.equal('Loading...');
    });

    it('displays the total number of search results', () => {
      expect(ProviderSearchPage.totalResults).to.equal('3 search results');
    });

    it('hides search filters on smaller screen sizes (due to new search term)', () => {
      expect(ProviderSearchPage.isSearchVignetteHidden).to.equal(true);
    });

    describe('clicking a search results list item', () => {
      beforeEach(() => {
        return ProviderSearchPage
          .when(() => ProviderSearchPage.hasLoaded)
          .do(() => ProviderSearchPage.providerList(0).clickThrough());
      });

      it('clicked item has an active state', () => {
        expect(ProviderSearchPage.providerList(0).isActive).to.be.true;
      });

      it('shows the preview pane', () => {
        expect(ProviderSearchPage.providerPreviewPaneIsPresent).to.be.true;
      });

      it('should not display back button in UI', () => {
        expect(ProviderSearchPage.hasBackButton).to.be.false;
      });

      describe('conducting a new search', () => {
        beforeEach(() => {
          return ProviderSearchPage.search('Totally Awesome Co');
        });

        it('displays the total number of search results', () => {
          expect(ProviderSearchPage.totalResults).to.equal('1 search result');
        });

        it('removes the preview detail pane', () => {
          expect(ProviderSearchPage.providerPreviewPaneIsPresent).to.be.false;
        });

        it('preserves the last history entry', function () {
          // this is a check to make sure duplicate entries are not added
          // to the history. Ensuring the back button works as expected
          let history = this.app.history;
          expect(history.entries[history.index - 1].search).to.include('q=Provider');
        });

        it('hides search filters on smaller screen sizes (due to new search term)', () => {
          expect(ProviderSearchPage.isSearchVignetteHidden).to.equal(true);
        });
      });

      describe.skip('clicking the vignette behind the preview pane', () => {
        beforeEach(() => {
          return ProviderSearchPage.clickSearchVignette();
        });

        it('hides the preview pane', () => {
          expect(ProviderSearchPage.providerPreviewPaneIsPresent).to.be.false;
        });
      });

      describe('clicking the close button on the preview pane', () => {
        beforeEach(() => {
          return ProviderSearchPage.clickCloseButton();
        });

        it('hides the preview pane', () => {
          expect(ProviderSearchPage.providerPreviewPaneIsPresent).to.be.false;
        });

        it('displays the original search', () => {
          expect(ProviderSearchPage.searchFieldValue).to.equal('Provider');
        });

        it('displays the original search results', () => {
          expect(ProviderSearchPage.providerList()).to.have.lengthOf(3);
        });
      });


      describe('clicking an item within the preview pane', () => {
        beforeEach(() => {
          return ProviderSearchPage.providerPackageList(0).clickToPackage();
        });

        it('hides the search UI', () => {
          expect(ProviderSearchPage.exists).to.be.false;
        });

        describe('and clicking the back button', () => {
          beforeEach(() => {
            return PackageShowPage.clickBackButton();
          });

          it('displays the original search', () => {
            expect(ProviderSearchPage.searchFieldValue).to.equal('Provider');
          });

          it('displays the original search results', () => {
            expect(ProviderSearchPage.providerList()).to.have.lengthOf(3);
          });
        });
      });
    });

    describe('filtering the search results further', () => {
      beforeEach(() => {
        return ProviderSearchPage.search('Provider1');
      });

      it('only shows a single result', () => {
        expect(ProviderSearchPage.providerList()).to.have.lengthOf(1);
      });
    });

    describe('clicking another search type', () => {
      beforeEach(() => {
        return ProviderSearchPage
          .when(() => ProviderSearchPage.hasLoaded)
          .do(() => ProviderSearchPage.providerList(0).clickThrough())
          .append(ProviderSearchPage.changeSearchType('packages'));
      });

      it('only shows one search type as selected', () => {
        expect(ProviderSearchPage.selectedSearchType()).to.have.lengthOf(1);
      });

      it('displays an empty search', () => {
        expect(ProviderSearchPage.searchFieldValue).to.equal('');
      });

      it('does not display any more results', () => {
        expect(ProviderSearchPage.providerList()).to.have.lengthOf(0);
      });

      it('does not show the preview pane', () => {
        expect(ProviderSearchPage.packagePreviewPaneIsPresent).to.be.false;
      });

      describe('navigating back to providers search', () => {
        beforeEach(() => {
          return ProviderSearchPage.changeSearchType('providers');
        });

        it('displays the original search', () => {
          expect(ProviderSearchPage.searchFieldValue).to.equal('Provider');
        });

        it('displays the original search results', () => {
          expect(ProviderSearchPage.providerList()).to.have.lengthOf(3);
        });

        it('shows the preview pane', () => {
          expect(ProviderSearchPage.providerPreviewPaneIsPresent).to.be.true;
        });
      });
    });
  });

  describe('sorting providers', () => {
    beforeEach(function () {
      this.server.create('provider', {
        name: 'Health Associations'
      });
      this.server.create('provider', {
        name: 'Analytics for everyone'
      });
      this.server.create('provider', {
        name: 'Non Matching'
      });
      this.server.create('provider', {
        name: 'My Health Analytics 2'
      });
      this.server.create('provider', {
        name: 'My Health Analytics 10'
      });
    });

    describe('searching for providers', () => {
      beforeEach(() => {
        return ProviderSearchPage.search('health analytics');
      });

      it('has search filters', () => {
        expect(ProviderSearchPage.hasSearchFilters).to.be.true;
      });

      it('shows the default sort filter of relevance in the search form', () => {
        expect(ProviderSearchPage.sortBy).to.equal('relevance');
      });

      it("displays provider entries related to 'health analytics'", () => {
        expect(ProviderSearchPage.providerList()).to.have.lengthOf(4);
      });

      it('displays the providers sorted by relevance', () => {
        expect(ProviderSearchPage.providerList(0).name).to.equal('My Health Analytics 2');
        expect(ProviderSearchPage.providerList(1).name).to.equal('My Health Analytics 10');
        expect(ProviderSearchPage.providerList(2).name).to.equal('Analytics for everyone');
        expect(ProviderSearchPage.providerList(3).name).to.equal('Health Associations');
      });

      it.always('does not reflect the default sort=relevance in url', function () {
        expect(this.app.history.location.search).to.not.include('sort=relevance');
      });

      it('hides search filters on smaller screen sizes (due to new search term)', () => {
        expect(ProviderSearchPage.isSearchVignetteHidden).to.equal(true);
      });

      describe('then filtering by sort options', () => {
        beforeEach(() => {
          return ProviderSearchPage.clickFilter('sort', 'name');
        });

        it('displays the providers sorted by provider name', () => {
          expect(ProviderSearchPage.providerList(0).name).to.equal('Analytics for everyone');
          expect(ProviderSearchPage.providerList(1).name).to.equal('Health Associations');
          expect(ProviderSearchPage.providerList(2).name).to.equal('My Health Analytics 2');
          expect(ProviderSearchPage.providerList(3).name).to.equal('My Health Analytics 10');
        });

        it('shows the sort filter of name in the search form', () => {
          expect(ProviderSearchPage.sortBy).to.equal('name');
        });

        it('reflects the sort in the URL query params', function () {
          expect(this.app.history.location.search).to.include('sort=name');
        });

        it('shows search filters on smaller screen sizes (due to filter change only)', () => {
          expect(ProviderSearchPage.isSearchVignetteHidden).to.equal(false);
        });

        describe('then searching for other providers', () => {
          beforeEach(() => {
            return ProviderSearchPage.search('analytics');
          });

          it('keeps the sort filter of name in the search form', () => {
            expect(ProviderSearchPage.sortBy).to.equal('name');
          });

          it('displays the providers sorted by provider name', () => {
            expect(ProviderSearchPage.providerList(0).name).to.equal('Analytics for everyone');
            expect(ProviderSearchPage.providerList(1).name).to.equal('My Health Analytics 2');
            expect(ProviderSearchPage.providerList(2).name).to.equal('My Health Analytics 10');
          });

          it('shows the sort filter of name in the search form', () => {
            expect(ProviderSearchPage.sortBy).to.equal('name');
          });

          it('hides search filters on smaller screen sizes (due to new search term)', () => {
            expect(ProviderSearchPage.isSearchVignetteHidden).to.equal(true);
          });

          describe('then clicking another search type', () => {
            beforeEach(() => {
              return ProviderSearchPage.changeSearchType('packages');
            });

            it('does not display any results', () => {
              expect(ProviderSearchPage.providerList()).to.have.lengthOf(0);
            });

            describe('navigating back to providers search', () => {
              beforeEach(() => {
                return ProviderSearchPage.changeSearchType('providers');
              });

              it('keeps the sort filter of name in the search form', () => {
                expect(ProviderSearchPage.sortBy).to.equal('name');
              });

              it('displays the last results', () => {
                expect(ProviderSearchPage.providerList()).to.have.lengthOf(3);
              });

              it('reflects the sort=name in the URL query params', function () {
                expect(this.app.history.location.search).to.include('sort=name');
              });
            });
          });
        });
      });
    });

    describe('visiting the page with an existing sort', () => {
      beforeEach(function () {
        return this.visit('/eholdings/?searchType=providers&q=health&sort=name', () => {
          expect(ProviderSearchPage.$root).to.exist;
        });
      });

      it('displays search field populated', () => {
        expect(ProviderSearchPage.searchFieldValue).to.equal('health');
      });

      it('displays the sort filter of name as selected in the search form', () => {
        expect(ProviderSearchPage.sortBy).to.equal('name');
      });

      it('displays the expected results', () => {
        expect(ProviderSearchPage.providerList()).to.have.lengthOf(3);
      });

      it('displays results sorted by name', () => {
        expect(ProviderSearchPage.providerList(0).name).to.equal('Health Associations');
        expect(ProviderSearchPage.providerList(1).name).to.equal('My Health Analytics 2');
        expect(ProviderSearchPage.providerList(2).name).to.equal('My Health Analytics 10');
      });
    });

    describe('clearing the search field', () => {
      beforeEach(() => {
        return ProviderSearchPage.clearSearch();
      });

      it('has disabled search button', () => {
        expect(ProviderSearchPage.isSearchButtonDisabled).to.equal(true);
      });
    });
  });

  describe('with multiple pages of providers', () => {
    beforeEach(function () {
      this.server.createList('provider', 75, {
        name: i => `Other Provider ${i + 1}`
      });
    });

    describe('searching for providers', () => {
      beforeEach(() => {
        return ProviderSearchPage.search('other');
      });

      it('shows the first page of results', () => {
        expect(ProviderSearchPage.providerList(0).name).to.equal('Other Provider 5');
      });

      describe('and then scrolling down', () => {
        beforeEach(() => {
          return ProviderSearchPage
            .when(() => ProviderSearchPage.hasLoaded)
            .do(() => ProviderSearchPage.scrollToOffset(26));
        });

        it('shows the next page of results', () => {
          // when the list is scrolled, it has a threshold of 5 items. index 4,
          // the 5th item, is the topmost visible item in the list
          expect(ProviderSearchPage.providerList(4).name).to.equal('Other Provider 30');
        });

        it('updates the offset in the URL', function () {
          expect(this.app.history.location.search).to.include('offset=26');
        });
      });
    });

    describe('navigating directly to a search page', () => {
      beforeEach(function () {
        return this.visit('/eholdings/?searchType=providers&offset=51&q=other', () => {
          expect(ProviderSearchPage.$root).to.exist;
        });
      });

      it('should show the search results for that page', () => {
        // see comment above about providerList index number
        expect(ProviderSearchPage.providerList(4).name).to.equal('Other Provider 55');
      });

      it('should retain the proper offset', function () {
        expect(this.app.history.location.search).to.include('offset=51');
      });

      describe('and then scrolling up', () => {
        beforeEach(() => {
          return ProviderSearchPage
            .when(() => ProviderSearchPage.hasLoaded)
            .do(() => ProviderSearchPage.scrollToOffset(0));
        });

        it('shows the total results', () => {
          expect(ProviderSearchPage.totalResults).to.equal('75 search results');
        });

        it('shows the prev page of results', () => {
          expect(ProviderSearchPage.providerList(0).name).to.equal('Other Provider 5');
        });

        it('updates the offset in the URL', function () {
          expect(this.app.history.location.search).to.include('offset=0');
        });
      });
    });
  });

  describe("searching for the provider 'fhqwhgads'", () => {
    beforeEach(() => {
      return ProviderSearchPage.search('fhqwhgads');
    });

    it("displays 'no results' message", () => {
      expect(ProviderSearchPage.noResultsMessage).to.equal('No providers found for "fhqwhgads".');
    });
  });

  describe('encountering a server error', () => {
    beforeEach(function () {
      this.server.get('/providers', {
        errors: [{
          title: 'There was an error'
        }]
      }, 500);

      return ProviderSearchPage.search("this doesn't matter");
    });

    it('shows an error', () => {
      expect(ProviderSearchPage.hasErrors).to.be.true;
    });

    it('displays the error message returned from the server', () => {
      expect(ProviderSearchPage.errorMessage).to.equal('There was an error');
    });
  });
});
