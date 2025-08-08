export const DEPARTMENTS = [
  'Cardiology',
  'Neurology',
  'General Surgery',
  'Orthopedics',
  'Pediatrics',
  'Obstetrics & Gynecology',
  'ENT',
  'Ophthalmology',
  'Dermatology',
  'Urology',
  'Nephrology',
  'Oncology',
  'Endocrinology',
  'Emergency',
  'Family Medicine',
] as const;

export const VISIT_TYPES = [
  'New',
  'Follow-up',
  'Post-op',
] as const;

export type Department = typeof DEPARTMENTS[number];
export type VisitType = typeof VISIT_TYPES[number];