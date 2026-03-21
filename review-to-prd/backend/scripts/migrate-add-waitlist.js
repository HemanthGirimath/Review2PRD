#!/usr/bin/env node

/**
 * migrate-add-waitlist.js
 * One-time migration to add the waitlist table to an existing database.
 * Safe to run multiple times — uses CREATE TABLE IF NOT EXISTS.
 *
 * Run via: node scripts/migrate-add-waitlist.js
 * Or as part of the Railway pre-deploy command chain.
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ DATABASE_URL environment variable is not set.');
  process.exit(1);
}

const sqlPath = path.join(__dirname, 'migrate-add-waitlist.sql');

if (!fs.existsSync(sqlPath)) {
  console.error(`❌ Migration SQL file not found: ${sqlPath}`);
  process.exit(1);
}

const sql = fs.readFileSync(sqlPath, 'utf8');

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: databaseUrl.includes('localhost') ? false : { rejectUnauthorized: false },
});

async function migrate() {
  let client;
  try {
    console.log('🔌 Connecting to database...');
    client = await pool.connect();
    console.log('✅ Connected to database.');

    // Remove single-line comments and split into individual statements
    const cleanSql = sql.replace(/--.*$/gm, '');
    const statements = cleanSql
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    console.log(`⚙️  Running ${statements.length} migration statement(s)...`);

    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      const preview = stmt.replace(/\s+/g, ' ').slice(0, 100);
      console.log(`\n[${i + 1}/${statements.length}] Running: ${preview}${stmt.length > 100 ? '...' : ''}`);
      try {
        await client.query(stmt);
        console.log(`[${i + 1}/${statements.length}] ✅ OK`);
      } catch (err) {
        console.error(`[${i + 1}/${statements.length}] ❌ Statement failed: ${err.message}`);
        console.error(`    Full statement:\n${stmt}`);
        throw err;
      }
    }

    // Verify the waitlist table now exists
    console.log('\n🔍 Verifying waitlist table...');
    const result = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name = 'waitlist'
    `);

    if (result.rowCount === 0) {
      console.error('❌ Migration failed: waitlist table not found after migration.');
      process.exit(1);
    }

    console.log('\n✅ Migration complete: waitlist table is present.');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Migration failed:', err.message);
    process.exit(1);
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

migrate();
