'use client'

import { useState } from 'react'
import { X, ZoomIn } from 'lucide-react'

interface ImageZoomProps {
  src: string
  alt: string
  className?: string
}

export const ImageZoom = ({ src, alt, className = '' }: ImageZoomProps) => {
  const [isZoomed, setIsZoomed] = useState(false)

  const handleImageClick = () => {
    setIsZoomed(true)
  }

  const handleCloseZoom = () => {
    setIsZoomed(false)
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsZoomed(false)
    }
  }

  return (
    <>
      {/* Imagem original - exatamente como era antes */}
      <div className={`relative group cursor-pointer ${className}`} onClick={handleImageClick}>
        <img
          src={src}
          alt={alt}
          className="w-full h-48 object-cover rounded-lg border border-gray-200 transition-transform group-hover:scale-105"
          onError={(e) => {
            // Fallback para quando a imagem não carregar - igual ao original
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
            const fallback = document.createElement('div')
            fallback.className = 'w-full h-48 bg-gray-200 rounded-lg border border-gray-200 flex items-center justify-center'
            fallback.innerHTML = '<span class="text-gray-500 text-sm">Payment Screenshot</span>'
            target.parentNode?.appendChild(fallback)
          }}
        />
        
        {/* Overlay de zoom apenas no hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg transition-all duration-200 flex items-center justify-center">
          <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </div>
      </div>

      {/* Modal de zoom */}
      {isZoomed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          {/* Botão de fechar */}
          <button
            onClick={handleCloseZoom}
            className="absolute top-4 right-4 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-3 transition-all duration-200 backdrop-blur-sm"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Imagem ampliada */}
          <div className="max-w-full max-h-full flex items-center justify-center">
            <img
              src={src}
              alt={alt}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Instruções */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-4 py-2 rounded-full backdrop-blur-sm">
            Clique fora da imagem para fechar
          </div>
        </div>
      )}
    </>
  )
}
