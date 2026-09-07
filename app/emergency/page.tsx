
'use client';

import { useState, Suspense } from 'react';
import AuthGuard from '@/components/AuthGuard';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

function EmergencyContent() {
  const [activeTab, setActiveTab] = useState('procedures');
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [incidentSubmitting, setIncidentSubmitting] = useState(false);
  const [incidentStatus, setIncidentStatus] = useState<'success' | 'error' | null>(null);
  const [selectedPlans, setSelectedPlans] = useState<string[]>([]);

  const availablePlans = [
    {
      id: 'fire-emergency',
      title: 'Fire Emergency Response Plan',
      description: 'Complete fire emergency procedures and evacuation protocols',
      category: 'Emergency Response',
      size: '2.4 MB',
      format: 'PDF',
      lastUpdated: '2024-01-15',
      buildings: ['Building A', 'Building B', 'Building C'],
      critical: true
    },
    {
      id: 'evacuation-procedures',
      title: 'Building Evacuation Procedures',
      description: 'Detailed evacuation routes and assembly point instructions',
      category: 'Evacuation',
      size: '1.8 MB',
      format: 'PDF',
      lastUpdated: '2024-01-10',
      buildings: ['Building A', 'Building B', 'Building C'],
      critical: true
    },
    {
      id: 'medical-emergency',
      title: 'Medical Emergency Response',
      description: 'First aid procedures and medical emergency protocols',
      category: 'Medical',
      size: '1.2 MB',
      format: 'PDF',
      lastUpdated: '2024-01-12',
      buildings: ['All Buildings'],
      critical: true
    },
    {
      id: 'security-incident',
      title: 'Security Incident Response',
      description: 'Security threat assessment and response procedures',
      category: 'Security',
      size: '1.5 MB',
      format: 'PDF',
      lastUpdated: '2024-01-08',
      buildings: ['All Buildings'],
      critical: false
    },
    {
      id: 'hazmat-response',
      title: 'Hazardous Material Response',
      description: 'Chemical spill and hazmat incident procedures',
      category: 'Hazmat',
      size: '2.1 MB',
      format: 'PDF',
      lastUpdated: '2024-01-05',
      buildings: ['Building A', 'Building C'],
      critical: false
    },
    {
      id: 'weather-emergency',
      title: 'Severe Weather Procedures',
      description: 'Tornado, hurricane, and severe weather response plans',
      category: 'Weather',
      size: '1.6 MB',
      format: 'PDF',
      lastUpdated: '2024-01-03',
      buildings: ['All Buildings'],
      critical: false
    },
    {
      id: 'power-outage',
      title: 'Power Outage Response',
      description: 'Generator activation and power restoration procedures',
      category: 'Utility',
      size: '0.9 MB',
      format: 'PDF',
      lastUpdated: '2024-01-01',
      buildings: ['All Buildings'],
      critical: false
    },
    {
      id: 'communication-plan',
      title: 'Crisis Communication Plan',
      description: 'Emergency communication protocols and contact lists',
      category: 'Communication',
      size: '1.3 MB',
      format: 'PDF',
      lastUpdated: '2024-01-20',
      buildings: ['All Buildings'],
      critical: true
    },
    {
      id: 'floor-plans',
      title: 'Emergency Floor Plans',
      description: 'Detailed floor plans with exit routes and emergency equipment',
      category: 'Floor Plans',
      size: '5.2 MB',
      format: 'PDF',
      lastUpdated: '2024-01-18',
      buildings: ['Building A', 'Building B', 'Building C'],
      critical: true
    },
    {
      id: 'contact-directory',
      title: 'Emergency Contact Directory',
      description: 'Complete emergency contact information and escalation procedures',
      category: 'Contacts',
      size: '0.7 MB',
      format: 'PDF',
      lastUpdated: '2024-01-22',
      buildings: ['All Buildings'],
      critical: true
    }
  ];

  const emergencyProcedures = [
    {
      id: 'FIRE-001',
      title: 'Fire Emergency Response',
      type: 'Fire',
      priority: 'Critical',
      steps: [
        'Activate incident command structure',
        'Sound the fire alarm immediately',
        'Call 911 and facility management',
        'Evacuate using nearest exit route',
        'Proceed to designated assembly point',
        'Conduct headcount and report to incident commander'
      ],
      contacts: ['Fire Department: 911', 'Incident Commander: (555) 123-4567'],
      lastUpdated: '2024-01-15'
    },
    {
      id: 'MED-001',
      title: 'Medical Emergency Response',
      type: 'Medical',
      priority: 'Critical',
      steps: [
        'Assess the situation and ensure safety',
        'Call 911 for medical emergency',
        'Notify incident command center',
        'Provide first aid if trained',
        'Clear the area and guide paramedics',
        'Document incident details'
      ],
      contacts: ['Emergency: 911', 'First Aid Team: (555) 234-5678'],
      lastUpdated: '2024-01-12'
    },
    {
      id: 'EVAC-001',
      title: 'Building Evacuation',
      type: 'Evacuation',
      priority: 'High',
      steps: [
        'Activate incident command structure',
        'Remain calm and follow evacuation routes',
        'Use stairs, never elevators',
        'Assist individuals with disabilities',
        'Report to assembly point',
        'Wait for all-clear from incident commander'
      ],
      contacts: ['Security: (555) 345-6789', 'Building Manager: (555) 456-7890'],
      lastUpdated: '2024-01-10'
    },
    {
      id: 'CRISIS-001',
      title: 'Crisis Communication Protocol',
      type: 'Communication',
      priority: 'Critical',
      steps: [
        'Activate crisis communication team',
        'Assess situation and determine messaging',
        'Send initial alert to all stakeholders',
        'Coordinate with external agencies',
        'Provide regular updates every 30 minutes',
        'Document all communications'
      ],
      contacts: ['Crisis Team: (555) 567-8901', 'PR Manager: (555) 678-9012'],
      lastUpdated: '2024-01-20'
    }
  ];

  const emergencyContacts = [
    {
      category: 'Emergency Services',
      contacts: [
        { name: 'Fire Department', phone: '911', type: 'Emergency' },
        { name: 'Police', phone: '911', type: 'Emergency' },
        { name: 'Medical Emergency', phone: '911', type: 'Emergency' }
      ]
    },
    {
      category: 'Incident Command Team',
      contacts: [
        { name: 'John Smith', role: 'Incident Commander', phone: '(555) 123-4567', email: 'j.smith@company.com' },
        { name: 'Sarah Johnson', role: 'Safety Officer', phone: '(555) 234-5678', email: 's.johnson@company.com' },
        { name: 'Mike Davis', role: 'Communications Leader', phone: '(555) 345-6789', email: 'm.davis@company.com' },
        { name: 'Lisa Chen', role: 'Operations Chief', phone: '(555) 456-7890', email: 'l.chen@company.com' }
      ]
    },
    {
      category: 'Crisis Communication Team',
      contacts: [
        { name: 'Emily Brown', role: 'Crisis Manager', phone: '(555) 567-8901', email: 'e.brown@company.com' },
        { name: 'David Wilson', role: 'PR Coordinator', phone: '(555) 678-9012', email: 'd.wilson@company.com' },
        { name: 'Maria Garcia', role: 'Internal Communications', phone: '(555) 789-0123', email: 'm.garcia@company.com' }
      ]
    },
    {
      category: 'Utilities & Services',
      contacts: [
        { name: 'Electric Company', phone: '(555) 111-2222', type: 'Utility' },
        { name: 'Gas Company', phone: '(555) 333-4444', type: 'Utility' },
        { name: 'Water Department', phone: '(555) 555-6666', type: 'Utility' }
      ]
    }
  ];

  const evacuationPlans = [
    {
      building: 'Building A',
      floors: 5,
      capacity: 250,
      exits: 4,
      assemblyPoint: 'Parking Lot A',
      incidentCommander: 'John Smith',
      updated: '2024-01-15',
      status: 'Current'
    },
    {
      building: 'Building B',
      floors: 3,
      capacity: 150,
      exits: 3,
      assemblyPoint: 'Parking Lot B',
      incidentCommander: 'Sarah Johnson',
      updated: '2024-01-10',
      status: 'Current'
    },
    {
      building: 'Building C',
      floors: 2,
      capacity: 100,
      exits: 2,
      assemblyPoint: 'Front Courtyard',
      incidentCommander: 'Mike Davis',
      updated: '2023-12-20',
      status: 'Review Needed'
    }
  ];

  const crisisAlerts = [
    {
      id: 'ALERT-001',
      type: 'Fire Emergency',
      level: 'Critical',
      building: 'Building A',
      time: '2024-01-22 09:15',
      status: 'Active',
      recipients: 247,
      message: 'Fire alarm activated on Floor 3. Evacuate immediately via nearest exit.'
    },
    {
      id: 'ALERT-002',
      type: 'System Maintenance',
      level: 'Info',
      building: 'All Buildings',
      time: '2024-01-22 08:30',
      status: 'Sent',
      recipients: 521,
      message: 'Scheduled maintenance will affect elevator service between 10:00-12:00.'
    },
    {
      id: 'ALERT-003',
      type: 'Weather Alert',
      level: 'Warning',
      building: 'All Buildings',
      time: '2024-01-21 16:45',
      status: 'Resolved',
      recipients: 521,
      message: 'Severe thunderstorm warning. Avoid outdoor areas until further notice.'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-100 text-red-700';
      case 'High':
        return 'bg-orange-100 text-orange-700';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'Warning':
        return 'bg-yellow-100 text-yellow-700';
      case 'Info':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Current':
        return 'bg-green-100 text-green-700';
      case 'Active':
        return 'bg-red-100 text-red-700';
      case 'Sent':
        return 'bg-blue-100 text-blue-700';
      case 'Resolved':
        return 'bg-green-100 text-green-700';
      case 'Review Needed':
        return 'bg-yellow-100 text-yellow-700';
      case 'Outdated':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleAlertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const honeypot = (formData.get('phone_alt') as string || '').trim();
    if (honeypot) {
      setSubmitStatus('success');
      setTimeout(() => {
        setShowAlertModal(false);
        setSubmitStatus(null);
      }, 2000);
      setIsSubmitting(false);
      return;
    }

    formData.delete('phone_alt');

    try {
      const response = await fetch('https://readdy.ai/api/form/d9n8arsit35ii3jdlpd0', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(formData as unknown as Record<string, string>).toString()
      });

      const responseText = await response.text();
      let parsed;
      try { parsed = JSON.parse(responseText); } catch { parsed = null; }

      if (response.ok && parsed?.code === 'OK') {
        setSubmitStatus('success');
        setTimeout(() => {
          setShowAlertModal(false);
          setSubmitStatus(null);
        }, 2000);
      } else {
        const serverMsg = parsed?.meta?.message || parsed?.message || responseText;
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleIncidentCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIncidentSubmitting(true);
    setIncidentStatus(null);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const honeypot = (formData.get('phone_alt') as string || '').trim();
    if (honeypot) {
      setIncidentStatus('success');
      setTimeout(() => {
        setShowIncidentModal(false);
        setIncidentStatus(null);
      }, 2000);
      setIncidentSubmitting(false);
      return;
    }

    formData.delete('phone_alt');

    try {
      const response = await fetch('https://readdy.ai/api/form/d9n8arsit35ii3jdlpdg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(formData as unknown as Record<string, string>).toString()
      });

      const responseText = await response.text();
      let parsed;
      try { parsed = JSON.parse(responseText); } catch { parsed = null; }

      if (response.ok && parsed?.code === 'OK') {
        setIncidentStatus('success');
        setTimeout(() => {
          setShowIncidentModal(false);
          setIncidentStatus(null);
        }, 2000);
      } else {
        const serverMsg = parsed?.meta?.message || parsed?.message || responseText;
        setIncidentStatus('error');
      }
    } catch (error) {
      setIncidentStatus('error');
    } finally {
      setIncidentSubmitting(false);
    }
  };

  const handlePlanSelection = (planId: string) => {
    setSelectedPlans(prev =>
      prev.includes(planId)
        ? prev.filter(id => id !== planId)
        : [...prev, planId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPlans.length === availablePlans.length) {
      setSelectedPlans([]);
    } else {
      setSelectedPlans(availablePlans.map(plan => plan.id));
    }
  };

  const handleDownloadPlans = () => {
    if (selectedPlans.length === 0) {
      alert('Please select at least one plan to download.');
      return;
    }

    // Simulate download process
    const selectedPlanNames = availablePlans
      .filter(plan => selectedPlans.includes(plan.id))
      .map(plan => plan.title);

    console.log('Downloading plans:', selectedPlanNames);

    // In a real implementation, this would trigger actual file downloads
    // For now, we'll just show a success message
    alert(`Downloaded ${selectedPlans.length} emergency plan(s) successfully!`);

    setShowDownloadModal(false);
    setSelectedPlans([]);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Emergency Response':
        return 'bg-red-100 text-red-700';
      case 'Evacuation':
        return 'bg-orange-100 text-orange-700';
      case 'Medical':
        return 'bg-blue-100 text-blue-700';
      case 'Security':
        return 'bg-purple-100 text-purple-700';
      case 'Hazmat':
        return 'bg-yellow-100 text-yellow-700';
      case 'Weather':
        return 'bg-green-100 text-green-700';
      case 'Utility':
        return 'bg-gray-100 text-gray-700';
      case 'Communication':
        return 'bg-indigo-100 text-indigo-700';
      case 'Floor Plans':
        return 'bg-pink-100 text-pink-700';
      case 'Contacts':
        return 'bg-cyan-100 text-cyan-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="flex min-h-screen bg-[#030912]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="Emergency Management" />
        <div className="flex-1 p-6 overflow-auto">
        {/* Emergency Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Emergency Procedures</p>
                <p className="text-2xl font-bold text-gray-900">15</p>
              </div>
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                <i className="ri-file-shield-line text-white"></i>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Emergency Contacts</p>
                <p className="text-2xl font-bold text-gray-900">32</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <i className="ri-phone-line text-white"></i>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Alerts</p>
                <p className="text-2xl font-bold text-gray-900">1</p>
              </div>
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <i className="ri-notification-line text-white"></i>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Evacuation Plans</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <i className="ri-map-pin-line text-white"></i>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Last Drill</p>
                <p className="text-2xl font-bold text-gray-900">15 days</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                <i className="ri-calendar-check-line text-white"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('procedures')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'procedures'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                } cursor-pointer`}
              >
                Emergency Procedures
              </button>
              <button
                onClick={() => setActiveTab('contacts')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'contacts'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                } cursor-pointer`}
              >
                Emergency Contacts
              </button>
              <button
                onClick={() => setActiveTab('evacuation')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'evacuation'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                } cursor-pointer`}
              >
                Evacuation Plans
              </button>
              <button
                onClick={() => setActiveTab('crisis')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'crisis'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                } cursor-pointer`}
              >
                Crisis Communication
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'procedures' && (
              <div className="space-y-6">
                {emergencyProcedures.map((procedure) => (
                  <div key={procedure.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                          <i className="ri-alarm-warning-line text-red-600"></i>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{procedure.title}</h3>
                          <p className="text-sm text-gray-600">{procedure.id} • Updated: {procedure.lastUpdated}</p>
                        </div>
                      </div>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                          procedure.priority
                        )}`}
                      >
                        {procedure.priority}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Response Steps</h4>
                        <ol className="space-y-2">
                          {procedure.steps.map((step, index) => (
                            <li key={index} className="flex items-start space-x-3">
                              <span
                                className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium"
                              >
                                {index + 1}
                              </span>
                              <span className="text-sm text-gray-700">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Emergency Contacts</h4>
                        <ul className="space-y-2">
                          {procedure.contacts.map((contact, index) => (
                            <li key={index} className="flex items-center space-x-3">
                              <i className="ri-phone-line text-gray-400"></i>
                              <span className="text-sm text-gray-700">{contact}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'contacts' && (
              <div className="space-y-8">
                {emergencyContacts.map((category, index) => (
                  <div key={index}>
                    <h3 className="font-medium text-gray-900 mb-4">{category.category}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {category.contacts.map((contact, contactIndex) => (
                        <div key={contactIndex} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <i className="ri-phone-line text-blue-600"></i>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{contact.name}</h4>
                              {contact.role && <p className="text-sm text-gray-600">{contact.role}</p>}
                            </div>
                          </div>
                          <p className="text-sm font-medium text-gray-900 mb-1">{contact.phone}</p>
                          {contact.email && <p className="text-sm text-gray-600">{contact.email}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'evacuation' && (
              <div className="space-y-6">
                {evacuationPlans.map((plan, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <i className="ri-building-line text-green-600"></i>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{plan.building}</h3>
                          <p className="text-sm text-gray-600">Incident Commander: {plan.incidentCommander}</p>
                          <p className="text-sm text-gray-600">Updated: {plan.updated}</p>
                        </div>
                      </div>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          plan.status
                        )}`}
                      >
                        {plan.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Floors</p>
                        <p className="text-lg font-bold text-gray-900">{plan.floors}</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Capacity</p>
                        <p className="text-lg font-bold text-gray-900">{plan.capacity}</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Exits</p>
                        <p className="text-lg font-bold text-gray-900">{plan.exits}</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Assembly Point</p>
                        <p className="text-sm font-medium text-gray-900">{plan.assemblyPoint}</p>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer">
                        <i className="ri-map-line mr-2"></i>
                        View Floor Plan
                      </button>
                      <button
                        onClick={() => setShowIncidentModal(true)}
                        className="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors whitespace-nowrap cursor-pointer"
                      >
                        <i className="ri-command-line mr-2"></i>
                        Activate Command
                      </button>
                      <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors whitespace-nowrap cursor-pointer">
                        <i className="ri-download-line mr-2"></i>
                        Download PDF
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'crisis' && (
              <div className="space-y-6">
                {/* Crisis Communication Controls */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-medium text-gray-900 mb-4">Crisis Communication Center</h3>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setShowAlertModal(true)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors whitespace-nowrap cursor-pointer"
                    >
                      <i className="ri-alarm-warning-line mr-2"></i>
                      Send Emergency Alert
                    </button>
                    <button className="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors whitespace-nowrap cursor-pointer">
                      <i className="ri-notification-3-line mr-2"></i>
                      Mass Notification
                    </button>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer">
                      <i className="ri-message-2-line mr-2"></i>
                      Send Update
                    </button>
                  </div>
                </div>

                {/* Recent Crisis Alerts */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Recent Crisis Alerts</h3>
                  <div className="space-y-4">
                    {crisisAlerts.map((alert, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                              <i className="ri-notification-2-line text-red-600"></i>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{alert.type}</h4>
                              <p className="text-sm text-gray-600">{alert.id} • {alert.building} • {alert.time}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                                alert.level
                              )}`}
                            >
                              {alert.level}
                            </span>
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                alert.status
                              )}`}
                            >
                              {alert.status}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">{alert.message}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Recipients: {alert.recipients}</span>
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900 text-sm cursor-pointer">
                              <i className="ri-eye-line mr-1"></i>
                              View Details
                            </button>
                            <button className="text-green-600 hover:text-green-900 text-sm cursor-pointer">
                              <i className="ri-refresh-line mr-1"></i>
                              Send Update
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Emergency Alert Modal */}
      {showAlertModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <i className="ri-alarm-warning-line text-red-600"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Emergency Alert</h3>
                    <p className="text-sm text-gray-600">Send immediate emergency notification</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAlertModal(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>
            </div>

            <form id="emergency-alert-form" data-readdy-form onSubmit={handleAlertSubmit} className="p-6">
              <div className="space-y-4">
                <div className="absolute opacity-0 pointer-events-none" style={{ height: 0, width: 0, overflow: 'hidden' }}>
                  <input type="text" name="phone_alt" tabIndex={-1} autoComplete="off" aria-hidden="true" readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Alert Type</label>
                  <select
                    name="alertType"
                    required
                    className="w-full pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                  >
                    <option value="">Select alert type</option>
                    <option value="fire">Fire Emergency</option>
                    <option value="medical">Medical Emergency</option>
                    <option value="security">Security Threat</option>
                    <option value="evacuation">Evacuation</option>
                    <option value="weather">Weather Alert</option>
                    <option value="system">System Emergency</option>
                    <option value="other">Other Emergency</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Severity Level</label>
                  <select
                    name="severity"
                    required
                    className="w-full pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                  >
                    <option value="">Select severity</option>
                    <option value="critical">Critical - Immediate Threat</option>
                    <option value="high">High - Urgent Action Required</option>
                    <option value="medium">Medium - Attention Needed</option>
                    <option value="low">Low - Advisory</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Affected Buildings</label>
                  <select
                    name="buildings"
                    required
                    className="w-full pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                  >
                    <option value="">Select buildings</option>
                    <option value="all">All Buildings</option>
                    <option value="building-a">Building A - Main Office</option>
                    <option value="building-b">Building B - Research Center</option>
                    <option value="building-c">Building C - Warehouse</option>
                    <option value="outdoor">Outdoor Areas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Description</label>
                  <textarea
                    name="description"
                    rows={4}
                    required
                    maxLength={500}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                    placeholder="Describe the emergency situation and current status..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Immediate Action Required</label>
                  <textarea
                    name="immediateAction"
                    rows={3}
                    required
                    maxLength={500}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                    placeholder="What should people do immediately..."
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="evacuationRequired"
                      id="evacuationRequired"
                      className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
                    />
                    <label htmlFor="evacuationRequired" className="ml-2 text-sm text-gray-700">
                      Evacuation Required
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="notifyAuthorities"
                      id="notifyAuthorities"
                      className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
                    />
                    <label htmlFor="notifyAuthorities" className="ml-2 text-sm text-gray-700">
                      Notify Emergency Authorities (911)
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="activateIncidentCommand"
                      id="activateIncidentCommand"
                      className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
                    />
                    <label htmlFor="activateIncidentCommand" className="ml-2 text-sm text-gray-700">
                      Activate Incident Command Structure
                    </label>
                  </div>
                </div>
              </div>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                  <div className="flex items-center">
                    <i className="ri-check-line mr-2"></i>
                    Emergency alert sent successfully!
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  <div className="flex items-center">
                    <i className="ri-error-warning-line mr-2"></i>
                    Failed to send alert. Please try again.
                  </div>
                </div>
              )}

              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {isSubmitting ? (
                    <>
                      <i className="ri-loader-4-line animate-spin mr-2"></i>
                      Sending Alert...
                    </>
                  ) : (
                    <>
                      <i className="ri-alarm-warning-line mr-2"></i>
                      Send Emergency Alert
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAlertModal(false)}
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

      {/* Incident Command Modal */}
      {showIncidentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <i className="ri-command-line text-orange-600"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Activate Incident Command</h3>
                    <p className="text-sm text-gray-600">Establish incident command structure for emergency response</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowIncidentModal(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>
            </div>

            <form id="incident-command-form" data-readdy-form onSubmit={handleIncidentCommandSubmit} className="p-6">
              <div className="space-y-6">
                <div className="absolute opacity-0 pointer-events-none" style={{ height: 0, width: 0, overflow: 'hidden' }}>
                  <input type="text" name="phone_alt" tabIndex={-1} autoComplete="off" aria-hidden="true" readOnly />
                </div>
                {/* Incident Details */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-4">Incident Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Incident Type</label>
                      <select
                        name="incidentType"
                        required
                        className="w-full pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                      >
                        <option value="">Select incident type</option>
                        <option value="fire">Fire Emergency</option>
                        <option value="medical">Medical Emergency</option>
                        <option value="security">Security Incident</option>
                        <option value="hazmat">Hazardous Material</option>
                        <option value="structural">Structural Damage</option>
                        <option value="weather">Weather Emergency</option>
                        <option value="evacuation">Mass Evacuation</option>
                        <option value="other">Other Emergency</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Severity Level</label>
                      <select
                        name="severity"
                        required
                        className="w-full pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                      >
                        <option value="">Select severity</option>
                        <option value="level-1">Level 1 - Minor Incident</option>
                        <option value="level-2">Level 2 - Moderate Incident</option>
                        <option value="level-3">Level 3 - Major Incident</option>
                        <option value="level-4">Level 4 - Catastrophic</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Incident Location</label>
                    <input
                      type="text"
                      name="location"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                      placeholder="Specific location of incident..."
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Incident Description</label>
                    <textarea
                      name="description"
                      rows={4}
                      required
                      maxLength={500}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                      placeholder="Detailed description of the incident..."
                    />
                  </div>
                </div>

                {/* Command Structure */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-4">Command Structure Assignment</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Incident Commander</label>
                      <select
                        name="incidentCommander"
                        required
                        className="w-full pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                      >
                        <option value="">Select commander</option>
                        <option value="john-smith">John Smith - Primary IC</option>
                        <option value="sarah-johnson">Sarah Johnson - Backup IC</option>
                        <option value="mike-davis">Mike Davis - Assistant IC</option>
                        <option value="other">Other (specify in notes)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Safety Officer</label>
                      <select
                        name="safetyOfficer"
                        required
                        className="w-full pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                      >
                        <option value="">Select safety officer</option>
                        <option value="sarah-johnson">Sarah Johnson - Safety Officer</option>
                        <option value="tom-wilson">Tom Wilson - Assistant Safety</option>
                        <option value="lisa-chen">Lisa Chen - Safety Coordinator</option>
                        <option value="other">Other (specify in notes)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Operations Chief</label>
                      <select
                        name="operationsChief"
                        required
                        className="w-full pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                      >
                        <option value="">Select operations chief</option>
                        <option value="lisa-chen">Lisa Chen - Operations Chief</option>
                        <option value="david-wilson">David Wilson - Operations</option>
                        <option value="mike-davis">Mike Davis - Field Operations</option>
                        <option value="other">Other (specify in notes)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Communications Leader</label>
                      <select
                        name="communicationsLeader"
                        required
                        className="w-full pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                      >
                        <option value="">Select communications leader</option>
                        <option value="mike-davis">Mike Davis - Communications</option>
                        <option value="emily-brown">Emily Brown - Crisis Comm</option>
                        <option value="maria-garcia">Maria Garcia - Internal Comm</option>
                        <option value="other">Other (specify in notes)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Response Actions */}
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-4">Response Actions</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Immediate Actions Required</label>
                      <textarea
                        name="immediateActions"
                        rows={3}
                        required
                        maxLength={500}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                        placeholder="List immediate actions to be taken..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Resources Needed</label>
                      <textarea
                        name="resourcesNeeded"
                        rows={3}
                        required
                        maxLength={500}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                        placeholder="Personnel, equipment, and resources required..."
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="evacuationRequired"
                          id="incidentEvacuation"
                          className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <label htmlFor="incidentEvacuation" className="ml-2 text-sm text-gray-700">
                          Evacuation Required
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="externalAgencies"
                          id="externalAgencies"
                          className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <label htmlFor="externalAgencies" className="ml-2 text-sm text-gray-700">
                          Contact External Agencies (Fire, Police, EMS)
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="mediaResponse"
                          id="mediaResponse"
                          className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <label htmlFor="mediaResponse" className="ml-2 text-sm text-gray-700">
                          Activate Media Response Team
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Messages */}
              {incidentStatus === 'success' && (
                <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                  <div className="flex items-center">
                    <i className="ri-check-line mr-2"></i>
                    Incident command structure activated successfully!
                  </div>
                </div>
              )}

              {incidentStatus === 'error' && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  <div className="flex items-center">
                    <i className="ri-error-warning-line mr-2"></i>
                    Failed to activate incident command. Please try again.
                  </div>
                </div>
              )}

              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  disabled={incidentSubmitting}
                  className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-orange-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {incidentSubmitting ? (
                    <>
                      <i className="ri-loader-4-line animate-spin mr-2"></i>
                      Activating...
                    </>
                  ) : (
                    <>
                      <i className="ri-command-line mr-2"></i>
                      Activate Incident Command
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowIncidentModal(false)}
                  disabled={incidentSubmitting}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Download Plans Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className="ri-download-line text-blue-600"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Download Emergency Plans</h3>
                    <p className="text-sm text-gray-600">Select the emergency plans you want to download</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDownloadModal(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Download Controls */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleSelectAll}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 cursor-pointer"
                  >
                    <i
                      className={selectedPlans.length === availablePlans.length ? 'ri-checkbox-fill' : 'ri-checkbox-blank-line'}
                    ></i>
                    <span className="text-sm font-medium">
                      {selectedPlans.length === availablePlans.length ? 'Deselect All' : 'Select All'}
                    </span>
                  </button>
                  <span className="text-sm text-gray-600">
                    {selectedPlans.length} of {availablePlans.length} plans selected
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 cursor-pointer">
                    <i className="ri-filter-line mr-1"></i>
                    Filter
                  </button>
                  <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 cursor-pointer">
                    <i className="ri-sort-asc mr-1"></i>
                    Sort
                  </button>
                </div>
              </div>

              {/* Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {availablePlans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedPlans.includes(plan.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handlePlanSelection(plan.id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <i className="ri-file-pdf-line text-blue-600"></i>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{plan.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {plan.critical && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                            Critical
                          </span>
                        )}
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            selectedPlans.includes(plan.id)
                              ? 'bg-blue-500 border-blue-500'
                              : 'border-gray-300'
                          }`}
                        >
                          {selectedPlans.includes(plan.id) && (
                            <i className="ri-check-line text-white text-xs"></i>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(plan.category)}`}>
                          {plan.category}
                        </span>
                        <span className="text-xs text-gray-500">{plan.size}</span>
                        <span className="text-xs text-gray-500">{plan.format}</span>
                      </div>
                      <span className="text-xs text-gray-500">Updated: {plan.lastUpdated}</span>
                    </div>

                    <div className="mt-2">
                      <span className="text-xs text-gray-600">
                        Buildings: {plan.buildings.join(', ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Download Summary */}
              {selectedPlans.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">Download Summary</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{selectedPlans.length}</p>
                      <p className="text-sm text-gray-600">Selected Plans</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {availablePlans
                          .filter((plan) => selectedPlans.includes(plan.id))
                          .reduce((total, plan) => total + parseFloat(plan.size), 0)
                          .toFixed(1)} MB
                      </p>
                      <p className="text-sm text-gray-600">Total Size</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {availablePlans.filter((plan) => selectedPlans.includes(plan.id) && plan.critical).length}
                      </p>
                      <p className="text-sm text-gray-600">Critical Plans</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="includeContacts"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="includeContacts" className="text-sm text-gray-700">
                    Include emergency contact list
                  </label>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowDownloadModal(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDownloadPlans}
                    disabled={selectedPlans.length === 0}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    <i className="ri-download-line mr-2"></i>
                    Download Selected Plans
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default function EmergencyPage() {
  return (
    <AuthGuard>
      <Suspense fallback={<div className="flex min-h-screen bg-[#030912] items-center justify-center"><i className="ri-loader-4-line animate-spin text-cyan-400 text-3xl"></i></div>}>
        <EmergencyContent />
      </Suspense>
    </AuthGuard>
  );
}
