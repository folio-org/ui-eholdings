import {
  fillable,
  blurrable,
  text,
} from '@bigtest/interactor';

import { interactor } from '../helpers/interactor';

export default @interactor class CustomLabelsFields {
  inputCustomLabel = fillable('input');
  blurCustomLabel = blurrable('input');
  validationErrorMessage = text('[class^="feedbackError--"]');
}
