import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import PackageShowPage from '../interactors/package-show';

describe.skip('PackageVisibility', () => {
  setupApplication();
  let provider,
    pkg;

  beforeEach(function () {
    provider = this.server.create('provider', {
      name: 'Cool Provider'
    });
  });

  describe('visiting the package show page with a hidden package with a hidden reason', () => {
    beforeEach(async function () {
      pkg = await this.server.create('package', 'isHidden', {
        provider,
        name: 'Cool Package',
        contentType: 'E-Book',
        isSelected: true
      });

      await this.visit(`/eholdings/packages/${pkg.id}`);
      await PackageShowPage.whenLoaded();
    });

    it('displays No in (Show titles in package to patrons)', () => {
      expect(PackageShowPage.isVisibleToPatrons).to.contain('No');
    });

    it('displays hidden reason in (Show titles in package to patrons', () => {
      expect(PackageShowPage.isVisibleToPatrons).to.contain('The content is for mature audiences only.');
    });
  });

  describe('visiting the package show page with a hidden package without a hidden reason', () => {
    beforeEach(async function () {
      pkg = await this.server.create('package', 'isHiddenWithoutReason', {
        provider,
        name: 'Cool Package',
        contentType: 'E-Book',
        isSelected: true
      });

      await this.visit(`/eholdings/packages/${pkg.id}`);
      await PackageShowPage.whenLoaded();
    });

    it('displays No as (Show titles in package to patrons)', () => {
      expect(PackageShowPage.isVisibleToPatrons).to.equal('No');
    });
  });

  describe('visiting the package show page with a package that is not hidden', () => {
    beforeEach(async function () {
      pkg = await this.server.create('package', {
        provider,
        name: 'Cool Package',
        contentType: 'ebook',
        isSelected: true
      });

      await this.visit(`/eholdings/packages/${pkg.id}`);
      await PackageShowPage.whenLoaded();
    });

    it('displays Yes as (Show titles in package to patrons)', () => {
      expect(PackageShowPage.isVisibleToPatrons).to.equal('Yes');
    });
  });

  describe('visiting the package show page with a package that is not selected', () => {
    beforeEach(async function () {
      pkg = await this.server.create('package', {
        provider,
        name: 'Cool Package',
        contentType: 'ebook',
        isSelected: false
      });

      await this.visit(`/eholdings/packages/${pkg.id}`);
      await PackageShowPage.whenLoaded();
    });

    it('does not display visibility', () => {
      expect(PackageShowPage.isVisibilityStatusPresent).to.be.false;
    });
  });
});
