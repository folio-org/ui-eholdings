import createCalculateDecorator from 'final-form-calculate';

import { coverageStatementStatuses } from '../../../../constants';

export default createCalculateDecorator(
  {
    field: 'hasCoverageStatement',
    updates: {
      coverageStatement: (hasCoverageStatementValue, formValues) => {
        return hasCoverageStatementValue === coverageStatementStatuses.NO_STATUS
          ? ''
          : formValues.coverageStatement;
      }
    }
  },
  {
    field: 'coverageStatement',
    updates: {
      hasCoverageStatement: (coverageStatementValue) => {
        return coverageStatementValue && coverageStatementValue.length
          ? coverageStatementStatuses.YES_STATUS
          : coverageStatementStatuses.NO_STATUS;
      }
    }
  }
);
