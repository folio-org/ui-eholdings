import { render } from '@testing-library/react';

import FacetOptionFormatter from './FacetOptionFormatter';

const option = {
  label: 'fakeLabel',
  totalRecords: 500,
};

const renderFacetOptionFormatter = (props = {}) => render(
  <FacetOptionFormatter option={option} {...props} />
);

describe('Given FacetOptionFormatter', () => {
  it('should render option label and count', () => {
    const { getByText } = renderFacetOptionFormatter();

    expect(getByText('fakeLabel (500)')).toBeDefined();
  });

  it('should render nothing', () => {
    const { container } = renderFacetOptionFormatter({ option: null });
    expect(container).toBeEmptyDOMElement();
  });
});
