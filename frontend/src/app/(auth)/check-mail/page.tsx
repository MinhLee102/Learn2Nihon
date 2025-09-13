'use client'; 

import Link from 'next/link';
import { useSearchParams } from 'next/navigation'; 

export default function CheckEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email'); 

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

      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-[#848484] mb-6">
          Kiểm tra Email của bạn
        </h2>
        <p className="mt-4 text-gray-700 mb-4">
          Chúng tôi đã gửi một email xác minh đến{' '}
          <strong className="text-blue-600">{email || 'địa chỉ email của bạn'}</strong>.
          Vui lòng kiểm tra hộp thư đến (và cả thư mục Spam) và nhấp vào liên kết để kích hoạt tài khoản của bạn.
        </p>
        <p className="mt-4 text-gray-600 text-sm">
          Sau khi xác minh, bạn có thể{' '}
          <Link href="/login" passHref>
            <span className="font-medium text-blue-500 hover:text-blue-600 hover:underline cursor-pointer">
              đăng nhập
            </span>
          </Link>
          .
        </p>
        <div className="pt-6"> 
          <Link href="/login" passHref>
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors">
              Đăng nhập
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}