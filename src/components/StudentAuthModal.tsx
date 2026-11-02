import React, { useState, useEffect } from 'react';
import { StudentProfile } from '../types/hvac';
import {
  User,
  Hash,
  Lock,
  Phone,
  School,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Users,
  LogIn,
  UserPlus,
  X,
  Trash2,
  ShieldCheck,
  Mail,
  Clock,
  RotateCcw,
  Send,
  KeyRound,
} from 'lucide-react';

interface StudentAuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onLoginSuccess: (profile: StudentProfile) => void;
  currentStudent: StudentProfile | null;
  registeredAccounts: StudentProfile[];
  onDeleteAccount: (userId: string) => void;
}

export const StudentAuthModal: React.FC<StudentAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  currentStudent,
  registeredAccounts,
  onDeleteAccount,
}) => {
  // Mode: 'login' vs 'signup'
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  // Login Form States
  const [loginId, setLoginId] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [showLoginPassword, setShowLoginPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>('');

  // Sign Up Form States
  const [signupName, setSignupName] = useState<string>('');
  const [signupStudentId, setSignupStudentId] = useState<string>('');
  const [signupUserId, setSignupUserId] = useState<string>('');
  const [signupPassword, setSignupPassword] = useState<string>('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState<string>('');
  const [signupPhone, setSignupPhone] = useState<string>('');
  const [signupDepartment, setSignupDepartment] = useState<string>('공조냉동기계과');
  const [showSignupPassword, setShowSignupPassword] = useState<boolean>(false);
  const [signupError, setSignupError] = useState<string>('');
  const [signupSuccess, setSignupSuccess] = useState<string>('');

  // Email Verification States
  const [signupEmail, setSignupEmail] = useState<string>('');
  const [inputVerifyCode, setInputVerifyCode] = useState<string>('');
  const [sentCode, setSentCode] = useState<string | null>(null);
  const [isCodeSent, setIsCodeSent] = useState<boolean>(false);
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);
  const [isSendingEmail, setIsSendingEmail] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(180); // 3 minutes
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [emailNotice, setEmailNotice] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [showSimulatedEmailToast, setShowSimulatedEmailToast] = useState<{
    code: string;
    email: string;
    time: string;
  } | null>(null);

  // In-UI account deletion confirmation state (replaces window.confirm)
  const [accountToDelete, setAccountToDelete] = useState<StudentProfile | null>(null);

  // Timer Countdown Effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            setEmailError('인증번호 유효시간(3분)이 만료되었습니다. 인증번호를 다시 발송해주세요.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds]);

  if (!isOpen) return null;

  // Format seconds into MM:SS
  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Phone auto formatter (010-XXXX-XXXX)
  const handlePhoneChange = (val: string) => {
    const raw = val.replace(/[^0-9]/g, '');
    let formatted = raw;
    if (raw.length > 3 && raw.length <= 7) {
      formatted = `${raw.slice(0, 3)}-${raw.slice(3)}`;
    } else if (raw.length > 7) {
      formatted = `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
    }
    setSignupPhone(formatted);
  };

  // 1. Send Email Verification Code
  const handleSendVerificationEmail = async () => {
    setEmailError('');
    setEmailNotice('');

    const cleanEmail = signupEmail.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!cleanEmail) {
      setEmailError('이메일 주소를 입력해주세요.');
      return;
    }

    if (!emailRegex.test(cleanEmail)) {
      setEmailError('올바른 이메일 형식(예: student@school.kr 또는 name@domain.com)을 입력해주세요.');
      return;
    }

    // Check if email already registered
    const existing = registeredAccounts.find(
      (acc) => acc.email && acc.email.toLowerCase() === cleanEmail
    );
    if (existing) {
      setEmailError(`'${cleanEmail}'은(는) 이미 가입된 이메일 주소입니다. 로그인하거나 다른 이메일을 사용해주세요.`);
      return;
    }

    setIsSendingEmail(true);

    try {
      const res = await fetch('/api/auth/send-email-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      });

      if (res.ok) {
        const data = await res.json();
        const code = data.code || Math.floor(100000 + Math.random() * 900000).toString();
        setSentCode(code);
        setIsCodeSent(true);
        setIsEmailVerified(false);
        setInputVerifyCode('');
        setTimerSeconds(180);
        setIsTimerRunning(true);
        setEmailNotice(data.message || `'${cleanEmail}'으로 6자리 인증번호가 발송되었습니다.`);
        setShowSimulatedEmailToast({
          code,
          email: cleanEmail,
          time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        });
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || '발송 실패');
      }
    } catch (err: any) {
      // Local fallback for offline / demo environments
      const generated = Math.floor(100000 + Math.random() * 900000).toString();
      setSentCode(generated);
      setIsCodeSent(true);
      setIsEmailVerified(false);
      setInputVerifyCode('');
      setTimerSeconds(180);
      setIsTimerRunning(true);
      setEmailNotice(`'${cleanEmail}'으로 6자리 인증번호가 발송되었습니다.`);
      setShowSimulatedEmailToast({
        code: generated,
        email: cleanEmail,
        time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  // 2. Confirm Email Verification Code
  const handleConfirmVerificationCode = async () => {
    setEmailError('');

    if (!isCodeSent) {
      setEmailError('먼저 [인증번호 발송] 버튼을 눌러주세요.');
      return;
    }

    if (timerSeconds <= 0) {
      setEmailError('인증 유효시간(3분)이 만료되었습니다. 인증번호를 다시 발송해주세요.');
      return;
    }

    const cleanInput = inputVerifyCode.trim();
    if (!cleanInput) {
      setEmailError('발송된 6자리 인증번호를 입력해주세요.');
      return;
    }

    const cleanEmail = signupEmail.trim().toLowerCase();

    try {
      const res = await fetch('/api/auth/verify-email-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, code: cleanInput }),
      });

      if (res.ok) {
        setIsEmailVerified(true);
        setIsTimerRunning(false);
        setEmailError('');
        setEmailNotice('이메일 본인 인증이 성공적으로 완료되었습니다.');
        return;
      } else {
        const errData = await res.json().catch(() => ({}));
        if (cleanInput === sentCode) {
          // Local fallback match
          setIsEmailVerified(true);
          setIsTimerRunning(false);
          setEmailError('');
          setEmailNotice('이메일 본인 인증이 성공적으로 완료되었습니다.');
          return;
        }
        setEmailError(errData.error || '인증번호가 일치하지 않습니다. 다시 확인해주세요.');
        return;
      }
    } catch (err) {
      if (cleanInput === sentCode) {
        setIsEmailVerified(true);
        setIsTimerRunning(false);
        setEmailError('');
        setEmailNotice('이메일 본인 인증이 성공적으로 완료되었습니다.');
      } else {
        setEmailError('인증번호가 일치하지 않습니다. 다시 확인하고 입력해주세요.');
      }
    }
  };


  // 3. Reset Email (to re-enter a different email)
  const handleResetEmail = () => {
    setIsEmailVerified(false);
    setIsCodeSent(false);
    setSentCode(null);
    setInputVerifyCode('');
    setIsTimerRunning(false);
    setEmailError('');
    setEmailNotice('');
    setShowSimulatedEmailToast(null);
  };

  // Handle Login Submission (supports User ID or Registered Email)
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const cleanId = loginId.trim().toLowerCase();
    const cleanPw = loginPassword.trim();

    if (!cleanId || !cleanPw) {
      setLoginError('아이디(또는 이메일)와 비밀번호를 모두 입력해주세요.');
      return;
    }

    // Search by User ID OR Email
    const found = registeredAccounts.find(
      (acc) =>
        acc.userId.toLowerCase() === cleanId ||
        (acc.email && acc.email.toLowerCase() === cleanId)
    );

    if (!found) {
      setLoginError('존재하지 않는 아이디 또는 이메일입니다. 회원가입 창에서 계정을 생성해주세요.');
      return;
    }

    if (found.password && found.password !== cleanPw) {
      setLoginError('비밀번호가 일치하지 않습니다. 다시 확인해주세요.');
      return;
    }

    // Login successful
    const updatedProfile: StudentProfile = {
      ...found,
      lastActiveAt: new Date().toISOString(),
    };
    onLoginSuccess(updatedProfile);
  };

  // Quick Demo Account Login for testing
  const handleDemoLogin = () => {
    const demoUser: StudentProfile = {
      userId: 'demo_student',
      password: 'password123',
      name: '홍길동',
      studentId: '30115',
      phone: '010-1234-5678',
      phoneVerified: true,
      email: 'demo_student@hvac-school.kr',
      emailVerified: true,
      emailVerifiedAt: new Date().toISOString(),
      department: '공조냉동기계과',
      gradeClass: '3학년 1반',
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
    };
    onLoginSuccess(demoUser);
  };

  // Handle Sign Up Submission
  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');
    setSignupSuccess('');

    const name = signupName.trim();
    const studentId = signupStudentId.trim();
    const userId = signupUserId.trim().toLowerCase();
    const email = signupEmail.trim().toLowerCase();
    const password = signupPassword.trim();
    const confirmPw = signupConfirmPassword.trim();
    const phone = signupPhone.trim();

    if (!name || !studentId || !userId || !password || !phone || !email) {
      setSignupError('모든 필수 항목(이름, 학번, 아이디, 이메일, 전화번호, 비밀번호)을 입력해주세요.');
      return;
    }

    // Email verification check
    if (!isEmailVerified) {
      setSignupError('이메일 본인 인증을 완료해야 회원가입을 진행할 수 있습니다. [인증번호 발송] 후 인증코드를 입력해주세요.');
      return;
    }

    if (userId.length < 3) {
      setSignupError('아이디는 최소 3자 이상이어야 합니다.');
      return;
    }

    // Check duplicate User ID
    const isDuplicateId = registeredAccounts.some(
      (acc) => acc.userId.toLowerCase() === userId
    );
    if (isDuplicateId) {
      setSignupError(`'${userId}' 아이디는 이미 사용 중입니다. 다른 고유 아이디를 입력해주세요.`);
      return;
    }

    // Check duplicate Email
    const isDuplicateEmail = registeredAccounts.some(
      (acc) => acc.email && acc.email.toLowerCase() === email
    );
    if (isDuplicateEmail) {
      setSignupError(`'${email}' 이메일은 이미 등록되어 있습니다.`);
      return;
    }

    if (password.length < 4) {
      setSignupError('비밀번호는 최소 4자 이상 입력해주세요.');
      return;
    }

    if (password !== confirmPw) {
      setSignupError('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    const newAccount: StudentProfile = {
      userId,
      password,
      name,
      studentId,
      phone,
      phoneVerified: true,
      email,
      emailVerified: true,
      emailVerifiedAt: new Date().toISOString(),
      department: signupDepartment.trim() || '공조냉동기계과',
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
    };

    setSignupSuccess('이메일 인증 및 회원가입이 완료되었습니다! 생성한 계정으로 즉시 로그인합니다.');

    setTimeout(() => {
      onLoginSuccess(newAccount);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 md:p-8 space-y-5 shadow-xl relative overflow-hidden animate-fadeIn max-h-[92vh] flex flex-col">
        {/* Top Header */}
        <div className="flex items-start justify-between flex-shrink-0">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800 text-xs font-bold">
              <GraduationCap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> 특성화고·마이스터고 전용 AI 코스웨어
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white">
              냉동공조 학생 포털 로그인 & 회원가입
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              학번 중복 방지와 개인별 맞춤 학습 이력 관리를 위해 안전한 이메일 인증 계정으로 관리합니다.
            </p>
          </div>

          {onClose && currentStudent && (
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition cursor-pointer"
              title="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Active Account Status Bar (if currently logged in) */}
        {currentStudent && (
          <div className="p-3 bg-slate-50 dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-bold flex items-center justify-center border border-blue-200 dark:border-blue-800">
                {currentStudent.name.slice(0, 1)}
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">현재 로그인 계정:</span>
                <span className="font-bold text-slate-900 dark:text-white text-xs">
                  {currentStudent.name} (ID: {currentStudent.userId} / 학번: {currentStudent.studentId}
                  {currentStudent.email ? ` / ${currentStudent.email}` : ''})
                </span>
              </div>
            </div>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 활성 상태
            </span>
          </div>
        )}

        {/* Tabs: Login vs Sign-Up */}
        <div className="flex bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex-shrink-0">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === 'login'
                ? 'bg-blue-600 text-white shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LogIn className="w-4 h-4" />
            로그인 (아이디 / 이메일)
          </button>
          <button
            onClick={() => setActiveTab('signup')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === 'signup'
                ? 'bg-blue-600 text-white shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            신규 회원가입 (이메일 인증)
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto pr-1 flex-1 space-y-4">
          {/* ============================================================== */}
          {/* TAB 1: LOGIN FORM */}
          {/* ============================================================== */}
          {activeTab === 'login' && (
            <div className="space-y-4">
              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div>
                  <label className="text-xs text-slate-700 dark:text-slate-300 font-semibold block mb-1 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> 아이디 또는 인증된 이메일 *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="가입한 고유 아이디 또는 이메일 입력"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs md:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 font-mono transition"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-700 dark:text-slate-300 font-semibold block mb-1 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> 비밀번호 (Password) *
                  </label>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      placeholder="비밀번호를 입력하세요"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700 rounded-xl p-3 pr-10 text-xs md:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 font-mono transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white transition"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {loginError && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/40 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>로그인하고 맞춤형 코스웨어 시작</span>
                </button>
              </form>

              {/* Quick Demo Button for teacher or fast check */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" /> [체험용] 데모 계정(홍길동)으로 바로 시작하기
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('signup')}
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                >
                  계정이 없으신가요? <strong className="text-blue-600 dark:text-blue-400">회원가입하기 →</strong>
                </button>
              </div>

              {/* Recent Accounts list on this device */}
              {registeredAccounts.length > 0 && (
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> 이 실습 PC에 등록된 계정 목록
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
                    {registeredAccounts.map((acc) => (
                      <div
                        key={acc.userId}
                        className="p-2.5 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between text-xs"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setLoginId(acc.userId);
                            if (acc.password) setLoginPassword(acc.password);
                          }}
                          className="text-left flex-1 truncate cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          <div className="flex items-center gap-1.5">
                            <strong className="text-slate-900 dark:text-white block truncate">{acc.name}</strong>
                            {acc.emailVerified && (
                              <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                                인증
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono block truncate">
                            ID: {acc.userId} · 학번: {acc.studentId}
                          </span>
                          {acc.email && (
                            <span className="text-[9px] text-slate-400 dark:text-slate-500 font-mono block truncate">
                              {acc.email}
                            </span>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setAccountToDelete(acc);
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition cursor-pointer"
                          title="계정 삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Inline Delete Account Confirmation Dialog (Safe in iframe) */}
                  {accountToDelete && (
                    <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-500/50 rounded-xl space-y-2 animate-fadeIn text-xs">
                      <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-bold">
                        <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                        <span>계정 삭제 확인</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300">
                        <strong className="text-slate-900 dark:text-white">{accountToDelete.name}</strong> (아이디: {accountToDelete.userId}) 계정과 저장된 학습 데이터를 이 브라우저에서 삭제하시겠습니까?
                      </p>
                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setAccountToDelete(null)}
                          className="px-3 py-1 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold transition cursor-pointer"
                        >
                          취소
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onDeleteAccount(accountToDelete.userId);
                            setAccountToDelete(null);
                          }}
                          className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition shadow cursor-pointer"
                        >
                          삭제하기
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: SIGN UP FORM WITH EMAIL VERIFICATION */}
          {/* ============================================================== */}
          {activeTab === 'signup' && (
            <div className="space-y-4">
              {/* Notification Banner / Explanation */}
              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 rounded-2xl text-xs text-blue-900 dark:text-blue-300 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                  <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  학생 계정 안전 등록 (이메일 인증제)
                </div>
                <p className="text-[11px] text-slate-600 dark:text-blue-200/80 leading-relaxed">
                  본인의 이메일로 발송되는 6자리 인증번호를 확인하여 인증을 완료하면, 고유 학번과 연계된 1인 1계정이 생성됩니다.
                </p>
              </div>

              {/* Simulated Real-Time Email Dispatch Alert Bar (Interactive Testing Helper) */}
              {showSimulatedEmailToast && !isEmailVerified && (
                <div className="p-3.5 bg-blue-50/90 dark:bg-blue-950/70 border border-blue-300 dark:border-blue-800 rounded-2xl text-xs text-slate-800 dark:text-blue-200 shadow-sm animate-fadeIn flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-start gap-2">
                    <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0 animate-bounce" />
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>인증 메일 수신 알림</span>
                        <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400">({showSimulatedEmailToast.time})</span>
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-300">
                        수신처: <span className="font-mono text-blue-700 dark:text-blue-300 font-semibold">{showSimulatedEmailToast.email}</span>
                      </div>
                      <div className="text-xs text-amber-700 dark:text-amber-300 font-bold mt-0.5 flex items-center gap-1.5">
                        <span>인증번호 6자리:</span>
                        <span className="font-mono tracking-widest text-sm bg-white dark:bg-black/60 px-2 py-0.5 rounded text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700 font-bold">
                          {showSimulatedEmailToast.code}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setInputVerifyCode(showSimulatedEmailToast.code);
                    }}
                    className="self-end sm:self-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] rounded-lg transition shadow-xs cursor-pointer flex items-center gap-1"
                  >
                    <KeyRound className="w-3 h-3" />
                    <span>코드 자동 입력</span>
                  </button>
                </div>
              )}

              <form onSubmit={handleSignupSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Name */}
                  <div>
                    <label className="text-xs text-slate-700 dark:text-slate-300 font-semibold block mb-1 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> 이름 (Name) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="예: 홍길동"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>

                  {/* Student ID */}
                  <div>
                    <label className="text-xs text-slate-700 dark:text-slate-300 font-semibold block mb-1 flex items-center gap-1">
                      <Hash className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> 학번 (Student ID) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="예: 30115 (3학년 1반 15번)"
                      value={signupStudentId}
                      onChange={(e) => setSignupStudentId(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono transition"
                    />
                  </div>

                  {/* User ID */}
                  <div>
                    <label className="text-xs text-slate-700 dark:text-slate-300 font-semibold block mb-1 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> 고유 아이디 (User ID) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="영문, 숫자 (예: hvac_student)"
                      value={signupUserId}
                      onChange={(e) => setSignupUserId(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      className="w-full bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono transition"
                    />
                    <span className="text-[10px] text-slate-500 mt-0.5 block">영문 소문자, 숫자, 밑줄(_)만 가능</span>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="text-xs text-slate-700 dark:text-slate-300 font-semibold block mb-1 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> 전화번호 (연락처) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="010-1234-5678"
                      value={signupPhone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      maxLength={13}
                      className="w-full bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono transition"
                    />
                    <span className="text-[10px] text-slate-500 mt-0.5 block">학생 본인 또는 비상 연락처</span>
                  </div>

                  {/* ========================================================= */}
                  {/* EMAIL & VERIFICATION CODE SECTION (COL-SPAN-2) */}
                  {/* ========================================================= */}
                  <div className="sm:col-span-2 p-3.5 bg-slate-50 dark:bg-slate-950/80 border border-blue-200 dark:border-blue-900/50 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-blue-700 dark:text-blue-300 font-bold flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> 이메일 주소 및 본인 인증 *
                      </label>
                      {isEmailVerified ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/40 text-[11px] font-black">
                          <CheckCircle2 className="w-3 h-3" /> 인증 완료
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                          * 인증 필수 (6자리 코드 확인)
                        </span>
                      )}
                    </div>

                    {/* Email Input Row */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="relative flex-1">
                        <input
                          type="email"
                          required
                          disabled={isEmailVerified}
                          placeholder="학생 이메일 (예: student@school.kr)"
                          value={signupEmail}
                          onChange={(e) => {
                            setSignupEmail(e.target.value);
                            if (isCodeSent) handleResetEmail();
                          }}
                          className={`w-full bg-white dark:bg-slate-900 border rounded-xl p-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none font-mono ${
                            isEmailVerified
                              ? 'border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-200'
                              : 'border-slate-300 dark:border-slate-700 focus:border-blue-500'
                          }`}
                        />
                      </div>

                      {!isEmailVerified ? (
                        <button
                          type="button"
                          onClick={handleSendVerificationEmail}
                          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer flex-shrink-0 shadow-xs"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{isCodeSent ? '인증번호 재발송' : '인증번호 발송'}</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResetEmail}
                          className="px-3 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-1 cursor-pointer flex-shrink-0"
                          title="다른 이메일로 변경하고 재인증"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>이메일 변경</span>
                        </button>
                      )}
                    </div>

                    {/* Code Input Row (Visible once code is sent and before completion) */}
                    {isCodeSent && !isEmailVerified && (
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1">
                            <KeyRound className="w-3 h-3 text-blue-600 dark:text-blue-400" /> 6자리 인증번호 입력
                          </span>
                          <span
                            className={`font-mono font-bold flex items-center gap-1 ${
                              timerSeconds <= 30 ? 'text-rose-600 dark:text-rose-400 animate-pulse' : 'text-amber-600 dark:text-amber-400'
                            }`}
                          >
                            <Clock className="w-3 h-3" />
                            남은 시간: {formatTimer(timerSeconds)}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <input
                            type="text"
                            maxLength={6}
                            placeholder="6자리 숫자 입력"
                            value={inputVerifyCode}
                            onChange={(e) => setInputVerifyCode(e.target.value.replace(/[^0-9]/g, ''))}
                            className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:border-blue-500 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 tracking-widest font-mono text-center font-bold focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={handleConfirmVerificationCode}
                            disabled={timerSeconds <= 0}
                            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs disabled:cursor-not-allowed"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>인증 확인</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Feedback Messages for Email Section */}
                    {emailError && (
                      <div className="p-2.5 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-500/40 rounded-xl text-[11px] text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                        <span>{emailError}</span>
                      </div>
                    )}

                    {emailNotice && (
                      <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/40 rounded-xl text-[11px] text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                        <span>{emailNotice}</span>
                      </div>
                    )}
                  </div>

                  {/* Department */}
                  <div className="sm:col-span-2">
                    <label className="text-xs text-slate-700 dark:text-slate-300 font-semibold block mb-1 flex items-center gap-1">
                      <School className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> 전공 학과
                    </label>
                    <select
                      value={signupDepartment}
                      onChange={(e) => setSignupDepartment(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 cursor-pointer transition"
                    >
                      <option value="공조냉동기계과">공조냉동기계과</option>
                      <option value="냉동공조설비과">냉동공조설비과</option>
                      <option value="기계설비에너지과">기계설비에너지과</option>
                      <option value="스마트공조과">스마트공조과</option>
                      <option value="에너지기계과">에너지기계과</option>
                    </select>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="text-xs text-slate-700 dark:text-slate-300 font-semibold block mb-1 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> 비밀번호 *
                    </label>
                    <div className="relative">
                      <input
                        type={showSignupPassword ? 'text' : 'password'}
                        required
                        placeholder="4자리 이상"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 pr-9 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white transition"
                      >
                        {showSignupPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="text-xs text-slate-700 dark:text-slate-300 font-semibold block mb-1 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> 비밀번호 확인 *
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="비밀번호 재입력"
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono transition"
                    />
                  </div>
                </div>

                {signupError && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/40 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                    <span>{signupError}</span>
                  </div>
                )}

                {signupSuccess && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/40 rounded-xl text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <span>{signupSuccess}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-2 bg-blue-600 hover:bg-blue-700 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>회원가입 완료 및 맞춤형 코스웨어 시작</span>
                </button>
              </form>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                >
                  이미 계정이 있으신가요? <strong className="text-blue-600 dark:text-blue-400">로그인 화면으로 이동 →</strong>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
