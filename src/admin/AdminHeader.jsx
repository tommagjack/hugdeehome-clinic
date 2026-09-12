import { useEffect, useState } from 'react';
import { User, Database, Shield } from 'lucide-react';
import { db } from '../utils/db';
import { isSupabaseConfigured } from '../utils/supabase';
import { t } from '../utils/helpers';

export default function AdminHeader({ lang }) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    setCurrentUser(db.getCurrentUser());
  }, []);

  return (
    <header className="h-16 border-b border-primary/10 bg-white px-8 flex justify-between items-center shrink-0">
      
      {/* DB status notice indicator */}
      <div className="flex items-center gap-2">
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xxs font-bold ${
          isSupabaseConfigured
            ? 'bg-clinicGreen-light/30 text-clinicGreen-dark border border-clinicGreen/20'
            : 'bg-primary/10 text-primary-dark border border-primary/20'
        }`}>
          <Database className="w-3.5 h-3.5" />
          <span>
            {isSupabaseConfigured
              ? t(lang, 'Supabase เชื่อมต่อออนไลน์', 'Supabase Online')
              : t(lang, 'โหมดทดลองใช้ (LocalStorage)', 'LocalStorage Offline Demo Mode')}
          </span>
        </div>
      </div>

      {/* Admin Account display */}
      {currentUser && (
        <div className="flex items-center gap-3">
          <div className="flex flex-col text-right">
            <span className="text-sm font-bold text-clinicText leading-none">{currentUser.username}</span>
            <span className="text-[10px] text-clinicMuted mt-1 flex items-center justify-end gap-1">
              <Shield className="w-3 h-3 text-primary-dark" />
              {currentUser.role}
            </span>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary/25 text-primary-dark flex items-center justify-center font-bold">
            <User className="w-4 h-4" />
          </div>
        </div>
      )}

    </header>
  );
}
