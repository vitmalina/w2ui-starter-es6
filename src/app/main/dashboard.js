/* eslint-disable no-undef */
// Demo Dashboard module for the Main section.
// Uses ApexCharts (loaded globally via <script> in index.html).

// ---- Mock data ----------------------------------------------------

const palette = {
    primary:   '#6c3bd1',
    primary2:  '#a10a8d',
    accent:    '#25a2eb',
    success:   '#16b364',
    warning:   '#f7a32b',
    danger:    '#ef4444',
    info:      '#06b6d4',
    slate:     '#64748b',
    inkSoft:   '#8a8a8a'
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const kpis = [
    { id: 'revenue',  label: 'Total Revenue',     value: '$248.4K', delta:  12.4, icon: 'icon-coin-dollar', tone: 'primary' },
    { id: 'users',    label: 'Active Users',      value: '18,942',  delta:   8.1, icon: 'icon-users',       tone: 'accent'  },
    { id: 'orders',   label: 'Orders Processed',  value: '3,217',   delta:  -2.6, icon: 'icon-box-many',    tone: 'warning' },
    { id: 'uptime',   label: 'System Uptime',     value: '99.98%',  delta:   0.2, icon: 'icon-rocket',      tone: 'success' }
]

// Revenue vs Target per month (bar)
const revenueSeries = {
    revenue: [38, 42, 51, 47, 63, 72, 68, 85, 79, 92, 105, 118],
    target:  [40, 45, 50, 55, 60, 65, 70, 75, 80, 85,  95, 105]
}

// Radial performance metrics
const performance = [
    { label: 'CPU',           value: 68, color: palette.accent  },
    { label: 'Memory',        value: 82, color: palette.warning },
    { label: 'Storage',       value: 41, color: palette.success },
    { label: 'Network I/O',   value: 57, color: palette.primary }
]

// Traffic trend (area)
const trafficSeries = [
    { name: 'Sessions',  data: [1120, 1340, 1260, 1580, 1720, 1890, 2105, 2240, 2180, 2460, 2630, 2820] },
    { name: 'Visitors',  data: [ 820,  910,  880, 1050, 1180, 1300, 1460, 1580, 1540, 1720, 1860, 2010] }
]

// Revenue split by channel (donut)
const channels = {
    labels: ['Direct', 'Organic', 'Referral', 'Social', 'Email'],
    values: [38, 27, 14, 12, 9]
}

// Activity feed
const activity = [
    { icon: 'icon-check',      tone: 'success', title: 'Deployment #482 succeeded',       time: '2 min ago' },
    { icon: 'icon-users',      tone: 'accent',  title: '24 new users signed up today',     time: '18 min ago' },
    { icon: 'icon-fire',       tone: 'warning', title: 'Latency spike detected on EU-3',   time: '1 hour ago' },
    { icon: 'icon-coin-dollar',tone: 'primary', title: 'Invoice #A-1029 paid ($12,480)',   time: '3 hours ago' },
    { icon: 'icon-comment',    tone: 'info',    title: 'New feedback from Acme Corp',      time: 'yesterday'  }
]

// ---- Chart factories ----------------------------------------------

function baseFont() {
    return { fontFamily: 'opensans, verdana, sans-serif' }
}

function barChartOptions() {
    return {
        chart: {
            type: 'bar',
            height: 320,
            toolbar: { show: false },
            ...baseFont(),
            redrawOnParentResize: true,
            redrawOnWindowResize: true,
            animations: { enabled: true, easing: 'easeinout', speed: 400,
                animateGradually: { enabled: false }, dynamicAnimation: { enabled: true, speed: 250 } }
        },
        series: [
            { name: 'Revenue', data: revenueSeries.revenue },
            { name: 'Target',  data: revenueSeries.target  }
        ],
        colors: [palette.primary, palette.accent],
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                borderRadius: 6,
                borderRadiusApplication: 'end'
            }
        },
        dataLabels: { enabled: false },
        stroke: { show: true, width: 2, colors: ['transparent'] },
        xaxis: {
            categories: months,
            axisTicks: { show: false },
            axisBorder: { show: false },
            labels: { style: { colors: palette.slate, fontSize: '12px' } }
        },
        yaxis: {
            labels: {
                style: { colors: palette.slate, fontSize: '12px' },
                formatter: v => '$' + v + 'K'
            }
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'light',
                type: 'vertical',
                shadeIntensity: 0.25,
                gradientToColors: [palette.primary2, '#73c9ff'],
                opacityFrom: 0.95,
                opacityTo: 0.85,
                stops: [0, 100]
            }
        },
        grid: { borderColor: '#eef0f4', strokeDashArray: 4 },
        legend: {
            position: 'top',
            horizontalAlign: 'right',
            markers: { radius: 12 },
            labels: { colors: palette.slate }
        },
        tooltip: {
            y: { formatter: v => '$' + v + 'K' }
        }
    }
}

