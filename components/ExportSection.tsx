
import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { MatchdayData } from '../types';

interface ExportSectionProps {
  data: MatchdayData[];
}

const ExportSection: React.FC<ExportSectionProps> = ({ data }) => {
  const [selectedMatchdays, setSelectedMatchdays] = useState<number[]>([]);

  const toggleMatchday = (md: number) => {
    setSelectedMatchdays(prev => 
      prev.includes(md) ? prev.filter(x => x !== md) : [...prev, md]
    );
  };

  const handleExport = () => {
    if (selectedMatchdays.length === 0) return;

    const doc = new jsPDF() as any;
    doc.setFont("helvetica");
    doc.setFontSize(20);
    doc.text("Bundesliga Ergebnisbericht", 14, 22);
    doc.setFontSize(10);
    doc.text(`Generiert am: ${new Date().toLocaleString('de-DE')}`, 14, 30);

    let startY = 40;

    data.filter(d => selectedMatchdays.includes(d.matchday)).forEach(md => {
      doc.setFontSize(14);
      doc.text(`${md.matchday}. Spieltag`, 14, startY);
      
      const tableRows = md.matches.map(m => [
        new Date(m.date).toLocaleDateString('de-DE'),
        m.homeTeam,
        `${m.homeScore} : ${m.awayScore}`,
        m.awayTeam,
        (m.goals || []).map(g => `${g.player} (${g.minute}')`).join(', ')
      ]);

      doc.autoTable({
        startY: startY + 5,
        head: [['Datum', 'Heim', 'Ergebnis', 'Gast', 'Tore']],
        body: tableRows,
        theme: 'striped',
        headStyles: { fillColor: [15, 23, 42] },
        styles: { fontSize: 8 },
      });

      startY = doc.lastAutoTable.finalY + 15;
      
      if (startY > 270) {
        doc.addPage();
        startY = 20;
      }
    });

    doc.save(`Bundesliga_Spieltage_${selectedMatchdays.sort((a,b)=>a-b).join('_')}.pdf`);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200 mt-8 mb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Daten Exportieren</h2>
          <p className="text-sm text-slate-500">Wählen Sie die Spieltage aus, die Sie als PDF-Bericht speichern möchten.</p>
        </div>
        <button 
          onClick={handleExport}
          disabled={selectedMatchdays.length === 0}
          className={`px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${
            selectedMatchdays.length > 0 
            ? 'bg-blue-600 text-white hover:bg-blue-700 transform hover:-translate-y-0.5 active:translate-y-0' 
            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          PDF Bericht Exportieren ({selectedMatchdays.length})
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {data.map(md => (
          <button
            key={md.matchday}
            onClick={() => toggleMatchday(md.matchday)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
              selectedMatchdays.includes(md.matchday)
              ? 'bg-blue-50 border-blue-200 text-blue-700'
              : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {md.matchday}. Spieltag
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExportSection;
