import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { Alert, CircularProgress, Modal, Snackbar } from '@mui/material';
import { useSignInView } from './useSignInView';


export function SignInView() {
  const {
    form,
    status,
    handleSubmit,
  } = useSignInView();



  const renderForm = (
    <Box display="flex" flexDirection="column" alignItems="flex-end">
      <TextField
        fullWidth
        label="Email address"
        placeholder="ex: hello@gmail.com"
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
        error={!!form.formState.errors.email}
        helperText={form.formState.errors.email?.message}
        {...form.register('email', { required: true })}
      />
      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        onClick={handleSubmit}
      >
        Sign in
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Sign in</Typography>
        <Typography variant="body2" color="text.secondary" align='center'>
          This sign in use Passwordless Authentication. You will receive a link to your email to sign in.
        </Typography>
      </Box>

      {renderForm}
      <Modal
        open={status === 'loading'}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box display="flex" flex={1}  alignItems="center" justifyContent="center" height="100%">
          <CircularProgress />
        </Box>
      </Modal>
      <Snackbar open={status === 'success'} autoHideDuration={3000}>
        <Alert
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Email has been sent!!!
        </Alert>
      </Snackbar>
    </>
  );
}
