/* global describe, beforeEach, it */
// eslint-disable-next-line max-classes-per-file
import { expect } from 'chai';

import Resolver from '../../../../src/redux/resolver';
import model, { hasMany, belongsTo } from '../../../../src/redux/model';

// mock provider data that would reside in our store
const PROVIDER_JSON = {
  id: '1',
  isLoading: false,
  isLoaded: true,
  isSaving: false,
  attributes: {
    name: 'Awesome Provider',
    totalPackages: 1
  },
  relationships: {
    packages: {
      data: [{ id: '1', type: 'packages' }]
    }
  }
};

// mock package data that would reside in our store
const PACKAGE_JSON = {
  id: '1',
  isLoading: false,
  isLoaded: true,
  isSaving: false,
  attributes: {
    name: 'Awesome Package'
  },
  relationships: {
    provider: {
      data: { id: '1', type: 'providers' }
    }
  }
};

// a provider model to test
const ProviderModel = model()(
  class Provider {
    name = 'Default Provider'
    packages = hasMany()
  }
);

// a package model to test
const PackageModel = model()(
  class Package {
    name = 'Default Package'
    provider = belongsTo()
  }
);

describe('Redux Models', () => {
  let resolver;
  let provider;
  let pkg;

  beforeEach(() => {
    // model initialization needs a working resolver for relationships
    resolver = new Resolver({
      providers: { requests: {}, records: { 1: PROVIDER_JSON } },
      packages: { requests: {}, records: { 1: PACKAGE_JSON } }
    }, [ProviderModel, PackageModel]);
  });

  describe('with no data', () => {
    beforeEach(() => {
      provider = new ProviderModel(null, resolver);
      pkg = new PackageModel(null, resolver);
    });

    it('should indicate status', () => {
      expect(provider.isLoaded).to.be.false;
      expect(pkg.isLoaded).to.be.false;
    });

    it('should have default properties', () => {
      expect(provider.name).to.equal('Default Provider');
      expect(pkg.name).to.equal('Default Package');
    });

    it('should have empty hasMany relationships', () => {
      expect(provider.packages).to.have.lengthOf(0);
    });

    it('should have empty belongsTo relationships', () => {
      expect(pkg.provider.isLoaded).to.be.false;
      expect(pkg.provider.name).to.equal('Default Provider');
    });
  });

  describe('with explicit relationship data', () => {
    beforeEach(() => {
      provider = new ProviderModel(1, resolver);
      pkg = new PackageModel(1, resolver);
    });

    it('should indicate status', () => {
      expect(provider.isLoaded).to.be.true;
      expect(pkg.isLoaded).to.be.true;
    });

    it('should have specified properties', () => {
      expect(provider.name).to.equal('Awesome Provider');
      expect(pkg.name).to.equal('Awesome Package');
    });

    it('should not have unspecified properties', () => {
      // this is provided by the provider json
      expect(provider).to.not.have.property('totalPackages');
    });

    it('should have a hasMany relationship', () => {
      expect(provider.packages).to.have.lengthOf(1);
      expect(provider.packages.getRecord(0).name).to.equal('Awesome Package');
    });

    it('should have a belongsTo relationship', () => {
      expect(pkg.provider.isLoaded).to.be.true;
      expect(pkg.provider.name).to.equal('Awesome Provider');
    });
  });

  describe('with incomplete data', () => {
    const INCOMPLETE_PROVIDER_JSON = {
      ...PROVIDER_JSON,
      attributes: { totalPackages: 1 },
      relationships: { packages: {} }
    };

    const INCOMPLETE_PACKAGE_JSON = {
      ...PACKAGE_JSON,
      relationships: { provider: {} }
    };

    beforeEach(() => {
      resolver = new Resolver({
        providers: { requests: {}, records: { 1: INCOMPLETE_PROVIDER_JSON } },
        packages: { requests: {}, records: { 1: INCOMPLETE_PACKAGE_JSON } }
      }, [ProviderModel, PackageModel]);

      provider = new ProviderModel(1, resolver);
      pkg = new PackageModel(1, resolver);
    });

    it('should indicate status', () => {
      expect(provider.isLoaded).to.be.true;
      expect(pkg.isLoaded).to.be.true;
    });

    it('should have default properties for missing attribtues', () => {
      expect(provider.name).to.equal('Default Provider');
      expect(pkg.name).to.equal('Awesome Package');
    });

    it('should have empty hasMany relationships', () => {
      expect(provider.packages).to.have.lengthOf(0);
    });

    it('should have empty belongsTo relationships', () => {
      expect(pkg.provider.isLoaded).to.be.false;
      expect(pkg.provider.name).to.equal('Default Provider');
    });

    describe('with foreign key in attributes', () => {
      beforeEach(() => {
        INCOMPLETE_PACKAGE_JSON.attributes.providerId = provider.id;
        INCOMPLETE_PROVIDER_JSON.attributes.name = 'Awesome Provider';

        // we have to recreate these after state alteration
        provider = new ProviderModel(1, resolver);
        pkg = new PackageModel(1, resolver);
      });

      // not yet implemented
      it('should have hasMany relationships');

      it('should have belongsTo relationships', () => {
        expect(pkg.provider.isLoaded).to.be.true;
        expect(pkg.provider.name).to.equal('Awesome Provider');
      });
    });
  });
});
