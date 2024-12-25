import { createBrowserRouter } from "react-router-dom";
import { CarBookings } from "../pages/user/CarBookings";
import { CarDetails } from "../pages/user/CarDetails";
import { Cars } from "../pages/user/Cars";
import { Contact } from "../pages/user/Contact";
import { Home } from "../pages/user/Home";
import { Profile } from "../pages/user/Profile";
import { Profilechangepassword } from "../pages/user/Profilechangepassword";
import { ProfileChangePhoto } from "../pages/user/ProfileChangePhoto";
import { ProfileDeactivate } from "../pages/user/ProfileDeactivate";
import { UserLayout } from "../layout/UserLayout";
import { Signup } from "../pages/shared/Signup";
import { Login } from "../pages/shared/Login";
import ErrorPage from "../pages/shared/ErrorPage";
import About from "../pages/user/About";
import { AdminProtectedRoutes, ProtectedRoutes } from "./ProtectedRoutes";
import { AdminLayout } from "../layout/AdminLayout";
import { Carbookinglists } from "../pages/user/Carbookinglists";
import { CarbookingDetails } from "../pages/user/CarbookingDetails";
import { AdminHome } from "../pages/admin/AdminHome";
import { Carlist } from "../pages/admin/Carlist";
import { Addnewcar } from "../pages/admin/Addnewcar";
import { CarDetailpage } from "../pages/admin/CarDetailpage";
import { EditCar } from "../pages/admin/EditCar";
import { Userlist } from "../pages/admin/Userlist";
import { Userdetailpage } from "../pages/admin/Userdetailpage";
import { Edituser } from "../pages/admin/Edituser";
import { AdminProfile } from "../pages/admin/AdminProfile";
import { Adminbooking } from "../pages/admin/Adminbooking";
import { ProfileChangeDetails } from "../pages/user/ProfileChangeDetails";
import { Paymentseccess } from "../pages/user/Paymentseccess";
import { Paymentfailed } from "../pages/user/Paymentfailed";
import { Bookingdetails } from "../pages/user/Bookingdetails";
import { Carbookingdetails } from "../pages/admin/Carbookingdetails";
import { CarReviewPage } from "../pages/admin/CarReviewPage";
import { Adminuserbook } from "../pages/admin/Adminuserbook";
import { Reviewentryform } from "../pages/user/Reviewentryform";
import { Carreviews } from "../pages/user/Carreviews";
import { Dashboard } from "../pages/admin/Dashboard";





export const router = createBrowserRouter([
    {
        path: "/",
        element: <UserLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "signup",
                element: <Signup />,
            },
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "about",
                element: <About />,
            },
            {
                path: "car/:id",
                element: <CarDetails />,
            },
            {
                path: "cars",
                element: <Cars />,
            },
            {
                path: "contact",
                element: <Contact />,
            },
            {
                path: "cars/carreviews/:id",
                element: <Carreviews />,
            },


            {
                element: <ProtectedRoutes />,
                path: "user",
                children:
                    [

                        {
                            path: "Carbookinglists",
                            element: <Carbookinglists />,
                        },
                        {
                            path: "profile",
                            element: <Profile />,
                        },
                        {
                            path: "carBookings",
                            element: <CarBookings />,
                        },
                        {
                            path: "bookings/:id",
                            element: <CarbookingDetails />,
                        },
                        {
                            path: "profileChangePassword",
                            element: <Profilechangepassword />,
                        },
                        {
                            path: "change-profile-photo",
                            element: <ProfileChangePhoto />,
                        },
                        {
                            path: "change-details",
                            element: <ProfileChangeDetails />,
                        },
                        {
                            path: "profileDeactivate",
                            element: <ProfileDeactivate />,
                        },
                        {
                            path: "payment/success",
                            element: <Paymentseccess />,
                        },
                        {
                            path: "payment/cancel",
                            element: <Paymentfailed />,
                        },
                        {
                            path: "/user/bookdetails/:bookingId",
                            element: <Bookingdetails />,
                        },

                        {
                            path: "reviewentry/:bookingId/:carId",
                            element: <Reviewentryform />,
                        },
                        {
                            path: "carreviews/:id",
                            element: <Carreviews />,
                        },
                    ]

            },


        ]
    },

    {
        path: "admin",
        element: <AdminLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/admin",
                element: <AdminHome />,
            },
            {
                path: "login",
                element: <Login role="admin" />,
            },

            {
                element: <AdminProtectedRoutes />,
                path: "admin",
                children:
                    [
                        {
                            path: "carslist",
                            element: <Carlist />,
                        },
                    
                        {
                            path: "addcars",
                            element: <Addnewcar />,
                        },
                        {
                            path: "view-car/:id",
                            element: <CarDetailpage />,
                        },
                        {
                            path: "edit-car/:id",
                            element: <EditCar />,
                        },
                        {
                            path: "userlist",
                            element: <Userlist />,
                        },
                        {
                            path: "view-user/:id",
                            element: <Userdetailpage />,
                        },
                        {
                            path: "edit-user/:id",
                            element: <Edituser />,
                        },
                        {
                            path: "profile/:id",
                            element: <AdminProfile />,
                        },
                        {
                            path: "bookings",
                            element: <Adminbooking />,
                        },
                        {
                            path: "car-bookings/:id",
                            element: <Carbookingdetails />,
                        },
                        {
                            path: "reviews/:id",
                            element: <CarReviewPage />,
                        },
                        {
                            path: "userreviews/:id",
                            element: <Adminuserbook />,
                        },




                        {
                            path: "adminhome",
                            element: <AdminHome />,
                        },

                    ]

            },


        ]
    },

]);
