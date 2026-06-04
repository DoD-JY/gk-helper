// 院校分级数据（来源：院校分级篇正文）
// 注意：以下数据仅供填报参考，具体录取情况请以各省考试院公布为准

export interface SchoolTier {
  name: string;
  schools: string[];
}

// 985院校（39所）
export const tier985: SchoolTier[] = [
  { name: '北京（8所）', schools: ['清华大学', '北京大学', '中国人民大学', '北京航空航天大学', '北京理工大学', '中国农业大学', '北京师范大学', '中央民族大学'] },
  { name: '上海（4所）', schools: ['复旦大学', '上海交通大学', '同济大学', '华东师范大学'] },
  { name: '天津（2所）', schools: ['南开大学', '天津大学'] },
  { name: '江苏（2所）', schools: ['南京大学', '东南大学'] },
  { name: '浙江（1所）', schools: ['浙江大学'] },
  { name: '安徽（1所）', schools: ['中国科学技术大学'] },
  { name: '福建（1所）', schools: ['厦门大学'] },
  { name: '山东（2所）', schools: ['山东大学', '中国海洋大学'] },
  { name: '湖北（2所）', schools: ['武汉大学', '华中科技大学'] },
  { name: '湖南（3所）', schools: ['中南大学', '湖南大学', '国防科技大学'] },
  { name: '广东（2所）', schools: ['中山大学', '华南理工大学'] },
  { name: '四川（2所）', schools: ['四川大学', '电子科技大学'] },
  { name: '重庆（1所）', schools: ['重庆大学'] },
  { name: '陕西（3所）', schools: ['西安交通大学', '西北工业大学', '西北农林科技大学'] },
  { name: '黑龙江（1所）', schools: ['哈尔滨工业大学'] },
  { name: '吉林（1所）', schools: ['吉林大学'] },
  { name: '辽宁（2所）', schools: ['大连理工大学', '东北大学'] },
  { name: '甘肃（1所）', schools: ['兰州大学'] },
  { name: '其他（1所）', schools: ['中国矿业大学（北京）——注：中国矿业大学徐州校区也为211'] },
];

// 行业特色强校（非985但王牌专业顶尖）
export const featuredSchools = [
  { name: '北京邮电大学', field: '通信/计算机', feature: '通信行业"黄埔军校"，华为校招重点院校' },
  { name: '南京邮电大学', field: '通信/电子', feature: '双一流，通信工程全国前10，华为校招目标院校' },
  { name: '重庆邮电大学', field: '通信/IT', feature: '信息通信领域强校，三大运营商招聘重点' },
  { name: '华北电力大学', field: '电力/能源', feature: '电力系统"嫡系部队"，国家电网校招量最大' },
  { name: '东北电力大学', field: '电力/能源', feature: '电力系统传统强校，国家电网招聘大户' },
  { name: '上海电力大学', field: '电力/能源', feature: '上海地理位置+电力背景，就业优势明显' },
  { name: '西南政法大学', field: '法学', feature: '法学界"五院四系"之一，法学A级学科' },
  { name: '华东政法大学', field: '法学', feature: '法学"五院"之一，长三角法律界校友资源丰富' },
  { name: '东北财经大学', field: '财经', feature: '财经类"老八校"，A类应用经济学' },
  { name: '江西财经大学', field: '财经', feature: '财政部原直属，财经底蕴深厚' },
  { name: '首都经济贸易大学', field: '财经', feature: '北京位置优势，经管类专业实力过硬' },
  { name: '北京语言大学', field: '外语', feature: '对外汉语教学"头牌"，语言学实力突出' },
  { name: '广东外语外贸大学', field: '外语/外贸', feature: '华南地区外语外贸第一，就业率领先' },
  { name: '南方科技大学', field: '理工', feature: '双一流新贵，国际化办学，深圳就业优势' },
  { name: '南京医科大学', field: '医学', feature: '双一流，公共卫生与预防医学A+' },
  { name: '首都医科大学', field: '医学', feature: '临床医学实力突出，北京医疗资源得天独厚' },
  { name: '中国美术学院', field: '艺术', feature: '双一流，美术学A+' },
  { name: '南京邮电大学（双一流）', field: '电子信息', feature: '电子科学与技术双一流学科' },
  { name: '成都理工大学', field: '地质/能源', feature: '双一流新增，地质资源与地质工程一流学科' },
];

// 宝藏院校（一本边缘性价比之选）
export const treasureSchools = [
  { name: '山西大学', feature: '双一流新增，分数线未完全反应实力' },
  { name: '湘潭大学', feature: '双一流，数学学科全国前列，分数线亲民' },
  { name: '河南大学', feature: '双一流，郑州/开封双校区，性价比标杆' },
  { name: '河北工业大学', feature: '211但地处天津，性价比被低估' },
  { name: '福州大学', feature: '211，福建省内认可度高，分数线在211中偏低' },
  { name: '南京信息工程大学', feature: '双一流，气象学全国第一，地理优势+强势学科' },
  { name: '上海海洋大学', feature: '双一流，水产一级学科，上海地理位置加成' },
  { name: '南京林业大学', feature: '双一流，林业工程A+，分数线亲民' },
];

// 根据位次判断院校层次
export function getTierByRank(rank: number, totalCandidates: number = 450000) {
  const pct = rank / totalCandidates; // 全省前百分之几

  if (pct <= 0.01) return { tier: '顶尖985', description: '清北复交浙南科人，全国前1%！', level: 0 };
  if (pct <= 0.03) return { tier: '中上游985', description: '多数985院校都在射程范围内', level: 1 };
  if (pct <= 0.05) return { tier: '中下游985/顶尖211', description: '可冲刺部分985，稳妥选择顶尖211', level: 2 };
  if (pct <= 0.10) return { tier: '中游211/省重点', description: '211主力区间，可关注行业特色强校', level: 3 };
  if (pct <= 0.20) return { tier: '中下游211/一本', description: '省属重点+部分211，性价比最高区间', level: 4 };
  if (pct <= 0.40) return { tier: '公办一本/二本', description: '省属重点+公办本科，关注宝藏院校', level: 5 };
  if (pct <= 0.60) return { tier: '公办二本/民办本科', description: '公办本科主力区间，关注行业特色专业', level: 6 };
  return { tier: '民办/专科', description: '保底区间，优先考虑公办专科+专升本路径', level: 7 };
}