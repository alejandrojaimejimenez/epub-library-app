import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';
// Importamos epubjs directamente (compatible con Webpack)
import ePub from 'epubjs';
import type { Book, Rendition, Location } from 'epubjs';

interface WebEpubReaderProps {
  url: string;
  blob?: Blob;
  arrayBuffer?: ArrayBuffer;
  onLocationChange?: (location: string) => void;
  initialLocation?: string; // Nuevo prop para la posición inicial
}

const WebEpubReader: React.FC<WebEpubReaderProps> = ({ 
  url, 
  blob, 
  arrayBuffer, 
  onLocationChange,
  initialLocation 
}) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<Book | null>(null);
  const renditionRef = useRef<Rendition | null>(null);
  const [error, setError] = useState<string | null>(null);  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isReady, setIsReady] = useState<boolean>(false);
  const hasAttempedLoad = useRef<boolean>(false);
  const locationSet = useRef<boolean>(false); // Para rastrear si ya se ha establecido la ubicación inicial
  const lastSavedCfi = useRef<string | null>(null); // Para evitar guardar el mismo CFI múltiples veces
  
  // Función para validar si un CFI parece válido (comprobación básica)
  const isValidCfi = (cfi: string | undefined): boolean => {
    // Formato básico de un CFI: "epubcfi(/6/4[id]!/4/2/2[id]/2/1:0)"
    // Esta es una validación muy simple, se puede mejorar según sea necesario
    if (!cfi || typeof cfi !== 'string') return false;
    if (!cfi.startsWith('epubcfi(')) return false;
    if (!cfi.includes('/')) return false;
    
    // Evitar CFIs con formatos sospechosos que podrían causar errores
    // Por ejemplo, "epubcfi(/6/4!/1:36)" podría ser problemático si el offset (36) es muy grande
    if (cfi.includes(':')) {
      const parts = cfi.split(':');
      if (parts.length > 1) {
        const offset = parseInt(parts[1].replace(')', ''), 10);
        if (offset > 30) {
          console.warn('CFI con offset potencialmente problemático:', cfi, 'offset:', offset);
          return false; // Rechazamos CFIs con offsets muy grandes
        }
      }
    }
    
    try {
      // Si tenemos acceso al libro, podemos intentar una validación más rigurosa
      if (bookRef.current) {
        // Intentamos validar el CFI con epubjs pero sin aplicarlo aún
        const epubCfi = new (ePub as any).EpubCFI();
        // Solo comprobamos que el CFI sea parseado correctamente
        const parsed = epubCfi.parse(cfi);
        return !!parsed;
      }
      return true; // Si no podemos validar más rigurosamente, aceptamos el formato básico
    } catch (e) {
      console.warn('Error al validar CFI:', e);
      return false;
    }
  };

  // Efecto para parchear la creación de iframes a nivel global y resolver el problema de sandbox
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    
    console.log('Instalando parches globales para iframe sandbox...');
    
    // Guardar la implementación original de createElement
    const originalCreateElement = document.createElement.bind(document);
    
    // Reemplazar createElement para capturar y modificar iframes
    document.createElement = function(tagName: string, options?: ElementCreationOptions): HTMLElement {
      const element = originalCreateElement(tagName, options);
      
      // Si es un iframe, configurar sandbox automáticamente
      if (tagName.toLowerCase() === 'iframe') {
        const iframe = element as HTMLIFrameElement;
        iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
        
        // Guardar la implementación original de setAttribute
        const originalSetAttribute = iframe.setAttribute.bind(iframe);
        
        // Reemplazar setAttribute para capturar cuando se establece srcdoc
        iframe.setAttribute = function(name: string, value: string): void {
          // Si están estableciendo el atributo srcdoc, modificarlo para permitir scripts
          if (name.toLowerCase() === 'srcdoc' && typeof value === 'string') {
            // Asegurarnos que el iframe tiene el sandbox correcto
            originalSetAttribute('sandbox', 'allow-scripts allow-same-origin');
            
            // Modificar el HTML para habilitar scripts si es necesario
            if (!value.includes('<meta http-equiv="Content-Security-Policy"')) {
              value = value.replace('<head>', 
                '<head><meta http-equiv="Content-Security-Policy" content="script-src \'self\' \'unsafe-inline\';">');
            }
          }
          
          // Llamar a la implementación original
          return originalSetAttribute(name, value);
        };
      }
      
      return element;
    };
    
    // Limpieza al desmontar
    return () => {
      // Restaurar la implementación original
      document.createElement = originalCreateElement;
      console.log('Parches globales para iframe sandbox eliminados');
    };
  }, []);
  // Efecto para configurar los iframes y resolver el problema de "Blocked script execution in 'about:srcdoc'"
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    // Función para aplicar el atributo sandbox a los iframes
    const configureSandboxForIframes = () => {
      console.log('Configurando atributos sandbox para iframes...');
      
      // 1. Primero los iframes dentro del visor de EPUB
      const containerIframes = viewerRef.current?.querySelectorAll('iframe');
      
      if (containerIframes && containerIframes.length > 0) {
        console.log(`Encontrados ${containerIframes.length} iframes para configurar`);
        
        containerIframes.forEach((iframe, index) => {
          // Configurar el atributo sandbox para permitir scripts y mismo origen
          iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
          console.log(`Iframe ${index} configurado con sandbox="allow-scripts allow-same-origin"`);
          
          // Intentar acceder al documento interno
          try {
            if (iframe.contentDocument) {
              const contentHead = iframe.contentDocument.head;
              if (contentHead) {
                // Inyectar CSP meta tag
                const meta = document.createElement('meta');
                meta.setAttribute('http-equiv', 'Content-Security-Policy');
                meta.setAttribute('content', "script-src 'self' 'unsafe-inline'");
                contentHead.appendChild(meta);
                console.log(`Meta CSP inyectado en iframe ${index}`);
              }
            }
          } catch (e) {
            console.warn(`No se pudo acceder al documento del iframe ${index}:`, e);
          }
        });
      } else {
        console.log('No se encontraron iframes en el contenedor');
      }
      
      // 2. También buscar iframes en todo el documento (algunos pueden estar fuera del contenedor)
      const allIframes = document.querySelectorAll('iframe');
      if (allIframes.length > (containerIframes?.length || 0)) {
        console.log(`Encontrados ${allIframes.length} iframes en total en el documento`);
        
        allIframes.forEach((iframe, index) => {
          if (!iframe.hasAttribute('sandbox') || 
              iframe.getAttribute('sandbox') !== 'allow-scripts allow-same-origin') {
            iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
            console.log(`Iframe global ${index} configurado con sandbox="allow-scripts allow-same-origin"`);
          }
        });
      }
    };

    // Ejecutar inmediatamente para los iframes existentes
    if (document.body) {
      configureSandboxForIframes();
    }
    
    // Monitorear la creación de iframes
    const observer = new MutationObserver((mutations) => {
      let hasNewIframes = false;
      
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Verificar si hay nuevos iframes
          hasNewIframes = Array.from(mutation.addedNodes).some(
            node => node.nodeName === 'IFRAME' || 
                  (node instanceof Element && node.querySelector('iframe'))
          );
          
          if (hasNewIframes) break;
        }
      }
      
      if (hasNewIframes) {
        console.log('Detectados nuevos iframes, aplicando configuración...');
        // Aplicamos la configuración con un pequeño retraso para asegurar que los iframes estén completamente creados
        setTimeout(configureSandboxForIframes, 50);
      }
    });

    // Iniciar observación en todo el documento
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
    
    console.log('Observador de iframes iniciado en todo el documento');

    // Parche para iframes srcdoc
    const monitorSrcdocIframes = () => {
      // Buscar todos los iframes con srcdoc
      const srcdocIframes = document.querySelectorAll('iframe[srcdoc]');
      
      if (srcdocIframes.length > 0) {
        console.log(`Encontrados ${srcdocIframes.length} iframes con srcdoc`);
        
        srcdocIframes.forEach((iframe, index) => {
          const srcdoc = iframe.getAttribute('srcdoc') || '';
          
          // Modificar el srcdoc para habilitar scripts
          if (srcdoc && !srcdoc.includes('allow-scripts')) {
            // Añadir el atributo sandbox al iframe
            iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
            
            // Modificar el contenido srcdoc si es posible
            if (!srcdoc.includes('<meta http-equiv="Content-Security-Policy"')) {
              const modifiedSrcdoc = srcdoc.replace('<head>', 
                '<head><meta http-equiv="Content-Security-Policy" content="script-src \'self\' \'unsafe-inline\';">');
              
              iframe.setAttribute('srcdoc', modifiedSrcdoc);
              console.log(`Contenido srcdoc modificado para iframe ${index}`);
            }
          }
        });
      }
    };
    
    // Ejecutar el monitor de srcdoc cada 500ms
    const srcdocInterval = setInterval(monitorSrcdocIframes, 500);

    // Limpieza
    return () => {
      observer.disconnect();
      clearInterval(srcdocInterval);
      console.log('Observadores de iframes desconectados');
    };
  }, []);

  useEffect(() => {
    if (!url && !blob && !arrayBuffer) return;
    if (Platform.OS !== 'web') return;
    
    // Evitar cargas duplicadas
    if (hasAttempedLoad.current && bookRef.current) return;
    hasAttempedLoad.current = true;

    console.log('URL del EPUB recibida:', url);
    console.log('Blob disponible:', blob ? 'Sí' : 'No');
    console.log('ArrayBuffer disponible:', arrayBuffer ? 'Sí' : 'No');
    console.log('Posición inicial recibida:', initialLocation || 'No disponible');
    
    // Función para cargar y renderizar el EPUB
    const loadEpub = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Limpiar cualquier contenido previo
        if (viewerRef.current) {
          viewerRef.current.innerHTML = '';
        }
          // Crear una nueva instancia del libro usando el método más adecuado
        let book: Book;
        
        try {          // Preferimos usar ArrayBuffer por compatibilidad
          if (arrayBuffer) {
            console.log('Iniciando carga del EPUB desde ArrayBuffer');
            console.log('Tamaño del ArrayBuffer:', arrayBuffer.byteLength, 'bytes');
            
            try {
              // Crear un Blob desde ArrayBuffer
              const arrayBufferBlob = new Blob([arrayBuffer], { type: 'application/epub+zip' });
              console.log('Blob creado desde ArrayBuffer, tamaño:', arrayBufferBlob.size, 'bytes');
              
              // Método 1: Intentar usando el Blob directamente
              try {
                console.log('Intentando crear libro directamente desde Blob');
                book = ePub(arrayBufferBlob);
              } catch (blobError) {
                console.error('Error al crear libro desde Blob:', blobError);
                
                // Método 2: Crear URL desde Blob
                const arrayBufferUrl = URL.createObjectURL(arrayBufferBlob);
                console.log('URL creada desde ArrayBuffer:', arrayBufferUrl);
                
                // Intentar crear el libro desde la URL
                book = ePub(arrayBufferUrl);
              }
            } catch (conversionError) {
              console.error('Error al convertir ArrayBuffer:', conversionError);
              throw conversionError;
            }
          }          // Segunda opción: usar Blob directamente
          else if (blob) {
            console.log('Iniciando carga del EPUB desde Blob');
            console.log('Tipo del Blob:', blob.type);
            console.log('Tamaño del Blob:', blob.size, 'bytes');
            
            try {
              // Asegurarnos de que el Blob tenga el tipo MIME correcto
              const epubBlob = blob.type === 'application/epub+zip' 
                ? blob 
                : new Blob([await blob.arrayBuffer()], { type: 'application/epub+zip' });
              
              // Método 1: Intentar usando el Blob directamente
              try {
                console.log('Intentando crear libro directamente desde Blob');
                book = ePub(epubBlob);
              } catch (blobError) {
                console.error('Error al crear libro desde Blob:', blobError);
                
                // Método 2: Crear URL desde Blob
                const blobUrl = URL.createObjectURL(epubBlob);
                console.log('URL creada desde Blob:', blobUrl);
                
                // Intentar crear el libro desde la URL
                book = ePub(blobUrl);
              }
            } catch (conversionError) {
              console.error('Error al procesar Blob:', conversionError);
              throw conversionError;
            }
          }          // Última opción: usar la URL directamente
          else if (url) {
            console.log('Iniciando carga del EPUB desde URL:', url);
            
            // Validar que la URL es válida
            if (!url.startsWith('blob:') && !url.startsWith('http')) {
              throw new Error('URL del EPUB no válida');
            }
            
            try {
              // Método 1: Intentar cargar directamente
              book = ePub(url);
            } catch (urlError) {
              console.error('Error al cargar desde URL directa:', urlError);
              
              // Método 2: Intentar cargar a través de fetch y luego crear un blob
              console.log('Intentando obtener el EPUB mediante fetch...');
              const response = await fetch(url);
              if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
              
              const contentType = response.headers.get('content-type');
              console.log('Tipo de contenido recibido:', contentType);
              
              const epubArrayBuffer = await response.arrayBuffer();
              console.log('EPUB recibido, tamaño:', epubArrayBuffer.byteLength, 'bytes');
              
              const epubBlob = new Blob([epubArrayBuffer], { type: 'application/epub+zip' });
              const newBlobUrl = URL.createObjectURL(epubBlob);
              console.log('Nueva URL creada desde fetch:', newBlobUrl);
              
              book = ePub(newBlobUrl);
            }
          } else {
            throw new Error('No se proporcionó ningún método válido para cargar el EPUB');
          }
        } catch (initError) {
          console.error('Error al inicializar el libro:', initError);
            // Intento de recuperación: intentar cargar usando fetch directamente
          if (url && (url.startsWith('http') || url.startsWith('blob:'))) {
            console.log('Intento alternativo: cargando mediante fetch desde URL:', url);
            
            try {
              const response = await fetch(url, {
                headers: {
                  'Accept': 'application/epub+zip'
                }
              });
              
              if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
              
              const contentType = response.headers.get('content-type');
              console.log('Tipo de contenido recibido en fallback:', contentType);
              
              const epubArrayBuffer = await response.arrayBuffer();
              console.log('EPUB recibido en fallback, tamaño:', epubArrayBuffer.byteLength, 'bytes');
              
              if (epubArrayBuffer.byteLength === 0) {
                throw new Error('El archivo EPUB descargado está vacío');
              }
              
              const epubBlob = new Blob([epubArrayBuffer], { type: 'application/epub+zip' });
              const newBlobUrl = URL.createObjectURL(epubBlob);
              
              console.log('URL alternativa creada:', newBlobUrl);
              console.log('Intentando crear libro desde URL alternativa');
              
              try {
                // Intentar primero directamente con el Blob
                book = ePub(epubBlob);
              } catch (blobError) {
                console.error('Error al crear libro desde Blob alternativo:', blobError);
                // Si falla, intentar con la URL
                book = ePub(newBlobUrl);
              }} catch (fetchError) {
              const errorMessage = fetchError instanceof Error ? fetchError.message : 'Error desconocido';
              console.error('Error en intento alternativo:', errorMessage);
              throw new Error(`Error al cargar el EPUB: ${errorMessage}`);
            }
          } else {
            throw initError;
          }
        }
        
        bookRef.current = book;
        
        // Registrar evento para debug
        book.on('openFailed', (error: any) => {
          console.error('Error al abrir el EPUB:', error);
          setError('Error al abrir el EPUB: ' + (error.message || 'Error desconocido'));
          setIsLoading(false);
        });
        
        // Esperar a que el libro esté listo
        await book.ready;
        console.log('Libro EPUB listo para renderizar');
        
        // Crear un nuevo rendition
        if (!viewerRef.current) {
          throw new Error('El contenedor de renderizado no está disponible');
        }        const rendition = book.renderTo(viewerRef.current, {
          width: '100%',
          height: '100%',
          spread: 'auto',
          flow: 'paginated',
          script: 'allow' // Permitir la ejecución de scripts dentro del contenido del libro
        });
        
        // Configurar manualmente los iframes cuando se creen
        const onIframeLoad = () => {
          if (viewerRef.current) {
            const iframes = viewerRef.current.querySelectorAll('iframe');
            iframes.forEach((iframe: HTMLIFrameElement) => {
              iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
              console.log('Configurado sandbox en iframe del rendition');
              
              // Intentar manejar iframes internos
              if (iframe.contentWindow) {
                try {
                  // Monitorear la creación de iframes dentro del iframe principal
                  const innerDoc = iframe.contentDocument || iframe.contentWindow.document;
                  if (innerDoc) {
                    // Modificar la función createElement dentro del iframe
                    const script = innerDoc.createElement('script');
                    script.textContent = `
                      // Parchear createElement para iframes internos
                      if (document.createElement) {
                        const originalCreateElement = document.createElement;
                        document.createElement = function(tagName) {
                          const element = originalCreateElement.call(document, tagName);
                          if (tagName.toLowerCase() === 'iframe') {
                            element.setAttribute('sandbox', 'allow-scripts allow-same-origin');
                            console.log('iframe interno configurado automáticamente');
                          }
                          return element;
                        };
                        console.log('Función createElement parcheada en iframe');
                      }
                    `;
                    if (innerDoc.head) {
                      innerDoc.head.appendChild(script);
                    }
                  }
                } catch (e) {
                  console.warn('No se pudo modificar documento interno del iframe:', e);
                }
              }
            });
          }
        };
        
        // Aplicar la configuración inicial
        onIframeLoad();
        
        // Configurar para futuras actualizaciones
        rendition.on('rendered', onIframeLoad);
        
        // Parchear la función de navegación para manejar iframes nuevos
        const originalNext = rendition.next.bind(rendition);
        rendition.next = function() {
          console.log('Interceptando llamada a next()...');
          const result = originalNext();
          setTimeout(onIframeLoad, 100); // Aplicar después de que se cree el nuevo iframe
          return result;
        };
        
        const originalPrev = rendition.prev.bind(rendition);
        rendition.prev = function() {
          console.log('Interceptando llamada a prev()...');
          const result = originalPrev();
          setTimeout(onIframeLoad, 100); // Aplicar después de que se cree el nuevo iframe
          return result;
        };renditionRef.current = rendition;
          // Configurar eventos de localización
        rendition.on('locationChanged', (location: Location) => {
          try {
            console.log('Evento locationChanged disparado:', location);
            
            if (onLocationChange && location.start && location.start.cfi) {
              // Validar el CFI antes de enviarlo
              const cfi = location.start.cfi;
              console.log('CFI actual:', cfi);
              
              if (isValidCfi(cfi)) {
                // Si ya hemos guardado este mismo CFI, no lo volvemos a guardar
                if (lastSavedCfi.current === cfi) {
                  console.log('CFI ya guardado, omitiendo actualización duplicada');
                  return;
                }
                
                // Verificamos si el CFI podría causar problemas
                const hasPotentialIssue = cfi.includes(':') && 
                  parseInt(cfi.split(':')[1].replace(')', ''), 10) > 30;
                
                if (hasPotentialIssue) {
                  console.warn('CFI con offset potencialmente problemático:', cfi);
                  // No seguimos procesando CFIs potencialmente problemáticos
                  return;
                }
                
                // Enviamos el CFI completo
                onLocationChange(cfi);
                
                // También podemos guardar la posición en el backend directamente
                if (url) {
                  // Extraer el ID del libro de la URL
                  const bookIdMatch = url.match(/\/books\/(\d+)/);
                  if (bookIdMatch && bookIdMatch[1]) {
                    const bookId = bookIdMatch[1];
                    console.log('Actualizando posición de lectura para el libro:', bookId);                    // Construir los datos de posición
                    // Calculamos el porcentaje basado en el índice
                    const currentIndex = location.start.index || 0;
                    // Calculamos un porcentaje aproximado
                    const calculatedPercentage = Math.round(currentIndex);
                    
                    const positionData = {
                      format: 'EPUB',
                      user: 'usuario1', // Idealmente, obtener esto del contexto de autenticación
                      device: 'browser',
                      cfi: location.start.cfi,
                      position: calculatedPercentage
                    };
                    
                    // Log para debug
                    console.log('Datos de posición a guardar:', {
                      cfi: location.start.cfi,
                      index: location.start.index,
                      href: location.start.href,
                      calculatedPercentage
                    });
                    
                    // Enviar al servidor usando los dos métodos (PUT y POST) para asegurar compatibilidad
                    const savePosition = async () => {
                      try {
                        // Intento 1: PUT
                        try {
                          const putResponse = await fetch(`http://localhost:3000/api/books/${bookId}/position`, {
                            method: 'PUT',
                            headers: {
                              'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(positionData)
                          });
                          
                          const putData = await putResponse.json();
                          if (putData.success) {                            console.log('Posición guardada correctamente con PUT:', putData);
                            // Actualizar el CFI guardado
                            lastSavedCfi.current = positionData.cfi;
                            return;
                          } else {
                            console.error('Error al guardar posición con PUT:', putData.message);
                            throw new Error(putData.message);
                          }
                        } catch (putError) {
                          console.error('Error en la petición PUT:', putError);
                          
                          // Intento 2: POST como alternativa
                          const postResponse = await fetch(`http://localhost:3000/api/books/${bookId}/position`, {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(positionData)
                          });
                          
                          const postData = await postResponse.json();
                          if (postData.success) {
                            console.log('Posición guardada correctamente con POST:', postData);
                            // Actualizar el CFI guardado
                            lastSavedCfi.current = positionData.cfi;
                          } else {
                            console.error('Error al guardar posición con POST:', postData.message);
                          }
                        }
                      } catch (error) {
                        console.error('Error al enviar posición al servidor:', error);
                      }
                    };
                    
                    // Ejecutar sin esperar para no bloquear la UI
                    savePosition();
                  }
                }
              }
            }
          } catch (locationError) {
            console.error('Error en el evento locationChanged:', locationError);
            // No propagamos errores para evitar que el lector se rompa
          }
        });
          // Mostrar el libro en la posición guardada o al inicio
        if (initialLocation && !locationSet.current) {
          console.log('Restaurando posición de lectura a:', initialLocation);
          try {
            // Validar el formato del CFI antes de intentar mostrarlo
            if (isValidCfi(initialLocation)) {
              try {
                // Intento principal con manejo de errores explícito
                await rendition.display(initialLocation);
                locationSet.current = true;
                console.log('Posición de lectura restaurada exitosamente');
                
                // Guardar el CFI inicial como último guardado para evitar actualización inmediata
                lastSavedCfi.current = initialLocation;
              } catch (displayError) {
                console.error('Error al restaurar la posición específica:', displayError);
                
                // Si el CFI es de formato corto (como "epubcfi(/6/4!/1:36)"), intentamos con formato más básico
                if (initialLocation.includes(':')) {
                  const basicCfi = initialLocation.split(':')[0] + ')';
                  console.log('Intentando con CFI simplificado:', basicCfi);
                  try {
                    await rendition.display(basicCfi);
                    locationSet.current = true;
                    lastSavedCfi.current = basicCfi;
                    console.log('Posición restaurada con CFI simplificado');
                  } catch (basicError) {
                    console.error('Error también con CFI simplificado:', basicError);
                    await rendition.display(); // Comenzar desde el inicio como último recurso
                  }
                } else {
                  // Si no podemos simplificar más, comenzamos desde el inicio
                  console.log('Comenzando desde el inicio como fallback');
                  await rendition.display();
                }
              }
            } else {
              console.warn('El CFI proporcionado no tiene un formato válido, comenzando desde el inicio del libro');
              await rendition.display();
            }
          } catch (cfiError) {
            console.error('Error al restaurar la posición de lectura:', cfiError);
            console.log('Fallback: comenzando desde el inicio del libro');
            await rendition.display();
          }
        } else {
          console.log('Comenzando lectura desde el inicio');
          await rendition.display();
        }
        console.log('EPUB renderizado correctamente');
        
        setIsLoading(false);
        setIsReady(true);
      } catch (err: any) {
        console.error('Error al cargar el EPUB:', err);
        setError('Error al cargar el EPUB: ' + (err.message || 'Error desconocido'));
        setIsLoading(false);
      }
    };
    
    // Iniciar la carga del EPUB
    loadEpub();
    
    // Limpieza al desmontar
    return () => {
      if (renditionRef.current) {
        try {
          renditionRef.current.destroy();
        } catch (e) {
          console.error('Error al destruir el rendition:', e);
        }
      }
      
      if (bookRef.current) {
        try {
          bookRef.current.destroy();
        } catch (e) {
          console.error('Error al destruir el libro:', e);
        }
      }
    };
  }, [url, blob, arrayBuffer, onLocationChange, initialLocation]);
  
  // Debug para el manejo de CFI
  useEffect(() => {
    if (initialLocation) {
      console.log('Debug - CFI inicial recibido:', initialLocation);
    }
    
    // Añadir un manejador global para ver los errores de CFI
    const handleError = (event: ErrorEvent) => {
      if (event.message && event.message.includes('IndexSizeError') && event.message.includes('Range')) {
        console.error('Error de CFI detectado:', event.message);
        console.error('Stack:', event.error?.stack);
      }
    };
    
    window.addEventListener('error', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, [initialLocation]);
  // Controles de navegación
  const goNext = () => {
    if (renditionRef.current) {
      try {
        console.log('Avanzando a la siguiente página...');
        
        // Ejecutar antes para prevenir el error
        setTimeout(() => {
          const iframes = document.querySelectorAll('iframe');
          iframes.forEach(iframe => {
            iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
          });
        }, 0);
        
        // Avanzar página
        renditionRef.current.next().then(() => {
          console.log('Avance de página completado');
          
          // Aplicar de nuevo después del avance
          setTimeout(() => {
            const iframes = document.querySelectorAll('iframe');
            iframes.forEach(iframe => {
              iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
              console.log('iframe configurado después de avanzar página');
            });
          }, 100);
        }).catch(error => {
          console.error('Error al avanzar página:', error);
        });
      } catch (e) {
        console.error('Error al avanzar página:', e);
      }
    }
  };

  const goPrevious = () => {
    if (renditionRef.current) {
      try {
        console.log('Retrocediendo a la página anterior...');
        
        // Ejecutar antes para prevenir el error
        setTimeout(() => {
          const iframes = document.querySelectorAll('iframe');
          iframes.forEach(iframe => {
            iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
          });
        }, 0);
        
        // Retroceder página
        renditionRef.current.prev().then(() => {
          console.log('Retroceso de página completado');
          
          // Aplicar de nuevo después del retroceso
          setTimeout(() => {
            const iframes = document.querySelectorAll('iframe');
            iframes.forEach(iframe => {
              iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
              console.log('iframe configurado después de retroceder página');
            });
          }, 100);
        }).catch(error => {
          console.error('Error al retroceder página:', error);
        });
      } catch (e) {
        console.error('Error al retroceder página:', e);
      }
    }
  };

  // Si no estamos en web, mostramos un mensaje
  if (Platform.OS !== 'web') {
    return (
      <View style={styles.container}>
        <Text>El lector web de EPUB solo está disponible en la versión web.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando EPUB...</Text>
          <Text style={styles.debugText}>URL: {url ? url.substring(0, 30) + '...' : 'No disponible'}</Text>
          <Text style={styles.debugText}>Método: {arrayBuffer ? 'ArrayBuffer' : blob ? 'Blob' : 'URL'}</Text>
        </View>
      )}
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <button 
            onClick={() => { hasAttempedLoad.current = false; window.location.reload(); }} 
            style={styles.retryButton}
          >
            Reintentar
          </button>
        </View>
      )}
        <div 
        ref={viewerRef} 
        style={{
          width: '100%',
          height: '90%',
          backgroundColor: '#f9f9f9',
          display: isLoading ? 'none' : 'block', // Ocultar mientras carga
          border: '1px solid #ddd',
          overflow: 'hidden',
          position: 'relative' // Importante para el posicionamiento del iframe
        }} 
        data-testid="epub-viewer-container"
      />
      
      {isReady && (
        <View style={styles.navigationContainer}>
          <button onClick={goPrevious} style={styles.navButton}>Anterior</button>
          <Text style={styles.statusText}>Libro cargado correctamente</Text>
          <button onClick={goNext} style={styles.navButton}>Siguiente</button>
        </View>
      )}
      
      {!isLoading && !isReady && !error && (
        <View style={styles.waitingContainer}>
          <Text style={styles.waitingText}>Preparando visualización...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
  },
  epubViewerWeb: {
    width: '100%',
    height: '90%',
    backgroundColor: '#f9f9f9',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 10,
  },
  loadingText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  debugText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
  errorContainer: {
    padding: 20,
    backgroundColor: '#fee',
    margin: 10,
    borderRadius: 5,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
  },
  retryButton: {
    padding: 10,
    backgroundColor: '#ff6b6b',
    color: 'white',
    borderRadius: 5,
    cursor: 'pointer',
    border: 'none',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#f0f0f0',
    height: '10%',
    alignItems: 'center',
  },
  navButton: {
    padding: 10,
    backgroundColor: '#007AFF',
    color: 'white',
    borderRadius: 5,
    cursor: 'pointer',
    border: 'none',
    margin: 5,
  },
  statusText: {
    color: '#28a745',
    fontSize: 14,
    textAlign: 'center',
  },
  waitingContainer: {
    padding: 20,
    backgroundColor: '#fffde7',
    margin: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  waitingText: {
    color: '#ff9800',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default WebEpubReader;
