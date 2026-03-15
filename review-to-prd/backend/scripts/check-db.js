const { Pool } = require('pg');
const pool = new Pool({
    connectionString: 'postgresql://postgres:postgres@localhost:5432/review2prd'
});

async function check() {
    try {
        console.log('Connecting to database...');
        const res = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_name = 'analyses'");
        if (res.rowCount === 0) {
            console.log('❌ Table "analyses" is MISSING.');
        } else {
            console.log('✅ Table "analyses" EXISTS.');
            const count = await pool.query("SELECT COUNT(*) FROM analyses");
            console.log('📊 Row count:', count.rows[0].count);
            
            const sample = await pool.query("SELECT id, app_name FROM analyses LIMIT 5");
            console.log('📝 Sample rows:', sample.rows);
        }
    } catch (err) {
        console.error('❌ Database Error:', err);
    } finally {
        await pool.end();
    }
}
check();
