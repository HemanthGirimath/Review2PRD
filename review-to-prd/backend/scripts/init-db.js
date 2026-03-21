#!/usr/bin/env node

/**
 * init-db.js
 * Reads init-db.sql and executes it against the DATABASE_URL Postgres instance.
 * Used as a Railway pre-deploy command to initialize the schema without psql.
 *
 * Executes each SQL statement individually to avoid multi-statement issues
 * with some Postgres client configurations, and verifies tables exist after
 * creation by querying information_schema.
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
    console.log('✅ Connected to database.');

    // Split on semicolons and filter out empty/comment-only segments so each
    // statement is sent as a separate query — some pg client configurations
    // silently drop multi-statement strings.
    const statements = sql
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith('--'));

    console.log(`⚙️  Executing ${statements.length} SQL statement(s) individually...`);

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

    // Verify the expected tables were actually created.
    console.log('\n🔍 Verifying tables in information_schema...');
    const verifyResult = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name IN ('analyses', 'user_settings')
      ORDER BY table_name
    `);

    const foundTables = verifyResult.rows.map((r) => r.table_name);
    console.log(`📋 Tables found (${foundTables.length}): ${foundTables.join(', ') || 'none'}`);

    const expectedTables = ['analyses', 'user_settings'];
    const missingTables = expectedTables.filter((t) => !foundTables.includes(t));

    if (missingTables.length > 0) {
      console.error(`❌ Missing tables after initialization: ${missingTables.join(', ')}`);
      process.exit(1);
    }

    console.log(`\n✅ Database schema initialized successfully. ${foundTables.length} table(s) verified.`);
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Failed to initialize database schema:', err.message);
    process.exit(1);
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

init();
