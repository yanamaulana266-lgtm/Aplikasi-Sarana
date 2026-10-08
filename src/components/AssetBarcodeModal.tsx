import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  QrCode, 
  Barcode, 
  Copy, 
  Check, 
  FileSpreadsheet, 
  Layers, 
  ListFilter,
  CheckSquare,
  Square
} from 'lucide-react';
import { SaranaItem, InstitutionInfo } from '../types/sarpras';
import { generateQrMatrix, generateBarcodeBars } from '../utils/barcode';

interface AssetBarcodeModalProps {
  item: SaranaItem;
  allItems: SaranaItem[];
  institution: InstitutionInfo;
  onClose: () => void;
}

export const AssetBarcodeModal: React.FC<AssetBarcodeModalProps> = ({ 
  item, 
  allItems, 
  institution, 
  onClose 
}) => {
  const [copied, setCopied] = useState(false);
  // 'f4_sheet_repeat' (10 labels of same item), 'f4_sheet_multi' (10 different items), 'single'
  const [printLayout, setPrintLayout] = useState<'f4_sheet_repeat' | 'f4_sheet_multi' | 'single'>('f4_sheet_repeat');
  
  // Selection of 10 items for multi-item sheet
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>(() => {
    const list = [item.id];
    for (const it of allItems) {
      if (list.length >= 10) break;
      if (!list.includes(it.id)) list.push(it.id);
    }
    return list;
  });

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleItemSelection = (id: string) => {
    if (selectedItemIds.includes(id)) {
      if (selectedItemIds.length > 1) {
        setSelectedItemIds(selectedItemIds.filter(x => x !== id));
      }
    } else {
      if (selectedItemIds.length < 10) {
        setSelectedItemIds([...selectedItemIds, id]);
      }
    }
  };

  // Determine items to print (exactly 10 for F4 sheet)
  const itemsToPrint: SaranaItem[] = React.useMemo(() => {
    if (printLayout === 'single') {
      return [item];
    }
    if (printLayout === 'f4_sheet_repeat') {
      // Exactly 10 identical labels of current item
      return Array(10).fill(item);
    }
    // f4_sheet_multi: selected items, padded to 10 if less
    const chosen = selectedItemIds
      .map(id => allItems.find(it => it.id === id))
      .filter((it): it is SaranaItem => it !== undefined);

    const result = [...chosen];
    while (result.length < 10 && chosen.length > 0) {
      result.push(chosen[result.length % chosen.length]);
    }
    return result.slice(0, 10);
  }, [printLayout, item, selectedItemIds, allItems]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[94vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-3.5 border-b border-blue-100 flex items-center justify-between no-print bg-blue-50/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center border border-orange-400 shadow-2xs">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-blue-950">
                Cetak Label Barang & QR Code (Format Lembar F4)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Memuat Kode Barang, Nama Barang, QR Code 2D & Barcode fisik · Standar Kertas F4/Folio (10 Label per Lembar)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls & Mode Selector */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between flex-wrap gap-3 no-print">
          {/* Format Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700">Format Halaman:</span>
            <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setPrintLayout('f4_sheet_repeat')}
                className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                  printLayout === 'f4_sheet_repeat'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-blue-900'
                }`}
              >
                1 Lembar F4 (10 Label Barang Ini)
              </button>
              <button
                type="button"
                onClick={() => setPrintLayout('f4_sheet_multi')}
                className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                  printLayout === 'f4_sheet_multi'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-blue-900'
                }`}
              >
                1 Lembar F4 (10 Barang Berbeda)
              </button>
              <button
                type="button"
                onClick={() => setPrintLayout('single')}
                className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                  printLayout === 'single'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-blue-900'
                }`}
              >
                1 Stiker Satuan
              </button>
            </div>
          </div>

          {/* Action buttons with Orange Primary */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopyCode(item.code)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-2xs cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? 'Tersalin' : 'Salin Kode'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 rounded-lg shadow-md shadow-orange-600/20 transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Lembar F4 (10 Label)</span>
            </button>
          </div>
        </div>

        {/* Multi-Item Selection Drawer when in 'f4_sheet_multi' mode */}
        {printLayout === 'f4_sheet_multi' && (
          <div className="px-6 py-2.5 bg-slate-100/90 border-b border-slate-200 text-xs no-print">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <ListFilter className="w-3.5 h-3.5 text-slate-500" />
                <span>Pilih 10 Barang untuk Dicetak ({selectedItemIds.length}/10 Terpilih):</span>
              </span>
              <button
                onClick={() => setSelectedItemIds(allItems.slice(0, 10).map(i => i.id))}
                className="text-[11px] text-blue-700 hover:underline font-medium"
              >
                Pilih 10 Teratas Otomatis
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-white rounded-lg border border-slate-200">
              {allItems.map(it => {
                const isSelected = selectedItemIds.includes(it.id);
                return (
                  <button
                    key={it.id}
                    type="button"
                    onClick={() => toggleItemSelection(it.id)}
                    className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-[11px] transition-colors border ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {isSelected ? <CheckSquare className="w-3 h-3 text-emerald-400" /> : <Square className="w-3 h-3 text-slate-400" />}
                    <span className="truncate max-w-[130px] font-medium">{it.name}</span>
                    <span className="font-mono text-[10px] text-slate-400">({it.code})</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Paper Info Ribbon */}
        <div className="px-6 py-1.5 bg-blue-50/70 border-b border-blue-100 flex items-center justify-between text-[11px] text-blue-900 no-print">
          <div className="flex items-center gap-1.5">
            <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
            <span>
              <strong>Kertas F4 / Folio (215 x 330 mm)</strong> · Format Grid: <strong>2 Kolom × 5 Baris = 10 Label</strong> per Lembar
            </span>
          </div>
          <span className="text-blue-700 font-mono">Ukuran Label: ±98mm × 58mm</span>
        </div>

        {/* Printable Sheet Viewport */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-200/60 print:bg-white print:p-0">
          {/* F4 Paper Sheet Container */}
          <div 
            className="f4-sheet-container mx-auto bg-white border border-slate-300 shadow-md p-4 print:p-2 print:border-none print:shadow-none"
            style={{ 
              maxWidth: '820px',
              minHeight: printLayout === 'single' ? 'auto' : '1080px'
            }}
          >
            {/* Sheet Title Header (only visible on screen, or subtle in print) */}
            <div className="sheet-watermark pb-2 mb-3 border-b border-slate-200 flex items-center justify-between text-[10px] text-slate-400 no-print">
              <span>LEMBAR CETAK STIKER INVENTARIS · KERTAS FOLIO/F4</span>
              <span>KAPASITAS: TEPAT 10 LABEL</span>
            </div>

            {/* Grid of 10 labels: 2 columns x 5 rows */}
            <div 
              className={`f4-label-grid ${
                printLayout === 'single'
                  ? 'grid grid-cols-1 max-w-md mx-auto'
                  : 'grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 print:grid-cols-2 print:gap-2'
              }`}
            >
              {itemsToPrint.map((targetItem, index) => {
                const qrMatrix = generateQrMatrix(targetItem.code, 25);
                const barcodeBars = generateBarcodeBars(targetItem.code);

                return (
                  <div
                    key={`${targetItem.id}-${index}`}
                    className="f4-label-card bg-white border-2 border-slate-800 rounded-lg p-2.5 sm:p-3 text-slate-900 relative break-inside-avoid flex flex-col justify-between"
                    style={{ minHeight: '190px' }}
                  >
                    {/* Header Kop Label */}
                    <div className="border-b-2 border-slate-800 pb-1 mb-2 text-center">
                      <div className="text-[8px] tracking-wider uppercase font-semibold text-slate-600 leading-tight">
                        PEMERINTAH DAERAH · DINAS PENDIDIKAN
                      </div>
                      <div className="text-[10px] sm:text-[11px] font-bold tracking-tight text-slate-900 leading-tight">
                        {institution.name.toUpperCase()}
                      </div>
                      <div className="text-[8px] font-mono text-slate-500 leading-tight">
                        LABEL INVENTARIS BARANG (KIB) · NPSN: {institution.npsn}
                      </div>
                    </div>

                    {/* Content: QR Code & Detailed Asset Attributes */}
                    <div className="flex items-start gap-2.5">
                      {/* 2D QR Code Container */}
                      <div className="shrink-0 bg-white p-1 border border-slate-300 rounded flex flex-col items-center">
                        <svg
                          viewBox={`0 0 ${qrMatrix.length} ${qrMatrix.length}`}
                          className="w-18 h-18 sm:w-20 sm:h-20 shape-rendering-crispEdges"
                        >
                          {qrMatrix.map((row, r) =>
                            row.map((val, c) => (
                              <rect
                                key={`${r}-${c}`}
                                x={c}
                                y={r}
                                width={1}
                                height={1}
                                fill={val ? '#0f172a' : 'transparent'}
                              />
                            ))
                          )}
                        </svg>
                        <span className="text-[7px] font-mono font-bold text-slate-600 mt-0.5 tracking-wider">
                          SCAN QR
                        </span>
                      </div>

                      {/* Explicit Item Code & Item Name Info */}
                      <div className="flex-1 min-w-0 text-left">
                        {/* KODE BARANG */}
                        <div className="inline-block bg-slate-100 text-slate-900 font-mono font-bold text-[10px] sm:text-[11px] px-1.5 py-0.5 rounded border border-slate-300">
                          {targetItem.code}
                        </div>

                        {/* NAMA BARANG */}
                        <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 line-clamp-2 mt-1 leading-snug">
                          {targetItem.name}
                        </h4>

                        {/* Additional Metadata */}
                        <div className="mt-1 text-[9px] sm:text-[10px] text-slate-700 space-y-0.5 leading-tight">
                          <div>
                            <span className="text-slate-500">Merk/Tipe:</span> <strong className="font-semibold">{targetItem.brand || '-'}</strong>
                          </div>
                          <div className="truncate">
                            <span className="text-slate-500">Ruangan:</span> <strong className="font-semibold">{targetItem.locationName}</strong>
                          </div>
                          <div>
                            <span className="text-slate-500">Pengadaan:</span> <span>{targetItem.acquisitionYear} · {targetItem.sourceOfFund}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">Kondisi:</span> <span className={
                              targetItem.condition === 'Baik' ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'
                            }>{targetItem.condition}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom 1D Barcode Line */}
                    <div className="mt-1.5 pt-1 border-t border-slate-200 flex flex-col items-center">
                      <div className="flex items-end h-5 gap-[1px]">
                        {barcodeBars.map((width, idx) => (
                          <div
                            key={idx}
                            className={idx % 2 === 0 ? 'bg-slate-900' : 'bg-transparent'}
                            style={{ width: `${Math.max(1, width * 1.2)}px`, height: '100%' }}
                          />
                        ))}
                      </div>
                      <div className="text-[8px] font-mono tracking-widest text-slate-600 mt-0.5">
                        *{targetItem.code}*
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer (No print) */}
        <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-white no-print">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>
              Format cetak disesuaikan otomatis dengan kertas F4/Folio (215 x 330 mm). Siap dicetak langsung ke printer.
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
