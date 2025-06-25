import { openDB, IDBPDatabase } from 'idb';

// Interfaz para tipar los datos genéricos
export interface ILocalData {
  id: string;
  [key: string]: any;
}

export class SUserLocalStorage {
  private static dbName = 'AppUserData';
  private static storeName = 'user_data';
  private static dbPromise: Promise<IDBPDatabase> | null = null;

  // Inicializa la base de datos y el object store si no existe
  private static async getDB(): Promise<IDBPDatabase> {
    if (!this.dbPromise) {
      this.dbPromise = openDB(this.dbName, 1, {
        upgrade(db: IDBPDatabase<unknown>) {
          if (!db.objectStoreNames.contains(SUserLocalStorage.storeName)) {
            db.createObjectStore(SUserLocalStorage.storeName, { keyPath: 'id' });
          }
        },
      });
    }
    return this.dbPromise;
  }

  // Insertar un nuevo registro
  static async add<T extends ILocalData>(data: T): Promise<void> {
    const db = await this.getDB();
    await db.add(this.storeName, data);
  }

  // Leer un registro por id
  static async get<T = ILocalData>(id: string): Promise<T | undefined> {
    const db = await this.getDB();
    return db.get(this.storeName, id);
  }

  // Modificar (update) un registro existente
  static async update<T extends ILocalData>(data: T): Promise<void> {
    const db = await this.getDB();
    await db.put(this.storeName, data);
  }

  // Borrar un registro por id
  static async delete(id: string): Promise<void> {
    const db = await this.getDB();
    await db.delete(this.storeName, id);
  }

  // Leer todos los registros (opcional)
  static async getAll<T = ILocalData>(): Promise<T[]> {
    const db = await this.getDB();
    return db.getAll(this.storeName);
  }
}

// NOTA: Antes de crear tablas o guardar datos concretos, confirma los detalles de estructura y uso.
