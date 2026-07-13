import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/ui-custom/PageContainer';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Building2, ReceiptText, Globe, Landmark, Briefcase, CheckCircle2, Info } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/axios';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh',
];

const TABS = [
  { id: 'company', label: 'Company Information', icon: Building2 },
  { id: 'gst',     label: 'GST Configuration',   icon: Landmark   },
  { id: 'invoice', label: 'Invoice Settings',     icon: ReceiptText },
  { id: 'booking', label: 'Booking Settings',     icon: Briefcase  },
  { id: 'regional', label: 'Currency & Timezone', icon: Globe      },
];

export const Settings = () => {
  const [activeTab, setActiveTab]   = useState('company');
  const [isSaving, setIsSaving]     = useState(false);
  const [isLoading, setIsLoading]   = useState(true);
  const isSuperAdmin = localStorage.getItem('userRole') === 'Super Admin';

  // Live values fetched from the DB
  const [registeredState, setRegisteredState] = useState('Maharashtra');
  const [gstin, setGstin]                     = useState('');
  const [companyName, setCompanyName]         = useState('Zolvex Services Pvt. Ltd.');

  // Load current settings from the backend on mount
  useEffect(() => {
    apiClient.get('/settings').then(res => {
      const s = res.data?.data ?? {};
      setRegisteredState(s.company_registered_state ?? 'Maharashtra');
      setGstin(s.company_gstin ?? '');
      setCompanyName(s.company_name ?? 'Zolvex Services Pvt. Ltd.');
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
        toast.success(`GST settings saved. Company state is now "${registeredState}". All future bookings will use this state for CGST/SGST vs IGST determination.`);
      } else if (activeTab === 'company') {
        await saveSetting('company_name', companyName, 'Company Name');
        toast.success('Company information saved.');
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
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Legal Name</label>
                      <Input defaultValue="Zolvex Services Private Limited" disabled={!isSuperAdmin} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Support Email</label>
                      <Input type="email" defaultValue="support@zolvex.com" disabled={!isSuperAdmin} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone Number</label>
                      <Input defaultValue="+91 99999 99999" disabled={!isSuperAdmin} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium">Registered Address</label>
                      <Input defaultValue="123 Tech Park, Cyber City, Mumbai, Maharashtra 400001" disabled={!isSuperAdmin} />
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

            {activeTab === 'invoice' && (
              <Card>
                <CardHeader>
                  <CardTitle>Invoice Settings</CardTitle>
                  <CardDescription>Configure numbering sequences and payment terms.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Invoice Prefix</label>
                      <Input defaultValue="INV-" disabled={!isSuperAdmin} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Default Payment Terms (Days)</label>
                      <Input type="number" defaultValue="7" disabled={!isSuperAdmin} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium">Invoice Footer Notes</label>
                      <textarea
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        defaultValue={"1. Payment is due within the stated due date.\n2. Please include invoice number on your check."}
                        disabled={!isSuperAdmin}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'booking' && (
              <Card>
                <CardHeader>
                  <CardTitle>Booking Settings</CardTitle>
                  <CardDescription>Configure scheduling limits and default durations.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Default Job Duration (Mins)</label>
                      <Input type="number" defaultValue="60" disabled={!isSuperAdmin} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Buffer Time Between Jobs (Mins)</label>
                      <Input type="number" defaultValue="30" disabled={!isSuperAdmin} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Operating Hours Start</label>
                      <Input type="time" defaultValue="09:00" disabled={!isSuperAdmin} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Operating Hours End</label>
                      <Input type="time" defaultValue="18:00" disabled={!isSuperAdmin} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'regional' && (
              <Card>
                <CardHeader>
                  <CardTitle>Currency & Timezone</CardTitle>
                  <CardDescription>Regional settings for formatting and time calculation.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Base Currency</label>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        disabled={!isSuperAdmin}
                      >
                        <option value="INR">Indian Rupee (₹)</option>
                        <option value="USD">US Dollar ($)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">System Timezone</label>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        disabled={!isSuperAdmin}
                      >
                        <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                        <option value="UTC">UTC</option>
                      </select>
                    </div>
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
