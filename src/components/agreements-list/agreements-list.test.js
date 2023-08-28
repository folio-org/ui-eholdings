import {
  fireEvent,
  render,
} from '@folio/jest-config-stripes/testing-library/react';
import noop from 'lodash/noop';

import Harness from '../../../test/jest/helpers/harness';
import AgreementsList from './agreements-list';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  FormattedDate: () => ({ value }) => <span>{value}</span>,
}));

const agreements = {
  isLoading: false,
  isUnassigned: false,
  items: [{
    agreementStatus: {
      label: 'label',
    },
    id: 'id',
    name: 'name',
    startDate: '2021-07-01',
  }],
};

describe('Given AgreementsList', () => {
  const renderAgreementsList = (props) => render(
    <Harness>
      <AgreementsList
        agreements={agreements}
        onUnassignAgreement={noop}
        {...props}
      />
    </Harness>
  );

  describe('when click on trash icon', () => {
    it('should handle onUnassignAgreement', () => {
      const mockOnUnassignAgreement = jest.fn();
      const { items: [{ id, name, agreementStatus }] } = agreements;
      const deletedAgreement = {
        id,
        name,
        rowIndex: 0,
        status: agreementStatus.label,
      };

      const { container } = renderAgreementsList({ onUnassignAgreement: mockOnUnassignAgreement });

      fireEvent.click(container.querySelector('button[icon="trash"]'));

      expect(mockOnUnassignAgreement).toHaveBeenCalledWith(expect.objectContaining(deletedAgreement));
    });
  });

  describe('when record is on load', () => {
    it('should show spinner', () => {
      const { container } = renderAgreementsList({
        agreements: {
          ...agreements,
          isLoading: true,
        },
      });

      expect(container.querySelector('.icon-spinner-ellipsis')).toBeDefined();
    });
  });
});
