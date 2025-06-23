import { SEpub } from '@services/epub';

export class LoadEpubUseCase {
  private epubService: SEpub;

  constructor(epubService: SEpub) {
    this.epubService = epubService;
  }

  async execute(file: string): Promise<any> {
    return await this.epubService.loadEpub(file);
  }
}
