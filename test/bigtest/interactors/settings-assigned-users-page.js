import {
  clickable,
  collection,
  interactor,
  isPresent,
} from '@bigtest/interactor';

@interactor class SettingsAssignedUsersPage {
  usersListIsDisplayed = isPresent('#users-list');
  emptyMessageIsDisplayed = isPresent('#assignedUsersEmptyMessage');
  unassignConfirmationModalIsDisplayed = isPresent('#unassignConfirmationModal');
  confirmUserUnassignment = clickable('#unassignConfirmationButton');
  cancelUserUnassignment = clickable('#unassignCancellationButton');
  assignedUsersList = collection('[class^="mclRow---"]', {
    clickDelete: clickable('[data-test-delete-user]'),
  });
}

export default new SettingsAssignedUsersPage();
