import { ButtonLink, Icon } from '@/components/ui';
import type { IconName } from '@/components/ui';
import { TARGET_TONNES } from '@/lib';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { HeroCounter } from '@/components/ui/HeroCounter';

/**
 * Landing page. Pure Server Component — no client JS ships for this route beyond
 * Next's runtime, keeping it fast (Efficiency axis). Interactive elements
 * (ScrollReveal, HeroCounter) are narrow client islands.
 */

const STEPS: ReadonlyArray<{ icon: IconName; title: string; body: string; stat: string; statLabel: string }> = [
  {
    icon: 'spark',
    title: 'Answer a few questions',
    body: 'A short, six-step questionnaire about how you travel, power your home, eat, and shop.',
    stat: '~2 min',
    statLabel: 'to complete',
  },
  {
    icon: 'chart',
    title: 'See where it comes from',
    body: 'Your annual footprint, broken down by category and compared against science-based targets.',
    stat: '4',
    statLabel: 'categories tracked',
  },
  {
    icon: 'target',
    title: 'Act on what matters',
    body: 'Personalized, ranked actions show the kilograms each change saves — start with the biggest wins.',
    stat: 'Up to 8',
    statLabel: 'tailored actions',
  },
];

const TRUST: ReadonlyArray<{ icon: IconName; title: string; body: string }> = [
  {
    icon: 'shield',
    title: 'Private by design',
    body: 'Everything runs in your browser. Your answers are stored only on your device — never uploaded to any server.',
  },
  {
    icon: 'globe',
    title: 'Transparent method',
    body: 'Built on published emission factors from DEFRA, the US EPA, the IEA, and peer-reviewed research.',
  },
  {
    icon: 'target',
    title: 'Built for action',
    body: 'Designed to turn awareness into a concrete, trackable reduction goal you can return to over time.',
  },
];

const STATS: ReadonlyArray<{ value: string; label: string }> = [
  { value: '4.7t', label: 'global average CO₂e/yr' },
  { value: '2.3t', label: '1.5°C-aligned target' },
  { value: '48%', label: 'reduction needed' },
];

