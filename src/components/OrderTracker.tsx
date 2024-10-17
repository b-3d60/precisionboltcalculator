import React, { useState, useEffect } from 'react';
import { CSVLink } from 'react-csv';

interface Order {
  id: number;
  standard: string;
  size: string;
  quantity: number;
  includesNuts: boolean;
  status: 'Pending' | 'Ordered' | 'Delivered';
  dateAdded: string;
}

interface OrderTrackerProps {
  newOrder: Order | null;
}

interface FilterState {
  standard: string;
  status: string;
}

const OrderTracker: React.FC<OrderTrackerProps> = ({ newOrder }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<FilterState>({ standard: '', status: '' });
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (newOrder) {
      setOrders(prevOrders => [...prevOrders, newOrder]);
    }
  }, [newOrder]);

  useEffect(() => {
    const filtered = orders.filter(order => 
      (filter.standard === '' || order.standard === filter.standard) &&
      (filter.status === '' || order.status === filter.status)
    );
    setFilteredOrders(filtered);
  }, [orders, filter]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilter(prevFilter => ({ ...prevFilter, [name]: value }));
  };

  const handleStatusChange = (id: number, newStatus: 'Pending' | 'Ordered' | 'Delivered') => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <div className="order-tracker">
      <h2>Order Tracker</h2>
      <div className="filter-controls">
        <select name="standard" onChange={handleFilterChange} value={filter.standard}>
          <option value="">All Standards</option>
          <option value="UNF">UNF</option>
          <option value="UNC">UNC</option>
          <option value="METRIC">METRIC</option>
        </select>
        <select name="status" onChange={handleFilterChange} value={filter.status}>
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Ordered">Ordered</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Standard</th>
            <th>Size</th>
            <th>Quantity</th>
            <th>Includes Nuts</th>
            <th>Status</th>
            <th>Date Added</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map(order => (
            <tr key={order.id}>
              <td data-label="ID">{order.id}</td>
              <td data-label="Standard">{order.standard}</td>
              <td data-label="Size">{order.size}</td>
              <td data-label="Quantity">{order.quantity}</td>
              <td data-label="Includes Nuts">{order.includesNuts ? 'Yes' : 'No'}</td>
              <td data-label="Status">{order.status}</td>
              <td data-label="Date Added">{order.dateAdded}</td>
              <td data-label="Action">
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value as 'Pending' | 'Ordered' | 'Delivered')}
                >
                  <option value="Pending">Pending</option>
                  <option value="Ordered">Ordered</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <CSVLink
        data={filteredOrders}
        filename={"bolt_orders.csv"}
        className="export-button"
        target="_blank"
      >
        Export to CSV
      </CSVLink>
    </div>
  );
};

export default OrderTracker;