import { Client, Account, Databases, Storage } from 'appwrite'

// Configurações do Appwrite
export const appwriteConfig = {
  url: process.env.NEXT_PUBLIC_APPWRITE_URL || 'https://cloud.appwrite.io/v1',
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '',
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '',
  storageId: process.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID || '',
  
  // Collections IDs
  videosCollectionId: process.env.NEXT_PUBLIC_APPWRITE_VIDEOS_COLLECTION_ID || '',
  paymentProofsCollectionId: process.env.NEXT_PUBLIC_APPWRITE_PAYMENT_PROOFS_COLLECTION_ID || '',
  siteConfigCollectionId: process.env.NEXT_PUBLIC_APPWRITE_SITE_CONFIG_COLLECTION_ID || '',
}

// Cliente Appwrite
const client = new Client()

client
  .setEndpoint(appwriteConfig.url)
  .setProject(appwriteConfig.projectId)

// Serviços Appwrite
export const account = new Account(client)
export const databases = new Databases(client)
export const storage = new Storage(client)

export { client }

// Funções auxiliares para armazenamento
export class AppwriteStorage {
  // Upload de arquivo
  static async uploadFile(file: File, bucketId: string = appwriteConfig.storageId) {
    try {
      const response = await storage.createFile(
        bucketId,
        'unique()', // ID único gerado automaticamente
        file
      )
      return response
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
      throw error
    }
  }

  // Obter URL do arquivo
  static getFileUrl(fileId: string, bucketId: string = appwriteConfig.storageId) {
    return storage.getFileView(bucketId, fileId)
  }

  // Obter URL de preview (para imagens)
  static getFilePreview(
    fileId: string, 
    width: number = 300, 
    height: number = 200,
    bucketId: string = appwriteConfig.storageId
  ) {
    return storage.getFilePreview(bucketId, fileId, width, height)
  }

  // Deletar arquivo
  static async deleteFile(fileId: string, bucketId: string = appwriteConfig.storageId) {
    try {
      await storage.deleteFile(bucketId, fileId)
      return true
    } catch (error) {
      console.error('Erro ao deletar arquivo:', error)
      throw error
    }
  }

  // Listar arquivos
  static async listFiles(bucketId: string = appwriteConfig.storageId) {
    try {
      const response = await storage.listFiles(bucketId)
      return response
    } catch (error) {
      console.error('Erro ao listar arquivos:', error)
      throw error
    }
  }
}

// Funções auxiliares para database
export class AppwriteDatabase {
  // Criar documento
  static async createDocument(
    collectionId: string,
    data: Record<string, unknown>,
    documentId: string = 'unique()',
    databaseId: string = appwriteConfig.databaseId
  ) {
    try {
      const response = await databases.createDocument(
        databaseId,
        collectionId,
        documentId,
        data
      )
      return response
    } catch (error) {
      console.error('Erro ao criar documento:', error)
      throw error
    }
  }

  // Obter documento
  static async getDocument(
    collectionId: string,
    documentId: string,
    databaseId: string = appwriteConfig.databaseId
  ) {
    try {
      const response = await databases.getDocument(
        databaseId,
        collectionId,
        documentId
      )
      return response
    } catch (error) {
      console.error('Erro ao obter documento:', error)
      throw error
    }
  }

  // Listar documentos
  static async listDocuments(
    collectionId: string,
    queries: string[] = [],
    databaseId: string = appwriteConfig.databaseId
  ) {
    try {
      const response = await databases.listDocuments(
        databaseId,
        collectionId,
        queries
      )
      return response
    } catch (error) {
      console.error('Erro ao listar documentos:', error)
      throw error
    }
  }

  // Atualizar documento
  static async updateDocument(
    collectionId: string,
    documentId: string,
    data: Record<string, unknown>,
    databaseId: string = appwriteConfig.databaseId
  ) {
    try {
      const response = await databases.updateDocument(
        databaseId,
        collectionId,
        documentId,
        data
      )
      return response
    } catch (error) {
      console.error('Erro ao atualizar documento:', error)
      throw error
    }
  }

  // Deletar documento
  static async deleteDocument(
    collectionId: string,
    documentId: string,
    databaseId: string = appwriteConfig.databaseId
  ) {
    try {
      await databases.deleteDocument(
        databaseId,
        collectionId,
        documentId
      )
      return true
    } catch (error) {
      console.error('Erro ao deletar documento:', error)
      throw error
    }
  }
}
