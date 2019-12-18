import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import TitleSearchPage from '../interactors/title-search';
import TitleShowPage from '../interactors/title-show';
import ResourceShowPage from '../interactors/resource-show';

describe('TitleSearch searching for a title', () => {
  setupApplication({
    scenarios: ['titleSearch']
  });

  beforeEach(async function () {
    this.visit('/eholdings/?searchType=titles');
    await TitleSearchPage.whenLoaded();
    await TitleSearchPage.search('Title');
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

  it('displays a loading indicator where the total results will be', () => {
    expect(TitleSearchPage.totalResults).to.equal('Loading...');
  });

  it('displays the total number of search results', () => {
    expect(TitleSearchPage.totalResults).to.equal('3 search results');
  });

  describe('clicking a search results list item', () => {
    beforeEach(async () => {
      await TitleSearchPage.titleList(0).clickThrough();
    });

    it('clicked item has an active state', () => {
      expect(TitleSearchPage.titleList(0).isActive).to.be.true;
    });

    it.skip('shows the preview pane', () => {
      expect(TitleSearchPage.titlePreviewPaneIsPresent).to.be.true;
    });

    it.skip('focuses the title name', () => {
      expect(TitleShowPage.nameHasFocus).to.be.true;
    });

    it('should not display back button in UI', () => {
      expect(TitleSearchPage.hasBackButton).to.be.false;
    });

    describe('conducting a new search', () => {
      beforeEach(async () => {
        await TitleSearchPage.search('SomethingSomethingWhoa');
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

    describe('clicking the close button on the preview pane', () => {
      beforeEach(async () => {
        await TitleSearchPage.clickCloseButton();
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

      it.skip('focuses the last active item', () => {
        expect(TitleSearchPage.titleList(0).isActive).to.be.false;
        expect(TitleSearchPage.titleList(0).hasFocus).to.be.true;
      });
    });

    describe('clicking an item within the preview pane', () => {
      beforeEach(async () => {
        await TitleSearchPage.packageTitleList(0).clickToPackage();
      });

      it('hides the search ui', () => {
        expect(TitleSearchPage.isPresent).to.be.false;
      });

      it.skip('focuses the resource name', () => {
        expect(ResourceShowPage.nameHasFocus).to.be.true;
      });

      describe('and clicking the back button', () => {
        beforeEach(async () => {
          await ResourceShowPage.clickBackButton();
        });

        it('displays the original search', () => {
          expect(TitleSearchPage.searchFieldValue).to.equal('Title');
        });

        it('displays the original search results', () => {
          expect(TitleSearchPage.titleList()).to.have.lengthOf(3);
        });

        it.skip('focuses the title name', () => {
          expect(TitleShowPage.nameHasFocus).to.be.true;
        });
      });
    });
  });

  describe('filtering by publication type', () => {
    beforeEach(async () => {
      await TitleSearchPage.toggleAccordion('#accordion-toggle-button-filter-titles-type');
      await TitleSearchPage.clickFilter('type', 'book');
    });

    it('only shows results for book publication types', () => {
      expect(TitleSearchPage.titleList()).to.have.lengthOf(1);
      expect(TitleSearchPage.titleList(0).publicationType).to.equal('book');
    });

    it('reflects the filter in the URL query params', function () {
      expect(this.location.search).to.include('filter[type]=book');
    });

    describe.skip('clearing the filters', () => {
      beforeEach(async () => {
        await TitleSearchPage.clearFilter('type');
      });

      it.always('removes the filter from the URL query params', function () {
        expect(this.location.search).to.not.include('filter[type]');
      });

      it.skip('shows search filters on smaller screen sizes (due to filter change only)', () => {
        expect(TitleSearchPage.isSearchVignetteHidden).to.equal(false);
      });
    });
  });

  describe('filtering by selection status', () => {
    beforeEach(async () => {
      await TitleSearchPage.toggleAccordion('#accordion-toggle-button-filter-titles-selected');
      await TitleSearchPage.clickFilter('selected', 'true');
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

    describe.skip('clearing the filters', () => {
      beforeEach(async () => {
        await TitleSearchPage.clearFilter('selected');
      });

      it.always('removes the filter from the URL query params', function () {
        expect(this.location.search).to.not.include('filter[selected]');
      });

      it.skip('shows search filters on smaller screen sizes (due to filter change only)', () => {
        expect(TitleSearchPage.isSearchVignetteHidden).to.equal(false);
      });
    });
  });

  describe('selecting a publisher search field', () => {
    beforeEach(async () => {
      await TitleSearchPage.selectSearchField('publisher');
      await TitleSearchPage.search('TestPublisher');
    });

    it('only shows results having publishers with name including TestPublisher', () => {
      expect(TitleSearchPage.titleList()).to.have.lengthOf(1);
      expect(TitleSearchPage.titleList(0).publisherName).to.include('TestPublisher');
    });

    it('reflects the publisher searchfield in the URL query params', function () {
      expect(this.location.search).to.include('searchfield=publisher');
    });
  });

  describe('selecting an isxn search field', () => {
    beforeEach(async () => {
      await TitleSearchPage.selectSearchField('isxn');
      await TitleSearchPage.search('999-999');
    });

    it('only shows results having isxn field ', () => {
      expect(TitleSearchPage.titleList()).to.have.lengthOf(1);
    });

    it('reflects the isxn searchfield in the URL query params', function () {
      expect(this.location.search).to.include('searchfield=isxn');
    });
  });

  describe('changing search fields', () => {
    beforeEach(async () => {
      await TitleSearchPage.selectSearchField('subject');
    });

    it('maintains the previous search', () => {
      expect(TitleSearchPage.searchFieldValue).to.equal('Title');
    });
  });

  describe('with a more specific query', () => {
    beforeEach(async () => {
      await TitleSearchPage.search('Title1');
    });

    it('only shows a single result', () => {
      expect(TitleSearchPage.titleList()).to.have.lengthOf(1);
    });
  });

  describe('clicking another search type', () => {
    beforeEach(async () => {
      await TitleSearchPage.titleList(0).click();
      await TitleSearchPage.changeSearchType('providers');
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
      beforeEach(async () => {
        await TitleSearchPage.changeSearchType('titles');
      });

      it('displays the original search', () => {
        expect(TitleSearchPage.searchFieldValue).to.equal('Title');
      });

      it('displays the original search results', () => {
        expect(TitleSearchPage.titleList()).to.have.lengthOf(3);
      });

      it.skip('shows the preview pane', () => {
        expect(TitleSearchPage.titlePreviewPaneIsPresent).to.be.true;
      });
    });
  });

  describe('selecting both a search field and a search filter', () => {
    beforeEach(async () => {
      await TitleSearchPage.selectSearchField('isxn');
      await TitleSearchPage.toggleAccordion('#accordion-toggle-button-filter-titles-type');
      await TitleSearchPage.clickFilter('type', 'book');
      await TitleSearchPage.search('999-999');
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

    describe('navigating to packages search', () => {
      beforeEach(async () => {
        await TitleSearchPage.changeSearchType('packages');
      });

      it('displays an empty search', () => {
        expect(TitleSearchPage.providerOrPackageSearchFieldValue).to.equal('');
      });

      describe('navigating back to titles search', () => {
        beforeEach(async () => {
          await TitleSearchPage.changeSearchType('titles');
        });

        it('reflects the isxn searchfield in the URL query params', function () {
          expect(this.location.search).to.include('searchfield=isxn');
        });

        it('reflects the pub type in the URL query params', function () {
          expect(this.location.search).to.include('filter[type]=book');
        });
      });
    });
  });

  describe('clearing the search field', () => {
    beforeEach(async () => {
      await TitleSearchPage.clearSearch();
    });

    it('has disabled search button', () => {
      expect(TitleSearchPage.isSearchButtonDisabled).to.be.true;
    });
  });
});
