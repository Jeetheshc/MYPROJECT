import React from "react";

export const Contact = () => {
  return (
    <div className="bg-blue-100 text-blue-900 dark:bg-base-100 dark:text-base-content min-h-screen">
      <header className="p-6">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Contact Us</h1>
      </header>

      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="shadow-lg p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
            <p className="mb-4">
              We’re here to help! Reach out to us anytime, and we’ll happily
              answer your questions.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center">

                jeetheshc@gmail.com
              </li>
              <li className="flex items-center">

                +91 7994955880
              </li>
              <li className="flex items-center">

                Kasaragod, kerala, India
              </li>
            </ul>
          </div>

          {/* Contact Form */}
          <div className="shadow-lg p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Send Us a Message</h2>
            <form>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block mb-1"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder="Your Name"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block mb-1"
                >
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder="xyz@example.com"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="message"
                  className="block mb-1"
                >
                  Your Message
                </label>
                <textarea
                  id="message"
                  rows="5"
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder="Your message here..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="px-6 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
  


    </div>
  );
};
