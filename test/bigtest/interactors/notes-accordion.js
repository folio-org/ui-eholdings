import {
  interactor,
  isPresent,
  clickable,
  collection,
  text,
  isVisible
} from '@bigtest/interactor';

@interactor class Button {
  isDisplayed = isVisible();
  click = clickable();
}

@interactor class NotesList {
  isDisplayed = isPresent();

  clickNote(noteIndex) {
    return this.notes(noteIndex).click();
  }
}

@interactor class NotesAccordion {
  packageNotesAccordionIsDisplayed = isPresent('#packageShowNotes');
  providerNotesAccordionIsDisplayed = isPresent('#providerShowNotes');
  resourceNotesAccordionIsDisplayed = isPresent('#resourceShowNotes');

  assignButtonDisplayed = isPresent('[data-test-notes-accordion-assign-button]');
  newButtonDisplayed = isPresent('[data-test-notes-accordion-new-button]');

  clickAssignButton = clickable('[data-test-notes-accordion-assign-button]');
  clickNewButton = clickable('[data-test-notes-accordion-new-button]');

  newButton = new Button('[data-test-notes-accordion-new-button]');
  assignButton = new Button('[data-test-notes-accordion-assign-button]');

  notesList = new NotesList('#notes-list');

  notesListIsDisplayed = isPresent('#notes-list');

  notes = collection('#notes-list [class^="mclRow"]', {
    click: clickable(),
    title: text('[class^="mclCell":last-child]'),
  });
}


export default NotesAccordion;
