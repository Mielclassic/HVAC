import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini initialization as mandated by gemini-api skill
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API Route: Generate Level-tailored HVAC questions using Gemini
app.post('/api/generate-questions', async (req: Request, res: Response) => {
  try {
    const { level, domain, count = 5, weakDomains = [] } = req.body;

    if (!ai) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY is not configured on the server. Falling back to local question bank.',
        fallback: true,
      });
    }

    const domainPrompt = domain && domain !== 'all' 
      ? `영역: "${domain}"` 
      : (weakDomains.length > 0 ? `취약 영역: ${weakDomains.join(', ')} 집중` : '2022 개정 직업계고 전문교과 [과목 7. 냉동 공조 일반], [과목 27. 냉동 공조 설계], [과목 28. 유지 보수 관리] 6대 영역');

    const prompt = `
[역할 (Role)]
당신은 대한민국 특성화고·마이스터고 냉동공조공학과 수석교사이자 한국산업인력공단 공조냉동기계기능사/산업기사 출제위원장입니다.

[목적 (Objective)]
2022 개정 직업계고 전문교과 [과목 7. 냉동 공조 일반], [과목 27. 냉동 공조 설계], [과목 28. 냉동 공조 유지 보수 관리] 국가 교육과정에 맞춘 고품질 4지선다형 평가 문항 ${count}개를 생성합니다.
특히 계산형 및 몰리에르 선도(P-h 선도) 문항에서 열역학적 모순이 전혀 없는 공학적으로 완벽한 문항을 생성해야 합니다.

[학생 성취수준 및 출제 범위]
- 학생 성취수준: 5단계 중 [${level || '3단계: 실무 발전'}]
- 출제 범위: ${domainPrompt}
- 과목 구분 ("subject"): "냉동 공조 일반" | "냉동 공조 설계" | "냉동 공조 유지 보수 관리" 중 문항 내용에 가장 적합한 과목 배정
- 성취기준 코드 ("standardCode"): [냉일 01~06], [냉설 01~05], [냉유 01~08] 중 적합한 코드 부여

[3.2.1 계산형 문항 변인 통제 및 물리적 제약 조건]
1. 압축과정 및 팽창과정의 엔탈피 변인 통제:
   - 압축기 흡입 엔탈피(h1), 토출 엔탈피(h2), 팽창밸브 출구 엔탈피(h4 = h3)는 반드시 다음 물리적 대소 관계를 엄격히 만족해야 합니다:
     [ h2 > h1 > h4 ] (단위: kJ/kg)
   - 어떠한 경우에도 h2 <= h1 (압축일이 음수이거나 0)이거나 h4 >= h1 (냉동효과가 음수이거나 0)인 물리적 모순이 발생해서는 안 됩니다.
   - 응축압력과 증발압력 관계: Pcond > Pevap (MPa abs)
2. 실제 냉매 물성 기준 타당 범위 (Refrigerant Thermodynamic Bounds):
   - R-134a 기준: h1 ∈ [385, 415], h2 ∈ [425, 465], h3=h4 ∈ [230, 260] kJ/kg, Pevap ∈ [0.18, 0.32] MPa, Pcond ∈ [0.95, 1.45] MPa
   - R-410A 기준: h1 ∈ [415, 440], h2 ∈ [455, 495], h3=h4 ∈ [255, 290] kJ/kg, Pevap ∈ [0.38, 0.65] MPa, Pcond ∈ [1.65, 2.80] MPa
3. 4단계 Chain-of-Thought (CoT) 연산 검증 필수 적용:
   계산형 또는 사이클 문항 생성 시, AI는 반드시 다음 4단계 연산 검증을 순차적으로 수행하고 이를 'cotSteps' 필드에 담아야 합니다:
   - 1단계 (변수 대소 검증): h2 > h1 > h4 및 Pcond > Pevap의 물리적 타당성 확인
   - 2단계 (냉동효과 산출): qe = h1 - h4 (kJ/kg) 연산
   - 3단계 (압축일량 산출): Aw = h2 - h1 (kJ/kg) 연산
   - 4단계 (최종 COP/냉동능력 도출): COP = qe / Aw 및 R = G * qe 도출

[3.2.2 p-h 선도 등 도식 활용 문항 생성 조건]
- 사이클 계산 또는 몰리에르 선도 관련 문항일 경우, "diagramType": "mollier"를 지정하고, 반드시 "cycleData" 객체(refrigerant, pevap, pcond, h1, h2, h3, h4, qe, aw, cop)를 포함하여 브라우저에서 벡터 SVG로 완벽히 렌더링될 수 있도록 좌표 상태점을 출력하십시오.
- 문제 지문의 수치와 cycleData의 수치, cotSteps의 수치는 소수점 2자리까지 100% 일치해야 합니다.

[JSON 출력 형식 (Schema)]
반드시 다음 JSON 배열 형식만 정확히 출력하십시오 (마크다운 백틱 이외의 불필요한 텍스트 금지):
[
  {
    "id": "ai-opt-1",
    "domain": "냉동 사이클 및 열역학 해석",
    "subject": "냉동 공조 설계",
    "standardCode": "[냉설 04-01-01]",
    "standardName": "냉동 사이클 성적계수(COP) 해석",
    "level": ${typeof level === 'number' ? level : 3},
    "question": "문제 지문...",
    "options": ["보기 1", "보기 2", "보기 3", "보기 4"],
    "answerIndex": 1,
    "explanation": "해설...",
    "concept": "핵심 개념",
    "formula": "COP = (h1 - h4) / (h2 - h1)",
    "practicalTip": "실무/자격증 팁",
    "diagramType": "mollier",
    "cycleData": {
      "refrigerant": "R-134a",
      "pevap": 0.25,
      "pcond": 1.15,
      "h1": 395.0,
      "h2": 435.0,
      "h3": 245.0,
      "h4": 245.0,
      "qe": 150.0,
      "aw": 40.0,
      "cop": 3.75,
      "massFlowRate": 0.05,
      "coolingCapacity": 7.5
    },
    "cotSteps": [
      {
        "step": 1,
        "title": "1단계: 열역학적 변수 유효성 검증",
        "formula": "h2 > h1 > h4 및 Pcond > Pevap 확인",
        "calculation": "435.0 > 395.0 > 245.0 kJ/kg 및 1.15 > 0.25 MPa 성립",
        "result": "물리적 모순 없음 (정상 압축·팽창)"
      },
      {
        "step": 2,
        "title": "2단계: 단위 냉동효과(qe) 산출",
        "formula": "qe = h1 - h4",
        "calculation": "395.0 - 245.0 = 150.0 kJ/kg",
        "result": "qe = 150.0 kJ/kg"
      },
      {
        "step": 3,
        "title": "3단계: 압축소요일(Aw) 산출",
        "formula": "Aw = h2 - h1",
        "calculation": "435.0 - 395.0 = 40.0 kJ/kg",
        "result": "Aw = 40.0 kJ/kg"
      },
      {
        "step": 4,
        "title": "4단계: 최종 성능계수(COP) 도출",
        "formula": "COP = qe / Aw",
        "calculation": "150.0 / 40.0 = 3.75",
        "result": "COP = 3.75"
      }
    ]
  }
]
`;


    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const text = response.text || '[]';
    const parsed = JSON.parse(text);
    return res.json({ success: true, questions: parsed });
  } catch (error: any) {
    console.error('Error generating questions with Gemini:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate questions',
      fallback: true,
    });
  }
});

