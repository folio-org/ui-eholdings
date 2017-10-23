/* global describe, beforeEach */
import { expect } from 'chai';
import it, { convergeOn } from './it-will';

import { describeApplication } from './helpers';
import VendorSearchPage from './pages/vendor-search';

describeApplication('VendorSearch', () => {
  beforeEach(function () {
    this.server.createList('vendor', 3, {
      vendorName: i => `Vendor${i + 1}`
    });

    this.server.create('vendor', {
      vendorName: 'Totally Awesome Co'
    });

    return this.visit('/eholdings/?searchType=vendors', () => {
      expect(VendorSearchPage.$searchResultsItems).to.have.lengthOf(4);
    });
  });

  it('has a searchbox', () => {
    expect(VendorSearchPage.$searchField).to.exist;
  });

  describe('searching for a vendor', () => {
    beforeEach(() => {
      VendorSearchPage.search('Vendor');
    });

    it("displays vendor entries related to 'Vendor'", () => {
      expect(VendorSearchPage.$searchResultsItems).to.have.lengthOf(3);
    });

    it('displays the name, number of packages available, and packages subscribed to for each vendor');

    describe('clicking a search results list item', () => {
      beforeEach(() => {
        return convergeOn(() => {
          // wait for the previous search to complete
          expect(VendorSearchPage.$searchResultsItems).to.have.lengthOf(3);
        }).then(() => VendorSearchPage.$searchResultsItems[0].click());
      });

      it('shows the preview pane', () => {
        expect(VendorSearchPage.previewPaneIsVisible).to.be.true;
      });
    });

    describe('filtering the search results further', () => {
      beforeEach(() => {
        VendorSearchPage.search('Vendor1');
      });

      it('only shows a single result', () => {
        expect(VendorSearchPage.$searchResultsItems).to.have.lengthOf(1);
      });
    });

    describe('clicking on a result', () => {
      it('shows vendor details');
      it('shows packages for vendor');
    });

    describe('sorting by name', () => {
      it('sorts by name');
    });

    describe('clicking another search type', () => {
      beforeEach(() => {
        return convergeOn(() => {
          // wait for the previous search to complete
          expect(VendorSearchPage.$searchResultsItems).to.have.lengthOf(3);
        }).then(() => VendorSearchPage.changeSearchType('packages'));
      });

      it('displays an empty search', () => {
        expect(VendorSearchPage.$searchField).to.have.value('');
      });

      it('does not display any more results', () => {
        expect(VendorSearchPage.$searchResultsItems).to.have.lengthOf(0);
      });

      describe('navigating back to vendors search', () => {
        beforeEach(() => {
          return VendorSearchPage.changeSearchType('vendors');
        });

        it('displays the original search', () => {
          expect(VendorSearchPage.$searchField).to.have.value('Vendor');
        });

        it('displays the original search results', () => {
          expect(VendorSearchPage.$searchResultsItems).to.have.lengthOf(3);
        });
      });
    });
  });

  describe("searching for the vendor 'fhqwhgads'", () => {
    beforeEach(() => {
      VendorSearchPage.search('fhqwhgads');
    });

    it("displays 'no results' message", () => {
      expect(VendorSearchPage.noResultsMessage).to.equal('No vendors found for "fhqwhgads".');
    });
  });

  describe('encountering a server error', () => {
    beforeEach(function () {
      this.server.get('/vendors', [{
        message: 'There was an error',
        code: '1000',
        subcode: 0
      }], 500);

      VendorSearchPage.search("this doesn't matter");
    });

    it('dies with dignity', () => {
      expect(VendorSearchPage.hasErrors).to.be.true;
    });
  });
});
