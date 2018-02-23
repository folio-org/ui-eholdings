/* global describe, beforeEach */
import { expect } from 'chai';
import it, { convergeOn } from './it-will';

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
        return convergeOn(() => {
          expect(PackageShowPage.titleList.length).to.be.gt(0);
        }).then(() => {
          PackageShowPage.$detailPaneContents.scrollTop(PackageShowPage.$detailPaneContents.prop('scrollHeight'));
        });
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
          return convergeOn(() => {
            expect(PackageShowPage.$detailPaneContents).to.have.css('overflow-y', 'hidden');
          }).then(() => {
            PackageShowPage.scrollToTitleOffset(0);
          });
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
          return convergeOn(() => {
            expect(PackageShowPage.$detailPaneContents).to.have.css('overflow-y', 'hidden');
          }).then(() => {
            PackageShowPage.$detailPaneContents.scrollTop(10);
          });
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
          return convergeOn(() => {
            expect(PackageShowPage.$detailPaneContents).to.have.css('overflow-y', 'hidden');
          }).then(() => {
            PackageShowPage.$detailPaneContents.get(0).dispatchEvent(
              new WheelEvent('wheel', { bubbles: true, deltaY: -1 })
            );
          });
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
        return convergeOn(() => {
          expect(PackageShowPage.titleList.length).to.be.gt(0);
        }).then(() => {
          return this.visit(`/eholdings/titles/${title.id}`, () => {
            expect(TitleShowPage.$root).to.exist;
          });
        });
      });

      it('has a list that does not fill the container', () => {
        expect(TitleShowPage.$packageContainer.height()).to.be.lt(TitleShowPage.$detailPaneContents.height());
      });

      describe('scrolling to the bottom of the container', () => {
        beforeEach(() => {
          TitleShowPage.$detailPaneContents.scrollTop(TitleShowPage.$detailPaneContents.prop('scrollHeight'));
        });

        it.still('does not disable scrolling the container', () => {
          expect(TitleShowPage.$detailPaneContents).to.have.css('overflow-y', 'auto');
        });
      });
    });
  });
});
