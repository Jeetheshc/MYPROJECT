import React, { useEffect, useState } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";

ChartJS.register(...registerables);

export const Dashboard = ({ bookings }) => {
    const [statusData, setStatusData] = useState({});
    const [monthlyData, setMonthlyData] = useState({});
    const [paymentModeData, setPaymentModeData] = useState({});

    useEffect(() => {
        if (bookings.length > 0) {
            generateStatusData();
            generateMonthlyData();
            generatePaymentModeData();
        }
    }, [bookings]);

    const generateStatusData = () => {
        const statusCounts = bookings.reduce(
            (acc, booking) => {
                acc[booking.status] = (acc[booking.status] || 0) + 1;
                return acc;
            },
            { Booked: 0, Completed: 0, Cancelled: 0 }
        );

        setStatusData({
            labels: Object.keys(statusCounts),
            datasets: [
                {
                    label: "Booking Status",
                    data: Object.values(statusCounts),
                    backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                },
            ],
        });
    };

    const generateMonthlyData = () => {
        const monthlyCounts = bookings.reduce((acc, booking) => {
            const month = new Date(booking.bookingDate).toLocaleString("default", {
                month: "short",
            });
            acc[month] = (acc[month] || 0) + 1;
            return acc;
        }, {});

        const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];

        const counts = months.map((month) => monthlyCounts[month] || 0);

        setMonthlyData({
            labels: months,
            datasets: [
                {
                    label: "Bookings per Month",
                    data: counts,
                    backgroundColor: "#36A2EB",
                    borderColor: "#36A2EB",
                    borderWidth: 1,
                },
            ],
        });
    };

    const generatePaymentModeData = () => {
        const paymentModes = bookings.reduce((acc, booking) => {
            acc[booking.paymentMode] = (acc[booking.paymentMode] || 0) + 1;
            return acc;
        }, {});

        setPaymentModeData({
            labels: Object.keys(paymentModes),
            datasets: [
                {
                    label: "Payment Modes",
                    data: Object.values(paymentModes),
                    backgroundColor: ["#4BC0C0", "#FF6384", "#FFCE56", "#36A2EB"],
                },
            ],
        });
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-4xl font-semibold text-center text-indigo-700 mb-6">
                Booking Dashboard
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Booking Status Pie Chart */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-medium text-indigo-600 text-center mb-4">
                        Booking Status Distribution
                    </h2>
                    <Pie data={statusData} />
                </div>

                {/* Bookings per Month Bar Chart */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-medium text-indigo-600 text-center mb-4">
                        Bookings Per Month
                    </h2>
                    <Bar data={monthlyData} />
                </div>

                {/* Payment Modes Pie Chart */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-medium text-indigo-600 text-center mb-4">
                        Payment Modes
                    </h2>
                    <Pie data={paymentModeData} />
                </div>
            </div>
        </div>
    );
};
