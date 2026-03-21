#!/usr/bin/env node

/**
 * init-db.js
 * Reads init-db.sql and executes it against the DATABASE_URL Postgres instance.
 * Used as a Railway pre-deploy command to initialize the schema without psql.
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ DATABASE_URL environment variable is not set.');
  process.exit(1);
}

const sqlPath = path.join(__dirname, 'init-db.sql');

if (!fs.existsSync(sqlPath)) {
  console.error(`❌ SQL file not found: ${sqlPath}`);
  process.exit(1);
}

const sql = fs.readFileSync(sqlPath, 'utf8');

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: databaseUrl.includes('localhost') ? false : { rejectUnauthorized: false },
});

async function init() {
  let client;
  try {
    console.log('🔌 Connecting to database...');
    client = await pool.connect();

    console.log('⚙️  Running schema initialization...');
    await client.query(sql);

    console.log('✅ Database schema initialized successfully.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to initialize database schema:', err.message);
    process.exit(1);
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

init();
