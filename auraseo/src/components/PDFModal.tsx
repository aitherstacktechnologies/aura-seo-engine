import { useState } from 'react';
import { X, Download, FileText, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import type { AuditResult } from '../types';
import { generatePDF } from '../lib/pdf';

interface PDFModalProps {
  audit: AuditResult | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PDFModal({ audit, isOpen, onClose }: PDFModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen || !audit) return null;

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      await generatePDF(audit);
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const overallScore = Math.round(
    (audit.scores.performance + audit.scores.accessibility + audit.scores.bestPractices + audit.scores.seo) / 4
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="glass rounded-2xl p-8 max-w-md w-full relative z-10 animate-scale card-3d">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5 text-text-secondary" />
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent to-highlight flex items-center justify-center">
            <FileText className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-primary">Report Ready</h2>
            <p className="text-text-muted text-sm truncate max-w-[200px]">{audit.url}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="glass-card rounded-xl p-4 text-center">
            <p className="text-3xl font-bold font-mono text-accent">{overallScore}</p>
            <p className="text-text-muted text-xs mt-1">Overall Score</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <p className="text-3xl font-bold font-mono text-highlight capitalize">{audit.device}</p>
            <p className="text-text-muted text-xs mt-1">Device</p>
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <div className="flex items-center justify-between p-3 rounded-xl bg-success/5 border border-success/20">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              <span className="text-text-secondary text-sm">Passed</span>
            </div>
            <span className="text-text-primary font-mono font-semibold">{audit.audits.passed.length}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-warning/5 border border-warning/20">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-warning" />
              <span className="text-text-secondary text-sm">Warnings</span>
            </div>
            <span className="text-text-primary font-mono font-semibold">{audit.audits.warnings.length}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-error/5 border border-error/20">
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-error" />
              <span className="text-text-secondary text-sm">Critical</span>
            </div>
            <span className="text-text-primary font-mono font-semibold">{audit.audits.critical.length}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="btn-secondary flex-1 py-3 rounded-xl text-sm"
          >
            Close
          </button>
          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="btn-primary flex-1 py-3 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <span className="animate-spin">-</span>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}