import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import TitleSearchPage from '../interactors/title-search';

describe('TitleSearch', () => {
  setupApplication();
  let titles;
  let trialAccessType;
  let subscriptionAccessType;

  // Odd indexed items are assigned alternate attributes targeted in specific filtering tests
  beforeEach(function () {
    titles = this.server.createList('title', 3, 'withPackages', 'withSubjects', 'withIdentifiers', 'withContributors', {
      name: i => `Title${i + 1}`,
      publicationType: i => (i % 2 ? 'book' : 'journal'),
      publisherName: i => (i % 2 ? 'TestPublisher' : 'Default Publisher'),
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

    this.server.create('title', {
      name: 'SomethingSomethingWhoa'
    });

    trialAccessType = this.server.create('access-type', {
      name: 'Trial',
    });
    subscriptionAccessType = this.server.create('access-type', {
      name: 'Subscription',
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
    expect(TitleSearchPage.accessTypesSection.accessTypesAccordion.isOpen).to.be.false;
    expect(TitleSearchPage.typeFilterAccordion.isOpen).to.be.false;
    expect(TitleSearchPage.sortFilterAccordion.isOpen).to.be.false;
    expect(TitleSearchPage.selectionFilterAccordion.isOpen).to.be.false;
  });


  describe('searching for a title', () => {
    beforeEach(() => {
      return TitleSearchPage.search('Title');
    });

    it('removes the pre-results pane', () => {
      expect(TitleSearchPage.hasPreSearchPane).to.equal(false);
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

    it('displays the contrigutors of a title', () => {
      expect(TitleSearchPage.titleList(0).contributorsList).to.equal('Contributor0; Contributor1; Contributor2');
    });

    it('displays the identifiers list of a title', () => {
      expect(TitleSearchPage.titleList(0).identifiersList).to.equal('ISBN (Online): 0, 1, 2');
    });

    it('displays a loading indicator where the total results will be', () => {
      expect(TitleSearchPage.totalResults).to.equal('Loading...');
    });

    it('displays the total number of search results', () => {
      expect(TitleSearchPage.totalResults).to.equal('3 search results');
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

    describe('changing search fields', () => {
      beforeEach(() => {
        return TitleSearchPage.selectSearchField('subject');
      });

      it('maintains the previous search', () => {
        expect(TitleSearchPage.searchFieldValue).to.equal('Title');
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

    describe('selecting both a search field and a search filter', () => {
      beforeEach(async () => {
        await TitleSearchPage.selectSearchField('isxn');
        await TitleSearchPage.toggleAccordion('#accordion-toggle-button-filter-titles-type');
        await TitleSearchPage.clickFilter('type', 'book');
        await TitleSearchPage.search('999-999');
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

  describe('visiting the page with an existing type filter', () => {
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

  describe('visiting the page with an existing selection filter', () => {
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

  describe('visiting the page with an existing tags filter', () => {
    beforeEach(async function () {
      this.visit('/eholdings?searchType=titles&filter[tags]=urgent');
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

  describe('visiting the page with an existing access types filter', () => {
    beforeEach(async function () {
      await this.visit('/eholdings?searchType=titles&filter[access-type]=Trial');
    });

    it('displays access types accordion as closed', () => {
      expect(TitleSearchPage.accessTypesSection.accessTypesAccordion.isOpen).to.equal(false);
    });

    describe('clicking to open access types accordion', () => {
      beforeEach(async () => {
        await TitleSearchPage.accessTypesSection.clickAccessTypesHeader();
      });

      it('displays access types accordion as expanded', () => {
        expect(TitleSearchPage.accessTypesSection.accessTypesAccordion.isOpen).to.be.true;
      });

      it('should display access types multiselect enabled', () => {
        expect(TitleSearchPage.accessTypesSection.accessTypesMultiselectIsDisabled).to.be.false;
      });

      it('search by access types checkbox should be checked', () => {
        expect(TitleSearchPage.accessTypesSection.accessTypesCheckboxIsChecked).to.be.true;
      });

      it('should display selected value as Trial', () => {
        expect(TitleSearchPage.accessTypesSection.accessTypesSelect.values(0).valLabel).to.equal('Trial');
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
        beforeEach(async () => {
          await TitleSearchPage.toggleAccordion('#accordion-toggle-button-filter-titles-sort');
          await TitleSearchPage.clickFilter('sort', 'name');
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
      beforeEach(async () => {
        await TitleSearchPage.toggleAccordion('#accordion-toggle-button-filter-titles-sort');
        await TitleSearchPage.clickFilter('sort', 'name');
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

      const title = this.server.create('title', 'withPackages', {
        name: 'Test Urgent Tag',
      });

      const taggedResource = title.resources.models[0];

      taggedResource.tags = urgentTag;
      taggedResource.save();
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

      it('should display tags multiselect disabled by default', () => {
        expect(TitleSearchPage.tagsSection.tagsMultiselectIsDisabled).to.be.true;
      });

      it('search by tags tags checkbox should be not checked', () => {
        expect(TitleSearchPage.tagsSection.tagsCheckboxIsChecked).to.be.false;
      });

      describe('and search by tags was enabled', () => {
        beforeEach(async () => {
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
  });

  describe('filtering title by access types', () => {
    beforeEach(function () {
      const trialTitle = this.server.create('title', 'withPackages', {
        name: 'Test Trial Title',
      });
      const subscriptionTitle = this.server.create('title', 'withPackages', {
        name: 'Test Subscription Title',
      });

      trialTitle.resources.models[0].accessType = trialAccessType;
      trialTitle.resources.models[0].save();

      subscriptionTitle.resources.models[0].accessType = subscriptionAccessType;
      subscriptionTitle.resources.models[0].save();
    });

    describe('when clicking on access type header', () => {
      beforeEach(async () => {
        await TitleSearchPage.accessTypesSection.clickAccessTypesHeader();
      });

      it('displays access types accordion as expanded', () => {
        expect(TitleSearchPage.accessTypesSection.accessTypesAccordion.isOpen).to.be.true;
      });

      it('should display tags multiselect disabled by default', () => {
        expect(TitleSearchPage.accessTypesSection.accessTypesMultiselectIsDisabled).to.be.true;
      });

      it('search by tags tags checkbox should be not checked', () => {
        expect(TitleSearchPage.accessTypesSection.accessTypesCheckboxIsChecked).to.be.false;
      });

      describe('and search by access types was enabled', () => {
        beforeEach(async () => {
          await TitleSearchPage.accessTypesSection.toggleSearchByAccessTypes();
        });

        it('search field should be disabled', () => {
          expect(TitleSearchPage.searchFieldIsDisabled).to.be.true;
        });

        it('should display access types multiselect enabled', () => {
          expect(TitleSearchPage.accessTypesSection.accessTypesMultiselectIsDisabled).to.be.false;
        });

        it('search by tags tags checkbox should be checked', () => {
          expect(TitleSearchPage.accessTypesSection.accessTypesCheckboxIsChecked).to.be.true;
        });

        describe('after selecting "Trial" access type', () => {
          beforeEach(async () => {
            await TitleSearchPage.accessTypesSection.accessTypesSelect.options(0).clickOption();
          });

          it('should display selected value as "Trial"', () => {
            expect(TitleSearchPage.accessTypesSection.accessTypesSelect.values(0).valLabel).to.equal('Trial');
          });

          it('displays titles with access type "Trial"', () => {
            expect(TitleSearchPage.titleList()).to.have.lengthOf(1);
            expect(TitleSearchPage.titleList(0).name).to.equal('Test Trial Title');
          });

          it('should display the clear access type filter button', () => {
            expect(TitleSearchPage.accessTypesSection.hasClearAccessTypesFilter).to.be.true;
          });

          describe('after selecting "Subscription" access type', () => {
            beforeEach(async () => {
              await TitleSearchPage.accessTypesSection.accessTypesSelect.options(1).clickOption();
            });

            it('should display selected value as "Subscription"', () => {
              expect(TitleSearchPage.accessTypesSection.accessTypesSelect.values(0).valLabel).to.equal('Subscription');
            });

            it('displays titles with access type "Trial" and "Subscription"', () => {
              expect(TitleSearchPage.titleList()).to.have.lengthOf(2);

              const names = [TitleSearchPage.titleList(0).name, TitleSearchPage.titleList(1).name];
              expect(names).to.have.members(['Test Trial Title', 'Test Subscription Title']);
            });
          });

          describe('clearing the filters', () => {
            beforeEach(async () => {
              await TitleSearchPage.accessTypesSection.clearAccessTypesFilter();
            });

            it('displays access types filter with empty value', () => {
              expect(TitleSearchPage.accessTypesSection.accessTypesSelect.values()).to.deep.equal([]);
            });

            it('displays no title results', () => {
              expect(TitleSearchPage.titleList()).to.have.lengthOf(0);
            });

            it('removes the filter from the URL query params', function () {
              expect(this.location.search).to.not.include('filter[access-type]');
            });
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
