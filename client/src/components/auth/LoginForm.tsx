import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FcGoogle, 
  FcCallback 
} from "react-icons/fc";
import { 
  SiFacebook 
} from "react-icons/si";
import { 
  Mail, 
  Lock, 
  User, 
  Wallet, 
  ArrowRight,
  Loader2
} from "lucide-react";

export default function LoginForm() {
  const { 
    login, 
    register, 
    loginWithGoogle, 
    loginWithFacebook, 
    loginWithMetaMask, 
    loginWithCoinbase,
    forgotPassword,
    isLoading 
  } = useAuth();
  
  // Login state
  const [loginData, setLoginData] = useState({
    username: "",
    password: ""
  });
  
  // Registration state
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    role: "customer"
  });
  
  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const result = await login(loginData.username, loginData.password);
      if (!result.success) {
        setError(result.error?.message || "Login failed");
      }
    } catch (error) {
      setError("An error occurred during login");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (registerData.password !== registerData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (registerData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    
    setIsSubmitting(true);

    try {
      const result = await register({
        username: registerData.username,
        email: registerData.email,
        password: registerData.password,
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        role: registerData.role
      });
      
      if (!result.success) {
        setError(result.error?.message || "Registration failed");
      } else {
        setSuccess("Account created successfully!");
      }
    } catch (error) {
      setError("An error occurred during registration");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const result = await forgotPassword(forgotEmail);
      if (result.success) {
        setSuccess("Password reset email sent! Check your inbox.");
        setShowForgotPassword(false);
      } else {
        setError(result.error?.message || "Failed to send reset email");
      }
    } catch (error) {
      setError("An error occurred while sending reset email");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setError("");
    setIsSubmitting(true);

    try {
      let result;
      switch (provider) {
        case 'google':
          result = await loginWithGoogle();
          break;
        case 'facebook':
          result = await loginWithFacebook();
          break;
        case 'metamask':
          result = await loginWithMetaMask();
          break;
        case 'coinbase':
          result = await loginWithCoinbase();
          break;
        default:
          setError("Unsupported login provider");
          return;
      }
      
      if (!result.success) {
        setError(result.error?.message || `${provider} login failed`);
      }
    } catch (error) {
      setError(`Failed to login with ${provider}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hero Section */}
        <div className="hidden lg:flex flex-col justify-center space-y-6 p-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Welcome to FastBite Pro
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              The future of food delivery powered by Web3 technology
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">Fair wages and full benefits for drivers</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">AI-powered delivery optimization</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">Blockchain transparency and security</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">Community-driven governance</span>
              </div>
            </div>
          </div>
        </div>

        {/* Authentication Forms */}
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Access Your Account
            </CardTitle>
            <CardDescription className="text-center">
              Choose your preferred login method
            </CardDescription>
          </CardHeader>
          <CardContent>
            {showForgotPassword ? (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="forgotEmail">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="forgotEmail"
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                {success && (
                  <Alert>
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending Reset Email...
                      </>
                    ) : (
                      "Send Reset Email"
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowForgotPassword(false)}
                  >
                    Back to Login
                  </Button>
                </div>
              </form>
            ) : (
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="space-y-4">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="username"
                          type="text"
                          value={loginData.username}
                          onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                          placeholder="Enter your username"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="password"
                          type="password"
                          value={loginData.password}
                          onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                          placeholder="Enter your password"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Button
                        type="button"
                        variant="link"
                        className="px-0 text-sm"
                        onClick={() => setShowForgotPassword(true)}
                      >
                        Forgot password?
                      </Button>
                    </div>
                    
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Logging in...
                        </>
                      ) : (
                        <>
                          Login
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="register" className="space-y-4">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          type="text"
                          value={registerData.firstName}
                          onChange={(e) => setRegisterData({...registerData, firstName: e.target.value})}
                          placeholder="First name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          type="text"
                          value={registerData.lastName}
                          onChange={(e) => setRegisterData({...registerData, lastName: e.target.value})}
                          placeholder="Last name"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="regUsername">Username</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="regUsername"
                          type="text"
                          value={registerData.username}
                          onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                          placeholder="Choose a username"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          value={registerData.email}
                          onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                          placeholder="Enter your email"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="regPassword">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="regPassword"
                          type="password"
                          value={registerData.password}
                          onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                          placeholder="Create a password"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={registerData.confirmPassword}
                          onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                          placeholder="Confirm your password"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    
                    {success && (
                      <Alert>
                        <AlertDescription>{success}</AlertDescription>
                      </Alert>
                    )}
                    
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        <>
                          Create Account
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            )}
            
            {!showForgotPassword && (
              <>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>
                
                {/* Social Login Options */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleSocialLogin('google')}
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      <FcGoogle className="mr-2 h-4 w-4" />
                      Google
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleSocialLogin('facebook')}
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      <SiFacebook className="mr-2 h-4 w-4 text-blue-600" />
                      Facebook
                    </Button>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="text-center text-sm text-muted-foreground mb-3">
                    <Wallet className="inline mr-1 h-4 w-4" />
                    Web3 Wallet Login
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleSocialLogin('metamask')}
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      <Wallet className="mr-2 h-4 w-4 text-orange-500" />
                      MetaMask
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleSocialLogin('coinbase')}
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      <FcCallback className="mr-2 h-4 w-4" />
                      Coinbase
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}