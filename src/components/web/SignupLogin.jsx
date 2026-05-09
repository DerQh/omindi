import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  font-family: "Dosis", sans-serif;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const LogoContainer = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: inherit;
  margin-bottom: 20px;
`;

const Logo = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  cursor: pointer;
`;

const Title = styled.h1`
  margin: 0;
  color: #2f5a2a;
  font-size: 2.2rem;
`;

const AuthContainer = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(47, 90, 42, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 400px;
`;

const AuthHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;

  h2 {
    margin: 0 0 10px;
    color: #2f5a2a;
    font-size: 1.8rem;
  }

  p {
    margin: 0;
    color: #5b6d57;
    font-size: 14px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-weight: 600;
    color: #2f5a2a;
    font-size: 14px;
  }

  .input-container {
    position: relative;
  }

  input {
    padding: 14px 16px;
    border: 2px solid #e8f0e8;
    border-radius: 12px;
    font-size: 16px;
    color: #243a20;
    background: #fafcfa;
    transition: all 0.3s ease;
    width: 100%;

    &:focus {
      outline: none;
      border-color: #2f5a2a;
      background: white;
      box-shadow: 0 0 0 3px rgba(47, 90, 42, 0.1);
    }

    &::placeholder {
      color: #9ba89b;
    }

    ${({ hasError }) =>
      hasError &&
      `
      border-color: #dc3545;
      background: #fff5f5;

      &:focus {
        border-color: #dc3545;
        box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
      }
    `}
  }

  .password-toggle {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #9ba89b;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: color 0.2s ease;

    &:hover {
      color: #2f5a2a;
    }

    svg {
      width: 20px;
      height: 20px;
    }
  }

  .error-message {
    color: #dc3545;
    font-size: 12px;
    margin-top: 4px;
    display: flex;
    align-items: center;
    gap: 4px;

    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

const SubmitButton = styled.button`
  padding: 16px;
  background: linear-gradient(135deg, #2f5a2a 0%, #3d7a3d 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #245026 0%, #2f5a2a 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(47, 90, 42, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #f5c6cb;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
`;

const ToggleText = styled.p`
  text-align: center;
  margin: 20px 0 0;
  color: #5b6d57;
  font-size: 14px;

  span {
    color: #2f5a2a;
    cursor: pointer;
    font-weight: 600;
    text-decoration: underline;

    &:hover {
      color: #1e3a1e;
    }
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: #2f5a2a;
  }

  label {
    font-size: 14px;
    color: #5b6d57;
    cursor: pointer;
  }
`;

const ForgotPassword = styled.a`
  color: #2f5a2a;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 20px;
  display: inline-block;

  &:hover {
    text-decoration: underline;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 20px 0;
  color: #9ba89b;
  font-size: 14px;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background-color: #e8f0e8;
  }

  &::before {
    margin-right: 10px;
  }

  &::after {
    margin-left: 10px;
  }
`;

function SignupLogin() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!isLogin) {
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email";
      }

      if (!formData.confirmPassword.trim()) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (isLogin) {
        // Handle login logic
        console.log("Login:", {
          username: formData.username,
          password: formData.password,
        });
        alert("Login successful!");
      } else {
        // Handle signup logic
        console.log("Signup:", formData);
        alert("Account created successfully!");
      }
    } catch {
      setErrors({ submit: "Something went wrong. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
  };

  return (
    <MainContainer>
      <LogoContainer to="/">
        <Logo src="/logo1.jpg" alt="Logo" />
        <Title>AFARMER</Title>
      </LogoContainer>

      <AuthContainer>
        <AuthHeader>
          <h2>{isLogin ? "Welcome Back!" : "Join Our Community"}</h2>
          <p>
            {isLogin ? "Sign in to your account" : "Create your farmer account"}
          </p>
        </AuthHeader>

        {errors.submit && (
          <ErrorMessage>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                opacity="0"
              />
              <path d="M13 17h-2v-6h2v6zm0-8h-2V7h2v2z" />
            </svg>
            {errors.submit}
          </ErrorMessage>
        )}

        <Form onSubmit={handleSubmit}>
          <InputGroup hasError={!!errors.username}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter your username"
              required
            />
            {errors.username && (
              <div className="error-message">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                    opacity="0"
                  />
                  <path d="M13 17h-2v-6h2v6zm0-8h-2V7h2v2z" />
                </svg>
                {errors.username}
              </div>
            )}
          </InputGroup>

          {!isLogin && (
            <InputGroup hasError={!!errors.email}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
              />
              {errors.email && (
                <div className="error-message">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                      opacity="0"
                    />
                    <path d="M13 17h-2v-6h2v6zm0-8h-2V7h2v2z" />
                  </svg>
                  {errors.email}
                </div>
              )}
            </InputGroup>
          )}

          <InputGroup hasError={!!errors.password}>
            <label htmlFor="password">Password</label>
            <div className="input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92 1.11-1.11c1.73-4.39 6-7.5 11-7.5-1.73-4.39-6-7.5-11-7.5-1.55 0-3.03.3-4.38.84l.42.42c.65-.31 1.35-.52 2.08-.52z" />
                    <path d="M2.81 2.81 1.39 4.22l2.27 2.27C2.61 8.07 2 9.96 2 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42c-1.51.76-3.18 1.17-4.92 1.17-5 0-9.27-3.11-11-7.5 1.73-4.39 6-7.5 11-7.5 1.55 0 3.03.3 4.38.84l.42-.42C15.03 3.3 13.45 3 12 3c-2.76 0-5 2.24-5 5 0 .57.11 1.11.31 1.61L7.31 9.61C7.11 9.25 7 8.64 7 8c0-1.66 1.34-3 3-3 .74 0 1.41.21 1.97.56l2.92-2.92L2.81 2.81z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <div className="error-message">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                    opacity="0"
                  />
                  <path d="M13 17h-2v-6h2v6zm0-8h-2V7h2v2z" />
                </svg>
                {errors.password}
              </div>
            )}
          </InputGroup>

          {isLogin && (
            <>
              <CheckboxGroup>
                <input type="checkbox" id="remember" name="remember" />
                <label htmlFor="remember">Remember me</label>
              </CheckboxGroup>
              <ForgotPassword href="#" onClick={(e) => e.preventDefault()}>
                Forgot your password?
              </ForgotPassword>
            </>
          )}

          {!isLogin && (
            <InputGroup hasError={!!errors.confirmPassword}>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-container">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92 1.11-1.11c1.73-4.39 6-7.5 11-7.5-1.73-4.39-6-7.5-11-7.5-1.55 0-3.03.3-4.38.84l.42.42c.65-.31 1.35-.52 2.08-.52z" />
                      <path d="M2.81 2.81 1.39 4.22l2.27 2.27C2.61 8.07 2 9.96 2 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42c-1.51.76-3.18 1.17-4.92 1.17-5 0-9.27-3.11-11-7.5 1.73-4.39 6-7.5 11-7.5 1.55 0 3.03.3 4.38.84l.42-.42C15.03 3.3 13.45 3 12 3c-2.76 0-5 2.24-5 5 0 .57.11 1.11.31 1.61L7.31 9.61C7.11 9.25 7 8.64 7 8c0-1.66 1.34-3 3-3 .74 0 1.41.21 1.97.56l2.92-2.92L2.81 2.81z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <div className="error-message">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                      opacity="0"
                    />
                    <path d="M13 17h-2v-6h2v6zm0-8h-2V7h2v2z" />
                  </svg>
                  {errors.confirmPassword}
                </div>
              )}
            </InputGroup>
          )}

          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="spinner"></div>
                {isLogin ? "Signing In..." : "Creating Account..."}
              </>
            ) : isLogin ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </SubmitButton>
        </Form>

        <Divider>or</Divider>

        <ToggleText>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={toggleMode}>
            {isLogin ? "Sign up now!" : "Sign in here"}
          </span>
        </ToggleText>
      </AuthContainer>
    </MainContainer>
  );
}

export default SignupLogin;
