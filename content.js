(function() {
    'use strict';

    const root = globalThis.__LMNAV__;
    if (!root || !root.core || !root.storage || !root.lmarena) {
        console.error('[LMArena Navigator] Core modules are missing.');
        return;
    }

    const core = root.core;
    const storage = root.storage;
    const arena = root.lmarena;

    if (!arena.matches()) {
        return;
    }

    const CONFIG = {
        minWidth: 220,
        maxWidth: 420
    };

    const ICONS = {
        sparkle: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z"/></svg>',
        minimize: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"></line></svg>',
        pin: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 17h14v-1.8a2 2 0 0 0-1.1-1.8l-1.8-.9A2 2 0 0 1 15 10.8V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.8a2 2 0 0 1-1.1 1.8l-1.8.9A2 2 0 0 0 5 15.2Z"></path></svg>',
        unpin: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="2" y1="2" x2="22" y2="22"></line><path d="M5 17h14v-1.8a2 2 0 0 0-1.1-1.8l-1.8-.9A2 2 0 0 1 15 10.8V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.8a2 2 0 0 1-1.1 1.8l-1.8.9A2 2 0 0 0 5 15.2Z"></path></svg>',
        theme: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"></path></svg>',
        search: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.7" y2="16.7"></line></svg>',
        arrowUp: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>',
        arrowDown: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>',
        refresh: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-2.6-6.4"></path><polyline points="21 3 21 9 15 9"></polyline></svg>',
        add: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>',
        trash: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
        copy: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>',
        export: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>',
        settings: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path></svg>',
        link: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1"></path><path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1"></path></svg>',
        upload: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>',
        folder: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H9l2 2h7.5A2.5 2.5 0 0 1 21 9.5v7A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5z"></path></svg>',
        folderOpen: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 8.5A2.5 2.5 0 0 1 5.5 6H9l2 2h7.5A2.5 2.5 0 0 1 21 10.5v1.2a2 2 0 0 1-.12.68l-1.62 4.5A2.5 2.5 0 0 1 16.9 18.5H5.7A2.7 2.7 0 0 1 3 15.8z"></path></svg>',
        messageSquare: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 18.5 3.8 21V6.5A2.5 2.5 0 0 1 6.3 4h11.4a2.5 2.5 0 0 1 2.5 2.5v8a2.5 2.5 0 0 1-2.5 2.5H7z"></path></svg>',
        moreVertical: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>',
        pinSmall: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 4v5l4 4H6l4-4V4"></path><path d="M12 13v7"></path></svg>',
        folderPlus: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H9l2 2h7.5A2.5 2.5 0 0 1 21 9.5v7A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5z"></path><path d="M12 10v5"></path><path d="M9.5 12.5h5"></path></svg>',
        pencil: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m4 20 4.5-1 9-9a2.1 2.1 0 0 0-3-3l-9 9z"></path><path d="M13.5 6.5 17.5 10.5"></path></svg>',
        chevronLeft: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18 9 12l6-6"></path></svg>',
        chevronRight: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"></path></svg>',
        outlineUser: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
        outlineHeading: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 12h10"></path></svg>'
    };

    const THEMES = [ 'auto', 'light', 'dark' ];
    const GLOBAL_SEARCH_PLACEHOLDER = '全局搜索文件夹、会话、提示词';
    const SEARCH_PLACEHOLDERS = {
        outline: '搜索当前对话大纲',
        prompts: '搜索提示词',
        library: '搜索已保存会话',
        tools: '工具页不支持搜索'
    };

    const LIBRARY_ALL_ID = '__all__';
    const LIBRARY_INBOX_ID = '__inbox__';
    const DEFAULT_FOLDER_COLOR = '#8ab4f8';
    const FOLDER_COLOR_PRESETS = [ '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#a855f7' ];
    const OUTLINE_AI_GROUPS_EXPANDED_BY_DEFAULT = true;
    const FLOATING_UI_SELECTOR = '#lmarena-map-sidebar, #lmnav-outline-panel, #lmarena-hover-tooltip, #lmnav-toast';
    const SIDEBAR_INTERNAL_SELECTOR = '#lmarena-map-sidebar-mount, ' + FLOATING_UI_SELECTOR;
    const OUTLINE_CONTENT_SELECTOR = '.bg-surface-raised, .prose';
    const OUTLINE_HEADING_SELECTOR = 'h1, h2, h3, h4, h5, h6';
    const collapsedGroups = new Set();
    const SIDEBAR_PRIMARY_NAV_RE = /(New Chat|Leaderboard|Search|新对话|排行榜|搜索)/i;
    const SIDEBAR_HISTORY_SECTION_RE = /(Older|Today|Yesterday|Archive|History|Earlier|历史|更早|今天|昨天|归档)/i;
    const AUTO_FOLDER_RULES = [
        { name: '鍩洪噾', keywords: [ '鍩洪噾', 'etf', '鐞嗚储', '鎸囨暟', '鎶曡祫', 'fund' ] },
        { name: 'API', keywords: [ 'api', '鎺ュ彛', 'sdk', 'endpoint', 'openai' ] },
        { name: 'Src', keywords: [ 'src', '婕忔礊', '澶嶇幇', 'cve', 'poc', 'rce', 'xss', 'sqli' ] },
        { name: 'Gateway', keywords: [ 'gateway', 'nvidia', 'cuda', 'network' ] },
        { name: 'Security', keywords: [ 'security', 'audit', 'exploit', 'payload', 'pentest' ] }
    ];

    const state = {
        theme: 'auto',
        currentTab: 'library',
        isAutoHide: false,
        isVisible: true,
        width: 236,
        layoutMode: 'floating',
        globalSearchTerm: '',
        outlineSearchTerm: '',
        prompts: [],
        savedConversations: [],
        savedFolders: [],
        collapsedFolderIds: [],
        suggestedFolderPath: '',
        lastSaveFolder: '',
        currentLibraryFolderId: LIBRARY_ALL_ID,
        tooltipEl: null,
        globalTooltipEl: null,
        toastEl: null,
        toastTextEl: null,
        toastUndoButtonEl: null,
        toastUndoCallback: null,
        toastExpireCallback: null,
        outlinePanelEl: null,
        showFolderSettings: false,
        activeFolderMenuId: null,
        activeFolderMenuDirection: 'down',
        activeFolderColorPickerId: null,
        folderMenuEl: null,
        folderEditSession: null,
        renamingFolderId: null,
        pendingFolderFocusId: null,
        draggedSavedId: null,
        draggedSavedSource: null,
        draggedNativeHistoryItem: null,
        activeDropFolderId: null,
        dragExpandTimer: null,
        toastTimer: null,
        scrollHandler: null,
        currentSnapshot: null,
        outlineItems: [],
        outlineCollapsed: false,
        outlinePanelTab: 'toc',
        outlinePromptDraft: null,
        pendingOutlinePromptFocus: false,
        lastSignature: '',
        sidebarHostSyncCleanup: null,
        cleanupFns: [],
        currentUrl: location.href
    };

    function normalizePromptItem(item) {
        const title = typeof item?.title === 'string' ? item.title.trim() : '';
        const content = typeof item?.content === 'string' ? item.content.trim() : '';
        if (!title || !content) {
            return null;
        }

        return {
            id: typeof item.id === 'string' && item.id ? item.id : core.uid('prompt'),
            title: title,
            content: content,
            tags: Array.isArray(item.tags) ? item.tags.map((tag) => String(tag).trim()).filter(Boolean) : [],
            createdAt: Number.isFinite(item.createdAt) ? item.createdAt : Date.now(),
            updatedAt: Number.isFinite(item.updatedAt) ? item.updatedAt : Date.now()
        };
    }

    function getConversationKeyFromUrl(url) {
        try {
            const targetUrl = new URL(url, location.href);
            const pathname = targetUrl.pathname && targetUrl.pathname !== '/' ? targetUrl.pathname : '';
            return pathname ? core.hashText(pathname) : core.hashText(targetUrl.href);
        } catch {
            return core.hashText(String(url || location.href));
        }
    }

    function normalizeComparableConversationUrl(url) {
        try {
            const targetUrl = new URL(url, location.href);
            const pathname = (targetUrl.pathname || '/').replace(/\/+$/, '') || '/';
            return targetUrl.origin + pathname + (targetUrl.search || '');
        } catch {
            return '';
        }
    }

    function normalizeSavedConversation(item) {
        if (!item || typeof item !== 'object') {
            return null;
        }

        const turns = Array.isArray(item.turns)
            ? item.turns
                .map((turn) => ({
                    role: turn && turn.role === 'assistant' ? 'assistant' : 'user',
                    text: typeof turn?.text === 'string' ? turn.text.trim() : ''
                }))
                .filter((turn) => turn.text)
            : [];

        const rawTitle = typeof item.title === 'string' ? item.title.replace(/\s+/g, ' ').trim() : '';
        const normalizedUrl = typeof item.url === 'string' && item.url ? item.url : location.href;
        const conversationKey = typeof item.conversationKey === 'string' && item.conversationKey
            ? item.conversationKey
            : turns.length
                ? arena.getConversationKey(turns)
                : getConversationKeyFromUrl(normalizedUrl);
        const source = item.source === 'native-history' ? 'native-history' : 'snapshot';

        if (!turns.length && !rawTitle) {
            return null;
        }

        return {
            id: typeof item.id === 'string' && item.id ? item.id : 'lmarena:' + conversationKey,
            site: 'LMArena',
            title: rawTitle || arena.getConversationTitle(turns) || core.truncate(normalizedUrl, 72),
            url: normalizedUrl,
            folderId: typeof item.folderId === 'string' && item.folderId ? item.folderId : null,
            folder: core.normalizeFolderPath(item.folder),
            summary: typeof item.summary === 'string' && item.summary.trim()
                ? item.summary.trim()
                : (turns.length ? core.buildSummary(turns) : rawTitle || core.truncate(normalizedUrl, 72)),
            turns: turns,
            savedAt: Number.isFinite(item.savedAt) ? item.savedAt : Date.now(),
            conversationKey: conversationKey,
            source: source
        };
    }

    function normalizeFolderItem(item) {
        const name = typeof item?.name === 'string' ? item.name.replace(/\s+/g, ' ').trim() : '';
        if (!name) {
            return null;
        }

        const children = Array.isArray(item.children)
            ? item.children
                .map((child) => typeof child === 'string' ? child : child?.id)
                .filter((childId) => typeof childId === 'string' && childId)
            : [];

        const color = typeof item?.color === 'string' && /^#[0-9a-f]{6}$/i.test(item.color)
            ? item.color
            : DEFAULT_FOLDER_COLOR;

        return {
            id: typeof item.id === 'string' && item.id ? item.id : core.uid('folder'),
            name: name,
            isPinned: Boolean(item?.isPinned),
            color: color,
            parentId: typeof item.parentId === 'string' && item.parentId ? item.parentId : null,
            children: children,
            createdAt: Number.isFinite(item.createdAt) ? item.createdAt : Date.now(),
            updatedAt: Number.isFinite(item.updatedAt) ? item.updatedAt : Date.now()
        };
    }

    function compareFolders(left, right) {
        if (Boolean(left?.isPinned) !== Boolean(right?.isPinned)) {
            return left?.isPinned ? -1 : 1;
        }
        return String(left?.name || '').localeCompare(String(right?.name || ''), 'zh-Hans-CN', { sensitivity: 'base' });
    }

    function getFolderById(folderId) {
        return state.savedFolders.find((folder) => folder.id === folderId) || null;
    }

    function isRealFolderId(folderId) {
        return Boolean(folderId) && folderId !== LIBRARY_ALL_ID && folderId !== LIBRARY_INBOX_ID;
    }

    function splitFolderPath(path) {
        const normalized = core.normalizeFolderPath(path);
        return normalized ? normalized.split(' / ').filter(Boolean) : [];
    }

    function findFolderByNameAndParent(name, parentId) {
        const normalizedName = name.trim().toLowerCase();
        return state.savedFolders.find((folder) => folder.parentId === (parentId || null) && folder.name.toLowerCase() === normalizedName) || null;
    }

    function getFolderLookup() {
        const map = new Map();
        state.savedFolders.forEach((folder) => {
            map.set(folder.id, folder);
        });
        return map;
    }

    function getFolderChildren(parentId) {
        return state.savedFolders
            .filter((folder) => folder.parentId === (parentId || null))
            .sort(compareFolders);
    }

    function buildFolderPath(folderId) {
        if (!folderId) {
            return '';
        }

        const lookup = getFolderLookup();
        const parts = [];
        let current = lookup.get(folderId);
        while (current) {
            parts.unshift(current.name);
            current = current.parentId ? lookup.get(current.parentId) : null;
        }
        return parts.join(' / ');
    }

    function ensureFolderPath(path) {
        const segments = splitFolderPath(path);
        if (!segments.length) {
            return null;
        }

        let parentId = null;
        segments.forEach((segment) => {
            const existing = findFolderByNameAndParent(segment, parentId);
            if (existing) {
                parentId = existing.id;
                return;
            }

            const folder = normalizeFolderItem({
                name: segment,
                parentId: parentId
            });
            state.savedFolders.push(folder);
            parentId = folder.id;
        });

        return parentId;
    }

    function syncConversationFolder(entry) {
        if (entry.folderId && !state.savedFolders.some((folder) => folder.id === entry.folderId)) {
            entry.folderId = null;
        }
        entry.folder = entry.folderId ? buildFolderPath(entry.folderId) : '';
        return entry;
    }

    function syncFolderChildren() {
        let changed = false;

        state.savedFolders.forEach((folder) => {
            const nextChildren = state.savedFolders
                .filter((candidate) => candidate.parentId === folder.id)
                .sort(compareFolders)
                .map((candidate) => candidate.id);

            if (JSON.stringify(folder.children || []) !== JSON.stringify(nextChildren)) {
                folder.children = nextChildren;
                changed = true;
            }
        });

        return changed;
    }

    function ensureLibraryState() {
        let changed = false;

        state.savedFolders = state.savedFolders
            .map(normalizeFolderItem)
            .filter(Boolean)
            .filter((folder, index, folders) => folders.findIndex((candidate) => candidate.id === folder.id) === index);

        state.savedFolders.forEach((folder) => {
            if (folder.parentId && !state.savedFolders.some((candidate) => candidate.id === folder.parentId)) {
                folder.parentId = null;
                changed = true;
            }
        });

        if (syncFolderChildren()) {
            changed = true;
        }

        state.collapsedFolderIds = state.collapsedFolderIds.filter((folderId) =>
            state.savedFolders.some((folder) => folder.id === folderId),
        );

        state.savedConversations.forEach((entry) => {
            if (!entry.folderId && entry.folder) {
                entry.folderId = ensureFolderPath(entry.folder);
                changed = true;
            }
            syncConversationFolder(entry);
        });

        if (!isRealFolderId(state.currentLibraryFolderId) && state.currentLibraryFolderId !== LIBRARY_ALL_ID && state.currentLibraryFolderId !== LIBRARY_INBOX_ID) {
            state.currentLibraryFolderId = LIBRARY_ALL_ID;
            changed = true;
        }

        if (isRealFolderId(state.currentLibraryFolderId) && !state.savedFolders.some((folder) => folder.id === state.currentLibraryFolderId)) {
            state.currentLibraryFolderId = LIBRARY_ALL_ID;
            changed = true;
        }

        if (state.activeFolderMenuId && !state.savedFolders.some((folder) => folder.id === state.activeFolderMenuId)) {
            state.activeFolderMenuId = null;
        }

        if (state.activeFolderColorPickerId && !state.savedFolders.some((folder) => folder.id === state.activeFolderColorPickerId)) {
            state.activeFolderColorPickerId = null;
        }

        if (state.renamingFolderId && !state.savedFolders.some((folder) => folder.id === state.renamingFolderId)) {
            state.renamingFolderId = null;
            state.pendingFolderFocusId = null;
            state.folderEditSession = null;
        }

        state.lastSaveFolder = core.normalizeFolderPath(state.lastSaveFolder);
        return changed;
    }

    function persistLibraryState() {
        return Promise.all([
            storage.set('savedConversations', state.savedConversations),
            storage.set('savedFolders', state.savedFolders),
            storage.set('collapsedFolderIds', state.collapsedFolderIds),
            storage.set('lastSaveFolder', state.lastSaveFolder),
            storage.set('currentLibraryFolderId', state.currentLibraryFolderId)
        ]);
    }

    function cloneSerializable(value) {
        if (typeof structuredClone === 'function') {
            return structuredClone(value);
        }

        return JSON.parse(JSON.stringify(value));
    }

    function createLibraryStateSnapshot() {
        return cloneSerializable({
            savedConversations: state.savedConversations,
            savedFolders: state.savedFolders,
            collapsedFolderIds: state.collapsedFolderIds,
            currentLibraryFolderId: state.currentLibraryFolderId,
            lastSaveFolder: state.lastSaveFolder
        });
    }

    function restoreLibraryStateSnapshot(snapshot) {
        if (!snapshot) {
            return;
        }

        state.savedConversations = Array.isArray(snapshot.savedConversations)
            ? snapshot.savedConversations.map(normalizeSavedConversation).filter(Boolean)
            : [];
        state.savedFolders = Array.isArray(snapshot.savedFolders)
            ? snapshot.savedFolders.map(normalizeFolderItem).filter(Boolean)
            : [];
        state.collapsedFolderIds = Array.isArray(snapshot.collapsedFolderIds)
            ? snapshot.collapsedFolderIds.map(String)
            : [];
        state.currentLibraryFolderId = typeof snapshot.currentLibraryFolderId === 'string'
            ? snapshot.currentLibraryFolderId
            : LIBRARY_ALL_ID;
        state.lastSaveFolder = typeof snapshot.lastSaveFolder === 'string'
            ? snapshot.lastSaveFolder
            : '';

        ensureLibraryState();
        updateSaveFolderInputValue(state.lastSaveFolder);
        closeFolderContextMenu();
        clearFolderEditState();
        renderLibrary();
        renderTools();
        if (state.globalSearchTerm) {
            renderGlobalSearchResults();
        }
    }

    function createPromptStateSnapshot() {
        return cloneSerializable({
            prompts: state.prompts,
            outlinePromptDraft: state.outlinePromptDraft
        });
    }

    function restorePromptStateSnapshot(snapshot) {
        if (!snapshot) {
            return;
        }

        state.prompts = Array.isArray(snapshot.prompts)
            ? snapshot.prompts.map(normalizePromptItem).filter(Boolean)
            : [];
        state.outlinePromptDraft = snapshot.outlinePromptDraft
            ? cloneSerializable(snapshot.outlinePromptDraft)
            : null;

        renderPrompts();
        renderOutlinePanelV2();
        renderTools();
    }

    function isFolderExpanded(folderId) {
        return !state.collapsedFolderIds.includes(folderId);
    }

    function setFolderExpanded(folderId, expanded) {
        if (!folderId) {
            return;
        }

        if (expanded) {
            state.collapsedFolderIds = state.collapsedFolderIds.filter((id) => id !== folderId);
        } else if (!state.collapsedFolderIds.includes(folderId)) {
            state.collapsedFolderIds.push(folderId);
        }

        persistLibraryState();
    }

    function expandFolderAncestors(folderId) {
        if (!folderId) {
            return;
        }

        const lookup = getFolderLookup();
        let currentId = folderId;

        while (currentId) {
            state.collapsedFolderIds = state.collapsedFolderIds.filter((id) => id !== currentId);
            currentId = lookup.get(currentId)?.parentId || null;
        }
    }

    function getFolderDescendantIds(folderId) {
        if (!folderId) {
            return [];
        }

        const ids = [];
        const visit = (currentId) => {
            ids.push(currentId);
            getFolderChildren(currentId).forEach((child) => visit(child.id));
        };

        visit(folderId);
        return ids;
    }

    function getSuggestedFolderPath(title) {
        const normalizedTitle = String(title || '').trim().toLowerCase();
        if (!normalizedTitle) {
            return '';
        }

        const existingMatch = state.savedFolders
            .map((folder) => ({
                folder: folder,
                path: buildFolderPath(folder.id)
            }))
            .sort((left, right) => right.path.length - left.path.length)
            .find((entry) => normalizedTitle.includes(entry.folder.name.toLowerCase()));

        if (existingMatch) {
            return existingMatch.path;
        }

        const matchedRule = AUTO_FOLDER_RULES.find((rule) =>
            rule.keywords.some((keyword) => normalizedTitle.includes(keyword.toLowerCase())),
        );

        if (!matchedRule) {
            return '';
        }

        const existingRuleFolder = state.savedFolders.find((folder) => folder.name.toLowerCase() === matchedRule.name.toLowerCase());
        return existingRuleFolder ? buildFolderPath(existingRuleFolder.id) : matchedRule.name;
    }


    function toggleFolderSettingsMenu(forceOpen) {
        state.showFolderSettings = typeof forceOpen === 'boolean' ? forceOpen : !state.showFolderSettings;

        const settingsButton = document.getElementById('btn-folder-settings');
        const settingsMenu = document.getElementById('library-settings-menu');
        if (settingsButton) {
            settingsButton.setAttribute('aria-expanded', state.showFolderSettings ? 'true' : 'false');
        }
        if (settingsMenu) {
            settingsMenu.hidden = !state.showFolderSettings;
        }
    }

    function renderLibraryChrome() {
        state.suggestedFolderPath = getSuggestedFolderPath(state.currentSnapshot?.title || '');

        const subtitleEl = document.getElementById('library-actions-subtitle');
        const renameButton = document.getElementById('btn-rename-folder');
        const deleteButton = document.getElementById('btn-delete-folder');
        const exportButton = document.getElementById('btn-export-library');

        if (subtitleEl) {
            subtitleEl.textContent = getCurrentFolderLabel();
        }

        if (renameButton) {
            renameButton.disabled = !isRealFolderId(state.currentLibraryFolderId);
        }

        if (deleteButton) {
            deleteButton.disabled = !isRealFolderId(state.currentLibraryFolderId);
        }

        if (exportButton) {
            exportButton.title = state.currentLibraryFolderId === LIBRARY_ALL_ID ? '导出全部会话' : '导出当前视图';
            exportButton.setAttribute('aria-label', exportButton.title);
        }

        toggleFolderSettingsMenu(state.showFolderSettings);
    }

    function resetFolderExpansionState() {
        state.collapsedFolderIds = [];
        toggleFolderSettingsMenu(false);
        persistLibraryState();
        renderLibrary();
        showToast('文件夹展开状态已重置。');
    }

    function exportLibraryData() {
        let folders = [];
        let conversations = [];

        if (state.currentLibraryFolderId === LIBRARY_ALL_ID) {
            folders = state.savedFolders.slice();
            conversations = state.savedConversations.slice();
        } else if (state.currentLibraryFolderId === LIBRARY_INBOX_ID) {
            conversations = state.savedConversations.filter((entry) => !entry.folderId);
        } else if (isRealFolderId(state.currentLibraryFolderId)) {
            const descendantIds = getFolderDescendantIds(state.currentLibraryFolderId);
            folders = state.savedFolders.filter((folder) => descendantIds.includes(folder.id));
            conversations = state.savedConversations.filter((entry) => descendantIds.includes(entry.folderId));
        }

        const payload = {
            format: 'lmarena-navigator.library.v1',
            exportedAt: new Date().toISOString(),
            currentFolderId: state.currentLibraryFolderId,
            currentFolderLabel: getCurrentFolderLabel(),
            folders: folders.map((folder) => ({
                id: folder.id,
                name: folder.name,
                parentId: folder.parentId,
                path: buildFolderPath(folder.id),
                createdAt: folder.createdAt,
                updatedAt: folder.updatedAt
            })),
            conversations: conversations
        };

        toggleFolderSettingsMenu(false);
        core.downloadTextFile(
            '资料库-' + core.sanitizeFilename(getCurrentFolderLabel()) + '.json',
            JSON.stringify(payload, null, 2),
            'application/json',
        );
        showToast('已导出当前文件夹视图。');
    }

    function isArenaConversationPath(pathname) {
        return /^\/c\/[a-z0-9-]+\/?$/i.test(String(pathname || ''))
            || /^\/chat\/[a-z0-9-]+\/?$/i.test(String(pathname || ''));
    }

    function getNativeHistoryItemTitle(anchor) {
        if (!(anchor instanceof HTMLElement)) {
            return '';
        }

        const preferredNode = anchor.querySelector('.truncate, [class*="truncate"]');
        const text = (preferredNode?.innerText || anchor.innerText || anchor.textContent || '')
            .replace(/\s+/g, ' ')
            .trim();
        return core.truncate(text, 160);
    }

    function isNativeHistoryAnchor(anchor) {
        if (!(anchor instanceof HTMLAnchorElement) || !anchor.isConnected) {
            return false;
        }

        if (matchesClosest(anchor, FLOATING_UI_SELECTOR)) {
            return false;
        }

        if (!anchor.closest('[data-sidebar="sidebar"], nav, aside, [role="navigation"]')) {
            return false;
        }

        let targetUrl;
        try {
            targetUrl = new URL(anchor.getAttribute('href'), location.href);
        } catch {
            return false;
        }

        if (targetUrl.origin !== location.origin || !isArenaConversationPath(targetUrl.pathname)) {
            return false;
        }

        return Boolean(getNativeHistoryItemTitle(anchor));
    }

    function buildNativeHistoryPayload(anchor) {
        if (!isNativeHistoryAnchor(anchor)) {
            return null;
        }

        let targetUrl;
        try {
            targetUrl = new URL(anchor.getAttribute('href'), location.href);
        } catch {
            return null;
        }

        const title = getNativeHistoryItemTitle(anchor);
        const conversationKey = getConversationKeyFromUrl(targetUrl.href);
        return {
            type: 'native-history',
            id: 'lmarena:' + conversationKey,
            title: title,
            url: targetUrl.href,
            conversationKey: conversationKey
        };
    }

    function decorateNativeHistoryItemsDraggable(rootNode) {
        const candidateRoot = rootNode instanceof Element || rootNode instanceof Document ? rootNode : document;
        const searchRoot = candidateRoot === document ? (findSidebarHost() || document) : candidateRoot;
        const anchors = Array.from(searchRoot.querySelectorAll('a[href]'));

        anchors.forEach((anchor) => {
            if (!(anchor instanceof HTMLAnchorElement)) {
                return;
            }

            const payload = buildNativeHistoryPayload(anchor);
            if (!payload) {
                return;
            }

            anchor.draggable = true;
            anchor.dataset.lmnavNativeHistoryItem = 'true';
            anchor.dataset.lmnavNativeHistoryId = payload.id;
            anchor.dataset.lmnavNativeHistoryTitle = payload.title;
            anchor.dataset.lmnavNativeHistoryUrl = payload.url;
            anchor.classList.add('lmnav-native-history-item');
        });
    }

    function parseNativeHistoryDragPayload(rawValue) {
        if (!rawValue) {
            return null;
        }

        const parsed = core.safeJsonParse(rawValue, null);
        if (!parsed || typeof parsed !== 'object') {
            return null;
        }

        const url = typeof parsed.url === 'string' ? parsed.url : '';
        const title = typeof parsed.title === 'string' ? parsed.title.replace(/\s+/g, ' ').trim() : '';
        if (!url || !title) {
            return null;
        }

        const conversationKey = typeof parsed.conversationKey === 'string' && parsed.conversationKey
            ? parsed.conversationKey
            : getConversationKeyFromUrl(url);

        try {
            return {
                type: 'native-history',
                id: typeof parsed.id === 'string' && parsed.id ? parsed.id : 'lmarena:' + conversationKey,
                title: title,
                url: new URL(url, location.href).href,
                conversationKey: conversationKey
            };
        } catch {
            return null;
        }
    }

    function setNativeHistoryDragImage(event, title) {
        if (!event.dataTransfer) {
            return;
        }

        const dragGhost = document.createElement('div');
        dragGhost.className = 'lmnav-drag-ghost';
        dragGhost.textContent = core.truncate(title || '会话', 28);
        document.body.appendChild(dragGhost);
        event.dataTransfer.setDragImage(dragGhost, 18, 14);
        window.requestAnimationFrame(() => dragGhost.remove());
    }

    function getActiveFolderDropPayload(event) {
        if (state.draggedSavedId) {
            return {
                type: 'saved-conversation',
                savedId: state.draggedSavedId
            };
        }

        if (state.draggedNativeHistoryItem) {
            return state.draggedNativeHistoryItem;
        }

        return parseNativeHistoryDragPayload(event?.dataTransfer?.getData('application/x-lmnav-native-history'))
            || parseNativeHistoryDragPayload(event?.dataTransfer?.getData('text/plain'));
    }

    function clearFolderDropTargets() {
        document.querySelectorAll('.folder-node.drop-target, .folder-node.drag-hover').forEach((node) => {
            node.classList.remove('drop-target', 'drag-hover');
        });
        state.activeDropFolderId = null;
    }

    function clearLibraryDragState() {
        clearTimeout(state.dragExpandTimer);
        state.dragExpandTimer = null;
        clearFolderDropTargets();
        document.querySelectorAll('.library-item.dragging').forEach((item) => {
            item.classList.remove('dragging');
        });
        document.querySelectorAll('.lmnav-native-history-dragging').forEach((item) => {
            item.classList.remove('lmnav-native-history-dragging');
        });
        state.draggedSavedId = null;
        state.draggedSavedSource = null;
        state.draggedNativeHistoryItem = null;
    }

    function getDropAssignmentFolderId(folderId) {
        if (!folderId || folderId === LIBRARY_ALL_ID || folderId === LIBRARY_INBOX_ID) {
            return null;
        }

        return isRealFolderId(folderId) ? folderId : null;
    }

    function getDropTargetLabel(folderId) {
        if (!folderId || folderId === LIBRARY_INBOX_ID) {
            return '收纳箱';
        }

        if (folderId === LIBRARY_ALL_ID) {
            return '未分类';
        }

        return buildFolderPath(folderId) || '收纳箱';
    }

    function setActiveFolderDropTarget(node) {
        if (!node || node.dataset.acceptDrop !== 'true') {
            return;
        }

        if (state.activeDropFolderId === node.dataset.folderId) {
            return;
        }

        clearFolderDropTargets();
        node.classList.add('drop-target', 'drag-hover');
        state.activeDropFolderId = node.dataset.folderId;
    }

    function getSavedConversationMetaText(entry) {
        const messageCount = Array.isArray(entry?.turns) ? entry.turns.length : 0;
        const sourceLabel = messageCount > 0
            ? messageCount + ' 条消息'
            : (entry?.source === 'native-history' ? '历史入口' : '链接收藏');
        return sourceLabel + (entry?.folder ? ' · ' + entry.folder : '');
    }

    function findSavedConversationIndexByUrl(url) {
        const comparableUrl = normalizeComparableConversationUrl(url);
        const conversationKey = getConversationKeyFromUrl(url);

        return state.savedConversations.findIndex((entry) =>
            entry.id === 'lmarena:' + conversationKey
            || (entry.conversationKey && entry.conversationKey === conversationKey)
            || (comparableUrl && normalizeComparableConversationUrl(entry.url) === comparableUrl),
        );
    }

    function navigateToSavedConversation(entry) {
        if (!entry?.url) {
            return;
        }

        const navigated = typeof arena.navigateToUrl === 'function'
            ? arena.navigateToUrl(entry.url)
            : false;

        if (!navigated) {
            window.location.href = entry.url;
        }
    }

    function createFolderRecord(input) {
        return normalizeFolderItem({
            id: input?.id,
            name: input?.name || '新建文件夹',
            isPinned: Boolean(input?.isPinned),
            color: input?.color || DEFAULT_FOLDER_COLOR,
            parentId: typeof input?.parentId === 'string' && input.parentId ? input.parentId : null,
            children: Array.isArray(input?.children) ? input.children : [],
            createdAt: input?.createdAt,
            updatedAt: input?.updatedAt
        });
    }

    function destroyFloatingFolderMenu() {
        if (state.folderMenuEl && state.folderMenuEl.remove) {
            state.folderMenuEl.remove();
        }
        state.folderMenuEl = null;
    }

    function syncFolderMenuOpenState() {
        document.querySelectorAll('.folder-node.menu-open').forEach((node) => {
            node.classList.remove('menu-open');
        });

        if (!state.activeFolderMenuId) {
            return;
        }

        const activeRow = document.querySelector('.folder-node[data-folder-id="' + state.activeFolderMenuId + '"]');
        activeRow?.classList.add('menu-open');
    }

    function getFolderMenuTriggerElement(folderId, fallbackEl) {
        if (fallbackEl?.isConnected) {
            return fallbackEl;
        }

        return document.querySelector('[data-folder-menu-trigger="' + folderId + '"]');
    }

    function buildFolderActionMenu(folder) {
        const pinLabel = folder.isPinned ? '取消置顶' : '置顶';
        const colorPicker = state.activeFolderColorPickerId === folder.id
            ? `
                <div class="folder-color-picker" data-folder-color-picker="${folder.id}">
                    ${FOLDER_COLOR_PRESETS.map((color) => `
                        <button class="folder-color-swatch${folder.color === color ? ' active' : ''}" type="button" data-folder-color="${color}" data-folder-id="${folder.id}" style="--folder-swatch:${color}" title="${color}"></button>
                    `).join('')}
                </div>
            `
            : '';

        return `
            <button class="folder-menu-item" type="button" data-folder-action="toggle-pin" data-folder-id="${folder.id}">
                <span class="folder-menu-icon" aria-hidden="true">${ICONS.pinSmall}</span>
                <span>${pinLabel}</span>
            </button>
            <button class="folder-menu-item" type="button" data-folder-action="create-child" data-folder-id="${folder.id}">
                <span class="folder-menu-icon" aria-hidden="true">${ICONS.folderPlus}</span>
                <span>创建子文件夹</span>
            </button>
            <button class="folder-menu-item" type="button" data-folder-action="rename" data-folder-id="${folder.id}">
                <span class="folder-menu-icon" aria-hidden="true">${ICONS.pencil}</span>
                <span>重命名</span>
            </button>
            <button class="folder-menu-item" type="button" data-folder-action="toggle-color" data-folder-id="${folder.id}">
                <span class="folder-menu-icon folder-menu-icon--color" aria-hidden="true" style="color:${folder.color}">${ICONS.folder}</span>
                <span>更改颜色</span>
            </button>
            ${colorPicker}
            <button class="folder-menu-item danger" type="button" data-folder-action="delete" data-folder-id="${folder.id}">
                <span class="folder-menu-icon" aria-hidden="true">${ICONS.trash}</span>
                <span>删除</span>
            </button>
        `;
    }

    function renderFloatingFolderMenu(anchorEl) {
        destroyFloatingFolderMenu();
        syncFolderMenuOpenState();

        if (!isRealFolderId(state.activeFolderMenuId)) {
            return;
        }

        const folder = getFolderById(state.activeFolderMenuId);
        const triggerEl = getFolderMenuTriggerElement(state.activeFolderMenuId, anchorEl);
        if (!folder || !triggerEl) {
            closeFolderContextMenu();
            return;
        }

        const menuEl = document.createElement('div');
        menuEl.className = 'folder-context-menu';
        menuEl.dataset.folderMenu = folder.id;
        menuEl.setAttribute('role', 'menu');
        menuEl.style.position = 'fixed';
        menuEl.style.left = '0px';
        menuEl.style.top = '0px';
        menuEl.style.visibility = 'hidden';
        menuEl.innerHTML = buildFolderActionMenu(folder);
        document.body.appendChild(menuEl);

        const triggerRect = triggerEl.getBoundingClientRect();
        const menuRect = menuEl.getBoundingClientRect();
        const offset = 6;
        const viewportPadding = 8;

        let left = triggerRect.right - menuRect.width;
        if (left < viewportPadding) {
            left = viewportPadding;
        }
        if (left + menuRect.width > window.innerWidth - viewportPadding) {
            left = Math.max(viewportPadding, window.innerWidth - menuRect.width - viewportPadding);
        }

        let top = triggerRect.bottom + offset;
        let direction = 'down';
        if (top + menuRect.height > window.innerHeight - viewportPadding && triggerRect.top - offset - menuRect.height >= viewportPadding) {
            top = triggerRect.top - menuRect.height - offset;
            direction = 'up';
        }
        if (top < viewportPadding) {
            top = viewportPadding;
        }
        if (top + menuRect.height > window.innerHeight - viewportPadding) {
            top = Math.max(viewportPadding, window.innerHeight - menuRect.height - viewportPadding);
        }

        state.activeFolderMenuDirection = direction;
        menuEl.classList.add('folder-context-menu--' + direction);
        menuEl.style.left = Math.round(left) + 'px';
        menuEl.style.top = Math.round(top) + 'px';
        menuEl.style.visibility = 'visible';
        state.folderMenuEl = menuEl;
    }

    function closeFolderContextMenu() {
        state.activeFolderMenuId = null;
        state.activeFolderColorPickerId = null;
        destroyFloatingFolderMenu();
        syncFolderMenuOpenState();
    }

    function toggleFolderContextMenu(folderId, anchorEl) {
        if (!isRealFolderId(folderId)) {
            return;
        }

        if (state.activeFolderMenuId === folderId) {
            closeFolderContextMenu();
            return;
        }

        state.activeFolderMenuId = folderId;
        state.activeFolderColorPickerId = null;
        renderFloatingFolderMenu(anchorEl);
    }

    function syncFolderInlineEditor() {
        if (!state.pendingFolderFocusId) {
            return;
        }

        const folderId = state.pendingFolderFocusId;
        state.pendingFolderFocusId = null;
        window.requestAnimationFrame(() => {
            const input = document.querySelector('.folder-rename-input[data-folder-id="' + folderId + '"]');
            if (!input) {
                return;
            }

            if (!input.dataset.inlineEditBound) {
                input.dataset.inlineEditBound = 'true';
                input.addEventListener('keydown', handleFolderRenameInputKeyDown);
                input.addEventListener('blur', handleFolderRenameInputBlur);
            }

            input.focus();
            input.select();
        });
    }

    function getFolderEditSession(folderId) {
        if (!state.folderEditSession) {
            return null;
        }

        if (folderId && state.folderEditSession.folderId !== folderId) {
            return null;
        }

        return state.folderEditSession;
    }

    function clearFolderEditState() {
        state.renamingFolderId = null;
        state.pendingFolderFocusId = null;
        state.folderEditSession = null;
    }

    function beginFolderEdit(folderId, mode, extra) {
        const folder = getFolderById(folderId);
        if (!folder) {
            return;
        }

        state.renamingFolderId = folderId;
        state.pendingFolderFocusId = folderId;
        state.folderEditSession = {
            folderId: folderId,
            mode: mode,
            originalName: extra?.originalName || folder.name,
            fallbackFolderId: extra?.fallbackFolderId ?? state.currentLibraryFolderId,
            parentId: extra?.parentId ?? folder.parentId ?? null
        };
    }

    function updateSaveFolderInputValue(value) {
        const input = document.getElementById('save-folder-input');
        if (input) {
            input.value = value || '';
        }
    }

    function updateMainSearchInputValue(value) {
        const input = document.getElementById('map-search-input');
        if (input) {
            input.value = value || '';
        }
    }

    function revertFolderSelectionAfterEdit(session) {
        if (!session) {
            return;
        }

        if (session.fallbackFolderId === LIBRARY_ALL_ID || session.fallbackFolderId === LIBRARY_INBOX_ID) {
            state.currentLibraryFolderId = session.fallbackFolderId;
            return;
        }

        if (isRealFolderId(session.fallbackFolderId) && getFolderById(session.fallbackFolderId)) {
            state.currentLibraryFolderId = session.fallbackFolderId;
            return;
        }

        state.currentLibraryFolderId = session.parentId ? session.parentId : LIBRARY_INBOX_ID;
    }

    function discardCreatedFolder(session) {
        if (!session?.folderId) {
            return false;
        }

        const folder = getFolderById(session.folderId);
        if (!folder) {
            return false;
        }

        state.savedConversations.forEach((entry) => {
            if (entry.folderId === folder.id) {
                entry.folderId = null;
            }
            syncConversationFolder(entry);
        });

        state.savedFolders = state.savedFolders.filter((entry) => entry.id !== folder.id);
        state.collapsedFolderIds = state.collapsedFolderIds.filter((candidateId) => candidateId !== folder.id);
        revertFolderSelectionAfterEdit(session);
        syncFolderChildren();
        state.lastSaveFolder = isRealFolderId(state.currentLibraryFolderId) ? buildFolderPath(state.currentLibraryFolderId) : '';
        updateSaveFolderInputValue(state.lastSaveFolder);
        return true;
    }

    function cancelFolderEdit(folderId) {
        const session = getFolderEditSession(folderId);
        if (!session) {
            clearFolderEditState();
            renderLibrary();
            return;
        }

        if (session.mode === 'create') {
            discardCreatedFolder(session);
        }

        clearFolderEditState();
        persistLibraryState().catch(() => {}).finally(() => {
            renderLibrary();
        });
    }

    function handleFolderRenameInputKeyDown(event) {
        const input = event.currentTarget;
        if (!(input instanceof HTMLInputElement)) {
            return;
        }

        if (event.key === 'Enter') {
            event.preventDefault();
            event.stopPropagation();
            commitFolderRename(input.dataset.folderId, input.value);
            return;
        }

        if (event.key === 'Escape') {
            event.preventDefault();
            event.stopPropagation();
            cancelFolderEdit(input.dataset.folderId);
        }
    }

    function handleFolderRenameInputBlur(event) {
        const input = event.currentTarget;
        if (!(input instanceof HTMLInputElement)) {
            return;
        }

        commitFolderRename(input.dataset.folderId, input.value);
    }

    function getFolderNodeIcon(expanded, color) {
        const iconColor = color || DEFAULT_FOLDER_COLOR;
        return `<span class="folder-node-icon" aria-hidden="true" style="color:${iconColor}">${expanded ? ICONS.folderOpen : ICONS.folder}</span>`;
    }

    function getConversationNodeIcon() {
        return `<span class="lmnav-tree-icon" aria-hidden="true">${ICONS.messageSquare}</span>`;
    }

    function buildFolderNodeContent(folder, options) {
        const expanded = Boolean(options?.expanded);
        const expandable = Boolean(options?.expandable);
        const isRenaming = state.renamingFolderId === folder.id;
        const toggleControl = expandable
            ? `<button class="folder-expand-toggle${expanded ? ' expanded' : ''}" type="button" data-folder-toggle="${folder.id}" aria-label="${expanded ? '收起文件夹' : '展开文件夹'}"></button>`
            : '<span class="folder-expand-toggle ghost" aria-hidden="true"></span>';
        const nameContent = isRenaming
            ? `<input class="folder-rename-input" data-folder-id="${folder.id}" type="text" value="${core.escapeHtml(folder.name)}" autofocus />`
            : `<span class="folder-node-name">${core.escapeHtml(folder.name)}</span>`;
        const pinBadge = folder.isPinned ? `<span class="folder-pin-indicator" aria-hidden="true">${ICONS.pinSmall}</span>` : '';
        const menuButton = isRealFolderId(folder.id)
            ? `
                <div class="folder-node-actions">
                    <button class="folder-more-btn" type="button" data-folder-menu-trigger="${folder.id}" aria-label="更多操作" title="更多操作">
                        ${ICONS.moreVertical}
                    </button>
                </div>
            `
            : '';

        return `
            <div class="folder-node-main">
                ${toggleControl}
                ${getFolderNodeIcon(expanded, folder.color)}
                ${nameContent}
                ${pinBadge}
            </div>
            <div class="folder-node-side">
                <span class="folder-node-count">${getFolderEntryCount(folder.id)}</span>
                ${menuButton}
            </div>
        `;
    }

    function createFolderNodeElement(folder, options) {
        const row = document.createElement('div');
        const depth = Number(options?.depth || 0);
        const indentStep = Number(options?.indentStep || 16);
        const expanded = Boolean(options?.expanded);
        const expandable = Boolean(options?.expandable);
        const isActive = state.currentLibraryFolderId === folder.id;
        const isMenuOpen = state.activeFolderMenuId === folder.id;
        const isRenaming = state.renamingFolderId === folder.id;

        row.className = 'folder-node folder-item'
            + (isActive ? ' active' : '')
            + (isMenuOpen ? ' menu-open' : '')
            + (isRenaming ? ' renaming' : '');
        row.dataset.folderId = folder.id;
        row.dataset.acceptDrop = options?.acceptDrop === false ? 'false' : 'true';
        row.dataset.depth = String(depth);
        row.tabIndex = 0;
        row.setAttribute('role', 'treeitem');
        if (expandable) {
            row.setAttribute('aria-expanded', String(expanded));
        } else {
            row.removeAttribute('aria-expanded');
        }
        if (depth > 0) {
            row.style.setProperty('--tree-guide-left', (20 + ((depth - 1) * indentStep)) + 'px');
        }
        row.style.paddingLeft = 12 + (depth * indentStep) + 'px';
        row.innerHTML = buildFolderNodeContent(folder, {
            expanded: expanded,
            expandable: expandable
        });
        bindGlobalTooltipEvents(row, buildFolderPath(folder.id) || folder.name);
        return row;
    }

    function getCurrentFolderLabel() {
        if (state.currentLibraryFolderId === LIBRARY_ALL_ID) {
            return '鍏ㄩ儴浼氳瘽';
        }
        if (state.currentLibraryFolderId === LIBRARY_INBOX_ID) {
            return '收纳箱';
        }
        return buildFolderPath(state.currentLibraryFolderId) || '资料库';
    }

    function getFolderEntryCount(folderId) {
        return state.savedConversations.filter((entry) => {
            if (folderId === LIBRARY_ALL_ID) {
                return true;
            }
            if (folderId === LIBRARY_INBOX_ID) {
                return !entry.folderId;
            }
            return entry.folderId === folderId;
        }).length;
    }

    function getVisibleLibraryEntries() {
        let items = state.savedConversations.slice();

        if (state.currentLibraryFolderId === LIBRARY_INBOX_ID) {
            items = items.filter((entry) => !entry.folderId);
        } else if (isRealFolderId(state.currentLibraryFolderId)) {
            items = items.filter((entry) => entry.folderId === state.currentLibraryFolderId);
        }

        return items;
    }

    async function loadState() {
        const data = await storage.getMany({
            theme: 'auto',
            activeTab: 'library',
            autoHide: false,
            outlineCollapsed: false,
            sidebarWidth: 236,
            promptVault: [],
            savedConversations: [],
            savedFolders: [],
            collapsedFolderIds: [],
            lastSaveFolder: '',
            currentLibraryFolderId: LIBRARY_ALL_ID
        });

        state.theme = THEMES.includes(data.theme) ? data.theme : 'auto';
        state.currentTab = SEARCH_PLACEHOLDERS[data.activeTab] ? data.activeTab : 'library';
        state.isAutoHide = Boolean(data.autoHide);
        state.outlineCollapsed = Boolean(data.outlineCollapsed);
        const storedWidth = Number(data.sidebarWidth);
        const normalizedWidth = storedWidth === 340 ? 236 : (storedWidth || 236);
        state.width = core.clampNumber(normalizedWidth, CONFIG.minWidth, CONFIG.maxWidth);
        state.prompts = Array.isArray(data.promptVault) ? data.promptVault.map(normalizePromptItem).filter(Boolean) : [];
        state.savedConversations = Array.isArray(data.savedConversations) ? data.savedConversations.map(normalizeSavedConversation).filter(Boolean) : [];
        state.savedFolders = Array.isArray(data.savedFolders) ? data.savedFolders.map(normalizeFolderItem).filter(Boolean) : [];
        state.collapsedFolderIds = Array.isArray(data.collapsedFolderIds) ? data.collapsedFolderIds.map(String) : [];
        state.lastSaveFolder = typeof data.lastSaveFolder === 'string' ? data.lastSaveFolder : '';
        state.currentLibraryFolderId = typeof data.currentLibraryFolderId === 'string' ? data.currentLibraryFolderId : LIBRARY_ALL_ID;
        ensureLibraryState();
    }

    function getSidebar() {
        return document.getElementById('lmarena-map-sidebar');
    }

    function getSidebarMount() {
        return document.getElementById('lmarena-map-sidebar-mount');
    }

    function getOutlinePanel() {
        return document.getElementById('lmnav-outline-panel');
    }

    function cleanupEmbeddedHostStateObserver() {
        if (typeof state.sidebarHostSyncCleanup === 'function') {
            try {
                state.sidebarHostSyncCleanup();
            } catch (error) {
                console.error(error);
            }
            state.sidebarHostSyncCleanup = null;
        }
    }

    function getEmbeddedSidebarHost() {
        const mount = getSidebarMount();
        if (!mount) {
            return null;
        }

        return mount.closest('[data-sidebar="sidebar"]') || mount.parentElement || null;
    }

    function isEmbeddedSidebarHostCollapsed(host) {
        if (!(host instanceof HTMLElement)) {
            return false;
        }

        const target = host.matches('[data-sidebar="sidebar"]')
            ? host
            : host.closest('[data-sidebar="sidebar"]') || host;
        const collapsible = String(target.getAttribute('data-collapsible') || host.getAttribute('data-collapsible') || '').toLowerCase();
        const hostState = String(target.getAttribute('data-state') || host.getAttribute('data-state') || '').toLowerCase();
        const width = Math.round(target.getBoundingClientRect().width || host.getBoundingClientRect().width || 0);

        return collapsible === 'icon'
            || collapsible === 'offcanvas'
            || hostState === 'collapsed'
            || target.classList.contains('collapsed')
            || target.classList.contains('is-mini')
            || (width > 0 && width <= 96);
    }

    function syncEmbeddedCompactState() {
        const sidebar = getSidebar();
        const mount = getSidebarMount();
        const host = getEmbeddedSidebarHost();
        const isEmbedded = Boolean(sidebar && mount && sidebar.classList.contains('embedded-layout'));
        const isCompact = isEmbedded && isEmbeddedSidebarHostCollapsed(host);

        if (mount) {
            mount.classList.toggle('is-host-collapsed', isCompact);
        }
        if (sidebar) {
            sidebar.classList.toggle('is-host-collapsed', isCompact);
        }
    }

    function observeEmbeddedHostState() {
        cleanupEmbeddedHostStateObserver();

        const sidebar = getSidebar();
        const host = getEmbeddedSidebarHost();
        if (!sidebar || !sidebar.classList.contains('embedded-layout') || !(host instanceof HTMLElement)) {
            syncEmbeddedCompactState();
            return;
        }

        const sync = () => syncEmbeddedCompactState();
        const mutationObserver = new MutationObserver(sync);
        mutationObserver.observe(host, {
            attributes: true,
            attributeFilter: [ 'class', 'data-collapsible', 'data-state', 'style' ]
        });

        let resizeObserver = null;
        if (typeof ResizeObserver !== 'undefined') {
            resizeObserver = new ResizeObserver(sync);
            resizeObserver.observe(host);
        }

        state.sidebarHostSyncCleanup = () => {
            mutationObserver.disconnect();
            resizeObserver?.disconnect();
        };

        sync();
    }

    function getFloatingToggle() {
        return document.getElementById('lmarena-floating-toggle');
    }

    function ensureFloatingToggle() {
        let toggle = getFloatingToggle();
        if (toggle) {
            return toggle;
        }

        toggle = document.createElement('div');
        toggle.id = 'lmarena-floating-toggle';
        toggle.className = 'floating-toggle-btn';
        toggle.title = '展开 Arena 助手';
        toggle.setAttribute('role', 'button');
        toggle.setAttribute('tabindex', '0');
        toggle.setAttribute('aria-label', '展开 Arena 助手');
        toggle.setAttribute('aria-hidden', 'true');
        toggle.textContent = '◀';
        document.body.appendChild(toggle);
        return toggle;
    }

    function syncSidebarVisibilityState() {
        const sidebar = getSidebar();
        const mount = getSidebarMount();
        const toggle = sidebar ? ensureFloatingToggle() : getFloatingToggle();
        const isCollapsed = !state.isVisible;

        if (sidebar) {
            sidebar.classList.toggle('is-collapsed', isCollapsed);
            sidebar.classList.remove('minimized');
            if (isCollapsed) {
                sidebar.classList.remove('is-hovering');
            }
        }

        if (mount) {
            mount.classList.toggle('is-sidebar-collapsed', isCollapsed);
        }

        if (toggle) {
            toggle.classList.toggle('active', isCollapsed);
            toggle.setAttribute('aria-hidden', isCollapsed ? 'false' : 'true');
        }
    }

    function syncGlobalSearchModeState() {
        const sidebar = getSidebar();
        if (!sidebar) {
            return;
        }

        sidebar.classList.toggle('has-global-search', Boolean(state.globalSearchTerm));
    }

    function matchesClosest(element, selector) {
        return Boolean(element && element.closest && element.closest(selector));
    }

    function normalizeOutlineText(value) {
        return String(value || '').replace(/\s+/g, ' ').trim();
    }

    function getSafeTooltipText(value) {
        const normalized = String(value || '').replace(/\s+/g, ' ').trim();
        if (!normalized) {
            return '';
        }

        return normalized.length > 320 ? normalized.slice(0, 320) + '...' : normalized;
    }

    function ensureGlobalTooltip() {
        let tooltip = document.getElementById('arena-global-tooltip');
        if (tooltip) {
            state.globalTooltipEl = tooltip;
            return tooltip;
        }

        tooltip = document.createElement('div');
        tooltip.id = 'arena-global-tooltip';
        document.body.appendChild(tooltip);
        state.globalTooltipEl = tooltip;
        return tooltip;
    }

    function showGlobalTooltip(item, safeTooltip) {
        const tooltip = ensureGlobalTooltip();
        if (!tooltip || !safeTooltip) {
            return;
        }

        const viewportPadding = 12;
        const tooltipGap = 12;
        const maxTooltipWidth = Math.min(560, Math.max(260, window.innerWidth - (viewportPadding * 2)));

        tooltip.innerText = safeTooltip;
        tooltip.style.maxWidth = maxTooltipWidth + 'px';
        tooltip.classList.add('show');
        tooltip.style.left = '-9999px';
        tooltip.style.top = '-9999px';

        const rect = item.getBoundingClientRect();
        const rightPanel = item.closest('#lmnav-outline-panel');
        const leftSidebar = item.closest('#lmarena-map-sidebar');
        const anchorRect = rightPanel instanceof HTMLElement
            ? rightPanel.getBoundingClientRect()
            : leftSidebar instanceof HTMLElement
                ? leftSidebar.getBoundingClientRect()
                : rect;
        const tooltipWidth = tooltip.offsetWidth;
        const tooltipHeight = tooltip.offsetHeight;
        const spaceLeft = anchorRect.left - viewportPadding - tooltipGap;
        const spaceRight = window.innerWidth - anchorRect.right - viewportPadding - tooltipGap;
        const preferLeft = rightPanel instanceof HTMLElement
            ? true
            : leftSidebar instanceof HTMLElement
                ? false
                : spaceLeft >= spaceRight;
        const canFitLeft = tooltipWidth <= spaceLeft;
        const canFitRight = tooltipWidth <= spaceRight;

        let left;
        if ((preferLeft && canFitLeft) || (!canFitRight && spaceLeft >= spaceRight)) {
            left = anchorRect.left - tooltipWidth - tooltipGap;
        } else {
            left = anchorRect.right + tooltipGap;
        }
        let top = rect.top + (rect.height / 2) - (tooltipHeight / 2);

        left = Math.max(viewportPadding, Math.min(left, window.innerWidth - tooltipWidth - viewportPadding));
        top = Math.max(viewportPadding, Math.min(top, window.innerHeight - tooltipHeight - viewportPadding));

        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
    }

    function hideGlobalTooltip() {
        const tooltip = state.globalTooltipEl || document.getElementById('arena-global-tooltip');
        if (tooltip) {
            tooltip.classList.remove('show');
        }
    }

    function getTooltipTextTargets(item) {
        if (!(item instanceof HTMLElement)) {
            return [];
        }

        const selector = [
            '.lmnav-outline-text',
            '.folder-node-name',
            '.lmnav-tree-title',
            '.global-search-title',
            '.global-search-preview',
            '.global-search-meta'
        ].join(', ');

        const targets = Array.from(item.querySelectorAll(selector)).filter((node) =>
            node instanceof HTMLElement && node.isConnected,
        );

        return targets.length ? targets : [ item ];
    }

    function isTooltipTextTargetOverflowing(node) {
        if (!(node instanceof HTMLElement)) {
            return false;
        }

        return node.scrollWidth > node.clientWidth + 1 || node.scrollHeight > node.clientHeight + 1;
    }

    function getRenderedTooltipReferenceText(item) {
        return getTooltipTextTargets(item)
            .map((node) => normalizeOutlineText(node.innerText || node.textContent || ''))
            .filter(Boolean)
            .join(' ');
    }

    function shouldShowGlobalTooltip(item, tooltipText) {
        if (!(item instanceof HTMLElement) || !tooltipText) {
            return false;
        }

        const overflowing = getTooltipTextTargets(item).some(isTooltipTextTargetOverflowing);
        if (overflowing) {
            return true;
        }

        const renderedText = getRenderedTooltipReferenceText(item);
        if (!renderedText) {
            return tooltipText.length > 12;
        }

        if (tooltipText === renderedText) {
            return false;
        }

        return tooltipText.length > renderedText.length + 4;
    }

    function bindGlobalTooltipEvents(item, safeTooltip) {
        if (!(item instanceof HTMLElement)) {
            return;
        }

        const tooltipText = getSafeTooltipText(safeTooltip);
        if (!tooltipText) {
            item.removeAttribute('data-tooltip');
            item.onmouseenter = null;
            item.onmouseleave = null;
            return;
        }

        item.setAttribute('data-tooltip', tooltipText);
        item.onmouseenter = () => {
            if (!shouldShowGlobalTooltip(item, tooltipText)) {
                hideGlobalTooltip();
                return;
            }
            showGlobalTooltip(item, tooltipText);
        };
        item.onmouseleave = () => {
            hideGlobalTooltip();
        };
    }

    function shouldIncludeOutlineContentNode(node) {
        if (!(node instanceof HTMLElement) || !node.isConnected) {
            return false;
        }

        if (node.classList.contains('prose')) {
            return !node.closest('.bg-surface-raised');
        }

        return true;
    }

    function compareNodesByViewportOrder(left, right) {
        const rectA = left.getBoundingClientRect();
        const rectB = right.getBoundingClientRect();
        return (rectA.top + window.scrollY) - (rectB.top + window.scrollY);
    }

    function getSortedOutlineContentNodes() {
        return Array.from(document.querySelectorAll(OUTLINE_CONTENT_SELECTOR))
            .filter(shouldIncludeOutlineContentNode)
            .sort(compareNodesByViewportOrder);
    }

    function createUserTOCItem(node) {
        const fullText = normalizeOutlineText(node.textContent);
        if (!fullText) {
            return null;
        }

        return {
            title: fullText.slice(0, 16) + (fullText.length > 16 ? '...' : ''),
            fullText: fullText,
            level: 1,
            element: node,
            source: 'turn'
        };
    }

    function appendAssistantHeadingTOCItems(node, toc) {
        node.querySelectorAll(OUTLINE_HEADING_SELECTOR).forEach((header) => {
            if (!(header instanceof HTMLElement) || !header.isConnected) {
                return;
            }

            const fullText = normalizeOutlineText(header.textContent);
            if (!fullText) {
                return;
            }

            const level = parseInt(header.tagName.substring(1), 10);
            toc.push({
                title: fullText,
                fullText: fullText,
                level: Number.isFinite(level) ? level : 1,
                element: header,
                source: 'heading'
            });
        });
    }

    function getFilteredOutlineItems(searchTerm) {
        if (!searchTerm) {
            return state.outlineItems.slice();
        }

        return state.outlineItems.filter((item) =>
            (item.fullText || item.text).toLowerCase().includes(searchTerm),
        );
    }

    function generateTOC() {
        const toc = [];

        getSortedOutlineContentNodes().forEach((node) => {
            if (node.classList.contains('bg-surface-raised')) {
                const userItem = createUserTOCItem(node);
                if (userItem) {
                    toc.push(userItem);
                }
                return;
            }

            appendAssistantHeadingTOCItems(node, toc);
        });

        return toc.map((item, index) => ({
            id: item.element?.id || core.uid('outline'),
            title: item.title,
            text: item.title,
            fullText: item.fullText || item.title,
            level: item.level,
            element: item.element,
            index: index,
            source: item.source || 'turn'
        }));
    }

    function applyOutlinePanelState() {
        const panel = getOutlinePanel();
        if (!panel) {
            return;
        }

        panel.classList.toggle('collapsed', state.outlineCollapsed);
        const toggleButton = document.getElementById('btn-outline-toggle');
        const dockButton = document.getElementById('btn-outline-dock');

        if (toggleButton) {
            toggleButton.innerHTML = state.outlineCollapsed ? ICONS.chevronLeft : ICONS.chevronRight;
            toggleButton.title = state.outlineCollapsed ? '展开目录导航' : '折叠目录导航';
            toggleButton.setAttribute('aria-label', toggleButton.title);
        }

        if (dockButton) {
            dockButton.hidden = !state.outlineCollapsed;
            dockButton.innerHTML = ICONS.chevronLeft;
            dockButton.title = '展开目录导航';
            dockButton.setAttribute('aria-label', '展开目录导航');
        }
    }

    function setOutlineCollapsed(collapsed) {
        state.outlineCollapsed = Boolean(collapsed);
        storage.set('outlineCollapsed', state.outlineCollapsed);
        applyOutlinePanelState();
    }

    function setOutlinePanelTab(tabName) {
        state.outlinePanelTab = tabName === 'prompts' ? 'prompts' : 'toc';
        renderOutlinePanelV2();
    }

    function persistPromptVault() {
        return storage.set('promptVault', state.prompts);
    }

    function openOutlinePromptDraft(prompt) {
        state.outlinePanelTab = 'prompts';
        state.outlinePromptDraft = {
            id: prompt?.id || null,
            title: prompt?.title || '',
            content: prompt?.content || '',
            tags: Array.isArray(prompt?.tags) ? prompt.tags.slice() : [],
            createdAt: Number.isFinite(prompt?.createdAt) ? prompt.createdAt : Date.now()
        };
        state.pendingOutlinePromptFocus = true;
        renderOutlinePanelV2();
    }

    function closeOutlinePromptDraft() {
        state.outlinePromptDraft = null;
        state.pendingOutlinePromptFocus = false;
        renderOutlinePanelV2();
    }

    function syncOutlinePromptDraft() {
        if (!state.outlinePromptDraft) {
            return;
        }

        const titleInput = document.getElementById('lmnav-prompt-title-input');
        const contentInput = document.getElementById('lmnav-prompt-content-input');
        if (titleInput) {
            state.outlinePromptDraft.title = titleInput.value;
        }
        if (contentInput) {
            state.outlinePromptDraft.content = contentInput.value;
        }
    }

    function syncOutlinePromptEditorFocus() {
        if (!state.pendingOutlinePromptFocus || !state.outlinePromptDraft) {
            return;
        }

        state.pendingOutlinePromptFocus = false;
        window.requestAnimationFrame(() => {
            const input = document.getElementById('lmnav-prompt-title-input');
            if (!input) {
                return;
            }

            input.focus();
            input.select();
        });
    }

    async function saveOutlinePromptDraft() {
        syncOutlinePromptDraft();
        const draft = state.outlinePromptDraft;
        if (!draft) {
            return;
        }

        const existing = draft.id ? state.prompts.find((prompt) => prompt.id === draft.id) : null;
        const normalized = normalizePromptItem({
            id: draft.id || undefined,
            title: draft.title,
            content: draft.content,
            tags: existing?.tags || draft.tags || [],
            createdAt: existing?.createdAt || draft.createdAt,
            updatedAt: Date.now()
        });

        if (!normalized) {
            showToast('提示词标题和内容不能为空。', true);
            return;
        }

        if (existing) {
            state.prompts = state.prompts.map((prompt) => prompt.id === existing.id ? {
                ...existing,
                ...normalized,
                tags: existing.tags || []
            } : prompt);
        } else {
            state.prompts.unshift(normalized);
        }

        await persistPromptVault();
        state.outlinePromptDraft = null;
        renderPrompts();
        renderTools();
        renderOutlinePanelV2();
        showToast(existing ? '提示词已更新。' : '提示词已保存。');
    }

    function renderOutlinePromptLibrary() {
        const container = document.getElementById('lmnav-prompt-library');
        if (!container) {
            return;
        }

        const editing = Boolean(state.outlinePromptDraft);
        const draft = state.outlinePromptDraft || { title: '', content: '' };
        const cardsHtml = state.prompts.length
            ? '<div class="lmnav-prompt-list">' + state.prompts.map((prompt) => `
                <div class="lmnav-prompt-card" data-outline-prompt-id="${prompt.id}">
                    <div class="lmnav-prompt-card-body">
                        <div class="lmnav-prompt-card-title">${core.escapeHtml(prompt.title)}</div>
                        <div class="lmnav-prompt-card-preview">${core.escapeHtml(core.truncate(prompt.content, 120))}</div>
                    </div>
                    <div class="lmnav-prompt-card-actions">
                        <button class="lmnav-prompt-card-btn primary" type="button" data-outline-prompt-action="insert" data-prompt-id="${prompt.id}" aria-label="插入提示词">${ICONS.sparkle}</button>
                        <button class="lmnav-prompt-card-btn" type="button" data-outline-prompt-action="edit" data-prompt-id="${prompt.id}" aria-label="编辑提示词">${ICONS.pencil}</button>
                        <button class="lmnav-prompt-card-btn danger" type="button" data-outline-prompt-action="delete" data-prompt-id="${prompt.id}" aria-label="删除提示词">${ICONS.trash}</button>
                    </div>
                </div>
            `).join('') + '</div>'
            : '<div class="lmnav-outline-empty">这里还没有提示词，先创建一个常用指令吧。</div>';

        container.innerHTML = `
            <div class="lmnav-prompt-toolbar">
                <button class="lmnav-prompt-create-btn" type="button" id="btn-outline-new-prompt">${ICONS.add}<span>${editing ? '再建一个提示词' : '新建提示词'}</span></button>
            </div>
            ${editing ? `
                <div class="lmnav-prompt-editor">
                    <input id="lmnav-prompt-title-input" class="lmnav-prompt-input" type="text" placeholder="提示词标题" value="${core.escapeHtml(draft.title)}">
                    <textarea id="lmnav-prompt-content-input" class="lmnav-prompt-textarea" placeholder="提示词内容">${core.escapeHtml(draft.content)}</textarea>
                    <div class="lmnav-prompt-editor-actions">
                        <button class="lmnav-prompt-secondary-btn" type="button" id="btn-outline-prompt-cancel">取消</button>
                        <button class="lmnav-prompt-primary-btn" type="button" id="btn-outline-prompt-save">保存提示词</button>
                    </div>
                </div>
            ` : ''}
            ${cardsHtml}
        `;

        syncOutlinePromptEditorFocus();
    }

    function isVisibleElement(element) {
        if (!element || !(element instanceof HTMLElement) || !element.isConnected) {
            return false;
        }

        const style = window.getComputedStyle(element);
        if (style.display === 'none' || style.visibility === 'hidden') {
            return false;
        }

        const rect = element.getBoundingClientRect();
        return rect.width > 120 && rect.height > 200;
    }

    function scoreSidebarHost(element) {
        const rect = element.getBoundingClientRect();
        let score = 0;

        if (rect.left < 80) score += 40;
        if (rect.width >= 180 && rect.width <= 420) score += 35;
        if (rect.height >= 500) score += 25;

        const text = (element.innerText || '').slice(0, 1200);
        if (SIDEBAR_PRIMARY_NAV_RE.test(text)) score += 30;
        if (SIDEBAR_HISTORY_SECTION_RE.test(text)) score += 20;

        if (element.matches('aside, nav, [role="navigation"]')) score += 20;
        if ((element.className || '').toString().toLowerCase().includes('sidebar')) score += 15;

        return score;
    }

    function findSidebarHost() {
        const selectors = [
            '[data-sidebar="sidebar"]',
            'aside',
            'nav',
            '[role="navigation"]',
            '[data-sidebar]',
            '[class*="sidebar"]',
            '[class*="Sidebar"]'
        ];

        const candidates = new Set();
        selectors.forEach((selector) => {
            document.querySelectorAll(selector).forEach((element) => {
                if (isVisibleElement(element)) {
                    candidates.add(element);
                }
            });
        });

        if (!candidates.size) {
            document.querySelectorAll('div').forEach((element) => {
                if (!isVisibleElement(element)) {
                    return;
                }
                const rect = element.getBoundingClientRect();
                if (rect.left < 80 && rect.width >= 180 && rect.width <= 420 && rect.height >= 500) {
                    candidates.add(element);
                }
            });
        }

        return Array.from(candidates)
            .map((element) => ({ element: element, score: scoreSidebarHost(element) }))
            .sort((left, right) => right.score - left.score)[0]?.element || null;
    }

    function countNativeHistoryAnchors(rootElement) {
        if (!(rootElement instanceof Element) || !rootElement.isConnected) {
            return 0;
        }

        let count = 0;
        rootElement.querySelectorAll('a[href]').forEach((anchor) => {
            if (isNativeHistoryAnchor(anchor)) {
                count += 1;
            }
        });
        return count;
    }

    function getDirectChildWithin(container, target) {
        if (!(container instanceof Element) || !(target instanceof Element) || !container.contains(target)) {
            return null;
        }

        let current = target;
        while (current && current.parentElement && current.parentElement !== container) {
            current = current.parentElement;
        }

        return current?.parentElement === container ? current : null;
    }

    function isSidebarInternalElement(element) {
        return Boolean(
            element &&
            element.closest &&
            element.closest(SIDEBAR_INTERNAL_SELECTOR),
        );
    }

    function scoreSidebarScrollContainer(host, element) {
        if (!(host instanceof HTMLElement) || !(element instanceof HTMLElement) || !element.isConnected || isSidebarInternalElement(element)) {
            return Number.NEGATIVE_INFINITY;
        }

        const rect = element.getBoundingClientRect();
        const hostRect = host.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        const overflowY = style.overflowY;
        const text = (element.innerText || '').slice(0, 2000);
        const anchorCount = countNativeHistoryAnchors(element);
        let score = 0;

        if (element.matches('[data-sidebar="content"]')) score += 72;
        if (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') score += 110;
        if (element.scrollHeight > element.clientHeight + 80) score += 72;
        if (SIDEBAR_HISTORY_SECTION_RE.test(text)) score += 24;
        if (anchorCount) score += Math.min(anchorCount, 8) * 14;
        if (element.parentElement === host) score += 18;
        if (rect.height >= 320) score += 18;
        if (Math.abs(rect.width - hostRect.width) <= 40) score += 12;

        return score;
    }

    function findSidebarScrollContainer(host) {
        if (!(host instanceof HTMLElement)) {
            return null;
        }

        const candidates = new Set();
        const contentAnchor = host.querySelector('[data-sidebar="content"]');
        if (contentAnchor instanceof HTMLElement) {
            candidates.add(contentAnchor);
        }

        host.querySelectorAll('div, section, main').forEach((element) => {
            if (!(element instanceof HTMLElement) || !element.isConnected || isSidebarInternalElement(element)) {
                return;
            }

            const style = window.getComputedStyle(element);
            const overflowY = style.overflowY;
            if (
                overflowY === 'auto' ||
                overflowY === 'scroll' ||
                overflowY === 'overlay' ||
                element.scrollHeight > element.clientHeight + 80 ||
                element.matches('[class*="overflow-auto"], [class*="overflow-y-auto"]')
            ) {
                candidates.add(element);
            }
        });

        if (!candidates.size) {
            return contentAnchor || host;
        }

        return Array.from(candidates)
            .map((element) => ({ element: element, score: scoreSidebarScrollContainer(host, element) }))
            .sort((left, right) => right.score - left.score)[0]?.element || contentAnchor || host;
    }

    function getSidebarMountParent(host) {
        const scrollContainer = findSidebarScrollContainer(host);
        let parent = scrollContainer || host;

        if (parent instanceof HTMLElement && /^(UL|OL)$/i.test(parent.tagName) && parent.parentElement instanceof HTMLElement) {
            parent = parent.parentElement;
        }

        return parent instanceof HTMLElement ? parent : host;
    }

    function mountSidebar(sidebar) {
        const host = findSidebarHost();
        const existingMount = getSidebarMount();

        if (!host) {
            state.layoutMode = 'floating';
            sidebar.classList.remove('embedded-layout');
            sidebar.classList.remove('is-host-collapsed');
            existingMount?.classList.remove('is-host-collapsed');
            cleanupEmbeddedHostStateObserver();
            if (existingMount?.isConnected) {
                existingMount.remove();
            }
            if (sidebar.parentNode !== document.body) {
                document.body.appendChild(sidebar);
            }
            return;
        }

        state.layoutMode = 'embedded';
        let mount = existingMount;
        if (!mount) {
            mount = document.createElement('div');
            mount.id = 'lmarena-map-sidebar-mount';
            mount.className = 'lmnav-sidebar-mount';
        }

        const mountParent = getSidebarMountParent(host) || host;
        const firstRenderableChild = Array.from(mountParent.children || []).find((child) =>
            child instanceof HTMLElement && child !== mount && !isSidebarInternalElement(child),
        ) || null;
        if (mount.parentNode !== mountParent) {
            if (typeof mountParent.prepend === 'function') {
                mountParent.prepend(mount);
            } else {
                mountParent.insertBefore(mount, mountParent.firstChild || null);
            }
        } else if (firstRenderableChild && mountParent.firstElementChild !== mount) {
            if (typeof mountParent.prepend === 'function') {
                mountParent.prepend(mount);
            } else {
                mountParent.insertBefore(mount, mountParent.firstChild || null);
            }
        }

        sidebar.classList.add('embedded-layout');
        if (sidebar.parentNode !== mount) {
            mount.appendChild(sidebar);
        }
        observeEmbeddedHostState();
    }

    function createUI() {
        if (getSidebar()) {
            ensureFloatingToggle();
            syncSidebarVisibilityState();
            observeEmbeddedHostState();
            syncEmbeddedCompactState();
            decorateNativeHistoryItemsDraggable();
            return;
        }

        const sidebar = document.createElement('div');
        sidebar.id = 'lmarena-map-sidebar';
        sidebar.style.width = state.width + 'px';
        if (state.isAutoHide) {
            sidebar.classList.add('auto-hide-mode');
        }

        const circumference = 2 * Math.PI * 14;
        sidebar.innerHTML = `
            <div class="map-resizer"></div>
            <div class="clean-header">
                <button class="ctx-ring-btn" id="btn-context-ring" title="插入压缩提示词">
                    <svg class="ctx-progress-ring" width="32" height="32" viewBox="0 0 32 32">
                        <circle class="ctx-circle-bg" stroke-width="3" fill="transparent" r="14" cx="16" cy="16"></circle>
                        <circle class="ctx-circle-fg" id="ctx-progress-indicator" stroke-width="3" fill="transparent" r="14" cx="16" cy="16" style="stroke-dasharray:${circumference} ${circumference};stroke-dashoffset:${circumference};"></circle>
                    </svg>
                    <div class="ctx-icon">${ICONS.sparkle}</div>
                </button>
                <div class="segmented-control">
                    <div class="seg-item active" data-tab="library">资料库</div>
                    <div class="seg-item" data-tab="outline">大纲</div>
                    <div class="seg-item" data-tab="prompts">提示词</div>
                    <div class="seg-item" data-tab="tools">工具</div>
                    <div class="seg-glider"></div>
                </div>
                <button class="header-mini-btn" id="btn-minimize" title="隐藏侧栏 (Alt+Q)">${ICONS.minimize}</button>
            </div>
            <div class="status-strip">
                <span class="site-pill">Arena 助手</span>
                <span class="status-text" id="status-text">等待检测会话内容</span>
            </div>
            <div class="search-section">
                <div class="search-input-wrapper">
                    <div class="search-icon-box">${ICONS.search}</div>
                    <input type="text" id="map-search-input" autocomplete="off" placeholder="搜索">
                </div>
            </div>
            <div class="map-body-container">
                <div id="view-search" class="content-view">
                    <div id="global-search-results" class="scroll-list global-search-results"></div>
                </div>
                <div id="view-outline" class="content-view">
                    <div id="map-content" class="scroll-list"></div>
                </div>
                <div id="view-prompts" class="content-view">
                    <div class="section-actions">
                        <button class="mini-action-btn" id="btn-import-prompts">${ICONS.upload}<span>导入</span></button>
                        <button class="mini-action-btn" id="btn-export-prompts">${ICONS.export}<span>导出</span></button>
                    </div>
                    <div id="prompts-list" class="scroll-list"></div>
                    <div class="form-box">
                        <input type="text" id="prompt-title" class="mini-input" placeholder="提示词标题">
                        <input type="text" id="prompt-tags" class="mini-input" placeholder="标签（逗号分隔）">
                        <textarea id="prompt-content" class="mini-textarea tall" placeholder="提示词内容"></textarea>
                        <button id="btn-add-prompt" class="primary-btn">${ICONS.add}<span>保存提示词</span></button>
                    </div>
                </div>
                <div id="view-library" class="content-view active">
                    <div class="section-actions library-actions">
                        <div class="library-actions-heading">
                            <div class="library-actions-title">文件夹</div>
                            <div class="library-actions-subtitle" id="library-actions-subtitle">全部会话</div>
                        </div>
                        <div class="library-actions-tools">
                            <button class="mini-action-btn icon-only" id="btn-new-folder" type="button" title="新建文件夹" aria-label="新建文件夹">${ICONS.add}</button>
                            <button class="mini-action-btn icon-only" id="btn-export-library" type="button" title="导出当前视图" aria-label="导出当前视图">${ICONS.export}</button>
                            <div class="library-settings-wrap">
                                <button class="mini-action-btn icon-only" id="btn-folder-settings" type="button" title="更多设置" aria-label="更多设置" aria-expanded="false">${ICONS.settings}</button>
                                <div class="library-settings-menu" id="library-settings-menu" hidden>
                                    <button class="library-settings-item" id="btn-rename-folder" type="button">重命名当前文件夹</button>
                                    <button class="library-settings-item" id="btn-delete-folder" type="button">删除当前文件夹</button>
                                    <button class="library-settings-item" id="btn-reset-folders" type="button">重置展开状态</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="library-manager">
                        <div class="library-folders-panel">
                            <div class="library-panel-title">文件夹</div>
                            <div id="library-folder-tree" class="folder-tree"></div>
                        </div>
                        <div class="library-conversations-panel">
                            <div class="library-panel-title" id="library-current-folder">全部会话</div>
                            <div id="library-list" class="scroll-list library-scroll"></div>
                        </div>
                    </div>
                </div>
                <div id="view-tools" class="content-view">
                    <div class="scroll-list tools-scroll">
                        <div class="tool-stats" id="tool-stats"></div>
                        <div class="form-box">
                            <input type="text" id="save-title-input" class="mini-input" placeholder="自定义标题（可选）">
                            <input type="text" id="save-folder-input" class="mini-input" placeholder="文件夹路径，例如：安全研究 / Arena">
                            <div class="tool-grid">
                                <button class="primary-btn" id="btn-export-md">${ICONS.export}<span>导出文稿</span></button>
                                <button class="primary-btn secondary" id="btn-export-json">${ICONS.export}<span>导出数据</span></button>
                                <button class="primary-btn secondary" id="btn-copy-md">${ICONS.copy}<span>复制文稿</span></button>
                                <button class="primary-btn secondary" id="btn-insert-summary">${ICONS.sparkle}<span>插入压缩提示词</span></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="clean-toolbar">
                <button class="tool-btn" id="btn-autohide" title="切换自动隐藏">${state.isAutoHide ? ICONS.pin : ICONS.unpin}</button>
                <button class="tool-btn" id="btn-theme" title="切换主题">${ICONS.theme}</button>
                <div class="spacer"></div>
                <button class="tool-btn" id="btn-goto-oldest" title="跳到第一项">${ICONS.arrowUp}</button>
                <button class="tool-btn" id="btn-goto-latest" title="跳到最后一项">${ICONS.arrowDown}</button>
                <button class="tool-btn" id="btn-refresh" title="刷新侧栏">${ICONS.refresh}</button>
            </div>
            <input id="prompt-import-input" type="file" accept="application/json" hidden>
        `;

        mountSidebar(sidebar);
        ensureFloatingToggle();
        ensureGlobalTooltip();
        state.tooltipEl = document.createElement('div');
        state.tooltipEl.id = 'lmarena-hover-tooltip';
        document.body.appendChild(state.tooltipEl);
        state.toastEl = document.createElement('div');
        state.toastEl.id = 'lmnav-toast';
        state.toastEl.innerHTML = `
            <div class="lmnav-toast-content">
                <span class="lmnav-toast-text" id="lmnav-toast-text"></span>
                <button class="lmnav-toast-undo" id="lmnav-toast-undo" type="button" hidden>撤销</button>
            </div>
        `;
        document.body.appendChild(state.toastEl);
        state.toastTextEl = state.toastEl.querySelector('#lmnav-toast-text');
        state.toastUndoButtonEl = state.toastEl.querySelector('#lmnav-toast-undo');
        state.toastUndoButtonEl?.addEventListener('click', () => {
            const undoCallback = state.toastUndoCallback;
            hideToast({ clearOnly: true });
            if (typeof undoCallback === 'function') {
                try {
                    undoCallback();
                } catch (error) {
                    console.error(error);
                }
            }
        });
        createOutlinePanelV2();

        const searchInput = document.getElementById('map-search-input');
        searchInput.placeholder = GLOBAL_SEARCH_PLACEHOLDER;
        searchInput.disabled = false;
        searchInput.value = state.globalSearchTerm;
        document.getElementById('save-folder-input').value = state.lastSaveFolder;

        applyTheme();
        initResize(sidebar);
        initHoverBehavior(sidebar);
        bindEvents();
        syncGlobalSearchModeState();
        switchTab(state.layoutMode === 'embedded' ? 'library' : state.currentTab, false);
        syncSidebarVisibilityState();
    }

    function createOutlinePanelV2() {
        if (getOutlinePanel()) {
            applyOutlinePanelState();
            return;
        }

        const panel = document.createElement('div');
        panel.id = 'lmnav-outline-panel';
        panel.innerHTML = `
            <button class="lmnav-outline-dock" id="btn-outline-dock" hidden>${ICONS.chevronLeft}</button>
            <div class="lmnav-outline-header">
                <div class="lmnav-outline-tabs" role="tablist" aria-label="右侧面板">
                    <button class="lmnav-outline-tab active" type="button" data-outline-tab="toc" role="tab" aria-selected="true">目录导航</button>
                    <button class="lmnav-outline-tab" type="button" data-outline-tab="prompts" role="tab" aria-selected="false">提示词库</button>
                </div>
                <div class="lmnav-outline-actions">
                    <button class="lmnav-outline-btn" id="btn-outline-refresh" title="刷新目录">${ICONS.refresh}</button>
                    <button class="lmnav-outline-btn" id="btn-outline-toggle" title="折叠目录导航">${ICONS.chevronRight}</button>
                </div>
            </div>
            <div class="lmnav-outline-search" id="lmnav-outline-search-wrap">
                <input type="text" id="lmnav-outline-search" placeholder="搜索目录项">
            </div>
            <div id="lmnav-outline-list" class="lmnav-outline-list"></div>
            <div id="lmnav-prompt-library" class="lmnav-prompt-library" hidden></div>
            <div class="lmnav-outline-footer" id="lmnav-outline-footer">
                <button class="lmnav-outline-btn" id="btn-outline-first" title="跳到第一项">${ICONS.arrowUp}</button>
                <button class="lmnav-outline-btn" id="btn-outline-last" title="跳到最后一项">${ICONS.arrowDown}</button>
            </div>
        `;

        document.body.appendChild(panel);
        state.outlinePanelEl = panel;
        applyOutlinePanelState();
    }

    function initHoverBehavior(sidebar) {
        let hoverTimer = null;
        const keepAlive = () => {
            clearTimeout(hoverTimer);
            sidebar.classList.add('is-hovering');
        };
        const startExit = () => {
            clearTimeout(hoverTimer);
            hoverTimer = window.setTimeout(() => {
                sidebar.classList.remove('is-hovering');
            }, 260);
        };

        sidebar.addEventListener('mouseenter', keepAlive);
        sidebar.addEventListener('mousemove', keepAlive);
        sidebar.addEventListener('mouseleave', startExit);
        state.tooltipEl.addEventListener('mouseenter', keepAlive);
        state.tooltipEl.addEventListener('mousemove', keepAlive);
        state.tooltipEl.addEventListener('mouseleave', startExit);
    }

    function bindLegacyTooltipHover(containerId, hoverHandler) {
        const container = document.getElementById(containerId);
        if (!container) {
            return;
        }

        container.addEventListener('mouseover', hoverHandler);
        container.addEventListener('mouseout', hideTooltip);
    }

    function bindEvents() {
        const searchInput = document.getElementById('map-search-input');
        const promptImportInput = document.getElementById('prompt-import-input');
        const floatingToggle = ensureFloatingToggle();
        const debouncedSearch = core.debounce((value) => {
            state.globalSearchTerm = value.trim().toLowerCase();
            renderActiveView();
        }, 180);

        searchInput.addEventListener('input', (event) => {
            debouncedSearch(event.target.value || '');
        });
        searchInput.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && state.globalSearchTerm) {
                event.preventDefault();
                clearGlobalSearch();
                renderActiveView();
                return;
            }

            if (event.key === 'Enter' && state.globalSearchTerm) {
                const firstResult = document.querySelector('#global-search-results .global-search-item');
                if (!(firstResult instanceof HTMLElement)) {
                    return;
                }

                event.preventDefault();
                activateGlobalSearchResult(firstResult);
            }
        });

        document.querySelectorAll('.seg-item').forEach((item) => {
            item.addEventListener('click', () => switchTab(item.dataset.tab, true));
        });

        document.getElementById('btn-theme').addEventListener('click', cycleTheme);
        document.getElementById('btn-autohide').addEventListener('click', toggleAutoHide);
        document.getElementById('btn-minimize').addEventListener('click', () => toggleState(false));
        floatingToggle.addEventListener('click', () => toggleState(true));
        floatingToggle.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                toggleState(true);
            }
        });
        document.getElementById('btn-context-ring').addEventListener('click', insertCompressionPrompt);
        document.getElementById('btn-insert-summary').addEventListener('click', insertCompressionPrompt);
        document.getElementById('btn-goto-oldest').addEventListener('click', () => jumpToOutlineIndex(0));
        document.getElementById('btn-goto-latest').addEventListener('click', () => jumpToOutlineIndex(state.outlineItems.length - 1));
        document.getElementById('btn-refresh').addEventListener('click', () => refreshConversation(true));
        document.getElementById('btn-add-prompt').addEventListener('click', addPrompt);
        document.getElementById('btn-export-prompts').addEventListener('click', exportPrompts);
        document.getElementById('btn-import-prompts').addEventListener('click', () => promptImportInput.click());
        document.getElementById('btn-new-folder').addEventListener('click', createFolderFromCurrentView);
        document.getElementById('btn-export-library').addEventListener('click', exportLibraryData);
        document.getElementById('btn-folder-settings').addEventListener('click', (event) => {
            event.stopPropagation();
            toggleFolderSettingsMenu();
        });
        document.getElementById('btn-rename-folder').addEventListener('click', renameCurrentFolder);
        document.getElementById('btn-delete-folder').addEventListener('click', deleteCurrentFolder);
        document.getElementById('btn-reset-folders').addEventListener('click', resetFolderExpansionState);
        document.getElementById('btn-export-md').addEventListener('click', () => exportCurrentConversation('markdown'));
        document.getElementById('btn-export-json').addEventListener('click', () => exportCurrentConversation('json'));
        document.getElementById('btn-copy-md').addEventListener('click', copyCurrentConversationMarkdown);
        promptImportInput.addEventListener('change', importPrompts);
        document.getElementById('save-folder-input').addEventListener('input', renderLibraryChrome);

        document.getElementById('map-content').addEventListener('click', handleOutlineClick);
        document.getElementById('global-search-results')?.addEventListener('click', handleGlobalSearchResultClick);
        document.getElementById('global-search-results')?.addEventListener('keydown', handleGlobalSearchResultKeydown);
        document.getElementById('prompts-list').addEventListener('click', handlePromptClick);
        document.getElementById('library-folder-tree').addEventListener('click', handleFolderTreeClick);
        document.getElementById('library-folder-tree').addEventListener('dragstart', handleLibraryDragStart);
        document.getElementById('library-folder-tree').addEventListener('dragend', handleLibraryDragEnd);
        document.getElementById('library-folder-tree').addEventListener('dragenter', handleFolderTreeDragEnter);
        document.getElementById('library-folder-tree').addEventListener('dragover', handleFolderTreeDragOver);
        document.getElementById('library-folder-tree').addEventListener('dragleave', handleFolderTreeDragLeave);
        document.getElementById('library-folder-tree').addEventListener('drop', handleFolderTreeDrop);
        document.getElementById('library-folder-tree').addEventListener('scroll', () => {
            if (state.activeFolderMenuId) {
                closeFolderContextMenu();
            }
        });
        document.getElementById('library-list').addEventListener('click', handleLibraryClick);
        document.getElementById('library-list').addEventListener('change', handleLibraryChange);
        document.getElementById('library-list').addEventListener('dragstart', handleLibraryDragStart);
        document.getElementById('library-list').addEventListener('dragend', handleLibraryDragEnd);
        bindLegacyTooltipHover('prompts-list', handlePromptHover);
        bindLegacyTooltipHover('library-folder-tree', handleLibraryHover);
        bindLegacyTooltipHover('library-list', handleLibraryHover);
        document.addEventListener('dragstart', handleNativeHistoryDragStart, true);
        document.addEventListener('dragend', handleNativeHistoryDragEnd, true);

        document.getElementById('lmnav-outline-list')?.addEventListener('click', handleOutlineClick);
        document.getElementById('lmnav-outline-panel')?.addEventListener('click', handleOutlinePanelClick);
        document.getElementById('lmnav-prompt-library')?.addEventListener('click', handleOutlinePromptLibraryClick);
        document.getElementById('lmnav-prompt-library')?.addEventListener('input', handleOutlinePromptLibraryInput);
        document.getElementById('btn-outline-refresh')?.addEventListener('click', () => refreshConversation(true));
        document.getElementById('btn-outline-toggle')?.addEventListener('click', () => setOutlineCollapsed(!state.outlineCollapsed));
        document.getElementById('btn-outline-dock')?.addEventListener('click', () => setOutlineCollapsed(false));
        document.getElementById('btn-outline-first')?.addEventListener('click', () => jumpToOutlineIndex(0));
        document.getElementById('btn-outline-last')?.addEventListener('click', () => jumpToOutlineIndex(state.outlineItems.length - 1));
        document.getElementById('lmnav-outline-search')?.addEventListener('input', core.debounce((event) => {
            state.outlineSearchTerm = event.target.value.trim().toLowerCase();
            renderOutlinePanelV2();
        }, 120));

        document.addEventListener('keydown', (event) => {
            if (event.altKey && event.code === 'KeyQ') {
                event.preventDefault();
                toggleState(!state.isVisible);
            }

            if (event.key === 'Escape' && state.activeFolderMenuId) {
                closeFolderContextMenu();
            }
        });
        document.addEventListener('click', (event) => {
            if (handleFloatingFolderMenuClick(event)) {
                return;
            }

            if (!event.target.closest('.library-settings-wrap')) {
                toggleFolderSettingsMenu(false);
            }
            if (!event.target.closest('.folder-context-menu') && !event.target.closest('.folder-more-btn')) {
                if (state.activeFolderMenuId || state.activeFolderColorPickerId) {
                    closeFolderContextMenu();
                }
            }
        });

        state.scrollHandler = core.throttle(updateScrollspy, 100);
        window.addEventListener('scroll', state.scrollHandler, { passive: true });
        state.cleanupFns.push(() => window.removeEventListener('scroll', state.scrollHandler));
        window.addEventListener('resize', renderFloatingFolderMenu);
        state.cleanupFns.push(() => window.removeEventListener('resize', renderFloatingFolderMenu));
        state.cleanupFns.push(() => document.removeEventListener('dragstart', handleNativeHistoryDragStart, true));
        state.cleanupFns.push(() => document.removeEventListener('dragend', handleNativeHistoryDragEnd, true));
    }

    function switchTab(tabName, persist) {
        state.currentTab = SEARCH_PLACEHOLDERS[tabName] ? tabName : 'outline';
        document.querySelectorAll('.seg-item').forEach((item, index) => {
            item.classList.toggle('active', item.dataset.tab === state.currentTab);
            if (item.dataset.tab === state.currentTab) {
                const glider = document.querySelector('.seg-glider');
                glider.style.transform = 'translateX(' + (index * 100) + '%)';
            }
        });

        document.querySelectorAll('.content-view').forEach((view) => {
            view.classList.remove('active');
        });
        document.getElementById('view-' + (state.globalSearchTerm ? 'search' : state.currentTab))?.classList.add('active');

        const searchInput = document.getElementById('map-search-input');
        searchInput.placeholder = GLOBAL_SEARCH_PLACEHOLDER;
        searchInput.disabled = false;

        renderActiveView();
        if (persist) {
            storage.set('activeTab', state.currentTab);
        }
    }

    function renderActiveView() {
        syncGlobalSearchModeState();

        document.querySelectorAll('.content-view').forEach((view) => {
            view.classList.remove('active');
        });
        document.getElementById('view-' + (state.globalSearchTerm ? 'search' : state.currentTab))?.classList.add('active');

        if (state.globalSearchTerm) {
            renderGlobalSearchResults();
            return;
        }

        if (state.currentTab === 'outline') {
            renderOutline();
            return;
        }

        if (state.currentTab === 'prompts') {
            renderPrompts();
            return;
        }

        if (state.currentTab === 'library') {
            renderLibrary();
            return;
        }

        renderTools();
    }

    function refreshConversation(force) {
        const sidebar = getSidebar();
        if (sidebar) {
            mountSidebar(sidebar);
            syncSidebarVisibilityState();
            syncEmbeddedCompactState();
        }
        decorateNativeHistoryItemsDraggable();

        const turns = arena.getTurns();
        const outlineItems = generateTOC();
        const outlineSignature = core.hashText(outlineItems.map((item) =>
            (item.level || 1) + ':' + item.text
        ).join('|'));

        const snapshot = {
            id: 'lmarena:' + arena.getConversationKey(turns),
            site: 'LMArena',
            title: arena.getConversationTitle(turns),
            url: location.href,
            folder: '',
            summary: core.buildSummary(turns),
            turns: turns.map((turn) => ({
                role: turn.role,
                text: turn.text
            })),
            savedAt: Date.now(),
            conversationKey: arena.getConversationKey(turns),
            totalChars: turns.reduce((sum, turn) => sum + turn.text.length, 0)
        };

        const signature = [
            location.pathname,
            turns.length,
            outlineItems.length,
            turns.length ? turns[turns.length - 1].text.length : 0,
            snapshot.title,
            outlineSignature
        ].join('|');

        state.currentSnapshot = snapshot;
        state.outlineItems = outlineItems;
        state.suggestedFolderPath = getSuggestedFolderPath(snapshot.title);

        if (!force && signature === state.lastSignature) {
            updateScrollspy();
            return;
        }

        state.lastSignature = signature;
        updateContextRing(snapshot.totalChars);
        renderActiveView();
        if (state.layoutMode === 'embedded' && state.currentTab !== 'library') {
            renderLibrary();
        }
        renderOutlinePanelV2();
        renderTools();
        updateStatus(turns.length ? '已识别当前页面内容' : '等待检测会话内容');
        updateScrollspy();
    }

    function updateStatus(message) {
        const statusEl = document.getElementById('status-text');
        if (statusEl) {
            statusEl.textContent = message;
        }
    }

    function isOutlineUserItem(item) {
        return item?.source !== 'heading';
    }

    function getOutlineGroupKey(item) {
        return String(item?.fullText || item?.text || '').trim();
    }

    function escapeOutlineGroupKey(groupKey) {
        if (typeof CSS !== 'undefined' && CSS && typeof CSS.escape === 'function') {
            return CSS.escape(groupKey);
        }

        return String(groupKey || '')
            .replace(/\\/g, '\\\\')
            .replace(/"/g, '\\"');
    }

    function isOutlineGroupExpanded(groupKey) {
        if (!groupKey) {
            return OUTLINE_AI_GROUPS_EXPANDED_BY_DEFAULT;
        }

        return !collapsedGroups.has(groupKey);
    }

    function setOutlineGroupExpanded(groupKey, expanded) {
        if (!groupKey) {
            return;
        }

        if (expanded) {
            collapsedGroups.delete(groupKey);
            return;
        }

        collapsedGroups.add(groupKey);
    }

    function applyOutlineGroupState(groupKey, expanded) {
        const escapedGroupKey = escapeOutlineGroupKey(groupKey);
        document.querySelectorAll('.outline-group[data-group-key="' + escapedGroupKey + '"]').forEach((group) => {
            const toggleIcon = group.querySelector('.toggle-icon');
            const subList = group.querySelector('.ai-sub-list');
            group.classList.toggle('collapsed', !expanded);
            if (toggleIcon) {
                toggleIcon.classList.toggle('collapsed', !expanded);
            }
            if (subList) {
                subList.classList.toggle('collapsed', !expanded);
                subList.style.display = expanded ? 'flex' : 'none';
            }
        });
    }

    function createOutlineItemElement(item, variant, extraClassName) {
        const isPanel = variant === 'panel';
        const element = document.createElement('div');
        element.className = (isPanel ? 'lmnav-outline-item map-item' : 'clean-list-item map-node') + (extraClassName ? ' ' + extraClassName : '');
        element.dataset.outlineIndex = String(item.index);
        element.dataset.fullText = item.fullText || item.text || '';
        element.setAttribute('role', 'button');
        element.tabIndex = 0;
        bindGlobalTooltipEvents(element, item.fullText || item.text || '');
        return element;
    }

    function createOutlineTextElement(item, variant) {
        const textEl = document.createElement('span');
        textEl.className = (variant === 'panel' ? 'lmnav-outline-text' : 'text lmnav-outline-text');
        textEl.textContent = item.text || '';
        return textEl;
    }

    function buildOutlineTree(items, variant) {
        const fragment = document.createDocumentFragment();
        const isPanel = variant === 'panel';
        let currentAiContainer = null;

        items.forEach((item) => {
            if (isOutlineUserItem(item)) {
                const groupKey = getOutlineGroupKey(item);
                const isCollapsed = collapsedGroups.has(groupKey);
                const expanded = !isCollapsed;
                const itemWrapper = document.createElement('div');
                itemWrapper.className = 'outline-group';
                itemWrapper.dataset.groupKey = groupKey;

                const userItem = createOutlineItemElement(
                    item,
                    variant,
                    'outline-user-item',
                );
                userItem.dataset.groupKey = groupKey;

                const toggleButton = document.createElement('button');
                toggleButton.type = 'button';
                toggleButton.className = 'outline-toggle-btn';
                toggleButton.setAttribute('aria-label', expanded ? '收起 AI 目录' : '展开 AI 目录');
                toggleButton.innerHTML = '<span class="toggle-icon' + (expanded ? '' : ' collapsed') + '">' + ICONS.chevronRight + '</span>';
                toggleButton.addEventListener('click', (event) => {
                    event.stopPropagation();
                    const nextExpanded = !isOutlineGroupExpanded(groupKey);
                    setOutlineGroupExpanded(groupKey, nextExpanded);
                    applyOutlineGroupState(groupKey, nextExpanded);
                    toggleButton.setAttribute('aria-label', nextExpanded ? '收起 AI 目录' : '展开 AI 目录');
                });

                userItem.appendChild(toggleButton);
                userItem.appendChild(createOutlineTextElement(item, variant));

                currentAiContainer = document.createElement('div');
                currentAiContainer.className = 'ai-sub-list' + (expanded ? '' : ' collapsed');
                currentAiContainer.style.display = expanded ? 'flex' : 'none';
                currentAiContainer.dataset.parentGroupKey = groupKey;

                itemWrapper.appendChild(userItem);
                itemWrapper.appendChild(currentAiContainer);
                fragment.appendChild(itemWrapper);
                return;
            }

            const aiItem = createOutlineItemElement(
                item,
                variant,
                (isPanel ? 'outline-ai-item' : 'outline-ai-item map-node') + ' level-' + Math.min(item.level || 1, 3),
            );
            aiItem.dataset.parentGroupKey = currentAiContainer?.dataset?.parentGroupKey || '';
            aiItem.style.paddingLeft = (12 + Math.max((item.level || 1) - 1, 0) * 12) + 'px';

            const iconEl = document.createElement('span');
            iconEl.className = 'outline-item-icon outline-item-icon-heading';
            iconEl.innerHTML = ICONS.outlineHeading;

            aiItem.appendChild(iconEl);
            aiItem.appendChild(createOutlineTextElement(item, variant));

            if (currentAiContainer) {
                currentAiContainer.appendChild(aiItem);
            } else {
                fragment.appendChild(aiItem);
            }
        });

        return fragment;
    }

    function renderOutline() {
        const container = document.getElementById('map-content');
        if (!container) {
            return;
        }

        const items = state.outlineItems.slice();

        if (!items.length) {
            container.innerHTML = '<div class="empty-state">当前还没有可展示的用户提问。</div>';
            return;
        }

        container.innerHTML = '';
        container.appendChild(buildOutlineTree(items, 'map'));
        updateScrollspy();
    }

    function renderOutlinePanelV2() {
        const panel = getOutlinePanel();
        const tocContainer = document.getElementById('lmnav-outline-list');
        const promptContainer = document.getElementById('lmnav-prompt-library');
        const searchWrap = document.getElementById('lmnav-outline-search-wrap');
        const footer = document.getElementById('lmnav-outline-footer');
        const refreshButton = document.getElementById('btn-outline-refresh');
        if (!tocContainer || !promptContainer || !panel) {
            return;
        }

        panel.style.display = 'flex';
        applyOutlinePanelState();
        panel.dataset.activeTab = state.outlinePanelTab;

        document.querySelectorAll('#lmnav-outline-panel .lmnav-outline-tab').forEach((tab) => {
            const active = tab.dataset.outlineTab === state.outlinePanelTab;
            tab.classList.toggle('active', active);
            tab.setAttribute('aria-selected', active ? 'true' : 'false');
        });

        const showPrompts = state.outlinePanelTab === 'prompts';
        tocContainer.hidden = showPrompts;
        promptContainer.hidden = !showPrompts;
        if (searchWrap) {
            searchWrap.hidden = showPrompts;
        }
        if (footer) {
            footer.hidden = showPrompts;
        }
        if (refreshButton) {
            refreshButton.hidden = showPrompts;
        }

        renderOutlinePromptLibrary();

        if (showPrompts) {
            return;
        }

        const items = getFilteredOutlineItems(state.outlineSearchTerm);

        if (!items.length) {
            tocContainer.innerHTML = '<div class="lmnav-outline-empty">当前没有可用的目录项。</div>';
            return;
        }

        tocContainer.innerHTML = '';
        tocContainer.appendChild(buildOutlineTree(items, 'panel'));
        highlightOutline(getActiveOutlineIndex());
    }

    function buildSearchSnippet(text, query, maxLength) {
        const normalized = normalizeOutlineText(text);
        if (!normalized) {
            return '';
        }

        const limit = Number(maxLength) || 96;
        if (!query) {
            return core.truncate(normalized, limit);
        }

        const lowerText = normalized.toLowerCase();
        const index = lowerText.indexOf(query);
        if (index < 0) {
            return core.truncate(normalized, limit);
        }

        const start = Math.max(0, index - Math.floor(limit / 3));
        const end = Math.min(normalized.length, start + limit);
        let snippet = normalized.slice(start, end);

        if (start > 0) {
            snippet = '...' + snippet;
        }
        if (end < normalized.length) {
            snippet += '...';
        }

        return snippet;
    }

    function getSearchMatchPriority(primaryText, searchableText, query) {
        const normalizedQuery = normalizeOutlineText(query).toLowerCase();
        const primary = normalizeOutlineText(primaryText).toLowerCase();
        const searchable = normalizeOutlineText(searchableText).toLowerCase();

        if (!normalizedQuery) {
            return Number.MAX_SAFE_INTEGER;
        }

        if (primary === normalizedQuery) {
            return 0;
        }

        if (primary.startsWith(normalizedQuery)) {
            return 1;
        }

        const primaryIndex = primary.indexOf(normalizedQuery);
        if (primaryIndex >= 0) {
            return 10 + primaryIndex;
        }

        const searchableIndex = searchable.indexOf(normalizedQuery);
        if (searchableIndex >= 0) {
            return 100 + searchableIndex;
        }

        return Number.MAX_SAFE_INTEGER;
    }

    function getGlobalSearchSections() {
        const query = state.globalSearchTerm;
        if (!query) {
            return [];
        }

        const folders = state.savedFolders
            .map((folder) => {
                const path = buildFolderPath(folder.id) || folder.name;
                const searchableText = [ folder.name, path ].join(' ');
                const priority = getSearchMatchPriority(folder.name, searchableText, query);
                if (!Number.isFinite(priority) || priority === Number.MAX_SAFE_INTEGER) {
                    return null;
                }

                return {
                    id: folder.id,
                    type: 'folder',
                    title: path,
                    preview: folder.name !== path ? ('文件夹名：' + folder.name) : ('包含 ' + getFolderEntryCount(folder.id) + ' 条会话'),
                    meta: (folder.isPinned ? '已置顶 · ' : '') + '左侧资料库',
                    isPinned: Boolean(folder.isPinned),
                    scope: 'left',
                    icon: folder.color ? getFolderNodeIcon(folder.color, false) : ICONS.folder,
                    fullText: path,
                    priority: priority
                };
            })
            .filter(Boolean)
            .sort((left, right) => left.priority - right.priority || Number(right.isPinned) - Number(left.isPinned) || left.title.localeCompare(right.title, 'zh-CN'))
            .slice(0, 6);

        const conversations = state.savedConversations
            .map((entry) => {
                const searchableText = [ entry.title, entry.summary, entry.folder ].join(' ');
                const priority = getSearchMatchPriority(entry.title, searchableText, query);
                if (!Number.isFinite(priority) || priority === Number.MAX_SAFE_INTEGER) {
                    return null;
                }

                return {
                    id: entry.id,
                    type: 'conversation',
                    title: entry.title,
                    preview: buildSearchSnippet(entry.summary || entry.title, query, 48),
                    meta: '左侧会话 · ' + (entry.folder || '未分类') + ' · ' + core.formatTime(entry.savedAt),
                    scope: 'left',
                    icon: ICONS.messageSquare,
                    fullText: [ entry.title, entry.summary, entry.folder ].filter(Boolean).join('\n'),
                    priority: priority,
                    sortValue: entry.savedAt
                };
            })
            .filter(Boolean)
            .sort((left, right) => left.priority - right.priority || right.sortValue - left.sortValue)
            .slice(0, 10);

        const prompts = state.prompts
            .map((prompt) => {
                const searchableText = [ prompt.title, prompt.content, prompt.tags.join(' ') ].join(' ');
                const priority = getSearchMatchPriority(prompt.title, searchableText, query);
                if (!Number.isFinite(priority) || priority === Number.MAX_SAFE_INTEGER) {
                    return null;
                }

                return {
                    id: prompt.id,
                    type: 'prompt',
                    title: prompt.title,
                    preview: buildSearchSnippet(prompt.content, query, 48),
                    meta: '右侧提示词库' + (prompt.tags.length ? (' · ' + prompt.tags.join(' / ')) : ''),
                    scope: 'right',
                    icon: ICONS.sparkle,
                    fullText: [ prompt.title, prompt.content, prompt.tags.join(' ') ].filter(Boolean).join('\n'),
                    priority: priority,
                    sortValue: Number.isFinite(prompt.updatedAt) ? prompt.updatedAt : prompt.createdAt
                };
            })
            .filter(Boolean)
            .sort((left, right) => left.priority - right.priority || right.sortValue - left.sortValue)
            .slice(0, 8);

        return [
            { key: 'folders', label: '文件夹', items: folders },
            { key: 'conversations', label: '会话', items: conversations },
            { key: 'prompts', label: '提示词', items: prompts }
        ].filter((section) => section.items.length);
    }

    function createGlobalSearchResultElement(result) {
        const row = document.createElement('div');
        row.className = 'clean-list-item global-search-item';
        row.dataset.searchType = result.type;
        row.dataset.resultId = result.id;
        row.dataset.fullText = result.fullText;
        row.tabIndex = 0;
        row.setAttribute('role', 'button');
        row.innerHTML = `
            <div class="global-search-item-icon">${result.icon}</div>
            <div class="item-main global-search-item-main">
                <div class="global-search-item-topline">
                    <div class="global-search-title">${core.escapeHtml(result.title)}</div>
                    <span class="meta-pill global-search-target global-search-target-${result.scope}">${result.scope === 'right' ? '右侧' : '左侧'}</span>
                </div>
                <div class="global-search-preview">${core.escapeHtml(result.preview)}</div>
                <div class="global-search-meta">${core.escapeHtml(result.meta)}</div>
            </div>
        `;
        bindGlobalTooltipEvents(row, result.fullText);
        return row;
    }

    function renderGlobalSearchResults() {
        const container = document.getElementById('global-search-results');
        if (!container) {
            return;
        }

        const sections = getGlobalSearchSections();
        const total = sections.reduce((sum, section) => sum + section.items.length, 0);
        if (!total) {
            container.innerHTML = '<div class="empty-state">没有找到匹配的文件夹、会话或提示词。</div>';
            return;
        }

        const fragment = document.createDocumentFragment();

        const summary = document.createElement('div');
        summary.className = 'global-search-summary';
        summary.innerHTML = `
            <div class="global-search-summary-topline">
                <div class="summary-title">全局搜索结果</div>
                <span class="meta-pill">${total}</span>
            </div>
            <div class="global-search-summary-copy">点击结果后会直接定位到对应侧边栏</div>
        `;
        fragment.appendChild(summary);

        sections.forEach((section) => {
            const sectionEl = document.createElement('section');
            sectionEl.className = 'global-search-section';
            sectionEl.innerHTML = `
                <div class="global-search-section-header">
                    <div class="global-search-section-title">${section.label}</div>
                    <span class="meta-pill">${section.items.length}</span>
                </div>
            `;

            section.items.forEach((result) => {
                sectionEl.appendChild(createGlobalSearchResultElement(result));
            });
            fragment.appendChild(sectionEl);
        });

        container.innerHTML = '';
        container.appendChild(fragment);
    }

    function getActiveOutlineIndex() {
        const headingThreshold = 132;
        const turnThreshold = Math.round(window.innerHeight * 0.42);
        let activeIndex = -1;
        let closestIndex = -1;
        let minDistance = Number.POSITIVE_INFINITY;

        state.outlineItems.forEach((item) => {
            if (!item.element || !item.element.isConnected) {
                return;
            }

            const rect = item.element.getBoundingClientRect();
            const center = rect.top + (rect.height / 2);
            const pivot = item.source === 'heading' ? headingThreshold : turnThreshold;

            if (rect.bottom <= 0 || center <= pivot) {
                activeIndex = item.index;
                return;
            }

            if (rect.top < window.innerHeight) {
                const distance = Math.abs(center - pivot);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestIndex = item.index;
                }
            }
        });

        return activeIndex >= 0 ? activeIndex : closestIndex;
    }

    function renderPrompts() {
        const container = document.getElementById('prompts-list');
        if (!container) {
            return;
        }

        const items = state.prompts.slice();

        if (!items.length) {
            container.innerHTML = '<div class="empty-state">这里还没有提示词，可以把常用指令保存到这里。</div>';
            return;
        }

        const fragment = document.createDocumentFragment();
        items.forEach((prompt) => {
            const tagsHtml = prompt.tags.length
                ? '<div class="prompt-tags">' + prompt.tags.map((tag) => '<span class="tag-chip">' + core.escapeHtml(tag) + '</span>').join('') + '</div>'
                : '';
            const row = document.createElement('div');
            row.className = 'clean-list-item prompt-item';
            row.dataset.promptId = prompt.id;
            row.dataset.fullText = prompt.content;
            row.innerHTML = `
                <div class="item-main">
                    <div class="item-title-row"><div class="p-title">${core.escapeHtml(prompt.title)}</div></div>
                    <div class="p-preview">${core.escapeHtml(core.truncate(prompt.content, 120))}</div>
                    ${tagsHtml}
                </div>
                <div class="item-actions">
                    <button class="icon-btn" data-action="use" title="插入提示词">${ICONS.add}</button>
                    <button class="icon-btn" data-action="copy" title="复制提示词">${ICONS.copy}</button>
                    <button class="icon-btn danger" data-action="delete" title="删除提示词">${ICONS.trash}</button>
                </div>
            `;
            fragment.appendChild(row);
        });

        container.innerHTML = '';
        container.appendChild(fragment);
        syncFolderInlineEditor();

        if (state.globalSearchTerm) {
            renderGlobalSearchResults();
        }
    }

    function renderLibrary() {
        renderLibraryChrome();

        if (state.layoutMode === 'embedded') {
            renderEmbeddedLibraryTree();
            syncFolderInlineEditor();
            renderFloatingFolderMenu();
            if (state.globalSearchTerm) {
                renderGlobalSearchResults();
            }
            return;
        }

        const container = document.getElementById('library-list');
        const currentFolderEl = document.getElementById('library-current-folder');
        if (!container || !currentFolderEl) {
            return;
        }

        renderFolderTree();

        const items = getVisibleLibraryEntries().sort((left, right) => right.savedAt - left.savedAt);
        currentFolderEl.textContent = getCurrentFolderLabel() + ' (' + items.length + ')';

        if (!items.length) {
            container.innerHTML = '<div class="empty-state">这个文件夹里还没有会话。</div>';
            syncFolderInlineEditor();
            renderFloatingFolderMenu();
            return;
        }

        const fragment = document.createDocumentFragment();
        items.forEach((entry) => {
            const row = document.createElement('div');
            row.className = 'clean-list-item library-item';
            row.dataset.savedId = entry.id;
            row.dataset.fullText = entry.summary;
            row.draggable = true;
            row.innerHTML = `
                <div class="item-main">
                    <div class="item-title-row">
                        <div class="p-title">${core.escapeHtml(entry.title)}</div>
                        <span class="meta-pill">${core.formatTime(entry.savedAt)}</span>
                    </div>
                    <div class="p-preview">${core.escapeHtml(entry.summary)}</div>
                    <div class="entry-meta">${core.escapeHtml(getSavedConversationMetaText(entry))}</div>
                    <label class="folder-assign-row">
                        <span>所在文件夹</span>
                        <select class="folder-assign-select" data-saved-id="${entry.id}">
                            ${buildFolderOptionsHtml(entry.folderId)}
                        </select>
                    </label>
                </div>
                <div class="item-actions">
                    <button class="icon-btn" data-action="open" title="打开会话">${ICONS.link}</button>
                    <button class="icon-btn" data-action="copy" title="复制文稿">${ICONS.copy}</button>
                    <button class="icon-btn" data-action="export" title="导出文稿">${ICONS.export}</button>
                    <button class="icon-btn danger" data-action="delete" title="删除会话">${ICONS.trash}</button>
                </div>
            `;
            fragment.appendChild(row);
        });

        container.innerHTML = '';
        container.appendChild(fragment);
        syncFolderInlineEditor();
        renderFloatingFolderMenu();

        if (state.globalSearchTerm) {
            renderGlobalSearchResults();
        }
    }

    function renderEmbeddedLibraryTree() {
        const tree = document.getElementById('library-folder-tree');
        if (!tree) {
            return;
        }

        const conversationMap = new Map();
        state.savedConversations.forEach((entry) => {
            const key = entry.folderId || LIBRARY_INBOX_ID;
            if (!conversationMap.has(key)) {
                conversationMap.set(key, []);
            }
            conversationMap.get(key).push(entry);
        });

        const fragment = document.createDocumentFragment();

        const renderFolderBranch = (parentId, depth) => {
            getFolderChildren(parentId).forEach((folder) => {
                const childFolders = getFolderChildren(folder.id);
                const childConversations = (conversationMap.get(folder.id) || []).length;
                const expandable = childFolders.length > 0 || childConversations > 0;
                const expanded = isFolderExpanded(folder.id);
                const row = createFolderNodeElement(folder, {
                    depth: depth,
                    expanded: expanded,
                    expandable: expandable,
                    acceptDrop: true,
                    indentStep: 18
                });
                fragment.appendChild(row);

                if (expanded) {
                    const conversations = (conversationMap.get(folder.id) || []).sort((left, right) => right.savedAt - left.savedAt);
                    conversations.forEach((entry) => {
                        const conversation = document.createElement('div');
                        conversation.className = 'lmnav-tree-conversation library-item';
                        conversation.dataset.savedId = entry.id;
                        conversation.dataset.fullText = entry.summary;
                        conversation.dataset.depth = String(depth + 1);
                        conversation.style.setProperty('--tree-guide-left', (20 + (depth * 18)) + 'px');
                        conversation.draggable = true;
                        conversation.title = '可拖拽到其他文件夹';
                        conversation.style.paddingLeft = 30 + (depth * 18) + 'px';
                        conversation.innerHTML = `
                            <div class="lmnav-tree-conversation-main">
                                ${getConversationNodeIcon()}
                                <span class="lmnav-tree-title">${core.escapeHtml(core.truncate(entry.title, 24))}</span>
                            </div>
                            <div class="lmnav-tree-actions">
                                <button class="icon-btn" data-action="open" title="打开会话">${ICONS.link}</button>
                                <button class="icon-btn" data-action="copy" title="复制文稿">${ICONS.copy}</button>
                                <button class="icon-btn" data-action="move" title="移动到当前文件夹">${ICONS.add}</button>
                                <button class="icon-btn danger" data-action="delete" title="删除会话">${ICONS.trash}</button>
                            </div>
                        `;
                        fragment.appendChild(conversation);
                    });

                    renderFolderBranch(folder.id, depth + 1);
                }
            });
        };

        renderFolderBranch(null, 0);

        if (!state.savedFolders.length) {
            tree.innerHTML = '<div class="empty-state">还没有创建任何文件夹。</div>';
            return;
        }

        tree.innerHTML = '';
        tree.appendChild(fragment);
    }

    function renderFolderTree() {
        const tree = document.getElementById('library-folder-tree');
        if (!tree) {
            return;
        }

        const fragment = document.createDocumentFragment();

        const appendFolderBranch = (parentId, depth) => {
            getFolderChildren(parentId).forEach((folder) => {
                const childFolders = getFolderChildren(folder.id);
                const expandable = childFolders.length > 0;
                const expanded = isFolderExpanded(folder.id);
                const row = createFolderNodeElement(folder, {
                    depth: depth,
                    expanded: expanded,
                    expandable: expandable,
                    acceptDrop: true,
                    indentStep: 16
                });
                fragment.appendChild(row);

                if (expanded) {
                    appendFolderBranch(folder.id, depth + 1);
                }
            });
        };

        appendFolderBranch(null, 0);
        if (!state.savedFolders.length) {
            tree.innerHTML = '<div class="empty-state">还没有创建任何文件夹。</div>';
            return;
        }
        tree.innerHTML = '';
        tree.appendChild(fragment);
    }

    function buildFolderOptionsHtml(selectedFolderId) {
        const options = [ '<option value="">收纳箱</option>' ];

        const addBranch = (parentId, depth) => {
            getFolderChildren(parentId).forEach((folder) => {
                const prefix = depth ? new Array(depth + 1).join('  ') + '↳ ' : '';
                const selected = selectedFolderId === folder.id ? ' selected' : '';
                options.push('<option value="' + folder.id + '"' + selected + '>' + core.escapeHtml(prefix + folder.name) + '</option>');
                addBranch(folder.id, depth + 1);
            });
        };

        addBranch(null, 0);
        return options.join('');
    }

    function renderTools() {
        const statsEl = document.getElementById('tool-stats');
        if (!statsEl) {
            return;
        }

        const snapshot = state.currentSnapshot || {
            title: '当前没有加载会话',
            turns: [],
            totalChars: 0,
            summary: ''
        };

        statsEl.innerHTML = `
            <div class="stat-card"><div class="stat-label">消息数</div><div class="stat-value">${snapshot.turns.length}</div></div>
            <div class="stat-card"><div class="stat-label">字符数</div><div class="stat-value">${snapshot.totalChars}</div></div>
            <div class="stat-card"><div class="stat-label">提示词</div><div class="stat-value">${state.prompts.length}</div></div>
            <div class="stat-card"><div class="stat-label">已存会话</div><div class="stat-value">${state.savedConversations.length}</div></div>
            <div class="summary-card">
                <div class="summary-title">${core.escapeHtml(snapshot.title)}</div>
                <div class="summary-copy">${core.escapeHtml(snapshot.summary || '检测到会话后会在这里生成摘要。')}</div>
            </div>
        `;
    }

    function updateContextRing(totalChars) {
        const ring = document.getElementById('ctx-progress-indicator');
        const button = document.getElementById('btn-context-ring');
        if (!ring || !button) {
            return;
        }

        const estimated = Math.floor(totalChars * 1.65);
        const percentage = Math.min((estimated / core.CONTEXT_LIMIT) * 100, 100);
        const circumference = 2 * Math.PI * 14;
        ring.style.strokeDashoffset = String(circumference - (percentage / 100) * circumference);

        button.removeAttribute('data-level');
        if (percentage > 85) {
            button.dataset.level = 'danger';
        } else if (percentage > 60) {
            button.dataset.level = 'warn';
        }

        button.title = '上下文估算：' + (estimated / 1000).toFixed(1) + 'k / ' + Math.round(core.CONTEXT_LIMIT / 1000) + 'k 字符';
    }

    function handleOutlineClick(event) {
        const item = event.target.closest('.map-node, .lmnav-outline-item');
        if (item) {
            jumpToOutlineIndex(Number(item.dataset.outlineIndex));
        }
    }

    function handleOutlinePanelClick(event) {
        const tab = event.target.closest('[data-outline-tab]');
        if (!tab) {
            return;
        }

        event.preventDefault();
        setOutlinePanelTab(tab.dataset.outlineTab);
    }

    function handleOutlinePromptLibraryInput(event) {
        if (!state.outlinePromptDraft) {
            return;
        }

        const target = event.target;
        if (!(target instanceof HTMLInputElement) && !(target instanceof HTMLTextAreaElement)) {
            return;
        }

        if (target.id === 'lmnav-prompt-title-input') {
            state.outlinePromptDraft.title = target.value;
            return;
        }

        if (target.id === 'lmnav-prompt-content-input') {
            state.outlinePromptDraft.content = target.value;
        }
    }

    function handleOutlinePromptLibraryClick(event) {
        const newButton = event.target.closest('#btn-outline-new-prompt');
        if (newButton) {
            event.preventDefault();
            openOutlinePromptDraft(null);
            return;
        }

        const cancelButton = event.target.closest('#btn-outline-prompt-cancel');
        if (cancelButton) {
            event.preventDefault();
            closeOutlinePromptDraft();
            return;
        }

        const saveButton = event.target.closest('#btn-outline-prompt-save');
        if (saveButton) {
            event.preventDefault();
            saveOutlinePromptDraft();
            return;
        }

        const actionButton = event.target.closest('[data-outline-prompt-action]');
        if (!actionButton) {
            return;
        }

        event.preventDefault();
        const prompt = state.prompts.find((item) => item.id === actionButton.dataset.promptId);
        if (!prompt) {
            return;
        }

        const action = actionButton.dataset.outlinePromptAction;
        if (action === 'insert') {
            usePrompt(prompt);
            return;
        }

        if (action === 'edit') {
            openOutlinePromptDraft(prompt);
            return;
        }

        if (action === 'delete') {
            deletePrompt(prompt.id);
        }
    }

    function handleDelegatedTooltipHover(event, selector) {
        const item = event.target.closest(selector);
        if (!item) {
            return;
        }

        showTooltip(item, item.dataset.fullText || '');
    }

    function handlePromptHover(event) {
        handleDelegatedTooltipHover(event, '.prompt-item');
    }

    function handleLibraryHover(event) {
        handleDelegatedTooltipHover(event, '.library-item');
    }

    function showTooltip(target, text) {
        if (!state.tooltipEl || !text) {
            return;
        }

        const rect = target.getBoundingClientRect();
        state.tooltipEl.textContent = text;
        state.tooltipEl.style.left = Math.min(window.innerWidth - 320, rect.right + 12) + 'px';
        state.tooltipEl.style.right = 'auto';
        state.tooltipEl.style.top = Math.max(20, rect.top) + 'px';
        state.tooltipEl.style.bottom = 'auto';
        state.tooltipEl.classList.add('visible');
    }

    function hideTooltip() {
        if (state.tooltipEl) {
            state.tooltipEl.classList.remove('visible');
        }
    }

    function jumpToOutlineIndex(index) {
        if (index < 0 || index >= state.outlineItems.length) {
            return;
        }

        const item = state.outlineItems[index];
        if (!item?.element) {
            return;
        }

        item.element.scrollIntoView({
            behavior: 'smooth',
            block: item.source === 'heading' ? 'start' : 'center'
        });
        highlightOutline(index);
    }

    function highlightOutline(index) {
        document.querySelectorAll('#map-content .map-node.active, #lmnav-outline-list .lmnav-outline-item.active').forEach((node) => {
            node.classList.remove('active');
        });

        const targets = [
            document.querySelector('#map-content .map-node[data-outline-index="' + index + '"]'),
            document.querySelector('#lmnav-outline-list .lmnav-outline-item[data-outline-index="' + index + '"]')
        ].filter(Boolean);

        targets.forEach((target) => {
            target.classList.add('active');
            const parent = target.parentElement;
            if (!parent) {
                return;
            }
            const targetRect = target.getBoundingClientRect();
            const parentRect = parent.getBoundingClientRect();
            if (targetRect.top < parentRect.top || targetRect.bottom > parentRect.bottom) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }
        });
    }

    function updateScrollspy() {
        if (!state.isVisible || !state.outlineItems.length) {
            return;
        }

        const closestIndex = getActiveOutlineIndex();
        if (closestIndex >= 0) {
            highlightOutline(closestIndex);
        }
    }

    function cycleTheme() {
        const currentIndex = THEMES.indexOf(state.theme);
        state.theme = THEMES[(currentIndex + 1) % THEMES.length];
        storage.set('theme', state.theme);
        applyTheme();
    }

    function applyTheme() {
        const sidebar = getSidebar();
        if (!sidebar) {
            return;
        }

        sidebar.classList.remove('force-light', 'force-dark');
        state.tooltipEl?.classList.remove('force-light', 'force-dark');
        state.toastEl?.classList.remove('force-light', 'force-dark');

        if (state.theme === 'light') {
            sidebar.classList.add('force-light');
            state.tooltipEl?.classList.add('force-light');
            state.toastEl?.classList.add('force-light');
            return;
        }

        if (state.theme === 'dark') {
            sidebar.classList.add('force-dark');
            state.tooltipEl?.classList.add('force-dark');
            state.toastEl?.classList.add('force-dark');
        }
    }

    function toggleAutoHide() {
        if (state.layoutMode === 'embedded') {
            showToast('嵌入模式下不支持自动隐藏。', true);
            return;
        }

        state.isAutoHide = !state.isAutoHide;
        storage.set('autoHide', state.isAutoHide);

        const sidebar = getSidebar();
        const button = document.getElementById('btn-autohide');
        sidebar.classList.toggle('auto-hide-mode', state.isAutoHide);
        button.innerHTML = state.isAutoHide ? ICONS.pin : ICONS.unpin;

        if (!state.isAutoHide) {
            sidebar.classList.remove('is-hovering');
        }
    }

    function toggleState(showSidebar) {
        state.isVisible = showSidebar;
        syncSidebarVisibilityState();
        if (showSidebar) {
            refreshConversation(true);
        }
    }

    function initResize(sidebar) {
        const resizer = sidebar.querySelector('.map-resizer');
        let isResizing = false;
        let startX = 0;
        let startWidth = 0;

        const onMove = (event) => {
            if (!isResizing) {
                return;
            }
            const nextWidth = core.clampNumber(startWidth + (event.clientX - startX), CONFIG.minWidth, CONFIG.maxWidth);
            state.width = nextWidth;
            sidebar.style.width = nextWidth + 'px';
        };

        const onUp = () => {
            if (!isResizing) {
                return;
            }
            isResizing = false;
            document.body.style.cursor = '';
            sidebar.style.transition = '';
            storage.set('sidebarWidth', state.width);
        };

        resizer.addEventListener('mousedown', (event) => {
            isResizing = true;
            startX = event.clientX;
            startWidth = sidebar.getBoundingClientRect().width;
            document.body.style.cursor = 'col-resize';
            sidebar.style.transition = 'none';
        });

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
        state.cleanupFns.push(() => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
        });
    }

    function addPrompt() {
        const titleInput = document.getElementById('prompt-title');
        const tagsInput = document.getElementById('prompt-tags');
        const contentInput = document.getElementById('prompt-content');

        const prompt = normalizePromptItem({
            title: titleInput.value,
            content: contentInput.value,
            tags: tagsInput.value.split(',').map((tag) => tag.trim()).filter(Boolean)
        });

        if (!prompt) {
            showToast('提示词标题和内容不能为空。', true);
            return;
        }

        state.prompts.unshift(prompt);
        persistPromptVault();
        titleInput.value = '';
        tagsInput.value = '';
        contentInput.value = '';
        renderPrompts();
        renderOutlinePanelV2();
        renderTools();
        showToast('提示词已保存。');
    }

    function deletePrompt(promptId) {
        const prompt = state.prompts.find((entry) => entry.id === promptId);
        if (!prompt) {
            return;
        }

        const snapshot = createPromptStateSnapshot();
        state.prompts = state.prompts.filter((entry) => entry.id !== promptId);
        if (state.outlinePromptDraft?.id === promptId) {
            state.outlinePromptDraft = null;
        }

        renderPrompts();
        renderOutlinePanelV2();
        renderTools();
        showToast(
            '已删除提示词“' + core.truncate(prompt.title, 24) + '”',
            () => {
                restorePromptStateSnapshot(snapshot);
                persistPromptVault().catch((error) => {
                    console.error(error);
                    showToast('撤销删除提示词失败。', true);
                });
            },
            {
                onExpire: () => persistPromptVault(),
                actionText: '撤销'
            },
        );
    }

    function usePrompt(prompt) {
        const success = arena.fillInput(prompt.content);
        if (!success) {
            core.copyText(prompt.content).then(() => showToast('没有找到输入框，已复制到剪贴板。', true));
            return;
        }
        showToast('提示词已插入输入框。');
    }

    function findElementByDataset(selector, datasetKey, value) {
        return Array.from(document.querySelectorAll(selector)).find((element) =>
            element instanceof HTMLElement && element.dataset && element.dataset[datasetKey] === String(value),
        ) || null;
    }

    function runAfterNextRender(callback) {
        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
                callback();
            });
        });
    }

    function pulseLocatedElement(element) {
        if (!(element instanceof HTMLElement)) {
            return;
        }

        element.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
        });

        element.classList.remove('search-located');
        void element.offsetWidth;
        element.classList.add('search-located');
        window.setTimeout(() => {
            element.classList.remove('search-located');
        }, 1600);
    }

    function clearGlobalSearch() {
        state.globalSearchTerm = '';
        updateMainSearchInputValue('');
    }

    function locateFolderSearchResult(folderId) {
        const folder = getFolderById(folderId);
        if (!folder) {
            return;
        }

        clearGlobalSearch();
        expandFolderAncestors(folder.id);
        state.currentLibraryFolderId = folder.id;
        state.lastSaveFolder = buildFolderPath(folder.id);
        updateSaveFolderInputValue(state.lastSaveFolder);
        storage.set('currentLibraryFolderId', state.currentLibraryFolderId);
        switchTab('library', true);

        runAfterNextRender(() => {
            pulseLocatedElement(findElementByDataset('.folder-node', 'folderId', folder.id));
        });
    }

    function locateConversationSearchResult(savedId) {
        const entry = state.savedConversations.find((saved) => saved.id === savedId);
        if (!entry) {
            return;
        }

        clearGlobalSearch();
        if (entry.folderId) {
            expandFolderAncestors(entry.folderId);
            state.currentLibraryFolderId = entry.folderId;
            state.lastSaveFolder = buildFolderPath(entry.folderId);
        } else {
            state.currentLibraryFolderId = LIBRARY_INBOX_ID;
            state.lastSaveFolder = '';
        }

        updateSaveFolderInputValue(state.lastSaveFolder);
        storage.set('currentLibraryFolderId', state.currentLibraryFolderId);
        switchTab('library', true);

        runAfterNextRender(() => {
            pulseLocatedElement(findElementByDataset('.library-item, .lmnav-tree-conversation', 'savedId', entry.id));
        });
    }

    function locatePromptSearchResult(promptId) {
        const prompt = state.prompts.find((entry) => entry.id === promptId);
        if (!prompt) {
            return;
        }

        clearGlobalSearch();
        switchTab('prompts', true);
        setOutlineCollapsed(false);
        setOutlinePanelTab('prompts');

        runAfterNextRender(() => {
            pulseLocatedElement(findElementByDataset('.prompt-item', 'promptId', prompt.id));
            pulseLocatedElement(findElementByDataset('.lmnav-prompt-card', 'outlinePromptId', prompt.id));
        });
    }

    function activateGlobalSearchResult(item) {
        if (!(item instanceof HTMLElement)) {
            return;
        }

        const resultId = item.dataset.resultId || '';
        const resultType = item.dataset.searchType || '';
        if (!resultId || !resultType) {
            return;
        }

        if (resultType === 'folder') {
            locateFolderSearchResult(resultId);
            return;
        }

        if (resultType === 'conversation') {
            locateConversationSearchResult(resultId);
            return;
        }

        if (resultType === 'prompt') {
            locatePromptSearchResult(resultId);
        }
    }

    function handleGlobalSearchResultClick(event) {
        const item = event.target.closest('.global-search-item');
        if (!item) {
            return;
        }

        activateGlobalSearchResult(item);
    }

    function handleGlobalSearchResultKeydown(event) {
        if (event.key !== 'Enter' && event.key !== ' ') {
            return;
        }

        const item = event.target.closest('.global-search-item');
        if (!item) {
            return;
        }

        event.preventDefault();
        activateGlobalSearchResult(item);
    }

    function handlePromptClick(event) {
        const item = event.target.closest('.prompt-item');
        if (!item) {
            return;
        }

        const prompt = state.prompts.find((entry) => entry.id === item.dataset.promptId);
        if (!prompt) {
            return;
        }

        const action = event.target.closest('[data-action]')?.dataset.action || 'use';
        if (action === 'delete') {
            deletePrompt(prompt.id);
            return;
        }

        if (action === 'copy') {
            core.copyText(prompt.content).then(() => showToast('提示词已复制。'));
            return;
        }

        usePrompt(prompt);
    }

    async function importPrompts(event) {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        try {
            const raw = await core.readTextFile(file);
            const parsed = core.safeJsonParse(raw, null);
            const importedItems = Array.isArray(parsed)
                ? parsed
                : Array.isArray(parsed?.items)
                    ? parsed.items
                    : Array.isArray(parsed?.prompts)
                        ? parsed.prompts
                        : [];

            let merged = 0;
            importedItems.forEach((item) => {
                const prompt = normalizePromptItem(item);
                if (!prompt) {
                    return;
                }

                const exists = state.prompts.some((entry) => entry.title === prompt.title && entry.content === prompt.content);
                if (!exists) {
                    state.prompts.unshift(prompt);
                    merged += 1;
                }
            });

            await persistPromptVault();
            renderPrompts();
            renderOutlinePanelV2();
            renderTools();
            showToast('已导入 ' + merged + ' 条提示词。');
        } catch (error) {
            console.error(error);
            showToast('导入提示词失败。', true);
        } finally {
            event.target.value = '';
        }
    }

    function exportPrompts() {
        const payload = {
            format: 'lmarena-navigator.prompts.v1',
            exportedAt: new Date().toISOString(),
            items: state.prompts
        };
        core.downloadTextFile('提示词库.json', JSON.stringify(payload, null, 2), 'application/json');
        showToast('提示词库已导出。');
    }

    function deleteSavedConversation(savedId) {
        const entry = state.savedConversations.find((saved) => saved.id === savedId);
        if (!entry) {
            return;
        }

        const snapshot = createLibraryStateSnapshot();
        state.savedConversations = state.savedConversations.filter((saved) => saved.id !== savedId);
        renderLibrary();
        renderTools();
        showToast(
            '已移除会话“' + core.truncate(entry.title, 24) + '”',
            () => {
                restoreLibraryStateSnapshot(snapshot);
                persistLibraryState().catch((error) => {
                    console.error(error);
                    showToast('撤销移除会话失败。', true);
                });
            },
            {
                onExpire: () => persistLibraryState(),
                actionText: '撤销'
            },
        );
    }

    function buildMarkdown(snapshot) {
        const lines = [
            '# ' + snapshot.title,
            '',
            '- 站点：' + snapshot.site,
            '- 链接：' + snapshot.url,
            '- 保存时间：' + new Date(snapshot.savedAt).toISOString()
        ];

        if (snapshot.folder) {
            lines.push('- 文件夹：' + snapshot.folder);
        }

        lines.push('');
        lines.push('## 对话内容');
        lines.push('');

        if (!Array.isArray(snapshot.turns) || !snapshot.turns.length) {
            lines.push('## 说明');
            lines.push('');
            lines.push('未缓存对话正文，当前条目来自 Arena 原生历史记录的快捷入口。');
            lines.push('');
            return lines.join('\n');
        }

        let userCount = 0;
        let assistantCount = 0;
        snapshot.turns.forEach((turn) => {
            if (turn.role === 'assistant') {
                assistantCount += 1;
                lines.push('### 助手 ' + assistantCount);
            } else {
                userCount += 1;
                lines.push('### 用户 ' + userCount);
            }
            lines.push('');
            lines.push(turn.text);
            lines.push('');
        });

        return lines.join('\n');
    }

    function buildExportPayload(snapshot) {
        return {
            format: 'lmarena-navigator.chat.v1',
            exportedAt: new Date().toISOString(),
            title: snapshot.title,
            site: snapshot.site,
            url: snapshot.url,
            folder: snapshot.folder,
            summary: snapshot.summary,
            turns: snapshot.turns,
            source: snapshot.source || 'snapshot'
        };
    }

    function downloadConversation(snapshot, format) {
        const filenameBase = core.sanitizeFilename(snapshot.title || '会话记录');
        if (format === 'json') {
            core.downloadTextFile(filenameBase + '.json', JSON.stringify(buildExportPayload(snapshot), null, 2), 'application/json');
            showToast('会话已导出为数据文件。');
            return;
        }

        core.downloadTextFile(filenameBase + '.md', buildMarkdown(snapshot), 'text/markdown');
        showToast('会话已导出为文稿。');
    }

    function exportCurrentConversation(format) {
        if (!state.currentSnapshot || !state.currentSnapshot.turns.length) {
            showToast('当前没有可导出的会话。', true);
            return;
        }

        const snapshot = {
            ...state.currentSnapshot,
            title: document.getElementById('save-title-input').value.trim() || state.currentSnapshot.title,
            folder: core.normalizeFolderPath(document.getElementById('save-folder-input').value),
            savedAt: Date.now()
        };
        downloadConversation(snapshot, format);
    }

    function copyCurrentConversationMarkdown() {
        if (!state.currentSnapshot || !state.currentSnapshot.turns.length) {
            showToast('当前没有可复制的会话。', true);
            return;
        }

        const snapshot = {
            ...state.currentSnapshot,
            title: document.getElementById('save-title-input').value.trim() || state.currentSnapshot.title,
            folder: core.normalizeFolderPath(document.getElementById('save-folder-input').value),
            savedAt: Date.now()
        };
        core.copyText(buildMarkdown(snapshot)).then(() => showToast('会话文稿已复制。'));
    }

    function handleLibraryClick(event) {
        const item = event.target.closest('.library-item');
        if (!item) {
            return;
        }

        const entry = state.savedConversations.find((saved) => saved.id === item.dataset.savedId);
        if (!entry) {
            return;
        }

        const action = event.target.closest('[data-action]')?.dataset.action || 'open';
        if (action === 'delete') {
            deleteSavedConversation(entry.id);
            return;
        }

        if (action === 'copy') {
            core.copyText(buildMarkdown(entry)).then(() => showToast('已复制该会话的文稿。'));
            return;
        }

        if (action === 'export') {
            downloadConversation(entry, 'markdown');
            return;
        }

        navigateToSavedConversation(entry);
    }

    function handleLibraryChange(event) {
        const select = event.target.closest('.folder-assign-select');
        if (!select) {
            return;
        }

        moveSavedConversation(select.dataset.savedId, select.value || null);
    }

    function handleFloatingFolderMenuClick(event) {
        if (!event.target.closest('.folder-context-menu')) {
            return false;
        }

        const colorSwatch = event.target.closest('[data-folder-color]');
        if (colorSwatch) {
            event.preventDefault();
            event.stopPropagation();
            applyFolderColor(colorSwatch.dataset.folderId, colorSwatch.dataset.folderColor);
            return true;
        }

        const menuAction = event.target.closest('[data-folder-action]');
        if (menuAction) {
            event.preventDefault();
            event.stopPropagation();
            handleFolderMenuAction(menuAction.dataset.folderId, menuAction.dataset.folderAction);
            return true;
        }

        return false;
    }

    function handleFolderTreeClick(event) {
        const menuTrigger = event.target.closest('[data-folder-menu-trigger]');
        if (menuTrigger) {
            event.stopPropagation();
            toggleFolderContextMenu(menuTrigger.dataset.folderMenuTrigger, menuTrigger);
            return;
        }

        const menuAction = event.target.closest('[data-folder-action]');
        if (menuAction) {
            event.stopPropagation();
            handleFolderMenuAction(menuAction.dataset.folderId, menuAction.dataset.folderAction);
            return;
        }

        const colorSwatch = event.target.closest('[data-folder-color]');
        if (colorSwatch) {
            event.stopPropagation();
            applyFolderColor(colorSwatch.dataset.folderId, colorSwatch.dataset.folderColor);
            return;
        }

        if (event.target.closest('.folder-context-menu, .folder-rename-input')) {
            event.stopPropagation();
            return;
        }

        const toggle = event.target.closest('[data-folder-toggle]');
        if (toggle) {
            event.stopPropagation();
            const folderId = toggle.dataset.folderToggle;
            setFolderExpanded(folderId, !isFolderExpanded(folderId));
            renderLibrary();
            return;
        }

        toggleFolderSettingsMenu(false);

        const conversation = event.target.closest('.lmnav-tree-conversation');
        if (conversation) {
            const entry = state.savedConversations.find((saved) => saved.id === conversation.dataset.savedId);
            if (!entry) {
                return;
            }

            const action = event.target.closest('[data-action]')?.dataset.action || 'open';
            if (action === 'delete') {
                deleteSavedConversation(entry.id);
                return;
            }

            if (action === 'copy') {
                core.copyText(buildMarkdown(entry)).then(() => showToast('已复制该会话的文稿。'));
                return;
            }

            if (action === 'move') {
                moveSavedConversation(entry.id, isRealFolderId(state.currentLibraryFolderId) ? state.currentLibraryFolderId : null);
                return;
            }

            navigateToSavedConversation(entry);
            return;
        }

        const node = event.target.closest('.folder-node');
        if (!node) {
            return;
        }

        state.currentLibraryFolderId = node.dataset.folderId || LIBRARY_ALL_ID;
        storage.set('currentLibraryFolderId', state.currentLibraryFolderId);
        document.getElementById('save-folder-input').value = isRealFolderId(state.currentLibraryFolderId)
            ? buildFolderPath(state.currentLibraryFolderId)
            : '';
        closeFolderContextMenu();
        renderLibrary();
    }

    function handleLibraryDragStart(event) {
        const item = event.target.closest('.library-item');
        if (!item?.dataset.savedId || !event.dataTransfer) {
            return;
        }

        if (event.target.closest('[data-action], .folder-assign-select')) {
            event.preventDefault();
            return;
        }

        const entry = state.savedConversations.find((saved) => saved.id === item.dataset.savedId);
        state.draggedSavedId = item.dataset.savedId;
        state.draggedSavedSource = {
            savedId: item.dataset.savedId,
            folderId: entry?.folderId || null,
            panel: item.closest('#library-list') ? 'library-list' : 'library-folder-tree'
        };
        item.classList.add('dragging');
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', item.dataset.savedId);
        event.dataTransfer.setData('application/x-lmnav-saved-id', item.dataset.savedId);
    }

    function handleLibraryDragEnd() {
        clearLibraryDragState();
    }

    function handleNativeHistoryDragStart(event) {
        const anchor = event.target.closest('a[data-lmnav-native-history-item="true"]');
        if (!anchor || !event.dataTransfer) {
            return;
        }

        const payload = buildNativeHistoryPayload(anchor)
            || parseNativeHistoryDragPayload(JSON.stringify({
                id: anchor.dataset.lmnavNativeHistoryId,
                title: anchor.dataset.lmnavNativeHistoryTitle,
                url: anchor.dataset.lmnavNativeHistoryUrl
            }));
        if (!payload) {
            return;
        }

        state.draggedNativeHistoryItem = payload;
        anchor.classList.add('lmnav-native-history-dragging');
        event.dataTransfer.effectAllowed = 'copy';
        event.dataTransfer.setData('text/plain', JSON.stringify(payload));
        event.dataTransfer.setData('application/x-lmnav-native-history', JSON.stringify(payload));
        setNativeHistoryDragImage(event, payload.title);
    }

    function handleNativeHistoryDragEnd() {
        if (!state.draggedNativeHistoryItem) {
            return;
        }

        clearLibraryDragState();
    }

    function handleFolderTreeDragEnter(event) {
        const node = event.target.closest('.folder-node');
        if (!getActiveFolderDropPayload(event) || !node || node.dataset.acceptDrop !== 'true') {
            return;
        }

        event.preventDefault();
        setActiveFolderDropTarget(node);
    }

    function handleFolderTreeDragOver(event) {
        const node = event.target.closest('.folder-node');
        const activePayload = getActiveFolderDropPayload(event);
        if (!activePayload || !node || node.dataset.acceptDrop !== 'true') {
            clearFolderDropTargets();
            clearTimeout(state.dragExpandTimer);
            state.dragExpandTimer = null;
            return;
        }

        event.preventDefault();
        if (event.dataTransfer) {
            event.dataTransfer.dropEffect = activePayload.type === 'native-history' ? 'copy' : 'move';
        }

        if (state.activeDropFolderId !== node.dataset.folderId) {
            setActiveFolderDropTarget(node);
        }
    }

    function handleFolderTreeDragLeave(event) {
        const node = event.target.closest('.folder-node');
        if (!node || state.activeDropFolderId !== node.dataset.folderId) {
            return;
        }

        const nextEl = document.elementFromPoint(event.clientX, event.clientY);
        const nextNode = nextEl?.closest ? nextEl.closest('.folder-node') : null;
        if (nextNode === node) {
            return;
        }

        node.classList.remove('drop-target', 'drag-hover');
        state.activeDropFolderId = null;
    }

    function handleFolderTreeDrop(event) {
        const node = event.target.closest('.folder-node');
        const activePayload = getActiveFolderDropPayload(event);
        if (!activePayload || !node || node.dataset.acceptDrop !== 'true') {
            return;
        }

        event.preventDefault();
        const targetFolderId = node.dataset.folderId || null;
        clearLibraryDragState();
        if (activePayload.type === 'saved-conversation') {
            const savedId = event.dataTransfer?.getData('application/x-lmnav-saved-id')
                || event.dataTransfer?.getData('text/plain')
                || activePayload.savedId;
            moveSavedConversation(savedId, targetFolderId);
            return;
        }

        saveNativeHistoryConversation(activePayload, targetFolderId);
    }

    function startFolderRename(folderId) {
        if (!isRealFolderId(folderId)) {
            return;
        }

        const folder = getFolderById(folderId);
        if (!folder) {
            return;
        }

        closeFolderContextMenu();
        beginFolderEdit(folderId, 'rename', {
            originalName: folder.name,
            fallbackFolderId: state.currentLibraryFolderId,
            parentId: folder.parentId
        });
        renderLibrary();
    }

    async function commitFolderRename(folderId, rawName) {
        const session = getFolderEditSession(folderId);
        if (!session || state.renamingFolderId !== folderId) {
            return;
        }

        const folder = getFolderById(folderId);
        const name = String(rawName || '').replace(/\s+/g, ' ').trim();
        let toastMessage = '';
        let toastIsError = false;

        try {
            if (!folder) {
                toastMessage = '未找到要编辑的文件夹。';
                toastIsError = true;
                return;
            }

            if (!name) {
                if (session.mode === 'create') {
                    discardCreatedFolder(session);
                    toastMessage = '已取消新建文件夹。';
                } else {
                    toastMessage = '文件夹名称不能为空，已恢复原名称。';
                    toastIsError = true;
                }
                return;
            }

            const duplicateFolder = findFolderByNameAndParent(name, folder.parentId);
            if (duplicateFolder && duplicateFolder.id !== folder.id) {
                if (session.mode === 'create') {
                    discardCreatedFolder(session);
                    toastMessage = '同级目录下已存在同名文件夹，已取消创建。';
                } else {
                    toastMessage = '同级目录下已存在同名文件夹，已恢复原名称。';
                }
                toastIsError = true;
                return;
            }

            if (name === folder.name) {
                toastMessage = session.mode === 'create' ? '文件夹已创建。' : '';
                return;
            }

            folder.name = name;
            folder.updatedAt = Date.now();
            syncFolderChildren();
            state.savedConversations.forEach(syncConversationFolder);
            state.lastSaveFolder = isRealFolderId(state.currentLibraryFolderId) ? buildFolderPath(state.currentLibraryFolderId) : state.lastSaveFolder;
            updateSaveFolderInputValue(isRealFolderId(state.currentLibraryFolderId) ? buildFolderPath(state.currentLibraryFolderId) : state.lastSaveFolder);
            toastMessage = session.mode === 'create' ? '文件夹已创建。' : '文件夹已重命名。';
        } catch (error) {
            console.error('[LMNAV] Folder edit failed', error);
            if (session.mode === 'create') {
                discardCreatedFolder(session);
            }
            toastMessage = '文件夹保存失败，已恢复。';
            toastIsError = true;
        } finally {
            clearFolderEditState();
            try {
                await persistLibraryState();
            } catch (persistError) {
                console.error('[LMNAV] Persist folder edit failed', persistError);
                toastMessage = '文件夹保存失败，未能写入本地存储。';
                toastIsError = true;
            }
            renderLibrary();
            if (toastMessage) {
                showToast(toastMessage, toastIsError);
            }
        }
    }

    async function toggleFolderPinned(folderId) {
        const folder = getFolderById(folderId);
        if (!folder) {
            return;
        }

        folder.isPinned = !folder.isPinned;
        folder.updatedAt = Date.now();
        syncFolderChildren();
        closeFolderContextMenu();
        await persistLibraryState();
        renderLibrary();
    }

    function toggleFolderColorPicker(folderId) {
        state.activeFolderColorPickerId = state.activeFolderColorPickerId === folderId ? null : folderId;
        renderFloatingFolderMenu();
    }

    async function applyFolderColor(folderId, color) {
        const folder = getFolderById(folderId);
        if (!folder || !/^#[0-9a-f]{6}$/i.test(color)) {
            return;
        }

        folder.color = color;
        folder.updatedAt = Date.now();
        state.activeFolderColorPickerId = null;
        await persistLibraryState();
        renderLibrary();
    }

    async function createSubfolder(folderId) {
        const parent = getFolderById(folderId);
        if (!parent) {
            return;
        }

        const baseName = '新建子文件夹';
        let nextName = baseName;
        let suffix = 2;
        while (findFolderByNameAndParent(nextName, parent.id)) {
            nextName = baseName + ' ' + String(suffix);
            suffix += 1;
        }

        const folder = createFolderRecord({
            name: nextName,
            parentId: parent.id,
            color: parent.color || DEFAULT_FOLDER_COLOR
        });
        state.savedFolders.push(folder);
        parent.children = Array.isArray(parent.children) ? parent.children.concat(folder.id) : [ folder.id ];
        expandFolderAncestors(parent.id);
        state.currentLibraryFolderId = folder.id;
        state.lastSaveFolder = buildFolderPath(folder.id);
        updateSaveFolderInputValue(state.lastSaveFolder);
        beginFolderEdit(folder.id, 'create', {
            originalName: folder.name,
            fallbackFolderId: parent.id,
            parentId: parent.id
        });
        closeFolderContextMenu();
        syncFolderChildren();
        await persistLibraryState();
        renderLibrary();
    }

    function applyFolderDeletionInMemory(folderId) {
        const folder = getFolderById(folderId);
        if (!folder) {
            return null;
        }

        state.savedFolders.forEach((entry) => {
            if (entry.parentId === folder.id) {
                entry.parentId = folder.parentId || null;
                entry.updatedAt = Date.now();
            }
        });

        state.savedConversations.forEach((entry) => {
            if (entry.folderId === folder.id) {
                entry.folderId = null;
            }
            syncConversationFolder(entry);
        });

        state.savedFolders = state.savedFolders.filter((entry) => entry.id !== folder.id);
        state.collapsedFolderIds = state.collapsedFolderIds.filter((candidateId) => candidateId !== folder.id);
        if (state.currentLibraryFolderId === folder.id) {
            state.currentLibraryFolderId = LIBRARY_INBOX_ID;
        }

        state.lastSaveFolder = isRealFolderId(state.currentLibraryFolderId) ? buildFolderPath(state.currentLibraryFolderId) : '';
        updateSaveFolderInputValue(state.lastSaveFolder);
        closeFolderContextMenu();
        clearFolderEditState();
        syncFolderChildren();
        renderLibrary();
        renderTools();

        return folder;
    }

    async function deleteFolderById(folderId) {
        const folder = getFolderById(folderId);
        if (!folder) {
            return;
        }

        const folderLabel = buildFolderPath(folder.id) || folder.name;
        const snapshot = createLibraryStateSnapshot();
        if (!applyFolderDeletionInMemory(folderId)) {
            return;
        }

        showToast(
            '已删除文件夹“' + folderLabel + '”',
            () => {
                restoreLibraryStateSnapshot(snapshot);
                persistLibraryState().catch((error) => {
                    console.error(error);
                    showToast('撤销删除失败。', true);
                });
            },
            {
                onExpire: () => persistLibraryState(),
                actionText: '撤销'
            },
        );
    }

    function handleFolderMenuAction(folderId, action) {
        if (!folderId || !action) {
            return;
        }

        if (action === 'rename') {
            startFolderRename(folderId);
            return;
        }

        if (action === 'toggle-pin') {
            toggleFolderPinned(folderId);
            return;
        }

        if (action === 'create-child') {
            createSubfolder(folderId);
            return;
        }

        if (action === 'toggle-color') {
            toggleFolderColorPicker(folderId);
            return;
        }

        if (action === 'delete') {
            deleteFolderById(folderId);
        }
    }

    async function saveNativeHistoryConversation(payload, nextFolderId) {
        const normalizedPayload = payload?.type === 'native-history'
            ? payload
            : parseNativeHistoryDragPayload(JSON.stringify(payload || null));
        if (!normalizedPayload) {
            showToast('无法识别拖拽的历史会话。', true);
            return;
        }

        const rawTargetFolderId = typeof nextFolderId === 'string' && nextFolderId ? nextFolderId : null;
        const normalizedFolderId = getDropAssignmentFolderId(rawTargetFolderId);
        const existingIndex = findSavedConversationIndexByUrl(normalizedPayload.url);

        if (existingIndex >= 0) {
            const entry = state.savedConversations[existingIndex];
            if ((entry.folderId || null) === normalizedFolderId) {
                showToast('该会话已经在目标文件夹中。');
                return;
            }

            state.savedConversations.splice(existingIndex, 1);
            entry.title = normalizedPayload.title || entry.title;
            entry.url = normalizedPayload.url;
            entry.conversationKey = normalizedPayload.conversationKey || entry.conversationKey;
            entry.source = Array.isArray(entry.turns) && entry.turns.length ? (entry.source || 'snapshot') : 'native-history';
            entry.summary = entry.summary || normalizedPayload.title;
            entry.savedAt = Date.now();
            entry.folderId = normalizedFolderId;

            if (rawTargetFolderId === LIBRARY_ALL_ID) {
                state.currentLibraryFolderId = LIBRARY_ALL_ID;
            } else if (entry.folderId) {
                expandFolderAncestors(entry.folderId);
                state.currentLibraryFolderId = entry.folderId;
            } else {
                state.currentLibraryFolderId = LIBRARY_INBOX_ID;
            }

            syncConversationFolder(entry);
            state.lastSaveFolder = entry.folder;
            document.getElementById('save-folder-input').value = entry.folder;
            state.savedConversations.unshift(entry);
            await persistLibraryState();
            renderLibrary();
            renderTools();
            showToast('已将原生历史会话移动到' + getDropTargetLabel(rawTargetFolderId || normalizedFolderId) + '。');
            return;
        }

        const entry = normalizeSavedConversation({
            id: normalizedPayload.id,
            title: normalizedPayload.title,
            url: normalizedPayload.url,
            folderId: normalizedFolderId,
            folder: normalizedFolderId ? buildFolderPath(normalizedFolderId) : '',
            summary: normalizedPayload.title,
            turns: [],
            savedAt: Date.now(),
            conversationKey: normalizedPayload.conversationKey,
            source: 'native-history'
        });
        if (!entry) {
            showToast('保存原生历史会话失败。', true);
            return;
        }

        state.savedConversations.unshift(entry);
        if (entry.folderId) {
            expandFolderAncestors(entry.folderId);
            state.currentLibraryFolderId = entry.folderId;
        } else {
            state.currentLibraryFolderId = LIBRARY_INBOX_ID;
        }
        syncConversationFolder(entry);
        state.lastSaveFolder = entry.folder;
        document.getElementById('save-folder-input').value = entry.folder;
        await persistLibraryState();
        renderLibrary();
        renderTools();
        showToast('已将原生历史会话添加到' + getDropTargetLabel(rawTargetFolderId || normalizedFolderId) + '。');
    }

    async function moveSavedConversation(savedId, nextFolderId) {
        const entry = state.savedConversations.find((saved) => saved.id === savedId);
        if (!entry) {
            return;
        }

        const rawTargetFolderId = typeof nextFolderId === 'string' && nextFolderId ? nextFolderId : null;
        const normalizedFolderId = getDropAssignmentFolderId(rawTargetFolderId);
        if ((entry.folderId || null) === normalizedFolderId) {
            showToast('该会话已经在目标文件夹中。');
            return;
        }

        entry.folderId = normalizedFolderId;
        if (rawTargetFolderId === LIBRARY_ALL_ID) {
            state.currentLibraryFolderId = LIBRARY_ALL_ID;
        } else if (entry.folderId) {
            expandFolderAncestors(entry.folderId);
            state.currentLibraryFolderId = entry.folderId;
        } else {
            state.currentLibraryFolderId = LIBRARY_INBOX_ID;
        }
        syncConversationFolder(entry);
        state.lastSaveFolder = entry.folder;
        document.getElementById('save-folder-input').value = entry.folder;
        await persistLibraryState();
        renderLibrary();
        showToast('会话已移动到' + getDropTargetLabel(rawTargetFolderId || normalizedFolderId) + '。');
    }

    async function createFolderFromCurrentView() {
        const parentId = isRealFolderId(state.currentLibraryFolderId) ? state.currentLibraryFolderId : null;
        const suggestedName = parentId
            ? '新建子文件夹'
            : (splitFolderPath(state.suggestedFolderPath || state.lastSaveFolder).slice(-1)[0] || '新建文件夹');
        const folder = createFolderRecord({
            name: suggestedName,
            parentId: parentId
        });

        if (findFolderByNameAndParent(folder.name, parentId)) {
            folder.name = folder.name + ' ' + String(state.savedFolders.length + 1);
        }

        state.savedFolders.push(folder);
        expandFolderAncestors(folder.id);
        state.currentLibraryFolderId = folder.id;
        state.lastSaveFolder = buildFolderPath(folder.id);
        updateSaveFolderInputValue(state.lastSaveFolder);
        beginFolderEdit(folder.id, 'create', {
            originalName: folder.name,
            fallbackFolderId: parentId || LIBRARY_ALL_ID,
            parentId: parentId
        });
        syncFolderChildren();
        await persistLibraryState();
        renderLibrary();
        showToast('文件夹已创建。');
    }

    async function renameCurrentFolder() {
        if (!isRealFolderId(state.currentLibraryFolderId)) {
            showToast('请先选择一个真实文件夹。', true);
            return;
        }
        startFolderRename(state.currentLibraryFolderId);
    }

    async function deleteCurrentFolder() {
        if (!isRealFolderId(state.currentLibraryFolderId)) {
            showToast('请先选择一个真实文件夹。', true);
            return;
        }
        await deleteFolderById(state.currentLibraryFolderId);
    }

    function insertCompressionPrompt() {
        const success = arena.fillInput(core.COMPRESSION_PROMPT);
        if (!success) {
            core.copyText(core.COMPRESSION_PROMPT).then(() => showToast('没有找到输入框，已复制压缩提示词。', true));
            return;
        }

        const button = document.getElementById('btn-context-ring');
        button.style.transform = 'scale(0.94)';
        window.setTimeout(() => {
            button.style.transform = '';
        }, 180);
        showToast('压缩提示词已插入。');
    }

    function normalizeToastOptions(onUndoOrOptions, optionsOrIsError) {
        const config = {
            duration: 4000,
            isError: false,
            actionText: '撤销',
            onUndo: null,
            onExpire: null
        };

        if (typeof onUndoOrOptions === 'function') {
            config.onUndo = onUndoOrOptions;
            if (typeof optionsOrIsError === 'boolean') {
                config.isError = optionsOrIsError;
            } else if (optionsOrIsError && typeof optionsOrIsError === 'object') {
                Object.assign(config, optionsOrIsError);
            }
            return config;
        }

        if (typeof onUndoOrOptions === 'boolean') {
            config.isError = onUndoOrOptions;
            if (optionsOrIsError && typeof optionsOrIsError === 'object') {
                Object.assign(config, optionsOrIsError);
            }
            return config;
        }

        if (onUndoOrOptions && typeof onUndoOrOptions === 'object') {
            Object.assign(config, onUndoOrOptions);
        }

        return config;
    }

    function runToastExpireCallback(callback) {
        if (typeof callback !== 'function') {
            return;
        }

        Promise.resolve(callback()).catch((error) => {
            console.error(error);
        });
    }

    function hideToast(options) {
        if (!state.toastEl) {
            return;
        }

        const config = options && typeof options === 'object' ? options : {};
        const expireCallback = config.executeExpire ? state.toastExpireCallback : null;

        clearTimeout(state.toastTimer);
        state.toastTimer = null;
        state.toastUndoCallback = null;
        state.toastExpireCallback = null;

        state.toastEl.classList.remove('visible', 'error', 'has-action');
        if (state.toastTextEl) {
            state.toastTextEl.textContent = '';
        }
        if (state.toastUndoButtonEl) {
            state.toastUndoButtonEl.hidden = true;
            state.toastUndoButtonEl.textContent = '撤销';
        }

        runToastExpireCallback(expireCallback);
    }

    function showToast(message, onUndoOrOptions, optionsOrIsError) {
        if (!state.toastEl || !state.toastTextEl || !message) {
            return;
        }

        if (state.toastTimer || state.toastUndoCallback || state.toastExpireCallback) {
            hideToast({ executeExpire: true });
        }

        const config = normalizeToastOptions(onUndoOrOptions, optionsOrIsError);
        state.toastTextEl.textContent = message;
        state.toastUndoCallback = typeof config.onUndo === 'function' ? config.onUndo : null;
        state.toastExpireCallback = typeof config.onExpire === 'function' ? config.onExpire : null;
        state.toastEl.classList.toggle('error', Boolean(config.isError));
        state.toastEl.classList.toggle('has-action', Boolean(state.toastUndoCallback));
        if (state.toastUndoButtonEl) {
            state.toastUndoButtonEl.hidden = !state.toastUndoCallback;
            state.toastUndoButtonEl.textContent = config.actionText || '撤销';
        }
        state.toastEl.classList.add('visible');

        clearTimeout(state.toastTimer);
        state.toastTimer = window.setTimeout(() => {
            hideToast({ executeExpire: true });
        }, Math.max(800, Number(config.duration) || 4000));
    }

    function debugChatDOMStructure() {
        const messageSelectors = [
            '[data-role]',
            '[data-message-author]',
            '[data-author]',
            '.message',
            '.conversation-item',
            '.chat-message',
            '[class*="user-message"]',
            '[class*="assistant-message"]',
            '[class*="bot-message"]',
            '.justify-end',
            '.justify-start',
            '.prose',
            '[class*="prose"]',
            '[class*="markdown"]'
        ].join(', ');

        const roleSelectors = [
            '[data-role]',
            '[data-message-author]',
            '[data-author]',
            '[class*="user-message"]',
            '[class*="assistant-message"]',
            '[class*="bot-message"]',
            '.message',
            '.conversation-item',
            '.chat-message',
            '.justify-end',
            '.justify-start'
        ].join(', ');

        const normalizeRole = (value) => {
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
        };

        const detectRole = (node) => {
            if (!(node instanceof HTMLElement)) {
                return null;
            }

            const host = node.closest(roleSelectors) || node;
            const roleCandidates = [
                host?.dataset?.role,
                host?.dataset?.messageAuthor,
                host?.dataset?.author,
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

            const className = String(host?.className || node.className || '').toLowerCase();
            if (className.includes('user-message')) {
                return 'user';
            }

            if (className.includes('assistant-message') || className.includes('bot-message')) {
                return 'assistant';
            }

            if (host?.matches?.('.justify-end') || node.closest('.justify-end')) {
                return 'user';
            }

            if (host?.matches?.('.justify-start') || node.closest('.justify-start')) {
                return 'assistant';
            }

            return null;
        };

        const isDebugExcluded = (node) => Boolean(
            node &&
            node.closest &&
            node.closest(FLOATING_UI_SELECTOR),
        );

        const rawNodes = Array.from(document.querySelectorAll(messageSelectors));
        const seenBlocks = new Set();
        const messageBlocks = [];

        rawNodes.forEach((node) => {
            if (!(node instanceof HTMLElement) || !node.isConnected || isDebugExcluded(node)) {
                return;
            }

            const block = node.closest(roleSelectors) || node;
            if (!(block instanceof HTMLElement) || seenBlocks.has(block) || isDebugExcluded(block)) {
                return;
            }

            const text = String(block.innerText || block.textContent || '').replace(/\s+/g, ' ').trim();
            if (!text) {
                return;
            }

            seenBlocks.add(block);
            messageBlocks.push(block);
        });

        const containerScores = new Map();
        messageBlocks.forEach((block) => {
            let current = block.parentElement;
            let depth = 0;

            while (current && current !== document.body && depth < 8) {
                if (!isDebugExcluded(current)) {
                    const entry = containerScores.get(current) || { score: 0, count: 0 };
                    entry.score += Math.max(10 - depth, 1);
                    entry.count += 1;
                    containerScores.set(current, entry);
                }
                current = current.parentElement;
                depth += 1;
            }
        });

        const mainContainer = Array.from(containerScores.entries())
            .map(([ element, data ]) => ({
                element: element,
                score: data.score + Math.min(data.count, 12) * 8
            }))
            .sort((left, right) => right.score - left.score)[0]?.element || null;

        const sortedBlocks = messageBlocks.sort((left, right) =>
            (window.scrollY + left.getBoundingClientRect().top) -
            (window.scrollY + right.getBoundingClientRect().top),
        );

        const userNode = sortedBlocks.find((node) => detectRole(node) === 'user') || null;
        const aiNode = sortedBlocks.find((node) => detectRole(node) === 'assistant') || null;

        const formatNodeLabel = (node) => {
            if (!(node instanceof HTMLElement)) {
                return '';
            }

            const tag = node.tagName.toUpperCase();
            const classNames = String(node.className || '')
                .split(/\s+/)
                .map((name) => name.trim())
                .filter(Boolean)
                .slice(0, 4)
                .join('.');
            const classPart = classNames ? '.' + classNames : '';
            const rolePart = node.dataset?.role
                ? '[data-role="' + node.dataset.role + '"]'
                : (node.dataset?.messageAuthor
                    ? '[data-message-author="' + node.dataset.messageAuthor + '"]'
                    : (node.dataset?.author ? '[data-author="' + node.dataset.author + '"]' : ''));
            return tag + classPart + rolePart;
        };

        const generateTreeString = (node, depth, maxDepth) => {
            if (!(node instanceof HTMLElement)) {
                return '';
            }

            const level = typeof depth === 'number' ? depth : 0;
            const limit = typeof maxDepth === 'number' ? maxDepth : 5;
            const indent = '  '.repeat(level);
            const lines = [ indent + formatNodeLabel(node) ];

            if (level >= limit) {
                if (node.children.length) {
                    lines.push(indent + '  ...');
                }
                return lines.join('\n');
            }

            const children = Array.from(node.children || []);
            children.slice(0, 16).forEach((child) => {
                const childTree = generateTreeString(child, level + 1, limit);
                if (childTree) {
                    lines.push(childTree);
                }
            });

            if (children.length > 16) {
                lines.push(indent + '  ...(省略 ' + (children.length - 16) + ' 个子节点)');
            }

            return lines.join('\n');
        };

        console.log('🟡 [DEBUG] 命中的消息块数量:', sortedBlocks.length);
        console.log('🟡 [DEBUG] 推测的主对话容器:', mainContainer);
        console.log('🟢 [DEBUG] 用户的完整 HTML 源码:', userNode ? userNode.outerHTML : '未找到用户消息节点');
        console.log('🔵 [DEBUG] AI 的完整 HTML 源码:', aiNode ? aiNode.outerHTML : '未找到 AI 消息节点');
        console.log('🟢 [DEBUG] 用户的 DOM 树层级:\n' + (userNode ? generateTreeString(userNode) : '未找到用户消息节点'));
        console.log('🔵 [DEBUG] AI 的 DOM 树层级:\n' + (aiNode ? generateTreeString(aiNode) : '未找到 AI 消息节点'));

        return {
            mainContainer: mainContainer,
            userNode: userNode,
            aiNode: aiNode,
            messageBlocks: sortedBlocks,
            generateTreeString: generateTreeString
        };
    }

    function installObservers() {
        const refresh = core.debounce(() => refreshConversation(false), 360);
        const observer = new MutationObserver((mutations) => {
            const shouldRefresh = mutations.some((mutation) => {
                const target = mutation.target;
                if (!target || !target.closest) {
                    return true;
                }
                return !target.closest('#lmarena-map-sidebar') &&
                    !target.closest('#lmarena-hover-tooltip') &&
                    !target.closest('#lmnav-toast');
            });

            if (shouldRefresh) {
                decorateNativeHistoryItemsDraggable();
                refresh();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });

        state.cleanupFns.push(() => observer.disconnect());
    }

    function installRouteWatcher() {
        const handleUrlChange = () => {
            if (location.href === state.currentUrl) {
                return;
            }
            state.currentUrl = location.href;
            state.lastSignature = '';
            window.setTimeout(() => refreshConversation(true), 420);
        };

        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function() {
            const result = originalPushState.apply(this, arguments);
            handleUrlChange();
            return result;
        };

        history.replaceState = function() {
            const result = originalReplaceState.apply(this, arguments);
            handleUrlChange();
            return result;
        };

        window.addEventListener('popstate', handleUrlChange);
        window.addEventListener('hashchange', handleUrlChange);
        const intervalId = window.setInterval(handleUrlChange, 1000);

        state.cleanupFns.push(() => {
            history.pushState = originalPushState;
            history.replaceState = originalReplaceState;
            window.removeEventListener('popstate', handleUrlChange);
            window.removeEventListener('hashchange', handleUrlChange);
            clearInterval(intervalId);
        });
    }

    function teardown() {
        cleanupEmbeddedHostStateObserver();
        state.cleanupFns.forEach((cleanup) => {
            try {
                cleanup();
            } catch (error) {
                console.error(error);
            }
        });
        state.cleanupFns = [];
    }

    async function init() {
        await loadState();
        await persistLibraryState();
        createUI();
        installObservers();
        installRouteWatcher();
        refreshConversation(true);
        root.debugChatDOMStructure = debugChatDOMStructure;
        const debugTimerId = window.setTimeout(() => {
            try {
                debugChatDOMStructure();
            } catch (error) {
                console.error('🔴 [DEBUG] 打印聊天 DOM 结构失败：', error);
            }
        }, 3000);
        state.cleanupFns.push(() => window.clearTimeout(debugTimerId));
        console.log('[LMArena Navigator] Enhanced sidebar loaded.');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }

    window.addEventListener('beforeunload', teardown, { once: true });
})();
