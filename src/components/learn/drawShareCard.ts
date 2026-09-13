import campRiver from '@/assets/backgrounds/camp-river.webp';
import appIcon from '@/assets/app-icon.png';
import type { ChallengeRunResult } from '@/types';

export const CHALLENGE_LABELS: Record<string, string> = {
  'speed-30s': '30秒极速',
  'focus-3min': '3分钟训练',
  'perfect-run': 'Perfect Run',
  'combo-rush': 'Combo Rush',
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('分享素材加载失败'));
    image.src = src;
  });
}

// 预览与 PNG 共用同一画布；固定像素尺寸，不随屏幕缩放比例变化。
export async function drawShareCard(result: ChallengeRunResult, packTitle: string) {
  const [background, logo] = await Promise.all([loadImage(campRiver), loadImage(appIcon)]);
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 630;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('无法创建成绩画布');

  const coverScale = Math.max(1200 / background.width, 630 / background.height);
  const width = background.width * coverScale;
  const height = background.height * coverScale;
  ctx.drawImage(background, (1200 - width) / 2, (630 - height) / 2, width, height);
  const shade = ctx.createLinearGradient(0, 0, 1200, 0);
  shade.addColorStop(0, 'rgba(10,17,32,0.98)');
  shade.addColorStop(0.52, 'rgba(10,17,32,0.88)');
  shade.addColorStop(1, 'rgba(10,17,32,0.12)');
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, 1200, 630);
  ctx.strokeStyle = 'rgba(251,191,36,0.28)';
  ctx.strokeRect(24.5, 24.5, 1151, 581);

  const sans = '"Segoe UI", "Microsoft YaHei", sans-serif';
  const mono = 'Consolas, "Courier New", monospace';
  function text(value: string, x: number, y: number, size: number, color: string, bold = false, numeric = false, maxWidth?: number) {
    ctx!.font = `${bold ? '700' : '400'} ${size}px ${numeric ? mono : sans}`;
    ctx!.fillStyle = color;
    // 按字符截断长课程名，避免挤压字形或越过安全区。
    if (maxWidth && ctx!.measureText(value).width > maxWidth) {
      const chars = Array.from(value);
      while (chars.length && ctx!.measureText(chars.join('') + '…').width > maxWidth) chars.pop();
      value = chars.join('') + '…';
    }
    ctx!.fillText(value, x, y);
  }

  ctx.drawImage(logo, 64, 58, 52, 52);
  text('CodeStep', 132, 94, 30, '#f8fafc', true);
  text(CHALLENGE_LABELS[result.challengeMode] || result.challengeMode, 64, 160, 20, '#fbbf24');
  text(packTitle, 64, 202, 24, '#cbd5e1', false, false, 620);

  text('FLOW SCORE', 64, 267, 18, '#cbd5e1');
  const score = String(result.flowScore);
  const scoreSize = Math.min(128, 560 / Math.max(score.length * 0.61, 1));
  text(score, 58, 380, scoreSize, '#fbbf24', true, true);

  ctx.fillStyle = 'rgba(10,17,32,0.6)';
  ctx.fillRect(56, 411, 618, 106);
  const stats = [
    { label: 'WPM', value: String(result.wpm) },
    { label: 'ACC', value: `${result.accuracy}%` },
    { label: 'MAX COMBO', value: `x${result.maxCombo}` },
  ];
  stats.forEach(({ label, value }, index) => {
    const x = 76 + index * 204;
    text(value, x, 457, Math.min(34, 174 / Math.max(value.length * 0.61, 1)), '#f8fafc', true, true);
    text(label, x, 490, 14, '#94a3b8');
    if (index < 2) {
      ctx.fillStyle = 'rgba(148,163,184,0.2)';
      ctx.fillRect(x + 179, 431, 1, 60);
    }
  });

  const details = [`完成 ${result.completedSegments} 个片段`];
  if (result.rank) details.push(`第 ${result.rank} 名`);
  if (result.isNewBest) details.push('新纪录！');
  text(details.join('  ·  '), 64, 560, 18, result.isNewBest ? '#fbbf24' : '#cbd5e1', false, false, 650);
  const date = new Date(result.createdAt);
  const dateText = Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('zh-CN');
  ctx.textAlign = 'right';
  text(dateText, 1136, 560, 16, '#cbd5e1');
  return canvas;
}
