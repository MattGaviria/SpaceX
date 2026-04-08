export interface RocketInfo {
  rocket_id: string;
  rocket_name: string;
  rocket_type: string;
}

export interface Links {
  mission_patch?: string;
  mission_patch_small?: string;
  article_link?: string;
  wikipedia?: string;
  video_link?: string;
}

export interface SpaceXMission {
  flight_number: number;
  mission_name: string;
  mission_id: string[];
  launch_year: string;
  launch_date_utc: string;
  details?: string;
  mission_patch_small?: string;
  rocket: RocketInfo;
  links: Links;
  launch_site?: {
    site_id: string;
    site_name: string;
    site_name_long: string;
  };
  rocket_type?: string;
  success?: boolean;
}

export interface LaunchYear {
  year: number;
  count: number;
}
