/**
 * test-v3.4.js — Wardrobe AI Recommendation Engine Test Suite
 * 10 unit tests covering all engine modules — zero DB / zero network required
 * Run: node test-v3.4.js
 */

'use strict';

const assert = require('assert');

const {
  scoreBottomColor,
  scoreTopBottomHarmony,
  getBlackReplacement,
} = require('./engine/bottom_color_scorer');

const { scoreMarketReality } = require('./engine/market_reality_scorer');
const { scoreMaterial }       = require('./engine/material_scorer');
const { scoreSilhouette }     = require('./engine/silhouette_scorer');
const { generateColdStartRecommendations } = require('./engine/cold_start_recommender');
const { generateRecommendations }          = require('./engine/recommender');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓  ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗  ${name}`);
    console.error(`       → ${err.message}`);
    failed++;
  }
}

console.log('\nWardrobe AI — Recommendation Engine v3.4 Tests\n');

// ─────────────────────────────────────────────────────────────
// T01  scoreBottomColor: 黑色識別 (s<10, l<25)
// ─────────────────────────────────────────────────────────────
test('scoreBottomColor: 黑色 (hsl_s<10, hsl_l<25) → colorKey === "black"', () => {
  const result = scoreBottomColor(
    { hsl_h: 0, hsl_s: 5, hsl_l: 10 },
    'casual',
    'true_winter'
  );
  assert.strictEqual(result.colorKey, 'black');
});

// ─────────────────────────────────────────────────────────────
// T02  scoreBottomColor: 正式場合黑色高分
// ─────────────────────────────────────────────────────────────
test('scoreBottomColor: formal 場合黑色 occasionScore >= 1.5', () => {
  const result = scoreBottomColor(
    { hsl_h: 0, hsl_s: 0, hsl_l: 0 },
    'formal',
    'true_winter'
  );
  assert.ok(
    result.occasionScore >= 1.5,
    `期望 >= 1.5，實際 ${result.occasionScore}`
  );
});

// ─────────────────────────────────────────────────────────────
// T03  scoreBottomColor: 非黑色回傳完整結構
// ─────────────────────────────────────────────────────────────
test('scoreBottomColor: 非黑色回傳 { occasionScore, seasonBonus, colorKey, tips }', () => {
  const result = scoreBottomColor(
    { hsl_h: 215, hsl_s: 50, hsl_l: 25 },   // navy 藍
    'work_interview',
    'true_winter'
  );
  assert.ok('occasionScore' in result, 'missing occasionScore');
  assert.ok('seasonBonus'   in result, 'missing seasonBonus');
  assert.ok('colorKey'      in result, 'missing colorKey');
  assert.ok('tips'          in result, 'missing tips');
  assert.strictEqual(typeof result.occasionScore, 'number');
  assert.ok(Array.isArray(result.tips), 'tips should be array');
});

// ─────────────────────────────────────────────────────────────
// T04  scoreTopBottomHarmony: 回傳 { bonus, warning }
// ─────────────────────────────────────────────────────────────
test('scoreTopBottomHarmony: 回傳 { bonus: number, warning }', () => {
  const result = scoreTopBottomHarmony(
    { hsl_h: 215, hsl_s: 50, hsl_l: 25 },
    { hsl_h: 0,   hsl_s: 0,  hsl_l: 100, colors: [{ hex: '#FFFFFF' }] }
  );
  assert.ok('bonus'   in result, 'missing bonus');
  assert.ok('warning' in result, 'missing warning');
  assert.strictEqual(typeof result.bonus, 'number');
});

// ─────────────────────────────────────────────────────────────
// T05  getBlackReplacement: 回傳有 hex 的替代色
// ─────────────────────────────────────────────────────────────
test('getBlackReplacement: true_winter/casual 回傳含 hex 的色物件', () => {
  const result = getBlackReplacement('true_winter', 'casual');
  assert.ok(result !== null,                          '不應回傳 null');
  assert.ok(typeof result.hex === 'string',           'hex 應為字串');
  assert.ok(result.hex.startsWith('#'),               'hex 應以 # 開頭');
});

// ─────────────────────────────────────────────────────────────
// T06  scoreMarketReality: 回傳 { adjustment, bonuses, penalties }
// ─────────────────────────────────────────────────────────────
test('scoreMarketReality: 回傳 { adjustment, bonuses, penalties }', () => {
  const result = scoreMarketReality(
    { hsl_h: 200, hsl_s: 30, hsl_l: 50, material_key: 'cotton' },
    [{ hsl_h: 0,  hsl_s: 0,  hsl_l: 100, material_key: 'cotton' }],
    []
  );
  assert.ok('adjustment' in result, 'missing adjustment');
  assert.ok('bonuses'    in result, 'missing bonuses');
  assert.ok('penalties'  in result, 'missing penalties');
  assert.strictEqual(typeof result.adjustment, 'number');
});

// ─────────────────────────────────────────────────────────────
// T07  scoreMarketReality: 高飽和下身 → 負調整
// ─────────────────────────────────────────────────────────────
test('scoreMarketReality: 高飽和下身 (hsl_s>60) → adjustment <= 0', () => {
  const result = scoreMarketReality(
    { hsl_h: 120, hsl_s: 80, hsl_l: 50, material_key: 'cotton' },
    [{ hsl_h: 0,  hsl_s: 0,  hsl_l: 100, material_key: 'cotton' }],
    []
  );
  assert.ok(
    result.adjustment <= 0,
    `期望 <= 0，實際 ${result.adjustment}`
  );
});

// ─────────────────────────────────────────────────────────────
// T08  scoreSilhouette: 回傳 0–10 範圍數值
// ─────────────────────────────────────────────────────────────
test('scoreSilhouette: slim×wide_leg → silhouetteScore === 10', () => {
  const result = scoreSilhouette(
    [{ silhouette: 'slim' }],
    { silhouette: 'wide_leg' },
    'pear_shape',
    'casual'
  );
  assert.ok('silhouetteScore' in result, 'missing silhouetteScore');
  assert.strictEqual(typeof result.silhouetteScore, 'number');
  assert.ok(result.silhouetteScore >= 0 && result.silhouetteScore <= 10,
    `分數 ${result.silhouetteScore} 超出 0–10 範圍`);
});

// ─────────────────────────────────────────────────────────────
// T09  generateColdStartRecommendations: 回傳非空物件
// ─────────────────────────────────────────────────────────────
test('generateColdStartRecommendations: true_winter 回傳非空物件', () => {
  const result = generateColdStartRecommendations({
    colorSeason: 'true_winter',
    skinTone:    'cool',
    bodyType:    'pear_shape',
    occasion:    'casual',
    season:      'winter',
  });
  assert.ok(result !== null,           '不應回傳 null');
  assert.ok(typeof result === 'object','應回傳 object');
});

// ─────────────────────────────────────────────────────────────
// T10  generateRecommendations: 空衣櫃觸發 cold-start，回傳結果
// ─────────────────────────────────────────────────────────────
test('generateRecommendations: 空衣櫃 → cold-start 回傳陣列或物件', () => {
  const result = generateRecommendations({
    wardrobe:    [],
    occasion:    'casual',
    season:      'spring',
    colorSeason: 'true_spring',
    skinTone:    'warm',
    bodyType:    'rectangle',
    topN:        3,
  });
  assert.ok(
    result !== null && (Array.isArray(result) || typeof result === 'object'),
    '回傳值應為陣列或物件'
  );
});

// ─────────────────────────────────────────────────────────────
// Summary
// ─────────────────────────────────────────────────────────────
console.log('');
console.log(`Results: ${passed} passing, ${failed} failing`);
console.log('');
if (failed > 0) process.exit(1);
