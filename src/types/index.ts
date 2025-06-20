// Define las interfaces principales de la aplicación

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
  cover_path?: string;
  // Campos adicionales para nuestra aplicación
  coverImage?: string;
  filePath?: string;
  lastReadPosition?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  total?: number;
  limit?: number;
  offset?: number;
  filters?: Record<string, any>;
  message?: string;
}

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

export interface LibraryContextType {
  books: Book[];
  loading: boolean;
  error: Error | null;
  addBook?: (book: Book) => Promise<void>;
  removeBook?: (id: string) => Promise<void>;
  updateBook?: (id: string, bookData: Partial<Book>) => Promise<void>;
}
