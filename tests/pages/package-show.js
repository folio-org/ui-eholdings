import {
  clickable,
  collection,
  computed,
  isPresent,
  page,
  property,
  action,
  text,
  triggerable
} from '@bigtest/interaction';
import { isRootPresent, getComputedStyle, hasClassBeginningWith } from './helpers';
import Datepicker from './datepicker';

@page class PackageShowModal {
  confirmDeselection = clickable('[data-test-eholdings-package-deselection-confirmation-modal-yes]');
  cancelDeselection = clickable('[data-test-eholdings-package-deselection-confirmation-modal-no]');
}

@page class PackageShowPage {
  exist = isRootPresent();
  allowKbToAddTitles = property('checked', '[data-test-eholdings-package-details-allow-add-new-titles] input');
  hasAllowKbToAddTitles = isPresent('[data-test-eholdings-package-details-toggle-allow-add-new-titles] input');
  hasAllowKbToAddTitlesToggle = isPresent('[package-details-toggle-allow-add-new-titles-switch]');
  isSelected = property('checked', '[data-test-eholdings-package-details-selected] input');
  isSelecting = hasClassBeginningWith('is-pending--', '[data-test-eholdings-package-details-selected] [data-test-toggle-switch]');
  isSelectedToggleDisabled = property('disabled', '[data-test-eholdings-package-details-selected] input[type=checkbox]');
  modal = new PackageShowModal('#eholdings-package-confirmation-modal');
  toggleAllowKbToAddTitles = clickable('[data-test-eholdings-package-details-allow-add-new-titles] input');
  toggleIsSelected = clickable('[data-test-eholdings-package-details-selected] input');
  paneTitle = text('[data-test-eholdings-details-view-pane-title]');
  name = text('[data-test-eholdings-details-view-name="package"]');
  contentType = text('[data-test-eholdings-package-details-content-type]');
  numTitles = text('[data-test-eholdings-package-details-titles-total]');
  numTitlesSelected = text('[data-test-eholdings-package-details-titles-selected]');
  hasErrors = isPresent('[data-test-eholdings-details-view-error="package"]');
  hasBackButton = isPresent('[data-test-eholdings-details-view-back-button] button');
  clickBackButton = clickable('[data-test-eholdings-details-view-back-button] button');
  detailsPaneContentScrollHeight = property('scrollHeight', '[data-test-eholdings-detail-pane-contents]');

  detailPaneMouseWheel = triggerable('wheel', '[data-test-eholdings-detail-pane-contents]', {
    bubbles: true,
    deltaY: -1
  });

  titlesHaveLoaded = computed(function () {
    return this.titleList().length > 0;
  });

  toggleIsHidden = clickable('[data-test-eholdings-package-details-hidden] input');
  isVisibleToPatrons = property('checked', '[data-test-eholdings-package-details-hidden] input');
  isHiddenMessage = text('[data-test-eholdings-package-details-is-hidden]');
  isHiddenMessagePresent = isPresent('[data-test-eholdings-package-details-is-hidden]');
  isHiddenToggleDisabled = property('disabled', '[data-test-eholdings-package-details-hidden] input[type=checkbox]');
  isHiddenTogglePresent = isPresent('[data-test-eholdings-package-details-hidden] input');
  isHiding = hasClassBeginningWith('is-pending--', '[data-test-eholdings-package-details-hidden] [data-test-toggle-switch]');

  allTitlesHidden = computed(function () {
    return !!this.titleList().length && this.titleList().every(title => title.isHidden);
  });

  allTitlesSelected = computed(function () {
    return !!this.titleList().length && this.titleList().every(title => title.isSelected);
  });

  titleList = collection('[data-test-query-list="package-titles"] li a', {
    name: text('[data-test-eholdings-title-list-item-title-name]'),
    isSelectedLabel: text('[data-test-eholdings-title-list-item-title-selected]'),
    isSelected: computed(function () {
      return this.isSelectedLabel === 'Selected';
    }),
    isHiddenLabel: text('[data-test-eholdings-title-list-item-title-hidden]'),
    isHidden: computed(function () {
      return this.isHiddenLabel === 'Hidden';
    })
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

  titleContainerHeight = property('offsetHeight', '[data-test-eholdings-details-view-list="package"]');
  detailPaneContentsHeight = property('offsetHeight', '[data-test-eholdings-detail-pane-contents]');
  titleQueryListOverFlowY = getComputedStyle('overflow-y', '[data-test-query-list="package-titles"]');
  detailsPaneContentsOverFlowY = getComputedStyle('overflow-y', '[data-test-eholdings-detail-pane-contents]');

  hasCustomCoverage = isPresent('[data-test-eholdings-package-details-custom-coverage-display]');
  customCoverage = text('[data-test-eholdings-package-details-custom-coverage-display]');
  hasCustomCoverageAddButton = isPresent('[data-test-eholdings-package-details-custom-coverage-button] button');
  clickCustomCoverageAddButton = clickable('[data-test-eholdings-package-details-custom-coverage-button] button');
  clickCustomCoverageCancelButton = clickable('[data-test-eholdings-package-details-cancel-custom-coverage-button] button');
  clickCustomCoverageEditButton = clickable('[data-test-eholdings-package-details-edit-custom-coverage-button] button');
  clickCustomCoverageSaveButton = clickable('[data-test-eholdings-package-details-save-custom-coverage-button] button');
  isCustomCoverageDisabled = property('disabled', '[data-test-eholdings-package-details-save-custom-coverage-button] button');
  validationError = text('[data-test-eholdings-custom-coverage-date-range-begin] [class^="feedbackError"]');

  beginDate = new Datepicker('[data-test-eholdings-custom-coverage-date-range-begin]');
  endDate = new Datepicker('[data-test-eholdings-custom-coverage-date-range-end]');

  fillDates(beginDate, endDate) {
    return this.beginDate.fillAndBlur(beginDate)
      .append(this.endDate.fillAndBlur(endDate));
  }

  deselectAndConfirmPackage() {
    return this.toggleIsSelected().append(this.modal.confirmDeselection());
  }

  deselectAndCancelPackage() {
    return this.toggleIsSelected().append(this.modal.cancelDeselection());
  }
}

export default new PackageShowPage('[data-test-eholdings-details-view="package"]');
