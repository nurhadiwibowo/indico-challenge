import { CircularProgress, Typography, Alert } from '@mui/material';
import Box from '@mui/material/Box';
import { useVerifyView } from './useVerifyView';

export function VerifyView() {

  const {
    router,
    verificationStatus,
    errorMessage
  } = useVerifyView();
  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2} pt={5}>
      {verificationStatus === 'verifying' && (
        <>
          <CircularProgress />
          <Typography variant="h5">Verifying your email...</Typography>
          <Typography variant="body2" color="text.secondary" align='center'>
            Please wait while we verify your email link
          </Typography>
        </>
      )}

      {verificationStatus === 'success' && (
        <>
          <Alert severity="success" sx={{ width: '100%', maxWidth: 400 }}>
            Email verified successfully!
          </Alert>
          <Typography variant="body2" color="text.secondary" align='center'>
            Redirecting to dashboard...
          </Typography>
        </>
      )}

      {verificationStatus === 'error' && (
        <>
          <Alert severity="error" sx={{ width: '100%', maxWidth: 400 }}>
            {errorMessage || 'Verification failed'}
          </Alert>
          <Typography
            variant="body2"
            sx={{
              cursor: 'pointer',
              textDecoration: 'underline',
              color: 'primary.main'
            }}
            onClick={() => router.push('/sign-in')}
          >
            Return to sign in
          </Typography>
        </>
      )}
    </Box>
  );
}