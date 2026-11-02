# [구현 계획] 3.2 AI 프롬프트 엔지니어링 및 P-h 몰리에르 도식 제약 조건 최적화

공학적 모순이 없는 냉동공조 평가 문항을 생성하기 위해, 엄격한 물리적 변인 통제($h_2 > h_1 > h_4$, COP, 냉동능력 $R=G \cdot q_e$), 4단계 Chain-of-Thought (CoT) 연산 검증, 그리고 열역학 상태점 좌표와 기하학적 규칙이 주입된 정밀 P-h 몰리에르 선도 SVG 렌더러를 진단평가와 맞춤형 연습 스튜디오 전반에 전면 통합합니다.

---

### 사용자 검토 및 확정된 핵심 의사결정

> [!IMPORTANT]
> 1단계 인터뷰를 통해 사용자가 확정한 구현 방향:
> 1. **적용 범위**: 맞춤형 문제 연습 스튜디오(`PracticeStudio`) 및 진단평가(`DiagnosticTest`) 모듈 전체에 통합
> 2. **P-h 선도 생성/표시 방식**: AI가 생성한 열역학 상태점($h_1, h_2, h_3, h_4, P_{evap}, P_{cond}$)을 기반으로 웹 앱 내에서 정밀 벡터 SVG 도식을 렌더링하여 텍스트 지문과 100% 일치 보장
> 3. **4단계 CoT 연산 검증 노출**: 문제 풀이 완료 후 상세 해설 영역에 4단계 연산 검증 과정(변수 대소 검증 → 냉동효과 산출 → 압축일량 산출 → 최종 COP 도출)을 시각적으로 구조화하여 제공

---

## 1. 개요 및 핵심 컨셉 (Overview & Core Concept)

### 무엇을 구축하는가 (What It Does)
- **열역학적 변인 통제 메타 프롬프트**: 무작위 난수 생성 시 발생할 수 있는 $h_2 < h_1$과 같은 물리적 오류를 원천 차단하고, 실제 냉매(R-134a, R-410A, R-717 등)의 물성치 범위 내에서 흡입($h_1$), 토출($h_2$), 팽창 후($h_4$) 엔탈피가 생성되도록 제약.
- **4단계 Chain-of-Thought (CoT) 추론 엔진**:
  - `Step 1 (변수 대소 검증)`: $h_2 > h_1 > h_4$ 물리적 유효성 검증
  - `Step 2 (냉동효과 산출)`: $q_e = h_1 - h_4$ (kJ/kg)
  - `Step 3 (압축일량 산출)`: $Aw = h_2 - h_1$ (kJ/kg)
  - `Step 4 (최종 COP 및 냉동능력 도출)`: $COP = q_e / Aw$, $R = G \cdot q_e$
- **기하학적 규칙 기반 P-h 선도 정밀 SVG 도식 렌더러**:
  - 등압선(수평선), 등엔탈피선(수직선), 등엔트로피선(우측 상단 압축 곡선)을 정확한 좌표계로 배치하여 포화액선·건포화증기선 돔 위에 실시간 렌더링.

### 대상 사용자 및 교육적 효과
- **대상**: 직업계고(특성화고·마이스터고) 공조냉동기계과 학생 및 교사, 공조냉동기계기능사/산업기사 수험생.
- **효과**: AI 환각(Hallucination)에 의한 오개념 문제를 원천 방지하고, 시각적 몰리에르 선도와 수식 계산을 직관적으로 연계하여 학생의 문제 해결력 극대화.

---

## 2. 사용자 경험 및 시각 디자인 (User Experience & Visual Design)

### 주요 사용자 흐름 (Key User Flows)
1. **문제 풀이 화면 (PracticeStudio & DiagnosticTest)**:
   - 계산형 및 도식형 문항 출제 시 문항 상단/좌측에 정밀하게 렌더링된 **P-h 몰리에르 선도 카드**가 표시됨.
   - 상태점 1(흡입), 2(토출), 3(응축 후), 4(팽창 후)가 선도 상에 인터랙티브하게 마킹되며, 지문의 조건과 완벽히 동기화.
