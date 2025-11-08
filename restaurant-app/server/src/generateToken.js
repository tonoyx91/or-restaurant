const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Sample user payload
const payload = { 
  id: "123456789", 
  name: "Test User",
  email: "test@example.com"
};

// Get secret from .env
const secret = process.env.JWT_SECRET;

if (!secret) {
  console.error("❌ JWT_SECRET not found in .env file");
  process.exit(1);
}

// Create token valid for 7 days
const token = jwt.sign(payload, secret, { expiresIn: "7d" });

console.log("\n✅ Generated JWT Token:");
console.log(token);

// Verify the token
try {
  const decoded = jwt.verify(token, secret);
  console.log("\n✅ Decoded payload:");
  console.log(decoded);
  
  // Show when the token expires
  console.log("\n⏰ Token expires:", new Date(decoded.exp * 1000).toLocaleString());
} catch (err) {
  console.error("\n❌ Token verification failed:", err.message);
}