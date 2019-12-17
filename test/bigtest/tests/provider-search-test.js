import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import ProviderSearchPage from '../interactors/provider-search';
import ProviderShowPage from '../interactors/provider-show';
import PackageShowPage from '../interactors/package-show';

describe('ProviderSearch', function () {
  setupApplication({
    scenarios: ['providerSearch']
  });

  beforeEach(async function () {
    this.visit('/eholdings/?searchType=providers');
    await ProviderSearchPage.whenLoaded();
  });

  it('has a searchbox', () => {
    expect(ProviderSearchPage.hasSearchField).to.be.true;
  });

  it('has disabled search button', () => {
    expect(ProviderSearchPage.isSearchButtonDisabled).to.equal(true);
  });

  it('has tag filter', () => {
    expect(ProviderSearchPage.hasTagFilter).to.equal(true);
  });

  it('search field should be enabled', () => {
    expect(ProviderSearchPage.searchFieldIsDisabled).to.be.false;
  });

  it('has a pre-results pane', () => {
    expect(ProviderSearchPage.hasPreSearchPane).to.equal(true);
  });

  it('filter accordions should be collapsed by default', () => {
    expect(ProviderSearchPage.tagsSection.tagsAccordion.isOpen).to.be.false;
    expect(ProviderSearchPage.sortFilterAccordion.isOpen).to.be.false;
  });

  describe('searching for a provider', () => {
    beforeEach(async () => {
      await ProviderSearchPage.search('Provider');
    });

    it('removes the pre-results pane', () => {
      expect(ProviderSearchPage.hasPreSearchPane).to.equal(false);
    });

    it.skip('focuses on the search pane title', () => {
      expect(ProviderSearchPage.paneTitleHasFocus).to.be.true;
    });

    it("displays provider entries related to 'Provider'", () => {
      expect(ProviderSearchPage.providerList()).to.have.lengthOf(3);
    });

    it('displays the provider name in the list', () => {
      expect(ProviderSearchPage.providerList(0).name).to.equal('Provider1');
    });

    it('displays the number of selected packages for a provider in the list', () => {
      expect(ProviderSearchPage.providerList(0).numPackagesSelected).to.equal('1');
    });

    it('displays the total number of packages for a provider in the list', () => {
      expect(ProviderSearchPage.providerList(0).numPackages).to.equal('3');
    });

    it('displays a loading indicator where the total results will be', () => {
      expect(ProviderSearchPage.totalResults).to.equal('Loading...');
    });

    it('displays the total number of search results', () => {
      expect(ProviderSearchPage.totalResults).to.equal('3 search results');
    });

    describe('clicking a search results list item', () => {
      beforeEach(async () => {
        await ProviderSearchPage.providerList(0).clickThrough();
      });

      it('clicked item has an active state', () => {
        expect(ProviderSearchPage.providerList(0).isActive).to.be.true;
      });

      it('shows the preview pane', () => {
        expect(ProviderSearchPage.providerPreviewPaneIsPresent).to.be.true;
      });

      it.skip('focuses the provider name', () => {
        expect(ProviderShowPage.nameHasFocus).to.be.true;
      });

      it('should not display back button in UI', () => {
        expect(ProviderSearchPage.hasBackButton).to.be.false;
      });

      describe('conducting a new search', () => {
        beforeEach(async () => {
          await ProviderSearchPage.search('Totally Awesome Co');
        });

        it('displays the total number of search results', () => {
          expect(ProviderSearchPage.totalResults).to.equal('1 search result');
        });

        it('removes the preview detail pane', () => {
          expect(ProviderSearchPage.providerPreviewPaneIsPresent).to.be.false;
        });

        it('preserves the last history entry', function () {
          // this is a check to make sure duplicate entries are not added
          // to the history. Ensuring the back button works as expected
          const history = this.app.props.history;
          expect(history.entries[history.index - 1].search).to.include('q=Provider');
        });
      });

      describe('clicking the close button on the preview pane', () => {
        beforeEach(async () => {
          await ProviderSearchPage.clickCloseButton();
        });

        it('hides the preview pane', () => {
          expect(ProviderSearchPage.providerPreviewPaneIsPresent).to.be.false;
        });

        it('displays the original search', () => {
          expect(ProviderSearchPage.searchFieldValue).to.equal('Provider');
        });

        it('displays the original search results', () => {
          expect(ProviderSearchPage.providerList()).to.have.lengthOf(3);
        });

        it.skip('focuses the last active item', () => {
          expect(ProviderSearchPage.providerList(0).isActive).to.be.false;
          expect(ProviderSearchPage.providerList(0).hasFocus).to.be.true;
        });
      });

      describe('clicking an item within the preview pane', () => {
        beforeEach(async () => {
          await ProviderSearchPage.providerPackageList(0).clickToPackage();
        });

        it('hides the search UI', () => {
          expect(ProviderSearchPage.isPresent).to.be.false;
        });

        it.skip('focuses the package name', () => {
          expect(PackageShowPage.nameHasFocus).to.be.true;
        });

        describe('and clicking the back button', () => {
          beforeEach(async () => {
            await PackageShowPage.clickBackButton();
          });

          it('displays the original search', () => {
            expect(ProviderSearchPage.searchFieldValue).to.equal('Provider');
          });

          it('displays the original search results', () => {
            expect(ProviderSearchPage.providerList()).to.have.lengthOf(3);
          });

          it.skip('focuses the provider name', () => {
            expect(ProviderShowPage.nameHasFocus).to.be.true;
          });
        });
      });
    });

    describe('filtering the search results further', () => {
      beforeEach(async () => {
        await ProviderSearchPage.search('Provider1');
      });

      it('only shows a single result', () => {
        expect(ProviderSearchPage.providerList()).to.have.lengthOf(1);
      });
    });

    describe('clicking another search type', () => {
      beforeEach(async () => {
        await ProviderSearchPage.providerList(0).clickThrough();
        await ProviderSearchPage.changeSearchType('packages');
      });

      it('only shows one search type as selected', () => {
        expect(ProviderSearchPage.selectedSearchType()).to.have.lengthOf(1);
      });

      it('displays an empty search', () => {
        expect(ProviderSearchPage.searchFieldValue).to.equal('');
      });

      it('does not display any more results', () => {
        expect(ProviderSearchPage.providerList()).to.have.lengthOf(0);
      });

      it('does not show the preview pane', () => {
        expect(ProviderSearchPage.packagePreviewPaneIsPresent).to.be.false;
      });

      describe('navigating back to providers search', () => {
        beforeEach(async () => {
          await ProviderSearchPage.changeSearchType('providers');
        });

        it('displays the original search', () => {
          expect(ProviderSearchPage.searchFieldValue).to.equal('Provider');
        });

        it('displays the original search results', () => {
          expect(ProviderSearchPage.providerList()).to.have.lengthOf(3);
        });

        it('shows the preview pane', () => {
          expect(ProviderSearchPage.providerPreviewPaneIsPresent).to.be.true;
        });
      });
    });
  });

  describe("searching for the provider 'fhqwhgads'", () => {
    beforeEach(async () => {
      await ProviderSearchPage.search('fhqwhgads');
    });

    it("displays 'no results' message", () => {
      expect(ProviderSearchPage.noResultsMessage).to.equal("No providers found for 'fhqwhgads'.");
    });
  });
});

