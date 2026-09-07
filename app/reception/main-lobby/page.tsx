
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function MainLobbyPage() {
  const [showVisitorSignIn, setShowVisitorSignIn] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [showPhotoCapture, setShowPhotoCapture] = useState(false);
  const [showVipCheckIn, setShowVipCheckIn] = useState(false);
  const [showTouchscreenEntry, setShowTouchscreenEntry] = useState(false);
  const [touchscreenStep, setTouchscreenStep] = useState(1);
  const [touchscreenData, setTouchscreenData] = useState({});
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [vipStep, setVipStep] = useState(1);
  const [vipFormData, setVipFormData] = useState({});

  const [showCalendar, setShowCalendar] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState('month');
  const [selectedDate, setSelectedDate] = useState(null);

  const [showDeliveryLog, setShowDeliveryLog] = useState(false);
  const [deliveryStep, setDeliveryStep] = useState(1);
  const [deliveryFormData, setDeliveryFormData] = useState({});
  const [deliveryPhoto, setDeliveryPhoto] = useState(null);
  const [submitStatus, setSubmitStatus] = useState(null);

  const calendarEvents = {
    '2024-01-15': [
      { id: 1, type: 'visitor', title: 'Board Meeting - James Wilson', time: '09:00 AM', host: 'CEO Office', status: 'confirmed' },
      { id: 2, type: 'appointment', title: 'IT Consultation', time: '02:00 PM', host: 'Tech Team', status: 'scheduled' }
    ],
    '2024-01-16': [
      { id: 3, type: 'event', title: 'Quarterly Review', time: '10:00 AM', host: 'Management', status: 'confirmed' },
      { id: 4, type: 'visitor', title: 'Client Meeting - Sarah Johnson', time: '03:00 PM', host: 'Sales Team', status: 'confirmed' }
    ],
    '2024-01-17': [
      { id: 5, type: 'maintenance', title: 'HVAC Maintenance Check', time: '08:00 AM', host: 'Facilities', status: 'scheduled' },
      { id: 6, type: 'visitor', title: 'Legal Consultation', time: '11:00 AM', host: 'Legal Dept', status: 'pending' }
    ],
    '2024-01-18': [
      { id: 7, type: 'event', title: 'New Employee Orientation', time: '09:00 AM', host: 'HR Department', status: 'confirmed' },
      { id: 8, type: 'visitor', title: 'Vendor Meeting', time: '02:30 PM', host: 'Procurement', status: 'confirmed' }
    ],
    '2024-01-19': [
      { id: 9, type: 'appointment', title: 'Security Briefing', time: '10:30 AM', host: 'Security Team', status: 'scheduled' }
    ],
    '2024-01-22': [
      { id: 10, type: 'visitor', title: 'Investment Review - Patrick O\'Connor', time: '04:00 PM', host: 'CFO Office', status: 'expected' },
      { id: 11, type: 'event', title: 'Monthly All-Hands Meeting', time: '01:00 PM', host: 'Executive Team', status: 'confirmed' }
    ],
    '2024-01-23': [
      { id: 12, type: 'visitor', title: 'Design Review', time: '10:00 AM', host: 'Design Team', status: 'confirmed' },
      { id: 13, type: 'maintenance', title: 'Elevator Inspection', time: '06:00 PM', host: 'Maintenance', status: 'scheduled' }
    ],
    '2024-01-24': [
      { id: 14, type: 'appointment', title: 'Training Session', time: '09:30 AM', host: 'Training Dept', status: 'scheduled' },
      { id: 15, type: 'visitor', title: 'Partnership Discussion', time: '03:00 PM', host: 'Business Dev', status: 'confirmed' }
    ],
    '2024-01-25': [
      { id: 16, type: 'event', title: 'Facility Safety Drill', time: '02:00 PM', host: 'Safety Team', status: 'mandatory' }
    ],
    '2024-01-26': [
      { id: 17, type: 'visitor', title: 'Audit Review', time: '09:00 AM', host: 'Finance Team', status: 'confirmed' },
      { id: 18, type: 'appointment', title: 'Equipment Delivery', time: '11:30 AM', host: 'IT Department', status: 'scheduled' }
    ],
    '2024-01-29': [
      { id: 19, type: 'visitor', title: 'Marketing Campaign Review', time: '10:00 AM', host: 'Marketing Team', status: 'confirmed' }
    ],
    '2024-01-30': [
      { id: 20, type: 'event', title: 'End of Month Reports', time: '03:00 PM', host: 'All Departments', status: 'deadline' }
    ]
  };

  const deliveryTypes = [
    { id: 'documents', name: 'Documents & Letters', icon: 'ri-file-text-line' },
    { id: 'packages', name: 'Packages & Parcels', icon: 'ri-gift-line' },
    { id: 'equipment', name: 'Equipment & Hardware', icon: 'ri-computer-line' },
    { id: 'supplies', name: 'Office Supplies', icon: 'ri-archive-line' },
    { id: 'food', name: 'Food & Catering', icon: 'ri-restaurant-line' },
    { id: 'furniture', name: 'Furniture & Large Items', icon: 'ri-sofa-line' },
    { id: 'medical', name: 'Medical & Pharmaceutical', icon: 'ri-first-aid-kit-line' },
    { id: 'other', name: 'Other Items', icon: 'ri-more-line' }
  ];

  const courierServices = [
    { id: 'fedex', name: 'FedEx', color: 'bg-purple-600' },
    { id: 'ups', name: 'UPS', color: 'bg-yellow-600' },
    { id: 'dhl', name: 'DHL', color: 'bg-red-600' },
    { id: 'usps', name: 'USPS', color: 'bg-blue-600' },
    { id: 'amazon', name: 'Amazon Delivery', color: 'bg-orange-500' },
    { id: 'local-courier', name: 'Local Courier', color: 'bg-green-600' },
    { id: 'vendor-direct', name: 'Vendor Direct', color: 'bg-gray-600' },
    { id: 'other', name: 'Other Service', color: 'bg-indigo-600' }
  ];

  const priorityLevels = [
    { id: 'urgent', name: 'Urgent', color: 'bg-red-100 text-red-700', description: 'Immediate delivery required' },
    { id: 'high', name: 'High Priority', color: 'bg-orange-100 text-orange-700', description: 'Same day delivery' },
    { id: 'normal', name: 'Normal', color: 'bg-blue-100 text-blue-700', description: 'Standard processing' },
    { id: 'low', name: 'Low Priority', color: 'bg-gray-100 text-gray-700', description: 'Can wait if needed' }
  ];

  const recipientDepartments = [
    { id: 'executive', name: 'Executive Office', floor: '15th Floor' },
    { id: 'hr', name: 'Human Resources', floor: '12th Floor' },
    { id: 'finance', name: 'Finance Department', floor: '11th Floor' },
    { id: 'it', name: 'IT Department', floor: '10th Floor' },
    { id: 'marketing', name: 'Marketing', floor: '9th Floor' },
    { id: 'sales', name: 'Sales Department', floor: '8th Floor' },
    { id: 'operations', name: 'Operations', floor: '7th Floor' },
    { id: 'legal', name: 'Legal Department', floor: '6th Floor' },
    { id: 'facilities', name: 'Facilities Management', floor: '5th Floor' },
    { id: 'security', name: 'Security Office', floor: '3rd Floor' }
  ];

  const handleDeliveryLog = () => {
    setShowDeliveryLog(true);
    setDeliveryStep(1);
    setDeliveryFormData({});
    setDeliveryPhoto(null);
    setSubmitStatus(null);
  };

  const handleDeliveryNextStep = () => {
    if (deliveryStep < 4) {
      setDeliveryStep(deliveryStep + 1);
    }
  };

  const handleDeliveryPrevStep = () => {
    if (deliveryStep > 1) {
      setDeliveryStep(deliveryStep - 1);
    }
  };

  const handleDeliveryPhotoCapture = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setDeliveryPhoto('https://readdy.ai/api/search-image?query=professional%20package%20delivery%20documentation%20photo%20showing%20multiple%20packages%20and%20parcels%20neatly%20arranged%20on%20reception%20counter%20with%20clear%20labeling%20and%20tracking%20numbers%20visible%20in%20modern%20office%20environment&width=600&height=400&seq=delivery-photo&orientation=landscape');
      setIsProcessing(false);
    }, 2000);
  };

  const handleRetakeDeliveryPhoto = () => {
    setDeliveryPhoto(null);
    setIsProcessing(false);
  };

  const handleDeliverySubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setSubmitStatus(null);

    const formData = new FormData(e.target);
    const formValues = {
      deliveryType: formData.get('deliveryType'),
      courierService: formData.get('courierService'),
      trackingNumber: formData.get('trackingNumber'),
      senderName: formData.get('senderName'),
      senderCompany: formData.get('senderCompany'),
      recipientName: formData.get('recipientName'),
      recipientDepartment: formData.get('recipientDepartment'),
      packageDescription: formData.get('packageDescription'),
      packageCount: formData.get('packageCount'),
      priorityLevel: formData.get('priorityLevel'),
      specialInstructions: formData.get('specialInstructions'),
      requiresSignature: formData.get('requiresSignature') === 'on' ? 'Yes' : 'No',
      requiresRefrigeration: formData.get('requiresRefrigeration') === 'on' ? 'Yes' : 'No',
      fragileItem: formData.get('fragileItem') === 'on' ? 'Yes' : 'No',
      highValue: formData.get('highValue') === 'on' ? 'Yes' : 'No',
      photoTaken: deliveryPhoto ? 'Yes' : 'No',
      receivedBy: 'Main Lobby Reception',
      timestamp: new Date().toISOString(),
      loggedBy: 'Reception Staff'
    };

    try {
      const response = await fetch('https://readdy.ai/api/form/delivery-package-log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(formValues).toString()
      });

      if (response.ok) {
        setSubmitStatus('success');
        setTimeout(() => {
          setShowDeliveryLog(false);
          setDeliveryStep(1);
          setDeliveryFormData({});
          setDeliveryPhoto(null);
          setSubmitStatus(null);
        }, 3000);
      } else {
        throw new Error('Failed to log delivery');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsProcessing(false);
    }
  };

  const getEventTypeColor = (type) => {
    const colors = {
      visitor: 'bg-blue-500',
      appointment: 'bg-green-500',
      event: 'bg-purple-500',
      maintenance: 'bg-orange-500'
    };
    return colors[type] || 'bg-gray-500';
  };

  const getEventTypeIcon = (type) => {
    const icons = {
      visitor: 'ri-user-line',
      appointment: 'ri-calendar-check-line',
      event: 'ri-calendar-event-line',
      maintenance: 'ri-tools-line'
    };
    return icons[type] || 'ri-calendar-line';
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: 'text-green-600',
      scheduled: 'text-blue-600',
      pending: 'text-yellow-600',
      expected: 'text-orange-600',
      mandatory: 'text-red-600',
      deadline: 'text-purple-600'
    };
    return colors[status] || 'text-gray-600';
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDateKey = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const navigateMonth = (direction) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const getDayEvents = (day) => {
    const dateKey = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day);
    return calendarEvents[dateKey] || [];
  };

  const getTotalEventsForDate = (day) => {
    const events = getDayEvents(day);
    return events.length;
  };

  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const today = new Date();
    const isCurrentMonth = currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();

    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = isCurrentMonth && day === today.getDate();
      const events = getDayEvents(day);
      const hasEvents = events.length > 0;

      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate({ day, events })}
          className={`p-2 min-h-[80px] border border-gray-100 cursor-pointer hover:bg-blue-50 transition-colors ${isToday ? 'bg-blue-100 border-blue-300' : hasEvents ? 'bg-gray-50' : ''}`}
        >
          <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-700' : 'text-gray-900'}`}>
            {day}
          </div>
          <div className="space-y-1">
            {events.slice(0, 2).map((event) => (
              <div
                key={event.id}
                className={`text-xs px-1 py-0.5 rounded text-white truncate ${getEventTypeColor(event.type)}`}
                title={`${event.time} - ${event.title}`}
              >
                {event.title.length > 12 ? `${event.title.substring(0, 12)}...` : event.title}
              </div>
            ))}
            {events.length > 2 && (
              <div className="text-xs text-gray-500 px-1">
                +{events.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const handleCapturePhotoAndCheckIn = () => {
    setShowPhotoCapture(true);
    setShowVisitorSignIn(false);
  };

  const handleTouchscreenEntry = () => {
    setShowTouchscreenEntry(true);
    setTouchscreenStep(1);
    setTouchscreenData({});
  };

  const handleVipCheckIn = () => {
    setShowVipCheckIn(true);
    setVipStep(1);
    setVipFormData({});
  };

  const handlePhotoCapture = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setCapturedPhoto('https://readdy.ai/api/search-image?query=professional%20business%20person%20smiling%20confidently%20in%20modern%20office%20environment%20with%20clean%20background%20for%20visitor%20badge%20photo&width=300&height=400&seq=captured-photo&orientation=portrait');
      setIsProcessing(false);
    }, 2000);
  };

  const handleRetakePhoto = () => {
    setCapturedPhoto(null);
    setIsProcessing(false);
  };

  const handleCompleteRegistration = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setShowPhotoCapture(false);
      setCapturedPhoto(null);
      setIsProcessing(false);
    }, 2000);
  };

  const handleVipNextStep = () => {
    if (vipStep < 3) {
      setVipStep(vipStep + 1);
    }
  };

  const handleVipPrevStep = () => {
    if (vipStep > 1) {
      setVipStep(vipStep - 1);
    }
  };

  const handleVipComplete = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setShowVipCheckIn(false);
      setVipStep(1);
      setVipFormData({});
      setIsProcessing(false);
    }, 3000);
  };

  const handleTouchscreenNextStep = () => {
    if (touchscreenStep < 4) {
      setTouchscreenStep(touchscreenStep + 1);
    }
  };

  const handleTouchscreenPrevStep = () => {
    if (touchscreenStep > 1) {
      setTouchscreenStep(touchscreenStep - 1);
    }
  };

  const handleTouchscreenComplete = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setShowTouchscreenEntry(false);
      setTouchscreenStep(1);
      setTouchscreenData({});
      setIsProcessing(false);
    }, 3000);
  };

  const vipTiers = [
    { id: 'platinum', name: 'Platinum VIP', color: 'bg-gradient-to-r from-gray-600 to-gray-800', access: 'Full Building Access' },
    { id: 'gold', name: 'Gold VIP', color: 'bg-gradient-to-r from-yellow-500 to-yellow-600', access: 'Executive Floor Access' },
    { id: 'silver', name: 'Silver VIP', color: 'bg-gradient-to-r from-gray-400 to-gray-500', access: 'Premium Meeting Rooms' },
    { id: 'corporate', name: 'Corporate Partner', color: 'bg-gradient-to-r from-blue-600 to-blue-700', access: 'Partner Floor Access' }
  ];

  const vipServices = [
    { id: 'escort', name: 'Personal Escort Service', icon: 'ri-user-star-line' },
    { id: 'lounge', name: 'VIP Lounge Access', icon: 'ri-vip-crown-line' },
    { id: 'refreshments', name: 'Premium Refreshments', icon: 'ri-cup-line' },
    { id: 'parking', name: 'Reserved Parking', icon: 'ri-car-line' },
    { id: 'security', name: 'Security Clearance', icon: 'ri-shield-check-line' },
    { id: 'priority', name: 'Priority Processing', icon: 'ri-time-line' }
  ];

  const executiveHosts = [
    { id: 'ceo', name: 'CEO Office', department: 'Executive Leadership', available: true },
    { id: 'cfo', name: 'CFO Office', department: 'Finance Executive', available: true },
    { id: 'cto', name: 'CTO Office', department: 'Technology Executive', available: false },
    { id: 'vp-sales', name: 'VP Sales', department: 'Sales Leadership', available: true },
    { id: 'vp-marketing', name: 'VP Marketing', department: 'Marketing Leadership', available: true },
    { id: 'board', name: 'Board of Directors', department: 'Board Room', available: true }
  ];

  const hostEmployees = [
    { id: 'john-smith', name: 'John Smith', department: 'IT Department', available: true },
    { id: 'sarah-johnson', name: 'Sarah Johnson', department: 'Marketing', available: true },
    { id: 'michael-chen', name: 'Michael Chen', department: 'Sales', available: false },
    { id: 'lisa-wang', name: 'Lisa Wang', department: 'HR', available: true },
    { id: 'david-rodriguez', name: 'David Rodriguez', department: 'Finance', available: true },
    { id: 'emily-davis', name: 'Emily Davis', department: 'Operations', available: true },
    { id: 'alex-thompson', name: 'Alex Thompson', department: 'Legal', available: true },
    { id: 'jessica-brown', name: 'Jessica Brown', department: 'Customer Service', available: false }
  ];

  const visitPurposes = [
    { id: 'business-meeting', name: 'Business Meeting', icon: 'ri-briefcase-line' },
    { id: 'interview', name: 'Job Interview', icon: 'ri-user-search-line' },
    { id: 'consultation', name: 'Consultation', icon: 'ri-chat-3-line' },
    { id: 'training', name: 'Training Session', icon: 'ri-graduation-cap-line' },
    { id: 'delivery', name: 'Delivery/Pickup', icon: 'ri-truck-line' },
    { id: 'maintenance', name: 'Maintenance', icon: 'ri-tools-line' },
    { id: 'vendor', name: 'Vendor Meeting', icon: 'ri-hand-heart-line' },
    { id: 'other', name: 'Other', icon: 'ri-question-line' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/reception" className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center cursor-pointer">
                <i className="ri-arrow-left-line text-white"></i>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Main Lobby Reception</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCalendar(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors whitespace-nowrap cursor-pointer"
              >
                <i className="ri-calendar-line mr-2"></i>
                View Calendar
              </button>
              <span className="text-sm text-gray-600">Reception Point: Main Lobby</span>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <i className="ri-user-add-line text-white"></i>
              </div>
              <span className="text-sm font-medium text-blue-600">Quick Actions</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Visitor Check-In</h3>
            <p className="text-sm text-gray-600 mb-4">Register new visitors with photo capture</p>
            <button
              onClick={() => setShowVisitorSignIn(true)}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
            >
              <i className="ri-user-add-line mr-2"></i>
              New Visitor Sign-In
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <i className="ri-truck-line text-white"></i>
              </div>
              <span className="text-sm font-medium text-green-600">Deliveries</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Package Logging</h3>
            <p className="text-sm text-gray-600 mb-4">Log incoming deliveries and packages</p>
            <button
              onClick={handleDeliveryLog}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors whitespace-nowrap cursor-pointer"
            >
              <i className="ri-truck-line mr-2"></i>
              Log Delivery
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <i className="ri-vip-crown-line text-white"></i>
              </div>
              <span className="text-sm font-medium text-purple-600">VIP Access</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Executive Visitors</h3>
            <p className="text-sm text-gray-600 mb-4">Special check-in for VIP guests</p>
            <button
              onClick={handleVipCheckIn}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors whitespace-nowrap cursor-pointer"
            >
              <i className="ri-vip-crown-line mr-2"></i>
              VIP Check-In
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <i className="ri-calendar-event-line text-white"></i>
              </div>
              <span className="text-sm font-medium text-orange-600">Schedule</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Today's Events</h3>
            <p className="text-sm text-gray-600 mb-4">View scheduled appointments and visitors</p>
            <button
              onClick={() => setShowCalendar(true)}
              className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors whitespace-nowrap cursor-pointer"
            >
              <i className="ri-calendar-line mr-2"></i>
              View Schedule
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Status - Main Lobby</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-sm text-blue-700">Active Visitors</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">8</div>
              <div className="text-sm text-green-700">In Building</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">3</div>
              <div className="text-sm text-yellow-700">Pending Deliveries</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">24</div>
              <div className="text-sm text-purple-700">Badges Issued</div>
            </div>
          </div>
        </div>
      </div>

      {showDeliveryLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-6xl mx-4 max-h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <i className="ri-truck-line text-white"></i>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Package Delivery Registration</h3>
                  <p className="text-sm text-gray-600">Log and track incoming deliveries and packages</p>
                </div>
              </div>
              <button
                onClick={() => setShowDeliveryLog(false)}
                className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-gray-600"></i>
              </button>
            </div>

            <form id="delivery-package-log" onSubmit={handleDeliverySubmit}>
              {deliveryStep === 1 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-8 border border-green-200">
                    <h4 className="text-2xl font-semibold text-green-900 mb-6 text-center">
                      <i className="ri-inbox-line mr-3"></i>
                      Package Information
                    </h4>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div>
                          <label className="block text-lg font-medium text-gray-700 mb-4">Package Type *</label>
                          <div className="grid grid-cols-1 gap-3">
                            {deliveryTypes.map((type) => (
                              <label key={type.id} className="flex items-center p-4 border border-gray-200 rounded-xl hover:bg-white hover:border-green-300 cursor-pointer transition-all">
                                <input
                                  type="radio"
                                  name="deliveryType"
                                  value={type.id}
                                  required
                                  className="mr-4 w-5 h-5 text-green-600 focus:ring-green-500"
                                />
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <i className={`${type.icon} text-green-600`}></i>
                                  </div>
                                  <span className="text-lg font-medium text-gray-900">{type.name}</span>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-lg font-medium text-gray-700 mb-3">Package Count *</label>
                          <select
                            name="packageCount"
                            required
                            className="w-full pr-8 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg"
                          >
                            <option value="">Select number of packages</option>
                            <option value="1">1 Package</option>
                            <option value="2">2 Packages</option>
                            <option value="3">3 Packages</option>
                            <option value="4">4 Packages</option>
                            <option value="5">5 Packages</option>
                            <option value="multiple">5+ Packages (Multiple)</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-lg font-medium text-gray-700 mb-4">Courier Service *</label>
                          <div className="space-y-3">
                            {courierServices.map((service) => (
                              <label key={service.id} className="flex items-center p-4 border border-gray-200 rounded-xl hover:bg-white hover:border-green-300 cursor-pointer transition-all">
                                <input
                                  type="radio"
                                  name="courierService"
                                  value={service.id}
                                  required
                                  className="mr-4 w-5 h-5 text-green-600 focus:ring-green-500"
                                />
                                <div className="flex items-center justify-between w-full">
                                  <span className="text-lg font-medium text-gray-900">{service.name}</span>
                                  <div className={`w-4 h-4 rounded-full ${service.color}`}></div>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-lg font-medium text-gray-700 mb-3">Tracking Number</label>
                          <input
                            type="text"
                            name="trackingNumber"
                            className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg"
                            placeholder="Enter tracking number if available"
                          />
                        </div>

                        <div>
                          <label className="block text-lg font-medium text-gray-700 mb-3">Priority Level *</label>
                          <div className="space-y-3">
                            {priorityLevels.map((level) => (
                              <label key={level.id} className="flex items-center p-4 border border-gray-200 rounded-xl hover:bg-white hover:border-green-300 cursor-pointer transition-all">
                                <input
                                  type="radio"
                                  name="priorityLevel"
                                  value={level.id}
                                  required
                                  className="mr-4 w-5 h-5 text-green-600 focus:ring-green-500"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-lg font-medium text-gray-900">{level.name}</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${level.color}`}>
                                      {level.name}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600 mt-1">{level.description}</p>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <i className="ri-information-line text-white"></i>
                      </div>
                      <div>
                        <h5 className="text-lg font-medium text-blue-900">Delivery Protocol</h5>
                        <p className="text-blue-700 mt-2">
                          All packages are logged with timestamp, photo documentation, and recipient notification. High priority items receive immediate delivery notification.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {deliveryStep === 2 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-8 border border-green-200">
                    <h4 className="text-2xl font-semibold text-green-900 mb-6 text-center">
                      <i className="ri-user-line mr-3"></i>
                      Sender & Recipient Information
                    </h4>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="bg-white rounded-xl p-6 border border-gray-200">
                          <h5 className="text-lg font-semibold text-gray-900 mb-4">
                            <i className="ri-send-plane-line mr-2"></i>
                            Sender Information
                          </h5>

                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Sender Name *</label>
                              <input
                                type="text"
                                name="senderName"
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                placeholder="Full name of sender"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Sender Company</label>
                              <input
                                type="text"
                                name="senderCompany"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                placeholder="Company or organization"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Package Description *</label>
                              <textarea
                                name="packageDescription"
                                required
                                rows={4}
                                maxLength={500}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                placeholder="Brief description of package contents (max 500 characters)"
                              ></textarea>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="bg-white rounded-xl p-6 border border-gray-200">
                          <h5 className="text-lg font-semibold text-gray-900 mb-4">
                            <i className="ri-inbox-line mr-2"></i>
                            Recipient Information
                          </h5>

                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Name *</label>
                              <input
                                type="text"
                                name="recipientName"
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                placeholder="Full name of recipient"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Department/Location *</label>
                              <select
                                name="recipientDepartment"
                                required
                                className="w-full pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              >
                                <option value="">Select department</option>
                                {recipientDepartments.map((dept) => (
                                  <option key={dept.id} value={dept.id}>
                                    {dept.name} - {dept.floor}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Special Instructions</label>
                              <textarea
                                name="specialInstructions"
                                rows={4}
                                maxLength={500}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                placeholder="Any special delivery instructions (max 500 characters)"
                              ></textarea>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <i className="ri-notification-line text-white"></i>
                      </div>
                      <div>
                        <h5 className="text-lg font-medium text-yellow-900">Notification System</h5>
                        <p className="text-yellow-700 mt-2">
                          The recipient will be automatically notified of package arrival via email and internal messaging system upon completion of this log entry.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {deliveryStep === 3 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-8 border border-green-200">
                    <h4 className="text-2xl font-semibold text-green-900 mb-6 text-center">
                      <i className="ri-camera-line mr-3"></i>
                      Photo Documentation & Additional Details
                    </h4>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="bg-white rounded-xl p-6 border border-gray-200">
                          <h5 className="text-lg font-medium text-gray-900 mb-4">Package Photo Documentation</h5>

                          {!deliveryPhoto ? (
                            <div className="bg-gray-800 rounded-xl aspect-[4/3] flex items-center justify-center relative">
                              {isProcessing ? (
                                <div className="text-center text-white">
                                  <i className="ri-camera-line text-6xl mb-4 animate-pulse"></i>
                                  <p className="text-lg">Taking package photo...</p>
                                  <p className="text-sm text-gray-300">Please wait</p>
                                </div>
                              ) : (
                                <div className="text-center text-white">
                                  <i className="ri-camera-line text-6xl mb-4"></i>
                                  <p className="text-lg">Camera Ready</p>
                                  <p className="text-sm text-gray-300">Position packages in frame</p>
                                </div>
                              )}

                              <div className="absolute inset-8 border-2 border-dashed border-white/30 rounded-xl flex items-center justify-center">
                                <div className="text-center text-white/60">
                                  <p className="text-xs">Package Documentation Area</p>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="relative">
                              <img
                                src={deliveryPhoto}
                                alt="Package documentation photo"
                                className="w-full aspect-[4/3] object-cover rounded-xl"
                              />
                              <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                                <i className="ri-check-line mr-1"></i>
                                Photo Captured
                              </div>
                            </div>
                          )}

                          <div className="flex space-x-3 mt-6">
                            {!deliveryPhoto ? (
                              <button
                                type="button"
                                onClick={handleDeliveryPhotoCapture}
                                disabled={isProcessing}
                                className="flex-1 bg-green-600 text-white px-6 py-4 rounded-xl text-lg font-medium hover:bg-green-700 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
                              >
                                <i className="ri-camera-line mr-3"></i>
                                {isProcessing ? 'Capturing...' : 'Take Photo'}
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={handleRetakeDeliveryPhoto}
                                className="flex-1 bg-gray-600 text-white px-6 py-4 rounded-xl text-lg font-medium hover:bg-gray-700 transition-colors whitespace-nowrap cursor-pointer"
                              >
                                <i className="ri-camera-line mr-3"></i>
                                Retake Photo
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 border border-gray-200">
                          <h5 className="text-lg font-medium text-gray-900 mb-4">Photo Guidelines</h5>
                          <div className="space-y-3">
                            <div className="flex items-center text-green-700">
                              <i className="ri-check-line mr-3 text-lg"></i>
                              <span>Include all packages in frame</span>
                            </div>
                            <div className="flex items-center text-green-700">
                              <i className="ri-check-line mr-3 text-lg"></i>
                              <span>Show tracking labels clearly</span>
                            </div>
                            <div className="flex items-center text-green-700">
                              <i className="ri-check-line mr-3 text-lg"></i>
                              <span>Good lighting and focus</span>
                            </div>
                            <div className="flex items-center text-green-700">
                              <i className="ri-check-line mr-3 text-lg"></i>
                              <span>Capture any damage if present</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="bg-white rounded-xl p-6 border border-gray-200">
                          <h5 className="text-lg font-medium text-gray-900 mb-4">Special Handling Requirements</h5>

                          <div className="space-y-4">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                name="requiresSignature"
                                id="requiresSignature"
                                className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                              />
                              <label htmlFor="requiresSignature" className="ml-3 flex items-center">
                                <i className="ri-quill-pen-line text-gray-600 mr-2"></i>
                                <span className="text-gray-700">Requires signature on delivery</span>
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                name="fragileItem"
                                id="fragileItem"
                                className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                              />
                              <label htmlFor="fragileItem" className="ml-3 flex items-center">
                                <i className="ri-error-warning-line text-gray-600 mr-2"></i>
                                <span className="text-gray-700">Fragile - Handle with care</span>
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                name="requiresRefrigeration"
                                id="requiresRefrigeration"
                                className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                              />
                              <label htmlFor="requiresRefrigeration" className="ml-3 flex items-center">
                                <i className="ri-fridge-line text-gray-600 mr-2"></i>
                                <span className="text-gray-700">Requires refrigeration</span>
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                name="highValue"
                                id="highValue"
                                className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                              />
                              <label htmlFor="highValue" className="ml-3 flex items-center">
                                <i className="ri-safe-line text-gray-600 mr-2"></i>
                                <span className="text-gray-700">High value item - Extra security</span>
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 border border-gray-200">
                          <h5 className="text-lg font-medium text-gray-900 mb-4">Package Status Summary</h5>

                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Received Time:</span>
                              <span className="font-medium text-gray-900" suppressHydrationWarning={true}>
                                {new Date().toLocaleString()}
                              </span>
                            </div>

                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Logged By:</span>
                              <span className="font-medium text-gray-900">Reception Staff</span>
                            </div>

                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Location:</span>
                              <span className="font-medium text-gray-900">Main Lobby Reception</span>
                            </div>

                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Status:</span>
                              <span className="inline-flex px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                                Pending Delivery
                              </span>
                            </div>

                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Photo Documented:</span>
                              <span className={`font-medium ${deliveryPhoto ? 'text-green-600' : 'text-red-600'}`}>
                                {deliveryPhoto ? 'Yes' : 'No'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <i className="ri-shield-check-line text-white"></i>
                      </div>
                      <div>
                        <h5 className="text-lg font-medium text-purple-900">Security & Compliance</h5>
                        <p className="text-purple-700 mt-2">
                          All package documentation is encrypted and stored securely. Photo evidence helps with insurance claims and delivery verification.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {deliveryStep === 4 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-8 border border-green-200">
                    <div className="text-center mb-8">
                      <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="ri-check-line text-white text-4xl"></i>
                      </div>
                      <h4 className="text-3xl font-bold text-green-900 mb-2">Package Successfully Logged!</h4>
                      <p className="text-lg text-green-700">Delivery has been recorded and notifications sent.</p>
                    </div>

                    <div className="max-w-4xl mx-auto">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-6">
                          <div className="bg-white rounded-xl p-6 border border-gray-200">
                            <h5 className="text-lg font-medium text-gray-900 mb-4">Delivery Summary</h5>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Package Type:</span>
                                <span className="font-medium text-gray-900">Documents & Letters</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Courier Service:</span>
                                <span className="font-medium text-gray-900">FedEx</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Package Count:</span>
                                <span className="font-medium text-gray-900">2 Packages</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Priority:</span>
                                <span className="inline-flex px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                                  High Priority
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Tracking Number:</span>
                                <span className="font-medium text-gray-900">FX123456789</span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white rounded-xl p-6 border border-gray-200">
                            <h5 className="text-lg font-medium text-gray-900 mb-4">Recipient Details</h5>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Recipient:</span>
                                <span className="font-medium text-gray-900">John Smith</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Department:</span>
                                <span className="font-medium text-gray-900">IT Department</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Floor:</span>
                                <span className="font-medium text-gray-900">10th Floor</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Sender:</span>
                                <span className="font-medium text-gray-900">Tech Solutions Inc.</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div className="bg-white rounded-xl p-6 border border-gray-200">
                            <h5 className="text-lg font-medium text-gray-900 mb-4">Delivery Log Details</h5>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Log ID:</span>
                                <span className="font-medium text-green-600">PKG-2024-0125</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Received Time:</span>
                                <span className="font-medium text-gray-900" suppressHydrationWarning={true}>
                                  {new Date().toLocaleString()}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Location:</span>
                                <span className="font-medium text-gray-900">Main Lobby Reception</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Logged By:</span>
                                <span className="font-medium text-gray-900">Reception Staff</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Photo Documentation:</span>
                                <span className="font-medium text-green-600">Completed</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Status:</span>
                                <span className="inline-flex px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                  Notification Sent
                                </span>
                              </div>
                            </div>
                          </div>

                          {deliveryPhoto && (
                            <div className="bg-white rounded-xl p-6 border border-gray-200">
                              <h5 className="text-lg font-medium text-gray-900 mb-4">Package Documentation</h5>
                              <img
                                src={deliveryPhoto}
                                alt="Package documentation"
                                className="w-full aspect-[4/3] object-cover rounded-lg border border-gray-200"
                              />
                              <p className="text-sm text-gray-600 mt-2 text-center">
                                Photo evidence captured for delivery verification
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-white rounded-xl p-6 border border-gray-200 mt-6">
                        <h5 className="text-lg font-medium text-gray-900 mb-4">Next Steps</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                              <span className="text-white text-sm font-bold">1</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Recipient Notified</p>
                              <p className="text-sm text-gray-600">Email and internal message sent to John Smith</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                              <span className="text-white text-sm font-bold">2</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Package Secured</p>
                              <p className="text-sm text-gray-600">Stored safely at reception desk</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                              <span className="text-white text-sm font-bold">3</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Tracking Active</p>
                              <p className="text-sm text-gray-600">Package status will be updated upon pickup</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                    <div className="flex items-center justify-center space-x-4 text-green-700">
                      <i className="ri-checkbox-circle-line text-2xl"></i>
                      <div className="text-center">
                        <h5 className="text-lg font-medium">Delivery Successfully Logged</h5>
                        <p className="text-sm">Package documentation completed. Thank you for maintaining delivery records!</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                  <div className="flex items-center">
                    <i className="ri-check-line mr-2"></i>
                    Package delivery logged successfully! Recipient has been notified.
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  <div className="flex items-center">
                    <i className="ri-error-warning-line mr-2"></i>
                    Failed to log delivery. Please check the information and try again.
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                <div className="flex space-x-3">
                  {deliveryStep > 1 && deliveryStep < 4 && (
                    <button
                      type="button"
                      onClick={handleDeliveryPrevStep}
                      className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl text-lg font-medium hover:bg-gray-200 transition-colors whitespace-nowrap cursor-pointer"
                    >
                      <i className="ri-arrow-left-line mr-2"></i>
                      Previous
                    </button>
                  )}
                </div>

                <div className="flex space-x-3">
                  {deliveryStep < 4 && (
                    <button
                      type="button"
                      onClick={() => setShowDeliveryLog(false)}
                      className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl text-lg font-medium hover:bg-gray-200 transition-colors whitespace-nowrap cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                  {deliveryStep < 4 ? (
                    <button
                      type="button"
                      onClick={handleDeliveryNextStep}
                      className="bg-green-600 text-white px-8 py-3 rounded-xl text-lg font-medium hover:bg-green-700 transition-colors whitespace-nowrap cursor-pointer"
                    >
                      Next Step
                      <i className="ri-arrow-right-line ml-2"></i>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowDeliveryLog(false)}
                      className="bg-green-600 text-white px-8 py-3 rounded-xl text-lg font-medium hover:bg-green-700 transition-colors whitespace-nowrap cursor-pointer"
                    >
                      <i className="ri-check-line mr-2"></i>
                      Complete
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCalendar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <i className="ri-calendar-event-line text-white"></i>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Main Lobby Schedule & Events</h3>
                  <p className="text-sm text-gray-600">Monthly view of visitors, appointments, and events</p>
                </div>
              </div>
              <button
                onClick={() => setShowCalendar(false)}
                className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-gray-600"></i>
              </button>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigateMonth(-1)}
                  className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  <i className="ri-arrow-left-line text-gray-600"></i>
                </button>
                <h4 className="text-xl font-semibold text-gray-900">
                  {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h4>
                <button
                  onClick={() => navigateMonth(1)}
                  className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  <i className="ri-arrow-right-line text-gray-600"></i>
                </button>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3 text-sm">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span className="text-gray-600">Visitors</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-gray-600">Appointments</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-purple-500 rounded"></div>
                    <span className="text-gray-600">Events</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-orange-500 rounded"></div>
                    <span className="text-gray-600">Maintenance</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200">
              <div className="grid grid-cols-7 border-b border-gray-200">
                {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                  <div key={day} className="p-4 text-center text-sm font-medium text-gray-700 bg-gray-50">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7">{renderCalendarGrid()}</div>
            </div>

            {selectedDate && (
              <div className="mt-6 bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-lg font-semibold text-gray-900">
                    {currentDate.toLocaleDateString('en-US', { month: 'long' })} {selectedDate.day}, {currentDate.getFullYear()}
                  </h5>
                  <button
                    onClick={() => setSelectedDate(null)}
                    className="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <i className="ri-close-line text-gray-600"></i>
                  </button>
                </div>

                {selectedDate.events.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDate.events.map((event) => (
                      <div key={event.id} className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getEventTypeColor(event.type)}`}>
                              <i className={`${getEventTypeIcon(event.type)} text-white`}></i>
                            </div>
                            <div>
                              <h6 className="font-medium text-gray-900">{event.title}</h6>
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                <span className="flex items-center space-x-1">
                                  <i className="ri-time-line"></i>
                                  <span>{event.time}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <i className="ri-user-line"></i>
                                  <span>{event.host}</span>
                                </span>
                              </div>
                            </div>
                          </div>
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(event.status)}`}>
                            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="ri-calendar-line text-gray-400 text-2xl"></i>
                    </div>
                    <p className="text-gray-500">No events scheduled for this date</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {showTouchscreenEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <i className="ri-smartphone-line text-white"></i>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Self-Service Check-In Kiosk</h3>
                  <p className="text-sm text-gray-600">Welcome! Please follow the steps to register your visit</p>
                </div>
              </div>
              <button
                onClick={() => setShowTouchscreenEntry(false)}
                className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-gray-600"></i>
              </button>
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${touchscreenStep >= 1 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    1
                  </div>
                  <span className={`text-sm font-medium ${touchscreenStep >= 1 ? 'text-green-600' : 'text-gray-400'}`}>
                    Personal Info
                  </span>
                </div>
                <div className="flex-1 mx-4 h-1 bg-gray-200 rounded-full">
                  <div className={`h-full bg-green-600 rounded-full transition-all duration-500 ${touchscreenStep >= 2 ? 'w-full' : 'w-0'}`}></div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${touchscreenStep >= 2 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    2
                  </div>
                  <span className={`text-sm font-medium ${touchscreenStep >= 2 ? 'text-green-600' : 'text-gray-400'}`}>
                    Host & Purpose
                  </span>
                </div>
                <div className="flex-1 mx-4 h-1 bg-gray-200 rounded-full">
                  <div className={`h-full bg-green-600 rounded-full transition-all duration-500 ${touchscreenStep >= 3 ? 'w-full' : 'w-0'}`}></div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${touchscreenStep >= 3 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    3
                  </div>
                  <span className={`text-sm font-medium ${touchscreenStep >= 3 ? 'text-green-600' : 'text-gray-400'}`}>
                    Photo Capture
                  </span>
                </div>
                <div className="flex-1 mx-4 h-1 bg-gray-200 rounded-full">
                  <div className={`h-full bg-green-600 rounded-full transition-all duration-500 ${touchscreenStep >= 4 ? 'w-full' : 'w-0'}`}></div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${touchscreenStep >= 4 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    4
                  </div>
                  <span className={`text-sm font-medium ${touchscreenStep >= 4 ? 'text-green-600' : 'text-gray-400'}`}>
                    Complete
                  </span>
                </div>
              </div>
            </div>

            {touchscreenStep === 1 && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-8 border border-green-200">
                  <h4 className="text-2xl font-semibold text-green-900 mb-6 text-center">
                    <i className="ri-user-line mr-3"></i>
                    Personal Information
                  </h4>

                  <div className="max-w-2xl mx-auto space-y-6">
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-3">Full Name *</label>
                      <input
                        type="text"
                        className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg"
                        placeholder="Enter your full name"
                        style={{ fontSize: '18px' }}
                      />
                    </div>

                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-3">Company/Organization</label>
                      <input
                        type="text"
                        className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg"
                        placeholder="Enter your company name"
                        style={{ fontSize: '18px' }}
                      />
                    </div>

                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-3">Email Address</label>
                      <input
                        type="email"
                        className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg"
                        placeholder="your.email@company.com"
                        style={{ fontSize: '18px' }}
                      />
                    </div>

                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-3">Phone Number</label>
                      <input
                        type="tel"
                        className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg"
                        placeholder="(555) 123-4567"
                        style={{ fontSize: '18px' }}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="ri-information-line text-white"></i>
                    </div>
                    <div>
                      <h5 className="text-lg font-medium text-blue-900">Privacy Notice</h5>
                      <p className="text-blue-700 mt-2">
                        Your personal information is collected for security and visitor management purposes only. We maintain strict confidentiality and comply with all privacy regulations.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {touchscreenStep === 2 && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-8 border border-green-200">
                  <h4 className="text-2xl font-semibold text-green-900 mb-6 text-center">
                    <i className="ri-user-star-line mr-3"></i>
                    Host & Visit Purpose
                  </h4>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-4">Select Your Host Employee *</label>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {hostEmployees.map((host) => (
                          <label key={host.id} className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${host.available ? 'border-gray-200 hover:bg-white hover:border-green-300' : 'border-gray-100 bg-gray-50 opacity-50'}`}>
                            <input
                              type="radio"
                              name="hostEmployee"
                              value={host.id}
                              disabled={!host.available}
                              className="mr-4 w-5 h-5 text-green-600 focus:ring-green-500"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-medium text-gray-900">{host.name}</span>
                                <div className="flex items-center space-x-2">
                                  <div className={`w-3 h-3 rounded-full ${host.available ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                  <span className={`text-sm ${host.available ? 'text-green-600' : 'text-red-600'}`}>
                                    {host.available ? 'Available' : 'Busy'}
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{host.department}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-4">Purpose of Visit *</label>
                      <div className="grid grid-cols-1 gap-3">
                        {visitPurposes.map((purpose) => (
                          <label key={purpose.id} className="flex items-center p-4 border border-gray-200 rounded-xl hover:bg-white hover:border-green-300 cursor-pointer transition-all">
                            <input
                              type="radio"
                              name="visitPurpose"
                              value={purpose.id}
                              className="mr-4 w-5 h-5 text-green-600 focus:ring-green-500"
                            />
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <i className={`${purpose.icon} text-green-600`}></i>
                              </div>
                              <span className="text-lg font-medium text-gray-900">{purpose.name}</span>
                            </div>
                          </label>
                        ))}
                      </div>

                      <div className="mt-6">
                        <label className="block text-lg font-medium text-gray-700 mb-3">Expected Duration</label>
                        <select className="w-full pr-8 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg">
                          <option value="">Select duration</option>
                          <option value="30min">30 minutes</option>
                          <option value="1hour">1 hour</option>
                          <option value="2hours">2 hours</option>
                          <option value="half-day">Half day</option>
                          <option value="full-day">Full day</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="ri-time-line text-white"></i>
                    </div>
                    <div>
                      <h5 className="text-lg font-medium text-yellow-900">Host Notification</h5>
                      <p className="text-yellow-700 mt-2">
                        Your selected host will be automatically notified of your arrival upon check-in completion. Please wait in the designated area for their arrival.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {touchscreenStep === 3 && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-8 border border-green-200">
                  <h4 className="text-2xl font-semibold text-green-900 mb-6 text-center">
                    <i className="ri-camera-line mr-3"></i>
                    Photo Capture for Badge
                  </h4>

                  <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="bg-white rounded-xl p-6 border border-gray-200">
                          <h5 className="text-lg font-medium text-gray-900 mb-4">Camera Preview</h5>

                          {!capturedPhoto ? (
                            <div className="bg-gray-800 rounded-xl aspect-[3/4] flex items-center justify-center relative">
                              {isProcessing ? (
                                <div className="text-center text-white">
                                  <i className="ri-camera-line text-4xl mb-2 animate-pulse"></i>
                                  <p className="text-sm">Capturing photo...</p>
                                  <p className="text-sm text-gray-300">Please remain still</p>
                                </div>
                              ) : (
                                <div className="text-center text-white">
                                  <i className="ri-camera-line text-4xl mb-2"></i>
                                  <p className="text-sm">Camera Ready</p>
                                  <p className="text-sm text-gray-300">Position your face in the frame</p>
                                </div>
                              )}

                              <div className="absolute inset-8 border-2 border-dashed border-white/30 rounded-xl flex items-center justify-center">
                                <div className="text-center text-white/60">
                                  <p className="text-xs">Face Detection Area</p>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="relative">
                              <img
                                src={capturedPhoto}
                                alt="Captured visitor photo"
                                className="w-full aspect-[3/4] object-cover object-top rounded-xl"
                              />
                              <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                                <i className="ri-check-line mr-1"></i>
                                Photo Captured
                              </div>
                            </div>
                          )}

                          <div className="flex space-x-3 mt-6">
                            {!capturedPhoto ? (
                              <button
                                onClick={handlePhotoCapture}
                                disabled={isProcessing}
                                className="flex-1 bg-green-600 text-white px-6 py-4 rounded-xl text-lg font-medium hover:bg-green-700 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
                              >
                                <i className="ri-camera-line mr-3"></i>
                                {isProcessing ? 'Capturing...' : 'Take Photo'}
                              </button>
                            ) : (
                              <button
                                onClick={handleRetakePhoto}
                                className="flex-1 bg-gray-600 text-white px-6 py-4 rounded-xl text-lg font-medium hover:bg-gray-700 transition-colors whitespace-nowrap cursor-pointer"
                              >
                                <i className="ri-camera-line mr-3"></i>
                                Retake Photo
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="bg-white rounded-xl p-6 border border-gray-200">
                          <h5 className="text-lg font-medium text-gray-900 mb-4">Photo Guidelines</h5>
                          <div className="space-y-3">
                            <div className="flex items-center text-green-700">
                              <i className="ri-check-line mr-3 text-lg"></i>
                              <span>Face clearly visible and centered</span>
                            </div>
                            <div className="flex items-center text-green-700">
                              <i className="ri-check-line mr-3 text-lg"></i>
                              <span>Good lighting, no shadows</span>
                            </div>
                            <div className="flex items-center text-green-700">
                              <i className="ri-check-line mr-3 text-lg"></i>
                              <span>Neutral expression, eyes open</span>
                            </div>
                            <div className="flex items-center text-green-700">
                              <i className="ri-check-line mr-3 text-lg"></i>
                              <span>Remove hats and sunglasses</span>
                            </div>
                            <div className="flex items-center text-green-700">
                              <i className="ri-check-line mr-3 text-lg"></i>
                              <span>Look directly at camera</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 border border-gray-200">
                          <h5 className="text-lg font-medium text-gray-900 mb-4">Badge Preview</h5>
                          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                            <div className="flex items-center space-x-4 mb-4">
                              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                                {capturedPhoto ? (
                                  <img
                                    src={capturedPhoto}
                                    alt="Badge photo"
                                    className="w-full h-full object-cover object-top rounded-lg"
                                  />
                                ) : (
                                  <i className="ri-user-line text-gray-400 text-2xl"></i>
                                )}
                              </div>
                              <div>
                                <p className="font-semibold text-lg">VISITOR</p>
                                <p className="text-lg opacity-90">Main Lobby</p>
                                <p className="text-sm opacity-75" suppressHydrationWarning={true}>
                                  {new Date().toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="border-t border-white/20 pt-4">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="opacity-75">Badge ID</p>
                                  <p className="font-semibold">V-0125</p>
                                </div>
                                <div>
                                  <p className="opacity-75">Host</p>
                                  <p className="font-semibold">M. Chen</p>
                                </div>
                                <div>
                                  <p className="opacity-75">Location</p>
                                  <p className="font-semibold">Main Lobby</p>
                                </div>
                                <div>
                                  <p className="opacity-75">Date</p>
                                  <p className="font-semibold" suppressHydrationWarning={true}>
                                    {new Date().toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                          <div className="flex items-start space-x-4">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <i className="ri-shield-check-line text-white"></i>
                            </div>
                            <div>
                              <h5 className="text-lg font-medium text-blue-900">Security Notice</h5>
                              <p className="text-blue-700 mt-2">
                                Your photo will be used for security identification purposes only. The badge must be worn visibly at all times while on premises.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {touchscreenStep === 4 && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-8 border border-green-200">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="ri-check-line text-white text-4xl"></i>
                    </div>
                    <h4 className="text-3xl font-bold text-green-900 mb-2">Check-In Complete!</h4>
                    <p className="text-lg text-green-700">Welcome to our facility. Your badge has been generated.</p>
                  </div>

                  <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="bg-white rounded-xl p-6 border border-gray-200">
                          <h5 className="text-lg font-medium text-gray-900 mb-4">Visit Summary</h5>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Visitor Name:</span>
                              <span className="font-medium text-gray-900">Sarah Johnson</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Company:</span>
                              <span className="font-medium text-gray-900">Tech Solutions Inc.</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Host:</span>
                              <span className="font-medium text-gray-900">Michael Chen</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Purpose:</span>
                              <span className="font-medium text-gray-900">Business Meeting</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Duration:</span>
                              <span className="font-medium text-gray-900">2 hours</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Badge ID:</span>
                              <span className="font-medium text-green-600">V-0125</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 border border-gray-200">
                          <h5 className="text-lg font-medium text-gray-900 mb-4">Check-In Details</h5>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Check-In Time:</span>
                              <span className="font-medium text-gray-900" suppressHydrationWarning={true}>
                                {new Date().toLocaleTimeString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Location:</span>
                              <span className="font-medium text-gray-900">Main Lobby</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Status:</span>
                              <span className="inline-flex px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                Active
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Badge Expires:</span>
                              <span className="font-medium text-gray-900">End of Business Day</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="bg-white rounded-xl p-6 border border-gray-200">
                          <h5 className="text-lg font-medium text-gray-900 mb-4">Your Digital Badge</h5>
                          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                            <div className="flex items-center space-x-4 mb-4">
                              <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center">
                                {capturedPhoto ? (
                                  <img
                                    src={capturedPhoto}
                                    alt="Badge photo"
                                    className="w-full h-full object-cover object-top rounded-lg"
                                  />
                                ) : (
                                  <i className="ri-user-line text-gray-400 text-3xl"></i>
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-xl">VISITOR</p>
                                <p className="text-lg opacity-90">Sarah Johnson</p>
                                <p className="text-sm opacity-75">Tech Solutions Inc.</p>
                              </div>
                            </div>
                            <div className="border-t border-white/20 pt-4">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="opacity-75">Badge ID</p>
                                  <p className="font-semibold">V-0125</p>
                                </div>
                                <div>
                                  <p className="opacity-75">Host</p>
                                  <p className="font-semibold">M. Chen</p>
                                </div>
                                <div>
                                  <p className="opacity-75">Location</p>
                                  <p className="font-semibold">Main Lobby</p>
                                </div>
                                <div>
                                  <p className="opacity-75">Date</p>
                                  <p className="font-semibold" suppressHydrationWarning={true}>
                                    {new Date().toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 border border-gray-200">
                          <h5 className="text-lg font-medium text-gray-900 mb-4">Next Steps</h5>
                          <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <span className="text-white text-sm font-bold">1</span>
                              </div>
                              <p className="text-gray-700">Your host has been notified and will be with you shortly</p>
                            </div>
                            <div className="flex items-start space-x-3">
                              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <span className="text-white text-sm font-bold">2</span>
                              </div>
                              <p className="text-gray-700">Please take a seat in the waiting area</p>
                            </div>
                            <div className="flex items-start space-x-3">
                              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <span className="text-white text-sm font-bold">3</span>
                              </div>
                              <p className="text-gray-700">Keep your badge visible at all times</p>
                            </div>
                            <div className="flex items-start space-x-3">
                              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <span className="text-white text-sm font-bold">4</span>
                              </div>
                              <p className="text-gray-700">Return badge before leaving the building</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center justify-center space-x-4 text-green-700">
                    <i className="ri-checkbox-circle-line text-2xl"></i>
                    <div>
                      <h5 className="text-lg font-medium">Registration Successful</h5>
                      <p className="text-sm">Thank you for using our self-service check-in system. Have a great visit!</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <div className="flex space-x-3">
                {touchscreenStep > 1 && touchscreenStep < 4 && (
                  <button
                    onClick={handleTouchscreenPrevStep}
                    className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl text-lg font-medium hover:bg-gray-200 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <i className="ri-arrow-left-line mr-2"></i>
                    Previous
                  </button>
                )}
              </div>

              <div className="flex space-x-3">
                {touchscreenStep < 4 && (
                  <button
                    onClick={() => setShowTouchscreenEntry(false)}
                    className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl text-lg font-medium hover:bg-gray-200 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
                {touchscreenStep < 4 ? (
                  <button
                    onClick={handleTouchscreenNextStep}
                    className="bg-green-600 text-white px-8 py-3 rounded-xl text-lg font-medium hover:bg-green-700 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Next Step
                    <i className="ri-arrow-right-line ml-2"></i>
                  </button>
                ) : (
                  <button
                    onClick={handleTouchscreenComplete}
                    disabled={isProcessing}
                    className="bg-green-600 text-white px-8 py-3 rounded-xl text-lg font-medium hover:bg-green-700 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <i className="ri-loader-4-line mr-2 animate-spin"></i>
                        Processing...
                      </>
                    ) : (
                      <>
                        <i className="ri-check-line mr-2"></i>
                        Complete Check-In
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showVisitorSignIn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Visitor Sign-In Options</h3>
              <button
                onClick={() => setShowVisitorSignIn(false)}
                className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-gray-600"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Self-Service Kiosk</h4>
                <p className="text-sm text-gray-600 mb-3">Quick check-in with touchscreen interface</p>
                <button
                  onClick={handleTouchscreenEntry}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-smartphone-line mr-2"></i>
                  Touchscreen Entry
                </button>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Assisted Check-In</h4>
                <p className="text-sm text-gray-600 mb-3">Staff-assisted registration with photo capture</p>
                <button
                  onClick={handleCapturePhotoAndCheckIn}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-camera-line mr-2"></i>
                  Capture Photo & Check In
                </button>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowVisitorSignIn(false)}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors whitespace-nowrap cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showPhotoCapture && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Photo Capture & Visitor Registration</h3>
              <button
                onClick={() => setShowPhotoCapture(false)}
                className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-gray-600"></i>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Visitor Photo</h4>

                  {!capturedPhoto ? (
                    <div className="bg-gray-800 rounded-lg aspect-[3/4] flex items-center justify-center relative">
                      {isProcessing ? (
                        <div className="text-center text-white">
                          <i className="ri-camera-line text-4xl mb-2 animate-pulse"></i>
                          <p className="text-sm">Capturing photo...</p>
                          <p className="text-sm text-gray-300">Please remain still</p>
                        </div>
                      ) : (
                        <div className="text-center text-white">
                          <i className="ri-camera-line text-4xl mb-2"></i>
                          <p className="text-sm">Camera Ready</p>
                          <p className="text-sm text-gray-300">Position your face in the frame</p>
                        </div>
                      )}

                      <div className="absolute inset-8 border-2 border-dashed border-white/30 rounded-lg flex items-center justify-center">
                        <div className="text-center text-white/60">
                          <p className="text-xs">Face Detection Area</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={capturedPhoto}
                        alt="Captured visitor photo"
                        className="w-full aspect-[3/4] object-cover object-top rounded-lg"
                      />
                      <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                        <i className="ri-check-line mr-1"></i>
                        Photo Captured
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2 mt-4">
                    {!capturedPhoto ? (
                      <button
                        onClick={handlePhotoCapture}
                        disabled={isProcessing}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
                      >
                        <i className="ri-camera-line mr-2"></i>
                        {isProcessing ? 'Capturing...' : 'Take Photo'}
                      </button>
                    ) : (
                      <button
                        onClick={handleRetakePhoto}
                        className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors whitespace-nowrap cursor-pointer"
                      >
                        <i className="ri-camera-line mr-2"></i>
                        Retake Photo
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Visitor Information</h4>

                  <form className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="Enter visitor's full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="Enter company name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="visitor@company.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="(555) 123-4567"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Host Employee *</label>
                      <select className="w-full pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
                        <option value="">Select host employee</option>
                        <option value="john-smith">John Smith - IT Department</option>
                        <option value="sarah-johnson">Sarah Johnson - Marketing</option>
                        <option value="michael-chen">Michael Chen - Sales</option>
                        <option value="lisa-wang">Lisa Wang - HR</option>
                        <option value="david-rodriguez">David Rodriguez - Finance</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Purpose of Visit *</label>
                      <select className="w-full pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
                        <option value="">Select purpose</option>
                        <option value="business-meeting">Business Meeting</option>
                        <option value="interview">Interview</option>
                        <option value="consultation">Consultation</option>
                        <option value="training">Training Session</option>
                        <option value="delivery">Delivery/Pickup</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expected Duration</label>
                      <select className="w-full pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
                        <option value="">Select duration</option>
                        <option value="30min">30 minutes</option>
                        <option value="1hour">1 hour</option>
                        <option value="2hours">2 hours</option>
                        <option value="half-day">Half day</option>
                        <option value="full-day">Full day</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        rows={2}
                        placeholder="Any special requirements or notes"
                        maxLength={500}
                      ></textarea>
                    </div>
                  </form>
                </div>

                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <i className="ri-information-line text-yellow-600 mt-0.5"></i>
                    <div>
                      <h5 className="text-sm font-medium text-yellow-800">Security & Compliance</h5>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded text-blue-600" />
                          <span className="text-xs text-yellow-800">Government ID verified</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded text-blue-600" />
                          <span className="text-xs text-yellow-800">Safety briefing completed</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded text-blue-600" />
                          <span className="text-xs text-yellow-800">Confidentiality agreement signed</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 pt-6 border-t border-gray-200">
              <button
                onClick={() => setShowPhotoCapture(false)}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors whitespace-nowrap cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCompleteRegistration}
                disabled={!capturedPhoto || isProcessing}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <i className="ri-loader-4-line mr-2 animate-spin"></i>
                    Processing...
                  </>
                ) : (
                  <>
                    <i className="ri-check-line mr-2"></i>
                    Complete Registration
                  </>
                )}
              </button>
            </div>

            {capturedPhoto && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <div className="flex items-center text-green-700 text-sm">
                  <i className="ri-check-line mr-2"></i>
                  <span className="font-medium">Ready to complete registration</span>
                </div>
                <p className="text-xs text-green-600 mt-1">
                  Photo captured successfully. Complete the form and click "Complete Registration" to generate badge and notify host.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {showVipCheckIn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                  <i className="ri-vip-crown-line text-white"></i>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">VIP Executive Check-In</h3>
                  <p className="text-sm text-gray-600">Premium registration for executive visitors</p>
                </div>
              </div>
              <button
                onClick={() => setShowVipCheckIn(false)}
                className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-gray-600"></i>
              </button>
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${vipStep >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    1
                  </div>
                  <span className={`text-sm font-medium ${vipStep >= 1 ? 'text-purple-600' : 'text-gray-400'}`}>
                    VIP Profile
                  </span>
                </div>
                <div className="flex-1 mx-4 h-0.5 bg-gray-200">
                  <div className={`h-full bg-purple-600 transition-all duration-300 ${vipStep >= 2 ? 'w-full' : 'w-0'}`}></div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${vipStep >= 2 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    2
                  </div>
                  <span className={`text-sm font-medium ${vipStep >= 2 ? 'text-purple-600' : 'text-gray-400'}`}>
                    Services & Access
                  </span>
                </div>
                <div className="flex-1 mx-4 h-0.5 bg-gray-200">
                  <div className={`h-full bg-purple-600 transition-all duration-300 ${vipStep >= 3 ? 'w-full' : 'w-0'}`}></div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${vipStep >= 3 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    3
                  </div>
                  <span className={`text-sm font-medium ${vipStep >= 3 ? 'text-purple-600' : 'text-gray-400'}`}>
                    Confirmation
                  </span>
                </div>
              </div>
            </div>

            {vipStep === 1 && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                  <h4 className="text-lg font-semibold text-purple-900 mb-4">VIP Guest Information</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                          placeholder="Enter VIP guest's full name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title/Position</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                          placeholder="CEO, President, Director, etc."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company/Organization</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                          placeholder="Enter company or organization"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">VIP Tier Level *</label>
                        <div className="space-y-2">
                          {vipTiers.map((tier) => (
                            <label key={tier.id} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                              <input
                                type="radio"
                                name="vipTier"
                                value={tier.id}
                                className="mr-3 text-purple-600 focus:ring-purple-500"
                              />
                              <div className="flex-1 flex items-center justify-between">
                                <div>
                                  <div className={`inline-block px-3 py-1 rounded-full text-white text-sm font-medium ${tier.color}`}>
                                    {tier.name}
                                  </div>
                                  <p className="text-xs text-gray-600 mt-1">{tier.access}</p>
                                </div>
                                <i className="ri-vip-crown-line text-purple-400"></i>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Executive Host *</label>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {executiveHosts.map((host) => (
                            <label key={host.id} className={`flex items-center p-3 border rounded-lg cursor-pointer ${host.available ? 'border-gray-200 hover:bg-gray-50' : 'border-gray-100 bg-gray-50 opacity-50'}`}>
                              <input
                                type="radio"
                                name="executiveHost"
                                value={host.id}
                                disabled={!host.available}
                                className="mr-3 text-purple-600 focus:ring-purple-500"
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-gray-900">{host.name}</span>
                                  <div className="flex items-center space-x-2">
                                    <div className={`w-2 h-2 rounded-full ${host.available ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    <span className={`text-xs ${host.available ? 'text-green-600' : 'text-red-600'}`}>
                                      {host.available ? 'Available' : 'Busy'}
                                    </span>
                                  </div>
                                </div>
                                <p className="text-xs text-gray-600">{host.department}</p>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Purpose</label>
                        <select className="w-full pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm">
                          <option value="">Select meeting purpose</option>
                          <option value="board-meeting">Board Meeting</option>
                          <option value="executive-review">Executive Review</option>
                          <option value="strategic-planning">Strategic Planning</option>
                          <option value="investor-meeting">Investor Meeting</option>
                          <option value="partnership-discussion">Partnership Discussion</option>
                          <option value="contract-signing">Contract Signing</option>
                          <option value="due-diligence">Due Diligence</option>
                          <option value="other">Other Executive Matter</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Special Requirements</label>
                        <textarea
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                          rows={3}
                          placeholder="Dietary restrictions, accessibility needs, security requirements, etc."
                          maxLength={500}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
                  <div className="flex items-start space-x-3">
                    <i className="ri-information-line text-yellow-600 mt-0.5"></i>
                    <div>
                      <h5 className="text-sm font-medium text-yellow-800">VIP Protocol Notice</h5>
                      <p className="text-sm text-yellow-700 mt-1">
                        VIP guests receive priority processing, enhanced security clearance, and personalized service. All executive visits are logged and reported to security management.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {vipStep === 2 && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                  <h4 className="text-lg font-semibold text-purple-900 mb-4">VIP Services & Access Level</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-3">Premium Services</h5>
                      <div className="space-y-3">
                        {vipServices.map((service) => (
                          <label key={service.id} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-white cursor-pointer">
                            <input
                              type="checkbox"
                              className="mr-3 text-purple-600 focus:ring-purple-500"
                            />
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                <i className={`${service.icon} text-purple-600`}></i>
                              </div>
                              <span className="text-sm font-medium text-gray-900">{service.name}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-3">Access Configuration</h5>

                      <div className="space-y-4">
                        <div className="p-4 bg-white rounded-lg border border-gray-200">
                          <h6 className="text-sm font-medium text-gray-900 mb-2">Building Access Level</h6>
                          <div className="space-y-2">
                            <label className="flex items-center">
                              <input type="radio" name="accessLevel" value="full" className="mr-2 text-purple-600 focus:ring-purple-500" />
                              <span className="text-sm text-gray-700">Full Building Access</span>
                            </label>
                            <label className="flex items-center">
                              <input type="radio" name="accessLevel" value="executive" className="mr-2 text-purple-600 focus:ring-purple-500" />
                              <span className="text-sm text-gray-700">Executive Floors Only</span>
                            </label>
                            <label className="flex items-center">
                              <input type="radio" name="accessLevel" value="meeting" className="mr-2 text-purple-600 focus:ring-purple-500" />
                              <span className="text-sm text-gray-700">Meeting Rooms Only</span>
                            </label>
                          </div>
                        </div>

                        <div className="p-4 bg-white rounded-lg border border-gray-200">
                          <h6 className="text-sm font-medium text-gray-900 mb-2">Badge Duration</h6>
                          <select className="w-full pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm">
                            <option value="2hours">2 Hours</option>
                            <option value="4hours">4 Hours</option>
                            <option value="half-day">Half Day</option>
                            <option value="full-day">Full Day</option>
                            <option value="extended">Extended Access</option>
                          </select>
                        </div>

                        <div className="p-4 bg-white rounded-lg border border-gray-200">
                          <h6 className="text-sm font-medium text-gray-900 mb-2">Security Clearance</h6>
                          <div className="space-y-2">
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2 text-purple-600 focus:ring-purple-500" />
                              <span className="text-sm text-gray-700">Enhanced Security Screening</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2 text-purple-600 focus:ring-purple-500" />
                              <span className="text-sm text-gray-700">Confidentiality Agreement</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2 text-purple-600 focus:ring-purple-500" />
                              <span className="text-sm text-gray-700">NDA Documentation</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                  <div className="flex items-start space-x-3">
                    <i className="ri-shield-check-line text-green-600 mt-0.5"></i>
                    <div>
                      <h5 className="text-sm font-medium text-green-800">VIP Service Guarantee</h5>
                      <p className="text-sm text-green-700 mt-1">
                        All selected services will be immediately coordinated and made available upon arrival. Priority notification has been sent to relevant departments.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {vipStep === 3 && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                  <h4 className="text-lg font-semibold text-purple-900 mb-4">VIP Registration Confirmation</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-6 border border-gray-200">
                        <h5 className="text-sm font-medium text-gray-900 mb-3">Guest Information</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Name:</span>
                            <span className="font-medium text-gray-900">John Anderson</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Title:</span>
                            <span className="font-medium text-gray-900">CEO</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Company:</span>
                            <span className="font-medium text-gray-900">Global Corp</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">VIP Tier:</span>
                            <span className="inline-block px-2 py-1 bg-gradient-to-r from-gray-600 to-gray-800 text-white text-xs rounded-full">
                              Platinum VIP
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-6 border border-gray-200">
                        <h5 className="text-sm font-medium text-gray-900 mb-3">Meeting Details</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Host:</span>
                            <span className="font-medium text-gray-900">CEO Office</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Purpose:</span>
                            <span className="font-medium text-gray-900">Strategic Planning</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Duration:</span>
                            <span className="font-medium text-gray-900">Full Day</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Access Level:</span>
                            <span className="font-medium text-gray-900">Full Building</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-6 border border-gray-200">
                        <h5 className="text-sm font-medium text-gray-900 mb-3">VIP Services Activated</h5>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-green-700">
                            <i className="ri-check-line mr-2"></i>
                            <span>Personal Escort Service</span>
                          </div>
                          <div className="flex items-center text-sm text-green-700">
                            <i className="ri-check-line mr-2"></i>
                            <span>VIP Lounge Access</span>
                          </div>
                          <div className="flex items-center text-sm text-green-700">
                            <i className="ri-check-line mr-2"></i>
                            <span>Premium Refreshments</span>
                          </div>
                          <div className="flex items-center text-sm text-green-700">
                            <i className="ri-check-line mr-2"></i>
                            <span>Reserved Parking</span>
                          </div>
                          <div className="flex items-center text-sm text-green-700">
                            <i className="ri-check-line mr-2"></i>
                            <span>Priority Processing</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-6 border border-gray-200">
                        <h5 className="text-sm font-medium text-gray-900 mb-3">Badge Information</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Badge ID:</span>
                            <span className="font-medium text-gray-900">VIP-001</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Check-in Time:</span>
                            <span className="font-medium text-gray-900" suppressHydrationWarning={true}>
                              {new Date().toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Expiry:</span>
                            <span className="font-medium text-gray-900">End of Business Day</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                              Active
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                  <div className="flex items-start space-x-3">
                    <i className="ri-notification-2-line text-blue-600 mt-0.5"></i>
                    <div>
                      <h5 className="text-sm font-medium text-blue-800">Notifications Sent</h5>
                      <ul className="text-sm text-blue-700 mt-1 space-y-1">
                        <li>• Executive host has been notified of VIP arrival</li>
                        <li>• Security team activated for enhanced protocols</li>
                        <li>• VIP services team prepared for immediate assistance</li>
                        <li>• Parking attendant reserved premium space</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <div className="flex space-x-3">
                {vipStep > 1 && (
                  <button
                    onClick={handleVipPrevStep}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <i className="ri-arrow-left-line mr-2"></i>
                    Previous
                  </button>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowVipCheckIn(false)}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Cancel
                </button>
                {vipStep < 3 ? (
                  <button
                    onClick={handleVipNextStep}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Next Step
                    <i className="ri-arrow-right-line ml-2"></i>
                  </button>
                ) : (
                  <button
                    onClick={handleVipComplete}
                    disabled={isProcessing}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <i className="ri-loader-4-line mr-2 animate-spin"></i>
                        Processing...
                      </>
                    ) : (
                      <>
                        <i className="ri-check-line mr-2"></i>
                        Complete VIP Check-In
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
