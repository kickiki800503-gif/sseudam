
export enum RelationType {
  DAD = '아빠',
  MOM = '엄마',
  BROTHER = '오빠',
  SISTER = '언니',
  UNCLE = '삼촌',
  AUNT = '이모',
  NEIGHBOR = '이웃주민'
}

export interface Guardian {
  id: string;
  name: string;
  relation: RelationType;
  level: number;
  points: number;
  isResident: boolean;
  photo?: string;
  lastSeen?: string;
  isLocationShared?: boolean;
}

export interface Dog {
  id: string;
  name: string;
  gender: 'M' | 'F';
  birthDate: string;
  weight: number;
  breed: string;
  loveLevel: number;
  totalPoints: number;
  photo?: string;
}

export interface Reaction {
  type: 'support' | 'thanks' | 'worry' | 'custom' | 'footprint';
  guardianIds: string[];
  text?: string;
}

export interface DiaryEntry {
  id: string;
  type: 'MEAL' | 'WALK' | 'MOOD' | 'POOP' | 'NOTE' | 'SNACK';
  timestamp: string;
  guardianId: string;
  content: string;
  value?: number;
  mealStatus?: 'full' | 'little' | 'much';
  rating?: number;
  moodTag?: string;
  photo?: string;
  reactions: Reaction[];
}

export interface FriendPost {
  id: string;
  dogId: string;
  dogName: string;
  dogPhoto: string;
  guardianId: string;
  content: string;
  mediaUrl: string;
  mediaType: 'video' | 'image';
  footprints: number;
  timestamp: string;
  location?: string;
  isFriend?: boolean;
}

export interface RecommendedDog {
  id: string;
  name: string;
  breed: string;
  age: string;
  location: string;
  reason: string;
  photo: string;
}

export interface NearbyMember {
  id: string;
  name: string;
  dogName: string;
  dogPhoto?: string;
  lat: number;
  lng: number;
  isFriend: boolean;
  isLocationShared: boolean;
}

export interface Store {
  id: string;
  name: string;
  category: 'CAFE' | 'CLINIC' | 'BEAUTY' | 'STORE';
  lat: number;
  lng: number;
  address: string;
  rating: number;
  pointsApplicable: boolean;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  category: 'DAILY' | 'QUESTION' | 'TIP' | 'SHARE';
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: string;
}
