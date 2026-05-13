export type TScheduleCard = {
  id: string;
  badge?: string;
  title: string;
  subtitle: string;
  description: string;
  days: string[];
  activeDays: boolean[];
};
