import {
  render,
  cleanup,
} from '@folio/jest-config-stripes/testing-library/react';

import Harness from '../../../../../../../test/jest/helpers/harness';

import { VisibilityView } from './visibility-view';

const visibility = [
  { category: 'PF', hidden: false, reason: '' },
  { category: 'FTF', hidden: true, reason: '' },
  { category: 'MARC', hidden: false, reason: '' },
];

const renderVisibilityView = (props = {}) => render(
  <Harness>
    <VisibilityView
      visibility={visibility}
      {...props}
    />
  </Harness>
);

describe('Given VisibilityView', () => {
  afterEach(cleanup);

  it('should render the visibility label', () => {
    const { getByText } = renderVisibilityView();

    expect(getByText('ui-eholdings.package.visibility')).toBeDefined();
  });

  it('should render a checkbox for each visibility option', () => {
    const { getByLabelText } = renderVisibilityView();

    expect(getByLabelText('ui-eholdings.package.visibility.PF')).toBeDefined();
    expect(getByLabelText('ui-eholdings.package.visibility.FTF')).toBeDefined();
    expect(getByLabelText('ui-eholdings.package.visibility.MARC')).toBeDefined();
  });

  it('should reflect the hidden state for each visibility option', () => {
    const { getByLabelText } = renderVisibilityView();

    expect(getByLabelText('ui-eholdings.package.visibility.PF')).not.toBeChecked();
    expect(getByLabelText('ui-eholdings.package.visibility.FTF')).toBeChecked();
    expect(getByLabelText('ui-eholdings.package.visibility.MARC')).not.toBeChecked();
  });

  it('should render every checkbox as disabled', () => {
    const { getByLabelText } = renderVisibilityView();

    expect(getByLabelText('ui-eholdings.package.visibility.PF')).toBeDisabled();
    expect(getByLabelText('ui-eholdings.package.visibility.FTF')).toBeDisabled();
    expect(getByLabelText('ui-eholdings.package.visibility.MARC')).toBeDisabled();
  });

  describe('when the visibility array is empty', () => {
    it('should render the label without checkboxes', () => {
      const { getByText, queryByRole } = renderVisibilityView({ visibility: [] });

      expect(getByText('ui-eholdings.package.visibility')).toBeDefined();
      expect(queryByRole('checkbox')).toBeNull();
    });
  });
});
