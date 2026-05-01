export type AdminRsvp = {
  id: string;
  name: string;
  email: string;
  attending: "yes" | "no";
  guests: number;
  note?: string | null;
  submitted_at: string;
};
