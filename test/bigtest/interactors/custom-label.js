import { text } from '@bigtest/interactor';

import { interactor } from '../helpers/interactor';

export default @interactor class CustomLabel {
  label = text('[class^="kvLabel---"]');
  value = text('[class^="kvValue---"]');
}
