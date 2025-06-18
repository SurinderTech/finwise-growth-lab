
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { XPBar } from '@/components/XPBar';
import { CoinDisplay } from '@/components/CoinDisplay';
import { User, Settings, LogOut, Trophy, Target, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const Profile = () => {
  const { user, signOut } = useAuth();
  const { profile, userStats, loading, updateProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    age: '',
    monthly_income: '',
    occupation: '',
    experience_level: 'beginner',
    risk_tolerance: '5'
  });

  React.useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        age: profile.age?.toString() || '',
        monthly_income: profile.monthly_income?.toString() || '',
        occupation: profile.occupation || '',
        experience_level: profile.experience_level || 'beginner',
        risk_tolerance: profile.risk_tolerance?.toString() || '5'
      });
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      await updateProfile({
        full_name: formData.full_name,
        age: parseInt(formData.age) || null,
        monthly_income: parseFloat(formData.monthly_income) || null,
        occupation: formData.occupation,
        experience_level: formData.experience_level,
        risk_tolerance: parseInt(formData.risk_tolerance)
      });
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return <div className="p-6 pb-20">Loading...</div>;
  }

  const nextLevelXP = (userStats?.level || 1) * 1000;
  const currentXP = userStats?.total_xp || 0;
  const currentLevelXP = currentXP % 1000;

  return (
    <div className="p-6 pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">👤 Your Profile</h1>
          <p className="text-gray-600">Manage your financial journey</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Level</p>
                  <p className="text-2xl font-bold">{userStats?.level || 1}</p>
                </div>
                <Trophy className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total XP</p>
                  <p className="text-2xl font-bold">{userStats?.total_xp || 0}</p>
                </div>
                <Target className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Streak</p>
                  <p className="text-2xl font-bold">{userStats?.streak_days || 0} days</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* XP Progress */}
        <XPBar 
          currentXP={currentLevelXP}
          nextLevelXP={1000}
          level={userStats?.level || 1}
        />

        {/* Coins Display */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <CoinDisplay coins={userStats?.coins || 0} animated />
            </div>
          </CardContent>
        </Card>

        {/* Profile Information */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Information
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            >
              {isEditing ? 'Save' : 'Edit'}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user?.email || ''}
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="occupation">Occupation</Label>
                <Input
                  id="occupation"
                  value={formData.occupation}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="monthly_income">Monthly Income (₹)</Label>
                <Input
                  id="monthly_income"
                  type="number"
                  value={formData.monthly_income}
                  onChange={(e) => setFormData({ ...formData, monthly_income: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="experience_level">Experience Level</Label>
                <Select 
                  value={formData.experience_level} 
                  onValueChange={(value) => setFormData({ ...formData, experience_level: value })}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="risk_tolerance">Risk Tolerance (1-10)</Label>
              <Select 
                value={formData.risk_tolerance} 
                onValueChange={(value) => setFormData({ ...formData, risk_tolerance: value })}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1,2,3,4,5,6,7,8,9,10].map(num => (
                    <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Badges */}
        {userStats?.badges && Array.isArray(userStats.badges) && userStats.badges.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Badges Earned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {userStats.badges.map((badge: any, index: number) => (
                  <Badge key={index} variant="secondary">
                    {badge.name || badge}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sign Out */}
        <Card>
          <CardContent className="p-6">
            <Button 
              onClick={handleSignOut}
              variant="destructive"
              className="w-full"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
