// =====================================================
// 투자정보 페이지 전용 JavaScript — MoneyMate
// 수정 내역:
//   1-1. 검색 기능 → 실시간(keyup) + 버튼 둘 다 동작
//   1-1. 팝업 시스템 → 장바구니/관심 클릭 시 토스트 팝업 + API 저장
//   1-2. 정렬 기능 → 거래대금/거래량 각각 "많은순(내림차순)"/"최신순(price_date)" 토글
// =====================================================

// ─────────────────────────────────────────────────────
// 0. 토스트 팝업 (alert 대신 사용)
// ─────────────────────────────────────────────────────
function showToast(msg) {
  let toast = document.getElementById('mm-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'mm-toast';
    toast.style.cssText = [
      'position:fixed', 'bottom:32px', 'left:50%', 'transform:translateX(-50%)',
      'background:#1e293b', 'color:#fff', 'padding:12px 28px',
      'border-radius:8px', 'font-size:14px', 'font-weight:600',
      'z-index:99999', 'opacity:0',
      'transition:opacity 0.25s', 'pointer-events:none',
      'white-space:nowrap', 'box-shadow:0 4px 16px rgba(0,0,0,0.18)'
    ].join(';');
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => { toast.style.opacity = '0'; }, 2000);
}

// ─────────────────────────────────────────────────────
// 1. 장바구니 담기 (API 저장 + 팝업)
// ─────────────────────────────────────────────────────
async function addToCart(btn) {
  const assetName = btn.dataset.assetName;
  const price     = btn.dataset.closePrice;
  const curr      = btn.dataset.currency;

  // tr에 있는 data-ticker, data-market 읽기
  const tr     = btn.closest('tr');
  const ticker = tr ? tr.dataset.ticker : null;
  const market = tr ? tr.dataset.market : null;

  if (!ticker) {
    console.error('ticker가 올바르지 않습니다:', ticker);
    showToast('종목 정보가 올바르지 않습니다.');
    return;
  }

  try {
    const res = await fetch('/api/holding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ticker:    ticker,
        assetName: assetName,
        market:    market,
        buyPrice:  price ? Number(price) : 0
      })
    });

    if (res.ok) {
      btn.style.color = '#155eef';

      showToast('장바구니에 담겼습니다.');

      if (!cartList.find(x => x.id === ticker)) {
        cartList.push({
          id: ticker,
          name: assetName,
          price,
          curr,
          qty: 1
        });
      }

      renderCart();
      return;
    }

    const errorText = await res.text();

    console.error('장바구니 저장 실패 상태코드:', res.status);
    console.error('장바구니 저장 실패 응답:', errorText);
    console.error('전송한 ticker:', ticker);

    if (res.status === 401) {
      showToast('로그인이 필요합니다.');
    } else {
      showToast('담기에 실패했습니다. 다시 확인해주세요..');
    }

  } catch (e) {
    console.error('장바구니 오류:', e);
    showToast('네트워크 오류가 발생했습니다.');
  }
}

// ─────────────────────────────────────────────────────
// 2. 관심 종목 토글 (API 저장 + 팝업)
// ─────────────────────────────────────────────────────
async function toggleWatch(btn) {
  const assetName = btn.dataset.assetName;

  // tr에 있는 data-ticker, data-market 읽기
  const tr     = btn.closest('tr');
  const ticker = tr ? tr.dataset.ticker : null;
  const market = tr ? tr.dataset.market : null;

  try {
    const res = await fetch('/api/watchlist/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ticker:    ticker,
        assetName: assetName,
        market:    market
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.watched) {
        // 추가됨
        btn.textContent = '★';
        btn.classList.add('watch-on');
        showToast('관심등록 되었습니다.');
        if (!watchList.find(x => x.id === ticker)) {
          watchList.push({ id: ticker, name: assetName });
        }
      } else {
        // 해제됨
        btn.textContent = '☆';
        btn.classList.remove('watch-on');
        showToast('관심 해제되었습니다.');
        watchList = watchList.filter(x => x.id !== ticker);
      }
      renderWatch();
    } else if (res.status === 401) {
      showToast('로그인이 필요합니다.');
    } else {
      showToast('처리에 실패했습니다. 다시 시도해주세요.');
    }
  } catch (e) {
    console.error('관심 종목 오류:', e);
    showToast('네트워크 오류가 발생했습니다.');
  }
}

