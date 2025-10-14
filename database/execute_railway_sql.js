const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Configuración de conexión
const connectionString = 'postgresql://postgres:AIYDCjNKyqLpDMSkAMxEvLCMxvFgrOCn@mainline.proxy.rlwy.net:24157/railway';

// Leer el archivo SQL
const sqlFile = path.join(__dirname, 'railway_setup.sql');
const sql = fs.readFileSync(sqlFile, 'utf8');

// Ejecutar
async function executeSql() {
    const client = new Client({ connectionString });
    
    try {
        console.log('🔌 Conectando a Railway PostgreSQL...');
        await client.connect();
        console.log('✅ Conectado exitosamente!');
        
        console.log('📝 Ejecutando SQL...');
        await client.query(sql);
        console.log('✅ SQL ejecutado exitosamente!');
        
        console.log('\n🔍 Verificando tablas creadas...');
        const result = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name;
        `);
        
        console.log('Tablas creadas:');
        result.rows.forEach(row => console.log(`  - ${row.table_name}`));
        
        console.log('\n✅ ¡Todo listo! Base de datos configurada correctamente.');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    } finally {
        await client.end();
    }
}

executeSql();


