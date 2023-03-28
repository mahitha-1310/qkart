import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart, items, products}) => {
  let token=localStorage.getItem("token")
  return (
    <Card className="card">
      <CardMedia
        component="img"
        image={product.image}
        alt={product.name}
      />
      <CardContent>
      <p>{product.name}</p>
      <Typography variant="h5" component="div"><b>${product.cost}</b></Typography>
      <Rating name="read-only" value={product.rating} readOnly />
      </CardContent>
      <Button variant="contained" onClick={()=>handleAddToCart(token,items,products,product._id,1, {preventDuplicate: true} )} sx={{width:"100%"}}><AddShoppingCartOutlined/>ADD TO CART</Button>
      
    </Card>
  );
};

export default ProductCard;
