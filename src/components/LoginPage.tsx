import React, { useState } from 'react';
import { 
  Building2, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  LogIn, 
  AlertCircle, 
  ShieldCheck,
  School
} from 'lucide-react';
import { AuthUser, InstitutionInfo } from '../types/sarpras';

interface LoginPageProps {
  institution: InstitutionInfo;
  onLoginSuccess: (user: AuthUser) => void;
}

export const DEMO_ACCOUNTS: Array<AuthUser & { password: string; description: string }> = [
  {
    id: 'user-admin',
    username: 'admin',
    password: 'admin123',
    fullName: 'Yana Maulana, S.Pd., M.Kom.',
    role: 'admin_sarpras',
    nipOrId: '19850918 201001 1 012',
    avatarText: 'YM',
    description: 'Akses penuh admin sarpras',
  },
  {
    id: 'user-guru',
    username: 'guru',
    password: 'guru123',
    fullName: 'Siti Rohmah, S.Pd.',
    role: 'guru_peminjam',
    nipOrId: '19900315 201503 2 008',
    avatarText: 'SR',
    description: 'Akses guru / peminjam',
  },
  {
    id: 'user-teknisi',
    username: 'teknisi',
    password: 'teknisi123',
    fullName: 'Agus Triono',
    role: 'teknisi',
    nipOrId: '19881102 201201 1 007',
    avatarText: 'AT',
    description: 'Akses teknisi perbaikan',
  },
];

export const LoginPage: React.FC<LoginPageProps> = ({ institution, onLoginSuccess }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const trimmedUser = username.trim().toLowerCase();
      const matched = DEMO_ACCOUNTS.find(
        acc => acc.username.toLowerCase() === trimmedUser && acc.password === password
      );

      if (matched) {
        const authUser: AuthUser = {
          id: matched.id,
          username: matched.username,
          fullName: matched.fullName,
          role: matched.role,
          nipOrId: matched.nipOrId,
          avatarText: matched.avatarText,
        };
        if (rememberMe) {
          localStorage.setItem('sarpras_auth_user', JSON.stringify(authUser));
        } else {
          sessionStorage.setItem('sarpras_auth_user', JSON.stringify(authUser));
        }
        setIsLoading(false);
        onLoginSuccess(authUser);
      } else {
        setIsLoading(false);
        setErrorMessage('Username atau password yang Anda masukkan salah. Silakan coba kembali.');
      }
    }, 250);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-orange-50/40 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Institutional Branding Lockup with Blue & Orange Theme */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20 mb-3 border-2 border-orange-400">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-blue-950">
            SIM-SARPRAS
          </h1>
          <p className="text-xs font-semibold uppercase tracking-wider text-orange-600 mt-1">
            Sistem Informasi Sarana & Prasarana
          </p>
          <div className="mt-2 text-xs text-blue-800 bg-blue-100/80 py-1 px-3 rounded-full inline-flex items-center gap-1.5 border border-blue-200">
            <School className="w-3.5 h-3.5 text-blue-600" />
            <span>{institution.name} · NPSN: {institution.npsn}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl shadow-blue-900/5 rounded-2xl border border-blue-100 sm:px-10">
          <div className="mb-5 text-left border-b border-blue-50 pb-3">
            <h2 className="text-base font-bold text-blue-950">Masuk ke Sistem</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Silakan masukkan username dan password akun Anda
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2.5 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Username
              </label>
              <div className="relative rounded-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  autoFocus
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative rounded-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full pl-9 pr-10 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Ingat sesi saya</span>
              </label>

              <span className="text-[11px] text-slate-400">Tahun Ajaran {institution.academicYear}</span>
            </div>

            {/* Vibrant Orange Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-orange-600/20 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{isLoading ? 'Memverifikasi...' : 'Masuk ke Aplikasi'}</span>
            </button>
          </form>

          {/* Akun Demo sengaja disembunyikan sesuai permintaan pengguna */}
        </div>

        {/* Footer info */}
        <div className="text-center mt-5 text-[11px] text-slate-500 flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>Sistem Informasi Sarana & Prasarana Sekolah Terpadu</span>
        </div>
      </div>
    </div>
  );
};
