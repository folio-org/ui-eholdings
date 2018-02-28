/* global describe, beforeEach */
import { expect } from 'chai';
import it, { convergeOn } from './it-will';

import { describeApplication } from './helpers';
import TitleSearchPage from './pages/title-search';

describeApplication('TitleSearch', () => {
  let titles;

  // Odd indexed items are assigned alternate attributes targeted in specific filtering tests
  beforeEach(function () {
    titles = this.server.createList('title', 3, 'withPackages', 'withSubjects', 'withIdentifiers', {
      name: i => `Title${i + 1}`,
      publicationType: i => (i % 2 ? 'book' : 'journal'),
      publisherName: i => (i % 2 ? 'TestPublisher' : 'Default Publisher')
    });

    // make sure only one of these is not selected
    titles.forEach((title, i) => {
      title.customerResources.update('isSelected', !!i);
    });

    // set up subjects
    titles.forEach((title, i) => {
      if (i % 2) {
        title.subjects.push(this.server.create('subject',
          {
            type: 'TLI',
            subject: 'TestSubject'
          }));
        title.save();
      }
    });

    // set up identifiers
    titles.forEach((title, i) => {
      if (i % 2) {
        title.identifiers.push(this.server.create('identifier',
          {
            id: '999-999',
            subtype: 0,
            type: 0
          }));
        title.save();
      }
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

  it('displays title as default searchfield', () => {
    expect(TitleSearchPage.$searchFieldSelect.value).to.equal('title');
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

      it('clicked item has an active state', () => {
        expect(TitleSearchPage.titleList[0].isActive).to.be.true;
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
          TitleSearchPage.clickFilter('type', 'book')
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
            TitleSearchPage.clearFilter('type')
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
          expect(TitleSearchPage.getFilter('type')).to.equal('journal');
        });

        it('only shows results for journal publication types', () => {
          expect(TitleSearchPage.titleList).to.have.lengthOf(2);
          expect(TitleSearchPage.titleList[0].publicationType).to.equal('journal');
        });
      });
    });

    describe('filtering by selection status', () => {
      beforeEach(() => {
        return convergeOn(() => {
          expect(TitleSearchPage.$searchResultsItems).to.have.lengthOf(3);
        }).then(() => (
          TitleSearchPage.clickFilter('selected', 'true')
        )).then(() => (
          TitleSearchPage.search('Title')
        ));
      });

      it('only shows results for selected titles', () => {
        expect(TitleSearchPage.titleList).to.have.lengthOf(2);
      });

      it('reflects the filter in the URL query params', function () {
        expect(this.app.history.location.search).to.include('filter[selected]=true');
      });

      describe('clearing the filters', () => {
        beforeEach(() => {
          return convergeOn(() => {
            expect(TitleSearchPage.$searchResultsItems).to.have.lengthOf(2);
          }).then(() => (
            TitleSearchPage.clearFilter('selected')
          )).then(() => (
            TitleSearchPage.search('Title')
          ));
        });

        it.still('removes the filter from the URL query params', function () {
          expect(this.app.history.location.search).to.not.include('filter[selected]');
        });
      });

      describe('visiting the page with an existing filter', () => {
        beforeEach(function () {
          return convergeOn(() => {
            expect(TitleSearchPage.$searchResultsItems).to.have.lengthOf(2);
          }).then(() => {
            return this.visit('/eholdings/?searchType=titles&q=Title&filter[selected]=false', () => {
              expect(TitleSearchPage.$root).to.exist;
            });
          });
        });

        it('shows the existing filter in the search form', () => {
          expect(TitleSearchPage.getFilter('selected')).to.equal('false');
        });

        it('only shows results for non-selected titles', () => {
          expect(TitleSearchPage.titleList).to.have.lengthOf(1);
        });
      });
    });

    describe('selecting a publisher search field', () => {
      beforeEach(() => {
        return convergeOn(() => {
          expect(TitleSearchPage.$searchResultsItems).to.have.lengthOf(3);
        }).then(() => (
          TitleSearchPage.selectSearchField('publisher')
        )).then(() => (
          TitleSearchPage.search('TestPublisher')
        ));
      });

      it('only shows results having publishers with name including TestPublisher', () => {
        expect(TitleSearchPage.titleList).to.have.lengthOf(1);
        expect(TitleSearchPage.titleList[0].publisherName).to.include('TestPublisher');
      });

      it('reflects the publisher searchfield in the URL query params', function () {
        expect(this.app.history.location.search).to.include('searchfield=publisher');
      });
    });

    describe('selecting a subject search field', () => {
      beforeEach(() => {
        return convergeOn(() => {
          expect(TitleSearchPage.$searchResultsItems).to.have.lengthOf(3);
        }).then(() => (
          TitleSearchPage.selectSearchField('subject')
        )).then(() => (
          TitleSearchPage.search('TestSubject')
        ));
      });

      it('only shows results having subjects including TestSubject', () => {
        expect(TitleSearchPage.titleList).to.have.lengthOf(1);
      });

      it('reflects the subject searchfield in the URL query params', function () {
        expect(this.app.history.location.search).to.include('searchfield=subject');
      });
    });

    describe('selecting an isxn search field', () => {
      beforeEach(() => {
        return convergeOn(() => {
          expect(TitleSearchPage.$searchResultsItems).to.have.lengthOf(3);
        }).then(() => (
          TitleSearchPage.selectSearchField('isxn')
        )).then(() => (
          TitleSearchPage.search('999-999')
        ));
      });

      it('only shows results having isxn field ', () => {
        expect(TitleSearchPage.titleList).to.have.lengthOf(1);
      });

      it('reflects the isxn searchfield in the URL query params', function () {
        expect(this.app.history.location.search).to.include('searchfield=isxn');
      });
    });

    describe('changing search fields', () => {
      beforeEach(() => {
        return convergeOn(() => {
          expect(TitleSearchPage.$searchResultsItems).to.have.lengthOf(3);
        }).then(() => (
          TitleSearchPage.selectSearchField('subject')
        ));
      });

      it('maintains the previous search', () => {
        expect(TitleSearchPage.$searchField).to.have.value('Title');
      });
    });

    describe('visiting the page with an existing search field', () => {
      beforeEach(function () {
        return convergeOn(() => {
          expect(TitleSearchPage.$searchResultsItems).to.have.lengthOf(3);
        }).then(() => {
          return this.visit('/eholdings/?searchType=titles&q=TestPublisher&searchfield=publisher', () => {
            expect(TitleSearchPage.$root).to.exist;
          });
        });
      });

      it('displays publisher as searchfield', () => {
        expect(TitleSearchPage.$searchFieldSelect.value).to.eql('publisher');
      });

      it('displays search field populated', () => {
        expect(TitleSearchPage.$searchField).to.have.value('TestPublisher');
      });

      it('only shows results for searchfield and query', () => {
        expect(TitleSearchPage.titleList).to.have.lengthOf(1);
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
        expect(TitleSearchPage.$providerSearchField).to.have.value('');
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

    describe('selecting both a search field and a search filter', () => {
      beforeEach(() => {
        return convergeOn(() => {
          expect(TitleSearchPage.$searchResultsItems).to.have.lengthOf(3);
        }).then(() => (
          TitleSearchPage.selectSearchField('isxn')
        )).then(() => (
          TitleSearchPage.clickFilter('type', 'book')
        )).then(() => (
          TitleSearchPage.search('999-999')
        ));
      });
      it('only shows results having both isxn and book pub type', () => {
        expect(TitleSearchPage.titleList).to.have.lengthOf(1);
        expect(TitleSearchPage.titleList[0].publicationType).to.equal('book');
      });

      it('reflects searchfield=isxn in the URL query params', function () {
        expect(this.app.history.location.search).to.include('searchfield=isxn');
      });

      it('reflects filter[type]=book in the URL query params', function () {
        expect(this.app.history.location.search).to.include('filter[type]=book');
      });

      it.still('does not reflect filter[isxn] in search field', function () {
        expect(this.app.history.location.search).to.not.include('filter[isxn]');
      });

      describe('navigating to packages search', () => {
        beforeEach(() => {
          return TitleSearchPage.changeSearchType('packages');
        });

        it('displays an empty search', () => {
          expect(TitleSearchPage.$providerSearchField).to.have.value('');
        });

        describe('navigating back to titles search', () => {
          beforeEach(() => {
            return TitleSearchPage.changeSearchType('titles');
          });

          it('reflects the isxn searchfield in the URL query params', function () {
            expect(this.app.history.location.search).to.include('searchfield=isxn');
          });

          it('reflects the pub type in the URL query params', function () {
            expect(this.app.history.location.search).to.include('filter[type]=book');
          });

          it.still('does not reflect filter[isxn] in search field', function () {
            expect(this.app.history.location.search).to.not.include('filter[isxn]');
          });
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