2. **학생 답안 선택 및 제출**:
   - 4지선다 보기를 선택하고 즉시 또는 시험 제출 후 해설 열람.
3. **4단계 CoT 해설 아코디언/카드**:
   - 해설 패널에 **[공학적 연산 검증 4-Step CoT 풀이]**가 단계별 배지와 수식 블록으로 일목요연하게 표시됨.
   - 학생은 단순 정답 암기가 아니라 열역학적 도출 과정을 단계별로 학습.

### 시각 디자인 및 UI 레이아웃
- **색상 체계 (Thermodynamic Color Token)**:
  - 저압·흡열부(증발기 $4 \to 1$): 쿨 시안(`text-cyan-400`, `stroke-cyan-500`)
  - 단열 압축부(압축기 $1 \to 2$): 퍼플/바이올렛(`text-purple-400`, `stroke-purple-500`)
  - 고압·방열부(응축기 $2 \to 3$): 앰버/코랄 레드(`text-rose-400`, `stroke-rose-500`)
  - 등엔탈피 감압부(팽창밸브 $3 \to 4$): 에메랄드(`text-emerald-400`, `stroke-emerald-500`)
- **타이포그래피 및 수식 가독성**:
  - 수식 및 변수($h_1, h_2, COP$)는 JetBrains Mono 및 이탤릭 공학 표기 적용.
  - 불필요한 알약형 뱃지 대신 깔끔한 섹션 디바이더와 단계별 라벨링 적용.

---

## 3. 핵심 제품 결정 및 트레이드오프 (Key Product Decisions)

### 결정 1: SVG 직접 텍스트 생성 vs 앱 내 상태점 기반 동적 SVG 렌더러
- **선택**: AI는 엄격한 JSON 상태점($h_1, h_2, h_3, h_4, P_{evap}, P_{cond}$, 냉매 종류)을 출력하고, 브라우저가 SVG 렌더러 컴포넌트를 통해 오차 없이 수학적으로 완벽한 선도를 그림.
- **이유**: LLM에게 순수 SVG XML 코드를 직접 생성하게 하면 가끔 태그 누락이나 깨진 좌표가 발생할 수 있습니다. 반면 상태점 수치를 받아 브라우저가 직접 렌더링하면 100% 공학적으로 유효하고 반응형이며 인터랙티브한 도식을 보장할 수 있습니다.

### 결정 2: 4단계 CoT 구조의 프롬프트와 UI 연계
- **선택**: 프롬프트의 JSON 응답 스키마에 `cotSteps` 배열을 필수로 요구하여, AI 모델이 연산 시 CoT를 실제로 수행하도록 강제하고, 이를 프론트엔드 해설 뷰에 그대로 전달.
- **이유**: 모델의 계산 환각을 방지하는 동시에 학생들에게 가장 효과적인 단계별 해설을 자동으로 제공할 수 있습니다.

---

## 4. 기술 아키텍처 및 데이터 흐름 (Technical Architecture)

