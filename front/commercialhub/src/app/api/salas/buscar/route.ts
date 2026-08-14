import { NextRequest, NextResponse } from 'next/server';
import { normalizarFotos } from '@/src/utils/media';

const backendUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  try {
    const response = await fetch(`${backendUrl}/salas/buscar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
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
