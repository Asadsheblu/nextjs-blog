const jwt = require('jsonwebtoken');

function generateToken(user) {
  const payload = {
    id: user._id,
    role: user.role,
    username: user.username, // or any other essential info
    profileImage: user.profileImage,
  };

  const token = jwt.sign(payload, process.env.NEXT_PUBLIC_JWT_SECRET, {
    expiresIn: '1h' // set appropriate expiration time
  });

  return token;
}

// Example usage:
const user = {
  _id: '12345',
  role: 'admin', // or 'user'
  username: 'microtersDev',
  profileImage: 'short-base64-encoded-image-data'
};

const token = generateToken(user);
console.log(token);
