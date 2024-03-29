import {
  render,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';
import { useCallout } from '@folio/stripes/core';

import ExportPackageResourcesModal from './export-package-resources-modal';
import { useExportPackageTitle } from '../../hooks';
import Harness from '../../../test/jest/helpers/harness';

const mockOnClose = jest.fn();
const mockSendCallout = jest.fn();
const mockDoExport = jest.fn();

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useCallout: jest.fn().mockReturnValue({
    sendCallout: jest.fn(),
  }),
}));

jest.mock('../../hooks', () => ({
  useExportPackageTitle: jest.fn().mockReturnValue({
    doExport: jest.fn(),
  }),
}));

const renderExportPackageResourcesModal = (props = {}) => render((
  <Harness>
    <ExportPackageResourcesModal
      open
      onClose={mockOnClose}
      recordId="record-id"
      recordType="PACKAGE"
      {...props}
    />
  </Harness>
));

describe('Given ExportPackageResourcesModal', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display the component', () => {
    const { getByText } = renderExportPackageResourcesModal();

    expect(getByText('ui-eholdings.exportPackageResources.subtitle.package')).toBeDefined();
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

  describe('when there is no export limit', () => {
    it('should not disable export button', () => {
      const { getByTestId } = renderExportPackageResourcesModal({
        resourcesCount: 100000,
      });

      expect(getByTestId('export-button')).not.toBeDisabled();
    });
  });

  describe('when there is an export limit and resources count exceeds it', () => {
    it('should disable export button', () => {
      const { getByTestId } = renderExportPackageResourcesModal({
        exportLimit: 100,
        resourcesCount: 101,
      });

      expect(getByTestId('export-button')).toBeDisabled();
    });
  });

  describe('when there is an export limit and resources count does not exceed it', () => {
    it('should not disable export button', () => {
      const { getByTestId } = renderExportPackageResourcesModal({
        exportLimit: 100,
        resourcesCount: 10,
      });

      expect(getByTestId('export-button')).not.toBeDisabled();
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
      } = renderExportPackageResourcesModal();

      fireEvent.click(getByText('ui-eholdings.exportPackageResources.fields.title.titleName'));
      fireEvent.click(getByText('ui-eholdings.exportPackageResources.fields.package.providerName'));
      fireEvent.click(getByText('ui-eholdings.exportPackageResources.fields.package.providerLevelToken'));
      fireEvent.click(getByText('ui-eholdings.exportPackageResources.fields.title.customLabel'));
      fireEvent.click(getByText('ui-eholdings.exportPackageResources.fields.package.packageLevelToken'));
      fireEvent.click(getByTestId('export-button'));

      expect(mockDoExport).toHaveBeenCalledWith({
        recordId: 'record-id',
        recordType: 'PACKAGE',
        packageFields: ['providerName', 'providerLevelToken', 'packageLevelToken'],
        titleFields: ['titleName', 'customValue1', 'customValue2', 'customValue3', 'customValue4', 'customValue5'],
      });
    });
  });

  describe('when export fails', () => {
    it('should show error message', () => {
      useCallout.mockReturnValue({
        sendCallout: mockSendCallout,
      });
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
      useCallout.mockReturnValue({
        sendCallout: mockSendCallout,
      });
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
