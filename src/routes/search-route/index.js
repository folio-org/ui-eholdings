import { connect } from 'react-redux';

import SearchRoute from './search-route';

import { createResolver } from '../../redux';
import Provider from '../../redux/provider';
import Package from '../../redux/package';
import Title from '../../redux/title';
import Tag from '../../redux/tag';
import { getAccessTypes as getAccessTypesAction } from '../../redux/actions';
import { selectPropFromData } from '../../redux/selectors';
import { tagPaths } from '../../constants/tagPaths';

export default connect(
  (store) => {
    const { data } = store.eholdings;
    const resolver = createResolver(data);

    return {
      tagsModelOfAlreadyAddedTags: resolver.query('tags', undefined, { path: tagPaths.alreadyAddedToRecords }),
      resolver,
      accessTypes: selectPropFromData(store, 'accessStatusTypes'),
    };
  }, {
    searchProviders: params => Provider.query(params),
    searchPackages: params => Package.query(params),
    searchTitles: params => Title.query(params),
    getTags: (params, options) => Tag.query(params, options),
    getAccessTypes: getAccessTypesAction,
  }
)(SearchRoute);

