import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import SubscriptionCard from './components/SubscriptionCard';
import CurrentSubscriptionStatus from './components/CurrentSubscriptionStatus';
import PaymentMethodModal from './components/PaymentMethodModal';
import ConfirmationModal from './components/ConfirmationModal';

const SubscriptionManagement = () => {
  const [currentTier, setCurrentTier] = useState('Free');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock subscription data
  const subscriptionData = {
    currentTier: 'Free',
    renewalDate: '2024-12-15',
    articlesRead: 1,
    pollsParticipated: 3,
    monthlyLimit: {
      articles: 1,
      polls: 'unlimited'
    }
  };

  const subscriptionTiers = [
    {
      id: 'free',
      name: 'Free Tier',
      price: 0,
      period: 'forever',
      description: 'Basic access to polls and limited articles',
      features: [
        { name: 'Unlimited poll participation', included: true },
        { name: '1 article per month', included: true },
        { name: 'Basic community feedback', included: true },
        { name: 'Representative contact info', included: true },
        { name: 'Full journalism hub access', included: false },
        { name: 'Premium poll insights', included: false },
        { name: 'Priority support', included: false },
        { name: 'Advanced bias analysis', included: false }
      ],
      buttonText: 'Current Plan',
      buttonVariant: 'secondary',
      popular: false
    },
    {
      id: 'national',
      name: 'National Tier',
      price: 5,
      period: 'month',
      description: 'Full platform access with premium features',
      features: [
        { name: 'Unlimited poll participation', included: true },
        { name: 'Unlimited article access', included: true },
        { name: 'Full community feedback access', included: true },
        { name: 'Representative contact info', included: true },
        { name: 'Full journalism hub access', included: true },
        { name: 'Premium poll insights', included: true },
        { name: 'Priority support', included: true },
        { name: 'Advanced bias analysis', included: true }
      ],
      buttonText: 'Upgrade Now',
      buttonVariant: 'primary',
      popular: true
    }
  ];

  const handleSubscriptionChange = (tier) => {
    setSelectedTier(tier);
    if (tier.id === 'national' && currentTier === 'Free') {
      setShowPaymentModal(true);
    } else {
      setShowConfirmationModal(true);
    }
  };

  const handlePaymentSubmit = async (paymentData) => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setShowPaymentModal(false);
    setCurrentTier('National');
    setShowConfirmationModal(true);
  };

  const handleConfirmationClose = () => {
    setShowConfirmationModal(false);
    setSelectedTier(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="CreditCard" size={24} color="white" />
            </div>
            <div>
              <h1 className="text-3xl font-heading font-bold text-text-primary">
                Subscription Management
              </h1>
              <p className="text-text-secondary mt-1">
                Manage your Voiced platform access and billing
              </p>
            </div>
          </div>
        </div>

        {/* Current Subscription Status */}
        <CurrentSubscriptionStatus 
          subscriptionData={subscriptionData}
          currentTier={currentTier}
        />

        {/* Subscription Tiers */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-heading font-bold text-text-primary mb-4">
              Choose Your Access Level
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Select the tier that best fits your civic engagement needs. 
              Upgrade or downgrade anytime with transparent pricing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {subscriptionTiers.map((tier) => (
              <SubscriptionCard
                key={tier.id}
                tier={tier}
                currentTier={currentTier}
                onSelect={handleSubscriptionChange}
              />
            ))}
          </div>
        </div>

        {/* Features Comparison */}
        <div className="bg-surface rounded-lg border border-border p-6 mb-8">
          <h3 className="text-xl font-heading font-semibold text-text-primary mb-6">
            Feature Comparison
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-text-primary">
                    Feature
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-text-primary">
                    Free Tier
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-text-primary">
                    National Tier
                  </th>
                </tr>
              </thead>
              <tbody>
                {subscriptionTiers[0].features.map((feature, index) => (
                  <tr key={index} className="border-b border-border last:border-b-0">
                    <td className="py-3 px-4 text-text-secondary">
                      {feature.name}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {subscriptionTiers[0].features[index].included ? (
                        <Icon name="Check" size={20} className="text-success mx-auto" />
                      ) : (
                        <Icon name="X" size={20} className="text-text-muted mx-auto" />
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {subscriptionTiers[1].features[index].included ? (
                        <Icon name="Check" size={20} className="text-success mx-auto" />
                      ) : (
                        <Icon name="X" size={20} className="text-text-muted mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-surface rounded-lg border border-border p-6">
          <h3 className="text-xl font-heading font-semibold text-text-primary mb-6">
            Frequently Asked Questions
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-text-primary mb-2">
                Can I cancel my subscription anytime?
              </h4>
              <p className="text-text-secondary text-sm">
                Yes, you can cancel your National Tier subscription at any time. 
                You'll continue to have access until the end of your billing period.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-text-primary mb-2">
                What happens if I exceed my Free Tier limits?
              </h4>
              <p className="text-text-secondary text-sm">
                You'll be prompted to upgrade to the National Tier to continue accessing articles. 
                Poll participation remains unlimited on all tiers.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-text-primary mb-2">
                How is billing handled?
              </h4>
              <p className="text-text-secondary text-sm">
                National Tier subscriptions are billed monthly at $5.00. 
                All payments are processed securely and you'll receive email confirmations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentMethodModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSubmit={handlePaymentSubmit}
        selectedTier={selectedTier}
        isProcessing={isProcessing}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmationModal}
        onClose={handleConfirmationClose}
        tier={selectedTier}
        currentTier={currentTier}
      />
    </div>
  );
};

export default SubscriptionManagement;