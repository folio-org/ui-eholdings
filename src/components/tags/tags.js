import {
  isEqual,
  uniq,
  difference,
  sortBy,
  get,
} from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import SafeHTMLMessage from '@folio/react-intl-safe-html';
import { MultiSelection } from '@folio/stripes-components';

export default class Tags extends React.Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    tags: PropTypes.arrayOf(PropTypes.object),
    updateEntityTags: PropTypes.func.isRequired,
    updateFolioTags: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.filterItems = this.filterItems.bind(this);
    this.state = { entityTags: [] };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const nextTags = get(nextProps, ['model', 'tags', 'tagList'], []);

    if (!isEqual(nextTags, prevState.entityTags)) {
      return { entityTags: nextTags };
    }

    return null;
  }

  onAdd(tags) {
    this.saveEntityTags(tags);
    this.saveTags(tags);
  }

  onRemove(tag) {
    const {
      model,
      updateEntityTags,
    } = this.props;
    const entityTags = get(model, ['tags', 'tagList'], []);
    const tagList = entityTags.filter(t => t !== tag);

    model.tags = { tagList };
    updateEntityTags(model);
  }

  // add tag to the list of entity tags
  saveEntityTags(tags) {
    const {
      model,
      updateEntityTags,
    } = this.props;
    const entityTags = get(model, ['tags', 'tagList'], []);

    model.tags = { tagList: sortBy(uniq([...tags, ...entityTags])) };
    updateEntityTags(model);
  }

  // add tags to global list of tags
  saveTags(newTags) {
    const {
      tags,
      updateFolioTags,
    } = this.props;

    const newTag = difference(newTags, tags.map(t => t.label.toLowerCase()));

    if (!newTag || !newTag.length) return;
    updateFolioTags({
      label: newTag[0],
      description: newTag[0],
    });
  }

  handleRemove(tag) {
    const {
      model,
      updateEntityTags,
    } = this.props;
    const entityTags = get(model, ['tags', 'tagList'], []);
    const tagList = entityTags.filter(t => (t !== tag));

    model.tags = { tagList };
    updateEntityTags(model);
  }


  onChange(tags) {
    const entityTags = tags.map(t => t.value);
    if (tags.length < this.state.entityTags.length) {
      const tag = difference(this.state.entityTags, tags.map(t => t.value));
      this.onRemove(tag[0]);
    } else {
      this.onAdd(entityTags);
    }

    this.setState({ entityTags });
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
    // eslint-disable-next-line react/no-access-state-in-setstate
    const entityTags = this.state.entityTags.concat(tag);
    this.setState({ entityTags });
    this.onAdd(entityTags);
  }

  renderTag = ({ filterValue, exactMatch }) => {
    if (exactMatch || !filterValue) {
      return null;
    } else {
      return (
        <div>
          <SafeHTMLMessage
            id="ui-eholdings.tags.addTagFor"
            values={{ filter: filterValue }}
          />
        </div>
      );
    }
  }

  render() {
    const { tags = [] } = this.props;
    const { entityTags } = this.state;
    const dataOptions = tags.map(t => ({ value: t.label.toLowerCase(), label: t.label.toLowerCase() }));
    const tagsList = entityTags.map(tag => ({ value: tag.toLowerCase(), label: tag.toLowerCase() }));
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
                  dataOptions={sortBy(dataOptions, ['value'])}
                  value={sortBy(tagsList, ['value'])}
                />
              )}
            </FormattedMessage>
          )}
        </FormattedMessage>
      </div>
    );
  }
}
