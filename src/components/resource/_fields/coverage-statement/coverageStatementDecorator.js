import createCalculateDecorator from 'final-form-calculate';

export default createCalculateDecorator(
  {
    field: 'hasCoverageStatement',
    updates: {
      coverageStatement: (hasCoverageStatement, { coverageStatement }) => {
        return (hasCoverageStatement === 'no') ? '' : coverageStatement;
      }
    }
  },
  {
    field: 'coverageStatement',
    updates: {
      hasCoverageStatement: (coverageStatement) => {
        return (coverageStatement && coverageStatement.length) > 0 ? 'yes' : 'no';
      }
    }
  }
);