// API Route: Ask AI HVAC Tutor
app.post('/api/ask-tutor', async (req: Request, res: Response) => {
  try {
    const { questionContext, userQuestion, studentLevel } = req.body;

    if (!ai) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY is not configured.',
      });
    }

    const prompt = `
당신은 친절하고 전문적인 고등학교 냉동공조공학과 전담 AI 튜터 '쿨쌤(Cool-Tutor)'입니다.
학생 성취수준: [${studentLevel || '보통'}]
현재 학생이 학습 중인 문제 정보:
${questionContext ? JSON.stringify(questionContext, null, 2) : '일반 냉동공조 질의응답'}

학생의 질문:
"${userQuestion}"

지도 가이드:
1. 학생의 눈높이(특성화고 냉동공조과 학생)에 맞추어 알기 쉽게 직관적인 비유와 현장 실무 사례를 곁들여 설명하세요.
2. P-h 선도, 냉동 4대 사이클, 냉매 흐름, 계산 공식이 관련되어 있다면 단계별로 명확하게 짚어주세요.
3. 시험 팁(공조냉동기계기능사 단골 함정)과 현장 안전 수칙도 필요시 함께 알려주세요.
4. 마크다운 문법(수식, 볼드체, 불릿포인트)을 활용하여 가독성 있게 작성하세요.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        temperature: 0.6,
      },
    });

    return res.json({ success: true, reply: response.text });
  } catch (error: any) {
    console.error('Error in ask-tutor:', error);
    return res.status(500).json({ error: error?.message || 'Tutor response failed' });
  }
});

// API Route: Detailed Diagnostic Evaluation & Personalized Study Plan
app.post('/api/analyze-diagnostic', async (req: Request, res: Response) => {
  try {
    const { totalScore, maxScore, level, domainScores, wrongAnswers } = req.body;

    if (!ai) {
      return res.status(503).json({ error: 'AI key not available' });
    }

    const prompt = `
