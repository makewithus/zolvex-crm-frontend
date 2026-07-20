import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/ui-custom/PageContainer';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Building2, Landmark, CheckCircle2, Info, Phone, ClipboardList, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/axios';
import { useNavigate } from 'react-router-dom';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh',
];

const TABS = [
  { id: 'company',  label: 'Company Information', icon: Building2 },
  { id: 'gst',      label: 'GST Configuration',   icon: Landmark  },
  { id: 'contact',  label: 'Support Contact',      icon: Phone     },
];

export const Settings = () => {
  const [activeTab, setActiveTab]   = useState('company');
  const [isSaving, setIsSaving]     = useState(false);
  const [isLoading, setIsLoading]   = useState(true);
  const isSuperAdmin = localStorage.getItem('userRole') === 'Super Admin';
  const navigate = useNavigate();

  // Live values fetched from the DB
  const [registeredState, setRegisteredState] = useState('Maharashtra');
  const [gstin, setGstin]                     = useState('');
  const [companyName, setCompanyName]         = useState('Zolvex Services Pvt. Ltd.');
  const [supportPhone, setSupportPhone]       = useState('');
  const [supportEmail, setSupportEmail]       = useState('support@zolvex.in');
  const [invoiceFooter, setInvoiceFooter]     = useState('Thank you for choosing Zolvex Services.');

  // Load current settings from the backend on mount
  useEffect(() => {
    apiClient.get('/settings').then(res => {
      const s = res.data?.data ?? {};
      setRegisteredState(s.company_registered_state ?? 'Maharashtra');
      setGstin(s.company_gstin ?? '');
      setCompanyName(s.company_name ?? 'Zolvex Services Pvt. Ltd.');
      setSupportPhone(s.company_support_phone ?? '');
      setSupportEmail(s.company_support_email ?? 'support@zolvex.in');
      setInvoiceFooter(s.invoice_footer_note ?? 'Thank you for choosing Zolvex Services.');
    }).catch(() => {
      // Non-critical — form still works with defaults
    }).finally(() => setIsLoading(false));
  }, []);

  const saveSetting = async (key: string, value: string, label: string) => {
    await apiClient.patch(`/settings/${key}`, { value, label });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      toast.error('Only Super Admin can change system settings.');
      return;
    }
    setIsSaving(true);
    try {
      if (activeTab === 'gst') {
        await saveSetting('company_registered_state', registeredState, 'Company Registered State');
        await saveSetting('company_gstin', gstin, 'GSTIN');
        toast.success(`GST settings saved. Company state is now "${registeredState}".`);
      } else if (activeTab === 'company') {
        await saveSetting('company_name', companyName, 'Company Name');
        toast.success('Company information saved.');
      } else if (activeTab === 'contact') {
        await saveSetting('company_support_phone', supportPhone, 'Support Phone');
        await saveSetting('company_support_email', supportEmail, 'Support Email');
        await saveSetting('invoice_footer_note', invoiceFooter, 'Invoice Footer Note');
        toast.success('Support contact settings saved.');
      } else {
        toast.success('Settings saved.');
      }
    } catch {
      toast.error('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="System Settings"
        description="Manage your CRM configuration, tax rules, and company preferences."
      />

      <div className="flex flex-col md:flex-row gap-6 mt-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <nav className="flex md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-primary' : 'text-muted-foreground'}`} />
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Checklists quick link */}
          <button
            onClick={() => navigate('/settings/checklists')}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors w-full mt-1"
          >
            <ClipboardList className="w-4 h-4" />
            Checklist Templates
            <ExternalLink className="w-3 h-3 ml-auto" />
          </button>

          {/* Access notice */}
          {!isSuperAdmin && (
            <div className="mt-4 p-3 rounded-lg bg-muted text-xs text-muted-foreground flex items-start gap-2">
              <Info className="w-3 h-3 mt-0.5 shrink-0" />
              <span>Settings are read-only for your role. Contact a Super Admin to make changes.</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <form onSubmit={handleSave}>

            {activeTab === 'company' && (
              <Card>
                <CardHeader>
                  <CardTitle>Company Information</CardTitle>
                  <CardDescription>Details displayed on invoices and customer communications.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Company Name</label>
                      <Input
                        value={companyName}
                        onChange={e => setCompanyName(e.target.value)}
                        disabled={!isSuperAdmin}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'gst' && (
              <Card>
                <CardHeader>
                  <CardTitle>GST Configuration</CardTitle>
                  <CardDescription>
                    The <strong>Registered State</strong> is the live source of truth for GST calculations.
                    It is persisted in the database and applied immediately to all future bookings.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">

                  {/* Live source of truth badge */}
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium">Database-Backed — Source of Truth</p>
                      <p className="mt-0.5">
                        This setting is stored in the <code className="bg-green-100 px-1 rounded">SystemSetting</code> table
                        and read by the GST engine on every booking. Changes take effect within 60 seconds
                        with no redeployment required.
                      </p>
                      <p className="mt-1.5 font-semibold">
                        Active state: {isLoading ? '…' : registeredState}
                      </p>
                    </div>
                  </div>

                  {/* How it works */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg border bg-muted/40 text-sm">
                      <p className="font-medium text-green-700 mb-1">Intra-state booking</p>
                      <p className="text-xs text-muted-foreground">Customer state == <strong>{registeredState}</strong></p>
                      <p className="mt-1">CGST + SGST applied · IGST = ₹0</p>
                    </div>
                    <div className="p-3 rounded-lg border bg-muted/40 text-sm">
                      <p className="font-medium text-blue-700 mb-1">Inter-state booking</p>
                      <p className="text-xs text-muted-foreground">Customer state ≠ <strong>{registeredState}</strong></p>
                      <p className="mt-1">IGST only · CGST = SGST = ₹0</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">GSTIN</label>
                      <Input
                        value={gstin}
                        onChange={e => setGstin(e.target.value)}
                        placeholder="e.g. 27AABCZ1234D1Z5"
                        disabled={!isSuperAdmin}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Company Registered State <span className="text-red-500">*</span>
                      </label>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={registeredState}
                        onChange={e => setRegisteredState(e.target.value)}
                        disabled={!isSuperAdmin}
                      >
                        {INDIAN_STATES.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                      <p className="text-xs text-muted-foreground mt-1">
                        Saving this value persists it to the database immediately. No redeployment needed.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}



            {activeTab === 'contact' && (
              <Card>
                <CardHeader>
                  <CardTitle>Support Contact &amp; Invoice Settings</CardTitle>
                  <CardDescription>Details shown on invoice footer and customer-facing communications.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Support Phone</label>
                      <Input
                        value={supportPhone}
                        onChange={e => setSupportPhone(e.target.value)}
                        placeholder="+91 9999999999"
                        disabled={!isSuperAdmin}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Support Email</label>
                      <Input
                        value={supportEmail}
                        onChange={e => setSupportEmail(e.target.value)}
                        placeholder="support@zolvex.in"
                        disabled={!isSuperAdmin}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Invoice Footer Note</label>
                    <Input
                      value={invoiceFooter}
                      onChange={e => setInvoiceFooter(e.target.value)}
                      placeholder="Thank you for choosing Zolvex Services."
                      disabled={!isSuperAdmin}
                    />
                    <p className="text-xs text-muted-foreground">This text appears at the bottom of every generated invoice.</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {isSuperAdmin && (
              <div className="mt-6 flex justify-end">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Settings'}
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>
    </PageContainer>
  );
};
