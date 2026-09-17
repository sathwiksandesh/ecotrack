import { calculateFootprint, formatCo2, generateTips, type FootprintInput } from '@/lib';
import { Card, Icon } from '@/components/ui';

type PlanItem = {
  icon: 'car' | 'bolt' | 'food' | 'recycle' | 'leaf';
  title: string;
  detail: string;
  saving: number;
};

function pickAction(
  input: FootprintInput,
  category: 'transport' | 'home' | 'food' | 'consumption',
  fallback: Omit<PlanItem, 'saving'>,
): PlanItem {
  const result = calculateFootprint(input);
  const tip = generateTips(input, result).find((item) => item.category === category);
  return tip
    ? {
        icon:
          category === 'home'
            ? 'bolt'
            : category === 'food'
              ? 'food'
              : category === 'consumption'
                ? 'recycle'
                : 'car',
        title: tip.title,
        detail: tip.description,
        saving: tip.estimatedSavingKg,
      }
    : { ...fallback, saving: 0 };
}

/** A staged, personalized 90-day action plan using the dashboard's reduction engine. */
export function GreenPlan({ input }: { input: FootprintInput }) {
  const transport = pickAction(input, 'transport', {
    icon: 'car',
    title: 'Reduce car usage',
    detail: 'Replace a short regular trip with walking, cycling, or public transport.',
  });
  const energy = pickAction(input, 'home', {
    icon: 'bolt',
    title: 'Reduce electricity',
    detail: 'Focus on the electricity habits you can change this month.',
  });
  const food = pickAction(input, 'food', {
    icon: 'food',
    title: 'Modify food choices',
    detail: 'Plan lower-impact meals and reduce avoidable food waste.',
  });
  const waste = pickAction(input, 'consumption', {
    icon: 'recycle',
    title: 'Improve waste separation',
    detail: 'Recycle consistently and make the most of what you already own.',
  });
  const months: Array<{ title: string; items: PlanItem[] }> = [
    { title: 'Month 1', items: [transport, energy] },
    { title: 'Month 2', items: [food, waste] },
    {
      title: 'Month 3',
      items: [
        {
          icon: 'leaf',
          title: 'Explore renewable energy',
          detail:
            input.home.renewablePercent < 100
              ? 'Compare a renewable tariff or rooftop solar for your home.'
              : 'Maintain your current renewable electricity share.',
          saving: 0,
        },
        {
          icon: 'car',
          title: 'Increase low-carbon transport',
          detail: 'Make the best travel change from month 1 part of your weekly routine.',
          saving: 0,
        },
      ],
    },
  ];
  const potentialSaving = transport.saving + energy.saving + food.saving + waste.saving;

  return (
    <section aria-labelledby="green-plan-heading">
      <Card className="bg-gradient-to-br from-primary/[0.08] via-white to-secondary/[0.07]">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-glow-sm">
            <Icon name="target" size={22} />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Personalized roadmap
            </p>
            <h2 id="green-plan-heading" className="mt-1 font-display text-2xl font-bold text-ink">
              Your 90-Day Green Plan
            </h2>
            <p className="mt-2 text-sm text-ink/70">
              Build momentum with a manageable focus each month.
            </p>
          </div>
        </div>
        <ol className="mt-7 grid gap-4 lg:grid-cols-3">
          {months.map((month) => (
            <li key={month.title} className="rounded-2xl bg-white/85 p-5 ring-1 ring-primary/10">
              <h3 className="font-display text-lg font-bold text-ink">{month.title}</h3>
              <ul className="mt-4 space-y-4">
                {month.items.map((item) => (
                  <li key={item.title} className="flex gap-3">
                    <span className="mt-0.5 text-primary">
                      <Icon name={item.icon} size={18} />
                    </span>
                    <div>
                      <p className="font-semibold text-ink">{item.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-ink/60">{item.detail}</p>
                      {item.saving > 0 ? (
                        <p className="mt-1 text-xs font-semibold text-primary">
                          Estimated saving: {formatCo2(item.saving)}/year
                        </p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-primary p-5 text-white">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
              Potential reduction
            </p>
            <p className="mt-1 font-display text-3xl font-bold">{formatCo2(potentialSaving)}</p>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-white/80">
            Estimated from your highest-impact transport, home, food, and consumption actions.
          </p>
        </div>
        <p className="mt-4 text-xs text-ink/50">
          Savings are annual estimates. Follow one primary action per category; do not add
          overlapping travel or energy changes together.
        </p>
      </Card>
    </section>
  );
}
