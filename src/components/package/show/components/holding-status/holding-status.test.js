import React from 'react';
import {
  render,
  cleanup,
} from '@testing-library/react';

import Harness from '../../../../../../test/jest/helpers/harness';

import HoldingStatus from './holding-status';

describe('Given HoldingStatus', () => {
  let component;
  const onToggleMock = jest.fn();

  const renderHoldingStatus = (props = {}) => render(
    <Harness>
      <HoldingStatus
        isOpen
        onToggle={onToggleMock}
        {...props}
      />
    </Harness>
  );

  afterEach(() => {
    cleanup();
    onToggleMock.mockClear();
  });

  it('should render an accordion', () => {
    component = renderHoldingStatus();
    expect(component.getByText('ui-eholdings.label.holdingStatus')).toBeDefined();
  });
});
