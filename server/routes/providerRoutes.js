
import express from "express";
import { carProviderAuth } from "../middlewares/providerAuth.js";
import { CarPLogin, CarPLogout, CarPProfile, CarPSignup, changePassword, changeProfilePhoto, checkCarP, deactivateAccount, updateCarPDetails } from "../controllers/carProviderControl.js";


const router = express.Router();

// carProvider signup and login routes
router.post('/signup', CarPSignup);
router.post('/login', CarPLogin);

// carProvider profile and authentication routes
router.get('/profile', carProviderAuth, CarPProfile); // You may want to add authentication middleware here
router.put('/profile-update', carProviderAuth, updateCarPDetails);
router.put('/photo-update', carProviderAuth, changeProfilePhoto);
router.put('/logout', carProviderAuth, CarPLogout);
router.get('/check-carProvider', carProviderAuth, checkCarP);
router.put('/reset-password', carProviderAuth, changePassword);
router.delete('/delete-account', carProviderAuth, deactivateAccount);

export { router as carProviderRouter };
