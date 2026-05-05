export type UserRole = 'client' | 'admin';

export interface Plan {
  id: string;
  name: string;
  arts_limit: number;
  revisions_limit: number;
  active_requests_limit: number;
  priority: boolean;
  price: number;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  plan_id: string | null;
  arts_used: number;
  revisions_used: number;
  subscription_status: 'active' | 'past_due' | 'canceled';
  next_reset_date: string;
}

export type RequestStatus = 'solicitado' | 'em produção' | 'revisão' | 'finalizado';

export interface DesignRequest {
  id: string;
  client_id: string;
  title: string;
  description: string;
  status: RequestStatus;
  revised_count: number;
  attachment_url: string | null;
  final_url: string | null;
  created_at: string;
  updated_at: string;
  client?: Profile;
}
