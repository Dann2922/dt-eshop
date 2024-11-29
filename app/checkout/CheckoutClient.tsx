// "use client";

// import { useCart } from "@/hooks/useCart";
// import { Elements } from "@stripe/react-stripe-js";
// import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
// import { useRouter } from "next/navigation";
// import { useCallback, useEffect, useState } from "react";
// import { toast } from "react-hot-toast";
// import CheckoutForm from "./CheckoutForm";
// import Button from "../components/Button";

// const stripePromise = loadStripe(
//   process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
// );

// const CheckoutClient = () => {
//   const { cartProducts, paymentIntent, handleSetPaymentIntent } = useCart();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(false);
//   const [clientSecret, setClientSecret] = useState("");
//   const [paymentSuccess, setPaymentSuccess] = useState(false);

//   const router = useRouter();

//   console.log("paymentIntent", paymentIntent);
//   console.log("clientSecret", clientSecret);

//   useEffect(() => {
//     //create a paymentintent as soon as the page loads
//     if (cartProducts) {
//       setLoading(true);
//       setError(false);

//       fetch("/api/create-payment-intent", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           items: cartProducts,
//           payment_intent_id: paymentIntent,
//         }),
//       })
//         .then((res) => {
//           setLoading(false);
//           if (res.status === 401) {
//             return router.push("/login");
//           }

//           return res.json();
//         })
//         .then((data) => {
//           setClientSecret(data.paymentIntent.client_secret);
//           handleSetPaymentIntent(data.paymentIntent.id);
//         })
//         .catch((error) => {
//           setError(true);
//           console.log("Error", error);
//           toast.error("Something went wrong");
//         });
//     }
//   }, [cartProducts, paymentIntent]);

//   const options: StripeElementsOptions = {
//     clientSecret,
//     appearance: {
//       theme: "stripe",
//       labels: "floating",
//     },
//   };

//   const handleSetPaymentSuccess = useCallback((value: boolean) => {
//     setPaymentSuccess(value);
//   }, []);

//   return (
//     <div className="w-full">
//       {clientSecret && cartProducts && (
//         <Elements options={options} stripe={stripePromise}>
//           <CheckoutForm
//             clientSecret={clientSecret}
//             handleSetPaymentSuccess={handleSetPaymentSuccess}
//           />
//         </Elements>
//       )}
//       {loading && <div className="text-center">Loading Checkout...</div>}
//       {error && (
//         <div className="text-center text-rose-500">Something went wrong...</div>
//       )}
//       {paymentSuccess && (
//         <div className="flex items-center flex-col gap-4">
//           <div className="text-teal-500 text-center">Payment Success</div>
//           <div className="max-w-[220px] w-full">
//             <Button
//               label="View Your Orders"
//               onClick={() => router.push("/orders")}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CheckoutClient;


"use client";

import { useCart } from "@/hooks/useCart";
import { Elements } from "@stripe/react-stripe-js";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import CheckoutForm from "./CheckoutForm";
import Button from "../components/Button";

// Load Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

const CheckoutClient = () => {
  const { cartProducts, paymentIntent, handleSetPaymentIntent } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const router = useRouter();

  console.log("paymentIntent", paymentIntent); // Log paymentIntent for debugging
  console.log("cartProducts", cartProducts); // Log cartProducts for debugging
  console.log("clientSecret", clientSecret); // Log clientSecret for debugging

  useEffect(() => {
    if (cartProducts && cartProducts.length > 0) {
      // Only proceed if there are products in the cart
      setLoading(true);
      setError(false);

      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartProducts,
          payment_intent_id: paymentIntent,
        }),
      })
        .then((res) => {
          setLoading(false);
          if (res.status === 401) {
            // Redirect to login if unauthorized
            router.push("/login");
            return;
          }

          return res.json();
        })
        .then((data) => {
          console.log("PaymentIntent response data:", data); // Log response data

          if (data && data.paymentIntent) {
            setClientSecret(data.paymentIntent.client_secret);
            handleSetPaymentIntent(data.paymentIntent.id);
          } else {
            setError(true);
            toast.error("Failed to create payment intent.");
          }
        })
        .catch((error) => {
          setLoading(false);
          setError(true);
          console.log("Error creating payment intent:", error);
          toast.error("Something went wrong");
        });
    } else {
      setLoading(false);
      setError(true);
      toast.error("Cart is empty or invalid.");
    }
  }, [cartProducts, paymentIntent, handleSetPaymentIntent, router]);

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
      labels: "floating",
    },
  };

  const handleSetPaymentSuccess = useCallback((value: boolean) => {
    setPaymentSuccess(value);
  }, []);

  return (
    <div className="w-full">
      {clientSecret && cartProducts && cartProducts.length > 0 && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm
            clientSecret={clientSecret}
            handleSetPaymentSuccess={handleSetPaymentSuccess}
          />
        </Elements>
      )}
      {loading && <div className="text-center">Loading Checkout...</div>}
      {error && (
        <div className="text-center text-rose-500">Something went wrong...</div>
      )}
      {paymentSuccess && (
        <div className="flex items-center flex-col gap-4">
          <div className="text-teal-500 text-center">Payment Success</div>
          <div className="max-w-[220px] w-full">
            <Button
              label="View Your Orders"
              onClick={() => router.push("/orders")}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutClient;
