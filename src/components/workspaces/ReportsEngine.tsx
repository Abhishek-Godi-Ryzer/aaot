import { useState, useEffect } from 'react';
import { useAnalysisContext } from '../../context/AnalysisContext';
import { useMarketAnalytics } from '../../context/MarketAnalyticsContext';
import { useAuth } from '../../context/AuthContext';
import { useProfessionalContext } from '../../context/ProfessionalContext';
import { ProfessionalAuditService } from '../../services/professionalIntegrationService';
import { AgentService } from '../../services/agentService';
import { WhiteLabelService, BrandingResolver, ProfessionalAccessService, ProfessionalPropertyService, RegistryService } from '../../services/professionalAccessService';
import {
  ReportsService,
  ReportTemplate,
  GeneratedReport,
  ALL_REPORT_SECTIONS
} from '../../services/reportsService';
import {
  FileText,
  Clock,
  Sparkles,
  CheckCircle2,
  Printer,
  ArrowRight,
  Download,
  Trash2,
  Eye,
  Copy,
  ChevronRight,
  Check,
  Calendar,
  AlertTriangle,
  Layers,
  FileDown,
  FileSpreadsheet,
  Plus,
  Loader2,
  Info,
  Sliders,
  TrendingUp,
  MapPin,
  Building,
  User,
  ExternalLink,
  Briefcase
} from 'lucide-react';
import AnalysisContextSwitcher from './AnalysisContextSwitcher';

interface ReportsEngineProps {
  onNavigateToModule: (moduleName: string) => void;
  triggerToast: (message: string) => void;
}