// ─────────────────────────────────────────────────────
// 3. 장바구니 / 관심 모달 렌더링 (로컬 배열 기반 미리보기)
// ─────────────────────────────────────────────────────
let cartList = [], watchList = [];

function renderCart() {
  const el = document.getElementById('cartBody');
  if (!cartList.length) {
    el.innerHTML = '<p class="modal-empty">선택한 종목이 없습니다.</p>';
    return;
  }
  el.innerHTML = cartList.map(i => `
    <div class="modal-item">
      <span class="mi-name">${i.name}</span>
      <span class="mi-price">${i.curr === 'USD' ? '$' : ''}${Number(i.price).toLocaleString()}${i.curr === 'KRW' ? '원' : ''}</span>
      <input class="mi-qty" type="number" value="${i.qty}" min="1" onchange="updateQty('${i.id}',this.value)">
      <button class="mi-del" onclick="removeCart('${i.id}')">✕</button>
    </div>`).join('');
}

function renderWatch() {
  const el = document.getElementById('watchBody');
  if (!watchList.length) {
    el.innerHTML = '<p class="modal-empty">관심 종목이 없습니다.</p>';
    return;
  }
  el.innerHTML = watchList.map(i => `
    <div class="modal-item">
      <span class="mi-name">${i.name}</span>
      <button class="mi-del" onclick="removeWatch('${i.id}')">✕</button>
    </div>`).join('');
}

function updateQty(id, v) {
  const i = cartList.find(x => x.id === id);
  if (i) i.qty = parseInt(v) || 1;
}

function removeCart(id) {
  cartList = cartList.filter(x => x.id !== id);
  renderCart();
}

function removeWatch(id) {
  watchList = watchList.filter(x => x.id !== id);
  document.querySelectorAll('.watch-btn').forEach(b => {
    const tr = b.closest('tr');
    const ticker = tr ? tr.dataset.ticker : null;
    if (ticker === id) {
      b.textContent = '☆';
      b.classList.remove('watch-on');
    }
  });
  renderWatch();
}

function openModal()  { document.getElementById('modal').style.display = 'flex'; }
function closeModal() { document.getElementById('modal').style.display = 'none'; }
function closeModalBg(e) { if (e.target.id === 'modal') closeModal(); }
function alertAction(t) { showToast(t + ' 기능은 준비 중입니다.'); }

// ─────────────────────────────────────────────────────
// 4. 검색 기능 (실시간 keyup + 버튼 클릭 둘 다 동작)
// ─────────────────────────────────────────────────────
function doSearch() {
  const kw = document.getElementById('searchInput').value.trim().toLowerCase();
  document.querySelectorAll('#assetTbody tr').forEach(r => {
    if (!r.dataset.name) return;
    const nameMatch   = r.dataset.name.toLowerCase().includes(kw);
    const tickerMatch = r.dataset.ticker.toLowerCase().includes(kw);
    r.style.display = (nameMatch || tickerMatch) ? '' : 'none';
  });
  reRank();
}

// ─────────────────────────────────────────────────────
// 순위 재계산 (검색/정렬 후 1, 2, 3... 번호 다시 매김)
// ─────────────────────────────────────────────────────
function reRank() {
  let rank = 1;
  document.querySelectorAll('#assetTbody tr[data-name]').forEach(r => {
    if (r.style.display !== 'none') {
      const rankEl = r.querySelector('.td-rank');
      if (rankEl) rankEl.textContent = rank++;
    }
  });
}

// ─────────────────────────────────────────────────────
// 5. 정렬 기능
//    거래대금 클릭 → 버튼은 최신순 표시, 실제 정렬은 거래대금 내림차순
//    거래량 클릭   → 버튼은 최신순 표시, 실제 정렬은 거래량 내림차순
//    같은 버튼 두 번 클릭 → 정렬 취소 (기본 거래대금 많은순 복귀)
// ─────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────
// 5. 정렬 기능
//    거래대금 클릭 → 버튼은 최신순 표시, 실제 정렬은 거래대금 내림차순
//    거래량 클릭   → 버튼은 최신순 표시, 실제 정렬은 거래량 내림차순
//    같은 버튼 두 번 클릭 → 정렬 취소
// ─────────────────────────────────────────────────────
let activeField = null;  // null = 기본 정렬 상태

