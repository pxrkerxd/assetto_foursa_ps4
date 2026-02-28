// backend/ai/sentiment.js

function analyzeSentiment(review) {
  const text = review.comment.toLowerCase();

  let scores = {
    food: 50,
    service: 50,
    price: 50,
    ambiance: 50
  };

  if (text.includes("delicious") || text.includes("tasty")) {
    scores.food += 30;
  }

  if (text.includes("slow") || text.includes("rude")) {
    scores.service -= 30;
  }

  if (text.includes("expensive")) {
    scores.price -= 20;
  }

  if (text.includes("beautiful") || text.includes("clean")) {
    scores.ambiance += 20;
  }

  return scores;
}

module.exports = analyzeSentiment;