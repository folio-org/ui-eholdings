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

  get providerName() {
    return $('[data-test-eholdings-customer-resource-show-provider-name]').text();
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
    return $('[data-test-eholdings-customer-resource-show-selected] input').prop('checked');
  },

  get $visibilitySection() {
    return $('[data-test-eholdings-customer-resource-toggle-hidden]');
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
    return $('[data-test-eholdings-customer-resource-show-back-button] button');
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

  clickManagedURL() {
    return $('[data-test-eholdings-customer-resource-show-managed-url]').trigger('click');
  }
};
