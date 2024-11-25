import { FinishSetupProps } from '@/types/setup';

const FinishSetup: React.FC<FinishSetupProps> = ({ setupData, onNext, onBack }) => {
  const getDeploymentInstructions = () => {
    const instructions: string[] = [];
    
    // Frontend deployment instructions
    if (setupData.deployment.frontendDeployment === 'github-pages') {
      instructions.push(
        '1. Enable GitHub Pages in your repository settings',
        '2. Set the branch to "gh-pages"',
        '3. Your site will be available at https://[username].github.io/[repo-name]'
      );
    } else if (setupData.deployment.frontendDeployment === 'netlify') {
      instructions.push(
        '1. Sign up/login to Netlify',
        '2. Click "Add new site" > "Import an existing project"',
        '3. Choose your GitHub repository',
        '4. Set build command: "cd frontend && npm install && npm run build"',
        '5. Set publish directory: "frontend/build"'
      );
    }

    // Backend deployment instructions
    if (setupData.deployment.backendDeployment === 'cyclic') {
      instructions.push(
        '1. Sign up/login to Cyclic with GitHub',
        '2. Click "Link Your Own"',
        '3. Select your repository',
        '4. Set the following environment variables:',
        '   - MONGODB_URI: [your MongoDB connection string]',
        '   - JWT_SECRET: [generate a secure random string]',
        '5. Deploy!'
      );
    } else if (setupData.deployment.backendDeployment === 'glitch') {
      instructions.push(
        '1. Create new project on Glitch',
        '2. Import from GitHub',
        '3. Set up environment variables in .env',
        '4. Your app will be live at [project-name].glitch.me'
      );
    } else if (setupData.deployment.backendDeployment === 'railway') {
      instructions.push(
        '1. Sign up/login to Railway with GitHub',
        '2. Create new project',
        '3. Select your repository',
        '4. Add environment variables',
        '5. Deploy!'
      );
    }

    return instructions;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Setup Complete! 🎉</h2>
        <p className="text-gray-600">
          Your plumbing supplies e-commerce platform is ready to be deployed.
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-medium text-green-800">Setup Summary</h3>
          <ul className="mt-2 space-y-1 text-sm text-green-700">
            <li>✅ Database connected: {setupData.database.uri}</li>
            <li>✅ Admin account created: {setupData.admin.email}</li>
            <li>✅ Sample data: {setupData.sampleData.install ? 'Installed' : 'Skipped'}</li>
            <li>✅ Frontend deployment: {setupData.deployment.frontendDeployment}</li>
            <li>✅ Backend deployment: {setupData.deployment.backendDeployment}</li>
          </ul>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-blue-800">Deployment Instructions</h3>
          <ol className="mt-2 space-y-2 text-sm text-blue-700 list-decimal list-inside">
            {getDeploymentInstructions().map((instruction, index) => (
              <li key={index} className="pl-2">{instruction}</li>
            ))}
          </ol>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Back
        </button>

        <button
          type="button"
          onClick={onNext}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default FinishSetup;
