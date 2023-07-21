import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

export function useAsyncStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T | null>(initialValue)

  useEffect(() => {
    async function getStoredItem(key: string, initialValue: T) {
      try {
        // Get from local storage by key
        const item = await AsyncStorage.getItem(key)
        console.log(item)
        // Parse stored json or if none return initialValue
        const value = item ? JSON.parse(item) : initialValue
        console.log('get value', key, value)
        setStoredValue(value)
      } catch (error) {
        // If error also return initialValue
        console.log(error)
      }
    }

    getStoredItem(key, initialValue)
  }, [key, initialValue])

  const setValue = async (value: T) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value
      // Save state
      setStoredValue(valueToStore)
      // Save to local storage
      await AsyncStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error)
    }
  }

  return [storedValue, setValue]
}
