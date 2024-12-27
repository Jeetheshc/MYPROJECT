
import express from "express";
import { userAuth } from "../middlewares/userAuth.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.Stripe_Private_Api_Key);

const client_domain = process.env.CLIENT_DOMAIN;

const router = express.Router();

router.post('/create-checkout-session', userAuth, async (req, res, next) => {
    try {
        const { car } = req.body;

        console.log("Received Request Body:", req.body);

        // Check if car exists
        if (!car) {
            return res.status(400).json({ message: "Car data is missing" });
        }

        // Destructure required fields
        const { carId, model, carImages } = car;
        const totalPrice = carId?.totalPrice; // Use the totalPrice sent from the front-end

        if (!totalPrice || !model || !carImages?.length) {
            console.log("Missing fields:", { carId, model, carImages });
            return res.status(400).json({ message: "Car data is missing required fields" });
        }

        // Create a single line item with the total price
        const lineItem = {
            price_data: {
                currency: "inr",
                product_data: {
                    name: model,
                    images: carImages.slice(0, 1), // Use the first image
                },
                unit_amount: Math.round(totalPrice * 100), // Send the total price
            },
            quantity: 1,
        };


        console.log("Line Item:", lineItem);

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [lineItem],
            mode: "payment",
            success_url: `${client_domain}/user/payment/success`,
            cancel_url: `${client_domain}/user/payment/cancel`,
        });

        res.json({ success: true, sessionId: session.id });
    } catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).json({ message: "Internal server error - payment failed" });
    }
});
// router.get("/session-status", async (req, res) => {
//     try {
//         const sessionId = req.query.session_id;
//         const session = await stripe.checkout.sessions.retrieve(sessionId);

//         res.send({
//             status: session?.status,
//             customer_email: session?.customer_details?.email,
//         });
//     } catch (error) {
//         res.status(error?.statusCode || 500).json(error.message || "internal server error");
//     }
// });
// export { router as paymentRouter };

router.get('/session-status', async (req, res) => {
  try {
    const sessionId = req.query.session_id;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session?.payment_status === 'paid') {
      res.json({
        status: 'succeeded',
        customer_email: session?.customer_details?.email,
      });
    } else {
      res.status(400).json({ message: 'Payment not completed.' });
    }
  } catch (error) {
    console.error('Error verifying session:', error.message);
    res.status(500).json({ message: 'Failed to verify payment session.' });
  }
});

