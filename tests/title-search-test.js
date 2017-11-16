/* global describe, beforeEach */
import { expect } from 'chai';
import it, { convergeOn } from './it-will';

import { describeApplication } from './helpers';
import TitleSearchPage from './pages/title-search';

describeApplication('TitleSearch', () => {
  let titles;

  beforeEach(function () {
    titles = this.server.createList('title', 3, 'withPackages', {
      name: i => `Title${i + 1}`
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

    describe('filtering the search results further', () => {
      beforeEach(() => {
        TitleSearchPage.search('Title1');
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
        }).then(() => TitleSearchPage.changeSearchType('vendors'));
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
      this.server.get('/jsonapi/titles', {
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
