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

  // updateTitles function needs fresh package model selection status to be able to stop or keep
  // polling package titles data on an interval
  // intervals are quite difficult to manage with hooks - dependencies can change at unpredictable intervals
  // and when they do - we need to clear a current interval and start a new one, and the timings get very messy
  // instead, we'll just keep a reference to a package model and this way we can get fresh package data
  // from inside of the interval's closure
  const packageModelRef = useRef(packageModel);

  useEffect(() => {
    packageModelRef.current = packageModel;
  }, [packageModel]);

  useEffect(() => {
    packageTitlesRef.current = packageTitles;
  }, [packageTitles]);

  useEffect(() => {
    return () => clearInterval(interval.current);
  }, []);

  const updateTitles = () => {
    setIsTitlesUpdating(true);

    clearInterval(interval.current);

    interval.current = window.setInterval(() => {
      const arePackageTitlesUpdated = packageTitlesRef.current.items
        .every(item => item.attributes.isSelected === packageModelRef.current?.isSelected);

      if (arePackageTitlesUpdated) {
        window.clearInterval(interval.current);

        setIsTitlesUpdating(false);
      } else if (!packageTitlesRef.current.isLoading) {
        getPackageTitles({ packageId: packageModelRef.current.id, params: queryParams });
      }
    }, INTERVAL_BEFORE_CHECK_FOR_AN_UPDATE);
  };

  return {
    updateTitles,
  };
};
