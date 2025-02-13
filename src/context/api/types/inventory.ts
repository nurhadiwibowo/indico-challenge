// Generated from inventory.ts

import { z } from 'zod';
import inventory from '../schema/inventory';

export default interface InventorySchemaTypes {
    GetInventoryList: {
      Response: z.infer<typeof inventory.GetInventoryList.Response>;
    };

    PostAddInventory: {
      Response: z.infer<typeof inventory.PostAddInventory.Response>;
      Request: z.infer<typeof inventory.PostAddInventory.Request>;
    };

    PutEditInventor: {
      Response: z.infer<typeof inventory.PutEditInventor.Response>;
      Request: z.infer<typeof inventory.PutEditInventor.Request>;
    };
}