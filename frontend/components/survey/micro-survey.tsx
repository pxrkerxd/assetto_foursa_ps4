"use client"

import { useState, useEffect, useCallback } from "react"
import { Star, UtensilsCrossed, Sparkles, Music, Gift, ChevronRight, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

type Step = "rating" | "feedback" | "reward"

const feedbackOptions = [
  { label: "Taste", icon: UtensilsCrossed },
  { label: "Service", icon: Sparkles },
  { label: "Vibe", icon: Music },
]

function ConfettiPiece({ delay, left }: { delay: number; left: number }) {
  const colors = [
    "bg-emerald",
    "bg-amber",
    "bg-coral",
    "bg-primary",
  ]
  const color = colors[Math.floor(Math.random() * colors.length)]

  return (
    <div
      className={cn("absolute h-2 w-2 rounded-sm animate-confetti", color)}
      style={{
        left: `${left}%`,
        animationDelay: `${delay}ms`,
        top: 0,
      }}
    />
  )
}

export function MicroSurvey() {
  const [step, setStep] = useState<Step>("rating")
  const [rating, setRating] = useState(0)
  const [hoveredStar, setHoveredStar] = useState(0)
  const [selectedFeedback, setSelectedFeedback] = useState<string[]>([])
  const [showConfetti, setShowConfetti] = useState(false)

  const handleRatingSelect = useCallback((star: number) => {
    setRating(star)
    setTimeout(() => {
      setStep("feedback")
    }, 400)
  }, [])

  const handleSubmitFeedback = useCallback(() => {
    setStep("reward")
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 2000)
  }, [])

  const handleReset = useCallback(() => {
    setStep("rating")
    setRating(0)
    setHoveredStar(0)
    setSelectedFeedback([])
    setShowConfetti(false)
  }, [])

  const toggleFeedback = (label: string) => {
    setSelectedFeedback((prev) =>
      prev.includes(label) ? prev.filter((f) => f !== label) : [...prev, label]
    )
  }

  const ratingLabel = (r: number) => {
    if (r >= 5) return "We love hearing that!"
    if (r >= 4) return "Glad you enjoyed it!"
    if (r >= 3) return "Thanks for visiting!"
    if (r >= 2) return "We can do better!"
    if (r >= 1) return "Sorry to hear that"
    return "How was your experience?"
  }

  return (
    <div className="relative w-full max-w-sm">
      {/* Phone Frame */}
      <div className="overflow-hidden rounded-[2.5rem] border-2 border-border bg-card shadow-2xl">
        {/* Status Bar */}
        <div className="flex items-center justify-between bg-card px-6 py-3">
          <span className="text-xs font-medium text-muted-foreground">9:41</span>
          <div className="flex gap-1">
            <div className="h-2 w-4 rounded-sm bg-muted-foreground/50" />
            <div className="h-2 w-2 rounded-full bg-muted-foreground/50" />
            <div className="h-2 w-3 rounded-sm bg-emerald" />
          </div>
        </div>

        {/* Content */}
        <div className="relative min-h-[520px] px-6 pb-8 pt-4">
          {/* Progress Dots */}
          <div className="mb-8 flex items-center justify-center gap-2">
            {(["rating", "feedback", "reward"] as Step[]).map((s, i) => (
              <div
                key={s}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  step === s ? "w-8 bg-primary" : "w-1.5",
                  (["rating", "feedback", "reward"] as Step[]).indexOf(step) > i
                    ? "bg-primary/50"
                    : "bg-secondary"
                )}
              />
            ))}
          </div>

          {/* Step 1: Star Rating */}
          {step === "rating" && (
            <div className="flex flex-col items-center gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center">
                <h2 className="mb-2 text-xl font-semibold text-foreground">
                  Rate Your Visit
                </h2>
                <p className="text-sm text-muted-foreground">
                  {ratingLabel(rating)}
                </p>
              </div>

              <div className="flex gap-3 py-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => handleRatingSelect(star)}
                    className="transition-transform hover:scale-110 active:scale-95"
                  >
                    <Star
                      className={cn(
                        "h-12 w-12 transition-all duration-200",
                        star <= (hoveredStar || rating)
                          ? "fill-amber text-amber drop-shadow-[0_0_8px_oklch(0.82_0.17_80/0.5)]"
                          : "text-secondary"
                      )}
                    />
                  </button>
                ))}
              </div>

              <p className="text-center text-xs text-muted-foreground/60">
                Tap a star to rate your experience
              </p>
            </div>
          )}

          {/* Step 2: Feedback */}
          {step === "feedback" && (
            <div className="flex flex-col items-center gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center">
                <h2 className="mb-2 text-xl font-semibold text-foreground">
                  {rating >= 4 ? "What did you love?" : "What could be better?"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Select all that apply
                </p>
              </div>

              <div className="flex w-full flex-col gap-3 py-2">
                {feedbackOptions.map((opt) => {
                  const selected = selectedFeedback.includes(opt.label)
                  return (
                    <button
                      key={opt.label}
                      onClick={() => toggleFeedback(opt.label)}
                      className={cn(
                        "flex items-center gap-4 rounded-xl border-2 px-5 py-4 text-left transition-all",
                        selected
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border bg-secondary/30 text-muted-foreground hover:border-primary/30"
                      )}
                    >
                      <opt.icon
                        className={cn("h-6 w-6 shrink-0", selected ? "text-primary" : "text-muted-foreground")}
                      />
                      <span className="text-base font-medium">{opt.label}</span>
                      {selected && (
                        <div className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                          <ChevronRight className="h-3 w-3 text-primary-foreground" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>

              <button
                onClick={handleSubmitFeedback}
                disabled={selectedFeedback.length === 0}
                className={cn(
                  "mt-2 w-full rounded-xl py-3.5 text-sm font-semibold transition-all",
                  selectedFeedback.length > 0
                    ? "bg-primary text-primary-foreground hover:opacity-90"
                    : "bg-secondary text-muted-foreground"
                )}
              >
                Submit Feedback
              </button>
            </div>
          )}

          {/* Step 3: Reward */}
          {step === "reward" && (
            <div className="flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Confetti */}
              {showConfetti && (
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <ConfettiPiece
                      key={i}
                      delay={Math.random() * 500}
                      left={Math.random() * 100}
                    />
                  ))}
                </div>
              )}

              <div className="text-center">
                <h2 className="mb-2 text-xl font-semibold text-foreground">
                  Thank You!
                </h2>
                <p className="text-sm text-muted-foreground">
                  Your feedback helps us improve
                </p>
              </div>

              {/* Coupon Card */}
              <div className="relative w-full overflow-hidden rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 p-6 text-center glow-emerald">
                <Gift className="mx-auto mb-3 h-10 w-10 text-primary" />
                <p className="text-4xl font-bold text-primary">10% OFF</p>
                <p className="mt-1 text-sm text-muted-foreground">on your next visit</p>
                <div className="mt-4 rounded-lg bg-secondary/50 px-4 py-2">
                  <p className="font-mono text-sm font-bold tracking-widest text-foreground">
                    THANKYOU10
                  </p>
                </div>
                <p className="mt-3 text-xs text-muted-foreground/60">
                  Valid for 30 days from today
                </p>
              </div>

              <button
                onClick={handleReset}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Start Over
              </button>
            </div>
          )}
        </div>

        {/* Home Bar */}
        <div className="flex justify-center pb-3 pt-1">
          <div className="h-1 w-28 rounded-full bg-muted-foreground/30" />
        </div>
      </div>
    </div>
  )
}
