import {
  clickable,
  collection,
  scoped,
  computed,
  interactor,
  isPresent,
  property,
  action,
  text,
  triggerable,
  is,
} from '@bigtest/interactor';

import AgreementsAccordion from './agreements-accordion';
import TagsAccordion from './tags-accordion';
import AccessTypesAccordion from './access-types-accordion';
import {
  getComputedStyle,
  hasClassBeginningWith,
} from './helpers';
import Datepicker from './datepicker';
import Toast from './toast';
import SearchModal from './search-modal';
import SearchBadge from './search-badge';
import PackageSelectionStatus from './selection-status';
import ActionsDropDown from './actions-drop-down';
import PackageDropDownMenu from './package-drop-down-menu';
import PackageModal from './package-modal';

@interactor class PackageShowPage {
  isLoaded = isPresent('[data-test-eholdings-details-view-name="package"]');

  whenLoaded() {
    return this.when(() => this.isLoaded);
  }

  allowKbToAddTitles = text('[data-test-eholdings-package-details-allow-add-new-titles]');
  hasAllowKbToAddTitles = isPresent('[data-test-eholdings-package-details-toggle-allow-add-new-titles] input');
  hasAllowKbToAddTitlesToggle = isPresent('[package-details-toggle-allow-add-new-titles-switch]');
  selectionStatus = new PackageSelectionStatus();
  modal = new PackageModal('#eholdings-package-confirmation-modal');
  searchModal = new SearchModal('#eholdings-details-view-search-modal');
  searchResultsCount = text('[data-test-eholdings-details-view-results-count]');
  clickListSearch = clickable('[data-test-eholdings-search-filters="icon"]');
  paneTitle = text('[data-test-eholdings-details-view-pane-title]');
  contentType = text('[data-test-eholdings-package-details-content-type]');
  name = text('[data-test-eholdings-details-view-name="package"]');
  nameHasFocus = is('[data-test-eholdings-details-view-name="package"]', ':focus');
  numTitles = text('[data-test-eholdings-package-details-titles-total]');
  numTitlesSelected = text('[data-test-eholdings-package-details-titles-selected]');
  packageType = text('[data-test-eholdings-package-details-type]');
  hasProxy = isPresent('[data-test-eholdings-details-proxy]');
  proxyValue = text('[data-test-eholdings-details-proxy]');
  packageToken = text('[data-test-eholdings-details-token="package"]');
  packageTokenMessage = text('[data-test-eholdings-details-token-message="package"]');
  isPackageTokenPresent = isPresent('[data-test-eholdings-details-token="package"]');
  providerToken = text('[data-test-eholdings-details-token="provider"]');
  providerTokenMessage = text('[data-test-eholdings-details-token-message="provider"]');
  isProviderTokenPresent = isPresent('[data-test-eholdings-details-token="provider"]');
  isTagsPresent = isPresent('[data-test-eholdings-details-tags]');
  hasErrors = isPresent('[data-test-eholdings-details-view-error="package"]');
  hasBackButton = isPresent('[data-test-eholdings-details-view-back-button]');
  hasCollapseAllButton = isPresent('[data-test-eholdings-details-view-collapse-all-button]');
  collapseAllButtonText = text('[data-test-eholdings-details-view-collapse-all-button]');
  clickCollapseAllButton = clickable('[data-test-eholdings-details-view-collapse-all-button] button');
  clickBackButton = clickable('[data-test-eholdings-details-view-back-button]');
  detailsPaneContentScrollHeight = property('[data-test-eholdings-detail-pane-contents]', 'scrollHeight');
  actionsDropDown = ActionsDropDown;
  dropDownMenu = new PackageDropDownMenu();
  searchModalBadge = new SearchBadge('[data-test-eholdings-search-modal-badge]');
  isAccessTypeSectionPresent = isPresent('[data-test-eholdings-details-access-type]');
  accessType = text('[data-test-eholdings-details-access-type]');

