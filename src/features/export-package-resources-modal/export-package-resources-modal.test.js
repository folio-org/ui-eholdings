import {
  render,
  fireEvent,
} from '@testing-library/react';

import ExportPackageResourcesModal from './export-package-resources-modal';
import Harness from '../../../test/jest/helpers/harness';

const mockOnClose = jest.fn();
const mockDoExport = jest.fn();

jest.mock('../../hooks', () => ({
  useExportPackageTitle: () => ({
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
      const {
        getByTestId,
        getByText,
      } = renderExportPackageResourcesModal();

      fireEvent.click(getByText('ui-eholdings.exportPackageResources.fields.title.titleName'));
      fireEvent.click(getByText('ui-eholdings.exportPackageResources.fields.package.providerName'));
      fireEvent.click(getByText('ui-eholdings.exportPackageResources.fields.title.customLabel'));
      fireEvent.click(getByTestId('export-button'));

      expect(mockDoExport).toHaveBeenCalledWith({
        recordId: 'record-id',
        recordType: 'PACKAGE',
        packageFields: ['providerName'],
        titleFields: ['titleName', 'customValue1', 'customValue2', 'customValue3', 'customValue4', 'customValue5'],
      });
    });
  });
});
