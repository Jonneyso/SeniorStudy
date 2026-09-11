// 无障碍工具函数（纯行为，不改变视觉样式）
// 统一为各组件的可点击非 button 元素提供键盘支持与 ARIA 属性

const A11y = (() => {
    // 生成稳定唯一 id（用于 aria-controls）
    let _counter = 0;
    function genId(prefix) {
        _counter += 1;
        return `${prefix}-${Date.now().toString(36)}-${_counter}`;
    }

    /**
     * 把一个可点击但非 <button> 的元素当作按钮使用（折叠/展开）
     * @param {HTMLElement} triggerEl  触发元素
     * @param {HTMLElement} panelEl    被控制的面板
     * @param {Function} [onToggle]    折叠/展开切换时额外回调(show:boolean)
     */
    function bindToggle(triggerEl, panelEl, onToggle) {
        if (!triggerEl || !panelEl) return;

        if (!panelEl.id) {
            panelEl.id = genId('a11y-panel');
        }
        triggerEl.setAttribute('role', 'button');
        triggerEl.setAttribute('tabindex', '0');
        triggerEl.setAttribute('aria-controls', panelEl.id);

        const hasShow = panelEl.classList.contains('show');
        triggerEl.setAttribute('aria-expanded', hasShow ? 'true' : 'false');

        const toggle = (e) => {
            if (e) e.preventDefault();
            const willShow = !panelEl.classList.contains('show');
            panelEl.classList.toggle('show', willShow);
            triggerEl.setAttribute('aria-expanded', willShow ? 'true' : 'false');
            if (typeof onToggle === 'function') onToggle(willShow);
        };

        triggerEl.addEventListener('click', toggle);
        triggerEl.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ' || e.code === 'Space') {
                toggle(e);
            }
        });
    }

    /**
     * 给「点击后打开模态框」的元素绑定键盘支持
     * @param {HTMLElement} triggerEl  触发元素
     * @param {Function} openFn         打开模态框的回调
     */
    function bindOpenDialog(triggerEl, openFn) {
        if (!triggerEl) return;
        triggerEl.setAttribute('role', 'button');
        triggerEl.setAttribute('tabindex', '0');
        triggerEl.setAttribute('aria-haspopup', 'dialog');

        const open = (e) => {
            if (e) e.preventDefault();
            openFn();
        };

        triggerEl.addEventListener('click', open);
        triggerEl.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ' || e.code === 'Space') {
                open(e);
            }
        });
    }

    /**
     * 模态框焦点陷阱：打开模态框后把 Tab/Shift+Tab 限制在模态框内
     * @param {HTMLElement} modalEl  模态框根元素（应带 role=dialog）
     * @returns {Function} 取消陷阱的清理函数
     */
    function trapFocus(modalEl) {
        if (!modalEl) return () => {};

        const focusableSelector = [
            'a[href]',
            'button:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            '[tabindex]:not([tabindex="-1"])',
        ].join(',');

        const handler = (e) => {
            if (e.key !== 'Tab') return;
            const focusable = Array.from(modalEl.querySelectorAll(focusableSelector))
                .filter((el) => el.offsetParent !== null || el === document.activeElement);
            if (focusable.length === 0) {
                e.preventDefault();
                return;
            }
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey) {
                if (document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                if (document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };

        modalEl.addEventListener('keydown', handler);
        return () => modalEl.removeEventListener('keydown', handler);
    }

    return { bindToggle, bindOpenDialog, trapFocus };
})();
