// src/components/Table.jsx
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Table = ({ columns, data, onRowClick }) => {
  return (
    <table className="table table-hover table-success" style={{ borderRadius: '6px', overflow: 'hidden' }}>
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th key={index}>{column.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index} onClick={() => onRowClick && onRowClick(row)}>
            {columns.map((column, columnIndex) => (
              <td key={columnIndex}>
                {column.render ? column.render(row[column.field], row) : row[column.field]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;