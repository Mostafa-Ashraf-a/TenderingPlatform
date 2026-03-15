/**
 * main.js - Core functionality, Routing simulation, and AI Animations
 */

document.addEventListener('DOMContentLoaded', () => {
    // Topbar Toggle Sidebar Mobile
    const toggleBtn = document.getElementById('toggle-sidebar');
    const sidebar = document.querySelector('.sidebar');

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    // AI Assistant Button Glow Effect & Demo
    const aiBtn = document.querySelector('.ai-assistant-btn');
    if (aiBtn) {
        aiBtn.addEventListener('click', () => {
            simulateAILoading([
                "تحليل بيانات السوق الحالية...",
                "مراجعة الصفقات المشابهة...",
                "استخلاص التوصيات الأولية...",
                "تجهيز الرد الذكي..."
            ], () => {
                alert("الذكاء الاصطناعي: أهلاً بك! يمكنني مساعدتك في صياغة كراسة الشروط أو اقتراح موردين بناءً على تحليلات المنصة.");
            });
        });
    }

    // Initial Dashboard Load Delay (for effect)
    setTimeout(() => {
        const currentRole = getCurrentRoleConfig(); // from data.js
        if (currentRole === 'publisher') loadPublisherDashboard();
        else if (currentRole === 'bidder') loadBidderDashboard();
        else loadAdminDashboard();
    }, 500);
});

/**
 * AI Loading Simulation (The "Wow" factor animation)
 * @param {Array} steps - Array of string steps to display
 * @param {Function} callback - Function to execute after loading
 */
window.simulateAILoading = function (steps, callback) {
    const overlay = document.getElementById('ai-overlay');
    const stepsContainer = document.getElementById('ai-steps');

    if (!overlay || !stepsContainer) return;

    // Reset
    stepsContainer.innerHTML = '';
    overlay.classList.remove('hidden', 'fade-out');

    let currentStep = 0;

    const renderStep = () => {
        if (currentStep < steps.length) {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fa-solid fa-microchip"></i> <span>${steps[currentStep]}</span>`;
            stepsContainer.appendChild(li);

            // Animate in
            setTimeout(() => {
                li.classList.add('active');
            }, 100);

            currentStep++;
            setTimeout(renderStep, 800 + Math.random() * 500); // Random delay between steps
        } else {
            // Finish
            setTimeout(() => {
                const finalLi = document.createElement('li');
                finalLi.innerHTML = `<i class="fa-solid fa-check-circle" style="color: var(--success);"></i> <span style="color: white; font-weight: bold;">اكتمل التحليل بنجاح</span>`;
                finalLi.classList.add('active');
                stepsContainer.appendChild(finalLi);

                setTimeout(() => {
                    overlay.classList.add('fade-out');
                    setTimeout(() => {
                        overlay.classList.add('hidden');
                        if (callback) callback();
                    }, 500);
                }, 1000);
            }, 500);
        }
    };

    renderStep();
};

// ==========================================
// Routing Simulation (Mocking Page Loads)
// ==========================================

const mainContent = document.getElementById('main-content');

// Helper to inject HTML with a fade-in effect
function injectView(html) {
    mainContent.style.opacity = 0;
    setTimeout(() => {
        mainContent.innerHTML = html;
        mainContent.style.transition = "opacity 0.3s ease";
        mainContent.style.opacity = 1;
    }, 200);
}

// Publisher Views
window.loadPublisherDashboard = function () {
    const stats = mockDB.stats.publisher;
    const html = `
        <div class="dashboard-header" style="margin-bottom: 2rem;">
            <h2 class="text-gradient">ملخص النشاط (الناشر)</h2>
            <p style="color: var(--text-secondary);">نظرة عامة على صفقاتك وعروضك الحالية</p>
        </div>

        <div class="stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
            <div class="glass-panel" style="padding: 1.5rem; border-left: 4px solid var(--info);">
                <div style="font-size: 2rem; font-weight: bold; color: var(--text-primary);">${stats.activeTenders}</div>
                <div style="color: var(--text-secondary); font-size: 0.9rem;">صفقات نشطة</div>
            </div>
            <div class="glass-panel" style="padding: 1.5rem; border-left: 4px solid var(--success);">
                <div style="font-size: 2rem; font-weight: bold; color: var(--text-primary);">${stats.receivedBids}</div>
                <div style="color: var(--text-secondary); font-size: 0.9rem;">عروض مستلمة</div>
            </div>
            <div class="glass-panel" style="padding: 1.5rem; border-left: 4px solid var(--accent-color);">
                <div style="font-size: 2rem; font-weight: bold; color: var(--text-primary);">${stats.awardedDeals}</div>
                <div style="color: var(--text-secondary); font-size: 0.9rem;">صفقات تمت ترسيتها</div>
            </div>
            <div class="glass-panel" style="padding: 1.5rem; border-left: 4px solid var(--danger);">
                <div style="font-size: 2rem; font-weight: bold; color: var(--text-primary);">${stats.closedTenders}</div>
                <div style="color: var(--text-secondary); font-size: 0.9rem;">صفقات مغلقة</div>
            </div>
        </div>

        <div class="dashboard-widgets" style="display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem;">
            <div class="glass-panel" style="padding: 1.5rem;">
                <h3 style="margin-bottom: 1rem; border-bottom: 1px solid var(--border-glass); padding-bottom: 0.5rem;">أحدث الصفقات النشطة</h3>
                <table style="width: 100%; text-align: right; border-collapse: collapse;">
                    <thead>
                        <tr style="color: var(--text-muted); border-bottom: 1px solid var(--border-glass);">
                            <th style="padding: 0.75rem 0;">اسم الصفقة</th>
                            <th>النوع</th>
                            <th>تاريخ الإغلاق</th>
                            <th>العروض</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${mockDB.deals.filter(d => d.status === 'نشط').map(d => `
                            <tr style="border-bottom: 1px solid var(--border-glass);">
                                <td style="padding: 1rem 0; font-weight: 600; color: var(--primary-light);">${d.title}</td>
                                <td>${d.type}</td>
                                <td>${d.endDate}</td>
                                <td><span class="badge" style="background: var(--info); padding: 0.2rem 0.5rem; border-radius: 4px;">${d.bidsCount} عروض</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <div class="glass-panel" style="padding: 1.5rem;">
                <h3 style="margin-bottom: 1rem; color: var(--accent-color); border-bottom: 1px solid var(--border-glass); padding-bottom: 0.5rem;">
                    <i class="fa-solid fa-robot"></i> تنبيهات الذكاء الاصطناعي
                </h3>
                <ul style="list-style: none; display: flex; flex-direction: column; gap: 1rem;">
                    <li style="background: rgba(245, 158, 11, 0.1); padding: 1rem; border-radius: 8px; border-right: 3px solid var(--accent-color);">
                        <strong style="display: block; font-size: 0.9rem; color: var(--text-primary);">تحسين كراسة الشروط</strong>
                        <span style="font-size: 0.8rem; color: var(--text-secondary);">يوجد نقص في معايير التقييم لمناقصة "توريد أجهزة حواسيب". نوصي بإضافتها لجذب عروض أفضل.</span>
                    </li>
                    <li style="background: rgba(16, 185, 129, 0.1); padding: 1rem; border-radius: 8px; border-right: 3px solid var(--success);">
                        <strong style="display: block; font-size: 0.9rem; color: var(--text-primary);">موردون جدد متاحون</strong>
                        <span style="font-size: 0.8rem; color: var(--text-secondary);">تم العثور على 3 موردين متوافقين بنسبة 95% مع نشاطك. <a href="#" style="color: var(--primary-light);">دعوتهم الآن؟</a></span>
                    </li>
                </ul>
            </div>
        </div>
    `;
    injectView(html);
};

window.loadBidderDashboard = function () {
    const stats = mockDB.stats.bidder;
    const html = `
        <div class="dashboard-header" style="margin-bottom: 2rem;">
            <h2 class="text-gradient">ملخص النشاط (مقدم العروض)</h2>
            <p style="color: var(--text-secondary);">مرحباً بك في لوحة تحكم المورد. استكشف الفرص وتابع عروضك.</p>
        </div>

        <div class="stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
            <div class="glass-panel" style="padding: 1.5rem; border-left: 4px solid var(--primary-light);">
                <div style="font-size: 2rem; font-weight: bold; color: var(--text-primary);">${stats.availableTenders}</div>
                <div style="color: var(--text-secondary); font-size: 0.9rem;">فرص متاحة للمشاركة</div>
            </div>
            <div class="glass-panel" style="padding: 1.5rem; border-left: 4px solid var(--info);">
                <div style="font-size: 2rem; font-weight: bold; color: var(--text-primary);">${stats.submittedBids}</div>
                <div style="color: var(--text-secondary); font-size: 0.9rem;">عروض قيد التقييم</div>
            </div>
            <div class="glass-panel" style="padding: 1.5rem; border-left: 4px solid var(--success);">
                <div style="font-size: 2rem; font-weight: bold; color: var(--text-primary);">${stats.acceptedBids}</div>
                <div style="color: var(--text-secondary); font-size: 0.9rem;">عروض مقبولة (فائزة)</div>
            </div>
            <div class="glass-panel" style="padding: 1.5rem; border-left: 4px solid var(--danger);">
                <div style="font-size: 2rem; font-weight: bold; color: var(--text-primary);">${stats.rejectedBids}</div>
                <div style="color: var(--text-secondary); font-size: 0.9rem;">عروض مرفوضة</div>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem;">
            <!-- Recommended Deals -->
            <div class="glass-panel" style="padding: 1.5rem;">
                <h3 style="margin-bottom: 1rem; color: var(--text-primary); border-bottom: 1px solid var(--border-glass); padding-bottom: 0.5rem;">
                    <i class="fa-solid fa-wand-magic-sparkles" style="color: var(--accent-color);"></i> صفقات مرتبطة بمجالك (موصى بها)
                </h3>
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    ${mockDB.deals.filter(d => d.status === 'نشط').slice(0, 2).map(d => `
                        <div class="deal-row" style="padding: 1rem; border: 1px solid var(--border-glass); border-radius: 8px; display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.02);">
                            <div>
                                <h4 style="color: var(--primary-color); margin-bottom: 0.25rem;">${d.title}</h4>
                                <div style="font-size: 0.85rem; color: var(--text-secondary); display: flex; gap: 1rem; align-items: center;">
                                    <span>${d.type === 'مزاد' ? '<i class="fa-solid fa-gavel"></i>' : '<i class="fa-solid fa-file-contract"></i>'} ${d.type}</span>
                                    <span><i class="fa-regular fa-clock"></i> ينتهي: ${d.endDate}</span>
                                    <span style="color: var(--success);"><i class="fa-solid fa-bolt"></i> توافق الذكاء الاصطناعي: ${d.aiScore}%</span>
                                </div>
                            </div>
                            <button class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.85rem;" onclick="loadDealDetails('${d.id}')">تقديم عرض</button>
                        </div>
                    `).join('')}
                </div>
                <div style="text-align: center; margin-top: 1rem;">
                    <button class="btn" style="background: transparent; border: 1px solid var(--primary-light); color: var(--primary-light); width: 100%;" onclick="loadExploreDeals()">استكشاف المزيد من الصفقات</button>
                </div>
            </div>

            <!-- AI Market Insights -->
            <div class="glass-panel" style="padding: 1.5rem; background: linear-gradient(135deg, rgba(79, 70, 229, 0.05), rgba(52, 211, 153, 0.05)); border-color: rgba(79, 70, 229, 0.2);">
                <h3 style="margin-bottom: 1rem; color: var(--primary-light);"><i class="fa-solid fa-chart-line"></i> رؤى السوق (AI)</h3>
                <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">
                    في مجال <strong>تقنية المعلومات</strong>، ارتفع الطلب على توريدات الأجهزة بنسبة <strong>15%</strong> هذا الشهر. متوسط الهامش التنافسي للعروض الرابحة هو <strong>8%</strong> أقل من السعر الافتتاحي.
                </p>
                <div style="background: var(--bg-surface); padding: 1rem; border-radius: 8px; border: 1px solid var(--border-glass);">
                    <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem;">فرصة فوزك في صفقات اليوم</div>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div style="width: 100%; height: 8px; background: var(--border-glass); border-radius: 4px; overflow: hidden;">
                            <div style="height: 100%; width: 78%; background: var(--success);"></div>
                        </div>
                        <span style="font-weight: bold; color: var(--success);">78%</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    injectView(html);
}

// Global variable for current filter state
let currentDealsFilter = { query: '', type: 'all', category: 'all' };

window.loadExploreDeals = function () {
    renderExploreDealsView();
}

