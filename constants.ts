
import { Dog, Guardian, RelationType, DiaryEntry, Store, CommunityPost, FriendPost, RecommendedDog, NearbyMember } from './types';

export const COLORS = {
  primary: '#F97316',
  secondary: '#FDE68A',
  accent: '#10B981',
};

export const MOCK_DOG: Dog = {
  id: 'dog-1',
  name: '보람이',
  gender: 'F',
  birthDate: '2022-05-20',
  weight: 5.2,
  breed: '포메라니안',
  loveLevel: 75,
  totalPoints: 1250,
  photo: 'https://images.unsplash.com/photo-1591768793355-74d7c86966b7?w=400&h=400&fit=crop',
};

export const MOCK_GUARDIANS: Guardian[] = [
  { id: 'g1', name: '보람 아빠', relation: RelationType.DAD, level: 12, points: 450, isResident: true, photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop', lastSeen: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
  { id: 'g2', name: '보람 엄마', relation: RelationType.MOM, level: 15, points: 800, isResident: true, photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop', lastSeen: new Date().toISOString() },
  { id: 'g3', name: '보람 삼촌', relation: RelationType.UNCLE, level: 5, points: 120, isResident: false, photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop', lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
  { id: 'g4', name: '보람 언니', relation: RelationType.SISTER, level: 8, points: 210, isResident: true, lastSeen: new Date().toISOString() },
];

export const MOCK_FRIEND_POSTS: FriendPost[] = [
  {
    id: 'fp1',
    dogId: 'd2',
    dogName: '초코',
    dogPhoto: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=200',
    guardianId: 'u1',
    content: '오늘 날씨 너무 좋아서 한강 산책 다녀왔어요! 🐾 시원한 바람 맞으면서 혀 낼름~',
    mediaUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800',
    mediaType: 'image',
    footprints: 45,
    timestamp: '2024-05-12T10:00:00',
    location: '뚝섬유원지',
    isFriend: true
  },
  {
    id: 'fp2',
    dogId: 'd3',
    dogName: '밀키',
    dogPhoto: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=200',
    guardianId: 'u2',
    content: '새로 산 노란색 우비 입어봤는데 어떤가요? 🌧️ 비 오는 날 산책도 무섭지 않아!',
    mediaUrl: 'https://images.unsplash.com/photo-1541364983171-a8ba01d95cfc?w=800',
    mediaType: 'image',
    footprints: 32,
    timestamp: '2024-05-12T11:30:00',
    isFriend: true
  },
  {
    id: 'fp3',
    dogId: 'd4',
    dogName: '탄이',
    dogPhoto: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?w=200',
    guardianId: 'u3',
    content: '무한 장난감 던지기 지옥... 🎾 지치지 않는 체력 탄이입니다.',
    mediaUrl: 'https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?w=800',
    mediaType: 'image',
    footprints: 128,
    timestamp: '2024-05-12T14:15:00',
    isFriend: true
  }
];

export const MOCK_RECOMMENDED_DOGS: RecommendedDog[] = [
  { id: 'rd1', name: '구름이', breed: '포메라니안', age: '2살', location: '문정동', reason: '같은 포메 친구', photo: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=200' },
  { id: 'rd2', name: '단풍이', breed: '푸들', age: '1살', location: '가락동', reason: '근처에 살아요', photo: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=200' },
  { id: 'rd3', name: '뭉치', breed: '비숑', age: '3살', location: '문정동', reason: '보호자 연령대 비슷', photo: 'https://images.unsplash.com/photo-1591160690555-5debfba289f0?w=200' },
];

export const MOCK_NEARBY_MEMBERS: NearbyMember[] = [
  { id: 'nm1', name: '망고 엄마', dogName: '망고', dogPhoto: 'https://images.unsplash.com/photo-1516222338250-863216ce01ea?w=100', lat: 37.4872, lng: 127.1235, isFriend: true, isLocationShared: true },
  { id: 'nm2', name: '하루 아빠', dogName: '하루', dogPhoto: 'https://images.unsplash.com/photo-1544568100-847a948585b9?w=100', lat: 37.4885, lng: 127.1251, isFriend: false, isLocationShared: true },
  { id: 'nm3', name: '별이 언니', dogName: '별이', dogPhoto: 'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=100', lat: 37.4861, lng: 127.1218, isFriend: true, isLocationShared: true },
  { id: 'nm4', name: '초코 오빠', dogName: '초코', dogPhoto: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=100', lat: 37.4855, lng: 127.1242, isFriend: false, isLocationShared: true },
];

export const MOCK_DIARY: DiaryEntry[] = [
  { id: 'd1', type: 'MEAL', timestamp: '2024-05-10T08:30:00', guardianId: 'g2', content: '아침 사료 50g 급여 완료', value: 50, reactions: [{ type: 'thanks', guardianIds: ['g1', 'g3'] }] },
  { id: 'd2', type: 'WALK', timestamp: '2024-05-10T10:00:00', guardianId: 'g1', content: '동네 한바퀴 산책', value: 30, reactions: [{ type: 'support', guardianIds: ['g2'] }] },
  { id: 'd3', type: 'POOP', timestamp: '2024-05-10T10:15:00', guardianId: 'g1', content: '상태 좋음', rating: 5, reactions: [{ type: 'support', guardianIds: ['g2'] }] },
];

export const MOCK_STORES: Store[] = [
  { id: 's1', name: '멍뭉카페 문정점', category: 'CAFE', lat: 37.487, lng: 127.123, address: '서울시 송파구 문정동 123', rating: 4.8, pointsApplicable: true },
  { id: 's2', name: '해피동물병원', category: 'CLINIC', lat: 37.488, lng: 127.124, address: '서울시 송파구 문정동 456', rating: 4.9, pointsApplicable: false },
  { id: 's3', name: '댕댕뷰티샵', category: 'BEAUTY', lat: 37.486, lng: 127.122, address: '서울시 송파구 문정동 789', rating: 4.5, pointsApplicable: true },
];

export const MOCK_POSTS: CommunityPost[] = [
  { id: 'p1', authorId: 'g1', category: 'TIP', content: '문정동 탄천 산책로에 진드기가 좀 보이네요! 다들 조심하세요~', likes: 12, comments: 5, timestamp: '2024-05-11T14:20:00' },
  { id: 'p2', authorId: 'g2', category: 'QUESTION', content: '발바닥 습진 때문에 병원 가보려는데, 해피동물병원 원장님 친절하신가요?', image: 'https://picsum.photos/id/1025/600/400', likes: 8, comments: 15, timestamp: '2024-05-11T16:45:00' }
];
