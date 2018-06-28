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

@interactor class ProviderShowPage {
  paneTitle = text('[data-test-eholdings-details-view-pane-title]');
  name = text('[data-test-eholdings-details-view-name="provider"]');
  nameHasFocus = is('[data-test-eholdings-details-view-name="provider"]', ':focus');
  numPackages = text('[data-test-eholdings-provider-details-packages-total]');
  numPackagesSelected = text('[data-test-eholdings-provider-details-packages-selected]');
  hasBackButton = isPresent('[data-test-eholdings-details-view-back-button] button');
  hasErrors = isPresent('[data-test-eholdings-details-view-error="provider"]');
  errorMessage = text('[data-test-eholdings-details-view-error="provider"]');
  clickListSearch = clickable('[data-test-eholdings-details-view-search] button');
  numFilters = text('[data-test-eholdings-details-view-filters]');
  filterBadge = isPresent('[data-test-eholdings-details-view-filters]');

  toast = Toast;
  searchModal = new SearchModal('#eholdings-details-view-search-modal');

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
