import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Upload, 
  File, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  Lock, 
  Unlock, 
  Check, 
  RefreshCw, 
  Eye, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Download, 
  Trash2, 
  MoreVertical, 
  FileText, 
  HelpCircle, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Paintbrush
} from 'lucide-react';
import { AgentService, AgentVerification, VerificationStatus } from '../../services/agentService';

interface ReraVerificationProps {
  verification: AgentVerification;
  setVerification: React.Dispatch<React.SetStateAction<AgentVerification>>;
  user: any;
  triggerToast: (msg: string) => void;
  triggerDemoBypass: () => void;
  resetVerificationStatus: () => void;
  setActiveSidebarItem: (item: string) => void;
}

export default function ReraVerification({
  verification,
  setVerification,
  user,
  triggerToast,
  triggerDemoBypass,
  resetVerificationStatus,
  setActiveSidebarItem,
}: ReraVerificationProps) {
  // Stepper flow for submission: 1 = Intro, 2 = Form Details, 3 = Uploads, 4 = Review & Submit
  // (If verification status is PENDING or VERIFIED, we display the status screen directly)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form Fields State
  const [licenseNumber, setLicenseNumber] = useState(verification.licenseNumber || '');
  const [licenseType, setLicenseType] = useState('Broker');
  const [issuingAuthority, setIssuingAuthority] = useState('Dubai Land Department (DLD)');
  const [issueDate, setIssueDate] = useState('2023-03-29');
  const [expiryDate, setExpiryDate] = useState(verification.expiryDate || '2027-03-28');
  const [designatedBroker, setDesignatedBroker] = useState('John Smith');
  const [fullName, setFullName] = useState(verification.fullName || user?.name || 'Ahmed Mohammed');
  const [companyName, setCompanyName] = useState(verification.companyName || user?.company || 'ABC Realty');
  const [designation, setDesignation] = useState(verification.designation || 'Senior Property Consultant');
  const [officeLocation, setOfficeLocation] = useState('Dubai Marina, UAE');
  const [email, setEmail] = useState(user?.email || 'ahmed.mohammed@abcrealty.com');
  const [phone, setPhone] = useState(user?.phoneNumber || '+971 50 123 4567');
  const [confirmAccuracy, setConfirmAccuracy] = useState(false);
  const [confirmReview, setConfirmReview] = useState(false);

  // Simulated Document Upload States
  const [files, setFiles] = useState<{
    certificate: { name: string; size: string; progress: number; status: 'idle' | 'uploading' | 'done' } | null;
    idFront: { name: string; size: string; progress: number; status: 'idle' | 'uploading' | 'done' } | null;
    idBack: { name: string; size: string; progress: number; status: 'idle' | 'uploading' | 'done' } | null;
    tradeLicense: { name: string; size: string; progress: number; status: 'idle' | 'uploading' | 'done' } | null;
  }>({
    certificate: verification.certificateName ? { name: verification.certificateName, size: '1.2 MB', progress: 100, status: 'done' } : null,
    idFront: verification.emiratesIdName ? { name: verification.emiratesIdName.replace('.pdf', '_front.jpg'), size: '950 KB', progress: 100, status: 'done' } : null,
    idBack: verification.emiratesIdName ? { name: verification.emiratesIdName.replace('.pdf', '_back.jpg'), size: '1.1 MB', progress: 100, status: 'done' } : null,
    tradeLicense: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [selectedHistoryRow, setSelectedHistoryRow] = useState<any>(null);

  // Demo Mode state
  const [demoMode, setDemoMode] = useState<boolean>(AgentService.getDemoMode());

  // Listen to demo mode change events
  useEffect(() => {
    const handleDemoModeChange = () => {
      setDemoMode(AgentService.getDemoMode());
    };
    window.addEventListener('acot_demo_mode_changed', handleDemoModeChange);
    return () => {
      window.removeEventListener('acot_demo_mode_changed', handleDemoModeChange);
    };
  }, []);

  // Feature Modal Detail State
  const [activeFeatureModal, setActiveFeatureModal] = useState<'property' | 'ai' | 'reports' | 'branding' | null>(null);

  // Auto-validation simulation state
  const [isAutoValidating, setIsAutoValidating] = useState<boolean>(false);
  const [autoValidationSteps, setAutoValidationSteps] = useState<{ label: string; status: 'idle' | 'running' | 'done' }[]>([
    { label: 'Querying Dubai Land Department ledger...', status: 'idle' },
    { label: 'Matching RERA Certificate (RERA-123456)...', status: 'idle' },
    { label: 'Biometric matching on Emirates ID scans...', status: 'idle' },
    { label: 'Verifying active brokerage registration (ABC Realty)...', status: 'idle' },
    { label: 'Signing secure DLD ledger certificate...', status: 'idle' }
  ]);

  const runAutoValidation = async () => {
    setIsAutoValidating(true);
    // Reset steps
    setAutoValidationSteps(steps => steps.map(s => ({ ...s, status: 'idle' })));

    for (let i = 0; i < autoValidationSteps.length; i++) {
      // Set current step to running
      setAutoValidationSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'running' } : s));
      // Simulate API latency
      await new Promise(resolve => setTimeout(resolve, 800));
      // Set current step to done
      setAutoValidationSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'done' } : s));
    }

    // Set status to VERIFIED
    const updated: AgentVerification = {
      status: 'VERIFIED',
      fullName: fullName || 'Michael Chang',
      companyName: companyName || 'ABC Realty',
      designation: designation || 'Senior Property Consultant',
      brokerageName: companyName || 'ABC Realty',
      licenseNumber: licenseNumber || 'RERA-123456',
      expiryDate: expiryDate || '2027-03-28',
      certificateName: 'rera_license.pdf',
      emiratesIdName: 'emirates_id_copies.pdf',
      submittedAt: new Date().toISOString().split('T')[0],
      verifiedAt: new Date().toISOString().split('T')[0],
      professionalAccess: true,
      verifiedAgent: true
    };
    
    // Save to AgentService and localStorage
    AgentService.updateVerificationStatusDirectly('VERIFIED', updated);
    setVerification(updated);
    setIsAutoValidating(false);
    triggerToast('RERA Verification approved via Simulation!');
  };

  const setVerificationStatusDirect = (status: VerificationStatus, extra?: Partial<AgentVerification>) => {
    let extraData = extra || {};
    if (status === 'REJECTED') {
      extraData = {
        rejectionReason: 'The uploaded Emirates ID was illegible or did not match the licensee name on the RERA Certificate.',
        ...extraData
      };
    } else if (status === 'NOT_SUBMITTED') {
      extraData = {
        fullName: '',
        companyName: '',
        designation: '',
        brokerageName: '',
        licenseNumber: '',
        expiryDate: '',
        certificateName: undefined,
        emiratesIdName: undefined,
        submittedAt: undefined,
        verifiedAt: undefined,
        rejectionReason: undefined,
        professionalAccess: undefined,
        verifiedAgent: undefined,
        ...extraData
      };
    }
    const updated = AgentService.updateVerificationStatusDirectly(status, extraData);
    setVerification(updated);
    triggerToast(`Status set to ${status}`);
  };

  // Sync state if verification status changes
  useEffect(() => {
    if (verification.status === 'NOT_SUBMITTED') {
      setCurrentStep(1);
      setFiles({
        certificate: null,
        idFront: null,
        idBack: null,
        tradeLicense: null,
      });
      setLicenseNumber('');
      setConfirmAccuracy(false);
      setConfirmReview(false);
      setFullName(user?.name || '');
      setCompanyName(user?.company || '');
      setDesignation('');
    }
  }, [verification.status, user]);

  // Handle Simulated Uploads with micro-interactions
  const simulateFileUpload = (key: 'certificate' | 'idFront' | 'idBack' | 'tradeLicense', defaultName: string, sizeStr: string) => {
    setFiles(prev => ({
      ...prev,
      [key]: {
        name: defaultName,
        size: sizeStr,
        progress: 0,
        status: 'uploading'
      }
    }));

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 25) + 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setFiles(prev => ({
          ...prev,
          [key]: {
            ...(prev[key]!),
            progress: 100,
            status: 'done'
          }
        }));
        triggerToast(`${defaultName} uploaded successfully!`);
      } else {
        setFiles(prev => {
          if (!prev[key]) return prev;
          return {
            ...prev,
            [key]: {
              ...(prev[key]!),
              progress
            }
          };
        });
      }
    }, 200);
  };

  const removeFile = (key: 'certificate' | 'idFront' | 'idBack' | 'tradeLicense') => {
    setFiles(prev => ({
      ...prev,
      [key]: null
    }));
    triggerToast('Document removed.');
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseNumber.trim()) {
      triggerToast('Please enter your RERA License Number');
      return;
    }
    if (!confirmAccuracy) {
      triggerToast('Please confirm that your details are accurate.');
      return;
    }
    setCurrentStep(3); // Go to Upload Documents
  };

  const handleUploadsNext = () => {
    if (!files.certificate || files.certificate.status !== 'done') {
      triggerToast('Please upload your RERA License Certificate');
      return;
    }
    if (!files.idFront || files.idFront.status !== 'done') {
      triggerToast('Please upload the front copy of your Emirates ID');
      return;
    }
    if (!files.idBack || files.idBack.status !== 'done') {
      triggerToast('Please upload the back copy of your Emirates ID');
      return;
    }
    setCurrentStep(4); // Go to Review & Submit
  };

  const handleFinalSubmit = async () => {
    if (!confirmReview) {
      triggerToast('Please check the confirmation box to submit your application.');
      return;
    }

    setIsSubmitting(true);
    // Micro-interaction delay for realism
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newVerification: AgentVerification = {
      status: 'PENDING',
      fullName,
      companyName,
      designation,
      brokerageName: companyName,
      licenseNumber,
      expiryDate,
      certificateName: files.certificate?.name || 'rera_license.pdf',
      emiratesIdName: 'emirates_id_copies.pdf',
      submittedAt: new Date().toISOString().split('T')[0],
    };

    AgentService.submitVerification(newVerification);
    setVerification(newVerification);
    setIsSubmitting(false);
    triggerToast('RERA Verification request submitted successfully!');
  };

  // Re-submission helper for rejected/expired
  const handleStartRenewal = () => {
    setConfirmAccuracy(false);
    setConfirmReview(false);
    setFiles({
      certificate: null,
      idFront: null,
      idBack: null,
      tradeLicense: null,
    });
    setCurrentStep(2); // Jump straight to Form Details
  };

  // History Log Data
  const mockHistoryLog = [
    {
      submissionDate: '10 Jan 2025',
      licenseNumber: '123456',
      validFrom: '29 Mar 2023',
      validUntil: '28 Mar 2027',
      status: 'Verified',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-100'
    },
    {
      submissionDate: '15 Mar 2023',
      licenseNumber: '123456',
      validFrom: '29 Mar 2021',
      validUntil: '28 Mar 2023',
      status: 'Expired',
      statusColor: 'bg-slate-100 text-slate-600 border-slate-200'
    }
  ];

  // ----------------- PRESENTER DECK -----------------
  const renderPresenterDeck = () => {
    if (!demoMode) return null;

    return (
      <div className="mb-6 p-4 bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 shadow-xl space-y-3.5 relative overflow-hidden" id="presenter-control-deck">
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black font-mono text-indigo-400 uppercase tracking-wider bg-indigo-950 px-2 py-0.5 rounded border border-indigo-900">PRESENTER CONSOLE</span>
                <span className="text-[10px] font-black font-mono text-slate-400">v1.2</span>
              </div>
              <h4 className="text-xs font-black text-slate-200 mt-1">ACOT Agent Platform Simulation Control Deck</h4>
            </div>
          </div>
          
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-full text-[10px] font-extrabold uppercase tracking-wide">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>DEMO MODE - Simulation Enabled</span>
          </div>
        </div>

        {/* PRIMARY SIMULATOR CONTROLS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* COLUMN 1: PREFILL & CLEAR */}
          <div className="bg-slate-950/40 p-3 rounded-2xl border border-slate-800/50 space-y-2">
            <span className="text-[9px] font-black font-mono text-slate-400 uppercase tracking-widest block">Data Population</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setLicenseNumber('RERA-123456');
                  setLicenseType('Broker');
                  setIssuingAuthority('Dubai Land Department (DLD)');
                  setIssueDate('2023-03-29');
                  setExpiryDate('2027-03-28');
                  setDesignatedBroker('John Smith');
                  setFullName('Michael Chang');
                  setCompanyName('ABC Realty');
                  setDesignation('Senior Property Consultant');
                  setOfficeLocation('Office 1203, Marina Plaza, Dubai Marina');
                  setEmail('michael.chang@abcrealty.ae');
                  setPhone('+971 50 123 4567');
                  setConfirmAccuracy(true);
                  setConfirmReview(true);
                  setFiles({
                    certificate: { name: 'rera_license_michael_chang.pdf', size: '1.2 MB', progress: 100, status: 'done' },
                    idFront: { name: 'emirates_id_front.jpg', size: '950 KB', progress: 100, status: 'done' },
                    idBack: { name: 'emirates_id_back.jpg', size: '1.1 MB', progress: 100, status: 'done' },
                    tradeLicense: { name: 'trade_license_abc_realty.pdf', size: '2.4 MB', progress: 100, status: 'done' },
                  });
                  setCurrentStep(4); // Review screen directly
                  triggerToast('Michael Chang realistic profile pre-filled. Ready to submit!');
                }}
                className="w-full py-2 px-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Prefill Michael</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setLicenseNumber('');
                  setLicenseType('Broker');
                  setIssuingAuthority('Dubai Land Department (DLD)');
                  setIssueDate('2023-03-29');
                  setExpiryDate('2027-03-28');
                  setDesignatedBroker('John Smith');
                  setFullName('');
                  setCompanyName('');
                  setDesignation('');
                  setOfficeLocation('Dubai Marina, UAE');
                  setEmail('');
                  setPhone('');
                  setConfirmAccuracy(false);
                  setConfirmReview(false);
                  setFiles({
                    certificate: null,
                    idFront: null,
                    idBack: null,
                    tradeLicense: null,
                  });
                  setCurrentStep(1);
                  triggerToast('Form cleared successfully.');
                }}
                className="w-full py-2 px-2 border border-slate-700 hover:bg-slate-800 text-slate-300 font-bold text-[10px] rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Form</span>
              </button>
            </div>
          </div>

          {/* COLUMN 2: AUTO VALIDATE FLOW */}
          <div className="bg-slate-950/40 p-3 rounded-2xl border border-slate-800/50 space-y-2">
            <span className="text-[9px] font-black font-mono text-slate-400 uppercase tracking-widest block">Ledger Sync Simulation</span>
            <button
              type="button"
              disabled={isAutoValidating}
              onClick={runAutoValidation}
              className="w-full h-9 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-extrabold text-[10px] rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-emerald-900/20"
            >
              {isAutoValidating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Validating...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Auto Validate (Full Flow)</span>
                </>
              )}
            </button>
          </div>

          {/* COLUMN 3: DIRECT STATUS SETTERS */}
          <div className="bg-slate-950/40 p-3 rounded-2xl border border-slate-800/50 space-y-2">
            <span className="text-[9px] font-black font-mono text-slate-400 uppercase tracking-widest block">Direct State Jumps</span>
            <div className="grid grid-cols-2 gap-1.5 text-[9px] font-bold">
              <button
                type="button"
                onClick={() => setVerificationStatusDirect('NOT_SUBMITTED')}
                className="py-1 px-1 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-lg cursor-pointer text-center"
              >
                Not Started
              </button>
              <button
                type="button"
                onClick={() => setVerificationStatusDirect('PENDING')}
                className="py-1 px-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg cursor-pointer text-center"
              >
                Under Review
              </button>
              <button
                type="button"
                onClick={() => setVerificationStatusDirect('VERIFIED', {
                  fullName: fullName || 'Michael Chang',
                  companyName: companyName || 'ABC Realty',
                  designation: designation || 'Senior Property Consultant',
                  brokerageName: companyName || 'ABC Realty',
                  licenseNumber: licenseNumber || '123456',
                  expiryDate: expiryDate || '2027-03-28',
                  certificateName: 'rera_license.pdf',
                  emiratesIdName: 'emirates_id_copies.pdf',
                  submittedAt: '2025-01-10',
                  verifiedAt: '2025-01-12'
                })}
                className="py-1 px-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg cursor-pointer text-center"
              >
                Move to Verified
              </button>
              <button
                type="button"
                onClick={() => setVerificationStatusDirect('REJECTED')}
                className="py-1 px-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg cursor-pointer text-center"
              >
                Set Rejected
              </button>
            </div>
          </div>
        </div>

        {/* AUTO-VALIDATION PROGRESS TRACKER (VISIBLE DURING RUN) */}
        {isAutoValidating && (
          <div className="mt-2.5 p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Auto-Validation Sequence Progress</span>
            <div className="space-y-1 text-[11px]">
              {autoValidationSteps.map((step, idx) => (
                <div key={idx} className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-2">
                    {step.status === 'done' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    ) : step.status === 'running' ? (
                      <RefreshCw className="w-3.5 h-3.5 text-indigo-400 animate-spin shrink-0" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-slate-750 shrink-0"></div>
                    )}
                    <span className={step.status === 'done' ? 'text-slate-400 line-through' : step.status === 'running' ? 'text-indigo-300 font-bold' : 'text-slate-500'}>
                      {step.label}
                    </span>
                  </span>
                  <span className="font-mono text-[9px]">
                    {step.status === 'done' ? 'PASSED' : step.status === 'running' ? 'RUNNING' : 'WAIT'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ----------------- SCREEN RENDER LOGIC -----------------

  // Check state directly
  if (verification.status === 'REJECTED') {
    return (
      <div className="space-y-6 max-w-7xl mx-auto px-4 md:px-0" id="rera-verification-rejected">
        {renderPresenterDeck()}

        {/* TOP STATUS REJECTED ALERT BANNER */}
        <div className="p-4 bg-rose-50/70 border border-rose-100 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-rose-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold font-mono tracking-wider uppercase text-rose-700">Verification Status</p>
              <h3 className="text-sm font-extrabold flex items-center gap-2">
                APPLICATION REJECTED <span className="text-[10px] bg-rose-200/50 px-2 py-0.5 rounded-full text-rose-800 font-bold">Action Required</span>
              </h3>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-xs">
            <div>
              <span className="text-[10px] text-rose-600 font-bold uppercase block">Rejected On</span>
              <span className="font-extrabold text-rose-900">{new Date().toISOString().split('T')[0]}</span>
            </div>
            <div>
              <span className="text-[10px] text-rose-600 font-bold uppercase block">Verification ID</span>
              <span className="font-extrabold text-rose-900 font-mono">VR-ACOT-784512</span>
            </div>
          </div>
        </div>

        {/* REJECTION REASON DETAILS */}
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 md:p-8 shadow-sm space-y-6">
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Your RERA Verification was Rejected</h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                Our verification team found some discrepancies during cross-referencing your documents with the Dubai Land Department ledger registries.
              </p>
            </div>
          </div>

          <div className="p-5 bg-rose-50/50 border border-rose-100/50 rounded-2xl space-y-2">
            <span className="text-[10px] font-black font-mono text-rose-700 uppercase tracking-widest block">OFFICIAL REJECTION REASON</span>
            <p className="text-xs font-bold text-slate-800 leading-relaxed">
              {verification.rejectionReason || 'The uploaded Emirates ID was illegible or did not match the licensee name on the RERA Certificate.'}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-center gap-4">
            <button
              onClick={handleStartRenewal}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer shadow-md shadow-indigo-600/10 flex items-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Correct & Re-submit Documents</span>
            </button>
            <button
              onClick={() => triggerToast("Opening professional support case...")}
              className="px-6 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Contact Validation Team
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (verification.status === 'EXPIRED') {
    return (
      <div className="space-y-6 max-w-7xl mx-auto px-4 md:px-0" id="rera-verification-expired">
        {renderPresenterDeck()}

        {/* TOP STATUS EXPIRED ALERT BANNER */}
        <div className="p-4 bg-slate-100 border border-slate-200 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center text-slate-600">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold font-mono tracking-wider uppercase text-slate-500">Verification Status</p>
              <h3 className="text-sm font-extrabold flex items-center gap-2">
                LICENSE EXPIRED <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded-full text-slate-700 font-bold">Action Required</span>
              </h3>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Expired On</span>
              <span className="font-extrabold text-slate-800">{expiryDate || '2025-03-28'}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Verification ID</span>
              <span className="font-extrabold text-slate-800 font-mono">VR-ACOT-784512</span>
            </div>
          </div>
        </div>

        {/* EXPIRED REASON DETAILS */}
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 md:p-8 shadow-sm space-y-6">
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-slate-50 text-slate-600 border border-slate-150 flex items-center justify-center mx-auto">
              <Clock className="w-8 h-8 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Your RERA Verification Has Expired</h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                Your broker license certificate with Dubai Land Department has reached its expiration date. Your professional features access has been paused.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-center gap-4">
            <button
              onClick={handleStartRenewal}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer shadow-md shadow-indigo-600/10 flex items-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Submit Renewed License Certificate</span>
            </button>
            <button
              onClick={() => triggerToast("Opening professional support case...")}
              className="px-6 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (verification.status === 'PENDING') {
    // SCREEN 4: AFTER SUBMISSION / PENDING VIEW
    return (
      <div className="space-y-6 max-w-7xl mx-auto px-4 md:px-0" id="rera-verification-pending">
        {renderPresenterDeck()}
        {/* TOP STATUS ALERT BANNER */}
        <div className="p-4 bg-amber-50/70 border border-amber-100 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-amber-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-bold font-mono tracking-wider uppercase text-amber-700">Verification Status</p>
              <h3 className="text-sm font-extrabold flex items-center gap-2">
                PENDING REVIEW <span className="text-[10px] bg-amber-200/50 px-2 py-0.5 rounded-full text-amber-800 font-bold">Under Review</span>
              </h3>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-xs">
            <div>
              <span className="text-[10px] text-amber-600 font-bold uppercase block">Submitted On</span>
              <span className="font-extrabold text-amber-900">12 Jan 2025</span>
            </div>
            <div>
              <span className="text-[10px] text-amber-600 font-bold uppercase block">Expected Review</span>
              <span className="font-extrabold text-amber-900">2-3 Business Days</span>
            </div>
            <div>
              <span className="text-[10px] text-amber-600 font-bold uppercase block">Verification ID</span>
              <span className="font-extrabold text-amber-900 font-mono">VR-ACOT-784512</span>
            </div>
          </div>
        </div>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-slate-100 rounded-[2rem] p-6 md:p-8 shadow-sm text-center py-12 space-y-5">
              <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center mx-auto">
                <Clock className="w-8 h-8 animate-spin" style={{ animationDuration: '4s' }} />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Your RERA Verification is Under Review</h2>
                <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                  Our validation team is cross-referencing your RERA broker license certificate with the Dubai Land Department ledger registries. This normally takes 2-3 business days.
                </p>
              </div>

              <div className="pt-2">
                <span className="text-[10px] font-mono font-black text-slate-400 block uppercase tracking-widest">DEMO AUTOMATION BYPASS</span>
                <div className="mt-3 flex justify-center gap-3">
                  <button
                    onClick={triggerDemoBypass}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl transition-all cursor-pointer shadow-md shadow-emerald-600/15"
                  >
                    <Unlock className="w-4 h-4" />
                    <span>Quick Demo Approve</span>
                  </button>
                  <button
                    onClick={resetVerificationStatus}
                    className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    <span>Reset Flow</span>
                  </button>
                </div>
              </div>
            </div>

            {/* WHAT HAPPENS NEXT */}
            <div className="bg-white border border-slate-100 rounded-[2rem] p-6 md:p-8 shadow-sm space-y-5">
              <h3 className="text-base font-black text-slate-900">What happens next?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">1</div>
                  <h4 className="text-xs font-bold text-slate-800">Our team is reviewing your documents and license details.</h4>
                  <p className="text-[11px] text-slate-400 leading-normal">Checking license status, expiry dates, and broker compliance matching.</p>
                </div>
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">2</div>
                  <h4 className="text-xs font-bold text-slate-800">You will receive an email notification once verified.</h4>
                  <p className="text-[11px] text-slate-400 leading-normal">We will reach out to the registered email address with the certification credentials.</p>
                </div>
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">3</div>
                  <h4 className="text-xs font-bold text-slate-800">You can access most platform features while waiting.</h4>
                  <p className="text-[11px] text-slate-400 leading-normal">Explore community maps, pricing logs, and active transaction listings in read-only mode.</p>
                </div>
              </div>
            </div>
          </div>

          {/* HELP CARD RIGHT SIDE */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center mx-auto">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-black text-slate-900">Need Help?</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  If you have any questions or need to update your submitted documents, please reach out to our professional support team.
                </p>
              </div>
              <button 
                onClick={() => triggerToast("Connecting to live support agents...")}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 border border-indigo-200 text-indigo-600 bg-indigo-50/30 hover:bg-indigo-50 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>Contact Support</span>
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM NOTIFICATION BANNER */}
        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3 text-slate-600">
          <AlertTriangle className="w-5 h-5 text-indigo-500 shrink-0" />
          <p className="text-xs leading-normal">
            You can continue using ACOT platform. Property-level data (property numbers, build codes, indices) and white-label report capabilities will be unlocked once your verification is fully approved.
          </p>
        </div>
      </div>
    );
  }

  if (verification.status === 'VERIFIED') {
    // SCREEN 5: VERIFIED DASHBOARD VIEW
    return (
      <div className="space-y-6 max-w-7xl mx-auto px-4 md:px-0" id="rera-verification-verified">
        {renderPresenterDeck()}
        {/* HEADER BAR FOR ACTIONS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              RERA Verification
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </h2>
            <p className="text-sm text-slate-500">Verify your professional license to unlock property-level data and white-label reports.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                triggerToast('Verification certificate downloaded successfully.');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Verification</span>
            </button>
            <button
              onClick={resetVerificationStatus}
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              <span>Reset Status</span>
            </button>
          </div>
        </div>

        {/* TOP STATUS VERIFIED ALERT BANNER */}
        <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-emerald-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold font-mono tracking-wider uppercase text-emerald-700">Verification Status</p>
              <h3 className="text-sm font-extrabold flex items-center gap-2">
                VERIFIED <span className="text-[10px] bg-emerald-200/50 px-2 py-0.5 rounded-full text-emerald-800 font-bold">Active</span>
              </h3>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-xs">
            <div>
              <span className="text-[10px] text-emerald-600 font-bold uppercase block">Verified On</span>
              <span className="font-extrabold text-emerald-900">12 Jan 2025</span>
            </div>
            <div>
              <span className="text-[10px] text-emerald-600 font-bold uppercase block">Valid Until</span>
              <span className="font-extrabold text-emerald-900">28 Mar 2027</span>
            </div>
            <div>
              <span className="text-[10px] text-emerald-600 font-bold uppercase block">Verification ID</span>
              <span className="font-extrabold text-emerald-900 font-mono">VR-ACOT-784512</span>
            </div>
            <div>
              <span className="text-[10px] text-emerald-600 font-bold uppercase block">Next Review</span>
              <span className="font-extrabold text-emerald-900">28 Mar 2027</span>
            </div>
          </div>
        </div>

        {/* SUCCESS CONGRATULATIONS BAR */}
        <div className="p-4 bg-emerald-50/30 border border-emerald-100/50 rounded-2xl flex items-center gap-3 text-emerald-800">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-xs font-semibold">
            Congratulations! You now have full access to professional features. Property-level data and white-label reports are now unlocked.
          </p>
        </div>

        {/* PROFILE AND LICENSE DETAILS DUAL PANEL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* PROFESSIONAL PROFILE CARD */}
          <div className="lg:col-span-6 bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm relative flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Professional Profile</h3>
              <button 
                onClick={() => triggerToast('Profile is read-only. Edit details in Account Preferences.')}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 flex items-center justify-center transition-colors cursor-pointer"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-5 my-6">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80" 
                alt="Broker Profile" 
                className="w-16 h-16 rounded-full object-cover border-2 border-indigo-100 shadow-sm"
                referrerPolicy="no-referrer"
              />
              <div>
                <h4 className="text-base font-black text-slate-900 leading-tight">{fullName}</h4>
                <p className="text-xs text-indigo-600 font-semibold mt-0.5">{designation}</p>
                <p className="text-[10px] text-slate-400 font-mono mt-1 uppercase tracking-wider">{companyName}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50 text-xs text-slate-600">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Email</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-slate-400" />{email}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Phone</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-400" />{phone}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Brokerage / Company</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1"><Briefcase className="w-3.5 h-3.5 text-slate-400" />{companyName}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Office Location</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" />{officeLocation}</span>
              </div>
            </div>
          </div>

          {/* RERA LICENSE DETAILS CARD */}
          <div className="lg:col-span-6 bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col justify-between">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide border-b border-slate-50 pb-3">RERA License Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 my-4 items-center">
              <div className="md:col-span-7 grid grid-cols-2 gap-4 text-xs text-slate-600">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">RERA License Number</span>
                  <span className="font-bold text-slate-900 font-mono">{licenseNumber || '123456'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">License Type</span>
                  <span className="font-bold text-slate-900">{licenseType}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Issuing Authority</span>
                  <span className="font-bold text-slate-900 leading-tight block">{issuingAuthority}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Issue Date</span>
                  <span className="font-bold text-slate-900">29 Mar 2023</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Expiry Date</span>
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    28 Mar 2027 
                    <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded-md">Valid</span>
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">License Status</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">Active</span>
                </div>
              </div>

              {/* Certificate preview */}
              <div className="md:col-span-5 flex flex-col items-center">
                <span className="text-[10px] text-slate-400 font-bold block uppercase mb-2">License Certificate</span>
                <div 
                  onClick={() => setShowCertificateModal(true)}
                  className="w-full h-24 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden relative cursor-pointer hover:border-indigo-400 group transition-all"
                >
                  <img 
                    src="https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=150&h=100&q=80" 
                    alt="Certificate Thumbnail" 
                    className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 flex items-center justify-center transition-colors">
                    <span className="text-[10px] font-bold text-white bg-slate-900/80 px-2.5 py-1 rounded-lg flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" /> View
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowCertificateModal(true)}
              className="w-full mt-4 inline-flex items-center justify-center gap-1.5 py-2 px-4 border border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>View RERA Certificate Document</span>
            </button>
          </div>
        </div>

        {/* TIMELINE AND UNLOCKED FEATURES */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* VERIFICATION TIMELINE */}
          <div className="lg:col-span-6 bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Verification Timeline</h3>
            
            <div className="space-y-4 relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
              <div className="relative">
                <span className="absolute -left-[21px] top-0.5 w-[12px] h-[12px] rounded-full bg-emerald-500 border-2 border-white ring-4 ring-emerald-50"></span>
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>Application Submitted</span>
                  <span className="text-[10px] text-slate-400 font-normal">10 Jan 2025, 10:30 AM</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">You submitted your RERA broker license details and scanning proofs.</p>
              </div>

              <div className="relative">
                <span className="absolute -left-[21px] top-0.5 w-[12px] h-[12px] rounded-full bg-emerald-500 border-2 border-white ring-4 ring-emerald-50"></span>
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>Under Review</span>
                  <span className="text-[10px] text-slate-400 font-normal">11 Jan 2025, 02:15 PM</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Verification team cross-checked details with Dubai Land Department ledger registries.</p>
              </div>

              <div className="relative">
                <span className="absolute -left-[21px] top-0.5 w-[12px] h-[12px] rounded-full bg-emerald-500 border-2 border-white ring-4 ring-emerald-50"></span>
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>Verified</span>
                  <span className="text-[10px] text-slate-400 font-normal">12 Jan 2025, 11:45 AM</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Dubai Land Department verified license RERA-{licenseNumber || '123456'} successfully.</p>
              </div>

              <div className="relative">
                <span className="absolute -left-[21px] top-0.5 w-[12px] h-[12px] rounded-full bg-emerald-500 border-2 border-white ring-4 ring-emerald-50"></span>
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>Active</span>
                  <span className="text-[10px] text-slate-400 font-normal">12 Jan 2025, 11:45 AM</span>
                </div>
                <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">You now have complete access to professional property data and report branding.</p>
              </div>
            </div>
          </div>

          {/* UNLOCKED FEATURES */}
          <div className="lg:col-span-6 bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Professional Access Unlocked</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div 
                onClick={() => setActiveFeatureModal('property')}
                className="p-4 rounded-2xl border border-slate-100 space-y-1.5 bg-slate-50/50 hover:bg-white hover:border-indigo-300 hover:shadow-md transition-all duration-200 hover:scale-[1.02] cursor-pointer text-left flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800">Property-Level Data</h4>
                  <p className="text-[10px] text-slate-400 leading-normal">Access property-number-level information, official identifiers and registration indices.</p>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">Unlocked</span>
                  <span className="text-[9px] text-indigo-600 font-bold hover:underline">Learn More →</span>
                </div>
              </div>

              <div 
                onClick={() => setActiveFeatureModal('ai')}
                className="p-4 rounded-2xl border border-slate-100 space-y-1.5 bg-slate-50/50 hover:bg-white hover:border-indigo-300 hover:shadow-md transition-all duration-200 hover:scale-[1.02] cursor-pointer text-left flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800">Professional AI</h4>
                  <p className="text-[10px] text-slate-400 leading-normal">Leverage custom-trained real estate LLM insights, deep property valuation predictions, and automated capital advice.</p>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">Unlocked</span>
                  <span className="text-[9px] text-indigo-600 font-bold hover:underline">Learn More →</span>
                </div>
              </div>

              <div 
                onClick={() => setActiveFeatureModal('reports')}
                className="p-4 rounded-2xl border border-slate-100 space-y-1.5 bg-slate-50/50 hover:bg-white hover:border-indigo-300 hover:shadow-md transition-all duration-200 hover:scale-[1.02] cursor-pointer text-left flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800">White-Label Reports</h4>
                  <p className="text-[10px] text-slate-400 leading-normal">Generate beautifully branded PDF reports and dossiers carrying your professional broker representation details.</p>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">Unlocked</span>
                  <span className="text-[9px] text-indigo-600 font-bold hover:underline">Learn More →</span>
                </div>
              </div>

              <div 
                onClick={() => setActiveFeatureModal('branding')}
                className="p-4 rounded-2xl border border-slate-100 space-y-1.5 bg-slate-50/50 hover:bg-white hover:border-indigo-300 hover:shadow-md transition-all duration-200 hover:scale-[1.02] cursor-pointer text-left flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Paintbrush className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800">Company Branding</h4>
                  <p className="text-[10px] text-slate-400 leading-normal">Integrate your corporate identity, logo, agent photo, and color scheme across the entire platform's exportable assets.</p>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">Unlocked</span>
                  <span className="text-[9px] text-indigo-600 font-bold hover:underline">Learn More →</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* VERIFICATION HISTORY */}
        <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Verification History</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-600">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold">
                  <th className="py-3 px-4">Submission Date</th>
                  <th className="py-3 px-4">License Number</th>
                  <th className="py-3 px-4">Valid From</th>
                  <th className="py-3 px-4">Valid Until</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {mockHistoryLog.map((row, index) => (
                  <tr key={index} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-800">{row.submissionDate}</td>
                    <td className="py-3 px-4 font-mono">{row.licenseNumber}</td>
                    <td className="py-3 px-4">{row.validFrom}</td>
                    <td className="py-3 px-4">{row.validUntil}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2.5 py-1 text-[10px] font-bold rounded-lg border ${row.statusColor}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button 
                        onClick={() => {
                          setSelectedHistoryRow(row);
                          setShowCertificateModal(true);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] rounded-lg transition-colors cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* HELP CARD SECTION AND RENEW */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-1.5">
              <h4 className="text-sm font-black text-slate-900">Need to renew or update your verification?</h4>
              <p className="text-xs text-slate-400 max-w-lg">
                If your brokerage has changed or your license has been renewed with Dubai Land Department, submit an updated certificate to keep your professional access active.
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <button 
                onClick={handleStartRenewal}
                className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-indigo-600/15 cursor-pointer"
              >
                Renew License
              </button>
              <button 
                onClick={() => triggerToast("Contacting professional validation team...")}
                className="py-2.5 px-4 border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Contact Support
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 bg-indigo-600 rounded-[2rem] p-6 shadow-md text-white flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[9px] font-black tracking-widest text-indigo-200 uppercase">PROFESSIONAL WORKSPACE</span>
              <h4 className="text-sm font-black">Explore Client Proposals</h4>
              <p className="text-xs text-indigo-100 leading-normal">
                Access client-targeted pricing data, investment metrics, and generate customized reports immediately.
              </p>
            </div>
            <button 
              onClick={() => setActiveSidebarItem('Dashboard')}
              className="mt-4 w-full py-2.5 px-4 bg-white hover:bg-indigo-50 text-indigo-700 font-extrabold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Explore Platform</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* RE-USABLE MODAL FOR CERTIFICATE PREVIEW */}
        <AnimatePresence>
          {showCertificateModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
              onClick={() => {
                setShowCertificateModal(false);
                setSelectedHistoryRow(null);
              }}
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-[2rem] max-w-3xl w-full p-6 md:p-8 space-y-6 relative border border-slate-100 shadow-2xl"
                onClick={e => e.stopPropagation()}
              >
                <button 
                  onClick={() => {
                    setShowCertificateModal(false);
                    setSelectedHistoryRow(null);
                  }}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <Unlock className="w-5 h-5 rotate-45" />
                </button>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-black text-slate-900">RERA Broker License Certificate</h3>
                  <p className="text-xs text-slate-400">Official registry credential issued by the Real Estate Regulatory Agency (RERA), Dubai Land Department.</p>
                </div>

                {/* THE ELEGANT GOVERNMENT MOCK CERTIFICATE DESIGN */}
                <div className="border-4 border-double border-indigo-200 p-6 md:p-8 bg-slate-50/50 rounded-2xl relative overflow-hidden font-serif text-slate-800">
                  {/* Subtle Background Seals */}
                  <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-indigo-500/5 blur-2xl"></div>
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-indigo-100 flex items-center justify-center opacity-30 pointer-events-none">
                    <span className="text-[10px] uppercase font-black tracking-widest text-indigo-500/40">DUBAI GOVERNMENT SEAL</span>
                  </div>

                  <div className="flex justify-between items-start border-b border-indigo-100 pb-4 mb-6">
                    <div>
                      <h4 className="text-[10px] font-sans font-black uppercase text-indigo-900 tracking-wider">REAL ESTATE REGULATORY AGENCY</h4>
                      <p className="text-[8px] font-sans text-slate-400 uppercase font-bold tracking-widest mt-0.5">DUBAI LAND DEPARTMENT</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-sans font-black text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-100">
                        {selectedHistoryRow ? selectedHistoryRow.status : 'ACTIVE'}
                      </span>
                      <p className="text-[8px] font-sans text-slate-400 mt-1 uppercase font-bold">RERA CERT-9321A8</p>
                    </div>
                  </div>

                  <div className="text-center space-y-3 mb-6">
                    <h5 className="text-sm font-sans font-extrabold uppercase text-indigo-950 tracking-widest">BROKER LICENSE REGISTER</h5>
                    <p className="text-xs italic text-slate-500">This is to certify that the professional named below has been fully validated as a registered real estate broker in the Emirate of Dubai.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs border-t border-b border-indigo-50/70 py-4 my-6 font-sans">
                    <div className="space-y-0.5">
                      <span className="text-[8px] text-slate-400 uppercase font-black block">Broker Name</span>
                      <span className="font-extrabold text-slate-900">{fullName}</span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[8px] text-slate-400 uppercase font-black block">Broker ID / License</span>
                      <span className="font-mono font-black text-indigo-600">{selectedHistoryRow ? selectedHistoryRow.licenseNumber : licenseNumber || '123456'}</span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[8px] text-slate-400 uppercase font-black block">Designated Brokerage</span>
                      <span className="font-extrabold text-slate-900">{companyName}</span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[8px] text-slate-400 uppercase font-black block">Authority Registry</span>
                      <span className="font-extrabold text-slate-900">{issuingAuthority}</span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[8px] text-slate-400 uppercase font-black block">Validated From</span>
                      <span className="font-bold text-slate-800">{selectedHistoryRow ? selectedHistoryRow.validFrom : '29 Mar 2023'}</span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[8px] text-slate-400 uppercase font-black block">Expiry Date</span>
                      <span className="font-bold text-slate-800">{selectedHistoryRow ? selectedHistoryRow.validUntil : expiryDate || '28 Mar 2027'}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-end font-sans text-[9px] pt-4 text-slate-400">
                    <div>
                      <p className="font-bold text-indigo-900/60 uppercase text-[8px]">DIGITAL SIGNATURE</p>
                      <p className="italic text-slate-700 mt-0.5 font-serif font-bold text-xs">A. Mohammed</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-indigo-900/60 uppercase text-[8px]">DLD SECURE LEDGER</p>
                      <p className="font-mono text-[8px] mt-0.5 text-slate-500 font-bold">SHA-256: e8b321...a342ef</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => {
                      triggerToast('Credential certificate download initiated.');
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl transition-all cursor-pointer shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF Copy</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowCertificateModal(false);
                      setSelectedHistoryRow(null);
                    }}
                    className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Close Preview
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* BOTTOM TIMELINE EXPIRY FOOTER BANNER */}
        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3 text-slate-500 text-xs">
          <Clock className="w-5 h-5 text-indigo-500 shrink-0" />
          <p>
            Keep your license active to continue enjoying professional features. You will be notified 60 days before your RERA Broker License certificate is scheduled to expire.
          </p>
        </div>

        {/* RE-USABLE MODAL FOR UNLOCKED FEATURE INFO */}
        <AnimatePresence>
          {activeFeatureModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/75 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
              onClick={() => setActiveFeatureModal(null)}
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-[2.5rem] max-w-lg w-full p-6 md:p-8 space-y-6 relative border border-slate-100 shadow-2xl text-left text-slate-800"
                onClick={e => e.stopPropagation()}
              >
                <button 
                  onClick={() => setActiveFeatureModal(null)}
                  className="absolute top-5 right-5 w-8 h-8 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <Unlock className="w-5 h-5 rotate-45" />
                </button>

                {/* MODAL TITLE & ICON */}
                <div className="flex items-center gap-4 border-b border-slate-50 pb-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    {activeFeatureModal === 'property' && <ShieldCheck className="w-6 h-6" />}
                    {activeFeatureModal === 'ai' && <Sparkles className="w-6 h-6" />}
                    {activeFeatureModal === 'reports' && <FileText className="w-6 h-6" />}
                    {activeFeatureModal === 'branding' && <Paintbrush className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      {activeFeatureModal === 'property' && 'Professional Property-Level Data'}
                      {activeFeatureModal === 'ai' && 'Professional AI Insights'}
                      {activeFeatureModal === 'reports' && 'White-Label PDF Reports'}
                      {activeFeatureModal === 'branding' && 'Company Branding Integration'}
                    </h3>
                    <p className="text-[10px] text-emerald-600 font-extrabold uppercase tracking-wider flex items-center gap-1 mt-0.5">
                      <Check className="w-3 h-3" /> Fully Unlocked & Verified
                    </p>
                  </div>
                </div>

                {/* CONTENT SPEC DETAILS */}
                <div className="space-y-4 text-xs leading-relaxed text-slate-600">
                  <div>
                    <h4 className="font-extrabold text-slate-850 uppercase tracking-wider text-[10px] mb-1">What is this feature?</h4>
                    <p>
                      {activeFeatureModal === 'property' && 'Granular, building-by-building and unit-by-unit transaction records, official DLD plot numbers, municipal registers, and title deed clearance indicators.'}
                      {activeFeatureModal === 'ai' && 'Advanced generative property analyst, trained on historical Dubai Land Department transactions, market cycles, and rental index projections.'}
                      {activeFeatureModal === 'reports' && 'Custom PDF generation engine that aggregates your selected community statistics, historical sales, rental yields, and custom AI summaries.'}
                      {activeFeatureModal === 'branding' && 'Corporate branding control center allowing upload of company logo, agent portrait photograph, brokerage website, signature, and corporate colors.'}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-slate-850 uppercase tracking-wider text-[10px] mb-1">Why does it exist?</h4>
                    <p>
                      {activeFeatureModal === 'property' && 'Allows brokers to perform micro-market analysis and present certified, clean-title listings directly to institutional or high-net-worth buyers, establishing absolute transaction authority.'}
                      {activeFeatureModal === 'ai' && 'Drastically reduces the time required to perform property underwriting and market commentary, producing institutional-grade analysis in seconds.'}
                      {activeFeatureModal === 'reports' && 'To deliver high-impact, beautifully formatted investor dossiers that place your brokerage identity and certified RERA license credentials at the center of client communications.'}
                      {activeFeatureModal === 'branding' && 'Ensures that every PDF dossier, presentation, or shared transaction watchlist is beautifully aligned with your personal brand and company design guidelines.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div>
                      <h4 className="font-extrabold text-slate-850 uppercase tracking-wider text-[9px]">Modules Enhanced</h4>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        {activeFeatureModal === 'property' && 'Maps, Transactions'}
                        {activeFeatureModal === 'ai' && 'AI Intelligence Suite'}
                        {activeFeatureModal === 'reports' && 'Reports Engine'}
                        {activeFeatureModal === 'branding' && 'Reports, Profile'}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-850 uppercase tracking-wider text-[9px]">Where to Access</h4>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        {activeFeatureModal === 'property' && 'Maps & Geospatial Tab'}
                        {activeFeatureModal === 'ai' && 'AI Intelligence Suite Tab'}
                        {activeFeatureModal === 'reports' && 'Reports Engine Tab'}
                        {activeFeatureModal === 'branding' && 'Company Branding Tab'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* CALL TO ACTION BUTTON */}
                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                  <button 
                    onClick={() => setActiveFeatureModal(null)}
                    className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                  <button 
                    onClick={() => {
                      const targetTab = 
                        activeFeatureModal === 'property' ? 'Maps & Geospatial' :
                        activeFeatureModal === 'ai' ? 'AI Intelligence Suite' :
                        activeFeatureModal === 'reports' ? 'Reports Engine' :
                        'Company Branding';
                      setActiveSidebarItem(targetTab);
                      setActiveFeatureModal(null);
                      triggerToast(`Navigating to ${targetTab}...`);
                    }}
                    className="px-5 py-2 bg-indigo-650 hover:bg-indigo-600 text-white font-extrabold text-xs rounded-xl transition-all shadow-md shadow-indigo-650/15 cursor-pointer flex items-center gap-1"
                  >
                    <span>
                      {activeFeatureModal === 'property' && 'Open Maps'}
                      {activeFeatureModal === 'ai' && 'Open AI Suite'}
                      {activeFeatureModal === 'reports' && 'Open Reports'}
                      {activeFeatureModal === 'branding' && 'Configure Branding'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // SCREEN 1: VERIFICATION INTRODUCTION
  if (currentStep === 1) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto px-4 md:px-0" id="rera-verification-intro">
        {renderPresenterDeck()}
        {/* LARGE HERO HEADER AND ILLUSTRATION */}
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 md:p-10 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-indigo-50/50 blur-3xl -z-10"></div>
          
          <div className="space-y-6 max-w-xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100/50 rounded-full text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>DLD & RERA Verified Access</span>
            </div>
            
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-none flex items-center gap-2">
                RERA Verification
                <CheckCircle2 className="w-7 h-7 text-emerald-500" />
              </h1>
              <p className="text-sm text-slate-500 leading-relaxed">
                Verify your professional license to unlock advanced property-level data, registry identifier numbers, and create beautifully branded white-label investment reports for your clients.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
              <button
                onClick={() => setCurrentStep(2)}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer shadow-md shadow-indigo-600/25 group"
              >
                <span>Start Verification</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-4 h-4 text-slate-300" /> Takes only 5-10 minutes
              </span>
            </div>
          </div>

          {/* Elegant Shield & Document Illustration on Right Side */}
          <div className="relative shrink-0 w-full max-w-xs md:max-w-sm flex justify-center items-center">
            <div className="w-64 h-64 rounded-[2.5rem] bg-indigo-50/40 relative flex items-center justify-center border border-indigo-100/30">
              {/* Floating Shield */}
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-2xl bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20 z-10 animate-bounce" style={{ animationDuration: '6s' }}>
                <ShieldCheck className="w-6 h-6" />
              </div>
              
              {/* Document Mock */}
              <div className="w-44 h-56 bg-white border border-slate-200/80 rounded-2xl shadow-xl p-4 flex flex-col justify-between relative transform rotate-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <span className="text-[8px] font-black font-mono tracking-wider text-indigo-600">RERA</span>
                    <span className="text-[6px] text-slate-400 font-semibold font-mono">Real Estate Regulatory Agency</span>
                  </div>
                  <div className="h-1.5 w-3/4 bg-slate-100 rounded-full"></div>
                  <div className="h-1.5 w-1/2 bg-slate-100 rounded-full"></div>
                  <div className="h-1.5 w-5/6 bg-slate-100 rounded-full"></div>
                  <div className="h-1.5 w-2/3 bg-slate-100 rounded-full"></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="h-4 w-12 bg-indigo-50 rounded"></div>
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* WHY GET RERA VERIFIED SECTION */}
        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Why Get RERA Verified?</h2>
            <p className="text-xs text-slate-400">Gain access to professional tools and data trusted by real estate experts.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white border border-slate-100 rounded-[2rem] p-5 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-black text-slate-800">Unlock Property-Level Data</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Access property-number-level information and official identifiers that are not available to regular users.
                </p>
              </div>
              <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg inline-block w-fit">
                Exclusive for Verified Agents
              </span>
            </div>

            <div className="bg-white border border-slate-100 rounded-[2rem] p-5 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-black text-slate-800">Create White-Label Reports</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Generate branded PDF reports with your company identity to share professionally with clients.
                </p>
              </div>
              <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg inline-block w-fit">
                Build Client Trust
              </span>
            </div>

            <div className="bg-white border border-slate-100 rounded-[2rem] p-5 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-black text-slate-800">Professional Credibility</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Showcase your verified status and RERA license to build confidence with your clients.
                </p>
              </div>
              <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg inline-block w-fit">
                Stand Out as a Professional
              </span>
            </div>

            <div className="bg-white border border-slate-100 rounded-[2rem] p-5 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-black text-slate-800">More Opportunities</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Get discovered in our professional network and grow your business with more qualified leads.
                </p>
              </div>
              <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg inline-block w-fit">
                Grow Your Business
              </span>
            </div>
          </div>
        </div>

        {/* HOW IT WORKS AND WHAT YOU NEED */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* HOW VERIFICATION WORKS */}
          <div className="lg:col-span-8 bg-white border border-slate-100 rounded-[2rem] p-6 md:p-8 shadow-sm space-y-6">
            <h3 className="text-base font-black text-slate-900">How Verification Works</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative">
              <div className="space-y-3 text-center sm:text-left">
                <div className="relative inline-flex sm:flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs border border-indigo-100 mx-auto sm:mx-0">1</span>
                  <div className="hidden sm:block flex-1 h-[2px] bg-slate-100"></div>
                </div>
                <h4 className="text-xs font-bold text-slate-800">Enter Details</h4>
                <p className="text-[10px] text-slate-400 leading-relaxed">Provide your RERA license information and professional details.</p>
              </div>

              <div className="space-y-3 text-center sm:text-left">
                <div className="relative inline-flex sm:flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs border border-indigo-100 mx-auto sm:mx-0">2</span>
                  <div className="hidden sm:block flex-1 h-[2px] bg-slate-100"></div>
                </div>
                <h4 className="text-xs font-bold text-slate-800">Upload Documents</h4>
                <p className="text-[10px] text-slate-400 leading-relaxed">Upload your RERA certificate and Emirates ID for verification.</p>
              </div>

              <div className="space-y-3 text-center sm:text-left">
                <div className="relative inline-flex sm:flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs border border-indigo-100 mx-auto sm:mx-0">3</span>
                  <div className="hidden sm:block flex-1 h-[2px] bg-slate-100"></div>
                </div>
                <h4 className="text-xs font-bold text-slate-800">Review Process</h4>
                <p className="text-[10px] text-slate-400 leading-relaxed">Our team will review and verify your documents against the official registry.</p>
              </div>

              <div className="space-y-3 text-center sm:text-left">
                <div className="relative inline-flex sm:flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs border border-emerald-400 mx-auto sm:mx-0"><Check className="w-4 h-4" /></span>
                </div>
                <h4 className="text-xs font-bold text-slate-800">Get Verified</h4>
                <p className="text-[10px] text-slate-400 leading-relaxed">Once approved, you'll unlock professional features instantly.</p>
              </div>
            </div>
          </div>

          {/* WHAT YOU NEED TO GET STARTED */}
          <div className="lg:col-span-4 bg-white border border-slate-100 rounded-[2rem] p-6 md:p-8 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900">What You Need to Get Started</h3>
            
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Valid RERA License</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Active real estate broker/agent license issued by RERA</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">RERA License Certificate</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Clear scan or photo of your RERA license certificate</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <File className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Emirates ID</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Clear scan or photo of your Emirates ID (front & back)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Professional Details</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Your brokerage/company and contact information</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECURE DATA MESSAGE AND FOOTER CTA */}
        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-indigo-500 shrink-0" />
            <p className="leading-relaxed">
              <strong>Your Data is Secure:</strong> We use bank-level encryption and secure storage to protect your information. Your documents are only used for professional verification purposes.
            </p>
          </div>
          <button 
            onClick={() => triggerToast("Opening official RERA validation guidelines...")}
            className="text-[11px] font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1.5 underline shrink-0 cursor-pointer"
          >
            Learn More About Verification
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // STEP COMPONENT: PROGRESS INDICATOR FOR STEPS 2, 3, 4
  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center gap-3 md:gap-6 border-b border-slate-100 pb-5 mb-6 text-xs font-bold text-slate-400">
        <div className={`flex items-center gap-1.5 ${currentStep === 2 ? 'text-indigo-600' : currentStep > 2 ? 'text-emerald-600' : ''}`}>
          <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
            currentStep === 2 ? 'bg-indigo-600 text-white' : currentStep > 2 ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'
          }`}>
            {currentStep > 2 ? <Check className="w-4 h-4" /> : '1'}
          </span>
          <span>Enter RERA Details</span>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-300" />
        <div className={`flex items-center gap-1.5 ${currentStep === 3 ? 'text-indigo-600' : currentStep > 3 ? 'text-emerald-600' : ''}`}>
          <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
            currentStep === 3 ? 'bg-indigo-600 text-white' : currentStep > 3 ? 'bg-emerald-500 text-white' : 'bg-slate-100'
          }`}>
            {currentStep > 3 ? <Check className="w-4 h-4" /> : '2'}
          </span>
          <span>Upload Documents</span>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-300" />
        <div className={`flex items-center gap-1.5 ${currentStep === 4 ? 'text-indigo-600' : ''}`}>
          <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
            currentStep === 4 ? 'bg-indigo-600 text-white' : 'bg-slate-100'
          }`}>3</span>
          <span>Review & Submit</span>
        </div>
      </div>
    );
  };

  // SCREEN 2: ENTER RERA DETAILS
  if (currentStep === 2) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto px-4 md:px-0" id="rera-verification-details">
        {renderPresenterDeck()}
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 md:p-8 shadow-sm">
          {renderStepIndicator()}

          <div className="mb-6">
            <h2 className="text-xl font-black text-slate-900">RERA License Information</h2>
            <p className="text-xs text-slate-400 mt-1">Enter your RERA license details as shown on your official certificate.</p>
          </div>

          <form onSubmit={handleDetailsSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase">RERA License Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 123456"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl py-3 px-4 font-medium text-slate-850 transition-all outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase">License Type *</label>
                <select
                  value={licenseType}
                  onChange={(e) => setLicenseType(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl py-3 px-4 font-medium text-slate-850 transition-all outline-none"
                >
                  <option value="Broker">Broker</option>
                  <option value="Agent">Agent</option>
                  <option value="Developer">Developer</option>
                  <option value="Other">Other Professional</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase">Issuing Authority *</label>
                <select
                  value={issuingAuthority}
                  onChange={(e) => setIssuingAuthority(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl py-3 px-4 font-medium text-slate-850 transition-all outline-none"
                >
                  <option value="Dubai Land Department (DLD)">Dubai Land Department (DLD)</option>
                  <option value="Abu Dhabi Municipality (ADM)">Abu Dhabi Municipality (ADM)</option>
                  <option value="Sharjah Real Estate Department">Sharjah Real Estate Department</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500 uppercase">Issue Date *</label>
                  <input
                    type="date"
                    required
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full bg-slate-50/50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl py-3 px-4 font-medium text-slate-850 transition-all outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500 uppercase">Expiry Date *</label>
                  <input
                    type="date"
                    required
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full bg-slate-50/50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl py-3 px-4 font-medium text-slate-850 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase">Broker Company *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ABC Realty"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl py-3 px-4 font-medium text-slate-850 transition-all outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase">Designation *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Property Consultant"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl py-3 px-4 font-medium text-slate-850 transition-all outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase">Designated Broker (if applicable)</label>
                <input
                  type="text"
                  placeholder="e.g. John Smith"
                  value={designatedBroker}
                  onChange={(e) => setDesignatedBroker(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl py-3 px-4 font-medium text-slate-850 transition-all outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase">Office Location *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dubai Marina, Dubai, UAE"
                  value={officeLocation}
                  onChange={(e) => setOfficeLocation(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl py-3 px-4 font-medium text-slate-850 transition-all outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase">Registered Email *</label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl py-3 px-4 font-medium text-slate-850 transition-all outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase">Registered Phone Number *</label>
                <input
                  type="text"
                  required
                  placeholder="+971 50 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl py-3 px-4 font-medium text-slate-850 transition-all outline-none"
                />
              </div>
            </div>

            {/* CONFIRM CHECKBOX */}
            <div className="pt-3">
              <label className="flex items-start gap-2.5 text-[11px] text-slate-500 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmAccuracy}
                  onChange={(e) => setConfirmAccuracy(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <span>I confirm that all the information provided is accurate and matches my official RERA license.</span>
              </label>
            </div>

            {/* BUTTONS */}
            <div className="pt-5 border-t border-slate-100 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-5 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md shadow-indigo-600/10"
              >
                <span>Next: Upload Documents</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // SCREEN 3: UPLOAD DOCUMENTS
  if (currentStep === 3) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto px-4 md:px-0" id="rera-verification-uploads">
        {renderPresenterDeck()}
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 md:p-8 shadow-sm">
          {renderStepIndicator()}

          <div className="mb-6">
            <h2 className="text-xl font-black text-slate-900">Upload Required Documents</h2>
            <p className="text-xs text-slate-400 mt-1">Please upload clear and valid documents for verification.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* RERA LICENSE CERTIFICATE CARD */}
            <div className="border border-slate-100 rounded-2xl p-5 space-y-4 bg-slate-50/20">
              <div>
                <h3 className="text-xs font-black text-slate-800">RERA License Certificate *</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Upload a clear PDF or image of your RERA license.</p>
              </div>

              {files.certificate ? (
                <div className="p-3 bg-white border border-indigo-100 rounded-xl flex items-center justify-between text-xs font-medium">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="w-5 h-5 text-indigo-600 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-slate-800 font-bold truncate">{files.certificate.name}</p>
                      <span className="text-[10px] text-slate-400 font-mono block">{files.certificate.size} • Uploaded</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFile('certificate')}
                    className="w-8 h-8 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => simulateFileUpload('certificate', `rera_license_${licenseNumber || '123456'}.pdf`, '1.2 MB')}
                  className="border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/10 rounded-2xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3.5 bg-white"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center border border-slate-100">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Click to Upload Certificate</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">PDF, PNG, JPG format, Max 5MB</span>
                  </div>
                </div>
              )}
            </div>

            {/* EMIRATES ID FRONT CARD */}
            <div className="border border-slate-100 rounded-2xl p-5 space-y-4 bg-slate-50/20">
              <div>
                <h3 className="text-xs font-black text-slate-800">Emirates ID (Front Side) *</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Upload a clear copy of your Emirates ID front.</p>
              </div>

              {files.idFront ? (
                <div className="p-3 bg-white border border-indigo-100 rounded-xl flex items-center justify-between text-xs font-medium">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="w-5 h-5 text-indigo-600 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-slate-800 font-bold truncate">{files.idFront.name}</p>
                      <span className="text-[10px] text-slate-400 font-mono block">{files.idFront.size} • Uploaded</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFile('idFront')}
                    className="w-8 h-8 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => simulateFileUpload('idFront', `emirates_id_front.jpg`, '950 KB')}
                  className="border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/10 rounded-2xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3.5 bg-white"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center border border-slate-100">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Click to Upload Emirates ID (Front)</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">PDF, PNG, JPG format, Max 5MB</span>
                  </div>
                </div>
              )}
            </div>

            {/* EMIRATES ID BACK CARD */}
            <div className="border border-slate-100 rounded-2xl p-5 space-y-4 bg-slate-50/20">
              <div>
                <h3 className="text-xs font-black text-slate-800">Emirates ID (Back Side) *</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Upload a clear copy of your Emirates ID back.</p>
              </div>

              {files.idBack ? (
                <div className="p-3 bg-white border border-indigo-100 rounded-xl flex items-center justify-between text-xs font-medium">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="w-5 h-5 text-indigo-600 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-slate-800 font-bold truncate">{files.idBack.name}</p>
                      <span className="text-[10px] text-slate-400 font-mono block">{files.idBack.size} • Uploaded</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFile('idBack')}
                    className="w-8 h-8 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => simulateFileUpload('idBack', `emirates_id_back.jpg`, '1.1 MB')}
                  className="border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/10 rounded-2xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3.5 bg-white"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center border border-slate-100">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Click to Upload Emirates ID (Back)</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">PDF, PNG, JPG format, Max 5MB</span>
                  </div>
                </div>
              )}
            </div>

            {/* FUTURE TRADE LICENSE PLACEHOLDER */}
            <div className="border border-slate-100 rounded-2xl p-5 space-y-4 bg-slate-50/20 opacity-75">
              <div>
                <h3 className="text-xs font-black text-slate-800">Trade License <span className="text-[9px] bg-slate-200 text-slate-600 font-bold px-1.5 py-0.5 rounded">Optional</span></h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Upload brokerage agency trade license if representative.</p>
              </div>

              {files.tradeLicense ? (
                <div className="p-3 bg-white border border-indigo-100 rounded-xl flex items-center justify-between text-xs font-medium">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="w-5 h-5 text-indigo-600 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-slate-800 font-bold truncate">{files.tradeLicense.name}</p>
                      <span className="text-[10px] text-slate-400 font-mono block">{files.tradeLicense.size} • Uploaded</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFile('tradeLicense')}
                    className="w-8 h-8 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => simulateFileUpload('tradeLicense', `trade_license_corp.pdf`, '2.4 MB')}
                  className="border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/10 rounded-2xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3.5 bg-white"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center border border-slate-100">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Click to Upload Trade License</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">PDF or image format, optional</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ACTIVE UPLOAD PROGRESS MICRO-INTERACTION LOGIC */}
          {(Object.values(files) as any[]).some(f => f && f.status === 'uploading') && (
            <div className="mt-6 p-4 border border-indigo-50 bg-indigo-50/10 rounded-2xl space-y-2.5">
              <span className="text-[10px] font-black font-mono text-indigo-700 uppercase tracking-wider block">Uploading Documents...</span>
              <div className="space-y-1.5 text-xs">
                {(Object.entries(files) as [string, any][]).map(([key, f]) => {
                  if (!f || f.status !== 'uploading') return null;
                  return (
                    <div key={key} className="space-y-1">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-slate-700">{f.name}</span>
                        <span className="font-mono font-bold text-indigo-600">{f.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-indigo-600 h-1.5 transition-all duration-150" style={{ width: `${f.progress}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ACCEPTED FORMATS BANNER */}
          <div className="mt-6 p-3.5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-2 text-[11px] text-slate-500">
            <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0" />
            <span>Accepted formats: PDF, PNG, JPG (Max size: 5MB per file)</span>
          </div>

          {/* BUTTONS */}
          <div className="pt-5 mt-6 border-t border-slate-100 flex justify-between items-center">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={handleUploadsNext}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md shadow-indigo-600/10"
            >
              <span>Next: Review & Submit</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // SCREEN 4: REVIEW & SUBMIT
  if (currentStep === 4) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto px-4 md:px-0" id="rera-verification-review">
        {renderPresenterDeck()}
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 md:p-8 shadow-sm">
          {renderStepIndicator()}

          <div className="mb-6">
            <h2 className="text-xl font-black text-slate-900">Review Your Information</h2>
            <p className="text-xs text-slate-400 mt-1">Please review your details and documents before submitting.</p>
          </div>

          <div className="space-y-6">
            {/* RERA DETAILS SUMMARY */}
            <div className="border border-slate-100 rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wide">RERA License Details</h3>
                <button 
                  onClick={() => setCurrentStep(2)}
                  className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold cursor-pointer underline"
                >
                  Edit
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">License Number</span>
                  <span className="font-semibold text-slate-800 font-mono">{licenseNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">License Type</span>
                  <span className="font-semibold text-slate-800">{licenseType}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Issuing Authority</span>
                  <span className="font-semibold text-slate-800">{issuingAuthority}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Issue Date</span>
                  <span className="font-semibold text-slate-800">{issueDate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Expiry Date</span>
                  <span className="font-semibold text-slate-800">{expiryDate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Broker Company</span>
                  <span className="font-semibold text-slate-800">{companyName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Designated Broker</span>
                  <span className="font-semibold text-slate-800">{designatedBroker || 'None'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Designation</span>
                  <span className="font-semibold text-slate-800">{designation}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Office Location</span>
                  <span className="font-semibold text-slate-800">{officeLocation}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Registered Email</span>
                  <span className="font-semibold text-slate-800">{email}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Registered Phone</span>
                  <span className="font-semibold text-slate-800">{phone}</span>
                </div>
              </div>
            </div>

            {/* UPLOADED DOCUMENTS SUMMARY */}
            <div className="border border-slate-100 rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wide">Uploaded Documents</h3>
                <button 
                  onClick={() => setCurrentStep(3)}
                  className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold cursor-pointer underline"
                >
                  Edit
                </button>
              </div>

              <div className="space-y-2.5 text-xs">
                {files.certificate && (
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span className="font-bold text-slate-800">RERA License Certificate:</span>
                    <span className="text-slate-500">{files.certificate.name} ({files.certificate.size})</span>
                  </div>
                )}
                {files.idFront && (
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span className="font-bold text-slate-800">Emirates ID (Front Side):</span>
                    <span className="text-slate-500">{files.idFront.name} ({files.idFront.size})</span>
                  </div>
                )}
                {files.idBack && (
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span className="font-bold text-slate-800">Emirates ID (Back Side):</span>
                    <span className="text-slate-500">{files.idBack.name} ({files.idBack.size})</span>
                  </div>
                )}
                {files.tradeLicense && (
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span className="font-bold text-slate-800">Trade License:</span>
                    <span className="text-slate-500">{files.tradeLicense.name} ({files.tradeLicense.size})</span>
                  </div>
                )}
              </div>
            </div>

            {/* FINAL CONFIRM CHECKBOX */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <label className="flex items-start gap-3 text-[11px] text-slate-650 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmReview}
                  onChange={(e) => setConfirmReview(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <span className="leading-relaxed">
                  I confirm that all the information provided is true, correct, and the documents uploaded are genuine. I understand that any false information may lead to rejection or suspension of my professional broker representation account.
                </span>
              </label>
            </div>

            {/* BUTTONS */}
            <div className="pt-5 border-t border-slate-100 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-5 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl transition-all cursor-pointer shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <>
                    <span>Submit for Verification</span>
                    <Check className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback / standard Intro screen
  return null;
}