function renderExploreDealsView() {
    // Apply filters
    const filteredDeals = mockDB.deals.filter(d => {
        if (d.status !== 'نشط') return false; // Show only active for bidders

        const q = currentDealsFilter.query.toLowerCase();
        const matchesQuery = d.title.toLowerCase().includes(q) || d.description.toLowerCase().includes(q);
        const matchesType = currentDealsFilter.type === 'all' || d.type === currentDealsFilter.type;
        const matchesCat = currentDealsFilter.category === 'all' || d.category === currentDealsFilter.category;

        return matchesQuery && matchesType && matchesCat;
    });

    const categories = [...new Set(mockDB.deals.map(d => d.category))];

    const html = `
        <div class="dashboard-header" style="margin-bottom: 2rem;">
            <h2 class="text-gradient">استكشاف الصفقات</h2>
            <p style="color: var(--text-secondary);">ابحث عن المناقصات والمزادات الشاغرة وقم بتصفيتها حسب المجال والميزانية</p>
        </div>

        <div class="glass-panel" style="padding: 1.5rem; margin-bottom: 2rem;">
            <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 1rem;">
                <div style="position: relative;">
                    <i class="fa-solid fa-search" style="position: absolute; right: 1rem; top: 1rem; color: var(--text-muted);"></i>
                    <input type="text" id="filter-query" placeholder="ابحث عن صفقة..." value="${currentDealsFilter.query}" 
                        style="width: 100%; padding: 0.8rem 2.5rem 0.8rem 1rem; border-radius: 8px; border: 1px solid var(--border-glass); background: var(--bg-surface); color: var(--text-primary); font-family: var(--font-body);"
                        onkeyup="if(event.key === 'Enter') applyDealsFilter()">
                </div>
                
                <select id="filter-type" style="padding: 0.8rem; border-radius: 8px; border: 1px solid var(--border-glass); background: var(--bg-surface); color: var(--text-primary); font-family: var(--font-body);" onchange="applyDealsFilter()">
                    <option value="all" ${currentDealsFilter.type === 'all' ? 'selected' : ''}>جميع الأنواع</option>
                    <option value="مناقصة" ${currentDealsFilter.type === 'مناقصة' ? 'selected' : ''}>مناقصة</option>
                    <option value="مزاد" ${currentDealsFilter.type === 'مزاد' ? 'selected' : ''}>مزاد</option>
                </select>

                <select id="filter-category" style="padding: 0.8rem; border-radius: 8px; border: 1px solid var(--border-glass); background: var(--bg-surface); color: var(--text-primary); font-family: var(--font-body);" onchange="applyDealsFilter()">
                    <option value="all" ${currentDealsFilter.category === 'all' ? 'selected' : ''}>جميع المجالات</option>
                    ${categories.map(c => `<option value="${c}" ${currentDealsFilter.category === c ? 'selected' : ''}>${c}</option>`).join('')}
                </select>
            </div>
            <div style="margin-top: 1rem; display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 0.9rem; color: var(--text-secondary);">تم العثور على: <strong>${filteredDeals.length}</strong> صفقة</span>
                <button class="btn btn-primary" onclick="simulateAIFormAssist()"><i class="fa-solid fa-robot"></i> بحث ذكي بالذكاء الاصطناعي</button>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem;">
            ${filteredDeals.map(d => `
                <div class="glass-panel deal-row" style="padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between; border-top: 4px solid var(--primary-light);">
                    <div>
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                            <span class="badge" style="background: rgba(79, 70, 229, 0.1); color: var(--primary-color); padding: 0.3rem 0.6rem; border-radius: 6px; font-size: 0.8rem;">${d.category}</span>
                            <span style="font-size: 0.85rem; color: var(--text-muted);"><i class="fa-solid fa-clock"></i> ينتهي: ${d.endDate}</span>
                        </div>
                        <h3 style="font-size: 1.1rem; color: var(--text-primary); margin-bottom: 0.5rem; min-height: 50px;">${d.title}</h3>
                        <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                            ${d.description}
                        </p>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-glass); padding-top: 1rem;">
                        <div>
                            <span style="font-size: 0.8rem; color: var(--text-muted); display: block;">الميزانية التقديرية</span>
                            <span style="font-weight: bold; color: var(--primary-color);">${d.budget}</span>
                        </div>
                        <button class="btn" style="background: var(--primary-light); color: white; padding: 0.5rem 1rem; font-size: 0.9rem;" onclick="loadDealDetails('${d.id}')">التفاصيل <i class="fa-solid fa-arrow-left" style="margin-right: 0.5rem; margin-left: 0;"></i></button>
                    </div>
                </div>
            `).join('')}
            ${filteredDeals.length === 0 ? `<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">لا توجد صفقات تطابق شروط البحث الحالية.</div>` : ''}
        </div>
    `;
    injectView(html);
}

window.applyDealsFilter = function () {
    currentDealsFilter = {
        query: document.getElementById('filter-query').value,
        type: document.getElementById('filter-type').value,
        category: document.getElementById('filter-category').value
    };
    // Re-render immediately (bypass injectView fade for speed, or re-use it if desired)
    // We'll reuse injectView for simplicity but set fade quickly
    renderExploreDealsView();
}

window.loadDealDetails = function (dealId) {
    const d = mockDB.deals.find(x => x.id === dealId);
    if (!d) return;

    const html = `
        <div style="margin-bottom: 1.5rem;">
            <button class="btn" style="background: transparent; border: 1px solid var(--border-glass); color: var(--text-secondary); padding: 0.4rem 0.8rem;" onclick="loadExploreDeals()"><i class="fa-solid fa-arrow-right"></i> العودة للقائمة</button>
        </div>
        
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem;">
            <!-- التفاصيل الأساسية -->
            <div class="glass-panel" style="padding: 2rem;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border-glass);">
                    <div>
                        <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
                            <span class="badge" style="background: rgba(79, 70, 229, 0.1); color: var(--primary-color); padding: 0.3rem 0.8rem; border-radius: 6px; font-size: 0.85rem;">${d.category}</span>
                            <span class="badge" style="background: rgba(16, 185, 129, 0.1); color: var(--success); padding: 0.3rem 0.8rem; border-radius: 6px; font-size: 0.85rem;">${d.type}</span>
                        </div>
                        <h2 style="color: var(--text-primary); font-size: 1.5rem;">${d.title}</h2>
                    </div>
                </div>

                <div style="margin-bottom: 2rem;">
                    <h3 style="color: var(--primary-light); font-size: 1.1rem; margin-bottom: 1rem;"><i class="fa-solid fa-file-lines"></i> وصف الصفقة وكراسة الشروط</h3>
                    <p style="color: var(--text-secondary); line-height: 1.8; white-space: pre-line;">
                        ${d.description}
                    </p>
                </div>

                <div style="margin-bottom: 2rem; background: var(--bg-surface); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--border-glass);">
                    <h3 style="color: var(--text-primary); font-size: 1.1rem; margin-bottom: 1rem;"><i class="fa-solid fa-paperclip"></i> المرفقات</h3>
                    <div style="display: flex; gap: 1rem;">
                        <a href="#" class="btn" style="background: transparent; border: 1px solid var(--border-glass); color: var(--info); font-size: 0.9rem;" title="محاكاة تحميل الملف"><i class="fa-solid fa-file-pdf"></i> تحميل كراسة الشروط.pdf</a>
                        <a href="#" class="btn" style="background: transparent; border: 1px solid var(--border-glass); color: var(--accent-color); font-size: 0.9rem;" title="محاكاة تحميل الملف"><i class="fa-solid fa-image"></i> صور ومواصفات.zip</a>
                    </div>
                    <div style="margin-top: 1.2rem; display: flex; align-items: center; justify-content: space-between; padding: 1rem; border-radius: 8px; border: 1px dashed rgba(79, 70, 229, 0.3); background: rgba(79, 70, 229, 0.02);">
                        <div style="display: flex; align-items: center; gap: 0.8rem;">
                            <i class="fa-solid fa-wand-magic-sparkles text-gradient" style="font-size: 1.5rem;"></i>
                            <div>
                                <span style="display: block; font-weight: bold; color: var(--text-primary); font-size: 0.95rem;">مساعد المورد الذكي</span>
                                <span style="color: var(--text-secondary); font-size: 0.8rem;">استخرج الشروط واعثر على الإجابات تلقائياً</span>
                            </div>
                        </div>
                        <button class="btn" style="background: linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(16, 185, 129, 0.1)); border: 1px solid var(--primary-light); color: var(--primary-color); font-size: 0.85rem;" onclick="openAIHelperModal('${d.title}')">التلخيص والاستفسار المباشر <i class="fa-solid fa-robot" style="margin-right: 0.5rem;"></i></button>
                    </div>
                </div>

                <!-- NEW: قسم العروض السابقة المجهولة الهوية (منقول ومميز) -->
                <div style="margin-bottom: 2rem; background: rgba(79, 70, 229, 0.05); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--primary-light); box-shadow: 0 4px 15px rgba(0,0,0,0.05); position: relative; overflow: hidden;">
                    <div style="position: absolute; top: 0; right: 0; width: 4px; height: 100%; background: var(--primary-color);"></div>
                    <h3 style="color: var(--text-primary); font-size: 1.1rem; margin-bottom: 1rem; display: flex; align-items: center; justify-content: space-between;">
                        <span><i class="fa-solid fa-users-viewfinder" style="color: var(--primary-light); margin-left: 0.5rem;"></i> العروض المقدمة مسبقاً (هويات مخفية)</span>
                        <span class="badge" style="background: var(--primary-color); color: white; font-size: 0.8rem; padding: 0.2rem 0.6rem; border-radius: 12px; font-weight: normal;">ميزة حصرية للمنصة</span>
                    </h3>
                    <p style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 1.2rem; line-height: 1.6;">تظهر هذه الأسعار للمنافسة الفعلية لمقدمي العروض الآخرين لمساعدتك على تسعير عرضك بشكل تنافسي ذكي قبل الإغلاق.</p>
                    <div style="display: flex; flex-direction: column; gap: 0.8rem;">
                        ${
        // توظيف بيانات وهمية لعروض سابقة إذا وُجد تفاعل
        d.bidsCount > 0 ?
            Array.from({ length: Math.min(d.bidsCount, 3) }).map((_, i) => {
                const randomDiscount = 1 - (Math.random() * 0.15); // Randomly 1% to 15% cheaper
                const estBudgetVal = parseInt(d.budget.replace(/[^0-9]/g, '')) || 100000;
                const bidVal = Math.round((estBudgetVal * randomDiscount) / 1000) * 1000;
                return `
                                <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: var(--bg-base); border: 1px solid var(--border-glass); border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.02); transition: var(--transition-fast);" onmouseover="this.style.transform='translateY(-2px)';" onmouseout="this.style.transform='translateY(0)';">
                                    <div style="display: flex; align-items: center; gap: 0.6rem;">
                                        <div style="width: 36px; height: 36px; background: rgba(0,0,0,0.03); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--text-secondary);">
                                            <i class="fa-solid fa-user-secret"></i>
                                        </div>
                                        <span style="font-size: 0.95rem; color: var(--text-secondary); font-weight: 600;">عارض مجهول #${i + 1}</span>
                                    </div>
                                    <div style="text-align: left;">
                                        <strong style="color: var(--primary-color); font-size: 1.15rem; display: block;">${bidVal.toLocaleString()} ج.م</strong>
                                    </div>
                                </div>
                                `;
            }).join('')
            : '<div style="text-align:center; padding: 1.5rem; color: var(--text-primary); font-size: 0.95rem; background: var(--bg-base); border-radius: 6px; border: 1.5px dashed var(--border-glass);"><i class="fa-solid fa-star" style="color: var(--accent-color); font-size: 1.2rem; margin-bottom: 0.5rem; display: block;"></i>أنت أول المتقدمين لهذه الصفقة! قدم أفضل سعر لديك لتزيد فرصتك بالفوز.</div>'
        }
                    </div>
                </div>
            </div>

            <!-- معلومات الدفع والمشاركة -->
            <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                <div class="glass-panel" style="padding: 1.5rem;">
                    <h3 style="margin-bottom: 1.5rem; color: var(--text-primary); border-bottom: 1px solid var(--border-glass); padding-bottom: 0.5rem;">معلومات المشاركة</h3>
                    
                    <ul style="list-style: none; display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem;">
                        <li style="display: flex; justify-content: space-between; padding-bottom: 0.5rem; border-bottom: 1px dashed var(--border-glass);">
                            <span style="color: var(--text-secondary);">آخر موعد للتقديم</span>
                            <strong style="color: var(--text-primary);">${d.endDate}</strong>
                        </li>
                        <li style="display: flex; justify-content: space-between; padding-bottom: 0.5rem; border-bottom: 1px dashed var(--border-glass);">
                            <span style="color: var(--text-secondary);">الميزانية التقديرية</span>
                            <strong style="color: var(--primary-color);">${d.budget}</strong>
                        </li>
                        <li style="display: flex; justify-content: space-between; padding-bottom: 0.5rem; border-bottom: 1px dashed var(--border-glass);">
                            <span style="color: var(--text-secondary);">التأمين الابتدائي</span>
                            <strong style="color: var(--danger);">5,000 ج.م</strong>
                        </li>
                        <li style="display: flex; justify-content: space-between;">
                            <span style="color: var(--text-secondary);">العروض الحالية</span>
                            <strong style="color: var(--info);">${d.bidsCount} عروض</strong>
                        </li>
                    </ul>

                    <button class="btn btn-primary" style="width: 100%; font-size: 1.1rem; padding: 1rem;" onclick="loadSubmitBidForm('${d.id}')">التقديم على الصفقة (يستلزم دفع التأمين)</button>
                </div>
                <div class="glass-panel" style="padding: 1.5rem; background: rgba(245, 158, 11, 0.05); border-color: rgba(245, 158, 11, 0.2);">
                    <h4 style="color: var(--accent-color); margin-bottom: 0.5rem;"><i class="fa-solid fa-lightbulb"></i> ملخص الذكاء الاصطناعي</h4>
                    <p style="color: var(--text-secondary); font-size: 0.85rem; line-height: 1.6;">
                        هذه الصفقة تتطابق بنسبة <strong>${d.aiScore}%</strong> مع سابقة أعمالك.
                        ينصح النظام بتقديم عرض لأن أوقات التوريد المطلوبة تتناسب مع قدراتك المسجلة.
                    </p>
                </div>
            </div>
        </div>
    `;
    injectView(html);
}

window.loadSubmitBidForm = function (dealId) {
    const d = mockDB.deals.find(x => x.id === dealId);
    if (!d) return;

    const html = `
        <div style="margin-bottom: 1.5rem;">
            <button class="btn" style="background: transparent; border: 1px solid var(--border-glass); color: var(--text-secondary); padding: 0.4rem 0.8rem;" onclick="loadDealDetails('${dealId}')"><i class="fa-solid fa-arrow-right"></i> العودة للتفاصيل</button>
        </div>

        <div class="dashboard-header" style="margin-bottom: 2rem;">
            <h2 class="text-gradient">تقديم عرض لـ: ${d.title}</h2>
            <p style="color: var(--text-secondary);">يرجى تعبئة تفاصيل عرضك المالي والفني بعناية. تذكر أن المستندات المطلوبة إلزامية.</p>
        </div>

        <form id="submit-bid-form" onsubmit="event.preventDefault(); validateAndSubmitBid('${dealId}');">
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem;">
                <!-- نموذج العرض -->
                <div class="glass-panel" style="padding: 2rem;">
                    <h3 style="margin-bottom: 1.5rem; color: var(--primary-color); border-bottom: 1px solid var(--border-glass); padding-bottom: 0.5rem;">تعبئة العرض</h3>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-weight: 600;">العرض المالي الإجمالي <span style="color: var(--danger);">*</span></label>
                            <div style="position: relative;">
                                <input type="number" id="bid-price" required min="1000" placeholder="أدخل مبلغ العرض هنا..." style="width: 100%; padding: 0.8rem 0.8rem 0.8rem 3rem; border-radius: 8px; border: 1px solid var(--border-glass); background: var(--bg-surface); color: var(--text-primary); font-family: var(--font-body);">
                                <span style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 0.9rem;">ج.م</span>
                            </div>
                            <small id="bid-price-error" style="color: var(--danger); display: none; margin-top: 0.25rem;">الرجاء إدخال مبلغ صحيح (أكبر من 1000)</small>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-weight: 600;">مدة التنفيذ لتسليم العمل <span style="color: var(--danger);">*</span></label>
                            <div style="position: relative;">
                                <input type="number" id="bid-duration" required min="1" placeholder="مثال: 30" style="width: 100%; padding: 0.8rem 0.8rem 0.8rem 3rem; border-radius: 8px; border: 1px solid var(--border-glass); background: var(--bg-surface); color: var(--text-primary); font-family: var(--font-body);">
                                <span style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 0.9rem;">يوم</span>
                            </div>
                            <small id="bid-duration-error" style="color: var(--danger); display: none; margin-top: 0.25rem;">الرجاء إدخال مدة صحيحة</small>
                        </div>
                    </div>

                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-weight: 600;">ملاحظات / العرض الفني المختصر</label>
                        <textarea id="bid-notes" rows="4" placeholder="اكتب تفاصيل إضافية حول كيفية تنفيذك للمشروع لرفع تقييمك الفني..." style="width: 100%; padding: 0.8rem; border-radius: 8px; border: 1px solid var(--border-glass); background: var(--bg-surface); color: var(--text-primary); font-family: var(--font-body); resize: vertical;"></textarea>
                    </div>

                    <div style="margin-bottom: 2rem;">
                        <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-weight: 600;">المرفقات (العرض الفني المفصل، السجل التجاري) <span style="color: var(--danger);">*</span></label>
                        <div style="border: 2px dashed var(--border-glass); border-radius: 8px; padding: 1.5rem; text-align: center; background: rgba(0,0,0,0.02); position: relative; transition: var(--transition-fast);">
                            <input type="file" id="bid-files" required multiple accept=".pdf,.zip,.rar,.doc,.docx" 
                                style="position: absolute; top:0; left:0; width:100%; height:100%; opacity:0; cursor: pointer; z-index: 10;" 
                                onchange="handleFileUploadPreview(this)">
                            
                            <i class="fa-solid fa-cloud-arrow-up" style="font-size: 2rem; color: var(--primary-light); margin-bottom: 0.5rem;"></i>
                            <h4 id="file-upload-text" style="color: var(--text-primary); margin-bottom: 0.25rem; font-size: 1rem;">اضغط هنا لاختيار الملفات أو اسحبها</h4>
                            <p style="color: var(--text-muted); font-size: 0.8rem;">صيغ مدعومة: PDF, ZIP (الحد الأقصى 20 ميجا)</p>
                            
                            <div id="file-preview-list" style="margin-top: 1rem; display: flex; flex-direction: column; gap: 0.5rem; text-align: right;"></div>
                        </div>
                        <small id="bid-files-error" style="color: var(--danger); display: none; margin-top: 0.25rem;">يجب إرفاق ملف واحد على الأقل</small>
                    </div>

                    <!-- NEW: قسم العروض السابقة المجهولة الهوية مبسط -->
                    <div style="margin-bottom: 1rem; border-top: 1px solid var(--border-glass); padding-top: 1.5rem;">
                        <h4 style="color: var(--text-secondary); margin-bottom: 0.8rem; font-size: 0.95rem;"><i class="fa-solid fa-users-viewfinder"></i> عروض المنافسين (هويات مخفية)</h4>
                        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                            ${d.bidsCount > 0 ?
            Array.from({ length: Math.min(d.bidsCount, 3) }).map((_, i) => {
                const estBudgetVal = parseInt(d.budget.replace(/[^0-9]/g, '')) || 100000;
                const randomDiscount = 1 - (Math.random() * 0.15); // Randomly 1% to 15% cheaper
                const bidVal = Math.round((estBudgetVal * randomDiscount) / 1000) * 1000;
                return `
                                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.6rem; background: rgba(0,0,0,0.02); border: 1px dashed var(--border-glass); border-radius: 6px;">
                                        <span style="font-size: 0.85rem; color: var(--text-muted);"><i class="fa-solid fa-user-secret"></i> منافس #${i + 1}</span>
                                        <strong style="color: var(--primary-light); font-size: 0.9rem;">${bidVal.toLocaleString()} ج.م</strong>
                                    </div>
                                    `;
            }).join('')
            : '<div style="text-align:center; padding: 0.5rem; color: var(--text-muted); font-size: 0.85rem;">أنت أول المتقدمين لهذه الصفقة! قدم أفضل سعر لديك.</div>'
        }
                        </div>
                    </div>
                </div>

                <!-- التحليل المالي والاعتماد -->
                <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                    <div class="glass-panel" style="padding: 1.5rem;">
                        <h3 style="margin-bottom: 1rem; color: var(--text-primary);"><i class="fa-solid fa-calculator" style="color: var(--info);"></i> ملخص التكاليف</h3>
                        <div style="display: flex; flex-direction: column; gap: 0.8rem; margin-bottom: 1.5rem;">
                            <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
                                <span style="color: var(--text-secondary);">قيمة العرض المبدئية</span>
                                <strong style="color: var(--text-primary);" id="summary-bid-price">0 ج.م</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
                                <span style="color: var(--text-secondary);">رسوم المنصة (1.5%)</span>
                                <strong style="color: var(--danger);" id="summary-platform-fee">0 ج.م</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between; font-size: 0.9rem; border-top: 1px solid var(--border-glass); padding-top: 0.8rem;">
                                <span style="color: var(--text-primary); font-weight: bold;">الإجمالي الصافي لك</span>
                                <strong style="color: var(--success); font-size: 1.1rem;" id="summary-net-price">0 ج.م</strong>
                            </div>
                        </div>

                        <div style="background: rgba(239, 68, 68, 0.05); padding: 1rem; border-radius: 8px; border: 1px solid rgba(239, 68, 68, 0.2); margin-bottom: 1.5rem;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                                <span style="color: var(--text-primary); font-weight: bold;">مبلغ التأمين المطلوب دفعه الآن:</span>
                                <strong style="color: var(--danger);">5,000 ج.م</strong>
                            </div>
                            <p style="font-size: 0.8rem; color: var(--text-secondary); margin: 0;">(سيتم استرداد هذا المبلغ في حال عدم الترسية على عرضك)</p>
                        </div>
                        
                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem;">
                            <input type="checkbox" id="terms-agree" required style="width: 16px; height: 16px; accent-color: var(--primary-color);">
                            <label for="terms-agree" style="font-size: 0.85rem; color: var(--text-secondary);">أتعهد بصحة البيانات وأوافق على <a href="#" style="color: var(--primary-light);">الشروط والأحكام</a></label>
                        </div>

                        <button type="submit" class="btn btn-primary" style="width: 100%; font-size: 1.1rem;">تأكيد ودفع التأمين</button>
                    </div>
                    
                    <div class="glass-panel" style="padding: 1.5rem; border-right: 4px solid var(--primary-light);">
                        <h4 style="color: var(--primary-color); margin-bottom: 0.5rem;"><i class="fa-solid fa-robot"></i> الذكاء الاصطناعي يقول:</h4>
                        <p style="color: var(--text-secondary); font-size: 0.85rem; line-height: 1.6; margin:0;" id="ai-price-feedback">
                            أدخل العرض المالي لنقوم بتحليله مقارنة بمتوسط ميزانية هذا النوع من الصفقات.
                        </p>
                    </div>
                </div>
            </div>
        </form>
    `;
    injectView(html);

    // Add Live calculation listener
    setTimeout(() => {
        const priceInput = document.getElementById('bid-price');
        if (priceInput) {
            priceInput.addEventListener('input', function () {
                const val = parseFloat(this.value) || 0;
                const fee = val * 0.015;
                const net = val - fee;

                document.getElementById('summary-bid-price').textContent = val.toLocaleString() + ' ج.م';
                document.getElementById('summary-platform-fee').textContent = fee.toLocaleString() + ' ج.م';
                document.getElementById('summary-net-price').textContent = net.toLocaleString() + ' ج.م';

                const aiFeedback = document.getElementById('ai-price-feedback');
                if (val > 0) {
                    if (val > 150000) {
                        aiFeedback.innerHTML = `<span style="color: var(--danger);">سعر مرتفع جداً.</span> قد تتجاوز ميزانية الناشر المعتادة لهذا النوع من الأعمال بنسبة 40%، حاول مراجعة التكاليف.`;
                    } else if (val < 50000) {
                        aiFeedback.innerHTML = `<span style="color: var(--danger);">تنبيه خطر الاعتماد:</span> سعرك أقل بكثير من متوسط السوق المعتاد، قد يعتبر الناشر هذا مؤشراً على جودة منخفضة. احرص على تدعيم عرضك الفني.`;
                    } else {
                        aiFeedback.innerHTML = `<span style="color: var(--success);">سعرك تنافسي وممتاز.</span> يطابق متوسط أسعار السوق الحالية لهذا التصنيف وفرص فوزك تزيد عن 80%.`;
                    }
                } else {
                    aiFeedback.textContent = "أدخل العرض المالي لنقوم بتحليله مقارنة بمتوسط ميزانية هذا النوع من الصفقات.";
                }
            });
        }
    }, 300);
}

// Handler for file upload UI update
window.handleFileUploadPreview = function (input, listId = 'file-preview-list', titleId = 'file-upload-text') {
    const previewList = document.getElementById(listId);
    const titleText = document.getElementById(titleId);

    if (!previewList || !titleText) return;

    if (input.files && input.files.length > 0) {
        titleText.textContent = `تم اختيار (${input.files.length}) ملفات`;
        previewList.innerHTML = Array.from(input.files).map(file => `
            <div style="display: flex; align-items: center; gap: 0.5rem; background: var(--bg-surface); padding: 0.5rem; border-radius: 4px; border: 1px solid var(--border-glass);">
                <i class="fa-solid fa-file-check" style="color: var(--success);"></i>
                <span style="font-size: 0.85rem; color: var(--text-primary); flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${file.name}</span>
                <span style="font-size: 0.75rem; color: var(--text-muted);">${(file.size / (1024 * 1024)).toFixed(2)} MB</span>
            </div>
        `).join('');
    } else {
        titleText.textContent = "اضغط هنا لاختيار الملفات أو اسحبها";
        previewList.innerHTML = "";
    }
}

// Form Validation and Submission Simulation
window.validateAndSubmitBid = function (dealId) {
    // Basic HTML5 validation is handled by 'required' and 'min', 
    // but we can add JS checks to be sure UI reflects appropriately
    const price = document.getElementById('bid-price').value;
    const duration = document.getElementById('bid-duration').value;
    const files = document.getElementById('bid-files').files;

    let isValid = true;

    if (!price || price < 1000) {
        document.getElementById('bid-price-error').style.display = 'block';
        isValid = false;
    } else { document.getElementById('bid-price-error').style.display = 'none'; }

    if (!duration || duration < 1) {
        document.getElementById('bid-duration-error').style.display = 'block';
        isValid = false;
    } else { document.getElementById('bid-duration-error').style.display = 'none'; }

    if (files.length === 0) {
        document.getElementById('bid-files-error').style.display = 'block';
        isValid = false;
    } else { document.getElementById('bid-files-error').style.display = 'none'; }

    if (!isValid) return;

    // Simulate Payment & AI Validation Loading
    simulateAILoading([
        "جار التحقق من الملفات المرفقة...",
        "جاري إتمام عملية تحويل التأمين (محاكاة بوابة الدفع)...",
        "تأكيد تشفير العرض وحفظه بأمان..."
    ], () => {
        injectView(`
            <div class="glass-panel" style="padding: 4rem 2rem; text-align: center; max-width: 600px; margin: 2rem auto;">
                <div style="font-size: 5rem; color: var(--success); margin-bottom: 1.5rem;"><i class="fa-solid fa-circle-check"></i></div>
                <h2 style="margin-bottom: 1rem; color: var(--text-primary); font-size: 2rem;">تم استلام العرض ودفع التأمين بنجاح!</h2>
                <p style="color: var(--text-secondary); margin-bottom: 2.5rem; line-height: 1.8; font-size: 1.1rem;">
                    تم تخزين عرضك المالي والفني بسرية تامة (ولن يطلع عليه الناشر إلا بعد انتهاء موعد التقديم). 
                    <br> رقم التأكيد: <strong>#BID-${Math.floor(Math.random() * 90000) + 10000}</strong>
                </p>
                <div style="display: flex; gap: 1rem; justify-content: center;">
                    <button class="btn btn-primary" onclick="loadBidderDashboard()">العودة للوحة التحكم</button>
                    <button class="btn" style="border: 1px solid var(--border-glass);" onclick="loadExploreDeals()">استكشاف المزيد</button>
                </div>
            </div>
        `);
    });
}

window.loadMyBids = function () {
    if (!mockDB.myBids || mockDB.myBids.length === 0) {
        injectView(`
            <div class="dashboard-header" style="margin-bottom: 2rem;">
                <h2 class="text-gradient">عروضي المقدمة</h2>
                <p style="color: var(--text-secondary);">تابع الموقف التنفيذي لعروضك السابقة والنشطة</p>
            </div>
            <div class="glass-panel" style="padding: 4rem 2rem; text-align: center;">
                <i class="fa-solid fa-folder-open" style="font-size: 4rem; color: var(--border-glass); margin-bottom: 1rem;"></i>
                <h3 style="color: var(--text-primary); margin-bottom: 0.5rem;">لا توجد عروض مقدمة بعد</h3>
                <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">استكشف الصفقات المتاحة وقدم عرضك الأول!</p>
                <button class="btn btn-primary" onclick="loadExploreDeals()">استكشاف الصفقات</button>
            </div>
        `);
        return;
    }

    const bidsHTML = mockDB.myBids.map(bid => {
        let statusBadge = '';
        let statusColor = '';
        if (bid.status === 'مقبول') {
            statusBadge = `<span class="badge" style="background: rgba(16, 185, 129, 0.1); color: var(--success); padding: 0.25rem 0.75rem; border-radius: 999px; border: 1px solid var(--success); font-size: 0.8rem;">مقبول</span>`;
            statusColor = 'var(--success)';
        } else if (bid.status === 'مرفوض') {
            statusBadge = `<span class="badge" style="background: rgba(239, 68, 68, 0.1); color: var(--danger); padding: 0.25rem 0.75rem; border-radius: 999px; border: 1px solid var(--danger); font-size: 0.8rem;">مرفوض</span>`;
            statusColor = 'var(--danger)';
        } else {
            statusBadge = `<span class="badge" style="background: rgba(245, 158, 11, 0.1); color: var(--accent-color); padding: 0.25rem 0.75rem; border-radius: 999px; border: 1px solid var(--accent-color); font-size: 0.8rem;">قيد المراجعة</span>`;
            statusColor = 'var(--accent-color)';
        }

        let typeIcon = bid.type === 'مزاد' ? '<i class="fa-solid fa-gavel" style="color: var(--accent-color);"></i>' : '<i class="fa-solid fa-file-contract" style="color: var(--info);"></i>';

        // Map mock bids to mock deal IDs for simulation
        const mockDealId = bid.id === 'BID-10025' ? 'dl_001' :
            bid.id === 'BID-09884' ? 'dl_003' : 'dl_002';

        return `
            <div class="glass-panel deal-row" style="display: flex; align-items: stretch; justify-content: space-between; padding: 0; margin-bottom: 1rem; border-right: 4px solid ${statusColor}; overflow: hidden; transition: var(--transition-normal); cursor: pointer;" onclick="loadDealDetails('${mockDealId}')">
                <div style="flex: 2; padding: 1.5rem;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                        <h4 style="font-size: 1.1rem; color: var(--primary-color); margin-bottom: 0; display:flex; align-items:center; gap: 0.5rem;">
                            ${typeIcon}
                            ${bid.dealTitle}
                        </h4>
                        ${statusBadge}
                    </div>
                    <div style="display: flex; gap: 1.5rem; color: var(--text-secondary); font-size: 0.85rem; margin-top: 1rem;">
                        <span><i class="fa-solid fa-hashtag"></i> ${bid.id}</span>
                        <span><i class="fa-regular fa-calendar"></i> التقديم: ${bid.submittedDate}</span>
                        <span style="color: var(--text-primary); font-weight: bold;"><i class="fa-solid fa-wallet"></i> السعر المقدم: ${bid.submittedPrice.toLocaleString()} ج.م</span>
                    </div>
                </div>
                <div style="flex: 1; padding: 1.5rem; background: rgba(0,0,0,0.02); border-right: 1px solid var(--border-glass); display: flex; flex-direction: column; justify-content: center;">
                    <strong style="font-size: 0.85rem; color: var(--text-primary); margin-bottom: 0.5rem;"><i class="fa-solid fa-robot" style="color: var(--primary-light);"></i> تعليق الذكاء الاصطناعي:</strong>
                    <p style="font-size: 0.8rem; color: var(--text-secondary); margin: 0; line-height: 1.5;">${bid.aiFeedback}</p>
                </div>
                <div style="padding: 1.5rem; display: flex; align-items: center; border-right: 1px solid var(--border-glass);" title="عرض التفاصيل" onmouseover="this.style.background='rgba(79, 70, 229, 0.05)'" onmouseout="this.style.background='transparent'">
                     <i class="fa-solid fa-chevron-left" style="color: var(--primary-light); font-size: 1.2rem;"></i>
                </div>
            </div>
        `;
    }).join('');

    injectView(`
        <div class="dashboard-header" style="margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center;">
            <div>
                <h2 class="text-gradient">عروضي المقدمة</h2>
                <p style="color: var(--text-secondary);">تابع الموقف التنفيذي لعروضك ونسبة تنافسيتها</p>
            </div>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            ${bidsHTML}
        </div>
    `);
}

window.loadAdminDashboard = function () {
    const s = mockDB.stats.admin;

    // Recent Activities HTML
    const activitiesHTML = mockDB.adminRecentActivities.map(act => {
        const iconColor = act.status === 'success' ? 'var(--success)' :
            act.status === 'warning' ? 'var(--accent-color)' : 'var(--info)';
        const iconName = act.status === 'success' ? 'check-circle' :
            act.status === 'warning' ? 'clock' : 'info-circle';

        return `
            <div style="display: flex; align-items: flex-start; gap: 1rem; padding: 1rem; border-bottom: 1px solid var(--border-glass);">
                <div style="width: 36px; height: 36px; border-radius: 50%; background: rgba(0,0,0,0.03); display: flex; align-items: center; justify-content: center; color: ${iconColor};">
                    <i class="fa-solid fa-${iconName}"></i>
                </div>
                <div style="flex: 1;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.2rem;">
                        <strong style="color: var(--text-primary); font-size: 0.95rem;">${act.user}</strong>
                        <span style="color: var(--text-muted); font-size: 0.8rem;">${act.date}</span>
                    </div>
                    <p style="color: var(--text-secondary); font-size: 0.9rem; margin: 0;">${act.action}</p>
                </div>
            </div>
        `;
    }).join('');

    // AI Alerts HTML
    const alertsHTML = mockDB.adminAIAlerts.map(alert => {
        const bgColor = alert.severity === 'high' ? 'rgba(239, 68, 68, 0.05)' : 'rgba(245, 158, 11, 0.05)';
        const borderColor = alert.severity === 'high' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)';
        const iconColor = alert.severity === 'high' ? 'var(--danger)' : 'var(--accent-color)';

        return `
            <div style="display: flex; gap: 1rem; padding: 1.2rem; background: ${bgColor}; border: 1px solid ${borderColor}; border-radius: 8px; margin-bottom: 1rem;">
                <div style="color: ${iconColor}; font-size: 1.5rem; flex-shrink: 0;"><i class="fa-solid fa-${alert.icon}"></i></div>
                <div>
                    <strong style="color: ${iconColor}; display: block; margin-bottom: 0.4rem; font-size: 0.95rem;">${alert.severity === 'high' ? 'تنبيه أمني - مخاطر عالية' : 'تحذير تشغيلي - مخاطر متوسطة'}</strong>
                    <p style="color: var(--text-secondary); margin: 0; font-size: 0.9rem; line-height: 1.6;">${alert.message}</p>
                    <button class="btn" style="margin-top: 0.8rem; background: transparent; border: 1px solid ${iconColor}; color: ${iconColor}; padding: 0.3rem 0.8rem; font-size: 0.8rem;">اتخاذ إجراء</button>
                </div>
            </div>
        `;
    }).join('');

    injectView(`
        <div class="dashboard-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
            <div>
                <h2 class="text-gradient">مركز القيادة والإحصائيات</h2>
                <p style="color: var(--text-secondary);">نظرة شاملة على أداء المنصة التشغيلي والمخاطر المحتملة</p>
            </div>
            <div style="display: flex; gap: 1rem;">
                <button class="btn" style="background: var(--bg-surface); border: 1px solid var(--border-glass); color: var(--text-primary);"><i class="fa-solid fa-download"></i> تصدير التقرير</button>
                <button class="btn btn-primary" onclick="simulateAILoading(['تحليل بيانات آخر 24 ساعة...'], loadAdminDashboard)"><i class="fa-solid fa-rotate-right"></i> تحديث المؤشرات</button>
            </div>
        </div>

        <!-- Top KPIs -->
        <div class="stats-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
            <div class="stat-card glass-panel" style="border-bottom: 3px solid var(--primary-color);">
                <div class="stat-icon" style="background: rgba(79, 70, 229, 0.1); color: var(--primary-color);"><i class="fa-solid fa-money-bill-trend-up"></i></div>
                <div class="stat-value" style="font-size: 1.6rem;">${s.totalVolume} <span style="font-size: 0.9rem; color: var(--text-secondary);">ج.م</span></div>
                <div class="stat-label">حجم التداولات النشطة</div>
                <div style="margin-top: 0.5rem; font-size: 0.8rem; color: var(--success);"><i class="fa-solid fa-arrow-trend-up"></i> +12% هذا الشهر</div>
            </div>
            <div class="stat-card glass-panel" style="border-bottom: 3px solid var(--success);">
                <div class="stat-icon" style="background: rgba(16, 185, 129, 0.1); color: var(--success);"><i class="fa-solid fa-briefcase"></i></div>
                <div class="stat-value" style="font-size: 1.6rem;">${s.totalActiveDeals}</div>
                <div class="stat-label">إجمالي الصفقات الجارية</div>
                <div style="margin-top: 0.5rem; font-size: 0.8rem; color: var(--text-muted);">مزادات ومناقصات</div>
            </div>
            <div class="stat-card glass-panel" style="border-bottom: 3px solid var(--info);">
                <div class="stat-icon" style="background: rgba(13, 138, 188, 0.1); color: var(--info);"><i class="fa-solid fa-users"></i></div>
                <div class="stat-value" style="font-size: 1.6rem;">${s.activeBidders + s.activePublishers}</div>
                <div class="stat-label">المتداولين (مورد / ناشر)</div>
                <div style="margin-top: 0.5rem; font-size: 0.8rem; color: var(--success);"><i class="fa-solid fa-arrow-trend-up"></i> +54 مستخدم جديد</div>
            </div>
            <div class="stat-card glass-panel" style="border-bottom: 3px solid var(--accent-color);">
                <div class="stat-icon" style="background: rgba(245, 158, 11, 0.1); color: var(--accent-color);"><i class="fa-solid fa-clipboard-check"></i></div>
                <div class="stat-value" style="font-size: 1.6rem;">${s.pendingApprovals}</div>
                <div class="stat-label">تسجيلات بانتظار الاعتماد</div>
                <div style="margin-top: 0.5rem; font-size: 0.8rem; color: var(--accent-color);">تتطلب مراجعة الأوراق</div>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; margin-top: 2rem;">
            <!-- Left Column: Visuals & Activities -->
            <div style="display: flex; flex-direction: column; gap: 2rem;">
                
                <!-- AI Risk Management Alerts -->
                <div class="glass-panel" style="padding: 1.5rem; border-top: 4px solid var(--danger);">
                    <h3 style="color: var(--text-primary); margin-bottom: 1.5rem; font-size: 1.1rem; display: flex; align-items: center; justify-content: space-between;">
                        <span><i class="fa-solid fa-brain" style="color: var(--primary-light); margin-left: 0.5rem;"></i> رصد وتحليل المخاطر (AI Risk Management)</span>
                        <span class="badge" style="background: rgba(239, 68, 68, 0.1); color: var(--danger);">2 تنبيهات نشطة</span>
                    </h3>
                    ${alertsHTML}
                </div>

                <!-- Recent Activities -->
                <div class="glass-panel" style="padding: 1.5rem;">
                    <h3 style="color: var(--text-primary); margin-bottom: 1rem; font-size: 1.1rem;"><i class="fa-solid fa-list-ul" style="color: var(--text-muted); margin-left: 0.5rem;"></i> أحدث الأنشطة على المنصة</h3>
                    <div style="display: flex; flex-direction: column;">
                        ${activitiesHTML}
                    </div>
                    <button class="btn" style="width: 100%; margin-top: 1rem; background: transparent; border: 1px dashed var(--border-glass); color: var(--text-secondary);">عرض سجل النشاطات الكامل</button>
                </div>
            </div>

            <!-- Right Column: Simple CSS Charts -->
            <div style="display: flex; flex-direction: column; gap: 2rem;">
                
                <!-- Chart 1: Deal Types -->
                <div class="glass-panel" style="padding: 1.5rem;">
                    <h3 style="color: var(--text-primary); margin-bottom: 1.5rem; font-size: 1rem;"><i class="fa-solid fa-chart-pie" style="color: var(--info); margin-left: 0.5rem;"></i> توزيع الصفقات النشطة</h3>
                    
                    <!-- CSS Custom Pie Chart (Simulated with progress bars for simplicity) -->
                    <div style="margin-bottom: 1.5rem;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.9rem;">
                            <span style="color: var(--text-primary);"><i class="fa-solid fa-file-contract"></i> مناقصات (65%)</span>
                            <span style="color: var(--text-muted);">161 صفقة</span>
                        </div>
                        <div style="width: 100%; height: 8px; background: var(--border-glass); border-radius: 4px; overflow: hidden;">
                            <div style="width: 65%; height: 100%; background: var(--info);"></div>
                        </div>
                    </div>
                    
                    <div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.9rem;">
                            <span style="color: var(--text-primary);"><i class="fa-solid fa-gavel"></i> مزادات (35%)</span>
                            <span style="color: var(--text-muted);">87 صفقة</span>
                        </div>
                        <div style="width: 100%; height: 8px; background: var(--border-glass); border-radius: 4px; overflow: hidden;">
                            <div style="width: 35%; height: 100%; background: var(--accent-color);"></div>
                        </div>
                    </div>
                </div>

                <!-- Chart 2: System Load/Traffic -->
                <div class="glass-panel" style="padding: 1.5rem;">
                    <h3 style="color: var(--text-primary); margin-bottom: 1.5rem; font-size: 1rem;"><i class="fa-solid fa-server" style="color: var(--success); margin-left: 0.5rem;"></i> حالة الخوادم والنشاط</h3>
                    
                    <div style="display: flex; align-items: flex-end; gap: 0.5rem; height: 120px; padding-bottom: 1rem; border-bottom: 1px dashed var(--border-glass);">
                        ${[40, 60, 45, 80, 55, 90, 70].map(h => `
                            <div style="flex: 1; background: linear-gradient(to top, rgba(16, 185, 129, 0.2), var(--success)); height: ${h}%; border-radius: 4px 4px 0 0; position: relative;" title="نشاط: ${h}%"></div>
                        `).join('')}
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-top: 0.5rem; font-size: 0.75rem; color: var(--text-muted);">
                        <span>السبت</span><span>الأحد</span><span>الإثنين</span><span>الثلاثاء</span><span>الأربعاء</span><span>الخميس</span><span>الجمعة</span>
                    </div>
                </div>

            </div>
        </div>
    `);
}

// ==========================================
// Admin Users Management & Verification
// ==========================================
window.loadUsers = function () {
    const usersHTML = mockDB.adminUsersList.map(user => {
        const isVerified = user.status === 'موثق';
        const statusBadge = isVerified
            ? `<span class="badge" style="background: rgba(16, 185, 129, 0.1); color: var(--success); padding: 0.25rem 0.75rem; border-radius: 999px; border: 1px solid var(--success); font-size: 0.8rem;">موثق بالكامل</span>`
            : `<span class="badge" style="background: rgba(245, 158, 11, 0.1); color: var(--accent-color); padding: 0.25rem 0.75rem; border-radius: 999px; border: 1px solid var(--accent-color); font-size: 0.8rem;">بانتظار المراجعة</span>`;

        let aiBadge = '';
        if (user.aiSourced) {
            aiBadge = `
                <div style="margin-top: 0.5rem; display: inline-flex; align-items: center; gap: 0.3rem; background: linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(16, 185, 129, 0.1)); padding: 0.2rem 0.6rem; border-radius: 12px; border: 1px dashed var(--primary-light); font-size: 0.75rem; color: var(--primary-color);">
                    <i class="fa-solid fa-wand-magic-sparkles"></i>
                    <span>مُستقطب تلقائياً عبر AI (تطابق مطروح: ${user.aiMatchConfidence})</span>
                </div>
            `;
        }

        const actionButton = isVerified
            ? `<button class="btn" style="background: transparent; border: 1px solid var(--border-glass); color: var(--text-muted); font-size: 0.85rem;" disabled><i class="fa-solid fa-check"></i> مكتمل</button>`
            : `<button class="btn btn-primary" style="font-size: 0.85rem;" onclick="openVerifyUserModal('${user.id}')">مراجعة المستندات <i class="fa-solid fa-file-shield" style="margin-right: 0.4rem;"></i></button>`;

        return `
            <div class="glass-panel" style="padding: 1.5rem; margin-bottom: 1rem; border-right: 4px solid ${isVerified ? 'var(--success)' : 'var(--accent-color)'}; display: flex; justify-content: space-between; align-items: center; transition: var(--transition-normal);">
                <div style="flex: 2;">
                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem;">
                        <div style="width: 45px; height: 45px; border-radius: 8px; background: rgba(0,0,0,0.03); display: flex; justify-content: center; align-items: center; font-size: 1.2rem; color: var(--text-secondary);">
                            <i class="fa-solid fa-${user.type.includes('ناشر') ? 'building-user' : 'truck-fast'}"></i>
                        </div>
                        <div>
                            <h4 style="margin: 0; color: var(--text-primary); font-size: 1.1rem; display: flex; align-items: center; gap: 0.5rem;">
                                ${user.name} ${isVerified ? '<i class="fa-solid fa-circle-check" style="color: var(--success); font-size: 0.9rem;" title="حساب موثق"></i>' : ''}
                            </h4>
                            <span style="font-size: 0.85rem; color: var(--text-secondary);">${user.type} | مسجل منذ: ${user.joinDate}</span>
                            ${aiBadge}
                        </div>
                    </div>
                </div>
                
                <div style="flex: 1; text-align: center; border-right: 1px solid var(--border-glass); border-left: 1px solid var(--border-glass); padding: 0 1rem;">
                    <div style="margin-bottom: 0.4rem;">${statusBadge}</div>
                    <div style="font-size: 0.8rem; color: var(--text-muted); display: flex; align-items: center; justify-content: center; gap: 0.4rem;">
                        <i class="fa-regular fa-envelope"></i> ${user.email}
                    </div>
                </div>

                <div style="flex: 1; display: flex; justify-content: flex-end; align-items: center; padding-right: 1.5rem;">
                    ${actionButton}
                </div>
            </div>
        `;
    }).join('');

    injectView(`
        <div class="dashboard-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
            <div>
                <h2 class="text-gradient">مستقطبات الذكاء الاصطناعي (AI Sourcing) والتوثيق</h2>
                <p style="color: var(--text-secondary);">استعراض ومراجعة ملفات الشركات والمقاولين الذين تم استقطابهم آلياً من الإنترنت، وإدارة التوثيق القانوني</p>
            </div>
            <div style="display: flex; gap: 1rem; align-items: center;">
                <div class="search-bar" style="position: relative; width: 300px;">
                    <input type="text" placeholder="ابحث عن شركة، بريد، أو سجل..." style="width: 100%; padding: 0.8rem 1rem 0.8rem 2.5rem; border: 1px solid var(--border-glass); border-radius: 8px; background: var(--bg-surface); color: var(--text-primary); font-family: var(--font-body);">
                    <i class="fa-solid fa-search" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted);"></i>
                </div>
                <button class="btn" style="background: var(--bg-surface); border: 1px solid var(--border-glass); color: var(--text-primary);" onclick="alert('فلترة الحسابات قيد التطوير')"><i class="fa-solid fa-filter"></i> تصفية</button>
            </div>
        </div>

        <!-- System Summary -->
        <div style="display: flex; gap: 1rem; margin-bottom: 2rem; background: rgba(79, 70, 229, 0.03); padding: 1rem; border-radius: 8px; border: 1px dashed var(--primary-light);">
            <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--text-primary); font-size: 0.9rem;">
                <i class="fa-solid fa-robot" style="color: var(--primary-color);"></i>
                <strong>جهود الذكاء الاصطناعي (AI Sourcing):</strong> نجح النظام في جلب وتوصية <span style="color: var(--success); font-weight: bold;">(14)</span> شركة جديدة للتسجيل هذا الأسبوع لمناقصات استراتيجية.
            </div>
        </div>

        <!-- Users List -->
        <div style="display: flex; flex-direction: column;">
            ${usersHTML}
        </div>
    `);
};

// ==========================================
// Categories Management
// ==========================================
window.loadCategories = function () {
    const categoriesHTML = mockDB.categories.map(cat => `
        <div class="glass-panel" style="padding: 1.25rem 1.5rem; margin-bottom: 0.8rem; display: flex; justify-content: space-between; align-items: center; border-right: 4px solid var(--primary-light);">
            <div style="display: flex; align-items: center; gap: 1rem;">
                <div style="width: 40px; height: 40px; border-radius: 8px; background: rgba(79, 70, 229, 0.05); display: flex; justify-content: center; align-items: center; color: var(--primary-color);">
                    <i class="fa-solid fa-tag"></i>
                </div>
                <h4 style="margin: 0; color: var(--text-primary); font-size: 1.1rem;">${cat.name}</h4>
            </div>
            <div style="display: flex; gap: 0.5rem;">
                <button class="icon-btn" style="color: var(--text-muted);" onclick="alert('تعديل التصنيف قيد التطوير')"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="icon-btn" style="color: var(--danger);" onclick="alert('حذف التصنيف قيد التطوير')"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        </div>
    `).join('');

    injectView(`
        <div class="dashboard-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
            <div>
                <h2 class="text-gradient">إدارة تصنيفات المنصة</h2>
                <p style="color: var(--text-secondary);">تحديد مجالات التخصص لربط الصفقات بالموردين وتفعيل الإشعارات الذكية</p>
            </div>
            <button class="btn btn-primary" onclick="alert('إضافة تصنيف جديد قيد التطوير')">
                <i class="fa-solid fa-plus-circle"></i> إضافة تصنيف جديد
            </button>
        </div>

        <div style="max-width: 800px;">
            <div style="background: rgba(16, 185, 129, 0.05); border: 1px dashed var(--success); padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; display: flex; gap: 1rem; align-items: center; color: var(--success);">
                <i class="fa-solid fa-bullhorn"></i>
                <span style="font-size: 0.9rem;">سيصل إشعار SMS تلقائي لأي شركة مسجلة تحت التصنيف المختار عند نشر صفقة جديدة تتبعه.</span>
            </div>
            ${categoriesHTML}
        </div>
    `);
};

window.openVerifyUserModal = function (userId) {
    const user = mockDB.adminUsersList.find(u => u.id === userId);
    if (!user) return;

    // إزالة نافذة سابقة إن وجدت
    const existingModal = document.getElementById('user-verify-modal');
    if (existingModal) existingModal.remove();

    const aiScanAlert = user.docsScore < 80
        ? `<div style="background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.2); padding: 0.8rem; border-radius: 8px; margin-bottom: 1.5rem; display: flex; gap: 0.8rem; color: var(--danger);">
            <i class="fa-solid fa-triangle-exclamation" style="margin-top: 0.2rem;"></i>
            <div>
                <strong style="display: block; font-size: 0.9rem; margin-bottom: 0.2rem;">تحليل الذكاء الاصطناعي للملفات (${user.docsScore}%)</strong>
                <span style="font-size: 0.85rem;">تم إيجاد نواقص في المستندات التالية: <b>${user.missingDocs}</b>. يُرجى طلب استكمالها قبل الاعتماد النهائي.</span>
            </div>
           </div>`
        : `<div style="background: rgba(16, 185, 129, 0.05); border: 1px solid rgba(16, 185, 129, 0.2); padding: 0.8rem; border-radius: 8px; margin-bottom: 1.5rem; display: flex; gap: 0.8rem; color: var(--success);">
            <i class="fa-solid fa-shield-check" style="margin-top: 0.2rem;"></i>
            <div>
                <strong style="display: block; font-size: 0.9rem; margin-bottom: 0.2rem;">تحليل الذكاء الاصطناعي للملفات (${user.docsScore}%)</strong>
                <span style="font-size: 0.85rem;">جميع المستندات الأساسية (السجل، هيئة الزكاة، التأمينات) مرفوعة وسارية المفعول بناءً على تقنية OCR.</span>
            </div>
           </div>`;

    const modalHTML = `
        <div id="user-verify-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); backdrop-filter: blur(5px); z-index: 9999; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s ease;">
            <div class="glass-panel" style="width: 90%; max-width: 650px; padding: 0; overflow: hidden; position: relative; transform: translateY(20px); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
                
                <div style="padding: 1.5rem; border-bottom: 1px solid var(--border-glass); display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.02);">
                    <h3 style="margin: 0; font-size: 1.2rem; color: var(--text-primary);"><i class="fa-solid fa-passport" style="color: var(--primary-light); margin-left: 0.5rem;"></i> مراجعة مستندات التوثيق</h3>
                    <button class="icon-btn" onclick="closeVerifyModal()" style="color: var(--text-muted);"><i class="fa-solid fa-xmark"></i></button>
                </div>

                <div style="padding: 1.5rem; max-height: 60vh; overflow-y: auto;">
                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px dashed var(--border-glass);">
                        <div style="width: 60px; height: 60px; border-radius: 12px; border: 2px solid var(--border-glass); display: flex; justify-content: center; align-items: center; font-size: 1.8rem; color: var(--primary-color); background: var(--bg-surface);">
                            <i class="fa-solid fa-${user.type.includes('ناشر') ? 'building-user' : 'truck-fast'}"></i>
                        </div>
                        <div>
                            <h4 style="margin: 0 0 0.3rem 0; color: var(--text-primary); font-size: 1.2rem;">${user.name}</h4>
                            <div style="color: var(--text-secondary); font-size: 0.9rem; display: flex; gap: 1rem;">
                                <span><i class="fa-regular fa-envelope"></i> ${user.email}</span>
                                <span><i class="fa-solid fa-id-card"></i> السجل: 1010******</span>
                            </div>
                        </div>
                    </div>

                    ${aiScanAlert}

                    <h4 style="font-size: 1rem; color: var(--text-primary); margin-bottom: 1rem;">المرفقات المستلمة للتأهيل:</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <a href="#" class="btn" style="justify-content: space-between; background: var(--bg-surface); border: 1px solid var(--border-glass); color: var(--text-primary); font-size: 0.85rem;">
                            <span><i class="fa-solid fa-file-pdf" style="color: var(--danger); margin-left: 0.5rem;"></i> السجل التجاري.pdf</span>
                            <i class="fa-solid fa-download" style="color: var(--text-muted);"></i>
                        </a>
                        <a href="#" class="btn" style="justify-content: space-between; background: var(--bg-surface); border: 1px solid var(--border-glass); color: var(--text-primary); font-size: 0.85rem;">
                            <span><i class="fa-solid fa-file-image" style="color: var(--info); margin-left: 0.5rem;"></i> شهادة المحتوى المحلي.jpg</span>
                            <i class="fa-solid fa-download" style="color: var(--text-muted);"></i>
                        </a>
                        <a href="#" class="btn" style="justify-content: space-between; background: var(--bg-surface); border: 1px dashed var(--danger); color: var(--text-muted); font-size: 0.85rem;">
                            <span><i class="fa-solid fa-triangle-exclamation" style="color: var(--danger); margin-left: 0.5rem;"></i> التوطين والزكاة (مفقود)</span>
                        </a>
                    </div>
                </div>

                <div style="padding: 1.2rem 1.5rem; border-top: 1px solid var(--border-glass); background: rgba(0,0,0,0.02); display: flex; justify-content: flex-end; gap: 1rem;">
                    <button class="btn" style="background: transparent; border: 1px solid var(--border-glass); color: var(--text-primary);" onclick="closeVerifyModal()">إغلاق مؤقت</button>
                    ${user.docsScore < 80
            ? `<button class="btn" style="background: rgba(245, 158, 11, 0.1); border: 1px solid var(--accent-color); color: var(--accent-color);" onclick="simulateAIFormAssist()">طلب استكمال النواقص <i class="fa-solid fa-paper-plane" style="margin-right: 0.4rem;"></i></button>`
            : `<button class="btn btn-primary" onclick="window.simulateAwardDeal('${user.id}')">اعتماد الحساب وفتحه <i class="fa-solid fa-check-double" style="margin-right: 0.4rem;"></i></button>`
        }
                </div>

            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    setTimeout(() => {
        const modal = document.getElementById('user-verify-modal');
        if (modal) {
            modal.style.opacity = '1';
            modal.querySelector('.glass-panel').style.transform = 'translateY(0)';
        }
    }, 10);
};

