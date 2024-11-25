#!/usr/bin/env node

const inquirer = require('inquirer');
const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');
const dotenv = require('dotenv');
const { spawn } = require('child_process');

async function loadConfig() {
  const configPath = path.join(process.cwd(), 'config.example.json');
  const config = JSON.parse(await fs.readFile(configPath, 'utf8'));
  return config;
}

async function promptForProvider(type, providers) {
  const choices = Object.keys(providers).map(key => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: key
  }));

  const { provider } = await inquirer.prompt([
    {
      type: 'list',
      name: 'provider',
      message: `Select ${type} provider:`,
      choices
    }
  ]);

  return provider;
}

async function promptForEnvironmentVariables(provider, envVars) {
  const questions = Object.entries(envVars)
    .filter(([key]) => typeof envVars[key] === 'string' && envVars[key].toUpperCase() === envVars[key])
    .map(([key, value]) => ({
      type: 'input',
      name: value,
      message: `Enter ${key}:`,
      validate: input => input.length > 0 || 'This field is required'
    }));

  return inquirer.prompt(questions);
}

async function generateConfigFiles(config, answers) {
  // Generate .env file
  const envContent = Object.entries(answers)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  await fs.writeFile('.env', envContent);
  console.log(chalk.green('✓ Created .env file'));

  // Generate config.json with selected providers
  const runtimeConfig = JSON.parse(JSON.stringify(config));
  for (const section of ['database', 'hosting', 'auth', 'storage']) {
    if (answers[`${section.toUpperCase()}_PROVIDER`]) {
      runtimeConfig[section].type = answers[`${section.toUpperCase()}_PROVIDER`];
    }
  }

  await fs.writeFile('config.json', JSON.stringify(runtimeConfig, null, 2));
  console.log(chalk.green('✓ Created config.json file'));
}

async function setupDeploymentFiles(hostingProvider, config) {
  const deployScripts = {
    netlify: {
      'netlify.toml': `
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200`,
    },
    vercel: {
      'vercel.json': `{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    }
  ],
  "routes": [
    { "handle": "filesystem" },
    { "src": "/.*", "dest": "/index.html" }
  ]
}`,
    },
    firebase: {
      'firebase.json': `{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}`,
      '.firebaserc': `{
  "projects": {
    "default": "\${process.env.FIREBASE_PROJECT_ID}"
  }
}`,
    },
    githubPages: {
      '.github/workflows/deploy.yml': `
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: \${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist`,
    },
    render: {
      'render.yaml': `
services:
  - type: web
    name: plumbing-supplies
    env: static
    buildCommand: npm run build
    staticPublishPath: ./dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html`,
    },
  };

  const files = deployScripts[hostingProvider];
  if (!files) return;

  for (const [filename, content] of Object.entries(files)) {
    const filePath = path.join(process.cwd(), filename);
    const dir = path.dirname(filePath);
    
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(filePath, content.trim());
    console.log(chalk.green(`✓ Created ${filename}`));
  }

  // Install provider-specific dependencies
  const providerDeps = {
    firebase: ['firebase', 'firebase-tools'],
    supabase: ['@supabase/supabase-js'],
    netlify: ['netlify-cli'],
    vercel: ['vercel'],
    clerk: ['@clerk/clerk-js'],
    auth0: ['@auth0/auth0-react'],
  };

  if (providerDeps[hostingProvider]) {
    console.log(chalk.yellow(`\nInstalling ${hostingProvider} dependencies...`));
    await new Promise((resolve, reject) => {
      const install = spawn('npm', ['install', '--save', ...providerDeps[hostingProvider]], {
        stdio: 'inherit',
        shell: true
      });
      install.on('close', code => code === 0 ? resolve() : reject());
    });
  }
}

async function setupProviderConfig(provider, config) {
  const configFiles = {
    firebase: {
      'src/config/firebase.ts': `
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  authDomain: \`\${process.env.FIREBASE_PROJECT_ID}.firebaseapp.com\`,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);`,
    },
    supabase: {
      'src/config/supabase.ts': `
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);`,
    },
    auth0: {
      'src/config/auth0.ts': `
import { Auth0Provider } from '@auth0/auth0-react';

export const Auth0Config = {
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
  redirectUri: window.location.origin,
};`,
    },
    clerk: {
      'src/config/clerk.ts': `
import Clerk from '@clerk/clerk-js';

export const clerk = new Clerk(process.env.CLERK_PUBLISHABLE_KEY);`,
    },
  };

  const files = configFiles[provider];
  if (!files) return;

  for (const [filename, content] of Object.entries(files)) {
    const filePath = path.join(process.cwd(), filename);
    const dir = path.dirname(filePath);
    
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(filePath, content.trim());
    console.log(chalk.green(`✓ Created ${filename}`));
  }
}

async function main() {
  try {
    console.log(chalk.blue('Welcome to Plumbing Supplies E-Commerce Setup\n'));
    
    const config = await loadConfig();
    const answers = {};

    // Database setup
    console.log(chalk.yellow('\nDatabase Configuration'));
    const dbProvider = await promptForProvider('database', config.database.providers);
    answers.DATABASE_PROVIDER = dbProvider;
    Object.assign(answers, await promptForEnvironmentVariables(dbProvider, config.database.providers[dbProvider]));

    // Hosting setup
    console.log(chalk.yellow('\nHosting Configuration'));
    const hostingProvider = await promptForProvider('hosting', config.hosting.providers);
    answers.HOSTING_PROVIDER = hostingProvider;
    Object.assign(answers, await promptForEnvironmentVariables(hostingProvider, config.hosting.providers[hostingProvider]));

    // Auth setup
    console.log(chalk.yellow('\nAuthentication Configuration'));
    const authProvider = await promptForProvider('authentication', config.auth.providers);
    answers.AUTH_PROVIDER = authProvider;
    Object.assign(answers, await promptForEnvironmentVariables(authProvider, config.auth.providers[authProvider]));

    // Storage setup
    console.log(chalk.yellow('\nStorage Configuration'));
    const storageProvider = await promptForProvider('storage', config.storage.providers);
    answers.STORAGE_PROVIDER = storageProvider;
    Object.assign(answers, await promptForEnvironmentVariables(storageProvider, config.storage.providers[storageProvider]));

    // Generate configuration files
    await generateConfigFiles(config, answers);
    await setupDeploymentFiles(hostingProvider, config);
    await setupProviderConfig(authProvider, config);
    
    if (storageProvider !== hostingProvider) {
      await setupProviderConfig(storageProvider, config);
    }

    console.log(chalk.green('\n✨ Setup completed successfully!'));
    console.log(chalk.blue('\nNext steps:'));
    console.log('1. Review the generated .env and config.json files');
    console.log('2. Install dependencies: npm install');
    console.log('3. Start the development server: npm run dev');
    
    // Provider-specific instructions
    const deployInstructions = {
      netlify: 'netlify deploy',
      vercel: 'vercel',
      firebase: 'firebase deploy',
      githubPages: 'git push origin main',
      render: 'git push render main',
    };

    if (deployInstructions[hostingProvider]) {
      console.log(`4. Deploy using: ${deployInstructions[hostingProvider]}`);
    }

  } catch (error) {
    console.error(chalk.red('Error during setup:'), error);
    process.exit(1);
  }
}

main();
