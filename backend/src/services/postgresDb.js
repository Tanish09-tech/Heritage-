import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

// PostgreSQL Connection Pool configuration
const pool = new Pool({
  user: process.env.PG_USER || 'postgres',
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_DATABASE || 'sanskriti_suraksha',
  password: process.env.PG_PASSWORD || 'kapil123',
  port: parseInt(process.env.PG_PORT || '5432', 10),
});

// Root Client to create database if it doesn't exist
export async function ensurePostgresDatabase() {
  const rootClient = new pg.Client({
    user: process.env.PG_USER || 'postgres',
    host: process.env.PG_HOST || 'localhost',
    database: 'postgres',
    password: process.env.PG_PASSWORD || 'kapil123',
    port: parseInt(process.env.PG_PORT || '5432', 10),
  });

  try {
    await rootClient.connect();
    const dbName = process.env.PG_DATABASE || 'sanskriti_suraksha';
    const checkDb = await rootClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (checkDb.rows.length === 0) {
      console.log(`[PostgreSQL] Database '${dbName}' not found. Creating database...`);
      await rootClient.query(`CREATE DATABASE "${dbName}"`);
      console.log(`[PostgreSQL] Database '${dbName}' created successfully.`);
    } else {
      console.log(`[PostgreSQL] Database '${dbName}' exists.`);
    }
  } catch (err) {
    console.error('[PostgreSQL] Root DB check error:', err.message);
  } finally {
    await rootClient.end();
  }
}

