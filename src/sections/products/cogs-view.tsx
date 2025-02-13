import { LoadingButton } from '@mui/lab';
import {
  Box,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { ReactNode, useCallback, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { useAppContext } from 'src/context/Provider';
import { UOM_OPTIONS } from 'src/layouts/components/modal-form';
import DeleteIcon from '@mui/icons-material/Delete';
import { TableBasic } from 'src/components/table';
import Grid2 from '@mui/material/Unstable_Grid2';

export const CogsView = () => {
  const { inventory } = useAppContext();
  const { control, handleSubmit, watch } = useForm();
  const [snackbar, setSnackbar] = useState(false);
  const [portion, setPortion] = useState(1);
  const [cogsList, setCogsList] = useState([]);
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'material',
  });

  const onSubmit = (data: any) => {
    if (fields.length && fields.some((field) => !field)) {
      setSnackbar(true);
    } else {
      console.log('masuk else');
    }
    calculateCogs(data);
  };

  const allowedUnitOfMeasure = useCallback(
    (item: string, index: number) => {
      const findUom = inventory.data.find((inv) => inv.item === item);

      if (findUom?.uom === 'kg' || findUom?.uom === 'gr') {
        return UOM_OPTIONS.filter((uomOpt) => uomOpt === 'kg' || uomOpt === 'gr');
      }
      if (findUom?.uom === 'l' || findUom?.uom === 'ml') {
        return UOM_OPTIONS.filter((uomOpt) => uomOpt === 'l' || uomOpt === 'ml');
      }
      return UOM_OPTIONS.filter(
        (uomOpt) => uomOpt !== 'kg' && uomOpt !== 'gr' && uomOpt !== 'l' && uomOpt !== 'ml'
      );
    },
    [inventory?.data]
  );

  const getBasedPriceItem = useCallback(
    (item: string) => {
      const dataObj = inventory?.data.find((inv) => inv.item === item);
      return {
        ...dataObj,
        qty: dataObj?.uom === 'kg' || dataObj?.uom === 'l' ? dataObj.qty * 1000 : dataObj?.qty,
        uom: dataObj?.uom === 'kg' ? 'gr' : dataObj?.uom === 'l' ? 'ml' : dataObj?.uom,
      };
    },
    [inventory?.data]
  );

  const calculateCogs = useCallback(
    (data: any) => {
      const temp = data.material.map((d: any) => {
        let tempQty = 0;
        const comparisonItem = getBasedPriceItem(d.item);
        if (d?.uom === 'kg' || d?.uom === 'l') tempQty = d.qty * 1000;
        const qtyFinal = tempQty || d.qty;
        return {
          ...d,
          uom: d.uom === 'kg' ? 'gr' : d.uom === 'l' ? 'ml' : d.uom,
          qty: qtyFinal,
          price: (qtyFinal / (comparisonItem?.qty || 0)) * (comparisonItem.price_per_qty || 0),
        };
      });
      console.log({ temp });
      setCogsList(temp);
    },
    [getBasedPriceItem]
  );

  const totalPrices = cogsList?.reduce((sum, item: any) => sum + item.price, 0);
  return (
    <Box margin="2rem">
      <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map((field, index) => (
          <Box key={field.id} display="flex" flex="1 1 1" columnGap="1rem">
            <Controller
              control={control}
              render={({ field: fieldControl, formState }) => (
                <TextField
                  select
                  fullWidth
                  label="Item"
                  value={fieldControl.value}
                  onChange={(e) => fieldControl.onChange(e.target.value)}
                  error={!!formState?.errors?.item}
                  helperText={formState?.errors?.item?.message as string}
                  sx={{ mb: 2 }}
                >
                  {inventory.data.map((option) => (
                    <MenuItem key={option.item} value={option.item}>
                      {option.item}
                    </MenuItem>
                  ))}
                </TextField>
              )}
              name={`material.${index}.item`}
            />
            <Controller
              control={control}
              render={({ field: fieldControl, formState }) => (
                <TextField
                  label="Quantity"
                  type="number"
                  fullWidth
                  value={fieldControl.value}
                  onChange={(e) => fieldControl.onChange(e.target.value)}
                  error={!!formState.errors.qty}
                  helperText={formState.errors.qty?.message as string}
                  sx={{ mb: 2 }}
                />
              )}
              name={`material.${index}.qty`}
            />
            <Controller
              disabled={watch(`material.${index}.item`)}
              control={control}
              render={({ field: fieldControl, formState }) => (
                <TextField
                  select
                  fullWidth
                  label="Unit of Measure"
                  value={fieldControl.value}
                  onChange={(e) => fieldControl.onChange(e.target.value)}
                  error={!!formState?.errors?.uom}
                  helperText={formState?.errors?.uom?.message as string}
                  sx={{ mb: 2 }}
                >
                  {allowedUnitOfMeasure(watch(`material.${index}.item`), index).map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              )}
              name={`material.${index}.uom`}
            />
            <Box>
              <Stack direction="row" spacing={1}>
                <IconButton size="small" color="error" onClick={() => remove(index)}>
                  <DeleteIcon />
                </IconButton>
              </Stack>
            </Box>
          </Box>
        ))}
        <Stack direction="row" spacing={1}>
          <LoadingButton variant="outlined" color="secondary" onClick={() => append({})}>
            Add Raw Material
          </LoadingButton>
          <LoadingButton variant="outlined" color="primary" type="submit">
            Calculate COGS
          </LoadingButton>
        </Stack>
      </form>
      {cogsList.length > 0 && (
        <Box margin="2rem">
          <TableBasic
            hidePagination
            rows={cogsList}
            showPerPage={10}
            headRows={[{ item: 'Item' }, { qty: 'Quantity' }, { price: 'Price' }]}
            indexKey="Item"
          />

          <Typography variant="subtitle2" sx={{ my: '1rem' }}>
            Total COGS 1 Portion/Cups: {totalPrices}
          </Typography>
          <TextField
            fullWidth
            label="Portion/Cups"
            value={portion}
            type="number"
            onChange={(e) => setPortion(Number(e.target.value || 1))}
            sx={{ mb: 2 }}
          />
          <Typography variant="subtitle2" >
            Total COGS for {portion} portions/cups: {totalPrices * portion}
          </Typography>
        </Box>
      )}
      <Snackbar
        open={snackbar}
        title="Complete the form first!!!"
        autoHideDuration={1000}
        onClose={() => setSnackbar(false)}
      />
    </Box>
  );
};
