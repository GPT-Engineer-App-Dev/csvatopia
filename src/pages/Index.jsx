import React from 'react';
import CSVEditor from '../components/CSVEditor';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto py-6">
          <h1 className="text-4xl font-bold text-center text-gray-800">CSV Master</h1>
          <p className="text-xl text-center mt-2 text-gray-600">Edit, Add, and Download CSV files with ease</p>
        </div>
      </header>
      <main className="container mx-auto py-8">
        <section className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">How to use CSV Master</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Upload your CSV file by dragging and dropping or clicking the upload area.</li>
            <li>Edit cell values directly in the table. The tool will validate email and date formats.</li>
            <li>Use the search bar to filter data across all columns.</li>
            <li>Add new rows using the "Add Row" button.</li>
            <li>Delete rows with the "Delete" button on each row.</li>
            <li>When finished, click "Download CSV" to save your changes.</li>
          </ol>
        </section>
        <section className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Features</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Data validation for email and date formats</li>
            <li>Real-time search functionality across all columns</li>
            <li>Responsive design for various screen sizes</li>
            <li>User-friendly notifications for actions</li>
            <li>Error highlighting and warnings for invalid data</li>
          </ul>
        </section>
        <CSVEditor />
      </main>
    </div>
  );
};

export default Index;