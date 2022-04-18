import PropTypes from 'prop-types';

import costPerUseTypes from './costPerUseTypes';

const PackageCostPerUseShape = PropTypes.shape({
  attributes: PropTypes.shape({
    analysis: PropTypes.shape({
      cost: PropTypes.number.isRequired,
      costPerUse: PropTypes.number.isRequired,
      usage: PropTypes.number.isRequired,
    }),
  }).isRequired,
});

const PackageTitleCostPerUseShape = PropTypes.shape({
  attributes: PropTypes.shape({
    meta: PropTypes.object.isRequired,
    parameters: PropTypes.shape({
      currency: PropTypes.string.isRequired,
      startMonth: PropTypes.string.isRequired,
    }),
    resources: PropTypes.arrayOf(PropTypes.shape({
      attributes: PropTypes.shape({
        cost: PropTypes.number.isRequired,
        costPerUse: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        percent: PropTypes.number.isRequired,
        publicationType: PropTypes.string.isRequired,
        usage: PropTypes.number.isRequired,
      }).isRequired,
      resourceId: PropTypes.string.isRequired,
    })),
  }).isRequired,
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
});

const TitleCostPerUseShape = PropTypes.shape({
  attributes: PropTypes.shape({
    analysis: PropTypes.shape({
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
  }).isRequired,
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
});

const ResourceCostPerUseShape = PropTypes.shape({
  attributes: PropTypes.shape({
    analysis: PropTypes.shape({
      cost: PropTypes.number.isRequired,
      costPerUse: PropTypes.number.isRequired,
      usage: PropTypes.number.isRequired,
    }),
    usage: PropTypes.shape({
      platforms: PropTypes.array.isRequired,
    }).isRequired,
  }).isRequired,
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
});

const CostPerUseShape = PropTypes.shape({
  [costPerUseTypes.PACKAGE_COST_PER_USE]: PackageCostPerUseShape,
  [costPerUseTypes.PACKAGE_TITLE_COST_PER_USE]: PackageTitleCostPerUseShape,
  [costPerUseTypes.RESOURCE_COST_PER_USE]: ResourceCostPerUseShape,
  [costPerUseTypes.TITLE_COST_PER_USE]: TitleCostPerUseShape,
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
