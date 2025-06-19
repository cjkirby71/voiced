import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const SuggestionForm = ({ onSubmit = () => {} }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = [
    { value: '', label: 'Select Category' },
    { value: 'federal-policy', label: 'Federal Policy' },
    { value: 'local-issues', label: 'Local Issues' },
    { value: 'investigative-requests', label: 'Investigative Requests' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'economy', label: 'Economy' },
    { value: 'environment', label: 'Environment' },
    { value: 'education', label: 'Education' }
  ];

  const priorities = [
    { value: '', label: 'Select Priority' },
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const maxTitleLength = 100;
  const maxDescriptionLength = 500;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > maxTitleLength) {
      newErrors.title = `Title must be ${maxTitleLength} characters or less`;
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > maxDescriptionLength) {
      newErrors.description = `Description must be ${maxDescriptionLength} characters or less`;
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.priority) {
      newErrors.priority = 'Priority level is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setShowSuccess(true);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      category: '',
      priority: ''
    });

    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
      onSubmit();
    }, 3000);
  };

  if (showSuccess) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="CheckCircle" size={32} className="text-success" />
        </div>
        <h3 className="text-lg font-heading font-semibold text-text-primary mb-2">
          Suggestion Submitted!
        </h3>
        <p className="text-text-secondary">
          Your topic suggestion has been added to the community feed for voting.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title Input */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-text-primary mb-2">
          Topic Title *
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="Enter a clear, concise topic title..."
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm ${
            errors.title ? 'border-error' : 'border-border'
          }`}
          maxLength={maxTitleLength}
        />
        <div className="flex justify-between items-center mt-1">
          {errors.title && (
            <span className="text-xs text-error">{errors.title}</span>
          )}
          <span className={`text-xs ml-auto ${
            formData.title.length > maxTitleLength * 0.9 ? 'text-warning' : 'text-text-muted'
          }`}>
            {formData.title.length}/{maxTitleLength}
          </span>
        </div>
      </div>

      {/* Description Textarea */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-text-primary mb-2">
          Description *
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Provide details about why this topic is important and what specific aspects should be addressed..."
          rows={4}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm resize-none ${
            errors.description ? 'border-error' : 'border-border'
          }`}
          maxLength={maxDescriptionLength}
        />
        <div className="flex justify-between items-center mt-1">
          {errors.description && (
            <span className="text-xs text-error">{errors.description}</span>
          )}
          <span className={`text-xs ml-auto ${
            formData.description.length > maxDescriptionLength * 0.9 ? 'text-warning' : 'text-text-muted'
          }`}>
            {formData.description.length}/{maxDescriptionLength}
          </span>
        </div>
      </div>

      {/* Category Dropdown */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-text-primary mb-2">
          Category *
        </label>
        <select
          id="category"
          value={formData.category}
          onChange={(e) => handleInputChange('category', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm ${
            errors.category ? 'border-error' : 'border-border'
          }`}
        >
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
        {errors.category && (
          <span className="text-xs text-error mt-1 block">{errors.category}</span>
        )}
      </div>

      {/* Priority Dropdown */}
      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-text-primary mb-2">
          Priority Level *
        </label>
        <select
          id="priority"
          value={formData.priority}
          onChange={(e) => handleInputChange('priority', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm ${
            errors.priority ? 'border-error' : 'border-border'
          }`}
        >
          {priorities.map((priority) => (
            <option key={priority.value} value={priority.value}>
              {priority.label}
            </option>
          ))}
        </select>
        {errors.priority && (
          <span className="text-xs text-error mt-1 block">{errors.priority}</span>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
      >
        {isSubmitting ? (
          <>
            <Icon name="Loader2" size={20} className="animate-spin" />
            <span>Submitting...</span>
          </>
        ) : (
          <>
            <Icon name="Send" size={20} />
            <span>Submit Suggestion</span>
          </>
        )}
      </button>

      {/* Help Text */}
      <div className="bg-secondary-50 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={16} className="text-secondary-500 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-text-secondary">
            <p className="font-medium mb-1">Submission Guidelines:</p>
            <ul className="space-y-1">
              <li>• Be specific and constructive in your suggestions</li>
              <li>• Focus on issues that affect the broader community</li>
              <li>• Check existing suggestions before submitting duplicates</li>
              <li>• Maintain respectful and professional language</li>
            </ul>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SuggestionForm;