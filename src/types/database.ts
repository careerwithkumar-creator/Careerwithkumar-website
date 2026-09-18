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

// Column subset used by job listing UI (cards, feed, results). Selecting only
// these in list queries avoids shipping full `description`/`eligibility`
// text — which the list UI never renders — down to the browser.
export type JobListItem = Pick<
  JobPost,
  | "id"
  | "slug"
  | "title"
  | "company"
  | "location"
  | "category"
  | "source"
  | "salary"
  | "deadline_at"
  | "view_count"
  | "published_at"
  | "created_at"
>;

export const JOB_LIST_COLUMNS =
  "id, slug, title, company, location, category, source, salary, deadline_at, view_count, published_at, created_at";

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

export type BookingAvailabilityRule = {
  id: string;
  day_of_week: number; // 0 = Sunday .. 6 = Saturday
  start_time: string; // "HH:MM:SS", IST wall-clock
  end_time: string;
  slot_duration_minutes: number;
  is_active: boolean;
  created_at: string;
};

export type BookingStatus = "confirmed" | "cancelled";

export type SessionBooking = {
  id: string;
  slot_start: string;
  slot_end: string;
  name: string;
  email: string;
  notes: string | null;
  status: BookingStatus;
  meet_link: string | null;
  created_at: string;
};

export type BookingSettings = {
  id: number;
  meet_link: string | null;
  updated_at: string;
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
      booking_availability_rules: {
        Row: BookingAvailabilityRule;
        Insert: Omit<BookingAvailabilityRule, "id" | "created_at"> & {
          id?: string;
        };
        Update: Partial<BookingAvailabilityRule>;
        Relationships: [];
      };
      session_bookings: {
        Row: SessionBooking;
        Insert: Omit<SessionBooking, "id" | "created_at" | "status"> & {
          status?: BookingStatus;
        };
        Update: Partial<SessionBooking>;
        Relationships: [];
      };
      booking_settings: {
        Row: BookingSettings;
        Insert: BookingSettings;
        Update: Partial<BookingSettings>;
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
