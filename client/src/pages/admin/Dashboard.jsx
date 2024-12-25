import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { SkeletonLoader } from "../../components/admin/SkeletonLoader";
import { jsPDF } from "jspdf";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";

ChartJS.register(...registerables);

export const Carbookingdetails = () => {
    const { id } = useParams(); // Car ID
    const [data, isLoading, error] = useFetch(`/bookings/${id}/booking`); // Adjust API endpoint
    const [bookings, setBookings] = useState([]);

    // Initialize state for charts
    const [statusData, setStatusData] = useState({});
    const [monthlyData, setMonthlyData] = useState({});
    const [paymentModeData, setPaymentModeData] = useState({});

    useEffect(() => {
        if (data) {
            setBookings(data.bookings); // Populate bookings
            generateStatusData(data.bookings); // Generate Status Data for Pie Chart
            generateMonthlyData(data.bookings); // Generate Monthly Data for Bar Chart
            generatePaymentModeData(data.bookings); // Generate Payment Mode Data for Pie Chart
        }
    }, [data]);

    const generateStatusData = (bookings) => {
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

    const generateMonthlyData = (bookings) => {
        const monthlyCounts = bookings.reduce((acc, booking) => {
            const month = new Date(booking.bookingDate).toLocaleString("default", {
                month: "short",
            });
            acc[month] = (acc[month] || 0) + 1;
            return acc;
        }, {});

        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
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

    const generatePaymentModeData = (bookings) => {
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

    // Format Date for display
    const formatDate = (date) => {
        const newDate = new Date(date);
        const day = newDate.getDate().toString().padStart(2, "0");
        const month = (newDate.getMonth() + 1).toString().padStart(2, "0");
        const year = newDate.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text(`Booking History for ${data.car.brand} ${data.car.model}`, 20, 20);

        // Car Details (Centered)
        doc.setFontSize(12);
        doc.text(`Car ID: ${data.car._id}`, 20, 30);
        doc.text(`Brand: ${data.car.brand}`, 20, 40);
        doc.text(`Model: ${data.car.model}`, 20, 50);
        doc.text(`Year: ${data.car.year}`, 20, 60);
        doc.text(`Color: ${data.car.color || "N/A"}`, 20, 70); // Handling undefined color
        doc.text(`Price per Day: ${data.car.pricePerDay}`, 20, 80);

        // Adding space before booking details
        let yPosition = 100;

        // Booking Status Summary Variables
        let bookedTotal = 0;
        let completedTotal = 0;
        let cancelledTotal = 0;

        bookings.forEach((booking, index) => {
            if (yPosition > 250) {
                doc.addPage(); // If the content overflows, add a new page
                yPosition = 20; // Reset Y position for new page
            }

            // Booking Box - Left (Booking Details)
            doc.setFillColor(240, 240, 240); // Light grey background for boxes
            doc.rect(10, yPosition, 180, 70, 'F'); // Left box for booking details
            doc.setTextColor(0);
            doc.text(`Booking Date: ${formatDate(booking.bookingDate)}`, 20, yPosition + 10);
            doc.text(`From: ${formatDate(booking.fromDate)}`, 20, yPosition + 20);
            doc.text(`To: ${formatDate(booking.toDate)}`, 20, yPosition + 30);
            doc.text(`Location: ${booking.location}`, 20, yPosition + 40);
            doc.text(`Status: ${booking.status}`, 20, yPosition + 50);
            doc.text(`Total Paid: ${booking.totalAmountPaid}`, 20, yPosition + 60);

            // Update the totals based on the booking status
            if (booking.status === "Booked") bookedTotal += booking.totalAmountPaid;
            if (booking.status === "Completed") completedTotal += booking.totalAmountPaid;
            if (booking.status === "Cancelled") cancelledTotal += booking.totalAmountPaid;

            // Next booking
            yPosition += 80; // Increase Y position for next booking

            // Handle new page if needed (every 3 bookings, for example)
            if ((index + 1) % 3 === 0 && yPosition > 250) {
                doc.addPage();
                yPosition = 20;
            }
        });

        // Add a summary of total amounts at the end of the PDF
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text(`Total Amounts by Status:`, 20, yPosition + 20);
        doc.text(`Booked: ${bookedTotal}`, 20, yPosition + 30);
        doc.text(`Completed: ${completedTotal}`, 20, yPosition + 40);
        doc.text(`Cancelled: ${cancelledTotal}`, 20, yPosition + 50);

        // Save the PDF with the car ID
        doc.save(`booking_history_${data.car._id}.pdf`);
    };

    if (isLoading) {
        return <SkeletonLoader />;
    }

    if (error) {
        return <div className="text-red-600">Error: {error.message}</div>;
    }

    if (!bookings || bookings.length === 0) {
        return <div className="text-gray-700">No bookings available for this car.</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-4xl font-semibold text-center text-indigo-700 mb-6">
                Booking History for {data.car.brand} {data.car.model}
            </h1>

            {/* Booking Dashboard */}
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

            {/* Generate Report Button */}
            <div className="mb-6 text-center">
                <button
                    onClick={generatePDF}
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                >
                    Generate Report (PDF)
                </button>
            </div>

            {/* Car Details */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-2xl font-medium text-indigo-600">Car Details</h2>
                <p><strong>Car ID:</strong> {data.car._id}</p>
                <p><strong>Brand:</strong> {data.car.brand}</p>
                <p><strong>Model:</strong> {data.car.model}</p>
                <p><strong>Year:</strong> {data.car.year}</p>
                <p><strong>Color:</strong> {data.car.color}</p>
                <p><strong>Price per Day:</strong> ₹{data.car.pricePerDay}</p>
            </div>

            {/* Booking Details */}
            <div className="grid grid-cols-1 gap-4">
                {bookings.map((booking) => (
                    <div
                        key={booking._id}
                        className="bg-white p-4 rounded-lg shadow-md"
                    >
                        <h3 className="text-xl font-medium text-indigo-600">Booking ID: {booking._id}</h3>
                        <p><strong>Booking Date:</strong> {formatDate(booking.bookingDate)}</p>
                        <p><strong>From:</strong> {formatDate(booking.fromDate)}</p>
                        <p><strong>To:</strong> {formatDate(booking.toDate)}</p>
                        <p><strong>Location:</strong> {booking.location}</p>
                        <p><strong>Status:</strong> 
                            <span
                                className={
                                    booking.status === "Completed"
                                        ? "text-green-600"
                                        : "text-yellow-600"
                                }
                            >
                                {booking.status}
                            </span>
                        </p>
                        <p><strong>Total Amount Paid:</strong> ₹{booking.totalAmountPaid}</p>
                        <p><strong>Payment Date:</strong> {formatDate(booking.paymentDate)}</p>
                        <p><strong>Payment Mode:</strong> {booking.paymentMode}</p>

                        {/* User Details */}
                        <div className="mt-4">
                            <h4 className="text-lg font-medium text-indigo-600">User Details</h4>
                            <p><strong>Name:</strong> {booking.userId.name}</p>
                            <p><strong>Email:</strong> {booking.userId.email}</p>
                            <p><strong>Phone:</strong> {booking.userId.phone}</p>
                            <p><strong>Address:</strong> {booking.userId.address}</p>
                            <img
                                src={booking.userId.profilePic}
                                alt="Profile"
                                className="w-16 h-16 rounded-full mt-2"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
