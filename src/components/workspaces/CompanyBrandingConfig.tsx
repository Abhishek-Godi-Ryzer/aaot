import React, { useState, useEffect, useRef } from 'react';
import { 
  Building, 
  User, 
  Settings, 
  Upload, 
  Trash2, 
  RotateCcw, 
  Check, 
  AlertCircle, 
  Globe, 
  Phone, 
  Mail, 
  MapPin, 
  Briefcase, 
  FileText, 
  Lock, 
  CheckCircle2, 
  Sparkles, 
  HelpCircle,
  Smartphone,
  Eye
} from 'lucide-react';
import { CompanyBranding, AgentVerification, CompanyInformation, AgentInformation, ReportBrandingSettings, AgentService } from '../../services/agentService';

interface CompanyBrandingConfigProps {
  branding: CompanyBranding;
  onBrandingSave: (updatedBranding: CompanyBranding) => void;
  triggerToast: (msg: string) => void;
  verification: AgentVerification;
}

// UAE Flag SVG component
const UaeFlag = () => (
  <svg width="18" height="12" viewBox="0 0 16 12" className="inline-block rounded-xs shadow-sm shrink-0 border border-slate-200" style={{ minWidth: '18px' }}>
    <rect width="16" height="4" fill="#00732F" />
    <rect y="4" width="16" height="4" fill="#FFFFFF" />
    <rect y="8" width="16" height="4" fill="#000000" />
    <rect width="4" height="12" fill="#FF0000" />
  </svg>
);

// High-fidelity R.E.A architectural building logo placeholder
const LogoPlaceholderSVG = () => (
  <svg width="72" height="72" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-slate-300 transition-colors duration-200 group-hover:text-indigo-400">
    <path d="M12 48V20H20V48" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20 48V8H32V48" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M32 48V28H44V48" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M44 48V36H52V48" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 48H56" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <text x="32" y="58" textAnchor="middle" fill="currentColor" fontSize="7" fontWeight="bold" letterSpacing="1.5" className="font-mono tracking-widest">R.E.A</text>
  </svg>
);

const AgentPlaceholderSVG = () => (
  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" className="text-slate-300 transition-colors duration-200 group-hover:text-indigo-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>
);

