/* global describe, beforeEach, it */
import { expect } from 'chai';

import Resolver from '../../../../src/redux/resolver';
import model, { Collection } from '../../../../src/redux/model';

const STORE_FIXTURE = {
  providers: {
    requests: {
      [Date.now()]: {
        timestamp: Date.now(),
        type: 'query',
        resource: 'provider',
        isPending: false,
        isResolved: true,
        isRejected: false,
        records: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        meta: { totalResults: 10 },
        params: {}
      }
    },
    records: new Array(10).fill().reduce((records, _, i) => {
      return {
        ...records,
        [i]: {
          id: `${i}`,
          isLoading: false,
          isLoaded: true,
          isSaving: false,
          attributes: {
            name: `Provider ${i}`
          }
        }
      };
    }, {})
  }
};

const ProviderModel = model()(
  class Provider {
    name = ''
  }
);

describe('Redux Collections', () => {
  let resolver;
  let providers;

  beforeEach(() => {
    resolver = new Resolver(STORE_FIXTURE, [ProviderModel]);
    providers = new Collection({ type: 'providers' }, resolver);
  });

  it('contains provider records from the store', () => {
    expect(providers).to.have.lengthOf(10);
    expect(providers.getRecord(0)).to.deep.include({
      name: 'Provider 0',
      id: '0'
    });
  });

  it('supports slicing into an array', () => {
    expect(providers).to.respondTo('slice');
    expect(providers.slice(0, 1)).to.be.an('array');
    expect(providers.slice(0, 1)).to.have.lengthOf(1);
    expect(providers.slice(0, 1)[0]).to.deep.include({
      name: 'Provider 0',
      id: '0'
    });
  });

  it('supports mapping over records', () => {
    expect(providers).to.respondTo('map');
    expect(providers.map(r => r.id)).to.be.an('array');
    expect(providers.map(r => r.id))
      .to.have.members(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']);
  });

  it('has no unloaded records', () => {
    expect(providers.hasUnloaded).to.be.false;
  });

  describe('when a record is unloaded', () => {
    const UNLOADED_FIXTURE = {
      ...STORE_FIXTURE,
      providers: {
        ...STORE_FIXTURE.providers,
        requests: Object.keys(STORE_FIXTURE.providers.requests)
          .reduce((reqs, timestamp) => ({
            ...reqs,
            [timestamp]: {
              ...STORE_FIXTURE.providers.requests[timestamp],
              hasUnloaded: true
            }
          }), {})
      }
    };

    beforeEach(() => {
      resolver = new Resolver(UNLOADED_FIXTURE, [ProviderModel]);
      providers = new Collection({ type: 'providers' }, resolver);
    });

    it('has unloaded records', () => {
      expect(providers.hasUnloaded).to.be.true;
    });
  });
});
