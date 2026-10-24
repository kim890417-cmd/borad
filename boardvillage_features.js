// ─────────────────────────────────────────────────────────────
//  BOARD VILLAGE 2.0 - COMPANION TOOLS, RULES VIEWER & i18n GLUE
// ─────────────────────────────────────────────────────────────

(function () {
  // ─── 1. RULEBOOK & DISPUTE MODAL ─────────────────────────
  window.openRuleModal = function (gameKey) {
    const modal = document.getElementById('ruleDetailModal');
    if (!modal) return;

    const encyclopedia = window.ENCYCLOPEDIA_DB || {};
    const rule = window.BV_RULES ? window.BV_RULES.getRule(gameKey, encyclopedia) : null;
    if (!rule) return;

    // Header Info
    const titleEl = document.getElementById('ruleModalTitle');
    const playersEl = document.getElementById('ruleModalPlayers');
    const timeEl = document.getElementById('ruleModalTime');
    const diffEl = document.getElementById('ruleModalDiff');

    if (titleEl) titleEl.textContent = rule.title;
    if (playersEl) playersEl.textContent = rule.players;
    if (timeEl) timeEl.textContent = rule.playTime;
    if (diffEl) diffEl.textContent = rule.difficulty;

    // 1. Overview
    const overviewEl = document.getElementById('ruleOverviewText');
    if (overviewEl) overviewEl.textContent = rule.overview;

    // 2. Setup
    const setupEl = document.getElementById('ruleSetupList');
    if (setupEl) {
      setupEl.innerHTML = (rule.setup || []).map(s => `<li>${s}</li>`).join('');
    }

    // 3. Actions / Turn
    const actionsEl = document.getElementById('ruleActionsList');
    if (actionsEl) {
      actionsEl.innerHTML = (rule.actions || []).map(a => `<li>${a}</li>`).join('');
    }

    // 4. Disputes / Error plays
    const disputesEl = document.getElementById('ruleDisputesList');
    if (disputesEl) {
      if (rule.disputes && rule.disputes.length > 0) {
        disputesEl.innerHTML = rule.disputes.map(d => `
          <div class="dispute-card-item" style="background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 12px; padding: 12px; border-left: 4px solid #e17055; margin-bottom: 8px;">
            <div class="dispute-q" style="font-weight: 800; font-size: 0.88rem; color: #d63031; margin-bottom: 6px; display: flex; align-items: flex-start; gap: 6px;">
              <span>🚨</span> <span>Q. ${d.q}</span>
            </div>
            <div class="dispute-a" style="font-size: 0.82rem; color: var(--text-main); line-height: 1.5; background: var(--card-bg); padding: 8px 10px; border-radius: 8px; border: 1px solid var(--border-color);">
              <strong style="color: #6c5ce7;">[공식 판정]</strong> ${d.a}
            </div>
          </div>
        `).join('');
      } else {
        disputesEl.innerHTML = '<p style="color: var(--text-muted); font-size: 0.85rem;">자주 묻는 분쟁 항목이 준비 중입니다. 기본 룰을 준수해 플레이하세요.</p>';
      }
    }

    // 5. Strategy Tips
    const strategyEl = document.getElementById('ruleStrategyList');
    if (strategyEl) {
      strategyEl.innerHTML = (rule.strategy || []).map(st => `<li>${st}</li>`).join('');
    }

    // Web Link Button
    const webBtn = document.getElementById('ruleWebLinkBtn');
    if (webBtn) {
      const url = rule.webSlug && rule.webSlug !== 'encyclopedia'
        ? `https://boardvilage.com/game/${rule.webSlug}/`
        : 'https://boardvilage.com/encyclopedia';
      webBtn.onclick = () => window.open(url, '_blank');
    }

    // Switch to first tab (overview)
    switchRuleModalTab('overview');

    // Show modal
    modal.style.display = 'flex';
  };

  function switchRuleModalTab(tabName) {
    const tabBtns = document.querySelectorAll('.rule-tab-btn');
    const panes = document.querySelectorAll('.rule-tab-pane');

    tabBtns.forEach(btn => {
      if (btn.getAttribute('data-rule-tab') === tabName) {
        btn.classList.add('active');
        btn.style.borderBottomColor = btn.classList.contains('alert-tab') ? '#d63031' : 'var(--primary-color)';
        btn.style.color = btn.classList.contains('alert-tab') ? '#d63031' : 'var(--primary-color)';
      } else {
        btn.classList.remove('active');
        btn.style.borderBottomColor = 'transparent';
        btn.style.color = 'var(--text-muted)';
      }
    });

    panes.forEach(pane => {
      const id = pane.id.toLowerCase();
      if (id.includes(tabName.toLowerCase())) {
        pane.style.display = 'block';
      } else {
        pane.style.display = 'none';
      }
    });
  }

  // ─── 2. TICHU 2V2 LIVE SCORE ENGINE ─────────────────────
  const tichuState = {
    scoreA: 0,
    scoreB: 0,
    round: 1,
    history: []
  };

  function initTichuEngine() {
    const inputCardA = document.getElementById('tichuInputCardA');
    const inputCardB = document.getElementById('tichuInputCardB');
    const oneTwoSel = document.getElementById('tichuOneTwoSelect');
    const btnAdd = document.getElementById('btnTichuAddRound');
    const btnUndo = document.getElementById('btnTichuUndo');
    const btnReset = document.getElementById('btnResetTichu');

    if (!btnAdd) return;

    // Auto calculate B card points = 100 - A
    if (inputCardA && inputCardB) {
      inputCardA.addEventListener('input', () => {
        const valA = parseInt(inputCardA.value) || 0;
        inputCardB.value = 100 - valA;
      });
      inputCardB.addEventListener('input', () => {
        const valB = parseInt(inputCardB.value) || 0;
        inputCardA.value = 100 - valB;
      });
    }

    if (oneTwoSel) {
      oneTwoSel.addEventListener('change', () => {
        const row = document.getElementById('tichuCardPointsRow');
        if (row) {
          row.style.opacity = oneTwoSel.value === 'none' ? '1' : '0.4';
          row.style.pointerEvents = oneTwoSel.value === 'none' ? 'auto' : 'none';
        }
      });
    }

    btnAdd.addEventListener('click', () => {
      const oneTwo = oneTwoSel ? oneTwoSel.value : 'none';
      const callA = parseInt(document.getElementById('tichuCallA')?.value || '0');
      const callB = parseInt(document.getElementById('tichuCallB')?.value || '0');

      let roundPtsA = 0;
      let roundPtsB = 0;

      if (oneTwo === 'A') {
        roundPtsA = 200 + callA;
        roundPtsB = 0 + callB;
      } else if (oneTwo === 'B') {
        roundPtsA = 0 + callA;
        roundPtsB = 200 + callB;
      } else {
        const cardA = parseInt(inputCardA?.value || '50');
        const cardB = parseInt(inputCardB?.value || '50');
        roundPtsA = cardA + callA;
        roundPtsB = cardB + callB;
      }

      tichuState.scoreA += roundPtsA;
      tichuState.scoreB += roundPtsB;
      tichuState.history.push({
        round: tichuState.round,
        ptsA: roundPtsA,
        totalA: tichuState.scoreA,
        ptsB: roundPtsB,
        totalB: tichuState.scoreB,
        oneTwo
      });

      tichuState.round++;
      renderTichuUI();

      // Check 1000 Victory
      if (tichuState.scoreA >= 1000 || tichuState.scoreB >= 1000) {
        const nameA = document.getElementById('tichuTeamAName')?.value || 'A팀';
        const nameB = document.getElementById('tichuTeamBName')?.value || 'B팀';
        const winner = tichuState.scoreA >= 1000 ? nameA : nameB;
        alert(`🎉 축하합니다! ${winner}이 1,000점을 달성하여 최종 승리했습니다!`);
      }
    });

    if (btnUndo) {
      btnUndo.addEventListener('click', () => {
        if (tichuState.history.length === 0) {
          alert('되돌릴 라운드가 없습니다.');
          return;
        }
        const last = tichuState.history.pop();
        tichuState.scoreA -= last.ptsA;
        tichuState.scoreB -= last.ptsB;
        tichuState.round--;
        renderTichuUI();
      });
    }

    if (btnReset) {
      btnReset.addEventListener('click', () => {
        if (confirm('티츄 점수판을 초기화하고 새 게임을 시작할까요?')) {
          tichuState.scoreA = 0;
          tichuState.scoreB = 0;
          tichuState.round = 1;
          tichuState.history = [];
          renderTichuUI();
        }
      });
    }

    renderTichuUI();
  }

  function renderTichuUI() {
    const scoreAEl = document.getElementById('tichuTeamAScore');
    const scoreBEl = document.getElementById('tichuTeamBScore');
    const barAEl = document.getElementById('tichuBarA');
    const barBEl = document.getElementById('tichuBarB');
    const roundLbl = document.getElementById('tichuCurrentRoundLabel');
    const tbody = document.getElementById('tichuHistoryTableBody');

    if (scoreAEl) scoreAEl.textContent = tichuState.scoreA;
    if (scoreBEl) scoreBEl.textContent = tichuState.scoreB;

    if (barAEl) barAEl.style.width = Math.min(100, Math.max(0, (tichuState.scoreA / 1000) * 100)) + '%';
    if (barBEl) barBEl.style.width = Math.min(100, Math.max(0, (tichuState.scoreB / 1000) * 100)) + '%';
    if (roundLbl) roundLbl.textContent = `Round ${tichuState.round}`;

    if (tbody) {
      if (tichuState.history.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="padding: 8px; color: var(--text-muted);">아직 진행된 라운드가 없습니다.</td></tr>';
      } else {
        tbody.innerHTML = tichuState.history.map(h => `
          <tr style="border-bottom: 1px solid var(--border-color);">
            <td style="padding: 5px; font-weight: 700;">R${h.round}</td>
            <td style="padding: 5px; color: ${h.ptsA >= 0 ? '#6c5ce7' : '#d63031'};">${h.ptsA > 0 ? '+' : ''}${h.ptsA}</td>
            <td style="padding: 5px; font-weight: 800;">${h.totalA}</td>
            <td style="padding: 5px; color: ${h.ptsB >= 0 ? '#0984e3' : '#d63031'};">${h.ptsB > 0 ? '+' : ''}${h.ptsB}</td>
            <td style="padding: 5px; font-weight: 800;">${h.totalB}</td>
          </tr>
        `).join('');
      }
    }
  }

  // ─── 3. YACHT DICE SCORECARD & ROLLER ENGINE ─────────────
  const yachtState = {
    dice: [1, 2, 3, 4, 5],
    kept: [false, false, false, false, false],
    rollsLeft: 3,
    scores: {
      ones: null,
      twos: null,
      threes: null,
      fours: null,
      fives: null,
      sixes: null,
      choice: null,
      fourOfAKind: null,
      fullHouse: null,
      smallStraight: null,
      largeStraight: null,
      yacht: null
    }
  };

  function initYachtEngine() {
    const btnRoll = document.getElementById('btnYachtRoll');
    const btnReset = document.getElementById('btnResetYacht');
    const diceEls = document.querySelectorAll('.yacht-die');

    if (!btnRoll) return;

    // Dice keep toggle
    diceEls.forEach((die, idx) => {
      die.addEventListener('click', () => {
        if (yachtState.rollsLeft === 3) return; // Cannot keep before rolling
        yachtState.kept[idx] = !yachtState.kept[idx];
        die.classList.toggle('kept', yachtState.kept[idx]);
      });
    });

    // Roll button
    btnRoll.addEventListener('click', () => {
      if (yachtState.rollsLeft <= 0) {
        alert('더 이상 굴릴 수 없습니다! 점수표에서 항목을 선택해 점수를 기록하세요.');
        return;
      }

      // Roll unkept dice
      for (let i = 0; i < 5; i++) {
        if (!yachtState.kept[i]) {
          yachtState.dice[i] = Math.floor(Math.random() * 6) + 1;
        }
      }

      yachtState.rollsLeft--;
      renderYachtDice();
      highlightPotentialScores();
    });

    // Score cell click
    document.querySelectorAll('.yacht-score-cell').forEach(cell => {
      cell.addEventListener('click', () => {
        const cat = cell.closest('.yacht-row')?.getAttribute('data-cat');
        if (!cat || yachtState.scores[cat] !== null) return; // Already filled

        if (yachtState.rollsLeft === 3) {
          alert('주사위를 먼저 굴려주세요!');
          return;
        }

        const score = calculateCategoryScore(cat, yachtState.dice);
        yachtState.scores[cat] = score;

        // Reset for next turn
        yachtState.rollsLeft = 3;
        yachtState.kept = [false, false, false, false, false];
        diceEls.forEach(d => d.classList.remove('kept'));

        renderYachtScorecard();
        renderYachtDice();
        checkYachtGameOver();
      });
    });

    if (btnReset) {
      btnReset.addEventListener('click', () => {
        if (confirm('요트 다이스를 초기화하고 새 게임을 시작할까요?')) {
          resetYachtGame();
        }
      });
    }

    renderYachtDice();
    renderYachtScorecard();
  }

  function resetYachtGame() {
    yachtState.dice = [1, 2, 3, 4, 5];
    yachtState.kept = [false, false, false, false, false];
    yachtState.rollsLeft = 3;
    Object.keys(yachtState.scores).forEach(k => yachtState.scores[k] = null);
    document.querySelectorAll('.yacht-die').forEach(d => d.classList.remove('kept'));
    renderYachtDice();
    renderYachtScorecard();
  }

  function calculateCategoryScore(cat, dice) {
    const counts = {};
    let sum = 0;
    dice.forEach(d => {
      counts[d] = (counts[d] || 0) + 1;
      sum += d;
    });

    switch (cat) {
      case 'ones': return (counts[1] || 0) * 1;
      case 'twos': return (counts[2] || 0) * 2;
      case 'threes': return (counts[3] || 0) * 3;
      case 'fours': return (counts[4] || 0) * 4;
      case 'fives': return (counts[5] || 0) * 5;
      case 'sixes': return (counts[6] || 0) * 6;
      case 'choice': return sum;
      case 'fourOfAKind': {
        const has4 = Object.values(counts).some(c => c >= 4);
        return has4 ? sum : 0;
      }
      case 'fullHouse': {
        const vals = Object.values(counts);
        const isFH = (vals.includes(3) && vals.includes(2)) || vals.includes(5);
        return isFH ? sum : 0;
      }
      case 'smallStraight': {
        const unique = [...new Set(dice)].sort((a,b)=>a-b).join('');
        const hasSS = unique.includes('1234') || unique.includes('2345') || unique.includes('3456');
        return hasSS ? 30 : 0;
      }
      case 'largeStraight': {
        const sorted = [...dice].sort((a,b)=>a-b).join('');
        return (sorted === '12345' || sorted === '23456') ? 40 : 0;
      }
      case 'yacht': {
        const isYacht = Object.values(counts).some(c => c === 5);
        return isYacht ? 50 : 0;
      }
      default: return 0;
    }
  }

  function renderYachtDice() {
    const diceEls = document.querySelectorAll('.yacht-die');
    diceEls.forEach((die, idx) => {
      die.textContent = yachtState.dice[idx];
    });

    const rollsText = document.getElementById('yachtRollsLeftText');
    const btnRoll = document.getElementById('btnYachtRoll');
    if (rollsText) rollsText.textContent = `남은 굴림: ${yachtState.rollsLeft}회 / 3회`;
    if (btnRoll) {
      btnRoll.innerHTML = `<i data-lucide="dices"></i> 주사위 굴리기 (${yachtState.rollsLeft}회 남음)`;
      if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
    }
  }

  function highlightPotentialScores() {
    Object.keys(yachtState.scores).forEach(cat => {
      if (yachtState.scores[cat] === null) {
        const cell = document.getElementById(`yacht_${cat}`);
        if (cell) {
          const pot = calculateCategoryScore(cat, yachtState.dice);
          cell.textContent = `+${pot}`;
          cell.style.color = pot > 0 ? '#6c5ce7' : '#94a3b8';
          cell.style.fontWeight = '700';
        }
      }
    });
  }

  function renderYachtScorecard() {
    let upperSum = 0;
    let lowerSum = 0;

    const upperCats = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'];
    const lowerCats = ['choice', 'fourOfAKind', 'fullHouse', 'smallStraight', 'largeStraight', 'yacht'];

    upperCats.forEach(cat => {
      const val = yachtState.scores[cat];
      const cell = document.getElementById(`yacht_${cat}`);
      if (cell) {
        if (val !== null) {
          cell.textContent = val;
          cell.classList.add('filled');
          upperSum += val;
        } else {
          cell.textContent = '-';
          cell.classList.remove('filled');
          cell.style.color = '';
        }
      }
    });

    const bonus = upperSum >= 63 ? 35 : 0;
    const upperSubEl = document.getElementById('yachtUpperSubtotal');
    if (upperSubEl) {
      upperSubEl.textContent = `${upperSum} / 63 (+${bonus})`;
      upperSubEl.style.color = upperSum >= 63 ? '#2ecc71' : 'var(--text-main)';
    }

    lowerCats.forEach(cat => {
      const val = yachtState.scores[cat];
      const cell = document.getElementById(`yacht_${cat}`);
      if (cell) {
        if (val !== null) {
          cell.textContent = val;
          cell.classList.add('filled');
          lowerSum += val;
        } else {
          cell.textContent = '-';
          cell.classList.remove('filled');
          cell.style.color = '';
        }
      }
    });

    const grandTotal = upperSum + bonus + lowerSum;
    const totalEl = document.getElementById('yachtGrandTotal');
    if (totalEl) totalEl.textContent = `${grandTotal}점`;
  }

  function checkYachtGameOver() {
    const allFilled = Object.values(yachtState.scores).every(v => v !== null);
    if (allFilled) {
      const totalEl = document.getElementById('yachtGrandTotal');
      const score = totalEl ? totalEl.textContent : '';
      setTimeout(() => {
        alert(`🎉 요트 다이스 완료! 최종 점수: ${score}`);
      }, 200);
    }
  }

  // ─── 4. QUICK TOOLS LAUNCHER & REC HUB ──────────────────
  function initQuickLauncher() {
    document.querySelectorAll('.quick-tool-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-tool-target');
        // 1. Switch to tools tab
        const toolsTabBtn = document.querySelector('.tab-btn[data-tab="tools"]');
        if (toolsTabBtn) toolsTabBtn.click();

        // Mobile bottom nav if visible
        const mobileToolsBtn = document.querySelector('.mobile-nav-bar .nav-item[data-mobile-tab="tools"]');
        if (mobileToolsBtn) mobileToolsBtn.click();

        // 2. Switch to sub tab
        setTimeout(() => {
          if (target === 'tichu') document.getElementById('subTabTichu')?.click();
          else if (target === 'yacht') document.getElementById('subTabYacht')?.click();
          else if (target === 'timer') document.getElementById('subTabTimer')?.click();
          else if (target === 'roulette') document.getElementById('subTabRoulette')?.click();
        }, 50);
      });
    });
  }

  window.filterByPlayerCount = function (playerFilterKey) {
    // 1. Switch to info tab
    const infoTabBtn = document.querySelector('.tab-btn[data-tab="info"]');
    if (infoTabBtn) infoTabBtn.click();

    const mobileInfoBtn = document.querySelector('.mobile-nav-bar .nav-item[data-mobile-tab="info"]');
    if (mobileInfoBtn) mobileInfoBtn.click();

    // 2. Trigger player filter button
    setTimeout(() => {
      const targetBtn = document.querySelector(`#playerFilter button[data-player="${playerFilterKey}"]`);
      if (targetBtn) targetBtn.click();
    }, 50);
  };

  // ─── 5. SUBTABS ROUTER (ALL 8 TOOLS) ────────────────────
  function initToolsSubTabs() {
    const subTabConfigs = [
      { tabId: 'subTabTichu', secId: 'toolSectionTichu' },
      { tabId: 'subTabYacht', secId: 'toolSectionYacht' },
      { tabId: 'subTabTimer', secId: 'toolSectionTimer' },
      { tabId: 'subTabRoulette', secId: 'toolSectionRoulette' },
      { tabId: 'subTabDice', secId: 'toolSectionDice' },
      { tabId: 'subTabLadder', secId: 'toolSectionLadder' },
      { tabId: 'subTabRecommend', secId: 'toolSectionRecommend' },
      { tabId: 'subTabScoreboard', secId: 'toolSectionScoreboard' }
    ];

    subTabConfigs.forEach(cfg => {
      const tabEl = document.getElementById(cfg.tabId);
      if (!tabEl) return;

      tabEl.addEventListener('click', () => {
        subTabConfigs.forEach(c => {
          const t = document.getElementById(c.tabId);
          const s = document.getElementById(c.secId);
          if (t) t.classList.remove('active');
          if (s) s.style.display = 'none';
        });

        tabEl.classList.add('active');
        const sec = document.getElementById(cfg.secId);
        if (sec) sec.style.display = 'flex';

        // Re-render canvas or icons
        if (cfg.tabId === 'subTabLadder' && window.initLadderCanvas) {
          setTimeout(window.initLadderCanvas, 100);
        }
        if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
      });
    });
  }

  // ─── 6. REAL-TIME SEARCH IN ENCYCLOPEDIA ─────────────────
  function initEncyclopediaSearch() {
    const searchInput = document.getElementById('encyclopediaSearchInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', () => {
      if (typeof window.renderEncyclopedia === 'function') {
        window.renderEncyclopedia();
      }
    });
  }

  // ─── 7. MODALS CLOSE BINDINGS ───────────────────────────
  function initModalClosers() {
    const closeRuleBtn = document.getElementById('closeRuleModalBtn');
    const confirmRuleBtn = document.getElementById('btnConfirmRuleModal');
    const ruleModal = document.getElementById('ruleDetailModal');

    const closeRule = () => {
      if (ruleModal) ruleModal.style.display = 'none';
    };

    if (closeRuleBtn) closeRuleBtn.addEventListener('click', closeRule);
    if (confirmRuleBtn) confirmRuleBtn.addEventListener('click', closeRule);

    // Rule modal subtabs
    document.querySelectorAll('.rule-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-rule-tab');
        switchRuleModalTab(tab);
      });
    });
  }

  // ─── 8. LANGUAGE CHANGE SYNC ─────────────────────────────
  window.addEventListener('boardvillage_lang_changed', function (e) {
    const lang = e.detail ? e.detail.lang : 'ko';
    const langData = window.BV_I18N ? window.BV_I18N.languages[lang] : null;

    if (langData) {
      const flagEls = [document.getElementById('currentLangFlag'), document.getElementById('mainLangFlag')];
      const nameEls = [document.getElementById('currentLangName'), document.getElementById('mainLangName')];
      flagEls.forEach(f => { if (f) f.textContent = langData.flag; });
      nameEls.forEach(n => { if (n) n.textContent = langData.name; });
    }

    if (typeof window.renderEncyclopedia === 'function') {
      window.renderEncyclopedia();
    }
  });

  // ─── INITIALIZATION ON DOM READY ────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    initTichuEngine();
    initYachtEngine();
    initQuickLauncher();
    initToolsSubTabs();
    initEncyclopediaSearch();
    initModalClosers();
    if (window.lucide && window.lucide.createIcons) {
      window.lucide.createIcons();
    }
  });
})();
