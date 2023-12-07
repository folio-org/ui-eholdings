import {
  render,
  fireEvent,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';

import Harness from '../../../../test/jest/helpers/harness';

import ManagedPackageEdit from './managed-package-edit';

jest.mock('../../navigation-modal', () => ({ when }) => (when ? <div>NavigationModal component</div> : null));

const accessStatusTypes = {
  isDeleted: false,
  isLoading: false,
  items: {
    data: [],
  },
};

const model = {
  name: 'Package name',
  contentType: 'book',
  customCoverage: {
    beginCoverage: '',
    endCoverage: '',
  },
  packageToken: {
    value: 'token',
  },
  visibilityData: {
    isHidden: false,
    reason: '',
  },
  proxy: {
    id: 'proxy-id',
    isInherited: true,
  },
  isSelected: true,
  isLoaded: true,
  isLoading: false,
  isCustom: false,
  isPartiallySelected: false,
  request: {
    isPending: false,
    isRejected: false,
    isResolved: true,
    errors: [],
  },
  update: {
    isPending: false,
    isRejected: false,
    isResolved: true,
    errors: [],
  },
  destroy: {
    isPending: false,
    errors: [],
  },
};

const provider = {
  data: {
    isLoaded: true,
    isLoading: false,
  },
  providerToken: {
    value: '',
  },
  proxy: {
    id: 'proxy-id',
  },
};

const proxyTypes = {
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
};

const getManagedPackageEdit = props => (
  <Harness>
    <ManagedPackageEdit
      accessStatusTypes={accessStatusTypes}
      addPackageToHoldings={() => {}}
      model={model}
      onCancel={() => {}}
      onSubmit={() => {}}
      provider={provider}
      proxyTypes={proxyTypes}
      {...props}
    />
  </Harness>
);

const renderManagedPackageEdit = (props = {}) => render(
  getManagedPackageEdit(props),
);

describe('Given ManagedPackageEdit', () => {
  const mockOnCancel = jest.fn();
  const mockOnSubmit = jest.fn();
  const mockAddPackageToHoldings = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render form to edit managed package', () => {
    const { getByTestId } = renderManagedPackageEdit();

    expect(getByTestId('managed-package-edit')).toBeDefined();
  });

  it('should display package title in the pane header and as the headline', () => {
    const { getAllByText } = renderManagedPackageEdit();

    expect(getAllByText('Package name')).toHaveLength(2);
  });

  it('should display Actions menu button', () => {
    const { getByRole } = renderManagedPackageEdit();

    expect(getByRole('button', { name: 'stripes-components.paneMenuActionsToggleLabel' })).toBeDefined();
  });

  it('should display Remove from holdings button under Actions menu', () => {
    const { getByRole } = renderManagedPackageEdit();

    fireEvent.click(getByRole('button', { name: 'stripes-components.paneMenuActionsToggleLabel' }));

    expect(getByRole('button', { name: 'ui-eholdings.package.removeFromHoldings' })).toBeDefined();
  });

  describe('when model is partially selected', () => {
    it('should display Add all titles to holdings button under Actions menu and in Holdings status accordion', () => {
      const {
        getByRole,
        getAllByRole,
      } = renderManagedPackageEdit({
        model: {
          ...model,
          isPartiallySelected: true,
        },
      });

      fireEvent.click(getByRole('button', { name: 'stripes-components.paneMenuActionsToggleLabel' }));

      expect(getAllByRole('button', { name: 'ui-eholdings.addAllToHoldings' })).toHaveLength(2);
    });

    describe('when click on the Add all titles to holdings button', () => {
      it('should handle addPackageToHoldings', () => {
        const {
          getByRole,
          getAllByRole,
        } = renderManagedPackageEdit({
          model: {
            ...model,
            isPartiallySelected: true,
          },
          addPackageToHoldings: mockAddPackageToHoldings,
        });

        fireEvent.click(getByRole('button', { name: 'stripes-components.paneMenuActionsToggleLabel' }));

        const addAllTitlesToHoldingsButtons = getAllByRole('button', { name: 'ui-eholdings.addAllToHoldings' });
        const [addAllTitlesToHoldingsActionButton] = addAllTitlesToHoldingsButtons;

        fireEvent.click(addAllTitlesToHoldingsActionButton);

        expect(mockAddPackageToHoldings).toHaveBeenCalled();
      });
    });
  });

  it('should display Collapse all button', () => {
    const { getByRole } = renderManagedPackageEdit();

    expect(getByRole('button', { name: 'stripes-components.collapseAll' })).toBeDefined();
  });

  it('should display Holdings status accordion', () => {
    const { getByText } = renderManagedPackageEdit();

    expect(getByText('ui-eholdings.label.holdingStatus')).toBeDefined();
  });

  it('should display Package settings accordion', () => {
    const { getByText } = renderManagedPackageEdit();

    expect(getByText('ui-eholdings.package.packageSettings')).toBeDefined();
  });

  it('should display proxy types dropdown', () => {
    const { getByRole } = renderManagedPackageEdit();

    expect(getByRole('combobox', { name: 'ui-eholdings.proxy' })).toBeDefined();
  });

  describe('when proxyTypes are loaded', () => {
    it('should display updated info', () => {
      const {
        getByText,
        rerender,
      } = renderManagedPackageEdit({
        model: {
          ...model,
          isSelected: false,
        },
        proxyTypes: {
          ...proxyTypes,
          request: {
            isResolved: false,
          },
        },
        provider: {
          ...provider,
          data: {
            isLoaded: false,
          },
        },
      });

      expect(getByText('ui-eholdings.notSelected')).toBeDefined();

      rerender(
        getManagedPackageEdit({
          model: {
            ...model,
            isSelected: true,
          },
          proxyTypes: {
            ...proxyTypes,
            request: {
              isResolved: true,
            },
          },
          provider: {
            ...provider,
            data: {
              isLoaded: true,
            },
            providerToken: {
              value: 'provider-token-value',
            },
          },
        }),
      );

      expect(getByText('ui-eholdings.selected')).toBeDefined();
    });
  });

  it('should display Coverage settings accordion', () => {
    const { getByText } = renderManagedPackageEdit();

    expect(getByText('ui-eholdings.package.coverageSettings')).toBeDefined();
  });

  describe('when editing a field', () => {
    it('should enable form buttons', () => {
      const {
        getByRole,
        getByLabelText,
      } = renderManagedPackageEdit();

      fireEvent.change(getByLabelText('ui-eholdings.date.startDate'), { target: { value: '01/01/2021' } });
      fireEvent.change(getByLabelText('ui-eholdings.date.endDate'), { target: { value: '01/31/2021' } });

      expect(getByRole('button', { name: 'stripes-components.saveAndClose' })).toBeEnabled();
      expect(getByRole('button', { name: 'stripes-components.cancel' })).toBeEnabled();
    });

    describe('when click on Cancel button', () => {
      it('should open redirect confirmation modal', () => {
        const {
          getByRole,
          getByLabelText,
        } = renderManagedPackageEdit({
          onCancel: mockOnCancel,
        });

        fireEvent.change(getByLabelText('ui-eholdings.date.startDate'), { target: { value: '01/01/2021' } });
        fireEvent.change(getByLabelText('ui-eholdings.date.endDate'), { target: { value: '01/31/2021' } });

        fireEvent.click(getByRole('button', { name: 'stripes-components.cancel' }));

        expect(mockOnCancel).toHaveBeenCalled();
      });
    });
  });

  describe('when click on the close icon button', () => {
    it('should handle onCancel', () => {
      const { getByRole } = renderManagedPackageEdit({
        onCancel: mockOnCancel,
      });

      const closeButton = getByRole('button', { name: 'ui-eholdings.label.icon.closeX' });

      fireEvent.click(closeButton);

      expect(mockOnCancel).toHaveBeenCalled();
    });

    describe('when some fields were edited', () => {
      it('should show navigation modal', () => {
        const {
          getByLabelText,
          getByText,
          getByRole,
        } = renderManagedPackageEdit({
          model: {
            ...model,
            update: {
              ...model.update,
              isResolved: false,
            },
          },
        });

        fireEvent.change(getByLabelText('ui-eholdings.date.startDate'), { target: { value: '01/01/2021' } });

        fireEvent.click(getByRole('button', { name: 'stripes-components.cancel' }));

        expect(getByText('NavigationModal component')).toBeDefined();
      });
    });
  });

  describe('when submit changes', () => {
    it('should handle onSubmit', () => {
      const {
        getByRole,
        getByLabelText,
      } = renderManagedPackageEdit({
        onSubmit: mockOnSubmit,
      });

      fireEvent.change(getByLabelText('ui-eholdings.date.startDate'), { target: { value: '01/01/2021' } });
      fireEvent.change(getByLabelText('ui-eholdings.date.endDate'), { target: { value: '01/31/2021' } });

      fireEvent.click(getByRole('button', { name: 'stripes-components.saveAndClose' }));

      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  describe('when click Remove from holdings option under Actions menu', () => {
    it('should display Selection Modal', () => {
      const {
        getByRole,
        getByTestId,
      } = renderManagedPackageEdit();

      fireEvent.click(getByRole('button', { name: 'stripes-components.paneMenuActionsToggleLabel' }));
      fireEvent.click(getByRole('button', { name: 'ui-eholdings.package.removeFromHoldings' }));

      expect(getByTestId('eholdings-confirmation-modal')).toBeDefined();
    });
  });

  describe('when cancel removing package from holdings', () => {
    it('should hide Selection Modal', async () => {
      const {
        getByRole,
        queryByTestId,
      } = renderManagedPackageEdit();

      fireEvent.click(getByRole('button', { name: 'stripes-components.paneMenuActionsToggleLabel' }));
      fireEvent.click(getByRole('button', { name: 'ui-eholdings.package.removeFromHoldings' }));
      fireEvent.click(getByRole('button', { name: 'ui-eholdings.package.modal.buttonCancel' }));

      await waitFor(() => {
        expect(queryByTestId('eholdings-confirmation-modal')).toBeNull();
      });
    });
  });

  describe('when confirm removing package from holdings', () => {
    it('should handle onSubmit', () => {
      const { getByRole } = renderManagedPackageEdit({
        onSubmit: mockOnSubmit,
      });

      fireEvent.click(getByRole('button', { name: 'stripes-components.paneMenuActionsToggleLabel' }));
      fireEvent.click(getByRole('button', { name: 'ui-eholdings.package.removeFromHoldings' }));
      fireEvent.click(getByRole('button', { name: 'ui-eholdings.package.modal.buttonConfirm' }));

      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  describe('when model update isPending', () => {
    it('should display `Removing...` button instead of `Yes, Remove` on Selection Modal', () => {
      const {
        getByRole,
        getByTestId,
      } = renderManagedPackageEdit({
        model: {
          ...model,
          update: {
            ...model.update,
            isPending: true,
            isResolved: false,
          },
        },
      });

      fireEvent.click(getByRole('button', { name: 'stripes-components.paneMenuActionsToggleLabel' }));
      fireEvent.click(getByRole('button', { name: 'ui-eholdings.package.removeFromHoldings' }));

      expect(getByTestId('eholdings-confirmation-modal')).toBeDefined();
      expect(getByRole('button', { name: 'ui-eholdings.package.modal.buttonWorking' })).toBeDefined();
    });
  });
});
