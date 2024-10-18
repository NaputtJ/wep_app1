import { Outlet } from "react-router-dom"
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AssessmentIcon from '@mui/icons-material/Assessment';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from "react";

const drawerWidth = 240;

const SideMenu = (
  <Box
    sx={{
      width: drawerWidth,
    }}
    className='h-full'
    aria-label="side menu"
  >
    <List>
      {[{
        key: "Home",
        link: "/",
        icon: <AssessmentIcon />,
      }].map((link) => (
        <ListItem
          key={link.key}
          disablePadding
          aria-label={`menu ${link.key}`}
        >
          <ListItemButton href={link.link}>
            <ListItemIcon>
              {link.icon}
            </ListItemIcon>
            <ListItemText primary={link.key} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  </Box>
)

const AppLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Adjust 'sm' as needed

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)


  return (
    <div className="h-screen w-screen">
      <Drawer
        anchor='left'
        open={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      >
        {SideMenu}
      </Drawer>
      <Box
        className='w-full h-full'
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <AppBar
          position="static"
          className="shadow-md relative"
        >
          <Toolbar className="h-12 min-h-12 w-full flex justify-between">
            <Box className="flex flex-row gap-2">
              {
                isMobile ? (
                  <a
                    className="flex items-center"
                    style={{ color: 'inherit' }}
                    onClick={() => setIsMobileMenuOpen(true)}
                  ><MenuIcon /></a>
                ) : undefined
              }
              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1 }}
              >
                Assessments
              </Typography>
            </Box>
            <Button color="inherit" aria-label="login button">Login</Button>
          </Toolbar>
        </AppBar>
        <Box
          className='w-full h-full'
          sx={{
            display: "flex",
            flexDirection: 'row',
          }}
        >
          {
            isMobile ? undefined : (
              SideMenu
            )}
          <Box
            className='w-full h-full p-5'
            sx={{
              backgroundColor: theme.palette.background.default,
              maxHeight: "100%",
              overflow: "scroll",
              flexGrow: 1,
            }}
          >
            <Box
              sx={{
                height: "100%",
                borderRadius: "10px",
                backgroundColor: theme.palette.background.paper,
                width: "100%",
              }}
            >
              <Outlet />
            </Box>
          </Box>
        </Box>
      </Box>
    </div>
  );
}

export default AppLayout