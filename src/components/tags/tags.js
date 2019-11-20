import {
  uniq,
  difference,
  sortBy,
} from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import SafeHTMLMessage from '@folio/react-intl-safe-html';
import { MultiSelection } from '@folio/stripes-components';

export default class Tags extends React.Component {
  static propTypes = {
    entityTags: PropTypes.arrayOf(PropTypes.string),
    model: PropTypes.object.isRequired,
    tags: PropTypes.arrayOf(PropTypes.object),
    updateEntityTags: PropTypes.func.isRequired,
    updateFolioTags: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.filterItems = this.filterItems.bind(this);
  }

  onAdd(tags) {
    this.saveEntityTags(tags);
    this.saveTags(tags);
  }

  formatTagUpdatePayload(model) {
    const tagData = {
      data: {
        type: 'tags',
        attributes: {
          name: model.name,
          tags: model.tags,
        },
      },
      id: model.id,
    };

    if (model.type === 'packages') {
      tagData.data.attributes.contentType = model.contentType;
    }

    return tagData;
  }

  onRemove = (tag) => {
    const {
      model,
      updateEntityTags,
      entityTags,
    } = this.props;
    const tagList = entityTags.filter(t => t !== tag);

    model.tags = { tagList };

    updateEntityTags(model.type, this.formatTagUpdatePayload(model), `${model.type}/${model.id}`);
  };

  // add tag to the list of entity tags
  saveEntityTags = (tags) => {
    const {
      model,
      updateEntityTags,
      entityTags,
    } = this.props;
    model.tags = { tagList: sortBy(uniq([...tags, ...entityTags])) };
    updateEntityTags(model.type, this.formatTagUpdatePayload(model), `${model.type}/${model.id}`);
  };

  // add tags to global list of tags
  saveTags(newTags) {
    const {
      tags,
      updateFolioTags,
    } = this.props;

    const newTag = difference(newTags, tags.map(t => t.label.toLowerCase()));

    if (!newTag.length) return;

    updateFolioTags({
      label: newTag[0],
      description: newTag[0],
    });
  }

  handleRemove = (tag) => {
    const {
      model,
      updateEntityTags,
      entityTags
    } = this.props;
    const tagList = entityTags.filter(t => t !== tag);

    model.tags = { tagList };

    updateEntityTags(model.type, this.formatTagUpdatePayload(model), `${model.type}/${model.id}`);
  };

  onChange(tags) {
    const tagsList = this.props.entityTags;

    const entityTags = tags.map(t => t.value);
    if (tags.length < tagsList.length) {
      const tag = difference(tagsList, tags.map(t => t.value));
      this.onRemove(tag[0]);
    } else {
      this.onAdd(entityTags);
    }
  }

  filterItems(filter, list) {
    if (!filter) {
      return { renderedItems: list };
    }

    const filtered = list.filter(item => item.value.match(new RegExp(filter, 'i')));
    const renderedItems = filtered.sort((tag1, tag2) => {
      const regex = new RegExp(`^${filter}`, 'i');
      const match1 = tag1.value.match(regex);
      const match2 = tag2.value.match(regex);
      if (match1) return -1;
      if (match2) return 1;

      return (tag1.value < tag2.value) ? -1 : 1;
    });

    return { renderedItems };
  }

  addTag = ({ inputValue }) => {
    const tag = inputValue.replace(/\s|\|/g, '').toLowerCase();
    const entityTags = this.props.entityTags.concat(tag);
    this.onAdd(entityTags);
  }

  renderTag = ({ filterValue, exactMatch }) => {
    if (exactMatch || !filterValue) {
      return null;
    }

    return (
      <div>
        <SafeHTMLMessage
          id="ui-eholdings.tags.addTagFor"
          values={{ filter: filterValue }}
        />
      </div>
    );
  }

  getSortedDataOptions = () => {
    const { tags = [] } = this.props;
    const dataOptions = tags.map(tag => {
      return {
        value: tag.label.toLowerCase(),
        label: tag.label.toLowerCase(),
      };
    });

    return sortBy(dataOptions, ['value']);
  }

  getSortedTagList = () => {
    const tagsList = this.props.entityTags.map(tag => {
      return {
        value: tag.toLowerCase(),
        label: tag.toLowerCase(),
      };
    });

    return sortBy(tagsList, ['value']);
  }

  render() {
    const addAction = { onSelect: this.addTag, render: this.renderTag };
    const actions = [addAction];

    return (
      <div data-test-eholdings-details-tags>
        <FormattedMessage id="stripes-smart-components.enterATag">
          {placeholder => (
            <FormattedMessage id="stripes-smart-components.tagsTextArea">
              {ariaLabel => (
                <MultiSelection
                  placeholder={placeholder}
                  aria-label={ariaLabel}
                  actions={actions}
                  filter={this.filterItems}
                  emptyMessage=" "
                  onChange={this.onChange}
                  dataOptions={this.getSortedDataOptions()}
                  value={this.getSortedTagList()}
                />
              )}
            </FormattedMessage>
          )}
        </FormattedMessage>
      </div>
    );
  }
}
