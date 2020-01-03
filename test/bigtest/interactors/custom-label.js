import { interactor, text } from '@bigtest/interactor';

export default @interactor class CustomLabel {
  label = text('[class^="kvLabel---"]');
  value = text('[class^="kvValue---"]');
}
