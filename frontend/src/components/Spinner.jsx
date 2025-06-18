import React from "react";

function Spinner() {
  return (
    <div className="flex justify-center items-center h-full my-16">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );
}

export default Spinner;
