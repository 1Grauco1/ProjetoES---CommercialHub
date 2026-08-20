import { NextRequest, NextResponse } from 'next/server';
import { authHeader } from '@/src/lib/auth-header';
import { BACKEND_URL } from '@/src/config';

const backendUrl = BACKEND_URL;

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${backendUrl}/usuario/me`, { headers: await authHeader(), cache: 'no-store' });
    const data = await response.json().catch(() => ({ message: 'Resposta inválida da API.' }));
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ message: 'Não foi possível conectar à API de perfil.' }, { status: 503 });
  }
}

export async function PATCH(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id');

  if (!id) {
    return NextResponse.json({ message: 'ID do perfil é obrigatório.' }, { status: 400 });
  }

  const body = await request.text();

  try {
    const response = await fetch(`${backendUrl}/usuario/editar/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...(await authHeader()) },
      body,
      cache: 'no-store',
    });
    const data = await response.json().catch(() => ({ message: 'Resposta inválida da API.' }));
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ message: 'Não foi possível conectar à API de perfil.' }, { status: 503 });
  }
}
