import {
  render,
  cleanup,
} from '@folio/jest-config-stripes/testing-library/react';

import Harness from '../../../test/jest/helpers/harness';

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
      recordType="package"
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

    expect(getByLabelText('ui-eholdings.visibility.PF')).toBeDefined();
    expect(getByLabelText('ui-eholdings.visibility.FTF')).toBeDefined();
    expect(getByLabelText('ui-eholdings.visibility.MARC')).toBeDefined();
  });

  it('should reflect the hidden state for each visibility option', () => {
    const { getByLabelText } = renderVisibilityView();

    expect(getByLabelText('ui-eholdings.visibility.PF')).not.toBeChecked();
    expect(getByLabelText('ui-eholdings.visibility.FTF')).toBeChecked();
    expect(getByLabelText('ui-eholdings.visibility.MARC')).not.toBeChecked();
  });

  it('should render every checkbox as disabled', () => {
    const { getByLabelText } = renderVisibilityView();

    expect(getByLabelText('ui-eholdings.visibility.PF')).toBeDisabled();
    expect(getByLabelText('ui-eholdings.visibility.FTF')).toBeDisabled();
    expect(getByLabelText('ui-eholdings.visibility.MARC')).toBeDisabled();
  });
});
