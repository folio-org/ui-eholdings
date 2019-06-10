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

@interactor class NotesModal {
  isDisplayed = isPresent('[class^="modal"]');
}


export default NotesModal;
