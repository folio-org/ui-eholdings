import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';
import { convergeOn } from '@bigtest/convergence';

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

  it('has disabled search button', () => {
    expect(PackageSearchPage.isSearchButtonEnabled).to.equal(false);
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

    it('hides search filters on smaller screen sizes (due to new search term)', () => {
      expect(PackageSearchPage.isSearchVignetteHidden).to.equal(true);
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
        expect(PackageSearchPage.previewPaneIsVisible('packages')).to.be.true;
      });

      it('should not display button in UI', () => {
        expect(PackageSearchPage.$backButton).to.not.exist;
      });

      describe('conducting a new search', () => {
        beforeEach(() => {
          PackageSearchPage.search('SomethingElse');
        });

        it('removes the preview detail pane', () => {
          expect(PackageSearchPage.previewPaneIsVisible('packages')).to.not.be.true;
        });

        it('preserves the last history entry', function () {
          // this is a check to make sure duplicate entries are not added
          // to the history. Ensuring the back button works as expected
          let history = this.app.history;
          expect(history.entries[history.index - 1].search).to.include('q=Package');
        });

        it('hides search filters on smaller screen sizes (due to new search term)', () => {
          expect(PackageSearchPage.isSearchVignetteHidden).to.equal(true);
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
          expect(PackageSearchPage.previewPaneIsVisible('packages')).to.be.false;
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
        ));
      });

      it('only shows results for ebook content types', () => {
        expect(PackageSearchPage.packageList).to.have.lengthOf(1);
      });

      it('reflects the filter in the URL query params', function () {
        expect(this.app.history.location.search).to.include('filter[type]=ebook');
      });

      it('shows search filters on smaller screen sizes (due to filter change only)', () => {
        expect(PackageSearchPage.isSearchVignetteHidden).to.equal(false);
      });

      describe('clearing the filters', () => {
        beforeEach(() => {
          return convergeOn(() => {
            expect(PackageSearchPage.$searchResultsItems).to.have.lengthOf(1);
          }).then(() => (
            PackageSearchPage.clearFilter('type')
          ));
        });

        it.always('removes the filter from the URL query params', function () {
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
          ));
        });

        it.always('removes the filter from the URL query params', function () {
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
        }).then(() => PackageSearchPage.$searchResultsItems[0].click())
          .then(() => PackageSearchPage.changeSearchType('titles'));
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

      it('does not show the preview pane', () => {
        expect(PackageSearchPage.previewPaneIsVisible('titles')).to.be.false;
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

        it('shows the preview pane', () => {
          expect(PackageSearchPage.previewPaneIsVisible('packages')).to.be.true;
        });
      });
    });
  });

  describe('sorting packages', () => {
    beforeEach(function () {
      this.server.create('package', {
        name: 'Academic ASAP'
      });
      this.server.create('package', {
        name: 'Search Networks'
      });
      this.server.create('package', {
        name: 'Non Matching'
      });
      this.server.create('package', {
        name: 'Academic Search Elite'
      });
      this.server.create('package', {
        name: 'Academic Search Premier'
      });
    });

    describe('searching for packages', () => {
      beforeEach(() => {
        PackageSearchPage.search('academic search');
      });

      it('has search filters', () => {
        expect(PackageSearchPage.$searchFilters).to.exist;
      });

      it('shows the default sort filter of relevance in the search form', () => {
        expect(PackageSearchPage.getFilter('sort')).to.equal('relevance');
      });

      it("displays package entries related to 'academic search'", () => {
        expect(PackageSearchPage.$searchResultsItems).to.have.lengthOf(4);
      });

      it('displays the packages sorted by relevance', () => {
        expect(PackageSearchPage.packageList[0].name).to.equal('Academic Search Elite');
        expect(PackageSearchPage.packageList[1].name).to.equal('Academic Search Premier');
        expect(PackageSearchPage.packageList[2].name).to.equal('Academic ASAP');
        expect(PackageSearchPage.packageList[3].name).to.equal('Search Networks');
      });

      it.always('does not reflect the default sort=relevance in url', function () {
        expect(this.app.history.location.search).to.not.include('sort=relevance');
      });

      describe('then filtering by sort options', () => {
        beforeEach(() => {
          return convergeOn(() => {
            expect(PackageSearchPage.packageList.length).to.be.gt(0);
          }).then(() => (
            PackageSearchPage.clickFilter('sort', 'name')
          ));
        });

        it('displays the packages sorted by package name', () => {
          expect(PackageSearchPage.packageList[0].name).to.equal('Academic ASAP');
          expect(PackageSearchPage.packageList[1].name).to.equal('Academic Search Elite');
          expect(PackageSearchPage.packageList[2].name).to.equal('Academic Search Premier');
          expect(PackageSearchPage.packageList[3].name).to.equal('Search Networks');
        });

        it('shows the sort filter of name in the search form', () => {
          expect(PackageSearchPage.getFilter('sort')).to.equal('name');
        });

        it('reflects the sort in the URL query params', function () {
          expect(this.app.history.location.search).to.include('sort=name');
        });

        describe('then searching for other packages', () => {
          beforeEach(() => {
            PackageSearchPage.search('search');
          });

          it('keeps the sort filter of name in the search form', () => {
            expect(PackageSearchPage.getFilter('sort')).to.equal('name');
          });

          it('displays the packages sorted by package name', () => {
            expect(PackageSearchPage.packageList[0].name).to.equal('Academic Search Elite');
            expect(PackageSearchPage.packageList[1].name).to.equal('Academic Search Premier');
            expect(PackageSearchPage.packageList[2].name).to.equal('Search Networks');
          });

          it('shows the sort filter of name in the search form', () => {
            expect(PackageSearchPage.getFilter('sort')).to.equal('name');
          });

          describe('then clicking another search type', () => {
            beforeEach(() => {
              return convergeOn(() => {
                expect(PackageSearchPage.$searchResultsItems).to.have.lengthOf(3);
              }).then(() => PackageSearchPage.changeSearchType('titles'));
            });

            it('does not display any results', () => {
              expect(PackageSearchPage.$searchResultsItems).to.have.lengthOf(0);
            });

            describe('navigating back to packages search', () => {
              beforeEach(() => {
                return PackageSearchPage.changeSearchType('packages');
              });

              it('keeps the sort filter of name in the search form', () => {
                expect(PackageSearchPage.getFilter('sort')).to.equal('name');
              });

              it('displays the last results', () => {
                expect(PackageSearchPage.$searchResultsItems).to.have.lengthOf(3);
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
          expect(PackageSearchPage.$searchResultsItems).to.have.lengthOf(0);
        }).then(() => {
          return this.visit('/eholdings/?searchType=packages&q=academic&sort=name', () => {
            expect(PackageSearchPage.$root).to.exist;
          });
        });
      });

      it('displays search field populated', () => {
        expect(PackageSearchPage.$searchField).to.have.value('academic');
      });

      it('displays the sort filter of name as selected in the search form', () => {
        expect(PackageSearchPage.getFilter('sort')).to.equal('name');
      });

      it('displays the expected results', () => {
        expect(PackageSearchPage.$searchResultsItems).to.have.lengthOf(3);
      });

      it('displays results sorted by name', () => {
        expect(PackageSearchPage.packageList[0].name).to.equal('Academic ASAP');
        expect(PackageSearchPage.packageList[1].name).to.equal('Academic Search Elite');
        expect(PackageSearchPage.packageList[2].name).to.equal('Academic Search Premier');
      });
    });

    describe('clearing the search field', () => {
      beforeEach(() => {
        return convergeOn(() => {
          expect(PackageSearchPage.$searchResultsItems).to.have.lengthOf(0);
        }).then(() => (
          PackageSearchPage.clearSearch()
        ));
      });
      it('has disabled search button', () => {
        expect(PackageSearchPage.isSearchButtonEnabled).to.equal(false);
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
        it.always('shows the total results', () => {
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
