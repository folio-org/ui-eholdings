import $ from 'jquery';
import { expect } from 'chai';
import { convergeOn } from '@bigtest/convergence';

export default {
  get $root() {
    return $('[data-test-eholdings-details-view="resource"]');
  },

  clickPackage() {
    return $('[data-test-eholdings-customer-resource-show-package-name] a').get(0).click();
  },

  get isSelected() {
    return $('[data-test-eholdings-customer-resource-show-selected] input').prop('checked');
  },

  toggleIsSelected() {
    /*
     * We don't want to click the element before it exists.  This should
     * probably become a generic 'click' helper once we have more usage.
     */
    return convergeOn(() => {
      expect($('[data-test-eholdings-customer-resource-show-selected]')).to.exist;
    }).then(() => (
      $('[data-test-eholdings-customer-resource-show-selected] input').click()
    ));
  },

  get isSelecting() {
    return $('[data-test-eholdings-customer-resource-show-selected] [data-test-toggle-switch]').attr('class').indexOf('is-pending--') !== -1;
  },

  get isSelectedToggleable() {
    return $('[data-test-eholdings-customer-resource-show-selected] input[type=checkbox]').prop('disabled') === false;
  },

  get isHidden() {
    return $('[data-test-eholdings-customer-resource-toggle-hidden] input').prop('checked') === false;
  },

  get hiddenReason() {
    return $('[data-test-eholdings-customer-resource-toggle-hidden-reason]').text();
  },

  toggleIsHidden() {
    /*
     * We don't want to click the element before it exists.  This should
     * probably become a generic 'click' helper once we have more usage.
     */
    return convergeOn(() => {
      expect($('[data-test-eholdings-customer-resource-toggle-hidden]')).to.exist;
    }).then(() => (
      $('[data-test-eholdings-customer-resource-toggle-hidden] input').click()
    ));
  },

  get isHiding() {
    return $('[data-test-eholdings-customer-resource-toggle-hidden] [data-test-toggle-switch]').attr('class').indexOf('is-pending--') !== -1;
  },

  get isHiddenToggleable() {
    return $('[data-test-eholdings-customer-resource-toggle-hidden] input[type=checkbox]').prop('disabled') === false;
  },

  get managedCoverageList() {
    return $('[data-test-eholdings-customer-resource-show-managed-coverage-list]').text();
  },

  get isEditingCoverage() {
    return $('[data-test-eholdings-coverage-form] form').length === 1;
  },

  get customEmbargoPeriod() {
    return $('[data-test-eholdings-customer-resource-custom-embargo-display]').text();
  },

  get $deselectTitleWarning() {
    return $('[data-test-eholdings-deselect-title-warning]');
  },

  get $deselectFinalTitleWarning() {
    return $('[data-test-eholdings-deselect-final-title-warning]');
  },

  confirmDeselection() {
    return $('[data-test-eholdings-customer-resource-deselection-confirmation-modal-yes]').trigger('click');
  },

  cancelDeselection() {
    return $('[data-test-eholdings-customer-resource-deselection-confirmation-modal-no]').trigger('click');
  },

  get $navigationModal() {
    return $('#navigation-modal');
  }
};
