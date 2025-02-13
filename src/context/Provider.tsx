import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { addInventory, getInventoryList, deleteInventory, updateInventory } from './api/firestore';
import InventorySchemaTypes from './api/types/inventory';

interface SectionProviderProps {
  children: ReactNode;
}

interface AppContextType {
  inventory: {
    meta: {
      status: 'idle' | 'error' | 'success' | 'loading';
      messages?: string;
    };
    data: InventorySchemaTypes['GetInventoryList']['Response'];
  };
  setInventory: Dispatch<SetStateAction<AppContextType['inventory']>>;
  getData: () => void;
  handleAddInventory: (data: InventorySchemaTypes['PostAddInventory']['Request']) => void;
  handleEditInventory: (
    id: string,
    data: InventorySchemaTypes['PutEditInventor']['Request']
  ) => void;
  handleDeleteInventory: (id: string) => void;
}

const AppContext = createContext<AppContextType>({
  inventory: {
    meta: {
      status: 'idle',
    },
    data: [],
  },
  setInventory: () => null,
  getData: () => null,
  handleAddInventory: () => null,
  handleEditInventory: () => null,
  handleDeleteInventory: () => null,
});

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within a SectionProvider');
  }
  return context;
};

/* eslint-disable react/prop-types */ // TODO: upgrade to latest eslint tooling
export const AppContextProvider: React.FC<SectionProviderProps> = ({ children }) => {
  const [inventory, setInventory] = useState<AppContextType['inventory']>({
    meta: {
      status: 'idle',
    },
    data: [],
  });

  const setLoading = () =>
    setInventory((prev) => ({
      ...prev,
      meta: { ...prev.meta, status: 'loading' },
    }));

  const setIdle = () =>
    setInventory((prev) => ({
      ...prev,
      meta: { ...prev.meta, status: 'idle' },
    }));

  const getData = useCallback(() => {
    setInventory((prev) => ({
      ...prev,
      meta: { ...prev.meta, status: 'loading' },
    }));
    setTimeout(() => {
      getInventoryList()
        .then((data) =>
          setInventory((prev) => ({
            ...prev,
            meta: {
              status: 'success',
            },
            data,
          }))
        )
        .catch((error) =>
          setInventory((prev) => ({
            ...prev,
            meta: {
              status: 'error',
              messages: error.messages,
            },
            data: [],
          }))
        );
    }, 500);
  }, []);

  const handleAddInventory = useCallback(
    async (data: InventorySchemaTypes['PostAddInventory']['Request']) => {
      try {
        setLoading();
        await addInventory(data);
        getData();
      } catch (error) {
        console.log({ error });
        setIdle()
      }
    },
    [getData]
  );

  const handleEditInventory = useCallback(
    async (id: string, data: InventorySchemaTypes['PutEditInventor']['Request']) => {
      try {
        setLoading();
        await updateInventory(id, data);
        getData();
      } catch (error) {
        console.log({ error });
        setIdle()
      }
    },
    [getData]
  );

  const handleDeleteInventory = useCallback(
    async (id: string) => {
      try {
        setLoading();
        await deleteInventory(id);
        getData();
      } catch (error) {
        console.error(error);
        setIdle()
      }
    },
    [getData]
  );

  const value = useMemo(
    () => ({
      inventory,
      setInventory,
      getData,
      handleAddInventory,
      handleEditInventory,
      handleDeleteInventory,
    }),
    [
      inventory,
      setInventory,
      getData,
      handleAddInventory,
      handleEditInventory,
      handleDeleteInventory,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
