import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import svgPanZoom from 'svg-pan-zoom';
import elk from '@mermaid-js/layout-elk';
import { useTranslation } from 'react-i18next';
import { ErrorToast } from './ErrorToast';

type LayoutType = 'dagre' | 'elk';
type ThemeType = 'default' | 'neutral' | 'dark' | 'forest' | 'base';
type DirectionType = 'TB' | 'BT' | 'LR' | 'RL';

interface MermaidRendererProps {
  code: string;
  className?: string;
  initialLayout?: LayoutType;
  initialTheme?: ThemeType;
  initialDirection?: DirectionType;
  onLayoutChange?: (layout: LayoutType) => void;
  onThemeChange?: (theme: ThemeType) => void;
  onDirectionChange?: (direction: DirectionType) => void;
}

const layoutOptions = [
  { value: 'dagre' as LayoutType, label: 'Dagre', icon: '📊', descKey: 'editor.layoutDagre' },
  { value: 'elk' as LayoutType, label: 'ELK', icon: '✨', descKey: 'editor.layoutElk' },
];

const directionOptions = [
  { value: 'TB' as DirectionType, icon: '↓', labelKey: 'editor.directionTB' },
  { value: 'BT' as DirectionType, icon: '↑', labelKey: 'editor.directionBT' },
  { value: 'LR' as DirectionType, icon: '→', labelKey: 'editor.directionLR' },
  { value: 'RL' as DirectionType, icon: '←', labelKey: 'editor.directionRL' },
];