export function CompanyBrandingConfig({
  branding,
  onBrandingSave,
  triggerToast,
  verification
}: CompanyBrandingConfigProps) {
  // Form fields states
  const [companyInfo, setCompanyInfo] = useState<CompanyInformation>({
    companyLogo: branding.companyInfo?.companyLogo || branding.companyLogo || '',
    companyName: branding.companyInfo?.companyName || branding.companyName || '',
    address: branding.companyInfo?.address || branding.address || '',
    phone: branding.companyInfo?.phone || branding.phone || '',
    email: branding.companyInfo?.email || branding.email || '',
    website: branding.companyInfo?.website || branding.website || ''
  });

  const [agentInfo, setAgentInfo] = useState<AgentInformation>({
    agentPhoto: branding.agentInfo?.agentPhoto || '',
    agentName: branding.agentInfo?.agentName || verification.fullName || 'Michael Chang',
    designation: branding.agentInfo?.designation || verification.designation || 'Senior Property Consultant',
    reraNumber: branding.agentInfo?.reraNumber || verification.licenseNumber || 'CN-123456',
    mobile: branding.agentInfo?.mobile || '+971 50 123 4567',
    email: branding.agentInfo?.email || 'michael.chang@abcrealty.ae'
  });

  const [reportSettings, setReportSettings] = useState<ReportBrandingSettings>({
    showCompanyLogo: branding.reportSettings?.showCompanyLogo ?? true,
    showAgentPhoto: branding.reportSettings?.showAgentPhoto ?? true,
    showAgentContactDetails: branding.reportSettings?.showAgentContactDetails ?? true,
    showReraNumber: branding.reportSettings?.showReraNumber ?? true,
    showCompanyFooter: branding.reportSettings?.showCompanyFooter ?? true,
    poweredByAcot: branding.reportSettings?.poweredByAcot ?? true
  });

  // UI state managers
  const [logoProgress, setLogoProgress] = useState<number | null>(null);
  const [photoProgress, setPhotoProgress] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Input refs for clicking the upload areas
  const logoInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Unsaved changes checking
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const defaultLogo = branding.companyInfo?.companyLogo || branding.companyLogo || '';
    const defaultCompanyName = branding.companyInfo?.companyName || branding.companyName || '';
    const defaultAddress = branding.companyInfo?.address || branding.address || '';
    const defaultPhone = branding.companyInfo?.phone || branding.phone || '';
    const defaultEmail = branding.companyInfo?.email || branding.email || '';
    const defaultWebsite = branding.companyInfo?.website || branding.website || '';

    const defaultAgentPhoto = branding.agentInfo?.agentPhoto || '';
    const defaultAgentName = branding.agentInfo?.agentName || verification.fullName || 'Michael Chang';
    const defaultDesignation = branding.agentInfo?.designation || verification.designation || 'Senior Property Consultant';
    const defaultReraNumber = branding.agentInfo?.reraNumber || verification.licenseNumber || 'CN-123456';
    const defaultMobile = branding.agentInfo?.mobile || '+971 50 123 4567';
    const defaultAgentEmail = branding.agentInfo?.email || 'michael.chang@abcrealty.ae';

    const defaultShowLogo = branding.reportSettings?.showCompanyLogo ?? true;
    const defaultShowPhoto = branding.reportSettings?.showAgentPhoto ?? true;
    const defaultShowContact = branding.reportSettings?.showAgentContactDetails ?? true;
    const defaultShowRera = branding.reportSettings?.showReraNumber ?? true;
    const defaultShowFooter = branding.reportSettings?.showCompanyFooter ?? true;
    const defaultPowered = branding.reportSettings?.poweredByAcot ?? true;

    const changed = 
      companyInfo.companyLogo !== defaultLogo ||
      companyInfo.companyName !== defaultCompanyName ||
      companyInfo.address !== defaultAddress ||
      companyInfo.phone !== defaultPhone ||
      companyInfo.email !== defaultEmail ||
      companyInfo.website !== defaultWebsite ||
      agentInfo.agentPhoto !== defaultAgentPhoto ||
      agentInfo.agentName !== defaultAgentName ||
      agentInfo.designation !== defaultDesignation ||
      agentInfo.reraNumber !== defaultReraNumber ||
      agentInfo.mobile !== defaultMobile ||
      agentInfo.email !== defaultAgentEmail ||
      reportSettings.showCompanyLogo !== defaultShowLogo ||
      reportSettings.showAgentPhoto !== defaultShowPhoto ||
      reportSettings.showAgentContactDetails !== defaultShowContact ||
      reportSettings.showReraNumber !== defaultShowRera ||
      reportSettings.showCompanyFooter !== defaultShowFooter ||
      reportSettings.poweredByAcot !== defaultPowered;

    setIsDirty(changed);
  }, [companyInfo, agentInfo, reportSettings, branding, verification]);

  // Validations
  const validateForm = (): boolean => {
    const tempErrors: Record<string, string> = {};

    // Section 1: Company Information
    if (!companyInfo.companyLogo) {
      tempErrors.companyLogo = 'Company logo asset is required.';
    }
    if (!companyInfo.companyName.trim()) {
      tempErrors.companyName = 'Company name is required.';
    }
    if (!companyInfo.address.trim()) {
      tempErrors.address = 'Office address is required.';
    }
    if (!companyInfo.phone.trim()) {
      tempErrors.phone = 'Office phone is required.';
    } else if (!/^\+?[0-9\s\-()]{7,20}$/.test(companyInfo.phone)) {
      tempErrors.phone = 'Please provide a valid phone number (e.g., +971 4 123 4567).';
    }
    if (!companyInfo.email.trim()) {
      tempErrors.email = 'Office email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(companyInfo.email)) {
      tempErrors.email = 'Please provide a valid email format.';
    }

    // Section 2: Agent Information
    if (!agentInfo.agentName.trim()) {
      tempErrors.agentName = 'Agent name is required.';
    }
    if (!agentInfo.designation.trim()) {
      tempErrors.designation = 'Designation is required.';
    }
    if (!agentInfo.reraNumber.trim()) {
      tempErrors.reraNumber = 'RERA number is required.';
    }
    if (!agentInfo.mobile.trim()) {
      tempErrors.mobile = 'Mobile number is required.';
    } else if (!/^\+?[0-9\s\-()]{7,20}$/.test(agentInfo.mobile)) {
      tempErrors.mobile = 'Please provide a valid mobile number.';
    }
    if (!agentInfo.email.trim()) {
      tempErrors.agentEmail = 'Agent email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(agentInfo.email)) {
      tempErrors.agentEmail = 'Please provide a valid email format.';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const processFile = (file: File, type: 'logo' | 'photo') => {
    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      triggerToast('Invalid file format. Please upload PNG, JPG, or JPEG.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      triggerToast('File size exceeds 2 MB limit.');
      return;
    }

    if (type === 'logo') {
      setLogoProgress(0);
      const interval = setInterval(() => {
        setLogoProgress((prev) => {
          if (prev === null) return 0;
          if (prev >= 100) {
            clearInterval(interval);
            const reader = new FileReader();
            reader.onloadend = () => {
              setCompanyInfo((prev) => ({ ...prev, companyLogo: reader.result as string }));
              setLogoProgress(null);
              triggerToast('Company logo updated successfully.');
            };
            reader.readAsDataURL(file);
            return 100;
          }
          return prev + 25;
        });
      }, 100);
    } else {
      setPhotoProgress(0);
      const interval = setInterval(() => {
        setPhotoProgress((prev) => {
          if (prev === null) return 0;
          if (prev >= 100) {
            clearInterval(interval);
            const reader = new FileReader();
            reader.onloadend = () => {
              setAgentInfo((prev) => ({ ...prev, agentPhoto: reader.result as string }));
              setPhotoProgress(null);
              triggerToast('Agent photo updated successfully.');
            };
            reader.readAsDataURL(file);
            return 100;
          }
          return prev + 25;
        });
      }, 100);
    }
  };

  const handleLogoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0], 'logo');
    }
  };

  const handlePhotoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0], 'photo');
    }
  };

  // Submit action
  const handleSaveBranding = async () => {
    // Touch all fields to show any validation warnings
    const allTouched: Record<string, boolean> = {};
    Object.keys(companyInfo).forEach(k => allTouched[k] = true);
    Object.keys(agentInfo).forEach(k => allTouched[`agent_${k}`] = true);
    setTouched(allTouched);

    if (!validateForm()) {
      triggerToast('Please correct the validation errors before saving.');
      return;
    }

    setIsSaving(true);
    
    // Create modern nested branding structure + retain root fields for full compatibility
    const updated: CompanyBranding = {
      // Legacy root fields
      companyName: companyInfo.companyName,
      companyLogo: companyInfo.companyLogo,
      primaryColor: branding.primaryColor || '#4f46e5',
      address: companyInfo.address,
      phone: companyInfo.phone,
      email: companyInfo.email,
      website: companyInfo.website || '',
      digitalSignature: agentInfo.agentName,

      // Modern nested models
      companyInfo,
      agentInfo,
      reportSettings,
      createdAt: branding.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      verifiedAgentId: branding.verifiedAgentId || 'agent_michael_chang',
      brokerageId: branding.brokerageId || 'brokerage_abc_realty'
    };

    // Simulate API PUT request via prepared backend endpoint
    try {
      const response = await AgentService.putBrandingAPI(updated);
      if (response.status === 200) {
        setTimeout(() => {
          onBrandingSave(response.data);
          setIsSaving(false);
          triggerToast('Company branding configuration persisted successfully!');
        }, 800);
      }
    } catch {
      setIsSaving(false);
      triggerToast('Backend storage failure. Please try again.');
    }
  };

  const handleResetToDefault = async () => {
    if (window.confirm('Are you sure you want to restore the default branding configuration? This will clear your custom changes.')) {
      try {
        const response = await AgentService.deleteBrandingAPI();
        if (response.status === 200) {
          const freshDefault = AgentService.getBranding();
          setCompanyInfo({
            companyLogo: freshDefault.companyInfo.companyLogo,
            companyName: freshDefault.companyInfo.companyName,
            address: freshDefault.companyInfo.address,
            phone: freshDefault.companyInfo.phone,
            email: freshDefault.companyInfo.email,
            website: freshDefault.companyInfo.website || ''
          });
          setAgentInfo({
            agentPhoto: freshDefault.agentInfo.agentPhoto,
            agentName: freshDefault.agentInfo.agentName,
            designation: freshDefault.agentInfo.designation,
            reraNumber: freshDefault.agentInfo.reraNumber,
            mobile: freshDefault.agentInfo.mobile,
            email: freshDefault.agentInfo.email
          });
          setReportSettings({
            showCompanyLogo: freshDefault.reportSettings.showCompanyLogo,
            showAgentPhoto: freshDefault.reportSettings.showAgentPhoto,
            showAgentContactDetails: freshDefault.reportSettings.showAgentContactDetails,
            showReraNumber: freshDefault.reportSettings.showReraNumber,
            showCompanyFooter: freshDefault.reportSettings.showCompanyFooter,
            poweredByAcot: freshDefault.reportSettings.poweredByAcot
          });
          setErrors({});
          setTouched({});
          onBrandingSave(freshDefault);
          triggerToast('Branding configuration restored to default parameters.');
        }
      } catch {
        triggerToast('Failed to reset. Please reload.');
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header block */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 id="company-branding-title" className="text-2xl font-extrabold text-slate-900 tracking-tight">Company Branding</h1>
          <p className="text-sm text-slate-500 leading-relaxed mt-1">
            Configure your company and agent details that will appear on all your reports and client documents.
          </p>
        </div>
        
        {/* Unsaved changes indicator */}
        {isDirty && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-amber-50 border border-amber-100 rounded-full text-amber-800 text-xs font-bold animate-pulse">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Unsaved Changes Detected</span>
          </div>
        )}
      </div>

      {/* Main Form Fields Container - Split layout structure */}
      <div className="grid grid-cols-1 xl:grid-cols-1 gap-6 items-start">
        
        {/* SECTION 1: COMPANY INFORMATION CARD */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center font-black text-xs font-mono shadow-xs">
              1
            </div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Company Information</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Logo upload field (Column span 4) */}
            <div className="lg:col-span-4 space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Company Logo</label>
              
              <div 
                onDragOver={handleDragOver}
                onDrop={handleLogoDrop}
                onClick={() => logoInputRef.current?.click()}
                className={`group min-h-[160px] max-h-[160px] bg-slate-50 border border-dashed rounded-xl flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all ${
                  errors.companyLogo && touched.companyName ? 'border-rose-300 hover:border-rose-400 bg-rose-50/10' : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50/80'
                }`}
              >
                <input 
                  type="file" 
                  ref={logoInputRef}
                  onChange={(e) => e.target.files && processFile(e.target.files[0], 'logo')}
                  accept=".png, .jpg, .jpeg"
                  className="hidden" 
                />

                {logoProgress !== null ? (
                  <div className="space-y-2 w-full max-w-[140px]">
                    <div className="text-xs font-extrabold text-indigo-600 font-mono">{logoProgress}%</div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-1.5 rounded-full transition-all duration-150" style={{ width: `${logoProgress}%` }}></div>
                    </div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Uploading Logo...</span>
                  </div>
                ) : companyInfo.companyLogo ? (
                  <div className="relative group/logo flex items-center justify-center w-full h-full">
                    <img 
                      src={companyInfo.companyLogo} 
                      alt="Company Logo Preview" 
                      className="max-h-[120px] max-w-full object-contain rounded-lg p-1"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/logo:opacity-100 flex items-center justify-center rounded-lg transition-all gap-2">
                      <button 
                        type="button" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setCompanyInfo(prev => ({ ...prev, companyLogo: '' }));
                        }}
                        className="p-1.5 bg-white text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
                        title="Remove Logo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 flex flex-col items-center">
                    <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-100">
                      <LogoPlaceholderSVG />
                    </div>
                    <span className="text-xs font-black text-indigo-600 hover:text-indigo-700 transition-colors block">Upload Logo</span>
                  </div>
                )}
              </div>
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                PNG, JPG up to 2MB. Recommended 500x200px
              </p>
              {errors.companyLogo && touched.companyName && (
                <p className="text-[10px] text-rose-600 font-bold flex items-center gap-1.5 mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.companyLogo}</span>
                </p>
              )}
            </div>

            {/* Form Fields (Column span 8) */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Company Name */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <span>Company Name</span>
                  <span className="text-rose-500 font-black">*</span>
                </label>
                <input 
                  type="text"
                  required
                  placeholder="e.g., ABC Realty"
                  value={companyInfo.companyName}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, companyName: e.target.value })}
                  onBlur={() => setTouched({ ...touched, companyName: true })}
                  className={`w-full bg-slate-50/50 border focus:bg-white rounded-xl py-2.5 px-3.5 text-xs font-medium text-slate-800 transition-all outline-none ${
                    errors.companyName && touched.companyName ? 'border-rose-300 focus:border-rose-500 bg-rose-50/5' : 'border-slate-200 focus:border-indigo-500'
                  }`}
                />
                {errors.companyName && touched.companyName && (
                  <p className="text-[10px] text-rose-600 font-bold flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.companyName}</span>
                  </p>
                )}
              </div>

              {/* Office Address */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <span>Office Address</span>
                  <span className="text-rose-500 font-black">*</span>
                </label>
                <input 
                  type="text"
                  required
                  placeholder="e.g., Office 1203, Marina Plaza, Dubai Marina, Dubai, UAE"
                  value={companyInfo.address}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
                  onBlur={() => setTouched({ ...touched, address: true })}
                  className={`w-full bg-slate-50/50 border focus:bg-white rounded-xl py-2.5 px-3.5 text-xs font-medium text-slate-800 transition-all outline-none ${
                    errors.address && touched.address ? 'border-rose-300 focus:border-rose-500 bg-rose-50/5' : 'border-slate-200 focus:border-indigo-500'
                  }`}
                />
                {errors.address && touched.address && (
                  <p className="text-[10px] text-rose-600 font-bold flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.address}</span>
                  </p>
                )}
              </div>

              {/* Office Phone (UAE) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <span>Office Phone</span>
                  <span className="text-rose-500 font-black">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 flex items-center gap-1.5 text-xs font-bold text-slate-500 pr-2.5 border-r border-slate-200">
                    <UaeFlag />
                    <span className="text-slate-400 font-mono text-[10px]">+971</span>
                  </div>
                  <input 
                    type="text"
                    required
                    placeholder="4 123 4567"
                    value={companyInfo.phone.replace(/^\+971\s*/, '')}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, phone: `+971 ${e.target.value.trim()}` })}
                    onBlur={() => setTouched({ ...touched, phone: true })}
                    className={`w-full bg-slate-50/50 border focus:bg-white rounded-xl py-2.5 pl-24 pr-3.5 text-xs font-mono text-slate-800 transition-all outline-none ${
                      errors.phone && touched.phone ? 'border-rose-300 focus:border-rose-500 bg-rose-50/5' : 'border-slate-200 focus:border-indigo-500'
                    }`}
                  />
                </div>
                {errors.phone && touched.phone && (
                  <p className="text-[10px] text-rose-600 font-bold flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.phone}</span>
                  </p>
                )}
              </div>

              {/* Office Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <span>Office Email</span>
                  <span className="text-rose-500 font-black">*</span>
                </label>
                <input 
                  type="email"
                  required
                  placeholder="e.g., info@abcrealty.ae"
                  value={companyInfo.email}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value })}
                  onBlur={() => setTouched({ ...touched, email: true })}
                  className={`w-full bg-slate-50/50 border focus:bg-white rounded-xl py-2.5 px-3.5 text-xs font-medium text-slate-800 transition-all outline-none ${
                    errors.email && touched.email ? 'border-rose-300 focus:border-rose-500 bg-rose-50/5' : 'border-slate-200 focus:border-indigo-500'
                  }`}
                />
                {errors.email && touched.email && (
                  <p className="text-[10px] text-rose-600 font-bold flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              {/* Website */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-700">Website (Optional)</label>
                <input 
                  type="text"
                  placeholder="e.g., www.abcrealty.ae"
                  value={companyInfo.website}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, website: e.target.value })}
                  className="w-full bg-slate-50/50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl py-2.5 px-3.5 text-xs font-medium text-slate-800 transition-all outline-none"
                />
              </div>

            </div>
          </div>
        </div>

        {/* SECTION 2: AGENT INFORMATION CARD */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center font-black text-xs font-mono shadow-xs">
              2
            </div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Agent Information</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Agent photo upload field (Column span 4) */}
            <div className="lg:col-span-4 space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Agent Photo</label>
              
              <div 
                onDragOver={handleDragOver}
                onDrop={handlePhotoDrop}
                onClick={() => photoInputRef.current?.click()}
                className={`group min-h-[160px] max-h-[160px] bg-slate-50 border border-dashed rounded-xl flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all border-slate-200 hover:border-indigo-400 hover:bg-slate-50/80`}
              >
                <input 
                  type="file" 
                  ref={photoInputRef}
                  onChange={(e) => e.target.files && processFile(e.target.files[0], 'photo')}
                  accept=".png, .jpg, .jpeg"
                  className="hidden" 
                />

                {photoProgress !== null ? (
                  <div className="space-y-2 w-full max-w-[140px]">
                    <div className="text-xs font-extrabold text-indigo-600 font-mono">{photoProgress}%</div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-1.5 rounded-full transition-all duration-150" style={{ width: `${photoProgress}%` }}></div>
                    </div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Uploading Photo...</span>
                  </div>
                ) : agentInfo.agentPhoto ? (
                  <div className="relative group/photo flex items-center justify-center w-full h-full">
                    <img 
                      src={agentInfo.agentPhoto} 
                      alt="Agent Photo Preview" 
                      className="max-h-[130px] max-w-full rounded-xl object-cover p-0.5"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/photo:opacity-100 flex items-center justify-center rounded-xl transition-all gap-2">
                      <button 
                        type="button" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setAgentInfo(prev => ({ ...prev, agentPhoto: '' }));
                        }}
                        className="p-1.5 bg-white text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
                        title="Remove Photo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 flex flex-col items-center">
                    <div className="p-3 bg-white rounded-full shadow-xs border border-slate-100">
                      <AgentPlaceholderSVG />
                    </div>
                    <span className="text-xs font-black text-indigo-600 hover:text-indigo-700 transition-colors block">Upload Photo</span>
                  </div>
                )}
              </div>
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                JPG, PNG up to 2MB
              </p>
            </div>

            {/* Form Fields (Column span 8) */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Agent Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <span>Agent Name</span>
                  <span className="text-rose-500 font-black">*</span>
                </label>
                <input 
                  type="text"
                  required
                  placeholder="e.g., Michael Chang"
                  value={agentInfo.agentName}
                  onChange={(e) => setAgentInfo({ ...agentInfo, agentName: e.target.value })}
                  onBlur={() => setTouched({ ...touched, agent_agentName: true })}
                  className={`w-full bg-slate-50/50 border focus:bg-white rounded-xl py-2.5 px-3.5 text-xs font-medium text-slate-800 transition-all outline-none ${
                    errors.agentName && touched.agent_agentName ? 'border-rose-300 focus:border-rose-500 bg-rose-50/5' : 'border-slate-200 focus:border-indigo-500'
                  }`}
                />
                {errors.agentName && touched.agent_agentName && (
                  <p className="text-[10px] text-rose-600 font-bold flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.agentName}</span>
                  </p>
                )}
              </div>

              {/* Designation */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <span>Designation</span>
                  <span className="text-rose-500 font-black">*</span>
                </label>
                <input 
                  type="text"
                  required
                  placeholder="e.g., Senior Property Consultant"
                  value={agentInfo.designation}
                  onChange={(e) => setAgentInfo({ ...agentInfo, designation: e.target.value })}
                  onBlur={() => setTouched({ ...touched, agent_designation: true })}
                  className={`w-full bg-slate-50/50 border focus:bg-white rounded-xl py-2.5 px-3.5 text-xs font-medium text-slate-800 transition-all outline-none ${
                    errors.designation && touched.agent_designation ? 'border-rose-300 focus:border-rose-500 bg-rose-50/5' : 'border-slate-200 focus:border-indigo-500'
                  }`}
                />
                {errors.designation && touched.agent_designation && (
                  <p className="text-[10px] text-rose-600 font-bold flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.designation}</span>
                  </p>
                )}
              </div>

              {/* RERA Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <span>RERA Number</span>
                  <span className="text-rose-500 font-black">*</span>
                </label>
                <input 
                  type="text"
                  required
                  placeholder="e.g., CN-123456"
                  value={agentInfo.reraNumber}
                  onChange={(e) => setAgentInfo({ ...agentInfo, reraNumber: e.target.value })}
                  onBlur={() => setTouched({ ...touched, agent_reraNumber: true })}
                  className={`w-full bg-slate-50/50 border focus:bg-white rounded-xl py-2.5 px-3.5 text-xs font-mono text-slate-800 transition-all outline-none ${
                    errors.reraNumber && touched.agent_reraNumber ? 'border-rose-300 focus:border-rose-500 bg-rose-50/5' : 'border-slate-200 focus:border-indigo-500'
                  }`}
                />
                {errors.reraNumber && touched.agent_reraNumber && (
                  <p className="text-[10px] text-rose-600 font-bold flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.reraNumber}</span>
                  </p>
                )}
              </div>

              {/* Mobile Number (UAE) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <span>Mobile Number</span>
                  <span className="text-rose-500 font-black">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 flex items-center gap-1.5 text-xs font-bold text-slate-500 pr-2.5 border-r border-slate-200">
                    <UaeFlag />
                    <span className="text-slate-400 font-mono text-[10px]">+971</span>
                  </div>
                  <input 
                    type="text"
                    required
                    placeholder="50 123 4567"
                    value={agentInfo.mobile.replace(/^\+971\s*/, '')}
                    onChange={(e) => setAgentInfo({ ...agentInfo, mobile: `+971 ${e.target.value.trim()}` })}
                    onBlur={() => setTouched({ ...touched, agent_mobile: true })}
                    className={`w-full bg-slate-50/50 border focus:bg-white rounded-xl py-2.5 pl-24 pr-3.5 text-xs font-mono text-slate-800 transition-all outline-none ${
                      errors.mobile && touched.agent_mobile ? 'border-rose-300 focus:border-rose-500 bg-rose-50/5' : 'border-slate-200 focus:border-indigo-500'
                    }`}
                  />
                </div>
                {errors.mobile && touched.agent_mobile && (
                  <p className="text-[10px] text-rose-600 font-bold flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.mobile}</span>
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <span>Email</span>
                  <span className="text-rose-500 font-black">*</span>
                </label>
                <input 
                  type="email"
                  required
                  placeholder="e.g., michael.chang@abcrealty.ae"
                  value={agentInfo.email}
                  onChange={(e) => setAgentInfo({ ...agentInfo, email: e.target.value })}
                  onBlur={() => setTouched({ ...touched, agent_email: true })}
                  className={`w-full bg-slate-50/50 border focus:bg-white rounded-xl py-2.5 px-3.5 text-xs font-medium text-slate-800 transition-all outline-none ${
                    errors.agentEmail && touched.agent_email ? 'border-rose-300 focus:border-rose-500 bg-rose-50/5' : 'border-slate-200 focus:border-indigo-500'
                  }`}
                />
                {errors.agentEmail && touched.agent_email && (
                  <p className="text-[10px] text-rose-600 font-bold flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.agentEmail}</span>
                  </p>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* SECTION 3: REPORT SETTINGS CARD */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center font-black text-xs font-mono shadow-xs">
              3
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Report Settings</h2>
              <p className="text-[10px] text-slate-400 font-medium">Choose what information to include in your reports.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
            
            {/* Show Company Logo */}
            <div className="flex items-center justify-between py-1">
              <span className="text-xs font-bold text-slate-700">Show Company Logo</span>
              <button 
                type="button"
                onClick={() => setReportSettings({ ...reportSettings, showCompanyLogo: !reportSettings.showCompanyLogo })}
                className={`relative inline-flex h-5.5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  reportSettings.showCompanyLogo ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
              >
                <span className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                  reportSettings.showCompanyLogo ? 'translate-x-4.5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Show RERA Number */}
            <div className="flex items-center justify-between py-1">
              <span className="text-xs font-bold text-slate-700">Show RERA Number</span>
              <button 
                type="button"
                onClick={() => setReportSettings({ ...reportSettings, showReraNumber: !reportSettings.showReraNumber })}
                className={`relative inline-flex h-5.5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  reportSettings.showReraNumber ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
              >
                <span className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                  reportSettings.showReraNumber ? 'translate-x-4.5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Show Agent Photo */}
            <div className="flex items-center justify-between py-1">
              <span className="text-xs font-bold text-slate-700">Show Agent Photo</span>
              <button 
                type="button"
                onClick={() => setReportSettings({ ...reportSettings, showAgentPhoto: !reportSettings.showAgentPhoto })}
                className={`relative inline-flex h-5.5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  reportSettings.showAgentPhoto ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
              >
                <span className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                  reportSettings.showAgentPhoto ? 'translate-x-4.5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Show Company Footer */}
            <div className="flex items-center justify-between py-1">
              <span className="text-xs font-bold text-slate-700">Show Company Footer</span>
              <button 
                type="button"
                onClick={() => setReportSettings({ ...reportSettings, showCompanyFooter: !reportSettings.showCompanyFooter })}
                className={`relative inline-flex h-5.5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  reportSettings.showCompanyFooter ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
              >
                <span className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                  reportSettings.showCompanyFooter ? 'translate-x-4.5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Show Agent Contact Details */}
            <div className="flex items-center justify-between py-1">
              <span className="text-xs font-bold text-slate-700">Show Agent Contact Details</span>
              <button 
                type="button"
                onClick={() => setReportSettings({ ...reportSettings, showAgentContactDetails: !reportSettings.showAgentContactDetails })}
                className={`relative inline-flex h-5.5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  reportSettings.showAgentContactDetails ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
              >
                <span className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                  reportSettings.showAgentContactDetails ? 'translate-x-4.5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Powered by ACOT */}
            <div className="flex items-center justify-between py-1">
              <span className="text-xs font-bold text-slate-700">Powered by ACOT</span>
              <button 
                type="button"
                onClick={() => setReportSettings({ ...reportSettings, poweredByAcot: !reportSettings.poweredByAcot })}
                className={`relative inline-flex h-5.5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  reportSettings.poweredByAcot ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
              >
                <span className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                  reportSettings.poweredByAcot ? 'translate-x-4.5' : 'translate-x-0'
                }`} />
              </button>
            </div>

          </div>
        </div>

        {/* BOTTOM ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="w-full sm:w-auto px-5 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset to Default</span>
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={handleSaveBranding}
            className="w-full sm:w-auto px-10 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 min-w-[180px]"
          >
            {isSaving ? (
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
            ) : (
              <Check className="w-4 h-4" />
            )}
            <span>Save Branding</span>
          </button>
        </div>

      </div>
    </div>
  );
}
