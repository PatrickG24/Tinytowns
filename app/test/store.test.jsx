import { describe, test, expect, beforeEach } from 'vitest';
import { act } from 'react-dom/test-utils';
import { useTownStore } from '../src/store';

const allResources = ['wood', 'stone', 'brick', 'wheat', 'glass'];

// Utility helpers
const getState = () => useTownStore.getState();
const setState = (fn) => act(() => fn());

describe('Zustand Store - Tiny Towns', () => {
  beforeEach(() => {
    setState(() => {
      const newDeck = ['wood', 'stone', 'brick', 'wheat', 'glass', 'glass']; // simple mock
      const newMarket = newDeck.slice(0, 3);
      getState().resetGame();
      useTownStore.setState({
        deck: newDeck,
        market: newMarket,
      });
    });
  });

  test('resetGame clears board and state', () => {
    const { grid, selectedResource, factoryContents, overrideOptions } = getState();
    expect(grid.flat().every(cell => cell === null)).toBe(true);
    expect(selectedResource).toBe(null);
    expect(Object.keys(factoryContents)).toHaveLength(0);
    expect(overrideOptions).toBe(null);
  });

  test('selectResource sets resource if no override conflict', () => {
    setState(() => getState().selectResource('wood', 0));
    expect(getState().selectedResource).toBe('wood');
    expect(getState().selectedMarketIndex).toBe(0);
  });

  test('chooseOverrideResource updates market and locks selection', () => {
    setState(() => {
      // manually trigger override state
      useTownStore.setState({
        overrideOptions: allResources,
        selectedMarketIndex: 1,
        deck: ['brick'],
        market: ['glass', 'wheat', 'stone'],
      });
      getState().chooseOverrideResource('wood');
    });

    const state = getState();
    expect(state.selectedResource).toBe('wood');
    expect(state.overrideOptions).toBe(null);
    expect(state.overrideLocked).toBe(true);
    expect(state.market.length).toBe(3);
  });

  test('toggleCell and clearSelection', () => {
    const key = '1,2';
    setState(() => getState().toggleCell(1, 2));
    expect(getState().selectedCells[key]).toBe(true);

    setState(() => getState().toggleCell(1, 2));
    expect(getState().selectedCells[key]).toBeUndefined();

    setState(() => {
      getState().toggleCell(2, 2);
      getState().clearSelection();
    });
    expect(Object.keys(getState().selectedCells)).toHaveLength(0);
  });

  test('cancelOverride clears related state', () => {
    setState(() => {
      useTownStore.setState({
        overrideOptions: allResources,
        selectedResource: 'glass',
        selectedMarketIndex: 1,
      });
      getState().cancelOverride();
    });

    const state = getState();
    expect(state.overrideOptions).toBe(null);
    expect(state.selectedResource).toBe(null);
    expect(state.selectedMarketIndex).toBe(null);
  });
});
