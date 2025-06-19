import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const PaymentMethodModal = ({ isOpen, onClose, onSubmit, selectedTier, isProcessing }) => {
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!paymentData.cardNumber || paymentData.cardNumber.length < 16) {
      newErrors.cardNumber = 'Valid card number required';
    }
    if (!paymentData.expiryDate || !/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)) {
      newErrors.expiryDate = 'Valid expiry date required (MM/YY)';
    }
    if (!paymentData.cvv || paymentData.cvv.length < 3) {
      newErrors.cvv = 'Valid CVV required';
    }
    if (!paymentData.cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(paymentData);
    }
  };

  const handleInputChange = (field, value) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-200 transition-opacity duration-300" />
      
      {/* Modal */}
      <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
        <div className="bg-surface rounded-lg shadow-civic-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2 className="text-lg font-heading font-semibold text-text-primary">
                Payment Information
              </h2>
              <p className="text-sm text-text-secondary mt-1">
                Upgrade to {selectedTier?.name}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-secondary-100 transition-colors duration-200"
            >
              <Icon name="X" size={20} />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Order Summary */}
            <div className="bg-secondary-50 rounded-lg p-4">
              <h3 className="font-medium text-text-primary mb-2">Order Summary</h3>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">{selectedTier?.name}</span>
                <span className="font-medium text-text-primary">${selectedTier?.price}.00/month</span>
              </div>
              <div className="border-t border-border mt-2 pt-2">
                <div className="flex justify-between items-center font-medium">
                  <span className="text-text-primary">Total</span>
                  <span className="text-text-primary">${selectedTier?.price}.00/month</span>
                </div>
              </div>
            </div>

            {/* Card Information */}
            <div className="space-y-4">
              <h3 className="font-medium text-text-primary">Card Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  value={paymentData.cardNumber}
                  onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.cardNumber ? 'border-accent' : 'border-border'
                  }`}
                />
                {errors.cardNumber && (
                  <p className="text-xs text-accent mt-1">{errors.cardNumber}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={paymentData.expiryDate}
                    onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                    placeholder="MM/YY"
                    maxLength="5"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.expiryDate ? 'border-accent' : 'border-border'
                    }`}
                  />
                  {errors.expiryDate && (
                    <p className="text-xs text-accent mt-1">{errors.expiryDate}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={paymentData.cvv}
                    onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, '').substring(0, 4))}
                    placeholder="123"
                    maxLength="4"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.cvv ? 'border-accent' : 'border-border'
                    }`}
                  />
                  {errors.cvv && (
                    <p className="text-xs text-accent mt-1">{errors.cvv}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={paymentData.cardholderName}
                  onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                  placeholder="John Doe"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.cardholderName ? 'border-accent' : 'border-border'
                  }`}
                />
                {errors.cardholderName && (
                  <p className="text-xs text-accent mt-1">{errors.cardholderName}</p>
                )}
              </div>
            </div>

            {/* Security Notice */}
            <div className="flex items-start space-x-2 p-3 bg-success-50 rounded-lg">
              <Icon name="Shield" size={16} className="text-success flex-shrink-0 mt-0.5" />
              <div className="text-xs text-success">
                <p className="font-medium">Secure Payment</p>
                <p>Your payment information is encrypted and secure.</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-border rounded-lg text-text-secondary hover:bg-secondary-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <Icon name="Loader2" size={16} className="animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Icon name="CreditCard" size={16} />
                    <span>Subscribe ${selectedTier?.price}/month</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default PaymentMethodModal;