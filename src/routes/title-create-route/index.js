import { connect } from 'react-redux';

import TitleCreateRoute from './title-create-route';
import { createResolver } from '../../redux';
import Title from '../../redux/title';
import Package from '../../redux/package';

export default connect(
  ({ eholdings: { data } }) => {
    const resolver = createResolver(data);

    return {
      createRequest: resolver.getRequest('create', { type: 'titles' }),
      customPackages: resolver.query('packages', {
        filter: { custom: true },
        count: 100,
        pageSize: 100,
      }),
    };
  }, {
    createTitle: attrs => Title.create(attrs),
    removeCreateRequests: () => Title.removeRequests('create'),
    getCustomPackages: (query) => Package.query({
      filter: { custom: true },
      q: query,
      count: 100,
      pageSize: 100,
    }),
  }
)(TitleCreateRoute);
