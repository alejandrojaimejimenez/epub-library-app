// Define las interfaces principales del dominio de la aplicación

export interface Author {
  id: number;
  name: string;
  sort: string;
  link: string;
}

export interface Tag {
  id: number;
  name: string;
  link: string;
}

export interface Series {
  id: number;
  name: string;
  sort: string;
  link: string;
}

export interface Book {
  id: number;
  title: string;
  sort: string;
  timestamp: string;
  pubdate?: string;
  series_index?: number;
  author_sort: string;
  isbn?: string;
  lccn?: string;
  path: string;
  flags: number;
  uuid: string;
  has_cover: number;
  last_modified: string;
  authors?: Author[];
  tags?: Tag[];
  series?: Series;
  comments?: string;
  formats?: string[];
  cover_path?: string;  // Campos adicionales para nuestra aplicación
  coverImage?: string;
  filePath?: string;
  lastReadPosition?: number;
  lastReadCfi?: string;
}

export interface ReadPosition {
  bookId: string;
  position: number;
  cfi?: string;
  format: string;
  user: string;
  device: string;
  timestamp: Date;
}
