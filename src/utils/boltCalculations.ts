interface BoltSizes {
  unf: string;
  unc: string;
  metric: string;
  deviations: {
    unf: { diameter: number; length: number };
    unc: { diameter: number; length: number };
    metric: { diameter: number; length: number };
  };
}

const unfSizes = [
  { size: '#0', diameter: 1.524 },
  { size: '#1', diameter: 1.854 },
  { size: '#2', diameter: 2.184 },
  { size: '#3', diameter: 2.515 },
  { size: '#4', diameter: 2.845 },
  { size: '#5', diameter: 3.175 },
  { size: '#6', diameter: 3.505 },
  { size: '#8', diameter: 4.166 },
  { size: '#10', diameter: 4.826 },
  { size: '1/4"', diameter: 6.35 },
  { size: '5/16"', diameter: 7.938 },
  { size: '3/8"', diameter: 9.525 },
  { size: '7/16"', diameter: 11.113 },
  { size: '1/2"', diameter: 12.7 },
  { size: '9/16"', diameter: 14.288 },
  { size: '5/8"', diameter: 15.875 },
  { size: '3/4"', diameter: 19.05 },
  { size: '7/8"', diameter: 22.225 },
  { size: '1"', diameter: 25.4 },
];

const uncSizes = [
  { size: '#0', diameter: 1.524 },
  { size: '#1', diameter: 1.854 },
  { size: '#2', diameter: 2.184 },
  { size: '#3', diameter: 2.515 },
  { size: '#4', diameter: 2.845 },
  { size: '#5', diameter: 3.175 },
  { size: '#6', diameter: 3.505 },
  { size: '#8', diameter: 4.166 },
  { size: '#10', diameter: 4.826 },
  { size: '1/4"', diameter: 6.35 },
  { size: '5/16"', diameter: 7.938 },
  { size: '3/8"', diameter: 9.525 },
  { size: '7/16"', diameter: 11.113 },
  { size: '1/2"', diameter: 12.7 },
  { size: '9/16"', diameter: 14.288 },
  { size: '5/8"', diameter: 15.875 },
  { size: '3/4"', diameter: 19.05 },
  { size: '7/8"', diameter: 22.225 },
  { size: '1"', diameter: 25.4 },
];

const metricSizes = [
  { size: 'M1', diameter: 1 },
  { size: 'M1.2', diameter: 1.2 },
  { size: 'M1.6', diameter: 1.6 },
  { size: 'M2', diameter: 2 },
  { size: 'M2.5', diameter: 2.5 },
  { size: 'M3', diameter: 3 },
  { size: 'M4', diameter: 4 },
  { size: 'M5', diameter: 5 },
  { size: 'M6', diameter: 6 },
  { size: 'M8', diameter: 8 },
  { size: 'M10', diameter: 10 },
  { size: 'M12', diameter: 12 },
  { size: 'M16', diameter: 16 },
  { size: 'M20', diameter: 20 },
  { size: 'M24', diameter: 24 },
  { size: 'M30', diameter: 30 },
  { size: 'M36', diameter: 36 },
  { size: 'M42', diameter: 42 },
  { size: 'M48', diameter: 48 },
];

const standardLengths = [3, 4, 5, 6, 8, 10, 12, 16, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];

function findClosestSize(diameter: number, sizes: { size: string; diameter: number }[]): { size: string; diameter: number } {
  let closestSize = sizes[0];
  let minDifference = Math.abs(diameter - sizes[0].diameter);

  for (const size of sizes) {
    const difference = Math.abs(diameter - size.diameter);
    if (difference < minDifference) {
      minDifference = difference;
      closestSize = size;
    }
  }

  return closestSize;
}

function findNextLongerLength(length: number): number {
  return standardLengths.find(stdLength => stdLength > length) || standardLengths[standardLengths.length - 1];
}

export function calculateBoltSizes(diameter: number, length: number): BoltSizes {
  const unfResult = findClosestSize(diameter, unfSizes);
  const uncResult = findClosestSize(diameter, uncSizes);
  const metricResult = findClosestSize(diameter, metricSizes);

  const nextLongerLength = findNextLongerLength(length);

  return {
    unf: `${unfResult.size}-${nextLongerLength}`,
    unc: `${uncResult.size}-${nextLongerLength}`,
    metric: `${metricResult.size}x${nextLongerLength}`,
    deviations: {
      unf: {
        diameter: Number((unfResult.diameter - diameter).toFixed(3)),
        length: nextLongerLength - length,
      },
      unc: {
        diameter: Number((uncResult.diameter - diameter).toFixed(3)),
        length: nextLongerLength - length,
      },
      metric: {
        diameter: Number((metricResult.diameter - diameter).toFixed(3)),
        length: nextLongerLength - length,
      },
    },
  };
}