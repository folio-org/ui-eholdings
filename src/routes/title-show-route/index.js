import { connect } from 'react-redux';
import TitleShowRoute from './title-show-route';
import {
  getCostPerUse as getCostPerUseAction,
  clearCostPerUseData as clearCostPerUseDataAction
} from '../../redux/actions';
import { selectPropFromData } from '../../redux/selectors';
import { createResolver } from '../../redux';
import Title from '../../redux/title';
import Package from '../../redux/package';
import Resource from '../../redux/resource';

export default connect(
  (store, { match }) => {
    const {
      eholdings: { data },
    } = store;
    const resolver = createResolver(data);

    return {
      model: resolver.find('titles', match.params.titleId),
      createRequest: resolver.getRequest('create', { type: 'resources' }),
      customPackages: resolver.query('packages', {
        filter: { custom: true },
        count: 100,
        pageSize: 100,
      }),
      costPerUse: selectPropFromData(store, 'costPerUse'),
    };
  }, {
    getTitle: id => Title.find(id, { include: 'resources' }),
    createResource: attrs => Resource.create(attrs),
    getCustomPackages: (query) => Package.query({
      filter: { custom: true },
      q: query,
      count: 100,
      pageSize: 100,
    }),
    getCostPerUse: getCostPerUseAction,
    clearCostPerUseData: clearCostPerUseDataAction,
  }
)(TitleShowRoute);
