/* global describe, beforeEach */
import { expect } from 'chai';
import $ from 'jquery';
import sinon from 'sinon';
import it from './it-will';

import {
  describeApplication,
  triggerChange
} from './helpers';

describeApplication('eHoldings', function() {
  beforeEach(function() {
    this.server.create('vendor', { vendorName: 'Vendor1' });
    this.server.create('vendor', { vendorName: 'Vendor2' });
    this.server.create('vendor', { vendorName: 'Vendor3' });
  });

  it('should render the app', function() {
    expect($('h1')).to.have.text('Folio Resource Management');
  });

  it('has a searchbox with options to search for vendor, package and title', function() {
    expect($('[data-test-search-field]')).to.exist;
  });

  describe("searching for a vendor", function() {
    beforeEach(function() {
      let $input = $('[data-test-search-field]').val('Vendor');
      triggerChange($input.get(0));

      $('[data-test-search-submit]').trigger('click');
    });

    it("displays vendor entries related to 'Vendor'", function() {
      expect($('[data-test-search-results-item]')).to.have.lengthOf(3);
    });

    it("displays the name, number of packages available, and packages subscribed to for each vendor");

    describe("filtering the search results further", function() {
      beforeEach(function() {
        let $input = $('[data-test-search-field]').val('Vendor1');
        triggerChange($input.get(0));

        $('[data-test-search-submit]').trigger('click');
      });

      it("only shows a single result", function() {
        expect($('[data-test-search-results-item]')).to.have.lengthOf(1);
      });
    });

    describe("clicking on a result", function() {
      it("shows vendor details");
      it("shows packages for vendor");
    });

    describe("sorting by name", function() {
      it("sorts by name");
    });
  });

  describe("searching for the vendor 'fhqwhgads'", function() {
    it("displays 'no results' message");
  });

  describe("encountering a server error", function() {
    it("dies with dignity");
  });
});
