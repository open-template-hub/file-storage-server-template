import { Pool, QueryResult } from 'pg';
import { Builder } from '../services/builder.service';

export class PostgreSqlProvider {
  private readonly POOL_NOT_INITIALIZED = 'Pool not initialized';
  pool: Pool | null = null;

  builder = new Builder();

  preloadTablesTemplatePath = './assets/sql/preload.tables.psql';

  preload = async () => {
    await this.initConnection();
    let tables = this.builder.buildTemplate(this.preloadTablesTemplatePath, null);
    return await this.query(tables, []);
  }

  initConnection = async() => {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      }
    });

    await this.pool.connect((err, client, release) => {
      if (err) {
          console.log(err);
      } else {
          return console.log("no error");
      }
  })
  }

  query = async(text: string, params: Array<any>): Promise<any> => {
    const start = Date.now();
    if (this.pool == null) throw new Error(this.POOL_NOT_INITIALIZED); 
    const definedPool = this.pool;
    var promise = new Promise( function (resolve, reject) {
      definedPool.query(text, params, (err: Error, res: QueryResult<any>) => {
        if (err) {
          console.error(err);
          reject(err);
        }
        else {
          const duration = Date.now() - start;
          console.log('executed query', { text, duration });
          console.log('res', res);
          resolve(res);
        }
      });
    });
    return promise;
  }
}
