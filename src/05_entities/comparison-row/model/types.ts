export type TComparisonValue =
  | { kind: 'check' }
  | { kind: 'cross' }
  | { kind: 'partial'; text: string }
  | { kind: 'text'; text: string };

export type TComparisonRow = {
  feature: string;
  values: TComparisonValue[];
};