describe('ProviderSearch encountering a server error', () => {
  setupApplication({
    scenarios: ['providerSearchError']
  });

  beforeEach(async function () {
    this.visit('/eholdings/?searchType=providers');
    await ProviderSearchPage.whenLoaded();
    await ProviderSearchPage.search("this doesn't matter");
  });

  it('shows an error', () => {
    expect(ProviderSearchPage.hasErrors).to.be.true;
  });

  it('displays the error message returned from the server', () => {
    expect(ProviderSearchPage.errorMessage).to.equal('There was an error');
  });
});

describe('ProviderSearch with multiple pages of providers', () => {
  setupApplication({
    scenarios: ['providerSearchMultipleProviderPages']
  });

  beforeEach(async function () {
    this.visit('/eholdings/?searchType=providers');
    await ProviderSearchPage.whenLoaded();
  });

  describe('searching for providers', () => {
    beforeEach(async () => {
      await ProviderSearchPage.search('other');
    });

    it('shows the first page of results', () => {
      expect(ProviderSearchPage.providerList(0).name).to.equal('Other Provider 5');
    });

    describe('and then scrolling down', () => {
      beforeEach(async () => {
        await ProviderSearchPage
          .when(() => ProviderSearchPage.hasLoaded)
          .do(() => ProviderSearchPage.scrollToOffset(26));
      });

      it('shows the next page of results', () => {
        // when the list is scrolled, it has a threshold of 5 items. index 4,
        // the 5th item, is the topmost visible item in the list
        expect(ProviderSearchPage.providerList(4).name).to.equal('Other Provider 30');
      });

      it('updates the offset in the URL', function () {
        expect(this.location.search).to.include('offset=26');
      });
    });
  });
});

