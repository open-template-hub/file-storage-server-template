import { QueryResult, Pool } from 'pg';
import { Builder } from '../services/builder.service';

export class PostgreSqlProvider {
  private connectionPool: Array<Pool>;
  private currentPoolLimit: number;
  private currentPoolIndex: number;

  builder = new Builder();

  constructor() {
    this.connectionPool = new Array<Pool>();
    this.currentPoolLimit = parseInt(<string>process.env.POSTGRE_CONNECTION_LIMIT) || 20 as number;
    this.currentPoolIndex = 0;
  }

  preloadTablesTemplatePath = './assets/sql/preload.tables.psql';

  preload = async () => {
    this.createConnectionPool();
    let tables = this.builder.buildTemplate(this.preloadTablesTemplatePath, null);
    return await this.query(tables, []);
  }

  createConnectionPool = () => {
    // TODO: Find open Connections and Close

    // Creating Connection Pool
    for (let i = 0; i < this.currentPoolLimit; i++) {
      let conn = new Pool({
        connectionString: process.env.DATABASE_URL,
        application_name: 'FileStorageServer',
        ssl: {
          rejectUnauthorized: false,
        }
      });
      this.connectionPool.push(conn);
    }
  }

  getAvailableConnection = () => {
    if (this.currentPoolIndex === this.currentPoolLimit) {
      this.currentPoolIndex = 0;
    }

    console.log("PostgreSQL Current Pool Index: ", this.currentPoolIndex);
    return this.connectionPool[this.currentPoolIndex++];
  }

  query = async (text: string, params: Array<any>): Promise<any> => {
    const start = Date.now();
    let conn = this.getAvailableConnection();

    return new Promise(function (resolve, reject) {
      conn.query(text, params, (err: Error, res: QueryResult<any>) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          const duration = Date.now() - start;
          console.log('executed query', { text, duration });
          console.log('res', res);
          resolve(res);
        }
      });
    });
  }
}
