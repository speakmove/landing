#!/usr/bin/env node
/**
 * Fix structural (schema-discriminator) keys that were lorem-ipsumified.
 *
 * Rule: if key name is in STRUCT_KEYS or the RU value matches a VERBATIM_PATTERN,
 * copy the RU value to uk/en. Otherwise leave the existing lorem.
 *
 * Special handling:
 * - MetaGlobal.locale: uk.json gets 'uk', en.json gets 'en' (not 'ru')
 * - MetaGlobal.social.*.href: copy from RU (real URLs)
 * - MetaGlobal.cookies.policyLinkHref / privacyLinkHref: copy from RU
 * - en.json PrivacyPage/TermsPage/CookiesPage real English text is preserved (only type fields fixed)
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const RU_PATH  = path.join(ROOT, 'messages', 'ru.json');
const UK_PATH  = path.join(ROOT, 'messages', 'uk.json');
const EN_PATH  = path.join(ROOT, 'messages', 'en.json');

// Keys that are schema discriminators (ALWAYS copy from RU verbatim)
const STRUCT_KEYS = new Set([
  'id', 'type', 'from', 'href', 'code', 'icon', 'letter', 'flag',
  'twitterHandle', 'ogImage', 'themeColor', 'twitterCard',
  'policyLinkHref', 'privacyLinkHref',
]);

// Special key: 'locale' is structural but value differs per locale
const LOCALE_MAP = { uk: 'uk', en: 'en' };

// Patterns: if RU value matches any of these, copy verbatim to uk/en
const VERBATIM_PATTERNS = [
  /^https?:\/\//,                // absolute URLs
  /^mailto:/,                     // mailto links
  /^\//,                          // internal paths (e.g. /og/speakmove-og.png)
  /^[A-Z]{1,3}$/,                 // lang codes (RU/UK/EN), CEFR (A1/B2/C1)
  /^\d+([.,]\d+)?$/,              // pure numbers
  /^[\d\s,.\-+%/$€£()]+$/,        // numeric/pricing strings
  /@example\.com/,                // example emails
  /^#[0-9a-f]{3,8}$/i,            // hex colors (e.g. #059669)
  /^[#@]/,                        // hashtags or twitter handles (@speakmove)
  /^\+\d/,                        // phone numbers
  /^[A-Z][A-Z0-9_-]+$/,          // all-caps identifiers
  /^SM$/,                         // coin ticker
  /^0:\d\d$/,                     // time strings like "0:07"
];

function isVerbatim(ruVal) {
  if (typeof ruVal !== 'string') return true; // objects/arrays handled by recursion
  return VERBATIM_PATTERNS.some((pat) => pat.test(ruVal.trim()));
}

let repairCount = 0;

/**
 * Walk ruNode / otherNode in parallel.
 * @param {*} ruNode - source of truth
 * @param {*} otherNode - uk or en node to fix in-place
 * @param {string} targetLocale - 'uk' or 'en'
 * @param {string[]} keyPath - current JSON path (for debugging)
 * @param {boolean} inLegalNamespace - true when inside PrivacyPage/TermsPage/CookiesPage of en
 */
function walk(ruNode, otherNode, targetLocale, keyPath, inLegalNamespace) {
  if (ruNode === null || ruNode === undefined) return otherNode;
  if (typeof ruNode !== 'object') return otherNode; // leaf — handled by caller

  // Array
  if (Array.isArray(ruNode)) {
    if (!Array.isArray(otherNode)) return JSON.parse(JSON.stringify(ruNode));
    const result = [];
    for (let i = 0; i < ruNode.length; i++) {
      const ruItem = ruNode[i];
      const otherItem = otherNode[i];
      if (typeof ruItem === 'string') {
        // Array of strings: check if this is a structural value
        // For CEFR levels list, href arrays, etc.
        result.push(otherItem !== undefined ? otherItem : ruItem);
      } else if (typeof ruItem === 'object' && ruItem !== null) {
        const fixed = walk(ruItem, otherItem ?? {}, targetLocale, [...keyPath, String(i)], inLegalNamespace);
        result.push(fixed);
      } else {
        result.push(otherItem !== undefined ? otherItem : ruItem);
      }
    }
    return result;
  }

  // Object
  const result = otherNode && typeof otherNode === 'object' && !Array.isArray(otherNode)
    ? { ...otherNode }
    : {};

  for (const key of Object.keys(ruNode)) {
    const ruVal = ruNode[key];
    const otherVal = result[key];
    const currentPath = [...keyPath, key];

    // Track entering legal namespaces (en only: PrivacyPage/TermsPage/CookiesPage)
    const isLegalRoot = keyPath.length === 0 && (key === 'PrivacyPage' || key === 'TermsPage' || key === 'CookiesPage');
    const nowInLegal = inLegalNamespace || (targetLocale === 'en' && isLegalRoot);

    if (typeof ruVal === 'object' && ruVal !== null) {
      result[key] = walk(ruVal, otherVal ?? (Array.isArray(ruVal) ? [] : {}), targetLocale, currentPath, nowInLegal);
      continue;
    }

    // Leaf string (or number/boolean)
    if (typeof ruVal !== 'string') {
      // numbers and booleans copy verbatim always
      result[key] = ruVal;
      continue;
    }

    // Special case: MetaGlobal.locale
    if (key === 'locale' && keyPath.length === 1 && keyPath[0] === 'MetaGlobal') {
      if (result[key] !== LOCALE_MAP[targetLocale]) {
        repairCount++;
        result[key] = LOCALE_MAP[targetLocale];
      }
      continue;
    }

    // Should we force-copy from RU?
    const forceVerbatim = STRUCT_KEYS.has(key) || isVerbatim(ruVal);

    if (forceVerbatim) {
      // In EN legal pages: only fix 'type' and other structural keys; keep prose as-is
      if (nowInLegal && targetLocale === 'en' && !STRUCT_KEYS.has(key)) {
        // This is prose in a legal section in English — keep existing EN value
        result[key] = otherVal !== undefined ? otherVal : ruVal;
        continue;
      }
      if (result[key] !== ruVal) {
        repairCount++;
        result[key] = ruVal;
      }
    }
    // else: leave existing lorem value in uk/en
  }

  return result;
}

function fix(filePath, targetLocale) {
  const ru = JSON.parse(fs.readFileSync(RU_PATH, 'utf8'));
  const other = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  repairCount = 0;
  const fixed = walk(ru, other, targetLocale, [], false);
  fs.writeFileSync(filePath, JSON.stringify(fixed, null, 2) + '\n', 'utf8');
  return repairCount;
}

const ukCount = fix(UK_PATH, 'uk');
console.log(`uk.json: ${ukCount} structural keys repaired`);

const enCount = fix(EN_PATH, 'en');
console.log(`en.json: ${enCount} structural keys repaired`);
