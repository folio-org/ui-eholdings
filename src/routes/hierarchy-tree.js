/**
 * Avatar: Basic Usage
 */

 import React, {
  Component,
} from 'react';

import { Form, Field } from 'react-final-form';

import { stripesConnect } from '@folio/stripes/core';

import {
  Pagination,
  Tree,
  TextField,
  Button,
} from '@folio/stripes/components';

import ProviderListItem from '../components/provider-list-item';
import PackageListItem from '../components/search-package-list-item';
import TitleListItem from '../components/title-list-item';

class HierarchyTree extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      search: '',
      page: 1,
    };
  }

  static manifest = Object.freeze({
    providers: {
      type: 'okapi',
      records: 'data',
      path: 'eholdings/providers',
      headers: {
        'accept': 'application/vnd.api+json',
      },
      fetch: false,
      accumulate: true,
      GET: {},
    },
    packages: {
      type: 'okapi',
      records: 'data',
      headers: {
        'accept': 'application/vnd.api+json',
      },
      fetch: false,
      accumulate: true,
      GET: {},
    },
    resources: {
      type: 'okapi',
      records: 'data',
      headers: {
        'accept': 'application/vnd.api+json',
      },
      fetch: false,
      accumulate: true,
      GET: {},
    },
  });

  fetchData(type, params) {
    return this.props.mutator[type].GET({
      ...params,
    });
  }

  handlePageChange = ({ selected }) => {
    this.setState({
      page: selected,
    }, () => this.fetchData('providers', {
      page: selected,
      q: this.state.search,
    }));
  };

  setChildren = (parentType, parentId, collection, items) => {
    const getChildrenCollection = (parentItem) => {
      if (parentItem.type !== parentType) {
        return this.setChildren(parentType, parentId, parentItem.children, items);
      }

      if (parentItem.id !== parentId) {
        return parentItem.children;
      }

      return items;
    };

    return collection.map(parentItem => ({
      ...parentItem,
      children: getChildrenCollection(parentItem),
    }));
  };

  handleToggleProviders = (open, item) => {
    if (!open || item.children.length) {
      return;
    }

    this.fetchData('packages', { path: `eholdings/providers/${item.id}/packages` })
      .then(packages => {
        const formattedPackages = packages.map(_package => ({
          ..._package,
          ..._package.attributes,
          children: [],
        }));

        this.setState(state => ({
          data: this.setChildren('providers', item.id, state.data, formattedPackages),
        }));
      });
  };

  handleTogglePackages = (open, item) => {
    if (!open || item.children.length) {
      return;
    }

    this.fetchData('resources', { path: `eholdings/packages/${item.id}/resources` })
      .then(resources => {
        const formattedResources = resources.map(resource => ({
          ...resource,
          ...resource.attributes,
        }));

        this.setState(state => ({
          data: this.setChildren('packages', item.id, state.data, formattedResources),
        }));
      });
  };

  onSearch = ({ q }) => {
    this.props.mutator.providers.GET({
      params: {
        q,
        page: this.state.page,
      },
    }).then(providers => {
      this.setState({
        data: providers.map(provider => ({
          ...provider,
          ...provider.attributes,
          children: [],
        })),
      });
    });
  };

  render() {
    return (
      <Form
        onSubmit={this.onSearch}
        render={({ handleSubmit }) => ((
          <>
            <form onSubmit={handleSubmit}>
              <Field
                name="q"
                component={TextField}
                type="text"
              />
              <Button type="submit">Search</Button>
            </form>
            <Tree
              treeData={this.state.data}
              levelMapping={{
                providers: (item) => (
                  <ProviderListItem
                    item={item}
                    link={item && {
                      pathname: `/eholdings/providers/${item.id}`
                    }}
                    shouldFocus={item}
                  />
                ),
                packages: (item) => (
                  <PackageListItem
                    item={item}
                    link={item && {
                      pathname: `/eholdings/packages/${item.id}`
                    }}
                    shouldFocus={item}
                    showProviderName
                    showTitleCount
                    showSelectedCount
                  />
                ),
                resources: (item) => (
                  <TitleListItem
                    showPublisherAndType
                    showIdentifiers
                    showContributors
                    item={item}
                    link={item && {
                      pathname: `/eholdings/titles/${item.id}`
                    }}
                    shouldFocus={item}
                  />
                )
              }}
              levelToggle={{
                providers: this.handleToggleProviders,
                packages: this.handleTogglePackages,
              }}
              levelToggleAriaLabel={{
                providers: 'See provider\'s package list',
                packages: 'See package\'s title list',
              }}
            />
            <Pagination
              pageCount={100}
              onPageChange={this.handlePageChange}
            />
          </>
        ))}
      />
    );
  }
}

export default stripesConnect(HierarchyTree);
