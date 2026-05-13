export type TAdvantageTile = {
  id: string;
  title: string;
  description: string;
  badge?: string;
  items?: { label: string; reward?: string }[];
  levels?: string[];
  currentLevel?: string;
  vizEquals?: string;
  vizCap?: string;
  certificateName?: string;
  certificateIssuer?: string;
  certificateStatus?: string;
};
