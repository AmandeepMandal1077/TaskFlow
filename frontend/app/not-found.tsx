import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-neutral-900 text-white">
      <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
      <h2 className="text-3xl font-bold mb-2">Page Not Found</h2>
      <p className="text-neutral-400 mb-6 text-center max-w-md">
        We couldn't find the page you're looking for. It might have been moved or deleted.
      </p>
      <Link href="/dashboard">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          Return to Dashboard
        </Button>
      </Link>
    </div>
  )
}
