/* global describe, beforeEach, it */
import { expect } from 'chai';

import Resolver from '../../src/redux/resolver';
import model, { hasMany, belongsTo } from '../../src/redux/model';

// mock vendor data that would reside in our store
const VENDOR_JSON = {
  id: '1',
  isLoading: false,
  isLoaded: true,
  isSaving: false,
  attributes: {
    name: 'Awesome Vendor',
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
    vendor: {
      data: { id: '1', type: 'vendors' }
    }
  }
};

// a vendor model to test
const VendorModel = model()(
  class Vendor {
    name = 'Default Vendor'
    packages = hasMany()
  }
);

// a package model to test
const PackageModel = model()(
  class Package {
    name = 'Default Package'
    vendor = belongsTo()
  }
);

describe('Redux Models', () => {
  let resolver;
  let vendor;
  let pkg;

  beforeEach(() => {
    // model initialization needs a working resolver for relationships
    resolver = new Resolver({
      vendors: { requests: {}, records: { 1: VENDOR_JSON } },
      packages: { requests: {}, records: { 1: PACKAGE_JSON } }
    }, [VendorModel, PackageModel]);
  });

  describe('with no data', () => {
    beforeEach(() => {
      vendor = new VendorModel(null, resolver);
      pkg = new PackageModel(null, resolver);
    });

    it('should indicate status', () => {
      expect(vendor.isLoaded).to.be.false;
      expect(pkg.isLoaded).to.be.false;
    });

    it('should have default properties', () => {
      expect(vendor.name).to.equal('Default Vendor');
      expect(pkg.name).to.equal('Default Package');
    });

    it('should have empty hasMany relationships', () => {
      expect(vendor.packages).to.have.lengthOf(0);
    });

    it('should have empty belongsTo relationships', () => {
      expect(pkg.vendor.isLoaded).to.be.false;
      expect(pkg.vendor.name).to.equal('Default Vendor');
    });
  });

  describe('with data', () => {
    beforeEach(() => {
      vendor = new VendorModel(1, resolver);
      pkg = new PackageModel(1, resolver);
    });

    it('should indicate status', () => {
      expect(vendor.isLoaded).to.be.true;
      expect(pkg.isLoaded).to.be.true;
    });

    it('should have specified properties', () => {
      expect(vendor.name).to.equal('Awesome Vendor');
      expect(pkg.name).to.equal('Awesome Package');
    });

    it('should not have unspecified properties', () => {
      // this is provided by the vendor json
      expect(vendor).to.not.have.property('totalPackages');
    });

    it('should have a hasMany relationship', () => {
      expect(vendor.packages).to.have.lengthOf(1);
      expect(vendor.packages.getRecord(0).name).to.equal('Awesome Package');
    });

    it('should have a belongsTo relationship', () => {
      expect(pkg.vendor.isLoaded).to.be.true;
      expect(pkg.vendor.name).to.equal('Awesome Vendor');
    });
  });

  describe('with incomplete data', () => {
    const INCOMPLETE_VENDOR_JSON = {
      ...VENDOR_JSON,
      attributes: { totalPackages: 1 },
      relationships: { packages: {} }
    };

    const INCOMPLETE_PACKAGE_JSON = {
      ...PACKAGE_JSON,
      relationships: { vendor: {} }
    };

    beforeEach(() => {
      resolver = new Resolver({
        vendors: { requests: {}, records: { 1: INCOMPLETE_VENDOR_JSON } },
        packages: { requests: {}, records: { 1: INCOMPLETE_PACKAGE_JSON } }
      }, [VendorModel, PackageModel]);

      vendor = new VendorModel(1, resolver);
      pkg = new PackageModel(1, resolver);
    });

    it('should indicate status', () => {
      expect(vendor.isLoaded).to.be.true;
      expect(pkg.isLoaded).to.be.true;
    });

    it('should have default properties for missing attribtues', () => {
      expect(vendor.name).to.equal('Default Vendor');
      expect(pkg.name).to.equal('Awesome Package');
    });

    it('should have empty hasMany relationships', () => {
      expect(vendor.packages).to.have.lengthOf(0);
    });

    it('should have empty belongsTo relationships', () => {
      expect(pkg.vendor.isLoaded).to.be.false;
      expect(pkg.vendor.name).to.equal('Default Vendor');
    });
  });
});
