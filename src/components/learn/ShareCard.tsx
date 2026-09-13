import { useRef, useCallback, useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import type { ChallengeRunResult } from '@/types';
import { drawShareCard } from './drawShareCard';

interface ShareCardProps {
  result: ChallengeRunResult;
  packTitle: string;
}

export function ShareCard({ result, packTitle }: ShareCardProps) {
  const cardRef = useRef<HTMLCanvasElement>(null);
  const [readyCard, setReadyCard] = useState<{ result: ChallengeRunResult; packTitle: string } | null>(null);
  const [previewError, setPreviewError] = useState(false);
  const [retry, setRetry] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState<string | null>(null);
  const ready = readyCard?.result === result && readyCard?.packTitle === packTitle;

  useEffect(() => {
    let cancelled = false;
    setReadyCard(null);
    setPreviewError(false);
    setExportMessage(null);
    drawShareCard(result, packTitle).then((rendered) => {
      if (cancelled) return;
      const preview = cardRef.current;
      const ctx = preview?.getContext('2d');
      if (!preview || !ctx) throw new Error('无法显示分享预览');
      ctx.clearRect(0, 0, preview.width, preview.height);
      ctx.drawImage(rendered, 0, 0);
      setReadyCard({ result, packTitle });
    }).catch(() => {
      if (!cancelled) setPreviewError(true);
    });
    return () => { cancelled = true; };
  }, [result, packTitle, retry]);

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
    if (exporting || !ready) return;
    const card = cardRef.current;
    if (!card) return;

    setExporting(true);
    setExportMessage(null);

    try {
      // Download
      const blob = await new Promise<Blob | null>((resolve) =>
        card.toBlob(resolve, 'image/png'),
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
  }, [exporting, ready, fallbackBrowserDownload, result]);

  return (
    <div className="space-y-4">
      <div className="relative w-full overflow-hidden rounded-tool border border-primary-500/20 bg-bg-app" style={{ aspectRatio: '1200/630' }}>
        <canvas
          ref={cardRef}
          width={1200}
          height={630}
          role="img"
          aria-label={`${packTitle}，Flow Score ${result.flowScore}，WPM ${result.wpm}，准确率 ${result.accuracy}%，最大连击 ${result.maxCombo}`}
          className={`block h-full w-full ${ready ? '' : 'invisible'}`}
        />
        {!ready && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-xs text-text-secondary" role="status">
            {previewError ? '成绩图加载失败' : '正在生成成绩图…'}
            {previewError && <button className="text-primary-400 underline" onClick={() => setRetry((value) => value + 1)}>重新加载</button>}
          </div>
        )}
      </div>
      {/* Export button */}
      <button
        onClick={handleExport}
        disabled={exporting || !ready}
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
