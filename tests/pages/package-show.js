import $ from 'jquery';
import { expect } from 'chai';

import Convergence from '@bigtest/convergence';

function createTitleObject(element) {
  let $scope = $(element);

  return {
    get isSelected() {
      return $scope.find('[data-test-eholdings-title-list-item-title-selected]').text() === 'Selected';
    },

    get isHidden() {
      return $scope.find('[data-test-eholdings-title-list-item-title-hidden]').text() === 'Hidden';
    }

  };
}

export default {
  get $root() {
    return $('[data-test-eholdings-details-view="package"]');
  },

  get $detailPaneContents() {
    return $('[data-test-eholdings-detail-pane-contents]');
  },

  get numTitlesSelected() {
    return $('[data-test-eholdings-package-details-titles-selected]').text();
  },

  get isSelected() {
    return $('[data-test-eholdings-package-details-selected] input').prop('checked');
  },

  toggleIsSelected() {
    /*
     * We don't want to click the element before it exists.  This should
     * probably become a generic 'click' helper once we have more usage.
     */
    return new Convergence()
      .once(() => expect($('[data-test-eholdings-package-details-selected]')).to.exist)
      .do(() => $('[data-test-eholdings-package-details-selected] input').click())
      .run();
  },

  get isSelecting() {
    return $('[data-test-eholdings-package-details-selected] [data-test-toggle-switch]').attr('class').indexOf('is-pending--') !== -1;
  },

  get isSelectedToggleable() {
    return $('[data-test-eholdings-package-details-selected] input[type=checkbox]').prop('disabled') === false;
  },

  get allTitlesSelected() {
    return !!this.titleList.length && this.titleList.every(title => title.isSelected);
  },

  confirmDeselection() {
    return $('[data-test-eholdings-package-deselection-confirmation-modal-yes]').trigger('click');
  },

  cancelDeselection() {
    return $('[data-test-eholdings-package-deselection-confirmation-modal-no]').trigger('click');
  },

  get $titleContainer() {
    return $('[data-test-eholdings-details-view-list="package"]');
  },

  get $titleQueryList() {
    return $('[data-test-query-list="package-titles"]');
  },

  get titleList() {
    return $('[data-test-query-list="package-titles"] li a').toArray().map(createTitleObject);
  },

  toggleIsHidden() {
    return new Convergence()
      .once(() => expect($('[data-test-eholdings-package-details-hidden]')).to.exist)
      .do(() => $('[data-test-eholdings-package-details-hidden] input').click())
      .run();
  },

  get isHiding() {
    return $('[data-test-eholdings-package-details-hidden] [data-test-toggle-switch]').attr('class').indexOf('is-pending--') !== -1;
  },

  get isHiddenToggleable() {
    return $('[data-test-eholdings-package-details-hidden] input[type=checkbox]').prop('disabled') === false;
  },

  get isHidden() {
    return $('[data-test-eholdings-package-details-hidden] input').prop('checked') === false;
  },

  get allTitlesHidden() {
    return !!this.titleList.length && this.titleList.every(title => title.isHidden);
  },
  get isHiddenMessage() {
    return $('[data-test-eholdings-package-details-is-hidden]').text();
  },

  get customCoverage() {
    return $('[data-test-eholdings-package-details-custom-coverage-display]').text();
  },

  scrollToTitleOffset(readOffset) {
    let $list = $('[data-test-query-list="package-titles"]').get(0);
    let rowHeight = $('li', $list).get(0).offsetHeight;
    let scrollOffset = rowHeight * readOffset;

    $list.scrollTop = scrollOffset;
    $list.dispatchEvent(new Event('scroll'));
  }
};
