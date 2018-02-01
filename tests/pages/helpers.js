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
    node.dispatchEvent(
      new MouseEvent('blur', {
        bubbles: true,
        cancelable: true
      })
    );
  } else {
    throw new Error('Blur node does not exist.');
  }
}
