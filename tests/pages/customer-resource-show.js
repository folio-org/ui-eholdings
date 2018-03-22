import $ from 'jquery';
import { expect } from 'chai';
import { convergeOn } from '@bigtest/convergence';

export default {
  get $root() {
    return $('[data-test-eholdings-details-view="resource"]');
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
  }
};
