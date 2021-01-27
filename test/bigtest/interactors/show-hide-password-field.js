import {
  clickable,
  interactor,
  isPresent,
} from '@bigtest/interactor';

import TextFieldInteractor from '@folio/stripes-components/lib/TextField/tests/interactor';

export default interactor(class ShowHidePasswordFieldInteractor {
  clickShowHideButton = clickable('[class*="showHideButton--"]');
  isShowHideButtonPresent = isPresent('[class*="showHideButton--"]');
  customerKeyInput = new TextFieldInteractor('[class*="showHideTextField--"]');
});

