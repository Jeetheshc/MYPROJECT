import React from 'react'

function About() {
  return (
    <div className="bg-blue-100 text-blue-900 dark:bg-base-100 dark:text-base-content min-h-screen  flex flex-col items-center py-10 px-5">
      <div className="w-full max-w-4xl bg-base-100 text-base-content  rounded-lg shadow-lg p-6">
        {/* Header */}
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">About Us</h1>

        {/* Section: About the Car Rental Service */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold ">Our Mission</h2>
          <p className="mt-2 ">
            Welcome to our Car Rental service! We aim to provide a seamless and convenient car rental experience for all your travel needs. Whether you're exploring new destinations, commuting for work, or planning a family trip, our reliable vehicles ensure your journey is safe, comfortable, and enjoyable.
          </p>
        </section>

        {/* Section: Terms and Policies */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold ">Terms and Policies</h2>
          <ul className="mt-2  space-y-2 list-disc list-inside">
            <li>
              Booking Policy: All bookings should be made at least 24 hours in advance. Last-minute bookings are subject to availability.
            </li>
            <li>
              Payment Terms: Payments can be made online through secure gateways. Refunds are processed within 7 working days for eligible cancellations.
            </li>
            <li>
              Cancellation Policy: Free cancellation up to 48 hours before the reservation start time. Late cancellations may incur charges.
            </li>
            <li>
              Driver Requirements: Drivers must possess a valid driver's license and be at least 21 years old.
            </li>
            <li>
              Insurance: All vehicles are insured. Renters are responsible for any damages not covered by the insurance policy.
            </li>
            <li>
              Fuel Policy: Vehicles should be returned with the same fuel level as at the time of pickup. Additional fuel charges may apply otherwise.
            </li>
          </ul>
        </section>

        {/* Section: Headquarters */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold ">Headquarters</h2>
          <p className="mt-2 ">
            <strong>Address:</strong> Kasaragod, Kerala, India <br />
            <strong>Phone:</strong> +91 7994055880 <br />
            <strong>Email:</strong> jeetheshc@gmail.com
          </p>
        </section>

        {/* Section: Contact Us */}
        <section>
          <h2 className="text-xl font-semibold ">Contact Us</h2>
          <p className="mt-2 ">
            Have questions or need assistance? Reach out to us anytime! Our team is here to make your car rental experience smooth and hassle-free.
          </p>
        </section>
      </div>
    </div>
  )
}

export default About
