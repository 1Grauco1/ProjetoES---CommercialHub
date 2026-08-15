import { NextRequest, NextResponse } from 'next/server';
import { normalizarFotos } from '@/src/utils/media';
import { authHeader } from '@/src/lib/auth-header';

const backendUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';

export async function DELETE(
  request: NextRequest,
  { params }: RouteContext<'/api/salas/[id]/foto/[fotoId]'>
) {
  const { id, fotoId } = await params;

  try {
    const response = await fetch(`${backendUrl}/salas/${id}/foto/${fotoId}`, {
      method: 'DELETE',
      headers: await authHeader(),
      cache: 'no-store',
    });

    const data = await response.json().catch(() => ({ message: 'Resposta inválida da API.' }));
    return NextResponse.json(normalizarFotos(data, backendUrl), { status: response.status });
  } catch {
    return NextResponse.json({ message: 'Não foi possível remover a imagem da API.' }, { status: 503 });
  }
}
