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
  isVisible,
  is,
  blurrable
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

@interactor class NotesModal {
  isDisplayed = isPresent('[data-test-notes-modal]');
  searchButtonIsDisabled = is('[data-test-notes-modal-search-button]', ':disabled');
  clickSearchButton = clickable('[data-test-notes-modal-search-button]');
  enterSearchQuery = fillable('[data-test-notes-modal-search-field]');
  blurSearchInput = blurrable('[data-test-notes-modal-search-field]');
  emptyMessageIsDisplayed = isPresent('[class^="mclEmptyMessage"]');
  notesListIsDisplayed = isPresent('#notes-modal-notes-list');
  notes = collection('#notes-modal-notes-list [class^="mclRow---"]', {
    clickCheckbox: clickable('[class^="mclCell"]:first-child [data-test-notes-modal-assignment-checkbox]'),
    checkboxIsSelected: is('[class^="mclCell"]:first-child [data-test-notes-modal-assignment-checkbox]', ':checked'),
  });

  selectAssignedFilter = clickable('[data-test-checkbox-filter-data-option="assigned"');
  selectUnassignedFilter = clickable('[data-test-checkbox-filter-data-option="unassigned"');

  clickSaveButton = clickable('[data-test-notes-modal-save-button');

  performSearch(query) {
    return this.enterSearchQuery(query)
      .blurSearchInput();
  }
}


export default NotesModal;
