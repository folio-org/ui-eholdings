# Data Layer

## Table of Contents

* [Redux](#redux)
* [Models](#models)
* [Requesting and Resolving Data](#requesting--resolving-data)
* [Debugging Requests](#debugging-requests)
* [The Resolver](#the-resolver)
* [Motivation](#motivation)

## Redux

In eHoldings, only `routes` are connected to data. This is done via
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

When in need of data, you must first request it with one of the actions
defined in `mapDispatchToProps`. The data received in
`mapStateToProps` will then update with a pending request, then update
again once the request resolves or rejects.

## Models

You must first define a model to request and store data in the redux
store.

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

After defining a model, we can use the eHoldings `resolver` and
react-redux's `connect` to allow us to make requests for and receive
data from our backend API.

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

The model returned by the resolver has default properties as defined
on the model class which are then populated with the request results.

Models also have the following additional properties:

``` javascript
model.isLoading //=> Boolean indicating if the record is in some loading state
model.isLoaded  //=> Boolean indicating the model is done loading
model.isSaving  //=> Boolean indicating the model is being updated
model.request   //=> Request object for this record's find request
model.update    //=> Request object for this record's update request
model.destroy   //=> Request object for this record's destroy request
```

The various request objects have the following useful properties:

``` javascript
{
  timestamp: 1531233597291, // timestamp of when the request was created
  params: {},               // params for the request such as filters
  isPending: true,          // whether the request is pending
  isResolved: false,        // whether the request is resolved
  isRejected: false,        // whether the request is rejected
  changedAttributes: {},    // attributes that changed on update
  meta: {},                 // meta returned by the request
  errors: []                // errors returned with a rejected request
}
```

When dealing with a collection of models, such as with `hasMany`, the
returned collection object lazily looks up other pages from the same
query in the data store. This allows you to map over or slice all
records that have been returned by a query regardless of page, such as
when rendering the search results lists. Collections also have a
`request` object which is always the last request made for a page
within the collection.

For search results, the resolver must know the exact params you passed
to the search action in order to properly find the records from the
request. In the case of a provider's packages, the search params are
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

## Motivation

When we started building eHoldings we knew that we wanted our data layer to 
have certain features that were not available in Stripes Connect. At the time, Stripes 
Connect was tightly coupled to CQL and the static manifest files that it provided were 
not flexible enough for the error states that we wanted to surface in our components. 

In addition, Stripes Connect didn't provide normalization or side loading that we needed 
to provide a good user experience. We didn't have the resources to re-architect Stripes 
Connect to make it flexible for our use, so we decided to create our own data layer. 

There are currently conversations about adopting Apollo GraphQL instead of Stripes Connect. 
Apollo GraphQL has a similar feature set as the eHoldings Data Layer with the exception that 
data requirements are specified via queries rather than resources.
