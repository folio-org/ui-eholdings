import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import PackageShowPage from '../interactors/package-show';
import TitleShowPage from '../interactors/title-show';

describe('DetailsView', () => {
  setupApplication();
  beforeEach(function () {
    this.server.loadFixtures();
  });

  describe('visiting a package with paged resources', () => {
    beforeEach(function () {
      return this.visit('/eholdings/packages/paged_pkg', () => {
        expect(PackageShowPage.isPresent).to.be.true;
      });
    });

    it('has a list that fills the container', () => {
      expect(PackageShowPage.titleContainerHeight).to.equal(PackageShowPage.detailPaneContentsHeight);
    });

    it('has a list that is not scrollable', () => {
      expect(PackageShowPage.titleQueryListOverFlowY).to.eq('hidden');
    });

    describe('scrolling to the bottom of the container', () => {
      beforeEach(() => {
        return PackageShowPage
          .detailsPaneScrollTop(PackageShowPage.detailsPaneContentScrollHeight);
      });

      it('disables scrolling the container', () => {
        expect(PackageShowPage.detailsPaneContentsOverFlowY).to.eq('hidden');
      });

      it('enables scrolling the list', () => {
        expect(PackageShowPage.titleQueryListOverFlowY).to.eq('auto');
      });

      describe('scrolling up to the top of the list', () => {
        beforeEach(() => {
          return PackageShowPage.scrollToTitleOffset(0);
        });

        it('enables scrolling the container', () => {
          expect(PackageShowPage.detailsPaneContentsOverFlowY).to.eq('auto');
        });

        it('disables scrolling the list', () => {
          expect(PackageShowPage.titleQueryListOverFlowY).to.eq('hidden');
        });
      });

      describe('scrolling part of the way up the title list', () => {
        beforeEach(() => {
          return PackageShowPage.scrollToTitleOffset(10);
        });

        it('disables scrolling the container', () => {
          expect(PackageShowPage.detailsPaneContentsOverFlowY).to.eq('hidden');
        });

        it('enables scrolling the list', () => {
          expect(PackageShowPage.titleQueryListOverFlowY).to.eq('auto');
        });
      });

      describe('scrolling up with the mousewheel to the top of the title list', () => {
        beforeEach(() => {
          return PackageShowPage.detailPaneMouseWheel();
        });

        it('enables scrolling the container', () => {
          expect(PackageShowPage.detailsPaneContentsOverFlowY).to.eq('auto');
        });

        it('disables scrolling the list', () => {
          expect(PackageShowPage.titleQueryListOverFlowY).to.eq('hidden');
        });
      });
    });

    describe('then visiting a title page with few resources', () => {
      beforeEach(function () {
        let title = this.server.create('title');

        return this.visit(`/eholdings/titles/${title.id}`, () => {
          expect(TitleShowPage.$root).to.exist;
        });
      });

      it('has a list that does not fill the container', () => {
        expect(TitleShowPage.packageContainerHeight).to.be.lt(TitleShowPage.detailsPaneContentsHeight);
      });

      describe('scrolling to the bottom of the container', () => {
        beforeEach(() => {
          TitleShowPage.detailsPaneScrollTop(TitleShowPage.detailsPaneScrollsHeight);
        });

        it.always('does not disable scrolling the container', () => {
          expect(TitleShowPage.detailsPaneContentsOverFlowY).to.eq('auto');
        });
      });
    });
  });
});
