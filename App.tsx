
import React, { useState } from 'react';
import Layout from './components/Layout';
import Calendar from './components/Calendar';
import DiarySummary from './components/DiarySummary';
import { MOCK_DOG, MOCK_GUARDIANS, MOCK_DIARY, MOCK_STORES, MOCK_POSTS, MOCK_FRIEND_POSTS, MOCK_RECOMMENDED_DOGS, MOCK_NEARBY_MEMBERS } from './constants';
import { DiaryEntry, RelationType, CommunityPost, Reaction, Guardian, FriendPost, RecommendedDog, NearbyMember } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [dog] = useState(MOCK_DOG);
  const [logs, setLogs] = useState<DiaryEntry[]>(MOCK_DIARY);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editingLogId, setEditingLogId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [expandedReactionKey, setExpandedReactionKey] = useState<string | null>(null);

  // 친구 관련 상태
  const [friendPosts, setFriendPosts] = useState<FriendPost[]>(MOCK_FRIEND_POSTS);
  const [myFriendPosts, setMyFriendPosts] = useState<FriendPost[]>([]);
  const [friendsTabMode, setFriendsTabMode] = useState<'feed' | 'recommend' | 'map'>('feed');
  const [feedFilter, setFeedFilter] = useState<'all' | 'mine'>('all');

  const currentUser = MOCK_GUARDIANS[1]; // 보람 엄마

  // Input States (우리집용)
  const [activeInput, setActiveInput] = useState<DiaryEntry['type'] | null>(null);
  const [inputVal, setInputVal] = useState<number>(50);
  const [mealStatus, setMealStatus] = useState<'full' | 'little' | 'much'>('full');
  const [rating, setRating] = useState<number>(5);
  const [snackRating, setSnackRating] = useState<number>(3);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 1500);
  };

  const getGuardianAvatar = (guardian: Guardian | undefined, size: 'sm' | 'md' | 'lg' = 'md') => {
    if (!guardian) return null;
    const sizeClasses = { sm: 'w-5 h-5 text-[8px]', md: 'w-10 h-10 text-[18px]', lg: 'w-24 h-24 text-[40px]' };
    const emojiMap: Record<RelationType, string> = {
      [RelationType.DAD]: '👨🏻', [RelationType.MOM]: '👩🏻', [RelationType.BROTHER]: '👦🏻',
      [RelationType.SISTER]: '👧🏻', [RelationType.UNCLE]: '🧑🏻', [RelationType.AUNT]: '👱🏻‍♀️', [RelationType.NEIGHBOR]: '🏘️',
    };
    const bgMap: Record<RelationType, string> = {
      [RelationType.DAD]: 'bg-blue-50', [RelationType.MOM]: 'bg-pink-50', [RelationType.BROTHER]: 'bg-indigo-50',
      [RelationType.SISTER]: 'bg-yellow-50', [RelationType.UNCLE]: 'bg-green-50', [RelationType.AUNT]: 'bg-orange-50', [RelationType.NEIGHBOR]: 'bg-gray-50',
    };

    if (guardian.photo) {
      return <img src={guardian.photo} className={`${sizeClasses[size]} rounded-full border border-white object-cover shadow-sm shrink-0`} alt={guardian.name} />;
    }
    return <div className={`${sizeClasses[size]} rounded-full ${bgMap[guardian.relation] || 'bg-gray-100'} flex items-center justify-center border border-white shadow-sm shrink-0 select-none`}>{emojiMap[guardian.relation] || '👤'}</div>;
  };

  const addLog = (params: Partial<DiaryEntry>) => {
    let formattedContent = params.content || '';
    if (params.type === 'MEAL') {
      const statusText = params.mealStatus === 'full' ? '배불리 다 먹었어요.' : params.mealStatus === 'little' ? '조금 남겼어요.' : '많이 남겼어요.';
      formattedContent = `${dog.name} 사료 ${params.value}g 먹었어요. ${statusText}`;
    } else if (params.type === 'WALK') {
      formattedContent = `${dog.name} 산책 ${params.value}분 시켰어요.`;
    } else if (params.type === 'POOP') {
      formattedContent = `${dog.name} 배변 했어요. 상태는`;
    } else if (params.type === 'SNACK') {
      const snacksEmoji = '🦴'.repeat(params.rating || 1);
      formattedContent = `${dog.name} 간식 먹었어요. 양은 ${snacksEmoji}`;
    }

    const newLog: DiaryEntry = {
      id: Math.random().toString(),
      type: params.type || 'NOTE',
      timestamp: new Date().toISOString(),
      guardianId: currentUser.id,
      content: formattedContent,
      value: params.value,
      mealStatus: params.mealStatus,
      rating: params.type === 'SNACK' ? params.rating : params.rating,
      reactions: [],
    };
    setLogs([newLog, ...logs]);
    setActiveInput(null);
    showFeedback('기록이 저장되었습니다!');
  };

  const handleReaction = (logId: string, type: 'support' | 'thanks' | 'worry' | 'custom', customText?: string) => {
    const labels = { support: '고생했어요', thanks: '고마워요', worry: '걱정이에요', custom: customText || '입력 완료' };
    setLogs(prev => prev.map(log => {
      if (log.id !== logId) return log;
      const reactions = [...log.reactions];
      if (type === 'custom') {
        reactions.push({ type: 'custom', guardianIds: [currentUser.id], text: customText });
      } else {
        const existingIdx = reactions.findIndex(r => r.type === type);
        if (existingIdx > -1) {
          const r = reactions[existingIdx];
          if (r.guardianIds.includes(currentUser.id)) {
            r.guardianIds = r.guardianIds.filter(id => id !== currentUser.id);
            if (r.guardianIds.length === 0) reactions.splice(existingIdx, 1);
          } else {
            r.guardianIds.push(currentUser.id);
          }
        } else {
          reactions.push({ type, guardianIds: [currentUser.id] });
        }
      }
      return { ...log, reactions };
    }));
    showFeedback(labels[type as keyof typeof labels]);
  };

  const toggleReactionNames = (logId: string, type: string) => {
    const key = `${logId}-${type}`;
    setExpandedReactionKey(expandedReactionKey === key ? null : key);
  };

  // 친구 일상 등록
  const addMyDailyPost = () => {
    const text = window.prompt(`${dog.name}의 오늘 일상을 한 줄로 남겨주세요!`);
    if (!text) return;
    
    const newPost: FriendPost = {
      id: Math.random().toString(),
      dogId: dog.id,
      dogName: dog.name,
      dogPhoto: dog.photo || '',
      guardianId: currentUser.id,
      content: text,
      mediaUrl: dog.photo || 'https://images.unsplash.com/photo-1591768793355-74d7c86966b7?w=800',
      mediaType: 'image',
      footprints: 0,
      timestamp: new Date().toISOString(),
      location: '우리집',
    };
    
    setMyFriendPosts([newPost, ...myFriendPosts]);
    setFeedFilter('mine');
    showFeedback(`${dog.name}의 일상이 등록되었습니다!`);
  };

  const handleFootprint = (postId: string, source: 'all' | 'mine') => {
    if (source === 'all') {
      setFriendPosts(prev => prev.map(p => p.id === postId ? { ...p, footprints: p.footprints + 1 } : p));
    } else {
      setMyFriendPosts(prev => prev.map(p => p.id === postId ? { ...p, footprints: p.footprints + 1 } : p));
    }
    showFeedback("🐾 발자국을 남겼어요!");
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="p-5 space-y-5">
            {feedbackMsg && (
              <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-orange-600 text-white px-6 py-2 rounded-full text-[11px] font-bold shadow-2xl animate-in fade-in zoom-in duration-300">
                {feedbackMsg}
              </div>
            )}

            {/* Top Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-[2rem] p-4 text-white shadow-lg relative overflow-hidden flex flex-col justify-between h-36">
                <div className="relative z-10 flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-bold flex items-center">{dog.name}</h2>
                    <p className="text-[9px] text-orange-100">{dog.breed} • {dog.gender === 'M' ? '남아' : '여아'}</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-lg text-[9px] font-bold">
                    Lv.{Math.floor(dog.loveLevel / 10)}
                  </div>
                </div>
                <div className="relative z-10 space-y-1">
                  <div className="flex justify-between text-[9px] font-bold opacity-80 uppercase tracking-tight">
                    <span>가족 애정</span>
                    <span>{dog.loveLevel}%</span>
                  </div>
                  <div className="h-1.5 bg-white/30 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: `${dog.loveLevel}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[2rem] p-4 border border-gray-100 shadow-sm flex flex-col justify-between h-36">
                <div className="flex items-center space-x-2">
                  {getGuardianAvatar(currentUser, 'sm')}
                  <div className="min-w-0">
                    <p className="text-[9px] font-black text-gray-800 truncate">{currentUser.name}</p>
                    <p className="text-[8px] text-orange-500 font-bold">Lv.{currentUser.level} • {currentUser.relation}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex flex-col">
                    <span className="text-[7px] text-gray-400 font-bold uppercase tracking-tight">우리 동네 활동</span>
                    <span className="text-[9px] font-bold text-gray-700 truncate">문정동 댕댕 모임</span>
                  </div>
                  <div className="pt-1 border-t border-gray-50">
                    <div className="flex justify-between items-center text-[8px] font-bold text-gray-400 mb-0.5">
                      <span>내 기여도</span>
                      <span className="text-orange-600">{currentUser.points}P</span>
                    </div>
                    <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-400 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { icon: '🥘', label: '식사', type: 'MEAL', color: 'bg-amber-50 text-amber-600 border-amber-100' },
                { icon: '🦴', label: '간식', type: 'SNACK', color: 'bg-orange-50 text-orange-600 border-orange-100' },
                { icon: '🐕', label: '산책', type: 'WALK', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
                { icon: '🩹', label: '배변', type: 'POOP', color: 'bg-rose-50 text-rose-600 border-rose-100' },
              ].map((action) => (
                <button
                  key={action.type}
                  onClick={() => {
                    setActiveInput(action.type as any);
                    if (action.type === 'MEAL') setInputVal(50);
                    if (action.type === 'WALK') setInputVal(30);
                  }}
                  className={`flex flex-col items-center space-y-1 p-2 rounded-2xl border ${action.color} shadow-sm transition-all active:scale-95`}
                >
                  <span className="text-xl">{action.icon}</span>
                  <span className="text-[9px] font-bold">{action.label}</span>
                </button>
              ))}
            </div>

            {/* Input Overlays */}
            {activeInput && (
              <div className="p-4 bg-white rounded-3xl border border-orange-200 shadow-xl animate-in slide-in-from-top-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-gray-800 text-[10px] uppercase tracking-wider">
                    {activeInput === 'MEAL' ? '식사 기록' : activeInput === 'SNACK' ? '간식 기록' : activeInput === 'WALK' ? '산책 기록' : '배변 상태'}
                  </h4>
                  <button onClick={() => setActiveInput(null)} className="text-gray-400 text-sm">✕</button>
                </div>
                {activeInput === 'MEAL' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-gray-50 p-2 rounded-xl">
                      <button onClick={() => setInputVal(Math.max(0, inputVal - 10))} className="w-10 h-10 bg-white rounded-lg shadow-sm font-black text-orange-600">-10</button>
                      <div className="flex items-baseline space-x-1"><span className="text-2xl font-black text-orange-600">{inputVal}</span><span className="text-xs font-bold text-gray-400">g</span></div>
                      <button onClick={() => setInputVal(inputVal + 10)} className="w-10 h-10 bg-white rounded-lg shadow-sm font-black text-orange-600">+10</button>
                    </div>
                    <div className="flex gap-1.5">{['full', 'little', 'much'].map((status) => (<button key={status} onClick={() => setMealStatus(status as any)} className={`flex-1 py-2 rounded-xl text-[10px] font-bold transition-all ${mealStatus === status ? 'bg-orange-500 text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}>{status === 'full' ? '다 먹음' : status === 'little' ? '조금 남김' : '많이 남김'}</button>))}</div>
                    <button onClick={() => addLog({ type: 'MEAL', value: inputVal, mealStatus })} className="w-full bg-orange-600 text-white py-3.5 rounded-2xl font-bold shadow-lg">기록하기</button>
                  </div>
                )}
                {activeInput === 'SNACK' && (
                  <div className="space-y-4 text-center">
                    <div className="flex justify-center space-x-3 py-2">{[1, 2, 3, 4, 5].map(s => (<button key={s} onClick={() => setSnackRating(s)} className={`text-3xl transition-all ${s <= snackRating ? 'scale-110 drop-shadow-sm' : 'grayscale opacity-20'}`}>🦴</button>))}</div>
                    <button onClick={() => addLog({ type: 'SNACK', rating: snackRating })} className="w-full bg-orange-500 text-white py-3.5 rounded-2xl font-bold shadow-lg">기록하기</button>
                  </div>
                )}
                {activeInput === 'WALK' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-gray-50 p-2 rounded-xl">
                      <button onClick={() => setInputVal(Math.max(0, inputVal - 10))} className="w-10 h-10 bg-white rounded-lg shadow-sm font-black text-emerald-600">-10</button>
                      <div className="flex items-baseline space-x-1"><span className="text-2xl font-black text-emerald-600">{inputVal}</span><span className="text-xs font-bold text-gray-400">분</span></div>
                      <button onClick={() => setInputVal(inputVal + 10)} className="w-10 h-10 bg-white rounded-lg shadow-sm font-black text-emerald-600">+10</button>
                    </div>
                    <button onClick={() => addLog({ type: 'WALK', value: inputVal })} className="w-full bg-emerald-500 text-white py-3.5 rounded-2xl font-bold shadow-lg">기록하기</button>
                  </div>
                )}
                {activeInput === 'POOP' && (
                  <div className="space-y-4 text-center">
                    <div className="flex justify-center space-x-3 py-2">{[1, 2, 3, 4, 5].map(s => (<button key={s} onClick={() => setRating(s)} className={`text-3xl transition-all ${s <= rating ? 'scale-110' : 'grayscale opacity-20'}`}>💩</button>))}</div>
                    <button onClick={() => addLog({ type: 'POOP', rating })} className="w-full bg-amber-800 text-white py-3.5 rounded-2xl font-bold shadow-lg">기록하기</button>
                  </div>
                )}
              </div>
            )}

            {/* Feed Timeline */}
            <div className="space-y-3">
              <h3 className="font-bold text-gray-800 text-sm flex justify-between items-center px-1">실시간 양육 피드</h3>
              <div className="space-y-3">
                {logs.slice(0, 5).map((log) => {
                  const guardian = MOCK_GUARDIANS.find(u => u.id === log.guardianId);
                  return (
                    <div key={log.id} className="bg-white p-4 rounded-[1.8rem] border border-gray-100 shadow-sm flex items-start group relative transition-all hover:border-orange-50">
                      {getGuardianAvatar(guardian)}
                      <div className="flex-1 min-w-0 ml-3">
                        <div className="flex items-center mb-1">
                          <span className="font-bold text-[12px] text-gray-800 mr-1.5">{guardian?.name}</span>
                          <span className="text-[9px] text-gray-400 font-bold opacity-70">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center flex-wrap gap-1">
                                <p className="text-[12px] text-gray-600 leading-[1.5] break-all">{log.content}</p>
                                {log.type === 'POOP' && <div className="flex space-x-0.5 ml-1">{[1, 2, 3, 4, 5].map(s => (<span key={s} className={`text-[12px] ${s <= (log.rating || 0) ? 'opacity-100 grayscale-0' : 'opacity-20 grayscale'}`}>💩</span>))}</div>}
                            </div>
                            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 mt-2">
                              {log.reactions.map((r, idx) => {
                                const isExpanded = expandedReactionKey === `${log.id}-${r.type}`;
                                const reactionNames = r.guardianIds.map(gid => MOCK_GUARDIANS.find(u => u.id === gid)?.name).join(', ');
                                return (
                                  <div key={idx} onClick={() => toggleReactionNames(log.id, r.type)} className={`flex items-center shrink-0 rounded-full px-2 py-1 border transition-all cursor-pointer ${isExpanded ? 'bg-orange-50 border-orange-200 shadow-inner' : 'bg-gray-50 border-gray-100 hover:bg-orange-50/50'}`}>
                                    <span className="text-[11px] mr-1">{r.type === 'support' ? '👍' : r.type === 'thanks' ? '❤️' : r.type === 'worry' ? '🥺' : '💬'}</span>
                                    <div className="flex -space-x-1.5 mr-1.5">{r.guardianIds.slice(0, 3).map(gid => (<div key={gid} className="w-4 h-4 rounded-full border border-white shadow-sm overflow-hidden bg-white">{getGuardianAvatar(MOCK_GUARDIANS.find(gu => gu.id === gid), 'sm')}</div>))}</div>
                                    {isExpanded && <span className="text-[9px] font-black text-orange-600 animate-in fade-in slide-in-from-left-2 duration-300">{reactionNames}</span>}
                                  </div>
                                );
                              })}
                            </div>
                        </div>
                      </div>
                      <div className="shrink-0 flex flex-col items-center border-l border-gray-50 pl-3 ml-2 self-start">
                         <div className="grid grid-cols-2 gap-1 mt-1">
                            {['support', 'thanks', 'worry'].map((t) => (
                              <button key={t} onClick={() => handleReaction(log.id, t as any)} className="w-7 h-7 flex items-center justify-center bg-gray-50/50 rounded-lg text-xs hover:bg-orange-50 active:scale-125 transition-all opacity-40 hover:opacity-100">{t === 'support' ? '👍' : t === 'thanks' ? '❤️' : '🥺'}</button>
                            ))}
                            <button onClick={() => { const text = window.prompt('메시지 입력'); if(text) handleReaction(log.id, 'custom', text); }} className="w-7 h-7 flex items-center justify-center bg-gray-50/50 rounded-lg text-[9px] font-black hover:bg-orange-50 active:scale-125 transition-all opacity-40 hover:opacity-100 text-gray-400">+</button>
                         </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Connection Status Widget */}
            <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100 pb-2 mt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800 text-[13px] flex items-center">우리 가족 접속 현황 <span className="ml-1.5 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span></h3>
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">LIVE</span>
              </div>
              <div className="flex space-x-6 overflow-x-auto no-scrollbar pb-2">
                {MOCK_GUARDIANS.map((g) => {
                  const isOnline = g.lastSeen && (new Date().getTime() - new Date(g.lastSeen).getTime() < 1000 * 60 * 60);
                  return (
                    <div key={g.id} className="flex flex-col items-center space-y-2 shrink-0 group">
                      <div className="relative">
                        <div className={`rounded-full p-0.5 transition-all duration-700 ${isOnline ? 'bg-gradient-to-tr from-emerald-400 to-emerald-600 shadow-md ring-2 ring-emerald-50 ring-offset-2' : 'bg-gray-100 opacity-60'}`}>{getGuardianAvatar(g, 'md')}</div>
                        {isOnline && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full shadow-sm"></div>}
                      </div>
                      <div className="text-center"><p className="text-[9px] font-black text-gray-800 leading-none truncate max-w-[60px]">{g.name}</p><p className={`text-[8px] font-bold mt-1 ${isOnline ? 'text-emerald-500' : 'text-gray-400'}`}>{isOnline ? '접속 중' : '부재 중'}</p></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'diary':
        const filteredLogs = logs.filter(log => new Date(log.timestamp).toDateString() === selectedDate.toDateString());
        return (
          <div className="p-5 flex flex-col min-h-full space-y-6">
            <h2 className="text-xl font-bold text-orange-600 px-1">공동 양육 일기</h2>
            <DiarySummary logs={filteredLogs} />
            <div className="space-y-4 flex-1">
              <h3 className="font-bold text-gray-800 flex items-center text-sm px-1">📅 {selectedDate.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })} 기록</h3>
              {filteredLogs.length > 0 ? (
                <div className="space-y-4 border-l-2 border-orange-100 ml-3 pl-6 relative pb-4">
                  {filteredLogs.map((log) => {
                    const g = MOCK_GUARDIANS.find(u => u.id === log.guardianId);
                    const isEditing = editingLogId === log.id;
                    const typeEmoji = { MEAL: '🥘', WALK: '🐕', POOP: '💩', MOOD: '😊', NOTE: '📝', SNACK: '🦴' }[log.type];
                    return (
                      <div key={log.id} className="relative bg-white p-4 rounded-2xl border border-gray-50 shadow-sm group">
                        <div className="absolute -left-[31px] top-6 w-3 h-3 bg-white border-2 border-orange-500 rounded-full z-10"></div>
                        <div className="flex justify-between items-center mb-2"><div className="flex items-center space-x-2">{getGuardianAvatar(g, 'sm')}<span className="text-[11px] font-bold text-gray-700">{g?.name}</span></div><div className="flex space-x-1 opacity-0 group-hover:opacity-100"><button onClick={() => {setEditingLogId(log.id); setEditContent(log.content);}} className="text-[9px] text-blue-500 font-bold">수정</button><button onClick={() => setLogs(prev => prev.filter(l => l.id !== log.id))} className="text-[9px] text-red-500 font-bold">삭제</button></div></div>
                        <div className="flex items-center space-x-3"><span className="text-lg">{typeEmoji}</span>{isEditing ? <textarea className="flex-1 text-sm border border-gray-100 rounded-lg p-2" value={editContent} onChange={(e) => setEditContent(e.target.value)} onBlur={() => {setLogs(prev => prev.map(l => l.id === log.id ? {...l, content: editContent} : l)); setEditingLogId(null);}} autoFocus /> : <p className="text-sm text-gray-600 font-medium leading-relaxed">{log.content}</p>}</div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200"><p className="text-xs text-gray-400 font-bold opacity-50">기록이 없네요! 🐾</p></div>
              )}
            </div>
            <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm pt-4 pb-2 -mx-5 px-5 border-t border-gray-100 z-40"><Calendar selectedDate={selectedDate} onDateSelect={setSelectedDate} logs={logs} guardians={MOCK_GUARDIANS} /></div>
          </div>
        );

      case 'friends':
        return (
          <div className="flex flex-col h-full bg-gray-50 overflow-hidden">
            {/* Friends Tab Header */}
            <div className="bg-white px-5 pt-4 pb-2 border-b border-gray-100 sticky top-0 z-20">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-orange-600">친구들</h2>
                <button 
                  onClick={addMyDailyPost}
                  className="bg-orange-500 text-white px-4 py-2 rounded-full text-[11px] font-black shadow-lg active:scale-95 transition-all"
                >
                  {dog.name} 일상 남기기 +
                </button>
              </div>
              <div className="flex space-x-4">
                <button 
                  onClick={() => setFriendsTabMode('feed')}
                  className={`pb-2 text-[13px] font-black transition-all ${friendsTabMode === 'feed' ? 'text-orange-600 border-b-2 border-orange-500' : 'text-gray-400'}`}
                >
                  일상 피드
                </button>
                <button 
                  onClick={() => setFriendsTabMode('recommend')}
                  className={`pb-2 text-[13px] font-black transition-all ${friendsTabMode === 'recommend' ? 'text-orange-600 border-b-2 border-orange-500' : 'text-gray-400'}`}
                >
                  친구 추천
                </button>
                <button 
                  onClick={() => setFriendsTabMode('map')}
                  className={`pb-2 text-[13px] font-black transition-all ${friendsTabMode === 'map' ? 'text-orange-600 border-b-2 border-orange-500' : 'text-gray-400'}`}
                >
                  주변 찾기
                </button>
              </div>
            </div>

            {/* Friends Tab Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
              {friendsTabMode === 'feed' && (
                <div className="p-5 space-y-6">
                  {/* Feed Filter (All vs Mine) */}
                  <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm w-fit">
                    <button 
                      onClick={() => setFeedFilter('all')}
                      className={`px-4 py-1.5 rounded-xl text-[11px] font-bold transition-all ${feedFilter === 'all' ? 'bg-orange-500 text-white shadow-md' : 'text-gray-400'}`}
                    >
                      {dog.name} 친구들 일상
                    </button>
                    <button 
                      onClick={() => setFeedFilter('mine')}
                      className={`px-4 py-1.5 rounded-xl text-[11px] font-bold transition-all ${feedFilter === 'mine' ? 'bg-orange-500 text-white shadow-md' : 'text-gray-400'}`}
                    >
                      {dog.name} 일상기록
                    </button>
                  </div>

                  {/* Feed List */}
                  <div className="space-y-6 pb-10">
                    {(feedFilter === 'all' ? friendPosts : myFriendPosts).map(post => (
                      <div key={post.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 group animate-in fade-in slide-in-from-bottom-4">
                        <div className="p-4 flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <img src={post.dogPhoto} className="w-10 h-10 rounded-full object-cover border-2 border-orange-50" alt={post.dogName} />
                            <div>
                              <p className="text-[13px] font-black text-gray-800">{post.dogName}</p>
                              <p className="text-[10px] text-gray-400 font-bold">{new Date(post.timestamp).toLocaleDateString()} • {post.location || '우리동네'}</p>
                            </div>
                          </div>
                          {!post.isFriend && post.dogId !== dog.id && (
                             <button className="text-[10px] bg-orange-50 text-orange-600 px-3 py-1 rounded-full font-black">친구 맺기</button>
                          )}
                        </div>
                        <div className="relative aspect-square bg-gray-100 overflow-hidden">
                          <img src={post.mediaUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Post content" />
                          <button 
                            onClick={() => handleFootprint(post.id, feedFilter)}
                            className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md w-14 h-14 rounded-full shadow-2xl flex flex-col items-center justify-center active:scale-125 transition-all hover:bg-orange-50 border border-white"
                          >
                            <span className="text-xl">🐾</span>
                            <span className="text-[10px] font-black text-orange-600">{post.footprints}</span>
                          </button>
                        </div>
                        <div className="p-6">
                          <p className="text-[14px] text-gray-700 leading-relaxed font-medium">
                            {post.content}
                          </p>
                        </div>
                      </div>
                    ))}
                    {(feedFilter === 'mine' && myFriendPosts.length === 0) && (
                      <div className="py-20 text-center flex flex-col items-center space-y-4 opacity-40">
                        <span className="text-5xl">📸</span>
                        <p className="text-[13px] font-black text-gray-400">아직 남긴 기록이 없어요.<br/>{dog.name}의 첫 일상을 남겨보세요!</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {friendsTabMode === 'recommend' && (
                <div className="p-5 space-y-6 pb-20">
                  <div className="bg-orange-50 p-6 rounded-[2.5rem] border border-orange-100">
                    <p className="text-[11px] font-black text-orange-600 uppercase tracking-widest mb-2">쓰담 AI 추천</p>
                    <h3 className="text-lg font-bold text-gray-800 leading-tight">{dog.name}와 견종, 나이,<br/>관심사가 비슷한 친구들이에요!</h3>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {MOCK_RECOMMENDED_DOGS.map(rd => (
                      <div key={rd.id} className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm flex items-center space-x-4">
                        <img src={rd.photo} className="w-20 h-20 rounded-[1.5rem] object-cover border border-gray-50 shadow-sm" alt={rd.name} />
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-black text-gray-800">{rd.name}</p>
                          <p className="text-[11px] text-gray-400 font-bold">{rd.breed} • {rd.age} • {rd.location}</p>
                          <div className="mt-2 inline-block bg-orange-50 text-orange-600 px-3 py-1 rounded-lg text-[10px] font-black">
                             {rd.reason}
                          </div>
                        </div>
                        <button 
                          onClick={() => showFeedback(`${rd.name}에게 친구 신청을 보냈어요!`)}
                          className="bg-gray-900 text-white w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg active:scale-90 transition-all"
                        >
                          +
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {friendsTabMode === 'map' && (
                <div className="flex flex-col h-full space-y-4 p-5">
                   <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm mb-2">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-1">내 주변 쓰담 회원</p>
                     <h3 className="text-[14px] font-bold text-gray-800">송파구 문정동 근처에<br/><span className="text-orange-600">4마리</span>의 강아지 친구가 있어요!</h3>
                   </div>

                   <div className="flex-1 relative bg-gray-200 rounded-[3rem] overflow-hidden border-4 border-white shadow-inner min-h-[400px]">
                      {/* Mock Map Background */}
                      <div className="absolute inset-0 bg-cover bg-center opacity-40 grayscale" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800")' }}></div>
                      
                      {/* Nearby Members Markers */}
                      {MOCK_NEARBY_MEMBERS.map(member => (
                        <div 
                          key={member.id} 
                          className="absolute transition-all hover:scale-110 cursor-pointer group"
                          style={{ top: `${(member.lat - 37.485) * 6000}%`, left: `${(member.lng - 127.120) * 8000}%` }}
                          onClick={() => !member.isFriend && showFeedback(`${member.name}님에게 친구 신청!`)}
                        >
                          <div className={`relative p-1.5 rounded-full shadow-2xl border-2 border-white transition-colors duration-500 ${member.isFriend ? 'bg-orange-500' : 'bg-white'}`}>
                            {member.isFriend ? (
                               <img src={member.dogPhoto} className="w-10 h-10 rounded-full object-cover" alt={member.dogName} />
                            ) : (
                               <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-xl">
                                  👤
                               </div>
                            )}
                            {/* Member Label */}
                            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl shadow-xl border border-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                              <p className="text-[10px] font-black text-gray-800">{member.dogName} ({member.name})</p>
                              <p className="text-[8px] text-orange-500 font-bold">{member.isFriend ? '우리는 친구!' : '친구 맺기'}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {/* User Location Marker */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                         <div className="relative">
                            <div className="w-12 h-12 bg-orange-500/20 rounded-full animate-ping absolute -top-1 -left-1"></div>
                            <div className="w-10 h-10 bg-orange-600 rounded-full border-4 border-white shadow-xl flex items-center justify-center text-white font-black text-xs relative z-10">나</div>
                         </div>
                      </div>

                      <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-5 rounded-[2rem] shadow-2xl border border-white">
                        <div className="flex items-start space-x-3">
                           <div className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center text-lg">💡</div>
                           <div>
                              <p className="text-[11px] font-black text-gray-800 leading-tight">위치 정보 공개에 동의한 회원만 표시됩니다.</p>
                              <p className="text-[9px] text-gray-400 mt-1 font-bold">친구를 맺으면 강아지 사진이 지도로 변해요!</p>
                           </div>
                        </div>
                      </div>
                   </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'map':
        return (
          <div className="p-5 space-y-6">
            <h2 className="text-xl font-bold text-orange-600">케어숍</h2>
            <div className="grid grid-cols-1 gap-4">
              {MOCK_STORES.map(store => (
                <div key={store.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
                   <div>
                      <p className="font-bold text-gray-800">{store.name}</p>
                      <p className="text-xs text-gray-400">{store.address}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-orange-500 font-black">⭐ {store.rating}</p>
                      {store.pointsApplicable && <span className="text-[8px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-bold">포인트 가능</span>}
                   </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'community':
        return (
          <div className="p-5 space-y-6">
            <h2 className="text-xl font-bold text-orange-600">놀이터</h2>
            <div className="space-y-4">
               {MOCK_POSTS.map(post => {
                  const author = MOCK_GUARDIANS.find(g => g.id === post.authorId);
                  return (
                    <div key={post.id} className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm space-y-3">
                       <div className="flex items-center space-x-2">
                          {getGuardianAvatar(author, 'sm')}
                          <span className="text-[11px] font-bold">{author?.name}</span>
                       </div>
                       <p className="text-sm text-gray-700 leading-relaxed">{post.content}</p>
                       {post.image && <img src={post.image} className="w-full h-40 object-cover rounded-2xl" />}
                       <div className="flex space-x-4 text-[10px] font-bold text-gray-400">
                          <span>❤️ {post.likes}</span>
                          <span>💬 {post.comments}</span>
                       </div>
                    </div>
                  )
               })}
            </div>
          </div>
        );

      case 'my':
        return (
          <div className="p-5 space-y-8 text-center">
            <div className="relative inline-block mt-4">{getGuardianAvatar(currentUser, 'lg')}<div className="absolute -bottom-1 -right-1 w-8 h-8 bg-orange-500 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-black text-white shadow-lg">Lv.{currentUser.level}</div><h3 className="mt-5 font-bold text-xl text-gray-800">{currentUser.name} <span className="text-orange-500 text-xs font-bold bg-orange-50 px-2 py-0.5 rounded-full ml-1">나</span></h3></div>
            <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100 text-left"><h4 className="font-bold text-gray-800 text-[13px] mb-5 border-b border-gray-50 pb-3 flex items-center">우리 가족 양육팀 <span className="ml-2 text-[9px] text-orange-400">Total {MOCK_GUARDIANS.length}명</span></h4><div className="space-y-6">{MOCK_GUARDIANS.map(g => (<div key={g.id} className="flex items-center justify-between group"><div className="flex items-center space-x-3">{getGuardianAvatar(g, 'md')}<div><p className="text-[13px] font-bold text-gray-700">{g.name}</p><p className="text-[10px] text-gray-400 font-bold">{g.relation}</p></div></div><div className="text-right"><span className="text-orange-500 font-black text-[12px]">{g.points}P</span></div></div>))}</div></div>
          </div>
        );
      
      default:
        return <div className="p-10 text-center text-gray-400">준비 중인 화면입니다 👋</div>;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} dogName={dog.name}>
      {renderContent()}
    </Layout>
  );
};

export default App;
