import {
  render,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import ExportFieldsSection from './export-fields-section';

const mockOnChange = jest.fn();

const sectionState = {
  allSelected: true,
  selectedFields: [],
};

const renderExportFieldsSection = () => render((
  <ExportFieldsSection
    id="export-section"
    name="test-fields"
    onChange={mockOnChange}
    options={[{
      value: 'field-1',
      label: 'Field 1',
    }, {
      value: 'field-2',
      label: 'Field 2',
    }]}
    sectionState={sectionState}
    title="Test fields"
  />
));

describe('Given ExportFieldsSection', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display the component', () => {
    const { getByText } = renderExportFieldsSection();

    expect(getByText('Test fields')).toBeDefined();
  });

  describe('when selecting a radiobutton', () => {
    it('should call onChange', () => {
      const { getByLabelText } = renderExportFieldsSection();

      fireEvent.click(getByLabelText('ui-eholdings.exportPackageResources.fields.selected'));

      expect(mockOnChange).toHaveBeenCalledWith({
        allSelected: false,
        selectedFields: [],
      });
    });
  });

  describe('when selecting a field', () => {
    it('should call onChange', () => {
      const { getByText } = renderExportFieldsSection();

      fireEvent.click(getByText('Field 1'));

      expect(mockOnChange).toHaveBeenCalledWith({
        allSelected: false,
        selectedFields: [{
          value: 'field-1',
          label: 'Field 1',
        }],
      });
    });
  });
});
