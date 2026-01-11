
"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface FadeInProps {
  children: ReactNode
  delay?: number
  direction?: "up" | "down" | "left" | "right"
  fullWidth?: boolean
  className?: string
}

export function FadeIn({ children, delay = 0, direction, fullWidth = false, className = "" }: FadeInProps) {
  const directions = {
    up: { y: 20, x: 0 },
    down: { y: -20, x: 0 },
    left: { x: 20, y: 0 },
    right: { x: -20, y: 0 },
  }

  const initial = direction ? directions[direction] : { x: 0, y: 0 }

  return (
    <motion.div
      initial={{ opacity: 0, ...initial }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={`${fullWidth ? "w-full" : ""} ${className}`}
    >
      {children}
    </motion.div>
  )
}
