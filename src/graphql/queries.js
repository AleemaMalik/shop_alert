/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPriceDropItem = /* GraphQL */ `
  query GetPriceDropItem($id: ID!) {
    getPriceDropItem(id: $id) {
      id
      username
      storeName
      itemName
      initialPrice
      currentPrice
      createdAt
      updatedAt
    }
  }
`;
export const listPriceDropItems = /* GraphQL */ `
  query ListPriceDropItems(
    $filter: ModelPriceDropItemFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPriceDropItems(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        username
        storeName
        itemName
        initialPrice
        currentPrice
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getRestockItem = /* GraphQL */ `
  query GetRestockItem($id: ID!) {
    getRestockItem(id: $id) {
      id
      username
      storeName
      itemName
      inStock
      createdAt
      updatedAt
    }
  }
`;
export const listRestockItems = /* GraphQL */ `
  query ListRestockItems(
    $filter: ModelRestockItemFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRestockItems(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        username
        storeName
        itemName
        inStock
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getPost = /* GraphQL */ `
  query GetPost($id: ID!) {
    getPost(id: $id) {
      id
      title
      blog
      comments
      createdAt
      updatedAt
    }
  }
`;
export const listPosts = /* GraphQL */ `
  query ListPosts(
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPosts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        blog
        comments
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getComment = /* GraphQL */ `
  query GetComment($id: ID!) {
    getComment(id: $id) {
      id
      post
      content
      createdAt
      updatedAt
    }
  }
`;
export const listComments = /* GraphQL */ `
  query ListComments(
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listComments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        post
        content
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
