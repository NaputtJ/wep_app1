import CssBaseline from '@mui/material/CssBaseline';
import router from './router.tsx';
import { RouterProvider } from 'react-router-dom'
import './app.css'
import { createTheme, StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { themeOptions } from './theme.ts';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { enUS } from '@mui/x-date-pickers/locales';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { SnackbarProvider } from 'notistack';

const theme = createTheme(themeOptions);


function App() {
  return (
    <>
      <StyledEngineProvider injectFirst>
        <CssBaseline />
        <ThemeProvider theme={theme}>
          <LocalizationProvider
            localeText={enUS.components.MuiLocalizationProvider.defaultProps.localeText}
            dateAdapter={AdapterDayjs}
          >
            <SnackbarProvider maxSnack={3}>
              <RouterProvider router={router} />
            </SnackbarProvider>
          </LocalizationProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </>
  )
}

export default App
