
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Settings, Bell, Shield, Palette, Database, LogOut, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const AppSettings: React.FC = () => {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    notifications: {
      budgetAlerts: true,
      goalReminders: true,
      marketUpdates: false,
      fraudAlerts: true,
      weeklyReports: true
    },
    privacy: {
      shareProgress: false,
      anonymousData: true,
      marketingEmails: false
    },
    preferences: {
      theme: 'light',
      currency: 'INR',
      language: 'en',
      startOfWeek: 'monday'
    },
    budget: {
      monthlyLimit: '50000',
      alertThreshold: '80'
    }
  });

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
    toast.success('Setting updated successfully');
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error signing out');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-6 h-6" />
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      {/* Notifications Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="budget-alerts">Budget Alerts</Label>
              <p className="text-sm text-gray-500">Get notified when you exceed budget limits</p>
            </div>
            <Switch
              id="budget-alerts"
              checked={settings.notifications.budgetAlerts}
              onCheckedChange={(value) => handleSettingChange('notifications', 'budgetAlerts', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="goal-reminders">Goal Reminders</Label>
              <p className="text-sm text-gray-500">Weekly reminders about your financial goals</p>
            </div>
            <Switch
              id="goal-reminders"
              checked={settings.notifications.goalReminders}
              onCheckedChange={(value) => handleSettingChange('notifications', 'goalReminders', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="market-updates">Market Updates</Label>
              <p className="text-sm text-gray-500">Real-time stock market and investment updates</p>
            </div>
            <Switch
              id="market-updates"
              checked={settings.notifications.marketUpdates}
              onCheckedChange={(value) => handleSettingChange('notifications', 'marketUpdates', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="fraud-alerts">Fraud Alerts</Label>
              <p className="text-sm text-gray-500">Security notifications and fraud warnings</p>
            </div>
            <Switch
              id="fraud-alerts"
              checked={settings.notifications.fraudAlerts}
              onCheckedChange={(value) => handleSettingChange('notifications', 'fraudAlerts', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="weekly-reports">Weekly Reports</Label>
              <p className="text-sm text-gray-500">Summary of your financial activity</p>
            </div>
            <Switch
              id="weekly-reports"
              checked={settings.notifications.weeklyReports}
              onCheckedChange={(value) => handleSettingChange('notifications', 'weeklyReports', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Budget Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="monthly-limit">Monthly Budget Limit (₹)</Label>
            <Input
              id="monthly-limit"
              type="number"
              value={settings.budget.monthlyLimit}
              onChange={(e) => handleSettingChange('budget', 'monthlyLimit', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="alert-threshold">Alert Threshold (%)</Label>
            <Input
              id="alert-threshold"
              type="number"
              min="1"
              max="100"
              value={settings.budget.alertThreshold}
              onChange={(e) => handleSettingChange('budget', 'alertThreshold', e.target.value)}
            />
            <p className="text-sm text-gray-500 mt-1">
              Get alerts when you spend {settings.budget.alertThreshold}% of your budget
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Privacy & Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="share-progress">Share Progress</Label>
              <p className="text-sm text-gray-500">Allow others to see your achievements</p>
            </div>
            <Switch
              id="share-progress"
              checked={settings.privacy.shareProgress}
              onCheckedChange={(value) => handleSettingChange('privacy', 'shareProgress', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="anonymous-data">Anonymous Analytics</Label>
              <p className="text-sm text-gray-500">Help improve the app with anonymous usage data</p>
            </div>
            <Switch
              id="anonymous-data"
              checked={settings.privacy.anonymousData}
              onCheckedChange={(value) => handleSettingChange('privacy', 'anonymousData', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="marketing-emails">Marketing Emails</Label>
              <p className="text-sm text-gray-500">Receive promotional emails and updates</p>
            </div>
            <Switch
              id="marketing-emails"
              checked={settings.privacy.marketingEmails}
              onCheckedChange={(value) => handleSettingChange('privacy', 'marketingEmails', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* App Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            App Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="theme">Theme</Label>
            <Select value={settings.preferences.theme} onValueChange={(value) => handleSettingChange('preferences', 'theme', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="auto">Auto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="currency">Currency</Label>
            <Select value={settings.preferences.currency} onValueChange={(value) => handleSettingChange('preferences', 'currency', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                <SelectItem value="USD">US Dollar ($)</SelectItem>
                <SelectItem value="EUR">Euro (€)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="language">Language</Label>
            <Select value={settings.preferences.language} onValueChange={(value) => handleSettingChange('preferences', 'language', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">Hindi</SelectItem>
                <SelectItem value="ta">Tamil</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">{user?.email || 'No email'}</div>
                <div className="text-sm text-gray-500">Account Email</div>
              </div>
              <Badge variant="secondary">Verified</Badge>
            </div>

            <Separator />

            <Button
              onClick={handleLogout}
              variant="destructive"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4 mr-2" />
              )}
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Course Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Learning Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600">
              As an admin, you can upload courses and learning materials for users. Contact support to get admin access.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <h4 className="font-semibold mb-2">Video Courses</h4>
                <p className="text-sm text-gray-600">Upload educational videos with quizzes</p>
              </Card>
              <Card className="p-4">
                <h4 className="font-semibold mb-2">Interactive Modules</h4>
                <p className="text-sm text-gray-600">Create step-by-step learning paths</p>
              </Card>
              <Card className="p-4">
                <h4 className="font-semibold mb-2">Assessment Tests</h4>
                <p className="text-sm text-gray-600">Build knowledge assessment quizzes</p>
              </p>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
