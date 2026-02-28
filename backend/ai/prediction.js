// backend/ai/prediction.js

function moodPrediction(last14DaysAvg, last30DaysAvg) {
  if (last14DaysAvg < last30DaysAvg) {
    return {
      warning: true,
      message: "Downward sentiment trend detected over last 14 days."
    };
  }

  return {
    warning: false
  };
}

module.exports = moodPrediction;