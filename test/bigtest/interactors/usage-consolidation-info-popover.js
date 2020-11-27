import {
  isPresent,
  interactor,
  text,
} from '@bigtest/interactor';

import IconButtonInteractor from '@folio/stripes-components/lib/IconButton/tests/interactor';
import ButtonInteractor from '@folio/stripes-components/lib/Button/tests/interactor';

@interactor class UsageConsolidationInfoPopover {
  triggerButton = new IconButtonInteractor('[data-test-info-popover-trigger]');
  button = new ButtonInteractor('[data-test-info-popover-button]');
  content = text('[data-test-info-popover-content]');

  isTriggerButtonLoaded = isPresent('[data-test-info-popover-trigger]');

  whenTriggerButtonLoaded() {
    return this.when(() => this.isTriggerButtonLoaded);
  }

  isPopoverLoaded = isPresent('[data-test-popover-overlay]');

  whenPopoverLoaded() {
    return this.when(() => this.isPopoverLoaded);
  }
}

export default UsageConsolidationInfoPopover;
