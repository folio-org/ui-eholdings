import {
  render,
  cleanup,
} from '@testing-library/react';
import noop from 'lodash/noop';

import CustomLabelsAccordion from './custom-labels-accordion';
import Harness from '../../../test/jest/helpers/harness';

const renderCustomLabelsAccordion = ({
  errors = [],
  ...props
} = {}) => render(
  <Harness
    storeInitialState={{
      data: {
        customLabels: {
          errors,
          items: {
            data: ['label-1'],
          },
        },
      },
    }}
  >
    <CustomLabelsAccordion
      id="custom-labels"
      getCustomLabels={noop}
      onToggle={noop}
      isOpen
      updateFolioTags={noop}
      section={() => <div>Custom labels section</div>}
      {...props}
    />
  </Harness>
);

describe('Given CustomLabelsAccordion', () => {
  afterEach(cleanup);

  it('should display accordion label', () => {
    const { getByText } = renderCustomLabelsAccordion();

    expect(getByText('ui-eholdings.resource.customLabels')).toBeDefined();
  });

  it('should render section component', () => {
    const { getByText } = renderCustomLabelsAccordion();

    expect(getByText('Custom labels section')).toBeDefined();
  });

  describe('when there are errors', () => {
    it('should show a toast notification', () => {
      const { getByText } = renderCustomLabelsAccordion({
        errors: [{
          title: 'some error',
        }],
      });

      expect(getByText('some error')).toBeDefined();
    });
  });
});
