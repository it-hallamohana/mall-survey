import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { surveyQuestions } from '../../utils/surveyQuestions';
import RadioGroup from '../../components/survey/RadioGroup';
import CheckboxGroup from '../../components/survey/CheckboxGroup';
import TextInput from '../../components/survey/TextInput';
import ProgressBar from '../../components/survey/ProgressBar';
import { submitSurvey } from '../../services/surveyService';

export default function SurveyForm() {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Scroll to top on section change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentSection]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for the field when it's updated
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im;
    return phoneRegex.test(phone) && phone.length >= 10;
  };

  const validateSection = () => {
    const section = surveyQuestions[currentSection];
    const newErrors = {};
    let isValid = true;

    section.questions.forEach((q) => {
      if (q.required) {
        const value = formData[q.field];
        if (value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
          newErrors[q.field] = 'Kolom ini wajib diisi';
          isValid = false;
        } else if (q.type === 'tel' && !validatePhone(value)) {
          newErrors[q.field] = 'Nomor handphone tidak valid (minimal 10 digit angka)';
          isValid = false;
        }

        // Validate conditional field if condition is met
        if (q.conditionalField && value === q.conditionalField.parentValue) {
          const conditionalValue = formData[q.conditionalField.field];
          if (!conditionalValue || conditionalValue.trim() === '') {
            newErrors[q.conditionalField.field] = 'Kolom ini wajib diisi';
            isValid = false;
          }
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateSection()) {
      if (currentSection < surveyQuestions.length - 1) {
        setCurrentSection((prev) => prev + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentSection > 0) {
      setCurrentSection((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError('');
    
    const result = await submitSurvey(formData);
    
    setIsSubmitting(false);
    
    if (result.success) {
      navigate('/survey/success');
    } else {
      setSubmitError('Gagal mengirim survey: ' + result.error);
    }
  };

  const currentSectionData = surveyQuestions[currentSection];

  return (
    <div className="min-h-screen bg-[#F7F7F8] py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100">
          <ProgressBar sections={surveyQuestions} currentSectionIndex={currentSection} />
          
          <div className="flex items-center gap-3 mb-8">
            <div className="w-3 h-8 bg-pxchange-teal rounded-sm" />
            <h2 className="text-xl sm:text-2xl font-bold text-charcoal">
              {currentSectionData.title}
            </h2>
          </div>

          {submitError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
              {submitError}
            </div>
          )}

          <div className="space-y-8">
            {currentSectionData.questions.map((q) => (
              <div key={q.id} className="scroll-mt-6">
                <div className="mb-3 flex items-start gap-2">
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs font-bold text-gray-500 mt-0.5">
                    {q.id}
                  </span>
                  <label className="text-base font-semibold text-charcoal">
                    {q.label} {q.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                </div>
                
                <div className="pl-8">
                  {q.type === 'radio' && (
                    <RadioGroup
                      name={q.field}
                      options={q.options}
                      value={formData[q.field]}
                      onChange={(val) => handleChange(q.field, val)}
                      error={!!errors[q.field]}
                    />
                  )}
                  {q.type === 'checkbox' && (
                    <CheckboxGroup
                      name={q.field}
                      options={q.options}
                      value={formData[q.field] || []}
                      onChange={(val) => handleChange(q.field, val)}
                      error={!!errors[q.field]}
                    />
                  )}
                  {(q.type === 'text' || q.type === 'tel' || q.type === 'textarea') && (
                    <TextInput
                      name={q.field}
                      type={q.type}
                      value={formData[q.field] || ''}
                      onChange={(val) => handleChange(q.field, val)}
                      placeholder={`Masukkan ${q.label.toLowerCase()}`}
                      error={!!errors[q.field]}
                    />
                  )}
                  {errors[q.field] && (
                    <p className="text-red-500 text-sm mt-2 font-medium">{errors[q.field]}</p>
                  )}

                  {/* Conditional Field Rendering */}
                  {q.conditionalField && formData[q.field] === q.conditionalField.parentValue && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100 animate-in fade-in slide-in-from-top-2">
                      <label className="block text-sm font-semibold text-charcoal mb-2">
                        {q.conditionalField.label} {q.conditionalField.required && <span className="text-red-500">*</span>}
                      </label>
                      <TextInput
                        name={q.conditionalField.field}
                        type={q.conditionalField.type}
                        value={formData[q.conditionalField.field] || ''}
                        onChange={(val) => handleChange(q.conditionalField.field, val)}
                        error={!!errors[q.conditionalField.field]}
                      />
                      {errors[q.conditionalField.field] && (
                        <p className="text-red-500 text-sm mt-2 font-medium">{errors[q.conditionalField.field]}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex items-center justify-between pt-6 border-t border-gray-100">
            <button
              onClick={handleBack}
              disabled={currentSection === 0 || isSubmitting}
              className={`px-6 py-3 font-semibold rounded-lg transition-colors ${
                currentSection === 0
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-charcoal border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              Sebelumnya
            </button>
            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className="flex items-center justify-center min-w-[140px] bg-pxchange-teal hover:bg-[#009CBD] text-white font-semibold py-3 px-8 rounded-lg shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : currentSection === surveyQuestions.length - 1 ? (
                'Kirim Survey'
              ) : (
                'Selanjutnya'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
