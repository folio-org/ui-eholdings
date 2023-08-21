import {
  cleanup,
  render,
} from '@folio/jest-config-stripes/testing-library/react';

import SettingsForm from './settings-form';
import Harness from '../../../../test/jest/helpers/harness';

const handleSubmitMock = jest.fn();

const renderSettingsForm = ({
  isPristine = false,
  isInvalid = false,
  updateIsPending = false,
} = {}) => render(
  <Harness>
    <SettingsForm
      hasFooter
      id="test-form"
      formState={{
        form: {},
        handleSubmit: handleSubmitMock,
        invalid: isInvalid,
        pristine: isPristine,
      }}
      title="Test title"
      toasts={[]}
      updateIsPending={updateIsPending}
    >
      <input type="text" data-testid="test-input" />
    </SettingsForm>
  </Harness>
);

describe('Given Settings Form Display', () => {
  beforeEach(() => {
    handleSubmitMock.mockClear();
  });

  afterEach(cleanup);

  it('should render children', () => {
    const { getByTestId } = renderSettingsForm();

    expect(getByTestId('test-input')).toBeDefined();
  });

  it('should render title', () => {
    const { getByText } = renderSettingsForm();

    expect(getByText('Test title')).toBeDefined();
  });

  describe('when update is pending', () => {
    it('should disable save button', () => {
      const { getByTestId } = renderSettingsForm({
        updateIsPending: true,
      });

      expect(getByTestId('settings-form-save-button')).toBeDisabled();
    });

    it('should disable cancel button', () => {
      const { getByTestId } = renderSettingsForm({
        updateIsPending: true,
      });

      expect(getByTestId('settings-form-cancel-button')).toBeDisabled();
    });
  });

  describe('when form is pristine', () => {
    it('should disable save button', () => {
      const { getByTestId } = renderSettingsForm({
        isPristine: true,
      });

      expect(getByTestId('settings-form-save-button')).toBeDisabled();
    });

    it('should disable cancel button', () => {
      const { getByTestId } = renderSettingsForm({
        isPristine: true,
      });

      expect(getByTestId('settings-form-cancel-button')).toBeDisabled();
    });
  });

  describe('when form is invalid', () => {
    it('should disable save button', () => {
      const { getByTestId } = renderSettingsForm({
        isInvalid: true,
      });

      expect(getByTestId('settings-form-save-button')).toBeDisabled();
    });
  });
});