function getTradingValue(row) {
  const cellText = row.children[6] ? row.children[6].textContent : '';
  const numericText = cellText.replace(/[^\d.-]/g, '');
  const textValue = Number(numericText);
  if (numericText && !Number.isNaN(textValue)) return textValue;
  return parseFloat(row.dataset.tradingValue || 0);
}

function sortToggle(field) {
  const valueBtn = document.getElementById('sortByValue');
  const volBtn   = document.getElementById('sortByVol');
  const tbody    = document.getElementById('assetTbody');
  const rows     = Array.from(tbody.querySelectorAll('tr[data-name]'));

  // 정렬 열 인덱스: 거래대금=6, 거래량=7
  const colIndex = { tradingValue: 6, volume: 7 };

  if (activeField === field) {
    // 같은 버튼 두 번째 클릭 → 정렬 취소
    activeField = null;

    if (valueBtn) {
      valueBtn.classList.remove('on');
      valueBtn.textContent = '거래대금';
    }

    if (volBtn) {
      volBtn.classList.remove('on');
      volBtn.textContent = '거래량';
    }

    // 열 하이라이트 해제
    clearColHighlight();

    // 정렬 취소 시 기본 정렬(거래대금 내림차순)로 복귀
    rows.sort((a, b) =>
        getTradingValue(b) - getTradingValue(a)
    );

  } else {
    // 새 버튼 클릭 → 해당 필드 내림차순 정렬
    activeField = field;

    if (valueBtn) {
      const isValue = field === 'tradingValue';
      valueBtn.classList.toggle('on', isValue);
      valueBtn.textContent = isValue ? '거래대금 최신순' : '거래대금';
    }

    if (volBtn) {
      const isVol = field === 'volume';
      volBtn.classList.toggle('on', isVol);
      volBtn.textContent = isVol ? '거래량 최신순' : '거래량';
    }

    // 열 하이라이트 적용
    applyColHighlight(colIndex[field]);

    // 해당 필드 내림차순
    rows.sort((a, b) =>
        field === 'tradingValue'
            ? getTradingValue(b) - getTradingValue(a)
            : parseFloat(b.dataset[field] || 0) - parseFloat(a.dataset[field] || 0)
    );
  }

  rows.forEach(r => tbody.appendChild(r));
  reRank();
}
/**
 * 테이블 열 하이라이트 적용
 * colIdx: 0-based 열 인덱스 (거래대금=6, 거래량=7)
 */
function applyColHighlight(colIdx) {
  clearColHighlight();
  const table = document.getElementById('assetTable');
  if (!table) return;

  // thead th 하이라이트 + 화살표
  const ths = table.querySelectorAll('thead th');
  if (ths[colIdx]) {
    ths[colIdx].classList.add('col-active');
    // 기존 화살표 제거 후 추가
    if (!ths[colIdx].querySelector('.sort-arrow')) {
      ths[colIdx].innerHTML += '<span class="sort-arrow">▼</span>';
    }
  }

  // tbody td 하이라이트
  table.querySelectorAll('tbody tr').forEach(tr => {
    const tds = tr.querySelectorAll('td');
    if (tds[colIdx]) tds[colIdx].classList.add('col-active');
  });
}

/**
 * 테이블 열 하이라이트 해제
 */
function clearColHighlight() {
  document.querySelectorAll('.col-active').forEach(el => el.classList.remove('col-active'));
  document.querySelectorAll('.sort-arrow').forEach(el => el.remove());
}
let rank = 1;
document.querySelectorAll('#assetTbody tr[data-name]').forEach(r => {
  if (r.style.display !== 'none') {
    r.querySelector('.td-rank').textContent = rank++;
  }
});


