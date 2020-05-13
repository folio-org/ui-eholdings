import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import PackageSearchPage from '../interactors/package-search';
import PackageShowPage from '../interactors/package-show';

describe('PackageSearch', () => {
  setupApplication();
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

    this.visit('/eholdings/?searchType=packages');
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

  it('has a pre-results pane', () => {
    expect(PackageSearchPage.hasPreSearchPane).to.equal(true);
  });

  it('filter accordions should be collapsed by default', () => {
    expect(PackageSearchPage.tagsSection.tagsAccordion.isOpen).to.be.false;
    expect(PackageSearchPage.typeFilterAccordion.isOpen).to.be.false;
    expect(PackageSearchPage.sortFilterAccordion.isOpen).to.be.false;
    expect(PackageSearchPage.selectionFilterAccordion.isOpen).to.be.false;
  });

  describe('searching for a package', () => {
    beforeEach(() => {
      return PackageSearchPage.search('Package');
    });

    it('removes the pre-results pane', () => {
      expect(PackageSearchPage.hasPreSearchPane).to.equal(false);
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

    describe('collapse filter pane button', () => {
      it('is present while search pane is open', () => {
        expect(PackageSearchPage.isSearchPanePresent).to.be.true;
        expect(PackageSearchPage.collapseFilterPaneButton.isPresent).to.be.true;
      });

      it('does not show expand filter pane button with badge while search pane is open', () => {
        expect(PackageSearchPage.expandFilterPaneButton.isPresent).to.be.false;
      });

      describe('clicking on the search icon', () => {
        beforeEach(() => PackageSearchPage.collapseFilterPaneButton.click());

        it('closes the search pane', () => {
          expect(PackageSearchPage.isSearchPanePresent).to.be.false;
          expect(PackageSearchPage.collapseFilterPaneButton.isPresent).to.be.false;
        });

        it('shows expand filter pane button', () => {
          expect(PackageSearchPage.expandFilterPaneButton.isPresent).to.be.true;
        });

        it('shows the filter badge', () => {
          expect(PackageSearchPage.expandFilterPaneButton.badgeIsPresent).to.be.true;
        });

        it('shows 1 filter', () => {
          expect(PackageSearchPage.expandFilterPaneButton.badgeText).to.be.equal('1');
        });

        describe('click on the expand filter pane button', () => {
          beforeEach(() => PackageSearchPage.expandFilterPaneButton.clickIcon());

          it('opens the search pane', () => {
            expect(PackageSearchPage.isSearchPanePresent).to.be.true;
          });

          it('collapse fitlre pane button is present', () => {
            expect(PackageSearchPage.collapseFilterPaneButton.isPresent).to.be.true;
          });

          it('expand filter pane button does not present', () => {
            expect(PackageSearchPage.expandFilterPaneButton.isPresent).to.be.false;
          });
        });
      });
    });

    describe('collapse search and filter pane without applied filters', () => {
      beforeEach(async function () {
        this.visit('/eholdings/');
        await PackageSearchPage.collapseFilterPaneButton.click();
      });

      it('expand filter pane button displays without badge', () => {
        expect(PackageSearchPage.expandFilterPaneButton.badgeIsPresent).to.be.false;
      });
    });

    describe('clicking a search results list item', () => {
      beforeEach(() => {
        return PackageSearchPage.packageList(0).clickThrough();
      });

      it('redirects to the package show', () => {
        expect(PackageShowPage.isPresent).to.be.true;
      });

      it.skip('focuses the package name', () => {
        expect(PackageShowPage.nameHasFocus).to.be.true;
      });
    });

    describe('filtering by content type', () => {
      beforeEach(async () => {
        await PackageSearchPage.toggleAccordion('#accordion-toggle-button-filter-packages-type');
        await PackageSearchPage.clickFilter('type', 'ebook');
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

      describe('clearing the filters', () => {
        beforeEach(() => {
          return PackageSearchPage.clearFilter('type');
        });

        it.always('removes the filter from the URL query params', function () {
          expect(this.location.search).to.not.include('filter[type]');
        });
      });

      describe('closing the filter', () => {
        beforeEach(() => PackageSearchPage.collapseFilterPaneButton.click());

        it('closed the search pane', () => {
          expect(PackageSearchPage.isSearchPanePresent).to.be.false;
        });

        it('shows two filters in the badge', () => {
          expect(PackageSearchPage.expandFilterPaneButton.badgeText).to.equal('2');
        });
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

      describe('clearing the filters', () => {
        beforeEach(() => {
          return PackageSearchPage.clearFilter('selected');
        });

        it.always('removes the filter from the URL query params', function () {
          expect(this.location.search).to.not.include('filter[selected]');
        });
      });
    });

    describe('with a more specific query', () => {
      beforeEach(() => {
        return PackageSearchPage.search('Package1');
      });

      it('only shows a single result', () => {
        expect(PackageSearchPage.packageList()).to.have.lengthOf(1);
      });
    });
  });

  describe('visiting the page with an existing filter', () => {
    beforeEach(async function () {
      this.visit('/eholdings?searchType=packages&q=Package&filter[type]=ejournal');
    });

    it('shows the existing filter in the search form', () => {
      expect(PackageSearchPage.getFilter('type')).to.equal('ejournal');
    });

    it('only shows results for e-journal content types', () => {
      expect(PackageSearchPage.packageList()).to.have.lengthOf(2);
    });
  });

  describe('visiting the page with an existing tags filter', () => {
    beforeEach(function () {
      const allTags = ['urgent', 'not urgent'];

      const urgentTag = this.server.create('tags', {
        tagList: allTags.slice(0)
      }).toJSON();

      this.server.create('package', {
        name: 'Test Urgent Tag',
        tags: urgentTag
      });

      this.visit('/eholdings?searchType=packages&filter[tags]=urgent');
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

      it('should display tags multiselect enabled', () => {
        expect(PackageSearchPage.tagsSection.tagsMultiselectIsDisabled).to.be.false;
      });

      it('search by tags tags checkbox should be checked', () => {
        expect(PackageSearchPage.tagsSection.tagsCheckboxIsChecked).to.be.true;
      });

      it('should display selected value as urgent', () => {
        expect(PackageSearchPage.tagsSection.tagsSelect.values(0).valLabel).to.equal('urgent');
      });

      it('displays packages tagged as urgent', () => {
        expect(PackageSearchPage.packageList()).to.have.lengthOf(1);
        expect(PackageSearchPage.packageList(0).name).to.equal('Test Urgent Tag');
      });
    });
  });

  describe('visiting the page with an existing access status types filter', () => {
    beforeEach(function () {
      const accessType = this.server.create('access-type', {
        name: 'random'
      });

      this.server.create('package', {
        name: 'test package',
        accessTypeId: accessType.id
      });

      this.visit('/eholdings?searchType=packages&filter[access-type]=random');
    });

    it('displays access types accordion as closed', () => {
      expect(PackageSearchPage.accessStatusTypesSection.accessTypesAccordion.isOpen).to.equal(false);
    });

    describe('clicking to open access types accordion', () => {
      beforeEach(async () => {
        await PackageSearchPage.accessStatusTypesSection.clickAccordionHeader();
      });

      it('displays access types accordion as expanded', () => {
        expect(PackageSearchPage.accessStatusTypesSection.accessTypesAccordion.isOpen).to.be.true;
      });

      it('should display access types multiselect enabled', () => {
        expect(PackageSearchPage.accessStatusTypesSection.accessTypesSelectIsDisabled).to.be.false;
      });

      it('search by tags access types checkbox should be checked', () => {
        expect(PackageSearchPage.accessStatusTypesSection.filterCheckboxIsChecked).to.be.true;
      });

      it('should display selected value as random', () => {
        expect(PackageSearchPage.accessStatusTypesSection.accessTypesSelect.values(0).valLabel).to.equal('random');
      });

      it('displays packages with access status type "random"', () => {
        expect(PackageSearchPage.packageList()).to.have.lengthOf(1);
        expect(PackageSearchPage.packageList(0).name).to.equal('test package');
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
        return PackageSearchPage.search('academic search');
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

      describe('then filtering by sort options', () => {
        beforeEach(async () => {
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

        describe('then searching for other packages', () => {
          beforeEach(() => {
            return PackageSearchPage.search('search');
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

          describe('then clicking another search type', () => {
            beforeEach(() => {
              return PackageSearchPage.changeSearchType('titles');
            });

            it('does not display any results', () => {
              expect(PackageSearchPage.hasResults).to.be.false;
            });

            describe('navigating back to packages search', () => {
              beforeEach(() => {
                return PackageSearchPage.changeSearchType('packages');
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
          });
        });
      });
    });

    describe('visiting the page with an existing sort', () => {
      beforeEach(function () {
        this.visit('/eholdings/?searchType=packages&q=academic&sort=name');
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
      beforeEach(() => {
        return PackageSearchPage.fillSearch('');
      });

      it('has disabled search button', () => {
        expect(PackageSearchPage.isSearchDisabled).to.be.true;
      });
    });
  });

  describe('filtering packages by tags', () => {
    beforeEach(function () {
      const allTags = ['urgent', 'not urgent'];

      const urgentTag = this.server.create('tags', {
        tagList: allTags.slice(0)
      }).toJSON();

      this.server.create('package', {
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
            beforeEach(() => {
              return PackageSearchPage.tagsSection.clearTagFilter();
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

  describe('with multiple pages of packages', () => {
    beforeEach(function () {
      this.server.createList('package', 75, {
        name: i => `Other Package ${i + 1}`
      });
    });

    describe('searching for packages', () => {
      beforeEach(() => {
        return PackageSearchPage.search('other');
      });

      it('shows the first page of results', () => {
        expect(PackageSearchPage.packageList(0).name).to.equal('Other Package 5');
      });

      describe('and then scrolling down', () => {
        beforeEach(() => {
          return PackageSearchPage
            .when(() => PackageSearchPage.hasLoaded)
            .scrollToOffset(26);
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

    describe('navigating directly to a search page', () => {
      beforeEach(function () {
        this.visit('/eholdings/?searchType=packages&offset=51&q=other');
      });

      it('should show the search results for that page', () => {
        // see comment above about packageList index number
        expect(PackageSearchPage.packageList(4).name).to.equal('Other Package 55');
      });

      it('should retain the proper offset', function () {
        expect(this.location.search).to.include('offset=51');
      });

      describe('and then scrolling up', () => {
        beforeEach(() => {
          return PackageSearchPage.scrollToOffset(0);
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
    beforeEach(() => {
      return PackageSearchPage.search('fhqwhgads');
    });

    it("displays 'no results' message", () => {
      expect(PackageSearchPage.noResultsMessage).to.equal("No packages found for 'fhqwhgads'.");
    });
  });

  describe('encountering a server error', () => {
    beforeEach(function () {
      this.server.get('/packages', {
        errors: [{
          title: 'There was an error'
        }]
      }, 500);

      return PackageSearchPage.search("this doesn't matter");
    });

    it('dies with dignity', () => {
      expect(PackageSearchPage.hasErrors).to.be.true;
    });
  });
});
