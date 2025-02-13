import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { VerifyView } from 'src/sections/auth/verify-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Sign in - ${CONFIG.appName}`}</title>
      </Helmet>

      <VerifyView />
    </>
  );
}
