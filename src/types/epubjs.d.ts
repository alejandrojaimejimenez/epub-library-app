declare module 'epubjs' {
  export interface EpubMetadata {
    title: string;
    creator: string;
    description?: string;
    publisher?: string;
    published?: string;
    identifier?: string;
    language?: string;
    rights?: string;
    modified_date?: string;
    layout?: string;
    orientation?: string;
    flow?: string;
    viewport?: string;
    spread?: string;
  }

  export interface TocItem {
    id: string;
    href: string;
    label: string;
    subitems?: TocItem[];
    parent?: TocItem;
  }

  export interface Location {
    start: {
      cfi: string;
      href: string;
      index: number;
    };
    end: {
      cfi: string;
      href: string;
      index: number;
    };
    atStart: boolean;
    atEnd: boolean;
  }

  export interface RenditionOptions {
    width?: string | number;
    height?: string | number;
    ignoreClass?: string;
    manager?: string;
    view?: string;
    flow?: string;
    layout?: string;
    spread?: string;
    minSpreadWidth?: number;
    stylesheet?: string;
    script?: string;
    snap?: boolean;
    defaultDirection?: string;
  }

  export interface Rendition {
    display(target?: string): Promise<void>;
    next(): Promise<void>;
    prev(): Promise<void>;
    on(event: string, callback: (location: Location) => void): void;
    destroy(): void;
  }

  export interface Book {
    ready: Promise<any>;
    loaded: {
      metadata: EpubMetadata;
      spine: any;
      navigation: {
        toc: TocItem[];
      };
      cover: string;
      resources: any;
    };
    navigation: {
      get(target: string): TocItem[];
    };
    package: {
      metadata: EpubMetadata;
      spine: any;
    };
    renderTo(element: HTMLElement, options?: RenditionOptions): Rendition;
    destroy(): void;
    on(event: string, callback?: (...args: any[]) => void): void;
    off(event: string, callback?: (...args: any[]) => void): void;
  }
  export interface EpubOptions {
    width?: number | string;
    height?: number | string;
    spreads?: boolean;
    layout?: string;
    minSpreadWidth?: number;
    gap?: number;
    resizeOnOrientationChange?: boolean;
    restore?: boolean;
    reload?: boolean;
    bookKey?: string;
    styles?: object;
    openAs?: string;
  }

  export default function(url: string | ArrayBuffer | Blob, options?: EpubOptions): Book;
}
