import {
  action,
  collection,
  computed,
  isPresent,
  interactor,
  text,
  clickable,
  is
} from '@bigtest/interactor';

import Toast from './toast';
import SearchModal from './search-modal';
import SearchBadge from './search-badge';

@interactor class ProviderShowPage {
  paneTitle = text('[data-test-eholdings-details-view-pane-title]');
  name = text('[data-test-eholdings-details-view-name="provider"]');
  nameHasFocus = is('[data-test-eholdings-details-view-name="provider"]', ':focus');
  numPackages = text('[data-test-eholdings-provider-details-packages-total]');
  numPackagesSelected = text('[data-test-eholdings-provider-details-packages-selected]');
  hasBackButton = isPresent('[data-test-eholdings-details-view-back-button]');
  hasCollapseAllButton = isPresent('[data-test-eholdings-details-view-collapse-all-button]');
  collapseAllButtonText = text('[data-test-eholdings-details-view-collapse-all-button]');
  clickCollapseAllButton = clickable('[data-test-eholdings-details-view-collapse-all-button] button');
  hasErrors = isPresent('[data-test-eholdings-details-view-error="provider"]');
  errorMessage = text('[data-test-eholdings-details-view-error="provider"]');
  clickListSearch = clickable('[data-test-eholdings-search-filters="icon"]');
  numFilters = text('[data-test-eholdings-search-filters="badge"]');
  filterBadge = isPresent('[data-test-eholdings-details-view-filters-badge]');
  proxy = text('[data-test-eholdings-provider-details-proxy]');

  toast = Toast;
  searchModal = new SearchModal('#eholdings-details-view-search-modal');
  searchModalBadge = new SearchBadge('[data-test-eholdings-search-modal-badge]');

  packageList = collection('[data-test-query-list="provider-packages"] li a', {
    name: text('[data-test-eholdings-package-list-item-name]'),
    selectedLabel: text('[data-test-eholdings-title-list-item-title-selected]'),
    isHiddenLabel: text('[data-test-eholdings-package-list-item-title-hidden]'),
    isPackageHidden: computed(function () {
      return this.isHiddenLabel === 'Hidden';
    }),
    numTitles: text('[data-test-eholdings-package-list-item-num-titles]'),
    numTitlesSelected: text('[data-test-eholdings-package-list-item-num-titles-selected]')
  });
  searchResultsCount = text('[data-test-eholdings-details-view-results-count]');

  packageListHasLoaded = computed(function () {
    return this.packageList().length > 0;
  })

  scrollToPackageOffset = action(function (readOffset) {
    return this.find('[data-test-query-list="provider-packages"] li')
      .do((firstItem) => {
        return this.scroll('[data-test-query-list="provider-packages"]', {
          top: firstItem.offsetHeight * readOffset
        });
      });
  })
}

export default new ProviderShowPage('[data-test-eholdings-details-view="provider"]');
