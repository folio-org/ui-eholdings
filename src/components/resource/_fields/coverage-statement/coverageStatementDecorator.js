import createCalculateDecorator from 'final-form-calculate';

import { coverageStatementExistenceStatuses } from '../../../../constants';

export default createCalculateDecorator(
  {
    field: 'hasCoverageStatement',
    updates: {
      coverageStatement: (hasCoverageStatementValue, formValues) => {
        return hasCoverageStatementValue === coverageStatementExistenceStatuses.NO
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
          ? coverageStatementExistenceStatuses.YES
          : coverageStatementExistenceStatuses.NO;
      }
    }
  }
);
