import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from '@firebase/firestore';
import { db } from 'src/utils/firebase/firestore';
import inventory from '../schema/inventory';
import InventorySchemaTypes from '../types/inventory';

export const getInventoryList = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'inventory'));
    const data = querySnapshot.docs.map((document) => ({ id: document.id, ...document.data() }));

    const parseResult = inventory.GetInventoryList.Response.safeParse(data);
    console.log({ getInventoryList: data });
    if (!parseResult.success) {
      console.warn('Response schema mismatch:', parseResult.error.errors);
      return [];
    }

    return parseResult.data;
  } catch (error) {
    console.error('Failed to fetch inventory:', error);
    return [];
  }
};

export const addInventory = async (data: InventorySchemaTypes['PostAddInventory']['Request']) => {
  try {
    const parseResult = inventory.PostAddInventory.Request.safeParse(data);

    if (!parseResult.success) {
      console.warn('Request schema mismatch:', parseResult.error.errors);
      throw new Error('Invalid request data');
    }

    const docRef = await addDoc(collection(db, 'inventory'), parseResult.data);
    const response = { id: docRef.id, ...parseResult.data };

    const responseResult = inventory.PostAddInventory.Response.safeParse(response);

    if (!responseResult.success) {
      console.warn('Response schema mismatch:', responseResult.error.errors);
    }

    return responseResult.success ? responseResult.data : response;
  } catch (error) {
    console.error('Failed to add inventory:', error);
    throw error;
  }
};

export const updateInventory = async (
  id: string,
  data: InventorySchemaTypes['PutEditInventor']['Response']
) => {
  try {
    const parseResult = inventory.PutEditInventor.Request.safeParse(data);

    if (!parseResult.success) {
      console.warn('Request schema mismatch:', parseResult.error.errors);
      throw new Error('Invalid request data');
    }

    const docRef = doc(db, 'inventory', id);
    await updateDoc(docRef, parseResult.data);
    const response = { id, ...parseResult.data };

    const responseResult = inventory.PutEditInventor.Response.safeParse(response);

    if (!responseResult.success) {
      console.warn('Response schema mismatch:', responseResult.error.errors);
    }

    return responseResult.success ? responseResult.data : response;
  } catch (error) {
    console.error('Failed to update inventory:', error);
    throw error;
  }
};

export const deleteInventory = async (id: string) => {
  try {
    const docRef = doc(db, 'inventory', id);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error('Failed to delete inventory:', error);
    throw error;
  }
};
