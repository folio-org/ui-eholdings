/* global describe, beforeEach */
import { expect } from 'chai';
import it, { convergeOn } from './it-will';

import { describeApplication } from './helpers';
import PackageSearchPage from './pages/package-search';

describeApplication('PackageSearch', () => {
  let pkgs;

  beforeEach(function () {
    pkgs = this.server.createList('package', 3, 'withVendor', 'withTitles', {
      name: i => `Package${i + 1}`,
      titleCount: 3,
      selectedCount: 1
    });

    this.server.create('package', 'withVendor', {
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

    it('displays the package vendor name name in the list', () => {
      expect(PackageSearchPage.packageList[0].vendorName).to.equal(pkgs[0].vendor.name);
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

      it('shows the preview pane', () => {
        expect(PackageSearchPage.previewPaneIsVisible).to.be.true;
      });

      it('should not display button in UI', () => {
        expect(PackageSearchPage.$backButton).to.not.exist;
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

    describe('filtering the search results further', () => {
      beforeEach(() => {
        return convergeOn(() => {
          expect(PackageSearchPage.$searchResultsItems).to.have.lengthOf(3);
        }).then(() => {
          PackageSearchPage.search('Package1');
        });
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

      it('displays an empty search', () => {
        expect(PackageSearchPage.$searchField).to.have.value('');
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

        it('updates the page number in the URL', function () {
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

      it('should retain the proper page', function () {
        expect(this.app.history.location.search).to.include('offset=51');
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
