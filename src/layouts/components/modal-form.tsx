import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
} from '@mui/material';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import inventory from 'src/context/api/schema/inventory';
import InventorySchemaTypes from 'src/context/api/types/inventory';

export const UOM_OPTIONS = ['kg', 'gr', 'l', 'ml', 'pcs'];

export const ModalForm = ({
  open,
  setOpen,
  onSubmit,
  defaultValues,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onSubmit: (data: InventorySchemaTypes['PostAddInventory']['Request']) => void;
  defaultValues?: InventorySchemaTypes['PutEditInventor']['Request'];
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
    control,
  } = useForm<InventorySchemaTypes['PostAddInventory']['Request']>({
    resolver: zodResolver(inventory.PostAddInventory.Request),
  });

  const uom = watch('uom');

  useEffect(() => {
    reset();
    if (defaultValues) {
       
      Object.entries(defaultValues).forEach(([k, v]) =>
        setValue(k as 'item' | 'qty' | 'uom' | 'price_per_qty', v)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, defaultValues]);

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Item"
            fullWidth
            error={!!errors.item}
            helperText={errors.item?.message as string}
            sx={{ mb: 2 }}
            {...register('item')}
          />
          <TextField
            label="Quantity"
            type="number"
            fullWidth
            error={!!errors.qty}
            helperText={errors.qty?.message as string}
            sx={{ mb: 2 }}
            {...register('qty', { valueAsNumber: true })}
          />
          <Controller
            control={control}
            render={({ field, formState }) => (
              <TextField
                select
                fullWidth
                label="Unit of Measure"
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                error={!!formState?.errors?.uom}
                helperText={formState?.errors?.uom?.message}
                sx={{ mb: 2 }}
              >
                {UOM_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            )}
            name="uom"
          />
          <TextField
            label="Price per Quantity"
            type="number"
            fullWidth
            error={!!errors.price_per_qty}
            helperText={errors.price_per_qty?.message as string}
            sx={{ mb: 2 }}
            {...register('price_per_qty', { valueAsNumber: true })}
          />
          <Button type="submit" variant="contained" fullWidth>
            Submit
          </Button>
        </form>
      </Box>
    </Modal>
  );
};
