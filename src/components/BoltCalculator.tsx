import React, { useState } from 'react';
import { calculateBoltSizes } from '../utils/boltCalculations';
import OrderTracker from './OrderTracker';

interface BoltResult {
  standard: string;
  size: string;
  diameterDeviation: number;
  lengthDeviation: number;
}

interface Order {
  id: number;
  standard: string;
  size: string;
  quantity: number;
  includesNuts: boolean;
  status: 'Pending' | 'Ordered' | 'Delivered';
  dateAdded: string;
}

const BoltCalculator: React.FC = () => {
  const [diameter, setDiameter] = useState<string>('');
  const [length, setLength] = useState<string>('');
  const [results, setResults] = useState<any | null>(null);
  const [selectedBolt, setSelectedBolt] = useState<BoltResult | null>(null);
  const [quantity, setQuantity] = useState<string>('1');
  const [includeNuts, setIncludeNuts] = useState<boolean>(false);
  const [newOrder, setNewOrder] = useState<Order | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const calculatedResults = calculateBoltSizes(
      parseFloat(diameter),
      parseFloat(length)
    );
    setResults(calculatedResults);
    setSelectedBolt(null);
  };

  const handleBoltSelection = (
    standard: string,
    size: string,
    diameterDeviation: number,
    lengthDeviation: number
  ) => {
    setSelectedBolt({ standard, size, diameterDeviation, lengthDeviation });
  };

  const formatDeviation = (deviation: number): string => {
    return deviation >= 0 ? `+${deviation.toFixed(2)}` : deviation.toFixed(2);
  };

  const handleQuantitySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedBolt) {
      const newOrderItem: Order = {
        id: Date.now(),
        standard: selectedBolt.standard,
        size: selectedBolt.size,
        quantity: parseInt(quantity),
        includesNuts: includeNuts,
        status: 'Pending',
        dateAdded: new Date().toISOString().split('T')[0],
      };
      setNewOrder(newOrderItem);

      // Construct Amazon search URL
      const searchQuery = `${selectedBolt.standard} ${selectedBolt.size} bolt${
        includeNuts ? ' with nuts' : ''
      } high-grade steel hex`;
      const amazonSearchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(
        searchQuery
      )}`;
      window.open(amazonSearchUrl, '_blank');
    }
  };

  return (
    <div className="bolt-calculator">
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="diameter">Diameter (mm):</label>
          <input
            type="number"
            id="diameter"
            value={diameter}
            onChange={(e) => setDiameter(e.target.value)}
            required
            step="0.01"
            min="0"
          />
        </div>
        <div className="input-group">
          <label htmlFor="length">Length (mm):</label>
          <input
            type="number"
            id="length"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            required
            step="0.01"
            min="0"
          />
        </div>
        <button type="submit">Calculate</button>
      </form>
      {results && (
        <div className="results">
          <h2>Suggested Bolt Sizes:</h2>
          <table>
            <thead>
              <tr>
                <th>Select</th>
                <th>Standard</th>
                <th>Size</th>
                <th>Diameter Deviation</th>
                <th>Length Deviation</th>
              </tr>
            </thead>
            <tbody>
              {['unf', 'unc', 'metric'].map((standard) => (
                <tr key={standard}>
                  <td>
                    <input
                      type="radio"
                      name="boltSelection"
                      onChange={() =>
                        handleBoltSelection(
                          standard.toUpperCase(),
                          results[standard as keyof typeof results],
                          results.deviations[
                            standard as keyof typeof results.deviations
                          ].diameter,
                          results.deviations[
                            standard as keyof typeof results.deviations
                          ].length
                        )
                      }
                      checked={
                        selectedBolt?.standard === standard.toUpperCase()
                      }
                    />
                  </td>
                  <td>{standard.toUpperCase()}</td>
                  <td>{results[standard as keyof typeof results]}</td>
                  <td>
                    {formatDeviation(
                      results.deviations[
                        standard as keyof typeof results.deviations
                      ].diameter
                    )}{' '}
                    mm
                  </td>
                  <td>
                    {formatDeviation(
                      results.deviations[
                        standard as keyof typeof results.deviations
                      ].length
                    )}{' '}
                    mm
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {selectedBolt && (
        <form onSubmit={handleQuantitySubmit} className="quantity-form">
          <h3>
            Selected Bolt: {selectedBolt.standard} {selectedBolt.size}
          </h3>
          <p>Specification: High-grade steel, hex bolt</p>
          <div className="form-row">
            <div className="input-group">
              <label htmlFor="quantity">Quantity:</label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                min="1"
              />
            </div>
            <div className="checkbox-container">
              <input
                type="checkbox"
                id="includeNuts"
                checked={includeNuts}
                onChange={(e) => setIncludeNuts(e.target.checked)}
              />
              <label htmlFor="includeNuts">Include nuts</label>
            </div>
          </div>
          <button type="submit">Search on Amazon</button>
        </form>
      )}
      <OrderTracker newOrder={newOrder} />
    </div>
  );
};

export default BoltCalculator;
