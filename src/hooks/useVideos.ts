import { useState, useEffect } from 'react'
import { AppwriteDatabase, appwriteConfig } from '@/lib/appwrite'
import { Video } from '@/types/video'
import { Query } from 'appwrite'

interface UseVideosReturn {
  videos: Video[]
  loading: boolean
  error: string | null
  addVideo: (video: Omit<Video, 'id'>) => Promise<void>
  updateVideo: (id: string, updates: Partial<Video>) => Promise<void>
  deleteVideo: (id: string) => Promise<void>
  refreshVideos: () => Promise<void>
  incrementViews: (id: string) => Promise<void>
}

export const useVideos = (): UseVideosReturn => {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load videos from Appwrite - simplified and fast version
  const loadVideos = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!appwriteConfig.videosCollectionId) {
        // Mock data for testing
        const mockVideos: Video[] = [
          {
            id: 'mock-1',
            title: 'Exclusive Premium Content #1',
            description: 'Special and exclusive material available only for subscribers.',
            price: 25.00,
            duration: '25:30',
            uploadDate: '2024-01-15',
            status: 'published',
            views: 15420,
            tags: ['Premium', 'Exclusive', 'VIP']
          },
          {
            id: 'mock-2',
            title: 'Special Pack - Limited Edition',
            description: 'Special collection with unprecedented and high-quality content.',
            price: 35.00,
            duration: '32:15',
            uploadDate: '2024-01-12',
            status: 'published',
            views: 8930,
            tags: ['Pack', 'Limited', 'Special']
          },
          {
            id: 'mock-3',
            title: 'VIP Private Session',
            description: 'Unique and personalized experience for VIP members.',
            price: 45.00,
            duration: '45:45',
            uploadDate: '2024-01-10',
            status: 'published',
            views: 12750,
            tags: ['VIP', 'Private', 'Custom']
          }
        ]
        setVideos(mockVideos)
        return
      }

      // Simplified query - load published videos only
      const queries = [
        Query.equal('status', 'published'),
        Query.orderDesc('$createdAt')
      ]

      const response = await AppwriteDatabase.listDocuments(
        appwriteConfig.videosCollectionId,
        queries
      )

      const appwriteVideos: Video[] = response.documents.map((doc: Record<string, unknown>) => ({
        id: doc.$id as string,
        title: doc.title as string,
        description: doc.description as string,
        price: (doc.price as number) ?? 0,
        duration: doc.duration as string,
        uploadDate: doc.uploadDate as string,
        status: doc.status as 'published' | 'draft' | 'processing',
        views: (doc.views as number) || 0,
        tags: (doc.tags as string[]) || [],
        videoFileId: doc.videoFileId as string,
        videoUrl: doc.videoUrl as string
      }))

      setVideos(appwriteVideos)
    } catch (err) {
      console.error('Error loading videos:', err)
      setError(err instanceof Error ? err.message : 'Error loading videos')
    } finally {
      setLoading(false)
    }
  }

  // Add new video
  const addVideo = async (videoData: Omit<Video, 'id'>) => {
    try {
      if (!appwriteConfig.videosCollectionId) {
        throw new Error('Appwrite configuration not found')
      }

      const response = await AppwriteDatabase.createDocument(
        appwriteConfig.videosCollectionId,
        {
          title: videoData.title,
          description: videoData.description,
          price: videoData.price,
          duration: videoData.duration,
          uploadDate: videoData.uploadDate,
          status: videoData.status,
          views: videoData.views || 0,
          tags: videoData.tags || [],
          videoFileId: videoData.videoFileId,
          videoUrl: videoData.videoUrl
        }
      )

      const newVideo: Video = {
        id: response.$id,
        ...videoData
      }

      setVideos(prev => [newVideo, ...prev])
    } catch (err) {
      console.error('Error adding video:', err)
      throw err
    }
  }

  // Update video
  const updateVideo = async (id: string, updates: Partial<Video>) => {
    try {
      if (!appwriteConfig.videosCollectionId) {
        throw new Error('Appwrite configuration not found')
      }

      await AppwriteDatabase.updateDocument(
        appwriteConfig.videosCollectionId,
        id,
        updates
      )

      setVideos(prev => prev.map(video => (video.id === id ? { ...video, ...updates } : video)))
    } catch (err) {
      console.error('Error updating video:', err)
      throw err
    }
  }

  // Delete video
  const deleteVideo = async (id: string) => {
    try {
      if (!appwriteConfig.videosCollectionId) {
        throw new Error('Appwrite configuration not found')
      }

      await AppwriteDatabase.deleteDocument(
        appwriteConfig.videosCollectionId,
        id
      )

      setVideos(prev => prev.filter(video => video.id !== id))
    } catch (err) {
      console.error('Error deleting video:', err)
      throw err
    }
  }

  // Increment video views
  const incrementViews = async (id: string) => {
    try {
      // Find current video to get views count
      const currentVideo = videos.find(v => v.id === id)
      if (!currentVideo) return

      const newViews = (currentVideo.views || 0) + 1

      // Atualizar no Appwrite se configurado
      if (appwriteConfig.videosCollectionId) {
        await AppwriteDatabase.updateDocument(
          appwriteConfig.videosCollectionId,
          id,
          { views: newViews }
        )
      }

      // Atualizar no estado local
      setVideos(prev => prev.map(video => 
        video.id === id ? { ...video, views: newViews } : video
      ))
    } catch (err) {
      console.error('Error incrementing views:', err)
      // Don't throw error to avoid breaking user experience
    }
  }

  // Refresh videos
  const refreshVideos = async () => {
    await loadVideos()
  }

  useEffect(() => {
    loadVideos()
  }, [])

  return {
    videos,
    loading,
    error,
    addVideo,
    updateVideo,
    deleteVideo,
    refreshVideos,
    incrementViews
  }
}
