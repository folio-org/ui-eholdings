/* global it */
import { expect } from 'chai';
import $ from 'jquery';

import { describeApplication } from './helpers';

describeApplication('eHoldings', function() {
  it('should render the app', function() {
    expect($('h1')).to.have.text('Folio Resource Management');
  });

  it('has a searchbox with options to search for vendor, package and title');

  describe("searching for the vendor 'ebsco'", function() {
    it("displays vendor entries related to 'ebsco'");
    it("displays the name, number of packages available, and packages subscribed to for each vendor");

    describe("clicking on first result", function() {
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
    it("dies with grace");
  });
});
