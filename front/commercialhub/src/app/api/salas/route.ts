import { NextRequest, NextResponse } from 'next/server';
import { normalizarFotos } from '@/src/utils/media';

const backendUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';

export async function POST(request: NextRequest) {
  const authorization = request.headers.get('authorization');
  const body = await request.json();
  try {
    const response = await fetch(`${backendUrl}/salas/criar_sala`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(authorization ? { Authorization: authorization } : {}) }, body: JSON.stringify(body), cache: 'no-store' });
    const data = await response.json().catch(() => ({ message: 'Resposta inválida da API.' }));
    return NextResponse.json(normalizarFotos(data, backendUrl), { status: response.status });
  } catch {
    return NextResponse.json({ message: 'Não foi possível conectar à API de imóveis.' }, { status: 503 });
  }
}

export async function GET(request: NextRequest) {
  const authorization = request.headers.get('authorization');
  try {
    const response = await fetch(`${backendUrl}/salas/minhas`, {
      headers: authorization ? { Authorization: authorization } : undefined,
      cache: 'no-store',
    });
    const data = await response.json().catch(() => ({ message: 'Resposta inválida da API.' }));

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(normalizarFotos(data, backendUrl), { status: response.status });
  } catch {
    return NextResponse.json({ message: 'Não foi possível conectar à API de imóveis.' }, { status: 503 });
  }
}
