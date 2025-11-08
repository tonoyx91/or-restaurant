module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'replace_this_with_a_strong_secret',
  vatPercent: 5, // VAT percent
  platformFee: 40 // fixed platform fee in Tk
};
