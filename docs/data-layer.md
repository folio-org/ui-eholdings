# Data Layer

## Redux

In eHoldings, data is connected on `routes` only. This is done via
`react-redux`'s `connect` decorator.

``` javascript
connect(({ eholdings: { data } }) => ({
  // ...mapStateToProps
  // data needed by the component is accessed here
}), {
  // ...mapDispatchToProps
  // actions used to send requests for data are defined here
});
```

When data is needed, you must first request it with one of the actions
defined in `mapDispatchToProps`. The data received in
`mapStateToProps` will then update with a pending request, and update
again once the request resolves or rejects.

## Models

In eHoldings, you must define a model to request and store data in the
redux store.

``` javascript
// src/redux/provider.js
import model, { hasMany } from './model';

class Provider {
  // if an attribute is not defined here, the data will not be accessible in our component
  name = '';
  packagesSelected = 0;
  packagesTotal = 0;

  // relationships are defined using `hasMany(type)` or `belongsTo(type)`
  // the type defaults to the relationship key
  packages = hasMany();
}

export default model({
  type: 'providers',           // used as the key when storing data
  path: '/eholdings/providers' // used in the URL during requests
})(Provider);
```

### Requesting & Resolving Data

Using this model and the eHoldings resolver within `connect` allows us
to request and receive data from the backend Okapi server.

``` javascript
// src/routes/provider-show.js
import { createResolver } from '../redux';
import Provider from '../redux/provider';

// ... class ProviderShowRoute extends Component {}

export default connect(
  ({ eholdings: { data } }, { match }) => {
    let resolver = createResolver(data);

    return {
      // returns a `Provider` model we defined earlier
      model: resolver.find('providers', match.params.providerId),
      // used in the component to look up packages
      resolver
    };
  }, {
    // will request a provider at `/eholdings/provider/:id`
    getProvider: id => Provider.find(id, { include: 'packages' }),
    // will request packages at `/eholdings/provider/:id/packages?:params`
    getPackages: (id, params) => Provider.queryRelated(id, 'packages', params)
  }
)(ProviderShowRoute);
```

The model returned by the resolver has request objects at
`model.request`, `model.update`, and `model.destroy` which provide
information about the different types of requests, such as
`isPending`, `isResolved`, `isRejected`, `errors`, etc.

When dealing with a collection of models, such as with `hasMany`, the
returned collection object lazily looks up other pages from the same
query in the data store. This allows you to map over all records that
have been returned by a query regardless of page, such as when
rendering the search results lists.

For search results, the resolver must know the exact params you passed
to the search action in order to properly find the records from the
request. In the case of provider packages, the search params are
stored in the local state and used by the resolver to look up the
packages request. When this request resolves, the resolver will be
able to know which records it resolved with, and in what order.

``` javascript
class ProviderShowRoute extends Component {
  // ...

  componentDidUpdate(prevProps, prevState) {
    let { match, getPackages } = this.props;
    let { pkgSearchParams } = this.state;
    let { providerId } = match.params;

    // a different provider needs to be requested
    if (providerId !== prevProps.match.params.providerId) {
      this.props.getProvider(providerId);
    }

    // get packages when the search params update
    if (pkgSearchParams !== prevState.pkgSearchParams) {
      getPackages(providerId, pkgSearchParams);
    }
  }

  getPkgResults() {
    let { match, resolver } = this.props;
    let { pkgSearchParams } = this.state;
    let { providerId } = match.params;

    // search params are needed by the resolver to look up records
    return resolver.query('packages', pkgSearchParams, {
      // the resolver also needs to know that this request was for
      // provider packages and not the packages' own endpoint
      path: `${Provider.pathFor(providerId)}/packages`
    });
  }

  searchPackages = (params) => {
    this.setState({ pkgSearchParams: params });
  };

  // ...
}
```

## Debugging Requests

When you call an action, such as `getProvider`, the action dispatched
to redux runs through request reducers to generate the request,
followed by an observable epic to actually make the request, then that
epic dispatches a resolve or reject action which runs back through the
reducers to mark the request's status and add our data to the store.

1. Request action is dispatched (`find`, `query`, etc.)
2. Redux reducers create request object for the type of request and resource type
3. The observable epic reacts to the action and sends the real request
4. The observable epic dispatches `resolve` or `reject` in response to the request
5. Redux reducers update the request object and store records from any resolved data

So when you make a request for data, the store will update twice. Once
with a new request; this is when you can check
`model.request.isPending` inside of components. The second time with
the resolved or rejected data; this is when the request's `isResolved`
or `isRejected` properties are updated and the model's data becomes
accessible (and no longer returns default values for defined
attributes).

All of the redux reducers, actions, and epic for the data layer live
in `src/redux/data.js`.

### The Resolver

The `request` objects created by the store are important to the
resolver. When looking up a collection of resources, the resolver
first looks up the _request_. It then uses the data stored in that
request to generate the collection object which then uses the resolver
again to look up requests for other pages of data. When accessing a
single record, the resolver returns the model for that record, but
that model then uses the resolver to look up the various requests for
itself. The resolver should always return the _latest_ matched
request.

The resolver for the eHoldings data layer lives in
`src/redux/resolver.js` and the model and collection objects live in
`src/redux/model.js`.
