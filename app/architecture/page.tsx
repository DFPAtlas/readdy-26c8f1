'use client';

import { useState, Suspense } from 'react';
import AuthGuard from '@/components/AuthGuard';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

function ArchitectureContent() {
  const [activeTab, setActiveTab] = useState('overview');

  const architectureComponents = [
    { category: 'Frontend Layer', components: [{ name: 'React 18', description: 'Modern UI framework with hooks and concurrent features', status: 'Implemented' },{ name: 'Next.js 14', description: 'Full-stack React framework with SSR and API routes', status: 'Implemented' },{ name: 'Tailwind CSS', description: 'Utility-first CSS framework for responsive design', status: 'Implemented' },{ name: 'TypeScript', description: 'Type-safe JavaScript for better development experience', status: 'Implemented' }] },
    { category: 'Backend Services', components: [{ name: 'Node.js API', description: 'RESTful API endpoints for all business logic', status: 'Planned' },{ name: 'GraphQL', description: 'Flexible query language for efficient data fetching', status: 'Planned' },{ name: 'Authentication', description: 'JWT-based authentication with role-based access', status: 'Planned' },{ name: 'WebSocket', description: 'Real-time communication for notifications and updates', status: 'Planned' }] },
    { category: 'Database Layer', components: [{ name: 'PostgreSQL', description: 'Primary relational database for structured data', status: 'Recommended' },{ name: 'MongoDB', description: 'Document database for flexible data structures', status: 'Alternative' },{ name: 'Redis', description: 'In-memory cache for session management and caching', status: 'Recommended' },{ name: 'Elasticsearch', description: 'Search engine for full-text search capabilities', status: 'Planned' }] },
    { category: 'Cloud Infrastructure', components: [{ name: 'AWS/Azure/GCP', description: 'Cloud hosting for scalability and reliability', status: 'Required' },{ name: 'Docker', description: 'Containerization for consistent deployment', status: 'Required' },{ name: 'Kubernetes', description: 'Container orchestration for scaling', status: 'Recommended' },{ name: 'CDN', description: 'Content delivery network for static assets', status: 'Recommended' }] }
  ];

  const securityFeatures = [
    { name: 'SSL/TLS Encryption', description: 'End-to-end encryption for all data transmission', priority: 'Critical' },{ name: 'Data Encryption at Rest', description: 'Database encryption for sensitive information', priority: 'Critical' },{ name: 'Multi-Factor Authentication', description: 'Additional security layer for user accounts', priority: 'High' },{ name: 'Role-Based Access Control', description: 'Granular permissions based on user roles', priority: 'Critical' },{ name: 'API Rate Limiting', description: 'Prevent abuse and ensure system stability', priority: 'High' },{ name: 'Audit Logging', description: 'Comprehensive logging for security monitoring', priority: 'High' },{ name: 'Backup & Recovery', description: 'Automated backups with point-in-time recovery', priority: 'Critical' },{ name: 'Vulnerability Scanning', description: 'Regular security scans and updates', priority: 'Medium' }
  ];

  const implementationPhases = [
    { phase: 'Phase 1 (MVP)', timeline: '3-4 months', priority: 'Critical', features: ['Work order management system','Asset tracking and inventory','User management and authentication','Basic reporting and analytics','Core database structure','REST API foundation'] },
    { phase: 'Phase 2', timeline: '2-3 months', priority: 'High', features: ['Preventive maintenance scheduling','Space management and booking','Financial tracking and budgeting','Mobile-responsive design','Advanced user roles','Integration framework'] },
    { phase: 'Phase 3', timeline: '3-4 months', priority: 'Medium', features: ['Advanced analytics and KPIs','IoT sensor integrations','Compliance management modules','Emergency management system','Mobile applications','Third-party integrations'] }
  ];

  const apiEndpoints = [
    { method: 'GET', endpoint: '/api/work-orders', description: 'Retrieve all work orders with filtering' },{ method: 'POST', endpoint: '/api/work-orders', description: 'Create new work order' },{ method: 'PUT', endpoint: '/api/work-orders/:id', description: 'Update existing work order' },{ method: 'DELETE', endpoint: '/api/work-orders/:id', description: 'Delete work order' },{ method: 'GET', endpoint: '/api/assets', description: 'Retrieve asset inventory' },{ method: 'POST', endpoint: '/api/assets', description: 'Add new asset' },{ method: 'GET', endpoint: '/api/users', description: 'Retrieve user information' },{ method: 'POST', endpoint: '/api/auth/login', description: 'User authentication' },{ method: 'GET', endpoint: '/api/reports/analytics', description: 'Generate analytics reports' },{ method: 'POST', endpoint: '/api/notifications', description: 'Send notifications' }
  ];

  const gs = (s: string) => { switch(s){case'Implemented':return'bg-emerald-100 text-emerald-700';case'Planned':return'bg-cyan-100 text-cyan-700';case'Recommended':return'bg-amber-100 text-amber-700';case'Alternative':return'bg-gray-100 text-gray-700';case'Required':return'bg-red-100 text-red-700';default:return'bg-gray-100 text-gray-700';} };
  const gp = (p: string) => { switch(p){case'Critical':return'bg-red-100 text-red-700';case'High':return'bg-orange-100 text-orange-700';case'Medium':return'bg-amber-100 text-amber-700';default:return'bg-gray-100 text-gray-700';} };
  const gm = (m: string) => { switch(m){case'GET':return'bg-cyan-100 text-cyan-700';case'POST':return'bg-emerald-100 text-emerald-700';case'PUT':return'bg-amber-100 text-amber-700';case'DELETE':return'bg-red-100 text-red-700';default:return'bg-gray-100 text-gray-700';} };

  return (
    <div className="flex min-h-screen bg-[#030912]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="Technical Architecture" />
        <div className="flex-1 p-6 overflow-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-white">Technical Architecture</h1>
            <div className="flex items-center space-x-4">
              <button className="bg-cyan-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-cyan-400 transition-colors whitespace-nowrap cursor-pointer"><i className="ri-code-s-slash-line mr-2"></i>View Documentation</button>
              <button className="bg-white/10 text-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-white/20 transition-colors whitespace-nowrap cursor-pointer"><i className="ri-download-line mr-2"></i>Export Architecture</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[{icon:'ri-code-s-slash-line',color:'bg-cyan-500',label:'System Components',val:'24'},{icon:'ri-server-line',color:'bg-emerald-500',label:'API Endpoints',val:'45'},{icon:'ri-shield-check-line',color:'bg-red-500',label:'Security Features',val:'8'},{icon:'ri-progress-line',color:'bg-violet-500',label:'Implementation Progress',val:'35%'}].map((s:any,i:number)=>(<div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-400 mb-1">{s.label}</p><p className="text-2xl font-bold text-white">{s.val}</p></div><div className={`w-12 h-12 ${s.color} rounded-lg flex items-center justify-center`}><i className={`${s.icon} text-white`}></i></div></div></div>))}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl mb-8">
            <div className="border-b border-white/10"><nav className="flex space-x-8 px-6">{['overview','api','security','implementation'].map((t:string)=>(<button key={t} onClick={()=>setActiveTab(t)} className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer ${activeTab===t?'border-cyan-500 text-cyan-400':'border-transparent text-gray-500 hover:text-gray-300'}`}>{t==='overview'?'System Overview':t==='api'?'API Design':t==='security'?'Security':'Implementation'}</button>))}</nav></div>
            <div className="p-6">
              {activeTab==='overview'&&<div className="space-y-8">{architectureComponents.map((cat:any,i:number)=>(<div key={i}><h3 className="font-medium text-white mb-4">{cat.category}</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{cat.components.map((c:any,j:number)=>(<div key={j} className="p-4 bg-white/5 border border-white/10 rounded-lg"><div className="flex items-start justify-between mb-2"><h4 className="font-medium text-white">{c.name}</h4><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${gs(c.status)}`}>{c.status}</span></div><p className="text-sm text-gray-400">{c.description}</p></div>))}</div></div>))}</div>}
              {activeTab==='api'&&<div className="space-y-6"><div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-6"><h3 className="font-medium text-white mb-4">API Design Principles</h3><ul className="space-y-2 text-sm text-gray-400">{['RESTful architecture with consistent naming conventions','JSON-based request/response format','Comprehensive error handling and status codes','API versioning for backward compatibility'].map((item:string,i:number)=>(<li key={i} className="flex items-center space-x-2"><i className="ri-check-line text-cyan-400"></i><span>{item}</span></li>))}</ul></div><div><h3 className="font-medium text-white mb-4">Core API Endpoints</h3><div className="space-y-3">{apiEndpoints.map((ep:any,i:number)=>(<div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg"><div className="flex items-center space-x-4"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${gm(ep.method)}`}>{ep.method}</span><code className="text-sm font-mono text-gray-400">{ep.endpoint}</code></div><span className="text-sm text-gray-500">{ep.description}</span></div>))}</div></div></div>}
              {activeTab==='security'&&<div className="space-y-6"><div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6"><h3 className="font-medium text-white mb-4">Security-First Approach</h3><p className="text-sm text-gray-400">Our facility management system implements enterprise-grade security measures to protect sensitive data and ensure compliance with industry standards.</p></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{securityFeatures.map((f:any,i:number)=>(<div key={i} className="p-4 bg-white/5 border border-white/10 rounded-lg"><div className="flex items-start justify-between mb-2"><h4 className="font-medium text-white">{f.name}</h4><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${gp(f.priority)}`}>{f.priority}</span></div><p className="text-sm text-gray-400">{f.description}</p></div>))}</div></div>}
              {activeTab==='implementation'&&<div className="space-y-6">{implementationPhases.map((p:any,i:number)=>(<div key={i} className="bg-white/5 border border-white/10 rounded-lg p-6"><div className="flex items-start justify-between mb-4"><div><h3 className="font-medium text-white">{p.phase}</h3><p className="text-sm text-gray-500">Timeline: {p.timeline}</p></div><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${gp(p.priority)}`}>{p.priority}</span></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{p.features.map((f:string,j:number)=>(<div key={j} className="flex items-center space-x-3"><div className="w-2 h-2 bg-cyan-500 rounded-full"></div><span className="text-sm text-gray-400">{f}</span></div>))}</div></div>))}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ArchitecturePage() {
  return (
    <AuthGuard>
      <Suspense fallback={<div className="flex min-h-screen bg-[#030912] items-center justify-center"><i className="ri-loader-4-line animate-spin text-cyan-400 text-3xl"></i></div>}>
        <ArchitectureContent />
      </Suspense>
    </AuthGuard>
  );
}