import {
  clickable,
  text,
  computed
} from '@bigtest/interactor';

import { interactor } from '../helpers/interactor';

export default @interactor class SearchBadge {
  clickIcon = clickable('[data-test-eholdings-search-filters="icon"]')
  filterIsPresent = computed(function () { return this.filterText !== ''; })
  filterText = text()
}
