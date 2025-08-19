export interface PaymentProof {
  $id?: string // Appwrite document ID
  imageUrl: string // URL da imagem do comprovante
  imageFileId: string // ID do arquivo no Appwrite Storage
  status: 'pending' | 'approved' | 'rejected'
  isVisible: boolean // Para controlar se aparece na homepage
  $createdAt?: string // Appwrite created timestamp
  $updatedAt?: string // Appwrite updated timestamp
}
