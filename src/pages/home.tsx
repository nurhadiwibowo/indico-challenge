import { Box, CircularProgress, Modal } from '@mui/material';
import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useAppContext } from 'src/context/Provider';
import { DashboardView } from 'src/sections/products/dashboard-view';

// ----------------------------------------------------------------------

export default function Page() {
  const { inventory } = useAppContext();
  return (
    <>
      <Helmet>
        <title> {`Dashboard - ${CONFIG.appName}`}</title>
        <meta
          name="description"
          content="The starting point for your next project with Minimal UI Kit, built on the newest version of Material-UI ©, ready to be customized to your style"
        />
        <meta name="keywords" content="react,material,kit,application,dashboard,admin,template" />
      </Helmet>
      <Modal
        open={inventory.meta.status === 'loading'}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box display="flex" flex={1} alignItems="center" justifyContent="center" height="100%">
          <CircularProgress />
        </Box>
      </Modal>
      <DashboardView />
    </>
  );
}
