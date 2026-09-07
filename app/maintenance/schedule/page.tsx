
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function MaintenanceSchedulePage() {
  const [selectedView, setSelectedView] = useState('calendar');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const scheduleData = [
    {
      id: 1,
      title: 'HVAC System Inspection',
      asset: 'HVAC Unit A-201',
      type: 'Preventive',
      priority: 'High',
      technician: 'John Martinez',
      date: '2024-01-15',
      time: '09:00',
      duration: '2 hours',
      status: 'Scheduled',
      department: 'HVAC',
      location: 'Floor 2 - East Wing',
      description: 'Quarterly inspection of HVAC system including filter replacement and performance check'
    },
    {
      id: 2,
      title: 'Elevator Maintenance',
      asset: 'Elevator B-1',
      type: 'Preventive',
      priority: 'Medium',
      technician: 'Sarah Johnson',
      date: '2024-01-15',
      time: '14:00',
      duration: '3 hours',
      status: 'In Progress',
      department: 'Mechanical',
      location: 'Building B - Main Elevator',
      description: 'Monthly elevator maintenance including cable inspection and safety system check'
    },
    {
      id: 3,
      title: 'Generator Testing',
      asset: 'Generator Main',
      type: 'Preventive',
      priority: 'High',
      technician: 'Mike Chen',
      date: '2024-01-16',
      time: '10:00',
      duration: '1 hour',
      status: 'Scheduled',
      department: 'Electrical',
      location: 'Basement - Generator Room',
      description: 'Weekly generator testing and fuel level check'
    },
    {
      id: 4,
      title: 'Fire System Check',
      asset: 'Fire System Floor 3',
      type: 'Preventive',
      priority: 'High',
      technician: 'Lisa Wang',
      date: '2024-01-16',
      time: '11:00',
      duration: '2 hours',
      status: 'Scheduled',
      department: 'Safety',
      location: 'Floor 3 - All Areas',
      description: 'Monthly fire safety system inspection and alarm testing'
    },
    {
      id: 5,
      title: 'Lighting Maintenance',
      asset: 'LED Lights Parking',
      type: 'Corrective',
      priority: 'Low',
      technician: 'David Brown',
      date: '2024-01-17',
      time: '15:00',
      duration: '1 hour',
      status: 'Scheduled',
      department: 'Electrical',
      location: 'Parking Garage',
      description: 'Replace faulty LED lights in parking area'
    },
    {
      id: 6,
      title: 'Plumbing Inspection',
      asset: 'Water System Main',
      type: 'Preventive',
      priority: 'Medium',
      technician: 'Robert Davis',
      date: '2024-01-17',
      time: '08:00',
      duration: '4 hours',
      status: 'Scheduled',
      department: 'Plumbing',
      location: 'Building Wide',
      description: 'Semi-annual plumbing system inspection and leak detection'
    }
  ];

  const upcomingTasks = [
    {
      id: 1,
      title: 'HVAC Filter Replacement',
      asset: 'HVAC Unit C-305',
      date: '2024-01-18',
      time: '09:00',
      technician: 'John Martinez',
      priority: 'Medium'
    },
    {
      id: 2,
      title: 'Security Camera Maintenance',
      asset: 'Camera System Floor 1',
      date: '2024-01-19',
      time: '13:00',
      technician: 'Sarah Johnson',
      priority: 'Low'
    },
    {
      id: 3,
      title: 'Boiler Inspection',
      asset: 'Boiler Unit Main',
      date: '2024-01-20',
      time: '10:00',
      technician: 'Mike Chen',
      priority: 'High'
    }
  ];

  const recurringSchedules = [
    {
      id: 1,
      title: 'Daily HVAC Check',
      frequency: 'Daily',
      nextDue: '2024-01-16',
      technician: 'John Martinez',
      status: 'Active'
    },
    {
      id: 2,
      title: 'Weekly Generator Test',
      frequency: 'Weekly',
      nextDue: '2024-01-22',
      technician: 'Mike Chen',
      status: 'Active'
    },
    {
      id: 3,
      title: 'Monthly Fire System Check',
      frequency: 'Monthly',
      nextDue: '2024-02-16',
      technician: 'Lisa Wang',
      status: 'Active'
    },
    {
      id: 4,
      title: 'Quarterly Elevator Inspection',
      frequency: 'Quarterly',
      nextDue: '2024-04-15',
      technician: 'Sarah Johnson',
      status: 'Active'
    }
  ];

  const technicians = [
    { id: 1, name: 'John Martinez', department: 'HVAC', available: true },
    { id: 2, name: 'Sarah Johnson', department: 'Mechanical', available: true },
    { id: 3, name: 'Mike Chen', department: 'Electrical', available: false },
    { id: 4, name: 'Lisa Wang', department: 'Safety', available: true },
    { id: 5, name: 'David Brown', department: 'Electrical', available: true },
    { id: 6, name: 'Robert Davis', department: 'Plumbing', available: true }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-700';
      case 'In Progress': return 'bg-orange-100 text-orange-700';
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/maintenance" className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center cursor-pointer">
                <i className="ri-arrow-left-line text-white"></i>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Maintenance Schedule</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setSelectedView('calendar')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    selectedView === 'calendar' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Calendar View
                </button>
                <button
                  onClick={() => setSelectedView('list')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    selectedView === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  List View
                </button>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
              >
                <i className="ri-add-line mr-2"></i>
                Schedule Task
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <i className="ri-calendar-line text-white"></i>
              </div>
              <span className="text-sm font-medium text-blue-600">Today</span>
            </div>
            <h3 className="text-sm text-gray-600 mb-1">Scheduled Tasks</h3>
            <p className="text-2xl font-bold text-gray-900">8</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <i className="ri-time-line text-white"></i>
              </div>
              <span className="text-sm font-medium text-orange-600">Active</span>
            </div>
            <h3 className="text-sm text-gray-600 mb-1">In Progress</h3>
            <p className="text-2xl font-bold text-gray-900">3</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                <i className="ri-alarm-line text-white"></i>
              </div>
              <span className="text-sm font-medium text-red-600">Urgent</span>
            </div>
            <h3 className="text-sm text-gray-600 mb-1">High Priority</h3>
            <p className="text-2xl font-bold text-gray-900">2</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <i className="ri-user-line text-white"></i>
              </div>
              <span className="text-sm font-medium text-green-600">Available</span>
            </div>
            <h3 className="text-sm text-gray-600 mb-1">Technicians</h3>
            <p className="text-2xl font-bold text-gray-900">5</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Schedule Content */}
          <div className="lg:col-span-2">
            {selectedView === 'calendar' ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">January 2024</h3>
                    <div className="flex items-center space-x-2">
                      <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 cursor-pointer">
                        <i className="ri-arrow-left-line text-gray-600"></i>
                      </button>
                      <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 cursor-pointer">
                        <i className="ri-arrow-right-line text-gray-600"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className="p-3 text-center text-sm font-medium text-gray-600">{day}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 35 }, (_, i) => {
                      const date = i - 6 + 1;
                      const isToday = date === 15;
                      const hasSchedule = [15, 16, 17, 18, 19, 20].includes(date);
                      
                      return (
                        <div key={i} className={`p-3 text-center text-sm cursor-pointer rounded-lg hover:bg-gray-50 ${
                          isToday ? 'bg-blue-50 text-blue-600 font-semibold' : 
                          date > 0 && date <= 31 ? 'text-gray-900' : 'text-gray-400'
                        }`}>
                          {date > 0 && date <= 31 ? date : ''}
                          {hasSchedule && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mt-1"></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Scheduled Tasks</h3>
                    <div className="flex items-center space-x-2">
                      <select className="pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
                        <option>All Priorities</option>
                        <option>High Priority</option>
                        <option>Medium Priority</option>
                        <option>Low Priority</option>
                      </select>
                      <select className="pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
                        <option>All Departments</option>
                        <option>HVAC</option>
                        <option>Electrical</option>
                        <option>Plumbing</option>
                        <option>Safety</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {scheduleData.map((task) => (
                      <div key={task.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                           onClick={() => setSelectedSchedule(task)}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="font-medium text-gray-900">{task.title}</h4>
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                              </span>
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
                                {task.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{task.asset} • {task.location}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <i className="ri-calendar-line"></i>
                                <span>{task.date}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <i className="ri-time-line"></i>
                                <span>{task.time}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <i className="ri-user-line"></i>
                                <span>{task.technician}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 cursor-pointer">
                              <i className="ri-edit-line text-gray-600"></i>
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 cursor-pointer">
                              <i className="ri-more-2-line text-gray-600"></i>
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

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Tasks */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Upcoming Tasks</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {upcomingTasks.map((task) => (
                    <div key={task.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{task.asset}</p>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>{task.date} at {task.time}</span>
                        <span>{task.technician}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Technician Availability */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Technician Status</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {technicians.map((tech) => (
                    <div key={tech.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <i className="ri-user-line text-gray-600"></i>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm">{tech.name}</h4>
                          <p className="text-xs text-gray-600">{tech.department}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${tech.available ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className={`text-xs font-medium ${tech.available ? 'text-green-600' : 'text-red-600'}`}>
                          {tech.available ? 'Available' : 'Busy'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recurring Schedules */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recurring Tasks</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {recurringSchedules.map((schedule) => (
                    <div key={schedule.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-sm">{schedule.title}</h4>
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                          {schedule.frequency}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>Next: {schedule.nextDue}</span>
                        <span>{schedule.technician}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Schedule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Schedule New Task</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <i className="ri-close-line text-gray-600"></i>
              </button>
            </div>
            
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter task title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Asset</label>
                  <select className="w-full pr-8 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Select Asset</option>
                    <option>HVAC Unit A-201</option>
                    <option>Elevator B-1</option>
                    <option>Generator Main</option>
                    <option>Fire System Floor 3</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select className="w-full pr-8 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select className="w-full pr-8 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Preventive</option>
                    <option>Corrective</option>
                    <option>Emergency</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <input
                    type="time"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <select className="w-full pr-8 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>1 hour</option>
                    <option>2 hours</option>
                    <option>3 hours</option>
                    <option>4 hours</option>
                    <option>Full day</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Technician</label>
                  <select className="w-full pr-8 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Select Technician</option>
                    {technicians.filter(t => t.available).map(tech => (
                      <option key={tech.id}>{tech.name} - {tech.department}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter location"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
                  placeholder="Enter task description"
                  maxLength={500}
                ></textarea>
              </div>
              
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="recurring" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <label htmlFor="recurring" className="text-sm font-medium text-gray-700">Make this a recurring task</label>
              </div>
              
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium cursor-pointer whitespace-nowrap"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Schedule Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Details Modal */}
      {selectedSchedule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Task Details</h3>
              <button
                onClick={() => setSelectedSchedule(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <i className="ri-close-line text-gray-600"></i>
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Task Information</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Title:</span>
                      <p className="font-medium text-gray-900">{selectedSchedule.title}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Asset:</span>
                      <p className="font-medium text-gray-900">{selectedSchedule.asset}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Type:</span>
                      <p className="font-medium text-gray-900">{selectedSchedule.type}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Priority:</span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(selectedSchedule.priority)}`}>
                        {selectedSchedule.priority}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedSchedule.status)}`}>
                        {selectedSchedule.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Schedule Details</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Date:</span>
                      <p className="font-medium text-gray-900">{selectedSchedule.date}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Time:</span>
                      <p className="font-medium text-gray-900">{selectedSchedule.time}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Duration:</span>
                      <p className="font-medium text-gray-900">{selectedSchedule.duration}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Technician:</span>
                      <p className="font-medium text-gray-900">{selectedSchedule.technician}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Location:</span>
                      <p className="font-medium text-gray-900">{selectedSchedule.location}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedSchedule.description}</p>
              </div>
              
              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                <button className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium cursor-pointer whitespace-nowrap">
                  <i className="ri-edit-line mr-2"></i>
                  Edit Task
                </button>
                <button className="px-4 py-2 text-red-600 hover:text-red-700 font-medium cursor-pointer whitespace-nowrap">
                  <i className="ri-delete-bin-line mr-2"></i>
                  Cancel Task
                </button>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap">
                  <i className="ri-check-line mr-2"></i>
                  Mark Complete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
