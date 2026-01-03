import { CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full bg-card text-foreground rounded-2xl shadow-lg p-8 text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-primary mb-4" />

        <h1 className="text-2xl font-bold mb-2">Payment Successful</h1>

        <p className="text-muted-foreground mb-6">
          Your payment has been completed successfully. You can now continue
          using the app.
        </p>

        <div className="flex flex-col gap-3">
          <Button className="w-full" asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>

          <Button variant="outline" className="w-full" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
