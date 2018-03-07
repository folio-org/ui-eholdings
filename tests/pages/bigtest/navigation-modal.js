import {
  page,
  isVisible,
  clickable,
  computed
} from '@bigtest/interaction';

// the current implementation of `isPresent` throws if the root does not exist
const isRootPresent = () => {
  return computed(function () {
    try {
      return !!this.$root;
    } catch (e) {
      return false;
    }
  });
};

@page class NavigationModal {
  exists = isRootPresent();
  isVisible = isVisible();
  clickContinue = clickable('[data-test-navigation-modal-continue]');
  clickDismiss = clickable('[data-test-navigation-modal-dismiss]');
}

export default new NavigationModal('#navigation-modal');
