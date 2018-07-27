import {
  action,
  clickable,
  collection,
  computed,
  isPresent,
  property,
  interactor,
  fillable,
  text,
  is
} from '@bigtest/interactor';

import {
  hasClassBeginningWith,
  getComputedStyle
} from './helpers';

import Toast from './toast';

@interactor class AddToCustomPackageModal {
  hasPackageError = hasClassBeginningWith(
    '[data-test-eholdings-package-select-field] select',
    'hasError--'
  );

  choosePackage = fillable('[data-test-eholdings-package-select-field] select');
  packages = collection('[data-test-eholdings-package-select-field] option', {
    isDisabled: property('disabled')
  });

  fillUrl = fillable('[data-test-eholdings-custom-url-textfield] input');

  submit = clickable('[data-test-eholdings-custom-package-modal-submit]');
  cancel = clickable('[data-test-eholdings-custom-package-modal-cancel]');

  isSubmitDisabled = property('[data-test-eholdings-custom-package-modal-submit]', 'disabled');
  isCancelDisabled = property('[data-test-eholdings-custom-package-modal-cancel]', 'disabled');
}

@interactor class TitleShowPage {
  paneTitle = text('[data-test-eholdings-details-view-pane-title]');
  titleName = text('[data-test-eholdings-details-view-name="title"]');
  nameHasFocus = is('[data-test-eholdings-details-view-name="title"]', ':focus');
  edition = text('[data-test-eholdings-title-show-edition]');
  publisherName = text('[data-test-eholdings-title-show-publisher-name]');
  publicationType = text('[data-test-eholdings-title-show-publication-type]');
  hasPublicationType = isPresent('[data-test-eholdings-title-show-publication-type]');
  subjectsList = text('[data-test-eholdings-title-show-subjects-list]');
  hasSubjectsList = isPresent('[data-test-eholdings-title-show-subjects-list]');
  hasBackButton = isPresent('[data-test-eholdings-details-view-back-button]');
  hasErrors = isPresent('[data-test-eholdings-details-view-error="title"]');
  hasIdentifiersList = isPresent('[data-test-eholdings-identifiers-list-item]');
  packageContainerHeight = property('[data-test-eholdings-details-view-list="title"]', 'offsetHeight');
  detailsPaneScrollsHeight = property('[data-test-eholdings-detail-pane-contents]', 'scrollHeight');
  detailsPaneContentsHeight = property('[data-test-eholdings-detail-pane-contents]', 'offsetHeight');
  detailsPaneContentsOverFlowY = getComputedStyle('[data-test-eholdings-detail-pane-contents]', 'overflow-y');
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
    identifierId: text('[data-test-eholdings-identifier-id]'),
    identifierType: text('[data-test-eholdings-identifiers-list-item] [class^="kvLabel--"]')
  });

  contributorsList = collection('[data-test-eholdings-contributors-list-item]', {
    contributorName: text('[data-test-eholdings-contributor-names]'),
    contributorType: text('[data-test-eholdings-contributors-list-item] [class^="kvLabel--"]')
  });

  clickAddToCustomPackageButton = clickable('[data-test-eholdings-add-to-custom-package-button]');
  customPackageModal = new AddToCustomPackageModal('#eholdings-custom-package-modal');
}

export default new TitleShowPage('[data-test-eholdings-details-view="title"]');
