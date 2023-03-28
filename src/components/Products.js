import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import ProductCard from "./ProductCard";
import "./Products.css";
import Cart, { generateCartItemsFrom } from "./Cart"

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */


const Products = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false)
  const[allProducts,setAllProducts]=useState([])
  const[time,setTime]=useState(setTimeout(()=>{},500))
  const [username, setUsername] = useState("");
  const[cartItems,setCartItems]=useState([])
  const[generatedProducts,setGeneratedProducts]=useState([])
  // const[cartItems,setCartItems]=useState([])

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  
  useEffect(()=>{
    if(localStorage.getItem("username") !== null){ 
      setUsername(localStorage.getItem("username")); 
    }
    performAPICall()
    
  },[])

  const performAPICall = async () => {
    setIsLoading(true)
    try{
      let res=await axios.get(config.endpoint+"/products")
      setAllProducts(res.data)
      if(localStorage.getItem("username")){
        let cd=await fetchCart(localStorage.getItem('token'))
        setGeneratedProducts(generateCartItemsFrom(cd,res.data))
      }
    }
    catch(e){
      // enqueueSnackbar("Something went wrong. Check the backend console for more details",{variant:"error"})
    }
    setIsLoading(false)
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    setIsLoading(true)
    try{
      let res=await axios.get(config.endpoint+"/products/search?value="+text)
      setAllProducts(res.data)
    }
    catch(e){
      console.log(e)
      setAllProducts([])
      
    }
    setIsLoading(false)
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    clearTimeout(debounceTimeout);
    setTime(setTimeout(()=>{
      performSearch(event.target.value)
    },500))
  };







  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token) => {
    if (!token) return;

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      let response = await axios.get(`${config.endpoint}/cart`, { headers: { 'Authorization': `Bearer ${token}` } })
      setCartItems(response.data)
      return response.data
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };


  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    for(let i of items){ 
      if(productId === i.productId){ 
        return true; 
      } 
    } 
    return false;
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    if(!token){ 
      enqueueSnackbar("Login to add an item to the Cart",{variant:"warning"}) 
      return; } 
    else{ 
      if(options.preventDuplicate){ 
      if(isItemInCart(items, productId)){ 
        enqueueSnackbar("Item already in cart. Use the cart sidebar to update quantity or remove item.",{variant:"warning"}) 
        return; 
      } } 
    } 
        try{ 
          let response=await axios.post(`${config.endpoint}/cart`, { 'productId':productId, 'qty':qty },
          {headers: { 'Authorization': `Bearer ${token}` }}) 
          console.log(response) 
          setGeneratedProducts(generateCartItemsFrom(response.data, allProducts)); } 
        catch(e){ 
          console.log( e); 
        }
  };


  return (
    <div>
      <Header children={true}>
      <TextField className="search-desktop" 
          size="small"
          fullWidth
          placeholder="Search for items/categories" 
          type="search" 
          sx={{width:"40%"}}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          name="search"
          onChange={(event)=>debounceSearch(event,time)}/>

        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}

      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(event)=>debounceSearch(event,time)}/>

       <Grid container>
         <Grid item className="product-grid">
           <Box className="hero">
             <p className="hero-heading">
               India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
               to your door step
             </p>
           </Box>
         </Grid>
       </Grid>
        {/* // {state.data.length === 0 && ( 
        // <Box style={{ textAlign: "center" }}> 
        // <SentimentDissatisfied style={{ margin: "1rem auto" }} /> 
        // <p>No products found</p> 
        // </Box> )} */}
        <Grid container>
          <Grid xs={12} md={username ? 9 : 12}>
      {isLoading ?<>
        <CircularProgress style={{margin:"auto"}} />
        <p>Loading Products</p>
       </>
       :
      
          (allProducts.length === 0)?(
            <Box style={{display: 'flex', flexDirection:"column",justifyContent:'center',alignItems:'center', width: "100%", height: "300px"}}> 
            <SentimentDissatisfied /> 
            <h3>No Products Found</h3> 
            </Box>
        ):(
        <Grid container spacing={2} my={4}>
          {
          allProducts.map((product,index)=>
          ( 
          
          <Grid item xs={6} my={3} md={3} key={product["_id"]}>
            <ProductCard product={product} products={allProducts} key={index} handleAddToCart={addToCart} items={cartItems}/>
          </Grid>
          
        ))}
        
        </Grid>)
        

}</Grid>
        
        
{(username.length > 0) && 
<Grid item xs={12} md={3} style={{backgroundColor: "#E9F5E1"}}> 
<Cart products={allProducts} items={generatedProducts} handleQuantity={addToCart}/> </Grid> }
</Grid>
      <Footer />
    </div>
  );
};

export default Products;
