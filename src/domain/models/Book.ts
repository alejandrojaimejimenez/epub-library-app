// Define las interfaces principales del dominio de la aplicación

export interface MAuthor {
  id: number;
  name: string;
  sort: string;
  link: string;
}

export interface MTag {
  id: number;
  name: string;
  link: string;
}

export interface MSeries {
  id: number;
  name: string;
  sort: string;
  link: string;
}

export interface MBook {
  id: number;
  title: string;
  sort: string;
  timestamp: string;
  pubdate?: string;
  series_index?: number;  author_sort: string;
  isbn?: string;
  lccn?: string;
  path: string;
  flags: number;
  uuid: string;
  has_cover: number;
  last_modified: string;
  authors?: MAuthor[];
  tags?: MTag[];
  series?: MSeries;
  comments?: string;
  formats?: string[];
  cover_path?: string;  // Campos adicionales para nuestra aplicación
  coverImage?: string;
  filePath?: string;  lastReadPosition?: number;
  lastReadCfi?: string;
}

export interface MReadPosition {
  bookId: string;
  position: number;
  cfi?: string;
  format: string;
  user: string;
  device: string;
  timestamp: Date;
}
