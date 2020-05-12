import {
  blurrable,
  value,
  selectable,
} from '@bigtest/interactor';

import { interactor } from '../helpers/interactor';

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
