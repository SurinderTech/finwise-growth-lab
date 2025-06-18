
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

const UserOnboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    full_name: '',
    age: '',
    occupation: '',
    monthly_income: '',
    experience_level: 'beginner' as ExperienceLevel,
    risk_tolerance: '5',
    financial_goals: [] as string[],
    phone_number: ''
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const financialGoalsOptions = [
    'Emergency Fund',
    'Retirement Planning',
    'Buying a House',
    'Children Education',
    'Debt Repayment',
    'Travel Fund',
    'Starting a Business',
    'Wealth Building'
  ];

  const handleGoalToggle = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      financial_goals: prev.financial_goals.includes(goal)
        ? prev.financial_goals.filter(g => g !== goal)
        : [...prev.financial_goals, goal]
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          age: parseInt(formData.age),
          occupation: formData.occupation,
          monthly_income: parseFloat(formData.monthly_income),
          experience_level: formData.experience_level,
          risk_tolerance: parseInt(formData.risk_tolerance),
          financial_goals: formData.financial_goals,
          phone_number: formData.phone_number
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast.success('Profile setup completed successfully!');
      navigate('/');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center">Personal Information</h2>
            <div>
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div>
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                type="number"
                min="13"
                max="120"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="Enter your age"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input
                id="phone_number"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                placeholder="+91 9876543210"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center">Professional Details</h2>
            <div>
              <Label htmlFor="occupation">Occupation *</Label>
              <Input
                id="occupation"
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                placeholder="Software Engineer, Teacher, Business Owner, etc."
                required
              />
            </div>
            <div>
              <Label htmlFor="monthly_income">Monthly Income (₹) *</Label>
              <Input
                id="monthly_income"
                type="number"
                value={formData.monthly_income}
                onChange={(e) => setFormData({ ...formData, monthly_income: e.target.value })}
                placeholder="50000"
                required
              />
            </div>
            <div>
              <Label htmlFor="experience_level">Financial Experience Level</Label>
              <Select value={formData.experience_level} onValueChange={(value: ExperienceLevel) => setFormData({ ...formData, experience_level: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner - New to finance</SelectItem>
                  <SelectItem value="intermediate">Intermediate - Some knowledge</SelectItem>
                  <SelectItem value="advanced">Advanced - Experienced investor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center">Risk Profile</h2>
            <div>
              <Label htmlFor="risk_tolerance">Risk Tolerance (1-10)</Label>
              <p className="text-sm text-gray-600 mb-2">
                1 = Very Conservative, 10 = Very Aggressive
              </p>
              <Select value={formData.risk_tolerance} onValueChange={(value) => setFormData({ ...formData, risk_tolerance: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1,2,3,4,5,6,7,8,9,10].map(num => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} - {num <= 3 ? 'Conservative' : num <= 7 ? 'Moderate' : 'Aggressive'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center">Financial Goals</h2>
            <p className="text-gray-600 text-center">Select your financial priorities (multiple allowed)</p>
            <div className="grid grid-cols-2 gap-3">
              {financialGoalsOptions.map((goal) => (
                <div key={goal} className="flex items-center space-x-2">
                  <Checkbox
                    id={goal}
                    checked={formData.financial_goals.includes(goal)}
                    onCheckedChange={() => handleGoalToggle(goal)}
                  />
                  <Label htmlFor={goal} className="text-sm">{goal}</Label>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.full_name && formData.age;
      case 2:
        return formData.occupation && formData.monthly_income;
      case 3:
        return formData.risk_tolerance;
      case 4:
        return true; // Goals are optional
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold">Welcome to Financial Warrior!</h1>
            <p className="text-gray-600">Let's set up your financial profile</p>
          </div>
          <Progress value={progress} className="w-full" />
          <p className="text-center text-sm text-gray-500">Step {currentStep} of {totalSteps}</p>
        </CardHeader>
        <CardContent>
          {renderStep()}
          
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
            >
              {currentStep === totalSteps ? 'Complete Setup' : 'Next'}
              {currentStep !== totalSteps && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserOnboarding;
