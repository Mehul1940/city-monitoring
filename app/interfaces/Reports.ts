export interface Report {
  id: number;
  department: string;
  photo_url: string;
  identify_object_url: string;
  location_link: string;
  latitude: number;
  longitude: number;
  status: string;
  reported_on: string;
  completed_time: string;
  remark: string;
  zone: string;
  reason: string;
  ward: string;
}