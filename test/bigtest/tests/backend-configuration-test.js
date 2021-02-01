import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';
import { Response } from 'miragejs';

import setupApplication, { axe } from '../helpers/setup-application';
import ApplicationPage from '../interactors/application';
import SettingsPage from '../interactors/settings-configuration';

describe('backend configuration', () => {
  describe('Error retrieving backend', () => {
    setupApplication({
      scenarios: ['load-error-backend'],
    });

    let a11yResults = null;

    describe('when trying to use the app', () => {
      beforeEach(async function () {
        this.visit('/eholdings');
      });

      describe('waiting for axe to run', () => {
        beforeEach(async () => {
          await ApplicationPage.whenLoaded();
          a11yResults = await axe.run();
        });

        it('should not have any a11y issues', () => {
          expect(a11yResults.violations).to.be.empty;
        });
      });

      it('informs user that an error has occurred', () => {
        expect(ApplicationPage.hasBackendLoadError).to.be.true;
      });
    });
  });

  describe('API limit exceeded', () => {
    setupApplication({
      scenarios: ['api-limit-exceeded'],
    });

    let a11yResults = null;

    describe('when trying to use the app', () => {
      beforeEach(async function () {
        this.visit('/eholdings');
      });

      describe('waiting for axe to run', () => {
        beforeEach(async () => {
          await ApplicationPage.whenLoaded();
          a11yResults = await axe.run();
        });

        it('should not have any a11y issues', () => {
          expect(a11yResults.violations).to.be.empty;
        });
      });

      it('informs user that API limit was exceeded', () => {
        expect(ApplicationPage.apiLimitExceededError).to.be.true;
      });
    });
  });

  describe('With no backend at all', () => {
    setupApplication({
      scenarios: ['no-backend'],
      initialState: {
        eholdings: {
          data: {},
        },
        discovery: {
          modules: {
            'mod-kb-ebsco-java-3.5.3-SNAPSHOT.246': 'kb-ebsco',
          },
          interfaces: {
            erm: '3.0',
            tags: '1.0',
          },
        },
      },
    });

    let a11yResults = null;

    describe('when trying to use the app', () => {
      beforeEach(async function () {
        this.visit('/eholdings');
      });

      describe('waiting for axe to run', () => {
        beforeEach(async () => {
          await ApplicationPage.whenLoaded();
          a11yResults = await axe.run();
        });

        it('should not have any a11y issues', () => {
          expect(a11yResults.violations).to.be.empty;
        });
      });

      it('blocks access to the eholdings app and tells me that I need to install a backend', () => {
        expect(ApplicationPage.doesNotHaveBackend).to.be.true;
      });
    });
  });

  describe('With unconfigured backend', () => {
    setupApplication({
      scenarios: ['unconfigured-backend'],
    });

    let a11yResults = null;

    describe('when trying to use the app', () => {
      beforeEach(async function () {
        this.visit('/eholdings');
      });

      describe('waiting for axe to run', () => {
        beforeEach(async () => {
          await ApplicationPage.whenLoaded();
          a11yResults = await axe.run();
        });

        it('should not have any a11y issues', () => {
          expect(a11yResults.violations).to.be.empty;
        });
      });

      it('blocks access to the eholdings app and points you to the configuration screen', () => {
        expect(ApplicationPage.backendNotConfigured).to.be.true;
      });
    });

    describe('when visiting the KB auth form', () => {
      beforeEach(async function () {
        this.visit('/settings/eholdings/knowledge-base/new');
      });

      describe('waiting for axe to run', () => {
        beforeEach(async () => {
          await ApplicationPage.whenLoaded();
          a11yResults = await axe.run();
        });

        it('should not have any a11y issues', () => {
          expect(a11yResults.violations).to.be.empty;
        });
      });

      it('does not enable the save button', () => {
        expect(SettingsPage.saveButtonDisabled).to.be.true;
      });

      describe('filling in incomplete data', () => {
        beforeEach(async () => {
          await SettingsPage
            .blurCustomerId()
            .blurApiKey();

          await ApplicationPage.whenLoaded();
          a11yResults = await axe.run();
        });

        it('should not have any a11y issues', () => {
          expect(a11yResults.violations).to.be.empty;
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

    let a11yResults = null;

    describe('when visiting the KB auth form', () => {
      beforeEach(async function () {
        this.visit('/settings/eholdings/knowledge-base/2');
      });

      describe('waiting for axe to run', () => {
        beforeEach(async () => {
          await ApplicationPage.whenLoaded();
          a11yResults = await axe.run();
        });

        it('should not have any a11y issues', () => {
          expect(a11yResults.violations).to.be.empty;
        });
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

      it('should show usage consolidation id field', () => {
        expect(SettingsPage.apiKeyField.isPresent).to.be.true;
      });

      describe('usage condolidation id show hide password', () => {
        it('should show show/hide button', () => {
          expect(SettingsPage.apiKeyField.isShowHideButtonPresent).to.be.true;
        });

        it('should show encrypted key by default', () => {
          expect(SettingsPage.apiKeyField.customerKeyInput.type).to.equal('password');
        });

        describe('when clicking on show key button', () => {
          beforeEach(async () => {
            await SettingsPage.apiKeyField.clickShowHideButton();
          });

          it('should show value of key', () => {
            expect(SettingsPage.apiKeyField.customerKeyInput.type).to.equal('text');
          });
        });
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
        beforeEach(async function () {
          this.server.patch('/kb-credentials/2', () => {
            return new Response(422, {}, {
              errors: [{
                title: 'Invalid KB API credentials',
              }],
            });
          });

          await SettingsPage
            .fillCustomerId('totally-bogus-customer-id')
            .fillApiKey('totally-bogus-api-key')
            .chooseRMAPIUrl('https://sandbox.ebsco.io')
            .save();
        });

        describe('waiting for axe to run', () => {
          beforeEach(async () => {
            await ApplicationPage.whenLoaded();
            a11yResults = await axe.run();
          });

          it('should not have any a11y issues', () => {
            expect(a11yResults.violations).to.be.empty;
          });
        });

        it('reports the error to the interface', () => {
          expect(SettingsPage.toast.errorText).to.equal('Invalid KB API credentials');
        });
      });


      describe('filling in complete data', () => {
        beforeEach(async () => {
          await ApplicationPage.whenLoaded();
          await SettingsPage.whenApiKeyLoaded();
          await SettingsPage
            .fillCustomerId('some-customer-id')
            .fillApiKey('some-api-key')
            .chooseRMAPIUrl('https://sandbox.ebsco.io');
        });

        describe('waiting for axe to run', () => {
          beforeEach(async () => {
            a11yResults = await axe.run({
              rules: {
                'color-contrast': { enabled: false },
              },
            });
          });

          it('should not have any a11y issues', () => {
            expect(a11yResults.violations).to.be.empty;
          });
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
            it('should show a success toast', () => {
              expect(SettingsPage.toast.successText).to.eq('KB settings updated');
            });
          });
        });

        describe('when saving the changes fail', () => {
          beforeEach(async function () {
            this.server.patch('/kb-credentials/2', {
              errors: [{
                title: 'an error has occurred',
              }],
            }, 500);

            await SettingsPage.save();
          });

          describe('waiting for axe to run', () => {
            beforeEach(async () => {
              await ApplicationPage.whenLoaded();
              a11yResults = await axe.run();
            });

            it('should not have any a11y issues', () => {
              expect(a11yResults.violations).to.be.empty;
            });
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

          describe('waiting for axe to run', () => {
            beforeEach(async () => {
              await ApplicationPage.whenLoaded();
              a11yResults = await axe.run();
            });

            it('should not have any a11y issues', () => {
              expect(a11yResults.violations).to.be.empty;
            });
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
            expect(SettingsPage.customerId).to.equal('ZZZZ');
            expect(SettingsPage.apiKey).to.equal('test-api-key');
          });
        });
      });
    });

    describe('when usage consolidation key could not be loaded', () => {
      beforeEach(async function () {
        this.server.get('/kb-credentials/:credId/key', 500);

        this.visit('/settings/eholdings/knowledge-base/2');
      });

      it('should not show show/hide button', () => {
        expect(SettingsPage.apiKeyField.isShowHideButtonPresent).to.be.false;
      });
    });
  });

  describe('With not assigned credentials', () => {
    setupApplication({
      scenarios: ['user-not-assigned-to-kb'],
    });

    let a11yResults = null;

    describe('when trying to use the app', () => {
      beforeEach(async function () {
        this.visit('/eholdings');
      });

      describe('waiting for axe to run', () => {
        beforeEach(async () => {
          await ApplicationPage.whenLoaded();
          a11yResults = await axe.run();
        });

        it('should not have any a11y issues', () => {
          expect(a11yResults.violations).to.be.empty;
        });
      });

      it('blocks access to the eholdings app and points you to the configuration screen', () => {
        expect(ApplicationPage.userNotAssignedKbCredentialsError).to.be.true;
      });
    });
  });
});
