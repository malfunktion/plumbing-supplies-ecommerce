import { DeploymentConfig, DeploymentOption, ValidationStatus, PlatformRequirements } from '@/types/setup';

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

export const deploymentPlatforms = {
  frontend: [
    {
      id: 'github-pages',
      name: 'GitHub Pages',
      description: 'Free hosting for static sites directly from your GitHub repository',
      features: ['Free forever', 'Easy GitHub integration', 'Automatic builds'],
      auth: {
        type: 'oauth' as const,
        provider: 'github',
        scope: ['repo', 'workflow'],
        setupUrl: 'https://github.com/login/oauth/authorize',
        validationUrl: 'https://api.github.com/user',
      },
      requirements: {
        supportedFrameworks: ['react', 'vue', 'angular', 'static'],
        maximumDeploySize: 1024 * 1024 * 1000, // 1GB
      },
      pricing: {
        free: ['1GB storage', 'Unlimited bandwidth', 'HTTPS'],
        paid: [],
      },
      docs: 'https://docs.github.com/en/pages',
    },
    {
      id: 'vercel',
      name: 'Vercel',
      description: 'Zero-config deployments for static and JAMstack sites',
      features: ['Automatic HTTPS', 'Global CDN', 'Serverless Functions'],
      auth: {
        type: 'oauth' as const,
        provider: 'vercel',
        scope: ['read', 'write', 'deploy'],
        setupUrl: 'https://vercel.com/api/auth',
        validationUrl: 'https://api.vercel.com/v2/user',
      },
      requirements: {
        minimumNodeVersion: '14.0.0',
        supportedFrameworks: ['next.js', 'react', 'vue', 'nuxt', 'angular'],
        maximumBuildDuration: 60 * 45, // 45 minutes
      },
      pricing: {
        free: ['100GB bandwidth', 'Serverless functions', 'HTTPS'],
        paid: ['Unlimited bandwidth', 'Premium support', 'Team collaboration'],
      },
      docs: 'https://vercel.com/docs',
    },
  ],
  backend: [
    {
      id: 'render',
      name: 'Render',
      description: 'Cloud platform for hosting web services and databases',
      features: ['Automatic HTTPS', 'Global CDN', 'Auto-scaling'],
      auth: {
        type: 'api-token' as const,
        provider: 'render',
        setupUrl: 'https://dashboard.render.com/account/api-keys',
        validationUrl: 'https://api.render.com/v1/services',
      },
      requirements: {
        minimumNodeVersion: '14.0.0',
        maximumBuildDuration: 60 * 15, // 15 minutes
        requiredEnvironmentVars: ['NODE_ENV', 'PORT'],
      },
      pricing: {
        free: ['750 hours/month', 'Automatic HTTPS', 'Global CDN'],
        paid: ['Unlimited hours', 'Auto-scaling', 'Premium support'],
      },
      docs: 'https://render.com/docs',
    },
    {
      id: 'railway',
      name: 'Railway',
      description: 'Infrastructure platform with built-in CI/CD',
      features: ['One-click deployments', 'Built-in databases', 'Auto-scaling'],
      auth: {
        type: 'oauth' as const,
        provider: 'railway',
        scope: ['deploy', 'project'],
        setupUrl: 'https://railway.app/api/auth',
        validationUrl: 'https://railway.app/api/user',
      },
      requirements: {
        minimumNodeVersion: '12.0.0',
        maximumBuildDuration: 60 * 30, // 30 minutes
        requiredEnvironmentVars: ['DATABASE_URL', 'PORT'],
      },
      pricing: {
        free: ['$5 credit/month', 'Shared CPU', '1GB RAM'],
        paid: ['Unlimited usage', 'Dedicated resources', 'Priority support'],
      },
      docs: 'https://docs.railway.app',
    },
  ],
};
