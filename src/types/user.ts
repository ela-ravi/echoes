export interface UserInfo {
  id: number;
  name: string;
  email: string;
  phone: string;
  dob: string;
  totalNews: number | null;
  rewardPoint: number | null;
  badges: string[];
  doj: string;
}