### 시스템 다이어그램
```
┌────────────────────────────────────────────────────────────────────────┐
│                        Backend (server.ts)                             │
│                                                                        │
│  Gemini 3.8 Flash (Structured Output & Meta-Prompt)                    │
│   ├── Thermodynamic Bound Injection (h2 > h1 > h4, Pcond > Pevap)      │
│   ├── 4-Step Chain-of-Thought Validation Enforcement                   │
│   └── Outputs Question with thermodynamicCycleData & cotSteps JSON     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ /api/generate-questions
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        Frontend (Client App)                           │
│                                                                        │
│  ┌───────────────────────┐             ┌────────────────────────────┐  │
│  │ PracticeStudio.tsx    │             │ DiagnosticTest.tsx         │  │
│  │ (맞춤형 20~100제)     │             │ (성취수준 30제 진단평가)   │  │
│  └───────────┬───────────┘             └─────────────┬──────────────┘  │
│              │                                       │                 │
│              ▼                                       ▼                 │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ <PhDiagramCard cycleData={q.cycleData} /> (정밀 SVG 도식)       │  │
│  │  - 포화증기 돔, 등압선, 등엔탈피선, 등엔트로피 압축 곡선        │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│              │                                                         │
│              ▼                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ <CotStepsAccordion steps={q.cotSteps} /> (4단계 연산 검증 해설)  │  │
│  │  1. 변수 검증 → 2. 냉동효과 → 3. 압축일량 → 4. COP 도출         │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

### 데이터 모델 확장 (`src/types/hvac.ts`)
```typescript
export interface ThermodynamicCycleData {
  refrigerant: string; // e.g., 'R-134a', 'R-410A', 'R-717'
  pevap: number;       // 증발압력 (MPa abs)
  pcond: number;       // 응축압력 (MPa abs)
  h1: number;          // 압축기 흡입 엔탈피 (kJ/kg)
  h2: number;          // 압축기 토출 엔탈피 (kJ/kg)
  h3: number;          // 응축기 출구 엔탈피 (kJ/kg)
  h4: number;          // 팽창밸브 출구 엔탈피 (kJ/kg, h4 = h3)
  qe: number;          // 단위 냉동효과 (h1 - h4)
  aw: number;          // 압축소요일 (h2 - h1)
  cop: number;         // 성적계수 (qe / aw)
}

export interface CotStep {
  step: 1 | 2 | 3 | 4;
  title: string;       // e.g. "1단계: 열역학적 변수 유효성 검증"
  formula?: string;    // e.g. "h2 > h1 > h4 확인: 430 > 390 > 240 kJ/kg"
  calculation: string; // e.g. "압축과정 및 팽창과정의 물리적 대소 관계가 성립함"
  result: string;      // e.g. "유효 판정 통과"
}

// Question 인터페이스에 추가
export interface Question {
  // ... 기존 필드 유지
  cycleData?: ThermodynamicCycleData;
  cotSteps?: CotStep[];
}
```

### 상세 구현 단계
1. **`src/types/hvac.ts`**: `ThermodynamicCycleData`, `CotStep` 타입 정의 추가.
2. **`server.ts`**: `/api/generate-questions` 엔드포인트 프롬프트 전면 고도화.
   - 역할 정의(냉동공조 전문가 및 출제위원).
   - 계산형 문항 변인 통제 메타 규칙 주입($h_2 > h_1 > h_4$, 실제 냉매 물성 범위).
   - 4-Step CoT 검증 과정 스키마 및 Few-shot 예시 주입.
3. **`src/components/PhDiagramCard.tsx` (신규)**:
   - 주입된 상태점 수치($h_1 \sim h_4, P_{evap}, P_{cond}$)에 맞춰 포화액선-건포화증기선 돔 위에 사이클 루프와 수치 라벨을 그리는 경량 벡터 SVG 컴포넌트 개발.
4. **`src/components/CotStepsExplanation.tsx` (신규)**:
   - 1단계(변수 검증)부터 4단계(최종 COP 도출)까지 시각적으로 정리하여 해설창에 보여주는 컴포넌트.
5. **`src/components/PracticeStudio.tsx` & `src/components/DiagnosticTest.tsx` & `src/components/LevelAnalysisReport.tsx`**:
   - 문항에 `cycleData` 및 `cotSteps`가 있을 경우 도식과 4단계 해설을 매끄럽게 렌더링하도록 뷰 연동.
6. **검증 및 빌드 확인**:
   - `lint_applet` 및 `compile_applet`을 통한 TypeScript 타입 안정성 및 번들링 무결성 검증.
