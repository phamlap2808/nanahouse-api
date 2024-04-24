const dbHost: string = process.env.DATABASE_URL || 'localhost'
const dbType: string = process.env.DATABASE_TYPE || 'mongodb'
const dbName: string = process.env.DATABASE_NAME || ''
const dbUser: string = process.env.DATABASE_USER || ''
const dbPass: string = process.env.DATABASE_PASS || ''
const connectionString: string = process.env.DATABASE_URL

export { dbHost, dbType, dbName, dbUser, dbPass, connectionString }
