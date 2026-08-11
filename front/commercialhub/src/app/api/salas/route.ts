import { NextRequest, NextResponse } from 'next/server';
import { normalizarFotos } from '../../../lib/sala-response';

const backendUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';

export async function POST(request: NextRequest) {
  const authorization = request.headers.get('authorization');
  
  try {
    const body = await request.json();
    
    const response = await fetch(`${backendUrl}/salas/criar_sala`, { 
      method: 'POST', 
      headers: { 
        'Content-Type': 'application/json', 
        ...(authorization ? { Authorization: authorization } : {}) 
      }, 
      body: JSON.stringify(body), 
      cache: 'no-store' 
    });
    
    const data = await response.json().catch(() => ({ message: 'Resposta inválida da API.' }));
    return NextResponse.json(normalizarFotos(data, backendUrl), { status: response.status });
  } catch {
    return NextResponse.json({ message: 'Não foi possível conectar à API de imóveis.' }, { status: 503 });
  }
}

export async function GET(request: NextRequest) {
  const authorization = request.headers.get('authorization');
  
  const { searchParams } = new URL(request.url);
  const buscarTodas = searchParams.get('todas') === 'true';
  const endpoint = buscarTodas ? `${backendUrl}/salas` : `${backendUrl}/salas/minhas`;

  try {
    const headers: Record<string, string> = {};
    if (authorization) {
      headers['Authorization'] = authorization;
    }

    const response = await fetch(endpoint, { 
      headers: Object.keys(headers).length > 0 ? headers : undefined, 
      cache: 'no-store' 
    });
    
    const data = await response.json().catch(() => ({ message: 'Resposta inválida da API.' }));
    return NextResponse.json(normalizarFotos(data, backendUrl), { status: response.status });
  } catch {
    return NextResponse.json({ message: 'Não foi possível conectar à API de imóveis.' }, { status: 503 });
  }
}