import CoachCard from '@/components/marketplace/coaches/CoachCard'

export default function CoachesPage() {
  return (
    <main className="max-w-7xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Coaches</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* {COACHES.map(c => (
                    <CoachCard key={c.id} coach={c} />
                ))} */}
      </div>
    </main>
  )
}
