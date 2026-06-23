export type TAdvantageTileBadge = {
  text: string;
  kind?: 'new' | 'coming-soon' | 'feature';
};

export type TAdvantageTile = {
  id: string;
  title: string;
  description: string;
  badge?: TAdvantageTileBadge;
};

export type TAdvantageTileVariant = 'anchor' | 'gold' | 'default';
