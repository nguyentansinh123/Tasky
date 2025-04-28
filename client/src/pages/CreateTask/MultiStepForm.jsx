import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import ProgressBar from '../../components/ProgressBar';
import CreateTask from './CreateTask';
import CreateTaskStep2 from './CreateTaskStep2';
import BudgetStep from './BudgetTask';
import DetailsStep from './DetailsStep';

const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    deadlineType: '',
    onDate: null,
    beforeDate: null,
    isFlexible: false,
    taskTitle: '',
    description: '',
    location: '',
    budget: {
      amount: '',
      currency: 'USD'
    },
    additionalInfo: '',
    images: []
  });

  const totalSteps = 4;

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const updateFormData = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const handleSubmitStart = () => setIsSubmitting(true);
  const handleSubmitEnd = () => setIsSubmitting(false);

  const renderStep = () => {
    switch (step) {
      case 1:
        return <CreateTask 
                 onNext={nextStep} 
                 onBack={prevStep} 
                 formData={formData}
                 updateFormData={updateFormData}
               />;
      case 2:
        return <CreateTaskStep2 
                 onNext={nextStep} 
                 onBack={prevStep} 
                 formData={formData}
                 updateFormData={updateFormData}
               />;
      case 3:
        return <BudgetStep 
                 onNext={nextStep} 
                 onBack={prevStep} 
                 formData={formData}
                 updateFormData={updateFormData}
               />;
      case 4:
        return <DetailsStep 
                 onNext={nextStep} 
                 onBack={prevStep} 
                 formData={formData}
                 updateFormData={updateFormData}
                 onSubmitStart={handleSubmitStart}
                 onSubmitEnd={handleSubmitEnd}
               />;
      default:
        return <CreateTask 
                 onNext={nextStep} 
                 onBack={prevStep} 
                 formData={formData}
                 updateFormData={updateFormData}
               />;
    }
  };

  return (
    <>
      <div className="create-task-container">
        <ProgressBar 
          currentStep={step} 
          totalSteps={totalSteps} 
          isSubmitting={isSubmitting}
        />
        {renderStep()}
      </div>
    </>
  );
};

export default MultiStepForm;