function radialChartOptions() {
    return {
        chart: {
            type: 'radialBar',
            height: 340,
            ...baseFont(),
            redrawOnParentResize: true,
            redrawOnWindowResize: true,
            animations: { enabled: true, speed: 400,
                animateGradually: { enabled: false }, dynamicAnimation: { enabled: true, speed: 250 } }
        },
        series: performance.map(p => p.value),
        labels: performance.map(p => p.label),
        colors: performance.map(p => p.color),
        plotOptions: {
            radialBar: {
                hollow: { size: '32%' },
                track: { background: '#f1f2f6', strokeWidth: '100%', margin: 6 },
                dataLabels: {
                    name: { fontSize: '14px', color: palette.slate, offsetY: -4 },
                    value: {
                        fontSize: '18px',
                        fontWeight: 600,
                        color: '#333',
                        formatter: v => v + '%'
                    },
                    total: {
                        show: true,
                        label: 'Health',
                        color: palette.primary,
                        fontSize: '13px',
                        fontWeight: 600,
                        formatter() {
                            const sum = performance.reduce((a, p) => a + p.value, 0)
                            return Math.round(sum / performance.length) + '%'
                        }
                    }
                }
            }
        },
        stroke: { lineCap: 'round' },
        legend: {
            show: true,
            position: 'bottom',
            labels: { colors: palette.slate },
            markers: { radius: 12 }
        }
    }
}

function trafficChartOptions() {
    return {
        chart: {
            type: 'area',
            height: 280,
            toolbar: { show: false },
            ...baseFont(),
            redrawOnParentResize: true,
            redrawOnWindowResize: true,
            animations: { enabled: true, easing: 'easeinout', speed: 400,
                animateGradually: { enabled: false }, dynamicAnimation: { enabled: true, speed: 250 } }
        },
        series: trafficSeries,
        colors: [palette.primary, palette.accent],
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 3 },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.45,
                opacityTo: 0.05,
                stops: [0, 90, 100]
            }
        },
        xaxis: {
            categories: months,
            axisTicks: { show: false },
            axisBorder: { show: false },
            labels: { style: { colors: palette.slate, fontSize: '12px' } }
        },
        yaxis: {
            labels: {
                style: { colors: palette.slate, fontSize: '12px' },
                formatter: v => (v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v)
            }
        },
        grid: { borderColor: '#eef0f4', strokeDashArray: 4 },
        legend: { position: 'top', horizontalAlign: 'right', labels: { colors: palette.slate } },
        tooltip: { shared: true, intersect: false }
    }
}

function donutChartOptions() {
    return {
        chart: { type: 'donut', height: 300, ...baseFont(),
            redrawOnParentResize: true, redrawOnWindowResize: true,
            animations: { enabled: true, speed: 400,
                animateGradually: { enabled: false }, dynamicAnimation: { enabled: true, speed: 250 } } },
        series: channels.values,
        labels: channels.labels,
        colors: [palette.primary, palette.accent, palette.warning, palette.success, palette.info],
        stroke: { width: 0 },
        legend: { position: 'bottom', labels: { colors: palette.slate } },
        dataLabels: {
            style: { fontSize: '12px', fontWeight: 600 },
            dropShadow: { enabled: false }
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '68%',
                    labels: {
                        show: true,
                        name:  { fontSize: '13px', color: palette.slate },
                        value: { fontSize: '20px', fontWeight: 700, color: '#333', formatter: v => v + '%' },
                        total: {
                            show: true,
                            label: 'Total share',
                            color: palette.primary,
                            formatter: () => '100%'
                        }
                    }
                }
            }
        }
    }
}

// ---- Rendering ----------------------------------------------------

let charts = []
let resizeObserver = null
let resizeTimer = null
let hostRef = null

function kpiCardHTML(k) {
    const up       = k.delta >= 0
    const deltaStr = (up ? '+' : '') + k.delta.toFixed(1) + '%'
    const arrow    = up ? '▲' : '▼'
    return `
        <div class="kpi-card kpi-${k.tone}">
            <div class="kpi-icon"><span class="${k.icon}"></span></div>
            <div class="kpi-body">
                <div class="kpi-label">${k.label}</div>
                <div class="kpi-value">${k.value}</div>
                <div class="kpi-delta ${up ? 'up' : 'down'}">
                    <span class="arrow">${arrow}</span> ${deltaStr}
                    <span class="kpi-delta-sub">vs last month</span>
                </div>
            </div>
            <div class="kpi-spark">
                <svg viewBox="0 0 100 30" preserveAspectRatio="none">
                    <polyline points="${sparklinePoints()}"
                        fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                </svg>
            </div>
        </div>`
}

