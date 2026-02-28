// backend/ai/anomaly.js

function detectAnomaly(newRating, historicalAverage) {
  const difference = Math.abs(newRating - historicalAverage);

  if (difference >= 2) {
    return {
      anomaly: true,
      message: "Rating deviates significantly from 90-day average"
    };
  }

  return {
    anomaly: false
  };
}

module.exports = detectAnomaly;