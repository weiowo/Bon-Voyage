// Shared data models for documents stored in Firestore.
import type { Timestamp } from 'firebase/firestore';

/** One stop in a schedule day. */
export interface SchedulePlace {
  place_title: string;
  place_address: string;
  stay_time: number | string;
  place_id?: string;
}

export interface TripDay<P = SchedulePlace> {
  places: P[];
  /** Local-only key added when a schedule is loaded, used for React list keys. */
  key?: number;
}

/** `schedules/{schedule_id}` */
export interface Schedule {
  schedule_id: string;
  schedule_creator_user_id: string;
  title: string;
  embark_date: string;
  end_date: string;
  trip_days: TripDay[];
  members: string[];
  deleted: boolean;
}

export interface ArticlePlace {
  place_title: string;
  place_description: string;
  place_imgs: string[];
}

export type ArticleStatus = 'draft' | 'published';

/** `articles/{article_id}` */
export interface Article {
  article_id: string;
  article_title: string;
  article_creator_user_id: string;
  schedule_id: string;
  status: ArticleStatus;
  cover_img: string;
  summary: string;
  author: string | null;
  time: Timestamp;
  trip_days: TripDay<ArticlePlace>[];
}

/** `users/{user_id}` */
export interface UserProfile {
  user_id: string;
  email: string;
  name: string;
  photo_url?: string;
  owned_schedule_ids: string[];
  owned_article_ids: string[];
  loved_attraction_ids: string[];
  loved_article_ids: string[];
}

export interface ChatMessage {
  user_id: string;
  user_name: string;
  message: string;
  sent_time: Date | Timestamp;
  photo_url: string;
  unread: boolean;
}

/** `chat_rooms/{chat_room_id}` */
export interface ChatRoom {
  chat_room_id: string;
  schedule_id: string;
  creator_user_id: string;
  messages: ChatMessage[];
}

/** `attractions/{place_id}` */
export interface Attraction {
  place_id: string;
  place_title: string;
  place_address: string;
  place_url: string;
}

export interface LatLng {
  lat: number;
  lng: number;
}

/** Per-day list of leg distances or durations, e.g. `{ 0: ['3.2 km', '1.1 km'] }`. */
export type RouteInfo = Record<number, string[]>;

/** Google Places nearby-search results grouped by place type (e.g. `restaurant`). */
export type NearbyPlaces = Partial<Record<string, google.maps.places.PlaceResult[]>>;
