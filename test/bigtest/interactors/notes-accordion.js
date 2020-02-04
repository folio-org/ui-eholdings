import {
  interactor,
  isPresent,
  clickable,
  collection,
  text,
} from '@bigtest/interactor';

import Button from './button';

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

  notesListIsDisplayed = isPresent('#notes-list');
  notes = collection('#notes-list [class^="mclRow---"]', {
    click: clickable(),
    title: text('[class^="mclCell---":last-child]'),
  });
}


export default NotesAccordion;
