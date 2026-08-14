"use client"

import React from 'react';
import { Search, PlusCircle, SlidersHorizontal, Wallet, ChevronRight, HomeIcon } from 'lucide-react';
import Link from 'next/link';
  
export default function Home() {
  return (
    <div className="min-h-screen bg-white text-[#1B263B] font-['Montserrat'] antialiased">

      <section
        className="w-full min-h-[647px] px-6 py-12 md:px-[215px] md:py-[49px] flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/landingPageBg.svg')" }}
      >
        <div className="w-full max-w-[1482px] py-[76px] px-4 md:px-[120px] flex flex-col items-center gap-8 text-center">

          <h1 className="font-['Poppins'] font-semibold text-3xl sm:text-5xl lg:text-[72px] leading-tight text-white drop-shadow-md select-none max-w-[1242px]">
            CONECTANDO ESPAÇOS COMERCIAIS A GRANDES IDEIAS
          </h1>

          <p className="font-['Montserrat'] font-medium text-lg md:text-2xl  text-white max-w-[898px] leading-relaxed">
            A plataforma inteligente que une proprietários de imóveis e empreendedores com precisão técnica e transparência.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 w-full max-w-[898px] justify-center mt-4">
''
            <Link
              href={"/busca-sala"}
              className="group flex-1 max-w-[424px] h-[59px] bg-white border border-gray-200 rounded-[10px] shadow-[0_10px_4px_rgba(0,0,0,0.25)] flex items-center justify-center gap-2 hover:bg-gray-50 transition-all active:scale-95"
            >
              <Search className="w-6 h-6 text-[#1B263B]" />
              <span className="font-['Montserrat'] font-medium text-lg text-[#1C273B]">
                Buscar Sala Comercial
              </span>
            </Link>

            <Link
              href={"/login"}
              className="group flex-1 max-w-[424px] h-[59px] bg-[#D35400] rounded-[10px] shadow-[0_10px_4px_rgba(0,0,0,0.25)] flex items-center justify-center gap-2 hover:bg-[#D35400]/95 transition-all active:scale-95"
            >
              <PlusCircle className="w-6 h-6 text-white" />
              <span className="font-['Montserrat'] font-semibold text-lg text-white">
                Anunciar Meu Imóvel
              </span>
            </Link>

          </div>
        </div>
      </section>

      <section className="w-full px-6 py-16 md:px-[120px] bg-white flex flex-col gap-12">

        <div className="w-full border-b pb-4">
          <h2 className="font-['Poppins'] font-semibold text-3xl md:text-[48px] text-[#1B263B] drop-shadow-sm flex items-center gap-3">
            Serviços Oferecidos
            <ChevronRight className="w-8 h-8 text-[#D35400]" />
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">

          <div className="w-full max-w-[344px] min-h-[295px] bg-white border border-gray-100 rounded-[20px] shadow-[0_10px_4px_rgba(0,0,0,0.25)] p-8 flex flex-col items-center justify-between hover:scale-[1.03] transition-transform duration-300">
            <div className="w-[150px] h-[150px] bg-[#1B263B]/5 rounded-full flex items-center justify-center text-[#1B263B]">
              <SlidersHorizontal className="size-37.5" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col gap-2 text-center mt-6 w-full">
              <h3 className="font-['Poppins'] font-semibold text-xl text-[#D35400] tracking-wide uppercase">
                Filtros Avançados
              </h3>
              <p className="font-['Poppins'] font-medium text-sm text-[#1B263B]/70">
                Tamanho, localização e infraestrutura de alta precisão.
              </p>
            </div>
          </div>

          <div className="w-full max-w-[344px]  min-h-[295px] bg-white border border-gray-100 rounded-[20px] shadow-[0_10px_4px_rgba(0,0,0,0.25)] p-8 flex flex-col items-center justify-between hover:scale-[1.03] transition-transform duration-300">
            <div className="w-[150px] h-[150px] bg-[#1B263B]/5 rounded-full flex items-center justify-center text-[#1B263B]">
              <Wallet className="size-37.5" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col gap-2 text-center mt-6 w-full">
              <h3 className="font-['Poppins'] font-semibold text-xl text-[#D35400] tracking-wide uppercase">
                Gestão Financeira
              </h3>
              <p className="font-['Poppins'] font-medium text-sm text-[#1B263B]/70">
                Contratos integrados e controle digital de rendimentos.
              </p>
            </div>
          </div>

          <div className="w-full max-w-[344px]  min-h-[295px] bg-white border border-gray-100 rounded-[20px] shadow-[0_10px_4px_rgba(0,0,0,0.25)] p-8 flex flex-col items-center justify-between hover:scale-[1.03] transition-transform duration-300">
            <div className="w-[150px] h-[150px] bg-[#1B263B]/5 rounded-full flex items-center justify-center text-[#1B263B]">
              <HomeIcon className="size-37.5" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col gap-2 text-center mt-6 w-full">
              <h3 className="font-['Poppins'] font-semibold text-xl text-[#D35400] tracking-wide uppercase">
                Gestão de Imóveis
              </h3>
              <p className="font-['Poppins'] font-medium text-sm text-[#1B263B]/70">
                Acompanhamento em tempo real de infraestrutura e vistorias.
              </p>
            </div>
          </div>

        </div>
      </section>



    </div>
  );
}
