import Link from "next/link";
import AuthForm, { type FormField } from "@/components/AuthForm";

const registerField: FormField[] = [
    {
        id: 'username',
        name: 'username',
        type: 'text',
        placeholder: "Username",
        required: true,
    },
    {
        id: 'email',
        name: 'email',
        type: 'email',
        placeholder: "Email",
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

const RegisterFooter = (
    <>
        <p className= "mt-6 text-center text-sm text-[#AD8989]">
            Already have an account?{' '}
            <Link href= "/login">
                <span className= "font-medium text-blue-500 hover:text-blue-600 hover:underline cursor-pointer">
                    Login
                </span>
            </Link>
        </p>
    </>
);

export default function RegisterPage() {

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
                type = "register"
                title = "Sign Up"
                fields = {registerField}
                buttonText= "Sign Up"
                footerContent= {RegisterFooter} />
        </main>
    );
}