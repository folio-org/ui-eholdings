import $ from 'jquery';
import { expect } from 'chai';

import { convergeOn } from '@bigtest/convergence';

function createTitleObject(element) {
  let $scope = $(element);

  return {
    get isSelected() {
      return $scope.find('[data-test-eholdings-title-list-item-title-selected]').text() === 'Selected';
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
    return convergeOn(() => {
      expect($('[data-test-eholdings-package-details-selected]')).to.exist;
    }).then(() => (
      $('[data-test-eholdings-package-details-selected] input').click()
    ));
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

  get isHidden() {
    return $('[data-test-eholdings-package-details-hidden] input').prop('checked') === false;
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
