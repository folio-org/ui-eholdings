import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication, { axe } from '../helpers/setup-application';
import wait from '../helpers/wait';
import SettingsAssignedUsersPage from '../interactors/settings-assigned-users-page';

describe('with list of users assigned to a KB', () => {
  setupApplication();

  let a11yResults = null;

  describe('when visiting Assigned users page', () => {
    beforeEach(async function () {
      this.visit('/settings/eholdings/1/users');
      await wait(1000);
      a11yResults = await axe.run();
    });

    it('should not have any a11y issues', () => {
      expect(a11yResults.violations).to.be.empty;
    });

    it('should render users list', () => {
      expect(SettingsAssignedUsersPage.usersListIsDisplayed).to.be.true;
    });

    it('should render 2 assigned users', () => {
      expect(SettingsAssignedUsersPage.assignedUsersList().length).to.be.equal(2);
    });

    describe('and delete button was clicked', () => {
      beforeEach(async () => {
        await SettingsAssignedUsersPage.assignedUsersList(1).clickDelete();
        a11yResults = await axe.run();
      });

      it('should not have any a11y issues', () => {
        expect(a11yResults.violations).to.be.empty;
      });

      it('should display confirmation modal', () => {
        expect(SettingsAssignedUsersPage.unassignConfirmationModalIsDisplayed).to.be.true;
      });

      describe('and confirm button was clicked', () => {
        beforeEach(async () => {
          await SettingsAssignedUsersPage.confirmUserUnassignment();
        });

        it('should close the modal', () => {
          expect(SettingsAssignedUsersPage.unassignConfirmationModalIsDisplayed).to.be.false;
        });

        it('should render 1 assigned user', () => {
          expect(SettingsAssignedUsersPage.assignedUsersList().length).to.be.equal(1);
        });

        describe('and the last user in the list was unassigned', () => {
          beforeEach(async () => {
            await SettingsAssignedUsersPage.assignedUsersList(0).clickDelete();
            await SettingsAssignedUsersPage.confirmUserUnassignment();
          });

          it('should not render assigned users list', () => {
            expect(SettingsAssignedUsersPage.usersListIsDisplayed).to.be.false;
          });

          it('should render empty message', () => {
            expect(SettingsAssignedUsersPage.emptyMessageIsDisplayed).to.be.true;
          });
        });
      });

      describe('and cancel button was clicked', () => {
        beforeEach(async () => {
          await SettingsAssignedUsersPage.cancelUserUnassignment();
        });

        it('should close the modal', () => {
          expect(SettingsAssignedUsersPage.unassignConfirmationModalIsDisplayed).to.be.false;
        });

        it('should render 2 assigned users', () => {
          expect(SettingsAssignedUsersPage.assignedUsersList().length).to.be.equal(2);
        });
      });
    });
  });
});
