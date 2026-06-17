import { describe, expect, it } from 'vitest';
import {
  formatInches,
  getCutHeight,
  getCutOptimizationGroups,
  getMaterialCategory,
  getOptimizedSheetTotal,
  getSheetWidth,
  packRipHeights,
  parseFraction
} from '../src/calculatorLogic.js';

describe('dimension parsing and formatting', () => {
  it('parses whole numbers, decimals, fractions, and mixed fractions', () => {
    expect(parseFraction('5')).toBe(5);
    expect(parseFraction('5.25')).toBe(5.25);
    expect(parseFraction('1/2')).toBe(0.5);
    expect(parseFraction('5 1/2"')).toBe(5.5);
    expect(parseFraction('5-1/2')).toBe(5.5);
  });

  it('returns zero for unusable dimensions', () => {
    expect(parseFraction('')).toBe(0);
    expect(parseFraction('bad')).toBe(0);
    expect(parseFraction('1/0')).toBe(0);
  });

  it('formats inches without trailing zeros', () => {
    expect(formatInches(5)).toBe('5');
    expect(formatInches(5.5)).toBe('5.5');
    expect(formatInches(5.125)).toBe('5.13');
  });

  it('rounds cut heights to whole inches and adds top edge allowance', () => {
    expect(getCutHeight(4.25, 'Clear Foil Bullnose')).toBe(5.2);
    expect(getCutHeight(5, 'PVC Tape')).toBe(5.2);
    expect(getCutHeight(5.01, 'Wood Tape')).toBe(6.2);
    expect(getCutHeight(5.01, '')).toBe(6);
  });
});

describe('material rules', () => {
  it('uses 60 inch sheets for birch or explicit 60 marker', () => {
    expect(getSheetWidth('Baltic Birch Ply')).toBe(60);
    expect(getSheetWidth('Plywood (60)')).toBe(60);
  });

  it('uses 48 inch sheets by default', () => {
    expect(getSheetWidth('White Melamine')).toBe(48);
  });

  it('categorizes materials and edge overrides consistently', () => {
    expect(getMaterialCategory('FAA: Birch', 'Clear Foil Bullnose')).toBe('FAA SIDES');
    expect(getMaterialCategory('Baltic Birch Ply', 'Clear Foil Bullnose')).toBe('PLYWOOD SIDES');
    expect(getMaterialCategory('Maple Solid', 'Clear Foil Bullnose')).toBe('SOLID SIDES');
    expect(getMaterialCategory('Baltic Birch Ply', 'PVC White Tape')).toBe('MDF / PBC / PVC & TAPE SIDES');
    expect(getMaterialCategory('White Melamine', 'Clear Foil Bullnose')).toBe('MDF / PBC / PVC & TAPE SIDES');
  });
});

describe('cut optimization rules', () => {
  it('packs rip heights into sheets using usable width and kerf', () => {
    const sheets = packRipHeights([20, 20, 10], 48, 0.188);
    expect(sheets).toHaveLength(2);
    expect(sheets[0].rips).toEqual([20, 20]);
    expect(sheets[1].rips).toEqual([10]);
  });

  it('skips cut optimization for solid and FAA sides', () => {
    expect(getCutOptimizationGroups([{ height: 5, rips: 1, material: 'Maple', topEdge: 'Raw' }], 'SOLID SIDES')).toEqual([]);
    expect(getCutOptimizationGroups([{ height: 5, rips: 1, material: 'FAA Birch', topEdge: 'Raw' }], 'FAA SIDES')).toEqual([]);
  });

  it('groups optimization by material, top edge, and sheet width', () => {
    const rows = [
      { height: 10, rips: 2, material: 'Baltic Birch Ply', topEdge: 'Clear Foil Bullnose' },
      { height: 12, rips: 1, material: 'Baltic Birch Ply', topEdge: 'Clear Foil Bullnose' }
    ];
    const groups = getCutOptimizationGroups(rows, 'PLYWOOD SIDES');

    expect(groups).toHaveLength(1);
    expect(groups[0].sheetWidth).toBe(60);
    expect(groups[0].usableWidth).toBe(59.5);
    expect(getOptimizedSheetTotal(rows, 'PLYWOOD SIDES')).toBe(groups[0].sheets.length);
  });
});
