import { IEpubRepository } from '@repositories/IEpubRepository';

export class SEpub {
  private epubRepository: IEpubRepository;

  constructor(epubRepository: IEpubRepository) {
    this.epubRepository = epubRepository;
  }

  async loadEpub(file: string): Promise<any> {
    return await this.epubRepository.loadEpub(file);
  }

  extractBookIdFromPath(path: string): string | null {
    return this.epubRepository.extractBookIdFromPath(path);
  }
}
