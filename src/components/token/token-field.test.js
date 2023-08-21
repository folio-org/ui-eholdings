import {
  render,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import { Form } from 'react-final-form';

import TokenField from './token-field';

const testPropsProvider = {
  ariaLabelledBy: 'test-aria-labelled-by',
  token: {
    helpText: '<p>test-help-text</p>',
    prompt: 'test-prompt',
  },
  type: 'provider',
};

const testPropsPackage = {
  ...testPropsProvider,
  type: 'package',
};

const testExtendedPropsProvider = {
  ...testPropsProvider,
  tokenValue: 'test-token-value',
};

const testExtendedPropsPackage = {
  ...testPropsPackage,
  tokenValue: 'test-token-value',
};

describe('Given TokenField', () => {
  const renderTokenField = ({ ...props }) => render(
    <TokenField {...props} />
  );

  const renderTokenFieldWithForm = ({ ...props }) => render(
    <Form
      onSubmit={() => {}}
      render={() => <TokenField {...props} />}
    />
  );

  describe('when tokenValue prop is not provided', () => {
    it('should render button', () => {
      const { getByTestId } = renderTokenField(testPropsProvider);

      expect(getByTestId('token-add-button')).toBeDefined();
    });

    it('should display AddToken message for provider on the button', () => {
      const { getByRole } = renderTokenField(testPropsProvider);

      expect(getByRole('button', { name: 'ui-eholdings.provider.token.addToken' })).toBeDefined();
    });

    it('should display AddToken message for package on the button', () => {
      const { getByRole } = renderTokenField(testPropsPackage);

      expect(getByRole('button', { name: 'ui-eholdings.package.token.addToken' })).toBeDefined();
    });
  });

  describe('when tokenValue prop is provided', () => {
    describe('when type equals to provider', () => {
      it('should render token field provider help text', () => {
        const { getByTestId, getByText } = renderTokenFieldWithForm(testExtendedPropsProvider);

        expect(getByTestId('token-fields-help-text-provider')).toBeDefined();
        expect(getByText('test-help-text')).toBeDefined();
      });

      it('should render token field provider prompt text', () => {
        const { getByTestId, getByText } = renderTokenFieldWithForm(testExtendedPropsProvider);

        expect(getByTestId('token-fields-prompt-provider')).toBeDefined();
        expect(getByText('test-prompt')).toBeDefined();
      });

      it('should render provider textarea', () => {
        const { getByTestId } = renderTokenFieldWithForm(testExtendedPropsProvider);

        expect(getByTestId('textarea-provider')).toBeDefined();
      });
    });

    describe('when type equals to package', () => {
      it('should render token field package help text', () => {
        const { getByTestId, getByText } = renderTokenFieldWithForm(testExtendedPropsPackage);

        expect(getByTestId('token-fields-help-text-package')).toBeDefined();
        expect(getByText('test-help-text')).toBeDefined();
      });

      it('should render token field package prompt text', () => {
        const { getByTestId, getByText } = renderTokenFieldWithForm(testExtendedPropsPackage);

        expect(getByTestId('token-fields-prompt-package')).toBeDefined();
        expect(getByText('test-prompt')).toBeDefined();
      });

      it('should render package textarea', () => {
        const { getByTestId } = renderTokenFieldWithForm(testExtendedPropsPackage);

        expect(getByTestId('textarea-package')).toBeDefined();
      });
    });

    describe('when fill textarea with more than 500 characters', () => {
      it('should show validation error', () => {
        const { getByText, getByTestId } = renderTokenFieldWithForm(testExtendedPropsPackage);

        fireEvent.change(getByTestId('textarea-package'), { target: { value: new Array(501).fill('a').join('') } });
        fireEvent.blur(getByTestId('textarea-package'));

        expect(getByText('ui-eholdings.validate.errors.token.length')).toBeDefined();
      });
    });
  });
});
