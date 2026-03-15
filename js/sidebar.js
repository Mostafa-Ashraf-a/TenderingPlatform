/**
 * sidebar.js - Handles the dynamic generation of the sidebar based on user roles
 */

const sidebarConfig = {
    publisher: [
        { id: "dashboard", label: "لوحة التحكم الرئيسية", icon: "fa-solid fa-chart-line", action: "loadPublisherDashboard" },
        { id: "my-deals", label: "إدارة الصفقات", icon: "fa-solid fa-briefcase", action: "loadMyDeals" },
        { id: "new-deal", label: "إنشاء صفقة جديدة", icon: "fa-solid fa-plus-circle", action: "loadNewDeal" },
        { id: "manage-bids", label: "إدارة ومقارنة العروض", icon: "fa-solid fa-scale-balanced", action: "loadManageBids" },
        { id: "companies", label: "إدارة الشركات", icon: "fa-solid fa-building", action: "loadCompanies" },
        { id: "reports", label: "التقارير المتقدمة", icon: "fa-solid fa-file-contract", action: "loadReports" }
    ],
    bidder: [
        { id: "dashboard", label: "لوحة تحكم المورد", icon: "fa-solid fa-chart-pie", action: "loadBidderDashboard" },
        { id: "explore", label: "استكشاف الصفقات", icon: "fa-solid fa-magnifying-glass", action: "loadExploreDeals" },
        { id: "my-bids", label: "العروض المقدمة", icon: "fa-solid fa-file-signature", action: "loadMyBids" },
        { id: "ai-matcher", label: "توصيات الذكاء الاصطناعي", icon: "fa-solid fa-robot", action: "loadAIRecommendations" }
    ],
    admin: [
        { id: "dashboard", label: "الإحصائيات العامة", icon: "fa-solid fa-chart-bar", action: "loadAdminDashboard" },
        { id: "users", label: "مستقطبات AI والتوثيق", icon: "fa-solid fa-users", action: "loadUsers" },
        { id: "companies", label: "إدارة الشركات", icon: "fa-solid fa-building", action: "loadCompanies" },
        { id: "categories", label: "إدارة التصنيفات", icon: "fa-solid fa-tags", action: "loadCategories" },
        { id: "disputes", label: "إدارة النزاعات", icon: "fa-solid fa-gavel", action: "loadDisputes" },
        { id: "settings", label: "إعدادات المنصة", icon: "fa-solid fa-cogs", action: "loadSettings" }
    ]
};

function renderSidebar() {
    const role = mockDB.currentUser.role;
    const items = sidebarConfig[role];
    const container = document.getElementById('sidebar-container');

    const roleTitle = role === 'publisher' ? 'حساب المشتري/الناشر' : role === 'bidder' ? 'حساب المورد/البائع' : 'الإدارة العامة';

    let html = `
        <div class="sidebar-header">
            <div class="sidebar-logo">
                <i class="fa-solid fa-bolt"></i>
            </div>
            <div class="sidebar-brand">
                <h1>الصفقات</h1>
                <p>${roleTitle}</p>
            </div>
        </div>
        <ul class="sidebar-menu">
    `;

    items.forEach((item, index) => {
        const isActive = index === 0 ? 'active' : '';
        html += `
            <li class="sidebar-item">
                <a href="#" class="sidebar-link ${isActive}" data-action="${item.action}" onclick="handleSidebarClick(event, this)">
                    <i class="${item.icon}"></i>
                    <span>${item.label}</span>
                </a>
            </li>
        `;
    });

    html += `</ul>`;

    // Role switcher for demo purposes
    html += `
        <div class="sidebar-footer" style="margin-top: auto; border-top: 1px solid var(--border-glass); padding-top: 1rem;">
            <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.5rem;">تغيير العرض (للتجربة):</p>
            <select id="role-switcher" class="glass-panel" style="width: 100%; padding: 0.5rem; background: transparent; color: var(--text-primary); border: 1px solid var(--border-glass); border-radius: 8px;">
                <option value="publisher" ${role === 'publisher' ? 'selected' : ''} style="color: black;">ناشر المزاد (المشتري)</option>
                <option value="bidder" ${role === 'bidder' ? 'selected' : ''} style="color: black;">مقدم العرض (المورد)</option>
                <option value="admin" ${role === 'admin' ? 'selected' : ''} style="color: black;">لوحة الإدارة (Admin)</option>
            </select>
        </div>
    `;

    container.innerHTML = html;

    // Attach event listener to role switcher
    document.getElementById('role-switcher').addEventListener('change', (e) => {
        mockDB.currentUser.role = e.target.value;
        const roleLabels = { publisher: 'ناشر (مشتري)', bidder: 'مقدم عرض (مورد)', admin: 'إدارة المنصة (Admin)' };
        document.getElementById('current-user-role').innerText = roleLabels[e.target.value];
        renderSidebar(); // Re-render sidebar
        // Trigger initial load based on new role
        const firstAction = sidebarConfig[e.target.value][0].action;
        if (window[firstAction]) window[firstAction]();
    });
}

function handleSidebarClick(event, element) {
    event.preventDefault();

    // Remove active class from all
    document.querySelectorAll('.sidebar-link').forEach(link => link.classList.remove('active'));

    // Add active class to clicked
    element.classList.add('active');

    // Update Page Title
    document.getElementById('page-title').innerText = element.querySelector('span').innerText;

    // Execute Action mapping
    const action = element.getAttribute('data-action');
    if (window[action] && typeof window[action] === 'function') {
        window[action]();
    } else {
        document.getElementById('main-content').innerHTML = `
            <div class="glass-panel" style="padding: 3rem; text-align: center;">
                <h3 class="text-gradient" style="font-size: 2rem; margin-bottom: 1rem;">جاري بناء هذه الصفحة...</h3>
                <p style="color: var(--text-secondary);">الوظيفة المطلوبة: <code>${action}</code> قيد التطوير حالياً.</p>
            </div>
        `;
    }
}

// Wait for DOM to init
document.addEventListener('DOMContentLoaded', () => {
    // Initial Render
    renderSidebar();
});
