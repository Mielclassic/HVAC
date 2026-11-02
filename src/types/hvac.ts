// 고등학교 직업계고 전문교과 II [27. 냉동 공조 설계] & [28. 냉동 공조 유지 보수 관리] 표준 교육과정 기반 도메인 체계
export type HVACDomain =
  | '냉동 사이클 및 열역학 해석'
  | '냉난방 및 냉동·냉장 부하 계산'
  | '공조 프로세스 및 습공기 선도'
  | '공조·냉동 설비 운영 및 점검 관리'
  | '보일러 및 증기·배관 설비 운영'
  | '안전관리·설계도서 및 자재 관리';

export interface ThermodynamicCycleData {
  refrigerant: string; // e.g. 'R-134a', 'R-410A', 'R-717'
  pevap: number;       // 증발압력 (MPa abs)
  pcond: number;       // 응축압력 (MPa abs)
  h1: number;          // 압축기 흡입 엔탈피 (kJ/kg)
  h2: number;          // 압축기 토출 엔탈피 (kJ/kg)
  h3: number;          // 응축기 출구 엔탈피 (kJ/kg)
  h4: number;          // 팽창밸브 출구 엔탈피 (kJ/kg, h4 = h3)
  qe: number;          // 단위 냉동효과 (h1 - h4)
  aw: number;          // 압축소요일 (h2 - h1)
  cop: number;         // 성적계수 (qe / aw)
  massFlowRate?: number; // 냉매순환량 G (kg/s 또는 kg/h)
  coolingCapacity?: number; // 냉동능력 R = G * qe (kW 또는 kcal/h)
}

export interface CotStep {
  step: 1 | 2 | 3 | 4;
  title: string;       // e.g. "1단계: 열역학적 변수 유효성 검증"
  formula?: string;    // e.g. "h2 > h1 > h4 확인: 430 > 390 > 240 kJ/kg"
  calculation: string; // e.g. "압축과정 및 팽창과정의 물리적 대소 관계가 성립함"
  result: string;      // e.g. "유효 판정 통과"
}

export interface Question {
  id: string;
  domain: HVACDomain;
  subject?: '냉동 공조 일반' | '냉동 공조 설계' | '냉동 공조 유지 보수 관리'; // 국가 교육과정 과목명
  standardCode?: string; // 국가 교육과정 성취기준 코드 (예: [냉일 02-03], [냉설 01-01-01], [냉유 05-02-01])
  standardName?: string; // 성취기준명 (예: 실내 냉방 부하 계산하기)
  level: number; // 1 to 5 (성취수준 단계)
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  concept: string;
  formula?: string;
  practicalTip?: string;
  diagramType?: 'mollier' | 'cycle' | 'psychrometric' | 'wiring' | 'valve' | 'boiler';
  cycleData?: ThermodynamicCycleData;
  cotSteps?: CotStep[];
}


export interface StudentProfile {
  userId: string; // 고유 계정 아이디 (영문/숫자, 중복 방지)
  password?: string; // 비밀번호
  studentId: string; // 학번 (예: 30115, 2-1-08)
  name: string; // 이름 (예: 홍길동)
  phone: string; // 전화번호 (예: 010-1234-5678)
  phoneVerified?: boolean; // 계정 활성 상태
  phoneVerifiedAt?: string;
  email?: string; // 이메일 주소 (예: student@school.kr)
  emailVerified?: boolean; // 이메일 인증 완료 여부
  emailVerifiedAt?: string; // 이메일 인증 일시
  gradeClass?: string;
  department?: string; // 학과 (예: 공조냉동기계과)
  createdAt: string;
  lastActiveAt: string;
}

export interface DomainScore {
  domain: HVACDomain;
  correct: number;
  total: number;
  percentage: number;
}

