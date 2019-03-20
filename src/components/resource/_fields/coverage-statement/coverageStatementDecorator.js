import createCalculateDecorator from 'final-form-calculate';

import { coverageStatementStatuses } from '../../../../constants';

const {
  YES,
  NO,
} = coverageStatementStatuses;

export default createCalculateDecorator(
  {
    field: 'hasCoverageStatement',
    updates: {
      coverageStatement: (hasCoverageStatementValue, formValues) => {
        return hasCoverageStatementValue === NO
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
          ? YES
          : NO;
      }
    }
  }
);
