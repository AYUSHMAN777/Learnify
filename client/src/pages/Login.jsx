// import { AppWindowIcon, CodeIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useRegisterUserMutation } from '../features/api/authApi'
import { useLoginUserMutation } from '../features/api/authApi'
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
const Login = () => {
  const [signupinput, setSignupinput] = useState({ name: "", email: "", password: "" });
  const [logininput, setLogininput] = useState({ email: "", password: "" });

  const [registerUser, {
    data: RegisterData,
    error: RegisterError,
    isLoading: RegisterIsLoading,
    isSuccess: RegisterIsSuccess }] = useRegisterUserMutation(); //Trigger an API call.
  const [LoginUser, {
    data: LoginData,
    error: LoginError,
    isLoading: LoginIsLoading,
    isSuccess: LoginIsSuccess, }] = useLoginUserMutation();
    const navigate=useNavigate();


  const changeInputhandler = (e, type) => {
    const { name, value } = e.target;
    if (type === "signup") {
      setSignupinput({ ...signupinput, [name]: value });//It updates the formdata(signinput) state without overwriting other fields using ...formData. & value is the value of the input field(what was typed in the input field) &[name] is the name of the input field (name, email, password) which is used to update the specific field in the formdata state.
    }
    else {
      setLogininput({ ...logininput, [name]: value });
    }
  };
  const handleRegistration = (type) => {
    const Inputdata = type === "signup" ? signupinput : logininput;
    const action = type === "signup" ? registerUser : LoginUser;  //Calls the relevant API mutation with the correct input data.
    action(Inputdata);
    console.log("Inputdata", Inputdata);
  };

  useEffect(() => {
    if (RegisterIsSuccess && RegisterData) {
      toast.success(RegisterData?.message || `Registration Successful!`);
      navigate('/'); // Redirect to the home page after successful registration
    }
    if (LoginIsSuccess && LoginData) {
      toast.success(LoginData?.message || `Login Successful! Welcome back`);
      navigate('/'); // Redirect to the home page after successful login
    }
    if (RegisterError) {
      toast.error(RegisterError?.data?.message || `Registration Failed!`);
    }
    if (LoginError) {
      toast.error(LoginError?.data?.message || `Login Failed!`);
    }


  }, [LoginIsLoading, RegisterIsLoading, LoginData, RegisterData, LoginError, RegisterError]);
  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-[#101828]">
      <div className="w-full max-w-sm flex flex-col gap-6 mt-5">
        <Tabs defaultValue="signup">
          <TabsList>
            <TabsTrigger value="signup">SignUp</TabsTrigger>
            <TabsTrigger value="login">Login</TabsTrigger>
          </TabsList>
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>SignUp</CardTitle>
                <CardDescription>
                  Enter Username And Password to SignUp
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    handleRegistration("signup");
                  }}
                  className="grid gap-6"
                >
                  <div className="grid gap-3">
                    <Label htmlFor="signup-name">Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder='Enter your Name'
                      onChange={e => changeInputhandler(e, "signup")}
                      name="name"
                      value={signupinput.name}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder='Enter your Email'
                      onChange={e => changeInputhandler(e, "signup")}
                      name="email"
                      value={signupinput.email}
                      autoComplete="email"
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      name="password"
                      value={signupinput.password}
                      type="password"
                      placeholder='Enter your Password'
                      onChange={e => changeInputhandler(e, "signup")}
                      autoComplete="new-password"
                    />
                  </div>
                  <CardFooter>
                    <Button disabled={RegisterIsLoading} type="submit">
                      {RegisterIsLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />Please Wait
                        </>
                      ) : "SignUp"}
                    </Button>
                  </CardFooter>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                  Enter Your Email And Password to Login
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    handleRegistration("login");
                  }}
                  className="grid gap-6"
                >
                  <div className="grid gap-3">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder='Enter your Email'
                      onChange={e => changeInputhandler(e, "login")}
                      name="email"
                      value={logininput.email}
                      autoComplete="email"
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      onChange={e => changeInputhandler(e, "login")}
                      placeholder='Enter your Password'
                      name="password"
                      value={logininput.password}
                      autoComplete="current-password"
                    />
                  </div>
                  <CardFooter>
                    <Button disabled={LoginIsLoading} type="submit">
                      {LoginIsLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />Please Wait
                        </>
                      ) : "Login"}
                    </Button>
                  </CardFooter>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
export default Login