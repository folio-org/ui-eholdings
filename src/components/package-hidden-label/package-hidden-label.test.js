import { render } from '@folio/jest-config-stripes/testing-library/react';

import { PackageHiddenLabel } from './package-hidden-label';

const CATEGORIES = {
  PF: 'PF',
  FTF: 'FTF',
  MARC: 'MARC',
};

const makeCategory = (category, hidden) => {
  return {
    category,
    hidden,
    reason: '',
  };
};

describe('Given PackageHiddenLabel', () => {
  const id = 'my-id';
  const pfVisible = makeCategory(CATEGORIES.PF, false);
  const pfHidden = makeCategory(CATEGORIES.PF, true);
  const ftfVisible = makeCategory(CATEGORIES.FTF, false);
  const ftfHidden = makeCategory(CATEGORIES.FTF, true);
  const marcVisible = makeCategory(CATEGORIES.MARC, false);
  const marcHidden = makeCategory(CATEGORIES.MARC, true);

  const allVisible = [pfVisible, ftfVisible, marcVisible];
  const allHidden = [pfHidden, ftfHidden, marcHidden];

  describe('basic rendering', () => {
    describe('when an empty argument is passed in', () => {
      it('does not render', () => {
        const { queryByText } = render(<PackageHiddenLabel visibility={[]} id={id} />);

        expect(queryByText('ui-eholdings.hidden')).not.toBeInTheDocument();
      });
    });

    describe('when all categories are visible', () => {
      it('does not render', () => {
        const { queryByText } = render(<PackageHiddenLabel visibility={allVisible} id={id} />);

        expect(queryByText('ui-eholdings.hidden')).not.toBeInTheDocument();
      });
    });

    describe('when at least one category is hidden', () => {
      it('does render', () => {
        const { getByText } = render(<PackageHiddenLabel visibility={allHidden} id={id} />);

        expect(getByText('ui-eholdings.hidden')).toBeInTheDocument();
      });
    });
  });

  describe('tooltip messages', () => {
    describe('when one category is hidden', () => {
      it('renders the appropriate message', () => {
        const { getByRole } = render(<PackageHiddenLabel visibility={[pfHidden, ftfVisible, marcVisible]} id={id} />);

        expect(getByRole('tooltip')).toHaveTextContent('ui-eholdings.hiddenSingleCategory');
      });
    });

    describe('when two categories are hidden', () => {
      it('renders the appropriate message', () => {
        const { getByRole } = render(<PackageHiddenLabel visibility={[pfHidden, ftfHidden, marcVisible]} id={id} />);

        expect(getByRole('tooltip')).toHaveTextContent('ui-eholdings.hiddenDualCategories');
      });
    });

    describe('when three categories are hidden', () => {
      it('renders the appropriate message', () => {
        const { getByRole } = render(<PackageHiddenLabel visibility={allHidden} id={id} />);

        expect(getByRole('tooltip')).toHaveTextContent('ui-eholdings.hiddenTripleCategories');
      });
    });
  });
});
