import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',    //* them vao de build ra static files, yeu cau folder out cho docker còn npm run build sẽ tạo ra folder tên next
};

export default nextConfig;
