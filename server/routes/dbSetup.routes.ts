import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const router = Router();

// Get current database credentials auto-parsed from .env
router.get('/current', (_req, res) => {
  const dbUrl = process.env.DATABASE_URL || '';
  let host = 'localhost';
  let port = '3306';
  let database = '';
  let username = '';
  let password = '';

  if (dbUrl.startsWith('mysql://')) {
    try {
      const parsed = new URL(dbUrl);
      username = decodeURIComponent(parsed.username || '');
      password = decodeURIComponent(parsed.password || '');
      host = parsed.hostname || 'localhost';
      port = parsed.port || '3306';
      database = decodeURIComponent(parsed.pathname ? parsed.pathname.replace(/^\//, '') : '');
    } catch {
      // Regex fallback if URL constructor throws on unencoded characters
      const match = dbUrl.match(/^mysql:\/\/([^:]+):([^@]+)@([^:\/]+)(?::(\d+))?\/(.+)$/);
      if (match) {
        username = decodeURIComponent(match[1]);
        password = decodeURIComponent(match[2]);
        host = match[3];
        port = match[4] || '3306';
        database = match[5].split('?')[0];
      }
    }

    // Clean up accidental leading slash in password if present
    if (password.startsWith('/')) {
      password = password.slice(1);
    }
  }

  res.json({
    success: true,
    data: {
      host,
      port,
      database,
      username,
      password,
      rawUrl: dbUrl,
    },
  });
});

// Test connection with candidate credentials
router.post('/test', async (req, res) => {
  const { host = 'localhost', port = '3306', database, username, password } = req.body;

  if (!database || !username) {
    return res.status(400).json({
      success: false,
      message: 'Database Name and Username are required.',
    });
  }

  // Build candidate DATABASE_URL
  const rawPassword = (password || '').replace(/^\//, ''); // Clean leading slash if pasted
  const encodedPassword = encodeURIComponent(rawPassword);
  const candidateUrl = `mysql://${username}:${encodedPassword}@${host}:${port}/${database}`;

  let testClient: PrismaClient | null = null;
  try {
    testClient = new PrismaClient({
      datasources: {
        db: { url: candidateUrl },
      },
      log: ['error'],
    });

    // Test connection with quick raw query
    await testClient.$connect();
    await testClient.$queryRaw`SELECT 1 as result`;

    await testClient.$disconnect();

    return res.json({
      success: true,
      message: '✅ Database Connection Successful! Credentials are 100% valid.',
      candidateUrl,
    });
  } catch (error: any) {
    if (testClient) {
      try { await testClient.$disconnect(); } catch {}
    }

    let detailedReason = error?.message || 'Unknown database connection error';
    if (detailedReason.includes('Authentication failed')) {
      detailedReason = `Authentication failed: Invalid username '${username}' or password for MySQL database '${database}'.`;
    } else if (detailedReason.includes('Unknown database')) {
      detailedReason = `Database '${database}' does not exist on MySQL server at ${host}:${port}. Please create the database first in phpMyAdmin/hPanel.`;
    } else if (detailedReason.includes('Can\'t connect') || detailedReason.includes('ECONNREFUSED')) {
      detailedReason = `Could not reach MySQL server at ${host}:${port}. Check host address (try 127.0.0.1 or localhost) and port.`;
    }

    return res.status(400).json({
      success: false,
      message: '❌ Database Connection Failed',
      error: detailedReason,
    });
  }
});

// Save valid connection string to .env
router.post('/save', async (req, res) => {
  const { databaseUrl } = req.body;

  if (!databaseUrl || !databaseUrl.startsWith('mysql://')) {
    return res.status(400).json({
      success: false,
      message: 'Invalid MySQL database URL format.',
    });
  }

  try {
    const envPath = path.join(process.cwd(), '.env');
    let envContent = '';

    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    if (envContent.includes('DATABASE_URL=')) {
      envContent = envContent.replace(/DATABASE_URL=.*$/m, `DATABASE_URL="${databaseUrl}"`);
    } else {
      envContent += `\nDATABASE_URL="${databaseUrl}"\n`;
    }

    fs.writeFileSync(envPath, envContent, 'utf8');
    process.env.DATABASE_URL = databaseUrl;

    return res.json({
      success: true,
      message: '🎉 Database URL saved to .env file successfully! Database is now active.',
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to write to .env file.',
      error: error?.message || String(error),
    });
  }
});

export default router;