// SQL Schema Initialization & Tables Creation
export async function initializePostgresSchema() {
  await ensurePostgresDatabase();

  const client = await pool.connect();
  try {
    console.log('[PostgreSQL] Initializing tables schema...');

    // 1. Users Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(100) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        name VARCHAR(255),
        dob DATE,
        hobbies TEXT,
        state VARCHAR(100),
        experience TEXT,
        expert_tradition TEXT,
        profile_completed BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Traditions Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS traditions (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        sanskrit_name VARCHAR(255),
        category VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        region VARCHAR(100),
        community VARCHAR(100),
        language VARCHAR(100),
        gender VARCHAR(50),
        vulnerability_score INTEGER NOT NULL,
        status VARCHAR(50) NOT NULL,
        description TEXT,
        historical_origin TEXT,
        master_count INTEGER DEFAULT 0,
        learner_count INTEGER DEFAULT 0,
        transmission_frequency VARCHAR(100),
        coordinates_lat NUMERIC(8,4),
        coordinates_lng NUMERIC(8,4),
        hero_image TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      ALTER TABLE traditions ADD COLUMN IF NOT EXISTS gender VARCHAR(50);
    `);

    // 3. Matchmaking / Mentorship Applications Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS matchmaking (
        id VARCHAR(100) PRIMARY KEY,
        learner_id VARCHAR(100),
        learner_name VARCHAR(255),
        learner_state VARCHAR(100),
        practitioner_id VARCHAR(100),
        practitioner_name VARCHAR(255),
        tradition_id VARCHAR(100),
        tradition_name VARCHAR(255),
        status VARCHAR(50) DEFAULT 'PENDING',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. Knowledge Vault Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS knowledge_vault (
        id VARCHAR(100) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        tradition VARCHAR(255),
        practitioner VARCHAR(255),
        type VARCHAR(50),
        file_url TEXT,
        status VARCHAR(50) DEFAULT 'Archived',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 5. Validation Queue Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS validation_queue (
        id VARCHAR(100) PRIMARY KEY,
        item_name VARCHAR(255) NOT NULL,
        submitted_by VARCHAR(255),
        type VARCHAR(50),
        state VARCHAR(100),
        details TEXT,
        status VARCHAR(50) DEFAULT 'PENDING',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('[PostgreSQL] All tables verified & created successfully.');
  } catch (err) {
    console.error('[PostgreSQL] Schema Initialization Error:', err);
  } finally {
    client.release();
  }
}

// Seed Fixed 5 Users & Pilot Traditions into PostgreSQL
export async function seedPostgresData(seedTraditions = []) {
  const client = await pool.connect();
  try {
    // Seed 5 Fixed Accounts
    const fixedUsers = [
      {
        id: 'user-shishya-1',
        email: 'shishya1@sanskriti.gov.in',
        password: 'password123',
        role: 'LEARNER',
        name: 'Aniket Deshmukh',
        dob: '2002-05-15',
        hobbies: 'Shahiri Powada recitation, Daf percussion, Historical Maratha Ballads',
        state: 'Maharashtra'
      },
      {
        id: 'user-shishya-2',
        email: 'shishya2@sanskriti.gov.in',
        password: 'password123',
        role: 'LEARNER',
        name: 'Simran Kaur',
        dob: '2003-11-20',
        hobbies: 'Phulkari folk embroidery, Giddha folk dance, Punjabi folk music',
        state: 'Punjab'
      },
      {
        id: 'user-guru-1',
        email: 'guru1@sanskriti.gov.in',
        password: 'password123',
        role: 'PRACTITIONER',
        name: 'Shahir Tukaram Jagtap',
        dob: '1968-08-20',
        state: 'Maharashtra',
        experience: '28 Years of continuous Shahiri Akhada & Daf oral tradition',
        expert_tradition: 'Shahiri Powada (Oral Ballads)'
      },
      {
        id: 'user-guru-2',
        email: 'guru2@sanskriti.gov.in',
        password: 'password123',
        role: 'PRACTITIONER',
        name: 'Ustad Harinder Singh',
        dob: '1965-03-12',
        state: 'Punjab',
        experience: '32 Years of traditional Gatka Shastar Vidiya & folk rhythms',
        expert_tradition: 'Baisakhi & Gatka Martial Art'
      },
      {
        id: 'user-admin-1',
        email: 'admin@sanskriti.gov.in',
        password: 'adminpassword123',
        role: 'AUTHORITY',
        name: 'Dr. Rajesh Sharma',
        state: 'Delhi'
      }
    ];

    for (const u of fixedUsers) {
      await client.query(`
        INSERT INTO users (id, email, password, role, name, dob, hobbies, state, experience, expert_tradition, profile_completed)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, TRUE)
        ON CONFLICT (email) DO UPDATE SET
          name = EXCLUDED.name,
          dob = EXCLUDED.dob,
          hobbies = EXCLUDED.hobbies,
          state = EXCLUDED.state,
          experience = EXCLUDED.experience,
          expert_tradition = EXCLUDED.expert_tradition;
      `, [
        u.id, u.email, u.password, u.role, u.name, u.dob || null,
        u.hobbies || null, u.state || null, u.experience || null, u.expert_tradition || null
      ]);
    }

    // Seed Traditions if table is empty
    const checkTraditions = await client.query('SELECT COUNT(*) FROM traditions');
    if (parseInt(checkTraditions.rows[0].count, 10) === 0 && seedTraditions.length > 0) {
      console.log(`[PostgreSQL] Seeding ${seedTraditions.length} traditions into database...`);
      for (const t of seedTraditions) {
        await client.query(`
          INSERT INTO traditions (
            id, name, sanskrit_name, category, state, region, community, language, gender,
            vulnerability_score, status, description, historical_origin, master_count,
            learner_count, transmission_frequency, coordinates_lat, coordinates_lng, hero_image
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
          ON CONFLICT (id) DO UPDATE SET gender = EXCLUDED.gender;
        `, [
          t.id, t.name, t.sanskritName || null, t.category, t.state, t.region || null,
          t.community || null, t.language || null, t.gender || null, t.vulnerabilityScore || 50,
          t.status || 'Vulnerable', t.description || null, t.historicalOrigin || null,
          t.masterCount || 0, t.learnerCount || 0, t.transmissionFrequency || null,
          t.coordinates?.lat || null, t.coordinates?.lng || null, t.heroImage || null
        ]);
      }
      console.log('[PostgreSQL] Seeded traditions successfully.');
    }

    console.log('[PostgreSQL] Data seeding complete.');
  } catch (err) {
    console.error('[PostgreSQL] Seeding error:', err);
  } finally {
    client.release();
  }
}

export default pool;
