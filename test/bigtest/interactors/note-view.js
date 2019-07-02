import {
  interactor,
  isPresent,
  clickable,
  text
} from '@bigtest/interactor';

import { AccordionInteractor } from '@folio/stripes-components/lib/Accordion/tests/interactor';

@interactor class DeleteConfirmationModal {
  clickCancelButton = clickable('[data-test-confirmation-modal-cancel-button]');
  clickConfirmButton = clickable('[data-test-confirmation-modal-confirm-button]');
  message = text('[data-test-delete-confirmation-message]');
}

@interactor class NoteView {
  noteType = text('[data-test-note-view-note-type]');
  noteTitle = text('[data-test-note-view-note-title]');
  noteDetails = text('[data-test-note-view-note-details]');
  clickCancelButton = clickable('[data-test-leave-note-view]');
  clickEditButton = clickable('[data-test-navigate-note-edit]');
  generalInfoAccordionIsDisplayed = isPresent('#noteGeneralInfo');
  assignmentInformationAccordionIsDisplayed = isPresent('#assigned');
  referredEntityType = text('[data-test-referred-entity-type]');
  referredEntityName = text('[data-test-referred-entity-name]');
  clickPaneHeaderButton = clickable('[class^="paneHeaderCenterButton"]');
  clickDeleteButton = clickable('[data-test-note-delete]');
  deleteConfirmationModalIsDisplayed = isPresent('#confirm-delete-note');
  deleteConfirmationModal = new DeleteConfirmationModal('#confirm-delete-note');
  assignmentAccordion = new AccordionInteractor('#assigned');

  performDeleteNoteAction() {
    return this.clickPaneHeaderButton()
      .clickDeleteButton();
  }
}

export default NoteView;
