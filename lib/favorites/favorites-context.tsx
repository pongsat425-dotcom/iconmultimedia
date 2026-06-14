'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export interface FavoriteItem {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  inStock: boolean
  rating?: number
  reviews?: number
}

interface FavoritesContextType {
  items: FavoriteItem[]
  addFavorite: (item: FavoriteItem) => void
  removeFavorite: (id: string) => void
  isFavorite: (id: string) => boolean
  toggleFavorite: (item: FavoriteItem) => void
}

const FavoritesContext = createContext<FavoritesContextType>({
  items: [],
  addFavorite: () => null,
  removeFavorite: () => null,
  isFavorite: () => false,
  toggleFavorite: () => null,
})

const FAVORITES_STORAGE_KEY = 'icon-multimedia-favorites'

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<FavoriteItem[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY)
      if (stored) {
        setItems(JSON.parse(stored))
      }
    } catch (err) {
      console.error('Failed to load favorites from localStorage:', err)
    } finally {
      setIsInitialized(true)
    }
  }, [])

  // Sync to local storage
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(items))
    }
  }, [items, isInitialized])

  const addFavorite = (item: FavoriteItem) => {
    setItems((prev) => {
      if (prev.some((i) => i.id === item.id)) return prev
      return [...prev, item]
    })
  }

  const removeFavorite = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  const isFavorite = (id: string) => {
    return items.some((i) => i.id === id)
  }

  const toggleFavorite = (item: FavoriteItem) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.id === item.id)
      if (exists) {
        return prev.filter((i) => i.id !== item.id)
      } else {
        return [...prev, item]
      }
    })
  }

  return (
    <FavoritesContext.Provider value={{ items, addFavorite, removeFavorite, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export const useFavorites = () => useContext(FavoritesContext)
