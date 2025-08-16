import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLoginUserMutation, useRegisterUserMutation } from '@/features/api/authApi';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/features/authslice';

const Login = () => {
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [signupName, setSignupName] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [loginUser, { data: loginData, isLoading: isLoginLoading, isSuccess: isLoginSuccess, isError: isLoginError, error: loginError }] = useLoginUserMutation();
    const [registerUser, { data: registerData, isLoading: isRegisterLoading, isSuccess: isRegisterSuccess, isError: isRegisterError, error: registerError }] = useRegisterUserMutation();

    const loginHandler = async (e) => {
        e.preventDefault();
        await loginUser({ email: loginEmail, password: loginPassword });
    };

    const registerHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', signupName);
        formData.append('email', signupEmail);
        formData.append('password', signupPassword);
        await registerUser(formData);
    };

    useEffect(() => {
        if (isLoginSuccess) {
            toast.success(loginData?.message || "Login Successful!");
            dispatch(setCredentials(loginData));
            navigate('/');
        }
        if (isLoginError) {
            toast.error(loginError?.data?.message || "Login failed. Please try again.");
        }
    }, [isLoginSuccess, isLoginError, loginData, loginError, navigate, dispatch]);

    useEffect(() => {
        if (isRegisterSuccess) {
            toast.success(registerData?.message || "Registration Successful!");
            dispatch(setCredentials(registerData));
            navigate('/');
        }
        if (isRegisterError) {
            toast.error(registerError?.data?.message || "Registration failed. Please try again.");
        }
    }, [isRegisterSuccess, isRegisterError, registerData, registerError, navigate, dispatch]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#101828] p-4">
            <Tabs defaultValue="login" className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                {/* Login Tab */}
                <TabsContent value="login">
                    <Card className="bg-gray-900 border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-white">Welcome Back</CardTitle>
                            <CardDescription className="text-gray-400">
                                Enter your credentials to access your account.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <form onSubmit={loginHandler} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="login-email" className="text-gray-300">Email</Label>
                                    <Input id="login-email" type="email" placeholder="m@example.com" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="bg-gray-800 border-gray-600 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="login-password" className="text-gray-300">Password</Label>
                                    <Input id="login-password" type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="bg-gray-800 border-gray-600 text-white" />
                                </div>
                                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoginLoading}>
                                    {isLoginLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Login
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Signup Tab */}
                <TabsContent value="signup">
                    <Card className="bg-gray-900 border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-white">Create an Account</CardTitle>
                            <CardDescription className="text-gray-400">
                                Enter your information to create a new account.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <form onSubmit={registerHandler} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="signup-name" className="text-gray-300">Name</Label>
                                    <Input id="signup-name" placeholder="Your Name" value={signupName} onChange={(e) => setSignupName(e.target.value)} className="bg-gray-800 border-gray-600 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signup-email" className="text-gray-300">Email</Label>
                                    <Input id="signup-email" type="email" placeholder="m@example.com" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} className="bg-gray-800 border-gray-600 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signup-password" className="text-gray-300">Password</Label>
                                    <Input id="signup-password" type="password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} className="bg-gray-800 border-gray-600 text-white" />
                                </div>
                                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isRegisterLoading}>
                                    {isRegisterLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Sign Up
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Login;