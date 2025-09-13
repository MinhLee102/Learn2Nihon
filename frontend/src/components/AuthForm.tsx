// Declare a client component
'use client'

import React, { useState } from "react";
import Button from "./Button";
import InputField from "./InputField";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { loginUser, registerUser } from "@/lib/auth";
import { loginResponse, User } from "@/types/authType";

/**
 * Define input box in a form with:
 * id, name, type, placeholder, required?
 */
export interface FormField {
    id: string;
    name: string;
    type: 'text' | 'email' | 'password';
    placeholder: string;
    required?: boolean;
};

/**
 * Props for Auth Form
 */
interface AuthFormProps {
  type: 'login' | 'register';
  title: string;
  fields: FormField[];
  buttonText: string;
  footerContent?: React.ReactNode;
};

const AuthForm = ({type, title, fields, buttonText, footerContent }: AuthFormProps) => {

  const {login} = useAuth();

  const initialState: Record<string, string> = {};
  for (const field of fields) {
    initialState[field.name] = '';
  }

  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * Handle changes - when user fills in the input field -> update formdata
   * @param e 
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  /**
   * When submitted, sends data to backend
   * @param e 
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let submissionData: Record<string, string>;

    if (type === 'login') {
        submissionData = {
          username: formData.username,
          password: formData.password,
        }

    } else {
      submissionData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      };
    }

    try{
      if (type === 'login') {
        const loginApiResponseBody: loginResponse | undefined = await loginUser(submissionData); 
        
        if (loginApiResponseBody) { 
          await login(loginApiResponseBody); 
          window.location.href = "/"; 
        } else {
          throw new Error("Đăng nhập thất bại: Không nhận được phản hồi từ server.");
        }
      } else { 
        const registerApiResponseBody: User | undefined = await registerUser(submissionData); 
        
        if (registerApiResponseBody?.id !== undefined && registerApiResponseBody?.email) { 
          console.log('Registration successful:', registerApiResponseBody);
          window.location.href = "/check-mail"; 
        } else {
          throw new Error("Đăng ký thất bại: Không nhận được thông tin người dùng hoặc email từ server.");
        }
      }

    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error('API Error Response:', err.response); 

        const errorData = err.response?.data;
        if (typeof errorData === 'object' && errorData !== null && 'detail' in errorData) {
            const detail = (errorData as { detail: unknown }).detail; 
            if (typeof detail === 'string') {
                setError(detail);
            } else if (Array.isArray(detail)) {
                const errorMessage = detail.map((item: unknown) => {
                    if (typeof item === 'object' && item !== null && 'msg' in item) {
                        return (item as { msg: string }).msg;
                    }
                    if (typeof item === 'object' && item !== null && 'message' in item) {
                        return (item as { message: string }).message;
                    }
                    return JSON.stringify(item); 
                }).join('; ');
                setError(errorMessage);
            } else {
                setError('Chi tiết lỗi API không xác định.');
            }
        } else if (typeof errorData === 'string') {
            setError(errorData);
        } else {
          setError('An unexpected network error occurred. Please try again.');
        }
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Something went wrong.');
        console.error('Unknown error:', err);
      }
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#848484]">{title}</h2>
      </div>

      <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
        {error && <p className="text-red-500 
        text-sm text-center bg-red-100 p-2 rounded">{error}</p>}

        {fields.map((field) => (
          <InputField
            key={field.id}
            id={field.id}
            name={field.name}
            type={field.type}
            placeholder={field.placeholder}
            required={field.required}
            value={formData[field.name]}
            onChange={handleChange}
          />
        ))}

        <div className="pt-2">
          <Button type="submit" disabled= {loading}>
            {loading ? 'Loading...' : buttonText}
          </Button>
        </div>
      </form>

      {footerContent}
    </div>
  );
};

export default AuthForm;