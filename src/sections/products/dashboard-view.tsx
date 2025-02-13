import { Box, Button, IconButton, Stack, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { TableBasic } from 'src/components/table';
import { useAppContext } from 'src/context/Provider';
import InventorySchemaTypes from 'src/context/api/types/inventory';
import { ModalForm } from 'src/layouts/components/modal-form';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export const DashboardView = () => {
  const [open, setOpen] = useState(false);
  const context = useAppContext();
  const [search, setSearch] = useState('');
  const [defaultValues, setDefaultValues] = useState<
    (InventorySchemaTypes['PutEditInventor']['Request'] & { id: string }) | undefined
  >(undefined);

  const onSubmit = (data: InventorySchemaTypes['PostAddInventory']['Request']) => {
    if (defaultValues) {
      context.handleEditInventory(defaultValues.id, data);
    } else {
      context.handleAddInventory(data);
    }
    setOpen(false);
  };

  useEffect(() => {
    context.getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      context.handleDeleteInventory(id);
    }
  };

  const handleEdit = (id: string) => {
    setDefaultValues(context.inventory.data.find((item) => item.id === id));
    setOpen(true);
  };

  return (
    <Box margin="2rem">
      <Stack direction='row' spacing="1rem">
      <Button
        variant="contained"
        onClick={() => {
          setOpen(true);
          setDefaultValues(undefined);
        }}
        sx={{ mb: 2 }}
      >
        Add Inventory
      </Button>

      <TextField size='small' label="Search..." value={search} onChange={e => setSearch(e.target.value)} />
      </Stack>
      <ModalForm open={open} setOpen={setOpen} onSubmit={onSubmit} defaultValues={defaultValues} />
      <TableBasic
        rows={context.inventory.data.filter(item => item.item.toLowerCase().includes(search) )}
        showPerPage={10}
        headRows={[
          { item: 'Item' },
          { qty: 'Quantity' },
          { uom: 'Unit of Measure' },
          { price_per_qty: 'Price per Quantity' },
          { actions: 'Actions' },
        ]}
        indexKey="item"
        renderCustomCell={(row: any, key: string): React.ReactNode => {
          if (key === 'actions') {
            return (
              <Stack direction="row" spacing={1}>
                <IconButton size="small" color="primary" onClick={() => handleEdit(row.id)}>
                  <EditIcon />
                </IconButton>
                <IconButton size="small" color="error" onClick={() => handleDelete(row.id)}>
                  <DeleteIcon />
                </IconButton>
              </Stack>
            );
          }
          return null;
        }}
      />
    </Box>
  );
};
