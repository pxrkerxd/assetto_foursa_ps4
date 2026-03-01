// backend/ai/responseGenerator.js

function generateReplies(review) {
  const comment = review.comment;

  return {
    professional: `Thank you for your feedback. We truly value your input and will address the concerns mentioned regarding "${comment}".`,

    empathetic: `We're really sorry to hear about your experience. Your feedback helps us improve, and we will make sure this is looked into immediately.`,

    enthusiastic: `Thank you so much for sharing your experience! We're excited to keep improving and hope to serve you even better next time!`
  };
}

module.exports = generateReplies;