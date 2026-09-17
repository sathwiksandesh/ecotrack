import { formatCo2, formatNumber, GRID_INTENSITY, type FootprintInput } from '@/lib';
import { Card, Icon } from '@/components/ui';

const LED_WATTS = 9;
const TRADITIONAL_BULB_WATTS = 60;
const BULB_COUNT = 5;
const HOURS_PER_DAY = 3;
const DAYS_PER_MONTH = 30;
const ELECTRICITY_RATE_INR = 7;

/** Energy detail card with a transparent, appliance-level LED scenario. */
export function EnergyCard({ input }: { input: FootprintInput }) {
  const { electricityKwhPerMonth, renewablePercent, householdSize } = input.home;
  const gridPercent = 100 - renewablePercent;
  const ledSavingKwhMonth =
    ((TRADITIONAL_BULB_WATTS - LED_WATTS) * BULB_COUNT * HOURS_PER_DAY * DAYS_PER_MONTH) / 1000;
  const ledSavingPercent =
    electricityKwhPerMonth > 0
      ? Math.min(100, (ledSavingKwhMonth / electricityKwhPerMonth) * 100)
      : 0;
  const annualCo2Saving =
    (ledSavingKwhMonth * 12 * GRID_INTENSITY[input.region] * (gridPercent / 100)) / householdSize;
  const monthlyRupeeSaving = ledSavingKwhMonth * ELECTRICITY_RATE_INR;

  return (
    <section aria-labelledby="energy-heading">
      <Card>
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
            <Icon name="bolt" size={23} />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">Energy</p>
            <h2 id="energy-heading" className="mt-1 font-display text-2xl font-bold text-ink">
              Monthly electricity
            </h2>
          </div>
        </div>
        <div className="mt-6 rounded-2xl bg-surface p-5">
          <div className="flex items-end justify-between gap-3">
            <div className="h-4 flex-1 overflow-hidden rounded-full bg-ink/10">
              <div
                className="h-full rounded-full bg-accent"
                style={{
                  width: `${Math.min(100, (electricityKwhPerMonth / Math.max(300, electricityKwhPerMonth)) * 100)}%`,
                }}
              />
            </div>
            <p className="shrink-0 font-display text-2xl font-bold text-ink">
              {formatNumber(electricityKwhPerMonth)} kWh
            </p>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 text-center">
            <div className="rounded-xl bg-primary/10 p-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                Solar / renewable
              </p>
              <p className="mt-1 font-display text-2xl font-bold text-ink">
                {formatNumber(renewablePercent)}%
              </p>
            </div>
            <div className="rounded-xl bg-ink/[0.04] p-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink/60">Grid</p>
              <p className="mt-1 font-display text-2xl font-bold text-ink">
                {formatNumber(gridPercent)}%
              </p>
            </div>
          </div>
        </div>
        <div className="mt-5 rounded-2xl border border-primary/15 bg-primary/[0.05] p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Potential saving
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <p className="font-display text-2xl font-bold text-ink">
              ₹{formatNumber(monthlyRupeeSaving)}/month
            </p>
            <p className="font-display text-2xl font-bold text-ink">
              {formatCo2(annualCo2Saving)}/year
            </p>
          </div>
          <p className="mt-4 border-t border-primary/15 pt-4 text-sm leading-relaxed text-ink/75">
            <span className="font-semibold text-primary">AI recommendation:</span> Replacing 5
            traditional bulbs with LEDs could reduce your electricity consumption by approximately{' '}
            {formatNumber(ledSavingPercent, 1)}%.
          </p>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-ink/50">
          LED estimate assumes 60 W bulbs replaced with 9 W LEDs, used 3 hours/day. ₹ saving uses an
          illustrative ₹7/kWh tariff; CO₂e follows your selected region, renewable share, and
          household size.
        </p>
      </Card>
    </section>
  );
}
