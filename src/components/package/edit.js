import React from 'react';
import PropTypes from 'prop-types';
import EditManaged from './edit-managed';
import EditCustom from './edit-custom';

export default function PackageEdit({ model, ...props }) {
  let View = model.isCustom ? EditCustom : EditManaged;

  return (
    <View
      model={model}
      {...props}
    />
  );
}

PackageEdit.propTypes = {
  model: PropTypes.object.isRequired
};
