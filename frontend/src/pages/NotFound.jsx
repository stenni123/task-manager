import React from "react";
import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

function NotFound() {
  return (
    <div className="text-center mt-20">
      <FaExclamationTriangle className="text-yellow-400 text-6xl mx-auto mb-4" />
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="text-2xl font-light text-gray-600 mb-6">Page Not Found</p>
      <p className="text-gray-500 mb-8">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
      >
        Go Back Home
      </Link>
    </div>
  );
}

export default NotFound;
