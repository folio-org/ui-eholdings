import {
  render,
  fireEvent,
} from '@testing-library/react';

import ExportPackageResourcesModal from './export-package-resources-modal';
import { useExportPackageTitle } from '../../hooks';
import Harness from '../../../test/jest/helpers/harness';

const mockOnClose = jest.fn();
const mockDoExport = jest.fn();
const mockSendCallout = jest.fn();

jest.mock('@folio/stripes/core', () => ({
  useCallout: () => ({
    sendCallout: mockSendCallout,
  }),
}));

jest.mock('../../hooks', () => ({
  useExportPackageTitle: jest.fn().mockReturnValue({
    doExport: mockDoExport,
  }),
}));

const renderExportPackageResourcesModal = () => render((
  <Harness>
    <ExportPackageResourcesModal
      open
      onClose={mockOnClose}
      recordId="record-id"
      recordType="PACKAGE"
    />
  </Harness>
));

describe('Given ExportPackageResourcesModal', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display the component', () => {
    const { getByText } = renderExportPackageResourcesModal();

    expect(getByText('ui-eholdings.exportPackageResources.subtitle')).toBeDefined();
  });

  describe('when none of the fields are selected', () => {
    it('should disable export button', () => {
      const {
        getByTestId,
        getAllByLabelText,
      } = renderExportPackageResourcesModal();

      fireEvent.click(getAllByLabelText('ui-eholdings.exportPackageResources.fields.selected')[0]);
      fireEvent.click(getAllByLabelText('ui-eholdings.exportPackageResources.fields.selected')[1]);

      expect(getByTestId('export-button')).toBeDisabled();
    });
  });

  describe('when clicking export', () => {
    it('should call doExport with correct data', () => {
      useExportPackageTitle.mockImplementation(({ onSuccess }) => ({
        doExport: mockDoExport.mockImplementation(() => onSuccess({})),
      }));

      const {
        getByTestId,
        getByText,
        getAllByText,
      } = renderExportPackageResourcesModal();

      const [
        providerLevelTokenForPackageFields,
        providerLevelTokenForTitleFields,
      ] = getAllByText('ui-eholdings.exportPackageResources.fields.package.providerLevelToken');

      fireEvent.click(getByText('ui-eholdings.exportPackageResources.fields.title.titleName'));
      fireEvent.click(getByText('ui-eholdings.exportPackageResources.fields.package.providerName'));
      fireEvent.click(providerLevelTokenForPackageFields);
      fireEvent.click(providerLevelTokenForTitleFields);
      fireEvent.click(getByText('ui-eholdings.exportPackageResources.fields.title.customLabel'));
      fireEvent.click(getByText('ui-eholdings.exportPackageResources.fields.package.packageLevelToken'));
      fireEvent.click(getByTestId('export-button'));

      expect(mockDoExport).toHaveBeenCalledWith({
        recordId: 'record-id',
        recordType: 'PACKAGE',
        packageFields: ['providerName', 'providerLevelToken', 'packageLevelToken'],
        titleFields: ['titleName', 'providerLevelToken', 'customValue1', 'customValue2', 'customValue3', 'customValue4', 'customValue5'],
      });
    });
  });

  describe('when export fails', () => {
    it('should show error message', () => {
      useExportPackageTitle.mockImplementation(({ onError }) => ({
        doExport: mockDoExport.mockImplementation(() => onError()),
      }));

      const {
        getByTestId,
      } = renderExportPackageResourcesModal();

      fireEvent.click(getByTestId('export-button'));

      expect(mockSendCallout).toHaveBeenCalledWith({
        type: 'error',
        message: 'ui-eholdings.exportPackageResources.toast.fail',
      });
    });
  });

  describe('when export succeeds', () => {
    it('should show success message', () => {
      useExportPackageTitle.mockImplementation(({ onSuccess }) => ({
        doExport: mockDoExport.mockImplementation(() => onSuccess({})),
      }));

      const {
        getByTestId,
      } = renderExportPackageResourcesModal();

      fireEvent.click(getByTestId('export-button'));

      expect(mockSendCallout).toHaveBeenCalledWith({
        type: 'success',
        message: 'ui-eholdings.exportPackageResources.toast.success',
      });
    });
  });
});