export interface DiagnosticResult {
  userId?: string;
  studentId?: string;
  studentName?: string;
  cycle: number; // 1차, 2차, 3차...
  totalScore: number;
  totalQuestions: number;
  percentage: number;
  level: number;
  minimumCompetencyAchieved: boolean; // 고교학점제 최소 성취수준(40% 이상, Level 2 이상) 도달 여부
  domainScores: Record<HVACDomain, DomainScore>;
  subjectScores?: {
    general: { correct: number; total: number; percentage: number }; // [과목 7] 냉동 공조 일반 과목
    design: { correct: number; total: number; percentage: number }; // [과목 27] 냉동 공조 설계 과목
    maintenance: { correct: number; total: number; percentage: number }; // [과목 28] 냉동 공조 유지 보수 관리 과목
  };
  userAnswers: Record<string, number>;
  completedAt: string;
  weakestDomain: HVACDomain;
  strongestDomain: HVACDomain;
  previousLevel?: number;
  previousScore?: number;
  levelDelta?: number;
  scoreDelta?: number;
  aiAnalysis?: {
    summary: string;
    strengths: string[];
    weaknesses: string[];
    studyRoadmap: Array<{ step: string; title: string; desc: string }>;
    recommendedQuestionFocus: string;
    teacherEncouragement: string;
  };
}

export interface PracticeResult {
  cycle: number;
  targetLevel: number;
  totalQuestions: number;
  correctCount: number;
  scorePercent: number;
  completedAt: string;
}

export interface CycleGrowthItem {
  cycle: number;
  diagnosticDate: string;
  diagnosticScore: number;
  diagnosticPercentage: number;
  level: number;
  practiceQuestionsSolved: number;
  practiceScorePercent?: number;
  completedAt?: string;
}

export interface AchievementLevelInfo {
  level: number;
  name: string;
  shortName: string;
  gradeName: string;
  minScore: number;
  maxScore: number;
  color: string;
  textColor: string;
  badgeBg: string;
  borderBadge: string;
  recommendedQuestions: number;
  description: string;
  curriculumStatus: string; // 고교학점제 최소성취수준 상태
  focusCurriculum: string;
  targetCertification: string;
}

