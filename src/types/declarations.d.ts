// Este archivo contiene declaraciones de tipo para los módulos sin tipado

// Declaración para archivos jsx que aún no han sido convertidos a tsx
declare module '*.jsx' {
  import * as React from 'react';
  const component: React.ComponentType<any>;
  export default component;
}

// Declaración para módulos JS sin tipos
declare module '*.js' {
  const content: any;
  export default content;
}

// Declaración para epubjs
declare module 'epubjs' {
  interface EpubOptions {
    width?: number;
    height?: number;
    spreads?: boolean;
    flow?: string;
    resizeOnOrientationChange?: boolean;
    restore?: boolean;
    reload?: boolean;
    bookPath?: string;
    styles?: object;
    script?: string;
    fontPath?: string;
  }

  interface SpineItem {
    href: string;
    id: string;
    linear: boolean;
    properties: any[];
    index: number;
  }

  interface TocItem {
    id: string;
    href: string;
    label: string;
    subitems?: TocItem[];
  }

  interface EpubMetadata {
    title: string;
    creator: string;
    description?: string;
    pubdate?: string;
    publisher?: string;
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

  interface Section {
    href: string;
    cfiBase: string;
    index: number;
    load(): Promise<any>;
    render(): Promise<any>;
    next(): Section;
    prev(): Section;
  }

  interface Contents {
    render(element: HTMLElement): void;
    on(event: string, callback: (...args: any[]) => void): void;
    off(event: string, callback?: (...args: any[]) => void): void;
  }

  export default function Epub(url: string, options?: EpubOptions): {
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
      get: (target: string) => TocItem[];
    };
    spine: {
      get: (target: string) => SpineItem;
    };
    metadata: {
      get: (property: string) => any;
    };
    rendition: {
      display(target?: string): Promise<any>;
      on(event: string, callback: (...args: any[]) => void): void;
      off(event: string, callback?: (...args: any[]) => void): void;
      next(): Promise<any>;
      prev(): Promise<any>;
      currentLocation(): any;
    };
    on(event: string, callback: (...args: any[]) => void): void;
    off(event: string, callback?: (...args: any[]) => void): void;
  };
}

// Declaración para los tipos de imágenes
declare module '*.png' {
  const value: any;
  export default value;
}

declare module '*.jpg' {
  const value: any;
  export default value;
}

declare module '*.jpeg' {
  const value: any;
  export default value;
}

declare module '*.svg' {
  import React from 'react';
  const SVG: React.FC<React.SVGProps<SVGSVGElement>>;
  export default SVG;
}
