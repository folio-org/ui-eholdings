import {
  interactor,
  isPresent,
  clickable,
  text
} from '@bigtest/interactor';

import { AccordionInteractor } from '@folio/stripes-components/lib/Accordion/tests/interactor';
import DeleteConfirmationModal from './delete-confirmation-modal';

@interactor class NoteView {
  isLoaded = isPresent('[class^=note-view-content]');
  whenLoaded() {
    return this.when(() => this.isLoaded);
  }

  noteType = text('[data-test-note-view-note-type]');
  noteTitle = text('[data-test-note-view-note-title]');
  noteDetails = text('[data-test-note-view-note-details]');
  clickCancelButton = clickable('[data-test-leave-note-view]');
  clickEdit = clickable('[data-test-navigate-note-edit]');
  generalInfoAccordionIsDisplayed = isPresent('#noteGeneralInfo');
  assignmentInformationAccordionIsDisplayed = isPresent('#assigned');
  referredEntityType = text('[data-test-referred-entity-type]');
  referredEntityName = text('[data-test-referred-entity-name]');
  clickPaneHeaderButton = clickable('[data-test-pane-header-actions-button]');
  clickDeleteButton = clickable('[data-test-note-delete]');
  deleteConfirmationModalIsDisplayed = isPresent('#confirm-delete-note');
  deleteConfirmationModal = new DeleteConfirmationModal('#confirm-delete-note');
  assignmentAccordion = new AccordionInteractor('#assigned');

  performDeleteNoteAction() {
    return this.clickPaneHeaderButton()
      .clickDeleteButton();
  }

  clickEditButton() {
    return this.clickPaneHeaderButton()
      .clickEdit();
  }
}

export default NoteView;
