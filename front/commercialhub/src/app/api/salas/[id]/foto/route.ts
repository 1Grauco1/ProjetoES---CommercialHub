import { NextRequest, NextResponse } from 'next/server';
import { normalizarFotos } from '@/src/utils/media';
import { authHeader } from '@/src/lib/auth-header';
import { BACKEND_URL } from '@/src/config';

const backendUrl = BACKEND_URL;

export async function POST(request: NextRequest, { params }: RouteContext<'/api/salas/[id]/foto'>) {
  const { id } = await params;
  const contentType = request.headers.get('content-type');
  try {
    const uploadRequest = {
      method: 'POST',
      headers: {
        ...(contentType ? { 'Content-Type': contentType } : {}),
        ...(await authHeader()),
      },
      body: request.body,
      duplex: 'half',
      cache: 'no-store',
    } as RequestInit & { duplex: 'half' };
    const response = await fetch(`${backendUrl}/salas/${id}/foto`, uploadRequest);
    const data = await response.json().catch(() => ({ message: 'Resposta inválida da API.' }));
    return NextResponse.json(normalizarFotos(data, backendUrl), { status: response.status });
  } catch {
    return NextResponse.json({ message: 'Não foi possível enviar a imagem para a API.' }, { status: 503 });
  }
}
