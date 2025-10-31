import React, { useContext } from 'react'
import NavSider from './NavSider.jsx'
import { UserContext } from '../Context/userContext.jsx'

import { Calendar, Activity as ActivityIcon, FileText, Pill, TrendingUp, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const Activity = () => {
  const activities = [
    {
      id: 1,
      type: 'appointment',
      title: 'Oncology Consultation',
      description: 'Follow-up appointment completed',
      timestamp: '2 hours ago',
      icon: Calendar,
      status: 'completed',
      color: 'bg-emerald-100 text-emerald-600'
    },
    {
      id: 2,
      type: 'test',
      title: 'Blood Test Results',
      description: 'New results available for review',
      timestamp: '5 hours ago',
      icon: FileText,
      status: 'pending',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 3,
      type: 'medication',
      title: 'Medication Taken',
      description: 'Chemotherapy cycle day 3',
      timestamp: '8 hours ago',
      icon: Pill,
      status: 'completed',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: 4,
      type: 'symptom',
      title: 'Symptom Log Updated',
      description: 'Energy level: Moderate',
      timestamp: '12 hours ago',
      icon: TrendingUp,
      status: 'completed',
      color: 'bg-amber-100 text-amber-600'
    },
    {
      id: 5,
      type: 'scan',
      title: 'CT Scan Scheduled',
      description: 'Appointment set for next week',
      timestamp: '1 day ago',
      icon: ActivityIcon,
      status: 'scheduled',
      color: 'bg-teal-100 text-teal-600'
    },
    {
      id: 6,
      type: 'reminder',
      title: 'Hydration Goal Met',
      description: 'Daily water intake completed',
      timestamp: '1 day ago',
      icon: CheckCircle2,
      status: 'completed',
      color: 'bg-cyan-100 text-cyan-600'
    },
    {
      id: 7,
      type: 'appointment',
      title: 'Lab Work Completed',
      description: 'Routine blood work finished',
      timestamp: '2 days ago',
      icon: FileText,
      status: 'completed',
      color: 'bg-indigo-100 text-indigo-600'
    },
    {
      id: 8,
      type: 'alert',
      title: 'Medication Reminder',
      description: 'Upcoming dose in 2 hours',
      timestamp: '3 days ago',
      icon: AlertCircle,
      status: 'upcoming',
      color: 'bg-rose-100 text-rose-600'
    }
  ];

  const getStatusBadge = (status) => {
    const badges = {
      completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      pending: 'bg-blue-50 text-blue-700 border-blue-200',
      scheduled: 'bg-amber-50 text-amber-700 border-amber-200',
      upcoming: 'bg-rose-50 text-rose-700 border-rose-200'
    };
    return badges[status] || badges.pending;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Activity Timeline</h1>
          <p className="text-slate-600">Track your health journey and recent updates</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Completed Today</p>
                <p className="text-3xl font-bold text-emerald-600">4</p>
              </div>
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Upcoming</p>
                <p className="text-3xl font-bold text-blue-600">2</p>
              </div>
              <Clock className="w-10 h-10 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">This Week</p>
                <p className="text-3xl font-bold text-purple-600">12</p>
              </div>
              <TrendingUp className="w-10 h-10 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800">Recent Activity</h2>
          </div>
          
          <div className="divide-y divide-slate-100">
            {activities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="p-6 hover:bg-slate-50 transition-colors duration-200">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${activity.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-grow min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-slate-800 text-lg">{activity.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(activity.status)} whitespace-nowrap`}>
                          {activity.status}
                        </span>
                      </div>
                      <p className="text-slate-600 mb-2">{activity.description}</p>
                      <p className="text-sm text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {activity.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Load More */}
        <div className="mt-6 text-center">
          <button className="px-6 py-3 bg-white text-slate-700 font-medium rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors duration-200">
            Load More Activity
          </button>
        </div>
      </div>
    </div>
  );
};



export default Activity;
