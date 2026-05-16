import { useRef, useCallback, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import type { ChallengeRunResult } from '@/types';

interface ShareCardProps {
  result: ChallengeRunResult;
  packTitle: string;
}

const CHALLENGE_LABELS: Record<string, string> = {
  'speed-30s': '30秒极速',
  'focus-3min': '3分钟训练',
  'perfect-run': 'Perfect Run',
  'combo-rush': 'Combo Rush',
};

export function ShareCard({ result, packTitle }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  const fallbackBrowserDownload = useCallback((blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, []);

  const handleExport = useCallback(async () => {
    if (exporting) return;
    const card = cardRef.current;
    if (!card) return;

    setExporting(true);
    setExportMessage(null);

    try {
      // Use Canvas API for export
      const canvas = document.createElement('canvas');
      const scale = 2;
      canvas.width = 1200 * scale;
      canvas.height = 630 * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.scale(scale, scale);

      // Background
      const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
      gradient.addColorStop(0, '#0f172a');
      gradient.addColorStop(1, '#1e293b');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1200, 630);

      // Border
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.strokeRect(20, 20, 1160, 590);

      // Logo area
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(60, 50, 80, 80);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px monospace';
      ctx.fillText('CS', 75, 105);

      // Title
      ctx.fillStyle = '#f1f5f9';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText('CodeStep', 170, 90);

      // Challenge mode badge
      ctx.fillStyle = '#f97316';
      const modeLabel = CHALLENGE_LABELS[result.challengeMode] || result.challengeMode;
      ctx.font = '14px sans-serif';
      const modeWidth = ctx.measureText(modeLabel).width;
      ctx.fillStyle = 'rgba(249, 115, 22, 0.15)';
      ctx.fillRect(170, 100, modeWidth + 20, 28);
      ctx.fillStyle = '#f97316';
      ctx.fillText(modeLabel, 180, 120);

      // Pack name
      ctx.fillStyle = '#94a3b8';
      ctx.font = '18px sans-serif';
      ctx.fillText(packTitle, 170, 155);

      // Flow Score (large)
      ctx.fillStyle = '#f97316';
      ctx.font = 'bold 120px monospace';
      const flowText = String(result.flowScore);
      const flowWidth = ctx.measureText(flowText).width;
      ctx.fillText(flowText, 600 - flowWidth / 2, 350);

      ctx.fillStyle = '#64748b';
      ctx.font = '20px sans-serif';
      ctx.fillText('Flow Score', 600 - ctx.measureText('Flow Score').width / 2, 390);

      // Stats row
      const statsY = 460;
      const stats = [
        { label: 'WPM', value: String(result.wpm) },
        { label: '准确率', value: `${result.accuracy}%` },
        { label: 'Max Combo', value: `x${result.maxCombo}` },
        { label: '片段', value: String(result.completedSegments) },
      ];
      const totalStatsWidth = stats.reduce((sum, s) => sum + ctx.measureText(`${s.value} ${s.label}`).width + 40, 0);
      let statX = 600 - totalStatsWidth / 2;

      stats.forEach(({ label, value }) => {
        ctx.fillStyle = '#f1f5f9';
        ctx.font = 'bold 36px monospace';
        const vw = ctx.measureText(value).width;
        ctx.fillText(value, statX, statsY);

        ctx.fillStyle = '#64748b';
        ctx.font = '14px sans-serif';
        ctx.fillText(label, statX + vw / 2 - ctx.measureText(label).width / 2, statsY + 30);
        statX += vw + 60;
      });

      // Rank
      if (result.rank) {
        const rankText = result.rank <= 3 ? `🏆 第 ${result.rank} 名` : `第 ${result.rank} 名`;
        ctx.fillStyle = result.rank <= 3 ? '#eab308' : '#94a3b8';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(rankText, 60, 580);
      }

      if (result.isNewBest) {
        ctx.fillStyle = '#f97316';
        ctx.font = 'bold 20px sans-serif';
        const bestText = '新纪录！';
        ctx.fillText(bestText, 1200 - 60 - ctx.measureText(bestText).width, 580);
      }

      // Date
      const date = new Date(result.createdAt).toLocaleDateString('zh-CN');
      ctx.fillStyle = '#475569';
      ctx.font = '14px sans-serif';
      ctx.fillText(date, 60, 610);

      // Download
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, 'image/png'),
      );
      if (!blob) {
        throw new Error('PNG 生成失败');
      }

      const yyyymmdd = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const fileName = `codestep-${result.packId}-${result.challengeMode}-${yyyymmdd}.png`;

      try {
        const buffer = await blob.arrayBuffer();
        const exportPath = await invoke<string>('save_share_card_png', {
          fileName,
          pngBytes: Array.from(new Uint8Array(buffer)),
        });
        setExportMessage(`已导出：${exportPath}`);
      } catch (tauriError) {
        console.warn('[ShareCard] Tauri export failed, fallback to browser download:', tauriError);
        fallbackBrowserDownload(blob, fileName);
        setExportMessage('已触发浏览器下载');
      }
    } catch (err) {
      console.error('[ShareCard] Export failed:', err);
      setExportMessage('导出失败，请稍后重试');
    } finally {
      setExporting(false);
    }
  }, [exporting, fallbackBrowserDownload, result, packTitle]);

  return (
    <div className="space-y-4">
      {/* Preview card */}
      <div
        ref={cardRef}
        className="rounded-tool overflow-hidden border border-gray-700/40 bg-bg-app"
        style={{ aspectRatio: '1200/630', maxWidth: 600 }}
      >
        <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-bg-app to-bg-panel">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold text-lg font-mono">CS</div>
            <span className="text-sm font-semibold text-text-primary">CodeStep</span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-accent-record/15 text-accent-record border border-accent-record/20 mb-2">
            {CHALLENGE_LABELS[result.challengeMode]}
          </span>
          <div className="text-xs text-text-muted mb-4">{packTitle}</div>

          <div className="text-5xl font-bold font-mono text-accent-record mb-1">{result.flowScore}</div>
          <div className="text-xs text-text-muted mb-6">Flow Score</div>

          <div className="flex items-center gap-6 text-center mb-4">
            <div>
              <div className="text-lg font-bold font-mono text-text-primary">{result.wpm}</div>
              <div className="text-[10px] text-text-muted">WPM</div>
            </div>
            <div>
              <div className="text-lg font-bold font-mono text-text-primary">{result.accuracy}%</div>
              <div className="text-[10px] text-text-muted">准确率</div>
            </div>
            <div>
              <div className="text-lg font-bold font-mono text-text-primary">x{result.maxCombo}</div>
              <div className="text-[10px] text-text-muted">Max Combo</div>
            </div>
            <div>
              <div className="text-lg font-bold font-mono text-text-primary">{result.completedSegments}</div>
              <div className="text-[10px] text-text-muted">片段</div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[10px] text-text-muted">
            {result.rank && <span>第 {result.rank} 名</span>}
            {result.isNewBest && <span className="text-accent-record">新纪录！</span>}
            <span>{new Date(result.createdAt).toLocaleDateString('zh-CN')}</span>
          </div>
        </div>
      </div>

      {/* Export button */}
      <button
        onClick={handleExport}
        disabled={exporting}
        className="w-full rounded-tool border border-gray-700/50 px-4 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:border-primary-500/40 hover:text-text-primary hover:bg-bg-panel disabled:cursor-wait disabled:opacity-60 flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        {exporting ? '正在导出...' : '导出成绩图 PNG'}
      </button>
      {exportMessage && (
        <div className="break-all text-center text-[10px] text-text-muted">
          {exportMessage}
        </div>
      )}
    </div>
  );
}
