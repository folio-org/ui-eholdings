/* global describe, beforeEach */
import { Response } from 'mirage-server';

import { expect } from 'chai';
import it from './it-will';

import { describeApplication } from './helpers';
import ApplicationPage from './pages/application';
import SettingsPage from './pages/settings';

describeApplication('Error retrieving backend', {
  scenarios: ['load-error-backend'],

  suite() {
    describe('when trying to use the app', () => {
      beforeEach(function () {
        return this.visit('/eholdings', () => expect(ApplicationPage.$root).to.exist);
      });

      it('informs user that an error has occurred', () => {
        expect(ApplicationPage.backendLoadError).to.be.true;
      });
    });
  }
});

describeApplication('With no backend at all', {
  scenarios: ['no-backend'],

  suite() {
    describe('when trying to use the app', () => {
      beforeEach(function () {
        return this.visit('/eholdings', () => expect(ApplicationPage.$root).to.exist);
      });

      it('blocks access to the eholdings app and tells me that I need to install a backend', () => {
        expect(ApplicationPage.doesNotHaveBackend).to.be.true;
      });
    });
  }
});

describeApplication('With unconfigured backend', {
  scenarios: ['unconfigured-backend'],

  suite() {
    describe('when trying to use the app', () => {
      beforeEach(function () {
        return this.visit('/eholdings', () => expect(ApplicationPage.$root).to.exist);
      });

      it('blocks access to the eholdings app and points you to the configuration screen', () => {
        expect(ApplicationPage.backendNotConfigured).to.be.true;
      });
    });

    describe('when visiting settings', () => {
      beforeEach(function () {
        return this.visit('/settings/eholdings', () => expect(SettingsPage.$root).to.exist);
      });

      it('shows the form action buttons', () => {
        expect(SettingsPage.$actions).to.exist;
      });

      describe('filling in incomplete data', () => {
        beforeEach(() => {
          SettingsPage.blurCustomerId();
          SettingsPage.blurApiKey();
        });

        it('displays an errored state for the blank customer id', () => {
          expect(SettingsPage.customerIdFieldIsInvalid).to.be.true;
        });

        it('displays an errored state for the blank api key', () => {
          expect(SettingsPage.apiKeyFieldIsInvalid).to.be.true;
        });
      });

      describe('filling in incomplete data, then filling in more data', () => {
        beforeEach(() => {
          SettingsPage.blurCustomerId();
          SettingsPage.blurApiKey();

          SettingsPage.fillIn({
            customerId: 'some-customer-id',
            apiKey: 'some-api-key'
          });
        });

        it('does not display an error state for customer id', () => {
          expect(SettingsPage.customerIdFieldIsInvalid).to.be.false;
        });

        it('does not display an error state for api key', () => {
          expect(SettingsPage.apiKeyFieldIsInvalid).to.be.false;
        });
      });
    });
  }
});

describeApplication('With valid backend configuration', () => {
  describe('when visiting settings', () => {
    beforeEach(function () {
      return this.visit('/settings/eholdings', () => expect(SettingsPage.$root).to.exist);
    });

    it('has a description of itself', () => {
      expect(SettingsPage.description).to.equal('EBSCO Knowledge Base');
    });

    it('has a field for the ebsco customer id', () => {
      expect(SettingsPage.$customerIdField).to.exist;
    });

    it('has a field for the ebsco RM API key', () => {
      expect(SettingsPage.$apiKeyField).to.exist;
    });

    it.still('does not have visible form action buttons', () => {
      expect(SettingsPage.$actions).to.not.exist;
    });

    describe('filling in invalid data', () => {
      beforeEach(function () {
        this.server.put('/configuration', () => {
          return new Response(422, {}, {
            errors: [{
              title: 'RM-API Credentials Are Invalid'
            }]
          });
        });

        return SettingsPage.fillIn({
          customerId: 'totally-bogus-customer-id',
          apiKey: 'totally-bogus-api-key'
        }).then(() => {
          return SettingsPage.save();
        });
      });

      it('reports the error to the interface', () => {
        expect(SettingsPage.errorText).to.equal('RM-API Credentials Are Invalid');
      });
    });


    describe('filling in complete data', () => {
      beforeEach(() => {
        return SettingsPage.fillIn({
          customerId: 'some-customer-id',
          apiKey: 'some-api-key'
        });
      });

      it('shows the form actions', () => {
        expect(SettingsPage.$actions).to.exist;
      });

      describe('saving the changes', () => {
        beforeEach(() => {
          SettingsPage.save();
        });

        // mirage may respond too quick to properly test loading states
        it.skip('disables the save button', () => {
          expect(SettingsPage.$saveButton).to.have.prop('disabled', true);
        });

        it.skip('indicates that it is working');

        describe('when the changes succeed', () => {
          it('hides the form actions', () => {
            expect(SettingsPage.$actions).to.not.exist;
          });
        });
      });

      describe('when saving the changes fail', () => {
        beforeEach(function () {
          this.server.put('/configuration', {
            errors: [{
              title: 'an error has occurred'
            }]
          }, 500);

          SettingsPage.save();
        });

        it.still('still shows the form action buttons', () => {
          expect(SettingsPage.$actions).to.exist;
        });

        it('enables the save button', () => {
          expect(SettingsPage.$saveButton).to.have.prop('disabled', false);
        });

        it('shows an error message', () => {
          expect(SettingsPage.hasErrors).to.be.true;
        });
      });

      describe('when the validation fails', () => {
        beforeEach(() => {
          SettingsPage.fillIn({ customerId: '' });
        });

        it('does not enable the save button', () => {
          expect(SettingsPage.$saveButton).to.have.prop('disabled', true);
        });
      });

      describe('then hitting the cancel button', () => {
        beforeEach(() => {
          SettingsPage.cancel();
        });

        it('reverts the changes', () => {
          expect(SettingsPage.$customerIdField).to.have.value('some-valid-customer-id');
          expect(SettingsPage.$apiKeyField).to.have.value('some-valid-api-key');
        });
      });
    });
  });
});
