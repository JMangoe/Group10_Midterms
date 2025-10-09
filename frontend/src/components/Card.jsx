import React from 'react';

const Card = ({ title, children, className = '' }) => {
  return (
    <div className={`w-full max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl ${className}`}>
      {title && (
        <div className="bg-blue-600 p-4">
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
      )}
      <div className="p-8">
        {children}
      </div>
    </div>
  );
};

export default Card;
