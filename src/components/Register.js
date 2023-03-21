import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import { useHistory, Link } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const[data,setData]=useState({ username: "", password: "", confirmPassword:"" });
  const [isLoading, setIsLoading] = useState(false)
  const updateUsername=(event)=>{
    setData({ ...data, username: event.target.value });
  }
  const updatePassword=(event)=>{
    setData({...data, password: event.target.value});
  }
  const updateConfirmPassword=(event)=>{
    setData({...data, confirmPassword: event.target.value});
  }

  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
  const register = async (formData) => {
    
    if(validateInput(formData)){
    const registration = { username: formData.username, password:formData.password }
    setIsLoading(true)
    try {
      
      const res = await axios.post(config.endpoint+"/auth/register", registration);
      
      enqueueSnackbar("Registered successfully",{variant:"success"})
      history.push("/login")
    } catch (e) {
      try{
        enqueueSnackbar(e.response.data.message,{variant:"error"})
      }
      catch{
        enqueueSnackbar("Something went wrong. Check that the backend is running, reachable and returns valid JSON.",{variant:"error"})
      }
    }
    setIsLoading(false)
  }
  };

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const validateInput = (data) => {
    
    if(data.username==""){
      enqueueSnackbar("Username is a required field",{variant:"error"})
    }
    else if(data.username.length<6){
      enqueueSnackbar("Username must be at least 6 characters",{variant:"error"})
    }
    else if(data.password==""){
      enqueueSnackbar("Password is a required field",{variant:"error"})
    }
    else if(data.password.length<6){
      enqueueSnackbar("Password must be at least 6 characters",{variant:"error"})
    }
    else if(data.password!=data.confirmPassword){
      enqueueSnackbar("Passwords do not match",{variant:"error"})
    }
    else{
      return true
    }
  };


  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons ={true}/>
      
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            fullWidth
            value={data.username}
            onChange={(event)=>updateUsername(event)}
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            value={data.password}
            onChange={(event)=>updatePassword(event)}
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
            value={data.confirmPassword}
            onChange={(event)=>updateConfirmPassword(event)}
          />

          {isLoading && <CircularProgress style={{margin:"1rem auto 0"}} />}

          {!isLoading && 
           <Button className="button" variant="contained"  onClick={()=>register(data)}>
            Register Now
           </Button>}

          <p className="secondary-action">
            Already have an account?{" "}
            <Link to="/login">
              Login here
            </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
