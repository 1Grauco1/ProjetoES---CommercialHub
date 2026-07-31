import { NextRequest, NextResponse } from 'next/server';

const backendUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';

export async function GET(request: NextRequest) {
  const authorization = request.headers.get('authorization');
  try {
    const response = await fetch(`${backendUrl}/usuario/me`, { headers: authorization ? { Authorization: authorization } : undefined, cache: 'no-store' });
    const data = await response.json().catch(() => ({ message: 'Resposta inválida da API.' }));
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ message: 'Não foi possível conectar à API de perfil.' }, { status: 503 });
  }
}
