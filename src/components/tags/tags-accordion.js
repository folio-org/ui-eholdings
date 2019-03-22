import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  FormattedNumber,
} from 'react-intl';
import {
  Accordion,
  Headline,
  Icon,
  Badge,
} from '@folio/stripes/components';
import {
  getEntityTags,
  getTagLabelsArr,
} from '../utilities';
import Tags from './tags';

export default class TagsAccordion extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    model: PropTypes.object.isRequired,
    onToggle: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    tagsModel: PropTypes.object.isRequired,
    updateEntityTags: PropTypes.func.isRequired,
    updateFolioTags: PropTypes.func.isRequired,
  };

  render() {
    const {
      id,
      model,
      onToggle,
      open,
      tagsModel,
      updateFolioTags,
      updateEntityTags

    } = this.props;

    return (
      <Accordion
        label={(
          <Headline
            size="large"
            tag="h3"
          >
            <FormattedMessage id="ui-eholdings.tags" />
          </Headline>
        )}
        open={open}
        id={id}
        onToggle={onToggle}
        displayWhenClosed={
          <Badge sixe='small'>
            <span>
              <FormattedNumber value={getEntityTags(model).length} />
            </span>
          </Badge>
        }
      >
        {(!tagsModel.request.isResolved || model.isLoading)
          ? <Icon icon="spinner-ellipsis" />
          : (
            <Tags
              updateEntityTags={updateEntityTags}
              updateFolioTags={updateFolioTags}
              model={model}
              tags={getTagLabelsArr(tagsModel)}
            />
          )
        }
      </Accordion>
    );
  }
}
