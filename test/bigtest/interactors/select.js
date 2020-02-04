import {
  interactor,
  blurrable,
  value,
  selectable,
} from '@bigtest/interactor';

export default @interactor class Select {
  selectOption = selectable();
  blur = blurrable();
  value = value();

  selectAndBlur(val) {
    return this
      .selectOption(val)
      .blur();
  }
}
