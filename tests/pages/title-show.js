import {
  action,
  clickable,
  collection,
  computed,
  isPresent,
  property,
  page,
  text
} from '@bigtest/interaction';
import { getComputedStyle } from './helpers';
import Toast from './toast';

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
  packageContainerHeight = property('offsetHeight', '[data-test-eholdings-details-view-list="title"]');
  detailsPaneScrollsHeight = property('scrollHeight', '[data-test-eholdings-detail-pane-contents]');
  detailsPaneContentsHeight = property('offsetHeight', '[data-test-eholdings-detail-pane-contents]');
  detailsPaneContentsOverFlowY = getComputedStyle('overflow-y', '[data-test-eholdings-detail-pane-contents]');
  peerReviewedStatus = text('[data-test-eholdings-peer-reviewed-field]');
  descriptionText = text('[data-test-eholdings-description-field]');
  clickEditButton = clickable('[data-test-eholdings-title-edit-link]');

  toast = Toast

  detailsPaneScrollTop = action(function (offset) {
    return this.find('[data-test-query-list="package-titles"]')
      .do(() => {
        return this.scroll('[data-test-eholdings-detail-pane-contents]', {
          top: offset
        });
      });
  });

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
