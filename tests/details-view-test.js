import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { describeApplication } from './helpers';
import PackageShowPage from './pages/bigtest/package-show';
import TitleShowPage from './pages/bigtest/title-show';

describeApplication('DetailsView', () => {
  beforeEach(function () {
    this.server.loadFixtures();
  });

  describe('visiting a package with paged customer-resources', () => {
    beforeEach(function () {
      return this.visit('/eholdings/packages/paged_pkg', () => {
        expect(PackageShowPage.exist).to.be.true;
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
        return PackageShowPage.interaction
          .once(() => PackageShowPage.titlesHaveLoaded)
          .detailsPaneScrollTop(PackageShowPage.detailsPaneContentScrollHeight);
      });

      it('disables scrolling the container', () => {
        expect(PackageShowPage.detailsPaneContentsOverFlowY).to.eq('hidden');
      });

      it('enables scrolling the list', () => {
        expect(PackageShowPage.titleQueryListOverFlowY).to.eq('auto');
      });

      describe('scrolling up from the list', () => {
        beforeEach(() => {
          return PackageShowPage.interaction
            .once(() => PackageShowPage.detailsPaneContentsOverFlowY === 'hidden')
            .scrollToTitleOffset(0);
        });

        it('enables scrolling the container', () => {
          expect(PackageShowPage.detailsPaneContentsOverFlowY).to.eq('auto');
        });

        it('disables scrolling the list', () => {
          expect(PackageShowPage.titleQueryListOverFlowY).to.eq('hidden');
        });
      });

      describe('scrolling up from the container', () => {
        beforeEach(() => {
          return PackageShowPage.interaction
            .once(() => PackageShowPage.detailsPaneContentsOverFlowY === 'hidden')
            .scrollToTitleOffset(10);
        });

        it('enables scrolling the container', () => {
          expect(PackageShowPage.detailsPaneContentsOverFlowY).to.eq('auto');
        });

        it('disables scrolling the list', () => {
          expect(PackageShowPage.titleQueryListOverFlowY).to.eq('hidden');
        });
      });

      describe('scrolling up with the mousewheel', () => {
        beforeEach(() => {
          return PackageShowPage.interaction
            .once(() => PackageShowPage.detailsPaneContentsOverFlowY === 'hidden')
            .detailPaneMouseWheel();
        });

        it('enables scrolling the container', () => {
          expect(PackageShowPage.detailsPaneContentsOverFlowY).to.eq('hidden');
        });

        it('disables scrolling the list', () => {
          expect(PackageShowPage.titleQueryListOverFlowY).to.eq('hidden');
        });
      });
    });

    describe('then visiting a title page with few customer-resources', () => {
      beforeEach(function () {
        let title = this.server.create('title');

        return PackageShowPage.interaction
          .once(() => PackageShowPage.titlesHaveLoaded)
          .do(() => {
            return this.visit(`/eholdings/titles/${title.id}`, () => {
              expect(TitleShowPage.$root).to.exist;
            });
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
