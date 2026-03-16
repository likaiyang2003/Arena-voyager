(function() {
    'use strict';

    const root = globalThis.__LMNAV__ || (globalThis.__LMNAV__ = {});

    const CONTEXT_LIMIT = 200000;

    const COMPRESSION_PROMPT = [
        '请把当前这段 LMArena 对话压缩成一份高密度的“续接记忆”。',
        '',
        '目标：',
        '- 保留核心目标、上下文、约束、已确认结论、待办事项、用户偏好。',
        '- 让另一个模型拿到这份内容后，能立刻继续当前工作。',
        '',
        '输出结构：',
        '1. 核心目标',
        '2. 重要背景',
        '3. 约束与规则',
        '4. 当前进度',
        '5. 下一步建议',
        '',
        '要求：',
        '- 用中文输出',
        '- 内容紧凑，不要空话',
        '- 尽量保留关键技术细节和决策理由'
    ].join('\n');

    function debounce(fn, delay) {
        let timer = null;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timer);
            timer = window.setTimeout(() => {
                fn.apply(context, args);
            }, delay);
        };
    }

    function throttle(fn, delay) {
        let locked = false;
        let queuedArgs = null;
        let queuedContext = null;

        function run(context, args) {
            fn.apply(context, args);
            locked = true;
            window.setTimeout(() => {
                locked = false;
                if (!queuedArgs) {
                    return;
                }

                const nextArgs = queuedArgs;
                const nextContext = queuedContext;
                queuedArgs = null;
                queuedContext = null;
                run(nextContext, nextArgs);
            }, delay);
        }

        return function() {
            if (locked) {
                queuedArgs = arguments;
                queuedContext = this;
                return;
            }
            run(this, arguments);
        };
    }

    function safeJsonParse(raw, fallbackValue) {
        try {
            return JSON.parse(raw);
        } catch {
            return fallbackValue;
        }
    }

    function escapeHtml(value) {
        const div = document.createElement('div');
        div.textContent = value;
        return div.innerHTML;
    }

    function truncate(value, maxLength) {
        if (!value || value.length <= maxLength) {
            return value;
        }
        return value.slice(0, maxLength - 1) + '...';
    }

    function uid(prefix) {
        const seed = prefix + ':' + Date.now() + ':' + Math.random().toString(16).slice(2);
        return prefix + '-' + hashText(seed).slice(0, 10);
    }

    function hashText(value) {
        let hash = 2166136261 >>> 0;
        for (let index = 0; index < value.length; index += 1) {
            hash ^= value.charCodeAt(index);
            hash = Math.imul(hash, 16777619);
        }
        return (hash >>> 0).toString(16);
    }

    function sanitizeFilename(value) {
        return (value || '会话记录')
            .replace(/[<>:"/\\|?*\u0000-\u001F]/g, '')
            .replace(/\s+/g, '-')
            .slice(0, 80) || '会话记录';
    }

    function downloadTextFile(filename, content, mimeType) {
        const blob = new Blob([ content ], {
            type: mimeType + ';charset=utf-8'
        });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = filename;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    function readTextFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result || ''));
            reader.onerror = () => reject(reader.error || new Error('读取文件失败。'));
            reader.readAsText(file, 'utf-8');
        });
    }

    function copyText(text) {
        if (navigator.clipboard?.writeText) {
            return navigator.clipboard.writeText(text);
        }

        return new Promise((resolve) => {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            textarea.remove();
            resolve();
        });
    }

    function clampNumber(value, min, max) {
        return Math.min(max, Math.max(min, Math.round(value)));
    }

    function normalizeFolderPath(value) {
        return String(value || '')
            .split('/')
            .map((segment) => segment.trim())
            .filter(Boolean)
            .join(' / ');
    }

    function buildSummary(turns) {
        const userTurns = turns.filter((turn) => turn.role === 'user').map((turn) => turn.text);
        if (!userTurns.length) {
            return '';
        }

        const snippets = userTurns.slice(0, 3).map((text) => truncate(text.replace(/\s+/g, ' ').trim(), 72));
        return snippets.join(' | ');
    }

    function formatTime(timestamp) {
        try {
            return new Date(timestamp).toLocaleString('zh-CN', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return '';
        }
    }

    root.core = {
        CONTEXT_LIMIT: CONTEXT_LIMIT,
        COMPRESSION_PROMPT: COMPRESSION_PROMPT,
        debounce: debounce,
        throttle: throttle,
        safeJsonParse: safeJsonParse,
        escapeHtml: escapeHtml,
        truncate: truncate,
        uid: uid,
        hashText: hashText,
        sanitizeFilename: sanitizeFilename,
        downloadTextFile: downloadTextFile,
        readTextFile: readTextFile,
        copyText: copyText,
        clampNumber: clampNumber,
        normalizeFolderPath: normalizeFolderPath,
        buildSummary: buildSummary,
        formatTime: formatTime
    };
})();