window.closeVerifyModal = function () {
    const modal = document.getElementById('user-verify-modal');
    if (modal) {
        modal.style.opacity = '0';
        modal.querySelector('.glass-panel').style.transform = 'translateY(20px)';
        setTimeout(() => modal.remove(), 300);
    }
};

// Global hook to attach to Window object
window.loadMyDeals = function () {
    const dealsHTML = mockDB.deals.map(d => {
        let statusBadge = '';
        if (d.status === 'نشط') statusBadge = `<span class="badge" style="background: rgba(16, 185, 129, 0.1); color: var(--success); padding: 0.25rem 0.75rem; border-radius: 999px; border: 1px solid var(--success); font-size: 0.8rem;">نشط</span>`;
        else if (d.status === 'مغلق') statusBadge = `<span class="badge" style="background: rgba(239, 68, 68, 0.1); color: var(--danger); padding: 0.25rem 0.75rem; border-radius: 999px; border: 1px solid var(--danger); font-size: 0.8rem;">مغلق</span>`;

        let typeIcon = d.type === 'مزاد' ? '<i class="fa-solid fa-gavel" style="color: var(--accent-color);"></i>' : '<i class="fa-solid fa-file-contract" style="color: var(--info);"></i>';

        return `
            <div class="glass-panel deal-row" style="display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem; margin-bottom: 1rem; border-right: 4px solid var(--primary-light); transition: var(--transition-normal);">
                <div style="flex: 2;">
                    <h4 style="font-size: 1.1rem; color: var(--primary-color); margin-bottom: 0.25rem;">${d.title}</h4>
                    <div style="font-size: 0.85rem; color: var(--text-secondary); display: flex; gap: 1rem; align-items: center;">
                        <span>${typeIcon} ${d.type}</span>
                        <span><i class="fa-regular fa-folder" style="margin-left: 0.25rem;"></i>${d.category}</span>
                        <span><i class="fa-regular fa-clock" style="margin-left: 0.25rem;"></i>ينتهي في: ${d.endDate}</span>
                    </div>
                </div>
                <div style="flex: 1; text-align: center;">
                    ${statusBadge}
                </div>
                <div style="flex: 1; text-align: center;">
                    <div style="font-size: 1.5rem; font-weight: bold; color: var(--text-primary);">${d.bidsCount}</div>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">عروض مقدمة</div>
                </div>
                <div style="flex: 1; display: flex; justify-content: flex-end; gap: 0.5rem;">
                    <button class="icon-btn" style="background: rgba(79, 70, 229, 0.1); color: var(--primary-light);" title="إدارة وعرض التفاصيل" onclick="loadManageBids()"><i class="fa-solid fa-eye"></i></button>
                    ${d.status === 'نشط' ? `<button class="icon-btn" style="background: rgba(245, 158, 11, 0.1); color: var(--accent-color);" title="تعديل الصفقة"><i class="fa-solid fa-pen"></i></button>` : ''}
                    <button class="icon-btn" style="background: rgba(239, 68, 68, 0.1); color: var(--danger);" title="إيقاف / أرشفة"><i class="fa-solid fa-box-archive"></i></button>
                </div>
            </div>
        `;
    }).join('');

    injectView(`
        <div class="dashboard-header" style="margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center;">
            <div>
                <h2 class="text-gradient">إدارة الصفقات</h2>
                <p style="color: var(--text-secondary);">قائمة بجميع المزادات والمناقصات الخاصة بك</p>
            </div>
            <button class="btn btn-primary" onclick="loadNewDeal()"><i class="fa-solid fa-plus"></i> إنشاء صفقة جديدة</button>
        </div>

        <div class="glass-panel" style="padding: 1.5rem; margin-bottom: 2rem; display: flex; gap: 1rem; align-items: center; justify-content: space-between;">
            <div style="flex: 1; position: relative;">
                <i class="fa-solid fa-magnifying-glass" style="position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted);"></i>
                <input type="text" placeholder="ابحث في الصفقات (العنوان، التصنيف...)" style="width: 100%; padding: 0.75rem 2.5rem 0.75rem 1rem; border-radius: 8px; border: 1px solid var(--border-glass); background: var(--bg-surface); color: var(--text-primary); font-family: var(--font-body);">
            </div>
            <div style="display: flex; gap: 1rem;">
                <select style="padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid var(--border-glass); background: var(--bg-surface); color: var(--text-primary); font-family: var(--font-body);">
                    <option>الكل (مزادات ومناقصات)</option>
                    <option>المزادات فقط</option>
                    <option>المناقصات فقط</option>
                </select>
                <select style="padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid var(--border-glass); background: var(--bg-surface); color: var(--text-primary); font-family: var(--font-body);">
                    <option>الحالة: الجميع</option>
                    <option>نشط</option>
                    <option>مغلق</option>
                </select>
            </div>
        </div>

        <div class="deals-container">
            ${dealsHTML}
        </div>
    `);
}