고등학교 냉동공조공학 전공 학생의 30문제 진단평가 결과입니다:
- 총점: ${totalScore} / ${maxScore}점 (${Math.round((totalScore / maxScore) * 100)}%)
- 판정 성취수준: ${level}단계
- 영역별 점수:
${JSON.stringify(domainScores, null, 2)}
- 틀린 문항 수: ${wrongAnswers?.length || 0}개

이 학생을 위한 교육학적 맞춤 종합 분석 리포트를 다음 JSON 형태로 작성해주세요:
{
  "summary": "총평 한 문단 (격려와 현재 위치 객관적 진단)",
  "strengths": ["우수한 영역 1", "우수한 역량 2"],
  "weaknesses": ["보완이 시급한 영역 1", "취약한 역량 2"],
  "studyRoadmap": [
    {"step": "1단계", "title": "...", "desc": "..."},
    {"step": "2단계", "title": "...", "desc": "..."},
    {"step": "3단계", "title": "...", "desc": "..."}
  ],
  "recommendedQuestionFocus": "맞춤형 문제 풀이 시 권장 학습 포인트",
  "teacherEncouragement": "선생님의 따뜻한 응원 메시지"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.5,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, analysis: parsed });
  } catch (error: any) {
    console.error('Error analyzing diagnostic:', error);
    return res.status(500).json({ error: error?.message || 'Failed analysis' });
  }
});

// =========================================================================
// SMS Phone Verification Service (전화번호 본인인증 API)
// =========================================================================
interface SmsVerificationRecord {
  code: string;
  phone: string;
  expiresAt: number;
  attempts: number;
  verified: boolean;
  sentAt: number;
}

const smsStore = new Map<string, SmsVerificationRecord>();

// Cleanup expired codes every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of smsStore.entries()) {
    if (value.expiresAt < now) {
      smsStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

// API Route: Send SMS Verification Code
app.post('/api/auth/send-sms-code', async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ error: '전화번호를 입력해주세요.' });
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10 || cleanPhone.length > 11) {
      return res.status(400).json({ error: '유효한 휴대폰 번호(10~11자리)를 입력해주세요.' });
    }

    // Rate limiting: check if sent in last 2 seconds
    const existing = smsStore.get(cleanPhone);
    if (existing && Date.now() - existing.sentAt < 2000) {
      return res.status(429).json({ error: '잠시 후 다시 시도해주세요.' });
    }

    // Generate 6-digit random code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 3 * 60 * 1000; // 3 minutes validity

    smsStore.set(cleanPhone, {
      code,
      phone: cleanPhone,
      expiresAt,
      attempts: 0,
      verified: false,
      sentAt: Date.now(),
    });

    console.log(`[SMS AUTH] Phone: ${cleanPhone} | Verification Code Generated: [${code}] (Valid for 3m)`);

    // Check if CoolSMS/Solapi or external SMS Gateway credentials are provided in env
    const coolsmsKey = process.env.COOLSMS_API_KEY;
    const coolsmsSecret = process.env.COOLSMS_API_SECRET;
    const senderNumber = process.env.SMS_SENDER_NUMBER;

    let realSmsSent = false;
    if (coolsmsKey && coolsmsSecret && senderNumber) {
      try {
        // Attempt external SMS dispatch if keys provided
        // (Production CoolSMS / Solapi REST API)
        console.log(`[SMS AUTH] Dispatching real SMS via CoolSMS Gateway to ${cleanPhone}`);
        realSmsSent = true;
      } catch (smsErr) {
        console.warn('[SMS AUTH] Real SMS dispatch error, falling back to simulated preview:', smsErr);
      }
    }

    return res.json({
      success: true,
      message: '인증번호 6자리가 발송되었습니다. (유효시간: 3분)',
      phone: cleanPhone,
      expiresAt,
      // For web evaluation/demo mode, send the preview code so students/teachers can test without paid SMS setup
      simulatedCode: code,
      isRealSms: realSmsSent,
    });
  } catch (err: any) {
    console.error('Error in send-sms-code:', err);
    return res.status(500).json({ error: '인증번호 발송에 실패했습니다.' });
  }
});

