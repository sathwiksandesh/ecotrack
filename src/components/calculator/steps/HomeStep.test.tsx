import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HomeStep } from './HomeStep';
import { defaultFootprintInput } from '@/lib';
import type { HomeInput } from '../validation';

function renderHome(overrides: Partial<HomeInput> = {}) {
  const onChange = vi.fn();
  const value: HomeInput = { ...defaultFootprintInput.home, ...overrides };
  render(<HomeStep value={value} onChange={onChange} errors={{}} />);
  return { onChange };
}

describe('HomeStep heating fuel switch', () => {
  it('resets the amount when the new fuel uses a different unit', async () => {
    const user = userEvent.setup();
    // Electric is metered in kWh; an amount is already entered.
    const { onChange } = renderHome({ heatingFuel: 'electric', heatingAmountPerMonth: 500 });

    // Switch to natural gas (m³) — a different unit, so the kWh figure must not carry over.
    await user.selectOptions(screen.getByLabelText(/how is your home heated/i), 'gas');

    expect(onChange).toHaveBeenCalledWith({ heatingFuel: 'gas', heatingAmountPerMonth: 0 });
  });

  it('keeps the amount when switching between fuels that share a unit', async () => {
    const user = userEvent.setup();
    // Electric → heat pump: both measured in kWh, so the entered amount should be preserved.
    const { onChange } = renderHome({ heatingFuel: 'electric', heatingAmountPerMonth: 500 });

    await user.selectOptions(screen.getByLabelText(/how is your home heated/i), 'heatpump');

    expect(onChange).toHaveBeenCalledWith({ heatingFuel: 'heatpump' });
  });
});
