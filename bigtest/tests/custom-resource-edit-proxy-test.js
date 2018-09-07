import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { describeApplication } from '../helpers/describe-application';
import ResourceEditPage from '../interactors/resource-edit';
import ResourceShowPage from '../interactors/resource-show';

describeApplication('CustomResourceEditProxy', () => {
  let provider,
    providerPackage,
    title,
    resource;

  beforeEach(function () {
    provider = this.server.create('provider', {
      name: 'Cool Provider'
    });

    providerPackage = this.server.create('package', 'withTitles', {
      provider,
      name: 'Star Wars Custom Package',
      contentType: 'Online',
      isCustom: true
    });

    let packageProxy = this.server.create('proxy', {
      inherited: true,
      id: 'bigTestJS'
    });

    providerPackage.update('proxy', packageProxy.toJSON());
    providerPackage.save();


    title = this.server.create('title', {
      name: 'Hans Solo Director Cut',
      publicationType: 'Streaming Video',
      publisherName: 'Amazing Publisher',
      isTitleCustom: true
    });

    title.save();

    resource = this.server.create('resource', {
      package: providerPackage,
      isSelected: true,
      title
    });
  });

  describe('visiting the resource edit page with an inherited proxy', () => {
    beforeEach(function () {
      let resourceProxy = this.server.create('proxy', {
        inherited: true,
        id: 'bigTestJS'
      });
      resource.update('proxy', resourceProxy.toJSON());
      resource.save();

      return this.visit(`/eholdings/resources/${resource.id}/edit`, () => {
        expect(ResourceEditPage.$root).to.exist;
      });
    });

    it('disables the save button', () => {
      expect(ResourceEditPage.isSaveDisabled).to.be.true;
    });

    it('has a select field value defaulted with current resource proxy value', () => {
      expect(ResourceEditPage.proxySelectValue).to.equal('bigTestJS');
    });

    describe('choosing another proxy from select', () => {
      beforeEach(() => {
        return ResourceEditPage.chooseProxy('microstates');
      });

      it('should enable save action button', () => {
        expect(ResourceEditPage.isSaveDisabled).to.eq(false);
      });

      describe('clicking save to update Resource Proxy', () => {
        beforeEach(() => {
          return ResourceEditPage.clickSave();
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
