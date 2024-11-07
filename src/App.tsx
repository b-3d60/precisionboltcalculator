// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import './App.css';
import BoltCalculator from './components/BoltCalculator';

function App() {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setError(event.error);
    };

    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);

  if (error) {
    return (
      <div className="error-display">
        <h1>An error occurred:</h1>
        <pre>{error.message}</pre>
        <pre>{error.stack}</pre>
      </div>
    );
  }

  return (
    <div className="App">
      <header>
        <h1>Precision Bolt Calculator</h1>
        <p>Engineered for Excellence</p>
      </header>
      <main>
        <BoltCalculator />
      </main>
      <footer>
        <p>&copy; 2024 Whooly Hat Racing. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
