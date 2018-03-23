import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';
import Convergence from '@bigtest/convergence';

import { describeApplication } from './helpers';
import PackageShowPage from './pages/package-show';
import TitleShowPage from './pages/title-show';

describeApplication('DetailsView', () => {
  beforeEach(function () {
    this.server.loadFixtures();
  });

  describe('visiting a package with paged customer-resources', () => {
    beforeEach(function () {
      return this.visit('/eholdings/packages/paged_pkg', () => {
        expect(PackageShowPage.$root).to.exist;
      });
    });

    it('has a list that fills the container', () => {
      expect(PackageShowPage.$titleContainer.height()).to.equal(PackageShowPage.$detailPaneContents.height());
    });

    it('has a list that is not scrollable', () => {
      expect(PackageShowPage.$titleQueryList).to.have.css('overflow-y', 'hidden');
    });

    describe('scrolling to the bottom of the container', () => {
      beforeEach(() => {
        // converge on the titles being loaded
        return new Convergence()
          .once(() => expect(PackageShowPage.titleList.length).to.be.gt(0))
          .do(() => PackageShowPage.$detailPaneContents.scrollTop(PackageShowPage.$detailPaneContents.prop('scrollHeight')))
          .run();
      });

      it('disables scrolling the container', () => {
        expect(PackageShowPage.$detailPaneContents).to.have.css('overflow-y', 'hidden');
      });

      it('enables scrolling the list', () => {
        expect(PackageShowPage.$titleQueryList).to.have.css('overflow-y', 'auto');
      });

      describe('scrolling up from the list', () => {
        beforeEach(() => {
          // converge on the previous expected behavior first
          return new Convergence()
            .once(() => expect(PackageShowPage.$detailPaneContents).to.have.css('overflow-y', 'hidden'))
            .do(() => PackageShowPage.scrollToTitleOffset(0))
            .run();
        });

        it('enables scrolling the container', () => {
          expect(PackageShowPage.$detailPaneContents).to.have.css('overflow-y', 'auto');
        });

        it('disables scrolling the list', () => {
          expect(PackageShowPage.$titleQueryList).to.have.css('overflow-y', 'hidden');
        });
      });

      describe('scrolling up from the container', () => {
        beforeEach(() => {
          // converge on the previous expected behavior first
          return new Convergence()
            .once(() => expect(PackageShowPage.$detailPaneContents).to.have.css('overflow-y', 'hidden'))
            .do(() => PackageShowPage.$detailPaneContents.scrollTop(10))
            .run();
        });

        it('enables scrolling the container', () => {
          expect(PackageShowPage.$detailPaneContents).to.have.css('overflow-y', 'auto');
        });

        it('disables scrolling the list', () => {
          expect(PackageShowPage.$titleQueryList).to.have.css('overflow-y', 'hidden');
        });
      });

      describe('scrolling up with the mousewheel', () => {
        beforeEach(() => {
          // converge on the previous expected behavior first
          return new Convergence()
            .once(() => expect(PackageShowPage.$detailPaneContents).to.have.css('overflow-y', 'hidden'))
            .do(() => {
              PackageShowPage.$detailPaneContents.get(0).dispatchEvent(
                new WheelEvent('wheel', { bubbles: true, deltaY: -1 })
              );
            })
            .run();
        });

        it('enables scrolling the container', () => {
          expect(PackageShowPage.$detailPaneContents).to.have.css('overflow-y', 'auto');
        });

        it('disables scrolling the list', () => {
          expect(PackageShowPage.$titleQueryList).to.have.css('overflow-y', 'hidden');
        });
      });
    });

    describe('then visiting a title page with few customer-resources', () => {
      beforeEach(function () {
        let title = this.server.create('title');

        // converge on the previous page being loaded first
        return new Convergence()
          .once(() => expect(PackageShowPage.titleList.length).to.be.gt(0))
          .do(() => {
            return this.visit(`/eholdings/titles/${title.id}`, () => {
              expect(TitleShowPage.$root).to.exist;
            });
          })
          .run();
      });

      it('has a list that does not fill the container', () => {
        expect(TitleShowPage.$packageContainer.height()).to.be.lt(TitleShowPage.$detailPaneContents.height());
      });

      describe('scrolling to the bottom of the container', () => {
        beforeEach(() => {
          TitleShowPage.$detailPaneContents.scrollTop(TitleShowPage.$detailPaneContents.prop('scrollHeight'));
        });

        it.always('does not disable scrolling the container', () => {
          expect(TitleShowPage.$detailPaneContents).to.have.css('overflow-y', 'auto');
        });
      });
    });
  });
});
