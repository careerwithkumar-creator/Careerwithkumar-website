export type JobCategory = "govt" | "private" | "internship" | "remote" | "walkin";
export type JobStatus = "draft" | "published" | "archived";
export type JobSource = "manual" | "instagram";

export type JobPost = {
  id: string;
  slug: string;
  title: string;
  company: string;
  location: string | null;
  category: JobCategory;
  description: string;
  eligibility: string | null;
  salary: string | null;
  apply_url: string | null;
  deadline_at: string | null;
  status: JobStatus;
  source: JobSource;
  ig_media_id: string | null;
  cover_image_url: string | null;
  view_count: number;
  applied_count: number;
  report_count: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type PostView = {
  id: string;
  job_post_id: string;
  viewed_at: string;
  session_id: string;
};

export type AppliedReaction = {
  id: string;
  job_post_id: string;
  session_id: string;
  created_at: string;
};

export type LinkReport = {
  id: string;
  job_post_id: string;
  reason: string | null;
  created_at: string;
  resolved: boolean;
};

export type PushSubscriptionRow = {
  id: string;
  endpoint: string;
  keys: { p256dh: string; auth: string };
  created_at: string;
};

export type PostPresence = {
  session_id: string;
  job_post_id: string | null;
  last_seen_at: string;
};

export type Database = {
  public: {
    Tables: {
      job_posts: {
        Row: JobPost;
        Insert: Partial<JobPost> &
          Pick<JobPost, "slug" | "title" | "company" | "category">;
        Update: Partial<JobPost>;
        Relationships: [];
      };
      post_views: {
        Row: PostView;
        Insert: Omit<PostView, "id" | "viewed_at"> & { viewed_at?: string };
        Update: Partial<PostView>;
        Relationships: [];
      };
      applied_reactions: {
        Row: AppliedReaction;
        Insert: Omit<AppliedReaction, "id" | "created_at">;
        Update: Partial<AppliedReaction>;
        Relationships: [];
      };
      link_reports: {
        Row: LinkReport;
        Insert: Omit<LinkReport, "id" | "created_at" | "resolved"> & {
          resolved?: boolean;
        };
        Update: Partial<LinkReport>;
        Relationships: [];
      };
      push_subscriptions: {
        Row: PushSubscriptionRow;
        Insert: Omit<PushSubscriptionRow, "id" | "created_at">;
        Update: Partial<PushSubscriptionRow>;
        Relationships: [];
      };
      post_presence: {
        Row: PostPresence;
        Insert: PostPresence;
        Update: Partial<PostPresence>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      record_post_view_by_slug: {
        Args: { p_slug: string; p_session_id: string };
        Returns: void;
      };
      record_applied: {
        Args: { p_job_post_id: string; p_session_id: string };
        Returns: boolean;
      };
      record_link_report: {
        Args: { p_job_post_id: string; p_reason: string | null };
        Returns: void;
      };
      upsert_presence: {
        Args: { p_session_id: string; p_job_post_id: string | null };
        Returns: void;
      };
      record_push_subscription: {
        Args: { p_endpoint: string; p_keys: PushSubscriptionRow["keys"] };
        Returns: void;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
