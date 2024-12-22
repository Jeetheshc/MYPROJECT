import React, { useEffect, useState } from 'react'
import Header from '../components/user/Header'
import Footer from '../components/user/Footer'
import { Outlet, useLocation } from 'react-router-dom'
import UserHeader from '../components/user/UserHeader'
import { axiosInstance } from '../config/axiosInstance'
import { useDispatch, useSelector } from 'react-redux'
import { clearUserData, saveUserData } from '../redux/features/UserSlice'

export const UserLayout = () => {
    const { isUserAuth, userData } = useSelector((state) => state.user)
    const dispatch = useDispatch();
    const location = useLocation();

    const checkUser = async () => {
        try {
            const response = await axiosInstance({
                method: "GET",
                url: "/user/check-user",
            });
            dispatch(saveUserData(response.data.user));
        } catch (error) {
            dispatch(clearUserData());
            console.error("Error in checkUser:", error);
        }
    };


    console.log(isUserAuth, "userauth");
    console.log(userData, "Userdata");
    useEffect(() => {
        checkUser(); // Re-run checkUser whenever the route changes
    }, [location.pathname]);



    return (
        <div>
            {isUserAuth ? <UserHeader /> : <Header />}
            <div className='min-h-100'>
                <Outlet />
                <Footer />

            </div>
        </div>
    )
}
