import { DeploymentConfig, DeploymentOption, ValidationStatus, PlatformRequirements } from '@/types/setup';
import { Client as FTPClient } from 'basic-ftp';

export const deploymentPlatforms = {
  frontend: [
    {
      id: 'github-pages',
      name: 'GitHub Pages',
      description: 'Free hosting for static sites directly from your GitHub repository',
      features: ['Free forever', 'Easy GitHub integration', 'Automatic builds'],
      auth: {
        type: 'oauth',
        provider: 'github',
        scope: ['repo', 'workflow'],
        setupUrl: 'https://github.com/login/oauth/authorize'
      },
      requirements: {
        minimumNodeVersion: '14.0.0',
        supportedFrameworks: ['react', 'vue', 'angular'],
        requiredEnvironmentVars: ['GITHUB_TOKEN']
      }
    },
    {
      id: 'vercel',
      name: 'Vercel',
      description: 'Zero-config deployments for static and JAMstack sites',
      features: [
        'Automatic HTTPS',
        'Serverless Functions',
        'Edge Network',
        'Preview Deployments'
      ],
      auth: {
        type: 'oauth',
        provider: 'vercel',
        scope: ['read', 'write'],
        setupUrl: 'https://vercel.com/oauth/authorize'
      },
      requirements: {
        minimumNodeVersion: '14.0.0',
        supportedFrameworks: ['react', 'next', 'vue', 'nuxt'],
        requiredEnvironmentVars: ['VERCEL_TOKEN']
      }
    },
    {
      id: 'netlify',
      name: 'Netlify',
      description: 'All-in-one platform for automating modern web projects',
      features: [
        'Continuous Deployment',
        'Edge Functions',
        'Split Testing',
        'Forms Handling'
      ],
      auth: {
        type: 'oauth',
        provider: 'netlify',
        scope: ['deploy', 'sites'],
        setupUrl: 'https://app.netlify.com/authorize'
      },
      requirements: {
        minimumNodeVersion: '14.0.0',
        supportedFrameworks: ['react', 'vue', 'angular', 'svelte'],
        requiredEnvironmentVars: ['NETLIFY_AUTH_TOKEN']
      }
    },
    {
      id: 'apache',
      name: 'Apache',
      description: 'A popular open-source web server',
      features: ['Highly customizable', 'Supports multiple protocols', 'Robust security features'],
      auth: {
        type: 'ftp',
        host: '',
        username: '',
        password: '',
        secure: false
      },
      requirements: {
        minimumNodeVersion: '14.0.0',
        supportedFrameworks: ['react', 'vue', 'angular'],
        requiredEnvironmentVars: []
      }
    }
  ]
};

export class DeploymentService {
  private static async validateConfig(
    config: DeploymentConfig,
    platform: DeploymentOption
  ): ValidationStatus {
    const status: ValidationStatus = {
      isValid: true,
      errors: []
    };

    // Check Node.js version compatibility
    const currentNode = process.version;
    if (!this.isVersionCompatible(currentNode, platform.requirements.minimumNodeVersion)) {
      status.isValid = false;
      status.errors.push(`Node.js version ${platform.requirements.minimumNodeVersion} or higher is required`);
    }

    // Validate required environment variables
    for (const envVar of platform.requirements.requiredEnvironmentVars) {
      if (!process.env[envVar]) {
        status.isValid = false;
        status.errors.push(`Missing required environment variable: ${envVar}`);
      }
    }

    // Platform-specific validations
    if (platform.id === 'github-pages') {
      if (!config.auth?.token) {
        status.isValid = false;
        status.errors.push('GitHub token is required');
      }
    } else if (platform.id === 'vercel') {
      if (!config.auth?.token) {
        status.isValid = false;
        status.errors.push('Vercel token is required');
      }
      if (config.domain && !this.isValidDomain(config.domain)) {
        status.isValid = false;
        status.errors.push('Invalid custom domain format');
      }
    } else if (platform.id === 'apache') {
      if (!config.auth?.host || !config.auth?.username || !config.auth?.password) {
        status.isValid = false;
        status.errors.push('Apache FTP credentials are required');
      }
    }

    return status;
  }

  private static isVersionCompatible(current: string, minimum: string): boolean {
    const parseVersion = (v: string) => v.replace('v', '').split('.').map(Number);
    const [currMajor, currMinor] = parseVersion(current);
    const [minMajor, minMinor] = parseVersion(minimum);
    
    return currMajor > minMajor || (currMajor === minMajor && currMinor >= minMinor);
  }

  private static isValidDomain(domain: string): boolean {
    const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;
    return domainRegex.test(domain);
  }

  private static async validateAuth(platform: DeploymentOption, token: string): Promise<boolean> {
    try {
      const response = await fetch(`https://api.${platform.auth.provider}.com/user`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.status === 200;
    } catch (error) {
      console.error(`Auth validation failed for ${platform.name}:`, error);
      return false;
    }
  }

  public static async deploy(config: DeploymentConfig): Promise<boolean> {
    const platform = deploymentPlatforms.frontend.find(p => p.id === config.platform);
    if (!platform) {
      throw new Error(`Unsupported deployment platform: ${config.platform}`);
    }

    // Validate configuration
    const validation = await this.validateConfig(config, platform);
    if (!validation.isValid) {
      throw new Error(`Invalid configuration: ${validation.errors.join(', ')}`);
    }

    // Validate authentication
    if (config.auth?.token) {
      const isAuthValid = await this.validateAuth(platform, config.auth.token);
      if (!isAuthValid) {
        throw new Error('Invalid authentication token');
      }
    }

    // Platform-specific deployment
    switch (config.platform) {
      case 'github-pages':
        return this.deployToGitHubPages(config);
      case 'vercel':
        return this.deployToVercel(config);
      case 'netlify':
        return this.deployToNetlify(config);
      case 'apache':
        return this.deployToApache(config);
      default:
        throw new Error(`Deployment to ${config.platform} is not implemented`);
    }
  }

  private static async deployToGitHubPages(config: DeploymentConfig): Promise<boolean> {
    // Implementation for GitHub Pages deployment
    return true;
  }

  private static async deployToVercel(config: DeploymentConfig): Promise<boolean> {
    // Implementation for Vercel deployment
    return true;
  }

  private static async deployToNetlify(config: DeploymentConfig): Promise<boolean> {
    // Implementation for Netlify deployment
    return true;
  }

  private static async deployToApache(config: DeploymentConfig): Promise<boolean> {
    const client = new FTPClient();
    client.ftp.verbose = true;

    try {
      await client.access({
        host: config.auth.host,
        user: config.auth.username,
        password: config.auth.password,
        secure: config.auth.secure || false
      });

      // Upload the build directory
      await client.uploadFromDir('build', config.auth.path || '/public_html');

      // Create or update .htaccess for React routing
      const htaccessContent = `
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteCond %{REQUEST_FILENAME} !-l
        RewriteRule . /index.html [L]
      `;

      // Create a temporary .htaccess file
      const fs = require('fs').promises;
      await fs.writeFile('.htaccess.temp', htaccessContent);
      await client.uploadFrom('.htaccess.temp', `${config.auth.path}/.htaccess`);
      await fs.unlink('.htaccess.temp');

      return true;
    } catch (error) {
      console.error('FTP deployment failed:', error);
      throw error;
    } finally {
      client.close();
    }
  }
}
