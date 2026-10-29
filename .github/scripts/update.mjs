#!/usr/bin/env node
// Keeps this skill up to date from its published files: no token, no AI, no dependency (Node 18+).
//   node .github/scripts/update.mjs            say whether the published files differ from the ones here (nothing written)
//   node .github/scripts/update.mjs --commit   when they differ: fetch them, check each one's hash, replace them, commit and tag
// It reads <source>/manifest.json { version, fingerprint, files: [{ path, sha256, bytes }] }. The fingerprint covers the skill's own files
// (not .git/, not .github/, not what you put in vendor/), so a release that changes no file changes nothing here.
// ⛔ Never touched: .git/, .github/ (a workflow cannot rewrite itself with the default token) and your own files in vendor/.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export const SKILL = 'ddcs-v41';
export const DEFAULT_SOURCE = 'https://ddcs-studio.pages.dev/skills/ddcs-v41';

/** Files this script never reads, replaces or deletes. */
export const kept = (f) => f === '.git' || f.startsWith('.git/') || f.startsWith('.github/') || (f.startsWith('vendor/') && f !== 'vendor/README.md');

const sha = (buf) => crypto.createHash('sha256').update(buf).digest('hex');
/** One file's hash, line endings normalised (a checkout may turn LF into CRLF). */
export const fileHash = (text) => sha(Buffer.from(String(text).replace(/\r\n/g, '\n'), 'utf8'));
/** The fingerprint of a file set: { path: text }, the kept files left out, in path order. */
export function fingerprint(files) {
    const lines = Object.keys(files).filter((f) => !kept(f)).sort().map((f) => `${f}\n${fileHash(files[f])}\n`);
    return sha(Buffer.from(lines.join(''), 'utf8'));
}

const walk = (dir, rel = '') => (fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const r = rel ? `${rel}/${e.name}` : e.name;
    if (kept(r)) return [];
    return e.isDirectory() ? walk(path.join(dir, e.name), r) : [r];
}) : []);
/** The skill files in a folder: { path: text }, the kept ones left out. */
export const localFiles = (dir) => Object.fromEntries(walk(dir).map((f) => [f, fs.readFileSync(path.join(dir, f), 'utf8')]));

/**
 * Compare, and with `apply` replace. -> { changed, version, written, removed }. Every fetched file must match its manifest hash before anything
 * is written; a file the manifest no longer lists is removed (never a kept one).
 */
export async function update(dir, { source = DEFAULT_SOURCE, apply = false, fetchImpl = globalThis.fetch } = {}) {
    const base = String(source).replace(/\/+$/, '');
    const get = async (p) => { const r = await fetchImpl(`${base}/${p}`); if (!r.ok) throw new Error(`${p}: HTTP ${r.status}`); return r.text(); };
    const manifest = JSON.parse(await get('manifest.json'));
    if (!manifest || !Array.isArray(manifest.files) || !manifest.fingerprint) throw new Error('manifest.json is not a skill manifest');
    if (manifest.files.some((f) => kept(f.path) || f.path.includes('..') || path.isAbsolute(f.path))) throw new Error('manifest.json names a file this script must not write');
    const here = localFiles(dir);
    if (fingerprint(here) === manifest.fingerprint) return { changed: false, version: manifest.version, written: 0, removed: 0 };
    if (!apply) return { changed: true, version: manifest.version, written: 0, removed: 0 };
    const next = {};
    for (const f of manifest.files) {
        const text = await get(f.path);
        if (fileHash(text) !== f.sha256) throw new Error(`${f.path}: its hash does not match the manifest; nothing was written`);
        next[f.path] = text;
    }
    if (fingerprint(next) !== manifest.fingerprint) throw new Error('the fetched files do not add up to the manifest fingerprint; nothing was written');
    let removed = 0;
    for (const f of Object.keys(here)) if (!(f in next)) { fs.unlinkSync(path.join(dir, f)); removed++; }
    for (const [f, text] of Object.entries(next)) { fs.mkdirSync(path.dirname(path.join(dir, f)), { recursive: true }); fs.writeFileSync(path.join(dir, f), text); }
    return { changed: true, version: manifest.version, written: Object.keys(next).length, removed };
}

/** Commit what `update` wrote and tag it with the facts' version. -> true when a commit was made. */
export function commit(dir, version) {
    const git = (...a) => execFileSync('git', a, { cwd: dir, encoding: 'utf8' }).trim();
    git('add', '-A');
    if (!git('status', '--porcelain')) return false;   // same files after all (line endings): nothing to record
    git('commit', '-q', '-m', `facts ${version}`);
    const tag = `facts-${String(version).replace(/[^A-Za-z0-9._-]/g, '')}`;
    if (!git('tag', '--list', tag)) git('tag', '-a', tag, '-m', `facts ${version}`);   // annotated: `git push --follow-tags` pushes only those
    return true;
}

async function main() {
    const dir = process.cwd();
    const source = process.env.SKILL_SOURCE_URL || DEFAULT_SOURCE;
    const apply = process.argv.includes('--commit');
    const r = await update(dir, { source, apply });
    if (!r.changed) { console.log(`unchanged: the files here match ${source} (${r.version})`); return; }
    if (!apply) { console.log(`changed: ${source} has ${r.version}; run with --commit to take it`); return; }
    const made = commit(dir, r.version);
    console.log(made ? `updated to ${r.version}: ${r.written} file(s) written, ${r.removed} removed, committed and tagged` : `no difference to commit (${r.version})`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
    main().catch((e) => { console.error(`update failed: ${e.message}`); process.exit(1); });
}
