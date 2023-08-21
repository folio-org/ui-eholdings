import {
  render,
  cleanup,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';

import Harness from '../../../../../test/jest/helpers/harness';

import CustomEmbargoFields from './custom-embargo-fields';

describe('Given CustomEmbargoFields', () => {
  const onSubmitMock = jest.fn();

  const renderCustomEmbargoFields = (props = {
    customEmbargoPeriod: [],
  }) => render(
    <Harness>
      <Form
        onSubmit={onSubmitMock}
        mutators={{ ...arrayMutators }}
        initialValuesEqual={() => true}
        initialValues={{
          customEmbargoPeriod: props.customEmbargoPeriod,
        }}
        render={({ pristine, form: { reset } }) => (
          <form onSubmit={onSubmitMock}>
            <span id="label-text">Fields label</span>
            <CustomEmbargoFields
              ariaLabelledBy="label-text"
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
  });

  describe('when there are no embargo periods', () => {
    it('should render add custom embargo button', () => {
      const { getByText } = renderCustomEmbargoFields();

      expect(getByText('ui-eholdings.resource.embargoPeriod.addCustom')).toBeDefined();
    });

    describe('when clicking on add custom embargo button', () => {
      it('should render custom embargo fields', () => {
        const {
          getByText,
          getByTestId,
        } = renderCustomEmbargoFields();

        fireEvent.click(getByText('ui-eholdings.resource.embargoPeriod.addCustom'));

        expect(getByTestId('custom-embargo-fields')).toBeDefined();
      });
    });

    describe('when filling in not positive value', () => {
      it('should show validation error', async () => {
        const {
          getByTestId,
          getByText,
        } = renderCustomEmbargoFields();

        await userEvent.click(getByText('ui-eholdings.resource.embargoPeriod.addCustom'));
        await userEvent.type(getByTestId('custom-embargo-value'), '0');
        await userEvent.tab();

        expect(getByText('ui-eholdings.validate.errors.embargoPeriod.moreThanZero')).toBeDefined();
      });
    });

    describe('when filling in not integer value', () => {
      it('should show validation error', async () => {
        const {
          getByTestId,
          getByText,
        } = renderCustomEmbargoFields();

        await userEvent.click(getByText('ui-eholdings.resource.embargoPeriod.addCustom'));
        await userEvent.type(getByTestId('custom-embargo-value'), '1.1');
        await userEvent.tab();

        expect(getByText('ui-eholdings.validate.errors.embargoPeriod.decimal')).toBeDefined();
      });
    });

    describe('when filling in not a number', () => {
      it('should show validation error', async () => {
        const {
          getByTestId,
          getByText,
        } = renderCustomEmbargoFields();

        await userEvent.click(getByText('ui-eholdings.resource.embargoPeriod.addCustom'));
        await userEvent.type(getByTestId('custom-embargo-value'), 'a');
        await userEvent.tab();

        expect(getByText('ui-eholdings.validate.errors.embargoPeriod.number')).toBeDefined();
      });
    });
  });

  describe('when there is a custom embargo period', () => {
    it('should render custom embargo period fields', () => {
      const {
        getByTestId,
      } = renderCustomEmbargoFields({
        customEmbargoPeriod: [{
          embargoUnit: 'month',
          embargoValue: '1',
        }],
      });

      expect(getByTestId('custom-embargo-unit')).toBeDefined();
      expect(getByTestId('custom-embargo-value')).toBeDefined();
    });
  });
});
