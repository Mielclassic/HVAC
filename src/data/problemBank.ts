import { Question, HVACDomain, DOMAINS } from '../types/hvac';

// =========================================================================
// 고등학교 냉동공조 교육과정 기반 큐레이션 문제 은행
// [과목 7. 냉동 공조 일반] & [과목 27. 냉동 공조 설계] & [과목 28. 유지 보수 관리]
// =========================================================================

export const CURATED_PROBLEMS: Question[] = [
  // -------------------------------------------------------------
  // LEVEL 1: 최소 성취수준 기초 보충 (Novice)
  // -------------------------------------------------------------
  {
    id: 'lvl1-gen1',
    domain: '냉동 사이클 및 열역학 해석',
    subject: '냉동 공조 일반',
    standardCode: '[냉일 01-01]',
    standardName: '냉동의 원리 및 냉동톤(RT) 단위 정의',
    level: 1,
    question: '0℃의 순수한 물 1,000 kg(1톤)을 24시간 동안에 0℃의 얼음으로 만드는데 필요한 냉동능력을 뜻하는 1 한국/일본 냉동톤(RT)의 열량 환산값은?',
    options: ['2,500 kcal/h', '3,024 kcal/h', '3,320 kcal/h', '3,860 kcal/h'],
    answerIndex: 2,
    explanation: '0℃ 얼음의 융해잠열은 약 79.68 kcal/kg이므로, 1 한국/일본 냉동톤 = (1,000 kg × 79.68 kcal/kg) / 24 h = 3,320 kcal/h (약 3.86 kW)입니다. (미국 USRT는 2,000 lb 기준 3,024 kcal/h)',
    concept: '1 냉동톤(RT)의 정의 및 열량 환산 [냉일 01-01]',
    formula: '1 RT = 1,000 · 79.68 / 24 = 3,320 kcal/h',
  },
  {
    id: 'lvl1-1',
    domain: '냉동 사이클 및 열역학 해석',
    subject: '냉동 공조 설계',
    standardCode: '[냉설 04-01-01]',
    standardName: '냉동 사이클 4대 구성기기 역할',
    level: 1,
    question: '증기압축 냉동사이클에서 주위의 열을 흡수하여 냉각 공간을 시원하게 만드는 핵심 기기는?',
    options: ['압축기 (Compressor)', '응축기 (Condenser)', '팽창밸브 (Expansion Valve)', '증발기 (Evaporator)'],
    answerIndex: 3,
    explanation: '증발기(Evaporator)는 저온·저압의 액체 냉매가 기화하면서 주위의 잠열을 흡수하여 냉각 대상 공간을 차갑게 만듭니다.',
    concept: '증발기의 흡열 작용 [냉설 04-01-01]',
    diagramType: 'cycle',
    practicalTip: '증발기 핀에 성에(Frost)가 두껍게 끼면 열교환이 차단되어 냉각 성능이 급감하므로 주기적인 제상이 필요합니다.',
  },
  {
    id: 'lvl1-2',
    domain: '냉동 사이클 및 열역학 해석',
    subject: '냉동 공조 설계',
    standardCode: '[냉설 04-01-01]',
    standardName: '기초 물리량 및 잠열',
    level: 1,
    question: '0℃의 순수한 얼음 1 kg이 0℃의 물로 상태 변화할 때 흡수하는 융해잠열(kcal/kg)은 약 얼마인가?',
    options: ['1 kcal/kg', '80 kcal/kg', '539 kcal/kg', '640 kcal/kg'],
    answerIndex: 1,
    explanation: '0℃ 얼음의 융해잠열은 약 79.68 kcal/kg(통상 80 kcal/kg, 약 334 kJ/kg)입니다. 100℃ 물의 증발잠열은 약 539 kcal/kg입니다.',
    concept: '물의 상태변화 융해잠열 [냉설 04-01-01]',
    formula: 'Q = m · r (r = 79.68 kcal/kg)',
  },
  {
    id: 'lvl1-3',
    domain: '냉난방 및 냉동·냉장 부하 계산',
    subject: '냉동 공조 설계',
    standardCode: '[냉설 01-01-01]',
    standardName: '냉방 부하의 현열 및 잠열',
    level: 1,
    question: '여름철 실내 냉방 부하 중에서 온도의 변화 없이 습도(수증기량) 증가에 의해서만 발생하는 열량을 무엇이라 하는가?',
    options: ['현열 (Sensible Heat)', '잠열 (Latent Heat)', '복사열 (Radiant Heat)', '전도열 (Conduction Heat)'],
    answerIndex: 1,
    explanation: '상태 변화나 수분량 증감에 수반되는 열은 잠열(Latent Heat)이며, 온도 변화에만 수반되는 열은 현열(Sensible Heat)입니다.',
    concept: '냉방부하의 현열·잠열 구분 [냉설 01-01-01]',
  },
  {
    id: 'lvl1-4',
    domain: '공조 프로세스 및 습공기 선도',
    subject: '냉동 공조 설계',
    standardCode: '[냉설 03-01-01]',
    standardName: '습공기 선도 기본 4대 요소',
    level: 1,
    question: '공기조화의 기본 4대 환경 제어 요소로 가장 올바르게 짝지어진 것은?',
    options: [
      '온도, 습도, 기류, 청정도',
      '온도, 압력, 비등점, 전압',
      '습도, 일사량, 부하율, 풍속',
      '산소량, 이산화탄소량, 질소량, 기압',
    ],
    answerIndex: 0,
    explanation: '실내 쾌적 공기조화의 4대 요소는 실내 공기의 [온도(Temperature)], [습도(Humidity)], [기류(Air Motion)], [청정도(Air Cleanliness)]입니다.',
    concept: '공기조화의 4대 기본 제어 요소 [냉설 03-01-01]',
  },
  {
    id: 'lvl1-5',
    domain: '공조·냉동 설비 운영 및 점검 관리',
    subject: '냉동 공조 유지 보수 관리',
    standardCode: '[냉유 04-04-04]',
    standardName: '공조기 필터 점검 관리',
    level: 1,
    question: '공조기(AHU)의 에어필터 오염 상태를 점검할 때 사용하는 계측기는?',
    options: ['진공게이지', '차압계 (Manometer)', '절연저항계 (Megger)', '소음계'],
    answerIndex: 1,
    explanation: '에어필터 전후면의 압력 차이를 측정하는 차압계(마노미터)를 통해 필터 막힘 정도와 교체 시기(초기 차압의 2배)를 판단합니다.',
    concept: '필터 차압계 점검 관리 [냉유 04-04-04]',
  },
  {
    id: 'lvl1-6',
    domain: '보일러 및 증기·배관 설비 운영',
    subject: '냉동 공조 유지 보수 관리',
    standardCode: '[냉유 06-05-06]',
    standardName: '보일러 가동 전 수면계 점검',
    level: 1,
    question: '증기보일러를 가동하기 전 가장 먼저 확인해야 하는 안전 수위 점검 장치는 무엇인가?',
    options: ['연료 탱크 유량계', '보일러 유리 수면계 (Water Gauge)', '배기가스 온도계', '송풍기 풍속계'],
    answerIndex: 1,
    explanation: '보일러 연소 전 관수 부족으로 인한 과열 소손 및 폭발을 방지하기 위해 유리 수면계의 정상 수위 확인이 최우선 점검 사항입니다.',
    concept: '보일러 가동 전 수면계 점검 [냉유 06-05-06]',
  },
  {
    id: 'lvl1-7',
    domain: '안전관리·설계도서 및 자재 관리',
    subject: '냉동 공조 유지 보수 관리',
    standardCode: '[냉유 01-01-04]',
    standardName: '산업 안전 보호구 착용',
    level: 1,
    question: '냉매 배관 용접 작업이나 냉매 충전 작업 시 동상 및 안구 손상을 방지하기 위해 반드시 착용해야 하는 보호구는?',
    options: ['보안경 및 냉매 보호장갑', '방진마스크만 착용', '일반 면장갑만 착용', '귀마개만 착용'],
    answerIndex: 0,
    explanation: '냉매 누출 시 급격한 기화열 흡수로 인한 피부 동상과 눈 손상을 막기 위해 보안경과 내한 보호장갑 착용이 법적 의무 사항입니다.',
    concept: '작업 안전 보호구 선정 [냉유 01-01-04]',
  },

  // -------------------------------------------------------------
  // LEVEL 2: 최소 성취수준 통과 (Basic)
  // -------------------------------------------------------------
  {
    id: 'lvl2-gen1',
    domain: '냉동 사이클 및 열역학 해석',
    subject: '냉동 공조 일반',
    standardCode: '[냉일 02-01]',
    standardName: '열역학 절대압력과 게이지 압력 관계',
    level: 2,
    question: '기계실 압력계(게이지압)가 0.45 MPa를 지시하고 있을 때, 표준 대기압(0.1013 MPa) 하에서 이 냉매 배관의 절대압력(MPa)은 얼마인가?',
    options: ['0.3487 MPa', '0.4500 MPa', '0.5513 MPa', '0.9013 MPa'],
    answerIndex: 2,
    explanation: '절대압력(Absolute Pressure) = 대기압(Atmospheric Pressure) + 게이지압(Gauge Pressure) = 0.1013 + 0.45 = 0.5513 MPa입니다.',
    concept: '절대압력과 게이지압력의 관계식 [냉일 02-01]',
    formula: 'P_abs = P_atm + P_gauge',
  },
  {
    id: 'lvl2-gen2',
    domain: '안전관리·설계도서 및 자재 관리',
    subject: '냉동 공조 일반',
    standardCode: '[냉일 01-02]',
    standardName: '친환경 대체 냉매 및 오존층 파괴지수(ODP)',
    level: 2,
    question: '몬트리올 의정서 및 키갈리 개정안에 따라 오존층 보호를 위해 기존 HCFC계(R-22) 냉매를 대체하여 사용하는 친환경 냉매의 오존층 파괴지수(ODP) 기준치는 얼마인가?',
    options: ['0 (완전 무해)', '0.5', '1.0 (R-11 기준과 동일)', '1.5'],
    answerIndex: 0,
    explanation: 'HFC계(R-410A, R-32) 및 HFO계 친환경 대체 냉매는 분자 구조 내에 오존을 파괴하는 염소(Cl) 원자가 전혀 없으므로 ODP(오존층 파괴지수)가 0입니다.',
    concept: '친환경 냉매의 ODP 및 GWP 특성 [냉일 01-02]',
  },
  {
    id: 'lvl2-1',
    domain: '냉동 사이클 및 열역학 해석',
    subject: '냉동 공조 설계',
    standardCode: '[냉설 04-01-01]',
    standardName: 'P-h 선도 단위 냉동효과 계산',
    level: 2,
    question: '어떤 냉동기 P-h 선도에서 증발기 출구 엔탈피 h1 = 405 kJ/kg, 증발기 입구 엔탈피 h4 = 255 kJ/kg이다. 냉매 1kg당 단위 냉동효과(qe)는?',
    options: ['150 kJ/kg', '255 kJ/kg', '405 kJ/kg', '660 kJ/kg'],
    answerIndex: 0,
    explanation: 'qe = h1 - h4 = 405 - 255 = 150 kJ/kg입니다.',
    concept: '단위 냉동효과 계산 공식 [냉설 04-01-01]',
    formula: 'qe = h1 - h4',
  },
  {
    id: 'lvl2-2',
    domain: '냉난방 및 냉동·냉장 부하 계산',
    subject: '냉동 공조 설계',
    standardCode: '[냉설 01-01-02]',
    standardName: '외기 도입 냉방 부하 계산',
    level: 2,
    question: '도입 외기량이 2,000 m³/h이고 실외 온도 31℃, 실내 설정온도 26℃일 때 외기 현열 부하는? (공기 용적비열 0.29 kcal/m³·℃)',
    options: ['1,450 kcal/h', '2,900 kcal/h', '4,350 kcal/h', '5,800 kcal/h'],
    answerIndex: 1,
    explanation: 'Qs = 0.29 × 2,000 × (31 - 26) = 0.29 × 2,000 × 5 = 2,900 kcal/h입니다.',
    concept: '외기 취입 현열부하 계산 [냉설 01-01-02]',
    formula: 'Qs = 0.29 · Q · Δt',
  },
  {
    id: 'lvl2-3',
    domain: '공조 프로세스 및 습공기 선도',
    subject: '냉동 공조 설계',
    standardCode: '[냉설 03-01-02]',
    standardName: '공기 혼합 상태점 계산',
    level: 2,
    question: '실내 환기 20℃ 3,000 m³/h와 외기 30℃ 1,000 m³/h가 혼합될 때 혼합 공기의 건구온도는?',
    options: ['22.5℃', '25.0℃', '26.5℃', '27.0℃'],
    answerIndex: 0,
    explanation: 't_mix = (3,000 × 20 + 1,000 × 30) / (3,000 + 1,000) = (60,000 + 30,000) / 4,000 = 22.5℃입니다.',
    concept: '공기 혼합 온도 비례 내분점 계산 [냉설 03-01-02]',
  },
  {
    id: 'lvl2-4',
    domain: '공조·냉동 설비 운영 및 점검 관리',
    subject: '냉동 공조 유지 보수 관리',
    standardCode: '[냉유 03-06-07]',
    standardName: '동절기 공조기 동파 방지 제어',
    level: 2,
    question: '겨울철 외기 온도가 -5℃ 이하로 내려갈 때 공조기 히팅코일 동파를 막기 위한 조치로 옳은 것은?',
    options: [
      '외기 댐퍼를 최소로 닫고 온수 순환 밸브를 전개한다.',
      '냉수 코일 밸브를 열어 찬물을 흘린다.',
      '외기 댐퍼를 100% 열어 송풍기 속도를 올린다.',
      '가습기를 즉시 정지하고 배수 밸브를 잠근다.',
    ],
    answerIndex: 0,
    explanation: '동절기 -5℃ 이하 혹한 시 외기 댐퍼를 닫아 찬 공기 직유입을 차단하고 코일 내 난방수를 강제 순환시켜 동파를 방지합니다.',
    concept: '공조기 동파 방지 제어 [냉유 03-06-07]',
  },
  {
    id: 'lvl2-5',
    domain: '보일러 및 증기·배관 설비 운영',
    subject: '냉동 공조 유지 보수 관리',
    standardCode: '[냉유 06-03-04]',
    standardName: '증기 배관 워터해머 방지',
    level: 2,
    question: '증기 배관에서 고속 증기가 고인 응축수를 강타하는 워터 해머링(수격작용) 방지책으로 옳은 것은?',
    options: [
      '증기 메인 밸브를 단번에 급개방한다.',
      '송기 전 배관 하부 드레인을 완전히 배출하고 밸브를 서서히 연다.',
      '증기 트랩을 모두 철거한다.',
      '배관 구배를 증기 흐름 반대 방향으로 역구배 시공한다.',
    ],
    answerIndex: 1,
    explanation: '워터해머를 방지하기 위해서는 증기 통기 전 드레인 밸브로 응축수를 완전히 빼내고 메인 밸브를 천천히 열어 예열해야 합니다.',
    concept: '증기 배관 워터해머 방지 [냉유 06-03-04]',
  },

  // -------------------------------------------------------------
  // LEVEL 3: 실무 발전 (Intermediate)
  // -------------------------------------------------------------
  {
    id: 'lvl3-gen1',
    domain: '공조·냉동 설비 운영 및 점검 관리',
    subject: '냉동 공조 일반',
    standardCode: '[냉일 04-03]',
    standardName: '감온식 팽창밸브(TXV) 감온통 취부 위치 및 과열도 제어',
    level: 3,
    question: '온도식 자동 팽창밸브(TXV)의 감온통(Sensing Bulb)을 증발기 출구 흡입관에 설치할 때의 올바른 부착 위치와 원리로 옳은 것은?',
    options: [
      '관 하단 바닥면에 설치하여 고인 오일 온도를 측정한다.',
      '관 상단(12시 방향) 또는 수평관의 2시~4시 방향에 밀착 고정하여 증발기 출구 냉매 과열도를 감지한다.',
      '팽창밸브 입구 액관에 설치한다.',
      '응축기 입구 토출관에 설치한다.',
    ],
    answerIndex: 1,
    explanation: '감온통은 증발기 출구 수평 흡입관의 상부 또는 2~4시 방향에 금속 밴드로 견고하게 밀착 단열하여 증발기 출구의 가스 과열도를 정밀 감지해야 합니다. 바닥면(6시)은 고인 냉동기유로 인해 오차가 발생합니다.',
    concept: '감온식 팽창밸브 감온통 취부 기준 [냉일 04-03]',
  },
  {
    id: 'lvl3-1',
    domain: '냉동 사이클 및 열역학 해석',
    subject: '냉동 공조 설계',
    standardCode: '[냉설 04-01-03]',
    standardName: '히트펌프 성적계수 관계식',
    level: 3,
    question: '어떤 히트펌프의 냉방 성적계수(COP_C)가 3.8이다. 이 시스템을 난방 모드로 전환했을 때 이론적 난방 성적계수(COP_H)는 얼마인가?',
    options: ['2.8', '3.8', '4.8', '5.2'],
    answerIndex: 2,
    explanation: '난방 방열량 Qh = 흡열량 Qe + 압축일 W 이므로, COP_H = COP_C + 1 = 3.8 + 1 = 4.8입니다.',
    concept: '히트펌프 난방/냉방 COP 관계 [냉설 04-01-03]',
    formula: 'COP_H = COP_C + 1',
  },
  {
    id: 'lvl3-2',
    domain: '냉난방 및 냉동·냉장 부하 계산',
    subject: '냉동 공조 설계',
    standardCode: '[냉설 01-02-01]',
    standardName: '외벽 열관류율 난방부하 계산',
    level: 3,
    question: '외벽 면적 50 m², 열관류율 K = 0.6 kcal/m²·h·℃, 실내외 온도차가 25℃일 때 벽체 통과 관류열량(난방부하)은?',
    options: ['500 kcal/h', '750 kcal/h', '1,000 kcal/h', '1,250 kcal/h'],
    answerIndex: 1,
    explanation: 'Q = K × A × ΔT = 0.6 × 50 × 25 = 750 kcal/h입니다.',
    concept: '열관류율에 의한 난방부하 산출 [냉설 01-02-01]',
    formula: 'Q = K · A · ΔT',
  },
  {
    id: 'lvl3-3',
    domain: '공조 프로세스 및 습공기 선도',
    subject: '냉동 공조 설계',
    standardCode: '[냉설 03-01-02]',
    standardName: '냉각 감습 및 노점온도',
    level: 3,
    question: '공조기 냉각 코일에서 공기를 감습(제습)하기 위해 냉각 코일 표면 온도가 반드시 만족해야 하는 조건은?',
    options: [
      '유입 공기의 건구온도보다 높을 것',
      '유입 공기의 이슬점(노점)온도보다 낮을 것',
      '0℃ 이하로 항상 동결 상태일 것',
      '외기 습구온도와 정확히 동일할 것',
    ],
    answerIndex: 1,
    explanation: '공기 중의 수분이 응축수로 맺혀 제습되려면 냉각코일 표면온도(장치노점온도)가 공기의 노점온도 이하이어야 합니다.',
    concept: '냉각 감습 프로세스 [냉설 03-01-02]',
  },
  {
    id: 'lvl3-4',
    domain: '공조·냉동 설비 운영 및 점검 관리',
    subject: '냉동 공조 유지 보수 관리',
    standardCode: '[냉유 04-03-09]',
    standardName: '공조기 드레인 U-트랩 봉수 점검',
    level: 3,
    question: '공조기 송풍기 흡입측 드레인 팬 배수관에 설치된 U-트랩 봉수가 증발하여 파괴되었을 때 발생하는 주요 현상은?',
    options: [
      '송풍기 풍량이 두 배로 급증한다.',
      '부압으로 인해 응축수가 배출되지 못하고 팬 밖으로 범람하며 하수 악취가 실내로 유입된다.',
      '냉각탑의 수위가 급상승한다.',
      '압축기 고압 차단 스위치가 작동한다.',
    ],
    answerIndex: 1,
    explanation: '공조기 내부 부압(-)으로 인해 바깥 공기가 역류하면서 응축수 배수가 막혀 물이 넘쳐흐르고 악취가 덕트로 빨려 들어갑니다.',
    concept: 'U-트랩 봉수 역할과 관리 [냉유 04-03-09]',
  },
  {
    id: 'lvl3-5',
    domain: '보일러 및 증기·배관 설비 운영',
    subject: '냉동 공조 유지 보수 관리',
    standardCode: '[냉유 06-04-06]',
    standardName: '보일러 프라이밍·포밍·기수공발',
    level: 3,
    question: '보일러 수면에 불순물과 유지분이 농축되어 거품이 심하게 일고 증기에 물방울이 섞여나가는 캐리오버(기수공발)의 현장 대책은?',
    options: [
      '보일러 연소량을 최대로 올린다.',
      '수처리 청관제를 과량 투입하고 블로우다운 밸브를 닫아둔다.',
      '주기적인 보일러수 블로우다운(바닥 분출)을 실시하여 농축 염분을 배출한다.',
      '수면계를 철거한다.',
    ],
    answerIndex: 2,
    explanation: '보일러수 내의 용존 고형물(TDS)과 유지분 농도를 낮추기 위해 바닥 분출(블로우다운)을 정기적으로 실시해야 합니다.',
    concept: '보일러 기수공발 방지 분출 관리 [냉유 06-04-06]',
  },

  // -------------------------------------------------------------
  // LEVEL 4: 심화 숙련 (Advanced)
  // -------------------------------------------------------------
  {
    id: 'lvl4-gen1',
    domain: '공조·냉동 설비 운영 및 점검 관리',
    subject: '냉동 공조 일반',
    standardCode: '[냉일 05-02]',
    standardName: '송풍기 상사법칙 회전수 변경에 따른 풍량 및 동력 산출',
    level: 4,
    question: '어떤 공조기 송풍기의 회전수를 1,000 rpm에서 풀리 교체로 1,200 rpm으로 20% 증가시켰다. 이때 송풍기 모터의 소요 축동력(kW)은 기존 동력의 몇 배로 증가하는가?',
    options: ['1.20배', '1.44배', '1.728배', '2.07배'],
    answerIndex: 2,
    explanation: '송풍기 상사법칙에 의해 풍량은 회전수 1승 비례(1.2배), 풍압은 2승 비례(1.2²=1.44배), 소요 동력은 회전수 3승에 비례하므로 (1.2)³ = 1.728배로 급증합니다.',
    concept: '송풍기 상사법칙 축동력 공식 [냉일 05-02]',
    formula: 'L2 / L1 = (N2 / N1)³ = (1.2)³ = 1.728',
  },
  {
    id: 'lvl4-1',
    domain: '냉동 사이클 및 열역학 해석',
    subject: '냉동 공조 설계',
    standardCode: '[냉설 04-01-01]',
    standardName: '냉동능력(RT) 및 성적계수 복합 계산',
    level: 4,
    question: '어떤 냉동기의 냉매 순환량이 600 kg/h이고, qe = 151.2 kcal/kg, 압축일 Aw = 30.24 kcal/kg일 때, 냉동능력(USRT, 3,024 kcal/h 기준)과 성적계수(COP)는 각각 얼마인가?',
    options: ['20 USRT, COP 3.0', '30 USRT, COP 5.0', '40 USRT, COP 4.0', '50 USRT, COP 6.0'],
    answerIndex: 1,
    explanation: '총 냉동능력 = 600 × 151.2 = 90,720 kcal/h → 90,720 / 3,024 = 30 USRT. COP = 151.2 / 30.24 = 5.0입니다.',
    concept: '냉동능력 및 COP 동시 계산 [냉설 04-01-01]',
    formula: 'RT = (G · qe) / 3,024, COP = qe / Aw',
  },
  {
    id: 'lvl4-2',
    domain: '냉난방 및 냉동·냉장 부하 계산',
    subject: '냉동 공조 설계',
    standardCode: '[냉설 02-01-01]',
    standardName: '식품 냉동창고 동결 부하 3단계',
    level: 4,
    question: '식품 냉동창고 부하 설계 시 식품 자체의 냉각 부하를 계산하는 공식 순서로 옳은 것은?',
    options: [
      '단열벽 전도열량만 계산',
      '동결 전 냉각열량 + 동결 잠열량 + 동결 후 냉각열량',
      '동결 잠열량에 3배의 안전율 곱',
      '실내 조명 발열량과의 차이',
    ],
    answerIndex: 1,
    explanation: '식품 부하 = 동결 전 현열(m·c1·Δt1) + 동결 잠열(m·r) + 동결 후 현열(m·c2·Δt2)의 합으로 계산합니다.',
    concept: '식품 동결 부하 계산 [냉설 02-01-01]',
  },
  {
    id: 'lvl4-3',
    domain: '공조 프로세스 및 습공기 선도',
    subject: '냉동 공조 설계',
    standardCode: '[냉설 03-02-01]',
    standardName: '필요 송풍량(CMH) 결정 공식',
    level: 4,
    question: '실내 현열부하 Qs = 29,000 kcal/h, 실내온도 26℃, 급기 취출온도 16℃일 때 필요한 급기 풍량(CMH, m³/h)은? (공기 용적비열 0.29 kcal/m³·℃)',
    options: ['5,000 m³/h', '8,000 m³/h', '10,000 m³/h', '12,000 m³/h'],
    answerIndex: 2,
    explanation: 'Q_air = Qs / [0.29 × (26 - 16)] = 29,000 / (0.29 × 10) = 29,000 / 2.9 = 10,000 m³/h입니다.',
    concept: '공조기 송풍량 산출 공식 [냉설 03-02-01]',
    formula: 'Q_air = Qs / (0.29 · ΔT)',
  },
  {
    id: 'lvl4-4',
    domain: '공조·냉동 설비 운영 및 점검 관리',
    subject: '냉동 공조 유지 보수 관리',
    standardCode: '[냉유 03-07-05]',
    standardName: '펌프 캐비테이션 방지 조치',
    level: 4,
    question: '냉온수 펌프의 캐비테이션(공동현상)을 방지하기 위해 유효흡입양정(NPSHa)을 증대시키는 방법으로 옳은 것은?',
    options: [
      '펌프 설치 위치를 흡입 수면보다 가능한 낮게 배치한다.',
      '펌프 회전수를 2배로 증가시킨다.',
      '흡입관에 오리피스를 설치하여 관내 압력을 떨어뜨린다.',
      '흡입측 밸브를 절반 이상 조인다.',
    ],
    answerIndex: 0,
    explanation: '펌프의 설치 높이를 낮추면 흡입 정압이 높아져 유효흡입양정(NPSHa)이 증가하므로 캐비테이션을 방지할 수 있습니다.',
    concept: '펌프 유효흡입양정(NPSHa) 확보 [냉유 03-07-05]',
  },
  {
    id: 'lvl4-5',
    domain: '보일러 및 증기·배관 설비 운영',
    subject: '냉동 공조 유지 보수 관리',
    standardCode: '[냉유 06-04-04]',
    standardName: '수면계 기능 점검 코크 조작 순서',
    level: 4,
    question: '보일러 수면계 기능 점검 시 올바른 코크 조작 순서는?',
    options: [
      '드레인 개방 → 물 코크 닫기(증기 취출) → 증기 코크 닫고 물 코크 열기(온수 취출) → 드레인 닫기',
      '물 코크 닫기 → 증기 코크 닫기 → 드레인 닫기',
      '드레인 코크만 열고 즉시 닫기',
      '연소 정지 후 냉각될 때까지 조작 금지',
    ],
    answerIndex: 0,
    explanation: '드레인 개방 후 물 코크를 닫아 증기 측 통로를 청소하고, 이어서 증기 코크를 닫고 물 코크를 열어 수측 통로를 청소한 후 드레인을 닫아 수위를 복원합니다.',
    concept: '보일러 수면계 기능 시험 조작 [냉유 06-04-04]',
  },

  // -------------------------------------------------------------
  // LEVEL 5: 전문 마스터 (Master)
  // -------------------------------------------------------------
  {
    id: 'lvl5-gen1',
    domain: '안전관리·설계도서 및 자재 관리',
    subject: '냉동 공조 일반',
    standardCode: '[냉일 06-03]',
    standardName: '3상 유도전동기 와이-델타(Y-Δ) 기동 회로 특성',
    level: 5,
    question: '대용량 냉동기 압축기 및 공조 송풍기 모터(5.5 kW 이상)에 적용하는 와이-델타(Y-Δ) 감압 기동 방식에 대한 설명으로 가장 옳은 것은?',
    options: [
      'Y결선 기동 시 직입 기동에 비해 기동전류와 기동토크가 모두 1/3로 감소한다.',
      'Y결선 기동 시 기동전류가 3배 증가하여 신속하게 가속된다.',
      'Δ결선으로 먼저 기동한 후 정상 속도에 도달하면 Y결선으로 전환한다.',
      '기동 전류는 줄어들지만 기동 토크는 그대로 유지된다.',
    ],
    answerIndex: 0,
    explanation: '와이-델타 기동은 기동 시 권선을 Y로 결선하여 각 상전압을 선간전압의 1/√3로 낮춤으로써, 직입기동(Δ) 대비 기동전류와 기동토크를 모두 1/3(33.3%)로 대폭 저감시켜 전원 계통의 전압 강하를 방지합니다.',
    concept: '3상 유도전동기 Y-Δ 기동 원리 [냉일 06-03]',
    formula: 'I_start(Y) = (1/3) · I_start(Δ), T_start(Y) = (1/3) · T_start(Δ)',
  },
  {
    id: 'lvl5-1',
    domain: '냉동 사이클 및 열역학 해석',
    subject: '냉동 공조 설계',
    standardCode: '[냉설 04-02-01]',
    standardName: '2단 압축 다단 냉동 사이클 중간냉각기',
    level: 5,
    question: '2단 압축 1단 팽창 사이클에서 중간 냉각기(Intercooler)를 적용할 때 얻어지는 열역학적 이점이 아닌 것은?',
    options: [
      '저단 토출가스를 냉각하여 고단 압축기의 과열 소손을 방지한다.',
      '고단 압축기로 흡입되는 냉매 가스의 비체적을 줄여 압축 소요일을 절감한다.',
      '고압 액냉매를 과냉각시켜 증발기의 단위 냉동효과를 증대시킨다.',
      '응축 온도를 증발 온도보다 낮추어 역사이클을 유도한다.',
    ],
    answerIndex: 3,
    explanation: '중간냉각기는 고단 압축일 감소, 토출온도 저하, 액냉매 과냉각을 통한 냉동효과 증대가 목적이며 응축 온도를 증발 온도보다 낮추는 장치가 아닙니다.',
    concept: '다단 냉동 사이클 중간냉각기 해석 [냉설 04-02-01]',
  },
  {
    id: 'lvl5-2',
    domain: '냉난방 및 냉동·냉장 부하 계산',
    subject: '냉동 공조 설계',
    standardCode: '[냉설 02-02-02]',
    standardName: '수랭식 응축기 부하 및 냉각수량 산출',
    level: 5,
    question: '냉동능력 20 RT(60,480 kcal/h), 압축기 소요동력 15 kW(860 kcal/kWh)인 냉동기의 응축열량(kcal/h)은 얼마인가?',
    options: ['60,480 kcal/h', '68,200 kcal/h', '73,380 kcal/h', '81,500 kcal/h'],
    answerIndex: 2,
    explanation: 'Qc = Qe + 860 × P = 60,480 + (860 × 15) = 60,480 + 12,900 = 73,380 kcal/h입니다.',
    concept: '응축기 전열부하 계산 [냉설 02-02-02]',
    formula: 'Qc = Qe + 860 · P_kW',
  },
  {
    id: 'lvl5-3',
    domain: '공조 프로세스 및 습공기 선도',
    subject: '냉동 공조 설계',
    standardCode: '[냉설 03-02-02]',
    standardName: '바이패스 팩터(BF)와 공조기 적정성',
    level: 5,
    question: '공조기 냉각 코일의 바이패스 팩터(BF)가 0.1에서 0.2로 증가했을 때 시스템에 미치는 영향으로 옳은 것은?',
    options: [
      '코일 접촉 열교환 효율이 감소하여 동일 실내 현열부하 처리를 위해 더 큰 급기 풍량이 필요하다.',
      '제습 능력이 대폭 향상되어 취출 공기가 더욱 건조해진다.',
      '냉각 코일의 통과 차압이 2배로 증가한다.',
      '송풍기 모터의 소요 동력이 자동으로 절반으로 감소한다.',
    ],
    answerIndex: 0,
    explanation: '바이패스 팩터(BF)가 커지면 코일과 접촉하지 않고 통과하는 공기량이 늘어나 취출온도가 상승하므로 동일 부하 처리를 위해 급기 풍량(CMH)과 송풍기 동력이 증가해야 합니다.',
    concept: '바이패스 팩터(BF)와 코일 적정성 검토 [냉설 03-02-02]',
  },
  {
    id: 'lvl5-4',
    domain: '공조·냉동 설비 운영 및 점검 관리',
    subject: '냉동 공조 유지 보수 관리',
    standardCode: '[냉유 05-03-06]',
    standardName: '냉각탑 수질 및 레지오넬라균 방제',
    level: 5,
    question: '냉각탑 유지 관리 중 레지오넬라균 예방과 순환수 농축 방지를 위한 복합 관리 기준으로 옳은 것은?',
    options: [
      '주기적인 약품(살균제) 투여, 정기적 농축수 강제 배출(Blow-down), 하부 수조 슬라임 청소 병행',
      '보급수를 완전히 차단하고 1년간 교체 없이 운전',
      '냉각탑 팬을 정지하여 자연 통풍으로만 가동',
      '염산 원액을 매일 10리터씩 수조에 직접 투입',
    ],
    answerIndex: 0,
    explanation: '레지오넬라균과 스케일 방제를 위해서는 살균 약품 자동 주입, 전기전도도 기반 자동 블로우다운, 정기 수조 청소가 결합된 종합 수질 관리가 필수입니다.',
    concept: '냉각탑 수질 종합 관리 [냉유 05-03-06]',
  },
  {
    id: 'lvl5-5',
    domain: '보일러 및 증기·배관 설비 운영',
    subject: '냉동 공조 유지 보수 관리',
    standardCode: '[냉유 06-08-05]',
    standardName: '보일러 서모릴레이 트립 원인 규명 및 조치',
    level: 5,
    question: '보일러 송풍기 모터의 서모릴레이(열동과부하계전기)가 작동하여 버너가 비상 정지되었을 때 올바른 기술 조치 순서는?',
    options: [
      '모터 절연저항, 단상 운전(결상), 베어링 구속, 벨트 장력을 점검하여 과부하 원인을 제거한 후 리셋하고 프리퍼지를 거쳐 재기동한다.',
      '원인 점검 없이 리셋 버튼을 즉시 누르고 바로 버너를 재점화한다.',
      '서모릴레이 전류 세팅 다이얼을 최대로 올려 트립을 무력화한다.',
      '보일러를 방치하고 연료 공급 밸브만 활짝 연다.',
    ],
    answerIndex: 0,
    explanation: '원인 규명 없이 리셋하면 모터 권선 소손 및 화재 폭발 위험이 있으므로, 전기적·기계적 원인을 제거한 후 프리퍼지 시퀀스를 거쳐 안전하게 재가동해야 합니다.',
    concept: '보일러 전기 안전 트러블슈팅 [냉유 06-08-05]',
  },
];

