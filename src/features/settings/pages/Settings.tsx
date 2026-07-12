import React, { useState } from 'react';
import { PageContainer } from '@/components/ui-custom/PageContainer';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Building2, ReceiptText, Globe, Landmark, Briefcase } from 'lucide-react';
import { toast } from 'sonner';

const TABS = [
  { id: 'company', label: 'Company Information', icon: Building2 },
  { id: 'gst', label: 'GST Configuration', icon: Landmark },
  { id: 'invoice', label: 'Invoice Settings', icon: ReceiptText },
  { id: 'booking', label: 'Booking Settings', icon: Briefcase },
  { id: 'regional', label: 'Currency & Timezone', icon: Globe },
];

export const Settings = () => {
  const [activeTab, setActiveTab] = useState('company');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Settings saved successfully');
    }, 800);
  };

  return (
    <PageContainer>
      <PageHeader 
        title="System Settings" 
        description="Manage your CRM configuration, tax rules, and company preferences."
      />

      <div className="flex flex-col md:flex-row gap-6 mt-6">
        {/* Sidebar Tabs */}
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
        </div>

        {/* Content Area */}
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
                      <Input defaultValue="Zolvex Services Pvt. Ltd." />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Legal Name</label>
                      <Input defaultValue="Zolvex Services Private Limited" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Support Email</label>
                      <Input type="email" defaultValue="support@zolvex.com" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone Number</label>
                      <Input defaultValue="+91 99999 99999" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium">Registered Address</label>
                      <Input defaultValue="123 Tech Park, Cyber City, Mumbai, Maharashtra 400001" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'gst' && (
              <Card>
                <CardHeader>
                  <CardTitle>GST Configuration</CardTitle>
                  <CardDescription>Manage your GSTIN and tax calculation preferences.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">GSTIN</label>
                      <Input defaultValue="27AABCZ1234D1Z5" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Company Registered State</label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                        <option value="MH">Maharashtra (MH)</option>
                        <option value="DL">Delhi (DL)</option>
                        <option value="KA">Karnataka (KA)</option>
                        <option value="TN">Tamil Nadu (TN)</option>
                      </select>
                      <p className="text-xs text-muted-foreground mt-1">Used to determine Intra-state (CGST/SGST) vs Inter-state (IGST) taxation.</p>
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
                      <Input defaultValue="INV-" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Default Payment Terms (Days)</label>
                      <Input type="number" defaultValue="7" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium">Invoice Footer Notes</label>
                      <textarea 
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        defaultValue="1. Payment is due within the stated due date.&#10;2. Please include invoice number on your check."
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
                      <Input type="number" defaultValue="60" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Buffer Time Between Jobs (Mins)</label>
                      <Input type="number" defaultValue="30" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Operating Hours Start</label>
                      <Input type="time" defaultValue="09:00" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Operating Hours End</label>
                      <Input type="time" defaultValue="18:00" />
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
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                        <option value="INR">Indian Rupee (₹)</option>
                        <option value="USD">US Dollar ($)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">System Timezone</label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                        <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                        <option value="UTC">UTC</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="mt-6 flex justify-end">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </PageContainer>
  );
};
