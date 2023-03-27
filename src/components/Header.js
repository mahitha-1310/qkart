import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";
import { useHistory, Link } from "react-router-dom";
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';

const Header = ({ children, hasHiddenAuthButtons }) => {
    return (
      <Box className="header">
        <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>
        
          
        {children}
          
        {hasHiddenAuthButtons?
          (<Link to="/" style={{textDecoration :'none'}}>
            <Button
              className="explore-button"
              startIcon={<ArrowBackIcon />}
              variant="text"
            >
              Back to explore
            </Button>
          </Link>)
        :
          ((localStorage.getItem("username")!=null)?
            (
            <Stack direction="row" alignItems={"center"} spacing={2}>
              {/* {console.log("hi")} */}
            <img src="avatar.png" alt={localStorage.getItem("username")}/>
            <p>{localStorage.getItem("username")}</p>
            <Link to="/" style={{textDecoration :'none'}}>
              <Button className="explore-button" variant="text"onClick={()=>{
                localStorage.clear();
                window.location.reload();
                }} >
                Logout
              </Button>
            </Link>
            </Stack>
            )
          :
          (
            <Stack direction="row" spacing={2}>
            
            <Link to="/login" style={{textDecoration :'none'}}>
              <Button className="explore-button" variant="text">
                Login
              </Button>
            </Link>

            <Link to="/register" style={{textDecoration :'none'}}>
              <Button className="button" variant="contained">
              Register
              </Button>
            </Link>
            
            </Stack>
          )) 
        }
        
      </Box>
    );
};

export default Header;
