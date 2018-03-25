import {
  blurrable,
  clickable,
  fillable,
  isPresent,
  page,
  property,
  text,
  value
} from '@bigtest/interaction';
import { hasClassBeginningWith } from './helpers';

@page class CustomerResourceEditNavigationModal {}

@page class CustomerResourceEditPage {
  navigationModal = new CustomerResourceEditNavigationModal('#navigation-modal');

  clickCancel = clickable('[data-test-eholdings-customer-resource-cancel-button] button');
  clickSave = clickable('[data-test-eholdings-customer-resource-cancel-button] button');
  isSaveDisabled = property('disabled', '[data-test-eholdings-customer-resource-cancel-button] button');
  hasErrors = isPresent('[data-test-eholdings-details-view-error="resource"]');

  coverageStatement = value('[data-test-eholdings-coverage-statement-textarea] textarea');
  fillCoverageStatement = fillable('[data-test-eholdings-coverage-statement-textarea] textarea');
  blurCoverageStatement = blurrable('[data-test-eholdings-coverage-statement-textarea] textarea');
  coverageStatementHasError = hasClassBeginningWith('feedbackError--', '[data-test-eholdings-coverage-statement-textarea] textarea');
  validationErrorOnCoverageStatement = text('[data-test-eholdings-coverage-statement-textarea] [class^="feedbackError--"]');

  inputCoverageStatement(statement) {
    return this
      .fillCoverageStatement(statement)
      .blurCoverageStatement();
  }
}

export default new CustomerResourceEditPage('[data-test-eholdings-details-view="resource"]');
