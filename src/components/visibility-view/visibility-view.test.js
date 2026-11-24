import {
  render,
  cleanup,
} from '@folio/jest-config-stripes/testing-library/react';

import Harness from '../../../test/jest/helpers/harness';

import { VisibilityView } from './visibility-view';
import { entityTypes } from '../../constants';

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

  describe('when recordType is resource', () => {
    it('should render (Set by package) message for hidden options', () => {
      const { getAllByText } = renderVisibilityView({
        recordType: entityTypes.RESOURCE,
      });

      expect(getAllByText('ui-eholdings.visibility.setByPackage').length).toEqual(1);
    });
  });
});
