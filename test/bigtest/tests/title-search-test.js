import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import TitleSearchPage from '../interactors/title-search';
import TitleShowPage from '../interactors/title-show';
import ResourceShowPage from '../interactors/resource-show';

describe('TitleSearch', () => {
  setupApplication();
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
      title.resources.update('isSelected', !!i);
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

    this.visit('/eholdings/?searchType=titles');
  });

  it('has a searchbox', () => {
    expect(TitleSearchPage.hasSearchField).to.be.true;
  });

  it('displays title as default searchfield', () => {
    expect(TitleSearchPage.searchFieldSelectValue).to.equal('title');
  });

  it('has search filters', () => {
    expect(TitleSearchPage.hasSearchFilters).to.be.true;
  });

  it('has disabled search button', () => {
    expect(TitleSearchPage.isSearchButtonDisabled).to.be.true;
  });

  it('has a pre-results pane', () => {
    expect(TitleSearchPage.hasPreSearchPane).to.equal(true);
  });

  describe('searching for a title', () => {
    beforeEach(() => {
      return TitleSearchPage.search('Title');
    });

    it('removes the pre-results pane', () => {
      expect(TitleSearchPage.hasPreSearchPane).to.equal(false);
    });

    it.skip('focuses on the search pane title', () => {
      expect(TitleSearchPage.paneTitleHasFocus).to.be.true;
    });

    it('has enabled search button', () => {
      expect(TitleSearchPage.isSearchButtonDisabled).to.be.false;
    });

    it("displays title entries related to 'Title'", () => {
      expect(TitleSearchPage.titleList()).to.have.lengthOf(3);
    });

    it('displays the name of a title', () => {
      expect(TitleSearchPage.titleList(0).name).to.equal('Title1');
    });

    it('displays the publisher name of a title', () => {
      expect(TitleSearchPage.titleList(0).publisherName).to.equal(titles[0].publisherName);
    });

    it('displays the publication type of a title', () => {
      expect(TitleSearchPage.titleList(0).publicationType).to.equal(titles[0].publicationType);
    });

    it('displays a loading indicator where the total results will be', () => {
      expect(TitleSearchPage.totalResults).to.equal('Loading...');
    });

    it('displays the total number of search results', () => {
      expect(TitleSearchPage.totalResults).to.equal('3 search results');
    });

    describe('clicking a search results list item', () => {
      beforeEach(() => {
        return TitleSearchPage.titleList(0).clickThrough();
      });

      it('clicked item has an active state', () => {
        expect(TitleSearchPage.titleList(0).isActive).to.be.true;
      });

      it('shows the preview pane', () => {
        expect(TitleSearchPage.titlePreviewPaneIsPresent).to.be.true;
      });

      it('focuses the title name', () => {
        expect(TitleShowPage.nameHasFocus).to.be.true;
      });

      it('should not display back button in UI', () => {
        expect(TitleSearchPage.hasBackButton).to.be.false;
      });

      describe('conducting a new search', () => {
        beforeEach(() => {
          return TitleSearchPage.search('SomethingSomethingWhoa');
        });

        it('displays the total number of search results', () => {
          expect(TitleSearchPage.totalResults).to.equal('1 search result');
        });

        it('removes the preview detail pane', () => {
          expect(TitleSearchPage.titlePreviewPaneIsPresent).to.be.false;
        });

        it('preserves the last history entry', function () {
          // this is a check to make sure duplicate entries are not added
          // to the history. Ensuring the back button works as expected
          const history = this.app.props.history;
          expect(history.entries[history.index - 1].search).to.include('q=Title');
        });
      });

      describe.skip('clicking the vignette behind the preview pane', () => {
        beforeEach(() => {
          return TitleSearchPage.clickSearchVignette();
        });

        it('hides the preview pane', () => {
          expect(TitleSearchPage.titlePreviewPaneIsPresent).to.be.false;
        });
      });

      describe('clicking the close button on the preview pane', () => {
        beforeEach(() => {
          return TitleSearchPage.clickCloseButton();
        });

        it('hides the preview pane', () => {
          expect(TitleSearchPage.titlePreviewPaneIsPresent).to.be.false;
        });

        it('displays the original search', () => {
          expect(TitleSearchPage.searchFieldValue).to.equal('Title');
        });

        it('displays the original search results', () => {
          expect(TitleSearchPage.titleList()).to.have.lengthOf(3);
        });

        it('focuses the last active item', () => {
          expect(TitleSearchPage.titleList(0).isActive).to.be.false;
          expect(TitleSearchPage.titleList(0).hasFocus).to.be.true;
        });
      });

      describe('clicking an item within the preview pane', () => {
        beforeEach(() => {
          return TitleSearchPage.packageTitleList(0).clickToPackage();
        });

        it('hides the search ui', () => {
          expect(TitleSearchPage.isPresent).to.be.false;
        });

        it('focuses the resource name', () => {
          expect(ResourceShowPage.nameHasFocus).to.be.true;
        });

        describe('and clicking the back button', () => {
          beforeEach(() => {
            return ResourceShowPage.clickBackButton();
          });

          it('displays the original search', () => {
            expect(TitleSearchPage.searchFieldValue).to.equal('Title');
          });

          it('displays the original search results', () => {
            expect(TitleSearchPage.titleList()).to.have.lengthOf(3);
          });

          it('focuses the title name', () => {
            expect(TitleShowPage.nameHasFocus).to.be.true;
          });
        });
      });
    });

    describe('filtering by publication type', () => {
      beforeEach(() => {
        return TitleSearchPage.clickFilter('type', 'book');
      });

      it('only shows results for book publication types', () => {
        expect(TitleSearchPage.titleList()).to.have.lengthOf(1);
        expect(TitleSearchPage.titleList(0).publicationType).to.equal('book');
      });

      it.skip('shows search filters on smaller screen sizes (due to filter change only)', () => {
        expect(TitleSearchPage.isSearchVignetteHidden).to.equal(false);
      });

      it('reflects the filter in the URL query params', function () {
        expect(this.location.search).to.include('filter[type]=book');
      });

      describe('clearing the filters', () => {
        beforeEach(() => {
          return TitleSearchPage.clearFilter('type');
        });

        it.always('removes the filter from the URL query params', function () {
          expect(this.location.search).to.not.include('filter[type]');
        });

        it.skip('shows search filters on smaller screen sizes (due to filter change only)', () => {
          expect(TitleSearchPage.isSearchVignetteHidden).to.equal(false);
        });
      });

      describe('visiting the page with an existing filter', () => {
        beforeEach(function () {
          this.visit('/eholdings/?searchType=titles&q=Title&filter[type]=journal');
        });

        it('shows the existing filter in the search form', () => {
          expect(TitleSearchPage.getFilter('type')).to.equal('journal');
        });

        it('only shows results for journal publication types', () => {
          expect(TitleSearchPage.titleList()).to.have.lengthOf(2);
          expect(TitleSearchPage.titleList(0).publicationType).to.equal('journal');
        });

        it.skip('shows search filters on smaller screen sizes (due to filter change only)', () => {
          expect(TitleSearchPage.isSearchVignetteHidden).to.equal(false);
        });
      });
    });

    describe('filtering by selection status', () => {
      beforeEach(() => {
        return TitleSearchPage.clickFilter('selected', 'true');
      });

      it('only shows results for selected titles', () => {
        expect(TitleSearchPage.titleList()).to.have.lengthOf(2);
      });

      it('reflects the filter in the URL query params', function () {
        expect(this.location.search).to.include('filter[selected]=true');
      });

      it.skip('shows search filters on smaller screen sizes (due to filter change only)', () => {
        expect(TitleSearchPage.isSearchVignetteHidden).to.equal(false);
      });

      describe('clearing the filters', () => {
        beforeEach(() => {
          return TitleSearchPage.clearFilter('selected');
        });

        it.always('removes the filter from the URL query params', function () {
          expect(this.location.search).to.not.include('filter[selected]');
        });

        it.skip('shows search filters on smaller screen sizes (due to filter change only)', () => {
          expect(TitleSearchPage.isSearchVignetteHidden).to.equal(false);
        });
      });

      describe('visiting the page with an existing filter', () => {
        beforeEach(function () {
          this.visit('/eholdings/?searchType=titles&q=Title&filter[selected]=false');
        });

        it('shows the existing filter in the search form', () => {
          expect(TitleSearchPage.getFilter('selected')).to.equal('false');
        });

        it('only shows results for non-selected titles', () => {
          expect(TitleSearchPage.titleList()).to.have.lengthOf(1);
        });

        it.skip('shows search filters on smaller screen sizes (due to filter change only)', () => {
          expect(TitleSearchPage.isSearchVignetteHidden).to.equal(false);
        });
      });
    });

    describe('selecting a publisher search field', () => {
      beforeEach(() => {
        return TitleSearchPage
          .selectSearchField('publisher')
          .search('TestPublisher');
      });

      it('only shows results having publishers with name including TestPublisher', () => {
        expect(TitleSearchPage.titleList()).to.have.lengthOf(1);
        expect(TitleSearchPage.titleList(0).publisherName).to.include('TestPublisher');
      });

      it('reflects the publisher searchfield in the URL query params', function () {
        expect(this.location.search).to.include('searchfield=publisher');
      });
    });

    describe('selecting a subject search field', () => {
      beforeEach(() => {
        return TitleSearchPage
          .selectSearchField('subject')
          .search('TestSubject');
      });

      it('only shows results having subjects including TestSubject', () => {
        expect(TitleSearchPage.titleList()).to.have.lengthOf(1);
      });

      it('reflects the subject searchfield in the URL query params', function () {
        expect(this.location.search).to.include('searchfield=subject');
      });
    });

    describe('selecting an isxn search field', () => {
      beforeEach(() => {
        return TitleSearchPage
          .selectSearchField('isxn')
          .search('999-999');
      });

      it('only shows results having isxn field ', () => {
        expect(TitleSearchPage.titleList()).to.have.lengthOf(1);
      });

      it('reflects the isxn searchfield in the URL query params', function () {
        expect(this.location.search).to.include('searchfield=isxn');
      });
    });

    describe('changing search fields', () => {
      beforeEach(() => {
        return TitleSearchPage.selectSearchField('subject');
      });

      it('maintains the previous search', () => {
        expect(TitleSearchPage.searchFieldValue).to.equal('Title');
      });
    });

    describe('visiting the page with an existing search field', () => {
      beforeEach(function () {
        this.visit('/eholdings/?searchType=titles&q=TestPublisher&searchfield=publisher');
      });

      it('displays publisher as searchfield', () => {
        expect(TitleSearchPage.searchFieldSelectValue).to.eql('publisher');
      });

      it('displays search field populated', () => {
        expect(TitleSearchPage.searchFieldValue).to.equal('TestPublisher');
      });

      it('only shows results for searchfield and query', () => {
        expect(TitleSearchPage.titleList()).to.have.lengthOf(1);
      });
    });

    describe('with a more specific query', () => {
      beforeEach(() => {
        return TitleSearchPage.search('Title1');
      });

      it('only shows a single result', () => {
        expect(TitleSearchPage.titleList()).to.have.lengthOf(1);
      });
    });

    describe('clicking another search type', () => {
      beforeEach(() => {
        return TitleSearchPage
          .titleList(0).click()
          .changeSearchType('providers');
      });

      it('only shows one search type as selected', () => {
        expect(TitleSearchPage.selectedSearchType()).to.have.lengthOf(1);
      });

      it('displays an empty search', () => {
        expect(TitleSearchPage.providerOrPackageSearchFieldValue).to.equal('');
      });

      it('does not display any more results', () => {
        expect(TitleSearchPage.titleList()).to.have.lengthOf(0);
      });

      it('does not show the preview pane', () => {
        expect(TitleSearchPage.providerPreviewPaneIsPresent).to.be.false;
      });

      describe('navigating back to titles search', () => {
        beforeEach(() => {
          return TitleSearchPage.changeSearchType('titles');
        });

        it('displays the original search', () => {
          expect(TitleSearchPage.searchFieldValue).to.equal('Title');
        });

        it('displays the original search results', () => {
          expect(TitleSearchPage.titleList()).to.have.lengthOf(3);
        });

        it('shows the preview pane', () => {
          expect(TitleSearchPage.titlePreviewPaneIsPresent).to.be.true;
        });
      });
    });

    describe('selecting both a search field and a search filter', () => {
      beforeEach(() => {
        return TitleSearchPage
          .selectSearchField('isxn')
          .clickFilter('type', 'book')
          .search('999-999');
      });
      it('only shows results having both isxn and book pub type', () => {
        expect(TitleSearchPage.titleList()).to.have.lengthOf(1);
        expect(TitleSearchPage.titleList(0).publicationType).to.equal('book');
      });

      it('reflects searchfield=isxn in the URL query params', function () {
        expect(this.location.search).to.include('searchfield=isxn');
      });

      it('reflects filter[type]=book in the URL query params', function () {
        expect(this.location.search).to.include('filter[type]=book');
      });

      it.always('does not reflect filter[isxn] in search field', function () {
        expect(this.location.search).to.not.include('filter[isxn]');
      });

      describe('navigating to packages search', () => {
        beforeEach(() => {
          return TitleSearchPage.changeSearchType('packages');
        });

        it('displays an empty search', () => {
          expect(TitleSearchPage.providerOrPackageSearchFieldValue).to.equal('');
        });

        describe('navigating back to titles search', () => {
          beforeEach(() => {
            return TitleSearchPage.changeSearchType('titles');
          });

          it('reflects the isxn searchfield in the URL query params', function () {
            expect(this.location.search).to.include('searchfield=isxn');
          });

          it('reflects the pub type in the URL query params', function () {
            expect(this.location.search).to.include('filter[type]=book');
          });

          it.always('does not reflect filter[isxn] in search field', function () {
            expect(this.location.search).to.not.include('filter[isxn]');
          });
        });
      });
    });

    describe('clearing the search field', () => {
      beforeEach(() => {
        return TitleSearchPage.clearSearch();
      });

      it('has disabled search button', () => {
        expect(TitleSearchPage.isSearchButtonDisabled).to.be.true;
      });
    });
  });

  describe('title sort functionality', () => {
    beforeEach(function () {
      this.server.create('title', {
        name: 'Football Digest',
        type: 'TLI',
        subject: 'football football'
      });
      this.server.create('title', {
        name: 'Biz of Football',
        type: 'TLI',
        subject: 'football football'
      });
      this.server.create('title', {
        name: 'Science and Medicine in Football',
        type: 'TLI',
        subject: 'football asd'
      });
      this.server.create('title', {
        name: 'UNT Legends: a Century of Mean Green Football',
        type: 'TLI',
        subject: '123'
      });
      this.server.create('title', {
        name: 'Analytics for everyone'
      });
      this.server.create('title', {
        name: 'My Health Analytics'
      });
    });

    describe('search form', () => {
      it('should have search filters', () => {
        expect(TitleSearchPage.hasSearchFilters).to.be.true;
      });
    });

    describe('when searching for titles', () => {
      beforeEach(() => {
        return TitleSearchPage.search('football');
      });

      describe('when no sort options were chosen by user', () => {
        describe('search form', () => {
          it('should display "relevance" sort filter as the default', () => {
            expect(TitleSearchPage.sortBy).to.equal('relevance');
          });

          it.always('should not reflect the default sort=relevance in url', function () {
            expect(this.location.search).to.not.include('sort=relevance');
          });
        });

        describe('the list of search results', () => {
          it('should display title entries related to "football"', () => { // ???
            expect(TitleSearchPage.titleList()).to.have.lengthOf(4);
          });
        });
      });

      describe('when "name" sort option is chosen by user', () => {
        beforeEach(() => {
          return TitleSearchPage.clickFilter('sort', 'name');
        });

        describe('search form', () => {
          it('should show the sort filter of name', () => {
            expect(TitleSearchPage.sortBy).to.equal('name');
          });

          it('should reflect the sort in the URL query params', function () {
            expect(this.location.search).to.include('sort=name');
          });

          it.skip('should show search filters on smaller screen sizes (due to filter change only)', () => {
            expect(TitleSearchPage.isSearchVignetteHidden).to.equal(false);
          });
        });

        describe('the list of search results', () => {
          it('should show the same number of found titles', () => { // ???
            expect(TitleSearchPage.titleList()).to.have.lengthOf(4);
          });
        });

        describe('then searching for other titles', () => {
          beforeEach(() => {
            return TitleSearchPage.search('analytics');
          });

          describe('search form', () => {
            it('should keep "name" sort filter active', () => {
              expect(TitleSearchPage.sortBy).to.equal('name');
            });

            it('should reflect the sort in the URL query params', function () {
              expect(this.location.search).to.include('sort=name');
            });
          });

          describe('the list of search results', () => {
            it('should display the titles related to "analytics"', () => { // ???
              expect(TitleSearchPage.titleList()).to.have.lengthOf(2);
            });
          });

          describe('then navigating to package search', () => {
            beforeEach(() => {
              return TitleSearchPage.changeSearchType('packages');
            });

            describe('the list of search results', () => {
              it('should be empty', () => {
                expect(TitleSearchPage.titleList()).to.have.lengthOf(0);
              });
            });

            describe('then navigating back to title search', () => {
              beforeEach(() => {
                return TitleSearchPage.changeSearchType('titles');
              });

              describe('search form', () => {
                it('should keep the sort filter of name', () => {
                  expect(TitleSearchPage.sortBy).to.equal('name');
                });

                it('should reflect the sort=name in the URL query params', function () {
                  expect(this.location.search).to.include('sort=name');
                });
              });

              describe('the list of search results', () => {
                it('should display the results of previous search', () => {
                  expect(TitleSearchPage.titleList()).to.have.lengthOf(2);
                });
              });
            });
          });
        });
      });
    });

    describe('when visiting the page with an existing sort', () => {
      beforeEach(function () {
        this.visit('/eholdings/?searchType=titles&q=football&sort=name');
        // the search pane is ending up hidden by default
        return TitleSearchPage.searchBadge.clickIcon();
      });

      describe('search field', () => {
        it('should be filled with proper value', () => {
          expect(TitleSearchPage.searchFieldValue).to.equal('football');
        });
      });

      describe('search form', () => {
        it('should display "name" sort filter chosen', () => {
          expect(TitleSearchPage.sortBy).to.equal('name');
        });
      });

      describe('the list of search results', () => {
        it('shuold display expected results', () => {
          expect(TitleSearchPage.titleList()).to.have.lengthOf(4);
        });
      });
    });

    describe('when clearing the search field', () => {
      beforeEach(() => {
        return TitleSearchPage.fillSearch('');
      });

      describe('search button', () => {
        it('should be disabled', () => {
          expect(TitleSearchPage.isSearchDisabled).to.be.true;
        });
      });
    });

    describe('when selecting a filter without a value in the search field', () => {
      beforeEach(() => {
        return TitleSearchPage.clickFilter('sort', 'name');
      });

      describe('presearch pane', () => {
        it('should be present', () => {
          expect(TitleSearchPage.hasPreSearchPane).to.be.true;
        });
      });
    });
  });

  describe('filtering title by tags', () => {
    beforeEach(function () {
      const allTags = ['urgent', 'not urgent'];

      const urgentTag = this.server.create('tags', {
        tagList: allTags.slice(0)
      }).toJSON();

      this.server.create('title', {
        name: 'Test Urgent Tag',
        tags: urgentTag
      });
    });

    it('displays tags accordion as closed', () => {
      expect(TitleSearchPage.tagsSection.tagsAccordion.isOpen).to.equal(false);
    });

    describe('clicking to open tags accordion', () => {
      beforeEach(async () => {
        await TitleSearchPage.tagsSection.clickTagHeader();
      });

      it('displays tags accordion as expanded', () => {
        expect(TitleSearchPage.tagsSection.tagsAccordion.isOpen).to.be.true;
      });

      describe('after click on urgent option', () => {
        beforeEach(async () => {
          await TitleSearchPage.tagsSection.tagsSelect.options(1).clickOption();
        });

        it('should display selected value as urgent', () => {
          expect(TitleSearchPage.tagsSection.tagsSelect.values(0).valLabel).to.equal('urgent');
        });

        it('displays titles tagged as urgent', () => {
          expect(TitleSearchPage.titleList()).to.have.lengthOf(1);
          expect(TitleSearchPage.titleList(0).name).to.equal('Test Urgent Tag');
        });

        it('should display the clear tag filter button', () => {
          expect(TitleSearchPage.tagsSection.hasClearTagFilter).to.be.true;
        });

        describe('clearing the filters', () => {
          beforeEach(() => {
            return TitleSearchPage.tagsSection.clearTagFilter();
          });

          it('displays tag filter with empty value', () => {
            expect(TitleSearchPage.tagsSection.tagsSelect.values()).to.deep.equal([]);
          });

          it('displays no title results', () => {
            expect(TitleSearchPage.titleList()).to.have.lengthOf(0);
          });

          it.always('removes the filter from the URL query params', function () {
            expect(this.location.search).to.not.include('filter[tags]');
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
        return TitleSearchPage.search('other');
      });

      it('shows the first page of results', () => {
        expect(TitleSearchPage.titleList(0).name).to.equal('Other Title 5');
      });

      describe('and then scrolling down', () => {
        beforeEach(() => {
          return TitleSearchPage
            .when(() => TitleSearchPage.hasLoaded)
            .do(() => (
              TitleSearchPage.scrollToOffset(26)
            ));
        });

        it('shows the next page of results', () => {
          // when the list is scrolled, it has a threshold of 5 items. index 4,
          // the 5th item, is the topmost visible item in the list
          expect(TitleSearchPage.titleList(4).name).to.equal('Other Title 30');
        });

        it('updates the offset in the URL', function () {
          expect(this.location.search).to.include('offset=26');
        });
      });
    });

    describe('navigating directly to a search page', () => {
      beforeEach(function () {
        this.visit('/eholdings/?searchType=titles&offset=51&q=other');
      });

      it('should show the search results for that page', () => {
        // see comment above about titleList index number
        expect(TitleSearchPage.titleList(4).name).to.equal('Other Title 55');
      });

      it('should retain the proper offset', function () {
        expect(this.location.search).to.include('offset=51');
      });

      describe('and then scrolling up', () => {
        beforeEach(() => {
          return TitleSearchPage.scrollToOffset(0);
        });

        it('shows the total results', () => {
          expect(TitleSearchPage.totalResults).to.equal('75 search results');
        });

        it('shows the prev page of results', () => {
          expect(TitleSearchPage.titleList(0).name).to.equal('Other Title 5');
        });

        it('updates the offset in the URL', function () {
          expect(this.location.search).to.include('offset=0');
        });
      });
    });
  });

  describe("searching for the title 'fhqwhgads'", () => {
    beforeEach(() => {
      return TitleSearchPage.search('fhqwhgads');
    });

    it("displays 'no results' message", () => {
      expect(TitleSearchPage.noResultsMessage).to.equal("No titles found for 'fhqwhgads'.");
    });
  });

  describe('encountering a server error', () => {
    beforeEach(function () {
      this.server.get('/titles', {
        errors: [{
          title: 'There was an error'
        }]
      }, 500);

      return TitleSearchPage.search("this doesn't matter");
    });

    it('dies with dignity', () => {
      expect(TitleSearchPage.hasErrors).to.be.true;
    });
  });
});
