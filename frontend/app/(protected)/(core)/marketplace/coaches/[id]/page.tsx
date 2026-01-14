import { api } from '@/lib/api'
import { notFound } from 'next/navigation'
import CoachProfileComponent from './components/CoachProfileComponent'
import type { Coach } from '@/types'

interface Props {
  params: { id: string }
}

export default async function CoachPage({ params }: Props) {
  const { id } = await params

  return <CoachProfileComponent coachId={Number(id)} />
}
