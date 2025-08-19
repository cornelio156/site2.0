'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { PaymentProof } from '@/types/payment'
import { PaymentProofService } from '@/services/paymentProofService'

interface PaymentProofContextType {
  paymentProofs: PaymentProof[]
  visibleProofs: PaymentProof[]
  loading: boolean
  error: string | null
  addPaymentProof: (imageFile: File) => Promise<PaymentProof>
  updatePaymentProof: (documentId: string, updates: Partial<PaymentProof>) => Promise<PaymentProof>
  deletePaymentProof: (documentId: string) => Promise<boolean>
  toggleVisibility: (documentId: string) => Promise<PaymentProof>
  approvePaymentProof: (documentId: string) => Promise<PaymentProof>
  rejectPaymentProof: (documentId: string) => Promise<PaymentProof>
  refreshPaymentProofs: () => Promise<void>
}

const PaymentProofContext = createContext<PaymentProofContextType | undefined>(undefined)

export const usePaymentProofs = () => {
  const context = useContext(PaymentProofContext)
  if (!context) {
    throw new Error('usePaymentProofs deve ser usado dentro de um PaymentProofProvider')
  }
  return context
}

interface PaymentProofProviderProps {
  children: ReactNode
}

export const PaymentProofProvider = ({ children }: PaymentProofProviderProps) => {
  const [paymentProofs, setPaymentProofs] = useState<PaymentProof[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Carregar comprovantes do Appwrite na inicialização
  const refreshPaymentProofs = async () => {
    try {
      setLoading(true)
      setError(null)
      const proofs = await PaymentProofService.listPaymentProofs()
      setPaymentProofs(proofs)
    } catch (err) {
      console.error('Erro ao carregar comprovantes:', err)
      setError('Erro ao carregar comprovantes de pagamento')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshPaymentProofs()
  }, [])

  const addPaymentProof = async (imageFile: File): Promise<PaymentProof> => {
    try {
      setError(null)
      const newProof = await PaymentProofService.createPaymentProof(imageFile)
      setPaymentProofs(prev => [newProof, ...prev])
      return newProof
    } catch (err) {
      console.error('Erro ao adicionar comprovante:', err)
      setError('Erro ao adicionar comprovante de pagamento')
      throw err
    }
  }

  const updatePaymentProof = async (documentId: string, updates: Partial<PaymentProof>): Promise<PaymentProof> => {
    try {
      setError(null)
      const updatedProof = await PaymentProofService.updatePaymentProof(documentId, updates)
      setPaymentProofs(prev => 
        prev.map(proof => proof.$id === documentId ? updatedProof : proof)
      )
      return updatedProof
    } catch (err) {
      console.error('Erro ao atualizar comprovante:', err)
      setError('Erro ao atualizar comprovante de pagamento')
      throw err
    }
  }

  const deletePaymentProof = async (documentId: string): Promise<boolean> => {
    try {
      setError(null)
      const success = await PaymentProofService.deletePaymentProof(documentId)
      if (success) {
        setPaymentProofs(prev => prev.filter(proof => proof.$id !== documentId))
      }
      return success
    } catch (err) {
      console.error('Erro ao deletar comprovante:', err)
      setError('Erro ao deletar comprovante de pagamento')
      throw err
    }
  }

  const toggleVisibility = async (documentId: string): Promise<PaymentProof> => {
    const currentProof = paymentProofs.find(p => p.$id === documentId)
    if (!currentProof) {
      throw new Error('Comprovante não encontrado')
    }
    return updatePaymentProof(documentId, { isVisible: !currentProof.isVisible })
  }

  const approvePaymentProof = async (documentId: string): Promise<PaymentProof> => {
    try {
      setError(null)
      const updatedProof = await PaymentProofService.approvePaymentProof(documentId)
      setPaymentProofs(prev => 
        prev.map(proof => proof.$id === documentId ? updatedProof : proof)
      )
      return updatedProof
    } catch (err) {
      console.error('Erro ao aprovar comprovante:', err)
      setError('Erro ao aprovar comprovante de pagamento')
      throw err
    }
  }

  const rejectPaymentProof = async (documentId: string): Promise<PaymentProof> => {
    try {
      setError(null)
      const updatedProof = await PaymentProofService.rejectPaymentProof(documentId)
      setPaymentProofs(prev => 
        prev.map(proof => proof.$id === documentId ? updatedProof : proof)
      )
      return updatedProof
    } catch (err) {
      console.error('Erro ao rejeitar comprovante:', err)
      setError('Erro ao rejeitar comprovante de pagamento')
      throw err
    }
  }

  // Filtrar apenas comprovantes visíveis e aprovados
  const visibleProofs = paymentProofs.filter(proof => proof.isVisible && proof.status === 'approved')

  const value: PaymentProofContextType = {
    paymentProofs,
    visibleProofs,
    loading,
    error,
    addPaymentProof,
    updatePaymentProof,
    deletePaymentProof,
    toggleVisibility,
    approvePaymentProof,
    rejectPaymentProof,
    refreshPaymentProofs
  }

  return (
    <PaymentProofContext.Provider value={value}>
      {children}
    </PaymentProofContext.Provider>
  )
}
