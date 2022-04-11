import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





type PriceDropItemMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type RestockItemMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type PostMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type CommentMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class PriceDropItem {
  readonly id: string;
  readonly username: string;
  readonly storeName: string;
  readonly itemName: string;
  readonly initialPrice: number;
  readonly currentPrice: number;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<PriceDropItem, PriceDropItemMetaData>);
  static copyOf(source: PriceDropItem, mutator: (draft: MutableModel<PriceDropItem, PriceDropItemMetaData>) => MutableModel<PriceDropItem, PriceDropItemMetaData> | void): PriceDropItem;
}

export declare class RestockItem {
  readonly id: string;
  readonly username: string;
  readonly storeName: string;
  readonly itemName: string;
  readonly inStock: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<RestockItem, RestockItemMetaData>);
  static copyOf(source: RestockItem, mutator: (draft: MutableModel<RestockItem, RestockItemMetaData>) => MutableModel<RestockItem, RestockItemMetaData> | void): RestockItem;
}

export declare class Post {
  readonly id: string;
  readonly title: string;
  readonly blog: string;
  readonly comments: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Post, PostMetaData>);
  static copyOf(source: Post, mutator: (draft: MutableModel<Post, PostMetaData>) => MutableModel<Post, PostMetaData> | void): Post;
}

export declare class Comment {
  readonly id: string;
  readonly post: string;
  readonly content: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Comment, CommentMetaData>);
  static copyOf(source: Comment, mutator: (draft: MutableModel<Comment, CommentMetaData>) => MutableModel<Comment, CommentMetaData> | void): Comment;
}