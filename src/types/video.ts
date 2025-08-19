export interface Video {
  id: string
  title: string
  description: string
  price: number
  duration?: string
  uploadDate?: string
  status: 'published' | 'draft' | 'processing'
  views?: number
  tags?: string[]
  videoFileId?: string // ID do arquivo de vídeo no Appwrite Storage
  videoUrl?: string // URL direta do vídeo
  fileSize?: number // Tamanho do arquivo em bytes
  mimeType?: string // Tipo MIME do vídeo
}

export interface SiteConfig {
  telegramUsername: string
  siteName: string
  description: string
}
