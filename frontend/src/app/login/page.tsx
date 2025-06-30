import Link from "next/link";
import AuthForm, { type FormField } from "@/components/AuthForm";

const loginFields: FormField[] = [
  {
    id: 'username',
    name: 'username',
    type: 'text',
    placeholder: 'Username or email',
    required: true,
  },
  {
    id: 'password',
    name: 'password',
    type: 'password',
    placeholder: 'Password',
    required: true,
  },
];

const LoginFooter = (
  <>
    <div className= "mt-6 text-center text-sm">
      <Link href= "/forgot-password">
        <span className= "font-medium text-blue-500 hover:text-blue-600 hover:underline cursor-pointer">
          Forgot password?
        </span>
      </Link>
    </div>
    <p className= "mt-4 text-center text-sm text-[#AD8989]">
      New to DevShare?{' '}
      <Link href= "/signup">
        <span className= "font-medium text-blue-500 hover:text-blue-600 hover:underline cursor-pointer">
          Sign Up
        </span>
      </Link>
    </p>
  </>
);


export default function LoginPage() {

  const handleLogin = async (data: Record<string, string>) => {
    "use server"; 
    console.log('Login info: ', data);
    //calling API here
  };

  return (
    <main className= "flex-grow flex flex-col items-center justify-center p-4">
      <div className= "text-center mb-6">
        <h1 className= "text-3xl font-bold text-[#AD8989]">
          Welcome to Learn2Nihon!
        </h1>
        <p className= "mt-2 text-sm text-[#AD8989]">
          A Website for people who want to learn Japanese
        </p>
      </div>

      <AuthForm
        title= "Log In"
        fields= {loginFields}
        buttonText= "Log In"
        onSubmit= {handleLogin}
        footerContent= {LoginFooter}
      />
    </main>
  );
}