// =========================================================================
// 고교 교육과정 성취수준별 맞춤형 문제 자동 생성기 (20 ~ 100문제)
// =========================================================================

export function generateCustomPracticeSet(config: {
  targetLevel: number; // 1 to 5
  count: number; // 20 to 100
  domainFilter?: string; // 특정 도메인 또는 'all'
  focusWeakness?: boolean;
  weakDomains?: HVACDomain[];
}): Question[] {
  const { targetLevel, count, domainFilter, focusWeakness, weakDomains = [] } = config;

  // 1. Filter base curated problems
  let available = [...CURATED_PROBLEMS];

  if (domainFilter && domainFilter !== 'all') {
    available = available.filter((q) => q.domain === domainFilter);
  }

  // Prefer target level ± 1
  available.sort((a, b) => {
    const distA = Math.abs(a.level - targetLevel);
    const distB = Math.abs(b.level - targetLevel);
    return distA - distB;
  });

  const selected: Question[] = [];
  const usedIds = new Set<string>();

  // Pick suitable curated problems first
  for (const q of available) {
    if (selected.length >= count) break;
    selected.push(q);
    usedIds.add(q.id);
  }

  // 2. Procedurally generate curriculum-grounded questions if more are required (up to 100)
  let genCounter = 1;
  const targetDomains: HVACDomain[] =
    domainFilter && domainFilter !== 'all'
      ? [domainFilter as HVACDomain]
      : focusWeakness && weakDomains.length > 0
      ? weakDomains
      : DOMAINS;

  while (selected.length < count) {
    const domain = targetDomains[(genCounter - 1) % targetDomains.length];
    const generated = createProceduralCurriculumQuestion(domain, targetLevel, genCounter);
    selected.push(generated);
    genCounter++;
  }

  return selected.slice(0, count);
}

