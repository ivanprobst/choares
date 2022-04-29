/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ["en-US"],
    defaultLocale: "en-US",
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/tasks-list",
        permanent: true,
        locale: false,
      },
    ];
  },
};

module.exports = nextConfig;
