import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import PackageSearchPage from '../interactors/package-search';

describe('PackageSearch', function () {
  setupApplication({
    scenarios: ['packageSearchError']
  });

  beforeEach(async function () {
    await this.visit('/eholdings/?searchType=packages');
    await PackageSearchPage.whenLoaded();
  });

  describe('encountering a server error', () => {
    beforeEach(async function () {
      await PackageSearchPage.search("this doesn't matter");
    });

    it('dies with dignity', () => {
      expect(PackageSearchPage.hasErrors).to.be.true;
    });
  });
});
