import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';
import { convergeOn } from '@bigtest/convergence';

import { describeApplication } from './helpers';
import ProviderSearchPage from './pages/provider-search';

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
    expect(ProviderSearchPage.$searchField).to.exist;
  });

  describe('searching for a provider', () => {
    beforeEach(() => {
      ProviderSearchPage.search('Provider');
    });

    it("displays provider entries related to 'Provider'", () => {
      expect(ProviderSearchPage.$searchResultsItems).to.have.lengthOf(3);
    });

    it('displays the provider name in the list', () => {
      expect(ProviderSearchPage.providerList[0].name).to.equal('Provider1');
    });

    it('displays the number of selected packages for a provider in the list', () => {
      expect(ProviderSearchPage.providerList[0].numPackagesSelected).to.equal(1);
    });

    it('displays the total number of packages for a provider in the list', () => {
      expect(ProviderSearchPage.providerList[0].numPackages).to.equal(3);
    });

    it('displays a loading indicator where the total results will be', () => {
      expect(ProviderSearchPage.totalResults).to.equal('Loading...');
    });

    it('displays the total number of search results', () => {
      expect(ProviderSearchPage.totalResults).to.equal('3 search results');
    });

    describe('clicking a search results list item', () => {
      beforeEach(() => {
        return convergeOn(() => {
          // wait for the previous search to complete
          expect(ProviderSearchPage.$searchResultsItems).to.have.lengthOf(3);
        }).then(() => ProviderSearchPage.$searchResultsItems[0].click());
      });

      it('clicked item has an active state', () => {
        expect(ProviderSearchPage.providerList[0].isActive).to.be.true;
      });

      it('shows the preview pane', () => {
        expect(ProviderSearchPage.previewPaneIsVisible).to.be.true;
      });

      it('should not display back button in UI', () => {
        expect(ProviderSearchPage.$backButton).to.not.exist;
      });

      describe('conducting a new search', () => {
        beforeEach(() => {
          ProviderSearchPage.search('Totally Awesome Co');
        });

        it('removes the preview detail pane', () => {
          expect(ProviderSearchPage.previewPaneIsVisible).to.not.be.true;
        });

        it('preserves the last history entry', function () {
          // this is a check to make sure duplicate entries are not added
          // to the history. Ensuring the back button works as expected
          let history = this.app.history;
          expect(history.entries[history.index - 1].search).to.include('q=Provider');
        });
      });

      describe('clicking the vignette behind the preview pane', () => {
        beforeEach(() => {
          ProviderSearchPage.clickSearchVignette();
        });

        it('hides the preview pane', () => {
          expect(ProviderSearchPage.previewPaneIsVisible).to.be.false;
        });
      });

      describe('clicking an item within the preview pane', () => {
        beforeEach(() => {
          return ProviderSearchPage.clickPackage(0);
        });

        it('hides the search ui', () => {
          expect(ProviderSearchPage.$root).to.not.exist;
        });

        describe('and clicking the back button', () => {
          beforeEach(() => {
            return ProviderSearchPage.clickBackButton();
          });

          it('displays the original search', () => {
            expect(ProviderSearchPage.$searchField).to.have.value('Provider');
          });

          it('displays the original search results', () => {
            expect(ProviderSearchPage.$searchResultsItems).to.have.lengthOf(3);
          });
        });
      });
    });

    describe('filtering the search results further', () => {
      beforeEach(() => {
        return convergeOn(() => {
          expect(ProviderSearchPage.$searchResultsItems).to.have.lengthOf(3);
        }).then(() => (
          ProviderSearchPage.search('Provider1')
        ));
      });

      it('only shows a single result', () => {
        expect(ProviderSearchPage.$searchResultsItems).to.have.lengthOf(1);
      });
    });

    describe('clicking another search type', () => {
      beforeEach(() => {
        return convergeOn(() => {
          // wait for the previous search to complete
          expect(ProviderSearchPage.$searchResultsItems).to.have.lengthOf(3);
        }).then(() => ProviderSearchPage.changeSearchType('packages'));
      });

      it('only shows one search type as selected', () => {
        expect(ProviderSearchPage.$selectedSearchType).to.have.lengthOf(1);
      });

      it('displays an empty search', () => {
        expect(ProviderSearchPage.$searchField).to.have.value('');
      });

      it('does not display any more results', () => {
        expect(ProviderSearchPage.$searchResultsItems).to.have.lengthOf(0);
      });

      describe('navigating back to providers search', () => {
        beforeEach(() => {
          return ProviderSearchPage.changeSearchType('providers');
        });

        it('displays the original search', () => {
          expect(ProviderSearchPage.$searchField).to.have.value('Provider');
        });

        it('displays the original search results', () => {
          expect(ProviderSearchPage.$searchResultsItems).to.have.lengthOf(3);
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
        ProviderSearchPage.search('health analytics');
      });

      it('has search filters', () => {
        expect(ProviderSearchPage.$searchFilters).to.exist;
      });

      it('shows the default sort filter of relevance in the search form', () => {
        expect(ProviderSearchPage.getFilter('sort')).to.equal('relevance');
      });

      it("displays provider entries related to 'health analytics'", () => {
        expect(ProviderSearchPage.$searchResultsItems).to.have.lengthOf(4);
      });

      it('displays the providers sorted by relevance', () => {
        expect(ProviderSearchPage.providerList[0].name).to.equal('My Health Analytics 2');
        expect(ProviderSearchPage.providerList[1].name).to.equal('My Health Analytics 10');
        expect(ProviderSearchPage.providerList[2].name).to.equal('Analytics for everyone');
        expect(ProviderSearchPage.providerList[3].name).to.equal('Health Associations');
      });

      it.always('does not reflect the default sort=relevance in url', function () {
        expect(this.app.history.location.search).to.not.include('sort=relevance');
      });

      describe('then filtering by sort options', () => {
        beforeEach(() => {
          return convergeOn(() => {
            expect(ProviderSearchPage.providerList.length).to.be.gt(0);
          }).then(() => (
            ProviderSearchPage.clickFilter('sort', 'name')
          ));
        });

        it('displays the providers sorted by provider name', () => {
          expect(ProviderSearchPage.providerList[0].name).to.equal('Analytics for everyone');
          expect(ProviderSearchPage.providerList[1].name).to.equal('Health Associations');
          expect(ProviderSearchPage.providerList[2].name).to.equal('My Health Analytics 2');
          expect(ProviderSearchPage.providerList[3].name).to.equal('My Health Analytics 10');
        });

        it('shows the sort filter of name in the search form', () => {
          expect(ProviderSearchPage.getFilter('sort')).to.equal('name');
        });

        it('reflects the sort in the URL query params', function () {
          expect(this.app.history.location.search).to.include('sort=name');
        });

        describe('then searching for other providers', () => {
          beforeEach(() => {
            ProviderSearchPage.search('analytics');
          });

          it('keeps the sort filter of name in the search form', () => {
            expect(ProviderSearchPage.getFilter('sort')).to.equal('name');
          });

          it('displays the providers sorted by provider name', () => {
            expect(ProviderSearchPage.providerList[0].name).to.equal('Analytics for everyone');
            expect(ProviderSearchPage.providerList[1].name).to.equal('My Health Analytics 2');
            expect(ProviderSearchPage.providerList[2].name).to.equal('My Health Analytics 10');
          });

          it('shows the sort filter of name in the search form', () => {
            expect(ProviderSearchPage.getFilter('sort')).to.equal('name');
          });

          describe('then clicking another search type', () => {
            beforeEach(() => {
              return convergeOn(() => {
                expect(ProviderSearchPage.$searchResultsItems).to.have.lengthOf(3);
              }).then(() => ProviderSearchPage.changeSearchType('packages'));
            });

            it('does not display any results', () => {
              expect(ProviderSearchPage.$searchResultsItems).to.have.lengthOf(0);
            });

            describe('navigating back to providers search', () => {
              beforeEach(() => {
                return ProviderSearchPage.changeSearchType('providers');
              });

              it('keeps the sort filter of name in the search form', () => {
                expect(ProviderSearchPage.getFilter('sort')).to.equal('name');
              });

              it('displays the last results', () => {
                expect(ProviderSearchPage.$searchResultsItems).to.have.lengthOf(3);
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
        return convergeOn(() => {
          expect(ProviderSearchPage.$searchResultsItems).to.have.lengthOf(0);
        }).then(() => {
          return this.visit('/eholdings/?searchType=providers&q=health&sort=name', () => {
            expect(ProviderSearchPage.$root).to.exist;
          });
        });
      });

      it('displays search field populated', () => {
        expect(ProviderSearchPage.$searchField).to.have.value('health');
      });

      it('displays the sort filter of name as selected in the search form', () => {
        expect(ProviderSearchPage.getFilter('sort')).to.equal('name');
      });

      it('displays the expected results', () => {
        expect(ProviderSearchPage.$searchResultsItems).to.have.lengthOf(3);
      });

      it('displays results sorted by name', () => {
        expect(ProviderSearchPage.providerList[0].name).to.equal('Health Associations');
        expect(ProviderSearchPage.providerList[1].name).to.equal('My Health Analytics 2');
        expect(ProviderSearchPage.providerList[2].name).to.equal('My Health Analytics 10');
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
        ProviderSearchPage.search('other');
      });

      it('shows the first page of results', () => {
        expect(ProviderSearchPage.providerList[0].name).to.equal('Other Provider 5');
      });

      describe('and then scrolling down', () => {
        beforeEach(() => {
          return convergeOn(() => {
            expect(ProviderSearchPage.providerList.length).to.be.gt(0);
          }).then(() => {
            ProviderSearchPage.scrollToOffset(26);
          });
        });

        it('shows the next page of results', () => {
          // when the list is scrolled, it has a threshold of 5 items. index 4,
          // the 5th item, is the topmost visible item in the list
          expect(ProviderSearchPage.providerList[4].name).to.equal('Other Provider 30');
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
        expect(ProviderSearchPage.providerList[4].name).to.equal('Other Provider 55');
      });

      it('should retain the proper offset', function () {
        expect(this.app.history.location.search).to.include('offset=51');
      });

      describe('and then scrolling up', () => {
        beforeEach(() => {
          return convergeOn(() => {
            expect(ProviderSearchPage.providerList.length).to.be.gt(0);
          }).then(() => {
            ProviderSearchPage.scrollToOffset(0);
          });
        });

        // it might take a bit for the next request to be triggered after the scroll
        it.always('shows the total results', () => {
          expect(ProviderSearchPage.totalResults).to.equal('75 search results');
        }, 500);

        it('shows the prev page of results', () => {
          expect(ProviderSearchPage.providerList[0].name).to.equal('Other Provider 5');
        });

        it('updates the offset in the URL', function () {
          expect(this.app.history.location.search).to.include('offset=0');
        });
      });
    });
  });

  describe("searching for the provider 'fhqwhgads'", () => {
    beforeEach(() => {
      ProviderSearchPage.search('fhqwhgads');
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

      ProviderSearchPage.search("this doesn't matter");
    });

    it('shows an error', () => {
      expect(ProviderSearchPage.hasErrors).to.be.true;
    });

    it('displays the error message returned from the server', () => {
      expect(ProviderSearchPage.errorMessage).to.equal('There was an error');
    });
  });
});
