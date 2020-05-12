import {
  blurrable,
  fillable,
  value,
} from '@bigtest/interactor';

import { interactor } from '../helpers/interactor';

export default @interactor class FormField {
  enterText(string) {
    return this
      .fill(string)
      .blur();
  }

  blur = blurrable();
  fill = fillable();
  value = value();
}
