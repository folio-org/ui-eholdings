import {
  interactor,
  clickable,
  attribute,
} from '@bigtest/interactor';

export default @interactor class DropDown {
  clickDropDownButton = clickable('button');
  isExpanded = attribute('button', 'aria-expanded');
}
