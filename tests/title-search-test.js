/* global describe, beforeEach */
import { expect } from 'chai';
import it, { convergeOn } from './it-will';

import { describeApplication } from './helpers';
import TitleSearchPage from './pages/title-search';

describeApplication('TitleSearch', () => {
  let titles;

  beforeEach(function () {
    titles = this.server.createList('title', 3, 'withPackages', {
      name: i => `Title${i + 1}`,
      publicationType: i => (i % 2 ? 'book' : 'journal')
    });

    this.server.create('title', {
      name: 'SomethingSomethingWhoa'
    });

    return this.visit('/eholdings/?searchType=titles', () => {
      expect(TitleSearchPage.$root).to.exist;
    });
  });

  it('has a searchbox', () => {
    expect(TitleSearchPage.$searchField).to.exist;
  });

  it('has search filters', () => {
    expect(TitleSearchPage.$searchFilters).to.exist;
  });

  describe('searching for a title', () => {
    beforeEach(() => {
      TitleSearchPage.search('Title');
    });

    it("displays title entries related to 'Title'", () => {
      expect(TitleSearchPage.$searchResultsItems).to.have.lengthOf(3);
    });

    it('displays the name of a title', () => {
      expect(TitleSearchPage.titleList[0].name).to.equal('Title1');
    });

    it('displays the publisher name of a title', () => {
      expect(TitleSearchPage.titleList[0].publisherName).to.equal(titles[0].publisherName);
    });

    it('displays the publication type of a title', () => {
      expect(TitleSearchPage.titleList[0].publicationType).to.equal(titles[0].publicationType);
    });

    it('displays a loading indicator where the total results will be', () => {
      expect(TitleSearchPage.totalResults).to.equal('Loading...');
    });

    it('displays the total number of search results', () => {
      expect(TitleSearchPage.totalResults).to.equal('3 search results');
    });

    describe('clicking a search results list item', () => {
      beforeEach(() => {
        return convergeOn(() => {
          // wait for the previous search to complete
          expect(TitleSearchPage.$searchResultsItems).to.have.lengthOf(3);
        }).then(() => TitleSearchPage.$searchResultsItems[0].click());
      });

      it('shows the preview pane', () => {
        expect(TitleSearchPage.previewPaneIsVisible).to.be.true;
      });

      it('should not display back button in UI', () => {
        expect(TitleSearchPage.$backButton).to.not.exist;
      });

      describe('clicking the vignette behind the preview pane', () => {
        beforeEach(() => {
          TitleSearchPage.clickSearchVignette();
        });

        it('hides the preview pane', () => {
          expect(TitleSearchPage.previewPaneIsVisible).to.be.false;
        });
      });

      describe('clicking an item within the preview pane', () => {
        beforeEach(() => {
          return TitleSearchPage.clickPackage(0);
        });

        it('hides the search ui', () => {
          expect(TitleSearchPage.$root).to.not.exist;
        });

        describe('and clicking the back button', () => {
          beforeEach(() => {
            return TitleSearchPage.clickBackButton();
          });

          it('displays the original search', () => {
            expect(TitleSearchPage.$searchField).to.have.value('Title');
          });

          it('displays the original search results', () => {
            expect(TitleSearchPage.$searchResultsItems).to.have.lengthOf(3);
          });
        });
      });
    });

    describe('filtering by publication type', () => {
      beforeEach(() => {
        return convergeOn(() => {
          expect(TitleSearchPage.$searchResultsItems).to.have.lengthOf(3);
        }).then(() => (
          TitleSearchPage.clickFilter('pubtype', 'book')
        )).then(() => (
          TitleSearchPage.search('Title')
        ));
      });

      it('only shows results for book publication types', () => {
        expect(TitleSearchPage.titleList).to.have.lengthOf(1);
        expect(TitleSearchPage.titleList[0].publicationType).to.equal('book');
      });

      it('reflects the filter in the URL query params', function () {
        expect(this.app.history.location.search).to.include('filter[type]=book');
      });

      describe('clearing the filters', () => {
        beforeEach(() => {
          return convergeOn(() => {
            expect(TitleSearchPage.$searchResultsItems).to.have.lengthOf(1);
          }).then(() => (
            TitleSearchPage.clearFilter('pubtype')
          )).then(() => (
            TitleSearchPage.search('Title')
          ));
        });

        it.still('removes the filter from the URL query params', function () {
          expect(this.app.history.location.search).to.not.include('filter[type]');
        });
      });

      describe('visiting the page with an existing filter', () => {
        beforeEach(function () {
          return convergeOn(() => {
            expect(TitleSearchPage.$searchResultsItems).to.have.lengthOf(1);
          }).then(() => {
            return this.visit('/eholdings/?searchType=titles&q=Title&filter[type]=journal', () => {
              expect(TitleSearchPage.$root).to.exist;
            });
          });
        });

        it('shows the existing filter in the search form', () => {
          expect(TitleSearchPage.getFilter('pubtype')).to.equal('journal');
        });

        it('only shows results for journal publication types', () => {
          expect(TitleSearchPage.titleList).to.have.lengthOf(2);
          expect(TitleSearchPage.titleList[0].publicationType).to.equal('journal');
        });
      });
    });

    describe('with a more specific query', () => {
      beforeEach(() => {
        return convergeOn(() => {
          expect(TitleSearchPage.$searchResultsItems).to.have.lengthOf(3);
        }).then(() => (
          TitleSearchPage.search('Title1')
        ));
      });

      it('only shows a single result', () => {
        expect(TitleSearchPage.$searchResultsItems).to.have.lengthOf(1);
      });
    });

    describe('clicking another search type', () => {
      beforeEach(() => {
        return convergeOn(() => {
          // wait for the previous search to complete
          expect(TitleSearchPage.$searchResultsItems).to.have.lengthOf(3);
        }).then(() => TitleSearchPage.changeSearchType('providers'));
      });

      it('only shows one search type as selected', () => {
        expect(TitleSearchPage.$selectedSearchType).to.have.lengthOf(1);
      });

      it('displays an empty search', () => {
        expect(TitleSearchPage.$searchField).to.have.value('');
      });

      it('does not display any more results', () => {
        expect(TitleSearchPage.$searchResultsItems).to.have.lengthOf(0);
      });

      describe('navigating back to titles search', () => {
        beforeEach(() => {
          return TitleSearchPage.changeSearchType('titles');
        });

        it('displays the original search', () => {
          expect(TitleSearchPage.$searchField).to.have.value('Title');
        });

        it('displays the original search results', () => {
          expect(TitleSearchPage.$searchResultsItems).to.have.lengthOf(3);
        });
      });
    });
  });

  describe('with multiple pages of titles', () => {
    beforeEach(function () {
      this.server.createList('title', 75, {
        name: i => `Other Title ${i + 1}`
      });
    });

    describe('searching for titles', () => {
      beforeEach(() => {
        TitleSearchPage.search('other');
      });

      it('shows the first page of results', () => {
        // return window.pauseTest(this);
        expect(TitleSearchPage.titleList[0].name).to.equal('Other Title 5');
      });

      describe('and then scrolling down', () => {
        beforeEach(() => {
          return convergeOn(() => {
            expect(TitleSearchPage.titleList.length).to.be.gt(0);
          }).then(() => {
            TitleSearchPage.scrollToOffset(26);
          });
        });

        it('shows the next page of results', () => {
          // when the list is scrolled, it has a threshold of 5 items. index 4,
          // the 5th item, is the topmost visible item in the list
          expect(TitleSearchPage.titleList[4].name).to.equal('Other Title 30');
        });

        it('updates the offset in the URL', function () {
          expect(this.app.history.location.search).to.include('offset=26');
        });
      });
    });

    describe('navigating directly to a search page', () => {
      beforeEach(function () {
        return this.visit('/eholdings/?searchType=titles&offset=51&q=other', () => {
          expect(TitleSearchPage.$root).to.exist;
        });
      });

      it('should show the search results for that page', () => {
        // see comment above about titleList index number
        expect(TitleSearchPage.titleList[4].name).to.equal('Other Title 55');
      });

      it('should retain the proper offset', function () {
        expect(this.app.history.location.search).to.include('offset=51');
      });

      describe('and then scrolling up', () => {
        beforeEach(() => {
          return convergeOn(() => {
            expect(TitleSearchPage.titleList.length).to.be.gt(0);
          }).then(() => {
            TitleSearchPage.scrollToOffset(0);
          });
        });

        // it might take a bit for the next request to be triggered after the scroll
        it.still('shows the total results', () => {
          expect(TitleSearchPage.totalResults).to.equal('75 search results');
        }, 500);

        it('shows the prev page of results', () => {
          expect(TitleSearchPage.titleList[0].name).to.equal('Other Title 5');
        });

        it('updates the offset in the URL', function () {
          expect(this.app.history.location.search).to.include('offset=0');
        });
      });
    });
  });

  describe("searching for the title 'fhqwhgads'", () => {
    beforeEach(() => {
      TitleSearchPage.search('fhqwhgads');
    });

    it("displays 'no results' message", () => {
      expect(TitleSearchPage.noResultsMessage).to.equal('No titles found for "fhqwhgads".');
    });
  });

  describe('encountering a server error', () => {
    beforeEach(function () {
      this.server.get('/titles', {
        errors: [{
          title: 'There was an error'
        }]
      }, 500);

      TitleSearchPage.search("this doesn't matter");
    });

    it('dies with dignity', () => {
      expect(TitleSearchPage.hasErrors).to.be.true;
    });
  });
});
