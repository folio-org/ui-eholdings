import React from 'react';
import PropTypes from 'prop-types';
import EditManaged from './edit-managed';
import EditCustom from './edit-custom';

export default function ResourceEdit({ model, ...props }) {
  let View = model.isTitleCustom ? EditCustom : EditManaged;

  return (
    <View
      model={model}
      {...props}
    />
  );
}

ResourceEdit.propTypes = {
  model: PropTypes.object.isRequired
};
