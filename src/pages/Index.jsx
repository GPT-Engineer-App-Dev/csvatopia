import React from 'react';
import CSVEditor from '../components/CSVEditor';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold mb-4 text-center">CSV Master: Edit, Add, and Download</h1>
        <p className="text-xl text-center mb-8 text-gray-600">Your all-in-one tool for managing CSV files in the browser</p>
        <CSVEditor />
      </div>
    </div>
  );
};

export default Index;