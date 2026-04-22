/* eslint-disable no-undef */
// Compact portfolio summary for Projects → Summary. Uses ApexCharts (global, index.html).

const palette = {
    primary: '#5b4fbf',
    primary2: '#0d8f83',
    accent: '#0ea5e9',
    success: '#16b364',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#6366f1',
    slate: '#64748b',
    muted: '#94a3b8'
}

const weeks = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8']
const deliverTrend = {
    name: 'Delivered',
    data: [12, 18, 15, 22, 28, 24, 31, 35]
}
const targetTrend = {
    name: 'Planned',
    data: [14, 16, 18, 20, 22, 25, 28, 30]
}

const statusSplit = {
    labels: ['On track', 'At risk', 'Paused', 'Planning'],
    values: [14, 4, 2, 4]
}
const statusColors = [palette.success, palette.warning, palette.slate, palette.accent]

const kpis = [
    { id: 'p-active', label: 'Active', value: '24', sub: '12 ship this quarter', deltaStr: '+3 vs Q1', up: true, icon: 'icon-pencil-ruler' },
    { id: 'p-health', label: 'Portfolio health', value: '78%', sub: 'weighted on-time', deltaStr: '+5.2% YoY', up: true, icon: 'icon-heartbeat' },
    { id: 'p-risk', label: 'Needs attention', value: '3', sub: 'due in 2 weeks', deltaStr: '1 fewer than last week', up: true, icon: 'icon-flag' }
]

const milestones = [
    { name: 'API freeze — Northwind', when: 'Apr 24', tone: 'urgent' },
    { name: 'Design sign-off: mobile', when: 'Apr 26', tone: 'soon' },
    { name: 'Q2 roadmap review', when: 'Apr 30', tone: 'normal' },
    { name: 'GA — billing microservice', when: 'May 6', tone: 'normal' }
]

let charts = []
let resizeObserver = null
let resizeRaf = null
let resizeEnableTimer = null
let hostRef = null
let lastWidth = 0

function baseFont() {
    return { fontFamily: 'opensans, verdana, sans-serif' }
}

function areaOptions() {
    return {
        chart: {
            type: 'area',
            height: 210,
            toolbar: { show: false, tools: { download: false } },
            sparkline: { enabled: false },
            ...baseFont(),
            animations: { enabled: true, easing: 'easeinout', speed: 260,
                animateGradually: { enabled: true, delay: 35 },
                dynamicAnimation: { enabled: true, speed: 110 } },
            redrawOnParentResize: true,
            redrawOnWindowResize: true
        },
        series: [deliverTrend, targetTrend],
        colors: [palette.primary, palette.muted],
        stroke: { curve: 'smooth', width: [3, 2], dashArray: [0, 5] },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 0.8,
                opacityFrom: 0.35,
                opacityTo: 0.02,
                stops: [0, 90, 100]
            }
        },
        dataLabels: { enabled: false },
        xaxis: {
            categories: weeks,
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: { style: { colors: palette.slate, fontSize: '10px' } }
        },
        yaxis: {
            labels: {
                style: { colors: palette.slate, fontSize: '10px' },
                formatter: v => (Number.isInteger(v) ? v : v.toFixed(0))
            }
        },
        grid: { borderColor: '#e8ebf0', strokeDashArray: 4, padding: { left: 8, right: 8 } },
        legend: {
            position: 'top',
            horizontalAlign: 'right',
            fontSize: '11px',
            fontWeight: 500,
            markers: { size: 5, offsetY: 0 },
            labels: { colors: palette.slate }
        },
        tooltip: { shared: true, intersect: false, x: { show: true } }
    }
}

function donutOptions() {
    return {
        chart: {
            type: 'donut',
            height: 220,
            ...baseFont(),
            animations: { enabled: true, speed: 250, animateGradually: { enabled: true, delay: 40 },
                dynamicAnimation: { speed: 100 } },
            redrawOnParentResize: true,
            redrawOnWindowResize: true
        },
        series: statusSplit.values,
        labels: statusSplit.labels,
        colors: statusColors,
        stroke: { width: 2, colors: ['#fff'] },
        dataLabels: { enabled: false },
        plotOptions: {
            pie: {
                donut: {
                    size: '58%',
                    labels: {
                        show: true,
                        name: { fontSize: '11px', color: palette.slate, offsetY: 16 },
                        value: { fontSize: '22px', fontWeight: 700, color: '#1e293b', offsetY: -4 },
                        total: {
                            show: true,
                            showAlways: true,
                            label: 'Projects',
                            fontSize: '11px',
                            fontWeight: 500,
                            color: palette.slate,
                            formatter: () => '24'
                        }
                    }
                }
            }
        },
        legend: {
            position: 'bottom',
            fontSize: '11px',
            fontWeight: 500,
            markers: { width: 8, height: 8 },
            labels: { colors: palette.slate },
            itemMargin: { horizontal: 6, vertical: 2 }
        }
    }
}

