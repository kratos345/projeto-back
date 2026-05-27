#!/usr/bin/env node

/**
 * 🔍 Script de Verificação de Conexão Backend-Frontend
 * Verifica se backend e frontend estão configurados corretamente
 * 
 * Como usar:
 * node verify-connection.js
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

console.log('\n🔍 ========== VERIFICAÇÃO DE CONEXÃO ==========\n');

// 1. Ler .env files
console.log('📖 Lendo configurações...\n');

const backendEnvPath = path.join(__dirname, '.env');
const frontendEnvPath = path.join(__dirname, '..', 'frontend', '.env');

let backendConfig = {};
let frontendConfig = {};

// Parse .env backend
if (fs.existsSync(backendEnvPath)) {
  const envContent = fs.readFileSync(backendEnvPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      backendConfig[key.trim()] = value.trim();
    }
  });
}

// Parse .env frontend
if (fs.existsSync(frontendEnvPath)) {
  const envContent = fs.readFileSync(frontendEnvPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      frontendConfig[key.trim()] = value.trim();
    }
  });
}

// 2. Validar configurações
console.log('📋 BACKEND (.env):');
console.log(`  PORT: ${backendConfig.PORT || '❌ NÃO CONFIGURADO'}`);
console.log(`  HOST: ${backendConfig.HOST || '❌ FALTA (usar 0.0.0.0)'}`);
console.log(`  CLIENT_URL: ${backendConfig.CLIENT_URL || '❌ NÃO CONFIGURADO'}`);
console.log('');

console.log('📋 FRONTEND (.env):');
console.log(`  VITE_API_URL: ${frontendConfig.VITE_API_URL || '❌ NÃO CONFIGURADO'}`);
console.log('');

// 3. Verificar compatibilidade
console.log('🔗 VERIFICAÇÃO DE COMPATIBILIDADE:\n');

const port = backendConfig.PORT || 3001;
const clientUrl = backendConfig.CLIENT_URL || 'http://localhost:5173';
const apiUrl = frontendConfig.VITE_API_URL || 'http://localhost:3001';

let isCompatible = true;

// Verificar se frontend está apontando para a porta correta do backend
if (!apiUrl.includes(`:${port}`)) {
  console.log(`❌ ERRO: Frontend aponta para ${apiUrl}`);
  console.log(`   Mas backend está na porta ${port}`);
  console.log(`   Corrija frontend/.env para: VITE_API_URL=http://localhost:${port}`);
  isCompatible = false;
} else {
  console.log(`✅ Frontend aponta para a porta correta (${port})`);
}

// Verificar HOST
if (backendConfig.HOST !== '0.0.0.0' && backendConfig.HOST) {
  console.log(`⚠️  Backend está em ${backendConfig.HOST} (considerando apenas localhost)`);
} else if (!backendConfig.HOST) {
  console.log(`⚠️  Backend não tem HOST configurado (vai usar localhost apenas)`);
} else {
  console.log(`✅ Backend aceita conexões de qualquer interface`);
}

// Verificar CLIENT_URL
console.log(`✅ Backend vai aceitar requisições CORS de: ${clientUrl}`);

if (!isCompatible) {
  console.log('\n❌ CONFIGURAÇÃO INCOMPATÍVEL!\n');
  process.exit(1);
}

// 4. Tentar conectar ao backend
console.log('\n🚀 TESTANDO CONEXÃO...\n');

const testUrl = new URL('/health', apiUrl);

http.get(testUrl, (res) => {
  if (res.statusCode === 200) {
    console.log(`✅ Backend RESPONDENDO em ${apiUrl}`);
    console.log(`   Status: ${res.statusCode}`);
  } else {
    console.log(`⚠️  Backend respondeu com status ${res.statusCode}`);
  }
  console.log('\n✅ TUDO OK! Frontend e Backend estão configurados corretamente.\n');
}).on('error', (err) => {
  console.log(`❌ NÃO foi possível conectar ao backend em ${apiUrl}`);
  console.log(`   Erro: ${err.message}`);
  console.log(`\n   Verifique se:`);
  console.log(`   1. Backend está rodando (npm run dev na pasta backend)`);
  console.log(`   2. A porta ${port} não está bloqueada`);
  console.log(`   3. O endereço ${apiUrl} está correto\n`);
  process.exit(1);
});
