import React, { useState, useEffect } from 'react';
import {
  Database,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Server,
  Key,
  Globe,
  HardDrive,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';

interface DatabaseSetupViewProps {
  onBackToLogin: () => void;
}

export const DatabaseSetupView: React.FC<DatabaseSetupViewProps> = ({ onBackToLogin }) => {
  const [host, setHost] = useState('localhost');
  const [port, setPort] = useState('3306');
  const [database, setDatabase] = useState('u105632535_test');
  const [username, setUsername] = useState('u105632535_test');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; candidateUrl?: string; error?: string } | null>(null);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState('');

  const [currentDbStatus, setCurrentDbStatus] = useState<{ isConnected: boolean; message: string; checking: boolean }>({
    isConnected: false,
    message: 'Checking current connection...',
    checking: true
  });

  const getApiBaseUrl = (): string => {
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      return '/api/v1';
    }
    return import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
  };

  const checkHealth = async () => {
    setCurrentDbStatus((prev) => ({ ...prev, checking: true }));
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/health`);
      const data = await res.json();
      if (data.status === 'UP') {
        setCurrentDbStatus({
          isConnected: true,
          message: 'Database server is ONLINE and connected to Express backend.',
          checking: false
        });
      } else {
        setCurrentDbStatus({
          isConnected: false,
          message: data.error || data.database || 'Database connection error.',
          checking: false
        });
      }
    } catch (err: any) {
      setCurrentDbStatus({
        isConnected: false,
        message: err.message || 'Failed to reach API server endpoint.',
        checking: false
      });
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const handleTestConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTesting(true);
    setTestResult(null);
    setSaveSuccessMessage('');

    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/db-setup/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ host, port, database, username, password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setTestResult({
          success: true,
          message: data.message || '✅ Connection Successful! 100% Valid Credentials.',
          candidateUrl: data.candidateUrl
        });
      } else {
        setTestResult({
          success: false,
          message: data.message || '❌ Connection Failed',
          error: data.error || 'Invalid credentials or host address.'
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: '❌ Request Failed',
        error: err.message || 'Could not send test request to API server.'
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveToEnv = async () => {
    if (!testResult?.candidateUrl) return;
    setIsSaving(true);
    setSaveSuccessMessage('');

    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/db-setup/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ databaseUrl: testResult.candidateUrl }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSaveSuccessMessage(data.message || '🎉 .env file updated successfully!');
        checkHealth();
      } else {
        setTestResult((prev) => prev ? { ...prev, error: data.error || data.message } : null);
      }
    } catch (err: any) {
      setTestResult((prev) => prev ? { ...prev, error: err.message || 'Failed to save configuration.' } : null);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-10 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      {/* Background Decorative Spheres */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />

      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center relative z-10 mb-6">
        <div className="flex items-center justify-between px-4 mb-4">
          <button
            onClick={onBackToLogin}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </button>
          <button
            onClick={checkHealth}
            disabled={currentDbStatus.checking}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${currentDbStatus.checking ? 'animate-spin' : ''}`} /> Refresh Status
          </button>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold mx-auto shadow-xl shadow-blue-500/30 mb-3">
          <Database className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-extrabold text-white">Database Setup & Connection Tester</h2>
        <p className="mt-1 text-xs text-slate-400">
          Verify and update Hostinger MySQL database credentials dynamically
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl relative z-10 px-4">
        <div className="bg-white py-6 px-6 sm:px-8 rounded-3xl shadow-dropdown border border-gray-100 space-y-6">
          {/* Active Database Status Card */}
          <div className={`p-4 rounded-2xl border flex items-start gap-3 text-xs ${
            currentDbStatus.isConnected
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}>
            {currentDbStatus.isConnected ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <div className="font-extrabold text-xs uppercase tracking-wide flex items-center justify-between">
                <span>Current Status: {currentDbStatus.isConnected ? 'ONLINE' : 'CONNECTION FAIL'}</span>
              </div>
              <p className="mt-1 text-[11px] leading-relaxed break-words">{currentDbStatus.message}</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleTestConnection} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-blue-600" /> Database Host
                </label>
                <input
                  type="text"
                  required
                  placeholder="localhost or 127.0.0.1"
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-blue-600" /> MySQL Port
                </label>
                <input
                  type="text"
                  required
                  placeholder="3306"
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-blue-600" /> Database Name
              </label>
              <input
                type="text"
                required
                placeholder="u105632535_test"
                value={database}
                onChange={(e) => setDatabase(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Database Username
              </label>
              <input
                type="text"
                required
                placeholder="u105632535_test"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-blue-600" /> Database Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter MySQL password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-3.5 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isTesting}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-500/25 flex items-center justify-center gap-2"
            >
              {isTesting ? (
                <span>Testing Connection to MySQL...</span>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Test Connection Credentials</span>
                </>
              )}
            </button>
          </form>

          {/* Test Results Feedback */}
          {testResult && (
            <div className={`p-4 rounded-2xl border text-xs space-y-2 ${
              testResult.success
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}>
              <div className="font-extrabold flex items-center gap-2 text-sm">
                {testResult.success ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <XCircle className="w-5 h-5 text-rose-600" />}
                <span>{testResult.message}</span>
              </div>
              {testResult.error && (
                <p className="text-[11px] leading-relaxed break-words font-medium">{testResult.error}</p>
              )}

              {testResult.success && testResult.candidateUrl && (
                <div className="pt-2 border-t border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-[10px] text-emerald-800 truncate font-mono max-w-xs">
                    {testResult.candidateUrl}
                  </div>
                  <button
                    onClick={handleSaveToEnv}
                    disabled={isSaving}
                    className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isSaving ? 'Saving...' : 'Save & Update .env'}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {saveSuccessMessage && (
            <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{saveSuccessMessage}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
