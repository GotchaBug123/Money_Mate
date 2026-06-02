/* ============================================================
   my-asset.js
   my-asset.html 에서 분리한 스크립트
   API: DELETE /api/holding/{holdingId}
        DELETE /api/watchlist/{watchlistId}
   ============================================================ */

/* 장바구니 항목 삭제 */
async function removeCart(cartId) {
    if (!confirm('장바구니에서 삭제하시겠습니까?')) return;
    try {
        const res = await fetch('/api/holding/' + cartId, { method: 'DELETE' });
        if (res.ok) {
            const row = document.getElementById('cart-row-' + cartId);
            if (row) row.remove();
            checkEmptyCart();
            showToast('장바구니에서 삭제되었습니다.');
        } else {
            showToast('삭제에 실패했습니다.', 'error');
        }
    } catch (e) {
        showToast('네트워크 오류가 발생했습니다.', 'error');
    }
}

/* 관심 종목 삭제 */
async function removeWatch(watchlistId) {
    if (!confirm('관심 종목에서 삭제하시겠습니까?')) return;
    try {
        const res = await fetch('/api/watchlist/' + watchlistId, { method: 'DELETE' });
        if (res.ok) {
            const row = document.getElementById('watch-row-' + watchlistId);
            if (row) row.remove();
            checkEmptyWatch();
            showToast('관심 종목에서 삭제되었습니다.');
        } else {
            showToast('삭제에 실패했습니다.', 'error');
        }
    } catch (e) {
        showToast('네트워크 오류가 발생했습니다.', 'error');
    }
}

/* tbody 비었으면 빈 메시지 표시 */
function checkEmptyCart() {
    const tbody = document.getElementById('cartTbody');
    if (tbody && tbody.querySelectorAll('tr').length === 0) {
        tbody.closest('.cart-asset-table-wrap').innerHTML =
            '<p style="padding:24px;color:#6b7280;text-align:center;">장바구니가 비었습니다.</p>';
    }
}

function checkEmptyWatch() {
    const tbody = document.getElementById('interestTbody');
    if (tbody && tbody.querySelectorAll('tr').length === 0) {
        tbody.closest('.cart-asset-table-wrap').innerHTML =
            '<p style="padding:24px;color:#6b7280;text-align:center;">관심 종목이 없습니다.</p>';
    }
}

/* 토스트 알림 */
function showToast(msg, type) {
    let t = document.getElementById('ma-toast');
    if (!t) {
        t = document.createElement('div');
        t.id = 'ma-toast';
        t.style.cssText = 'position:fixed;bottom:28px;left:50%;transform:translateX(-50%);' +
            'padding:12px 28px;border-radius:8px;font-size:14px;font-weight:600;' +
            'color:#fff;z-index:9999;opacity:0;transition:opacity .25s;white-space:nowrap;';
        document.body.appendChild(t);
    }
    t.style.background = type === 'error' ? '#ef4444' : '#1e293b';
    t.textContent = msg;
    t.style.opacity = '1';
    clearTimeout(t._t);
    t._t = setTimeout(() => { t.style.opacity = '0'; }, 2200);
}