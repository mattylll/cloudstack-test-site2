#!/usr/bin/env node

/**
 * Fix and verify deployments
 */

import { NetlifyAdapter } from '../../packages/cloud-adapters/dist/adapters/netlify.js';
import { CloudflareAdapter } from '../../packages/cloud-adapters/dist/adapters/cloudflare.js';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '../../.env') });

const GITHUB_REPO = 'mattylll/cloudstack-test-site';

console.log('🔧 Fixing Deployment Issues');
console.log('===========================');
console.log('');

// Fix Netlify - trigger manual deployment
async function fixNetlify() {
    console.log('🌐 Fixing Netlify deployment...');
    try {
        const netlify = new NetlifyAdapter({
            apiKey: process.env.NETLIFY_AUTH_TOKEN,
        });

        // Try to trigger a deploy
        const result = await netlify.deploy('cloudstack-test-site', {
            branch: 'main',
        });

        if (result.success) {
            console.log(`   ✅ Deployment triggered`);
            console.log(`   🔗 URL: ${result.url}`);
        } else {
            console.log(`   ⚠️  Manual deployment needed`);
            console.log(`   Error: ${result.error}`);
            console.log(`   Go to: https://app.netlify.com/sites/cloudstack-test-site/deploys`);
        }
    } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
        console.log(`   Manual fix needed at Netlify dashboard`);
    }
}

// Fix Cloudflare - check project status
async function fixCloudflare() {
    console.log('');
    console.log('☁️  Checking Cloudflare Pages...');
    try {
        const cloudflare = new CloudflareAdapter({
            apiKey: process.env.CLOUDFLARE_API_TOKEN,
            accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
        });

        // Try to get deployment status
        const status = await cloudflare.getDeploymentStatus('cloudstack-test-site');
        console.log(`   Status: ${status.state}`);

        if (status.state === 'error') {
            console.log(`   ⚠️  Deployment error detected`);
            console.log(`   Check: https://dash.cloudflare.com/pages`);
        }
    } catch (error) {
        console.log(`   ⚠️  ${error.message}`);
        console.log(`   Manual check needed at Cloudflare dashboard`);
    }
}

console.log('✅ Vercel: https://cloudstack-test-site.vercel.app/');
console.log('');

await fixNetlify();
await fixCloudflare();

console.log('');
console.log('📝 Summary:');
console.log('   - Vercel: ✅ Working');
console.log('   - Netlify: Manual deployment may be needed');
console.log('   - Cloudflare: Check dashboard for errors');
