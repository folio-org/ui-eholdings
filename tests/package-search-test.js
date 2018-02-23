/* global describe, beforeEach */
import { expect } from 'chai';
import it, { convergeOn } from './it-will';

import { describeApplication } from './helpers';
import PackageSearchPage from './pages/package-search';
import PackageShowPage from './pages/package-show';

describeApplication('PackageSearch', () => {
  let pkgs;

  beforeEach(function () {
    pkgs = this.server.createList('package', 3, 'withProvider', 'withTitles', {
      name: i => `Package${i + 1}`,
      isSelected: i => !!i,
      titleCount: 3,
      selectedCount: i => i,
      contentType: i => (!i ? 'ebook' : 'ejournal')
    });

    this.server.create('package', 'withProvider', {
      name: 'SomethingElse'
    });

    return this.visit('/eholdings/?searchType=packages', () => {
      expect(PackageSearchPage.$root).to.exist;
    });
  });

  it('has a searchbox', () => {
    expect(PackageSearchPage.$searchField).to.exist;
  });

  describe('searching for a package', () => {
    beforeEach(() => {
      PackageSearchPage.search('Package');
    });

    it("displays package entries related to 'Package'", () => {
      expect(PackageSearchPage.$searchResultsItems).to.have.lengthOf(3);
    });

    it('displays the package name in the list', () => {
      expect(PackageSearchPage.packageList[0].name).to.equal('Package1');
    });

    it('displays the package provider name name in the list', () => {
      expect(PackageSearchPage.packageList[0].providerName).to.equal(pkgs[0].provider.name);
    });

    it('displays a loading indicator where the total results will be', () => {
      expect(PackageSearchPage.totalResults).to.equal('Loading...');
    });

    it('displays the total number of search results', () => {
      expect(PackageSearchPage.totalResults).to.equal('3 search results');
    });

    describe('clicking a search results list item', () => {
      beforeEach(() => {
        return convergeOn(() => {
          // wait for the previous search to complete
          expect(PackageSearchPage.$searchResultsItems).to.have.lengthOf(3);
        }).then(() => PackageSearchPage.$searchResultsItems[0].click());
      });

      it('clicked item has an active state', () => {
        expect(PackageSearchPage.packageList[0].isActive).to.be.true;
      });

      it('shows the preview pane', () => {
        expect(PackageSearchPage.previewPaneIsVisible).to.be.true;
      });

      it('should not display button in UI', () => {
        expect(PackageSearchPage.$backButton).to.not.exist;
      });

      describe('conducting a new search', () => {
        beforeEach(() => {
          PackageSearchPage.search('SomethingElse');
        });

        it('removes the preview detail pane', () => {
          expect(PackageSearchPage.previewPaneIsVisible).to.not.be.true;
        });

        it('preserves the last history entry', function () {
          // this is a check to make sure duplicate entries are not added
          // to the history. Ensuring the back button works as expected
          let history = this.app.history;
          expect(history.entries[history.index - 1].search).to.include('q=Package');
        });
      });

      describe('selecting a package', () => {
        beforeEach(() => {
          return convergeOn(() => {
            expect(PackageSearchPage.packageList[0].isSelected).to.be.false;
            expect(PackageShowPage.$root).to.exist;
          }).then(() => (
            PackageShowPage.toggleIsSelected()
          ));
        });

        it('reflects the selection in the results list', () => {
          expect(PackageSearchPage.packageList[0].isSelected).to.be.true;
        });
      });

      describe('clicking the vignette behind the preview pane', () => {
        beforeEach(() => {
          PackageSearchPage.clickSearchVignette();
        });

        it('hides the preview pane', () => {
          expect(PackageSearchPage.previewPaneIsVisible).to.be.false;
        });
      });

      describe('clicking an item within the preview pane', () => {
        beforeEach(() => {
          return PackageSearchPage.clickTitle(0);
        });

        it('hides the search ui', () => {
          expect(PackageSearchPage.$root).to.not.exist;
        });

        describe('and clicking the back button', () => {
          beforeEach(() => {
            return PackageSearchPage.clickBackButton();
          });

          it('displays the original search', () => {
            expect(PackageSearchPage.$searchField).to.have.value('Package');
          });

          it('displays the original search results', () => {
            expect(PackageSearchPage.$searchResultsItems).to.have.lengthOf(3);
          });
        });
      });
    });

    describe('filtering by content type', () => {
      beforeEach(() => {
        return convergeOn(() => {
          expect(PackageSearchPage.$searchResultsItems).to.have.lengthOf(3);
        }).then(() => (
          PackageSearchPage.clickFilter('type', 'ebook')
        )).then(() => (
          PackageSearchPage.search('Package')
        ));
      });

      it('only shows results for ebook content types', () => {
        expect(PackageSearchPage.packageList).to.have.lengthOf(1);
      });

      it('reflects the filter in the URL query params', function () {
        expect(this.app.history.location.search).to.include('filter[type]=ebook');
      });

      describe('clearing the filters', () => {
        beforeEach(() => {
          return convergeOn(() => {
            expect(PackageSearchPage.$searchResultsItems).to.have.lengthOf(1);
          }).then(() => (
            PackageSearchPage.clearFilter('type')
          )).then(() => (
            PackageSearchPage.search('Package')
          ));
        });

        it.still('removes the filter from the URL query params', function () {
          expect(this.app.history.location.search).to.not.include('filter[type]');
        });
      });

      describe('visiting the page with an existing filter', () => {
        beforeEach(function () {
          return convergeOn(() => {
            expect(PackageSearchPage.$searchResultsItems).to.have.lengthOf(1);
          }).then(() => {
            return this.visit('/eholdings/?searchType=packages&q=Package&filter[type]=ejournal', () => {
              expect(PackageSearchPage.$root).to.exist;
            });
          });
        });

        it('shows the existing filter in the search form', () => {
          expect(PackageSearchPage.getFilter('type')).to.equal('ejournal');
        });

        it('only shows results for e-journal content types', () => {
          expect(PackageSearchPage.packageList).to.have.lengthOf(2);
        });
      });
    });

    describe('filtering by selection status', () => {
      beforeEach(() => {
        return convergeOn(() => {
          expect(PackageSearchPage.$searchResultsItems).to.have.lengthOf(3);
        }).then(() => (
          PackageSearchPage.clickFilter('selected', 'true')
        )).then(() => (
          PackageSearchPage.search('Package')
        ));
      });

      it('only shows results for selected packages', () => {
        expect(PackageSearchPage.packageList).to.have.lengthOf(2);
        expect(PackageSearchPage.packageList[0].isSelected).to.be.true;
      });

      it('reflects the filter in the URL query params', function () {
        expect(this.app.history.location.search).to.include('filter[selected]=true');
      });

      describe('clearing the filters', () => {
        beforeEach(() => {
          return convergeOn(() => {
            expect(PackageSearchPage.$searchResultsItems).to.have.lengthOf(2);
          }).then(() => (
            PackageSearchPage.clearFilter('selected')
          )).then(() => (
            PackageSearchPage.search('Package')
          ));
        });

        it.still('removes the filter from the URL query params', function () {
          expect(this.app.history.location.search).to.not.include('filter[selected]');
        });
      });

      describe('visiting the page with an existing filter', () => {
        beforeEach(function () {
          return convergeOn(() => {
            expect(PackageSearchPage.$searchResultsItems).to.have.lengthOf(2);
          }).then(() => {
            return this.visit('/eholdings/?searchType=packages&q=Package&filter[selected]=false', () => {
              expect(PackageSearchPage.$root).to.exist;
            });
          });
        });

        it('shows the existing filter in the search form', () => {
          expect(PackageSearchPage.getFilter('selected')).to.equal('false');
        });

        it('only shows results for non-selected packages', () => {
          expect(PackageSearchPage.packageList).to.have.lengthOf(1);
        });
      });
    });

    describe('with a more specific query', () => {
      beforeEach(() => {
        return convergeOn(() => {
          expect(PackageSearchPage.$searchResultsItems).to.have.lengthOf(3);
        }).then(() => (
          PackageSearchPage.search('Package1')
        ));
      });

      it('only shows a single result', () => {
        expect(PackageSearchPage.$searchResultsItems).to.have.lengthOf(1);
      });
    });

    describe('clicking another search type', () => {
      beforeEach(() => {
        return convergeOn(() => {
          // wait for the previous search to complete
          expect(PackageSearchPage.$searchResultsItems).to.have.lengthOf(3);
        }).then(() => PackageSearchPage.changeSearchType('titles'));
      });

      it('only shows one search type as selected', () => {
        expect(PackageSearchPage.$selectedSearchType).to.have.lengthOf(1);
      });

      it('displays an empty search', () => {
        expect(PackageSearchPage.$titleSearchField).to.have.value('');
      });

      it('does not display any more results', () => {
        expect(PackageSearchPage.$searchResultsItems).to.have.lengthOf(0);
      });

      describe('navigating back to packages search', () => {
        beforeEach(() => {
          return PackageSearchPage.changeSearchType('packages');
        });

        it('displays the original search', () => {
          expect(PackageSearchPage.$searchField).to.have.value('Package');
        });

        it('displays the original search results', () => {
          expect(PackageSearchPage.$searchResultsItems).to.have.lengthOf(3);
        });
      });
    });
  });

  describe('with multiple pages of packages', () => {
    beforeEach(function () {
      this.server.createList('package', 75, {
        name: i => `Other Package ${i + 1}`
      });
    });

    describe('searching for packages', () => {
      beforeEach(() => {
        PackageSearchPage.search('other');
      });

      it('shows the first page of results', () => {
        expect(PackageSearchPage.packageList[0].name).to.equal('Other Package 5');
      });

      describe('and then scrolling down', () => {
        beforeEach(() => {
          return convergeOn(() => {
            expect(PackageSearchPage.packageList.length).to.be.gt(0);
          }).then(() => {
            PackageSearchPage.scrollToOffset(26);
          });
        });

        it('shows the next page of results', () => {
          // when the list is scrolled, it has a threshold of 5 items. index 4,
          // the 5th item, is the topmost visible item in the list
          expect(PackageSearchPage.packageList[4].name).to.equal('Other Package 30');
        });

        it('updates the offset in the URL', function () {
          expect(this.app.history.location.search).to.include('offset=26');
        });
      });
    });

    describe('navigating directly to a search page', () => {
      beforeEach(function () {
        return this.visit('/eholdings/?searchType=packages&offset=51&q=other', () => {
          expect(PackageSearchPage.$root).to.exist;
        });
      });

      it('should show the search results for that page', () => {
        // see comment above about packageList index number
        expect(PackageSearchPage.packageList[4].name).to.equal('Other Package 55');
      });

      it('should retain the proper offset', function () {
        expect(this.app.history.location.search).to.include('offset=51');
      });

      describe('and then scrolling up', () => {
        beforeEach(() => {
          return convergeOn(() => {
            expect(PackageSearchPage.packageList.length).to.be.gt(0);
          }).then(() => {
            PackageSearchPage.scrollToOffset(0);
          });
        });

        // it might take a bit for the next request to be triggered after the scroll
        it.still('shows the total results', () => {
          expect(PackageSearchPage.totalResults).to.equal('75 search results');
        }, 500);

        it('shows the prev page of results', () => {
          expect(PackageSearchPage.packageList[0].name).to.equal('Other Package 5');
        });

        it('updates the offset in the URL', function () {
          expect(this.app.history.location.search).to.include('offset=0');
        });
      });
    });
  });

  describe("searching for the package 'fhqwhgads'", () => {
    beforeEach(() => {
      PackageSearchPage.search('fhqwhgads');
    });

    it("displays 'no results' message", () => {
      expect(PackageSearchPage.noResultsMessage).to.equal('No packages found for "fhqwhgads".');
    });
  });

  describe('encountering a server error', () => {
    beforeEach(function () {
      this.server.get('/packages', {
        errors: [{
          title: 'There was an error'
        }]
      }, 500);

      PackageSearchPage.search("this doesn't matter");
    });

    it('dies with dignity', () => {
      expect(PackageSearchPage.hasErrors).to.be.true;
    });
  });
});
