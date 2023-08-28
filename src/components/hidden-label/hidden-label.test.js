import { render } from '@folio/jest-config-stripes/testing-library/react';

import HiddenLabel from './hidden-label';

describe('Given HiddenLabel', () => {
  it('should render HiddenLabel', () => {
    const { getByText } = render(<HiddenLabel />);

    expect(getByText('ui-eholdings.hidden')).toBeDefined();
  });
});