window.loadNewDeal = function () {
    const formHTML = `
        <div class="dashboard-header" style="margin-bottom: 2rem;">
            <h2 class="text-gradient">إنشاء صفقة جديدة</h2>
            <p style="color: var(--text-secondary);">أدخل البيانات الأساسية ودع الذكاء الاصطناعي يساعدك في صياغة الشروط وتصنيف الصفقة</p>
        </div>

        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem;">
            
            <!-- نموذج البيانات الأساسية -->
            <div class="glass-panel" style="padding: 2rem;">
                <h3 style="margin-bottom: 1.5rem; color: var(--primary-color); border-bottom: 1px solid var(--border-glass); padding-bottom: 0.5rem;">التفاصيل الأساسية</h3>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
                    <div>
                        <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-weight: 600;">نوع الصفقة</label>
                        <select style="width: 100%; padding: 0.8rem; border-radius: 8px; border: 1px solid var(--border-glass); background: var(--bg-surface); color: var(--text-primary); font-family: var(--font-body);">
                            <option>مناقصة (شراء / توريد)</option>
                            <option>مزاد (بيع / تأجير)</option>
                        </select>
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-weight: 600;">مجال النشاط</label>
                        <select id="deal-category-select" style="width: 100%; padding: 0.8rem; border-radius: 8px; border: 1px solid var(--border-glass); background: var(--bg-surface); color: var(--text-primary); font-family: var(--font-body);">
                            <option value="" disabled selected>اختر مجال النشاط...</option>
                            ${mockDB.categories.map(cat => `<option value="${cat.name}">${cat.name}</option>`).join('')}
                        </select>
                    </div>
                </div>

                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-weight: 600;">عنوان الصفقة</label>
                    <input type="text" placeholder="مثال: توريد شاشات تفاعلية للمكاتب الإدارية" style="width: 100%; padding: 0.8rem; border-radius: 8px; border: 1px solid var(--border-glass); background: var(--bg-surface); color: var(--text-primary); font-family: var(--font-body);">
                </div>

                <div style="margin-bottom: 1.5rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <label style="color: var(--text-secondary); font-weight: 600;">وصف الصفقة وكراسة الشروط المبسطة</label>
                        <button class="icon-btn ai-assistant-btn" style="width: auto; height: auto; padding: 0.3rem 0.6rem; font-size: 0.8rem; border-radius: 6px; display: flex; gap: 0.5rem;" onclick="simulateAIFormAssist()">
                            <i class="fa-solid fa-wand-magic-sparkles"></i> توليد الوصف بالذكاء الاصطناعي
                        </button>
                    </div>
                    <textarea id="deal-description" rows="5" placeholder="اكتب وصفاً مفصلاً أو اترك الذكاء الاصطناعي يقوم بصياغته بناءً على العنوان والمجال..." style="width: 100%; padding: 0.8rem; border-radius: 8px; border: 1px solid var(--border-glass); background: var(--bg-surface); color: var(--text-primary); font-family: var(--font-body); resize: vertical;"></textarea>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
                    <div>
                        <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-weight: 600;">تاريخ إغلاق استقبال العروض</label>
                        <input type="date" style="width: 100%; padding: 0.8rem; border-radius: 8px; border: 1px solid var(--border-glass); background: var(--bg-surface); color: var(--text-primary); font-family: var(--font-body);">
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-weight: 600;">قيمة التأمين الابتدائي (للمشاركة)</label>
                        <div style="position: relative;">
                            <input type="number" placeholder="0" style="width: 100%; padding: 0.8rem 0.8rem 0.8rem 3rem; border-radius: 8px; border: 1px solid var(--border-glass); background: var(--bg-surface); color: var(--text-primary); font-family: var(--font-body);">
                            <span style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 0.9rem;">ج.م</span>
                        </div>
                    </div>
                </div>

                <div style="margin-bottom: 2rem;">
                    <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-weight: 600;">المرفقات (صور، كراسة شروط PDF، مواصفات فنية) <span style="color: var(--danger);">*</span></label>
                    <div style="border: 2px dashed var(--border-glass); border-radius: 8px; padding: 2rem; text-align: center; background: rgba(0,0,0,0.02); position: relative; transition: var(--transition-fast);" onmouseover="this.style.borderColor='var(--primary-color)'; this.style.background='rgba(79, 70, 229, 0.05)'" onmouseout="this.style.borderColor='var(--border-glass)'; this.style.background='rgba(0,0,0,0.02)'">
                        <input type="file" id="new-deal-files" required multiple accept=".pdf,.doc,.docx,.zip,.rar,.jpg,.png" 
                            style="position: absolute; top:0; left:0; width:100%; height:100%; opacity:0; cursor: pointer; z-index: 10;" 
                            onchange="handleFileUploadPreview(this, 'new-deal-preview-list', 'new-deal-upload-text')">
                        <i class="fa-solid fa-cloud-arrow-up" style="font-size: 2.5rem; color: var(--primary-light); margin-bottom: 1rem;"></i>
                        <h4 id="new-deal-upload-text" style="color: var(--text-primary); margin-bottom: 0.5rem;">اسحب وأفلت الملفات هنا أو اضغط للاختيار</h4>
                        <p style="color: var(--text-muted); font-size: 0.85rem;">يدعم الذكاء الاصطناعي قراءة الـ PDF تلقائياً (الحد الأقصى 20 ميجا)</p>
                        <div id="new-deal-preview-list" style="margin-top: 1rem; display: flex; flex-direction: column; gap: 0.5rem; text-align: right;"></div>
                    </div>
                    <small id="new-deal-files-error" style="color: var(--danger); display: none; margin-top: 0.25rem;">يرجى إرفاق كراسة الشروط أو المواصفات</small>
                </div>

                <div style="display: flex; gap: 1rem; justify-content: flex-end; border-top: 1px solid var(--border-glass); padding-top: 1.5rem;">
                    <button class="btn" style="background: transparent; border: 1px solid var(--border-glass); color: var(--text-secondary);" onclick="loadMyDeals()">إلغاء</button>
                    <button class="btn btn-primary" onclick="simulateAIReviewBeforePublish()"><i class="fa-solid fa-robot"></i> مراجعة الذكاء الاصطناعي قبل النشر</button>
                </div>
            </div>

            <!-- اللوحة الجانبية: مساعد الذكاء الاصطناعي -->
            <div class="glass-panel" style="padding: 1.5rem; height: fit-content; border-top: 4px solid var(--accent-color);">
                <div style="display: flex; align-items: center; gap: 0.8rem; margin-bottom: 1.5rem;">
                    <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-color), #FCD34D); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; color: white;">
                        <i class="fa-solid fa-robot"></i>
                    </div>
                    <div>
                        <h3 style="font-size: 1.1rem; color: var(--text-primary);">مساعدك الذكي</h3>
                        <p style="font-size: 0.8rem; color: var(--text-secondary);">متصل ويحلل مدخلاتك...</p>
                    </div>
                </div>

                <div id="ai-live-feedback" style="display: flex; flex-direction: column; gap: 1rem;">
                    <div style="background: var(--bg-base); padding: 1rem; border-radius: 8px; border-right: 3px solid var(--info); font-size: 0.9rem;">
                        <strong style="color: var(--text-primary); display: block; margin-bottom: 0.3rem;"><i class="fa-solid fa-circle-info" style="color: var(--info);"></i> نصيحة:</strong>
                        <span style="color: var(--text-secondary);">تحديد مجال النشاط بدقة يرفع نسبة المطابقة مع الموردين بنسبة تصل إلى 40%.</span>
                    </div>
                    <div style="background: var(--bg-base); padding: 1rem; border-radius: 8px; border-right: 3px solid var(--danger); font-size: 0.9rem;">
                        <strong style="color: var(--text-primary); display: block; margin-bottom: 0.3rem;"><i class="fa-solid fa-triangle-exclamation" style="color: var(--danger);"></i> نقص في البيانات:</strong>
                        <span style="color: var(--text-secondary);">كراسة الشروط فارغة. هل تريد أن أقوم بإنشاء كراسة مبدئية لك؟</span>
                    </div>
                </div>
            </div>

        </div>
    `;
    injectView(formHTML);
}

