import React, { useState, useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Download, Trash2, Plus, Search, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const CSVEditor = () => {
  const [csvData, setCsvData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState({});

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target.result;
      const rows = text.split('\n').map(row => row.split(','));
      setHeaders(rows[0]);
      setCsvData(rows.slice(1).filter(row => row.some(cell => cell.trim() !== '')));
      toast.success('CSV file uploaded successfully!');
    };

    reader.readAsText(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: '.csv' });

  const handleCellEdit = (rowIndex, columnIndex, value) => {
    const newData = [...csvData];
    newData[rowIndex][columnIndex] = value;
    setCsvData(newData);
    validateCell(rowIndex, columnIndex, value);
  };

  const validateCell = (rowIndex, columnIndex, value) => {
    const newErrors = { ...errors };
    const header = headers[columnIndex].toLowerCase();

    if (header.includes('email') && !isValidEmail(value)) {
      newErrors[`${rowIndex}-${columnIndex}`] = 'Invalid email format';
    } else if (header.includes('date') && !isValidDate(value)) {
      newErrors[`${rowIndex}-${columnIndex}`] = 'Invalid date format (YYYY-MM-DD)';
    } else {
      delete newErrors[`${rowIndex}-${columnIndex}`];
    }

    setErrors(newErrors);
  };

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const isValidDate = (date) => {
    return /^\d{4}-\d{2}-\d{2}$/.test(date);
  };

  const addRow = () => {
    setCsvData([...csvData, new Array(headers.length).fill('')]);
    toast.success('New row added!');
  };

  const deleteRow = (index) => {
    const newData = csvData.filter((_, i) => i !== index);
    setCsvData(newData);
    toast.success('Row deleted successfully!');
  };

  const downloadCSV = () => {
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'csv_master_edited.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('CSV file downloaded successfully!');
    }
  };

  const filteredData = useMemo(() => {
    return csvData.filter(row =>
      row.some(cell =>
        cell.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [csvData, searchTerm]);

  return (
    <div className="container mx-auto p-4">
      <div {...getRootProps()} className="border-2 border-dashed border-gray-300 p-8 mb-6 text-center cursor-pointer rounded-lg hover:border-gray-400 transition-colors">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-lg">Drop the CSV file here ...</p>
        ) : (
          <div>
            <p className="text-lg mb-2">Drag 'n' drop a CSV file here, or click to select one</p>
            <p className="text-sm text-gray-500">Supported file type: .csv</p>
          </div>
        )}
      </div>

      {csvData.length > 0 ? (
        <>
          <div className="mb-4 flex items-center">
            <Search className="mr-2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search data..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow"
            />
          </div>

          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  {headers.map((header, index) => (
                    <TableHead key={index} className="font-bold">{header}</TableHead>
                  ))}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Input
                          value={cell}
                          onChange={(e) => handleCellEdit(rowIndex, cellIndex, e.target.value)}
                          className={`w-full ${errors[`${rowIndex}-${cellIndex}`] ? 'border-red-500' : ''}`}
                        />
                        {errors[`${rowIndex}-${cellIndex}`] && (
                          <p className="text-xs text-red-500 mt-1">{errors[`${rowIndex}-${cellIndex}`]}</p>
                        )}
                      </TableCell>
                    ))}
                    <TableCell>
                      <Button variant="destructive" size="sm" onClick={() => deleteRow(rowIndex)}>
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-6 flex justify-between">
            <Button onClick={addRow} variant="outline">
              <Plus className="mr-2 h-4 w-4" /> Add Row
            </Button>
            <Button onClick={downloadCSV} variant="default">
              <Download className="mr-2 h-4 w-4" /> Download CSV
            </Button>
          </div>

          {Object.keys(errors).length > 0 && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                There are validation errors in your data. Please correct them before downloading.
              </AlertDescription>
            </Alert>
          )}
        </>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">No CSV data loaded</h3>
          <p className="text-gray-600">Upload a CSV file to start editing</p>
        </div>
      )}
    </div>
  );
};

export default CSVEditor;