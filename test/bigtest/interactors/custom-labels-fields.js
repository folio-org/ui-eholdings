import {
  interactor,
  fillable,
  blurrable,
  text,
} from '@bigtest/interactor';

export default @interactor class CustomLabelsFields {
  inputCustomLabel = fillable('input');
  blurCustomLabel = blurrable('input');
  validationErrorMessage = text('[class^="feedbackError--"]');
}
