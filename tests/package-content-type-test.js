import { expect } from 'chai';
import { describe, beforeEach, it } from '@bigtest/mocha';

import { describeApplication } from './helpers';
import PackageShowPage from './pages/package-show';

describeApplication('PackageContentType', () => {
  let provider,
    providerPackage;

  beforeEach(function () {
    provider = this.server.create('provider', {
      name: 'Cool Provider'
    });

    providerPackage = this.server.create('package', {
      provider,
      name: 'Cool Package',
      contentType: 'Unknown',
      isSelected: true,
      isCustom: true
    });
  });

  describe('visiting the package edit page with an unknown content type', () => {
    beforeEach(function () {
      return this.visit(`/eholdings/packages/${providerPackage.id}`, () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    it('displays with content type of unknown', () => {
      expect(PackageShowPage.customContentType).to.equal('Unknown');
    });
  });

  describe('visiting the package edit page with a known content type', () => {
    beforeEach(function () {
      providerPackage.contentType = 'E-Book';
      return this.visit(`/eholdings/packages/${providerPackage.id}`, () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    it('displays known content type', () => {
      expect(PackageShowPage.customContentType).to.equal('E-Book');
    });


    describe('clicking the edit icon', () => {
      beforeEach(() => {
        return PackageShowPage.clickContentTypeEdit();
      });

      it('button is disabled with no change', () => {
        expect(PackageShowPage.isContentTypeSaveDisabled).to.be.true;
      });

      it('displays the select field', () => {
        expect(PackageShowPage.hasContentTypeField).to.be.true;
      });

      describe('changing the value of content type', () => {
        beforeEach(() => {
          return PackageShowPage.selectContentType('E-Journal');
        });

        it('enables the save button', () => {
          expect(PackageShowPage.isContentTypeSaveDisabled).to.be.false;
        });

        describe('clicking the cancel button', () => {
          beforeEach(() => {
            return PackageShowPage.clickContentTypeCancel();
          });

          it('removes the select field', () => {
            expect(PackageShowPage.hasContentTypeField).to.be.false;
          });
        });
        describe('clicking the save button', () => {
          beforeEach(() => {
            return PackageShowPage.clickContentTypeSave();
          });

          it('shows the new content type', () => {
            expect(PackageShowPage.customContentType).to.equal('E-Journal');
          });

          it('removes the select field', () => {
            expect(PackageShowPage.hasContentTypeField).to.be.false;
          });
        });
      });
    });
  });
});