// ─────────────────────────────────────────────────────
// 6. 테마 필터 (카드 show/hide + 그리드 모드 전환)
// ─────────────────────────────────────────────────────
function filterTheme(btn, sector) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');

  const grid  = document.getElementById('themeGrid');
  const cards = document.querySelectorAll('.theme-card');

  if (!sector) {
    // 전체 모드: 그리드 복원
    grid.classList.remove('single-mode');
    cards.forEach(c => c.style.display = 'flex');
  } else {
    // 카테고리 클릭 → 해당 카드 single-mode + 모달 바로 오픈
    grid.classList.add('single-mode');
    let targetCard = null;
    cards.forEach(c => {
      if (c.dataset.sector === sector) {
        c.style.display = 'flex';
        targetCard = c;
      } else {
        c.style.display = 'none';
      }
    });
    if (targetCard) openThemeDetail(targetCard);
  }
}

// ─────────────────────────────────────────────────────
// 7. 테마 상세 모달
// ─────────────────────────────────────────────────────
function openThemeDetail(card) {
  const title    = card.querySelector('.theme-card-title').textContent.trim();
  const dotClass = card.querySelector('.theme-dot').className;
  const items    = card.querySelectorAll('.theme-list li:not(.tl-empty)');

  document.getElementById('tdmTitle').textContent = title;
  document.getElementById('tdmDot').className     = dotClass;

  const listEl = document.getElementById('tdmList');
  listEl.innerHTML = '';

  const addAllBtn = document.querySelector('.tdm-add-all-btn');
  const addNowBtn = document.querySelector('.tdm-add-now-btn');

  if (items.length === 0) {
    listEl.innerHTML = '<li class="tl-empty">데이터 없음</li>';
    if (addAllBtn) addAllBtn.disabled = true;
    if (addNowBtn) addNowBtn.disabled = true;
  } else {
    if (addAllBtn) addAllBtn.disabled = false;
    if (addNowBtn) addNowBtn.disabled = false;

    items.forEach((li) => {
      const avatar     = li.querySelector('.tl-avatar');
      const name       = li.querySelector('.tl-name').textContent;
      const price      = li.querySelector('.tl-price').textContent;
      const pctEl      = li.querySelector('.tl-pct');
      const pctText    = pctEl ? pctEl.textContent : '';
      const isUp       = pctEl && pctEl.classList.contains('up');
      const avatarBg   = window.getComputedStyle(avatar).backgroundColor;

      // 원본 li의 data 속성 읽기
      const ticker    = li.dataset.ticker    || '';
      const market    = li.dataset.market    || '';
      const closePrice = li.dataset.closePrice || '0';
      const currency  = li.dataset.currency  || 'KRW';
      const assetName = li.dataset.assetName || name;

      const row = document.createElement('li');
      row.className    = 'tdm-item';
      row.style.cursor = 'pointer';
      // data 속성 복사
      row.dataset.ticker     = ticker;
      row.dataset.market     = market;
      row.dataset.closePrice = closePrice;
      row.dataset.currency   = currency;
      row.dataset.assetName  = assetName;

      row.innerHTML = `
        <label class="tdm-check-label">
          <input type="checkbox" class="tdm-checkbox">
        </label>
        <div class="tl-avatar" style="background:${avatarBg}">${avatar.textContent}</div>
        <div class="tl-info">
          <p class="tl-name">${name}</p>
          <p class="tl-price">${price}</p>
        </div>
        <span class="tl-pct ${isUp ? 'up' : 'down'}">${pctText}</span>
      `;

      // 행 전체 클릭 시 체크박스 토글
      row.addEventListener('click', function(e) {
        if (e.target.type === 'checkbox') return;
        const cb = this.querySelector('.tdm-checkbox');
        if (cb) cb.checked = !cb.checked;
      });

      listEl.appendChild(row);
    });
  }

  document.getElementById('themeDetailModal').style.display = 'flex';
}

// ─────────────────────────────────────────────────────
// 7-2. 담기 함수
// ─────────────────────────────────────────────────────
// [한번에 담기] : 목록의 체크박스를 전체 선택 상태로 전환
function selectAllThemeItems() {
  const checkboxes = document.querySelectorAll('#tdmList .tdm-checkbox');
  checkboxes.forEach(cb => { cb.checked = true; });
}

