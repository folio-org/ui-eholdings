import React from 'react';
import PropTypes from 'prop-types';
import EditManagedTitle from './edit-managed-title';
import EditCustomTitle from './edit-custom-title';

export default function ResourceEdit({ model, ...props }) {
  let View = model.title.isTitleCustom ? EditCustomTitle : EditManagedTitle;

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