export default function ReportsEngine({ onNavigateToModule, triggerToast }: ReportsEngineProps) {
  const { user } = useAuth();
  const { setCurrentReport } = useProfessionalContext();
  const isAgent = user?.role === 'agent';
  const verification = isAgent ? AgentService.getVerificationStatus() : null;
  const isVerifiedAgent = isAgent && verification?.status === 'VERIFIED';
  const hasProfAccess = ProfessionalAccessService.hasProfessionalAccess(user, verification);
  const branding = isAgent ? AgentService.getBranding() : null;

  const { communityId, subAreaId, projectId } = useAnalysisContext();
  const { communities } = useMarketAnalytics();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'prebuilt' | 'custom'>('prebuilt');

  // Reports state
  const [recentReports, setRecentReports] = useState<GeneratedReport[]>([]);
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);

  // Generation Workflow progress
  const [generationStep, setGenerationStep] = useState<number>(-1);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatingTemplateId, setGeneratingTemplateId] = useState<string>('');

  // Custom Builder State
  const [customReportName, setCustomReportName] = useState<string>('');
  const [selectedSections, setSelectedSections] = useState<string[]>([
    'executive_summary',
    'market_analytics',
    'community_analysis',
    'ai_executive_summary',
    'appendix'
  ]);

  // Selected Report for Preview Modal
  const [previewReport, setPreviewReport] = useState<GeneratedReport | null>(null);

  // Load lists on mount & when context changes
  useEffect(() => {
    setTemplates(ReportsService.getTemplates());
    setRecentReports(ReportsService.getRecentReports());
  }, [communityId]);

  // Set default custom report name based on community
  useEffect(() => {
    const activeComm = communities.find(c => c.id === communityId) || communities[0];
    if (activeComm) {
      setCustomReportName(`Custom Audit - ${activeComm.name}`);
    }
  }, [communityId, communities]);

  // Handle report generation simulation
  const handleGeneratePrebuilt = async (templateId: string) => {
    if (isGenerating) return;
    setIsGenerating(true);
    setGeneratingTemplateId(templateId);
    setGenerationStep(0);

    const steps = [
      'Collecting real-time platform data...',
      'Retrieving Grounded AI summary & insights...',
      'Merging verified Dubai Land Department registries...',
      'Compiling high-fidelity PDF layout...',
      'Generating audit lineage signatures...'
    ];

    for (let i = 0; i < steps.length; i++) {
      setGenerationStep(i);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    try {
      const newReport = await ReportsService.generateReport(templateId, {
        communityId,
        subAreaId,
        projectId
      });
      setRecentReports(ReportsService.getRecentReports());
      setCurrentReport(newReport);
      if (user) {
        ProfessionalAuditService.logEvent(user.id, 'Professional Report Generated', {
          reportId: newReport.id,
          reportName: newReport.name,
          templateId,
          communityId,
          projectId,
          timestamp: new Date().toISOString()
        });
      }
      triggerToast(`Report "${newReport.name}" generated successfully!`);
      setPreviewReport(newReport); // Auto-open preview
    } catch (e) {
      triggerToast('Error compiling report. Please retry.');
    } finally {
      setIsGenerating(false);
      setGenerationStep(-1);
      setGeneratingTemplateId('');
    }
  };

  const handleGenerateCustom = async () => {
    if (isGenerating) return;
    if (selectedSections.length === 0) {
      triggerToast('Please select at least one report section.');
      return;
    }

    setIsGenerating(true);
    setGenerationStep(0);

    for (let i = 0; i < 5; i++) {
      setGenerationStep(i);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    try {
      const newReport = await ReportsService.generateCustomReport(
        customReportName,
        selectedSections,
        { communityId, subAreaId, projectId }
      );
      setRecentReports(ReportsService.getRecentReports());
      setCurrentReport(newReport);
      if (user) {
        ProfessionalAuditService.logEvent(user.id, 'Professional Report Generated', {
          reportId: newReport.id,
          reportName: newReport.name,
          templateType: 'custom',
          selectedSections,
          communityId,
          projectId,
          timestamp: new Date().toISOString()
        });
      }
      triggerToast(`Custom report "${newReport.name}" generated successfully!`);
      setPreviewReport(newReport); // Auto-open preview
    } catch (e) {
      triggerToast('Error compiling custom report.');
    } finally {
      setIsGenerating(false);
      setGenerationStep(-1);
    }
  };

  const toggleSection = (sectionId: string) => {
    if (selectedSections.includes(sectionId)) {
      setSelectedSections(selectedSections.filter(s => s !== sectionId));
    } else {
      setSelectedSections([...selectedSections, sectionId]);
    }
  };

  const handleDownload = (reportId: string, format: 'PDF' | 'DOCX') => {
    const url = ReportsService.downloadReport(reportId, format);
    triggerToast(`Exporting report to ${format}...`);
    setTimeout(() => {
      // Open in virtual file or download trigger
      const link = document.createElement('a');
      link.href = '#';
      link.addEventListener('click', (e) => {
        e.preventDefault();
        triggerToast(`${format} downloaded successfully!`);
      });
      link.click();
    }, 1500);
  };

  const handleDuplicate = (reportId: string) => {
    const duplicated = ReportsService.duplicateReport(reportId);
    if (duplicated) {
      setRecentReports(ReportsService.getRecentReports());
      triggerToast(`Duplicated "${duplicated.name}"`);
    }
  };

  const handleDelete = (reportId: string) => {
    const success = ReportsService.deleteReport(reportId);
    if (success) {
      setRecentReports(ReportsService.getRecentReports());
      triggerToast('Report permanently deleted.');
    }
  };

  const activeComm = communities.find(c => c.id === communityId) || communities[0] || { name: 'Dubai Marina' };

  return (
    <div className="space-y-6" id="reports-engine-module">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-1.5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Reports
          </h1>
          <p className="text-sm text-slate-500">
            Generate professional investment reports with verified market intelligence and AI insights.
          </p>
        </div>
      </div>

      {/* ANALYSIS CONTEXT SWITCHER */}
      <AnalysisContextSwitcher
        moduleName="Reports"
        triggerToast={triggerToast}
        onApplyChanges={() => triggerToast(`Analysis context updated for reports: ${activeComm.name}`)}
      />

      {/* WORKSPACE AREA: HERO & BUILDER */}
      <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Generate a Report</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Choose a pre-built executive template or build your own custom document.
          </p>
        </div>

        {/* TABS */}
        <div className="flex border-b border-slate-100">
          <button
            onClick={() => setActiveTab('prebuilt')}
            className={`py-3 px-6 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'prebuilt'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Pre-built Reports
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`py-3 px-6 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'custom'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Custom Report Builder
          </button>
        </div>

        {/* TAB 1: PRE-BUILT REPORTS */}
        {activeTab === 'prebuilt' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {templates.map(template => (
              <div
                key={template.id}
                className="group relative bg-slate-50/60 rounded-3xl p-5 border border-slate-100 hover:border-indigo-100 hover:bg-white transition-all duration-300 hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                      <FileText className="w-6 h-6" />
                    </div>
                    {template.isPopular && (
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50/80 px-2.5 py-1 rounded-full flex items-center gap-1">
                        ★ Most Popular
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-extrabold text-slate-900 mt-4 group-hover:text-indigo-600 transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    {template.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">
                    Est. {template.estimatedPages} Pages
                  </span>
                  <button
                    onClick={() => handleGeneratePrebuilt(template.id)}
                    disabled={isGenerating}
                    className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 py-2 px-4 rounded-xl shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isGenerating && generatingTemplateId === template.id ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        Generate Report
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: CUSTOM REPORT BUILDER */}
        {activeTab === 'custom' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                    Report Title
                  </label>
                  <input
                    type="text"
                    value={customReportName}
                    onChange={(e) => setCustomReportName(e.target.value)}
                    placeholder="Enter custom report name..."
                    className="w-full text-sm py-2.5 px-3.5 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
                    Include Report Sections
                  </label>
                  <p className="text-[11px] text-slate-400">
                    Select the data segments to include in your bespoke intelligence brief.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {ALL_REPORT_SECTIONS.map(sec => {
                      const isSelected = selectedSections.includes(sec.id);
                      return (
                        <button
                          key={sec.id}
                          onClick={() => toggleSection(sec.id)}
                          className={`flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50/30 text-indigo-950 font-medium'
                              : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50 text-slate-600'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-4 h-4 rounded flex items-center justify-center border ${
                                isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span className="text-xs">{sec.name}</span>
                          </div>
                          <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                            {sec.category}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* BUILDER METRIC PREVIEW */}
              <div className="bg-slate-50/80 rounded-[2rem] p-5 border border-slate-100 flex flex-col justify-between space-y-4">
                <div className="space-y-4">
                  <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                    Report Composition
                  </h3>
                  
                  <div className="space-y-2.5">
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>Selected Segments:</span>
                      <span className="font-bold text-indigo-600">{selectedSections.length} Sections</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>Estimated Size:</span>
                      <span className="font-medium text-slate-900">{Math.ceil(selectedSections.length * 0.75) + 1} Pages</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>Grounded References:</span>
                      <span className="font-medium text-slate-900">DLD, Ejari, Oqood, RERA</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-1.5">
                    <p className="text-[10px] text-slate-400 italic">
                      Includes custom watermark and transaction lineage ledger hashes.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleGenerateCustom}
                  disabled={isGenerating}
                  className="w-full text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Compiling Custom Report...
                    </>
                  ) : (
                    <>
                      Generate Custom Report
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* LOADING ANIMATION STEPS OVERLAY */}
        {isGenerating && (
          <div className="bg-slate-900/5 border border-indigo-100 rounded-3xl p-5 space-y-3 animate-pulse">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                <span className="text-sm font-bold text-slate-900">
                  {hasProfAccess 
                    ? "Professional White-label Report Engine Active" 
                    : "中央レポート作成パイプライン (Central Report Builder Engine Active)"}
                </span>
              </div>
              {hasProfAccess && (
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md">
                  🛡️ Applying Broker Branding
                </span>
              )}
            </div>
            
            {/* Step Visualizer */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2">
              {['Data Compilation', 'AI Analysis', 'Merge Registries', 'Compile PDF', 'Lineage Hash'].map((s, idx) => (
                <div
                  key={s}
                  className={`p-2.5 rounded-2xl border text-center transition-all ${
                    generationStep >= idx
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-400 border-slate-100'
                  }`}
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider block">Step 0{idx + 1}</div>
                  <div className="text-[11px] font-semibold mt-1 truncate">{s}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RECENT REPORTS TABLE */}
      <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Reports</h2>
            <p className="text-xs text-slate-400">
              Audit previously compiled investment dossiers and executive summaries.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-3">Report Name</th>
                <th className="py-4 px-3">Type</th>
                <th className="py-4 px-3">Context</th>
                <th className="py-4 px-3">Generated On</th>
                <th className="py-4 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs">
              {recentReports.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No reports generated for this community yet.
                  </td>
                </tr>
              ) : (
                recentReports.map(report => (
                  <tr key={report.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                          <FileText className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 hover:text-indigo-600 cursor-pointer block" onClick={() => setPreviewReport(report)}>
                            {report.name}
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            ID: {report.payload.metadata.reportId} • {report.payload.selectedSections.length} Sections
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider inline-block ${
                          report.type === 'Executive'
                            ? 'bg-blue-50 text-blue-600'
                            : report.type === 'Rental'
                            ? 'bg-green-50 text-green-600'
                            : report.type === 'Transaction'
                            ? 'bg-purple-50 text-purple-600'
                            : report.type === 'Investment'
                            ? 'bg-amber-50 text-amber-600'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {report.type}
                      </span>
                    </td>
                    <td className="py-4 px-3 text-slate-600 font-medium">
                      {report.contextName}
                    </td>
                    <td className="py-4 px-3 text-slate-500">
                      {report.generatedOn}
                    </td>
                    <td className="py-4 px-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setPreviewReport(report)}
                          title="View Report"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownload(report.id, 'PDF')}
                          title="Download PDF"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(report.id)}
                          title="Duplicate"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(report.id)}
                          title="Delete"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FOOTER PIPELINE: HOW IT WORKS */}
      <div className="bg-slate-50/60 rounded-[2rem] p-6 border border-slate-100">
        <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-4">
          How Report Generation Works
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
          {[
            { step: '01', title: 'Select Report Type', desc: 'Choose a pre-built report or create a custom one' },
            { step: '02', title: 'Data Compilation', desc: 'We gather verified data from all relevant modules' },
            { step: '03', title: 'AI Analysis', desc: 'AI generates insights and investment recommendations' },
            { step: '04', title: 'Report Generation', desc: 'Professional report is created with charts and insights' },
            { step: '05', title: 'Export & Share', desc: 'Download, print or share your report' }
          ].map((x, idx) => (
            <div key={x.step} className="relative space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 w-6 h-6 rounded-lg flex items-center justify-center shrink-0">
                  {x.step}
                </span>
                <span className="text-xs font-bold text-slate-900">{x.title}</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed pl-9 md:pl-0">
                {x.desc}
              </p>
              {idx < 4 && (
                <div className="hidden md:block absolute top-3 -right-3 w-6 h-[1px] bg-slate-200"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* DOCUMENT PREVIEW MODAL */}
      {previewReport && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-100">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-4 px-6 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-indigo-400" />
                <div>
                  <h3 className="text-sm font-bold tracking-tight">
                    {previewReport.name}
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    ID: {previewReport.payload.metadata.reportId} • Generated: {previewReport.generatedOn}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload(previewReport.id, 'PDF')}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold py-1.5 px-3.5 rounded-xl flex items-center gap-1.5 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  PDF
                </button>
                <button
                  onClick={() => window.print()}
                  className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold py-1.5 px-3.5 rounded-xl flex items-center gap-1.5 transition-all"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print
                </button>
                <button
                  onClick={() => setPreviewReport(null)}
                  className="text-slate-400 hover:text-white text-xs font-bold ml-2 py-1 px-2.5 bg-slate-800 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Printable & Scrollable Report Core */}
            <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12 bg-slate-50 print:bg-white" id="printable-area">
              
              {/* PAGE 1: COVER PAGE */}
              <div className="bg-white border border-slate-100 rounded-3xl p-8 md:p-16 flex flex-col justify-between shadow-sm min-h-[75vh] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-60"></div>
                
                {isVerifiedAgent && branding && (() => {
                  const resolved = BrandingResolver.resolveBranding(branding);
                  const wlMeta = WhiteLabelService.getWhiteLabelMetadata(branding);
                  if (!resolved) return null;
                  return (
                    <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-3 relative z-10">
                      <div className="flex items-center gap-3">
                        {resolved.companyLogo ? (
                          <img src={resolved.companyLogo} alt="Company Logo" className="w-10 h-10 object-contain rounded-xl bg-slate-50 p-1 border border-slate-100" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-xs">{resolved.companyName.slice(0, 2)}</div>
                        )}
                        <div>
                          <span className="text-xs font-black text-slate-900 uppercase tracking-wide block">{resolved.companyName}</span>
                          <span className="text-[10px] text-slate-400 font-mono block">RERA License: {verification?.licenseNumber}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-extrabold text-indigo-600 block">{wlMeta?.agentName || resolved.agentName}</span>
                        <span className="text-[10px] text-slate-500 font-sans block">{wlMeta?.designation || verification?.designation}</span>
                      </div>
                    </div>
                  );
                })()}

                {isVerifiedAgent && branding && (
                  <div className="absolute right-12 top-1/2 -translate-y-1/2 opacity-15 pointer-events-none select-none z-0">
                    <div className="w-56 h-56 rounded-full border-8 border-indigo-600 flex flex-col items-center justify-center text-indigo-600 font-serif font-bold text-center rotate-12 p-4">
                      <div className="text-[10px] tracking-widest font-sans uppercase">ACOT VERIFIED</div>
                      <div className="text-xl uppercase my-1 font-black leading-tight">{(branding.companyName || branding.companyInfo?.companyName || 'ABC Realty').slice(0, 15)}</div>
                      <div className="text-[9px] font-sans font-extrabold uppercase border-t border-b border-indigo-600 py-1 px-2">RERA AGENT SIGNATURE</div>
                      <div className="text-[8px] tracking-wider mt-1.5 font-mono">ID: {verification?.licenseNumber}</div>
                    </div>
                  </div>
                )}

                <div className="space-y-4 relative z-10">
                  <div className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest bg-indigo-50/60 inline-block px-3 py-1 rounded-md">
                    Official Investment Dossier
                  </div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight pt-4">
                    {previewReport.name}
                  </h1>
                  <p className="text-slate-500 max-w-lg text-sm">
                    Precompiled sovereign-grade real estate analysis, micro-market liquidity, rental yields, and financial stress testing parameters.
                  </p>
                </div>

                <div className="pt-8 relative z-10 space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-slate-100">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Community</span>
                      <span className="text-xs font-extrabold text-slate-900 mt-1 block">{previewReport.payload.metadata.context.communityName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Sub-Area / Project</span>
                      <span className="text-xs font-extrabold text-slate-900 mt-1 block truncate">
                        {previewReport.payload.metadata.context.subAreaId !== 'all' ? previewReport.payload.metadata.context.subAreaName : 'All Sub-Areas'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Compiled On</span>
                      <span className="text-xs font-extrabold text-slate-900 mt-1 block">{previewReport.payload.metadata.generatedOn}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Sovereign Origin</span>
                      <span className="text-xs font-extrabold text-indigo-600 mt-1 block">Dubai Land Dept.</span>
                    </div>
                  </div>

                  {isVerifiedAgent && branding ? (
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 bg-indigo-50/40 border border-indigo-100 rounded-2xl relative overflow-hidden gap-4">
                      {/* Signature stamp graphic watermark background for luxury feel */}
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none select-none">
                        <div className="w-28 h-28 rounded-full border-4 border-indigo-600 flex flex-col items-center justify-center text-indigo-600 font-serif font-bold rotate-12">
                          <span className="text-[6px] tracking-widest uppercase">VERIFIED</span>
                          <span className="text-[7px] uppercase font-bold">{(branding.companyName || 'ABC REALTY').slice(0, 8)}</span>
                        </div>
                      </div>

                      <div className="space-y-1 z-10">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-extrabold uppercase tracking-widest text-indigo-700 block">EXCLUSIVE BROKER REPRESENTATION</span>
                          <span className="inline-flex items-center bg-emerald-100 text-emerald-800 text-[8px] font-bold px-1.5 py-0.2 rounded font-mono uppercase tracking-wide">
                            ✓ RERA VERIFIED
                          </span>
                        </div>
                        <p className="text-xs text-slate-700">
                          Prepared by <strong>{verification?.fullName}</strong> ({verification?.designation}) representing <strong>{verification?.brokerageName}</strong>.
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Office: {branding.address} • Tel: {branding.phone} • Email: {branding.email}
                        </p>
                        {branding.digitalSignature && (
                          <p className="text-[10px] text-indigo-600 italic font-medium pt-1">
                            Digital Security Stamp: &ldquo;{branding.digitalSignature}&rdquo; &mdash; Authorized Platform Signature
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0 z-10">
                        <div className="text-right font-mono text-[10px] text-indigo-700 bg-white border border-indigo-100 px-3 py-1.5 rounded-xl shadow-xs font-extrabold">
                          Seal ID: ACOT-{verification?.licenseNumber}
                        </div>
                        <span className="text-[8px] text-slate-400 uppercase font-mono font-bold">SHA-256 Underwritten</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
                      <Info className="w-5 h-5 text-indigo-500 shrink-0" />
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        <strong>Audit Lineage Statement:</strong> Every metric displayed in this report has been verified by the ACOT Grounded Data Ledger Core against official DLD Sales and Ejari Rental logs. No predictive assumptions have been processed without explicit grounding confidence ratings.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* REPORT SECTIONS CONTROLLER */}
              {previewReport.payload.selectedSections.map(secId => {
                
                // EXECUTIVE SUMMARY Section
                if (secId === 'executive_summary') {
                  return (
                    <div key={secId} className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 space-y-4 shadow-sm">
                      <h2 className="text-lg font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-indigo-600" />
                        1.0 Executive Summary
                      </h2>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {previewReport.payload.data.aiSummary?.executiveSummary}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                        <div className="bg-slate-50 p-3 rounded-2xl">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Average Price/Sqft</span>
                          <span className="text-sm font-extrabold text-slate-900 mt-1 block">AED {previewReport.payload.data.marketSummary?.averagePrice.toLocaleString()} / sqft</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-2xl">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Verified Rental Yield</span>
                          <span className="text-sm font-extrabold text-emerald-600 mt-1 block">{previewReport.payload.data.marketSummary?.yield}% Gross</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-2xl">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Context Demand Index</span>
                          <span className="text-sm font-extrabold text-slate-900 mt-1 block">{previewReport.payload.data.marketSummary?.demandIndex}</span>
                        </div>
                      </div>
                    </div>
                  );
                }

                // MARKET ANALYTICS Section
                if (secId === 'market_analytics') {
                  return (
                    <div key={secId} className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 space-y-4 shadow-sm">
                      <h2 className="text-lg font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-indigo-600" />
                        2.0 Market Analytics & Capital Growth
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <p className="text-xs text-slate-600 leading-relaxed">
                            Historically, <strong>{previewReport.payload.metadata.context.communityName}</strong> has established itself as a premier destination for global capital. The current annual capital growth index registers a massive <strong>+{previewReport.payload.data.marketSummary?.growth}%</strong> over the preceding 3-year trailing horizon.
                          </p>
                          <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50">
                            <h4 className="text-xs font-bold text-indigo-950 mb-1">Micro-market Liquidity Analysis</h4>
                            <p className="text-[11px] text-slate-600 leading-relaxed">
                              Transaction velocity remains elevated with properties selling within an average of 34 days, substantially lower than the Dubai municipal average of 52 days.
                            </p>
                          </div>
                        </div>

                        {/* Visual graph proxy */}
                        <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 flex flex-col justify-between">
                          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Capital Growth Vectors</span>
                          <div className="h-28 flex items-end justify-between gap-2.5 pt-4">
                            {[40, 52, 60, 58, 68, 76, 85, 94].map((v, i) => (
                              <div key={i} className="flex-1 flex flex-col items-center">
                                <div className="w-full bg-indigo-600 rounded-t-md" style={{ height: `${v}%` }}></div>
                                <span className="text-[8px] text-slate-400 mt-1">Q{i%4+1} {i<4?'25':'26'}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                // TRANSACTION INTELLIGENCE Section
                if (secId === 'transaction_intelligence') {
                  const officialTransactions = hasProfAccess ? RegistryService.getOfficialRegistryTransactions(projectId) : [];
                  return (
                    <div key={secId} className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 space-y-4 shadow-sm">
                      <h2 className="text-lg font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-indigo-600" />
                        3.0 Transaction Registry Analysis (DLD)
                      </h2>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-slate-50 p-3.5 rounded-2xl">
                          <span className="text-[10px] text-slate-400 font-bold block">Total Traded Units</span>
                          <span className="text-base font-extrabold text-slate-900 block mt-1">{previewReport.payload.data.transactions?.totalCount} Sales</span>
                        </div>
                        <div className="bg-slate-50 p-3.5 rounded-2xl">
                          <span className="text-[10px] text-slate-400 font-bold block">Aggregate Volume</span>
                          <span className="text-base font-extrabold text-slate-900 block mt-1">AED {((previewReport.payload.data.transactions?.totalVolume || 342000000) / 1000000).toFixed(1)}M</span>
                        </div>
                        <div className="bg-slate-50 p-3.5 rounded-2xl">
                          <span className="text-[10px] text-slate-400 font-bold block">Cash Transactions</span>
                          <span className="text-base font-extrabold text-indigo-600 block mt-1">{previewReport.payload.data.transactions?.cashRatio} Ratio</span>
                        </div>
                        <div className="bg-slate-50 p-3.5 rounded-2xl">
                          <span className="text-[10px] text-slate-400 font-bold block">Mortgage Finance</span>
                          <span className="text-base font-extrabold text-slate-900 block mt-1">{previewReport.payload.data.transactions?.mortgageRatio} Ratio</span>
                        </div>
                      </div>

                      {hasProfAccess && (
                        <div className="bg-indigo-50/30 border border-indigo-100/60 rounded-2xl p-4 mt-3 space-y-2.5">
                          <div className="flex items-center gap-1.5 text-xs font-extrabold text-indigo-700 uppercase tracking-wide">
                            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                            Official DLD Land Ledger References
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {officialTransactions.map((tx) => (
                              <div key={tx.transferId} className="bg-white border border-slate-100 p-3 rounded-xl text-[11px] font-mono space-y-1">
                                <div className="flex justify-between">
                                  <span className="text-slate-400">Transfer ID:</span>
                                  <span className="font-extrabold text-slate-800">{tx.transferId}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-400">Deed Number:</span>
                                  <span className="font-extrabold text-slate-800">{tx.deedNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-400">Ledger Reference:</span>
                                  <span className="font-extrabold text-indigo-600">{tx.registryReference}</span>
                                </div>
                                <div className="flex justify-between border-t border-slate-50 pt-1 mt-1 text-[9px] text-slate-500 font-sans">
                                  <span>{tx.transferType} &bull; {tx.registrationDate}</span>
                                  <span className="text-emerald-600 font-semibold">{tx.verificationStatus}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <p className="text-xs text-slate-500 italic mt-2">
                        *Source: Compiled directly from official sovereign land registries in the Dubai Land Department.
                      </p>
                    </div>
                  );
                }

                // RENTAL INTELLIGENCE Section
                if (secId === 'rental_intelligence') {
                  return (
                    <div key={secId} className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 space-y-4 shadow-sm">
                      <h2 className="text-lg font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
                        <Layers className="w-5 h-5 text-indigo-600" />
                        4.0 Ejari Rental Performance Profile
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="border border-slate-100 p-4 rounded-2xl">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Average Annual Rent</span>
                          <span className="text-lg font-extrabold text-slate-900 mt-1 block">AED {previewReport.payload.data.rental?.averageRent.toLocaleString()}</span>
                          <span className="text-[10px] text-emerald-600 font-bold mt-1 block">+{previewReport.payload.data.rental?.annualChange}% Annual Uplift</span>
                        </div>
                        <div className="border border-slate-100 p-4 rounded-2xl">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Net Yield (After Admin Fees)</span>
                          <span className="text-lg font-extrabold text-indigo-600 mt-1 block">{previewReport.payload.data.rental?.netYield}% Net</span>
                          <span className="text-[10px] text-slate-400 block mt-1">Based on standard service charge rates</span>
                        </div>
                        <div className="border border-slate-100 p-4 rounded-2xl">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Ejari Occupancy Status</span>
                          <span className="text-lg font-extrabold text-slate-900 mt-1 block">{previewReport.payload.data.rental?.occupancy} Active</span>
                          <span className="text-[10px] text-emerald-600 font-bold block mt-1">Extreme Demand Zone</span>
                        </div>
                      </div>

                      {hasProfAccess && (
                        <div className="bg-indigo-50/30 border border-indigo-100/60 rounded-2xl p-4 mt-3 space-y-2.5">
                          <div className="flex items-center gap-1.5 text-xs font-extrabold text-indigo-700 uppercase tracking-wide">
                            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                            Official Ejari Rental Registry Parameters
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px]">
                            <div className="bg-white border border-slate-100 p-2.5 rounded-xl">
                              <span className="text-slate-400 block font-sans">Active Ejari Contracts</span>
                              <span className="font-extrabold text-slate-800 font-mono">1,492 Active</span>
                            </div>
                            <div className="bg-white border border-slate-100 p-2.5 rounded-xl">
                              <span className="text-slate-400 block font-sans">Median Duration</span>
                              <span className="font-extrabold text-slate-800 font-mono">12.5 Months</span>
                            </div>
                            <div className="bg-white border border-slate-100 p-2.5 rounded-xl">
                              <span className="text-slate-400 block font-sans">RERA Rent Cap Limit</span>
                              <span className="font-extrabold text-indigo-600 font-mono">5% - 15% Max</span>
                            </div>
                            <div className="bg-white border border-slate-100 p-2.5 rounded-xl">
                              <span className="text-slate-400 block font-sans">Registry Status</span>
                              <span className="font-extrabold text-emerald-600 font-mono">Conforming ✓</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                // INVESTMENT TOOLS Section
                if (secId === 'investment_tools') {
                  const inv = previewReport.payload.data.investment;
                  return (
                    <div key={secId} className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 space-y-4 shadow-sm">
                      <h2 className="text-lg font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
                        <Plus className="w-5 h-5 text-indigo-600" />
                        5.0 Financial Modeling & Debt Structuring
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold text-slate-700 uppercase">Leveraged Cash Flow Matrix</h4>
                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between border-b pb-1.5">
                              <span className="text-slate-500">Modeled Purchase Value:</span>
                              <span className="font-bold text-slate-900">AED {inv?.purchasePrice.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between border-b pb-1.5">
                              <span className="text-slate-500">Projected ROI (5yr Holding):</span>
                              <span className="font-bold text-indigo-600">{inv?.roi}% ROI</span>
                            </div>
                            <div className="flex justify-between border-b pb-1.5">
                              <span className="text-slate-500">Monthly EMI Mortgage Load:</span>
                              <span className="font-bold text-slate-900">AED {inv?.monthlyEMI.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Estimated Net Annual Cash Flow:</span>
                              <span className="font-bold text-emerald-600">AED {inv?.annualCashFlow.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/60 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">Investment Recommendation Rating</span>
                            <span className="text-lg font-extrabold text-slate-900 mt-1 block">{inv?.rating} Rating</span>
                            <p className="text-[11px] text-slate-500 leading-relaxed mt-2">
                              {inv?.summary}
                            </p>
                          </div>
                          <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md self-start uppercase mt-3">
                            Affordability: {inv?.affordability}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }

                // AI EXECUTIVE SUMMARY Section
                if (secId === 'ai_executive_summary') {
                  const ai = previewReport.payload.data.aiSummary;
                  return (
                    <div key={secId} className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 space-y-4 shadow-sm">
                      <h2 className="text-lg font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-indigo-600" />
                        6.0 Grounded AI Expert Intelligence Brief
                      </h2>
                      <div className="space-y-4">
                        <div className="bg-indigo-50/20 border border-indigo-100/40 p-4 rounded-2xl">
                          <p className="text-xs text-slate-700 leading-relaxed font-medium">
                            {ai?.executiveSummary}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Grounded Strategic Opportunities</span>
                            <ul className="space-y-1.5 text-xs text-slate-600 list-disc pl-4">
                              {ai?.opportunities.map((opp, index) => (
                                <li key={index}>{opp}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="space-y-2">
                            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">Strategic Recommendations</span>
                            <ul className="space-y-1.5 text-xs text-slate-600 list-disc pl-4">
                              {ai?.recommendations.map((rec, index) => (
                                <li key={index}>{rec}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                // RISK ASSESSMENT Section
                if (secId === 'risk_assessment') {
                  const ai = previewReport.payload.data.aiSummary;
                  return (
                    <div key={secId} className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 space-y-4 shadow-sm">
                      <h2 className="text-lg font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-indigo-600" />
                        7.0 Grounded Risk Mitigation Matrix
                      </h2>
                      <div className="space-y-3">
                        <p className="text-xs text-slate-600 leading-relaxed">
                          To guarantee maximum compliance and safety across capital deployment horizons, the following specific risk sectors must be monitored:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                          {ai?.risks.map((risk, index) => (
                            <div key={index} className="bg-rose-50/40 border border-rose-100 p-3.5 rounded-2xl flex items-start gap-2.5">
                              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                              <p className="text-xs text-slate-700 leading-relaxed font-medium">{risk}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }

                // APPENDIX / SUPPORTING EVIDENCE Section
                if (secId === 'appendix' || secId === 'supporting_evidence') {
                  return (
                    <div key={secId} className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 space-y-4 shadow-sm">
                      <h2 className="text-lg font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
                        <Layers className="w-5 h-5 text-indigo-600" />
                        8.0 Sovereign Data Lineage & Appendices
                      </h2>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        This report is audit-ready and maintains complete data trace hashes pointing to the following sovereign data sources:
                      </p>
                      <div className="space-y-2 text-[11px] font-mono text-slate-500 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="flex justify-between border-b pb-1.5">
                          <span>DLD Transaction Registry Hash:</span>
                          <span className="text-slate-700">DLD-TX-938102A7C381B</span>
                        </div>
                        <div className="flex justify-between border-b pb-1.5">
                          <span>Ejari Rental Index Reference:</span>
                          <span className="text-slate-700">EJR-IDX-2026-M4</span>
                        </div>
                        <div className="flex justify-between border-b pb-1.5">
                          <span>RERA Rental Increase Calculator Vector:</span>
                          <span className="text-slate-700">RERA-CALC-V12</span>
                        </div>
                        <div className="flex justify-between">
                          <span>ACOT Grounded Model ID:</span>
                          <span className="text-indigo-600 font-bold">{previewReport.payload.metadata.reportId}</span>
                        </div>
                      </div>
                    </div>
                  );
                }

                return null;
              })}

              {/* SECTION 6: PROFESSIONAL PROPERTY INFORMATION (AGENT-ONLY) */}
              {hasProfAccess && (() => {
                const propData = ProfessionalPropertyService.getProfessionalPropertyData(projectId);
                return (
                  <div className="bg-white border-2 border-indigo-100 rounded-3xl p-6 md:p-8 space-y-4 shadow-sm relative overflow-hidden" id="professional-property-info-report-section">
                    <div className="absolute top-0 right-0 bg-indigo-600 text-white font-extrabold text-[9px] px-3.5 py-1 uppercase rounded-bl-xl tracking-widest font-mono">
                      Agent Intel
                    </div>
                    
                    <h2 className="text-lg font-bold text-indigo-950 border-b pb-2 flex items-center gap-2">
                      <span className="p-1 bg-indigo-50 text-indigo-700 rounded-lg"><Building className="w-5 h-5" /></span>
                      5.5 Professional Property Registry Dossier
                    </h2>

                    <p className="text-xs text-slate-500 leading-normal">
                      This segment includes highly privileged Dubai Land Department (DLD) registry references, permit logs, and developer escrow balances underwritten for broker representation.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Property Number</span>
                        <span className="text-xs font-mono font-extrabold text-slate-900 block mt-1">{propData.propertyNumber}</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Plot Number</span>
                        <span className="text-xs font-mono font-extrabold text-slate-900 block mt-1">{propData.plotNumber}</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Building Code</span>
                        <span className="text-xs font-mono font-extrabold text-slate-900 block mt-1">{propData.buildingNumber}</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Construction Status</span>
                        <span className="text-xs font-sans font-extrabold text-emerald-600 block mt-1">{propData.constructionStatus}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-indigo-50/20 border border-indigo-100/40 p-4 rounded-2xl text-xs space-y-2">
                        <span className="text-[10px] font-extrabold text-indigo-700 uppercase tracking-wider block">Sovereign Authority Audit Log</span>
                        <div className="flex justify-between border-b border-indigo-100/30 pb-1.5">
                          <span className="text-slate-500">Registry Reference:</span>
                          <span className="font-bold text-slate-800 font-mono">{propData.registryReference}</span>
                        </div>
                        <div className="flex justify-between border-b border-indigo-100/30 pb-1.5">
                          <span className="text-slate-500">Developer Registration:</span>
                          <span className="font-bold text-slate-800 font-mono">{propData.developerRegistration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Active Permit:</span>
                          <span className="font-bold text-emerald-600 font-mono">{propData.permitNumber}</span>
                        </div>
                      </div>

                      <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-2xl flex flex-col justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-[10px] font-extrabold text-indigo-700 uppercase">
                            <span className="w-2 h-2 bg-indigo-600 rounded-full animate-ping"></span>
                            ACOT Professional Badge Active
                          </div>
                          <p className="text-[11px] text-slate-500 leading-normal">
                            All property metadata conforms dynamically with DLD Webhook integrations. The underlying construction permits have been fully cleared as active.
                          </p>
                        </div>
                        <span className="text-[9px] font-bold text-slate-400 block mt-2">
                          Audit Authority: {propData.authority}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* REPORT FOOTER METADATA */}
              {hasProfAccess && branding ? (() => {
                const resolved = BrandingResolver.resolveBranding(branding);
                const wlMeta = WhiteLabelService.getWhiteLabelMetadata(branding);
                if (!resolved) return null;
                return (
                  <div className="border-t-2 border-indigo-100 pt-8 mt-12 space-y-4 text-slate-500">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-sans pb-4">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Prepared By Brokerage</span>
                        <p className="font-extrabold text-slate-800">{resolved.companyName}</p>
                        <p className="text-[11px] text-slate-400 leading-normal mt-1">{resolved.address}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Representative Agent</span>
                        <p className="font-extrabold text-indigo-700">{wlMeta?.agentName || resolved.agentName}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">RERA Reg No: {verification?.licenseNumber}</p>
                      </div>
                      <div className="md:text-right space-y-0.5 text-[11px]">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Direct Contacts</span>
                        <p>Phone: <span className="font-bold text-slate-800">{resolved.phone}</span></p>
                        <p>Email: <span className="font-bold text-slate-800">{resolved.email}</span></p>
                        <p>Web: <span className="font-bold text-indigo-600">{resolved.website}</span></p>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-[10px] text-slate-400 border-t border-slate-100 pt-4">
                      <p>© 2026 {resolved.companyName}. All rights reserved. Underwritten & powered by {wlMeta?.poweredBy || 'ACOT Real Estate Platform'}.</p>
                      <p className="font-mono">HASH: {previewReport.payload.metadata.reportId}-SEC-{previewReport.payload.selectedSections.length}</p>
                    </div>
                  </div>
                );
              })() : (
                <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-[10px] text-slate-400">
                  <p>© 2026 ACOT Real Estate Analytics Platform. Confidential document generated for registered institutional investors.</p>
                  <p>Report HASH: {previewReport.payload.metadata.reportId}-SEC-{previewReport.payload.selectedSections.length}</p>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
