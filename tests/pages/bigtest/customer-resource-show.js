import {
  collection,
  isPresent,
  page,
  property,
  text
} from '@bigtest/interaction';

@page class CustomerResourceShowPage {
  titleName = text('[data-test-eholdings-details-view-name="resource"]');
  publisherName = text('[data-test-eholdings-customer-resource-show-publisher-name]');
  publicationType = text('[data-test-eholdings-customer-resource-show-publication-type]');
  subjectsList = text('[data-test-eholdings-customer-resource-show-subjects-list]');
  providerName = text('[data-test-eholdings-customer-resource-show-provider-name]');
  packageName = text('[data-test-eholdings-customer-resource-show-package-name]');
  managedUrl = text('[data-test-eholdings-customer-resource-show-managed-url]');
  contentType = text('[data-test-eholdings-customer-resource-show-content-type]');
  hasContentType = isPresent('[data-test-eholdings-customer-resource-show-content-type]');
  hasErrors = isPresent('[data-test-eholdings-details-view-error="resource"]');
  isSelected = property('checked', '[data-test-eholdings-customer-resource-show-selected] input');
  hasBackButton = isPresent('[data-test-eholdings-customer-resource-show-back-button] button');

  identifiersList = collection('[data-test-eholdings-identifiers-list-item]', {
    text: text()
  });

  contributorsList = collection('[data-test-eholdings-contributors-list-item]', {
    text: text()
  });
}

export default new CustomerResourceShowPage('[data-test-eholdings-details-view="resource"]');
