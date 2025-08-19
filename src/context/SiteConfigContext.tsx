'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { SiteConfig } from '@/types/video'
import { SiteConfigService } from '@/services/siteConfigService'

interface SiteConfigContextType {
  config: SiteConfig
  updateConfig: (newConfig: Partial<SiteConfig>) => void
}

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined)

export const useSiteConfig = () => {
  const context = useContext(SiteConfigContext)
  if (!context) {
    throw new Error('useSiteConfig deve ser usado dentro de um SiteConfigProvider')
  }
  return context
}

interface SiteConfigProviderProps {
  children: ReactNode
}

export const SiteConfigProvider = ({ children }: SiteConfigProviderProps) => {
  const [config, setConfig] = useState<SiteConfig>(SiteConfigService.defaultConfig)
  const [_loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const remote = await SiteConfigService.getConfig()
      setConfig(remote)
      setLoading(false)
    }
    load()
  }, [])

  const updateConfig = (newConfig: Partial<SiteConfig>) => {
    const updatedConfig = { ...config, ...newConfig }
    setConfig(updatedConfig)
    // Persistir no Appwrite (não aguarda bloqueando a UI)
    SiteConfigService.updateConfig(newConfig).catch(() => {})
  }

  const value: SiteConfigContextType = {
    config,
    updateConfig
  }

  return (
    <SiteConfigContext.Provider value={value}>
      {children}
    </SiteConfigContext.Provider>
  )
}
