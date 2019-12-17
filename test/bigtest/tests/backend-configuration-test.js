import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import ApplicationPage from '../interactors/application';
import SettingsPage from '../interactors/settings';

describe('Error retrieving backend', function () {
  setupApplication({
    scenarios: ['load-error-backend']
  });

  describe('when trying to use the app', () => {
    beforeEach(async function () {
      this.visit('/eholdings');
    });

    it('informs user that an error has occurred', () => {
      expect(ApplicationPage.hasBackendLoadError).to.be.true;
    });
  });
});

describe('With no backend at all', function () {
  setupApplication({
    scenarios: ['no-backend']
  });

  describe('when trying to use the app', () => {
    beforeEach(async function () {
      this.visit('/eholdings');
    });

    it('blocks access to the eholdings app and tells me that I need to install a backend', () => {
      expect(ApplicationPage.doesNotHaveBackend).to.be.true;
    });
  });
});

describe('With unconfigured backend', function () {
  setupApplication({
    scenarios: ['unconfigured-backend']
  });

  describe('when trying to use the app', () => {
    beforeEach(async function () {
      this.visit('/eholdings');
    });

    it('blocks access to the eholdings app and points you to the configuration screen', () => {
      expect(ApplicationPage.backendNotConfigured).to.be.true;
    });
  });

  describe('when visiting the KB auth form', () => {
    beforeEach(async function () {
      this.visit('/settings/eholdings/knowledge-base');
      await SettingsPage.whenLoaded();
    });

    it('does not enable the save button', () => {
      expect(SettingsPage.saveButtonDisabled).to.be.true;
    });

    describe('filling in incomplete data', () => {
      beforeEach(async () => {
        await SettingsPage
          .focusCustomerId()
          .blurCustomerId()
          .focusApiKey()
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
      beforeEach(async () => {
        await SettingsPage.blurCustomerId();
        await SettingsPage.blurApiKey();
        await SettingsPage.fillCustomerId('some-customer-id');
        await SettingsPage.fillApiKey('some-api-key');
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

describe('With valid backend configuration', function () {
  setupApplication();

  describe('when visiting the KB auth form', () => {
    beforeEach(async function () {
      this.visit('/settings/eholdings/knowledge-base');
      await SettingsPage.whenLoaded();
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

    describe('filling in complete data', () => {
      beforeEach(async () => {
        await SettingsPage.fillCustomerId('some-customer-id');
        await SettingsPage.fillApiKey('some-api-key');
        await SettingsPage.chooseRMAPIUrl('https://sandbox.ebsco.io');
      });

      it('enables the save button', () => {
        expect(SettingsPage.saveButtonDisabled).to.be.false;
      });

      describe('saving the changes', () => {
        beforeEach(async () => {
          await SettingsPage.save();
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

describe('With valid backend configuration when saving the changes fail', () => {
  setupApplication({
    scenarios: ['configurationError']
  });

  beforeEach(async function () {
    this.visit('/settings/eholdings/knowledge-base');
    await SettingsPage.whenLoaded();
    await SettingsPage.fillCustomerId('some-customer-id');
    await SettingsPage.fillApiKey('some-api-key');
    await SettingsPage.chooseRMAPIUrl('https://sandbox.ebsco.io');
    await SettingsPage.save();
  });

  it.skip('enables the save button', () => {
    expect(SettingsPage.saveButtonDisabled).to.be.false;
  });

  it('shows an error message', () => {
    expect(SettingsPage.toast.errorText).to.equal('an error has occurred');
  });
});

describe('filling in invalid data', () => {
  setupApplication({
    scenarios: ['filledInvalidConfiguration']
  });

  beforeEach(async function () {
    this.visit('/settings/eholdings/knowledge-base');
    await SettingsPage.whenLoaded();
    await SettingsPage.fillCustomerId('totally-bogus-customer-id');
    await SettingsPage.fillApiKey('totally-bogus-api-key');
    await SettingsPage.chooseRMAPIUrl('https://sandbox.ebsco.io');
    await SettingsPage.save();
    await SettingsPage.when(() => SettingsPage.toast.isPresent);
  });

  it('reports the error to the interface', () => {
    expect(SettingsPage.toast.errorText).to.equal('Invalid KB API credentials');
  });
});
