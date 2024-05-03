import {
  render,
  cleanup,
  fireEvent,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { createMemoryHistory } from 'history';

import AgreementsAccordion from './agreements-accordion';
import Harness from '../../../test/jest/helpers/harness';

jest.mock('@folio/stripes-components', () => ({
  ...jest.requireActual('@folio/stripes-components'),
  Badge: ({ children }) => <div>Badge {children}</div>
}));

const mockAttachAgreement = jest.fn();
const mockConfirmUnassignAgreement = jest.fn();
const mockGetAgreements = jest.fn();
const mockOnToggle = jest.fn();

let history = createMemoryHistory();

const renderAgreementsAccordion = ({
  errors = [],
  ...props
} = {}) => render(
  <Harness
    history={history}
    storeInitialState={{
      data: {
        agreements: {
          errors,
          isLoading: false,
          items: [{
            id: 'agreement-1',
            name: 'agreement-1',
            startDate: '01-01-2021',
            agreementStatus: {
              label: 'active',
            },
          }],
        },
      },
    }}
  >
    <AgreementsAccordion
      attachAgreement={mockAttachAgreement}
      confirmUnassignAgreement={mockConfirmUnassignAgreement}
      getAgreements={mockGetAgreements}
      onToggle={mockOnToggle}
      id="agreements-accordion"
      isOpen
      refId="ref-id"
      refName="ref-name"
      refType="ref-type"
      stripes={{
        hasPerm: jest.fn().mockReturnValue(true),
      }}
      {...props}
    />
  </Harness>
);

describe('Given AgreementsAccordion', () => {
  afterEach(() => {
    cleanup();
    history = createMemoryHistory();
  });

  it('should display accordion label', () => {
    const { getByText } = renderAgreementsAccordion();

    expect(getByText('ui-eholdings.agreements')).toBeDefined();
  });

  it('should display "New" button', () => {
    const { getByText } = renderAgreementsAccordion();

    expect(getByText('ui-eholdings.new')).toBeDefined();
  });

  describe('after click on "New" button', () => {
    it('should redirect to create page of agreements app', () => {
      const { getByText } = renderAgreementsAccordion();

      fireEvent.click(getByText('ui-eholdings.new'));

      expect(history.location.pathname + history.location.search).toEqual('/erm/agreements/create?authority=ref-type&referenceId=ref-id');
    });
  });

  it('should not display badge with agreements quantity', () => {
    const { queryByText } = renderAgreementsAccordion();

    expect(queryByText('Badge')).toBeNull();
  });

  it('should render agreements list', () => {
    const { getByLabelText } = renderAgreementsAccordion();

    expect(getByLabelText('ui-eholdings.agreements')).toBeDefined();
  });

  describe('when clicking on first agreement', () => {
    it('should redirect to agreement details page', () => {
      const { getByText } = renderAgreementsAccordion();

      fireEvent.click(getByText('agreement-1'));

      expect(history.location.pathname).toEqual('/erm/agreements/agreement-1');
    });
  });

  describe('when clicking unassign button', () => {
    it('should show confirmation modal', () => {
      const {
        getAllByLabelText,
        getByText,
      } = renderAgreementsAccordion();

      fireEvent.click(getAllByLabelText('ui-eholdings.agreements.delete')[0]);

      expect(getByText('ui-eholdings.agreements.deleteModal.header')).toBeDefined();
    });
  });

  describe('when confirming unassign', () => {
    it('should call unassignAgreement', async () => {
      const {
        getAllByLabelText,
        queryByText,
        getByText,
      } = renderAgreementsAccordion();

      fireEvent.click(getAllByLabelText('ui-eholdings.agreements.delete')[0]);
      fireEvent.click(getByText('ui-eholdings.agreements.deleteModal.delete'));

      await waitFor(() => {
        expect(queryByText('ui-eholdings.agreements.deleteModal.header')).toBeNull();
      });
    });
  });

  describe('when closed', () => {
    it('should display badge with agreements quantity equal to 1', () => {
      const { getByText } = renderAgreementsAccordion({
        isOpen: false,
      });

      expect(getByText('Badge 1')).toBeDefined();
    });
  });

  describe('when clicking accordion header', () => {
    it('should call onToggle', () => {
      const { getByText } = renderAgreementsAccordion();

      fireEvent.click(getByText('ui-eholdings.agreements'));

      expect(mockOnToggle).toBeCalledTimes(1);
    });
  });
});
