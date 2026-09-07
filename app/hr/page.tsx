'use client';

import { useState, Suspense } from 'react';
import AuthGuard from '@/components/AuthGuard';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  manager: string;
  hireDate: string;
  status: string;
  phone: string;
  emergencyContact: string;
  salary: string;
  avatar: string;
  performance: string;
  nextReview: string;
}

function HRContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showLeaveRequest, setShowLeaveRequest] = useState(false);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const employees: Employee[] = [
    {
      id: 'EMP-001',
      name: 'John Martinez',
      email: 'john.martinez@synqoro.com',
      department: 'HVAC',
      position: 'Senior HVAC Technician',
      manager: 'Sarah Johnson',
      hireDate: '2022-03-15',
      status: 'Active',
      phone: '(555) 123-4567',
      emergencyContact: 'Maria Martinez - (555) 987-6543',
      salary: '$65,000',
      avatar: 'https://readdy.ai/api/search-image?query=Professional%20HVAC%20technician%20in%20work%20uniform%2C%20friendly%20smile%2C%20modern%20facility%20background%2C%20high%20quality%20portrait%20photography%2C%20natural%20lighting%2C%20professional%20appearance&width=100&height=100&seq=emp1&orientation=squarish',
      performance: 'Excellent',
      nextReview: '2024-03-15'
    },
    {
      id: 'EMP-002',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@synqoro.com',
      department: 'Management',
      position: 'Facilities Manager',
      manager: 'David Wilson',
      hireDate: '2021-01-10',
      status: 'Active',
      phone: '(555) 234-5678',
      emergencyContact: 'Michael Johnson - (555) 876-5432',
      salary: '$85,000',
      avatar: 'https://readdy.ai/api/search-image?query=Professional%20business%20woman%20facility%20manager%20in%20corporate%20attire%2C%20confident%20expression%2C%20modern%20office%20background%2C%20executive%20portrait%20style%2C%20high%20quality%20photography%2C%20natural%20lighting&width=100&height=100&seq=emp2&orientation=squarish',
      performance: 'Outstanding',
      nextReview: '2024-01-10'
    },
    {
      id: 'EMP-003',
      name: 'Mike Chen',
      email: 'mike.chen@synqoro.com',
      department: 'Electrical',
      position: 'Electrical Engineer',
      manager: 'Sarah Johnson',
      hireDate: '2022-08-20',
      status: 'Active',
      phone: '(555) 345-6789',
      emergencyContact: 'Linda Chen - (555) 765-4321',
      salary: '$72,000',
      avatar: 'https://readdy.ai/api/search-image?query=Professional%20electrical%20engineer%20in%20work%20uniform%2C%20technical%20equipment%20background%2C%20confident%20appearance%2C%20engineering%20professional%20portrait%2C%20high%20quality%20photography%2C%20industrial%20environment&width=100&height=100&seq=emp3&orientation=squarish',
      performance: 'Good',
      nextReview: '2024-08-20'
    },
    {
      id: 'EMP-004',
      name: 'Lisa Wang',
      email: 'lisa.wang@synqoro.com',
      department: 'Safety',
      position: 'Safety Officer',
      manager: 'Sarah Johnson',
      hireDate: '2021-11-05',
      status: 'Active',
      phone: '(555) 456-7890',
      emergencyContact: 'Robert Wang - (555) 654-3210',
      salary: '$68,000',
      avatar: 'https://readdy.ai/api/search-image?query=Professional%20safety%20officer%20in%20uniform%2C%20safety%20equipment%20background%2C%20authoritative%20appearance%2C%20safety%20professional%20portrait%2C%20high%20quality%20photography%2C%20industrial%20workplace%20environment&width=100&height=100&seq=emp4&orientation=squarish',
      performance: 'Excellent',
      nextReview: '2024-11-05'
    },
    {
      id: 'EMP-005',
      name: 'David Brown',
      email: 'david.brown@synqoro.com',
      department: 'Maintenance',
      position: 'Maintenance Technician',
      manager: 'Sarah Johnson',
      hireDate: '2023-02-12',
      status: 'Active',
      phone: '(555) 567-8901',
      emergencyContact: 'Jennifer Brown - (555) 543-2109',
      salary: '$58,000',
      avatar: 'https://readdy.ai/api/search-image?query=Professional%20maintenance%20technician%20in%20work%20uniform%2C%20tools%20and%20equipment%20background%2C%20skilled%20worker%20appearance%2C%20maintenance%20professional%20portrait%2C%20high%20quality%20photography%2C%20workshop%20environment&width=100&height=100&seq=emp5&orientation=squarish',
      performance: 'Good',
      nextReview: '2024-02-12'
    }
  ];

  const pendingActions = [
    {
      id: 1,
      type: 'Leave Request',
      employee: 'John Martinez',
      details: 'Vacation Leave - 3 days (Feb 15-17, 2024)',
      priority: 'Medium',
      date: '2024-01-20',
      action: 'Approval Required'
    },
    {
      id: 2,
      type: 'Performance Review',
      employee: 'Sarah Johnson',
      details: 'Annual Performance Review Due',
      priority: 'High',
      date: '2024-01-22',
      action: 'Schedule Meeting'
    },
    {
      id: 3,
      type: 'Document Expiry',
      employee: 'Mike Chen',
      details: 'Safety Certification expires in 30 days',
      priority: 'High',
      date: '2024-02-15',
      action: 'Renewal Required'
    },
    {
      id: 4,
      type: 'New Employee',
      employee: 'Jennifer Davis',
      details: 'Onboarding scheduled for Monday',
      priority: 'Medium',
      date: '2024-01-29',
      action: 'Prepare Materials'
    }
  ];

  const leaveRequests = [
    {
      id: 'LR-001',
      employee: 'John Martinez',
      type: 'Vacation',
      startDate: '2024-02-15',
      endDate: '2024-02-17',
      days: 3,
      reason: 'Family vacation',
      status: 'Pending',
      appliedDate: '2024-01-20'
    },
    {
      id: 'LR-002',
      employee: 'Lisa Wang',
      type: 'Sick Leave',
      startDate: '2024-01-25',
      endDate: '2024-01-26',
      days: 2,
      reason: 'Medical appointment',
      status: 'Approved',
      appliedDate: '2024-01-24'
    },
    {
      id: 'LR-003',
      employee: 'David Brown',
      type: 'Personal',
      startDate: '2024-02-01',
      endDate: '2024-02-01',
      days: 1,
      reason: 'Personal matter',
      status: 'Pending',
      appliedDate: '2024-01-22'
    }
  ];

  const performanceMetrics = [
    { metric: 'Average Performance Rating', value: '4.2/5', change: '+0.2' },
    { metric: 'Employee Satisfaction', value: '87%', change: '+5%' },
    { metric: 'Training Completion Rate', value: '94%', change: '+8%' },
    { metric: 'Retention Rate', value: '92%', change: '+3%' }
  ];

  const upcomingReviews = [
    { employee: 'Sarah Johnson', date: '2024-01-25', type: 'Annual Review' },
    { employee: 'Mike Chen', date: '2024-02-01', type: 'Quarterly Review' },
    { employee: 'Lisa Wang', date: '2024-02-05', type: 'Performance Check' }
  ];

  const trainingProgress = [
    { course: 'Safety Protocol Training', completed: 45, total: 50, percentage: 90 },
    { course: 'Equipment Maintenance', completed: 38, total: 45, percentage: 84 },
    { course: 'Emergency Response', completed: 42, total: 50, percentage: 84 },
    { course: 'Customer Service', completed: 35, total: 40, percentage: 87 }
  ];

  const documents = [
    {
      id: 'DOC-HR-001',
      title: 'Employee Handbook',
      category: 'Policy',
      lastUpdated: '2024-01-15',
      version: '2.1',
      status: 'Current'
    },
    {
      id: 'DOC-HR-002',
      title: 'Performance Review Template',
      category: 'Template',
      lastUpdated: '2024-01-10',
      version: '1.3',
      status: 'Active'
    },
    {
      id: 'DOC-HR-003',
      title: 'Safety Training Manual',
      category: 'Training',
      lastUpdated: '2024-01-20',
      version: '1.8',
      status: 'Current'
    },
    {
      id: 'DOC-HR-004',
      title: 'Leave Policy Guidelines',
      category: 'Policy',
      lastUpdated: '2024-01-05',
      version: '1.2',
      status: 'Current'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
      case 'Approved':
      case 'Current':
        return 'bg-green-100 text-green-700';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'Rejected':
      case 'Inactive':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-700';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'Low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'Outstanding':
        return 'bg-green-100 text-green-700';
      case 'Excellent':
        return 'bg-blue-100 text-blue-700';
      case 'Good':
        return 'bg-yellow-100 text-yellow-700';
      case 'Needs Improvement':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleEmployeeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    const formData = new FormData(e.target as HTMLFormElement);
    const formValues = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      department: formData.get('department') as string,
      position: formData.get('position') as string,
      manager: formData.get('manager') as string,
      startDate: formData.get('startDate') as string,
      salary: formData.get('salary') as string,
      employeeType: formData.get('employeeType') as string,
      emergencyName: formData.get('emergencyName') as string,
      emergencyPhone: formData.get('emergencyPhone') as string,
      emergencyRelation: formData.get('emergencyRelation') as string,
      timestamp: new Date().toISOString()
    };

    try {
      const response = await fetch('https://readdy.ai/api/form/add-employee-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(formValues).toString()
      });

      if (response.ok) {
        setSubmitStatus('success');
        setTimeout(() => {
          setShowAddEmployee(false);
          setSubmitStatus(null);
        }, 2000);
      } else {
        throw new Error('Failed to add employee');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLeaveSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    const formData = new FormData(e.target as HTMLFormElement);
    const formValues = {
      employee: formData.get('employee') as string,
      leaveType: formData.get('leaveType') as string,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      reason: formData.get('reason') as string,
      handover: formData.get('handover') as string,
      urgency: formData.get('urgency') as string,
      medicalCertificate: formData.get('medicalCertificate') === 'on' ? 'Yes' : 'No',
      timestamp: new Date().toISOString()
    };

    try {
      const response = await fetch('https://readdy.ai/api/form/leave-request-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(formValues).toString()
      });

      if (response.ok) {
        setSubmitStatus('success');
        setTimeout(() => {
          setShowLeaveRequest(false);
          setSubmitStatus(null);
        }, 2000);
      } else {
        throw new Error('Failed to submit leave request');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePerformanceSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    const formData = new FormData(e.target as HTMLFormElement);
    const formValues = {
      employee: formData.get('employee') as string,
      reviewPeriod: formData.get('reviewPeriod') as string,
      overallRating: formData.get('overallRating') as string,
      goalAchievement: formData.get('goalAchievement') as string,
      strengths: formData.get('strengths') as string,
      improvementAreas: formData.get('improvementAreas') as string,
      goals: formData.get('goals') as string,
      additionalComments: formData.get('additionalComments') as string,
      timestamp: new Date().toISOString()
    };

    try {
      const response = await fetch('https://readdy.ai/api/form/performance-review-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(formValues).toString()
      });

      if (response.ok) {
        setSubmitStatus('success');
        setTimeout(() => {
          setShowPerformanceModal(false);
          setSubmitStatus(null);
        }, 2000);
      } else {
        throw new Error('Failed to submit performance review');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#030912]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="Human Resources" />
        <div className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <i className="ri-team-line text-white"></i>
              </div>
              <span className="text-sm font-medium text-blue-600">Total</span>
            </div>
            <h3 className="text-sm text-gray-600 mb-1">Employees</h3>
            <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <i className="ri-user-star-line text-white"></i>
              </div>
              <span className="text-sm font-medium text-green-600">Active</span>
            </div>
            <h3 className="text-sm text-gray-600 mb-1">Active Staff</h3>
            <p className="text-2xl font-bold text-gray-900">{employees.filter(e => e.status === 'Active').length}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                <i className="ri-calendar-check-line text-white"></i>
              </div>
              <span className="text-sm font-medium text-yellow-600">Pending</span>
            </div>
            <h3 className="text-sm text-gray-600 mb-1">Leave Requests</h3>
            <p className="text-2xl font-bold text-gray-900">{leaveRequests.filter(l => l.status === 'Pending').length}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <i className="ri-award-line text-white"></i>
              </div>
              <span className="text-sm font-medium text-purple-600">Due</span>
            </div>
            <h3 className="text-sm text-gray-600 mb-1">Reviews Due</h3>
            <p className="text-2xl font-bold text-gray-900">{upcomingReviews.length}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                <i className="ri-alarm-warning-line text-white"></i>
              </div>
              <span className="text-sm font-medium text-red-600">Urgent</span>
            </div>
            <h3 className="text-sm text-gray-600 mb-1">Pending Actions</h3>
            <p className="text-2xl font-bold text-gray-900">{pendingActions.filter(a => a.priority === 'High').length}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'dashboard'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                } cursor-pointer`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('employees')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'employees'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                } cursor-pointer`}
              >
                Employees
              </button>
              <button
                onClick={() => setActiveTab('attendance')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'attendance'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                } cursor-pointer`}
              >
                Time & Attendance
              </button>
              <button
                onClick={() => setActiveTab('performance')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'performance'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                } cursor-pointer`}
              >
                Performance
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'documents'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                } cursor-pointer`}
              >
                Documents
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Actions</h3>
                  <div className="space-y-4">
                    {pendingActions.map((action) => (
                      <div key={action.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <i
                                className={`${
                                  action.type === 'Leave Request'
                                    ? 'ri-calendar-line'
                                    : action.type === 'Performance Review'
                                    ? 'ri-award-line'
                                    : action.type === 'Document Expiry'
                                    ? 'ri-file-warning-line'
                                    : 'ri-user-add-line'
                                } text-blue-600`}
                              ></i>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{action.type}</h4>
                              <p className="text-sm text-gray-600">{action.employee}</p>
                              <p className="text-sm text-gray-500">{action.details}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(action.priority)}`}>
                              {action.priority}
                            </span>
                            <span className="text-sm text-gray-500">{action.date}</span>
                            <button className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 cursor-pointer whitespace-nowrap">
                              {action.action}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {performanceMetrics.map((metric, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-700">{metric.metric}</h4>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
                          <span className="text-sm text-green-600">{metric.change}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Reviews</h3>
                  <div className="space-y-3">
                    {upcomingReviews.map((review, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <i className="ri-user-line text-purple-600"></i>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{review.employee}</h4>
                            <p className="text-sm text-gray-600">{review.type}</p>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'employees' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Employee Directory</h3>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Search employees..."
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                    <select className="pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
                      <option>All Departments</option>
                      <option>HVAC</option>
                      <option>Electrical</option>
                      <option>Safety</option>
                      <option>Maintenance</option>
                      <option>Management</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {employees.map((employee) => (
                    <div
                      key={employee.id}
                      className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedEmployee(employee)}
                    >
                      <div className="flex items-center space-x-4 mb-4">
                        <img
                          src={employee.avatar}
                          alt={employee.name}
                          className="w-16 h-16 rounded-full object-cover object-top"
                        />
                        <div>
                          <h4 className="font-medium text-gray-900">{employee.name}</h4>
                          <p className="text-sm text-gray-600">{employee.position}</p>
                          <p className="text-sm text-gray-500">{employee.department}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Status:</span>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(employee.status)}`}>
                            {employee.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Performance:</span>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPerformanceColor(employee.performance)}`}>
                            {employee.performance}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Hire Date:</span>
                          <span className="text-sm text-gray-900">{employee.hireDate}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'attendance' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Time & Attendance</h3>
                  <div className="flex items-center space-x-2">
                    <input
                      type="date"
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                    <select className="pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
                      <option>This Week</option>
                      <option>This Month</option>
                      <option>Last Month</option>
                    </select>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Leave Requests</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {leaveRequests.map((request) => (
                          <tr key={request.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-medium text-gray-900">{request.employee}</div>
                              <div className="text-sm text-gray-500">{request.id}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.type}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {request.startDate} - {request.endDate}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.days}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                                {request.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {request.status === 'Pending' && (
                                <div className="flex space-x-2">
                                  <button className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700 cursor-pointer whitespace-nowrap">
                                    Approve
                                  </button>
                                  <button className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700 cursor-pointer whitespace-nowrap">
                                    Reject
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'performance' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Performance Management</h3>
                  <button
                    onClick={() => setShowPerformanceModal(true)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <i className="ri-add-line mr-2"></i>
                    New Review
                  </button>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Training Progress</h4>
                  <div className="space-y-4">
                    {trainingProgress.map((training, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-gray-900">{training.course}</h5>
                          <span className="text-sm text-gray-600">{training.completed}/{training.total}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${training.percentage}%` }}
                          ></div>
                        </div>
                        <div className="mt-1 text-sm text-gray-600">{training.percentage}% Complete</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Employee Performance</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {employees.map((employee) => (
                      <div key={employee.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-3 mb-3">
                          <img
                            src={employee.avatar}
                            alt={employee.name}
                            className="w-12 h-12 rounded-full object-cover object-top"
                          />
                          <div>
                            <h5 className="font-medium text-gray-900">{employee.name}</h5>
                            <p className="text-sm text-gray-600">{employee.position}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Performance:</span>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPerformanceColor(employee.performance)}`}>
                            {employee.performance}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-gray-600">Next Review:</span>
                          <span className="text-sm text-gray-900">{employee.nextReview}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">HR Documents</h3>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer">
                    <i className="ri-upload-line mr-2"></i>
                    Upload Document
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {documents.map((doc) => (
                    <div key={doc.id} className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <i className="ri-file-text-line text-blue-600"></i>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{doc.title}</h4>
                          <p className="text-sm text-gray-600">{doc.category}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Version:</span>
                          <span className="text-sm text-gray-900">{doc.version}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Updated:</span>
                          <span className="text-sm text-gray-900">{doc.lastUpdated}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Status:</span>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(doc.status)}`}>
                            {doc.status}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 flex space-x-2">
                        <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700 cursor-pointer whitespace-nowrap">
                          <i className="ri-download-line mr-1"></i>
                          Download
                        </button>
                        <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-md text-sm hover:bg-gray-200 cursor-pointer whitespace-nowrap">
                          <i className="ri-share-line mr-1"></i>
                          Share
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showAddEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Add New Employee</h3>
                <button onClick={() => setShowAddEmployee(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                  <i className="ri-close-line"></i>
                </button>
              </div>
            </div>

            <form id="add-employee-form" onSubmit={handleEmployeeSubmit} className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    <select
                      name="department"
                      required
                      className="w-full pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="">Select department</option>
                      <option value="HVAC">HVAC</option>
                      <option value="Electrical">Electrical</option>
                      <option value="Plumbing">Plumbing</option>
                      <option value="Safety">Safety</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Management">Management</option>
                      <option value="Administration">Administration</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                    <input
                      type="text"
                      name="position"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Enter position title"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Manager</label>
                    <select
                      name="manager"
                      required
                      className="w-full pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="">Select manager</option>
                      <option value="Sarah Johnson">Sarah Johnson</option>
                      <option value="David Wilson">David Wilson</option>
                      <option value="Lisa Wang">Lisa Wang</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Salary</label>
                    <input
                      type="text"
                      name="salary"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Enter salary amount"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Employee Type</label>
                    <select
                      name="employeeType"
                      required
                      className="w-full pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="">Select type</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Temporary">Temporary</option>
                    </select>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Emergency Contact</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
                      <input
                        type="text"
                        name="emergencyName"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="Emergency contact name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="emergencyPhone"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="Emergency contact phone"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
                      <input
                        type="text"
                        name="emergencyRelation"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="Relationship"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {submitStatus === 'success' && (
                <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                  <div className="flex items-center">
                    <i className="ri-check-line mr-2"></i>
                    Employee added successfully!
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  <div className="flex items-center">
                    <i className="ri-error-warning-line mr-2"></i>
                    Failed to add employee. Please try again.
                  </div>
                </div>
              )}

              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {isSubmitting ? (
                    <>
                      <i className="ri-loader-4-line animate-spin mr-2"></i>
                      Adding Employee...
                    </>
                  ) : (
                    <>
                      <i className="ri-user-add-line mr-2"></i>
                      Add Employee
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddEmployee(false)}
                  disabled={isSubmitting}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showLeaveRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Leave Request</h3>
                <button onClick={() => setShowLeaveRequest(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                  <i className="ri-close-line"></i>
                </button>
              </div>
            </div>

            <form id="leave-request-form" onSubmit={handleLeaveSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Employee</label>
                  <select
                    name="employee"
                    required
                    className="w-full pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                  >
                    <option value="">Select employee</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.name}>
                        {emp.name} - {emp.department}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Leave Type</label>
                  <select
                    name="leaveType"
                    required
                    className="w-full pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                  >
                    <option value="">Select leave type</option>
                    <option value="Annual Leave">Annual Leave</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Personal Leave">Personal Leave</option>
                    <option value="Maternity Leave">Maternity Leave</option>
                    <option value="Paternity Leave">Paternity Leave</option>
                    <option value="Emergency Leave">Emergency Leave</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Leave</label>
                  <textarea
                    name="reason"
                    rows={3}
                    required
                    maxLength={500}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                    placeholder="Please provide reason for leave request..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Work Handover Details</label>
                  <textarea
                    name="handover"
                    rows={3}
                    required
                    maxLength={500}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                    placeholder="Please specify work handover arrangements..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Urgency Level</label>
                  <select
                    name="urgency"
                    required
                    className="w-full pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                  >
                    <option value="">Select urgency</option>
                    <option value="Low">Low - Planned in advance</option>
                    <option value="Medium">Medium - Some urgency</option>
                    <option value="High">High - Urgent/Emergency</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="medicalCertificate"
                    id="medicalCertificate"
                    className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label htmlFor="medicalCertificate" className="text-sm text-gray-700">
                    Medical certificate attached (if applicable)
                  </label>
                </div>
              </div>

              {submitStatus === 'success' && (
                <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                  <div className="flex items-center">
                    <i className="ri-check-line mr-2"></i>
                    Leave request submitted successfully!
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  <div className="flex items-center">
                    <i className="ri-error-warning-line mr-2"></i>
                    Failed to submit leave request. Please try again.
                  </div>
                </div>
              )}

              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {isSubmitting ? (
                    <>
                      <i className="ri-loader-4-line animate-spin mr-2"></i>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <i className="ri-calendar-line mr-2"></i>
                      Submit Request
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowLeaveRequest(false)}
                  disabled={isSubmitting}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPerformanceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Performance Review</h3>
                <button onClick={() => setShowPerformanceModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                  <i className="ri-close-line"></i>
                </button>
              </div>
            </div>

            <form id="performance-review-form" onSubmit={handlePerformanceSubmit} className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Employee</label>
                    <select
                      name="employee"
                      required
                      className="w-full pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                    >
                      <option value="">Select employee</option>
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.name}>
                          {emp.name} - {emp.department}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Review Period</label>
                    <select
                      name="reviewPeriod"
                      required
                      className="w-full pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                    >
                      <option value="">Select period</option>
                      <option value="Monthly">Monthly Review</option>
                      <option value="Quarterly">Quarterly Review</option>
                      <option value="Semi-Annual">Semi-Annual Review</option>
                      <option value="Annual">Annual Review</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Overall Performance Rating</label>
                  <select
                    name="overallRating"
                    required
                    className="w-full pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                  >
                    <option value="">Select rating</option>
                    <option value="Outstanding">Outstanding (5/5)</option>
                    <option value="Excellent">Excellent (4/5)</option>
                    <option value="Good">Good (3/5)</option>
                    <option value="Satisfactory">Satisfactory (2/5)</option>
                    <option value="Needs Improvement">Needs Improvement (1/5)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Goal Achievement</label>
                  <select
                    name="goalAchievement"
                    required
                    className="w-full pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                  >
                    <option value="">Select achievement level</option>
                    <option value="Exceeded">Exceeded Goals (100%+)</option>
                    <option value="Met">Met Goals (90-100%)</option>
                    <option value="Mostly Met">Mostly Met Goals (70-89%)</option>
                    <option value="Partially Met">Partially Met Goals (50-69%)</option>
                    <option value="Not Met">Did Not Meet Goals (&lt;50%)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Key Strengths</label>
                  <textarea
                    name="strengths"
                    rows={4}
                    required
                    maxLength={500}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                    placeholder="List key strengths and accomplishments..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Areas for Improvement</label>
                  <textarea
                    name="improvementAreas"
                    rows={4}
                    required
                    maxLength={500}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                    placeholder="Identify areas that need improvement..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Goals for Next Period</label>
                  <textarea
                    name="goals"
                    rows={4}
                    required
                    maxLength={500}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                    placeholder="Set goals and objectives for the next review period..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Comments</label>
                  <textarea
                    name="additionalComments"
                    rows={3}
                    maxLength={500}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                    placeholder="Any additional comments or feedback..."
                  />
                </div>
              </div>

              {submitStatus === 'success' && (
                <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                  <div className="flex items-center">
                    <i className="ri-check-line mr-2"></i>
                    Performance review submitted successfully!
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  <div className="flex items-center">
                    <i className="ri-error-warning-line mr-2"></i>
                    Failed to submit performance review. Please try again.
                  </div>
                </div>
              )}

              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {isSubmitting ? (
                    <>
                      <i className="ri-loader-4-line animate-spin mr-2"></i>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <i className="ri-award-line mr-2"></i>
                      Submit Review
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPerformanceModal(false)}
                  disabled={isSubmitting}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Employee Details</h3>
                <button onClick={() => setSelectedEmployee(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                  <i className="ri-close-line"></i>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center space-x-6 mb-6">
                <img
                  src={selectedEmployee.avatar}
                  alt={selectedEmployee.name}
                  className="w-20 h-20 rounded-full object-cover object-top"
                />
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">{selectedEmployee.name}</h4>
                  <p className="text-gray-600">{selectedEmployee.position}</p>
                  <p className="text-gray-500">{selectedEmployee.department}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedEmployee.status)}`}>
                      {selectedEmployee.status}
                    </span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPerformanceColor(selectedEmployee.performance)}`}>
                      {selectedEmployee.performance}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-3">Contact Information</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Email:</span>
                      <span className="text-sm text-gray-900">{selectedEmployee.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Phone:</span>
                      <span className="text-sm text-gray-900">{selectedEmployee.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Emergency Contact:</span>
                      <span className="text-sm text-gray-900">{selectedEmployee.emergencyContact}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-3">Employment Details</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Manager:</span>
                      <span className="text-sm text-gray-900">{selectedEmployee.manager}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Hire Date:</span>
                      <span className="text-sm text-gray-900">{selectedEmployee.hireDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Salary:</span>
                      <span className="text-sm text-gray-900">{selectedEmployee.salary}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Next Review:</span>
                      <span className="text-sm text-gray-900">{selectedEmployee.nextReview}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap">
                Edit Employee
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer whitespace-nowrap">
                Schedule Review
              </button>
            </div>
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  );
}

export default function HRPage() {
  return (
    <AuthGuard>
      <Suspense fallback={<div className="flex min-h-screen bg-[#030912] items-center justify-center"><i className="ri-loader-4-line animate-spin text-cyan-400 text-3xl"></i></div>}>
        <HRContent />
      </Suspense>
    </AuthGuard>
  );
}