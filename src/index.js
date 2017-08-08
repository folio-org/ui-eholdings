import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
// import Settings from './settings';
import App from './components/app';
import VendorDetails from './components/vendor-details';
// import App from './components/app';

// class EHoldingsRouting extends React.Component {
//   static actionNames = ['stripesHome', 'usersSortByName'];

//   static propTypes = {
//     stripes: PropTypes.shape({
//       connect: PropTypes.func.isRequired,
//     }).isRequired,
//     location: PropTypes.object.isRequired,
//     match: PropTypes.object.isRequired,
//     showSettings: PropTypes.bool,
//   }

//   constructor(props) {
//     super(props);
//     this.connectedApp = props.stripes.connect(App);
//   }

//   NoMatch() {
//     return (
//       <div>
//         <h2>Uh-oh!</h2>
//         <p>How did you get to <tt>{this.props.location.pathname}</tt>?</p>
//       </div>
//     );
//   }

//   renderfjdiofje() {
//     if (this.props.showSettings) {
//       return <Settings {...this.props} />;
//     }

//     return (
//       <Switch>
//         <Route
//           path={`${this.props.match.path}`}
//           render={() => <this.connectedApp {...this.props} />}
//         />
//         <Route component={() => { this.NoMatch(); }} />
//       </Switch>
//     );
//   }
// }

export default class EHoldingsRouting extends Component {

  // NoMatch() {
  //   return (
  //     <div>
  //       <h2>Uh-oh!</h2>
  //       <p>How did you get to here?</p>
  //     </div>
  //   );
  // }

  render() {
    return(
      <Switch>
        <Route path="/eholdings/vendors/:vendorId" component={VendorDetails}/>
      </Switch>
    );
  }
}
