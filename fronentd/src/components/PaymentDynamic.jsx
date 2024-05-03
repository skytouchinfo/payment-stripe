import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useEffect, useState } from "react";

const PaymentDynamic = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const response = await fetch(
          "https://api.stripe.com/v1/payment_intents",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Bearer sk_test_51P8b67SGE0pQzSKCNo3BGlKH5lzDGWzAWi1XFz9G6udcINQXOpxD18MmrxPeUjBLGkA6H6vwAaFJaNz8kKa05EsI00fDhhR0q9`,
            },
            body: new URLSearchParams({
              amount: "2000",
              currency: "usd",
              description: "Description of exported goods or services",
            }),
          }
        );

        const data = await response.json();
        setClientSecret(data.client_secret);
      } catch (error) {
        console.error("Error creating PaymentIntent:", error);
        setError("Error creating PaymentIntent");
      }
    };

    fetchClientSecret();
  }, []);

  console.log("data", clientSecret);

  const handleSubmit = async (event) => {
    console.log("hello");

    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: "UjjwalBa",
            email: "ujjwalskytouch@gmail.com",
            address: {
              city: "Surat",
              country: "US",
              line1: "123, Abc",
              line2: null,
              postal_code: "10011",
              state: "NY",
            },
          },
        },
      });

      if (result.error) {
        console.error("Payment error:", result.error);
        setError(result.error.message);
        setLoading(false);
      } else {
        console.log("Payment succeeded:", result.paymentIntent);
        setSuccess(true);
        setLoading(false);
      }
    } catch (error) {
      console.error("Payment error:", error);
      setError("Payment failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Card details
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    "::placeholder": {
                      color: "#aab7c4",
                    },
                  },
                  invalid: {
                    color: "#9e2146",
                  },
                },
              }}
            />
          </label>
        </div>
        <button type="submit" disabled={loading || success}>
          {loading ? "Processing..." : "Pay"}
        </button>
      </form>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {success && <div style={{ color: "green" }}>Payment successful!</div>}
    </div>
  );
};

export default PaymentDynamic;
