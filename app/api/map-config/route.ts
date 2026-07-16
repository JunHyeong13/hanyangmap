export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    kakaoMapJavaScriptKey: process.env.KAKAO_MAP_JAVASCRIPT_KEY ?? "",
  });
}
