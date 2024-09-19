import { useState } from 'react';

import './App.css';
import Gauge from './Gauge.tsx';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="knobs">
        <Gauge
          minProp={20}
          maxProp={40}
          threshHoldsProp={{
            36: '#00ff00',
            26: '#0000ff',
            32: '#ff0000',
            0: '#FFFFFF',
          }}
          step={0.5}
          mouseDownProp={(value) => {
            console.log(value);
          }}
        />
        <Gauge
          minProp={0}
          maxProp={10}
          mouseDownProp={(value) => {
            console.log(value);
          }}
          threshHoldsProp={{
            9: '#00ff00',
            5: '#0000ff',
            3: '#ff0000',
            0: '#FAFAFA',
          }}
          step={1}
        />
        <Gauge
          minProp={10}
          maxProp={15}
          mouseDownProp={(value) => {
            console.log(value);
          }}
          threshHoldsProp={{
            90: '#00ff00',
            30: '#0000ff',
            50: '#ff0000',
            0: '#FAFAFA',
          }}
        />
      </div>
    </>
  );
}

export default App;
