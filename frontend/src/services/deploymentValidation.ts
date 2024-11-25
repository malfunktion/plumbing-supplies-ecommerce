import { DeploymentConfig, DeploymentOption, ValidationStatus, PlatformRequirements } from '@/types/setup';

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
      id: 'apache',
      name: 'Apache Server',
      description: 'Deploy to your own Apache web server',
      features: [
        'Full control over hosting',
        'Custom server configuration',
        'Direct file upload',
        'Support for .htaccess'
      ],
      auth: {
        type: 'ftp',
        provider: 'custom',
        fields: [
          { name: 'host', label: 'FTP Host' },
          { name: 'username', label: 'FTP Username' },
          { name: 'password', label: 'FTP Password', type: 'password' },
          { name: 'path', label: 'Server Path', default: '/public_html' }
        ]
      },
      requirements: {
        minimumApacheVersion: '2.4.0',
        supportedProtocols: ['ftp', 'sftp'],
        requiredModules: ['mod_rewrite']
      }
    },
    {
      id: 'vercel',
      name: 'Vercel',
      description: 'Zero-config deployments for static and JAMstack sites',
      features: ['Generous free tier', 'Automatic HTTPS', 'Global CDN'],
      auth: {
        type: 'oauth',
        provider: 'vercel',
        scope: ['read', 'write', 'deploy'],
        setupUrl: 'https://vercel.com/api/auth'
      },
      requirements: {
        minimumNodeVersion: '14.0.0',
        supportedFrameworks: ['react', 'next.js', 'vue', 'nuxt'],
        requiredEnvironmentVars: ['VERCEL_TOKEN']
      }
    },
    {
      id: 'netlify',
      name: 'Netlify',
      description: 'All-in-one platform for automating modern web projects',
      features: ['Free tier available', 'Form handling', 'Identity service'],
      auth: {
        type: 'oauth',
        provider: 'netlify',
        scope: ['deploy', 'site'],
        setupUrl: 'https://app.netlify.com/authorize'
      },
      requirements: {
        minimumNodeVersion: '14.0.0',
        supportedFrameworks: ['react', 'vue', 'angular', 'svelte'],
        requiredEnvironmentVars: ['NETLIFY_AUTH_TOKEN']
      }
    }
  ],
  backend: [
    {
      id: 'railway',
      name: 'Railway',
      description: 'Infrastructure, Instantly',
      features: ['Free tier available', 'Automatic deployments', 'Built-in databases'],
      auth: {
        type: 'oauth',
        provider: 'railway',
        scope: ['deploy'],
        setupUrl: 'https://railway.app/api/auth'
      },
      requirements: {
        minimumNodeVersion: '14.0.0',
        supportedFrameworks: ['node', 'python', 'go', 'ruby'],
        requiredEnvironmentVars: ['RAILWAY_TOKEN']
      }
    },
    {
      id: 'heroku',
      name: 'Heroku',
      description: 'Cloud platform for modern applications',
      features: ['Easy scaling', 'Add-on marketplace', 'GitHub integration'],
      auth: {
        type: 'oauth',
        provider: 'heroku',
        scope: ['global'],
        setupUrl: 'https://id.heroku.com/oauth/authorize'
      },
      requirements: {
        minimumNodeVersion: '14.0.0',
        supportedFrameworks: ['node', 'python', 'java', 'php'],
        requiredEnvironmentVars: ['HEROKU_API_KEY']
      }
    },
    {
      id: 'render',
      name: 'Render',
      description: 'Cloud platform for modern apps and websites',
      features: ['Free tier', 'Auto-deploys from Git', 'Global CDN'],
      auth: {
        type: 'api-token',
        provider: 'render',
        setupUrl: 'https://dashboard.render.com/account/api-keys'
      },
      requirements: {
        minimumNodeVersion: '14.0.0',
        supportedFrameworks: ['node', 'python', 'go', 'rust'],
        requiredEnvironmentVars: ['RENDER_API_KEY']
      }
    }
  ]
};

export class DeploymentValidationService {
  static validateConfig(
    config: DeploymentConfig,
    platform: DeploymentOption
  ): ValidationStatus {
    const errors: string[] = [];
    const warnings: string[] = [];
    const requirements = platform.requirements;

    // Validate Node.js version
    if (requirements.minimumNodeVersion && config.nodeVersion) {
      if (!this.isVersionCompatible(config.nodeVersion, requirements.minimumNodeVersion)) {
        errors.push(`Node.js version ${config.nodeVersion} is below minimum required version ${requirements.minimumNodeVersion}`);
      }
    }

    // Validate framework compatibility
    if (requirements.supportedFrameworks && config.framework) {
      if (!requirements.supportedFrameworks.includes(config.framework)) {
        errors.push(`Framework ${config.framework} is not supported. Supported frameworks: ${requirements.supportedFrameworks.join(', ')}`);
      }
    }

    // Validate required environment variables
    if (requirements.requiredEnvironmentVars) {
      const missingVars = requirements.requiredEnvironmentVars.filter(
        (envVar) => !config.environmentVars?.[envVar]
      );
      if (missingVars.length > 0) {
        errors.push(`Missing required environment variables: ${missingVars.join(', ')}`);
      }
    }

    // Build command validation
    if (!config.buildCommand) {
      warnings.push('Build command not specified. Default build command will be used.');
    }

    // Output directory validation
    if (!config.outputDir) {
      warnings.push('Output directory not specified. Default directory will be used.');
    }

    // Custom domain validation
    if (config.customDomain) {
      if (!this.isValidDomain(config.customDomain)) {
        errors.push('Invalid custom domain format');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  static async validateAuth(platform: DeploymentOption, token: string): Promise<boolean> {
    if (!platform.auth.validationUrl) return true;

    try {
      const response = await fetch(platform.auth.validationUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.ok;
    } catch (error) {
      console.error('Auth validation error:', error);
      return false;
    }
  }

  private static isVersionCompatible(current: string, minimum: string): boolean {
    const currentParts = current.split('.').map(Number);
    const minimumParts = minimum.split('.').map(Number);

    for (let i = 0; i < 3; i++) {
      if (currentParts[i] > minimumParts[i]) return true;
      if (currentParts[i] < minimumParts[i]) return false;
    }
    return true;
  }

  private static isValidDomain(domain: string): boolean {
    const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;
    return domainRegex.test(domain);
  }
}
