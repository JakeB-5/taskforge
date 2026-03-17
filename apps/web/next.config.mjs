/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@taskforge/shared", "@taskforge/ui"],
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts", "date-fns"],
  },
};

export default nextConfig;
