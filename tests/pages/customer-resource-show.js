import $ from 'jquery';
import { expect } from 'chai';
import { convergeOn } from '../it-will';

export default {
  get $root() {
    return $('[data-test-eholdings-customer-resource-show]');
  },

  get titleName() {
    return $('[data-test-eholdings-customer-resource-show-title-name]').text();
  },

  get publisherName() {
    return $('[data-test-eholdings-customer-resource-show-publisher-name]').text();
  },

  get publicationType() {
    return $('[data-test-eholdings-customer-resource-show-publication-type]').text();
  },

  get vendorName() {
    return $('[data-test-eholdings-customer-resource-show-vendor-name]').text();
  },

  get packageName() {
    return $('[data-test-eholdings-customer-resource-show-package-name]').text();
  },

  get contentType() {
    return $('[data-test-eholdings-customer-resource-show-content-type]').text();
  },

  get managedUrl() {
    return $('[data-test-eholdings-customer-resource-show-managed-url]').text();
  },

  get subjectsList() {
    return $('[data-test-eholdings-customer-resource-show-subjects-list]').text();
  },

  get hasErrors() {
    return $('[data-test-eholdings-customer-resource-show-error]').length > 0;
  },

  get isSelected() {
    return $('[data-test-eholdings-customer-resource-show-selected]').text() === 'Selected';
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

  get flashError() {
    return '';
  },

  get isHidden() {
    return $('[data-test-eholdings-customer-resource-show-is-hidden]').length === 1;
  },
  get hiddenReason() {
    return $('[data-test-eholdings-customer-resource-show-hidden-reason]').text();
  },
  get managedEmbargoPeriod() {
    return $('[data-test-eholdings-customer-resource-show-managed-embargo-period]').text();
  },
  get managedCoverageList() {
    return $('[data-test-eholdings-customer-resource-show-managed-coverage-list]').text();
  },
  get customEmbargoPeriod() {
    return $('[data-test-eholdings-customer-resource-show-custom-embargo-period]').text();
  },
  get identifiersList() {
    return $('[data-test-eholdings-identifiers-list-item]').toArray().map(item => $(item).text());
  },
  get contributorsList() {
    return $('[data-test-eholdings-contributors-list-item]').toArray().map(item => $(item).text());
  },

  get $backButton() {
    return $('[data-test-eholdings-customer-resource-show-back-button]');
  }
};
