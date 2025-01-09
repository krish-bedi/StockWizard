function generatePassword() {
  const length = 8;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  let password = "";

  function getRandomChar(set: any) {
    return set[Math.floor(Math.random() * set.length)];
  }

  // Ensure password contains at least one uppercase, one lowercase, one number, and one special character
  const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowerCase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const specialChars = "!@#$%^&*()";

  password += getRandomChar(upperCase);
  password += getRandomChar(lowerCase);
  password += getRandomChar(numbers);
  password += getRandomChar(specialChars);

  // Generate remaining characters randomly
  for (let i = password.length; i < length; i++) {
    password += getRandomChar(charset);
  }

  // Shuffle the password to ensure randomness
  password = password
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");

  return password;
}

export default generatePassword;
