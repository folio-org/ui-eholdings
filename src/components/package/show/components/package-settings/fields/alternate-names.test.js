import {
  render,
  cleanup,
} from '@folio/jest-config-stripes/testing-library/react';

import Harness from '../../../../../../../test/jest/helpers/harness';

import { AlternateNames } from './alternate-names';

const renderAlternateNames = (props = {}) => render(
  <Harness>
    <AlternateNames
      customAltNames={[
        { altName: 'Alternate name one' },
        { altName: 'Alternate name two' },
      ]}
      {...props}
    />
  </Harness>
);

describe('Given AlternateNames', () => {
  afterEach(cleanup);

  it('should render the managed label and each alternate name by default', () => {
    const { container, getByText } = renderAlternateNames();

    expect(getByText('ui-eholdings.package.managedAltNames')).toBeDefined();
    expect(container.textContent).toContain('Alternate name one');
    expect(container.textContent).toContain('Alternate name two');
  });

  it('should render the custom label for custom packages', () => {
    const { container, getByText } = renderAlternateNames({ isCustomPackage: true });

    expect(getByText('ui-eholdings.package.customAltNames')).toBeDefined();
    expect(container.textContent).toContain('Alternate name one');
    expect(container.textContent).toContain('Alternate name two');
  });
});