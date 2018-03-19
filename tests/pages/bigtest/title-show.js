import {
  collection,
  computed,
  isPresent,
  page,
  text
} from '@bigtest/interaction';

@page class TitleShowPage {
  paneTitle = text('[data-test-eholdings-details-view-pane-title]');
  titleName = text('[data-test-eholdings-details-view-name="title"]');
  publisherName = text('[data-test-eholdings-title-show-publisher-name]');
  publicationType = text('[data-test-eholdings-title-show-publication-type]');
  hasPublicationType = isPresent('[data-test-eholdings-title-show-publication-type]');
  subjectsList = text('[data-test-eholdings-title-show-subjects-list]');
  hasSubjectsList = isPresent('[data-test-eholdings-title-show-subjects-list]');
  hasBackButton = isPresent('[data-test-eholdings-details-view-back-button] button');
  hasErrors = isPresent('[data-test-eholdings-details-view-error="title"]');
  hasIdentifiersList = isPresent('[data-test-eholdings-identifiers-list-item]');

  packageList = collection('[data-test-query-list="title-packages"] li a', {
    name: text('[data-test-eholdings-package-list-item-name]'),
    isSelectedText: text('[data-test-eholdings-package-list-item-selected]'),
    isSelected: computed(function () {
      return this.isSelectedText === 'Selected';
    })
  });

  identifiersList = collection('[data-test-eholdings-identifiers-list-item]', {
    text: text()
  });

  contributorsList = collection('[data-test-eholdings-contributors-list-item]', {
    text: text()
  });
}

export default new TitleShowPage('[data-test-eholdings-details-view="title"]');
