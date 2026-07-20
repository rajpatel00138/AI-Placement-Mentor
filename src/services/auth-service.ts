export async function loginWithCredentials(email: string, password: string) {
  return {
    success: email.includes("@") && password.length >= 6,
    message: email.includes("@") && password.length >= 6 ? "Demo login successful" : "Invalid credentials",
  };
}
