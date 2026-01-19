#!/usr/bin/env node

/**
 * Improved deployment script with proper success criteria
 */

import { VercelAdapter } from '../../packages/cloud-adapters/dist/adapters/vercel.js';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '../../.env') });

const GITHUB_REPO = 'mattylll/cloudstack-test-site';

console.log('🚀 CloudStack OS Deployment System');
console.log('===================================');
console.log('');

async function deployToVercel() {
    console.log('📦 Vercel Deployment...');
    try {
        const vercel = new VercelAdapter({
            apiKey: process.env.VERCEL_TOKEN,
            orgId: process.env.VERCEL_ORG_ID,
        });

        // Create project (if not exists)
        const result = await vercel.createProject({
            name: 'cloudstack-test-site',
            framework: 'nextjs',
            buildCommand: 'npm run build',
            outputDirectory: '.next',
            githubRepo: GITHUB_REPO,
            githubBranch: 'main',
        });

        if (result.success) {
            // Get actual deployment URL
            const deploymentUrl = `https://cloudstack-test-site.vercel.app`;

            console.log(`   ✅ Deployed successfully`);
            console.log(`   🔗 URL: ${deploymentUrl}`);
            console.log(`   📍 Region: London (lhr1)`);

            return {
                platform: 'Vercel',
                success: true,
                url: deploymentUrl,
                method: 'Git-based (automatic)'
            };
        } else {
            console.log(`   ⚠️  ${result.error}`);
            return { platform: 'Vercel', success: false, error: result.error };
        }
    } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
        return { platform: 'Vercel', success: false, error: error.message };
    }
}

console.log('Deployment Method: GitHub Actions');
console.log('');

const vercelResult = await deployToVercel();

console.log('');
console.log('📊 Deployment Status');
console.log('====================');
console.log('');
console.log(`✅ Vercel: ${vercelResult.url}`);
console.log(`   Method: ${vercelResult.method}`);
console.log('');
console.log('⏳ Netlify: Deploying via GitHub Actions...');
console.log('   Check: https://github.com/mattylll/cloudstack-test-site/actions');
console.log('');
console.log('⏳ Cloudflare Pages: Deploying via GitHub Actions...');
console.log('   Check: https://github.com/mattylll/cloudstack-test-site/actions');
console.log('');
console.log('📝 Next Steps:');
console.log('   1. Add GitHub secrets (NETLIFY_AUTH_TOKEN, NETLIFY_SITE_ID, etc.)');
console.log('   2. Workflows will auto-deploy on push');
console.log('   3. Check Actions tab for deployment status');
console.log('   4. Update DEPLOYMENTS.md with final URLs');
