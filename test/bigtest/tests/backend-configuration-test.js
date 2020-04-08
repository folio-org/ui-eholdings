import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';
import { Response } from '@bigtest/mirage';

import setupApplication from '../helpers/setup-application';
import ApplicationPage from '../interactors/application';
import SettingsPage from '../interactors/settings';

describe('Error retrieving backend', () => {
  setupApplication({
    scenarios: ['load-error-backend']
  });

  describe('when trying to use the app', () => {
    beforeEach(function () {
      this.visit('/eholdings');
    });

    it('informs user that an error has occurred', () => {
      expect(ApplicationPage.hasBackendLoadError).to.be.true;
    });
  });
});

describe('With no backend at all', () => {
  setupApplication({
    scenarios: ['no-backend']
  });

  describe('when trying to use the app', () => {
    beforeEach(function () {
      this.visit('/eholdings');
    });

    it('blocks access to the eholdings app and tells me that I need to install a backend', () => {
      expect(ApplicationPage.doesNotHaveBackend).to.be.true;
    });
  });
});

describe('With unconfigured backend', () => {
  setupApplication({
    scenarios: ['unconfigured-backend']
  });

  describe('when trying to use the app', () => {
    beforeEach(function () {
      this.visit('/eholdings');
    });

    it('blocks access to the eholdings app and points you to the configuration screen', () => {
      expect(ApplicationPage.backendNotConfigured).to.be.true;
    });
  });

  describe('when visiting the KB auth form', () => {
    beforeEach(function () {
      this.visit('/settings/eholdings/knowledge-base');
    });

    it('does not enable the save button', () => {
      expect(SettingsPage.saveButtonDisabled).to.be.true;
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
});

describe('With valid backend configuration', () => {
  setupApplication();

  describe('when visiting the KB auth form', () => {
    beforeEach(function () {
      this.visit('/settings/eholdings/knowledge-base');
    });

    it('has a field for the ebsco customer id', () => {
      expect(SettingsPage.customerId).to.not.equal('');
    });

    it('has a field for the ebsco RM API key', () => {
      expect(SettingsPage.apiKey).to.not.equal('');
    });

    it('has a dropdown for ebsco RM API url', () => {
      expect(SettingsPage.rmapiBaseUrl).to.not.equal('');
    });

    it('field for the ebsco RM API key appears with text as password hidden', () => {
      expect(SettingsPage.apiKeyInputType).to.equal('password');
    });

    describe('the page always', () => {
      beforeEach(async function () {
        await SettingsPage.whenLoaded();
      });

      it.always('has a disabled save button', () => {
        expect(SettingsPage.saveButtonDisabled).to.be.true;
      });
    });

    describe('filling in invalid data', () => {
      beforeEach(function () {
        this.server.put('/configuration', () => {
          return new Response(422, {}, {
            errors: [{
              title: 'Invalid KB API credentials'
            }]
          });
        });

        return SettingsPage
          .fillCustomerId('totally-bogus-customer-id')
          .fillApiKey('totally-bogus-api-key')
          .chooseRMAPIUrl('https://sandbox.ebsco.io')
          .save();
      });

      it('reports the error to the interface', () => {
        expect(SettingsPage.toast.errorText).to.equal('Invalid KB API credentials');
      });
    });


    describe('filling in complete data', () => {
      beforeEach(() => {
        return SettingsPage
          .fillCustomerId('some-customer-id')
          .fillApiKey('some-api-key')
          .chooseRMAPIUrl('https://sandbox.ebsco.io');
      });

      it('enables the save button', () => {
        expect(SettingsPage.saveButtonDisabled).to.be.false;
      });

      describe('saving the changes', () => {
        beforeEach(async () => {
          await SettingsPage.save();
        });

        // mirage may respond too quick to properly test loading states
        it('disables the save button', () => {
          expect(SettingsPage.saveButtonDisabled).to.be.true;
        });

        describe('when the changes succeed', () => {
          it('disables the save button', () => {
            expect(SettingsPage.saveButtonDisabled).to.be.true;
          });

          it('should show a success toast', () => {
            expect(SettingsPage.toast.successText).to.eq('KB settings updated');
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

        it('enables the save button', () => {
          expect(SettingsPage.saveButtonDisabled).to.be.false;
        });

        it('shows an error message', () => {
          expect(SettingsPage.toast.errorText).to.equal('an error has occurred');
        });
      });

      describe('when the validation fails', () => {
        beforeEach(async () => {
          await SettingsPage.fillCustomerId('');
        });

        it('does not enable the save button', () => {
          expect(SettingsPage.saveButtonDisabled).to.be.true;
        });
      });

      describe('then hitting the cancel button', () => {
        beforeEach(async () => {
          await SettingsPage.cancel();
        });

        it('reverts the changes', () => {
          expect(SettingsPage.customerId).to.equal('some-valid-customer-id');
          expect(SettingsPage.apiKey).to.equal('some-valid-api-key');
        });
      });
    });
  });
});
