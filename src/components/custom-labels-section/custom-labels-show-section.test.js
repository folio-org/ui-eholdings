import { render } from '@folio/jest-config-stripes/testing-library/react';

import CustomLabelsShowSection from './custom-labels-show-section';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  NoValue: jest.fn(() => <span>-</span>),
}));

const renderCustomLabelsShowSection = (props) => render(
  <CustomLabelsShowSection
    customLabels={[{
      attributes: {
        displayLabel: 'label1',
        id: 1,
      },
    }, {
      attributes: {
        displayLabel: 'label2',
        id: 2,
      },
    }]}
    userDefinedFields={{
      userDefinedField1: 'value1',
    }}
    {...props}
  />
);

describe('Given CustomLabelsShowSection', () => {
  it('should show custom label with value', () => {
    const { getByText } = renderCustomLabelsShowSection();

    expect(getByText('label1')).toBeDefined();
    expect(getByText('value1')).toBeDefined();
  });

  it('should show custom label without value', () => {
    const { getByText } = renderCustomLabelsShowSection();

    expect(getByText('label2')).toBeDefined();
    expect(getByText('-')).toBeDefined();
  });
});
