// backend/ai/validation.js

const redFlagWords = ["poisoning", "lawsuit", "racist", "mold", "injury"];

function validateReview(review) {
  let flags = [];

  // Basic spam detection
  if (review.comment.length < 5) {
    flags.push("Comment too short");
  }

  // Repetition detection (aaaaaa or !!!!!)
  if (/(.)\1{5,}/.test(review.comment)) {
    flags.push("Suspicious repetition pattern");
  }

  // Red flag keyword detection
  redFlagWords.forEach((word) => {
    if (review.comment.toLowerCase().includes(word)) {
      flags.push(`Critical keyword detected: ${word}`);
    }
  });

  return {
    isValid: flags.length === 0,
    flags
  };
}

module.exports = validateReview;