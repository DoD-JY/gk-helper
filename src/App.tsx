import React, { useState, useMemo } from 'react';
import { tier985, featuredSchools, treasureSchools, getTierByRank } from './data/schools';

// ── 专业大类数据 ──
const majorCategories = [
  { id: 'math', label: '数学/统计/物理', desc: '大量数学推导，适合理科思维强的同学' },
  { id: 'cs', label: '计算机/电子信息', desc: '热门方向，就业好但竞争激烈' },
  { id: 'medical', label: '医学/药学', desc: '时间长（5-8年），但职业稳定' },
  { id: 'law', label: '法学/政治', desc: '大量背诵记忆，考证压力大' },
  { id: 'finance', label: '经管/金融', desc: '热门方向，对学校层次要求高' },
  { id: 'engineer', label: '机械/土木/化工', desc: '传统工科，就业稳定但起薪偏低' },
  { id: 'bio', label: '生物/化学/环境', desc: '就业方向偏科研，建议读到博士' },
  { id: 'literature', label: '中文/新闻/外语', desc: '人文方向，适合表达能力强的同学' },
  { id: 'education', label: '教育/师范', desc: '职业稳定，假期多' },
  { id: 'art', label: '艺术/设计/传媒', desc: '创意方向，技能驱动型' },
  { id: 'agri', label: '农林/地质/矿业', desc: '冷门方向，竞争小但就业面窄' },
  { id: 'military', label: '军校/警校/国防', desc: '包分配/铁饭碗，体检政审严格' },
];

const provinces = ['北京', '上海', '天津', '重庆', '河北', '山西', '辽宁', '吉林', '黑龙江',
  '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南', '湖北', '湖南',
  '广东', '海南', '四川', '贵州', '云南', '陕西', '甘肃', '青海', '台湾',
  '内蒙古', '广西', '西藏', '宁夏', '新疆'];

const cityOptions = ['北上广深', '新一线（杭州/成都/武汉/南京等）', '省会城市', '二三线城市', '离家近的城市', '不挑，有学上就行'];

