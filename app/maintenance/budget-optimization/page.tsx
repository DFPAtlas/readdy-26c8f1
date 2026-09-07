'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function BudgetOptimizationPage() {
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [optimizationMode, setOptimizationMode] = useState('balanced');
  const [showWhatIfModal, setShowWhatIfModal] = useState(false);
  const [showXAIModal, setShowXAIModal] = useState(false);

  // AI-driven budget optimization data
  const budgetData = {
    totalBudget: 2450000,
    allocatedBudget: 1876000,
    availableBudget: 574000,
    predictedSavings: 185000,
    riskScore: 0.23,
    optimizationScore: 87.3,
    aiConfidence: 94.2
  };

  const optimizationGoals = [
    { id: 'cost', name: 'Minimize Cost', weight: 30, active: true },
    { id: 'lifespan', name: 'Maximize Asset Lifespan', weight: 25, active: true },
    { id: 'downtime', name: 'Reduce Downtime', weight: 35, active: true },
    { id: 'safety', name: 'Enhance Safety', weight: 10, active: true }
  ];

  const aiRecommendations = [
    {
      id: 1,
      type: 'critical',
      title: 'Increase HVAC Preventive Maintenance Budget',
      description: 'AI analysis shows 34% failure risk reduction with 15% budget increase',
      impact: 'High',
      confidence: 92.5,
      savings: 45000,
      priority: 'Immediate',
      reasoning: 'LSTM model predicts 3 critical failures in Q2 based on sensor data',
      explanation: 'Temperature variance patterns indicate impending compressor failures'
    },
    {
      id: 2,
      type: 'optimization',
      title: 'Shift Fire Safety Budget to Q3',
      description: 'Optimal timing based on regulatory cycles and vendor availability',
      impact: 'Medium',
      confidence: 87.3,
      savings: 12000,
      priority: 'Plan',
      reasoning: 'Genetic algorithm optimization suggests 8% cost reduction',
      explanation: 'Seasonal pricing patterns and compliance schedules alignment'
    },
    {
      id: 3,
      type: 'predictive',
      title: 'Elevator Modernization Investment',
      description: 'Replace aging elevator systems before failure cascade',
      impact: 'High',
      confidence: 89.7,
      savings: 78000,
      priority: 'Strategic',
      reasoning: 'Survival analysis indicates 78% failure probability within 18 months',
      explanation: 'Mechanical stress patterns exceed normal operational thresholds'
    }
  ];

  const assetRiskAnalysis = [
    {
      assetId: 'HVAC-001',
      name: 'Central Air Conditioning Unit A',
      currentBudget: 45000,
      recommendedBudget: 52000,
      riskScore: 0.87,
      predictedRUL: 18, // months
      failureProbability: 0.34,
      maintenanceType: 'Preventive',
      aiInsight: 'Compressor showing stress patterns',
      impactScore: 'Critical'
    },
    {
      assetId: 'ELEV-002',
      name: 'Passenger Elevator B',
      currentBudget: 32000,
      recommendedBudget: 85000,
      riskScore: 0.78,
      predictedRUL: 14,
      failureProbability: 0.67,
      maintenanceType: 'Corrective',
      aiInsight: 'Motor bearings deteriorating rapidly',
      impactScore: 'High'
    },
    {
      assetId: 'GEN-003',
      name: 'Emergency Generator',
      currentBudget: 28000,
      recommendedBudget: 31000,
      riskScore: 0.45,
      predictedRUL: 36,
      failureProbability: 0.18,
      maintenanceType: 'Preventive',
      aiInsight: 'Optimal maintenance schedule',
      impactScore: 'Medium'
    }
  ];

  const budgetAllocation = [
    { category: 'HVAC Systems', current: 450000, recommended: 520000, variance: 70000, percentage: 21.2 },
    { category: 'Electrical', current: 320000, recommended: 285000, variance: -35000, percentage: 11.6 },
    { category: 'Plumbing', current: 180000, recommended: 195000, variance: 15000, percentage: 8.0 },
    { category: 'Elevators', current: 280000, recommended: 380000, variance: 100000, percentage: 15.5 },
    { category: 'Fire Safety', current: 150000, recommended: 140000, variance: -10000, percentage: 5.7 },
    { category: 'Security', current: 120000, recommended: 135000, variance: 15000, percentage: 5.5 },
    { category: 'Emergency Systems', current: 90000, recommended: 95000, variance: 5000, percentage: 3.9 },
    { category: 'IoT & Sensors', current: 75000, recommended: 105000, variance: 30000, percentage: 4.3 }
  ];

  const predictiveAnalytics = {
    failurePredictions: [
      { asset: 'HVAC-001', probability: 0.34, timeframe: '2-3 months', cost: 125000 },
      { asset: 'ELEV-002', probability: 0.67, timeframe: '1-2 months', cost: 85000 },
      { asset: 'PUMP-004', probability: 0.23, timeframe: '4-6 months', cost: 35000 }
    ],
    costOptimization: {
      currentSpend: 1876000,
      optimizedSpend: 1691000,
      savings: 185000,
      riskReduction: 0.42
    },
    maintenanceWindows: [
      { quarter: 'Q1', optimal: 380000, current: 420000, efficiency: 91 },
      { quarter: 'Q2', optimal: 520000, current: 465000, efficiency: 84 },
      { quarter: 'Q3', optimal: 410000, current: 475000, efficiency: 88 },
      { quarter: 'Q4', optimal: 380000, current: 516000, efficiency: 82 }
    ]
  };

  const whatIfScenarios = [
    { 
      name: 'Aggressive Preventive', 
      budgetChange: 15, 
      failureReduction: 45, 
      downtimeReduction: 38, 
      roi: 2.3
    },
    { 
      name: 'Cost Focused', 
      budgetChange: -8, 
      failureReduction: -12, 
      downtimeReduction: -15, 
      roi: 1.8
    },
    { 
      name: 'Balanced Approach', 
      budgetChange: 3, 
      failureReduction: 25, 
      downtimeReduction: 20, 
      roi: 2.1
    }
  ];

  const getRiskColor = (score: number) => {
    if (score >= 0.7) return 'text-red-600 bg-red-100';
    if (score >= 0.4) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'Critical': return 'text-red-600 bg-red-100';
      case 'High': return 'text-orange-600 bg-orange-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleOptimizationModeChange = (mode: string) => {
    setOptimizationMode(mode);
    // Trigger AI re-optimization based on new mode
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
              <h1 className="text-2xl font-bold text-gray-900">AI Budget Optimization</h1>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-600 font-medium">AI Active</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="2024">2024</option>
                <option value="2025">2025 (Projection)</option>
                <option value="2026">2026 (Projection)</option>
              </select>
              <button
                onClick={() => setShowWhatIfModal(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors whitespace-nowrap cursor-pointer"
              >
                <i className="ri-calculator-line mr-2"></i>
                What-If Analysis
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer">
                <i className="ri-download-line mr-2"></i>
                Export Report
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-8">
        {/* AI Optimization Status */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">AI Budget Optimization Engine</h2>
              <p className="text-blue-100">Advanced ML algorithms analyzing your maintenance data for optimal budget allocation</p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <p className="text-3xl font-bold">{budgetData.optimizationScore}%</p>
                  <p className="text-sm text-blue-100">Optimization Score</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">{budgetData.aiConfidence}%</p>
                  <p className="text-sm text-blue-100">AI Confidence</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">£{(budgetData.predictedSavings/1000).toFixed(0)}K</p>
                  <p className="text-sm text-blue-100">Predicted Savings</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Optimization Mode Selection */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Optimization Mode</h3>
            <button
              onClick={() => setShowXAIModal(true)}
              className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <i className="ri-question-line mr-1"></i>
              Explain AI
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['cost-focused', 'balanced', 'performance-focused'].map((mode) => (
              <button
                key={mode}
                onClick={() => handleOptimizationModeChange(mode)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${ 
                  optimizationMode === mode
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <i className={`${ 
                    mode === 'cost-focused' ? 'ri-money-dollar-circle-line' :
                    mode === 'balanced' ? 'ri-scales-line' :
                    'ri-rocket-line'
                  } text-2xl mb-2`}></i>
                  <h4 className="font-medium capitalize">{mode.replace('-', ' ')}</h4>
                  <p className="text-sm mt-1">
                    {mode === 'cost-focused' ? 'Minimize expenses' :
                     mode === 'balanced' ? 'Balance cost & performance' :
                     'Maximize asset performance'}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[ 
                { id: 'dashboard', label: 'Dashboard', icon: 'ri-dashboard-line' },
                { id: 'recommendations', label: 'AI Recommendations', icon: 'ri-robot-line' },
                { id: 'allocation', label: 'Budget Allocation', icon: 'ri-pie-chart-line' },
                { id: 'risk-analysis', label: 'Risk Analysis', icon: 'ri-shield-line' },
                { id: 'predictive', label: 'Predictive Analytics', icon: 'ri-line-chart-line' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 whitespace-nowrap cursor-pointer ${ 
                    selectedTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <i className={tab.icon}></i>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {selectedTab === 'dashboard' && (
              <div className="space-y-8">
                {/* Budget Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                        <i className="ri-wallet-line text-white"></i>
                      </div>
                      <span className="text-sm text-blue-600">Total Budget</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">£{(budgetData.totalBudget/1000).toFixed(0)}K</p>
                  </div>
                  <div className="bg-green-50 p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                        <i className="ri-check-line text-white"></i>
                      </div>
                      <span className="text-sm text-green-600">Allocated</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">£{(budgetData.allocatedBudget/1000).toFixed(0)}K</p>
                  </div>
                  <div className="bg-yellow-50 p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                        <i className="ri-time-line text-white"></i>
                      </div>
                      <span className="text-sm text-yellow-600">Available</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">£{(budgetData.availableBudget/1000).toFixed(0)}K</p>
                  </div>
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                        <i className="ri-arrow-down-line text-white"></i>
                      </div>
                      <span className="text-sm text-purple-600">AI Savings</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">£{(budgetData.predictedSavings/1000).toFixed(0)}K</p>
                  </div>
                </div>

                {/* Optimization Goals */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Optimization Goals & Weights</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {optimizationGoals.map((goal) => (
                      <div key={goal.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${goal.active ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          <span className="text-sm font-medium text-gray-900">{goal.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">{goal.weight}%</span>
                          <div className="w-16 h-2 bg-gray-200 rounded-full">
                            <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${goal.weight}%` }}></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Real-time Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Risk Assessment</h4>
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto mb-4 relative">
                        <div className="w-full h-full bg-gray-200 rounded-full"></div>
                        <div 
                          className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-400 to-red-500 rounded-full"
                          style={{ 
                            background: `conic-gradient(from 0deg, #10b981 0deg, #10b981 ${(1-budgetData.riskScore)*360}deg, #ef4444 ${(1-budgetData.riskScore)*360}deg, #ef4444 360deg)` 
                          }}
                        ></div>
                        <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                          <span className="text-lg font-bold text-gray-900">{(budgetData.riskScore * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">Overall Risk Score</p>
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">AI Confidence</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Prediction Accuracy</span>
                        <span className="text-sm font-medium text-gray-900">94.2%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '94.2%' }}></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Model Reliability</span>
                        <span className="text-sm font-medium text-gray-900">91.8%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '91.8%' }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Performance Metrics</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Cost Efficiency</span>
                        <span className="text-sm font-medium text-green-600">+12.3%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Downtime Reduction</span>
                        <span className="text-sm font-medium text-green-600">-28.5%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Asset Lifespan</span>
                        <span className="text-sm font-medium text-green-600">+15.7%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'recommendations' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">AI-Powered Recommendations</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Updated:</span>
                    <span className="text-sm font-medium text-gray-900">2 minutes ago</span>
                  </div>
                </div>

                {aiRecommendations.map((rec) => (
                  <div key={rec.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${ 
                          rec.type === 'critical' ? 'bg-red-100' :
                          rec.type === 'optimization' ? 'bg-blue-100' :
                          'bg-green-100'
                        }`}>
                          <i className={`${ 
                            rec.type === 'critical' ? 'ri-alarm-warning-line text-red-600' :
                            rec.type === 'optimization' ? 'ri-settings-line text-blue-600' :
                            'ri-lightbulb-line text-green-600'
                          }`}></i>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{rec.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getImpactColor(rec.impact)}`}>
                          {rec.impact} Impact
                        </span>
                        <span className="text-xs text-gray-500">
                          {rec.confidence}% confidence
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-gray-600">Potential Savings</p>
                        <p className="text-lg font-bold text-green-600">£{(rec.savings/1000).toFixed(0)}K</p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-600">Priority</p>
                        <p className="text-lg font-bold text-blue-600">{rec.priority}</p>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <p className="text-sm text-gray-600">AI Model</p>
                        <p className="text-lg font-bold text-purple-600">
                          {rec.type === 'critical' ? 'LSTM' :
                           rec.type === 'optimization' ? 'Genetic Algo' :
                           'Survival Analysis'}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-2">AI Reasoning</h5>
                      <p className="text-sm text-gray-700 mb-2">{rec.reasoning}</p>
                      <p className="text-sm text-gray-600">{rec.explanation}</p>
                    </div>

                    <div className="flex space-x-3 mt-4">
                      <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer">
                        <i className="ri-check-line mr-2"></i>
                        Accept Recommendation
                      </button>
                      <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors cursor-pointer">
                        <i className="ri-time-line mr-2"></i>
                        Schedule Later
                      </button>
                      <button
                        onClick={() => setShowXAIModal(true)}
                        className="bg-purple-100 text-purple-700 py-2 px-4 rounded-lg font-medium hover:bg-purple-200 transition-colors cursor-pointer"
                      >
                        <i className="ri-question-line mr-2"></i>
                        Explain
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedTab === 'allocation' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">AI-Optimized Budget Allocation</h3>
                  <div className="flex items-center space-x-2">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer">
                      <i className="ri-refresh-line mr-2"></i>
                      Re-optimize
                    </button>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Budget</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AI Recommended</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variance</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {budgetAllocation.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{item.category}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            £{(item.current/1000).toFixed(0)}K
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            £{(item.recommended/1000).toFixed(0)}K
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-sm font-medium ${ 
                              item.variance > 0 ? 'text-red-600' : 
                              item.variance < 0 ? 'text-green-600' : 'text-gray-600'
                            }`}>
                              {item.variance > 0 ? '+' : ''}£{(item.variance/1000).toFixed(0)}K
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.percentage.toFixed(1)}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button className="text-blue-600 hover:text-blue-900 cursor-pointer">
                              <i className="ri-edit-line mr-1"></i>
                              Adjust
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {selectedTab === 'risk-analysis' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Asset Risk Analysis</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Last Updated:</span>
                    <span className="text-sm font-medium text-gray-900">15 minutes ago</span>
                  </div>
                </div>

                {assetRiskAnalysis.map((asset, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900">{asset.name}</h4>
                        <p className="text-sm text-gray-600">Asset ID: {asset.assetId}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(asset.riskScore)}`}>
                          Risk: {(asset.riskScore * 100).toFixed(0)}%
                        </span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getImpactColor(asset.impactScore)}`}>
                          {asset.impactScore}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-600">Current Budget</p>
                        <p className="text-lg font-bold text-blue-600">£{(asset.currentBudget/1000).toFixed(0)}K</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-gray-600">Recommended</p>
                        <p className="text-lg font-bold text-green-600">£{(asset.recommendedBudget/1000).toFixed(0)}K</p>
                      </div>
                      <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <p className="text-sm text-gray-600">Predicted RUL</p>
                        <p className="text-lg font-bold text-yellow-600">{asset.predictedRUL}mo</p>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <p className="text-sm text-gray-600">Failure Risk</p>
                        <p className="text-lg font-bold text-red-600">{(asset.failureProbability * 100).toFixed(0)}%</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h5 className="font-medium text-gray-900 mb-2">AI Insight</h5>
                      <p className="text-sm text-gray-700">{asset.aiInsight}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">Maintenance Type:</span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${ 
                          asset.maintenanceType === 'Preventive' ? 'bg-green-100 text-green-700' :
                          asset.maintenanceType === 'Corrective' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {asset.maintenanceType}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition-colors cursor-pointer">
                          View Details
                        </button>
                        <button className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700 transition-colors cursor-pointer">
                          Schedule Maintenance
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedTab === 'predictive' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Predictive Analytics Dashboard</h3>
                  <div className="flex items-center space-x-2">
                    <button className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors whitespace-nowrap cursor-pointer">
                      <i className="ri-brain-line mr-2"></i>
                      Retrain Models
                    </button>
                  </div>
                </div>

                {/* Failure Predictions */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Failure Predictions (LSTM Model)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {predictiveAnalytics.failurePredictions.map((pred, index) => (
                      <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-gray-900">{pred.asset}</h5>
                          <span className="text-sm font-bold text-red-600">{(pred.probability * 100).toFixed(0)}%</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Timeframe: {pred.timeframe}</p>
                        <p className="text-sm text-red-600 font-medium">Estimated Cost: £{(pred.cost/1000).toFixed(0)}K</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cost Optimization */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Cost Optimization Analysis</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-3">Current vs Optimized Spending</h5>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Current Annual Spend</span>
                          <span className="text-sm font-medium text-gray-900">
                            £{(predictiveAnalytics.costOptimization.currentSpend/1000).toFixed(0)}K
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Optimized Spend</span>
                          <span className="text-sm font-medium text-green-600">
                            £{(predictiveAnalytics.costOptimization.optimizedSpend/1000).toFixed(0)}K
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Projected Savings</span>
                          <span className="text-sm font-bold text-green-600">
                            £{(predictiveAnalytics.costOptimization.savings/1000).toFixed(0)}K
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Risk Reduction</span>
                          <span className="text-sm font-bold text-blue-600">
                            -{(predictiveAnalytics.costOptimization.riskReduction * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-900 mb-3">Quarterly Optimization</h5>
                      <div className="space-y-3">
                        {predictiveAnalytics.maintenanceWindows.map((window, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <span className="text-sm font-medium text-gray-900">{window.quarter}</span>
                              <p className="text-xs text-gray-600">
                                Optimal: £{(window.optimal/1000).toFixed(0)}K | 
                                Current: £{(window.current/1000).toFixed(0)}K
                              </p>
                            </div>
                            <div className="text-right">
                              <span className={`text-sm font-medium ${ 
                                window.efficiency >= 90 ? 'text-green-600' :
                                window.efficiency >= 80 ? 'text-yellow-600' :
                                'text-red-600'
                              }`}>
                                {window.efficiency}%
                              </span>
                              <p className="text-xs text-gray-500">Efficiency</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* What-If Analysis Modal */}
      {showWhatIfModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">What-If Scenario Analysis</h3>
                <button
                  onClick={() => setShowWhatIfModal(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {whatIfScenarios.map((scenario, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">{scenario.name}</h4>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Budget Change</span>
                        <span className={`text-sm font-medium ${ 
                          scenario.budgetChange > 0 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {scenario.budgetChange > 0 ? '+' : ''}{scenario.budgetChange}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Failure Reduction</span>
                        <span className={`text-sm font-medium ${ 
                          scenario.failureReduction > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {scenario.failureReduction > 0 ? '+' : ''}{scenario.failureReduction}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Downtime Reduction</span>
                        <span className={`text-sm font-medium ${ 
                          scenario.downtimeReduction > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {scenario.downtimeReduction > 0 ? '+' : ''}{scenario.downtimeReduction}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">ROI</span>
                        <span className="text-sm font-bold text-blue-600">{scenario.roi}x</span>
                      </div>
                    </div>

                    <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer">
                      Apply Scenario
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Custom Scenario Builder</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Budget Adjustment (%)</label>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      defaultValue="0"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Risk Tolerance</label>
                    <select className="w-full pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
                      <option>Conservative</option>
                      <option>Moderate</option>
                      <option>Aggressive</option>
                    </select>
                  </div>
                </div>
                <button className="mt-4 bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors cursor-pointer">
                  <i className="ri-calculator-line mr-2"></i>
                  Calculate Custom Scenario
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Explainable AI Modal */}
      {showXAIModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">AI Explanation (XAI)</h3>
                <button
                  onClick={() => setShowXAIModal(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Model Architecture</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Predictive Models</h5>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• LSTM Neural Networks for failure prediction</li>
                        <li>• Random Forest for maintenance classification</li>
                        <li>• Survival Analysis for RUL estimation</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Optimization Models</h5>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Linear Programming for resource allocation</li>
                        <li>• Genetic Algorithms for scheduling</li>
                        <li>• Reinforcement Learning for adaptive planning</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Feature Importance (SHAP Values)</h4>
                  <div className="space-y-3">
                    {[
                      { feature: 'Asset Age', importance: 0.35, impact: 'High' },
                      { feature: 'Maintenance History', importance: 0.28, impact: 'High' },
                      { feature: 'IoT Sensor Data', importance: 0.22, impact: 'Medium' },
                      { feature: 'Environmental Conditions', importance: 0.15, impact: 'Low' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{item.feature}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 h-2 bg-gray-200 rounded-full">
                            <div 
                              className="h-2 bg-blue-500 rounded-full" 
                              style={{ width: `${item.importance * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{(item.importance * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Decision Logic (LIME)</h4>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-700">
                      <strong>Why increase HVAC budget?</strong>
                    </p>
                    <ul className="text-sm text-gray-700 space-y-1 ml-4">
                      <li>• Temperature sensors show 15% variance increase</li>
                      <li>• Vibration patterns indicate bearing wear</li>
                      <li>• Historical data shows similar failures at 8-year mark</li>
                      <li>• Preventive maintenance ROI: 3.2x vs reactive repair</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Model Performance</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Accuracy Metrics</h5>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Precision</span>
                          <span className="text-sm font-medium text-gray-900">94.2%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Recall</span>
                          <span className="text-sm font-medium text-gray-900">91.8%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">F1 Score</span>
                          <span className="text-sm font-medium text-gray-900">93.0%</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Validation</h5>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Cross-validation</span>
                          <span className="text-sm font-medium text-gray-900">5-fold</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Training Data</span>
                          <span className="text-sm font-medium text-gray-900">3 years</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Last Updated</span>
                          <span className="text-sm font-medium text-gray-900">2 days ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}