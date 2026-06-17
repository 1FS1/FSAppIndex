import { useMemo, useState } from 'react';
import {
  AppWindow,
  ArrowUpRight,
  Download,
  Globe2,
  Search,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';

const downloadUrl = (fileName) => `${import.meta.env.BASE_URL}downloads/${fileName}`;

const apps = [
  // {
  //   id: 'portal',
  //   name: 'FS 入口網站',
  //   description: '公司內部系統、表單與常用服務入口。',
  //   type: 'web',
  //   url: 'https://example.com',
  //   meta: 'Web',
  // },
  // {
  //   id: 'design-windows',
  //   name: '設計工具 Windows 版',
  //   description: '下載 Windows 安裝檔。請將實際 exe 放在 public/downloads。',
  //   type: 'download',
  //   url: downloadUrl('your-app.exe'),
  //   meta: 'Windows EXE',
  // },
  // {
  //   id: 'app-debug-apk',
  //   name: '星杯物語載點',
  //   description: '下載 Windows 安裝檔。請將實際 exe 放在 public/downloads。',
  //   type: 'download',
  //   url: downloadUrl('app-debug.apk'),
  //   meta: 'Android APK',
  // },
  // {
  //   id: 'mobile-store',
  //   name: '手機版 APP',
  //   description: '前往商店頁面安裝行動版應用程式。',
  //   type: 'store',
  //   url: 'https://play.google.com/store',
  //   meta: 'App Store',
  // },
  // {
  //   id: 'secure-tool',
  //   name: '資安檢核平台',
  //   description: '快速開啟資安檢核與申請紀錄。',
  //   type: 'web',
  //   url: 'https://example.com/security',
  //   meta: 'Web',
  // },
  
  {
    id: 'portal',
    name: '星杯物語網頁版',
    description: '前往網頁版星杯物語',
    type: 'web',
    url: 'https://starcupstory-frontend.onrender.com/',
    meta: 'Web',
  },
  {
    id: 'app-debug-apk',
    name: '星杯物語載點',
    description: 'Android APK 載點',
    type: 'download-apk',
    url: downloadUrl('app-debug.apk'),
    meta: 'Android APK',
  },
];

const filters = [
  { value: 'all', label: '全部' },
  { value: 'web', label: '網頁' },
  { value: 'download', label: '下載' },
  { value: 'store', label: '商店' },
];

function getTypeIcon(type) {
  if (type === 'download') return Download;
  if (type === 'store') return Smartphone;
  return Globe2;
}

function getAction(type) {
  if (type === 'download') return { label: '下載 APP', icon: Download, download: true };
  if (type === 'download-apk') return { label: '下載 APK', icon: Download, download: true };
  if (type === 'store') return { label: '前往商店', icon: ArrowUpRight };
  return { label: '開啟網頁', icon: ArrowUpRight };
}

function AppCard({ app }) {
  const TypeIcon = getTypeIcon(app.type);
  const action = getAction(app.type);
  const ActionIcon = action.icon;

  return (
    <article className="app-card">
      <div className="app-card__icon" aria-hidden="true">
        <TypeIcon size={24} />
      </div>
      <div className="app-card__body">
        <div className="app-card__header">
          <h2>{app.name}</h2>
          <span className={`badge badge--${app.type}`}>{app.meta}</span>
        </div>
        <p>{app.description}</p>
        <a
          className="action-button"
          href={app.url}
          target={app.type === 'download' ? undefined : '_blank'}
          rel={app.type === 'download' ? undefined : 'noreferrer'}
          download={action.download ? true : undefined}
        >
          <ActionIcon size={17} />
          <span>{action.label}</span>
        </a>
      </div>
    </article>
  );
}

export default function App() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const visibleApps = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return apps.filter((app) => {
      const matchesFilter = filter === 'all' || app.type === filter;
      const matchesKeyword =
        !keyword ||
        app.name.toLowerCase().includes(keyword) ||
        app.description.toLowerCase().includes(keyword) ||
        app.meta.toLowerCase().includes(keyword);

      return matchesFilter && matchesKeyword;
    });
  }, [filter, query]);

  return (
    <main className="page-shell">
      <section className="workspace-header">
        <div>
          <p className="eyebrow">FS Application Index</p>
          <h1>FS星星的書籤</h1>
          <p className="subtitle">集中管理星星FS的常用系統、外部網站與 APP 下載連結。</p>
        </div>
        <div className="status-pill">
          <ShieldCheck size={18} />
          <span>已整理 {apps.length} 個項目</span>
        </div>
      </section>

      <section className="toolbar" aria-label="篩選工具列">
        <label className="search-box">
          <Search size={18} />
          <input
            type="search"
            placeholder="搜尋名稱、說明或類型"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>

        <div className="segmented-control" role="tablist" aria-label="連結類型">
          {filters.map((item) => (
            <button
              key={item.value}
              type="button"
              className={filter === item.value ? 'is-active' : ''}
              onClick={() => setFilter(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      <section className="app-grid" aria-label="應用程式清單">
        {visibleApps.map((app) => (
          <AppCard key={app.id} app={app} />
        ))}
      </section>

      {visibleApps.length === 0 && (
        <section className="empty-state">
          <AppWindow size={28} />
          <p>找不到符合條件的項目。</p>
        </section>
      )}
    </main>
  );
}
