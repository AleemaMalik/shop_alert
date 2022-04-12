/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createPriceDropItem = /* GraphQL */ `
  mutation CreatePriceDropItem(
    $input: CreatePriceDropItemInput!
    $condition: ModelPriceDropItemConditionInput
  ) {
    createPriceDropItem(input: $input, condition: $condition) {
      id
      username
      itemURL
      storeName
      itemName
      initialPrice
      currentPrice
      createdAt
      updatedAt
    }
  }
`;
export const updatePriceDropItem = /* GraphQL */ `
  mutation UpdatePriceDropItem(
    $input: UpdatePriceDropItemInput!
    $condition: ModelPriceDropItemConditionInput
  ) {
    updatePriceDropItem(input: $input, condition: $condition) {
      id
      username
      itemURL
      storeName
      itemName
      initialPrice
      currentPrice
      createdAt
      updatedAt
    }
  }
`;
export const deletePriceDropItem = /* GraphQL */ `
  mutation DeletePriceDropItem(
    $input: DeletePriceDropItemInput!
    $condition: ModelPriceDropItemConditionInput
  ) {
    deletePriceDropItem(input: $input, condition: $condition) {
      id
      username
      itemURL
      storeName
      itemName
      initialPrice
      currentPrice
      createdAt
      updatedAt
    }
  }
`;
export const createRestockItem = /* GraphQL */ `
  mutation CreateRestockItem(
    $input: CreateRestockItemInput!
    $condition: ModelRestockItemConditionInput
  ) {
    createRestockItem(input: $input, condition: $condition) {
      id
      username
      itemURL
      storeName
      itemName
      inStock
      createdAt
      updatedAt
    }
  }
`;
export const updateRestockItem = /* GraphQL */ `
  mutation UpdateRestockItem(
    $input: UpdateRestockItemInput!
    $condition: ModelRestockItemConditionInput
  ) {
    updateRestockItem(input: $input, condition: $condition) {
      id
      username
      itemURL
      storeName
      itemName
      inStock
      createdAt
      updatedAt
    }
  }
`;
export const deleteRestockItem = /* GraphQL */ `
  mutation DeleteRestockItem(
    $input: DeleteRestockItemInput!
    $condition: ModelRestockItemConditionInput
  ) {
    deleteRestockItem(input: $input, condition: $condition) {
      id
      username
      itemURL
      storeName
      itemName
      inStock
      createdAt
      updatedAt
    }
  }
`;
export const createPost = /* GraphQL */ `
  mutation CreatePost(
    $input: CreatePostInput!
    $condition: ModelPostConditionInput
  ) {
    createPost(input: $input, condition: $condition) {
      id
      title
      blog
      comments
      createdAt
      updatedAt
    }
  }
`;
export const updatePost = /* GraphQL */ `
  mutation UpdatePost(
    $input: UpdatePostInput!
    $condition: ModelPostConditionInput
  ) {
    updatePost(input: $input, condition: $condition) {
      id
      title
      blog
      comments
      createdAt
      updatedAt
    }
  }
`;
export const deletePost = /* GraphQL */ `
  mutation DeletePost(
    $input: DeletePostInput!
    $condition: ModelPostConditionInput
  ) {
    deletePost(input: $input, condition: $condition) {
      id
      title
      blog
      comments
      createdAt
      updatedAt
    }
  }
`;
export const createComment = /* GraphQL */ `
  mutation CreateComment(
    $input: CreateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    createComment(input: $input, condition: $condition) {
      id
      post
      content
      createdAt
      updatedAt
    }
  }
`;
export const updateComment = /* GraphQL */ `
  mutation UpdateComment(
    $input: UpdateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    updateComment(input: $input, condition: $condition) {
      id
      post
      content
      createdAt
      updatedAt
    }
  }
`;
export const deleteComment = /* GraphQL */ `
  mutation DeleteComment(
    $input: DeleteCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    deleteComment(input: $input, condition: $condition) {
      id
      post
      content
      createdAt
      updatedAt
    }
  }
`;
