import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import PackageSearchPage from '../interactors/package-search';
import PackageShowPage from '../interactors/package-show';
import ResourceShowPage from '../interactors/resource-show';

describe('PackageSearch', function () {
  setupApplication();
  let pkgs;
  // some of the beforeEach blocks seem to timeout in CI
  this.timeout(5000);

  beforeEach(async function () {
    pkgs = await this.server.createList('package', 3, 'withProvider', 'withTitles', {
      name: i => `Package${i + 1}`,
      isSelected: i => !!i,
      titleCount: 3,
      selectedCount: i => i,
      contentType: i => (!i ? 'ebook' : 'ejournal')
    });

    await this.server.create('package', 'withProvider', {
      name: 'SomethingElse'
    });

    await this.visit('/eholdings/?searchType=packages');
    await PackageSearchPage.whenLoaded();
  });

  it('has a searchbox', () => {
    expect(PackageSearchPage.hasSearchField).to.be.true;
  });

  it('has disabled search button', () => {
    expect(PackageSearchPage.isSearchDisabled).to.be.true;
  });

  it('search field should be enabled', () => {
    expect(PackageSearchPage.searchFieldIsDisabled).to.be.false;
  });

  it('has a pre-results pane', () => {
    expect(PackageSearchPage.hasPreSearchPane).to.equal(true);
  });

  it('filter accordions should be collapsed by default', () => {
    expect(PackageSearchPage.tagsSection.tagsAccordion.isOpen).to.be.false;
    expect(PackageSearchPage.typeFilterAccordion.isOpen).to.be.false;
    expect(PackageSearchPage.sortFilterAccordion.isOpen).to.be.false;
    expect(PackageSearchPage.selectionFilterAccordion.isOpen).to.be.false;
  });

  describe('clicking to open tags accordion', () => {
    beforeEach(async () => {
      await PackageSearchPage.tagsSection.clickTagHeader();
    });

    it('should display tags multiselect disabled by default', () => {
      expect(PackageSearchPage.tagsSection.tagsMultiselectIsDisabled).to.be.true;
    });

    it('search by tags tags checkbox should be not checked', () => {
      expect(PackageSearchPage.tagsSection.tagsCheckboxIsChecked).to.be.false;
    });
  });

  describe('searching for a package', () => {
    beforeEach(async () => {
      await PackageSearchPage.search('Package');
    });

    it('removes the pre-results pane', () => {
      expect(PackageSearchPage.hasPreSearchPane).to.equal(false);
    });

    it.skip('focuses on the search pane title', () => {
      expect(PackageSearchPage.paneTitleHasFocus).to.be.true;
    });

    it("displays package entries related to 'Package'", () => {
      expect(PackageSearchPage.packageList()).to.have.lengthOf(3);
    });

    it('displays the package name in the list', () => {
      expect(PackageSearchPage.packageList(0).name).to.equal('Package1');
    });

    it('displays the package provider name name in the list', () => {
      expect(PackageSearchPage.packageList(0).providerName).to.equal(pkgs[0].provider.name);
    });

    it('displays a loading indicator where the total results will be', () => {
      expect(PackageSearchPage.totalResults).to.equal('Loading...');
    });

    it('displays the total number of search results', () => {
      expect(PackageSearchPage.totalResults).to.equal('3 search results');
    });

    describe('search badge', () => {
      it('is present while search pane is open', () => {
        expect(PackageSearchPage.isSearchPanePresent).to.be.true;
        expect(PackageSearchPage.searchBadge.isPresent).to.be.true;
      });

      it('does not show the filter badge while search pane is open', () => {
        expect(PackageSearchPage.isSearchPanePresent).to.be.true;
        expect(PackageSearchPage.searchBadge.filterIsPresent).to.be.false;
      });

      describe('clicking on the search icon', () => {
        beforeEach(async () => {
          await PackageSearchPage.searchBadge.clickIcon();
        });

        it('closes the search pane', () => {
          expect(PackageSearchPage.isSearchPanePresent).to.be.false;
        });

        it('shows the filter badge', () => {
          expect(PackageSearchPage.searchBadge.filterIsPresent).to.be.true;
        });

        it('shows 1 filter', () => {
          expect(PackageSearchPage.searchBadge.filterText).to.equal('1');
        });
      });
    });

    describe('clicking a search results list item', () => {
      beforeEach(async () => {
        await PackageSearchPage.packageList(0).clickThrough();
      });

      it('still shows the search badge', () => {
        expect(PackageSearchPage.searchBadge.isPresent).to.be.true;
      });

      it('clicked item has an active state', () => {
        expect(PackageSearchPage.packageList(0).isActive).to.be.true;
      });

      it('shows the preview pane', () => {
        expect(PackageSearchPage.packagePreviewPaneIsPresent).to.be.true;
      });

      it.skip('focuses the package name', () => {
        expect(PackageShowPage.nameHasFocus).to.be.true;
      });

      it.always('should not display button in UI', () => {
        expect(PackageSearchPage.hasBackButton).to.be.false;
      });
    });

    describe('clicking a search results list item conducting a new search', () => {
      beforeEach(async () => {
        await PackageSearchPage
          .packageList(0)
          .clickThrough()
          .search('SomethingElse');
      });

      it('displays the total number of search results', () => {
        expect(PackageSearchPage.totalResults).to.equal('1 search result');
      });

      it('removes the preview detail pane', () => {
        expect(PackageSearchPage.packagePreviewPaneIsPresent).to.be.false;
      });

      it('preserves the last history entry', function () {
        // this is a check to make sure duplicate entries are not added
        // to the history. Ensuring the back button works as expected
        const history = this.app.props.history;
        expect(history.entries[history.index - 1].search).to.include('q=Package');
      });
    });

    describe.skip('clicking a search results list item selecting a package', () => {
      beforeEach(async () => {
        await PackageSearchPage
          .packageList(0)
          .clickThrough()
          .selectPackage();
      });

      it('reflects the selection in the results list', () => {
        expect(PackageSearchPage.packageList(0).isSelected).to.be.true;
      });
    });

    describe('clicking a search results list item clicking the close button on the preview pane', () => {
      beforeEach(async () => {
        await PackageSearchPage
          .packageList(0)
          .clickThrough()
          .clickCloseButton();
      });

      it('hides the preview pane', () => {
        expect(PackageSearchPage.packagePreviewPaneIsPresent).to.be.false;
      });

      it('displays the original search', () => {
        expect(PackageSearchPage.searchFieldValue).to.equal('Package');
      });

      it('displays the original search results', () => {
        expect(PackageSearchPage.packageList()).to.have.lengthOf(3);
      });

      it.skip('focuses the last active item', () => {
        expect(PackageSearchPage.packageList(0).isActive).to.be.false;
        expect(PackageSearchPage.packageList(0).hasFocus).to.be.true;
      });
    });

    // the browser needs to be a specific size for this test to pass
    describe.skip('clicking a search results list item clicking the vignette behind the preview pane', () => {
      beforeEach(async () => {
        await PackageSearchPage
          .packageList(0)
          .clickThrough()
          .clickSearchVignette();
      });

      it('hides the preview pane', () => {
        expect(PackageSearchPage.packagePreviewPaneIsPresent).to.be.false;
      });
    });

    describe('clicking a search results list item clicking an item within the preview pane', () => {
      beforeEach(async () => {
        await PackageSearchPage
          .packageList(0)
          .clickThrough()
          .packageTitleList(0)
          .clickToTitle();
      });
      it('hides the search ui', () => {
        expect(PackageSearchPage.isPresent).to.be.false;
      });

      it.skip('focuses the resource name', () => {
        expect(ResourceShowPage.nameHasFocus).to.be.true;
      });
    });

    describe.skip('clicking a search results list item clicking an item within the preview pane and clicking the back button', () => {
      beforeEach(async () => {
        await PackageSearchPage
          .packageList(0)
          .clickThrough()
          .packageTitleList(0)
          .clickToTitle()
          .clickBackButton();
      });

      it('displays the original search', () => {
        expect(PackageSearchPage.searchFieldValue).to.equal('Package');
      });

      it('displays the original search results', () => {
        expect(PackageSearchPage.packageList()).to.have.lengthOf(3);
      });

      it.skip('focuses the package name', () => {
        expect(PackageShowPage.nameHasFocus).to.be.true;
      });
    });

    describe('filtering by content type', () => {
      beforeEach(async () => {
        await PackageSearchPage
          .toggleAccordion('#accordion-toggle-button-filter-packages-type')
          .clickFilter('type', 'ebook');
      });

      it('only shows results for ebook content types', () => {
        expect(PackageSearchPage.packageList()).to.have.lengthOf(1);
      });

      it('reflects the filter in the URL query params', function () {
        expect(this.location.search).to.include('filter[type]=ebook');
      });

      it.skip('shows search filters on smaller screen sizes (due to filter change only)', () => {
        expect(PackageSearchPage.isSearchVignetteHidden).to.equal(false);
      });
    });

    describe('filtering by content type and clearing the filters', () => {
      beforeEach(async () => {
        await PackageSearchPage
          .toggleAccordion('#accordion-toggle-button-filter-packages-type')
          .clickFilter('type', 'ebook')
          .clearFilter('type');
      });

      it.always('removes the filter from the URL query params', function () {
        expect(this.location.search).to.not.include('filter[type]');
      });
    });

    describe('filtering by content type and closing the filter', () => {
      beforeEach(async () => {
        await PackageSearchPage.toggleAccordion('#accordion-toggle-button-filter-packages-type');
        await PackageSearchPage.clickFilter('type', 'ebook');
        await PackageSearchPage.searchBadge.clickIcon();
      });

      // TODO Refactor
      it.skip('closed the search pane', () => {
        expect(PackageSearchPage.isSearchPanePresent).to.be.false;
      });

      it('shows two filters in the badge', () => {
        expect(PackageSearchPage.searchBadge.filterText).to.equal('2');
      });
    });

    describe('filtering by selection status', () => {
      beforeEach(async () => {
        await PackageSearchPage.toggleAccordion('#accordion-toggle-button-filter-packages-selected');
        await PackageSearchPage.clickFilter('selected', 'true');
      });

      it('only shows results for selected packages', () => {
        expect(PackageSearchPage.packageList()).to.have.lengthOf(2);
        expect(PackageSearchPage.packageList(0).isSelected).to.be.true;
      });

      it('reflects the filter in the URL query params', function () {
        expect(this.location.search).to.include('filter[selected]=true');
      });
    });

    describe('filtering by selection status and clearing the filters', () => {
      beforeEach(async () => {
        await PackageSearchPage.toggleAccordion('#accordion-toggle-button-filter-packages-selected');
        await PackageSearchPage.clickFilter('selected', 'true');
        await PackageSearchPage.clearFilter('selected');
      });

      it.always('removes the filter from the URL query params', function () {
        expect(this.location.search).to.not.include('filter[selected]');
      });
    });


    describe('with a more specific query', () => {
      beforeEach(async () => {
        await PackageSearchPage.search('Package1');
      });

      it('only shows a single result', () => {
        expect(PackageSearchPage.packageList()).to.have.lengthOf(1);
      });
    });

    describe('clicking another search type', () => {
      beforeEach(async () => {
        await PackageSearchPage.packageList(0).click();
        await PackageSearchPage.changeSearchType('titles');
      });

      it('only shows one search type as selected', () => {
        expect(PackageSearchPage.selectedSearchType()).to.have.lengthOf(1);
      });

      it('displays an empty search', () => {
        expect(PackageSearchPage.titleSearchFieldValue).to.equal('');
      });

      it('does not display any more results', () => {
        expect(PackageSearchPage.hasResults).to.be.false;
      });

      it('does not show the preview pane', () => {
        expect(PackageSearchPage.titlePreviewPaneIsPresent).to.be.false;
      });
    });
    describe('clicking another search type and navigating back to packages search', () => {
      beforeEach(async () => {
        await PackageSearchPage.packageList(0).click();
        await PackageSearchPage.changeSearchType('titles');
        await PackageSearchPage.changeSearchType('packages');
      });

      it('displays the original search', () => {
        expect(PackageSearchPage.searchFieldValue).to.equal('Package');
      });

      it('displays the original search results', () => {
        expect(PackageSearchPage.packageList()).to.have.lengthOf(3);
      });

      it('shows the preview pane', () => {
        expect(PackageSearchPage.packagePreviewPaneIsPresent).to.be.true;
      });
    });
  });

  // TODO move test out as the previous visit without query params break the test
  describe.skip('visiting the page with an existing filter', () => {
    beforeEach(function () {
      this.visit('/eholdings?searchType=packages&q=Package&filter[type]=ejournal');
    });

    it('shows the existing filter in the search form', () => {
      expect(PackageSearchPage.getFilter('type')).to.equal('ejournal');
    });

    it('only shows results for e-journal content types', () => {
      expect(PackageSearchPage.packageList()).to.have.lengthOf(2);
    });
  });

  // TODO refactor Move up to avoid nested visits
  describe.skip('visiting the page with an existing tags filter', () => {
    beforeEach(async function () {
      const allTags = ['urgent', 'not urgent'];

      const urgentTag = await this.server.create('tags', {
        tagList: allTags.slice(0)
      }).toJSON();

      await this.server.create('package', {
        name: 'Test Urgent Tag',
        tags: urgentTag
      });

      await this.visit('/eholdings?searchType=packages&filter[tags]=urgent');
    });

    it('displays tags accordion as closed', () => {
      expect(PackageSearchPage.tagsSection.tagsAccordion.isOpen).to.equal(false);
    });

    describe('clicking to open tags accordion', () => {
      beforeEach(async () => {
        await PackageSearchPage.tagsSection.toggleSearchByTags();
        await PackageSearchPage.tagsSection.clickTagHeader();
      });

      it('displays tags accordion as expanded', () => {
        expect(PackageSearchPage.tagsSection.tagsAccordion.isOpen).to.be.true;
      });

      it('should display tags multiselect enabled', () => {
        expect(PackageSearchPage.tagsSection.tagsMultiselectIsDisabled).to.be.false;
      });

      it('search by tags tags checkbox should be checked', () => {
        expect(PackageSearchPage.tagsSection.tagsCheckboxIsChecked).to.be.true;
      });

      // TODO move the test out to avoid nested visits
      it.skip('should display selected value as urgent', () => {
        expect(PackageSearchPage.tagsSection.tagsSelect.values(0).valLabel).to.equal('urgent');
      });

      it('displays packages tagged as urgent', () => {
        expect(PackageSearchPage.packageList()).to.have.lengthOf(1);
        expect(PackageSearchPage.packageList(0).name).to.equal('Test Urgent Tag');
      });
    });
  });

  // TODO Refactor to move server setup before the page visit
  describe.skip('sorting packages', () => {
    beforeEach(async function () {
      await this.server.create('package', {
        name: 'Academic ASAP'
      });
      await this.server.create('package', {
        name: 'Search Networks'
      });
      await this.server.create('package', {
        name: 'Non Matching'
      });
      await this.server.create('package', {
        name: 'Academic Search Elite'
      });
      await this.server.create('package', {
        name: 'Academic Search Premier'
      });
    });

    describe('searching for packages', () => {
      beforeEach(async () => {
        await PackageSearchPage.search('academic search');
      });

      it('has search filters', () => {
        expect(PackageSearchPage.hasSearchFilters).to.be.true;
      });

      it('shows the default sort filter of relevance in the search form', () => {
        expect(PackageSearchPage.getFilter('sort')).to.equal('relevance');
      });

      it("displays package entries related to 'academic search'", () => {
        expect(PackageSearchPage.packageList()).to.have.lengthOf(4);
      });

      it('displays the packages sorted by relevance', () => {
        expect(PackageSearchPage.packageList(0).name).to.equal('Academic Search Elite');
        expect(PackageSearchPage.packageList(1).name).to.equal('Academic Search Premier');
        expect(PackageSearchPage.packageList(2).name).to.equal('Academic ASAP');
        expect(PackageSearchPage.packageList(3).name).to.equal('Search Networks');
      });

      it.always('does not reflect the default sort=relevance in url', function () {
        expect(this.location.search).to.not.include('sort=relevance');
      });
    });


    describe('searching for packages and then filtering by sort options', () => {
      beforeEach(async () => {
        await PackageSearchPage.search('academic search');
        await PackageSearchPage.toggleAccordion('#accordion-toggle-button-filter-packages-sort');
        await PackageSearchPage.clickFilter('sort', 'name');
      });

      it('displays the packages sorted by package name', () => {
        expect(PackageSearchPage.packageList(0).name).to.equal('Academic ASAP');
        expect(PackageSearchPage.packageList(1).name).to.equal('Academic Search Elite');
        expect(PackageSearchPage.packageList(2).name).to.equal('Academic Search Premier');
        expect(PackageSearchPage.packageList(3).name).to.equal('Search Networks');
      });

      it('shows the sort filter of name in the search form', () => {
        expect(PackageSearchPage.getFilter('sort')).to.equal('name');
      });

      it('reflects the sort in the URL query params', function () {
        expect(this.location.search).to.include('sort=name');
      });
    });

    describe('searching for packages and then filtering by sort options and then searching for other packages', () => {
      beforeEach(async () => {
        await PackageSearchPage.search('academic search');
        await PackageSearchPage.toggleAccordion('#accordion-toggle-button-filter-packages-sort');
        await PackageSearchPage.clickFilter('sort', 'name');
        await PackageSearchPage.search('search');
      });

      it('keeps the sort filter of name in the search form', () => {
        expect(PackageSearchPage.getFilter('sort')).to.equal('name');
      });

      it('displays the packages sorted by package name', () => {
        expect(PackageSearchPage.packageList(0).name).to.equal('Academic Search Elite');
        expect(PackageSearchPage.packageList(1).name).to.equal('Academic Search Premier');
        expect(PackageSearchPage.packageList(2).name).to.equal('Search Networks');
      });

      it('shows the sort filter of name in the search form', () => {
        expect(PackageSearchPage.getFilter('sort')).to.equal('name');
      });
    });

    describe('searching for packages and then filtering by sort options and then searching for other packages and then clicking another search type', () => {
      beforeEach(async () => {
        await PackageSearchPage
          .search('academic search')
          .toggleAccordion('#accordion-toggle-button-filter-packages-sort')
          .clickFilter('sort', 'name')
          .search('search')
          .changeSearchType('titles');
      });
      it('does not display any results', () => {
        expect(PackageSearchPage.hasResults).to.be.false;
      });
    });

    describe('searching for packages and then filtering by sort options and then searching for other packages and then clicking another search type navigating back to packages search', () => {
      beforeEach(async () => {
        await PackageSearchPage
          .search('academic search')
          .toggleAccordion('#accordion-toggle-button-filter-packages-sort')
          .clickFilter('sort', 'name')
          .search('search')
          .changeSearchType('titles')
          .changeSearchType('packages');
      });

      it('keeps the sort filter of name in the search form', () => {
        expect(PackageSearchPage.getFilter('sort')).to.equal('name');
      });

      it('displays the last results', () => {
        expect(PackageSearchPage.packageList()).to.have.lengthOf(3);
      });

      it('reflects the sort=name in the URL query params', function () {
        expect(this.location.search).to.include('sort=name');
      });
    });

    // TODO move test up to avoid nested visits
    describe.skip('visiting the page with an existing sort', () => {
      beforeEach(async function () {
        await this.visit('/eholdings/?searchType=packages&q=academic&sort=name');
        // the search pane is ending up hidden by default
        await PackageSearchPage.searchBadge.clickIcon();
      });

      it('displays search field populated', () => {
        expect(PackageSearchPage.searchFieldValue).to.equal('academic');
      });

      it('displays the sort filter of name as selected in the search form', () => {
        expect(PackageSearchPage.getFilter('sort')).to.equal('name');
      });

      it('displays the expected results', () => {
        expect(PackageSearchPage.packageList()).to.have.lengthOf(3);
      });

      it('displays results sorted by name', () => {
        expect(PackageSearchPage.packageList(0).name).to.equal('Academic ASAP');
        expect(PackageSearchPage.packageList(1).name).to.equal('Academic Search Elite');
        expect(PackageSearchPage.packageList(2).name).to.equal('Academic Search Premier');
      });
    });

    describe('clearing the search field', () => {
      beforeEach(async () => {
        await PackageSearchPage.fillSearch('');
      });

      it('has disabled search button', () => {
        expect(PackageSearchPage.isSearchDisabled).to.be.true;
      });
    });
  });

  // TODO refactor to move server setup before the page visit
  describe.skip('filtering packages by tags', () => {
    beforeEach(async function () {
      const allTags = ['urgent', 'not urgent'];

      const urgentTag = await this.server.create('tags', {
        tagList: allTags.slice(0)
      }).toJSON();

      await this.server.create('package', {
        name: 'Test Urgent Tag',
        tags: urgentTag
      });
    });

    it('displays tags accordion as closed', () => {
      expect(PackageSearchPage.tagsSection.tagsAccordion.isOpen).to.equal(false);
    });

    describe('clicking to open tags accordion', () => {
      beforeEach(async () => {
        await PackageSearchPage.tagsSection.clickTagHeader();
      });

      it('displays tags accordion as expanded', () => {
        expect(PackageSearchPage.tagsSection.tagsAccordion.isOpen).to.be.true;
      });

      it('should display tags multiselect disabled by default', () => {
        expect(PackageSearchPage.tagsSection.tagsMultiselectIsDisabled).to.be.true;
      });

      it('search by tags tags checkbox should be not checked', () => {
        expect(PackageSearchPage.tagsSection.tagsCheckboxIsChecked).to.be.false;
      });

      describe('and search by tags was enabled', () => {
        beforeEach(async () => {
          await PackageSearchPage.tagsSection.toggleSearchByTags();
        });

        it('search field should be disabled', () => {
          expect(PackageSearchPage.searchFieldIsDisabled).to.be.true;
        });

        it('should display tags multiselect enabled', () => {
          expect(PackageSearchPage.tagsSection.tagsMultiselectIsDisabled).to.be.false;
        });

        it('search by tags tags checkbox should be checked', () => {
          expect(PackageSearchPage.tagsSection.tagsCheckboxIsChecked).to.be.true;
        });

        describe('after click on urgent option', () => {
          beforeEach(async () => {
            await PackageSearchPage.tagsSection.tagsSelect.options(1).clickOption();
          });

          it('should display selected value as urgent', () => {
            expect(PackageSearchPage.tagsSection.tagsSelect.values(0).valLabel).to.equal('urgent');
          });

          it('displays packages tagged as urgent', () => {
            expect(PackageSearchPage.packageList()).to.have.lengthOf(1);
            expect(PackageSearchPage.packageList(0).name).to.equal('Test Urgent Tag');
          });

          it('should display the clear tag filter button', () => {
            expect(PackageSearchPage.tagsSection.hasClearTagFilter).to.be.true;
          });

          describe('clearing the filters', () => {
            beforeEach(async () => {
              await PackageSearchPage.tagsSection.clearTagFilter();
            });

            it('displays tag filter with empty value', () => {
              expect(PackageSearchPage.tagsSection.tagsSelect.values()).to.deep.equal([]);
            });

            it('displays no package results', () => {
              expect(PackageSearchPage.packageList()).to.have.lengthOf(0);
            });

            it.always('removes the filter from the URL query params', function () {
              expect(this.location.search).to.not.include('filter[tags]');
            });
          });
        });
      });
    });
  });

  // TODO refactor test to move server setup before the visit
  describe.skip('with multiple pages of packages', () => {
    beforeEach(async function () {
      await this.server.createList('package', 75, {
        name: i => `Other Package ${i + 1}`
      });
    });

    describe('searching for packages', () => {
      beforeEach(async () => {
        await PackageSearchPage.search('other');
      });

      it('shows the first page of results', () => {
        expect(PackageSearchPage.packageList(0).name).to.equal('Other Package 5');
      });

      describe('and then scrolling down', () => {
        beforeEach(async () => {
          await PackageSearchPage.when(() => PackageSearchPage.hasLoaded);
          await PackageSearchPage.scrollToOffset(26);
        });

        it('shows the next page of results', () => {
          // when the list is scrolled, it has a threshold of 5 items. index 4,
          // the 5th item, is the topmost visible item in the list
          expect(PackageSearchPage.packageList(4).name).to.equal('Other Package 30');
        });

        it('updates the offset in the URL', function () {
          expect(this.location.search).to.include('offset=26');
        });
      });
    });

    // TODO refactor to avoid nested visits
    describe.skip('navigating directly to a search page', () => {
      beforeEach(async function () {
        await this.visit('/eholdings/?searchType=packages&offset=51&q=other');
        await PackageSearchPage.whenLoaded();
      });

      it('should show the search results for that page', () => {
        // see comment above about packageList index number
        expect(PackageSearchPage.packageList(4).name).to.equal('Other Package 55');
      });

      it('should retain the proper offset', function () {
        expect(this.location.search).to.include('offset=51');
      });

      describe('and then scrolling up', () => {
        beforeEach(async () => {
          await PackageSearchPage.scrollToOffset(0);
        });

        it('shows the total results', () => {
          expect(PackageSearchPage.totalResults).to.equal('75 search results');
        });

        it('shows the prev page of results', () => {
          expect(PackageSearchPage.packageList(0).name).to.equal('Other Package 5');
        });

        it('updates the offset in the URL', function () {
          expect(this.location.search).to.include('offset=0');
        });
      });
    });
  });

  describe("searching for the package 'fhqwhgads'", () => {
    beforeEach(async () => {
      await PackageSearchPage.search('fhqwhgads');
    });

    it("displays 'no results' message", () => {
      expect(PackageSearchPage.noResultsMessage).to.equal("No packages found for 'fhqwhgads'.");
    });
  });

  describe('encountering a server error', () => {
    beforeEach(async function () {
      await this.server.get('/packages', {
        errors: [{
          title: 'There was an error'
        }]
      }, 500);

      await PackageSearchPage.search("this doesn't matter");
    });

    it('dies with dignity', () => {
      expect(PackageSearchPage.hasErrors).to.be.true;
    });
  });
});
