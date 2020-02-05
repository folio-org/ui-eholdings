import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import NavigationModal from '../interactors/navigation-modal';
import SettingsCustomLabelsPage from '../interactors/settings-custom-labels';
import wait from '../helpers/wait';

describe('With list of root proxies available to a customer', () => {
  setupApplication();

  describe('when visiting the settings custom-labels form', () => {
    beforeEach(async function () {
      this.visit('/settings/eholdings/custom-labels');
      await wait(1000);
    });

    it('should open settings custom labels page', () => {
      expect(SettingsCustomLabelsPage.isPresent).to.be.true;
    });

    it('should show five rows of custom labels', () => {
      expect(SettingsCustomLabelsPage.customLabels()).to.have.lengthOf(5);
    });

    it('should get correct labels', () => {
      expect(SettingsCustomLabelsPage.customLabels(0).label).to.equal('test label');
      expect(SettingsCustomLabelsPage.customLabels(1).label).to.equal('some label');
      expect(SettingsCustomLabelsPage.customLabels(2).label).to.equal('different label');
      expect(SettingsCustomLabelsPage.customLabels(3).label).to.equal('another one');
      expect(SettingsCustomLabelsPage.customLabels(4).label).to.equal('');
    });

    it('should show correct values for show on publication finder', () => {
      expect(SettingsCustomLabelsPage.customLabels(0).showOnPublicationFinderValue).to.be.oneOf(['false', '']);
      expect(SettingsCustomLabelsPage.customLabels(1).showOnPublicationFinderValue).to.be.oneOf(['false', '']);
      expect(SettingsCustomLabelsPage.customLabels(2).showOnPublicationFinderValue).to.equal('true');
      expect(SettingsCustomLabelsPage.customLabels(3).showOnPublicationFinderValue).to.equal('true');
      expect(SettingsCustomLabelsPage.customLabels(4).showOnPublicationFinderValue).to.be.oneOf(['false', '']);
    });

    it('should show correct values for show on full text finder', () => {
      expect(SettingsCustomLabelsPage.customLabels(0).showOnFullTextFinderValue).to.equal('true');
      expect(SettingsCustomLabelsPage.customLabels(1).showOnFullTextFinderValue).to.be.oneOf(['false', '']);
      expect(SettingsCustomLabelsPage.customLabels(2).showOnFullTextFinderValue).to.be.oneOf(['false', '']);
      expect(SettingsCustomLabelsPage.customLabels(3).showOnFullTextFinderValue).to.equal('true');
      expect(SettingsCustomLabelsPage.customLabels(4).showOnFullTextFinderValue).to.be.oneOf(['false', '']);
    });

    it('save button is disabled', () => {
      expect(SettingsCustomLabelsPage.saveButtonDisabled).to.be.true;
    });

    describe('delete label where one of checkboxes is checked', () => {
      beforeEach(async () => {
        await SettingsCustomLabelsPage.customLabels(0).fillAndBlurLabel('');
      });

      it('should show error message', () => {
        expect(SettingsCustomLabelsPage.customLabels(0).validationMessageIsPresent).to.be.true;
      });
    });

    describe('fill unvalid character', () => {
      beforeEach(async () => {
        await SettingsCustomLabelsPage.customLabels(0).fillAndBlurLabel('�');
      });

      it('should show error message', () => {
        expect(SettingsCustomLabelsPage.customLabels(0).validationMessageIsPresent).to.be.true;
      });
    });

    describe('fill more then 50 character', () => {
      beforeEach(async () => {
        await SettingsCustomLabelsPage.customLabels(0).fillAndBlurLabel((new Array(51)).fill('a').join('')); // 51 character
      });

      it('should show error message', () => {
        expect(SettingsCustomLabelsPage.customLabels(0).validationMessageIsPresent).to.be.true;
      });
    });

    describe('delete label where all checkboxes are unchecked', () => {
      beforeEach(async () => {
        await SettingsCustomLabelsPage.customLabels(1).fillAndBlurLabel('');
      });

      it('save button is disabled', () => {
        expect(SettingsCustomLabelsPage.saveButtonDisabled).to.be.false;
      });

      describe('click on save button', () => {
        beforeEach(async () => {
          await SettingsCustomLabelsPage.save();
        });

        it('should show remove confirmation modal', () => {
          expect(SettingsCustomLabelsPage.removeConfirmationModal.isPresent).to.be.true;
        });

        describe('click on cancel button', () => {
          beforeEach(async () => {
            await SettingsCustomLabelsPage.removeConfirmationModal.cancelButton.click();
          });

          it('should show remove confirmation modal', () => {
            expect(SettingsCustomLabelsPage.removeConfirmationModal.isPresent).to.be.false;
          });
        });

        describe('click on remove button', () => {
          beforeEach(async () => {
            await SettingsCustomLabelsPage.removeConfirmationModal.confirmButton.click();
          });

          it('should show remove confirmation modal', () => {
            expect(SettingsCustomLabelsPage.removeConfirmationModal.isPresent).to.be.false;
          });

          it('save button should be disabled', () => {
            expect(SettingsCustomLabelsPage.saveButtonDisabled).to.be.true;
          });
        });
      });
    });

    describe('click on close pane button when form changed', () => {
      beforeEach(async () => {
        await SettingsCustomLabelsPage.customLabels(0).fillAndBlurLabel('new label');
        await SettingsCustomLabelsPage.closeButton();
      });

      it('should show unsaved changes confirmation modal', () => {
        expect(SettingsCustomLabelsPage.navigationModal.isPresent).to.be.true;
      });

      it('shows a navigation confirmation modal', () => {
        expect(NavigationModal.$root).to.exist;
      });
    });

    describe('save new custom label', () => {
      beforeEach(async () => {
        await SettingsCustomLabelsPage.customLabels(0).fillAndBlurLabel('new label');
        await SettingsCustomLabelsPage.save();
      });

      it('should show a success toast message', () => {
        expect(SettingsCustomLabelsPage.toast.successText).to.equal('Custom labels have been updated');
      });
    });
  });
});
