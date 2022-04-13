import PropTypes from 'prop-types';

const CostPerUseShape = PropTypes.shape({
  attributes: PropTypes.shape({
    analysis: PropTypes.oneOfType([
      PropTypes.shape({
        cost: PropTypes.number.isRequired,
        costPerUse: PropTypes.number.isRequired,
        usage: PropTypes.number.isRequired,
      }),
      PropTypes.shape({
        holdingsSummary: PropTypes.arrayOf(PropTypes.shape({
          cost: PropTypes.number.isRequired,
          costPerUse: PropTypes.number.isRequired,
          coverages: PropTypes.arrayOf(PropTypes.shape({
            beginCoverage: PropTypes.string.isRequired,
            endCoverage: PropTypes.string.isRequired,
          })),
          embargoPeriod: PropTypes.shape({
            embargoUnit: PropTypes.string,
            embargoValue: PropTypes.string.isRequired,
          }).isRequired,
          packageId: PropTypes.string.isRequired,
          resourceId: PropTypes.string.isRequired,
          usage: PropTypes.number.isRequired,
        })).isRequired,
      }),
    ]),
    parameters: PropTypes.shape({
      currency: PropTypes.string.isRequired,
      startMonth: PropTypes.string.isRequired,
    }),
  }).isRequired,
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
});

const CostPerUseReduxStateShape = PropTypes.shape({
  data: CostPerUseShape,
  errors: PropTypes.array.isRequired,
  isFailed: PropTypes.bool.isRequired,
  isLoaded: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isPackageTitlesFailed: PropTypes.bool.isRequired,
  isPackageTitlesLoaded: PropTypes.bool.isRequired,
  isPackageTitlesLoading: PropTypes.bool.isRequired,
});

export default {
  CostPerUseShape,
  CostPerUseReduxStateShape,
};
