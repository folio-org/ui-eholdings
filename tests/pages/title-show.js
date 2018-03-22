import $ from 'jquery';

export default {
  get $root() {
    return $('[data-test-eholdings-details-view="title"]');
  },

  get $detailPaneContents() {
    return $('[data-test-eholdings-detail-pane-contents]');
  },

  get $packageContainer() {
    return $('[data-test-eholdings-details-view-list="title"]');
  }
};
