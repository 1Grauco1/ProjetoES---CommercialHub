import { NextRequest, NextResponse } from 'next/server';

const backendUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';

export async function GET(
  request: NextRequest,
  { params }: RouteContext<'/api/cep/[cep]'>
) {
  const { cep } = await params;

  try {
    const response = await fetch(`${backendUrl}/cep/${cep}`, {
      cache: 'no-store',
    });

    const data = await response.json().catch(() => ({ message: 'Resposta inválida da API.' }));
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { message: 'Não foi possível consultar o CEP.' },
      { status: 503 }
    );
  }
}
