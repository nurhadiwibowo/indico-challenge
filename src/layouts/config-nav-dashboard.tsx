import Logout from '@mui/icons-material/Logout';
import Calculate from '@mui/icons-material/Calculate';
import Inventory from '@mui/icons-material/Inventory';

export const navData = [
  {
    title: 'Inventory Management',
    path: '/',
    icon: <Inventory />,
  },
  {
    title: 'COGS Calculator',
    path: '/cogs',
    icon: <Calculate />,
  },
  {
    title: 'Logout',
    path: '/sign-out',
    icon: <Logout />,
  }
];
