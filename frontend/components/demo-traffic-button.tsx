"use client"

import { useState } from "react"
import { Rocket } from "lucide-react"

export function DemoTrafficButton() {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState("")

  const injectDemoData = async () => {
    setLoading(true)
    setStatus("Simulating Live Traffic...")

    // A mix of reviews to make your charts look highly active
    const dummyReviews = [
      { 
        author: "Demo Judge 1", platform: "Micro-Survey", rating: 5, 
        text: "The taste was absolutely amazing at the Navi Mumbai branch! Best service.", 
        branch: "Navi Mumbai",
        sentimentScore: 92, // The AI score!
        tags: ["Taste", "Service"], // The NLP tags!
        isAnomaly: false 
      },
      { 
        author: "Demo Judge 2", platform: "Google", rating: 2, 
        text: "Wait time was way too long at Nerul. Food was cold.", 
        branch: "Nerul",
        sentimentScore: 30, 
        tags: ["Wait time", "Cold Food"], 
        isAnomaly: false 
      },
      { 
        author: "Demo Judge 3", platform: "Zomato", rating: 4, 
        text: "Great vibe and perfect hygiene. Will visit again.", 
        branch: "Seawoods",
        sentimentScore: 85, 
        tags: ["Vibe", "Hygiene"], 
        isAnomaly: false 
      },
      { 
        author: "Demo Judge 4", platform: "Yelp", rating: 5, 
        text: "Staff was very polite at Nerul, food quality is top notch.", 
        branch: "Nerul",
        sentimentScore: 95, 
        tags: ["Staff", "Food Quality"], 
        isAnomaly: false 
      },
      { 
        author: "Spam Bot", platform: "Direct", rating: 1, 
        text: "FREE COUPONS CLICK HERE FREE FREE FREE", 
        branch: "Navi Mumbai",
        sentimentScore: 10, 
        tags: ["Spam", "Coupons"], 
        isAnomaly: true // Triggers the anomaly counter!
      }
    ]

    try {
      for (const review of dummyReviews) {
        await fetch('http://localhost:5000/api/reviews/direct', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(review)
        });
        // Tiny delay so the backend processes them properly
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      setStatus("✅ 5 Reviews Injected!")
      setTimeout(() => setStatus(""), 4000) // Reset after 4 seconds
    } catch (error) {
      console.error(error)
      setStatus("❌ Error injecting data")
    }
    
    setLoading(false)
  }

  return (
    <button
      onClick={injectDemoData}
      disabled={loading}
      className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/30 transition-all active:scale-95 disabled:opacity-50"
    >
      <Rocket className="h-4 w-4" />
      {status || "Inject Live Traffic"}
    </button>
  )
}