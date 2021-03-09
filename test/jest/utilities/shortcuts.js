import { fireEvent } from '@testing-library/react';

export const openNewShortcut = (element) => {
  fireEvent.keyDown(element, {
    key: 'Alt',
    code: 'AltLeft',
    which: 18,
    keyCode: 18,
  });
  fireEvent.keyDown(element, {
    key: 'n',
    keyCode: 78,
    altKey: true,
  });
};

export const saveShortcut = (element) => {
  fireEvent.keyDown(element, {
    key: 'Ctrl',
    code: 'CtrlLeft',
    which: 17,
    keyCode: 17,
  });
  fireEvent.keyDown(element, {
    key: 's',
    keyCode: 83,
    ctrlKey: true,
  });
};
