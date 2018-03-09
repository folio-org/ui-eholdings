import $ from 'jquery';
import { expect } from 'chai';
import Convergence from '@bigtest/convergence';

export default {
  get $root() {
    return $('[data-test-eholdings-details-view="resource"]');
  },

  get isSelected() {
    return $('[data-test-eholdings-customer-resource-show-selected] input').prop('checked');
  },

  toggleIsSelected() {
    /*
     * We don't want to click the element before it exists.  This should
     * probably become a generic 'click' helper once we have more usage.
     */
    return new Convergence()
      .once(() => expect($('[data-test-eholdings-customer-resource-show-selected]')).to.exist)
      .do(() => $('[data-test-eholdings-customer-resource-show-selected] input').click())
      .run();
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
    return new Convergence()
      .once(() => expect($('[data-test-eholdings-customer-resource-toggle-hidden]')).to.exist)
      .do(() => $('[data-test-eholdings-customer-resource-toggle-hidden] input').click())
      .run();
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
