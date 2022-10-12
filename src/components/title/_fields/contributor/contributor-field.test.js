import {
  render,
  fireEvent,
} from '@testing-library/react';

import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';

import ContributorField from './contributor-field';

describe('Given ContributorField', () => {
  const renderContributorField = (props = {}) => render(
    <Form
      onSubmit={() => {}}
      mutators={{ ...arrayMutators }}
      render={() => (
        <ContributorField
          {...props}
        />
      )}
    />
  );

  it('should render the ContributorField component', () => {
    const { getByTestId } = renderContributorField();

    expect(getByTestId('contributor-field')).toBeDefined();
  });

  it('should display the legend title', () => {
    const { getByText } = renderContributorField();

    expect(getByText('ui-eholdings.label.contributors')).toBeDefined();
  });

  it('should display the `add a contributor` button', () => {
    const { getByRole } = renderContributorField();

    expect(getByRole('button', { name: 'ui-eholdings.title.contributor.addContributor' })).toBeDefined();
  });

  describe('when click on the `add a contributor` button', () => {
    it('should display the contributor type selection dropdown', () => {
      const { getByRole } = renderContributorField();

      const addContributorButton = getByRole('button', { name: 'ui-eholdings.title.contributor.addContributor' });

      fireEvent.click(addContributorButton);

      expect(getByRole('combobox', { name: 'ui-eholdings.type' })).toBeDefined();
    });

    it('should display correct dropdown options', () => {
      const {
        getByRole,
        getByText,
      } = renderContributorField();

      const addContributorButton = getByRole('button', { name: 'ui-eholdings.title.contributor.addContributor' });

      fireEvent.click(addContributorButton);

      expect(getByText('ui-eholdings.label.author')).toBeDefined();
      expect(getByText('ui-eholdings.label.editor')).toBeDefined();
      expect(getByText('ui-eholdings.label.illustrator')).toBeDefined();
    });

    it('should display the contributor name input', () => {
      const { getByRole } = renderContributorField();

      const addContributorButton = getByRole('button', { name: 'ui-eholdings.title.contributor.addContributor' });

      fireEvent.click(addContributorButton);

      expect(getByRole('textbox', { name: 'ui-eholdings.name' })).toBeDefined();
    });
  });

  describe('when contributor name input string has more than 250 characters', () => {
    it('should show corresponding validation message', () => {
      const {
        getByText,
        getByRole,
      } = renderContributorField();

      const addContributorButton = getByRole('button', { name: 'ui-eholdings.title.contributor.addContributor' });

      fireEvent.click(addContributorButton);

      const contributorNameInput = getByRole('textbox', { name: 'ui-eholdings.name' });

      fireEvent.change(contributorNameInput, {
        target: {
          value: new Array(251).fill('a').join(),
        },
      });

      fireEvent.blur(contributorNameInput);

      expect(getByText('ui-eholdings.validate.errors.contributor.exceedsLength')).toBeDefined();
    });
  });

  describe('when selected contributor name input but no value provided', () => {
    it('should show corresponding validation message', () => {
      const {
        getByText,
        getByRole,
      } = renderContributorField();

      const addContributorButton = getByRole('button', { name: 'ui-eholdings.title.contributor.addContributor' });

      fireEvent.click(addContributorButton);

      const contributorNameInput = getByRole('textbox', { name: 'ui-eholdings.name' });

      fireEvent.focus(contributorNameInput);
      fireEvent.blur(contributorNameInput);

      expect(getByText('ui-eholdings.validate.errors.contributor.empty')).toBeDefined();
    });
  });
});
