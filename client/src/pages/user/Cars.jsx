import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../config/axiosInstance";
import { Card } from "../../components/user/Card";
import { ProductSkelton } from "../../components/user/Skelton";

// Helper function to format date to dd/mm/yyyy
const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

// Helper function to convert dd/mm/yyyy to yyyy-mm-dd
const convertToDateFormat = (date) => {
  if (!date) return "";
  const [day, month, year] = date.split("/");
  return `${year}-${month}-${day}`;
};

export const Cars = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locations, setLocations] = useState([]); // For location list
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    location: "",
  });

  // Fetch cars and locations on component mount
  useEffect(() => {
    const fetchCarsAndLocations = async () => {
      try {
        const carsResponse = await axiosInstance.get("car/cars");
        const locationsResponse = await axiosInstance.get("car/locations");

        setCars(carsResponse.data.data);
        setFilteredCars(carsResponse.data.data);
        setLocations(locationsResponse.data.data); // Store locations
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchCarsAndLocations();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => {
      if (name === "fromDate" || name === "toDate") {
        // Reformat date to dd/mm/yyyy for display
        const formattedDate = value ? formatDate(new Date(value)) : "";
        return { ...prev, [name]: formattedDate };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleFilter = async () => {
    const { fromDate, toDate, location } = filters;

    if (!fromDate || !toDate) {
      alert("Please select both from and to dates.");
      return;
    }

    try {
      // Convert fromDate and toDate to yyyy-mm-dd before sending to backend
      const formattedFromDate = convertToDateFormat(fromDate);
      const formattedToDate = convertToDateFormat(toDate);

      const response = await axiosInstance.post("bookings/available-cars", {
        fromDate: formattedFromDate,
        toDate: formattedToDate,
        location,
      });
      setFilteredCars(response.data.data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    
    <div className="p-4">
      
      <div className="mb-6">
        
        <h1 className="text-xl font-bold mb-4">Search Cars</h1>
        <div className="flex gap-4 flex-wrap">
          <input
            type="date"
            name="fromDate"
            value={filters.fromDate ? convertToDateFormat(filters.fromDate) : ""} // Convert dd/mm/yyyy to yyyy-mm-dd for the input
            min={new Date().toISOString().split("T")[0]}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          />
          <input
            type="date"
            name="toDate"
            value={filters.toDate ? convertToDateFormat(filters.toDate) : ""} // Convert dd/mm/yyyy to yyyy-mm-dd for the input
            min={filters.fromDate ? convertToDateFormat(filters.fromDate) : new Date().toISOString().split("T")[0]}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          />
          <select
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          >
            <option value="">Select Location</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          <button
            onClick={handleFilter}
            className="btn btn-primary bg-blue-600 text-white p-2 rounded"
          >
            Search
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-6">
        {isLoading ? (
          <ProductSkelton />
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : filteredCars.length > 0 ? (
          filteredCars.map((value) => (
            <Card
              key={value._id}
              cars={value}
              bookingDetails={{
                fromDate: filters.fromDate,
                toDate: filters.toDate,
                location: filters.location,
              }}
            />
          ))
        ) : (
          <p className="text-red-700" >No cars available for the selected Date.</p>
        )}
      </div>
    </div>
  );
};
