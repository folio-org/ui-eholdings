import { render } from '@folio/jest-config-stripes/testing-library/react';

import PackageHiddenLabel from './package-hidden-label';

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
    it('does not render when an empty argument is passed in', () => {
      const { queryByText } = render(<PackageHiddenLabel visibility={[]} id={id} />);

      expect(queryByText('ui-eholdings.hidden')).not.toBeInTheDocument();
    });

    it('does not render when all are visible', () => {
      const { queryByText } = render(<PackageHiddenLabel visibility={allVisible} id={id} />);

      expect(queryByText('ui-eholdings.hidden')).not.toBeInTheDocument();
    });

    it('does render when at least one is hidden', () => {
      const { getByText } = render(<PackageHiddenLabel visibility={allHidden} id={id} />);

      expect(getByText('ui-eholdings.hidden')).toBeInTheDocument();
    });
  });

  describe('tooltip messages', () => {
    it('renders correctly for one hidden category', () => {
      const { getByRole } = render(<PackageHiddenLabel visibility={[pfHidden, ftfVisible, marcVisible]} id={id} />);

      expect(getByRole('tooltip')).toHaveTextContent('ui-eholdings.hiddenSingleCategory');
    });

    it('renders correctly for two hidden categories', () => {
      const { getByRole } = render(<PackageHiddenLabel visibility={[pfHidden, ftfHidden, marcVisible]} id={id} />);

      expect(getByRole('tooltip')).toHaveTextContent('ui-eholdings.hiddenDualCategories');
    });

    it('renders correctly for three hidden categories', () => {
      const { getByRole } = render(<PackageHiddenLabel visibility={allHidden} id={id} />);

      expect(getByRole('tooltip')).toHaveTextContent('ui-eholdings.hiddenTripleCategories');
    });
  });
});
