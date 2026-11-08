/* Interface e Gráficos da Visão Estratégica (SVG Nativo Offline).
   Renderiza indicadores comparativos, séries temporais, ocupação, origens e projeções. */

const TherapyStrategyUI = (() => {
    const state = {
        horizon: '6m', // Padrão: 6 meses
        retentionIds: []
    };

    const el = id => document.getElementById(id);
    const esc = value => (typeof sanitizeHTML === 'function' ? sanitizeHTML(String(value ?? '')) : String(value ?? ''));
    const money = value => (typeof fmtMoney === 'function' ? fmtMoney(Number(value) || 0) : 'R$ ' + Number(value || 0).toFixed(2).replace('.', ','));
    const dayFmt = value => (typeof fmtDate === 'function' ? fmtDate(value) : value);

    /**
     * Alterna o horizonte temporal e re-renderiza a visão estratégica
     */
    function setHorizon(newHorizon) {
        if (!['30d', '90d', '6m', '12m', 'current_year'].includes(newHorizon)) return;
        state.horizon = newHorizon;
        render();
    }

    /**
     * Renderização principal da Visão Estratégica
     */
    function render() {
        const panel = el('dashboard-panel-strategic');
        if (!panel) return;
        if (typeof TherapyVault === 'undefined' || !TherapyVault.isOpen()) return;

        const interval = TherapyStrategyRules.getInterval(state.horizon);
        const kpis = TherapyStrategyRules.computeKPIs(db, interval);
        const monthlySeries = TherapyStrategyRules.aggregateMonthlySeries(db, interval.months, interval);
        const coverage = TherapyStrategyRules.computeCoverageDistribution(db, interval);
        const occupancy = TherapyStrategyRules.computeScheduleOccupancy(db, interval);
        const aging = TherapyStrategyRules.computeReceivablesAging(db, interval.today);
        const projections = TherapyStrategyRules.computeProjections(db, interval.today);
        state.retentionIds=projections.retention?.patientIds||[];

        panel.innerHTML = `
            ${renderToolbar(interval)}
            ${renderKPIs(kpis, interval)}
            ${renderProjectionsSection(projections)}
            <div class="strategy-charts-grid">
                ${renderRevenueCard(monthlySeries, interval)}
                ${renderAppointmentsCard(monthlySeries, interval)}
                ${renderAttendanceCard(monthlySeries, interval)}
                ${renderCoverageCard(coverage, interval)}
                ${renderOccupancyCard(occupancy, interval)}
                ${renderAgingCard(aging, interval)}
            </div>
            ${renderDataTables(monthlySeries,coverage,occupancy,aging)}
            ${renderMethodologyFooter(interval)}
        `;

        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
    }

    /**
     * Barra de Ferramentas com Seletor de Horizonte Temporal
     */
    function renderToolbar(interval) {
        const horizons = [
            { id: '30d', label: '30 dias' },
            { id: '90d', label: '90 dias' },
            { id: '6m', label: '6 meses' },
            { id: '12m', label: '12 meses' },
            { id: 'current_year', label: 'Ano atual' }
        ];

        const dateRangeText = `${dayFmt(interval.start)} a ${dayFmt(interval.end)}`;
        const prevRangeText = `${dayFmt(interval.prevStart)} a ${dayFmt(interval.prevEnd)}`;

        return `
            <div class="strategy-toolbar">
                <div class="strategy-horizon-selector" role="group" aria-label="Seletor de período de análise">
                    <span class="strategy-horizon-label"><i data-lucide="calendar" aria-hidden="true"></i> Período:</span>
                    ${horizons.map(h => `
                        <button type="button"
                                class="strategy-pill-btn"
                                aria-pressed="${state.horizon === h.id}"
                                onclick="TherapyStrategyUI.setHorizon('${h.id}')">
                            ${h.label}
                        </button>
                    `).join('')}
                </div>
                <div class="strategy-baseline-info">
                    <span><strong>${dateRangeText}</strong> · Comparando com <em>${prevRangeText}</em></span>
                </div>
            </div>
        `;
    }

    /**
     * Indicadores Chave de Desempenho (KPIs)
     */
    function renderKPIs(kpis, interval) {
        return `
            <div class="strategy-kpi-grid">
                <!-- 1. Receita Realizada (Caixa) -->
                <button type="button" class="strategy-kpi-card" onclick="TherapyStrategyUI.openFinance('cash', '${interval.start}', '${interval.end}')" aria-label="Receita realizada no período: abrir no Financeiro">
                    <div class="strategy-kpi-header">
                        <span class="strategy-kpi-title">Receita Realizada</span>
                        <span class="strategy-kpi-badge ${kpis.income.delta.direction}">
                            <i data-lucide="${kpis.income.delta.direction === 'positive' ? 'trending-up' : kpis.income.delta.direction === 'negative' ? 'trending-down' : 'minus'}" aria-hidden="true"></i>
                            ${kpis.income.delta.text}
                        </span>
                    </div>
                    <div class="strategy-kpi-value">${money(kpis.income.current)}</div>
                    <span class="strategy-kpi-subtext">Anterior: ${money(kpis.income.previous)}</span>
                </button>

                <!-- 2. A Receber / Pendente -->
                <button type="button" class="strategy-kpi-card" onclick="TherapyStrategyUI.openFinance('receivable', '${interval.start}', '${interval.end}')" aria-label="A receber no período: abrir no Financeiro">
                    <div class="strategy-kpi-header">
                        <span class="strategy-kpi-title">A Receber</span>
                        <span class="strategy-kpi-badge neutral">Pendente</span>
                    </div>
                    <div class="strategy-kpi-value">${money(kpis.pending.current)}</div>
                    <span class="strategy-kpi-subtext">Vencimentos cadastrados no período</span>
                </button>

                <!-- 3. Atendimentos Realizados -->
                <button type="button" class="strategy-kpi-card" onclick="TherapyStrategyUI.openReports('attendance', '${interval.start}', '${interval.end}')" aria-label="Atendimentos realizados: abrir Relatório">
                    <div class="strategy-kpi-header">
                        <span class="strategy-kpi-title">Atendimentos</span>
                        <span class="strategy-kpi-badge ${kpis.completed.delta.direction}">
                            <i data-lucide="${kpis.completed.delta.direction === 'positive' ? 'trending-up' : kpis.completed.delta.direction === 'negative' ? 'trending-down' : 'minus'}" aria-hidden="true"></i>
                            ${kpis.completed.delta.text}
                        </span>
                    </div>
                    <div class="strategy-kpi-value">${kpis.completed.current} <small style="font-size:0.875rem;font-weight:400;color:var(--color-muted);">sessões</small></div>
                    <span class="strategy-kpi-subtext">Anterior: ${kpis.completed.previous} sessões</span>
                </button>

                <!-- 4. Taxa de Comparecimento -->
                <button type="button" class="strategy-kpi-card" onclick="TherapyStrategyUI.openReports('attendance', '${interval.start}', '${interval.end}')" aria-label="Taxa de comparecimento: abrir Relatório">
                    <div class="strategy-kpi-header">
                        <span class="strategy-kpi-title">Comparecimento</span>
                        <span class="strategy-kpi-badge ${kpis.attendance.delta.direction}">
                            ${kpis.attendance.delta.text}
                        </span>
                    </div>
                    <div class="strategy-kpi-value">${kpis.attendance.current !== null ? kpis.attendance.current.toLocaleString('pt-BR') + '%' : 'Sem base'}</div>
                    <span class="strategy-kpi-subtext">Concluídos ÷ (Concluídos + Faltas)</span>
                </button>

                <!-- 5. Ticket Médio -->
                <button type="button" class="strategy-kpi-card" onclick="TherapyStrategyUI.openFinance('cash', '${interval.start}', '${interval.end}')" aria-label="Ticket médio por sessão">
                    <div class="strategy-kpi-header">
                        <span class="strategy-kpi-title">Ticket Médio</span>
                        <span class="strategy-kpi-badge ${kpis.averageTicket.delta.direction}">
                            ${kpis.averageTicket.delta.text}
                        </span>
                    </div>
                    <div class="strategy-kpi-value">${money(kpis.averageTicket.current)}</div>
                    <span class="strategy-kpi-subtext">Receita líquida ÷ atendimentos</span>
                </button>

                <!-- 6. Pacientes em Acompanhamento e Novos -->
                <button type="button" class="strategy-kpi-card" onclick="TherapyStrategyUI.openPatients()" aria-label="Pacientes ativos: abrir CRM">
                    <div class="strategy-kpi-header">
                        <span class="strategy-kpi-title">Pacientes Ativos</span>
                        <span class="strategy-kpi-badge ${kpis.patients.delta.direction}">
                            +${kpis.patients.newCount} novos
                        </span>
                    </div>
                    <div class="strategy-kpi-value">${kpis.patients.active} <small style="font-size:0.875rem;font-weight:400;color:var(--color-muted);">ativos</small></div>
                    <span class="strategy-kpi-subtext">Etapa “Em acompanhamento” no CRM</span>
                </button>
            </div>
        `;
    }

    /**
     * Gráfico 1: Evolução da Receita Mensal (Realizado vs A Receber)
     */
    function renderRevenueCard(series, interval) {
        if (!series || !series.length) return '';
        const maxVal = Math.max(...series.map(s => Math.max(s.income, s.pending)), 100);

        // Coordenadas SVG
        const w = 500;
        const h = 200;
        const padX = 50;
        const padY = 25;
        const chartW = w - padX - 15;
        const chartH = h - padY - 30;

        const groupW = chartW / series.length;
        const barW = Math.max(8, Math.min(22, groupW * 0.35));

        const minVal=Math.min(0,...series.map(s=>s.income));
        const yRatio=chartH/(maxVal-minVal);
        const yAt=value=>padY+(maxVal-value)*yRatio;

        const barsSVG = series.map((s, idx) => {
            const centerX = padX + (idx * groupW) + (groupW / 2);
            const x1 = centerX - barW - 2;
            const x2 = centerX + 2;

            const h1 = Math.abs(s.income * yRatio);
            const y1 = Math.min(yAt(s.income),yAt(0));

            const h2 = Math.max(0, s.pending * yRatio);
            const y2 = yAt(s.pending);

            return `
                <g class="strategy-bar-group">
                    <title>${s.label}: Realizado ${money(s.income)} · A Receber ${money(s.pending)}</title>
                    <!-- Barra de Realizado (Azul) -->
                    <rect x="${x1}" y="${y1}" width="${barW}" height="${h1}" rx="3" fill="#2563EB" opacity="0.9"></rect>
                    <!-- Barra de A Receber (Âmbar) -->
                    <rect x="${x2}" y="${y2}" width="${barW}" height="${h2}" rx="3" fill="#D97706" opacity="0.85"></rect>
                    <!-- Rótulo do Mês -->
                    <text x="${centerX}" y="${h - 10}" text-anchor="middle" font-size="11" fill="var(--color-muted)">${s.label}</text>
                </g>
            `;
        }).join('');

        // Linhas de Grade Y (0%, 50%, 100%)
        const gridY = [0, 0.5, 1].map(r => {
            const val = minVal+(maxVal-minVal)*r;
            const y = yAt(val);
            const valFmt = val >= 1000 ? (val / 1000).toFixed(1) + 'k' : Math.round(val);
            return `
                <line x1="${padX}" y1="${y}" x2="${w - 15}" y2="${y}" stroke="var(--color-border)" stroke-dasharray="3,3" stroke-width="1"></line>
                <text x="${padX - 8}" y="${y + 4}" text-anchor="end" font-size="10" fill="var(--color-muted)">${valFmt}</text>
            `;
        }).join('');

        return `
            <div class="strategy-chart-card">
                <div class="strategy-chart-header">
                    <div>
                        <h4 class="strategy-chart-title"><i data-lucide="bar-chart-2" aria-hidden="true"></i> Receita Mensal</h4>
                        <p class="strategy-chart-subtitle">Realizado em caixa vs. Valores previstos a receber</p>
                    </div>
                </div>
                <div class="strategy-chart-legend">
                    <span class="strategy-legend-item"><span class="strategy-legend-color" style="background:#2563EB;"></span> Recebido (Caixa)</span>
                    <span class="strategy-legend-item"><span class="strategy-legend-color" style="background:#D97706;"></span> A Receber</span>
                </div>
                <div class="strategy-chart-svg-container" role="img" aria-label="Gráfico de barras da receita mensal realizada e a receber">
                    <svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet">
                        ${gridY}
                        ${barsSVG}
                    </svg>
                </div>
                <div class="strategy-chart-footer">
                    <p>Caixa pela data efetiva de pagamento, deduzindo devoluções.</p>
                    <button type="button" class="therapy-secondary" onclick="TherapyStrategyUI.openFinance('all', '${interval.start}', '${interval.end}')">Ver Financeiro</button>
                </div>
            </div>
        `;
    }

    /**
     * Gráfico 2: Atendimentos por Mês e Situação
     */
    function renderAppointmentsCard(series, interval) {
        if (!series || !series.length) return '';
        const maxVal = Math.max(...series.map(s => (s.completed + s.noShow + s.cancelled)), 10);

        const w = 500;
        const h = 200;
        const padX = 40;
        const padY = 25;
        const chartW = w - padX - 15;
        const chartH = h - padY - 30;

        const groupW = chartW / series.length;
        const barW = Math.max(12, Math.min(28, groupW * 0.55));
        const yRatio = chartH / maxVal;

        const barsSVG = series.map((s, idx) => {
            const x = padX + (idx * groupW) + (groupW - barW) / 2;
            const hComp = s.completed * yRatio;
            const hNoShow = s.noShow * yRatio;
            const hCanc = s.cancelled * yRatio;

            const yComp = padY + chartH - hComp;
            const yNoShow = yComp - hNoShow;
            const yCanc = yNoShow - hCanc;

            return `
                <g class="strategy-bar-stack">
                    <title>${s.label}: ${s.completed} concluídas · ${s.noShow} faltas · ${s.cancelled} cancelamentos</title>
                    ${s.completed > 0 ? `<rect x="${x}" y="${yComp}" width="${barW}" height="${hComp}" fill="#16A34A" rx="2"></rect>` : ''}
                    ${s.noShow > 0 ? `<rect x="${x}" y="${yNoShow}" width="${barW}" height="${hNoShow}" fill="#DC2626" rx="2"></rect>` : ''}
                    ${s.cancelled > 0 ? `<rect x="${x}" y="${yCanc}" width="${barW}" height="${hCanc}" fill="#64748B" rx="2"></rect>` : ''}
                    <text x="${x + (barW / 2)}" y="${h - 10}" text-anchor="middle" font-size="11" fill="var(--color-muted)">${s.label}</text>
                </g>
            `;
        }).join('');

        const gridY = [0, 0.5, 1].map(r => {
            const val = Math.round(maxVal * r);
            const y = padY + chartH - (chartH * r);
            return `
                <line x1="${padX}" y1="${y}" x2="${w - 15}" y2="${y}" stroke="var(--color-border)" stroke-dasharray="3,3" stroke-width="1"></line>
                <text x="${padX - 8}" y="${y + 4}" text-anchor="end" font-size="10" fill="var(--color-muted)">${val}</text>
            `;
        }).join('');

        return `
            <div class="strategy-chart-card">
                <div class="strategy-chart-header">
                    <div>
                        <h4 class="strategy-chart-title"><i data-lucide="calendar-check-2" aria-hidden="true"></i> Volume de Atendimentos</h4>
                        <p class="strategy-chart-subtitle">Sessões concluídas, faltas e cancelamentos no histórico</p>
                    </div>
                </div>
                <div class="strategy-chart-legend">
                    <span class="strategy-legend-item"><span class="strategy-legend-color" style="background:#16A34A;"></span> Concluídas</span>
                    <span class="strategy-legend-item"><span class="strategy-legend-color" style="background:#DC2626;"></span> Faltas</span>
                    <span class="strategy-legend-item"><span class="strategy-legend-color" style="background:#64748B;"></span> Cancelamentos</span>
                </div>
                <div class="strategy-chart-svg-container" role="img" aria-label="Gráfico empilhado de atendimentos concluídos, faltas e cancelamentos">
                    <svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet">
                        ${gridY}
                        ${barsSVG}
                    </svg>
                </div>
                <div class="strategy-chart-footer">
                    <p>Agendamentos classificados pela situação registrada na Agenda.</p>
                    <button type="button" class="therapy-secondary" onclick="TherapyStrategyUI.openReports('attendance', '${interval.start}', '${interval.end}')">Ver Comparecimento</button>
                </div>
            </div>
        `;
    }

    /**
     * Gráfico 3: Taxa de Comparecimento Histórica (%)
     */
    function renderAttendanceCard(series, interval) {
        if (!series || !series.length) return '';
        const w = 500;
        const h = 200;
        const padX = 45;
        const padY = 25;
        const chartW = w - padX - 15;
        const chartH = h - padY - 30;

        const points = series.map((s, idx) => {
            const x = padX + (idx * (chartW / (series.length - 1 || 1)));
            const rate = s.attendanceRate !== null ? s.attendanceRate : 0;
            const y = padY + chartH - (chartH * (rate / 100));
            return { x, y, rate, label: s.label, hasData: s.attendanceRate !== null };
        });

        // Path SVG da linha
        const validPoints = points.filter(p => p.hasData);
        let pathD = '';
        let areaD = '';

        if (validPoints.length > 0) {
            pathD = validPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
            const first = validPoints[0];
            const last = validPoints[validPoints.length - 1];
            areaD = `${pathD} L ${last.x.toFixed(1)} ${padY + chartH} L ${first.x.toFixed(1)} ${padY + chartH} Z`;
        }

        // Linha de Referência de 85%
        const yRef85 = padY + chartH - (chartH * 0.85);

        return `
            <div class="strategy-chart-card">
                <div class="strategy-chart-header">
                    <div>
                        <h4 class="strategy-chart-title"><i data-lucide="line-chart" aria-hidden="true"></i> Taxa de Comparecimento</h4>
                        <p class="strategy-chart-subtitle">Adesão aos horários: Concluídos ÷ (Concluídos + Faltas)</p>
                    </div>
                </div>
                <div class="strategy-chart-legend">
                    <span class="strategy-legend-item"><span class="strategy-legend-color" style="background:#0284C7;"></span> Comparecimento (%)</span>
                    <span class="strategy-legend-item" style="border-bottom:1px dashed #64748B;">Linha visual de referência (85%)</span>
                </div>
                <div class="strategy-chart-svg-container" role="img" aria-label="Gráfico de linha da taxa de comparecimento mensal">
                    <svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet">
                        <!-- Linhas de Grade Y (50%, 75%, 100%) -->
                        <line x1="${padX}" y1="${padY + chartH}" x2="${w - 15}" y2="${padY + chartH}" stroke="var(--color-border)" stroke-width="1"></line>
                        <text x="${padX - 8}" y="${padY + chartH + 3}" text-anchor="end" font-size="10" fill="var(--color-muted)">0%</text>

                        <line x1="${padX}" y1="${padY + (chartH * 0.5)}" x2="${w - 15}" y2="${padY + (chartH * 0.5)}" stroke="var(--color-border)" stroke-dasharray="3,3" stroke-width="1"></line>
                        <text x="${padX - 8}" y="${padY + (chartH * 0.5) + 3}" text-anchor="end" font-size="10" fill="var(--color-muted)">50%</text>

                        <line x1="${padX}" y1="${padY}" x2="${w - 15}" y2="${padY}" stroke="var(--color-border)" stroke-dasharray="3,3" stroke-width="1"></line>
                        <text x="${padX - 8}" y="${padY + 4}" text-anchor="end" font-size="10" fill="var(--color-muted)">100%</text>

                        <!-- Linha de meta 85% -->
                        <line x1="${padX}" y1="${yRef85}" x2="${w - 15}" y2="${yRef85}" stroke="#94A3B8" stroke-dasharray="4,4" stroke-width="1.5"></line>

                        <!-- Área sob a curva -->
                        ${areaD ? `<path d="${areaD}" fill="#0284C7" fill-opacity="0.12"></path>` : ''}

                        <!-- Linha principal -->
                        ${pathD ? `<path d="${pathD}" fill="none" stroke="#0284C7" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>` : ''}

                        <!-- Pontos e Rótulos -->
                        ${points.map(p => `
                            <g>
                                <text x="${p.x}" y="${h - 10}" text-anchor="middle" font-size="11" fill="var(--color-muted)">${p.label}</text>
                                ${p.hasData ? `
                                    <circle cx="${p.x}" cy="${p.y}" r="4" fill="#0284C7" stroke="var(--color-surface)" stroke-width="2">
                                        <title>${p.label}: ${p.rate.toLocaleString('pt-BR')}%</title>
                                    </circle>
                                    <text x="${p.x}" y="${p.y - 8}" text-anchor="middle" font-size="10" font-weight="600" fill="var(--color-text)">${p.rate.toFixed(0)}%</text>
                                ` : ''}
                            </g>
                        `).join('')}
                    </svg>
                </div>
                <div class="strategy-chart-footer">
                    <p>Cancelamentos prévios não penalizam a taxa de comparecimento.</p>
                    <button type="button" class="therapy-secondary" onclick="TherapyStrategyUI.openReports('attendance', '${interval.start}', '${interval.end}')">Detalhar</button>
                </div>
            </div>
        `;
    }

    /**
     * Gráfico 4: Origens dos Atendimentos (Gráfico de Pizza SVG Nativo)
     */
    function renderCoverageCard(coverage, interval) {
        const groups = coverage.groups || [];
        const activeGroups = groups.filter(g => g.count > 0);
        const totalSessions = activeGroups.reduce((sum, g) => sum + g.count, 0);

        let pieSVG = '';
        const cx = 100;
        const cy = 100;
        const r = 82;

        if (totalSessions > 0) {
            if (activeGroups.length === 1) {
                const g = activeGroups[0];
                pieSVG = `
                    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${esc(g.color)}" stroke="var(--color-surface)" stroke-width="2" class="strategy-pie-slice">
                        <title>${esc(g.name)}: ${g.count} sessões (100%) · ${money(g.income)}</title>
                    </circle>
                `;
            } else {
                let currentAngle = -Math.PI / 2; // Começa no topo (12h)
                pieSVG = activeGroups.map(g => {
                    const sliceAngle = (g.count / totalSessions) * 2 * Math.PI;
                    const startAngle = currentAngle;
                    const endAngle = startAngle + sliceAngle;
                    currentAngle = endAngle;

                    const x1 = cx + r * Math.cos(startAngle);
                    const y1 = cy + r * Math.sin(startAngle);
                    const x2 = cx + r * Math.cos(endAngle);
                    const y2 = cy + r * Math.sin(endAngle);

                    const largeArc = sliceAngle > Math.PI ? 1 : 0;
                    const d = `M ${cx} ${cy} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;

                    return `
                        <path d="${d}" fill="${esc(g.color)}" stroke="var(--color-surface)" stroke-width="2" class="strategy-pie-slice">
                            <title>${esc(g.name)}: ${g.count} sessões (${g.percent}%) · ${money(g.income)}</title>
                        </path>
                    `;
                }).join('');
            }
        }

        return `
            <div class="strategy-chart-card">
                <div class="strategy-chart-header">
                    <div>
                        <h4 class="strategy-chart-title"><i data-lucide="pie-chart" aria-hidden="true"></i> Origem dos Atendimentos</h4>
                        <p class="strategy-chart-subtitle">Distribuição entre Particular, Convênios e Reembolsos</p>
                    </div>
                </div>
                ${totalSessions > 0 ? `
                    <div class="strategy-pie-layout">
                        <div class="strategy-pie-svg-container" role="img" aria-label="Gráfico de pizza com a distribuição das origens de atendimento">
                            <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet">
                                ${pieSVG}
                            </svg>
                        </div>
                        <div class="strategy-pie-legend">
                            ${groups.map(g => `
                                <div class="strategy-pie-item">
                                    <div class="strategy-pie-item-name">
                                        <span class="strategy-pie-item-color" style="background:${esc(g.color)};"></span>
                                        <strong>${esc(g.name)}</strong>
                                    </div>
                                    <div class="strategy-pie-item-val">
                                        <strong>${g.count} (${g.percent}%)</strong>
                                        <span>${money(g.income)}</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : '<div style="flex:1; display:flex; align-items:center; justify-content:center;"><p class="therapy-alert-empty">Nenhum atendimento concluído no período.</p></div>'}
                <div class="strategy-chart-footer">
                    <p>Classificação histórica registrada no momento do atendimento.</p>
                    <button type="button" class="therapy-secondary" onclick="TherapyStrategyUI.openReports('coverage', '${interval.start}', '${interval.end}')">Relatório de Origens</button>
                </div>
            </div>
        `;
    }

    /**
     * Gráfico 5: Ocupação Semanal da Agenda (Heatmap)
     */
    function renderOccupancyCard(occupancy, interval) {
        const { dayNames, grid, maxCell, totalCount } = occupancy;
        const shifts = [
            { key: 'morning', label: 'Manhã (07h-12h)' },
            { key: 'afternoon', label: 'Tarde (12h-18h)' },
            { key: 'evening', label: 'Noite (18h-22h)' }
        ];

        return `
            <div class="strategy-chart-card">
                <div class="strategy-chart-header">
                    <div>
                        <h4 class="strategy-chart-title"><i data-lucide="clock" aria-hidden="true"></i> Distribuição de Horários</h4>
                        <p class="strategy-chart-subtitle">Concentração de sessões por dia e turno (${totalCount} atendimentos)</p>
                    </div>
                </div>
                <div style="flex:1; display:flex; align-items:center;">
                    <table class="strategy-heatmap-table" aria-label="Tabela de ocupação de horários por dia e turno">
                        <thead>
                            <tr>
                                <th></th>
                                ${dayNames.map(d => `<th>${d}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${shifts.map(shift => `
                                <tr>
                                    <td class="shift-label">${shift.label}</td>
                                    ${grid[shift.key].map((count, dayIdx) => {
                                        const ratio = count / maxCell;
                                        const bgAlpha = count > 0 ? Math.max(0.15, ratio * 0.85) : 0.04;
                                        const textColor = count > 0 ? (ratio > 0.5 ? '#FFFFFF' : 'var(--color-text)') : 'var(--color-muted)';
                                        const bgColor = count > 0 ? `rgba(37, 99, 235, ${bgAlpha.toFixed(2)})` : 'var(--color-elevated)';
                                        return `
                                            <td>
                                                <div class="strategy-heatmap-cell" style="background:${bgColor}; color:${textColor};" title="${dayNames[dayIdx]}, ${shift.label}: ${count} sessões">
                                                    ${count}
                                                </div>
                                            </td>
                                        `;
                                    }).join('')}
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                <div class="strategy-chart-footer">
                    <p>Contagem de sessões entre 07h e 22h, de segunda a sábado. Não mede a capacidade disponível; faltas e cancelamentos são excluídos.</p>
                    <button type="button" class="therapy-secondary" onclick="therapyOpenToday()">Ver Agenda</button>
                </div>
            </div>
        `;
    }

    /**
     * Gráfico 6: Previsibilidade & Aging de Contas a Receber
     */
    function renderAgingCard(aging, interval) {
        const { buckets, totalPending, totalOverdue } = aging;
        const b = [buckets.current, buckets.upTo30, buckets.from31To60, buckets.over60];
        const colors = ['#16A34A', '#F59E0B', '#EA580C', '#DC2626'];

        return `
            <div class="strategy-chart-card">
                <div class="strategy-chart-header">
                    <div>
                        <h4 class="strategy-chart-title"><i data-lucide="hourglass" aria-hidden="true"></i> Contas a Receber & Atraso</h4>
                        <p class="strategy-chart-subtitle">Vencimentos em aberto: ${money(totalPending)} (${money(totalOverdue)} em atraso)</p>
                    </div>
                </div>
                <div style="flex:1; display:flex; flex-direction:column; justify-content:center; padding:8px 0;">
                    ${b.map((item, idx) => {
                        const percent = totalPending > 0 ? Math.round((item.amount / totalPending) * 100) : 0;
                        return `
                            <div class="strategy-bar-row">
                                <div class="strategy-bar-info">
                                    <strong><span style="display:inline-block;width:8px;height:8px;border-radius:2px;background:${colors[idx]};margin-right:6px;"></span>${item.label}</strong>
                                    <span>${item.count} títulos · ${money(item.amount)}</span>
                                </div>
                                <div class="strategy-bar-track">
                                    <div class="strategy-bar-fill" style="width:${Math.max(2, percent)}%; background:${colors[idx]};"></div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
                <div class="strategy-chart-footer">
                    <p>Títulos por data de vencimento. Cobranças canceladas não aparecem.</p>
                    <button type="button" class="therapy-secondary" onclick="TherapyStrategyUI.openFinance('receivable', '', '')">Abrir Pendências</button>
                </div>
            </div>
        `;
    }

    /**
     * Painel de Projeções e Previsibilidade Responsável (Fase 1)
     */
    function renderProjectionsSection(projections) {
        if (!projections.hasEnoughData) {
            return `
                <div class="strategy-empty-state">
                    <h4><i data-lucide="sparkles" aria-hidden="true"></i> Projeções e Estimativas</h4>
                    <p>${esc(projections.message)}</p>
                </div>
            `;
        }

        const { currentMonth, nextQuarter, retention } = projections;

        return `
            <section class="strategy-projections-panel" aria-labelledby="strategy-proj-title">
                <div class="strategy-projections-heading">
                    <h3 id="strategy-proj-title"><i data-lucide="trending-up" aria-hidden="true"></i> Projeções & Previsibilidade</h3>
                    <span class="strategy-projections-badge">Cenários com base nos registros</span>
                </div>
                <div class="strategy-projections-grid">
                    <!-- Projeção Mês Corrente -->
                    <div class="strategy-projection-card">
                        <div>
                            <h4>Caixa recebido e cenário do mês</h4>
                            <div class="strategy-projection-range">
                                <strong>${money(currentMonth.range.min)} a ${money(currentMonth.range.expected)}</strong>
                            </div>
                            <p>${money(currentMonth.incomeSoFar)} já realizado em caixa + ${currentMonth.futureSessionsCount} sessões futuras agendadas.</p>
                        </div>
                        <p style="margin-top:10px;font-size:0.625rem;color:var(--color-muted);">${currentMonth.methodology}</p>
                    </div>

                    <!-- Projeção Próximos 90 Dias -->
                    <div class="strategy-projection-card">
                        <div>
                            <h4>Cenários para os próximos 90 dias</h4>
                            <div class="strategy-projection-range">
                                <strong>${money(nextQuarter.range.min)} a ${money(nextQuarter.range.expected)}</strong>
                            </div>
                            <p>Média móvel de ${money(nextQuarter.monthlyRunRate)}/mês com ${nextQuarter.validPackageSessions} sessões em pacotes com saldo válido.</p>
                        </div>
                        <p style="margin-top:10px;font-size:0.625rem;color:var(--color-muted);">${nextQuarter.methodology}</p>
                    </div>

                    <!-- Alerta de Retenção -->
                    <div class="strategy-projection-card">
                        <div>
                            <h4>Acompanhamentos sem retorno</h4>
                            <div class="strategy-projection-range">
                                <strong style="color:${retention.count > 0 ? 'var(--color-warning)' : 'var(--color-text)'}">${retention.count} ${retention.count === 1 ? 'paciente' : 'pacientes'}</strong>
                                <span>sem sessão recente</span>
                            </div>
                            <p>Pacientes na etapa Em acompanhamento, sem atendimento há mais de 30 dias e sem marcação futura ativa.</p>
                        </div>
                        <div style="margin-top:10px;">
                            <button type="button" class="therapy-secondary" style="width:100%;font-size:0.6875rem;" onclick="TherapyStrategyUI.openRetention()">Conferir pacientes</button>
                        </div>
                    </div>
                </div>
                <div class="strategy-projections-disclaimer">
                    <strong>Critério ético e de transparência:</strong> As projeções são estimativas estatísticas baseadas nos lançamentos financeiros e na assiduidade registrada na Agenda. O sistema não formula diagnósticos, prognósticos clínicos ou promessas de faturamento.
                </div>
            </section>
        `;
    }

    /**
     * Rodapé com Notas Metodológicas
     */
    function renderMethodologyFooter(interval) {
        return `
            <footer style="margin-top:10px; padding:12px 16px; background:var(--color-surface); border:1px solid var(--color-border); border-radius:var(--radius-panel); font-size:0.6875rem; color:var(--color-muted); line-height:1.5;">
                <strong>Sobre os cálculos:</strong>
                Todos os dados exibidos na Visão Estratégica são calculados localmente e de forma agregada a partir da base local de seu consultório. Nenhuma informação é transmitida para servidores externos.
            </footer>
        `;
    }

    function renderDataTables(series,coverage,occupancy,aging){
        const table=(caption,headers,rows)=>'<table><caption>'+caption+'</caption><thead><tr>'+headers.map(v=>'<th scope="col">'+esc(v)+'</th>').join('')+'</tr></thead><tbody>'+rows.map(row=>'<tr>'+row.map(v=>'<td>'+esc(v)+'</td>').join('')+'</tr>').join('')+'</tbody></table>';
        return '<details class="strategy-data-tables"><summary>Consultar os valores dos gráficos em tabelas</summary>'+table('Série mensal — recorte exato do período',['Mês','Receita líquida','A receber','Concluídas','Faltas','Canceladas','Comparecimento'],series.map(s=>[s.label,money(s.income),money(s.pending),s.completed,s.noShow,s.cancelled,s.attendanceRate===null?'Sem base':s.attendanceRate+'%']))+table('Origens históricas',['Origem','Sessões','Percentual','Receita líquida'],coverage.groups.map(g=>[g.name,g.count,g.percent+'%',money(g.income)]))+table('Horários registrados',['Turno',...occupancy.dayNames],Object.entries(occupancy.grid).map(([key,values])=>[({morning:'Manhã',afternoon:'Tarde',evening:'Noite'})[key],...values]))+table('Recebíveis em aberto — todo o histórico',['Vencimento','Quantidade','Valor'],Object.values(aging.buckets).map(b=>[b.label,b.count,money(b.amount)]))+'</details>';
    }

    // Ações de Navegação para Módulos Relacionados
    function openFinance(tab = 'all', start = '', end = '') {
        if(!TherapyVault.isOpen()||router('financial')===false)return;
        TherapyFinance.clear();
        el('finance-start').value=start;el('finance-end').value=end;el('finance-basis').value='cash';
        TherapyFinance.tab(tab);
    }

    function openReports(type = 'attendance', start = '', end = '') {
        if(!TherapyVault.isOpen()||router('reports')===false)return;
        el('reports-type').value=type;el('reports-start').value=start;el('reports-end').value=end;el('reports-patient').value='';el('reports-archived').checked=false;
        TherapyReports.render();TherapyReports.generate(type);
    }

    function openRetention(){
        if(!TherapyVault.isOpen())return;
        const patients=db.patients.filter(p=>state.retentionIds.includes(p.id)&&!p.archived);
        TherapyVault.dialog('Acompanhamentos sem retorno','<p>Confira a situação de cada acompanhamento antes de entrar em contato.</p>'+patients.map(p=>'<p><button type="button" class="therapy-secondary" onclick="TherapyStrategyUI.openRetentionPatient(\''+p.id+'\')">'+esc(p.name)+'</button></p>').join('')+(patients.length?'':'<p>Nenhum acompanhamento neste recorte.</p>'));
    }
    function openRetentionPatient(id){if(!TherapyVault.isOpen())return;el('therapy-dialog')?.remove();TherapyPatients.open(id);}
    function reset(){state.horizon='6m';state.retentionIds=[];el('dashboard-panel-strategic')?.replaceChildren();}

    function openPatients() {
        if (typeof therapyOpenDashboardPatients === 'function') {
            therapyOpenDashboardPatients();
        } else if (typeof router === 'function') {
            router('patients');
        }
    }

    return {
        render,
        setHorizon,
        openFinance,
        openReports,
        openPatients,openRetention,openRetentionPatient,reset
    };
})();
