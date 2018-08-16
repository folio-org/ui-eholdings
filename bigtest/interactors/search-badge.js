import {
  interactor,
  clickable,
  isPresent,
  text
} from '@bigtest/interactor';

export default @interactor class SearchBadge {
  clickIcon = clickable('[data-test-eholdings-search-filters="icon"]')
  filterIsPresent = isPresent('[data-test-eholdings-search-filters="badge"]')
  filterText = text('[data-test-eholdings-search-filters="badge"]')
}
