import {
  isPresent,
  text,
  clickable,
} from '@bigtest/interactor';

import { interactor } from '../helpers/interactor';

export default @interactor class ResourceEditToggleSectionButton {
  exists = isPresent('[data-test-eholdings-details-view-collapse-all-button]]');
  label = text('[data-test-eholdings-details-view-collapse-all-button]]');
  click = clickable('[data-test-eholdings-details-view-collapse-all-button] button');
}