  detailPaneMouseWheel = triggerable('[data-test-eholdings-detail-pane-contents]', 'wheel', {
    bubbles: true,
    deltaY: -1
  });

  isVisibleToPatrons = text('[data-test-eholdings-package-details-visibility-status]');
  isVisibilityStatusPresent = isPresent('[data-test-eholdings-package-details-visibility-status]');
  isHiding = hasClassBeginningWith('[data-test-eholdings-package-details-hidden] [data-test-toggle-switch]', 'is-pending--');

  allTitlesSelected = computed(function () {
    return !!this.titleList().length && this.titleList().every(title => title.isSelected);
  });

  hasTitleList = isPresent('[data-test-query-list="package-titles"]');
  titleList = collection('[data-test-query-list="package-titles"] li a', {
    name: text('[data-test-eholdings-title-list-item-title-name]'),
    isSelectedLabel: text('[data-test-eholdings-title-list-item-title-selected]'),
    isSelected: computed(function () {
      return this.isSelectedLabel === 'Selected';
    }),
    isHiddenLabel: text('[data-test-eholdings-title-list-item-title-hidden]'),
    clickToTitle: clickable()
  });

  detailsPaneScrollTop = action(function (offset) {
    return this.find('[data-test-query-list="package-titles"]')
      .do(() => {
        return this.scroll('[data-test-eholdings-detail-pane-contents]', {
          top: offset
        });
      });
  });

  scrollToTitleOffset = action(function (readOffset) {
    return this.find('[data-test-query-list="package-titles"] li')
      .do((firstItem) => {
        return this.scroll('[data-test-query-list="package-titles"]', {
          top: firstItem.offsetHeight * readOffset
        });
      });
  });

  clickEditButton = action(function () {
    return this
      .actionsDropDown.clickDropDownButton()
      .dropDownMenu.clickEdit();
  });

  titleContainerHeight = property('[data-test-eholdings-details-view-list="package"]', 'offsetHeight');
  detailPaneContentsHeight = property('[data-test-eholdings-detail-pane-contents]', 'offsetHeight');
  titleQueryListOverFlowY = getComputedStyle('[data-test-query-list="package-titles"]', 'overflow-y');
  detailsPaneContentsOverFlowY = getComputedStyle('[data-test-eholdings-detail-pane-contents]', 'overflow-y');

  hasCustomCoverage = isPresent('[data-test-eholdings-package-details-custom-coverage-display]');
  customCoverage = text('[data-test-eholdings-package-details-custom-coverage-display]');
  hasCustomCoverageAddButton = isPresent('[data-test-eholdings-package-details-custom-coverage-button] button');
  validationError = text('[data-test-eholdings-coverage-fields-date-range-begin] [class^="feedbackError"]');

  beginDate = scoped('[data-test-eholdings-coverage-fields-date-range-begin]', Datepicker);
  endDate = scoped('[data-test-eholdings-coverage-fields-date-range-end]', Datepicker);

  toast = Toast;

  agreementsSection = new AgreementsAccordion('#packageShowAgreements');
  findAgreementsModalIsVisible = isPresent('[class^="modal"] #list-agreements');

  tagsSection = new TagsAccordion('[data-test-eholdings-tag-filter]');
  accessTypesSection = new AccessTypesAccordion('[data-test-eholdings-access-types-filter]');

  selectPackage() {
    return this
      .actionsDropDown.clickDropDownButton()
      .dropDownMenu.addToHoldings.click();
  }

  deselectAndConfirmPackage() {
    return this
      .actionsDropDown.clickDropDownButton()
      .dropDownMenu.removeFromHoldings.click()
      .modal.confirmDeselection();
  }

  deselectAndCancelPackage() {
    return this
      .actionsDropDown.clickDropDownButton()
      .dropDownMenu.removeFromHoldings.click()
      .modal.cancelDeselection();
  }
}

export default new PackageShowPage('[data-test-eholdings-details-view="package"]');
