'use client'

import { createContext, useContext, useEffect, useReducer, ReactNode } from 'react'

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image?: string
}

interface CartState {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  isInitialized: boolean
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'INITIALIZE'; payload: CartState }

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isInitialized: false
}

function calculateTotals(items: CartItem[]) {
  return items.reduce(
    (acc, item) => ({
      totalItems: acc.totalItems + item.quantity,
      totalPrice: acc.totalPrice + item.price * item.quantity
    }),
    { totalItems: 0, totalPrice: 0 }
  )
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'INITIALIZE':
      return { ...action.payload, isInitialized: true }
      
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id)
      let newItems: CartItem[]
      
      if (existingItemIndex >= 0) {
        newItems = [...state.items]
        newItems[existingItemIndex].quantity += action.payload.quantity
      } else {
        newItems = [...state.items, action.payload]
      }
      
      return { ...state, items: newItems, ...calculateTotals(newItems) }
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload)
      return { ...state, items: newItems, ...calculateTotals(newItems) }
    }
    
    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item => 
        item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
      )
      return { ...state, items: newItems, ...calculateTotals(newItems) }
    }
    
    case 'CLEAR_CART':
      return { ...initialState, isInitialized: true }
      
    default:
      return state
  }
}

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}>({
  state: initialState,
  dispatch: () => null,
  addItem: () => null,
  removeItem: () => null,
  updateQuantity: () => null,
  clearCart: () => null
})

const CART_STORAGE_KEY = 'icon-multimedia-cart'

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Initialize from local storage on mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart)
        dispatch({ type: 'INITIALIZE', payload: parsedCart })
      } else {
        dispatch({ type: 'INITIALIZE', payload: initialState })
      }
    } catch (err) {
      console.error('Failed to load cart from local storage:', err)
      dispatch({ type: 'INITIALIZE', payload: initialState })
    }
  }, [])

  // Sync to local storage on changes
  useEffect(() => {
    if (state.isInitialized) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({
        items: state.items,
        totalItems: state.totalItems,
        totalPrice: state.totalPrice
      }))
    }
  }, [state])

  const addItem = (item: CartItem) => dispatch({ type: 'ADD_ITEM', payload: item })
  const removeItem = (id: string) => dispatch({ type: 'REMOVE_ITEM', payload: id })
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
    }
  }
  const clearCart = () => dispatch({ type: 'CLEAR_CART' })

  return (
    <CartContext.Provider value={{ state, dispatch, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
