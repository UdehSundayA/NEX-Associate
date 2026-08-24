/**
 * NEX ASSOCIATE - Teacher Onboarding & Per-Subject Billing Engine
 * Nexus Learning Platform
 */

const NEX_TEACHER_BILLING = {
  pricingConfig: {
    currency: 'NGN',
    currencySymbol: '₦',
    baseRatePerSubject: 1500, // ₦1,500 per subject per month
    usdRatePerSubject: 3.00,   // $3.00 USD per subject per month
    discountTiers: [
      { minSubjects: 1, maxSubjects: 2, discountPercent: 0 },
      { minSubjects: 3, maxSubjects: 4, discountPercent: 10 },
      { minSubjects: 5, maxSubjects: 99, discountPercent: 20 }
    ]
  },

  calculateBilling(subjectCount, currency = 'NGN') {
    if (subjectCount <= 0) {
      return {
        subjectCount: 0,
        subtotal: 0,
        discountPercent: 0,
        discountAmount: 0,
        totalMonthly: 0,
        perSubjectEffectiveRate: 0,
        currencySymbol: currency === 'USD' ? '$' : '₦',
        formattedSubtotal: `${currency === 'USD' ? '$' : '₦'}0`,
        formattedDiscount: `${currency === 'USD' ? '$' : '₦'}0`,
        formattedTotalMonthly: `${currency === 'USD' ? '$' : '₦'}0`,
        formattedEffectiveRate: `${currency === 'USD' ? '$' : '₦'}0`
      };
    }

    const rate = currency === 'USD' ? this.pricingConfig.usdRatePerSubject : this.pricingConfig.baseRatePerSubject;
    const symbol = currency === 'USD' ? '$' : '₦';

    let discountPercent = 0;
    for (const tier of this.pricingConfig.discountTiers) {
      if (subjectCount >= tier.minSubjects && subjectCount <= tier.maxSubjects) {
        discountPercent = tier.discountPercent;
        break;
      }
    }

    const subtotal = subjectCount * rate;
    const discountAmount = (subtotal * discountPercent) / 100;
    const totalMonthly = subtotal - discountAmount;
    const perSubjectEffectiveRate = totalMonthly / subjectCount;

    return {
      subjectCount,
      subtotal,
      discountPercent,
      discountAmount,
      totalMonthly,
      perSubjectEffectiveRate,
      currencySymbol: symbol,
      formattedSubtotal: `${symbol}${subtotal.toLocaleString()}`,
      formattedDiscount: `${symbol}${discountAmount.toLocaleString()}`,
      formattedTotalMonthly: `${symbol}${totalMonthly.toLocaleString()}`,
      formattedEffectiveRate: `${symbol}${perSubjectEffectiveRate.toFixed(2)}`
    };
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = NEX_TEACHER_BILLING;
}
