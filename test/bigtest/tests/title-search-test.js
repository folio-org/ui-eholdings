import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import TitleSearchPage from '../interactors/title-search';
import wait from '../helpers/wait';

describe('TitleSearch', function () {
  setupApplication({
    scenarios: ['titleSearch']
  });

  // Odd indexed items are assigned alternate attributes targeted in specific filtering tests
  beforeEach(async function () {
    this.visit('/eholdings/?searchType=titles');
    await TitleSearchPage.whenLoaded();
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

  it('search field should be enabled', () => {
    expect(TitleSearchPage.searchFieldIsDisabled).to.be.false;
  });

  it('has disabled search button', () => {
    expect(TitleSearchPage.isSearchButtonDisabled).to.be.true;
  });

  it('has a pre-results pane', () => {
    expect(TitleSearchPage.hasPreSearchPane).to.equal(true);
  });

  it('filter accordions should be collapsed by default', () => {
    expect(TitleSearchPage.tagsSection.tagsAccordion.isOpen).to.be.false;
    expect(TitleSearchPage.typeFilterAccordion.isOpen).to.be.false;
    expect(TitleSearchPage.sortFilterAccordion.isOpen).to.be.false;
    expect(TitleSearchPage.selectionFilterAccordion.isOpen).to.be.false;
  });
});

describe("TitleSearch searching for the title 'fhqwhgads'", () => {
  setupApplication({
    scenarios: ['titleSearch']
  });

  beforeEach(async function () {
    this.visit('/eholdings/?searchType=titles');
    await TitleSearchPage.whenLoaded();
    await TitleSearchPage.search('fhqwhgads');
  });

  it("displays 'no results' message", () => {
    expect(TitleSearchPage.noResultsMessage).to.equal("No titles found for 'fhqwhgads'.");
  });
});

describe('TitleSearch visiting the page with an existing search field', () => {
  setupApplication({
    scenarios: ['titleSearch']
  });

  beforeEach(async function () {
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

describe('TitleSearch visiting the page with an existing type filter', () => {
  setupApplication({
    scenarios: ['titleSearch']
  });

  beforeEach(async function () {
    this.visit('/eholdings/?searchType=titles&q=Title&filter[type]=journal');
    await TitleSearchPage.whenLoaded();
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

describe('TitleSearch visiting the page with an existing selection filter', () => {
  setupApplication({
    scenarios: ['titleSearch']
  });

  beforeEach(async function () {
    this.visit('/eholdings/?searchType=titles&q=Title&filter[selected]=false');
    await TitleSearchPage.whenLoaded();
  });

  it('shows the existing filter in the search form', () => {
    expect(TitleSearchPage.getFilter('selected')).to.equal('false');
  });

  it('only shows results for non-selected titles', () => {
    expect(TitleSearchPage.titleList()).to.have.lengthOf(1);
  });
});

describe('TitleSearch visiting the page with an existing tags filter', () => {
  setupApplication({
    scenarios: ['titleSearch']
  });

  beforeEach(async function () {
    this.visit('/eholdings?searchType=titles&filter[tags]=urgent');
    await TitleSearchPage.when(() => TitleSearchPage.tagsSection.tagsAccordion.isPresent);
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

    it('should display tags multiselect enabled', () => {
      expect(TitleSearchPage.tagsSection.tagsMultiselectIsDisabled).to.be.false;
    });

    it('search by tags tags checkbox should be checked', () => {
      expect(TitleSearchPage.tagsSection.tagsCheckboxIsChecked).to.be.true;
    });

    it('should display selected value as urgent', () => {
      expect(TitleSearchPage.tagsSection.tagsSelect.values(0).valLabel).to.equal('urgent');
    });
  });
});

describe('TitleSearch title sort functionality when searching for titles', () => {
  setupApplication({
    scenarios: ['titleSearchSorting']
  });

  beforeEach(async function () {
    this.visit('/eholdings/?searchType=titles');
    await TitleSearchPage.whenLoaded();
    await TitleSearchPage.search('football');
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
});

describe('TitleSearch title sort functionality when searching for titles and when "name" sort option is chosen by user', () => {
  setupApplication({
    scenarios: ['titleSearchSorting']
  });

  beforeEach(async function () {
    this.visit('/eholdings/?searchType=titles');
    await TitleSearchPage.whenLoaded();
    await TitleSearchPage.search('football');
    await TitleSearchPage.toggleAccordion('#accordion-toggle-button-filter-titles-sort');
    await TitleSearchPage.clickFilter('sort', 'name');
    await wait(1000);
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
});

describe('TitleSearch title sort functionality when clearing the search field', () => {
  setupApplication({
    scenarios: ['titleSearchSorting']
  });

  beforeEach(async function () {
    this.visit('/eholdings/?searchType=titles');
    await TitleSearchPage.whenLoaded();
    await TitleSearchPage.fillSearch('');
  });

  describe('search button', () => {
    it('should be disabled', () => {
      expect(TitleSearchPage.isSearchDisabled).to.be.true;
    });
  });
});

describe('TitleSearch title sort functionality when selecting a filter without a value in the search field', () => {
  setupApplication({
    scenarios: ['titleSearchSorting']
  });

  beforeEach(async function () {
    this.visit('/eholdings/?searchType=titles');
    await TitleSearchPage.whenLoaded();
    await TitleSearchPage.toggleAccordion('#accordion-toggle-button-filter-titles-sort');
    await TitleSearchPage.clickFilter('sort', 'name');
  });

  describe('presearch pane', () => {
    it('should be present', () => {
      expect(TitleSearchPage.hasPreSearchPane).to.be.true;
    });
  });
});

describe('when visiting the page with an existing sort', () => {
  setupApplication({
    scenarios: ['titleSearchSorting']
  });

  beforeEach(async function () {
    this.visit('/eholdings/?searchType=titles&q=football&sort=name');
    // the search pane is ending up hidden by default

    await TitleSearchPage.when(() => TitleSearchPage.searchBadge.isPresent);
    await TitleSearchPage.searchBadge.clickIcon();
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

describe('TitleSearch filtering title by tags', () => {
  setupApplication({
    scenarios: ['titleSearchFilteredByTags']
  });

  beforeEach(async function () {
    this.visit('/eholdings/?searchType=titles');
    await TitleSearchPage.whenLoaded();
  });

  it('displays tags accordion as closed', () => {
    expect(TitleSearchPage.tagsSection.tagsAccordion.isOpen).to.equal(false);
  });
});

describe.skip('TitleSearch filtering title by tags clicking to open tags accordion', () => {
  setupApplication({
    scenarios: ['titleSearchFilteredByTags']
  });

  beforeEach(async function () {
    this.visit('/eholdings/?searchType=titles');
    this.timeout(5000);
    await TitleSearchPage.whenLoaded();
    await TitleSearchPage.tagsSection.clickTagHeader();
  });

  it('displays tags accordion as expanded', () => {
    expect(TitleSearchPage.tagsSection.tagsAccordion.isOpen).to.be.true;
  });

  it('should display tags multiselect disabled by default', () => {
    expect(TitleSearchPage.tagsSection.tagsMultiselectIsDisabled).to.be.true;
  });

  it('search by tags tags checkbox should be not checked', () => {
    expect(TitleSearchPage.tagsSection.tagsCheckboxIsChecked).to.be.false;
  });
});

describe('TitleSearch filtering by tags and open tags accordion and search by tags was enabled', () => {
  setupApplication({
    scenarios: ['titleSearchFilteredByTags']
  });

  beforeEach(async function () {
    this.visit('/eholdings/?searchType=titles');
    await TitleSearchPage.whenLoaded();
    await TitleSearchPage.tagsSection.clickTagHeader();
    await TitleSearchPage.tagsSection.toggleSearchByTags();
  });

  it('search field should be disabled', () => {
    expect(TitleSearchPage.searchFieldIsDisabled).to.be.true;
  });

  it('should display tags multiselect enabled', () => {
    expect(TitleSearchPage.tagsSection.tagsMultiselectIsDisabled).to.be.false;
  });

  it('search by tags tags checkbox should be checked', () => {
    expect(TitleSearchPage.tagsSection.tagsCheckboxIsChecked).to.be.true;
  });
});

describe('TitleSearch filtering by tags and open tags accordion and search by tags was enabled after click on urgent option', () => {
  setupApplication({
    scenarios: ['titleSearchFilteredByTags']
  });

  beforeEach(async function () {
    this.visit('/eholdings/?searchType=titles');
    await TitleSearchPage.whenLoaded();
    await TitleSearchPage.when(() => TitleSearchPage.tagsSection.isPresent);
    await TitleSearchPage.tagsSection.clickTagHeader();
    await TitleSearchPage.tagsSection.toggleSearchByTags();
    await TitleSearchPage.when(() => TitleSearchPage.tagsSection.tagsSelect.isPresent);
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
});

describe.skip('TitleSearch filtering by tags and open tags accordion and search by tags was enabled after click on urgent option and clearing the filters', () => {
  setupApplication({
    scenarios: ['titleSearchFilteredByTags']
  });

  beforeEach(async function () {
    this.visit('/eholdings/?searchType=titles');
    await TitleSearchPage.whenLoaded();
    await TitleSearchPage.tagsSection.clickTagHeader();
    await TitleSearchPage.tagsSection.toggleSearchByTags();
    await TitleSearchPage.tagsSection.tagsSelect.options(1).clickOption();
    await TitleSearchPage.tagsSection.clearTagFilter();
  });

  it('displays tag filter with empty value', () => {
    expect(TitleSearchPage.tagsSection.tagsSelect.values()).to.deep.equal([]);
  });

  it('displays no title results', () => {
    expect(TitleSearchPage.titleList()).to.have.lengthOf(0);
  });
});

describe('TitleSearch with multiple pages of titles searching for titles', () => {
  setupApplication({
    scenarios: ['titleSearchMultiplePages']
  });

  beforeEach(async function () {
    this.visit('/eholdings/?searchType=titles');
    await TitleSearchPage.whenLoaded();
    await TitleSearchPage.search('other');
  });

  it('shows the first page of results', () => {
    expect(TitleSearchPage.titleList(0).name).to.equal('Other Title 5');
  });
});

describe('TitleSearch with multiple pages of titles searching for titles and then scrolling down', () => {
  setupApplication({
    scenarios: ['titleSearchMultiplePages']
  });

  beforeEach(async function () {
    this.visit('/eholdings/?searchType=titles');
    await TitleSearchPage.whenLoaded();
    await TitleSearchPage.search('other');
    await TitleSearchPage.when(() => TitleSearchPage.hasLoaded);
    await TitleSearchPage.scrollToOffset(26);
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

describe('TitleSearch with multiple pages of titles avigating directly to a search page', () => {
  setupApplication({
    scenarios: ['titleSearchMultiplePages']
  });

  beforeEach(async function () {
    this.visit('/eholdings/?searchType=titles&offset=51&q=other');
    await TitleSearchPage.whenLoaded();
  });

  it('should show the search results for that page', () => {
    expect(TitleSearchPage.titleList(4).name).to.equal('Other Title 55');
  });

  it('should retain the proper offset', function () {
    expect(this.location.search).to.include('offset=51');
  });
});

describe('TitleSearch with multiple pages of titles avigating directly to a search page and then scrolling up', () => {
  setupApplication({
    scenarios: ['titleSearchMultiplePages']
  });

  beforeEach(async function () {
    this.visit('/eholdings/?searchType=titles&offset=51&q=other');
    await TitleSearchPage.whenLoaded();
    await TitleSearchPage.scrollToOffset(0);
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

describe('TitleSearch encountering a server error', () => {
  setupApplication({
    scenarios: ['titleSearchError']
  });

  beforeEach(async function () {
    this.visit('/eholdings/?searchType=titles');
    await TitleSearchPage.whenLoaded();
    await TitleSearchPage.search("this doesn't matter");
  });

  it('dies with dignity', () => {
    expect(TitleSearchPage.hasErrors).to.be.true;
  });
});
