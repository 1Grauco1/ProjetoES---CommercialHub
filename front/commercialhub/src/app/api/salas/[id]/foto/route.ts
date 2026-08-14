import { NextRequest, NextResponse } from 'next/server';
import { normalizarFotos } from '@/src/utils/media';

const backendUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';

export async function POST(request: NextRequest, { params }: RouteContext<'/api/salas/[id]/foto'>) {
  const { id } = await params;
  const authorization = request.headers.get('authorization');
  const contentType = request.headers.get('content-type');
  try {
    const uploadRequest = {
      method: 'POST',
      headers: {
        ...(contentType ? { 'Content-Type': contentType } : {}),
        ...(authorization ? { Authorization: authorization } : {}),
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
