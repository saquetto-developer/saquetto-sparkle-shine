/**
 * Tax Regime Utilities
 * Helper functions for handling tax regime (Simples Nacional vs Lucro Presumido/Real)
 */

export type TaxRegime = 'simples' | 'presumido' | 'all';

export interface TaxRegimeInfo {
  value: TaxRegime;
  label: string;
  shortLabel: string;
  description: string;
}

export const TAX_REGIMES: Record<TaxRegime, TaxRegimeInfo> = {
  simples: {
    value: 'simples',
    label: 'Simples Nacional',
    shortLabel: 'Simples',
    description: 'Regime tributário simplificado para micro e pequenas empresas'
  },
  presumido: {
    value: 'presumido',
    label: 'Lucro Presumido/Real',
    shortLabel: 'Presumido/Real',
    description: 'Regime tributário de lucro presumido ou real'
  },
  all: {
    value: 'all',
    label: 'Todos os Regimes',
    shortLabel: 'Todos',
    description: 'Todos os regimes tributários'
  }
};

/**
 * Get tax regime from simples_optante boolean value
 */
export function getTaxRegimeFromBoolean(simplesOptante: boolean | null): TaxRegime {
  if (simplesOptante === true) return 'simples';
  if (simplesOptante === false) return 'presumido';
  return 'presumido'; // Default to presumido for null values
}

/**
 * Get tax regime label for display
 */
export function getTaxRegimeLabel(simplesOptante: boolean | null): string {
  const regime = getTaxRegimeFromBoolean(simplesOptante);
  return TAX_REGIMES[regime].label;
}

/**
 * Get tax regime short label for badges
 */
export function getTaxRegimeShortLabel(simplesOptante: boolean | null): string {
  const regime = getTaxRegimeFromBoolean(simplesOptante);
  return TAX_REGIMES[regime].shortLabel;
}

/**
 * Filter notes by tax regime
 */
export function filterByTaxRegime<T extends { simples_optante?: boolean | null }>(
  notes: T[],
  regime: TaxRegime
): T[] {
  if (regime === 'all') return notes;
  
  return notes.filter(note => {
    const noteRegime = getTaxRegimeFromBoolean(note.simples_optante ?? null);
    return noteRegime === regime;
  });
}

/**
 * Count notes by tax regime
 */
export function countByTaxRegime<T extends { simples_optante?: boolean | null }>(
  notes: T[]
): Record<'simples' | 'presumido', number> {
  return notes.reduce(
    (acc, note) => {
      const regime = getTaxRegimeFromBoolean(note.simples_optante ?? null);
      if (regime === 'simples') {
        acc.simples++;
      } else {
        acc.presumido++;
      }
      return acc;
    },
    { simples: 0, presumido: 0 }
  );
}
