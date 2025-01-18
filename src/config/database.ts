import knex from 'knex'
export const DB_HOST=env('DB_HOST')
export const DB_PORT=env('DB_PORT')
export const DB_USER=env('DB_USER')
export const DB_PASS=env('DB_PASS')
export const DB_DATABASE=env('DB_DATABASE')

const knexConfig = knex({
    client: 'mysql2',
    connection: {
      host: DB_HOST,
      port: Number(DB_PORT),
      user:  DB_USER,
      password:  DB_PASS,
      database: DB_DATABASE,
    },
});
export default knexConfig