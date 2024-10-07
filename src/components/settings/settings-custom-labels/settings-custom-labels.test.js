import {
  render,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import Harness from '../../../../test/jest/helpers/harness';

import SettingsCustomLabels from './settings-custom-labels';

jest.mock('../../navigation-modal', () => ({ when }) => (when ? <div>NavigationModal component</div> : null));

const customLabels = {
  errors: [],
  isUpdated: false,
  items: {
    data: [
      {
        attributes: {
          displayLabel: 'display label',
          displayOnFullTextFinder: true,
          displayOnPublicationFinder: false,
          id: 1,
        },
      },
      {
        attributes: {
          displayLabel: '222',
          displayOnFullTextFinder: false,
          displayOnPublicationFinder: false,
          id: 2,
        },
      },
    ],
  },
};

const getSettingsCustomLabels = props => (
  <Harness>
    <SettingsCustomLabels
      confirmUpdate={() => {}}
      credentialId="credential-id"
      customLabels={customLabels}
      updateCustomLabels={() => {}}
      {...props}
    />
  </Harness>
);

const renderSettingsCustomLabels = (props = {}) => render(
  getSettingsCustomLabels(props),
);

describe('Given SettingsCustomLabels', () => {
  const mockConfirmUpdate = jest.fn();
  const mockUpdateCustomLabels = jest.fn();

  it('should render form', () => {
    const { getByTestId } = renderSettingsCustomLabels();

    expect(getByTestId('settings-custom-labels-form')).toBeDefined();
  });

  it('should display pane header title', () => {
    const { getByText } = renderSettingsCustomLabels();

    expect(getByText('ui-eholdings.resource.customLabels')).toBeDefined();
  });

  it('should render footer', () => {
    const { getByRole } = renderSettingsCustomLabels();

    expect(getByRole('button', { name: 'stripes-components.cancel' })).toBeDefined();
    expect(getByRole('button', { name: 'stripes-core.button.save' })).toBeDefined();
  });

  it('should display `Display label` label', () => {
    const { getByText } = renderSettingsCustomLabels();

    expect(getByText('ui-eholdings.settings.customLabels.displayLabel')).toBeDefined();
  });

  it('should display `Show on publication finder` label', () => {
    const { getByText } = renderSettingsCustomLabels();

    expect(getByText('ui-eholdings.settings.customLabels.publicationFinder')).toBeDefined();
  });

  it('should display `Show on full text finder` label', () => {
    const { getByText } = renderSettingsCustomLabels();

    expect(getByText('ui-eholdings.settings.customLabels.textFinder')).toBeDefined();
  });

  it('should display five custom label fields', () => {
    const { getAllByRole } = renderSettingsCustomLabels();

    const allDisplayLabelInputs = getAllByRole('textbox', { name: 'ui-eholdings.settings.customLabels.displayLabel' });
    const allShowOnPublicationsFinderCheckboxes = getAllByRole('checkbox', { name: 'ui-eholdings.settings.customLabels.publicationFinder' });
    const allShowOnFullTextFinderCheckboxes = getAllByRole('checkbox', { name: 'ui-eholdings.settings.customLabels.textFinder' });

    expect(allDisplayLabelInputs).toHaveLength(5);
    expect(allShowOnPublicationsFinderCheckboxes).toHaveLength(5);
    expect(allShowOnFullTextFinderCheckboxes).toHaveLength(5);
  });

  it('should display input field with display label', () => {
    const { getByTestId } = renderSettingsCustomLabels();

    const input = getByTestId('customLabel1-display-label');

    expect(input).toBeDefined();
    expect(input.value).toBe('display label');
  });

  it('should display publication finder checkbox with correct value', () => {
    const { getByTestId } = renderSettingsCustomLabels();

    const checkbox = getByTestId('customLabel1-publication-finder');

    expect(checkbox).toBeDefined();
    expect(checkbox).not.toBeChecked();
  });

  it('should display full text finder checkbox with correct value', () => {
    const { getByTestId } = renderSettingsCustomLabels();

    const checkbox = getByTestId('customLabel1-text-finder');

    expect(checkbox).toBeDefined();
    expect(checkbox).toBeChecked();
  });

  describe('when click on close icon and form is not pristine', () => {
    it('should show navigation modal', () => {
      const {
        getAllByRole,
        getByTestId,
        getByText,
      } = renderSettingsCustomLabels();

      const [, goBackButton] = getAllByRole('link', { name: 'ui-eholdings.settings.goBackToEholdings' });

      fireEvent.click(getByTestId('customLabel1-text-finder'));
      fireEvent.click(goBackButton);

      expect(getByText('NavigationModal component')).toBeDefined();
    });
  });

  describe('when submit form with empty display label', () => {
    it('should show confirmation modal', () => {
      const {
        getByRole,
        getByTestId,
      } = renderSettingsCustomLabels();
      const name =
        'ui-eholdings.settings.customLabels.remove.description ' +
        'ui-eholdings.settings.customLabels.remove.note';

      fireEvent.change(getByTestId('customLabel2-display-label'), { target: { value: '' } });
      fireEvent.click(getByRole('button', { name: 'stripes-core.button.save' }));

      expect(getByRole('heading', { name: 'ui-eholdings.settings.customLabels.remove' })).toBeInTheDocument();
      expect(getByRole('dialog', { name })).toBeDefined();
    });
  });

  describe('when submit form without empty display labels', () => {
    it('should handle updateCustomLabels', () => {
      const {
        getByRole,
        getByTestId,
      } = renderSettingsCustomLabels({
        updateCustomLabels: mockUpdateCustomLabels,
      });

      fireEvent.click(getByTestId('customLabel1-publication-finder'));
      fireEvent.click(getByRole('button', { name: 'stripes-core.button.save' }));

      expect(mockUpdateCustomLabels).toBeCalled();
    });
  });

  describe('when click on Remove custom labels on the confirmation modal', () => {
    it('should handle updateCustomLabels', () => {
      const {
        getByRole,
        getByTestId,
      } = renderSettingsCustomLabels({
        updateCustomLabels: mockUpdateCustomLabels,
      });

      fireEvent.change(getByTestId('customLabel2-display-label'), { target: { value: '' } });
      fireEvent.click(getByTestId('settings-form-save-button'));

      const modalConfirmButton = getByRole('button', { name: 'ui-eholdings.settings.customLabels.remove' });

      fireEvent.click(modalConfirmButton);

      expect(mockUpdateCustomLabels).toBeCalled();
    });
  });

  describe('when custom labels are updated', () => {
    it('should handle confirmUpdate', () => {
      const { rerender } = renderSettingsCustomLabels();

      rerender(
        getSettingsCustomLabels({
          confirmUpdate: mockConfirmUpdate,
          customLabels: {
            ...customLabels,
            isUpdated: true,
          },
        }),
      );

      expect(mockConfirmUpdate).toBeCalled();
    });

    it('should show success toast message', () => {
      const {
        rerender,
        getByText,
      } = renderSettingsCustomLabels();

      rerender(
        getSettingsCustomLabels({
          customLabels: {
            ...customLabels,
            isUpdated: true,
          },
        }),
      );

      expect(getByText('ui-eholdings.settings.customLabels.toast')).toBeDefined();
    });
  });

  describe('when there are errors', () => {
    it('should show error toast message', () => {
      const {
        rerender,
        getByText,
      } = renderSettingsCustomLabels();

      rerender(
        getSettingsCustomLabels({
          customLabels: {
            ...customLabels,
            errors: [{ title: 'Error title' }],
          },
        }),
      );

      expect(getByText('Error title')).toBeDefined();
    });
  });

  describe('when custom labels data is empty', () => {
    it('should have all form fields empty', () => {
      const { getAllByRole } = renderSettingsCustomLabels({
        customLabels: {
          ...customLabels,
          items: {},
        },
      });

      const allDisplayLabelInputs = getAllByRole('textbox', { name: 'ui-eholdings.settings.customLabels.displayLabel' });
      const allShowOnPublicationsFinderCheckboxes = getAllByRole('checkbox', { name: 'ui-eholdings.settings.customLabels.publicationFinder' });
      const allShowOnFullTextFinderCheckboxes = getAllByRole('checkbox', { name: 'ui-eholdings.settings.customLabels.textFinder' });

      allDisplayLabelInputs.forEach(input => expect(input.value).toBe(''));
      allShowOnPublicationsFinderCheckboxes.forEach(checkbox => expect(checkbox).not.toBeChecked());
      allShowOnFullTextFinderCheckboxes.forEach(checkbox => expect(checkbox).not.toBeChecked());
    });
  });
});
