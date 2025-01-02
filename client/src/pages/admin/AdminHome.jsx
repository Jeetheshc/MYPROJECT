import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCar, FaClipboardList, FaUsers } from 'react-icons/fa';
import { Bar } from 'react-chartjs-2';
import {  Chart as ChartJS,  CategoryScale,  LinearScale,  BarElement,  Title,  Tooltip,  Legend,} from 'chart.js';
import { useFetch } from '../../hooks/useFetch';

// Registering chart components
ChartJS.register(  CategoryScale,  LinearScale,  BarElement,  Title,  Tooltip,  Legend
);
export const AdminHome = () => {
  const [data, isLoading, error] = useFetch("/bookings");
  const navigate = useNavigate();
  const [filteredData, setFilteredData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null); // Null means "All months"
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default to current year

  useEffect(() => {
    const filterBookings = () => {
      if (!data || data.length === 0) return;

      let filtered = data;

      if (selectedYear) {
        filtered = filtered.filter((booking) => {
          const bookingDate = new Date(booking.fromDate);
          return bookingDate.getFullYear() === selectedYear;
        });
      }

      if (selectedMonth !== null) {
        filtered = filtered.filter((booking) => {
          const bookingDate = new Date(booking.fromDate);
          return bookingDate.getMonth() === selectedMonth;
        });
      }

      setFilteredData(filtered);
    };

    filterBookings();
  }, [selectedMonth, selectedYear, data]);

  const monthlyData = Array.from({ length: 12 }, () => ({
    completed: 0,
    booked: 0,
    cancelled: 0,
  }));

  filteredData.forEach((booking) => {
    const month = new Date(booking.fromDate).getMonth();
    if (booking.status === 'Completed') {
      monthlyData[month].completed += 1;
    } else if (booking.status === 'Booked') {
      monthlyData[month].booked += 1;
    } else if (booking.status === 'Cancelled') {
      monthlyData[month].cancelled += 1;
    }
  });

  const chartData = {
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    datasets: [
      {
        label: 'Completed',
        data: monthlyData.map((month) => month.completed),
        backgroundColor: '#4caf50',
      },
      {
        label: 'Booked',
        data: monthlyData.map((month) => month.booked),
        backgroundColor: '#2196f3',
      },
      {
        label: 'Cancelled',
        data: monthlyData.map((month) => month.cancelled),
        backgroundColor: '#f44336',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Monthly Bookings Summary' },
    },
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-xl font-semibold text-gray-500 animate-pulse">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-xl font-semibold text-red-500 animate-bounce">Error: {error.message}</span>
      </div>
    );
  }

  const groupedBookings = (filteredData || []).reduce(
    (acc, booking) => {
      if (booking.status === 'Completed') {
        acc.completed.push(booking);
      } else if (booking.status === 'Booked') {
        acc.booked.push(booking);
      } else if (booking.status === 'Cancelled') {
        acc.cancelled.push(booking);
      }
      return acc;
    },
    { completed: [], booked: [], cancelled: [] }
  );

  // Helper function to calculate totalAmountPaid
  const calculateTotalAmount = (bookings) => {
    return bookings.reduce((total, booking) => total + booking.totalAmountPaid, 0);
  };

  const totalBookings = (data || []).length;
  const totalCompleted = groupedBookings.completed.length;
  const totalBooked = groupedBookings.booked.length;
  const totalCancelled = groupedBookings.cancelled.length;

  const totalCompletedAmount = calculateTotalAmount(groupedBookings.completed);
  const totalBookedAmount = calculateTotalAmount(groupedBookings.booked);
  const totalCancelledAmount = calculateTotalAmount(groupedBookings.cancelled);


  return (
    <div>
      <div className="flex items-center justify-center ">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
          <div className="flex gap-8">
            <button
              className="flex flex-col items-center px-8 py-6 bg-blue-500 text-white rounded-xl shadow-lg hover:bg-blue-600 transition-all duration-300 w-40 h-40"
              onClick={() => navigate('/admin/admin/carslist')}
            >
              <FaCar className="text-5xl mb-4" />
              <span className="text-lg font-semibold">Car List</span>
            </button>
            <button
              className="flex flex-col items-center px-8 py-6 bg-green-500 text-white rounded-xl shadow-lg hover:bg-green-600 transition-all duration-300 w-40 h-40"
              onClick={() => navigate('/admin/admin/userlist')}
            >
              <FaUsers className="text-5xl mb-4" />
              <span className="text-lg font-semibold">User List</span>
            </button>
            <button
              className="flex flex-col items-center px-8 py-6 bg-blue-500 text-white rounded-xl shadow-lg hover:bg-blue-600 transition-all duration-300 w-40 h-40"
              onClick={() => navigate('/admin/admin/bookings')}
            >
              <FaClipboardList className="text-5xl mb-4" /> {/* You can choose a suitable icon for bookings */}
              <span className="text-lg font-semibold">Bookings</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 animate-fadeIn">

        {/* Filters: Month and Year Select */}
        <div className="flex flex-wrap justify-between dark:bg-base-100 dark:text-base-content items-center mb-8 bg-gray-100 p-4 rounded-lg shadow-md">
          <div className="flex items-center space-x-4">
            <label htmlFor="month" className="text-xl font-semibold text-gray-700">Select Month:</label>
            <select
              value={selectedMonth !== null ? selectedMonth : ''}
              onChange={(e) => {
                const value = e.target.value === '' ? null : parseInt(e.target.value);
                setSelectedMonth(value);
              }}
              className="border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="">All Months</option>
              <option value={0}>January</option>
              <option value={1}>February</option>
              <option value={2}>March</option>
              <option value={3}>April</option>
              <option value={4}>May</option>
              <option value={5}>June</option>
              <option value={6}>July</option>
              <option value={7}>August</option>
              <option value={8}>September</option>
              <option value={9}>October</option>
              <option value={10}>November</option>
              <option value={11}>December</option>
            </select>
          </div>

          <div className="flex items-center space-x-4">
            <label htmlFor="year" className="text-xl font-semibold text-gray-700">Select Year:</label>
            <select
              id="year"
              className="p-2 border rounded-lg dark:bg-base-100 dark:text-base-content text-gray-700 focus:outline-none focus:ring focus:ring-blue-300"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            >
              {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-green-100 dark:bg-base-100 dark:text-base-content  shadow-lg rounded-lg p-6 hover:scale-105 transform transition-all duration-300">
            <h2 className="text-xl font-bold text-green-700 mb-2">Completed</h2>
            <p className="text-gray-600">Count: {totalCompleted}</p>
            <p className="text-gray-600">Total: ₹{totalCompletedAmount}</p>
          </div>

          <div className="bg-blue-100 shadow-lg dark:bg-base-100 dark:text-base-content  rounded-lg p-6 hover:scale-105 transform transition-all duration-300">
            <h2 className="text-xl font-bold text-blue-700 mb-2">Booked</h2>
            <p className="text-gray-600">Count: {totalBooked}</p>
            <p className="text-gray-600">Total: ₹{totalBookedAmount}</p>
          </div>

          <div className="bg-red-100 shadow-lg dark:bg-base-100 dark:text-base-content rounded-lg p-6 hover:scale-105 transform transition-all duration-300">
            <h2 className="text-xl font-bold text-red-700 mb-2">Cancelled</h2>
            <p className="text-gray-600">Count: {totalCancelled}</p>
            <p className="text-gray-600">Total: ₹{totalCancelledAmount}</p>
          </div>
        </div>

        {/* Booking Chart */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">Monthly Booking Trends</h2>
          <div className="p-4 dark:bg-base-100 dark:text-base-content bg-white shadow-lg rounded-lg">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Detailed Booking Sections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div className="bg-white shadow-lg rounded-lg p-6 animate-fadeInUp dark:bg-base-100 dark:text-base-content">
            <h2 className="text-xl font-bold text-center text-green-600 mb-4">Completed Bookings</h2>
            <div>
              {groupedBookings.completed.map((booking) => (
                <div key={booking._id} className="flex justify-between items-center mb-2">
                  <p className="text-gray-700 font-medium">{booking.carId.model}</p>
                  <p className="text-green-600 font-bold">₹{booking.totalAmountPaid}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6 animate-fadeInUp dark:bg-base-100 dark:text-base-content ">
            <h2 className="text-xl font-bold text-center text-blue-600 mb-4">Booked Bookings</h2>
            <div>
              {groupedBookings.booked.map((booking) => (
                <div key={booking._id} className="flex justify-between items-center mb-2">
                  <p className="text-gray-700 font-medium">{booking.carId.model}</p>
                  <p className="text-blue-600 font-bold">₹{booking.totalAmountPaid}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6 animate-fadeInUp dark:bg-base-100 dark:text-base-content">
            <h2 className="text-xl font-bold text-center text-red-600 mb-4">Cancelled Bookings</h2>
            <div>
              {groupedBookings.cancelled.map((booking) => (
                <div key={booking._id} className="flex justify-between items-center mb-2">
                  <p className="text-gray-700 font-medium">{booking.carId.model}</p>
                  <p className="text-red-600 font-bold">₹{booking.totalAmountPaid}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};