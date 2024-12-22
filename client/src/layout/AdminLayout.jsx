import React, { useEffect, useState } from 'react'

import { Outlet, useLocation } from 'react-router-dom'

import { axiosInstance } from '../config/axiosInstance'
import { useDispatch, useSelector } from 'react-redux'

import { AdminLogoutHeader } from '../components/admin/AdminLogoutHeader'
import { Footer } from '../components/admin/Footer'
import { clearAdminData, saveAdminData } from '../redux/features/AdminSlice'
import { AdminHeader } from '../components/admin/AdminHeader'


export const AdminLayout = () => {
    const { isAdminAuth, adminData } = useSelector((state) => state.admin)
    const dispatch = useDispatch();
    const location = useLocation();

    const checkAdmin = async () => {
        try {
            const response = await axiosInstance({
                method: "GET",
                url: "/admin/check-admin",
            });
            dispatch(saveAdminData());
        } catch (error) {
            dispatch(clearAdminData());
            console.log(error);
        }
    };


    console.log(isAdminAuth, "adminauth");
    console.log(adminData, "admindata");
    useEffect(() => {
        checkAdmin();
    }, [location.pathname]);


    return (
        <div>
                   {isAdminAuth ? <AdminHeader /> : <AdminLogoutHeader />}
            <div className='min-h-100'>
                <Outlet />
                <Footer />

            </div>
        </div>
    )
}
