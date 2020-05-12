import {
  clickable,
  attribute,
} from '@bigtest/interactor';

import { interactor } from '../helpers/interactor';

@interactor class ActionsDropDown {
  clickDropDownButton = clickable('button');
  isExpanded = attribute('button', 'aria-expanded');
}

export default new ActionsDropDown('[data-pane-header-actions-dropdown]');
