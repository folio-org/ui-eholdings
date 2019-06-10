import {
  action,
  interactor,
  isPresent,
  fillable,
  clickable,
  collection,
  scoped,
  property,
  value,
  isVisible
} from '@bigtest/interactor';

@interactor class Button {
  isDisplayed = isVisible();
  click = clickable();
}

@interactor class NotesList {
  isDisplayed = isPresent();

  notes = collection('[class^="mcl"]', {
    click: clickable(),
  });

  clickNote(noteIndex) {
    return this.notes(noteIndex).click();
  }
}

@interactor class NotesAccordion {
  isDisplayed = isPresent('#packageShowNotes');

  assignButtonDisplayed = isPresent('[data-test-notes-accordion-assign-button]');
  newButtonDisplayed = isPresent('[data-test-notes-accordion-new-button]');

  clickAssignButton = clickable('[data-test-notes-accordion-assign-button]');
  clickNewButton = clickable('[data-test-notes-accordion-new-button]');

  newButton = new Button('[data-test-notes-accordion-new-button]');
  assignButton = new Button('[data-test-notes-accordion-assign-button]');

  notesList = new NotesList('#notes-list');

  notesListIsDisplayed = isPresent('#notes-list');
}


export default NotesAccordion;
