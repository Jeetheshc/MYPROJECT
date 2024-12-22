
import express from "express";
import { userRouter } from "./userRoutes.js"; // Path to userRoutes file
import { adminRouter } from "./adminRoutes.js";
import { carRouter } from "./carRoutes.js";
import { carProviderRouter } from "./providerRoutes.js";
import { bookingRouter } from "./bookingRoutes.js";
import { reviewRouter } from "./reviewRoutes.js";
import { paymentRouter } from "./paymentRoutes.js";

// Import other routers if needed (e.g., carRouter, bookingRouter)

const router = express.Router();

// Mount user routes under `/api/user`
router.use('/user', userRouter); 
router.use('/admin', adminRouter); 
router.use('/car',carRouter)
router.use('/provider',carProviderRouter)
router.use('/bookings', bookingRouter);
router.use('/review', reviewRouter)
router.use('/payment', paymentRouter)
// Export the main API router
export { router as apiRouter };



