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
      const firstColon = dbUrl.indexOf(':', 8);
      const lastAt = dbUrl.lastIndexOf('@');
      const lastSlash = dbUrl.lastIndexOf('/');

      if (firstColon !== -1 && lastAt !== -1 && lastSlash !== -1 && firstColon < lastAt && lastAt < lastSlash) {
        username = dbUrl.substring(8, firstColon);
        password = decodeURIComponent(dbUrl.substring(firstColon + 1, lastAt));

        const hostPort = dbUrl.substring(lastAt + 1, lastSlash);
        if (hostPort.includes(':')) {
          const [h, p] = hostPort.split(':');
          host = h || 'localhost';
          port = p || '3306';
        } else {
          host = hostPort || 'localhost';
        }

        database = dbUrl.substring(lastSlash + 1).split('?')[0];
      }
    } catch {
      // Return defaults if parse fails
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
  const rawPassword = password || '';
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
