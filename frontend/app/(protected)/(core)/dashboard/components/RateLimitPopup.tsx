import type { Dispatch, SetStateAction } from 'react'
import { motion } from 'framer-motion'
import StarryBackground from '@/components/StarryBackground'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Props {
  setRatePopup: Dispatch<SetStateAction<boolean>>
}

export default function RateLimitPopup({ setRatePopup }: Props) {
  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-50"
        onClick={() => setRatePopup(false)}
      >
        <StarryBackground />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-501 flex flex-col items-center justify-center"
      >
        <div className="bg-card border shadow-xl rounded-2xl p-8 max-w-lg mx-4 md:mx-auto text-center">
          <h2 className="text-2xl font-semibold">Rate Limit Exceeded</h2>
          <p className="mt-2">
            You have reached the maximum number of requests. Please try again
            later or update to <strong>Pro</strong> plan.
          </p>
          <div className="flex items-center justify-center gap-4 mt-5">
            <Button asChild className="">
              <Link href="/plans">View Plans</Link>
            </Button>
            <Button onClick={() => setRatePopup(false)}>Close</Button>
          </div>
        </div>
      </motion.div>
    </>
  )
}
