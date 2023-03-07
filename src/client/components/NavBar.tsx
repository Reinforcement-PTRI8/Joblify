import React, { useState } from 'react';
import { Stack } from "@mui/system";
import { Link } from "react-router-dom";
import Button, { buttonClasses } from '@mui/material/Button';
import Grid from '@mui/material/Grid';

const linkStyle = {
  display: 'flex',
  padding: "0px 0px 20px 0px",
  textDecoration: "none",
  height: '20px',
  backgroundColor: 'none'
};

const btnStyle = {
  minWidth: 150,
  size: 'large',
  margin: "0px",
  textAlign:"right",
  textTransform: 'unset',
  color: 'primary.main',
};

  

const NavBar = () => {

    const [selected, setSelected] = useState(false);

    const menuItems = [ "Home", "Application Tracker", 'Profile', 'Logout'];
    const menuRoutes = ["/home", "/applications", "/profile", "/logout"];

    const handleClick = () => {
     setSelected(true);
    };

    let selectedBorder = (selected)=>{
        let fill = selected
        if(fill) {
          const btnStyle = {
            minWidth: 150,
            margin: "0px",
            border: 5,
            textAlign:"right",
            textTransform: 'unset',
            };
        };
    };


  const menuBtns = menuItems.map((ele, i)=>{
      return(
          <Button
            onClick={handleClick}
            variant="outlined"
            sx={btnStyle}
            key={i}>
              <Link
                to= {menuRoutes[i]}
                style={linkStyle}>{ele}
              </Link>
          </Button>
      )
  })

  return (
    <Grid>
        <Stack
        direction="row"
        spacing={5}
        marginLeft='33px'>
            <Button sx={btnStyle}></Button>
            {menuBtns}
      </Stack>
    </Grid>
  );
};

export default NavBar;