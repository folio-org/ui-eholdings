import { connect } from 'react-redux';
import SettingsAssignedUsersRoute from './settings-assigned-users-route';
import { selectPropFromData } from '../../redux/selectors';
import {
  getKBCredentialsUsers as getKBCredentialsUsersAction,
  deleteKBCredentialsUser as deleteKBCredentialsUserAction,
  postKBCredentialsUser as postKBCredentialsUserAction,
  getUserGroups as getUserGroupsAction,
} from '../../redux/actions';

export default connect(
  (store) => ({
    assignedUsers: selectPropFromData(store, 'kbCredentialsUsers'),
    kbCredentials: selectPropFromData(store, 'kbCredentials'),
    userGroups: selectPropFromData(store, 'userGroups'),
  }),
  {
    getKBCredentialsUsers: getKBCredentialsUsersAction,
    postKBCredentialsUser: postKBCredentialsUserAction,
    deleteKBCredentialsUser: deleteKBCredentialsUserAction,
    getUserGroups: getUserGroupsAction,
  }
)(SettingsAssignedUsersRoute);
