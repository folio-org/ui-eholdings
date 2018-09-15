import React from 'react';
import PropTypes from 'prop-types';

import ManagedPackageEdit from './edit-managed';
import CustomPackageEdit from './edit-custom';

export default function PackageEdit({ model, provider, ...props }) {
  let initialValues = {};
  let View;

  if (model.isCustom) {
    View = CustomPackageEdit;
    initialValues = {
      name: model.name,
      contentType: model.contentType,
      isSelected: model.isSelected,
      customCoverages: [{
        beginCoverage: model.customCoverage.beginCoverage,
        endCoverage: model.customCoverage.endCoverage
      }],
      proxyId: model.proxy.id,
      isVisible: !model.visibilityData.isHidden
    };
  } else {
    View = ManagedPackageEdit;
    initialValues = {
      isSelected: model.isSelected,
      customCoverages: [{
        beginCoverage: model.customCoverage.beginCoverage,
        endCoverage: model.customCoverage.endCoverage
      }],
      proxyId: model.proxy.id,
      providerTokenValue: provider.providerToken.value,
      packageTokenValue: model.packageToken.value,
      isVisible: !model.visibilityData.isHidden,
      allowKbToAddTitles: model.allowKbToAddTitles
    };
  }

  return (
    <View
      model={model}
      provider={provider}
      initialValues={initialValues}
      {...props}
    />
  );
}

PackageEdit.propTypes = {
  model: PropTypes.object.isRequired,
  provider: PropTypes.object.isRequired
};