// Global UI utility for AI Form generation
window.simulateAIFormAssist = function () {
    simulateAILoading([
        "تحليل عنوان الصفقة والمجال...",
        "استدعاء نماذج كراسات الشروط المشابهة...",
        "صياغة الشروط الفنية والقانونية الأولية..."
    ], () => {
        const descBox = document.getElementById('deal-description');
        if (descBox) {
            descBox.value = "1. الهدف: توريد وتسليم الأجهزة المطلوبة للمقر الرئيسي.\n2. المواصفات: توافق تام مع المعايير الفنية المرفقة.\n3. الضمان: لا يقل عن 24 شهراً صيانة استبدال.\n4. الدفع: 30% دفعة مقدمة و 70% عند الاستلام.\n(تم توليد هذه الصيغة بواسطة الذكاء الاصطناعي بناءً على طبيعة أعمالك، يرجى مراجعتها وتعديلها)";
            descBox.style.boxShadow = "var(--shadow-glow)";
            setTimeout(() => { descBox.style.boxShadow = "none"; }, 2000);

            // Update AI feedback pane
            document.getElementById('ai-live-feedback').innerHTML = `
                <div style="background: var(--bg-base); padding: 1rem; border-radius: 8px; border-right: 3px solid var(--success); font-size: 0.9rem; animation: fade-in 0.5s;">
                    <strong style="color: var(--text-primary); display: block; margin-bottom: 0.3rem;"><i class="fa-solid fa-check" style="color: var(--success);"></i> تم بنجاح:</strong>
                    <span style="color: var(--text-secondary);">لقد قمت بإضافة وصف احترافي وشروط أساسية. لقد ارتفعت جودة تقييم الصفقة إلى 85%.</span>
                </div>
            `;
        }
    });
}

