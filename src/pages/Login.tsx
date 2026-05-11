import { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Store } from 'lucide-react';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await setPersistence(auth, browserLocalPersistence);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (err: any) {
      console.error(err);
      setError('حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-8 text-center"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-500">
            <Store className="w-12 h-12" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gray-900">مرحباً بك في سوقي</h1>
            <p className="text-gray-500">سجل الدخول للمتابعة</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-sm font-medium">
            {error}
          </div>
        )}

        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full h-14 flex items-center justify-center gap-4 bg-white border border-gray-200 rounded-2xl font-bold hover:bg-gray-50 transition-all border-b-4 active:border-b-0 active:translate-y-1 text-gray-700"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-6 h-6" />
          <span>{loading ? 'جاري التحميل...' : 'تسجيل الدخول بواسطة جوجل'}</span>
        </button>

        <p className="text-xs text-gray-400">
          من خلال المتابعة، فإنك توافق على شروط الخدمة وسياسة الخصوصية الخاصة بنا.
        </p>
      </motion.div>
    </div>
  );
}