// PracticeStudio 및 외부 연동을 위한 question pool 생성 래퍼
export function generateQuestionPool(
  arg1:
    | number
    | string
    | {
        targetLevel: number;
        count: number;
        domainFilter?: string;
        focusWeakness?: boolean;
        weakDomains?: HVACDomain[];
      },
  arg2?: number,
  arg3?: string | number,
  focusWeakness: boolean = false,
  weakDomains: HVACDomain[] = []
): Question[] {
  if (typeof arg1 === 'object' && arg1 !== null) {
    return generateCustomPracticeSet(arg1);
  }

  // Format: generateQuestionPool(targetLevel, count, domainFilter)
  if (typeof arg1 === 'number') {
    const targetLevel = arg1;
    const count = typeof arg2 === 'number' ? arg2 : 20;
    const domainFilter = typeof arg3 === 'string' ? arg3 : undefined;
    return generateCustomPracticeSet({
      targetLevel,
      count,
      domainFilter,
      focusWeakness,
      weakDomains,
    });
  }

  // Format: generateQuestionPool(domainFilter, targetLevel, count)
  if (typeof arg1 === 'string') {
    const domainFilter = arg1;
    const targetLevel = typeof arg2 === 'number' ? arg2 : 3;
    const count = typeof arg3 === 'number' ? arg3 : 20;
    return generateCustomPracticeSet({
      targetLevel,
      count,
      domainFilter,
      focusWeakness,
      weakDomains,
    });
  }

  return generateCustomPracticeSet({
    targetLevel: 3,
    count: 20,
    domainFilter: undefined,
  });
}

