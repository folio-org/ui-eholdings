import {
  render,
  cleanup,
  fireEvent,
} from '@testing-library/react';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';

import Harness from '../../../../../../test/jest/helpers/harness';

import ResourceSettings from './resource-settings';

describe('Given ResourceSettings', () => {
  const onSubmitMock = jest.fn();
  const handleSectionToggleMock = jest.fn();
  const defaultModel = {
    package: {
      proxy: {
        id: 'proxy-id',
      },
      visibilityData: {
        isHidden: true,
      },
    },
    update: {
      isPending: false,
    },
    isSelected: true,
  };

  const renderResourceSettings = (props = {}) => render(
    <Harness>
      <Form
        onSubmit={onSubmitMock}
        mutators={{ ...arrayMutators }}
        initialValuesEqual={() => true}
        initialValues={{
          proxyId: 'proxy-id',
          isVisible: true,
        }}
        render={({ pristine, form: { reset } }) => (
          <form onSubmit={onSubmitMock}>
            <ResourceSettings
              isOpen
              getSectionHeader={() => 'Resource settings'}
              handleSectionToggle={handleSectionToggleMock}
              model={defaultModel}
              proxyTypes={{
                request: {
                  isResolved: true,
                },
                resolver: {
                  state: {
                    proxyTypes: {
                      records: {
                        'proxy-id': {
                          id: 'proxy-id',
                          attributes: {
                            name: 'Some Proxy',
                          },
                        },
                        'proxy-id-2': {
                          id: 'proxy-id-2',
                          attributes: {
                            name: 'Some Other Proxy',
                          },
                        },
                      },
                    },
                  },
                },
              }}
              accessStatusTypes={{
                items: {
                  data: [{
                    id: 'access-type-id',
                    attributes: {
                      name: 'access type',
                    },
                  }],
                },
              }}
              resourceIsCustom
              resourceSelected
              {...props}
            />
            <button type="button" disabled={pristine} onClick={reset}>Cancel</button>
            <button type="submit" disabled={pristine}>Submit</button>
          </form>
        )}
      />
    </Harness>
  );

  afterEach(() => {
    cleanup();
    onSubmitMock.mockClear();
    handleSectionToggleMock.mockClear();
  });

  it('should render an accordion', () => {
    const { getByText } = renderResourceSettings();
    expect(getByText('Resource settings')).toBeDefined();
  });

  describe('when selecting a proxy', () => {
    it('should enable submit button', () => {
      const {
        getByTestId,
        getByText,
      } = renderResourceSettings();

      fireEvent.change(getByTestId('proxy-select'), { target: { value: 'proxy-id-2' } });
      fireEvent.click(getByText('Submit'));

      expect(getByText('Submit')).toBeEnabled();
    });
  });
});
