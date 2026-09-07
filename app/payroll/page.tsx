'use client';

import { useState, Suspense } from 'react';
import AuthGuard from '@/components/AuthGuard';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

function PayrollContent() {
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [showPayslipModal, setShowPayslipModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  const payrollOverview = { totalPayroll: 847650, totalEmployees: 156, overtimeCost: 12800, totalBenefits: 127450, payrollProcessed: 148, payrollPending: 8 };

  const departmentBudgets = [
    { department: 'Maintenance', budget: 185000, spent: 167500, employees: 28, percentage: 90.5 }, { department: 'Security', budget: 142000, spent: 138750, employees: 18, percentage: 97.7 }, { department: 'Cleaning', budget: 95000, spent: 89250, employees: 24, percentage: 94.0 }, { department: 'Administration', budget: 165000, spent: 152500, employees: 15, percentage: 92.4 }, { department: 'IT Support', budget: 128000, spent: 119000, employees: 12, percentage: 93.0 }, { department: 'Reception', budget: 68000, spent: 64500, employees: 8, percentage: 94.9 }, { department: 'Facilities', budget: 158000, spent: 145200, employees: 22, percentage: 91.9 }
  ];

  const employeePayroll = [
    { id: 'EMP-001', name: 'John Martinez', employeeId: 'FM-2001', department: 'Maintenance', position: 'Senior Technician', salary: 48000, overtimeHours: 8, overtimeRate: 28.85, bonus: 1200, grossPay: 49431, deductions: 12358, netPay: 37073, status: 'Processed', avatar: 'https://readdy.ai/api/search-image?query=professional%20middle-aged%20maintenance%20technician%20man%20smiling%20confidently%20wearing%20work%20uniform%20in%20industrial%20facility%20background&width=150&height=150&seq=john-martinez&orientation=squarish' },
    { id: 'EMP-002', name: 'Sarah Chen', employeeId: 'SC-3045', department: 'Security', position: 'Security Supervisor', salary: 52000, overtimeHours: 12, overtimeRate: 31.25, bonus: 800, grossPay: 53175, deductions: 13294, netPay: 39881, status: 'Processed', avatar: 'https://readdy.ai/api/search-image?query=professional%20asian%20woman%20security%20supervisor%20in%20uniform%20smiling%20confidently%20in%20modern%20office%20security%20control%20room%20background&width=150&height=150&seq=sarah-chen&orientation=squarish' },
    { id: 'EMP-003', name: 'Michael Rodriguez', employeeId: 'AD-1567', department: 'Administration', position: 'Office Manager', salary: 58000, overtimeHours: 4, overtimeRate: 34.62, bonus: 1500, grossPay: 59638, deductions: 14910, netPay: 44728, status: 'Processed', avatar: 'https://readdy.ai/api/search-image?query=professional%20hispanic%20man%20office%20manager%20in%20business%20attire%20smiling%20warmly%20in%20modern%20corporate%20office%20environment&width=150&height=150&seq=michael-rodriguez&orientation=squarish' },
    { id: 'EMP-004', name: 'Lisa Wang', employeeId: 'IT-4721', department: 'IT Support', position: 'System Administrator', salary: 65000, overtimeHours: 16, overtimeRate: 39.42, bonus: 2000, grossPay: 67631, deductions: 16908, netPay: 50723, status: 'Processed', avatar: 'https://readdy.ai/api/search-image?query=professional%20asian%20woman%20IT%20system%20administrator%20smiling%20confidently%20in%20modern%20data%20center%20with%20computer%20servers%20background&width=150&height=150&seq=lisa-wang&orientation=squarish' },
    { id: 'EMP-005', name: 'David Thompson', employeeId: 'CL-8934', department: 'Cleaning', position: 'Cleaning Team Lead', salary: 38000, overtimeHours: 6, overtimeRate: 23.08, bonus: 400, grossPay: 38539, deductions: 9635, netPay: 28904, status: 'Processed', avatar: 'https://readdy.ai/api/search-image?query=professional%20african%20american%20man%20cleaning%20team%20leader%20in%20work%20uniform%20smiling%20proudly%20in%20clean%20modern%20office%20facility&width=150&height=150&seq=david-thompson&orientation=squarish' },
    { id: 'EMP-006', name: 'Emma Johnson', employeeId: 'RC-5678', department: 'Reception', position: 'Reception Manager', salary: 42000, overtimeHours: 2, overtimeRate: 25.00, bonus: 600, grossPay: 42650, deductions: 10663, netPay: 31987, status: 'Processed', avatar: 'https://readdy.ai/api/search-image?query=professional%20blonde%20woman%20reception%20manager%20smiling%20warmly%20in%20elegant%20business%20attire%20at%20modern%20corporate%20lobby%20reception%20desk&width=150&height=150&seq=emma-johnson&orientation=squarish' },
    { id: 'EMP-007', name: 'Robert Kim', employeeId: 'FC-9012', department: 'Facilities', position: 'Facilities Coordinator', salary: 45000, overtimeHours: 10, overtimeRate: 26.92, bonus: 750, grossPay: 46019, deductions: 11505, netPay: 34514, status: 'Pending', avatar: 'https://readdy.ai/api/search-image?query=professional%20korean%20man%20facilities%20coordinator%20in%20business%20casual%20attire%20smiling%20confidently%20in%20modern%20office%20building%20maintenance%20area&width=150&height=150&seq=robert-kim&orientation=squarish' },
    { id: 'EMP-008', name: 'Jessica Martinez', employeeId: 'AD-2468', department: 'Administration', position: 'HR Specialist', salary: 55000, overtimeHours: 5, overtimeRate: 32.69, bonus: 1100, grossPay: 56263, deductions: 14066, netPay: 42197, status: 'Pending', avatar: 'https://readdy.ai/api/search-image?query=professional%20hispanic%20woman%20HR%20specialist%20in%20professional%20business%20suit%20smiling%20warmly%20in%20modern%20human%20resources%20office%20environment&width=150&height=150&seq=jessica-martinez&orientation=squarish' }
  ];

  const payrollSchedule = [
    { period: 'January 2024', amount: 847650, dueDate: '2024-01-31', status: 'Completed' }, { period: 'February 2024', amount: 852300, dueDate: '2024-02-29', status: 'Processing' }, { period: 'March 2024', amount: 849750, dueDate: '2024-03-31', status: 'Scheduled' }, { period: 'April 2024', amount: 851200, dueDate: '2024-04-30', status: 'Scheduled' }
  ];

  const filteredEmployees = selectedDepartment === 'all' ? employeePayroll : employeePayroll.filter((emp: any) => emp.department === selectedDepartment);

  const getStatusColor = (status: string) => { switch (status) { case 'Processed': case 'Completed': return 'bg-emerald-100 text-emerald-700'; case 'Pending': return 'bg-amber-100 text-amber-700'; case 'Processing': return 'bg-cyan-100 text-cyan-700'; case 'Scheduled': return 'bg-gray-100 text-gray-700'; default: return 'bg-gray-100 text-gray-700'; } };

  return (
    <div className="flex min-h-screen bg-[#030912]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="Payroll Management" />
        <div className="flex-1 p-6 overflow-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-white">Payroll Management</h1>
            <div className="flex items-center space-x-4">
              <div className="flex bg-white/5 border border-white/10 rounded-lg p-1">
                {['current', 'previous', 'quarterly', 'yearly'].map((period: string) => (<button key={period} onClick={() => setSelectedPeriod(period)} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${selectedPeriod === period ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:text-gray-300'}`}>{period.charAt(0).toUpperCase() + period.slice(1)}</button>))}
              </div>
              <button className="bg-cyan-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-cyan-400 transition-colors whitespace-nowrap cursor-pointer"><i className="ri-download-line mr-2"></i>Export Payroll</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[{icon:'ri-money-dollar-circle-line',color:'bg-cyan-500',label:'Total Payroll',val:'£'+payrollOverview.totalPayroll.toLocaleString(),sub:'+2.3% from last month',subC:'text-emerald-400'},{icon:'ri-team-line',color:'bg-emerald-500',label:'Total Employees',val:payrollOverview.totalEmployees,sub:'+3.2% growth',subC:'text-emerald-400'},{icon:'ri-time-line',color:'bg-amber-500',label:'Overtime Costs',val:'£'+payrollOverview.overtimeCost.toLocaleString(),sub:'340h total',subC:'text-gray-500'},{icon:'ri-gift-line',color:'bg-violet-500',label:'Total Benefits',val:'£'+payrollOverview.totalBenefits.toLocaleString(),sub:'15% of payroll',subC:'text-cyan-400'}].map((s:any,i:number)=>(<div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6"><div className="flex items-center justify-between mb-4"><div className={`w-12 h-12 ${s.color} rounded-lg flex items-center justify-center`}><i className={`${s.icon} text-white`}></i></div></div><h3 className="text-sm text-gray-400 mb-1">{s.label}</h3><p className="text-2xl font-bold text-white">{s.val}</p><p className={`text-sm ${s.subC} mt-1`}>{s.sub}</p></div>))}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-6"><h2 className="text-lg font-semibold text-white">Department Budget Usage</h2><button className="text-cyan-400 hover:text-cyan-300 text-sm font-medium cursor-pointer">View Details</button></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{departmentBudgets.map((dept:any,i:number)=>(<div key={i} className="p-4 bg-white/5 rounded-lg"><div className="flex items-center justify-between mb-3"><h3 className="font-medium text-white">{dept.department}</h3><span className="text-sm text-gray-500">{dept.employees} employees</span></div><div className="space-y-2"><div className="flex justify-between text-sm"><span className="text-gray-500">Budget: £{dept.budget.toLocaleString()}</span><span className="text-gray-300 font-medium">£{dept.spent.toLocaleString()}</span></div><div className="w-full bg-white/10 rounded-full h-2"><div className="bg-cyan-500 h-2 rounded-full" style={{width:`${dept.percentage}%`}}></div></div><div className="flex justify-between text-xs"><span className="text-gray-500">{dept.percentage}% used</span><span className="text-emerald-400">£{(dept.budget-dept.spent).toLocaleString()} remaining</span></div></div></div>))}</div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-white/10"><div className="flex items-center justify-between"><h2 className="text-lg font-semibold text-white">Employee Payroll</h2><div className="flex items-center space-x-4"><select value={selectedDepartment} onChange={(e:any)=>setSelectedDepartment(e.target.value)} className="pr-8 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm text-white"><option value="all">All Departments</option><option value="Maintenance">Maintenance</option><option value="Security">Security</option><option value="Cleaning">Cleaning</option><option value="Administration">Administration</option><option value="IT Support">IT Support</option><option value="Reception">Reception</option><option value="Facilities">Facilities</option></select><div className="flex items-center space-x-2"><span className="text-sm text-gray-500">Processed:</span><span className="text-sm font-medium text-emerald-400">{payrollOverview.payrollProcessed}</span><span className="text-sm text-gray-500">Pending:</span><span className="text-sm font-medium text-amber-400">{payrollOverview.payrollPending}</span></div></div></div></div>
            <div className="p-6"><div className="grid grid-cols-1 gap-4">{filteredEmployees.map((employee:any)=>(<div key={employee.id} className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10"><div className="flex items-center justify-between"><div className="flex items-center space-x-4"><img src={employee.avatar} alt={employee.name} className="w-12 h-12 rounded-full object-cover object-top" /><div><div className="flex items-center space-x-3"><h3 className="font-medium text-white">{employee.name}</h3><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(employee.status)}`}>{employee.status}</span></div><div className="flex items-center space-x-4 text-sm text-gray-500"><span>{employee.employeeId}</span><span>{employee.department}</span><span>{employee.position}</span></div></div></div><div className="flex items-center space-x-6"><div className="text-center"><p className="text-sm text-gray-500">Salary</p><p className="font-medium text-gray-300">£{employee.salary.toLocaleString()}</p></div><div className="text-center"><p className="text-sm text-gray-500">Overtime</p><p className="font-medium text-gray-300">{employee.overtimeHours}h</p></div><div className="text-center"><p className="text-sm text-gray-500">Bonus</p><p className="font-medium text-gray-300">£{employee.bonus.toLocaleString()}</p></div><div className="text-center"><p className="text-sm text-gray-500">Gross Pay</p><p className="font-bold text-white">£{employee.grossPay.toLocaleString()}</p></div><div className="text-center"><p className="text-sm text-gray-500">Net Pay</p><p className="font-bold text-emerald-400">£{employee.netPay.toLocaleString()}</p></div><div className="flex space-x-2"><button onClick={() => { setSelectedEmployee(employee); setShowPayslipModal(true); }} className="w-8 h-8 bg-cyan-500/20 text-cyan-400 rounded-lg flex items-center justify-center hover:bg-cyan-500/30 transition-colors cursor-pointer"><i className="ri-file-text-line"></i></button><button className="w-8 h-8 bg-white/10 text-gray-400 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"><i className="ri-edit-line"></i></button><button className="w-8 h-8 bg-red-500/20 text-red-400 rounded-lg flex items-center justify-center hover:bg-red-500/30 transition-colors cursor-pointer"><i className="ri-delete-bin-line"></i></button></div></div></div></div>))}</div></div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl mt-8">
            <div className="p-6 border-b border-white/10"><h2 className="text-lg font-semibold text-white">Payroll Schedule</h2></div>
            <div className="p-6"><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">{payrollSchedule.map((s:any,i:number)=>(<div key={i} className="p-4 bg-white/5 rounded-lg"><div className="flex items-center justify-between mb-3"><h3 className="font-medium text-white">{s.period}</h3><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(s.status)}`}>{s.status}</span></div><div className="space-y-2"><div className="flex justify-between text-sm"><span className="text-gray-500">Amount:</span><span className="text-gray-300 font-bold">£{s.amount.toLocaleString()}</span></div><div className="flex justify-between text-sm"><span className="text-gray-500">Due Date:</span><span className="text-gray-300">{s.dueDate}</span></div></div></div>))}</div></div>
          </div>
        </div>

        {showPayslipModal && selectedEmployee && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-[#080f20] border border-white/10 rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6"><h3 className="text-xl font-semibold text-white">Payslip Details</h3><button onClick={()=>setShowPayslipModal(false)} className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"><i className="ri-close-line text-gray-400"></i></button></div>
              <div className="space-y-6">
                <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg"><img src={selectedEmployee.avatar} alt={selectedEmployee.name} className="w-16 h-16 rounded-full object-cover object-top" /><div><h4 className="font-semibold text-white">{selectedEmployee.name}</h4><p className="text-sm text-gray-400">{selectedEmployee.employeeId} • {selectedEmployee.department}</p><p className="text-sm text-gray-500">{selectedEmployee.position}</p></div></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4"><h5 className="font-medium text-white">Earnings</h5><div className="space-y-3"><div className="flex justify-between"><span className="text-gray-400">Base Salary</span><span className="font-medium text-gray-300">£{selectedEmployee.salary.toLocaleString()}</span></div><div className="flex justify-between"><span className="text-gray-400">Overtime ({selectedEmployee.overtimeHours}h @ £{selectedEmployee.overtimeRate}/h)</span><span className="font-medium text-gray-300">£{(selectedEmployee.overtimeHours*selectedEmployee.overtimeRate).toFixed(2)}</span></div><div className="flex justify-between"><span className="text-gray-400">Bonus</span><span className="font-medium text-gray-300">£{selectedEmployee.bonus.toLocaleString()}</span></div><div className="border-t border-white/10 pt-3 flex justify-between"><span className="font-medium text-white">Gross Pay</span><span className="font-bold text-white">£{selectedEmployee.grossPay.toLocaleString()}</span></div></div></div>
                  <div className="space-y-4"><h5 className="font-medium text-white">Deductions</h5><div className="space-y-3"><div className="flex justify-between"><span className="text-gray-400">Income Tax</span><span className="font-medium text-gray-300">£{(selectedEmployee.deductions*0.4).toFixed(2)}</span></div><div className="flex justify-between"><span className="text-gray-400">National Insurance</span><span className="font-medium text-gray-300">£{(selectedEmployee.deductions*0.3).toFixed(2)}</span></div><div className="flex justify-between"><span className="text-gray-400">Pension Contribution</span><span className="font-medium text-gray-300">£{(selectedEmployee.deductions*0.2).toFixed(2)}</span></div><div className="flex justify-between"><span className="text-gray-400">Other Deductions</span><span className="font-medium text-gray-300">£{(selectedEmployee.deductions*0.1).toFixed(2)}</span></div><div className="border-t border-white/10 pt-3 flex justify-between"><span className="font-medium text-white">Total Deductions</span><span className="font-bold text-red-400">£{selectedEmployee.deductions.toLocaleString()}</span></div></div></div>
                </div>
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg"><div className="flex justify-between items-center"><span className="text-lg font-semibold text-emerald-300">Net Pay</span><span className="text-2xl font-bold text-emerald-400">£{selectedEmployee.netPay.toLocaleString()}</span></div></div>
                <div className="flex space-x-3 pt-4 border-t border-white/10"><button onClick={()=>setShowPayslipModal(false)} className="flex-1 bg-white/10 text-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-white/20 transition-colors whitespace-nowrap cursor-pointer">Close</button><button className="flex-1 bg-cyan-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-cyan-400 transition-colors whitespace-nowrap cursor-pointer"><i className="ri-download-line mr-2"></i>Download Payslip</button></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PayrollPage() {
  return (
    <AuthGuard>
      <Suspense fallback={<div className="flex min-h-screen bg-[#030912] items-center justify-center"><i className="ri-loader-4-line animate-spin text-cyan-400 text-3xl"></i></div>}>
        <PayrollContent />
      </Suspense>
    </AuthGuard>
  );
}