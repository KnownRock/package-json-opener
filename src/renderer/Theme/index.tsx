import { createTheme, ThemeProvider } from '@mui/material';
import { green, yellow } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: yellow[100],
    },
  },
});

export default function Theme({ children }: { children: React.ReactNode }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
