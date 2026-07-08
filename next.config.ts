import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        // 카카오 도서검색 API가 내려주는 썸네일 도메인만 허용 (임의의 외부 호스트 전체 허용은 지양)
        hostname: "**.kakaocdn.net",
      },
    ],
  },
};

export default nextConfig;
