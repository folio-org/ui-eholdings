import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import PackageShowPage from '../interactors/package-show';

describe('PackageVisibility visiting the package show page with a package that is not selected', () => {
  setupApplication({
    scenarios: ['packageVisibilityNotSelected']
  });

  beforeEach(async function () {
    await this.visit('/eholdings/packages/testId');
    await PackageShowPage.whenLoaded();
  });

  it('does not display visibility', () => {
    expect(PackageShowPage.isVisibilityStatusPresent).to.be.false;
  });
});

describe('PackageVisibility visiting the package show page with a hidden package with a hidden reason', () => {
  setupApplication({
    scenarios: ['packageVisibilityHiddenReason']
  });

  beforeEach(async function () {
    await this.visit('/eholdings/packages/testId');
    await PackageShowPage.whenLoaded();
  });

  it('displays No in (Show titles in package to patrons)', () => {
    expect(PackageShowPage.isVisibleToPatrons).to.contain('No');
  });

  it('displays hidden reason in (Show titles in package to patrons', () => {
    expect(PackageShowPage.isVisibleToPatrons).to.contain('The content is for mature audiences only.');
  });
});

describe('PackageVisibility visiting the package show page with a hidden package without a hidden reason', () => {
  setupApplication({
    scenarios: ['packageVisibilityNoHiddenReason']
  });

  beforeEach(async function () {
    await this.visit('/eholdings/packages/testId');
    await PackageShowPage.whenLoaded();
  });

  it('displays No as (Show titles in package to patrons)', () => {
    expect(PackageShowPage.isVisibleToPatrons).to.equal('No');
  });
});


describe('PackageVisibility visiting the package show page with a package that is not hidden', () => {
  setupApplication({
    scenarios: ['packageVisibilityNotHidden']
  });

  beforeEach(async function () {
    await this.visit('/eholdings/packages/testId');
    await PackageShowPage.whenLoaded();
  });

  it('displays Yes as (Show titles in package to patrons)', () => {
    expect(PackageShowPage.isVisibleToPatrons).to.equal('Yes');
  });
});
