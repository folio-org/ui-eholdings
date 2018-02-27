import $ from 'jquery';
import { expect } from 'chai';
import { convergeOn } from '../it-will';
import { advancedFillIn } from './helpers';
import { triggerChange } from '../helpers';

export default {
  get $root() {
    return $('[data-test-eholdings-details-view="resource"]');
  },

  get titleName() {
    return $('[data-test-eholdings-details-view-name="resource"]').text();
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
    return $('[data-test-eholdings-details-view-error="resource"]').length > 0;
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
    return $('[data-test-eholdings-customer-resource-custom-embargo-display]').text();
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
  },

  get $customEmbargoAddButton() {
    return $('[data-test-eholdings-customer-resource-add-custom-embargo-button] button');
  },

  get $customEmbargoEditButton() {
    return $('[data-test-eholdings-customer-resource-edit-custom-embargo-button]');
  },

  clickCustomEmbargoEditButton() {
    return convergeOn(() => {
      expect($('[data-test-eholdings-customer-resource-edit-custom-embargo-button]')).to.exist;
    }).then(() => (
      $('[data-test-eholdings-customer-resource-edit-custom-embargo-button] button').click()
    ));
  },

  get $customEmbargoForm() {
    return $('[data-test-eholdings-customer-resource-custom-embargo-form]');
  },

  clickCustomEmbargoAddButton() {
    return convergeOn(() => {
      expect($('[data-test-eholdings-customer-resource-add-custom-embargo-button]')).to.exist;
    }).then(() => (
      $('[data-test-eholdings-customer-resource-add-custom-embargo-button] button').click()
    ));
  },

  get $customEmbargoTextField() {
    return $('[data-test-eholdings-customer-resource-custom-embargo-textfield]').find('input[name="customEmbargoValue"]')[0];
  },

  get $customEmbargoSelect() {
    return $('[data-test-eholdings-customer-resource-custom-embargo-select]').find('select[name="customEmbargoUnit"]')[0];
  },

  get $customEmbargoFormCancelButton() {
    return $('[data-test-eholdings-customer-resource-cancel-custom-embargo-button] button');
  },

  get $customEmbargoFormSaveButton() {
    return $('[data-test-eholdings-customer-resource-save-custom-embargo-button] button');
  },

  inputEmbargoValue(customEmbargoValue) {
    return advancedFillIn(this.$customEmbargoTextField, customEmbargoValue);
  },

  selectEmbargoUnit(customEmbargoUnit) {
    let $input = $('[data-test-eholdings-customer-resource-custom-embargo-select]').find('select[name="customEmbargoUnit"]').val(customEmbargoUnit);
    return triggerChange($input.get(0));
  },

  get isCustomEmbargoSavable() {
    return $('[data-test-eholdings-customer-resource-save-custom-embargo-button] button').prop('disabled') === false;
  },

  get isCustomEmbargoCancellable() {
    return $('[data-test-eholdings-customer-resource-cancel-custom-embargo-button] button').prop('disabled') === false;
  },

  get $customEmbargoCancelButton() {
    return $('[data-test-eholdings-customer-resource-cancel-custom-embargo-button] button');
  },

  get $customEmbargoSaveButton() {
    return $('[data-test-eholdings-customer-resource-save-custom-embargo-button] button');
  },

  clickCustomEmbargoSaveButton() {
    return convergeOn(() => {
      expect($('[data-test-eholdings-customer-resource-save-custom-embargo-button]')).to.exist;
    }).then(() => {
      return $('[data-test-eholdings-customer-resource-save-custom-embargo-button] button').click();
    });
  },

  clickCustomEmbargoCancelButton() {
    return convergeOn(() => {
      expect($('[data-test-eholdings-customer-resource-cancel-custom-embargo-button]')).to.exist;
    }).then(() => {
      return $('[data-test-eholdings-customer-resource-cancel-custom-embargo-button] button').click();
    });
  },

  get validationErrorOnTextField() {
    return $('[data-test-eholdings-customer-resource-custom-embargo-textfield] [class^="feedbackError"]').text();
  },

  get validationErrorOnSelect() {
    return $('[data-test-eholdings-customer-resource-custom-embargo-select] [class^="feedbackError"]').text();
  }
};
