import React from 'react';
import { KtpRecord } from '../types';

interface KtpCardProps {
  record: KtpRecord;
}

export default function KtpCard({ record }: KtpCardProps) {
  // Safe fallbacks
  const fullname = record.fullname || 'Jiyaaa';
  const idNumber = record.id || '6704023211059722';
  const gender = record.gender || 'Perempuan';
  const address = record.address || 'Bandung';
  const religion = record.religion || 'Islam';
  const hobby = record.hobby || 'Gaming dan nonton';
  const avatarUrl = record.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
  const username = record.username || 'jiyax_36';
  const createdAt = record.createdAt || '10 - 06 - 2026';

  return (
    <div
      id={`ktp-card-${record.id}`}
      className="relative w-full max-w-lg aspect-[1.6/1] bg-gradient-to-br from-[#2a4521] via-[#1d2f17] to-[#121c0e] border-[3px] border-[#d4af37] rounded-xl p-5 text-white font-sans shadow-2xl flex flex-col justify-between overflow-hidden"
      style={{ boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)' }}
    >
      {/* Decorative Security Line Graphic */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <div className="absolute right-0 bottom-0 top-0 left-1/2 bg-gradient-to-r from-transparent to-[#d4af37]/5 skew-x-12 transform pointer-events-none"></div>

      {/* Header */}
      <div className="text-center border-b border-[#d4af37]/40 pb-2 relative z-10">
        <h3 className="text-sm md:text-base font-bold font-sans tracking-widest text-[#e5c158] uppercase">
          KARTU TANDA PENDUDUK
        </h3>
        <h4 className="text-[10px] md:text-xs tracking-wider text-green-300 font-semibold font-sans uppercase">
          GANG DISCORD INDONESIA
        </h4>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-12 gap-3 items-center py-2 relative z-10 flex-1">
        
        {/* Left Column (Details) */}
        <div className="col-span-8 space-y-1.5 text-[10px] md:text-[11px] leading-tight pr-1">
          <div className="flex">
            <span className="w-20 font-bold shrink-0 text-[#9fe870]">No KTP</span>
            <span className="shrink-0 mr-1.5">:</span>
            <span className="font-mono font-bold text-yellow-300 tracking-wider break-all">{idNumber}</span>
          </div>
          
          <div className="flex">
            <span className="w-20 text-gray-300 shrink-0 font-medium">Nama</span>
            <span className="shrink-0 mr-1.5">:</span>
            <span className="font-semibold break-words">{fullname}</span>
          </div>

          <div className="flex">
            <span className="w-20 text-gray-300 shrink-0 font-medium">Jenis Kelamin</span>
            <span className="shrink-0 mr-1.5">:</span>
            <span className="font-semibold">{gender}</span>
          </div>

          <div className="flex">
            <span className="w-20 text-gray-300 shrink-0 font-medium">Domisili</span>
            <span className="shrink-0 mr-1.5">:</span>
            <span className="font-semibold break-words">{address}</span>
          </div>

          <div className="flex">
            <span className="w-20 text-gray-300 shrink-0 font-medium">Agama</span>
            <span className="shrink-0 mr-1.5">:</span>
            <span className="font-semibold">{religion}</span>
          </div>

          <div className="flex items-start">
            <span className="w-20 text-gray-300 shrink-0 font-medium">Hobi</span>
            <span className="shrink-0 mr-1.5">:</span>
            <span className="font-semibold break-words flex-1 line-clamp-2">{hobby}</span>
          </div>
        </div>

        {/* Right Column (Photo Box) */}
        <div className="col-span-4 flex flex-col items-center justify-center">
          <div className="relative group p-0.5 bg-gradient-to-tr from-[#d4af37] to-[#e5c158] rounded shadow-lg overflow-hidden">
            <div className="w-20 h-24 md:w-24 md:h-28 bg-[#152311] overflow-hidden rounded-sm flex items-center justify-center">
              <img
                src={avatarUrl}
                alt="Foto KTP"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Fallback if image fails to load
                  (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`;
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Details */}
      <div className="flex justify-between items-baseline border-t border-[#d4af37]/25 pt-1.5 text-[9px] md:text-[10px] text-gray-400 font-medium relative z-10 shrink-0">
        <span className="font-mono text-gray-400 lowercase italic hover:text-[#e5c158] transition-colors">
          @{username}
        </span>
        <div className="flex space-x-1.5 items-center">
          <span className="text-[8px] md:text-[9px] text-[#9fe870] uppercase tracking-wider">Tanggal Pembuatan:</span>
          <span className="font-bold text-yellow-500 font-mono tracking-wider">
            {createdAt}
          </span>
        </div>
      </div>
    </div>
  );
}
