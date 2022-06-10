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

    describe('when some fields are not defined in a constant', () => {
      it('should return correct mapped values', () => {
        expect(utils.formatExportFieldsPayload(['providerName', 'nonExistingField', 'packageAgreements'], RECORD_TYPES.PACKAGE))
          .toEqual(['providerName', 'packageAgreement']);
      });
    });
  });
});
