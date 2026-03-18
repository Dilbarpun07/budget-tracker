import { useEffect, useState } from 'react'

export function useLocalStorageString(key: string, initialValue: string = '') {
  const [value, setValue] = useState<string>(() => {
    if (typeof window === 'undefined') return initialValue
    const saved = window.localStorage.getItem(key)
    return saved !== null ? saved : initialValue
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(key, value)
  }, [key, value])

  return [value, setValue] as const
}

