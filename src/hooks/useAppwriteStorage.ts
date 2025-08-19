import { useState } from 'react'
import { AppwriteStorage } from '@/lib/appwrite'

interface UploadProgress {
  progress: number
  isUploading: boolean
  error?: string
  fileId?: string
  fileUrl?: string
}

export const useAppwriteStorage = () => {
  const [uploadState, setUploadState] = useState<UploadProgress>({
    progress: 0,
    isUploading: false
  })

  const uploadFile = async (file: File, bucketId?: string) => {
    setUploadState({
      progress: 0,
      isUploading: true,
      error: undefined
    })

    try {
      // Simular progresso de upload
      const progressInterval = setInterval(() => {
        setUploadState(prev => ({
          ...prev,
          progress: Math.min(prev.progress + 10, 90)
        }))
      }, 100)

      const response = await AppwriteStorage.uploadFile(file, bucketId)
      
      clearInterval(progressInterval)
      
      const fileUrl = AppwriteStorage.getFileUrl(response.$id, bucketId)
      
      setUploadState({
        progress: 100,
        isUploading: false,
        fileId: response.$id,
        fileUrl: fileUrl.toString()
      })

      return {
        fileId: response.$id,
        fileUrl: fileUrl.toString(),
        response
      }
    } catch (error) {
      setUploadState({
        progress: 0,
        isUploading: false,
        error: error instanceof Error ? error.message : 'Erro no upload'
      })
      throw error
    }
  }

  const deleteFile = async (fileId: string, bucketId?: string) => {
    try {
      await AppwriteStorage.deleteFile(fileId, bucketId)
      return true
    } catch (error) {
      console.error('Erro ao deletar arquivo:', error)
      throw error
    }
  }

  const getFileUrl = (fileId: string, bucketId?: string) => {
    return AppwriteStorage.getFileUrl(fileId, bucketId)
  }

  const getFilePreview = (fileId: string, width?: number, height?: number, bucketId?: string) => {
    return AppwriteStorage.getFilePreview(fileId, width, height, bucketId)
  }

  const resetUploadState = () => {
    setUploadState({
      progress: 0,
      isUploading: false
    })
  }

  return {
    uploadFile,
    deleteFile,
    getFileUrl,
    getFilePreview,
    resetUploadState,
    uploadState
  }
}
