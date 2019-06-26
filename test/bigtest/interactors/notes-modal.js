import {
  interactor,
  isPresent,
  fillable,
  clickable,
  collection,
  is,
  blurrable
} from '@bigtest/interactor';

@interactor class NotesModal {
  isDisplayed = isPresent('[data-test-notes-modal]');
  searchButtonIsDisabled = is('[data-test-notes-modal-search-button]', ':disabled');
  clickSearchButton = clickable('[data-test-notes-modal-search-button]');
  enterSearchQuery = fillable('[data-test-notes-modal-search-field]');
  blurSearchInput = blurrable('[data-test-notes-modal-search-field]');
  emptyMessageIsDisplayed = isPresent('[class^="mclEmptyMessage"]');
  notesListIsDisplayed = isPresent('#notes-modal-notes-list');
  selectAssignedFilter = clickable('[data-test-checkbox-filter-data-option="assigned"');
  selectUnassignedFilter = clickable('[data-test-checkbox-filter-data-option="unassigned"');
  clickSaveButton = clickable('[data-test-notes-modal-save-button');
  notes = collection('#notes-modal-notes-list [class^="mclRow---"]', {
    clickCheckbox: clickable('[class^="mclCell"]:first-child [data-test-notes-modal-assignment-checkbox]'),
    checkboxIsSelected: is('[class^="mclCell"]:first-child [data-test-notes-modal-assignment-checkbox]', ':checked'),
  });

  performSearch(query) {
    return this.enterSearchQuery(query)
      .blurSearchInput();
  }
}


export default NotesModal;
