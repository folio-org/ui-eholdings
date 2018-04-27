import { computed } from '@bigtest/interactor';

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
