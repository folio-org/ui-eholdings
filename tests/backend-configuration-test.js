import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';
import { Response } from '@bigtest/mirage';

import { describeApplication } from './helpers';
import ApplicationPage from './pages/bigtest/application';
import SettingsPage from './pages/bigtest/settings';

describeApplication('Error retrieving backend', {
  scenarios: ['load-error-backend'],

  suite() {
    describe('when trying to use the app', () => {
      beforeEach(function () {
        return this.visit('/eholdings', () => expect(ApplicationPage.$root).to.exist);
      });

      it('informs user that an error has occurred', () => {
        expect(ApplicationPage.hasBackendLoadError).to.be.true;
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
        expect(SettingsPage.hasVisibleActions).to.be.true;
      });

      describe('filling in incomplete data', () => {
        beforeEach(() => {
          return SettingsPage
            .blurCustomerId()
            .blurApiKey();
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
          return SettingsPage
            .blurCustomerId()
            .blurApiKey()
            .fillCustomerId('some-customer-id')
            .fillApiKey('some-api-key');
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
      expect(SettingsPage.customerId).to.not.equal('');
    });

    it('has a field for the ebsco RM API key', () => {
      expect(SettingsPage.apiKey).to.not.equal('');
    });

    it('field for the ebsco RM API key appears with text as password hidden', () => {
      expect(SettingsPage.apiKeyInputType).to.equal('password');
    });

    it.always.skip('does not have visible form action buttons', () => {
      expect(SettingsPage.hasVisibleActions).to.be.false;
    });

    describe('filling in invalid data', () => {
      beforeEach(function () {
        this.server.put('/configuration', () => {
          return new Response(422, {}, {
            errors: [{
              title: 'RM-API credentials are invalid'
            }]
          });
        });

        return SettingsPage
          .fillCustomerId('totally-bogus-customer-id')
          .fillApiKey('totally-bogus-api-key')
          .save();
      });

      it('reports the error to the interface', () => {
        expect(SettingsPage.errorText).to.equal('RM-API credentials are invalid');
      });
    });


    describe('filling in complete data', () => {
      beforeEach(() => {
        return SettingsPage
          .fillCustomerId('some-customer-id')
          .fillApiKey('some-api-key');
      });

      it('shows the form actions', () => {
        expect(SettingsPage.hasVisibleActions).to.be.true;
      });

      describe('saving the changes', () => {
        beforeEach(() => {
          return SettingsPage.save();
        });

        // mirage may respond too quick to properly test loading states
        it.skip('disables the save button', () => {
          expect(SettingsPage.saveButtonDisabled).to.be.true;
        });

        it.skip('indicates that it is working');

        describe('when the changes succeed', () => {
          it('hides the form actions', () => {
            expect(SettingsPage.hasVisibleActions).to.be.false;
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

          return SettingsPage.save();
        });

        it.always.skip('shows the form action buttons', () => {
          expect(SettingsPage.hasVisibleActions).to.be.true;
        });

        it('enables the save button', () => {
          expect(SettingsPage.saveButtonDisabled).to.be.false;
        });

        it('shows an error message', () => {
          expect(SettingsPage.errorText).to.equal('an error has occurred');
        });
      });

      describe('when the validation fails', () => {
        beforeEach(() => {
          return SettingsPage
            .fillCustomerId('');
        });

        it('does not enable the save button', () => {
          expect(SettingsPage.saveButtonDisabled).to.be.true;
        });
      });

      describe('then hitting the cancel button', () => {
        beforeEach(() => {
          return SettingsPage.cancel();
        });

        it('reverts the changes', () => {
          expect(SettingsPage.customerId).to.equal('some-valid-customer-id');
          expect(SettingsPage.apiKey).to.equal('some-valid-api-key');
        });
      });
    });
  });
});