window.simulateAIReviewBeforePublish = function () {
    const titleInput = document.querySelector('input[placeholder*="مثال: توريد شاشات"]');
    const descInput = document.getElementById('deal-description');
    const filesInput = document.getElementById('new-deal-files');
    const filesError = document.getElementById('new-deal-files-error');

    let isValid = true;

    if (filesInput && filesInput.files.length === 0) {
        if (filesError) filesError.style.display = 'block';
        isValid = false;
    } else if (filesError) {
        filesError.style.display = 'none';
    }

    if (!titleInput?.value || !descInput?.value) {
        alert("يرجى تعبئة العنوان والوصف قبل المراجعة الذكية للنشر.");
        return;
    }

    if (!isValid) return;

    simulateAILoading([
        "تدقيق قانوني لشروط العقد...",
        "حساب المخاطر المالية والتأمين...",
        "تهيئة محرك البحث لاستقطاب أفضل العروض..."
    ], () => {
        const html = `
            <div class="glass-panel" style="padding: 3rem; max-width: 800px; margin: 2rem auto;">
                <div style="text-align: center;">
                    <div style="font-size: 4rem; color: var(--success); margin-bottom: 1rem;"><i class="fa-solid fa-shield-check"></i></div>
                    <h2 style="margin-bottom: 1rem; color: var(--text-primary);">الصفقة جاهزة من الناحية القانونية والمالية!</h2>
                    <p style="color: var(--text-secondary); margin-bottom: 2rem; line-height: 1.8;">لم يجد النظام أي ثغرات قانونية. استناداً للسوق الحالي، نتوقع استلام <strong>5 إلى 8 عروض</strong> خلال الأسبوع الأول.</p>
                </div>
                
                <!-- NEW: جلسة تغذية قاعدة المعرفة للموردين -->
                <div style="background: rgba(79, 70, 229, 0.03); border: 1px solid var(--primary-light); border-radius: 8px; padding: 2rem; margin-bottom: 2rem;">
                    <h3 style="color: var(--primary-color); margin-bottom: 1rem; font-size: 1.2rem; display: flex; align-items: center; gap: 0.5rem;">
                        <i class="fa-solid fa-brain"></i> تجهيز المساعد الذكي للإجابة عن الموردين
                    </h3>
                    <p style="color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 1.5rem; line-height: 1.6;">
                        لتقليل الاستفسارات المكررة، قام الذكاء الاصطناعي باستنباط أهم 3 أسئلة قد يطرحها الموردون بناءً على كراسة الشروط. نرجو الإجابة عنها لتدريب مساعدك الذكي:
                    </p>
                    
                    <div style="display: flex; flex-direction: column; gap: 1.5rem; margin-bottom: 2rem;">
                        <div style="background: var(--bg-surface); padding: 1.2rem; border-radius: 6px; border-right: 3px solid var(--accent-color);">
                            <label style="display: block; font-weight: bold; color: var(--text-primary); margin-bottom: 0.5rem;">1. هل السعر يشمل رسوم التركيب والدعم الفني في الموقع الساند؟</label>
                            <input type="text" placeholder="إجابتك السريعة (مثال: نعم، يجب أن يشمل السعر التركيب والصيانة للسنة الأولى)" style="width: 100%; padding: 0.8rem; border-radius: 6px; border: 1px solid var(--border-glass); background: var(--bg-surface); color: var(--text-primary); font-family: var(--font-body);">
                        </div>
                        
                        <div style="background: var(--bg-surface); padding: 1.2rem; border-radius: 6px; border-right: 3px solid var(--accent-color);">
                            <label style="display: block; font-weight: bold; color: var(--text-primary); margin-bottom: 0.5rem;">2. ما هو الحد الأدنى لسنوات الضمان المقبولة للأجهزة الموردة؟</label>
                            <input type="text" placeholder="إجابتك السريعة (مثال: الحد الأدنى 3 سنوات صيانة شاملة)" style="width: 100%; padding: 0.8rem; border-radius: 6px; border: 1px solid var(--border-glass); background: var(--bg-surface); color: var(--text-primary); font-family: var(--font-body);">
                        </div>
                        
                        <div style="background: var(--bg-surface); padding: 1.2rem; border-radius: 6px; border-right: 3px solid var(--accent-color);">
                            <label style="display: block; font-weight: bold; color: var(--text-primary); margin-bottom: 0.5rem;">3. في حال وجود تأخير عن المدة المتفق عليها، هل يوجد شرط جزائي محدد؟</label>
                            <input type="text" placeholder="إجابتك السريعة (مثال: نعم، يطبق خصم 1% عن كل أسبوع تأخير)" style="width: 100%; padding: 0.8rem; border-radius: 6px; border: 1px solid var(--border-glass); background: var(--bg-surface); color: var(--text-primary); font-family: var(--font-body);">
                        </div>
                    </div>
                </div>

                <div style="display: flex; gap: 1rem; justify-content: center;">
                    <button class="btn btn-primary" onclick="window.broadcastDealNotification()"><i class="fa-solid fa-paper-plane"></i> نشر الصفقة وبدء تلقي العروض</button>
                    <button class="btn" style="border: 1px solid var(--border-glass);" onclick="loadMyDeals()">حفظ كمسودة</button>
                </div>
            </div>
        `;
        injectView(html);
    });
}

window.broadcastDealNotification = function () {
    const selectedCategory = document.getElementById('deal-category-select')?.value || "عام";
    
    simulateAILoading([
        "جاري إدراج الصفقة في قاعدة البيانات...",
        `تم تحديد التصنيف المستهدف: ${selectedCategory}`,
        "البحث عن الموردين الموثقين في هذا المجال...",
        "توليد رسائل SMS مخصصة لكل مورد...",
        "تم إرسال (14) رسالة SMS للمتخصصين بنجاح! ✅"
    ], () => {
        alert(`تم نشر الصفقة بنجاح! قام النظام بإرسال تنبيهات SMS فورية لجميع الموردين المسجلين في تصنيف "${selectedCategory}".`);
        loadMyDeals();
    });
};

window.loadManageBids = function () {
    // محاكاة مجموعة من العروض لصفقة ما
    const mockBids = [
        { id: 1, supplier: "الشركة العربية للتوريدات", price: 95000, duration: "30 يوم", techScore: 90, aiRecommend: true },
        { id: 2, supplier: "مؤسسة الأفق المتقدم", price: 88000, duration: "45 يوم", techScore: 82, aiRecommend: false },
        { id: 3, supplier: "شركة النخبة للأجهزة", price: 105000, duration: "20 يوم", techScore: 95, aiRecommend: false }
    ];

    const html = `
            <div class="dashboard-header" style = "margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: flex-end;" >
            <div>
                <h2 class="text-gradient">مقارنة العروض (توريد أجهزة حواسيب)</h2>
                <p style="color: var(--text-secondary);">استعراض العروض المقدمة وتوصيات الذكاء الاصطناعي</p>
            </div>
            <button class="btn btn-primary" onclick="simulateAIFormAssist()"><i class="fa-solid fa-scale-balanced"></i> إعادة التحليل والمقارنة</button>
        </div>

            <div style="display: grid; grid-template-columns: 3fr 1fr; gap: 2rem;">

                <!-- جدول العروض -->
                <div class="glass-panel" style="padding: 1.5rem;">
                    <h3 style="margin-bottom: 1.5rem; color: var(--text-primary); border-bottom: 1px solid var(--border-glass); padding-bottom: 0.5rem;">العروض المستلمة (3)</h3>
                    <div style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse; text-align: right;">
                            <thead>
                                <tr style="color: var(--text-muted); border-bottom: 1px solid var(--border-glass);">
                                    <th style="padding: 1rem 0.5rem;">المورد</th>
                                    <th style="padding: 1rem 0.5rem;">السعر</th>
                                    <th style="padding: 1rem 0.5rem;">مدة التنفيذ</th>
                                    <th style="padding: 1rem 0.5rem;">التقييم الفني</th>
                                    <th style="padding: 1rem 0.5rem; text-align: center;">الإجراء</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${mockBids.map(bid => `
                                <tr class="deal-row" style="border-bottom: 1px solid var(--border-glass); cursor: pointer; ${bid.aiRecommend ? 'background: rgba(16, 185, 129, 0.05);' : ''}" onclick="loadOfferDetails(${bid.id}, '${bid.supplier}', ${bid.price}, '${bid.duration}', ${bid.techScore}, ${bid.aiRecommend})">
                                    <td style="padding: 1.25rem 0.5rem;">
                                        <div style="font-weight: bold; color: var(--primary-color); display: flex; align-items: center; gap: 0.5rem;">
                                            ${bid.supplier}
                                            ${bid.aiRecommend ? '<span class="badge" style="background: var(--success); color: white; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.7rem; box-shadow: 0 0 10px rgba(16, 185, 129, 0.4);"><i class="fa-solid fa-star"></i> اختيار الذكاء الاصطناعي</span>' : ''}
                                        </div>
                                    </td>
                                    <td style="padding: 1.25rem 0.5rem; font-weight: bold;">${bid.price.toLocaleString()} ج.م</td>
                                    <td style="padding: 1.25rem 0.5rem;">${bid.duration}</td>
                                    <td style="padding: 1.25rem 0.5rem;">
                                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                                            <div style="width: 60px; height: 6px; background: var(--border-glass); border-radius: 3px; overflow: hidden;">
                                                <div style="height: 100%; width: ${bid.techScore}%; background: var(--primary-light);"></div>
                                            </div>
                                            <span style="font-size: 0.85rem; color: var(--text-secondary);">${bid.techScore}%</span>
                                        </div>
                                    </td>
                                    <td style="padding: 1.25rem 0.5rem; text-align: center;">
                                        <button class="btn" style="padding: 0.4rem 0.8rem; font-size: 0.85rem; background: var(--primary-light); color: white;" onclick="event.stopPropagation(); alert('سيتم ترسية الصفقة على ${bid.supplier}')">ترسية</button>
                                        <button class="icon-btn" style="background: transparent; border: 1px solid var(--border-glass); width: 32px; height: 32px;" title="عرض كامل التفاصيل" onclick="event.stopPropagation(); loadOfferDetails(${bid.id}, '${bid.supplier}', ${bid.price}, '${bid.duration}', ${bid.techScore}, ${bid.aiRecommend})"><i class="fa-solid fa-arrow-up-right-from-square"></i></button>
                                    </td>
                                </tr>
                            `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- لوحة الذكاء الاصطناعي التحليلية -->
                <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                    <div class="glass-panel" style="padding: 1.5rem; border-top: 4px solid var(--success);">
                        <h3 style="margin-bottom: 1rem; color: var(--success); display: flex; align-items: center; gap: 0.5rem;"><i class="fa-solid fa-ranking-star"></i> العرض الأمثل</h3>
                        <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6;">
                            يوصي النظام باختيار <strong>الشركة العربية للتوريدات</strong>.
                            على الرغم من أن عرض "مؤسسة الأفق المتقدم" أرخص بـ 7,000 ج.م، إلا أن التقييم الفني وسابقة أعمال الشركة العربية تتفوق بنسبة 20%، مما يقلل مخاطر التأخير بمتوسط 15 يوماً إضافية.
                        </p>
                    </div>

                    <div class="glass-panel" style="padding: 1.5rem;">
                        <h4 style="margin-bottom: 1rem; color: var(--text-primary);"><i class="fa-solid fa-chart-pie"></i> توزع العروض</h4>
                        <div style="display: flex; flex-direction: column; gap: 0.8rem;">
                            <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
                                <span style="color: var(--text-secondary);">متوسط الأسعار</span>
                                <strong style="color: var(--text-primary);">96,000 ج.م</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
                                <span style="color: var(--text-secondary);">أرخص عرض</span>
                                <strong style="color: var(--success);">88,000 ج.م</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
                                <span style="color: var(--text-secondary);">أعلى تقييم فني</span>
                                <strong style="color: var(--primary-color);">95%</strong>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        `;
    injectView(html);
};

