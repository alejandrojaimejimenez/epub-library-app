import { Book, Rendition } from 'epubjs';
import { MutableRefObject } from 'react';

export interface IEpubReaderWebProps {
  epubUrl: string;
  initialCfi: string;
  onLocationChange: (newCfi: string) => void;
}

export interface IEpubReaderState {
  loadError: string | null;
  isLoading: boolean;
  domReady: boolean;
  retryCount: number;
  manualContainerCreated: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
}

export interface IEpubReaderRefs {
  viewerRef: React.RefObject<HTMLDivElement>;
  bookRef: MutableRefObject<Book | null>;
  renditionRef: MutableRefObject<Rendition | null>;
}

// Tipos específicos para eventos de epub.js
export interface EpubLocation {
  start: {
    cfi: string;
    displayed: {
      page: number;
      total: number;
    };
    href: string;
    index: number;
    location: number;
    percentage: number;
  };
  end: {
    cfi: string;
    displayed: {
      page: number;
      total: number;
    };
    href: string;
    index: number;
    location: number;
    percentage: number;
  };
  atStart: boolean;
  atEnd: boolean;
}

export interface EpubToc {
  href: string;
  id: string;
  label: string;
  subitems?: EpubToc[];
}

export interface EpubLocationEvent {
  end: {
    index: number;
    href: string;
    cfi: string;
  };
  start: {
    index: number;
    href: string;
    cfi: string;
  };
  percentage: number;
}

export const EPUB_CONTAINER_ID = 'epub-reader-container';