describe('ProviderSearch with multiple pages of providers navigating directly to a search page', () => {
  setupApplication({
    scenarios: ['providerSearchMultipleProviderPages']
  });

  beforeEach(async function () {
    this.visit('/eholdings/?searchType=providers&offset=51&q=other');
    await ProviderSearchPage.whenLoaded();
  });

  it('should show the search results for that page', () => {
    // see comment above about providerList index number
    expect(ProviderSearchPage.providerList(4).name).to.equal('Other Provider 55');
  });

  it('should retain the proper offset', function () {
    expect(this.location.search).to.include('offset=51');
  });

  describe('and then scrolling up', () => {
    beforeEach(async () => {
      await ProviderSearchPage.scrollToOffset(0);
    });

    it('shows the total results', () => {
      expect(ProviderSearchPage.totalResults).to.equal('75 search results');
    });

    it('shows the prev page of results', () => {
      expect(ProviderSearchPage.providerList(0).name).to.equal('Other Provider 5');
    });

    it('updates the offset in the URL', function () {
      expect(this.location.search).to.include('offset=0');
    });
  });
});

describe('ProviderSearch filtering providers by tags', () => {
  setupApplication({
    scenarios: ['providerSearchFilteringByTags']
  });

  beforeEach(async function () {
    this.visit('/eholdings/?searchType=providers');
    await ProviderSearchPage.whenLoaded();
  });

  it('displays tags accordion as closed', () => {
    expect(ProviderSearchPage.tagsSection.tagsAccordion.isOpen).to.equal(false);
  });

  describe('clicking to open tags accordion', () => {
    beforeEach(async () => {
      await ProviderSearchPage.tagsSection.clickTagHeader();
    });

    it('displays tags accordion as expanded', () => {
      expect(ProviderSearchPage.tagsSection.tagsAccordion.isOpen).to.be.true;
    });

    it('displays tag filter with available options', () => {
      expect(ProviderSearchPage.tagsSection.tagsSelect.optionCount).to.equal(2);
      expect(ProviderSearchPage.tagsSection.tagsSelect.options(0).label).to.equal('not urgent');
      expect(ProviderSearchPage.tagsSection.tagsSelect.options(1).label).to.equal('urgent');
    });

    it('displays tag filter with empty value', () => {
      expect(ProviderSearchPage.tagsSection.tagsSelect.values()).to.deep.equal([]);
    });

    describe('and search by tags was enabled', () => {
      beforeEach(async () => {
        await ProviderSearchPage.tagsSection.toggleSearchByTags();
      });

      it('search field should be disabled', () => {
        expect(ProviderSearchPage.searchFieldIsDisabled).to.be.true;
      });

      it('should display tags multiselect enabled', () => {
        expect(ProviderSearchPage.tagsSection.tagsMultiselectIsDisabled).to.be.false;
      });

      it('search by tags tags checkbox should be checked', () => {
        expect(ProviderSearchPage.tagsSection.tagsCheckboxIsChecked).to.be.true;
      });

      describe('after click on urgent option', () => {
        beforeEach(async () => {
          await ProviderSearchPage.tagsSection.tagsSelect.options(1).clickOption();
        });

        it('should display selected value as urgent', () => {
          expect(ProviderSearchPage.tagsSection.tagsSelect.values(0).valLabel).to.equal('urgent');
        });

        it('displays providers tagged as urgent', () => {
          expect(ProviderSearchPage.providerList()).to.have.lengthOf(2);
          expect(ProviderSearchPage.providerList(0).name).to.equal('Test Both Tags');
          expect(ProviderSearchPage.providerList(1).name).to.equal('Test Urgent Tag');
        });

        describe('after click on non urgent option', () => {
          beforeEach(async () => {
            await ProviderSearchPage.tagsSection.tagsSelect.options(0).clickOption();
          });
          it('should display selected values of not urgent and urgent', () => {
            expect(ProviderSearchPage.tagsSection.tagsSelect.values(0).valLabel).to.equal('not urgent');
            expect(ProviderSearchPage.tagsSection.tagsSelect.values(1).valLabel).to.equal('urgent');
          });

          it('displays providers tagged as urgent and non urgent', () => {
            expect(ProviderSearchPage.providerList()).to.have.lengthOf(3);
            expect(ProviderSearchPage.providerList(0).name).to.equal('Test Both Tags');
            expect(ProviderSearchPage.providerList(1).name).to.equal('Test Not Urgent Tag');
            expect(ProviderSearchPage.providerList(2).name).to.equal('Test Urgent Tag');
          });

          it('should display the clear tag filter button', () => {
            expect(ProviderSearchPage.tagsSection.hasClearTagFilter).to.be.true;
          });

          describe('removing not urgent tag filter', () => {
            beforeEach(async () => {
              await ProviderSearchPage.tagsSection.tagsSelect.values(0).clickRemoveButton();
            });

            it('should display selected values of urgent', () => {
              expect(ProviderSearchPage.tagsSection.tagsSelect.values(0).valLabel).to.equal('urgent');
            });

            it('displays providers tagged as urgent', () => {
              expect(ProviderSearchPage.providerList()).to.have.lengthOf(2);
              expect(ProviderSearchPage.providerList(0).name).to.equal('Test Both Tags');
              expect(ProviderSearchPage.providerList(1).name).to.equal('Test Urgent Tag');
            });

            describe('clearing the filters', () => {
              beforeEach(async () => {
                await ProviderSearchPage.tagsSection.clearTagFilter();
              });

              it('displays tag filter with empty value', () => {
                expect(ProviderSearchPage.tagsSection.tagsSelect.values()).to.deep.equal([]);
              });

              it('displays no provider results', () => {
                expect(ProviderSearchPage.providerList()).to.have.lengthOf(0);
              });

              it.always('removes the filter from the URL query params', function () {
                expect(this.location.search).to.not.include('filter[tags]');
              });
            });
          });
        });
      });
    });
  });
});

