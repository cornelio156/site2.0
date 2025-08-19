import { AppwriteDatabase, AppwriteStorage, appwriteConfig } from '@/lib/appwrite'
import { PaymentProof } from '@/types/payment'
import { Query } from 'appwrite'

export class PaymentProofService {
  private static collectionId = appwriteConfig.paymentProofsCollectionId

  // Criar novo comprovante de pagamento
  static async createPaymentProof(imageFile: File): Promise<PaymentProof> {
    try {
      // Upload da imagem
      const uploadResponse = await AppwriteStorage.uploadFile(imageFile)
      const imageUrl = AppwriteStorage.getFileUrl(uploadResponse.$id)
      
      // Criar documento no database
      const response = await AppwriteDatabase.createDocument(
        this.collectionId,
        {
          imageUrl: imageUrl.toString(),
          imageFileId: uploadResponse.$id,
          status: 'pending',
          isVisible: false
        }
      )
      return response as unknown as PaymentProof
    } catch (error) {
      console.error('Erro ao criar comprovante de pagamento:', error)
      throw error
    }
  }

  // Listar todos os comprovantes de pagamento
  static async listPaymentProofs(): Promise<PaymentProof[]> {
    try {
      const response = await AppwriteDatabase.listDocuments(
        this.collectionId,
        [Query.orderDesc('$createdAt')]
      )
      return response.documents as unknown as PaymentProof[]
    } catch (error) {
      console.error('Erro ao listar comprovantes de pagamento:', error)
      throw error
    }
  }

  // Listar apenas comprovantes visíveis (para homepage)
  static async listVisiblePaymentProofs(): Promise<PaymentProof[]> {
    try {
      const response = await AppwriteDatabase.listDocuments(
        this.collectionId,
        [
          Query.equal('isVisible', true),
          Query.equal('status', 'approved'),
          Query.orderDesc('$createdAt')
        ]
      )
      return response.documents as unknown as PaymentProof[]
    } catch (error) {
      console.error('Erro ao listar comprovantes visíveis:', error)
      throw error
    }
  }

  // Obter comprovante por ID
  static async getPaymentProof(documentId: string): Promise<PaymentProof> {
    try {
      const response = await AppwriteDatabase.getDocument(
        this.collectionId,
        documentId
      )
      return response as unknown as PaymentProof
    } catch (error) {
      console.error('Erro ao obter comprovante de pagamento:', error)
      throw error
    }
  }

  // Atualizar comprovante de pagamento
  static async updatePaymentProof(
    documentId: string, 
    updates: Partial<Omit<PaymentProof, '$id' | '$createdAt' | '$updatedAt'>>
  ): Promise<PaymentProof> {
    try {
      const response = await AppwriteDatabase.updateDocument(
        this.collectionId,
        documentId,
        updates
      )
      return response as unknown as PaymentProof
    } catch (error) {
      console.error('Erro ao atualizar comprovante de pagamento:', error)
      throw error
    }
  }

  // Deletar comprovante de pagamento
  static async deletePaymentProof(documentId: string): Promise<boolean> {
    try {
      await AppwriteDatabase.deleteDocument(this.collectionId, documentId)
      return true
    } catch (error) {
      console.error('Erro ao deletar comprovante de pagamento:', error)
      throw error
    }
  }

  // Aprovar comprovante
  static async approvePaymentProof(documentId: string): Promise<PaymentProof> {
    return this.updatePaymentProof(documentId, { status: 'approved' })
  }

  // Rejeitar comprovante
  static async rejectPaymentProof(documentId: string): Promise<PaymentProof> {
    return this.updatePaymentProof(documentId, { status: 'rejected' })
  }

  // Alternar visibilidade
  static async toggleVisibility(documentId: string, isVisible: boolean): Promise<PaymentProof> {
    return this.updatePaymentProof(documentId, { isVisible })
  }

  // Upload de imagem do comprovante
  static async uploadPaymentProofImage(file: File): Promise<{ fileId: string; url: string }> {
    try {
      const uploadResponse = await AppwriteStorage.uploadFile(file)
      const url = AppwriteStorage.getFileUrl(uploadResponse.$id)
      
      return {
        fileId: uploadResponse.$id,
        url: url.toString()
      }
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error)
      throw error
    }
  }

  // Deletar imagem do comprovante
  static async deletePaymentProofImage(fileId: string): Promise<boolean> {
    try {
      await AppwriteStorage.deleteFile(fileId)
      return true
    } catch (error) {
      console.error('Erro ao deletar imagem:', error)
      throw error
    }
  }

  // Obter URL da imagem
  static getImageUrl(fileId: string): string {
    return AppwriteStorage.getFileUrl(fileId).toString()
  }

  // Obter preview da imagem
  static getImagePreview(fileId: string, width: number = 300, height: number = 200): string {
    return AppwriteStorage.getFilePreview(fileId, width, height).toString()
  }
}
