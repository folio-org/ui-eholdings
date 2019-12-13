import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import ResourceEditPage from '../interactors/resource-edit';
import ResourceShowPage from '../interactors/resource-show';

describe('CustomResourceEditProxy', () => {
  setupApplication();
  let provider,
    providerPackage,
    title,
    resource;

  beforeEach(async function () {
    provider = await this.server.create('provider', {
      name: 'Cool Provider'
    });

    providerPackage = await this.server.create('package', 'withTitles', {
      provider,
      name: 'Star Wars Custom Package',
      contentType: 'Online',
      isCustom: true
    });

    const packageProxy = await this.server.create('proxy', {
      inherited: true,
      id: 'bigTestJS'
    });

    await providerPackage.update('proxy', packageProxy.toJSON());
    await providerPackage.save();


    title = await this.server.create('title', {
      name: 'Hans Solo Director Cut',
      publicationType: 'Streaming Video',
      publisherName: 'Amazing Publisher',
      isTitleCustom: true
    });

    await title.save();

    resource = await this.server.create('resource', {
      package: providerPackage,
      isSelected: true,
      title
    });
  });

  describe('visiting the resource edit page with an inherited proxy', () => {
    beforeEach(async function () {
      const resourceProxy = await this.server.create('proxy', {
        inherited: true,
        id: 'bigTestJS'
      });

      await resource.update('proxy', resourceProxy.toJSON());
      await resource.save();
      await this.visit(`/eholdings/resources/${resource.id}/edit`);
      await ResourceEditPage.whenLoaded();
    });

    it('disables the save button', () => {
      expect(ResourceEditPage.isSaveDisabled).to.be.true;
    });

    it('has a select field value defaulted with current resource proxy value', () => {
      expect(ResourceEditPage.proxySelectValue).to.equal('bigTestJS');
    });

    describe('choosing another proxy from select', () => {
      beforeEach(async () => {
        await ResourceEditPage.chooseProxy('microstates');
      });

      it('should enable save action button', () => {
        expect(ResourceEditPage.isSaveDisabled).to.eq(false);
      });

      describe('clicking save to update Resource Proxy', () => {
        beforeEach(async () => {
          await ResourceEditPage.clickSave();
          await ResourceShowPage.whenLoaded();
        });

        it('disables the save button', () => {
          expect(ResourceEditPage.isSaveDisabled).to.be.true;
        });

        it('goes to the resource show page', () => {
          expect(ResourceShowPage.$root).to.exist;
        });

        it('shows newly saved proxy', () => {
          expect(ResourceShowPage.proxy).to.include('microstates');
        });

        it('shows a success toast message', () => {
          expect(ResourceShowPage.toast.successText).to.equal('Title was updated.');
        });
      });
    });
  });
});
