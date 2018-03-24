import { computed } from '@bigtest/interaction';

export const isRootPresent = () => {
  return computed(function () {
    try {
      return !!this.$root;
    } catch (e) {
      return false;
    }
  });
};

export const hasClassBeginningWith = (className, selector) => {
  return computed(function () {
    return this.$(selector).className.includes(className);
  });
};

export const getComputedStyle = (className, selector) => {
  return computed(function () {
    let element = this.$(selector);
    return window.getComputedStyle(element)[className];
  });
};