export default function HomePage() {
  return (
    <main id="main">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-hero-mesh">
        {/* Decorative floating orbs */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-float absolute -left-20 top-20 h-72 w-72 rounded-full bg-primary/8 blur-3xl" />
          <div className="animate-float-slow absolute -right-16 top-32 h-64 w-64 rounded-full bg-accent/6 blur-3xl" />
          <div className="animate-float absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-primary-light/8 blur-2xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-3xl text-center">

            {/* Eyebrow */}
            <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/70 px-4 py-1.5 text-sm font-medium text-primary-dark backdrop-blur-sm shadow-glow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Carbon footprint awareness
            </div>

            {/* Headline */}
            <h1 className="animate-fade-up delay-100 mt-6 font-display text-5xl font-bold tracking-tight sm:text-7xl">
              <span className="text-gradient">Understand,</span>{' '}
              <span className="text-ink">track, and reduce</span>{' '}
              <br className="hidden sm:block" />
              <span className="text-ink">your carbon footprint.</span>
            </h1>

            <p className="animate-fade-up delay-200 mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink/2">
              Estimate your annual CO₂e in two minutes, see exactly where it comes from, and get
              personalized high-impact actions — all privately, in your browser.
            </p>

            {/* Live CO₂ counter — the signature element */}
            <HeroCounter />

            {/* CTAs */}
            <div className="animate-fade-up delay-400 mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink href="/calculator" size="lg" className="shadow-glow hover:shadow-glow transition-shadow duration-300">
                Calculate your footprint
                <Icon name="arrow-right" size={20} />
              </ButtonLink>
              <ButtonLink href="/dashboard" size="lg" variant="secondary">
                View your dashboard
              </ButtonLink>
            </div>

            <p className="animate-fade-up delay-500 mt-4 text-sm text-ink/50">
              Free · No sign-up · Aligned to a {TARGET_TONNES}t CO₂e science-based target
            </p>
          </div>

          {/* Stats strip */}
          <div className="animate-fade-up delay-600 mx-auto mt-16 grid max-w-2xl grid-cols-3 gap-px overflow-hidden rounded-3xl border border-primary/10 bg-primary/10 shadow-card">
            {STATS.map(({ value, label }) => (
              <div key={label} className="glass-card flex flex-col items-center gap-1 px-6 py-5">
                <span className="font-display text-2xl font-bold text-primary sm:text-3xl">{value}</span>
                <span className="text-center text-xs text-ink/60">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section aria-labelledby="how-heading" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <ScrollReveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">How it works</p>
            <h2 id="how-heading" className="mt-3 font-display text-4xl font-bold text-ink">
              From question to action plan
            </h2>
            <p className="mt-3 text-ink/60">Three steps. About two minutes. A concrete plan to start reducing.</p>
          </div>
        </ScrollReveal>

        <ol className="mt-14 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <ScrollReveal key={step.title} delay={i * 100}>
              <li className="group relative flex flex-col gap-5 rounded-3xl border border-primary/10 bg-card-gradient p-7 shadow-card transition-all duration-300 ease-spring hover:shadow-card-hover hover:-translate-y-1">
                {/* Step connector line on desktop */}
                {i < STEPS.length - 1 && (
                  <div aria-hidden="true" className="absolute -right-3 top-10 hidden h-px w-6 bg-primary/20 md:block" />
                )}

                {/* Icon + number */}
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-white">
                    <Icon name={step.icon} size={22} />
                  </span>
                  <span className="font-display text-4xl font-bold text-primary/15 transition-colors duration-200 group-hover:text-primary/25">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="font-display text-xl font-semibold text-ink">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-ink/60">{step.body}</p>
                </div>

                {/* Inline stat */}
                <div className="mt-auto flex items-baseline gap-1.5 border-t border-primary/8 pt-4">
                  <span className="font-display text-lg font-bold text-primary">{step.stat}</span>
                  <span className="text-xs text-ink/50">{step.statLabel}</span>
                </div>
              </li>
            </ScrollReveal>
          ))}
        </ol>
      </section>

      {/* ── Trust strip ──────────────────────────────────────────────────── */}
      <section aria-labelledby="trust-heading" className="relative overflow-hidden bg-white/60 py-20">
        {/* Subtle background texture */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_120%,rgba(5,150,105,0.06),transparent)]" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">The numbers you can trust</p>
              <h2 id="trust-heading" className="mt-3 font-display text-4xl font-bold text-ink">
                Why you can trust the numbers
              </h2>
            </div>
          </ScrollReveal>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {TRUST.map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 120}>
                <div className="flex gap-5">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-glow-sm">
                    <Icon name={item.icon} size={22} />
                  </span>
                  <div>
                    <h3 className="font-semibold text-ink">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink/60">{item.body}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing CTA ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-4 py-24 sm:px-6">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-4xl bg-cta-gradient p-10 text-center text-white shadow-glow sm:p-14">
            {/* Decorative rings */}
            <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full border border-white/10" />
            <div aria-hidden="true" className="pointer-events-none absolute -left-8 -bottom-8 h-32 w-32 rounded-full border border-white/10" />
            <div aria-hidden="true" className="pointer-events-none absolute right-20 bottom-0 h-64 w-64 rounded-full bg-white/4 blur-2xl" />

            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm">
                <Icon name="leaf" size={14} />
                Start for free
              </span>
              <h2 className="mt-5 font-display text-4xl font-bold sm:text-5xl">
                Ready to see your number?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-white/80 leading-relaxed">
                It takes about two minutes, and you can refine your answers any time.
                Your data stays on your device — always.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <ButtonLink href="/calculator" size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90 shadow-lg">
                  Start the calculator
                  <Icon name="arrow-right" size={20} />
                </ButtonLink>
                <ButtonLink href="/dashboard" size="lg" className="border border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm">
                  View dashboard
                </ButtonLink>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

    </main>
  );
}