window.loadOfferDetails = function (bidId, supplierName, price, duration, techScore, aiRecommend) {
    // محاكاة بيانات الملف التعريفي
    const companyProfile = {
        rating: 4.8,
        successRate: "95%",
        founded: 2015,
        projectsDelivered: 120,
        notes: "نلتزم بتوريد أجهزة مطابقة للمواصفات القياسية المطلوبة مع تقديم الدعم الفني والصيانة الدورية شاملة قطع الغيار."
    };

    let aiReportText = '';
    if (aiRecommend) {
        aiReportText = `تقييم الشركة <strong>ممتاز</strong>. تتوافق خبراتهم السابقة مع متطلبات المشروع بنسبة عالية. السعر المقدم (${price.toLocaleString()} ج.م) تنافسي جداً مقارنة بمتوسط السوق المعتاد لمثل هذا التوريد، والمدة المقترحة (${duration}) تعتبر الأفضل بناءً على الصفقات المماثلة. <strong>يُنصح بالترسية</strong>.`;
    } else {
        aiReportText = `سجل الشركة <strong>جيد جداً</strong>. التقييم الفني عالي (${techScore}%) وموثوقية عالية، لكن السعر (${price.toLocaleString()} ج.م) قد يكون أعلى بقليل من المتوقع أو المدة (${duration}) أطول من بعض المنافسين. <strong>يُنصح بالتفاوض لتخفيض السعر المتوقع</strong>.`;
    }

    const html = `
        <div style="margin-bottom: 1.5rem;">
            <button class="btn" style="background: transparent; border: 1px solid var(--border-glass); color: var(--text-secondary); padding: 0.4rem 0.8rem;" onclick="loadManageBids()"><i class="fa-solid fa-arrow-right"></i> العودة لمقارنة العروض</button>
        </div>

        <div class="dashboard-header" style="margin-bottom: 2rem;">
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem;">
                <div style="width: 50px; height: 50px; background: var(--bg-surface); border: 1px solid var(--border-glass); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: var(--primary-light);">
                    <i class="fa-solid fa-building"></i>
                </div>
                <div>
                    <h2 class="text-gradient" style="margin: 0;">${supplierName}</h2>
                    <div style="display: flex; gap: 1rem; color: var(--text-muted); font-size: 0.9rem; margin-top: 0.3rem;">
                        <span><i class="fa-solid fa-star" style="color: #F59E0B;"></i> ${companyProfile.rating}/5</span>
                        <span><i class="fa-solid fa-check-circle" style="color: var(--success);"></i> معدل التزام ${companyProfile.successRate}</span>
                        <span><i class="fa-solid fa-briefcase" style="color: var(--info);"></i> ${companyProfile.projectsDelivered} مشروع منجز</span>
                    </div>
                </div>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem;">
            <!-- تفاصيل العرض -->
            <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                <div class="glass-panel" style="padding: 2rem;">
                    <h3 style="margin-bottom: 1.5rem; color: var(--text-primary); border-bottom: 1px solid var(--border-glass); padding-bottom: 0.5rem;"><i class="fa-solid fa-file-invoice-dollar" style="color: var(--primary-color);"></i> تفاصيل العرض المالي والفني</h3>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
                        <div style="background: rgba(0,0,0,0.02); padding: 1.2rem; border-radius: 8px; border: 1px dashed var(--border-glass);">
                            <span style="color: var(--text-secondary); font-size: 0.9rem; display: block; margin-bottom: 0.5rem;">قيمة العرض المالي</span>
                            <strong style="color: var(--primary-color); font-size: 1.4rem;">${price.toLocaleString()} ج.م</strong>
                        </div>
                        <div style="background: rgba(0,0,0,0.02); padding: 1.2rem; border-radius: 8px; border: 1px dashed var(--border-glass);">
                            <span style="color: var(--text-secondary); font-size: 0.9rem; display: block; margin-bottom: 0.5rem;">المدة المقترحة للتسليم</span>
                            <strong style="color: var(--text-primary); font-size: 1.4rem;">${duration}</strong>
                        </div>
                    </div>

                    <div style="margin-bottom: 2rem;">
                        <h4 style="color: var(--text-primary); margin-bottom: 0.8rem; font-size: 1rem;"><i class="fa-solid fa-quote-right" style="color: var(--text-muted);"></i> الملاحظات والنبذة الفنية</h4>
                        <p style="color: var(--text-secondary); line-height: 1.7; background: var(--bg-surface); padding: 1rem; border-radius: 6px; border-right: 3px solid var(--info); font-size: 0.95rem;">
                            ${companyProfile.notes}
                        </p>
                    </div>

                    <div>
                        <h4 style="color: var(--text-primary); margin-bottom: 1rem; font-size: 1rem;"><i class="fa-solid fa-paperclip" style="color: var(--text-muted);"></i> المرفقات لغرض المراجعة</h4>
                        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                            <a href="#" class="btn" style="background: var(--bg-surface); border: 1px solid var(--border-glass); color: var(--text-primary); font-size: 0.9rem; padding: 0.6rem 1rem;"><i class="fa-regular fa-file-pdf" style="color: var(--danger); margin-left: 0.4rem;"></i> العرض الفني والتجاري.pdf</a>
                            <a href="#" class="btn" style="background: var(--bg-surface); border: 1px solid var(--border-glass); color: var(--text-primary); font-size: 0.9rem; padding: 0.6rem 1rem;"><i class="fa-solid fa-file-invoice" style="color: var(--info); margin-left: 0.4rem;"></i> السجل التجاري والضريبي.pdf</a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- لوحة القرار والذكاء الاصطناعي -->
            <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                
                <!-- تقرير الذكاء الاصطناعي الخاص بالشركة -->
                <div class="glass-panel" style="padding: 1.5rem; border-top: 4px solid var(--primary-light); background: rgba(79, 70, 229, 0.03);">
                    <h3 style="margin-bottom: 1rem; color: var(--primary-light); display: flex; align-items: center; gap: 0.5rem;"><i class="fa-solid fa-robot"></i> تقرير الذكاء الاصطناعي للمُرَشَّح</h3>
                    
                    <div style="margin-bottom: 1.2rem; display: flex; align-items: center; justify-content: space-between;">
                        <span style="color: var(--text-secondary); font-size: 0.9rem;">التقييم الفني للمعايير</span>
                        <strong style="color: ${techScore >= 90 ? 'var(--success)' : 'var(--accent-color)'}; font-size: 1.1rem;">${techScore}%</strong>
                    </div>

                    <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.8; margin-bottom: 0;">
                        ${aiReportText}
                    </p>
                </div>

                <!-- أزرار الإجراءات السريعة -->
                <div class="glass-panel" style="padding: 1.5rem;">
                    <h3 style="margin-bottom: 1.2rem; color: var(--text-primary); font-size: 1.1rem;"><i class="fa-solid fa-gavel" style="color: var(--text-muted);"></i> اتخاذ القرار</h3>
                    
                    <div style="display: flex; flex-direction: column; gap: 0.8rem;">
                        <button class="btn" style="width: 100%; background: var(--success); color: white; padding: 1rem; font-size: 1.05rem;" onclick="simulateAwardDeal('${supplierName}')">
                            <i class="fa-solid fa-check-double" style="margin-left: 0.5rem;"></i> قبول العرض والترسية الدائمة
                        </button>
                        
                        <button class="btn" style="width: 100%; background: var(--bg-surface); border: 1px solid var(--border-glass); color: var(--text-primary); padding: 0.8rem;" onclick="alert('سيتيم فتح قناة محادثة لتفاوض السعر مع المورد.')">
                            <i class="fa-solid fa-comments-dollar" style="margin-left: 0.5rem; color: var(--info);"></i> طلب تفاوض وتخفيض
                        </button>
                        
                        <button class="btn" style="width: 100%; background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.2); color: var(--danger); padding: 0.8rem;" onclick="alert('تم استبعاد العرض من المنافسة.')">
                            <i class="fa-solid fa-ban" style="margin-left: 0.5rem;"></i> استبعاد العرض
                        </button>
                    </div>
                </div>

            </div>
        </div>
    `;
    injectView(html);
};

window.simulateAwardDeal = function (supplierName) {
    simulateAILoading([
        "جاري إشعار البنك لفك الحجز التأميني للموردين الآخرين...",
        "إعداد خطاب الاعتماد المبدئي للترسية...",
        "إرسال إشعار فوز للشركة..."
    ], () => {
        injectView(`
            <div class="glass-panel" style="padding: 4rem 2rem; text-align: center; max-width: 600px; margin: 2rem auto;">
                <div style="width: 80px; height: 80px; background: rgba(16, 185, 129, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem;">
                    <i class="fa-solid fa-signature" style="font-size: 3rem; color: var(--success);"></i>
                </div>
                <h2 style="color: var(--success); margin-bottom: 1rem;">تمت ترسية الصفقة بنجاح!</h2>
                <p style="color: var(--text-secondary); margin-bottom: 2rem; line-height: 1.6;">
                    تم اختيار <strong>${supplierName}</strong> لتنفيذ المشروع وإشعارهم رسمياً بالترسية. يمكنك الآن متابعة التنفيذ والتوقيع على العقود.
                </p>
                <button class="btn btn-primary" onclick="loadPublisherDashboard()">العودة للوحة التحكم</button>
            </div>
        `);
    });
};

