#!/usr/bin/env node

import { randomBytes } from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function generateKey(length = 32) {
  return randomBytes(length).toString('base64');
}

function generateAppKeys(count = 2) {
  return Array.from({ length: count }, () => generateKey(32)).join(',');
}

async function updateEnvFile(filePath, updates) {
  try {
    let content = await fs.readFile(filePath, 'utf-8');

    Object.entries(updates).forEach(([key, value]) => {
      const regex = new RegExp(`^${key}=.*$`, 'm');
      content = content.replace(regex, `${key}=${value}`);
    });

    await fs.writeFile(filePath, content, 'utf-8');
    console.log(`✓ Updated ${path.basename(filePath)}`);
  } catch (error) {
    console.error(`✗ Error updating ${filePath}:`, error.message);
  }
}

async function main() {
  const strapiEnvExamplePath = path.join(__dirname, '../strapi/.env.example');
  const strapiEnvPath = path.join(__dirname, '../strapi/.env');

  const appKeys = generateAppKeys(2);
  const apiTokenSalt = generateKey(16);
  const adminJwtSecret = generateKey(32);
  const transferTokenSalt = generateKey(16);
  const jwtSecret = generateKey(32);

  const updates = {
    'APP_KEYS': `"${appKeys}"`,
    'API_TOKEN_SALT': apiTokenSalt,
    'ADMIN_JWT_SECRET': adminJwtSecret,
    'TRANSFER_TOKEN_SALT': transferTokenSalt,
    'JWT_SECRET': jwtSecret,
  };

  console.log('\n🔐 Generating secure keys for Strapi...\n');
  console.log('Generated keys:');
  console.log(`  APP_KEYS: ${appKeys.substring(0, 40)}...`);
  console.log(`  API_TOKEN_SALT: ${apiTokenSalt.substring(0, 40)}...`);
  console.log(`  ADMIN_JWT_SECRET: ${adminJwtSecret.substring(0, 40)}...`);
  console.log(`  TRANSFER_TOKEN_SALT: ${transferTokenSalt.substring(0, 40)}...`);
  console.log(`  JWT_SECRET: ${jwtSecret.substring(0, 40)}...\n`);

  // Update .env.example
  await updateEnvFile(strapiEnvExamplePath, updates);

  // Update .env if it exists
  await updateEnvFile(strapiEnvPath, updates);

  console.log('\n✓ Environment keys generated successfully!\n');
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
