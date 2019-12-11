import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import PackageShowPage from '../interactors/package-show';
import TitleShowPage from '../interactors/title-show';

describe('DetailsView', () => {
  setupApplication();
  beforeEach(async function () {
    await this.server.loadFixtures();
  });

  describe('visiting a package with paged resources', () => {
    beforeEach(async function () {
      await this.visit('/eholdings/packages/paged_pkg');
      await PackageShowPage.whenLoaded();
    });

    it('has a list that fills the container', () => {
      expect(PackageShowPage.titleContainerHeight).to.equal(PackageShowPage.detailPaneContentsHeight);
    });

    it('has a list that is not scrollable', () => {
      expect(PackageShowPage.titleQueryListOverFlowY).to.eq('hidden');
    });

    describe('scrolling', () => {
      beforeEach(async () => {
        await PackageShowPage.whenLoaded();
      });

      describe('to the bottom of the container', () => {
        beforeEach(async () => {
          await PackageShowPage
            .detailsPaneScrollTop(PackageShowPage.detailsPaneContentScrollHeight);
        });

        it('disables scrolling the container', () => {
          expect(PackageShowPage.detailsPaneContentsOverFlowY).to.eq('hidden');
        });

        it('enables scrolling the list', () => {
          expect(PackageShowPage.titleQueryListOverFlowY).to.eq('auto');
        });

        describe('up to the top of the list', () => {
          beforeEach(async () => {
            await PackageShowPage.scrollToTitleOffset(0);
          });

          it('enables scrolling the container', () => {
            expect(PackageShowPage.detailsPaneContentsOverFlowY).to.eq('auto');
          });

          it('disables scrolling the list', () => {
            expect(PackageShowPage.titleQueryListOverFlowY).to.eq('hidden');
          });
        });

        describe('part of the way up the title list', () => {
          beforeEach(async () => {
            await PackageShowPage.scrollToTitleOffset(10);
          });

          it('disables scrolling the container', () => {
            expect(PackageShowPage.detailsPaneContentsOverFlowY).to.eq('hidden');
          });

          it('enables scrolling the list', () => {
            expect(PackageShowPage.titleQueryListOverFlowY).to.eq('auto');
          });
        });

        describe('up with the mousewheel to the top of the title list', () => {
          beforeEach(async () => {
            await PackageShowPage.detailPaneMouseWheel();
          });

          it('enables scrolling the container', () => {
            expect(PackageShowPage.detailsPaneContentsOverFlowY).to.eq('auto');
          });

          it('disables scrolling the list', () => {
            expect(PackageShowPage.titleQueryListOverFlowY).to.eq('hidden');
          });
        });
      });
    });

    describe('then visiting a title page with few resources', () => {
      beforeEach(async function () {
        const title = await this.server.create('title');

        await this.visit(`/eholdings/titles/${title.id}`);
        await TitleShowPage.whenLoaded();
      });

      it('has a list that does not fill the container', () => {
        expect(TitleShowPage.packageContainerHeight).to.be.lt(TitleShowPage.detailsPaneContentsHeight);
      });

      describe('scrolling to the bottom of the container', () => {
        beforeEach(async () => {
          await TitleShowPage.detailsPaneScrollTop(TitleShowPage.detailsPaneScrollsHeight);
        });

        it('does not disable scrolling the container', () => {
          expect(TitleShowPage.detailsPaneContentsOverFlowY).to.eq('auto');
        });
      });
    });
  });
});