// 국가 교육과정 성취기준 연계 동적 문항 생성기
function createProceduralCurriculumQuestion(
  domain: HVACDomain,
  level: number,
  index: number
): Question {
  const seed = (index * 7 + level * 13) % 100;
  const isGeneral = index % 3 === 0;

  switch (domain) {
    case '냉동 사이클 및 열역학 해석': {
      // 3.2.1 변인 통제: h2 > h1 > h4 엄격 준수 (물리적 모순 원천 배제)
      const h1 = 390 + (seed % 20); // 390 ~ 409 kJ/kg (흡입)
      const h4 = 240 + (seed % 15); // 240 ~ 254 kJ/kg (팽창 후 = h3)
      const h3 = h4;
      const aw = 32 + (seed % 10);  // 32 ~ 41 kJ/kg (압축소요일)
      const h2 = h1 + aw;           // h2 > h1 > h4 항상 보장
      const qe = h1 - h4;           // 단위 냉동효과 (h1 - h4)
      const cop = (qe / aw).toFixed(2);
      const pevap = Number((0.22 + (seed % 8) * 0.01).toFixed(2));
      const pcond = Number((1.15 + (seed % 12) * 0.02).toFixed(2));

      return {
        id: `gen-cycle-${level}-${index}`,
        domain,
        subject: isGeneral ? '냉동 공조 일반' : '냉동 공조 설계',
        standardCode: isGeneral ? '[냉일 04-01]' : '[냉설 04-01-01]',
        standardName: isGeneral ? '냉동 사이클 원리 및 P-h 선도 해석' : '냉동 사이클 성적계수(COP) 해석 및 변인 통제',
        level,
        question: `[실무 문제 #${index}] R-134a 표준 증기압축 냉동사이클의 P-h 선도에서 흡입 엔탈피 h1 = ${h1} kJ/kg, 토출 엔탈피 h2 = ${h2} kJ/kg, 팽창밸브 입구 엔탈피 h3 = ${h3} kJ/kg (등엔탈피 h4 = h3)일 때, 이 사이클의 성적계수(COP)는 약 얼마인가?`,
        options: [
          `${(parseFloat(cop) * 0.75).toFixed(2)}`,
          `${cop}`,
          `${(parseFloat(cop) * 1.3).toFixed(2)}`,
          `${(parseFloat(cop) + 1.8).toFixed(2)}`,
        ],
        answerIndex: 1,
        explanation: `성적계수 COP = 단위 냉동효과(qe) / 압축소요일(Aw) = (h1 - h4) / (h2 - h1) = (${h1} - ${h4}) / (${h2} - ${h1}) = ${qe} / ${aw} = ${cop} 입니다.`,
        concept: isGeneral ? '냉동 사이클 COP 계산 및 변인 통제 [냉일 04-01]' : '냉동 사이클 COP 계산 및 변인 통제 [냉설 04-01-01]',
        formula: 'COP = (h1 - h4) / (h2 - h1)',
        diagramType: 'mollier',
        cycleData: {
          refrigerant: 'R-134a',
          pevap,
          pcond,
          h1,
          h2,
          h3,
          h4,
          qe,
          aw,
          cop: parseFloat(cop),
        },
        cotSteps: [
          {
            step: 1,
            title: '1단계: 열역학적 변수 대소 검증',
            formula: 'h2 > h1 > h4 & Pcond > Pevap',
            calculation: `${h2} > ${h1} > ${h4} kJ/kg 및 ${pcond} > ${pevap} MPa`,
            result: '열역학 제1·2법칙 및 압축·팽창 물리적 타당성 검증 완료',
          },
          {
            step: 2,
            title: '2단계: 단위 냉동효과(qe) 산출',
            formula: 'qe = h1 - h4',
            calculation: `${h1} - ${h4} = ${qe} kJ/kg`,
            result: `qe = ${qe} kJ/kg (증발기 흡열량)`,
          },
          {
            step: 3,
            title: '3단계: 압축소요일(Aw) 산출',
            formula: 'Aw = h2 - h1',
            calculation: `${h2} - ${h1} = ${aw} kJ/kg`,
            result: `Aw = ${aw} kJ/kg (압축기 소요동력 일량)`,
          },
          {
            step: 4,
            title: '4단계: 최종 성능계수(COP) 도출',
            formula: 'COP = qe / Aw',
            calculation: `${qe} / ${aw} = ${cop}`,
            result: `COP = ${cop}`,
          },
        ],
      };
    }


    case '냉난방 및 냉동·냉장 부하 계산': {
      const airQ = 1000 + (seed % 10) * 200;
      const dt = 5 + (seed % 5);
      const qs = Math.round(0.29 * airQ * dt);
      return {
        id: `gen-load-${level}-${index}`,
        domain,
        subject: isGeneral ? '냉동 공조 일반' : '냉동 공조 설계',
        standardCode: isGeneral ? '[냉일 03-01]' : '[냉설 01-01-02]',
        standardName: isGeneral ? '실내 냉난방 부하 인자 파악 및 현열 계산' : '외기 도입 현열 냉방 부하 계산',
        level,
        question: `[실무 문제 #${index}] 환기를 위해 외기 ${airQ} m³/h를 도입할 때, 실내외 온도차가 ${dt}℃라면 도입 외기에 의한 현열 부하는 몇 kcal/h인가? (공기 용적비열 = 0.29 kcal/m³·℃)`,
        options: [
          `${Math.round(qs * 0.7)} kcal/h`,
          `${qs} kcal/h`,
          `${Math.round(qs * 1.3)} kcal/h`,
          `${Math.round(qs * 1.6)} kcal/h`,
        ],
        answerIndex: 1,
        explanation: `외기 현열부하 Qs = 0.29 × 풍량(Q) × 온도차(ΔT) = 0.29 × ${airQ} × ${dt} = ${qs} kcal/h 입니다.`,
        concept: isGeneral ? '외기 현열 부하 공식 [냉일 03-01]' : '외기 현열 부하 공식 [냉설 01-01-02]',
        formula: 'Qs = 0.29 · Q · ΔT',
      };
    }

    case '공조 프로세스 및 습공기 선도': {
      const db = 24 + (seed % 4);
      const wb = 17 + (seed % 3);
      return {
        id: `gen-psychro-${level}-${index}`,
        domain,
        subject: isGeneral ? '냉동 공조 일반' : '냉동 공조 설계',
        standardCode: isGeneral ? '[냉일 03-04]' : '[냉설 03-01-01]',
        standardName: isGeneral ? '습공기 선도 기본 상태선 해석' : '습공기 상태점 분석',
        level,
        question: `[실무 문제 #${index}] 실내 공기의 건구온도가 ${db}℃, 습구온도가 ${wb}℃일 때, 습공기 선도에서 이 상태점의 노점온도(이슬점온도)는 다음 중 어떤 범위에 위치하는가?`,
        options: [
          `건구온도(${db}℃)보다 높다`,
          `습구온도(${wb}℃) 이하이고 0℃보다 높은 포화선 온도`,
          `절대 0K(-273℃)에 수렴한다`,
          `건구온도와 항상 일치한다`,
        ],
        answerIndex: 1,
        explanation: `포화 공기가 아닌 일반 습공기에서는 항상 건구온도(DB) > 습구온도(WB) > 노점온도(DP)의 관계가 성립합니다. 따라서 노점온도는 습구온도 이하입니다.`,
        concept: isGeneral ? '건구, 습구, 노점온도의 대소 관계 [냉일 03-04]' : '건구, 습구, 노점온도의 대소 관계 [냉설 03-01-01]',
        diagramType: 'psychrometric',
      };
    }

    case '공조·냉동 설비 운영 및 점검 관리': {
      return {
        id: `gen-ops-${level}-${index}`,
        domain,
        subject: isGeneral ? '냉동 공조 일반' : '냉동 공조 유지 보수 관리',
        standardCode: isGeneral ? '[냉일 05-01]' : '[냉유 04-04-04]',
        standardName: isGeneral ? '공기 조화기 필터 점검 관리' : '공조기 차압계 점검 관리',
        level,
        question: `[실무 문제 #${index}] 공조기 필터의 초기 압력손실이 15 mmAq였다. 마노미터 차압계 점검 시 필터를 세정하거나 교체해야 하는 산업 기준 차압치는 몇 mmAq 이상인가?`,
        options: ['18 mmAq', '22 mmAq', '30 mmAq', '45 mmAq'],
        answerIndex: 2,
        explanation: `필터의 교체 및 세정 판정 기준은 초기 차압의 2배 이상입니다. 15 mmAq × 2 = 30 mmAq 이상일 때 교체해야 합니다.`,
        concept: isGeneral ? '필터 차압 기준 교체 주기 [냉일 05-01]' : '필터 차압 기준 교체 주기 [냉유 04-04-04]',
      };
    }

    case '보일러 및 증기·배관 설비 운영': {
      return {
        id: `gen-boiler-${level}-${index}`,
        domain,
        subject: '냉동 공조 유지 보수 관리',
        standardCode: '[냉유 06-03-05]',
        standardName: '증기 트랩 정상 작동 점검',
        level,
        question: `[실무 문제 #${index}] 증기 배관에서 증기의 누출은 차단하면서 관내에 생성된 응축수와 불응축 가스만을 자동으로 배출하는 기기는?`,
        options: ['감압 밸브', '스팀 트랩 (Steam Trap)', '스트레이너', '체크 밸브'],
        answerIndex: 1,
        explanation: `스팀 트랩(Steam Trap)은 증기 손실을 막고 응축수만 자동 배출하여 증기 시스템의 열효율을 극대화하고 워터해머를 방지하는 핵심 밸브입니다.`,
        concept: '스팀 트랩의 기능 및 역할 [냉유 06-03-05]',
      };
    }

    case '안전관리·설계도서 및 자재 관리':
    default: {
      return {
        id: `gen-safety-${level}-${index}`,
        domain: '안전관리·설계도서 및 자재 관리',
        subject: isGeneral ? '냉동 공조 일반' : '냉동 공조 유지 보수 관리',
        standardCode: isGeneral ? '[냉일 01-03]' : '[냉유 08-01-02]',
        standardName: isGeneral ? '작업장 안전 수칙 및 환경 보호' : '계측기 검교정 관리',
        level,
        question: `[실무 문제 #${index}] 공조냉동 기계실 유지보수에 사용하는 압력계와 진공게이지의 정밀도 유지를 위해 국가표준기본법에 따라 실시해야 하는 법적 조치는?`,
        options: [
          '주기적인 공인기관 검교정(Calibration) 실시 및 대장 기록 관리',
          '오차가 생겨도 고장이 날 때까지 그대로 사용',
          '매일 아침 망치로 가볍게 두드려 지침을 0으로 맞춤',
          '영구 보관하고 현장 반출을 금지함',
        ],
        answerIndex: 0,
        explanation: `압력계와 진공게이지 등 정밀 계측기는 검교정 주기(통상 1년~2년)에 따라 검교정을 실시하고 교정성적서를 관리해야 측정 신뢰성을 확보할 수 있습니다.`,
        concept: isGeneral ? '계측기 검교정 관리 기준 [냉일 01-03]' : '계측기 검교정 관리 기준 [냉유 08-01-02]',
      };
    }
  }
}
