import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import ResourceEditPage from '../interactors/resource-edit';
import ResourceShowPage from '../interactors/resource-show';

describe('ManagedResourceEditVisibility visiting the managed resource edit page and hiding a resource', () => {
  setupApplication({
    scenarios: ['managedResourceEditVisibilityHidingResource']
  });

  beforeEach(async function () {
    await this.visit('/eholdings/resources/test/edit');
    await ResourceEditPage.whenLoaded();
  });

  it('displays the yes visibility radio is selected', () => {
    expect(ResourceEditPage.isResourceVisible).to.be.true;
  });

  it('disables the save button', () => {
    expect(ResourceEditPage.isSaveDisabled).to.be.true;
  });

  describe('toggling the visiblity toggle', () => {
    beforeEach(async () => {
      await ResourceEditPage.toggleIsVisible();
    });

    describe('clicking cancel', () => {
      beforeEach(async () => {
        await ResourceEditPage.clickCancel();
      });

      it('shows a navigation confirmation modal', () => {
        expect(ResourceEditPage.navigationModal.$root).to.exist;
      });
    });

    describe('clicking save', () => {
      beforeEach(async () => {
        await ResourceEditPage.clickSave();
        await ResourceShowPage.whenLoaded();
      });

      it('goes to the resource show page', () => {
        expect(ResourceShowPage.$root).to.exist;
      });

      it('displays the new visibility status', () => {
        expect(ResourceShowPage.isResourceHidden).to.be.true;
      });
    });
  });

  describe('clicking cancel', () => {
    beforeEach(async () => {
      await ResourceEditPage.clickCancel();
      await ResourceShowPage.whenLoaded();
    });

    it('goes to the resource show page', () => {
      expect(ResourceShowPage.$root).to.exist;
    });
  });
});

describe('ManagedResourceEditVisibility visiting the resource edit page and showing a hidden without reason resource', () => {
  setupApplication({
    scenarios: ['managedResourceEditVisibilityHidingResourceNoReason']
  });

  beforeEach(async function () {
    await this.visit('/eholdings/resources/test/edit');
    await ResourceEditPage.whenLoaded();
  });

  it('displays the no visibility radio is selected', () => {
    expect(ResourceEditPage.isResourceVisible).to.be.false;
  });

  it('disables the save button', () => {
    expect(ResourceEditPage.isSaveDisabled).to.be.true;
  });

  describe('editing', () => {
    beforeEach(async () => {
      await ResourceEditPage.whenLoaded();
    });

    describe('toggling the visiblity toggle', () => {
      beforeEach(async () => {
        await ResourceEditPage.toggleIsVisible();
      });

      describe('clicking save', () => {
        beforeEach(async () => {
          await ResourceEditPage.clickSave();
          await ResourceShowPage.whenLoaded();
        });

        it('goes to the resource show page', () => {
          expect(ResourceShowPage.$root).to.exist;
        });

        it('displays the new visibility status', () => {
          expect(ResourceShowPage.isResourceVisible).to.be.true;
        });
      });
    });
  });
});

describe('ManagedResourceEditVisibility visiting the resource edit page with a hidden resource and a reason', () => {
  setupApplication({
    scenarios: ['managedResourceEditVisibilityHiddenResource']
  });

  beforeEach(async function () {
    await this.visit('/eholdings/resources/test/edit');
    await ResourceEditPage.whenLoaded();
  });

  it('displays the no visibility radio is selected', () => {
    expect(ResourceEditPage.isResourceVisible).to.be.false;
  });
});

describe('ManagedResourceEditVisibility visiting the resource edit page and all titles in package are hidden', () => {
  setupApplication({
    scenarios: ['managedResourceEditVisibilityTitlesHidden']
  });

  beforeEach(async function () {
    await this.visit('/eholdings/resources/test/edit');
    await ResourceEditPage.whenLoaded();
  });

  it('displays the no visibility radio is selected', () => {
    expect(ResourceEditPage.isResourceVisible).to.be.false;
  });
});

describe('ManagedResourceEditVisibility visiting the resource edit page with a resource that is not selected', () => {
  setupApplication({
    scenarios: ['managedResourceEditVisibilityResourceNotSelected']
  });

  beforeEach(async function () {
    await this.visit('/eholdings/resources/test/edit');
    await ResourceEditPage.whenLoaded();
  });

  it('does not show visibility section', () => {
    expect(ResourceEditPage.isVisibilityFieldPresent).to.be.false;
  });
});
