import {
  interactor,
  clickable,
  attribute,
} from '@bigtest/interactor';

@interactor class ActionsDropDown {
  clickDropDownButton = clickable('button');
  isExpanded = attribute('button', 'aria-expanded');
}

export default new ActionsDropDown('[data-pane-header-actions-dropdown]');