describe('ProviderSearch sorting providers', () => {
  setupApplication({
    scenarios: ['providerSearchSorting']
  });

  beforeEach(async function () {
    this.visit('/eholdings/?searchType=providers');
    await ProviderSearchPage.whenLoaded();
  });

  describe('searching for providers', () => {
    beforeEach(async () => {
      await ProviderSearchPage.search('health analytics');
      await ProviderSearchPage.when(() => ProviderSearchPage.hasLoaded);
    });

    it('has search filters', () => {
      expect(ProviderSearchPage.hasSearchFilters).to.be.true;
    });

    it('shows the default sort filter of relevance in the search form', () => {
      expect(ProviderSearchPage.sortBy).to.equal('relevance');
    });

    // TODO falling on CI
    it("displays provider entries related to 'health analytics'", () => {
      expect(ProviderSearchPage.providerList()).to.have.lengthOf(4);
    });

    it('displays the providers sorted by relevance', () => {
      expect(ProviderSearchPage.providerList(0).name).to.equal('My Health Analytics 2');
      expect(ProviderSearchPage.providerList(1).name).to.equal('My Health Analytics 10');
      expect(ProviderSearchPage.providerList(2).name).to.equal('Analytics for everyone');
      expect(ProviderSearchPage.providerList(3).name).to.equal('Health Associations');
    });

    it.always('does not reflect the default sort=relevance in url', function () {
      expect(this.location.search).to.not.include('sort=relevance');
    });
  });

  describe('searching for providers and then filtering by sort options', () => {
    beforeEach(async () => {
      await ProviderSearchPage.search('health analytics');
      await ProviderSearchPage.toggleAccordion('#accordion-toggle-button-filter-providers-sort');
      await ProviderSearchPage.clickFilter('sort', 'name');
    });
    it('displays the providers sorted by provider name', () => {
      expect(ProviderSearchPage.providerList(0).name).to.equal('Analytics for everyone');
      expect(ProviderSearchPage.providerList(1).name).to.equal('Health Associations');
      expect(ProviderSearchPage.providerList(2).name).to.equal('My Health Analytics 2');
      expect(ProviderSearchPage.providerList(3).name).to.equal('My Health Analytics 10');
    });

    it('shows the sort filter of name in the search form', () => {
      expect(ProviderSearchPage.sortBy).to.equal('name');
    });

    it('reflects the sort in the URL query params', function () {
      expect(this.location.search).to.include('sort=name');
    });

    it.skip('shows search filters on smaller screen sizes (due to filter change only)', () => {
      expect(ProviderSearchPage.isSearchVignetteHidden).to.equal(false);
    });
  });

  describe('searching for providers and then filtering by sort options then searching for other providers then clicking another search type', () => {
    beforeEach(async () => {
      await ProviderSearchPage.search('health analytics');
      await ProviderSearchPage.toggleAccordion('#accordion-toggle-button-filter-providers-sort');
      await ProviderSearchPage.clickFilter('sort', 'name');
      await ProviderSearchPage.search('analytics');
      await ProviderSearchPage.changeSearchType('packages');
    });
    it('does not display any results', () => {
      expect(ProviderSearchPage.providerList()).to.have.lengthOf(0);
    });
  });

  describe('searching for providers and then filtering by sort options then searching for other providers then clicking another search type navigating back to providers search', () => {
    beforeEach(async () => {
      await ProviderSearchPage.search('health analytics');
      await ProviderSearchPage.toggleAccordion('#accordion-toggle-button-filter-providers-sort');
      await ProviderSearchPage.clickFilter('sort', 'name');
      await ProviderSearchPage.search('analytics');
      await ProviderSearchPage.changeSearchType('packages');
      await ProviderSearchPage.changeSearchType('providers');
    });
    it('keeps the sort filter of name in the search form', () => {
      expect(ProviderSearchPage.sortBy).to.equal('name');
    });

    it('displays the last results', () => {
      expect(ProviderSearchPage.providerList()).to.have.lengthOf(3);
    });

    it('reflects the sort=name in the URL query params', function () {
      expect(this.location.search).to.include('sort=name');
    });
  });

  describe('clearing the search field', () => {
    beforeEach(async () => {
      await ProviderSearchPage.clearSearch();
    });

    it('has disabled search button', () => {
      expect(ProviderSearchPage.isSearchButtonDisabled).to.equal(true);
    });
  });

  describe('selecting a filter without a value in the search field', () => {
    beforeEach(async () => {
      await ProviderSearchPage.toggleAccordion('#accordion-toggle-button-filter-providers-sort');
      await ProviderSearchPage.clickFilter('sort', 'name');
    });

    it('should not perform an empty search', () => {
      expect(ProviderSearchPage.hasPreSearchPane).to.be.true;
    });

    describe('then adding a search term', () => {
      beforeEach(async () => {
        await ProviderSearchPage.search('health');
      });

      it('should apply selected filter to the results', () => {
        expect(ProviderSearchPage.providerList(0).name).to.equal('Health Associations');
        expect(ProviderSearchPage.providerList(1).name).to.equal('My Health Analytics 2');
        expect(ProviderSearchPage.providerList(2).name).to.equal('My Health Analytics 10');
      });
    });
  });
});

describe('ProviderSearch sorting providers visiting the page with an existing sort', () => {
  setupApplication({
    scenarios: ['providerSearchSorting']
  });

  beforeEach(async function () {
    this.visit('/eholdings/?searchType=providers&q=health&sort=name');
    await ProviderSearchPage.whenLoaded();
    await ProviderSearchPage.searchBadge.clickIcon();
  });

  it('displays search field populated', () => {
    expect(ProviderSearchPage.searchFieldValue).to.equal('health');
  });

  it('displays the sort filter of name as selected in the search form', () => {
    expect(ProviderSearchPage.sortBy).to.equal('name');
  });

  it('displays the expected results', () => {
    expect(ProviderSearchPage.providerList()).to.have.lengthOf(3);
  });

  it('displays results sorted by name', () => {
    expect(ProviderSearchPage.providerList(0).name).to.equal('Health Associations');
    expect(ProviderSearchPage.providerList(1).name).to.equal('My Health Analytics 2');
    expect(ProviderSearchPage.providerList(2).name).to.equal('My Health Analytics 10');
  });
});
