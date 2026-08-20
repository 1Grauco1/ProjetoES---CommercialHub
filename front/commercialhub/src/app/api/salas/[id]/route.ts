import { NextRequest, NextResponse } from 'next/server';
import { normalizarFotos } from '@/src/utils/media';
import { authHeader } from '@/src/lib/auth-header';
import { BACKEND_URL } from '@/src/config';

const backendUrl = BACKEND_URL;

export async function GET(request: NextRequest, { params }: RouteContext<'/api/salas/[id]'>) {
  const { id } = await params;
  return encaminhar(request, `${backendUrl}/salas/${id}`);
}

export async function PATCH(request: NextRequest, { params }: RouteContext<'/api/salas/[id]'>) {
  const { id } = await params;
  return encaminhar(request, `${backendUrl}/salas/${id}`, await request.text());
}

export async function DELETE(request: NextRequest, { params }: RouteContext<'/api/salas/[id]'>) {
  const { id } = await params;
  return encaminhar(request, `${backendUrl}/salas/${id}`);
}

async function encaminhar(request: NextRequest, url: string, body?: string) {
  try {
    const response = await fetch(url, {
      method: request.method,
      headers: { ...(body ? { 'Content-Type': 'application/json' } : {}), ...(await authHeader()) },
      ...(body ? { body } : {}),
      cache: 'no-store',
    });
    const data = await response.json().catch(() => ({ message: 'Resposta inválida da API.' }));
    return NextResponse.json(normalizarFotos(data, backendUrl), { status: response.status });
  } catch {
    return NextResponse.json({ message: 'Não foi possível conectar à API de imóveis.' }, { status: 503 });
  }
}
