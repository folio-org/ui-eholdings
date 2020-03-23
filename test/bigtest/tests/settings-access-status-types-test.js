import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import wait from '../helpers/wait';
import SettingsAccessStatusTypesPage from '../interactors/settings-access-status-types';

describe('With list of root proxies available to a customer', () => {
  setupApplication({
    scenarios: ['default'],
  });

  describe('when visiting the settings access status types page', () => {
    beforeEach(async function () {
      this.visit('/settings/eholdings/access-status-types');
      await wait(1000);
    });

    it('should open settings access status types page', () => {
      expect(SettingsAccessStatusTypesPage.isPresent).to.be.true;
    });

    it('should show list of access status types', () => {
      expect(SettingsAccessStatusTypesPage.accessStatusTypesList().length).to.be.equal(14);
    });

    describe('add new access status type', () => {
      beforeEach(async () => {
        await SettingsAccessStatusTypesPage.clickAddNewButton();
      });

      it('should open settings access status types page', () => {
        expect(SettingsAccessStatusTypesPage.accessStatusTypesList().length).to.be.equal(15);
      });

      describe('fill access status type name field with unvalid string length', () => {
        beforeEach(async () => {
          await SettingsAccessStatusTypesPage.accessStatusTypesList(0).nameField.fillAndBlur((new Array(76)).fill('a').join(''));
        });

        it('should show validation error message', () => {
          expect(SettingsAccessStatusTypesPage.accessStatusTypesList(0).validationErrorMessage).to.be.equal('Exceeded 75. Please revise.');
        });
      });

      describe('fill access status type name field with empty value', () => {
        beforeEach(async () => {
          await SettingsAccessStatusTypesPage.accessStatusTypesList(0).nameField.fillAndBlur('');
        });

        it('should show validation error message', () => {
          expect(SettingsAccessStatusTypesPage.accessStatusTypesList(0).validationErrorMessage).to.be.equal('Field is required');
        });
      });

      describe('fill description field with unvalid string length', () => {
        beforeEach(async () => {
          await SettingsAccessStatusTypesPage.accessStatusTypesList(0).descriptionField.fillAndBlur((new Array(151)).fill('a').join(''));
        });

        it('should show validation error message', () => {
          expect(SettingsAccessStatusTypesPage.accessStatusTypesList(0).validationErrorMessage).to.be.equal('Exceeded 150. Please revise.');
        });
      });

      describe('fill valid name and description and save it', () => {
        beforeEach(async () => {
          await SettingsAccessStatusTypesPage.accessStatusTypesList(0).nameField.fillAndBlur('name');
          await SettingsAccessStatusTypesPage.accessStatusTypesList(0).descriptionField.fillAndBlur('description');
          await SettingsAccessStatusTypesPage.accessStatusTypesList(0).clickSave();
        });

        it('should show updated list', () => {
          expect(SettingsAccessStatusTypesPage.accessStatusTypesList().length).to.be.equal(15);
        });

        it('new item has correct values', () => {
          expect(SettingsAccessStatusTypesPage.accessStatusTypesList(14).cols(0).context).to.be.equal('name');
          expect(SettingsAccessStatusTypesPage.accessStatusTypesList(14).cols(1).context).to.be.equal('description');
        });

        it('should disable add new button', () => {
          expect(SettingsAccessStatusTypesPage.addNewButtonIsDisabled).to.be.true;
        });
      });
    });

    describe('update first item', () => {
      beforeEach(async () => {
        await SettingsAccessStatusTypesPage.accessStatusTypesList(0).clickEdit();
      });

      it('form sets to edit mode', () => {
        expect(SettingsAccessStatusTypesPage.addNewButtonIsDisabled).to.be.true;
      });

      describe('set new values', () => {
        beforeEach(async () => {
          await SettingsAccessStatusTypesPage.accessStatusTypesList(0).nameField.fillAndBlur('Awesome');
          await SettingsAccessStatusTypesPage.accessStatusTypesList(0).descriptionField.fillAndBlur('test');
          await SettingsAccessStatusTypesPage.accessStatusTypesList(0).clickSave();
        });

        it('first item should have correct values', () => {
          expect(SettingsAccessStatusTypesPage.accessStatusTypesList(0).cols(0).context).to.be.equal('Awesome');
          expect(SettingsAccessStatusTypesPage.accessStatusTypesList(0).cols(1).context).to.be.equal('test');
        });
      });
    });

    describe('delete first item', () => {
      beforeEach(async () => {
        await SettingsAccessStatusTypesPage.accessStatusTypesList(0).clickDelete();
      });

      it('should display confirmation modal', () => {
        expect(SettingsAccessStatusTypesPage.confirmationModalIsPresent).to.be.true;
      });

      describe('when clicking on Cancel', () => {
        beforeEach(async () => {
          await SettingsAccessStatusTypesPage.cancelStatusTypeDeleteButton();
        });

        it('should close the modal', () => {
          expect(SettingsAccessStatusTypesPage.confirmationModalIsPresent).to.be.false;
        });

        it('should not delete the status type', () => {
          expect(SettingsAccessStatusTypesPage.accessStatusTypesList().length).to.be.equal(14);
        });
      });

      describe('when clicking on Delete', () => {
        let typeToDelete = '';

        beforeEach(async () => {
          await SettingsAccessStatusTypesPage.confirmStatusTypeDeleteButton();
          typeToDelete = SettingsAccessStatusTypesPage.accessStatusTypesList(0).cols(0).context;
        });

        it('should close the modal', () => {
          expect(SettingsAccessStatusTypesPage.confirmationModalIsPresent).to.be.false;
        });

        it('should show list of access status types without first item', () => {
          expect(SettingsAccessStatusTypesPage.accessStatusTypesList().length).to.be.equal(13);
        });

        it('should show toast message with correct status type name', () => {
          expect(SettingsAccessStatusTypesPage.successText.includes(typeToDelete)).to.be.true;
        });
      });
    });
  });
});
