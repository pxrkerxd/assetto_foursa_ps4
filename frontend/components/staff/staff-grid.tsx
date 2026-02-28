"use client"

import { StaffProfile } from "./staff-profile"

const staffMembers = [
  {
    name: "Rahul Sharma",
    role: "Senior Server",
    branch: "Koramangala, Bangalore",
    avatar: "RS",
    kudosScore: 92,
    totalMentions: 47,
    avgSentiment: 94,
    recentMentions: [
      {
        text: "Rahul was very attentive and made our anniversary special.",
        source: "Google",
        rating: 5,
      },
      {
        text: "Great service by Rahul, very knowledgeable about the menu.",
        source: "Zomato",
        rating: 5,
      },
      {
        text: "Rahul remembered our preferences from last visit. Impressive!",
        source: "Google",
        rating: 4,
      },
    ],
    sentimentTrend: [85, 88, 92, 90, 95, 91, 94],
  },
  {
    name: "Anita Desai",
    role: "Floor Manager",
    branch: "Bandra West, Mumbai",
    avatar: "AD",
    kudosScore: 87,
    totalMentions: 38,
    avgSentiment: 89,
    recentMentions: [
      {
        text: "Anita handled our large group booking perfectly.",
        source: "Google",
        rating: 5,
      },
      {
        text: "The manager Anita quickly resolved our billing issue.",
        source: "Zomato",
        rating: 4,
      },
      {
        text: "Anita suggested the perfect wine pairing for our meal.",
        source: "Google",
        rating: 5,
      },
    ],
    sentimentTrend: [82, 85, 84, 88, 90, 87, 89],
  },
  {
    name: "Deepak Kumar",
    role: "Head Chef",
    branch: "Connaught Place, Delhi",
    avatar: "DK",
    kudosScore: 76,
    totalMentions: 29,
    avgSentiment: 78,
    recentMentions: [
      {
        text: "Chef Deepak came to our table and explained the tasting menu beautifully.",
        source: "Google",
        rating: 5,
      },
      {
        text: "The specials by Deepak were hit or miss today.",
        source: "Zomato",
        rating: 3,
      },
      {
        text: "Deepak's butter chicken is still the best in Delhi.",
        source: "Google",
        rating: 5,
      },
    ],
    sentimentTrend: [72, 68, 75, 70, 78, 80, 78],
  },
  {
    name: "Sunita Patel",
    role: "Server",
    branch: "T. Nagar, Chennai",
    avatar: "SP",
    kudosScore: 62,
    totalMentions: 18,
    avgSentiment: 65,
    recentMentions: [
      {
        text: "Sunita was helpful but seemed overwhelmed during rush hour.",
        source: "Zomato",
        rating: 3,
      },
      {
        text: "Our server Sunita mixed up our orders twice.",
        source: "Google",
        rating: 2,
      },
      {
        text: "Sunita was very friendly and took care of our kids.",
        source: "Google",
        rating: 4,
      },
    ],
    sentimentTrend: [58, 55, 60, 65, 62, 68, 65],
  },
]

export function StaffGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {staffMembers.map((staff) => (
        <StaffProfile key={staff.name} staff={staff} />
      ))}
    </div>
  )
}
