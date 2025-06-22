export interface IEpubRepository {
  loadEpub(file: string): Promise<any>;
  extractBookIdFromPath(path: string): string | null;
}