function kpiCard(k) {
    return `
    <div class="ps-kpi" data-kpi="${k.id}">
        <div class="ps-kpi-icon"><span class="${k.icon}"></span></div>
        <div class="ps-kpi-body">
            <div class="ps-kpi-label">${k.label}</div>
            <div class="ps-kpi-value">${k.value}</div>
            <div class="ps-kpi-meta">
                <span class="ps-kpi-delta ${k.up ? 'up' : 'down'}">${k.deltaStr}</span>
                <span class="ps-kpi-sub">${k.sub}</span>
            </div>
        </div>
    </div>`
}

function milestoneRow(m) {
    return `
    <div class="ps-ms-row ps-ms-${m.tone}">
        <div class="ps-ms-dot"></div>
        <div class="ps-ms-text">${m.name}</div>
        <div class="ps-ms-when">${m.when}</div>
    </div>`
}

function layoutHTML() {
    return `
    <div class="projects-summary">
        <header class="ps-head">
            <div class="ps-head-text">
                <h1 class="ps-title">Portfolio summary</h1>
                <p class="ps-sub">Snapshot across all programs · demo data</p>
            </div>
            <div class="ps-badges">
                <span class="ps-badge ps-badge-live"><span class="ps-pulse"></span>Live</span>
                <span class="ps-badge">Fiscal YTD</span>
            </div>
        </header>

        <section class="ps-kpis">${kpis.map(kpiCard).join('')}</section>

        <div class="ps-grid">
            <article class="ps-card ps-card-trend">
                <div class="ps-card-h">
                    <div>
                        <h2 class="ps-card-t">Velocity vs plan</h2>
                        <p class="ps-card-s">Shipped scope · last 8 sprints (story points)</p>
                    </div>
                    <span class="ps-pill">+8% vs Q1</span>
                </div>
                <div id="ps-area" class="ps-chart"></div>
            </article>
            <article class="ps-card ps-card-mix">
                <div class="ps-card-h">
                    <div>
                        <h2 class="ps-card-t">By status</h2>
                        <p class="ps-card-s">How work is distributed today</p>
                    </div>
                </div>
                <div id="ps-donut" class="ps-chart"></div>
            </article>
        </div>

        <section class="ps-upcoming">
            <div class="ps-up-h">
                <h2 class="ps-card-t">Upcoming in 2 weeks</h2>
                <a class="ps-link" href="#/projects/milestones">Milestones →</a>
            </div>
            <div class="ps-ms-list">
                ${milestones.map(milestoneRow).join('')}
            </div>
        </section>
    </div>`
}

function triggerResize() {
    if (resizeRaf) cancelAnimationFrame(resizeRaf)
    resizeRaf = requestAnimationFrame(() => {
        resizeRaf = null
        const w = hostRef ? hostRef.clientWidth : 0
        if (w === lastWidth) return
        lastWidth = w
        charts.forEach(c => {
            try {
                c.updateOptions({}, false, false, false)
            } catch (e) { /* noop */ }
        })
    })
}

function destroy() {
    if (resizeObserver) {
        try { resizeObserver.disconnect() } catch (e) { /* noop */ }
        resizeObserver = null
    }
    if (resizeRaf) { cancelAnimationFrame(resizeRaf); resizeRaf = null }
    if (resizeEnableTimer) { clearTimeout(resizeEnableTimer); resizeEnableTimer = null }
    charts.forEach(c => { try { c.destroy() } catch (e) { /* noop */ } })
    charts = []
    hostRef = null
    lastWidth = 0
}

function render(hostEl) {
    destroy()
    hostRef = hostEl
    hostEl.innerHTML = layoutHTML()

    if (typeof ApexCharts === 'undefined') {
        console.warn('ApexCharts not loaded')
        return
    }

    const a = new ApexCharts(hostEl.querySelector('#ps-area'), areaOptions())
    const d = new ApexCharts(hostEl.querySelector('#ps-donut'), donutOptions())
    a.render()
    d.render()
    charts = [a, d]

    lastWidth = hostEl.clientWidth
    resizeEnableTimer = setTimeout(() => {
        resizeEnableTimer = null
        if (typeof ResizeObserver !== 'undefined' && hostRef === hostEl) {
            resizeObserver = new ResizeObserver(triggerResize)
            resizeObserver.observe(hostEl)
        }
    }, 350)
}

export default { render, destroy }
