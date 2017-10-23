import $ from 'jquery';
import { expect } from 'chai';
import { triggerChange } from '../helpers';
import { convergeOn } from '../it-will';

export function fillIn(el, val) {
  if (typeof val === 'undefined') {
    return Promise.resolve();
  }

  let $input = $(el).val(val);
  triggerChange($input.get(0));

  return convergeOn(() => {
    expect($input.val()).to.equal(val);
  });
}

export function blur(el) {
  let node = $(el).get(0);

  if (node) {
    let focusEvent = document.createEvent('UIEvents');
    focusEvent.initEvent('focus', false, false);
    node.dispatchEvent(focusEvent);

    let blurEvent = document.createEvent('UIEvents');
    blurEvent.initEvent('blur', false, false);
    node.dispatchEvent(blurEvent);
  } else {
    throw new Error('Blur node does not exist.');
  }
}
