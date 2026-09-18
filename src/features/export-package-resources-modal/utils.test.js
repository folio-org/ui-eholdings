import * as utils from './utils';
import { RECORD_TYPES } from './constants';

describe('ExportPackageResourcesModal utils', () => {
  describe('formatExportFieldsPayload', () => {
    describe('when all fields are defined in a constant', () => {
      it('should return correct mapped values', () => {
        expect(utils.formatExportFieldsPayload(['providerName', 'packageAgreements'], RECORD_TYPES.PACKAGE))
          .toEqual(['providerName', 'packageAgreements']);
      });
    });

    describe('when a field is mapped to multiple values', () => {
      it('should return all mapped values', () => {
        expect(utils.formatExportFieldsPayload(['customLabel'], RECORD_TYPES.RESOURCE))
          .toEqual(['customValue1', 'customValue2', 'customValue3', 'customValue4', 'customValue5']);
      });
    });
  });
});
