import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Alert } from '../types/api';

interface AlertsCardProps {
  alerts: Alert[];
}

export const AlertsCard: React.FC<AlertsCardProps> = ({ alerts }) => {
  const [expandedAlert, setExpandedAlert] = useState<Alert | null>(null);

  if (!alerts || alerts.length === 0) {
    return null;
  }

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'moderate':
        return 'bg-yellow-500/20 border-yellow-500/50';
      case 'severe':
        return 'bg-red-500/20 border-red-500/50';
      default:
        return 'bg-gray-500/20 border-gray-500/50';
    }
  };

  return (
    <div className="space-y-4">
      {alerts.map((alert, index) => (
        <div key={index} className={`border rounded-2xl p-4 ${getSeverityColor(alert.severity)} backdrop-blur-md`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6 text-yellow-300" />
              <div>
                <h4 className="font-bold text-white">{alert.event}</h4>
                <p className="text-sm text-gray-300">{alert.headline}</p>
              </div>
            </div>
            <button 
              onClick={() => setExpandedAlert(alert)}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold py-1 px-3 rounded-lg text-sm"
            >
              Details
            </button>
          </div>
        </div>
      ))}

      {expandedAlert && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/20 rounded-2xl p-6 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">{expandedAlert.event}</h3>
              <button onClick={() => setExpandedAlert(null)} className="text-gray-300 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4 text-gray-300">
              <p><span className="font-semibold text-white">Severity:</span> {expandedAlert.severity}</p>
              <p><span className="font-semibold text-white">Effective:</span> {new Date(expandedAlert.effective).toLocaleString()}</p>
              <p><span className="font-semibold text-white">Expires:</span> {new Date(expandedAlert.expires).toLocaleString()}</p>
              <p className="text-sm whitespace-pre-wrap">{expandedAlert.desc}</p>
              <p className="text-sm font-semibold whitespace-pre-wrap">{expandedAlert.instruction}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
