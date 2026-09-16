/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // The db package ships TypeScript source, so Next has to compile it.
  transpilePackages: ["@lanka-baloon/db"],
  experimental: {
    // Prisma's query engine is a native binary; bundling it breaks the build.
    serverComponentsExternalPackages: ["@prisma/client", "prisma"],
  },
};
export default nextConfig;
