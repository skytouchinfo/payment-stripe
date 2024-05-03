import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import React from 'react';
import CheckOutForm from './CheckOutForm';

const Products = () => {
  const product = {
    "id": 7,
    "name": "NATURAL GLOSSY BRAIDED CROSSBODY BAG",
    "pictures": [
      "product/bags/bag-07-front.jpg",
      "product/bags/bag-07-back.jpg"
    ],
    "stock": 23,
    "price": 2890,
    "discount": 600,
    "salePrice": 2290,
    "description": "Red crossbody bag made of natural materials. Braided body with a glossy finish. Gold metal detail on the front. Shoulder strap. Lined interior. Magnetic clasp with strap closure.",
    "rating": 2,
    "tags": [
      "Women",
      "Bags"
    ],
    "size": [
      "M",
      "XL"
    ],
    "category": "Women",
    "colors": [
      "Red"
    ]
  };

  // Function to handle buy action
  const makePayment = async () => {
    try {
      const stripe = await loadStripe('pk_test_51ORpDXSJivXBSgor7CxOo2rbwC8nhsIfwqxlxb76hPtuTzY4z2we4yK30AnBGsFbalURavuyqsk8obBmYRd7ZA8d00UPnsjnGY');

      const response = await axios.post(`http://localhost:8000/checkout-events`, { services: [product] });

      const result = stripe.redirectToCheckout({
        sessionId: response.data.sessionId
      });

      if (result.error) {
        console.log("response error", result.error);
      }
    } catch (error) {
      console.error('Error making payment:', error);
    }
  };
  const handlePayment = (paymentMethod) => {
    // Handle the payment method, e.g., send it to your server to create a payment intent
    console.log('Received payment method:', paymentMethod);
  };
  return (
    <div className="container">
      <h2 className="mt-5">Product Details</h2>
      <div className="card mt-4">
        <img src={product.pictures[0]} className="card-img-top" alt={product.name} />
        <div className="card-body">
          <h5 className="card-title">{product.name}</h5>
          <p className="card-text">{product.description}</p>
          <p className="card-text">Price: ${product.salePrice}</p>
          <CheckOutForm totalPrice={product.salePrice} onPayment={handlePayment} />
          {/* <button className="btn btn-primary" onClick={makePayment}>Buy</button> */}
        </div>
      </div>
    </div>
  );
};

export default Products;
