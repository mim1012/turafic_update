#!/usr/bin/env npx tsx
/**
 * TURAFIC Deploy Script
 *
 * 사용법:
 *   npx tsx deploy.ts "커밋 메시지"
 *
 * 자동으로:
 * 1. version.json timestamp 업데이트
 * 2. git add .
 * 3. git commit -m "메시지"
 * 4. git push
 *
 * 원격 PC는 3분 내에 자동 업데이트됨
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const VERSION_FILE = path.join(__dirname, 'version.json');

function main() {
  const message = process.argv[2] || `Update ${new Date().toISOString().split('T')[0]}`;

  console.log('\n🚀 TURAFIC Deploy\n');
  console.log(`  Message: ${message}`);
  console.log('');

  // 1. version.json 업데이트
  console.log('[1/4] version.json 업데이트...');
  const version = JSON.parse(fs.readFileSync(VERSION_FILE, 'utf-8'));

  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '');

  version.version = `${dateStr}-${timeStr}`;
  version.timestamp = Date.now();
  version.hash = `deploy-${Date.now()}`;

  fs.writeFileSync(VERSION_FILE, JSON.stringify(version, null, 2) + '\n');
  console.log(`  Version: ${version.version}`);
  console.log(`  Timestamp: ${version.timestamp}`);

  // 2. git add
  console.log('\n[2/4] git add...');
  execSync('git add .', { stdio: 'inherit' });

  // 3. git commit
  console.log('\n[3/4] git commit...');
  try {
    execSync(`git commit -m "${message}"`, { stdio: 'inherit' });
  } catch (e) {
    console.log('  (변경사항 없음 또는 이미 커밋됨)');
  }

  // 4. git push
  console.log('\n[4/4] git push...');
  execSync('git push origin main', { stdio: 'inherit' });

  console.log('\n✅ 배포 완료!');
  console.log('  원격 PC는 3분 내에 자동 업데이트됩니다.\n');
}

main();
