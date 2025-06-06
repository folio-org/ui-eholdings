import { render } from '@folio/jest-config-stripes/testing-library/react';

import FacetOptionFormatter from './FacetOptionFormatter';

const option = {
  label: 'fakeLabel',
  value: 'fakeValue',
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

  describe('when option.value is empty', () => {
    it('should render nothing', () => {
      const { container } = renderFacetOptionFormatter({ option: { value: '' } });
      expect(container).toBeEmptyDOMElement();
    });
  });
});
