import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from '@/src/config';

const backendUrl = BACKEND_URL;

export async function GET(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  try {
    const response = await fetch(`${backendUrl}/contratos/`, {
      headers: authorization ? { Authorization: authorization } : undefined,
      cache: "no-store",
    });
    const data = await response.json().catch(() => ({ message: "Resposta inválida da API." }));
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { message: "Não foi possível conectar à API de contratos." },
      { status: 503 }
    );
  }
}
