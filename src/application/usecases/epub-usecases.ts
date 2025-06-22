import { EpubService } from '../services/epub';

export class LoadEpubUseCase {
  private epubService: EpubService;

  constructor(epubService: EpubService) {
    this.epubService = epubService;
  }

  async execute(file: string): Promise<any> {
    return await this.epubService.loadEpub(file);
  }
}
