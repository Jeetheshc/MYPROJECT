
import express from "express";
import { adminAuth } from "../middlewares/adminAuth.js";
import { AdminLogin, AdminLogout, AdminProfile, AdminSignup, cancelBooking, changeAdminPassword, changeAdminProfilePhoto,  checkAdmin, deactivateAdminAccount, updateAdminDetails, userEdit, userProfile } from "../controllers/adminControllers.js";
import { upload } from "../middlewares/multer.js";
import { getAllUsers } from "../controllers/userControllers.js";


const router = express.Router();

//  signup and login routes
router.post('/signup',upload.single('profilePic'), AdminSignup);
router.post('/login', AdminLogin);

//  profile and authentication routes
router.get('/profile/:id', adminAuth, AdminProfile); // You may want to add authentication middleware here
router.put('/profile-update',upload.single('profilePic'), adminAuth, updateAdminDetails);
router.put('/photo-update', adminAuth, changeAdminProfilePhoto);
router.put('/logout', adminAuth, AdminLogout);
router.get('/check-admin', adminAuth, checkAdmin);
router.put('/reset-password', adminAuth, changeAdminPassword);
router.delete('/delete-account', adminAuth, deactivateAdminAccount);
router.get('/userlist', adminAuth, getAllUsers);
router.get('/userdetails/:id',adminAuth,  userProfile );
router.put('/useredit/:id', adminAuth, userEdit );
router.patch('/bookingcancel/:id', cancelBooking )
export { router as adminRouter };
