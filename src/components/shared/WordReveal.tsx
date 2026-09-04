import { useEffect, useState, useRef } from "react"
import { motion, useInView } from "framer-motion"

type Props = {
  text: string
  speed?: number
}

const WordReveal = ({ text, speed = 80 }: Props) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const words = text.split(" ")
  const [visibleCount, setVisibleCount] = useState(0)
  const [runShimmer, setRunShimmer] = useState(false)

  useEffect(() => {
    if (!isInView) return

    const interval = setInterval(() => {
      setVisibleCount(prev => {
        if (prev >= words.length) {
          clearInterval(interval)

          // trigger shimmer after reveal finishes
          setTimeout(() => {
            setRunShimmer(true)
          }, 300)

          return prev
        }
        return prev + 1
      })
    }, speed)

    return () => clearInterval(interval)
  }, [isInView, words.length, speed])

  return (
    <span
      ref={ref}
      className={`flex flex-wrap ${runShimmer ? "shimmer-once" : ""}`}
    >
      {words.slice(0, visibleCount).map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mr-1"
        >
          {word}
        </motion.span>
      ))}
    </span>
  )
}

export default WordReveal