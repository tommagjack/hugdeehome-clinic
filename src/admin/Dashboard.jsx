import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Layers, 
  ClipboardCheck, 
  BookOpen, 
  Users, 
  Plus, 
  MessageCircle, 
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Clock
} from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import LoadingState from '../components/common/LoadingState';
import { storage } from '../services/storage';

export default function Dashboard() {
  const [stats, setStats] = useState({
    servicesCount: 0,
    assessmentsCount: 0,
    guidesCount: 0,
    teamCount: 0,
    publishedCount: 0,
    draftCount: 0,
    inquiriesCount: 0
  });
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [services, assessments, guides, team, inquiries] = await Promise.all([
          storage.getServices(),
          storage.getAssessments(),
          storage.getHomeGuides(),
          storage.getTeam(),
          storage.getInquiries()
        ]);

        const allItems = [...services, ...assessments, ...guides];
        const published = allItems.filter(i => i.status === 'published').length;
        const draft = allItems.filter(i => i.status === 'draft').length;

        setStats({
          servicesCount: services.length,
          assessmentsCount: assessments.length,
          guidesCount: guides.length,
          teamCount: team.length,
          publishedCount: published,
          draftCount: draft,
          inquiriesCount: inquiries.length
        });
        setRecentInquiries(inquiries.slice(0, 5));
      } catch (err) {
        console.error('Failed to load dashboard statistics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return <LoadingState message="กำลังโหลดข้อมูลสรุป..." />;
  }

  const statCards = [
    { title: 'บริการทั้งหมด', count: stats.servicesCount, icon: Layers, path: '/admin/services', color: 'blue' },
    { title: 'แบบประเมินออนไลน์', count: stats.assessmentsCount, icon: ClipboardCheck, path: '/admin/assessment', color: 'yellow' },
    { title: 'คู่มือ & บทความ', count: stats.guidesCount, icon: BookOpen, path: '/admin/home-guide', color: 'brown' },
    { title: 'บุคลากร & ทีมงาน', count: stats.teamCount, icon: Users, path: '/admin/team', color: 'pink' }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Welcome & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-soft">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-brand-text mb-1">
            สวัสดี, ผู้ดูแลระบบบ้านฮักดี
          </h1>
          <p className="text-xs sm:text-sm text-brand-text-muted">
            ยินดีต้อนรับสู่ระบบจัดการเว็บไซต์คลินิกพัฒนาการเด็กบ้านฮักดี
          </p>
        </div>

        {/* Quick Action Shortcuts */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            to="/admin/services"
            variant="outline"
            size="sm"
            icon={Plus}
          >
            เพิ่มบริการ
          </Button>
          <Button
            to="/admin/assessment"
            variant="outline"
            size="sm"
            icon={Plus}
          >
            เพิ่มแบบประเมิน
          </Button>
          <Button
            to="/admin/home-guide"
            variant="primary"
            size="sm"
            icon={Plus}
            className="font-semibold"
          >
            เพิ่มบทความ
          </Button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              to={card.path}
              className="bg-white p-6 rounded-2xl border border-brand-border shadow-soft hover:shadow-soft-lg hover:border-brand-brown/40 transition-all duration-200 flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-brand-text-muted uppercase tracking-wider">
                  {card.title}
                </span>
                <div className="w-10 h-10 rounded-xl bg-brand-cream text-brand-brown flex items-center justify-center group-hover:bg-brand-blue group-hover:text-brand-text transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-brand-text">
                {card.count}
              </div>
              <div className="mt-3 pt-3 border-t border-brand-border/60 flex items-center justify-between text-xs text-brand-brown font-medium">
                <span>จัดการข้อมูล</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Content Status & Inquiries Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Content Status (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-soft space-y-6">
          <h2 className="text-lg font-bold text-brand-text border-b border-brand-border/60 pb-3">
            สถานะเนื้อหาบนเว็บไซต์
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-900">เผยแพร่แล้ว (Published)</span>
              </div>
              <span className="text-lg font-bold text-emerald-900">{stats.publishedCount}</span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-50 border border-amber-200">
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-amber-600" />
                <span className="text-sm font-semibold text-amber-900">ฉบับร่าง (Drafts)</span>
              </div>
              <span className="text-lg font-bold text-amber-900">{stats.draftCount}</span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-brand-cream border border-brand-border">
              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-5 h-5 text-brand-brown" />
                <span className="text-sm font-semibold text-brand-text">ข้อความสอบถาม</span>
              </div>
              <span className="text-lg font-bold text-brand-brown">{stats.inquiriesCount}</span>
            </div>
          </div>
        </div>

        {/* Right: Recent Parent Inquiries (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-brand-border/60 pb-3">
            <h2 className="text-lg font-bold text-brand-text">
              ข้อความสอบถามล่าสุดจากผู้ปกครอง
            </h2>
            <Link to="/admin/contact" className="text-xs font-semibold text-brand-brown hover:underline">
              ดูทั้งหมด ({stats.inquiriesCount})
            </Link>
          </div>

          {recentInquiries.length > 0 ? (
            <div className="divide-y divide-brand-border/60">
              {recentInquiries.map((inq) => (
                <div key={inq.id} className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-brand-text">{inq.parentName}</span>
                      <Badge variant="blue" size="sm">{inq.topic}</Badge>
                      {inq.childAge && (
                        <span className="text-xs text-brand-text-muted">({inq.childAge})</span>
                      )}
                    </div>
                    <p className="text-xs text-brand-text-muted mt-1 line-clamp-1">
                      {inq.message || 'ไม่มีข้อความเพิ่มเติม'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs flex-shrink-0">
                    <a href={`tel:${inq.phone}`} className="text-brand-brown font-semibold hover:underline">
                      {inq.phone}
                    </a>
                    <span className="text-neutral-400">
                      {new Date(inq.createdAt).toLocaleDateString('th-TH')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-brand-text-muted">
              ยังไม่มีข้อความสอบถามเข้ามา
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
