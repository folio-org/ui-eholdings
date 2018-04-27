import { computed } from '@bigtest/interactor';

export const isRootPresent = () => {
  return computed(function () {
    try {
      return !!this.$root;
    } catch (e) {
      return false;
    }
  });
};

export const hasClassBeginningWith = (selector, className) => {
  return computed(function () {
    return this.$(selector).className.includes(className);
  });
};

export const getComputedStyle = (selector, className) => {
  return computed(function () {
    let element = this.$(selector);
    return window.getComputedStyle(element)[className];
  });
};
