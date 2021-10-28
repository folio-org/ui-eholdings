import { connect } from 'react-redux';
import TitleEditRoute from './title-edit-route';
import { createResolver } from '../../redux';
import Title from '../../redux/title';

export default connect(
  ({ eholdings: { data } }, { match }) => ({
    model: createResolver(data).find('titles', match.params.titleId),
    updateRequest: createResolver(data).getRequest('update', { type: 'titles' })
  }), {
    getTitle: id => Title.find(id, { include: 'resources' }),
    updateTitle: model => Title.save(model),
    removeUpdateRequests: () => Title.removeRequests('update'),
  }
)(TitleEditRoute);
