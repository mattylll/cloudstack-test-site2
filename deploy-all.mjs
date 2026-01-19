#!/usr/bin/env node

/**
 * Deploy to Vercel, Netlify, and Cloudflare using SDK
 */

import { VercelAdapter } from '../../packages/cloud-adapters/dist/adapters/vercel.js';
import { NetlifyAdapter } from '../../packages/cloud-adapters/dist/adapters/netlify.js';
import { CloudflareAdapter } from '../../packages/cloud-adapters/dist/adapters/cloudflare.js';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '../../.env') });

const GITHUB_REPO = 'mattylll/cloudstack-test-site';
const GITHUB_BRANCH = 'main';

console.log('🚀 Deploying to All Platforms via SDK');
console.log('======================================');
console.log(`GitHub Repo: ${GITHUB_REPO}`);
console.log('');

async function deployToVercel() {
    console.log('📦 Deploying to Vercel...');
    try {
        const vercel = new VercelAdapter({
            apiKey: process.env.VERCEL_TOKEN,
            orgId: process.env.VERCEL_ORG_ID,
        });

        const result = await vercel.createProject({
            name: 'cloudstack-test-site',
            framework: 'nextjs',
            buildCommand: 'npm run build',
            outputDirectory: '.next',
            githubRepo: GITHUB_REPO,
            githubBranch: GITHUB_BRANCH,
        });

        if (result.success) {
            console.log(`   ✅ Deployed to Vercel`);
            console.log(`   🔗 URL: ${result.projectUrl}`);
            console.log(`   📍 Region: London (lhr1)`);
            return { platform: 'Vercel', success: true, url: result.projectUrl };
        } else {
            console.log(`   ❌ Failed: ${result.error}`);
            return { platform: 'Vercel', success: false, error: result.error };
        }
    } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
        return { platform: 'Vercel', success: false, error: error.message };
    }
}

async function deployToNetlify() {
    console.log('');
    console.log('🌐 Deploying to Netlify...');
    try {
        const netlify = new NetlifyAdapter({
            apiKey: process.env.NETLIFY_AUTH_TOKEN,
        });

        const result = await netlify.createProject({
            name: 'cloudstack-test-site',
            framework: 'nextjs',
            buildCommand: 'npm run build',
            outputDirectory: '.next',
            githubRepo: GITHUB_REPO,
            githubBranch: GITHUB_BRANCH,
        });

        if (result.success) {
            console.log(`   ✅ Deployed to Netlify`);
            console.log(`   🔗 URL: ${result.projectUrl}`);
            console.log(`   📍 Region: UK Edge`);
            return { platform: 'Netlify', success: true, url: result.projectUrl };
        } else {
            console.log(`   ❌ Failed: ${result.error}`);
            return { platform: 'Netlify', success: false, error: result.error };
        }
    } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
        return { platform: 'Netlify', success: false, error: error.message };
    }
}

async function deployToCloudflare() {
    console.log('');
    console.log('☁️  Deploying to Cloudflare Pages...');
    try {
        const cloudflare = new CloudflareAdapter({
            apiKey: process.env.CLOUDFLARE_API_TOKEN,
            accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
        });

        const result = await cloudflare.createProject({
            name: 'cloudstack-test-site',
            framework: 'nextjs',
            buildCommand: 'npm run build',
            outputDirectory: '.next',
            githubRepo: GITHUB_REPO,
            githubBranch: GITHUB_BRANCH,
        });

        if (result.success) {
            console.log(`   ✅ Deployed to Cloudflare Pages`);
            console.log(`   🔗 URL: ${result.projectUrl}`);
            console.log(`   📍 Region: UK PoPs`);
            return { platform: 'Cloudflare', success: true, url: result.projectUrl };
        } else {
            console.log(`   ❌ Failed: ${result.error}`);
            return { platform: 'Cloudflare', success: false, error: result.error };
        }
    } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
        return { platform: 'Cloudflare', success: false, error: error.message };
    }
}

// Deploy to all platforms
const results = [];
results.push(await deployToVercel());
results.push(await deployToNetlify());
results.push(await deployToCloudflare());

console.log('');
console.log('📊 Deployment Summary');
console.log('=====================');

const successful = results.filter(r => r.success);
const failed = results.filter(r => !r.success);

console.log(`✅ Successful: ${successful.length}/${results.length}`);
successful.forEach(r => console.log(`   - ${r.platform}: ${r.url}`));

if (failed.length > 0) {
    console.log(`❌ Failed: ${failed.length}/${results.length}`);
    failed.forEach(r => console.log(`   - ${r.platform}: ${r.error}`));
}
