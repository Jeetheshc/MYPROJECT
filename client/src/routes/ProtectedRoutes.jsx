// import React from "react";
// import { useSelector } from "react-redux";
// import { Outlet, useNavigate } from "react-router-dom";

// export const ProtectedRoutes = () => {
//     const { isUserAuth } = useSelector((state) => state.user);
//     const navigate = useNavigate();

//     if (!isUserAuth) {
//         navigate("/login");
//         return;
//     }

//     return isUserAuth && <Outlet />;
// };
// AdminProtectedRoutes.js
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

export const AdminProtectedRoutes = () => {
    const { isAdminAuth } = useSelector((state) => state.admin);
    const navigate = useNavigate();

   // useEffect(() => {
        if (!isAdminAuth) {
            navigate("/admin/login");
        }
   // }, [isAdminAuth, navigate]);

    return isAdminAuth ? <Outlet /> : null;
};



export const ProtectedRoutes = () => {
    const { isUserAuth } = useSelector((state) => state.user);
    const navigate = useNavigate();

    // useEffect(() => {
        if (!isUserAuth) {
            navigate("/login");
        }
    // }, [isUserAuth, navigate]);

    return isUserAuth ? <Outlet /> : null;
};
