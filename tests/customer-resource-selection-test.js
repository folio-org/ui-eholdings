import { beforeEach, afterEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { describeApplication } from './helpers';
import ResourcePage from './pages/customer-resource-show';

describeApplication('CustomerResourceSelection', () => {
  let provider,
    providerPackage,
    resource;

  beforeEach(function () {
    provider = this.server.create('provider', {
      name: 'Cool Provider'
    });

    providerPackage = this.server.create('package', 'withTitles', {
      provider,
      name: 'Cool Package',
      contentType: 'E-Book',
      titleCount: 5
    });

    let title = this.server.create('title', {
      publicationType: 'Streaming Video'
    });

    resource = this.server.create('customer-resource', {
      package: providerPackage,
      isSelected: false,
      title
    });
  });

  describe('visiting the customer resource page', () => {
    beforeEach(function () {
      return this.visit(`/eholdings/customer-resources/${resource.id}`, () => {
        expect(ResourcePage.$root).to.exist;
      });
    });

    it('indicates that the resource is not yet selected', () => {
      expect(ResourcePage.isSelected).to.equal(false);
    });

    describe('successfully selecting a package title to add to my holdings', () => {
      beforeEach(function () {
        /*
         * The expectations in the convergent `it` blocks
         * get run once every 10ms.  We were seeing test flakiness
         * when a toggle action dispatched and resolved before an
         * expectation had the chance to run.  We sidestep this by
         * temporarily increasing the mirage server's response time
         * to 50ms.
         * TODO: control timing directly with Mirage
        */
        this.server.timing = 50;
        return ResourcePage.toggleIsSelected();
      });

      afterEach(function () {
        this.server.timing = 0;
      });

      it('reflects the desired state (Selected)', () => {
        expect(ResourcePage.isSelected).to.equal(true);
      });

      it('indicates it is working to get to desired state', () => {
        expect(ResourcePage.isSelecting).to.equal(true);
      });

      it('cannot be interacted with while the request is in flight', () => {
        expect(ResourcePage.isSelectedToggleable).to.equal(false);
      });

      describe('when the request succeeds', () => {
        it('reflects the desired state was set', () => {
          expect(ResourcePage.isSelected).to.equal(true);
        });

        it('indicates it is no longer working', () => {
          expect(ResourcePage.isSelecting).to.equal(false);
        });
      });
    });

    describe('unsuccessfully selecting a package title to add to my holdings', () => {
      beforeEach(function () {
        this.server.put('/customer-resources/:id', {
          errors: [{
            title: 'There was an error'
          }]
        }, 500);

        this.server.timing = 50;
        return ResourcePage.toggleIsSelected();
      });

      afterEach(function () {
        this.server.timing = 0;
      });

      it('reflects the desired state (Selected)', () => {
        expect(ResourcePage.isSelected).to.equal(true);
      });

      it('indicates it is working to get to desired state', () => {
        expect(ResourcePage.isSelecting).to.equal(true);
      });

      it('cannot be interacted with while the request is in flight', () => {
        expect(ResourcePage.isSelectedToggleable).to.equal(false);
      });

      describe('when the request succeeds', () => {
        it('reflects the desired state was set', () => {
          expect(ResourcePage.isSelected).to.equal(false);
        });

        it('indicates it is no longer working', () => {
          expect(ResourcePage.isSelecting).to.equal(false);
        });

        it.skip('logs an Error somewhere', () => {
          expect(ResourcePage.flashError).to.match(/unable to select/i);
        });
      });
    });
  });
});
