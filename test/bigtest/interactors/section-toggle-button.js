import {
  interactor,
  isPresent,
  text,
  clickable,
} from '@bigtest/interactor';

export default @interactor class SectionToggleButton {
  exists = isPresent('[data-test-eholdings-details-view-collapse-all-button]]');
  label = text('[data-test-eholdings-details-view-collapse-all-button]]');
  click = clickable('[data-test-eholdings-details-view-collapse-all-button] button');
}
