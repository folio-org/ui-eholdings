import {
  interactor,
  isVisible,
  clickable,
  computed
} from '@bigtest/interactor';

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

@interactor class NavigationModal {
  exists = isRootPresent();
  isModalVisible = isVisible();
  clickContinue = clickable('[data-test-navigation-modal-continue]');
  clickDismiss = clickable('[data-test-navigation-modal-dismiss]');
}

export default new NavigationModal('#navigation-modal');