// [바로 담기] : 체크된 종목을 장바구니(/api/holding)에 저장
async function addThemeItems() {
  const checkedItems = Array.from(
      document.querySelectorAll('#tdmList .tdm-item')
  ).filter(row => row.querySelector('.tdm-checkbox').checked);

  if (checkedItems.length === 0) {
    showToast('담을 종목을 선택해주세요.');
    return;
  }

  let successCount = 0;
  let failCount    = 0;
  const currency   = 'KRW';

  for (const row of checkedItems) {
    const ticker    = row.dataset.ticker;
    const assetName = row.dataset.assetName;
    const market    = row.dataset.market;
    const price     = row.dataset.closePrice || '0';
    const curr      = row.dataset.currency   || currency;
    const buyPrice  = Number(price);

    if (!ticker) { failCount++; continue; }

    try {
      const res = await fetch('/api/holding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker, assetName, market, buyPrice })
      });

      if (res.ok) {
        successCount++;
        // 장바구니 로컬 배열에도 추가 (renderCart 반영)
        if (!cartList.find(x => x.id === ticker)) {
          cartList.push({ id: ticker, name: assetName, price, curr, qty: 1 });
        }
      } else if (res.status === 401) {
        showToast('로그인이 필요합니다.');
        return;
      } else {
        failCount++;
      }
    } catch (e) {
      console.error('담기 오류:', e);
      failCount++;
    }
  }

  if (successCount > 0) {
    renderCart();
  }

  if (successCount > 0 && failCount === 0) {
    showToast('장바구니에 담겼습니다.');
  } else if (successCount > 0 && failCount > 0) {
    showToast(successCount + '개 담겼습니다. (' + failCount + '개 실패)');
  } else {
    showToast('담기에 실패했습니다. 다시 확인해주세요.');
  }
}

// ─────────────────────────────────────────────────────
// 7-3. 필터 바 화살표 스크롤
// ─────────────────────────────────────────────────────
function scrollFilter(dir) {
  const el = document.getElementById('filterSection');
  if (!el) return;
  el.scrollBy({ left: dir * 200, behavior: 'smooth' });
}

function closeThemeDetail() {
  document.getElementById('themeDetailModal').style.display = 'none';
}

function closeThemeDetailBg(e) {
  if (e.target.id === 'themeDetailModal') closeThemeDetail();
}

// ─────────────────────────────────────────────────────
// 8. 초기화 이벤트
// ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    // 실시간 검색 (keyup 즉시 반응)
    searchInput.addEventListener('keyup', doSearch);
    // Enter 키도 동작
    searchInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') doSearch();
    });
  }

  // 페이지 로드 시 기본 정렬: 거래대금 많은순
  (function initSort() {
    const tbody = document.getElementById('assetTbody');
    if (!tbody) return;
    const rows = Array.from(tbody.querySelectorAll('tr[data-name]'));
    rows.sort((a, b) =>
        parseFloat(b.dataset.tradingValue || 0) - parseFloat(a.dataset.tradingValue || 0)
    );
    rows.forEach(r => tbody.appendChild(r));
    reRank();
    // 버튼 초기 상태: 거래대금 많은순 활성화
    const valueBtn = document.getElementById('sortByValue');
    const volBtn   = document.getElementById('sortByVol');
    if (valueBtn) { valueBtn.textContent = '거래대금'; }
    if (volBtn)   { volBtn.textContent = '거래량'; }
  })();

  // 페이지 로드 시 관심 버튼 상태 복원 (★/☆)
  // DB에 저장된 관심 종목이면 ★(노란색), 아니면 ☆(회색)
  (async function initWatchBtns() {
    const btns = document.querySelectorAll('.watch-btn');
    if (!btns.length) return;

    await Promise.all(Array.from(btns).map(async btn => {
      const tr     = btn.closest('tr');
      const ticker = tr ? tr.dataset.ticker : null;
      if (!ticker) return;
      try {
        const res = await fetch('/api/watchlist/check?ticker=' + encodeURIComponent(ticker));
        if (res.ok) {
          const data = await res.json();
          if (data.watched) {
            btn.textContent = '★';
            btn.classList.add('watch-on');
            btn.style.color = '#f59e0b';
          } else {
            btn.textContent = '☆';
            btn.classList.remove('watch-on');
            btn.style.color = '';
          }
        }
      } catch (e) {
        // 네트워크 오류 시 기본값(☆) 유지
      }
    }));
  })();
});
