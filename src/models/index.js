// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { PriceDropItem, RestockItem, Post, Comment } = initSchema(schema);

export {
  PriceDropItem,
  RestockItem,
  Post,
  Comment
};