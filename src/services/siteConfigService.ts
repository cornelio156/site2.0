import { AppwriteDatabase, appwriteConfig } from '@/lib/appwrite'
import { SiteConfig } from '@/types/video'

/**
 * Service responsável por carregar e salvar a configuração do site no Appwrite
 */
export class SiteConfigService {
  private static collectionId = appwriteConfig.siteConfigCollectionId
  private static documentId = 'main'

  static get defaultConfig(): SiteConfig {
    return {
      telegramUsername: 'alexchannel',
      siteName: 'VipAcess',
      description: 'Exclusive Premium Content +18'
    }
  }

  static async getConfig(): Promise<SiteConfig> {
    try {
      const doc = await AppwriteDatabase.getDocument(this.collectionId, this.documentId) as Record<string, unknown>
      return {
        telegramUsername: (doc.telegramUsername as string) ?? this.defaultConfig.telegramUsername,
        siteName: (doc.siteName as string) ?? this.defaultConfig.siteName,
        description: (doc.description as string) ?? this.defaultConfig.description
      }
    } catch (_error) {
      // Caso não exista, retorna default (admin poderá salvar depois)
      return this.defaultConfig
    }
  }

  static async updateConfig(partial: Partial<SiteConfig>): Promise<SiteConfig> {
    try {
      const existing = await this.getConfig()
      const data: SiteConfig = { ...existing, ...partial }
      try {
        await AppwriteDatabase.updateDocument(this.collectionId, this.documentId, data as unknown as Record<string, unknown>)
      } catch (_e) {
        // Se não existir, cria
        await AppwriteDatabase.createDocument(this.collectionId, data as unknown as Record<string, unknown>, this.documentId)
      }
      return data
    } catch (_error) {
      throw _error
    }
  }
}


