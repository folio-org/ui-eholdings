import $ from 'jquery';
import { expect } from 'chai';

import { convergeOn } from '../it-will';
import { advancedFillIn, pressEnter } from './helpers';

function createTitleObject(element) {
  let $scope = $(element);

  return {
    get name() {
      return $scope.find('[data-test-eholdings-title-list-item-title-name]').text();
    },

    get isSelected() {
      return $scope.find('[data-test-eholdings-title-list-item-title-selected]').text() === 'Selected';
    },

    get isHidden() {
      return $scope.find('[data-test-eholdings-title-list-item-title-hidden]').text() === 'Hidden';
    }

  };
}

export default {
  get $root() {
    return $('[data-test-eholdings-details-view="package"]');
  },

  get name() {
    return $('[data-test-eholdings-details-view-name="package"]').text();
  },

  get provider() {
    return $('[data-test-eholdings-package-details-provider]').text();
  },

  get contentType() {
    return $('[data-test-eholdings-package-details-content-type]').text();
  },

  get numTitles() {
    return $('[data-test-eholdings-package-details-titles-total]').text();
  },

  get numTitlesSelected() {
    return $('[data-test-eholdings-package-details-titles-selected]').text();
  },

  get isSelected() {
    return $('[data-test-eholdings-package-details-selected] input').prop('checked');
  },

  toggleIsSelected() {
    /*
     * We don't want to click the element before it exists.  This should
     * probably become a generic 'click' helper once we have more usage.
     */
    return convergeOn(() => {
      expect($('[data-test-eholdings-package-details-selected]')).to.exist;
    }).then(() => (
      $('[data-test-eholdings-package-details-selected] input').click()
    ));
  },

  clickCustomCoverageCancelButton() {
    return convergeOn(() => {
      expect($('[data-test-eholdings-package-details-cancel-custom-coverage-button]')).to.exist;
    }).then(() => (
      $('[data-test-eholdings-package-details-cancel-custom-coverage-button] button').click()
    ));
  },

  clickCustomCoverageEditButton() {
    return convergeOn(() => {
      expect($('[data-test-eholdings-package-details-edit-custom-coverage-button]')).to.exist;
    }).then(() => (
      $('[data-test-eholdings-package-details-edit-custom-coverage-button] button').click()
    ));
  },

  clickCustomCoverageSaveButton() {
    return convergeOn(() => {
      expect($('[data-test-eholdings-package-details-save-custom-coverage-button]')).to.exist;
    }).then(() => {
      return $('[data-test-eholdings-package-details-save-custom-coverage-button] button').click();
    });
  },

  clickCustomCoverageAddButton() {
    return convergeOn(() => {
      expect($('[data-test-eholdings-package-details-custom-coverage-button] button')).to.exist;
    }).then(() => (
      $('[data-test-eholdings-package-details-custom-coverage-button] button').click()
    ));
  },

  get beginCoverage() {
    return $('[data-test-eholdings-package-details-custom-begin-coverage]').find('input').val();
  },

  get isSelecting() {
    return $('[data-test-eholdings-package-details-selected] [data-test-toggle-switch]').attr('class').indexOf('is-pending--') !== -1;
  },

  get isSelectedToggleable() {
    return $('[data-test-eholdings-package-details-selected] input[type=checkbox]').prop('disabled') === false;
  },

  get isCustomCoverageSavable() {
    return $('[data-test-eholdings-package-details-save-custom-coverage-button] button').prop('disabled') === false;
  },

  get allTitlesSelected() {
    return !!this.titleList.length && this.titleList.every(title => title.isSelected);
  },

  confirmDeselection() {
    return $('[data-test-eholdings-package-deselection-confirmation-modal-yes]').trigger('click');
  },

  cancelDeselection() {
    return $('[data-test-eholdings-package-deselection-confirmation-modal-no]').trigger('click');
  },

  get hasErrors() {
    return $('[data-test-eholdings-details-view-error="package"]').length > 0;
  },

  get $titleContainer() {
    return $('[data-test-eholdings-details-view-list="package"]');
  },

  get $titleQueryList() {
    return $('[data-test-query-list="package-titles"]');
  },

  get titleList() {
    return $('[data-test-query-list="package-titles"] li a').toArray().map(createTitleObject);
  },
  toggleIsHidden() {
    return convergeOn(() => {
      expect($('[data-test-eholdings-package-details-hidden]')).to.exist;
    }).then(() => (
      $('[data-test-eholdings-package-details-hidden] input').click()
    ));
  },
  get isHiding() {
    return $('[data-test-eholdings-package-details-hidden] [data-test-toggle-switch]').attr('class').indexOf('is-pending--') !== -1;
  },

  get isHiddenToggleable() {
    return $('[data-test-eholdings-package-details-hidden] input[type=checkbox]').prop('disabled') === false;
  },
  get isHidden() {
    return $('[data-test-eholdings-package-details-hidden] input').prop('checked') === false;
  },
  get allTitlesHidden() {
    return !!this.titleList.length && this.titleList.every(title => title.isHidden);
  },
  get isHiddenMessage() {
    return $('[data-test-eholdings-package-details-is-hidden]').length === 1;
  },

  get customCoverage() {
    return $('[data-test-eholdings-package-details-custom-coverage-display]').text();
  },

  get $backButton() {
    return $('[data-test-eholdings-package-details-back-button] button');
  },

  scrollToTitleOffset(readOffset) {
    let $list = $('[data-test-query-list="package-titles"]').get(0);
    let rowHeight = $('li', $list).get(0).offsetHeight;
    let scrollOffset = rowHeight * readOffset;

    $list.scrollTop = scrollOffset;
    $list.dispatchEvent(new Event('scroll'));
  },

  get $customCoverageCancelButton() {
    return $('[data-test-eholdings-package-details-cancel-custom-coverage-button] button');
  },

  get $customCoverageInputs() {
    return $('[data-test-eholdings-package-details-custom-coverage-inputs]');
  },

  get $customCoverageAddButton() {
    return $('[data-test-eholdings-package-details-custom-coverage-button] button');
  },

  get $beginDateField() {
    return $('[data-test-eholdings-package-details-custom-begin-coverage] input')[0];
  },
  get $endDateField() {
    return $('[data-test-eholdings-package-details-custom-end-coverage] input')[0];
  },

  get validationError() {
    return $('[data-test-eholdings-package-details-custom-begin-coverage] [class^="feedbackError"]').text();
  },

  inputBeginDate(beginDate) {
    return advancedFillIn(this.$beginDateField, beginDate);
  },

  inputEndDate(endDate) {
    return advancedFillIn(this.$endDateField, endDate);
  },
  pressEnterBeginDate() {
    pressEnter(this.$beginDateField);
  },
  pressEnterEndDate() {
    pressEnter(this.$endDateField);
  },
  clearBeginDate() {
    let $clearButton = $('[data-test-eholdings-package-details-custom-begin-coverage]')
      .find('button[id^=datepicker-clear-button]');
    return convergeOn(() => {
      expect($clearButton).to.exist;
    }).then(() => {
      $clearButton.click();
    });
  },
  clearEndDate() {
    let $clearButton = $('[data-test-eholdings-package-details-custom-end-coverage]')
      .find('button[id^=datepicker-clear-button]');
    return convergeOn(() => {
      expect($clearButton).to.exist;
    }).then(() => {
      $clearButton.click();
    });
  },
  blurEndDate() {
    this.$endDateField.blur();
  },
  blurBeginDate() {
    this.$beginDateField.blur();
  }
};
