import { z } from 'zod';

const GetInventoryListResponse = z.array(
  z.object({
    id: z.string(),
    item: z.string(),
    qty: z.number(),
    uom: z.string(),
    price_per_qty: z.number(),
  })
);

const PostAddInventoryResponse = z.object({});

const PostAddInventoryRequest = z.object({
  item: z.string(),
  qty: z.number(),
  uom: z.string(),
  price_per_qty: z.number(),
});

const PutEditInventoryResponse = z.object({});

const PutEditInventoryRequest = z.object({
  item: z.string(),
  qty: z.number(),
  uom: z.string(),
  price_per_qty: z.number(),
});

export default {
  GetInventoryList: { Response: GetInventoryListResponse },
  PostAddInventory: {
    Response: PostAddInventoryResponse,
    Request: PostAddInventoryRequest,
  },
  PutEditInventor: {
    Response: PutEditInventoryResponse,
    Request: PutEditInventoryRequest,
  },
};
