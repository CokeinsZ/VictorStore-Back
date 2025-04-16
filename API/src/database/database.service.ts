import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as sql from 'mssql';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {

    private pool: sql.ConnectionPool;
    private server: string | undefined;
    private port: string | undefined;
    private user: string | undefined;
    private password: string | undefined;
    private database: string | undefined;
  constructor() {
    this.server = process.env.SQL_SERVER_HOST;
    this.port = process.env.SQL_SERVER_PORT || '1433';
    this.user = process.env.SQL_SERVER_USERNAME;
    this.password = process.env.SQL_SERVER_PASSWORD;
    this.database = process.env.SQL_DATABASE;

    if (!this.server || !this.user || !this.password || !this.database) {
      throw new Error('Variables de entorno no configuradas. Varibales necesarias: SQL_SERVER_HOST, SQL_SERVER_USERNAME, SQL_SERVER_PASSWORD, SQL_DATABASE');
    }
  }

  async onModuleInit() {
    const config = {
      server: this.server as string,           // Ejemplo: 'tu-servidor.database.windows.net'
      port: Number(this.port) || 1433, // El puerto predeterminado para SQL Server es 1433
      user: this.user as string,
      password: this.password as string,
      database: this.database as string,              // Nombre de la base de datos
      options: {
        encrypt: true,         // Obligatorio para conexiones seguras a Azure SQL Database
        enableArithAbort: true // Configuración necesaria para el driver mssql
      },
      connectionTimeout: 30000, // Tiempo de espera para la conexión (en milisegundos)
      requestTimeout: 30000     // Tiempo de espera para las solicitudes
    };

    try {
      // Establece un pool de conexiones
      this.pool = await new sql.ConnectionPool(config).connect();
      console.log('Conexión establecida a la base de datos.');
      
    } catch (error) {
      console.error('Error al conectar con la base de datos:', error);
      throw error;
    }
  }

  /**
   * Ejecuta una consulta T-SQL pura.
   * @param query La consulta T-SQL a ejecutar.
   * @param params Un objeto opcional con parámetros (clave-valor) para la consulta.
   */
  async executeQuery<T = any>(query: string, params?: { [key: string]: any }): Promise<sql.IRecordSet<T>> {
    try {
      const request = this.pool.request();

      // Si se proporcionan parámetros, se agregan a la solicitud.
      if (params) {
        for (const [key, value] of Object.entries(params)) {
          request.input(key, value);
        }
      }

      const result = await request.query(query);
      return result.recordset;

    } catch (error) {
      console.error('Error al ejecutar la consulta:', error);
      throw error;
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.pool) {
      await this.pool.close();
      console.log('Conexión cerrada.');
    }
  }
}
