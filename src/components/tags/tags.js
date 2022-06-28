import {
  uniq,
  difference,
  sortBy,
  clone,
} from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { MultiSelection } from '@folio/stripes/components';

const propTypes = {
  entityTags: PropTypes.arrayOf(PropTypes.string),
  model: PropTypes.object.isRequired,
  tags: PropTypes.arrayOf(PropTypes.object),
  updateEntityTags: PropTypes.func.isRequired,
  updateFolioTags: PropTypes.func.isRequired,
};

const Tags = ({
  entityTags,
  model,
  tags,
  updateEntityTags,
  updateFolioTags,
}) => {
  const formatTagUpdatePayload = (newModel) => {
    const tagData = {
      data: {
        type: 'tags',
        attributes: {
          name: newModel.name,
          tags: newModel.tags,
        },
      },
      id: newModel.id,
    };

    if (newModel.type === 'packages') {
      tagData.data.attributes.contentType = newModel.contentType;
    }

    return tagData;
  };

  // add tag to the list of entity tags
  const saveEntityTags = (newTags) => {
    const newModel = clone(model);

    newModel.tags = { tagList: sortBy(uniq([...newTags, ...entityTags])) };
    updateEntityTags(newModel.type, formatTagUpdatePayload(newModel), `${newModel.type}/${newModel.id}`);
  };

  // add tags to global list of tags
  const saveTags = (newTags) => {
    const newTag = difference(newTags, tags.map(t => t.label.toLowerCase()));

    if (!newTag.length) return;

    updateFolioTags({
      label: newTag[0],
      description: newTag[0],
    });
  };

  const onAdd = (newTags) => {
    saveEntityTags(newTags);
    saveTags(newTags);
  };

  const onRemove = (tag) => {
    const newModel = clone(model);

    const tagList = entityTags.filter(t => t !== tag);

    newModel.tags = { tagList };

    updateEntityTags(newModel.type, formatTagUpdatePayload(newModel), `${newModel.type}/${newModel.id}`);
  };

  const onChange = (newTags) => {
    const tagsList = [...entityTags];

    const newEntityTags = newTags.map(t => t.value);

    if (newTags.length < tagsList.length) {
      const tag = difference(tagsList, newEntityTags);

      onRemove(tag[0]);
    } else {
      onAdd(newEntityTags);
    }
  };

  const filterItems = (filter, list) => {
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
  };

  const addTag = ({ inputValue }) => {
    const tag = inputValue.replace(/\s|\|/g, '').toLowerCase();
    const newEntityTags = entityTags.concat(tag);

    onAdd(newEntityTags);
  };

  // eslint-disable-next-line react/prop-types
  const renderTag = ({ filterValue, exactMatch }) => {
    if (exactMatch || !filterValue) {
      return null;
    }

    return (
      <div>
        <FormattedMessage
          id="ui-eholdings.tags.addTagFor"
          values={{ filter: filterValue }}
        />
      </div>
    );
  };

  const getSortedDataOptions = () => {
    const dataOptions = tags
      .filter(tag => tag.label)
      .map(tag => {
        return {
          value: tag.label.toLowerCase(),
          label: tag.label.toLowerCase(),
        };
      });

    return sortBy(dataOptions, ['value']);
  };

  const getSortedTagList = () => {
    const tagsList = entityTags.map(tag => {
      return {
        value: tag.toLowerCase(),
        label: tag.toLowerCase(),
      };
    });

    return sortBy(tagsList, ['value']);
  };

  const addAction = {
    onSelect: addTag,
    render: renderTag,
  };

  const actions = [addAction];

  const labelId = 'multiselection-details-tags-label';

  return (
    <div data-test-eholdings-details-tags>
      <span className="sr-only" id={labelId}>
        <FormattedMessage id="stripes-smart-components.enterATag" />
      </span>
      <FormattedMessage id="stripes-smart-components.enterATag">
        {([placeholder]) => (
          <FormattedMessage id="stripes-smart-components.tagsTextArea">
            {([ariaLabel]) => (
              <MultiSelection
                placeholder={placeholder}
                aria-label={ariaLabel}
                ariaLabelledBy={labelId}
                actions={actions}
                filter={filterItems}
                emptyMessage=" "
                onChange={onChange}
                dataOptions={getSortedDataOptions()}
                value={getSortedTagList()}
              />
            )}
          </FormattedMessage>
        )}
      </FormattedMessage>
    </div>
  );
};

Tags.propTypes = propTypes;

export default Tags;
