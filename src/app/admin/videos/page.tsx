'use client'

import { useState } from 'react'
import { Plus, Search, Trash2, Eye, DollarSign } from 'lucide-react'
import { useVideos } from '@/hooks/useVideos'
import { useAppwriteStorage } from '@/hooks/useAppwriteStorage'
import { VideoPlayer } from '@/components/VideoPlayer'

export default function VideoManagement() {
  const { videos, loading, error, addVideo, deleteVideo, refreshVideos, incrementViews } = useVideos()
  const { uploadFile, uploadState } = useAppwriteStorage()

  const [searchTerm, setSearchTerm] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState<number | ''>('')
  const [file, setFile] = useState<File | null>(null)

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleCreate = async () => {
    if (!file || !title || price === '' || Number(price) < 0) return
    try {
      const { fileId, fileUrl } = await uploadFile(file)
      await addVideo({
        title,
        description,
        price: Number(price),
        duration: '',
        uploadDate: new Date().toISOString(),
        status: 'published',
        views: 0,
        tags: [],
        videoFileId: fileId,
        videoUrl: fileUrl
      })
      setTitle('')
      setDescription('')
      setPrice('')
      setFile(null)
      await refreshVideos()
    } catch (_e) {
      // erro já tratado no hook
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return 'Publicado'
      case 'draft':
        return 'Rascunho'
      case 'processing':
        return 'Processando'
      default:
        return 'Desconhecido'
    }
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestão de Vídeos</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gerencie todos os vídeos da plataforma
            </p>
          </div>
          
        </div>
      </div>

      {/* Criar vídeo (upload sem thumbnail) */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="grid md:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Arquivo de vídeo</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {uploadState.isUploading && (
              <div className="mt-2 text-sm text-gray-500">Enviando... {uploadState.progress}%</div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Título do vídeo"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Descrição (opcional)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preço</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                className="pl-8 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={handleCreate}
            disabled={!file || !title || price === '' || Number(price) < 0 || uploadState.isUploading}
            className="bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Adicionar Vídeo
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar vídeos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Lista de vídeos (com prévia sem thumbnail) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && <div className="text-gray-500">Carregando...</div>}
        {error && <div className="text-red-600">{error}</div>}
        {!loading && !error && filteredVideos.map((video) => (
          <div key={video.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="relative">
              <VideoPlayer 
                src={video.videoUrl} 
                title={video.title}
                videoId={video.id}
                onPlay={() => incrementViews(video.id)}
              />
              {video.duration && (
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                {video.duration}
              </div>
              )}
            </div>
            
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{video.title}</h3>
                <span className={`${getStatusColor(video.status)} px-2 py-1 rounded-full text-xs font-medium`}>
                  {getStatusText(video.status)}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{video.description}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>{video.views || 0} visualizações</span>
                {video.uploadDate && <span>{new Date(video.uploadDate).toLocaleDateString('pt-BR')}</span>}
              </div>
              {typeof video.price === 'number' && (
                <div className="text-sm font-medium text-gray-900 mb-3">Preço: R$ {video.price.toFixed(2)}</div>
              )}
              
              <div className="flex gap-2">
                <a
                  href={video.videoUrl}
                  target="_blank"
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Abrir
                </a>
                <button
                  onClick={() => deleteVideo(video.id)}
                  className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