export function MermaidRenderer({
  code,
  className = '',
  initialLayout = 'dagre',
  initialTheme = 'default',
  initialDirection = 'TB',
  onLayoutChange,
  onThemeChange,
  onDirectionChange,
}: MermaidRendererProps) {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [renderKey, setRenderKey] = useState(0);
  // 直接使用 props 作为当前值，不维护内部状态
  const layout = initialLayout;
  const theme = initialTheme;
  const direction = initialDirection;
  const [showLayoutMenu, setShowLayoutMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showDirectionMenu, setShowDirectionMenu] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const panZoomInstance = useRef<any>(null);

  useEffect(() => {
    // 注册 ELK 布局引擎
    mermaid.registerLayoutLoaders(elk);

    // 根据布局类型配置不同的参数
    const config: any = layout === 'elk'
      ? {
          // ELK 自适应布局
          flowchart: {
            curve: 'linear',
            htmlLabels: true,
            padding: 30,
            nodeSpacing: 60,
            rankSpacing: 80,
            diagramPadding: 20,
            useMaxWidth: true,  // 官方推荐：自适应容器宽度
            defaultRenderer: 'elk',
          },
          elk: {
            nodePlacementStrategy: 'SIMPLE',
            mergeEdges: true,
          }
        }
      : {
          // Dagre 默认分层布局
          flowchart: {
            curve: 'linear',
            htmlLabels: true,
            padding: 40,
            nodeSpacing: 80,
            rankSpacing: 100,
            diagramPadding: 30,
            useMaxWidth: true,  // 官方推荐：自适应容器宽度
          }
        };

    mermaid.initialize({
      startOnLoad: false,
      theme: theme as any,  // 使用用户选择的主题
      securityLevel: 'loose',
      logLevel: 'error',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      ...config,
      // 只在使用 base 主题时才应用自定义 themeVariables
      ...(theme === 'base' && { themeVariables: {
        // 主色调 - 现代蓝色渐变
        primaryColor: '#e3f2fd',
        primaryTextColor: '#1565c0',
        primaryBorderColor: '#1976d2',

        // 次要色 - 紫色
        secondaryColor: '#f3e5f5',
        secondaryTextColor: '#6a1b9a',
        secondaryBorderColor: '#7b1fa2',

        // 强调色 - 青色
        tertiaryColor: '#e0f7fa',
        tertiaryTextColor: '#00695c',
        tertiaryBorderColor: '#00838f',

        // 线条和边框
        lineColor: '#455a64',

        // 背景色
        background: '#ffffff',
        mainBkg: '#e3f2fd',
        secondBkg: '#f3e5f5',
        tertiaryBkg: '#e0f7fa',

        // 字体大小
        fontSize: '16px',

        // 节点样式
        nodeBorder: '#1976d2',
        clusterBkg: '#f5f5f5',
        clusterBorder: '#9e9e9e',

        // 边框粗细
        strokeWidth: '3px',

        // 成功/错误/警告颜色
        errorBkgColor: '#ffebee',
        errorTextColor: '#c62828',
        warningBkgColor: '#fff3e0',
        warningTextColor: '#e65100',
        successBkgColor: '#e8f5e9',
        successTextColor: '#2e7d32',
      }}),
    } as any);
  }, [layout, theme]);

  useEffect(() => {
    const renderDiagram = async () => {
      if (!containerRef.current || !code.trim()) {
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }
        // 清理旧的pan-zoom实例
        if (panZoomInstance.current) {
          panZoomInstance.current.destroy();
          panZoomInstance.current = null;
        }
        return;
      }

      try {
        // 每次渲染前重新初始化 Mermaid 以清除缓存
        // 注册 ELK 布局引擎
        mermaid.registerLayoutLoaders(elk);

        // 根据布局类型配置不同的参数
        const config: any = layout === 'elk'
          ? {
              // ELK 自适应布局
              flowchart: {
                curve: 'linear',
                htmlLabels: true,
                padding: 30,
                nodeSpacing: 60,
                rankSpacing: 80,
                diagramPadding: 20,
                useMaxWidth: true,
                defaultRenderer: 'elk',
              },
              elk: {
                nodePlacementStrategy: 'SIMPLE',
                mergeEdges: true,
              }
            }
          : {
              // Dagre 默认分层布局
              flowchart: {
                curve: 'linear',
                htmlLabels: true,
                padding: 40,
                nodeSpacing: 80,
                rankSpacing: 100,
                diagramPadding: 30,
                useMaxWidth: true,
              }
            };

        mermaid.initialize({
          startOnLoad: false,
          theme: theme as any,
          securityLevel: 'loose',
          logLevel: 'error',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          ...config,
          ...(theme === 'base' && { themeVariables: {
            primaryColor: '#e3f2fd',
            primaryTextColor: '#1565c0',
            primaryBorderColor: '#1976d2',
            secondaryColor: '#f3e5f5',
            secondaryTextColor: '#6a1b9a',
            secondaryBorderColor: '#7b1fa2',
            tertiaryColor: '#e0f7fa',
            tertiaryTextColor: '#00695c',
            tertiaryBorderColor: '#00838f',
            lineColor: '#455a64',
            background: '#ffffff',
            mainBkg: '#e3f2fd',
            secondBkg: '#f3e5f5',
            tertiaryBkg: '#e0f7fa',
            fontSize: '16px',
            nodeBorder: '#1976d2',
            clusterBkg: '#f5f5f5',
            clusterBorder: '#9e9e9e',
            strokeWidth: '3px',
            errorBkgColor: '#ffebee',
            errorTextColor: '#c62828',
            warningBkgColor: '#fff3e0',
            warningTextColor: '#e65100',
            successBkgColor: '#e8f5e9',
            successTextColor: '#2e7d32',
          }}),
        } as any);

        // 检测是否为时序图且没有自定义颜色
        const isSequenceDiagram = /^\s*sequenceDiagram/i.test(code);
        const hasCustomColors = /%%\{.*init.*\}%%/i.test(code) || /actorBkg|actorBorder/i.test(code);

        // 根据用户选择的方向修改代码
        let modifiedCode = code;

        // 匹配 flowchart 或 graph 类型的图表，并替换或添加方向
        const flowchartMatch = modifiedCode.match(/^\s*(flowchart|graph)\s+(TB|BT|LR|RL|TD|BR)?/i);
        if (flowchartMatch) {
          // 如果已经有方向，替换它；如果没有，添加方向
          if (flowchartMatch[2]) {
            modifiedCode = modifiedCode.replace(
              /^\s*(flowchart|graph)\s+(TB|BT|LR|RL|TD|BR)?/i,
              `$1 ${direction}`
            );
          } else {
            modifiedCode = modifiedCode.replace(
              /^\s*(flowchart|graph)(?=\s|$)/i,
              `$1 ${direction}`
            );
          }
        }

        // 使用唯一ID和时间戳确保每次都重新渲染，包含方向信息避免缓存
        const id = `mermaid-${layout}-${theme}-${direction}-${renderKey}-${Date.now()}`;
        const { svg } = await mermaid.render(id, modifiedCode);

        // 清理 mermaid 可能创建的临时错误元素
        const tempErrorDiv = document.getElementById(id);
        if (tempErrorDiv && tempErrorDiv.parentElement) {
          tempErrorDiv.remove();
        }

        if (containerRef.current) {
          // 清理旧的pan-zoom实例
          if (panZoomInstance.current) {
            panZoomInstance.current.destroy();
            panZoomInstance.current = null;
          }

          // 先渲染新的 SVG，再清空容器，减少闪烁
          containerRef.current.innerHTML = svg;

          // 初始化 pan-zoom
          const svgElement = containerRef.current.querySelector('svg');
          if (svgElement) {
            // 关键：直接设置 SVG 尺寸为 100%，与缩略图一致的做法
            svgElement.style.width = '100%';
            svgElement.style.height = '100%';

            // 如果是时序图且没有自定义颜色，自动为每个 actor 分配不同颜色
            if (isSequenceDiagram && !hasCustomColors) {
              const colors = [
                { bg: '#e3f2fd', border: '#1976d2', text: '#1565c0' },  // 蓝色
                { bg: '#f3e5f5', border: '#7b1fa2', text: '#6a1b9a' },  // 紫色
                { bg: '#e0f7fa', border: '#00838f', text: '#00695c' },  // 青色
                { bg: '#fff3e0', border: '#e65100', text: '#e65100' },  // 橙色
                { bg: '#e8f5e9', border: '#2e7d32', text: '#2e7d32' },  // 绿色
                { bg: '#fce4ec', border: '#c2185b', text: '#c2185b' },  // 粉色
                { bg: '#fff9c4', border: '#f57f17', text: '#f57f17' },  // 黄色
                { bg: '#ede7f6', border: '#5e35b1', text: '#5e35b1' },  // 深紫色
              ];

              // 直接操作 SVG DOM 元素，找到所有矩形
              const allGroups = Array.from(svgElement.querySelectorAll('g'));
              const actorRects: { rect: SVGRectElement; text: SVGTextElement | null; x: number; }[] = [];

              // 查找包含矩形和文本的组
              allGroups.forEach(group => {
                const rect = group.querySelector('rect');
                const text = group.querySelector('text');

                // 如果组内有矩形和文本
                if (rect && text && text.textContent) {
                  const width = parseFloat(rect.getAttribute('width') || '0');
                  const height = parseFloat(rect.getAttribute('height') || '0');
                  const x = parseFloat(rect.getAttribute('x') || '0');
                  const y = parseFloat(rect.getAttribute('y') || '0');

                  // Actor 矩形的特征：
                  // 1. 高度在 60-70 之间（很稳定）
                  // 2. 宽度在 50-300 之间
                  // 3. y 坐标要么是 0（顶部）要么 > 800（底部）
                  // 4. 文本长度通常较短
                  const isTopOrBottom = y === 0 || y > 800;
                  const isActorSize = width > 50 && width < 300 && height >= 60 && height <= 70;
                  const hasShortText = text.textContent.length < 50;

                  if (isActorSize && isTopOrBottom && hasShortText) {
                    actorRects.push({ rect: rect as SVGRectElement, text: text as SVGTextElement, x });
                  }
                }
              });

              // 按 x 坐标排序
              actorRects.sort((a, b) => a.x - b.x);

              // 建立 x 坐标到颜色的映射
              const xToColorMap = new Map<number, typeof colors[0]>();
              const processedX = new Set<number>();
              let colorIndex = 0;

              actorRects.forEach(({ x }) => {
                if (!processedX.has(x)) {
                  processedX.add(x);
                  xToColorMap.set(x, colors[colorIndex % colors.length]);
                  colorIndex++;
                }
              });

              // 应用颜色到所有 actor 矩形和文本
              actorRects.forEach(({ rect, text, x }) => {
                const color = xToColorMap.get(x);
                if (color) {
                  rect.style.fill = color.bg;
                  rect.style.stroke = color.border;
                  rect.style.strokeWidth = '2px';

                  if (text) {
                    text.style.fill = color.text;
                    text.style.fontWeight = '600';
                  }
                }
              });

              // 处理 Note 框 - 使用统一的浅色样式，与 actor 区分
              const allRects = Array.from(svgElement.querySelectorAll('rect'));
              const processedActorRects = new Set(actorRects.map(({ rect }) => rect));

              allRects.forEach(rect => {
                const width = parseFloat(rect.getAttribute('width') || '0');
                const height = parseFloat(rect.getAttribute('height') || '0');

                // 检查是否已经被处理为 actor
                if (!processedActorRects.has(rect)) {
                  // Note 框通常尺寸较大
                  if (width > 150 && width < 350 && height > 60 && height < 150) {
                    // Note 框使用统一的浅黄色背景，与 actor 区分
                    rect.style.fill = '#fffbeb';  // 浅黄色背景
                    rect.style.stroke = '#f59e0b';  // 橙色边框
                    rect.style.strokeWidth = '2px';
                  }
                }
              });
            }

            panZoomInstance.current = svgPanZoom(svgElement, {
              zoomEnabled: true,
              controlIconsEnabled: false,
              fit: true,  // 官方推荐：初始化时自动适应容器
              center: true,  // 官方推荐：居中显示
              minZoom: 0.1,
              maxZoom: 10,
              zoomScaleSensitivity: 0.3,
            } as any);

            // 初始化后立即执行一次 fit 和 center，确保完整显示
            panZoomInstance.current.fit();
            panZoomInstance.current.center();
          }
        }
      } catch (err) {
        console.error('Mermaid render error:', err);
        const errorMsg = err instanceof Error ? err.message : t('renderer.renderError');
        setErrorMessage(errorMsg);

        // 完全清空容器，移除所有可能的错误内容
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }

        // 清理 mermaid 可能创建的任何错误元素
        const mermaidErrorDivs = document.querySelectorAll('[id^="mermaid-"]');
        mermaidErrorDivs.forEach(div => {
          if (div.textContent?.includes('Syntax error') || div.textContent?.includes('mermaid version')) {
            div.remove();
          }
        });
      }
    };

    // 使用防抖延迟渲染，减少编辑时的闪烁
    // 用户停止输入 600ms 后才渲染
    const debounceTimeoutId = setTimeout(() => {
      renderDiagram();
    }, 600);

    return () => {
      clearTimeout(debounceTimeoutId);
      // 不在这里清理 pan-zoom 实例，避免编辑时闪烁
    };
  }, [code, renderKey, layout, theme, direction]);

  // 只在 layout、theme 或 direction 改变时更新 renderKey，code 改变时使用防抖
  useEffect(() => {
    setRenderKey(prev => prev + 1);
  }, [layout, theme, direction]);

  // 缩放控制函数
  const handleZoomIn = () => {
    if (panZoomInstance.current) {
      panZoomInstance.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (panZoomInstance.current) {
      panZoomInstance.current.zoomOut();
    }
  };

  const handleReset = () => {
    if (panZoomInstance.current) {
      panZoomInstance.current.resetZoom();
      panZoomInstance.current.center();
      panZoomInstance.current.fit();
    }
  };

  const handleFit = () => {
    if (panZoomInstance.current) {
      panZoomInstance.current.fit();
      panZoomInstance.current.center();
    }
  };

  // 导出功能
  const handleExportSVG = () => {
    const svgElement = containerRef.current?.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mermaid-diagram-${Date.now()}.svg`;
    link.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const handleExportPNG = () => {
    const svgElement = containerRef.current?.querySelector('svg');
    if (!svgElement) return;

    // 克隆 SVG 元素以避免修改原始元素
    const clonedSvg = svgElement.cloneNode(true) as SVGElement;

    // 获取 SVG 的实际尺寸
    const bbox = svgElement.getBBox();
    const width = Math.ceil(bbox.width + bbox.x * 2) || svgElement.clientWidth || 800;
    const height = Math.ceil(bbox.height + bbox.y * 2) || svgElement.clientHeight || 600;

    // 设置 viewBox 和尺寸属性
    clonedSvg.setAttribute('width', width.toString());
    clonedSvg.setAttribute('height', height.toString());
    clonedSvg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    // 添加白色背景
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('width', '100%');
    rect.setAttribute('height', '100%');
    rect.setAttribute('fill', 'white');
    clonedSvg.insertBefore(rect, clonedSvg.firstChild);

    const svgData = new XMLSerializer().serializeToString(clonedSvg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // 使用 2x 分辨率以获得更清晰的图片
      canvas.width = width * 2;
      canvas.height = height * 2;
      ctx!.scale(2, 2);
      ctx?.drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `mermaid-diagram-${Date.now()}.png`;
          link.click();
          URL.revokeObjectURL(url);
        }
      }, 'image/png', 1.0);
    };

    img.onerror = () => {
      console.error('Failed to load SVG image');
      setShowExportMenu(false);
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    setShowExportMenu(false);
  };

  const handleExportMMD = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mermaid-diagram-${Date.now()}.mmd`;
    link.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  return (
    <div className={`mermaid-container relative ${className}`}>
      {/* 错误提示 */}
      {errorMessage && (
        <ErrorToast
          message={errorMessage}
          onClose={() => setErrorMessage(null)}
        />
      )}

      {/* 控制按钮组 */}
      {code.trim() && (
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {/* 布局切换按钮 */}
          <div className="relative">
            <button
              onClick={() => {
                setShowLayoutMenu(!showLayoutMenu);
                setShowThemeMenu(false);
                setShowExportMenu(false);
                setShowDirectionMenu(false);
              }}
              className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              title="切换布局"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span className="text-sm font-medium text-gray-700">{t('editor.layout')}</span>
            </button>

            {/* 布局菜单 */}
            {showLayoutMenu && (
              <div className="absolute top-0 left-full ml-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
                {layoutOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onLayoutChange?.(option.value);
                      setShowLayoutMenu(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                      layout === option.value ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="w-6 h-6 flex items-center justify-center text-xl">
                      {option.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium text-gray-900">{option.label}</div>
                      <div className="text-xs text-gray-500">{t(option.descKey)}</div>
                    </div>
                    {layout === option.value && (
                      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 主题切换按钮 */}
          <div className="relative">
            <button
              onClick={() => {
                setShowThemeMenu(!showThemeMenu);
                setShowLayoutMenu(false);
                setShowExportMenu(false);
                setShowDirectionMenu(false);
              }}
              className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              title="切换主题"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              <span className="text-sm font-medium text-gray-700">{t('editor.theme')}</span>
            </button>

            {/* 主题菜单 */}
            {showThemeMenu && (
              <div className="absolute top-0 left-full ml-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
                {(['default', 'neutral', 'dark', 'forest', 'base'] as ThemeType[]).map((themeName) => (
                  <button
                    key={themeName}
                    onClick={() => {
                      onThemeChange?.(themeName);
                      setShowThemeMenu(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                      theme === themeName ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="w-5 h-5 rounded border-2 border-gray-300" style={{
                      background: themeName === 'default' ? 'linear-gradient(135deg, #e3f2fd 0%, #90caf9 100%)' :
                                 themeName === 'neutral' ? '#f5f5f5' :
                                 themeName === 'dark' ? '#263238' :
                                 themeName === 'forest' ? 'linear-gradient(135deg, #c8e6c9 0%, #66bb6a 100%)' :
                                 'linear-gradient(135deg, #fff 0%, #e0e0e0 100%)'
                    }} />
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium text-gray-900 capitalize">{themeName}</div>
                    </div>
                    {theme === themeName && (
                      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 导出按钮 */}
          <div className="relative">
            <button
              onClick={() => {
                setShowExportMenu(!showExportMenu);
                setShowLayoutMenu(false);
                setShowThemeMenu(false);
                setShowDirectionMenu(false);
              }}
              className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              title="导出"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span className="text-sm font-medium text-gray-700">{t('editor.export')}</span>
            </button>

            {/* 导出菜单 */}
            {showExportMenu && (
              <div className="absolute top-0 left-full ml-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
                <button
                  onClick={handleExportPNG}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-gray-900">{t('editor.exportPng')}</div>
                    <div className="text-xs text-gray-500">{t('editor.exportPngDesc')}</div>
                  </div>
                </button>
                <button
                  onClick={handleExportSVG}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-gray-900">{t('editor.exportSvg')}</div>
                    <div className="text-xs text-gray-500">{t('editor.exportSvgDesc')}</div>
                  </div>
                </button>
                <button
                  onClick={handleExportMMD}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-gray-900">{t('editor.exportMmd')}</div>
                    <div className="text-xs text-gray-500">{t('editor.exportMmdDesc')}</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* 方向切换按钮 */}
          <div className="relative">
            <button
              onClick={() => {
                setShowDirectionMenu(!showDirectionMenu);
                setShowLayoutMenu(false);
                setShowThemeMenu(false);
                setShowExportMenu(false);
              }}
              className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              title={t('editor.direction')}
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
              <span className="text-sm font-medium text-gray-700">{t('editor.direction')}</span>
            </button>

            {/* 方向菜单 */}
            {showDirectionMenu && (
              <div className="absolute top-0 left-full ml-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
                {directionOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onDirectionChange?.(option.value);
                      setShowDirectionMenu(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                      direction === option.value ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="w-6 h-6 flex items-center justify-center text-xl">
                      {option.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium text-gray-900">{t(option.labelKey)}</div>
                    </div>
                    {direction === option.value && (
                      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 缩放控制按钮 */}
      {code.trim() && (
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2">
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="放大"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="缩小"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
            </svg>
          </button>
          <button
            onClick={handleFit}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="适应窗口"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
          <button
            onClick={handleReset}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="重置"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      )}

      <div
        ref={containerRef}
        className="flex items-center justify-center w-full h-full overflow-hidden"
      />
    </div>
  );
}
