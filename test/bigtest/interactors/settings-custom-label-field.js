import {
  interactor,
  value,
  blurrable,
  fillable,
  isPresent,
} from '@bigtest/interactor';

export default @interactor class SettingsCustomLabelField {
  label = value('[class^="textField---"] input');
  blurLabel = blurrable('[class^="textField---"] input');
  fillLabel = fillable('[class^="textField---"] input');
  showOnPublicationFinderValue = value('[name$="displayOnPublicationFinder"]');
  showOnFullTextFinderValue = value('[name$="displayOnFullTextFinder"]');
  validationMessageIsPresent = isPresent('[class^="feedbackError---"]');

  fillAndBlurLabel(label) {
    return this
      .fillLabel(label)
      .blurLabel();
  }
}
