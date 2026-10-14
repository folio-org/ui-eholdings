import { accessTypes } from '../constants';
import { populatePackageAttributesFromForm } from './populate-package-attributes-from-form';

describe('populatePackageAttributesFromForm', () => {
  describe('isSelected', () => {
    describe('when it is in values', () => {
      it('should add it to attributes', () => {
        expect(populatePackageAttributesFromForm({
          isSelected: true,
        })).toEqual({
          isSelected: true,
        });
      });
    });

    describe('when it is not in values', () => {
      it('should not add it to attributes', () => {
        expect(populatePackageAttributesFromForm({})).toEqual({});
      });
    });
  });

  describe('visibility', () => {
    describe('when it is in values', () => {
      it('should add it to attributes', () => {
        expect(populatePackageAttributesFromForm({
          visibility: [{ hidden: false }],
        })).toEqual({
          visibility: [{ hidden: false }],
        });
      });
    });

    describe('when it is not in values', () => {
      it('should not add it to attributes', () => {
        expect(populatePackageAttributesFromForm({})).toEqual({});
      });
    });
  });

  describe('allowKbToAddTitles', () => {
    describe('when it is in values', () => {
      it('should add it to attributes', () => {
        expect(populatePackageAttributesFromForm({
          allowKbToAddTitles: true,
        })).toEqual({
          allowKbToAddTitles: true,
        });
      });
    });

    describe('when it is not in values', () => {
      it('should not add it to attributes', () => {
        expect(populatePackageAttributesFromForm({})).toEqual({});
      });
    });
  });

  describe('name', () => {
    describe('when it is in values', () => {
      it('should add it to attributes', () => {
        expect(populatePackageAttributesFromForm({
          name: 'name',
        })).toEqual({
          name: 'name',
        });
      });
    });

    describe('when it is not in values', () => {
      it('should not add it to attributes', () => {
        expect(populatePackageAttributesFromForm({})).toEqual({});
      });
    });
  });

  describe('contentType', () => {
    describe('when it is in values', () => {
      it('should add it to attributes', () => {
        expect(populatePackageAttributesFromForm({
          contentType: 'book',
        })).toEqual({
          contentType: 'book',
        });
      });
    });

    describe('when it is not in values', () => {
      it('should not add it to attributes', () => {
        expect(populatePackageAttributesFromForm({})).toEqual({});
      });
    });
  });

  describe('url', () => {
    describe('when it is in values', () => {
      it('should add it to attributes', () => {
        expect(populatePackageAttributesFromForm({
          url: 'http://test.com',
        })).toEqual({
          url: 'http://test.com',
        });
      });
    });

    describe('when it is not in values', () => {
      it('should not add it to attributes', () => {
        expect(populatePackageAttributesFromForm({})).toEqual({});
      });
    });

    describe('when it is an empty string with spaces', () => {
      it('should not add it to attributes', () => {
        expect(populatePackageAttributesFromForm({
          url: '        ',
        })).toEqual({});
      });
    });
  });

  describe('proxyId', () => {
    describe('when it is in values', () => {
      it('should add it to attributes and keep other proxy properties', () => {
        const model = {
          proxy: {
            inherited: true,
            id: 'old-proxy-id',
            otherProp: 123
          },
        };

        expect(populatePackageAttributesFromForm({
          proxyId: 'proxy-id',
        }, model)).toEqual({
          proxy: {
            inherited: false,
            id: 'proxy-id',
            otherProp: 123,
          },
        });
      });
    });

    describe('when it is not in values', () => {
      it('should not add it to attributes', () => {
        expect(populatePackageAttributesFromForm({})).toEqual({});
      });
    });
  });

  describe('packageTokenValue', () => {
    const model = {
      packageToken: {
        value: 'old-token',
      },
    };

    describe('when it is in values', () => {
      it('should add it to attributes', () => {
        expect(populatePackageAttributesFromForm({
          packageTokenValue: 'new-token',
        }, model)).toEqual(expect.objectContaining({
          packageToken: {
            value: 'new-token',
          },
        }));
      });
    });

    describe('when it is not in values', () => {
      describe('and it is saved in the package', () => {
        it('should not add it to attributes', () => {
          expect(populatePackageAttributesFromForm({}, model)).toEqual({});
        });
      });

      describe('and it is not saved in the package', () => {
        it('should not add it to attributes', () => {
          expect(populatePackageAttributesFromForm({})).toEqual({});
        });
      });
    });
  });

  describe('isCustom', () => {
    describe('when it is in model', () => {
      it('should add it to attributes', () => {
        expect(populatePackageAttributesFromForm({}, { isCustom: true })).toEqual({
          isCustom: true,
        });
      });
    });

    describe('when it is not in model', () => {
      it('should not add it to attributes', () => {
        expect(populatePackageAttributesFromForm({}, {})).toEqual({});
      });
    });
  });

  describe('isFreeAccess', () => {
    describe('when it is in values', () => {
      it('should add it to attributes', () => {
        expect(populatePackageAttributesFromForm({
          isFreeAccess: true,
        })).toEqual({
          isFreeAccess: true,
        });
      });
    });

    describe('when it is not in values', () => {
      it('should not add it to attributes', () => {
        expect(populatePackageAttributesFromForm({})).toEqual({});
      });
    });
  });

  describe('customAltNames', () => {
    describe('when the array contains empty entries', () => {
      it('should remove them from attributes', () => {
        expect(populatePackageAttributesFromForm({
          customAltNames: [{
            altName: '',
          }],
        })).toEqual({
          customAltNames: [],
        });
      });
    });

    describe('when some entries are just empty strings with spaces', () => {
      it('should not add them to attributes', () => {
        expect(populatePackageAttributesFromForm({
          customAltNames: [{
            altName: '           ',
          }],
        })).toEqual({
          customAltNames: [],
        });
      });
    });

    describe('when entries are non-empty', () => {
      it('should add them to attributes', () => {
        expect(populatePackageAttributesFromForm({
          customAltNames: [{
            altName: 'name',
          }],
        })).toEqual({
          customAltNames: [{
            altName: 'name',
          }],
        });
      });
    });
  });

  describe('customDisplayName', () => {
    describe('when it is an empty string with spaces', () => {
      it('should not add it to attributes', () => {
        expect(populatePackageAttributesFromForm({
          customDisplayName: '             ',
        })).toEqual({});
      });
    });

    describe('when it is not empty', () => {
      it('should add it to attributes', () => {
        expect(populatePackageAttributesFromForm({
          customDisplayName: 'display name',
        })).toEqual({
          customDisplayName: 'display name',
        });
      });
    });
  });

  describe('customDescription', () => {
    describe('when it is an empty string with spaces', () => {
      it('should not add it to attributes', () => {
        expect(populatePackageAttributesFromForm({
          customDescription: '             ',
        })).toEqual({});
      });
    });

    describe('when it is not empty', () => {
      it('should add it to attributes', () => {
        expect(populatePackageAttributesFromForm({
          customDescription: 'description',
        })).toEqual({
          customDescription: 'description',
        });
      });
    });
  });

  describe('customCoverages', () => {
    describe('when the value is empty', () => {
      it('should not add it to attributes', () => {
        expect(populatePackageAttributesFromForm({
          customCoverages: [],
        })).toEqual({});
      });
    });

    describe('when it is not empty', () => {
      it('should format dates and add them to attributes', () => {
        expect(populatePackageAttributesFromForm({
          customCoverages: [{
            beginCoverage: '02/01/2026',
            endCoverage: '03/01/2026',
          }]
        })).toEqual(expect.objectContaining({
          customCoverage: {
            beginCoverage: '2026-02-01',
            endCoverage: '2026-03-01',
          },
        }));
      });
    });
  });

  describe('accessTypeId', () => {
    describe('when it is an empty access type value', () => {
      it('should set it as null in attributes', () => {
        expect(populatePackageAttributesFromForm({
          accessTypeId: accessTypes.ACCESS_TYPE_NONE_ID,
        })).toEqual({
          accessTypeId: null
        });
      });
    });

    describe('when it is not empty', () => {
      it('should add it to attributes', () => {
        expect(populatePackageAttributesFromForm({
          accessTypeId: 'test',
        })).toEqual({
          accessTypeId: 'test',
        });
      });
    });
  });
});
