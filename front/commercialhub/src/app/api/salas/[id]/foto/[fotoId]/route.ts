import { NextRequest, NextResponse } from 'next/server';
import { normalizarFotos } from '@/src/utils/media';
import { authHeader } from '@/src/lib/auth-header';
import { BACKEND_URL } from '@/src/config';

const backendUrl = BACKEND_URL;

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
