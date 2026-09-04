import { useEffect, useState } from "react"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"

type Props = {
  text: string
  speed?: number
}

const TypewriterInView = ({ text, speed = 55 }: Props) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const [displayText, setDisplayText] = useState("")

  useEffect(() => {
    if (!isInView) return

    let i = 0

    const interval = setInterval(() => {
      setDisplayText(text.slice(0, i))
      i++

      if (i > text.length) {
        clearInterval(interval)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [isInView, text, speed])

  return (
    <motion.span ref={ref}>
      {displayText}
      <span className="animate-pulse">|</span>
    </motion.span>
  )
}

export default TypewriterInView