function sparklinePoints() {
    let pts = []
    let y = 15 + (Math.random() * 6 - 3)
    for (let i = 0; i <= 20; i++) {
        y += (Math.random() - 0.5) * 6
        y = Math.max(3, Math.min(27, y))
        pts.push((i * 5) + ',' + y.toFixed(1))
    }
    return pts.join(' ')
}

function activityHTML() {
    return activity.map(a => `
        <div class="activity-row">
            <div class="activity-icon activity-${a.tone}"><span class="${a.icon}"></span></div>
            <div class="activity-text">
                <div class="activity-title">${a.title}</div>
                <div class="activity-time">${a.time}</div>
            </div>
        </div>
    `).join('')
}

function layoutHTML() {
    return `
        <div class="dashboard-root">
            <div class="dashboard-header">
                <div>
                    <div class="dashboard-title">Dashboard</div>
                    <div class="dashboard-subtitle">Live overview · updated just now</div>
                </div>
                <div class="dashboard-chips">
                    <span class="chip chip-live"><span class="dot"></span>Live</span>
                    <span class="chip">Last 12 months</span>
                </div>
            </div>

            <div class="kpi-grid">
                ${kpis.map(kpiCardHTML).join('')}
            </div>

            <div class="charts-grid">
                <div class="card card-wide">
                    <div class="card-head">
                        <div>
                            <div class="card-title">Revenue vs Target</div>
                            <div class="card-sub">Monthly performance for the current fiscal year</div>
                        </div>
                        <div class="card-pill pill-primary">+24.8%</div>
                    </div>
                    <div id="dash-bar"></div>
                </div>

                <div class="card">
                    <div class="card-head">
                        <div>
                            <div class="card-title">System Performance</div>
                            <div class="card-sub">Real-time infrastructure health</div>
                        </div>
                        <div class="card-pill pill-success">Healthy</div>
                    </div>
                    <div id="dash-radial"></div>
                </div>

                <div class="card card-wide">
                    <div class="card-head">
                        <div>
                            <div class="card-title">Traffic Trend</div>
                            <div class="card-sub">Sessions &amp; unique visitors</div>
                        </div>
                        <div class="card-pill pill-accent">+18.3%</div>
                    </div>
                    <div id="dash-traffic"></div>
                </div>

                <div class="card">
                    <div class="card-head">
                        <div>
                            <div class="card-title">Revenue by Channel</div>
                            <div class="card-sub">Share of total revenue</div>
                        </div>
                    </div>
                    <div id="dash-donut"></div>
                </div>

                <div class="card card-wide card-activity">
                    <div class="card-head">
                        <div>
                            <div class="card-title">Recent Activity</div>
                            <div class="card-sub">Latest system events and user actions</div>
                        </div>
                        <a class="card-link" href="#/home">View all</a>
                    </div>
                    <div class="activity-list">
                        ${activityHTML()}
                    </div>
                </div>
            </div>
        </div>
    `
}

function destroy() {
    if (resizeObserver) {
        try { resizeObserver.disconnect() } catch (e) { /* noop */ }
        resizeObserver = null
    }
    if (resizeTimer) {
        clearTimeout(resizeTimer)
        resizeTimer = null
    }
    charts.forEach(c => { try { c.destroy() } catch (e) { /* noop */ } })
    charts = []
    hostRef = null
}

function triggerResize() {
    // Debounced but snappy (~40ms); pushes every chart to match its container.
    if (resizeTimer) clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
        resizeTimer = null
        charts.forEach(c => {
            try {
                // updateOptions with redrawPaths=false keeps it fast
                c.updateOptions({}, false, false, false)
            } catch (e) { /* noop */ }
        })
    }, 40)
}

function render(hostEl) {
    destroy()
    hostRef = hostEl
    hostEl.innerHTML = layoutHTML()

    // ApexCharts is expected to be loaded globally via <script>
    if (typeof ApexCharts === 'undefined') {
        console.warn('ApexCharts not loaded')
        return
    }

    const bar = new ApexCharts(hostEl.querySelector('#dash-bar'), barChartOptions())
    const rad = new ApexCharts(hostEl.querySelector('#dash-radial'), radialChartOptions())
    const trf = new ApexCharts(hostEl.querySelector('#dash-traffic'), trafficChartOptions())
    const dnt = new ApexCharts(hostEl.querySelector('#dash-donut'), donutChartOptions())

    bar.render(); rad.render(); trf.render(); dnt.render()
    charts = [bar, rad, trf, dnt]

    // Snappy reflow: observe the host so charts resize when the layout/panel
    // changes size (w2layout doesn't always fire window 'resize').
    if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(triggerResize)
        resizeObserver.observe(hostEl)
    }
}

export default { render, destroy }
