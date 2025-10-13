'use client'

import { ImageResizerApp } from '@/components/image-resizer-app'
import { useRouter } from 'next/navigation'

export default function ResizerRoute() {
  const router = useRouter()
  return <ImageResizerApp onBack={() => router.push('/')} />
}
