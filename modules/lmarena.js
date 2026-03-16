(function() {
    'use strict';

    const root = globalThis.__LMNAV__;
    if (!root || !root.core) {
        return;
    }

    const core = root.core;

    function matches() {
        const hostname = location.hostname.toLowerCase();
        return hostname.includes('arena.ai') || hostname.includes('lmarena.ai') || hostname.includes('lmsys.org');
    }

    const MESSAGE_CONTENT_SELECTOR = [
        '[data-message-content]',
        '.prose',
        '[class*="prose"]',
        '[class*="markdown"]'
    ].join(', ');

    const MESSAGE_BLOCK_SELECTOR = [
        '[data-role]',
        '[data-message-author]',
        '[data-author]',
        '[class*="user-message"]',
        '[class*="assistant-message"]',
        '[class*="bot-message"]',
        '.justify-end',
        '.justify-start'
    ].join(', ');

    function cleanText(node) {
        return (node?.innerText || node?.textContent || '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function normalizeRole(value) {
        const normalized = String(value || '').trim().toLowerCase();
        if (!normalized) {
            return null;
        }

        if (/(^|[^a-z])(user|human)([^a-z]|$)/.test(normalized)) {
            return 'user';
        }

        if (/(assistant|bot|model|ai)/.test(normalized)) {
            return 'assistant';
        }

        return null;
    }

    function getTurnRole(node) {
        const roleHost = node?.closest?.(MESSAGE_BLOCK_SELECTOR);
        const roleCandidates = [
            roleHost?.dataset?.role,
            roleHost?.dataset?.messageAuthor,
            roleHost?.dataset?.author,
            node?.dataset?.role,
            node?.dataset?.messageAuthor,
            node?.dataset?.author
        ];

        for (const candidate of roleCandidates) {
            const role = normalizeRole(candidate);
            if (role) {
                return role;
            }
        }

        const className = String(roleHost?.className || node?.className || '').toLowerCase();
        if (className.includes('user-message')) {
            return 'user';
        }

        if (className.includes('assistant-message') || className.includes('bot-message')) {
            return 'assistant';
        }

        if (roleHost?.matches?.('.justify-end') || node?.closest?.('.justify-end')) {
            return 'user';
        }

        if (roleHost?.matches?.('.justify-start') || node?.closest?.('.justify-start')) {
            return 'assistant';
        }

        return null;
    }

    function isExtensionNode(node) {
        return Boolean(
            node &&
            node.closest &&
            node.closest('#lmarena-map-sidebar, #lmnav-outline-panel, #lmarena-hover-tooltip, #lmnav-toast'),
        );
    }

    function isVisibleNode(node) {
        if (!node || !node.isConnected) {
            return false;
        }

        if (isExtensionNode(node)) {
            return false;
        }

        const rect = node.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
    }

    function hasNavigationAncestor(node) {
        return Boolean(node?.closest?.('nav, aside, header, footer, [role="navigation"]'));
    }

    function getMessageBlockElement(node) {
        return node?.closest?.(MESSAGE_BLOCK_SELECTOR) || node || null;
    }

    function collectMessageContentNodes() {
        const nodes = Array.from(document.querySelectorAll(MESSAGE_CONTENT_SELECTOR));
        return nodes.filter((node) => {
            if (!(node instanceof HTMLElement)) {
                return false;
            }

            if (!isVisibleNode(node) || hasNavigationAncestor(node)) {
                return false;
            }

            return Boolean(getTurnRole(node));
        });
    }

    function findConversationFlowRoot(candidates) {
        const scores = new Map();

        candidates.forEach((turn) => {
            let current = turn.element;
            let depth = 0;

            while (current && current instanceof HTMLElement && current !== document.body && depth < 8) {
                if (!hasNavigationAncestor(current) && !isExtensionNode(current)) {
                    const entry = scores.get(current) || { score: 0, count: 0 };
                    entry.score += Math.max(10 - depth, 1);
                    entry.count += 1;
                    scores.set(current, entry);
                }

                current = current.parentElement;
                depth += 1;
            }
        });

        return Array.from(scores.entries())
            .map(([ element, data ]) => ({
                element: element,
                score: data.score + Math.min(data.count, 12) * 8
            }))
            .sort((left, right) => right.score - left.score)[0]?.element || null;
    }

    function getTurns() {
        const blockMap = new Map();

        collectMessageContentNodes().forEach((contentNode) => {
            const role = getTurnRole(contentNode);
            const messageBlock = getMessageBlockElement(contentNode);
            if (!role || !(messageBlock instanceof HTMLElement)) {
                return;
            }

            if (!isVisibleNode(messageBlock) || hasNavigationAncestor(messageBlock)) {
                return;
            }

            const text = cleanText(contentNode);
            if (!text || text.length < 2) {
                return;
            }

            const existing = blockMap.get(messageBlock);
            if (existing && existing.text.length >= text.length) {
                return;
            }

            blockMap.set(messageBlock, {
                id: core.uid(role),
                role: role,
                text: text,
                element: messageBlock,
                contentElement: contentNode
            });
        });

        Array.from(document.querySelectorAll(MESSAGE_BLOCK_SELECTOR)).forEach((messageBlock) => {
            if (!(messageBlock instanceof HTMLElement) || blockMap.has(messageBlock)) {
                return;
            }

            const role = getTurnRole(messageBlock);
            if (!role || !isVisibleNode(messageBlock) || hasNavigationAncestor(messageBlock)) {
                return;
            }

            const text = cleanText(messageBlock);
            if (!text || text.length < 2) {
                return;
            }

            blockMap.set(messageBlock, {
                id: core.uid(role),
                role: role,
                text: text,
                element: messageBlock,
                contentElement: messageBlock
            });
        });

        let turns = Array.from(blockMap.values());
        if (!turns.length) {
            return [];
        }

        const flowRoot = findConversationFlowRoot(turns);
        if (flowRoot instanceof HTMLElement) {
            turns = turns.filter((turn) => flowRoot.contains(turn.element));
        }

        return turns.sort((left, right) =>
            (window.scrollY + left.element.getBoundingClientRect().top) -
            (window.scrollY + right.element.getBoundingClientRect().top),
        );
    }

    function getConversationTitle(turns) {
        const firstUserTurn = turns.find((turn) => turn.role === 'user')?.text;
        if (firstUserTurn) {
            return core.truncate(firstUserTurn, 72);
        }

        return core.truncate((document.title || 'LMArena 会话').replace(/\s+-\s+LMArena.*$/i, '').trim(), 72);
    }

    function getConversationKey(turns) {
        const pathname = location.pathname && location.pathname !== '/' ? location.pathname : '';
        if (pathname) {
            return core.hashText(pathname);
        }

        return core.hashText(turns.slice(0, 8).map((turn) => turn.role + ':' + turn.text).join('|'));
    }

    function fillInput(text) {
        const textarea = document.querySelector('textarea[data-testid="textbox"]') || document.querySelector('textarea');
        if (!textarea) {
            return false;
        }

        const descriptor = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value');
        descriptor?.set?.call(textarea, text);
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        textarea.focus();
        return true;
    }

    function normalizeComparablePath(urlObject) {
        const pathname = (urlObject.pathname || '/').replace(/\/+$/, '') || '/';
        return pathname + (urlObject.search || '');
    }

    function findNativeConversationLink(targetUrl) {
        const targetPath = normalizeComparablePath(targetUrl);
        const anchors = Array.from(document.querySelectorAll('a[href]'));
        let bestMatch = null;
        let bestScore = -1;

        anchors.forEach((anchor) => {
            if (!anchor || !anchor.isConnected) {
                return;
            }

            if (anchor.closest('#lmarena-map-sidebar, #lmnav-outline-panel, #lmarena-hover-tooltip, #lmnav-toast')) {
                return;
            }

            let anchorUrl;
            try {
                anchorUrl = new URL(anchor.getAttribute('href'), location.href);
            } catch {
                return;
            }

            if (anchorUrl.origin !== targetUrl.origin) {
                return;
            }

            const anchorPath = normalizeComparablePath(anchorUrl);
            if (anchorPath !== targetPath && anchorUrl.pathname !== targetUrl.pathname) {
                return;
            }

            let score = 0;
            if (anchorPath === targetPath) score += 100;
            if (anchorUrl.pathname === targetUrl.pathname) score += 40;
            if (anchor.closest('[data-sidebar="sidebar"], [data-sidebar="content"], nav, aside, [role="navigation"]')) score += 25;
            if (isVisibleNode(anchor)) score += 15;
            if ((anchor.textContent || '').trim()) score += 5;

            if (score > bestScore) {
                bestScore = score;
                bestMatch = anchor;
            }
        });

        return bestMatch;
    }

    function clickNativeConversationLink(targetUrl) {
        const anchor = findNativeConversationLink(targetUrl);
        if (!anchor) {
            return false;
        }

        anchor.removeAttribute('target');
        anchor.dispatchEvent(new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            button: 0,
            view: window
        }));
        return true;
    }

    function navigateToUrl(url) {
        let targetUrl;
        try {
            targetUrl = new URL(url, location.href);
        } catch {
            return false;
        }

        if (targetUrl.origin !== location.origin) {
            window.location.href = targetUrl.href;
            return true;
        }

        if (normalizeComparablePath(targetUrl) === normalizeComparablePath(new URL(location.href))) {
            if ((targetUrl.hash || '') && targetUrl.hash !== location.hash) {
                window.location.hash = targetUrl.hash;
            }
            return true;
        }

        if (clickNativeConversationLink(targetUrl)) {
            return true;
        }

        try {
            history.pushState({}, '', targetUrl.href);
            window.dispatchEvent(new PopStateEvent('popstate', { state: history.state }));
            window.dispatchEvent(new Event('locationchange'));
            document.dispatchEvent(new Event('locationchange'));
            return true;
        } catch {
            window.location.href = targetUrl.href;
            return true;
        }
    }

    root.lmarena = {
        matches: matches,
        getTurns: getTurns,
        getConversationTitle: getConversationTitle,
        getConversationKey: getConversationKey,
        fillInput: fillInput,
        navigateToUrl: navigateToUrl
    };
})();