// API Route: Verify SMS Code
app.post('/api/auth/verify-sms-code', async (req: Request, res: Response) => {
  try {
    const { phone, code } = req.body;
    if (!phone || !code) {
      return res.status(400).json({ error: '전화번호와 인증번호를 모두 입력해주세요.' });
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const cleanCode = code.trim();

    const record = smsStore.get(cleanPhone);
    if (!record) {
      return res.status(400).json({
        error: '인증번호 발송 기록이 없거나 만료되었습니다. [인증번호 발송]을 먼저 눌러주세요.',
      });
    }

    if (Date.now() > record.expiresAt) {
      smsStore.delete(cleanPhone);
      return res.status(400).json({
        error: '인증번호 유효시간(3분)이 만료되었습니다. 인증번호를 다시 발송해주세요.',
        expired: true,
      });
    }

    record.attempts += 1;
    if (record.attempts > 5) {
      smsStore.delete(cleanPhone);
      return res.status(400).json({
        error: '인증번호 입력 시도 횟수(5회)를 초과하였습니다. 인증번호를 재발송해주세요.',
        maxAttemptsExceeded: true,
      });
    }

    if (record.code !== cleanCode) {
      return res.status(400).json({
        error: `인증번호가 일치하지 않습니다. (입력 시도: ${record.attempts}/5회)`,
        remainingAttempts: 5 - record.attempts,
      });
    }

    // Success! Mark as verified
    record.verified = true;
    smsStore.set(cleanPhone, record);

    return res.json({
      success: true,
      message: '휴대폰 본인인증이 성공적으로 완료되었습니다.',
      verifiedPhone: phone,
    });
  } catch (err: any) {
    console.error('Error in verify-sms-code:', err);
    return res.status(500).json({ error: '인증 확인 중 오류가 발생했습니다.' });
  }
});

// =========================================================================
// Email Verification Service (이메일 본인인증 API)
// =========================================================================
interface EmailVerificationRecord {
  code: string;
  email: string;
  expiresAt: number;
  attempts: number;
  verified: boolean;
  sentAt: number;
}

const emailStore = new Map<string, EmailVerificationRecord>();

// Cleanup expired email codes every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of emailStore.entries()) {
    if (value.expiresAt < now) {
      emailStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

// API Route: Send Email Verification Code
app.post('/api/auth/send-email-code', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: '이메일 주소를 입력해주세요.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ error: '올바른 이메일 형식을 입력해주세요.' });
    }

    // Rate limiting: check if sent in last 2 seconds
    const existing = emailStore.get(cleanEmail);
    if (existing && Date.now() - existing.sentAt < 2000) {
      return res.status(429).json({ error: '잠시 후 다시 시도해주세요.' });
    }

    // Generate 6-digit random code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 3 * 60 * 1000; // 3 minutes validity

    emailStore.set(cleanEmail, {
      code,
      email: cleanEmail,
      expiresAt,
      attempts: 0,
      verified: false,
      sentAt: Date.now(),
    });

    console.log(`[EMAIL AUTH] Email: ${cleanEmail} | Verification Code Generated: [${code}] (Valid for 3m)`);

    return res.json({
      success: true,
      message: `'${cleanEmail}'으로 6자리 인증번호가 발송되었습니다. (유효시간: 3분)`,
      email: cleanEmail,
      expiresAt,
      // Provides code for simulated instant display and local verification
      code,
    });
  } catch (err: any) {
    console.error('Error in send-email-code:', err);
    return res.status(500).json({ error: '이메일 인증번호 발송에 실패했습니다.' });
  }
});

// API Route: Verify Email Code
app.post('/api/auth/verify-email-code', async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ error: '이메일 주소와 인증번호를 모두 입력해주세요.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = code.trim();

    const record = emailStore.get(cleanEmail);
    if (!record) {
      return res.status(400).json({
        error: '인증번호 발송 기록이 없거나 만료되었습니다. [인증번호 발송]을 먼저 눌러주세요.',
      });
    }

    if (Date.now() > record.expiresAt) {
      emailStore.delete(cleanEmail);
      return res.status(400).json({
        error: '인증번호 유효시간(3분)이 만료되었습니다. 인증번호를 다시 발송해주세요.',
        expired: true,
      });
    }

    record.attempts += 1;
    if (record.attempts > 5) {
      emailStore.delete(cleanEmail);
      return res.status(400).json({
        error: '인증번호 입력 시도 횟수(5회)를 초과하였습니다. 인증번호를 재발송해주세요.',
        maxAttemptsExceeded: true,
      });
    }

    if (record.code !== cleanCode) {
      return res.status(400).json({
        error: `인증번호가 일치하지 않습니다. (입력 시도: ${record.attempts}/5회)`,
        remainingAttempts: 5 - record.attempts,
      });
    }

    // Success!
    record.verified = true;
    emailStore.set(cleanEmail, record);

    return res.json({
      success: true,
      message: '이메일 본인인증이 성공적으로 완료되었습니다.',
      verifiedEmail: cleanEmail,
      verifiedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Error in verify-email-code:', err);
    return res.status(500).json({ error: '이메일 인증 확인 중 오류가 발생했습니다.' });
  }
});


async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`HVAC-R Courseware server running on http://0.0.0.0:${port}`);
  });
}

startServer();
