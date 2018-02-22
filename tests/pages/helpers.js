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

/* Only used for datepicker component */
export function advancedFillIn(el, value) {
  let $node = el;
  // cache artificial value property descriptor
  let descriptor = Object.getOwnPropertyDescriptor($node, 'value');

  // remove artificial value property
  if (descriptor) delete $node.value;

  // set the actual value
  $node.value = value;

  // dispatch input event
  $node.dispatchEvent(
    new Event('input', {
      bubbles: true,
      cancelable: true
    })
  );

  // dispatch change event
  $node.dispatchEvent(
    new Event('change', {
      bubbles: true,
      cancelable: true
    })
  );

  // restore artificial value property descriptor
  if (descriptor) {
    Object.defineProperty($node, 'value', descriptor);
  }

  return convergeOn(() => {
    expect($node.value).to.equal(value);
  });
}

export function blur(el) {
  let node = $(el).get(0);

  // the error should not be reported for passing tests
  /* istanbul ignore else */
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

export function pressEnter(el) {
  let $node = $(el).get(0);

  // the error should not be reported for passing tests
  /* istanbul ignore else */
  if ($node) {
    let newKeyboardEvent = new Event('keydown', {
      bubbles: true,
      cancelable: true
    });

    Object.assign(newKeyboardEvent, {
      keyCode: 13
    });

    $node.dispatchEvent(newKeyboardEvent);
  } else {
    throw new Error('Node does not exist.');
  }
}
