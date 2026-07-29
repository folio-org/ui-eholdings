import {
  useEffect,
  useRef,
} from 'react';

import { INTERVAL_BEFORE_CHECK_FOR_AN_UPDATE } from '../../constants';

export const useUpdatePackageTitlesSelection = ({
  queryParams,
  packageModel,
  setIsTitlesUpdating,
  packageTitles,
  getPackageTitles,
}) => {
  const interval = useRef();

  // the callback inside window.setInterval keeps the old reference to packageTitles in its closure,
  // so we need to copy over this hook prop to a ref, so that interval callback can access fresh data
  // packageModel is mutated in PackageShowRoute anyways, and we will change that later, but for now we can
  // rely on this mutation to always have fresh data in closures
  const packageTitlesRef = useRef(packageTitles);

  useEffect(() => {
    return () => clearInterval(interval.current);
  }, []);

  useEffect(() => {
    packageTitlesRef.current = packageTitles;
  }, [packageTitles]);

  const updateTitles = () => {
    setIsTitlesUpdating(true);

    clearInterval(interval.current);

    interval.current = window.setInterval(() => {
      const arePackageTitlesUpdated = packageTitlesRef.current.items
        .every(item => item.attributes.isSelected === packageModel.isSelected);

      if (arePackageTitlesUpdated) {
        window.clearInterval(interval.current);

        setIsTitlesUpdating(false);
      } else if (!packageTitlesRef.current.isLoading) {
        getPackageTitles({ packageId: packageModel.id, params: queryParams });
      }
    }, INTERVAL_BEFORE_CHECK_FOR_AN_UPDATE);
  };

  return {
    updateTitles,
  };
};
