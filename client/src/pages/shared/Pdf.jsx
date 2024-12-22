

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"

const formatDate = (date) => {
  const d = new Date(date);
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
};

export const generateBill = (booking) => {
  const doc = new jsPDF();
  const primaryColor = "#1E90FF"; // Blue color
  const secondaryColor = "#32CD32"; // Green color

  doc.setFontSize(16);
  doc.setTextColor(primaryColor);
  doc.text("CARENTO - Your ultimate car rental solution!", 105, 20, { align: "center" });

  doc.setFontSize(12);
  doc.setTextColor("#000000");
  doc.text("Headquarters: Manjeshwar, Kasaragod, Kerala - 671323", 105, 30, { align: "center" });
  doc.text("Phone: 7994055880 | Email: carentokerala@gmail.com", 105, 37, { align: "center" });

  doc.setDrawColor(primaryColor);
  doc.setLineWidth(1);
  doc.line(15, 42, 195, 42);

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor("#000000");
  doc.text("Invoice", 15, 50);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Invoice Date: ${formatDate(booking.bookingDate)}`, 15, 55);
  doc.text(`Invoice Number: ${booking._id}`, 15, 60);

  doc.setDrawColor("#000000");
  doc.setLineWidth(0.2);
  doc.rect(15, 65, 180, 40);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(secondaryColor);
  doc.text("Billing Address:", 20, 72);

  doc.setFont("helvetica", "normal");
  doc.setTextColor("#000000");
  doc.text(`Name: ${booking.userId.name}`, 20, 78);
  doc.text(`Email: ${booking.userId.email}`, 20, 84);
  doc.text(`Phone: ${booking.userId.phone}`, 20, 90);
  doc.text(`Address: ${booking.userId.address || "N/A"}`, 20, 96);

  doc.rect(15, 105, 180, 40);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(primaryColor);
  doc.text("Booking Details:", 20, 112);

  doc.setFont("helvetica", "normal");
  doc.setTextColor("#000000");
  doc.text(`Car: ${booking.carId.brand} ${booking.carId.model}`, 20, 118);
  doc.text(`Location: ${booking.location}`, 20, 124);
  doc.text(`From: ${formatDate(booking.fromDate)}`, 20, 130);
  doc.text(`To: ${formatDate(booking.toDate)}`, 20, 136);

  doc.setFont("helvetica", "bold");
  doc.text(`Total Amount Paid: ${booking.totalAmountPaid}`, 20, 142);

  doc.rect(15, 155, 180, 25);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(secondaryColor);
  doc.text("Payment Details:", 20, 162);

  doc.setFont("helvetica", "normal");
  doc.setTextColor("#000000");
  doc.text(`Payment Mode: ${booking.paymentMode}`, 20, 168);
  doc.text(`Payment Date: ${formatDate(booking.bookingDate)}`, 20, 174);

  const imgData = booking.carId.carImages[0];
  if (imgData) {
    doc.addImage(imgData, "JPEG", 150, 110, 40, 30);
  }

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("For Proprietor,", 160, 190, { align: "right" });
  doc.text("Carento Kerala", 160, 196, { align: "right" });

  doc.setFontSize(10);
  doc.setTextColor("#808080");
  doc.text("Thank you for choosing Carento!", 105, 210, { align: "center" });

  doc.save(`Invoice_${booking._id}.pdf`);
};

export const generateBookingReport = (bookings) => {
  const doc = new jsPDF();

  const completedBookings = bookings.filter((booking) => booking.status === "Completed");
  const bookedBookings = bookings.filter((booking) => booking.status === "Booked");
  const cancelledBookings = bookings.filter((booking) => booking.status === "Cancelled");

  const calculateTotal = (bookings) => bookings.reduce((sum, booking) => sum + booking.totalAmountPaid, 0);
  const totalCompleted = calculateTotal(completedBookings);
  const totalBooked = calculateTotal(bookedBookings);
  const totalCancelled = calculateTotal(cancelledBookings);
  const grandTotal = totalCompleted + totalBooked;

  doc.setFontSize(16);
  doc.setTextColor("#1E90FF");
  doc.text("CARENTO - Booking Report", 105, 20, { align: "center" });

  doc.setFontSize(12);
  doc.setTextColor("#000000");
  doc.text(`Report Date: ${formatDate(new Date())}`, 105, 30, { align: "center" });

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Sl. No.", 15, 50);
  doc.text("Booking Date", 40, 50);
  doc.text("From Date", 75, 50);
  doc.text("To Date", 105, 50);
  doc.text("Car Brand & Model", 130, 50);
  doc.text("Total Payment", 175, 50);
  doc.text("Status", 210, 50);

  const addBookingToTable = (bookings, startY) => {
    let y = startY;
    bookings.forEach((booking, index) => {
      doc.setFont("helvetica", "normal");
      doc.text(`${index + 1}`, 15, y);
      doc.text(formatDate(booking.bookingDate), 40, y);
      doc.text(formatDate(booking.fromDate), 75, y);
      doc.text(formatDate(booking.toDate), 105, y);
      doc.text(`${booking.carId.brand} ${booking.carId.model}`, 130, y);
      doc.text(`Rs. ${booking.totalAmountPaid}`, 175, y);
      doc.text(booking.status, 210, y);
      y += 8;
    });
    return y;
  };

  doc.setFont("helvetica", "bold");
  doc.text("Completed Bookings", 15, 60);
  doc.setFont("helvetica", "normal");
  let y = 70;
  y = addBookingToTable(completedBookings, y);
  doc.text(`Grand Total: Rs. ${totalCompleted}`, 15, y);

  doc.setFont("helvetica", "bold");
  doc.text("Booked Bookings", 15, y + 10);
  doc.setFont("helvetica", "normal");
  y += 20;
  y = addBookingToTable(bookedBookings, y);
  doc.text(`Grand Total: Rs. ${totalBooked}`, 15, y);

  doc.setFont("helvetica", "bold");
  doc.text("Cancelled Bookings", 15, y + 10);
  doc.setFont("helvetica", "normal");
  y += 20;
  y = addBookingToTable(cancelledBookings, y);
  doc.text(`Grand Total: Rs. ${totalCancelled}`, 15, y);

  doc.setFont("helvetica", "bold");
  doc.text(`Grand Total: Rs. ${grandTotal}`, 15, y + 10);

  doc.save("Booking_Report.pdf");
};

export const generateCarWiseBookingReport = (bookings) => {
    const doc = new jsPDF();
    const primaryColor = "#1E90FF"; // Blue for headers
    const secondaryColor = "#32CD32"; // Green for totals
  
    // Group bookings by car
    const filterBookingsByCar = (bookings) => {
      const carMap = new Map();
      bookings.forEach((booking) => {
        const car = booking.carId;
        if (!carMap.has(car._id)) {
          carMap.set(car._id, []);
        }
        carMap.get(car._id).push(booking);
      });
      return carMap;
    };
  
    const carBookings = filterBookingsByCar(bookings);
  
    let grandTotalBooked = 0;
    let grandTotalCompleted = 0;
  
    carBookings.forEach((bookings, carId) => {
      const car = bookings[0].carId;
  
      // Header for the car
      doc.setFontSize(14);
      doc.setTextColor(primaryColor);
      doc.text(`Bookings for ${car.brand} ${car.model} (${car.year})`, 105, doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : 20, { align: "center" });
  
      // Table data
      const headers = [
        "Booking Date",
        "From Date",
        "To Date",
        "User Name",
        "Mobile",
        "Payment Mode",
        "Status",
        "Total Paid (Rs.)",
      ];
  
      const rows = bookings.map((booking) => [
        new Date(booking.bookingDate).toLocaleDateString(),
        new Date(booking.fromDate).toLocaleDateString(),
        new Date(booking.toDate).toLocaleDateString(),
        booking.userId.name,
        booking.userId.phone,
        booking.paymentMode,
        booking.status,
        booking.totalAmountPaid.toLocaleString(),
      ]);
  
      autoTable(doc, {
        head: [headers],
        body: rows,
        startY: doc.lastAutoTable ? doc.lastAutoTable.finalY + 30 : 30,
      });
  
      // Calculate totals for "Booked" and "Completed" statuses
      const totalBooked = bookings
        .filter((booking) => booking.status === "Booked")
        .reduce((total, booking) => total + booking.totalAmountPaid, 0);
  
      const totalCompleted = bookings
        .filter((booking) => booking.status === "Completed")
        .reduce((total, booking) => total + booking.totalAmountPaid, 0);
  
      grandTotalBooked += totalBooked;
      grandTotalCompleted += totalCompleted;
  
      // Add totals for this car
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(secondaryColor);
      doc.text(
        `Total Booked: Rs. ${totalBooked.toLocaleString()} | Total Completed: Rs. ${totalCompleted.toLocaleString()}`,
        20,
        doc.lastAutoTable.finalY + 10
      );
    });
  
    // Add Grand Totals on a new page
    doc.addPage();
    doc.setFontSize(14);
    doc.setTextColor(primaryColor);
    doc.text("Grand Totals for All Cars", 105, 20, { align: "center" });
  
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor("#000000");
    doc.text(`Total Booked: Rs. ${grandTotalBooked.toLocaleString()}`, 20, 40);
    doc.text(`Total Completed: Rs. ${grandTotalCompleted.toLocaleString()}`, 20, 50);
  
    // Save the PDF
    doc.save("Car_Wise_Booking_Report.pdf");
  };