export const ACHIEVEMENT_LEVELS: Record<number, AchievementLevelInfo> = {
  1: {
    level: 1,
    name: '1단계: 최소 성취수준 미도달 (보충 필요)',
    shortName: '1단계 기초보충',
    gradeName: '기초 개념 클리닉반',
    minScore: 0,
    maxScore: 39,
    color: '#d97706',
    textColor: 'text-amber-700 dark:text-amber-400',
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-700/60',
    borderBadge: 'border-amber-400 dark:border-amber-500/50',
    recommendedQuestions: 25,
    curriculumStatus: '최소 성취수준(40%) 미도달 - 보충 지도 대상',
    description: '냉동공조 기본 물리량(온도, 압력, 현열/잠열)과 기초 안전 수칙 등 핵심 개념의 보충 학습이 필요한 단계입니다.',
    focusCurriculum: '냉동 기초 물리, 현열·잠열 계산, 안전 보호구 및 작업장 안전 수칙 [냉설 01, 냉유 01]',
    targetCertification: '기능사 기초 이론 확립 및 최소 학업 성취수준 도달',
  },
  2: {
    level: 2,
    name: '2단계: 최소 성취수준 통과 (기본 형성)',
    shortName: '2단계 기본통과',
    gradeName: '공조냉동 핵심기기 실습반',
    minScore: 40,
    maxScore: 59,
    color: '#2563eb',
    textColor: 'text-blue-700 dark:text-blue-400',
    badgeBg: 'bg-blue-50 text-blue-800 border-blue-300 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-700/60',
    borderBadge: 'border-blue-400 dark:border-blue-500/50',
    recommendedQuestions: 40,
    curriculumStatus: '최소 성취수준 도달 (Pass)',
    description: '냉동 4대 구성기기(압축-응축-팽창-증발)의 역할과 보일러, 공조기 기본 점검 사항을 안정적으로 파악하고 있습니다.',
    focusCurriculum: '표준 냉동사이클 흐름, 공조기 필터/송풍기 점검, 보일러 기본 운영 [냉설 04, 냉유 03, 냉유 06]',
    targetCertification: '공조냉동기계기능사 핵심 개념 마스터',
  },
  3: {
    level: 3,
    name: '3단계: 실무 발전 (보통 학업성취)',
    shortName: '3단계 실무발전',
    gradeName: '국가기술자격 실전 대비반',
    minScore: 60,
    maxScore: 74,
    color: '#059669',
    textColor: 'text-emerald-700 dark:text-emerald-400',
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-700/60',
    borderBadge: 'border-emerald-400 dark:border-emerald-500/50',
    recommendedQuestions: 50,
    curriculumStatus: '기능사 합격 기준 충족 (양호)',
    description: '공조냉동기계기능사 합격권 수준으로, P-h 선도 상태점 판독, 부하 계산 기초, 공조기 DDC 자동제어 및 트러블슈팅을 원활히 수행합니다.',
    focusCurriculum: 'P-h 몰리에르 선도 상태점 판독, 감온식 팽창밸브, 습공기선도 기본 프로세스, 증기트랩 점검 [냉설 03, 냉유 04]',
    targetCertification: '공조냉동기계기능사 필기 확실한 합격권',
  },
  4: {
    level: 4,
    name: '4단계: 심화 숙련 (우수 학업성취)',
    shortName: '4단계 심화숙련',
    gradeName: '현장 실무 엔지니어 심화반',
    minScore: 75,
    maxScore: 89,
    color: '#0891b2',
    textColor: 'text-cyan-800 dark:text-cyan-300',
    badgeBg: 'bg-cyan-50 text-cyan-900 border-cyan-300 dark:bg-cyan-950/50 dark:text-cyan-300 dark:border-cyan-700/60',
    borderBadge: 'border-cyan-400 dark:border-cyan-500/50',
    recommendedQuestions: 75,
    curriculumStatus: '우수 성취수준 (Advanced)',
    description: '성적계수(COP) 및 동결/제빙 부하 산출, 펌프 성능곡선 및 배관·덕트 도면 검토 능력을 갖춘 우수 숙련 단계입니다.',
    focusCurriculum: '과열도·과냉각도 열정산, 냉동능력(RT) 및 소요동력 수식 계산, 실내외 부하 계산, 보일러 프라이밍 방지 [냉설 01, 냉설 02, 냉유 06]',
    targetCertification: '기능사 고득점 및 공조냉동기계산업기사 준비',
  },
  5: {
    level: 5,
    name: '5단계: 전문 마스터 (최우수 학업성취)',
    shortName: '5단계 전문마스터',
    gradeName: '냉동공조 최고전문가반',
    minScore: 90,
    maxScore: 100,
    color: '#7c3aed',
    textColor: 'text-purple-700 dark:text-purple-400',
    badgeBg: 'bg-purple-50 text-purple-900 border-purple-300 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-700/60',
    borderBadge: 'border-purple-400 dark:border-purple-500/50',
    recommendedQuestions: 100,
    curriculumStatus: '최우수 마스터 (Mastery)',
    description: '다단 및 흡수식 특수 냉동사이클, 공조 프로세스 부하 적정성 검토, 중앙감시반 제어 로직 및 인허가 도서까지 통달한 최고 단계입니다.',
    focusCurriculum: '다단 압축/다원 냉동/흡수식 사이클, 복합 공조 프로세스 SHF 선도, 인허가·준공 도서 검토, 수처리 고도화 [냉설 03, 냉설 04, 냉설 05, 냉유 07]',
    targetCertification: '산업기사 완벽 대비 및 현장 실무 특급 엔지니어',
  },
};


export const DOMAINS: HVACDomain[] = [
  '냉동 사이클 및 열역학 해석',
  '냉난방 및 냉동·냉장 부하 계산',
  '공조 프로세스 및 습공기 선도',
  '공조·냉동 설비 운영 및 점검 관리',
  '보일러 및 증기·배관 설비 운영',
  '안전관리·설계도서 및 자재 관리',
];

// 2022 개정 직업계고 전문교과 교육과정 성취기준 데이터 구조
export interface CurriculumStandard {
  code: string;
  subject: '냉동 공조 일반' | '냉동 공조 설계' | '냉동 공조 유지 보수 관리';
  area: string; // 학습 영역 (예: 냉난방 부하 계산, 열역학)
  element: string; // 학습 요소 (예: 냉방 부하 계산하기, 냉동 사이클)
  statement: string; // 성취기준 서술문
  keyConcepts: string[];
}