// ==========================================
// AI Helper Modal for Bidder (Chatbot & FAQ)
// ==========================================
window.openAIHelperModal = function (dealTitle) {
    // إزالة أي نافذة سابقة إن وجدت
    const existingModal = document.getElementById('ai-helper-modal');
    if (existingModal) existingModal.remove();

    const modalHTML = `
        <div id="ai-helper-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.4); backdrop-filter: blur(5px); z-index: 9999; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s ease;">
            <div class="glass-panel" style="width: 90%; max-width: 600px; height: 80vh; max-height: 800px; display: flex; flex-direction: column; padding: 0; overflow: hidden; position: relative; transform: translateY(20px); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
                
                <!-- Modal Header -->
                <div style="padding: 1.2rem 1.5rem; border-bottom: 1px solid var(--border-glass); display: flex; justify-content: space-between; align-items: center; background: rgba(79, 70, 229, 0.05);">
                    <div style="display: flex; align-items: center; gap: 0.8rem;">
                        <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, var(--primary-light), var(--primary-color)); display: flex; justify-content: center; align-items: center; color: white; box-shadow: 0 4px 10px rgba(79, 70, 229, 0.3);">
                            <i class="fa-solid fa-robot"></i>
                        </div>
                        <div>
                            <h3 style="margin: 0; font-size: 1.1rem; color: var(--text-primary);">المساعد الذكي للمشتريات</h3>
                            <span style="font-size: 0.75rem; color: var(--text-secondary); display: flex; align-items: center; gap: 0.3rem;"><span style="display:inline-block; width:8px; height:8px; background:var(--success); border-radius:50%;"></span> متصل وجاهز للتحليل</span>
                        </div>
                    </div>
                    <button class="icon-btn" onclick="closeAIHelperModal()" style="color: var(--text-muted);"><i class="fa-solid fa-xmark"></i></button>
                </div>

                <!-- Modal Body (Scrollable Chat) -->
                <div id="ai-chat-body" style="flex: 1; overflow-y: auto; padding: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem; background: var(--bg-body);">
                    
                    <!-- AI Summary Message -->
                    <div style="display: flex; gap: 1rem; max-width: 90%;">
                        <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--primary-light); display: flex; justify-content: center; align-items: center; color: white; flex-shrink: 0; font-size: 0.8rem;">
                            <i class="fa-solid fa-wand-magic-sparkles"></i>
                        </div>
                        <div style="background: var(--bg-surface); border: 1px solid var(--border-glass); padding: 1rem 1.2rem; border-radius: 2px 16px 16px 16px; box-shadow: 0 2px 5px rgba(0,0,0,0.02);">
                            <h4 style="color: var(--primary-color); font-size: 0.9rem; margin-bottom: 0.5rem;">مرحباً! لقد قمت بتحليل كراسة شروط (${dealTitle}) نيابة عنك. إليك الخلاصة:</h4>
                            <ul style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6; padding-right: 1.2rem; margin-bottom: 0;">
                                <li>المطلوب توريد وتركيب أجهزة ضمن ميزانية معلنة.</li>
                                <li><strong>التأمين الابتدائي:</strong> مطلوب قبل تقديم العرض ويُرد في حال عدم الترسية.</li>
                                <li><strong>المدة الزمنية:</strong> تسليم ابتدائي خلال 30 يوم من تاريخ أمر الشراء.</li>
                            </ul>
                        </div>
                    </div>

                    <!-- AI FAQ Message -->
                    <div style="display: flex; gap: 1rem; max-width: 90%;">
                        <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--bg-surface); border: 1px solid var(--border-glass); display: flex; justify-content: center; align-items: center; color: var(--primary-color); flex-shrink: 0; font-size: 0.8rem;">
                            <i class="fa-solid fa-circle-question"></i>
                        </div>
                        <div style="background: var(--bg-surface); border: 1px solid var(--border-glass); padding: 1rem 1.2rem; border-radius: 2px 16px 16px 16px; box-shadow: 0 2px 5px rgba(0,0,0,0.02); width: 100%;">
                            <h4 style="color: var(--text-primary); font-size: 0.9rem; margin-bottom: 0.8rem;">استفسارات شائعة وضعها الناشر مسبقاً:</h4>
                            
                            <div style="display: flex; flex-direction: column; gap: 0.8rem;">
                                <div style="background: rgba(0,0,0,0.02); padding: 0.8rem; border-radius: 6px; border-right: 3px solid var(--accent-color);">
                                    <strong style="display: block; font-size: 0.85rem; color: var(--text-primary); margin-bottom: 0.3rem;">هل السعر يشمل التركيب والدعم بالموقع؟</strong>
                                    <span style="font-size: 0.85rem; color: var(--text-secondary);">نعم، يجب أن يشمل السعر التركيب والصيانة الميدانية للسنة الأولى.</span>
                                </div>
                                <div style="background: rgba(0,0,0,0.02); padding: 0.8rem; border-radius: 6px; border-right: 3px solid var(--accent-color);">
                                    <strong style="display: block; font-size: 0.85rem; color: var(--text-primary); margin-bottom: 0.3rem;">والضمان كم مدته المطلوبة؟</strong>
                                    <span style="font-size: 0.85rem; color: var(--text-secondary);">الحد الأدنى 3 سنوات صيانة شاملة للأجهزة.</span>
                                </div>
                                <div style="background: rgba(0,0,0,0.02); padding: 0.8rem; border-radius: 6px; border-right: 3px solid var(--accent-color);">
                                    <strong style="display: block; font-size: 0.85rem; color: var(--text-primary); margin-bottom: 0.3rem;">هل يوجد شرط جزائي للتأخير؟</strong>
                                    <span style="font-size: 0.85rem; color: var(--text-secondary);">نعم يطبق خصم 1% عن كل أسبوع تأخير.</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <!-- Modal Footer (Chat Input) -->
                <div style="padding: 1rem 1.5rem; border-top: 1px solid var(--border-glass); background: var(--bg-surface); display: flex; gap: 0.8rem; align-items: center;">
                    <button class="icon-btn" style="color: var(--text-muted);"><i class="fa-solid fa-paperclip"></i></button>
                    <input type="text" id="ai-chat-input" placeholder="اسأل أي شيء عن هذه الصفقة..." style="flex: 1; padding: 0.8rem 1rem; border-radius: 20px; border: 1px solid var(--border-glass); background: var(--bg-body); color: var(--text-primary); font-family: var(--font-body);" onkeypress="if(event.key === 'Enter') sendAIChatMessage()">
                    <button class="icon-btn" style="background: var(--primary-light); color: white;" onclick="sendAIChatMessage()"><i class="fa-solid fa-paper-plane"></i></button>
                </div>

            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Animate In
    setTimeout(() => {
        const modal = document.getElementById('ai-helper-modal');
        if (modal) {
            modal.style.opacity = '1';
            modal.querySelector('.glass-panel').style.transform = 'translateY(0)';
        }
    }, 10);
};

window.closeAIHelperModal = function () {
    const modal = document.getElementById('ai-helper-modal');
    if (modal) {
        modal.style.opacity = '0';
        modal.querySelector('.glass-panel').style.transform = 'translateY(20px)';
        setTimeout(() => modal.remove(), 300);
    }
};

window.sendAIChatMessage = function () {
    const input = document.getElementById('ai-chat-input');
    const text = input.value.trim();
    if (!text) return;

    input.value = '';

    const chatBody = document.getElementById('ai-chat-body');

    // User Message
    const userMsgHTML = `
        <div style="display: flex; gap: 1rem; max-width: 90%; align-self: flex-end; flex-direction: row-reverse;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--bg-surface); border: 1px solid var(--border-glass); display: flex; justify-content: center; align-items: center; color: var(--text-primary); flex-shrink: 0; font-size: 0.8rem;">
                <i class="fa-solid fa-user"></i>
            </div>
            <div style="background: var(--primary-color); color: white; padding: 0.8rem 1.2rem; border-radius: 16px 2px 16px 16px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                <p style="margin: 0; font-size: 0.95rem; line-height: 1.5;">${text}</p>
            </div>
        </div>
    `;

    chatBody.insertAdjacentHTML('beforeend', userMsgHTML);
    chatBody.scrollTop = chatBody.scrollHeight;

    // Simulate AI loading dots
    const aiTypingId = 'ai-typing-' + Date.now();
    const typingHTML = `
        <div id="${aiTypingId}" style="display: flex; gap: 1rem; max-width: 90%;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--primary-light); display: flex; justify-content: center; align-items: center; color: white; flex-shrink: 0; font-size: 0.8rem;">
                <i class="fa-solid fa-robot"></i>
            </div>
            <div style="background: var(--bg-surface); border: 1px solid var(--border-glass); padding: 0.8rem 1.2rem; border-radius: 2px 16px 16px 16px; display: flex; align-items: center; gap: 0.3rem;">
                <span style="display: block; width: 6px; height: 6px; background: var(--text-muted); border-radius: 50%; animation: pulse 1s infinite alternate;"></span>
                <span style="display: block; width: 6px; height: 6px; background: var(--text-muted); border-radius: 50%; animation: pulse 1s infinite alternate 0.2s;"></span>
                <span style="display: block; width: 6px; height: 6px; background: var(--text-muted); border-radius: 50%; animation: pulse 1s infinite alternate 0.4s;"></span>
            </div>
        </div>
    `;
    chatBody.insertAdjacentHTML('beforeend', typingHTML);
    chatBody.scrollTop = chatBody.scrollHeight;

    // Simulate Response
    setTimeout(() => {
        document.getElementById(aiTypingId).remove();

        const aiMsgHTML = `
            <div style="display: flex; gap: 1rem; max-width: 90%;">
                <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--primary-light); display: flex; justify-content: center; align-items: center; color: white; flex-shrink: 0; font-size: 0.8rem;">
                    <i class="fa-solid fa-robot"></i>
                </div>
                <div style="background: var(--bg-surface); border: 1px solid var(--border-glass); padding: 1rem 1.2rem; border-radius: 2px 16px 16px 16px; box-shadow: 0 2px 5px rgba(0,0,0,0.02);">
                    <p style="color: var(--text-primary); font-size: 0.95rem; line-height: 1.6; margin: 0;">بناءً على ملفات الصفقة المُرفقة، يبدو أنه لا يوجد تفصيل عميق لهذه النقطة المحددة. أنصحك بإرسال استفسار مباشر للناشر من خلال الشاشة الرئيسية لضمان دقة التسعير.</p>
                </div>
            </div>
        `;
        chatBody.insertAdjacentHTML('beforeend', aiMsgHTML);
        chatBody.scrollTop = chatBody.scrollHeight;
    }, 1500);
};

// ==========================================
// Companies Management with Firebase
// ==========================================

window.loadCompanies = function () {
    console.log("loadCompanies view triggered.");
    const html = `
        <div class="dashboard-header" style="margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center;">
            <div>
                <h2 class="text-gradient">إدارة الشركات</h2>
                <p style="color: var(--text-secondary);">إضافة الشركات المتقدمة وتعريف تخصصاتها ومفوضيها</p>
            </div>
            <div style="display: flex; gap: 1rem;">
                <button class="btn btn-ghost" onclick="downloadCompanyTemplate()" title="تحميل نموذج Excel">
                    <i class="fa-solid fa-file-excel"></i> تحميل النموذج
                </button>
                <button class="btn btn-ghost" onclick="document.getElementById('excel-upload').click()" title="استيراد من Excel">
                    <i class="fa-solid fa-upload"></i> استيراد Excel
                </button>
                <input type="file" id="excel-upload" accept=".xlsx, .xls, .csv" style="display: none;" onchange="importCompaniesFromExcel(event)">
                
                <button class="btn btn-ghost" onclick="fetchCompaniesFromFirebase()" title="تحديث البيانات">
                    <i class="fa-solid fa-sync"></i> تحديث
                </button>
                <button class="btn btn-primary" onclick="openAddCompanyModal()">
                    <i class="fa-solid fa-plus-circle"></i> إضافة شركة جديدة
                </button>
            </div>
        </div>

        <div class="glass-panel" style="padding: 1.5rem; overflow-x: auto;">
            <table style="width: 100%; text-align: right; border-collapse: collapse; min-width: 800px;">
                <thead>
                    <tr style="color: var(--text-muted); border-bottom: 1px solid var(--border-glass);">
                        <th style="padding: 1rem 0.5rem;">اسم الشركة</th>
                        <th>مجال التخصص</th>
                        <th>الدولة</th>
                        <th>أسم المفوض</th>
                        <th>رقم الهاتف</th>
                        <th>الحالة</th>
                        <th style="text-align: left;">الإجراءات</th>
                    </tr>
                </thead>
                <tbody id="companies-table-body">
                    <tr>
                        <td colspan="6" style="padding: 3rem; text-align: center; color: var(--text-muted);">
                            <i class="fa-solid fa-circle-notch fa-spin" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
                            جاري جلب البيانات من السيرفر...
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
    injectView(html);
    
    // Crucial: Wait for injectView's timeout (200ms) to finish so the DOM element exists
    setTimeout(() => {
        window.fetchCompaniesFromFirebase();
    }, 250);
};

window.fetchCompaniesFromFirebase = function () {
    const tableBody = document.getElementById("companies-table-body");
    if (!tableBody) return;

    console.log("Starting fetchCompaniesFromFirebase...");
    
    tableBody.innerHTML = `<tr><td colspan="6" style="padding: 3rem; text-align: center; color: var(--text-muted);">
        <i class="fa-solid fa-circle-notch fa-spin" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
        جاري الاستعلام من Firebase...
    </td></tr>`;

    // Try a one-time "get" first to force a connection check
    window.db.collection("companies").get()
        .then((querySnapshot) => {
            console.log("Initial GET success. Count:", querySnapshot.size);
            renderCompanyRows(querySnapshot);
            
            // Now start the real-time listener
            window.db.collection("companies").onSnapshot((snapshot) => {
                console.log("Real-time snapshot update received.");
                renderCompanyRows(snapshot);
            }, (error) => {
                console.error("Snapshot Error:", error);
            });
        })
        .catch((error) => {
            console.error("GET Error:", error);
            tableBody.innerHTML = `<tr><td colspan="6" style="padding: 3rem; text-align: center; color: var(--danger);">
                حدث خطأ في الاتصال: ${error.message}<br>
                <button class="btn btn-primary" style="margin-top:1rem;" onclick="fetchCompaniesFromFirebase()">إعادة المحاولة</button>
            </td></tr>`;
        });
};

function renderCompanyRows(snapshot) {
    const tableBody = document.getElementById("companies-table-body");
    if (!tableBody) return;

    let html = "";
    if (snapshot.empty) {
        html = `<tr><td colspan="6" style="padding: 3rem; text-align: center; color: var(--text-muted);">لا توجد شركات مسجلة حالياً.</td></tr>`;
    } else {
        snapshot.forEach((doc) => {
            const data = doc.data();
            html += `
                <tr style="border-bottom: 1px solid var(--border-glass); transition: var(--transition-fast);">
                    <td style="padding: 1rem 0.5rem; font-weight: 600; color: var(--primary-light);">${data.name}</td>
                    <td>${data.field}</td>
                    <td>${data.country || 'غير محدد'}</td>
                    <td>${data.representativeName}</td>
                    <td dir="ltr" style="text-align: right;">${data.representativePhone}</td>
                    <td><span class="badge" style="background: var(--success); padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.8rem;">نشط</span></td>
                    <td style="text-align: left;">
                        <button class="icon-btn btn-ghost" title="إرسال إشعار" onclick="notifyCompanyRepresentative('${data.name}', '${data.representativePhone}')">
                            <i class="fa-solid fa-bell" style="color: var(--accent-color);"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
    }
    tableBody.innerHTML = html;
}

window.openAddCompanyModal = function () {
    const modalHTML = `
        <div id="add-company-modal" class="ai-overlay" style="display: flex; justify-content: center; align-items: center; background: rgba(0,0,0,0.7); opacity: 0; transition: opacity 0.3s ease; z-index: 2000;">
            <div class="glass-panel" style="padding: 2.5rem; width: 100%; max-width: 500px; transform: translateY(20px); transition: transform 0.3s ease;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <h3 class="text-gradient" style="font-size: 1.5rem;">إضافة شركة جديدة</h3>
                    <button class="icon-btn btn-ghost" onclick="closeAddCompanyModal()"><i class="fa-solid fa-times"></i></button>
                </div>
                
                <form id="add-company-form" onsubmit="event.preventDefault(); saveCompanyToFirebase();">
                    <div style="margin-bottom: 1.2rem;">
                        <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary);">اسم الشركة</label>
                        <input type="text" id="co-name" required style="width: 100%; padding: 0.8rem; border-radius: 8px; border: 1px solid var(--border-glass); background: var(--bg-surface); color: var(--text-primary);">
                    </div>
                    <div style="margin-bottom: 1.2rem;">
                        <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary);">مجال التخصص</label>
                        <select id="co-field" required style="width: 100%; padding: 0.8rem; border-radius: 8px; border: 1px solid var(--border-glass); background: var(--bg-surface); color: var(--text-primary); font-family: var(--font-body);">
                             <option value="" disabled selected>اختر مجال التخصص...</option>
                             ${mockDB.categories.map(cat => `<option value="${cat.name}">${cat.name}</option>`).join('')}
                        </select>
                    </div>
                    <div style="margin-bottom: 1.2rem;">
                        <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary);">الدولة</label>
                        <input type="text" id="co-country" required placeholder="مثال: مصر، السعودية، الإمارات..." style="width: 100%; padding: 0.8rem; border-radius: 8px; border: 1px solid var(--border-glass); background: var(--bg-surface); color: var(--text-primary);">
                    </div>
                    <div style="margin-bottom: 1.2rem;">
                        <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary);">اسم المفوض</label>
                        <input type="text" id="co-rep" required style="width: 100%; padding: 0.8rem; border-radius: 8px; border: 1px solid var(--border-glass); background: var(--bg-surface); color: var(--text-primary);">
                    </div>
                    <div style="margin-bottom: 2rem;">
                        <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary);">رقم هاتف المفوض</label>
                        <input type="tel" id="co-phone" required placeholder="01xxxxxxxxx" style="width: 100%; padding: 0.8rem; border-radius: 8px; border: 1px solid var(--border-glass); background: var(--bg-surface); color: var(--text-primary); text-align: left;" dir="ltr">
                    </div>
                    
                    <button type="submit" id="save-co-btn" class="btn btn-primary" style="width: 100%; padding: 1rem;">حفظ الشركة في Firebase</button>
                </form>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    setTimeout(() => {
        const modal = document.getElementById('add-company-modal');
        modal.style.opacity = '1';
        modal.querySelector('.glass-panel').style.transform = 'translateY(0)';
    }, 10);
};

window.closeAddCompanyModal = function () {
    const modal = document.getElementById('add-company-modal');
    if (modal) {
        modal.style.opacity = '0';
        modal.querySelector('.glass-panel').style.transform = 'translateY(20px)';
        setTimeout(() => modal.remove(), 300);
    }
};

window.saveCompanyToFirebase = function () {
    const btn = document.getElementById("save-co-btn");
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> جاري الحفظ...`;

    const data = {
        name: document.getElementById("co-name").value,
        field: document.getElementById("co-field").value,
        country: document.getElementById("co-country").value,
        representativeName: document.getElementById("co-rep").value,
        representativePhone: document.getElementById("co-phone").value,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    db.collection("companies").add(data)
        .then(() => {
            closeAddCompanyModal();
            alert("تمت إضافة الشركة بنجاح إلى Firebase!");
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
            alert("حدث خطأ أثناء الحفظ. يرجى التأكد من صلاحيات Firebase (Firestore Rules).");
            btn.disabled = false;
            btn.textContent = "حفظ الشركة في Firebase";
        });
};

window.notifyCompanyRepresentative = function (companyName, phone) {
    simulateAILoading([
        `جاري تجهيز إشعار مخصص لشركة ${companyName}...`,
        `تحليل تفضيلات المفوض...`,
        `إرسال الرسالة إلى الرقم ${phone}...`
    ], () => {
        alert(`تم إرسال إشعار بنجاح إلى المفوض الخاص بشركة ${companyName} على الرقم ${phone}`);
    });
};

// ==========================================
// Excel Tools (Template & Import)
// ==========================================

window.downloadCompanyTemplate = function() {
    simulateAILoading([
        "تنسيق هيكل البيانات...",
        "إدراج حقل الدولة الجديد...",
        "إنشاء نموذج Excel للهيئة...",
        "جاري التحميل..."
    ], () => {
        const data = [
            ["اسم الشركة", "مجال التخصص", "الدولة", "اسم المفوض", "رقم الهاتف"],
            ["شركة المثال الحديثة", "المقاولات العامة", "مصر", "أحمد محمد", "01234567890"],
            ["مؤسسة التقنية الذكية", "البرمجيات والأمن السيبراني", "السعودية", "سارة علي", "01098765432"]
        ];
        
        const worksheet = XLSX.utils.aoa_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Companies");
        
        XLSX.writeFile(workbook, "Companies_Template_V2.xlsx");
    });
};

window.importCompaniesFromExcel = function(event) {
    const file = event.target.files[0];
    if (!file) return;

    simulateAILoading([
        "قراءة الملف...",
        "تحليل البيانات واستخراج الحقول (بما فيها الدولة)...",
        "التحقق من صحة البيانات...",
        "جاري الرفع إلى Firebase..."
    ], async () => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                if (jsonData.length === 0) {
                    alert("الملف فارغ أو غير صحيح.");
                    return;
                }

                let successCount = 0;
                for (const row of jsonData) {
                    // Mapping Arabic headers or standard keys
                    const companyData = {
                        name: row["اسم الشركة"] || row["Company Name"] || row["name"],
                        field: row["مجال التخصص"] || row["Expertise"] || row["field"],
                        country: row["الدولة"] || row["Country"] || row["country"] || "غير محدد",
                        representativeName: row["اسم المفوض"] || row["Representative"] || row["representativeName"],
                        representativePhone: row["رقم الهاتف"] || row["Phone"] || row["representativePhone"],
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    };

                    if (companyData.name) {
                        await db.collection("companies").add(companyData);
                        successCount++;
                    }
                }

                alert(`تم استيراد ${successCount} شركة بنجاح إلى Firebase!`);
                // Reset file input
                event.target.value = "";
            } catch (error) {
                console.error("Excel Import Error:", error);
                alert("حدث خطأ أثناء استيراد الملف. تأكد من الصيغة الصحيحة.");
            }
        };
        reader.readAsArrayBuffer(file);
    });
};