// ── 主组件 ──
export default function App() {
  const [step, setStep] = useState(0);
  const [province, setProvince] = useState('');
  const [category, setCategory] = useState<'物理' | '历史' | ''>('');
  const [score, setScore] = useState('');
  const [rank, setRank] = useState('');
  const [batchLine, setBatchLine] = useState('');
  const [slotCount, setSlotCount] = useState('96');
  const [cityPref, setCityPref] = useState<string[]>([]);
  const [excludedMajors, setExcludedMajors] = useState<string[]>([]);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const rankNum = Number(rank) || 0;
  const batchLineNum = Number(batchLine) || 0;

  // 计算冲稳保区间
  const zones = useMemo(() => {
    if (!rankNum) return null;
    return {
      chong: { min: Math.round(rankNum * 0.90), max: Math.round(rankNum * 0.95) },
      wen: { min: Math.round(rankNum * 0.97), max: Math.round(rankNum * 1.03) },
      bao: { min: Math.round(rankNum * 1.15), max: Math.round(rankNum * 1.30) },
    };
  }, [rankNum]);

  // 院校层次匹配
  const tierInfo = useMemo(() => {
    if (!rankNum) return null;
    return getTierByRank(rankNum);
  }, [rankNum]);

  // 志愿分配
  const slotPlan = useMemo(() => {
    const total = Number(slotCount) || 96;
    return {
      chong: Math.round(total * 0.4),
      wen: Math.round(total * 0.4),
      bao: total - Math.round(total * 0.4) - Math.round(total * 0.4),
    };
  }, [slotCount]);

  // 防踩坑清单
  const checklist = [
    { id: 'c1', label: '保底够低——最后5-10个志愿位次比你低20%-30%？' },
    { id: 'c2', label: '服从调剂——冲和稳的学校全部勾了"服从调剂"？' },
    { id: 'c3', label: '招生章程——去阳光高考网查了每所学校的单科/体检要求？' },
    { id: 'c4', label: '梯度合理——志愿位次没有全部集中在2,000名以内？' },
    { id: 'c5', label: '填满志愿——所有空位都填了？每个空都是多一次机会' },
    { id: 'c6', label: '专业梯度——同一学校6个专业不是全填同一个热门专业' },
    { id: 'c7', label: '位次优先——确保用的是位次，不是分数直接对比' },
    { id: 'c8', label: '已提交截图——退出系统重新登录，确认提交成功+截图' },
    { id: 'c9', label: '多重备份——导出PDF+手机拍照+云盘，至少3份' },
  ];

  const toggleCity = (city: string) => {
    setCityPref(prev => prev.includes(city) ? prev.filter(c => c !== city) : [...prev, city]);
  };

  const toggleMajor = (id: string) => {
    setExcludedMajors(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);
  };

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const progressLabels = ['开始', '信息', '位次分析', '选学校', '选专业', '排志愿', '报告'];
  const totalSteps = progressLabels.length - 1;

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const goStep = (s: number) => { setStep(s); scrollToTop(); };

  // ── 渲染各步骤 ──
  const renderStep = () => {
    switch (step) {
      case 0: return renderWelcome();
      case 1: return renderInput();
      case 2: return renderZone();
      case 3: return renderSchool();
      case 4: return renderMajor();
      case 5: return renderPlan();
      case 6: return renderReport();
      default: return null;
    }
  };

  // ── 欢迎页 ──
  const renderWelcome = () => (
    <div className="max-w-lg mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">高考志愿填报助手</h1>
        <p className="text-gray-600 text-lg leading-relaxed">
          跟着指引，一步一步来。先搞清楚"我在哪"，再决定"往哪去"。
        </p>
      </div>

      <div className="space-y-3 mb-8">
        {[
          { icon: '📊', title: '输入分数和位次', desc: '自动计算冲稳保区间' },
          { icon: '🏫', title: '匹配适合的院校层次', desc: '985/211/特色强校一目了然' },
          { icon: '🎯', title: '排除不喜欢的专业', desc: '划掉不想学的，剩下的就是方向' },
          { icon: '✅', title: '生成志愿方案+防坑检查', desc: '照着填，截图保存即可' },
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <span className="text-xl mt-0.5">{item.icon}</span>
            <div>
              <div className="font-medium text-gray-900">{item.title}</div>
              <div className="text-sm text-gray-500">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 text-sm text-amber-800">
        <strong>⚠️ 重要说明：</strong>本工具提供的是填报策略参考和数据分析建议，
        不替代官方数据和专业填报服务。最终志愿请以各省教育考试院公布的数据为准。
      </div>

      <button onClick={() => goStep(1)} className="w-full py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
        开始填报 →
      </button>
    </div>
  );

  // ── 第1步：输入信息 ──
  const renderInput = () => (
    <div className="max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-gray-900 mb-6">填写你的基本信息</h2>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">所在省份</label>
          <select value={province} onChange={e => setProvince(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-gray-900 focus:border-transparent">
            <option value="">请选择省份</option>
            {provinces.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">选科类别</label>
          <div className="flex gap-3">
            {(['物理', '历史'] as const).map(c => (
              <button key={c} onClick={() => setCategory(c)} className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-colors ${category === c ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'}`}>{c}类</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">高考分数</label>
            <input type="number" value={score} onChange={e => setScore(e.target.value)} placeholder="如: 580" className="w-full p-2.5 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-gray-900 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">全省位次</label>
            <input type="number" value={rank} onChange={e => setRank(e.target.value)} placeholder="如: 30000" className="w-full p-2.5 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-gray-900 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">本科线</label>
            <input type="number" value={batchLine} onChange={e => setBatchLine(e.target.value)} placeholder="如: 436" className="w-full p-2.5 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-gray-900 focus:border-transparent" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">本省志愿总数</label>
          <input type="number" value={slotCount} onChange={e => setSlotCount(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-gray-900 focus:border-transparent" />
          <p className="text-xs text-gray-400 mt-1">多数省份96个，浙江80个，辽宁112个，河北96个</p>
        </div>
      </div>

      <button onClick={() => goStep(2)} disabled={!province || !category || !score || !rank || !batchLine} className="w-full mt-8 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">
        分析我的位次 →
      </button>
    </div>
  );

  // ── 第2步：位次分析 ──
  const renderZone = () => {
    if (!zones || !tierInfo) return null;
    const gap = score && batchLine ? Number(score) - batchLineNum : 0;

    return (
      <div className="max-w-lg mx-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-2">你的位次分析</h2>
        <p className="text-gray-500 text-sm mb-6">基于位次法，自动计算你的冲稳保区间</p>

        {/* 基本信息卡片 */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-gray-500">分数</span><div className="text-xl font-bold text-gray-900">{score}分</div></div>
            <div><span className="text-gray-500">位次</span><div className="text-xl font-bold text-gray-900">{rankNum.toLocaleString()}名</div></div>
            <div><span className="text-gray-500">超本科线</span><div className="text-lg font-semibold text-gray-900">{gap > 0 ? `+${gap}分` : `${gap}分`}</div></div>
            <div><span className="text-gray-500">院校层次</span><div className="text-lg font-semibold text-amber-600">{tierInfo.tier}</div></div>
          </div>
        </div>

        {/* 冲稳保区间 */}
        <div className="space-y-3 mb-6">
          <div className="result-card border-l-3 pl-4 py-3 bg-red-50 rounded-lg" style={{ borderLeftColor: '#ef4444' }}>
            <div className="text-sm font-semibold text-red-600 mb-1">🚀 冲 — 位次上浮5%~10%</div>
            <div className="text-lg font-bold text-gray-900">{zones.chong.min.toLocaleString()}名 ~ {zones.chong.max.toLocaleString()}名</div>
            <div className="text-xs text-gray-500 mt-1">比你现在高一点，填了不一定录，但不填一定不录</div>
          </div>

          <div className="result-card pl-4 py-3 bg-green-50 rounded-lg" style={{ borderLeftColor: '#22c55e' }}>
            <div className="text-sm font-semibold text-green-600 mb-1">🎯 稳 — 位次±3%</div>
            <div className="text-lg font-bold text-gray-900">{zones.wen.min.toLocaleString()}名 ~ {zones.wen.max.toLocaleString()}名</div>
            <div className="text-xs text-gray-500 mt-1">十拿九稳的核心区间，重点关注</div>
          </div>

          <div className="result-card pl-4 py-3 bg-blue-50 rounded-lg" style={{ borderLeftColor: '#3b82f6' }}>
            <div className="text-sm font-semibold text-blue-600 mb-1">🛡️ 保 — 位次下浮15%~30%</div>
            <div className="text-lg font-bold text-gray-900">{zones.bao.min.toLocaleString()}名 ~ {zones.bao.max.toLocaleString()}名</div>
            <div className="text-xs text-gray-500 mt-1">打死也有学上，最后5个志愿务必在范围下限之外</div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700 mb-6">
          💡 记住：用位次，不用分数。每年的试题难度和分数线都不同，位次是唯一稳定的参照物。
        </div>

        <button onClick={() => goStep(3)} className="w-full py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
          看看我能报什么学校 →
        </button>
      </div>
    );
  };

  // ── 第3步：选学校 ──
  const renderSchool = () => {
    if (!tierInfo) return null;
    const level = tierInfo.level;

    return (
      <div className="max-w-lg mx-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-2">院校层次匹配</h2>
        <p className="text-gray-500 text-sm mb-6">根据你的位次，参考以下院校层次</p>

        {/* 层次指示器 */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="text-sm text-gray-500 mb-1">你的位次对应的院校层次</div>
          <div className="text-xl font-bold text-amber-600">{tierInfo.tier}</div>
          <div className="text-sm text-gray-600 mt-1">{tierInfo.description}</div>
        </div>

        {/* 城市偏好 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">你愿意去哪些城市？（可多选）</label>
          <div className="flex flex-wrap gap-2">
            {cityOptions.map(c => (
              <button key={c} onClick={() => toggleCity(c)} className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${cityPref.includes(c) ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'}`}>{c}</button>
            ))}
          </div>
        </div>

        {/* 985列表（条件展示） */}
        {level <= 3 && (
          <details className="mb-4 group">
            <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2 hover:text-gray-900">📌 985院校（39所）— 点击展开</summary>
            <div className="space-y-2 mt-2">
              {tier985.map((group, i) => (
                <div key={i}>
                  <div className="text-xs text-gray-400 font-medium">{group.name}</div>
                  <div className="text-sm text-gray-700 flex flex-wrap gap-1">
                    {group.schools.map((s, j) => (
                      <span key={j} className="inline-block bg-white border border-gray-200 rounded px-1.5 py-0.5 text-xs">{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </details>
        )}

        {/* 行业特色强校 */}
        <div className="mb-4">
          <div className="text-sm font-medium text-gray-700 mb-2">⭐ 行业特色强校（非985但王牌专业顶尖）</div>
          <div className="space-y-2">
            {featuredSchools.slice(0, 8).map((s, i) => (
              <div key={i} className="flex justify-between items-center bg-white border border-gray-200 rounded-lg px-3 py-2">
                <div>
                  <span className="text-sm font-medium text-gray-900">{s.name}</span>
                  <span className="text-xs text-gray-400 ml-2">{s.field}</span>
                </div>
                <span className="text-xs text-gray-500">{s.feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 宝藏院校 */}
        <div className="mb-6">
          <div className="text-sm font-medium text-gray-700 mb-2">💎 宝藏院校（一本边缘性价比之选）</div>
          <div className="flex flex-wrap gap-1.5">
            {treasureSchools.map((s, i) => (
              <span key={i} className="inline-block bg-amber-50 border border-amber-200 rounded px-2 py-1 text-xs text-amber-800">{s.name}</span>
            ))}
          </div>
        </div>

        <button onClick={() => goStep(4)} className="w-full py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
          选择专业方向 →
        </button>
      </div>
    );
  };

  // ── 第4步：选专业 ──
  const renderMajor = () => {
    const remaining = majorCategories.filter(m => !excludedMajors.includes(m.id));

    return (
      <div className="max-w-lg mx-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-2">排除你不喜欢的专业</h2>
        <p className="text-gray-500 text-sm mb-6">点掉不想学的，剩下的就是方向</p>

        <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-700 mb-4">
          💡 不知道喜欢什么？用排除法——划掉你肯定不学的，剩下的在圈里选。
        </div>

        <div className="space-y-2 mb-6">
          {majorCategories.map(m => {
            const isExcluded = excludedMajors.includes(m.id);
            return (
              <button key={m.id} onClick={() => toggleMajor(m.id)} className={`w-full text-left p-3 rounded-lg border transition-colors ${isExcluded ? 'bg-gray-50 border-gray-200 opacity-60' : 'bg-white border-gray-300 hover:border-gray-400'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className={`text-sm font-medium ${isExcluded ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{m.label}</span>
                    <span className={`text-xs ml-2 ${isExcluded ? 'text-gray-300' : 'text-gray-400'}`}>{m.desc}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded ${isExcluded ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>{isExcluded ? '已排除' : '可选'}</span>
                </div>
              </button>
            );
          })}
        </div>

        {remaining.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="text-sm font-medium text-green-800 mb-1">你的可选专业方向（{remaining.length}个）</div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {remaining.map(m => (
                <span key={m.id} className="inline-block bg-white border border-green-300 rounded px-2 py-1 text-xs text-green-700">{m.label}</span>
              ))}
            </div>
          </div>
        )}

        <button onClick={() => goStep(5)} disabled={remaining.length === 0} className="w-full py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">
          生成志愿方案 →
        </button>
      </div>
    );
  };

  // ── 第5步：排志愿 + 防踩坑 ──
  const renderPlan = () => (
    <div className="max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-gray-900 mb-6">志愿分配 + 防踩坑检查</h2>

      {/* 志愿分配 */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="text-sm font-medium text-gray-700 mb-3">你的志愿分配方案（共{slotCount}个志愿）</div>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-red-500 font-bold text-sm w-12">🚀 冲</span>
            <div className="flex-1 bg-gray-200 rounded-full h-6">
              <div className="bg-red-400 h-6 rounded-full flex items-center justify-center text-xs text-white font-medium" style={{ width: `${(slotPlan.chong / Number(slotCount)) * 100}%` }}>{slotPlan.chong}个</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-green-500 font-bold text-sm w-12">🎯 稳</span>
            <div className="flex-1 bg-gray-200 rounded-full h-6">
              <div className="bg-green-400 h-6 rounded-full flex items-center justify-center text-xs text-white font-medium" style={{ width: `${(slotPlan.wen / Number(slotCount)) * 100}%` }}>{slotPlan.wen}个</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-blue-500 font-bold text-sm w-12">🛡️ 保</span>
            <div className="flex-1 bg-gray-200 rounded-full h-6">
              <div className="bg-blue-400 h-6 rounded-full flex items-center justify-center text-xs text-white font-medium" style={{ width: `${(slotPlan.bao / Number(slotCount)) * 100}%` }}>{slotPlan.bao}个</div>
            </div>
          </div>
        </div>
      </div>

      {/* 防踩坑清单 */}
      <div className="mb-6">
        <div className="text-sm font-medium text-gray-700 mb-3">✅ 防踩坑检查清单 — 逐条勾选</div>
        <div className="space-y-2">
          {checklist.map(item => (
            <label key={item.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input type="checkbox" checked={!!checkedItems[item.id]} onChange={() => toggleCheck(item.id)} className="mt-0.5 h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900" />
              <span className={`text-sm ${checkedItems[item.id] ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      <button onClick={() => goStep(6)} className="w-full py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
        生成最终报告 →
      </button>
    </div>
  );

  // ── 第6步：最终报告 ──
  const renderReport = () => (
    <div className="max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-gray-900 mb-2">你的填报报告</h2>
      <p className="text-gray-500 text-sm mb-6">截图保存，照着填就行</p>

      {/* 基本信息 */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><span className="text-gray-400">省份</span><div className="font-medium text-gray-900">{province}</div></div>
          <div><span className="text-gray-400">类别</span><div className="font-medium text-gray-900">{category}类</div></div>
          <div><span className="text-gray-400">分数</span><div className="font-medium text-gray-900">{score}分</div></div>
          <div><span className="text-gray-400">位次</span><div className="font-medium text-gray-900">{rankNum.toLocaleString()}名</div></div>
          <div><span className="text-gray-400">超本科线</span><div className="font-medium text-gray-900">{Number(score) - batchLineNum > 0 ? `+${Number(score) - batchLineNum}分` : `${Number(score) - batchLineNum}分`}</div></div>
          <div><span className="text-gray-400">院校层次</span><div className="font-medium text-amber-600">{tierInfo?.tier}</div></div>
        </div>
      </div>

      {/* 冲稳保区间 */}
      {zones && (
        <div className="space-y-2 mb-4">
          <div className="bg-red-50 rounded-lg p-3 border-l-4 border-red-400">
            <div className="text-xs text-red-600 font-medium">🚀 冲</div>
            <div className="font-bold text-gray-900">{zones.chong.min.toLocaleString()} ~ {zones.chong.max.toLocaleString()}名</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 border-l-4 border-green-400">
            <div className="text-xs text-green-600 font-medium">🎯 稳</div>
            <div className="font-bold text-gray-900">{zones.wen.min.toLocaleString()} ~ {zones.wen.max.toLocaleString()}名</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-400">
            <div className="text-xs text-blue-600 font-medium">🛡️ 保</div>
            <div className="font-bold text-gray-900">{zones.bao.min.toLocaleString()} ~ {zones.bao.max.toLocaleString()}名</div>
          </div>
        </div>
      )}

      {/* 志愿分配 */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="text-sm font-medium text-gray-700 mb-2">志愿分配（{slotCount}个）</div>
        <div className="text-sm">
          🔴 冲：{slotPlan.chong}个 | 🟢 稳：{slotPlan.wen}个 | 🔵 保：{slotPlan.bao}个
        </div>
      </div>

      {/* 可选专业 */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="text-sm font-medium text-gray-700 mb-2">可选专业方向</div>
        <div className="flex flex-wrap gap-1.5">
          {majorCategories.filter(m => !excludedMajors.includes(m.id)).map(m => (
            <span key={m.id} className="inline-block bg-white border border-gray-300 rounded px-2 py-1 text-xs text-gray-700">{m.label}</span>
          ))}
        </div>
      </div>

      {/* Checklist状态 */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="text-sm font-medium text-gray-700 mb-2">防踩坑检查</div>
        <div className="text-sm">{Object.keys(checkedItems).filter(k => checkedItems[k]).length} / {checklist.length} 项已通过</div>
        {Object.keys(checkedItems).filter(k => !checkedItems[k]).length > 0 && (
          <div className="text-xs text-red-500 mt-1">⚠️ 还有{Object.keys(checkedItems).filter(k => !checkedItems[k]).length}项未勾选，建议全部检查后再提交</div>
        )}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-xs text-amber-700 mb-6">
        ⚠️ 以上建议仅供参考。填报前请务必前往阳光高考网(chsi.com.cn)核实各校招生章程，
        并以各省教育考试院公布的最新录取数据为准。建议结合官方"阳光志愿"系统使用。
      </div>

      <div className="flex gap-3 no-print">
        <button onClick={() => window.print()} className="flex-1 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm">
          🖨️ 打印/保存为PDF
        </button>
        <button onClick={() => goStep(0)} className="flex-1 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm">
          重新开始
        </button>
      </div>
    </div>
  );

  // ── 整体布局 ──
  return (
    <div className="min-h-screen bg-white">
      {/* 顶部进度条 */}
      {step > 0 && (
        <div className="sticky top-0 bg-white border-b border-gray-100 z-10 no-print">
          <div className="max-w-lg mx-auto px-4 py-3">
            <div className="flex items-center">
              {progressLabels.slice(0, totalSteps + 1).map((label, i) => {
                if (i === 0) return null; // 跳过"开始"
                const isActive = step === i;
                const isDone = step > i;
                return (
                  <React.Fragment key={i}>
                    {i > 1 && <div className={`step-line ${isDone || isActive ? 'bg-gray-900' : 'bg-gray-200'}`} />}
                    <button onClick={() => i < step && goStep(i)} className={`step-dot text-xs ${isActive ? 'bg-gray-900 text-white' : isDone ? 'bg-gray-900 text-white cursor-pointer' : 'bg-gray-200 text-gray-400'}`}>
                      {isDone ? '✓' : i}
                    </button>
                  </React.Fragment>
                );
              })}
            </div>
            <div className="text-center text-xs text-gray-400 mt-1 mt-1">{progressLabels[step]}（{step}/{totalSteps}）</div>
          </div>
        </div>
      )}

      {/* 主体内容 */}
      <div className="px-4 py-6 sm:py-10">
        {renderStep()}
      </div>

      {/* 底部 */}
      {step > 0 && step < totalSteps && (
        <div className="text-center py-6 no-print">
          <button onClick={() => goStep(step - 1)} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
            ← 上一步
          </button>
        </div>
      )}
    </div>
  );
}