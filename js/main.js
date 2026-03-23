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
    // Initial load logic
    setTimeout(() => {
        // Always show login screen first
        if (window.renderLoginView) window.renderLoginView();

        // Setup User Menu Interactions
        if (window.setupUserMenu) window.setupUserMenu();

        // Check for Deep Link (handled after login in handleRoleLogin)
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('dealId')) {
            console.log("Deep link pending for deal:", urlParams.get('dealId'));
        }
    }, 100);

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
// Authentication & Role Management Gateway
// ==========================================
window.renderLoginView = function () {
    const loginScreen = document.getElementById('login-screen');
    const appLayout = document.getElementById('app-layout');

    if (!loginScreen || !appLayout) return;

    loginScreen.classList.remove('hidden');
    appLayout.classList.add('hidden');

    loginScreen.innerHTML = `
        <div class="login-card glass-panel" style="animation: fadeIn 0.8s ease-out;">
            <div class="login-header">
                <i class="fa-solid fa-microchip"></i>
                <h2 class="text-gradient">منصة الصفقات والمناقصات الذكية</h2>
                <p>بوابتك المدعومة بالذكاء الاصطناعي لتجارة آمنة وموثقة</p>
            </div>

            <div class="role-selector">
                <div class="role-option" onclick="window.handleRoleLogin('admin')">
                    <i class="fa-solid fa-user-shield"></i>
                    <div class="role-info">
                        <h4>إدارة المنصة (Admin)</h4>
                        <p>التحكم الكامل، مراجعة التوثيق، وإدارة السياسات</p>
                    </div>
                </div>

                <div class="role-option" onclick="window.handleRoleLogin('publisher')">
                    <i class="fa-solid fa-building-circle-check"></i>
                    <div class="role-info">
                        <h4>ناشر الصفقات (Publisher)</h4>
                        <p>طرح المناقصات، استقبال العروض، والمفاوضات</p>
                    </div>
                </div>

                <div class="role-option" onclick="window.handleRoleLogin('bidder')">
                    <i class="fa-solid fa-handshake-angle"></i>
                    <div class="role-info">
                        <h4>مقدم العروض (Bidder)</h4>
                        <p>استكشاف الفرص، تقديم الأسعار، وتوسيع الأعمال</p>
                    </div>
                </div>
            </div>

            <div class="register-prompt">
                هل أنت شركة جديدة؟ 
                <button class="link-btn" onclick="window.showRegisterView()">سجل شركتك الآن للتوثيق الذكي</button>
            </div>
        </div>
    `;
};

window.handleRoleLogin = function (role) {
    simulateAILoading([
        "جاري التحقق من الهوية الرقمية المؤمنة...",
        `تجهيز واجهة: ${role === 'admin' ? 'الإدارة العامة' : role === 'publisher' ? 'ناشر الصفقات' : 'مقدم العروض'}`,
        "استرجاع البيانات الحية من Firestore..."
    ], () => {
        // Set Global Role
        mockDB.currentUser.role = role;

        // Update UI Personalization
        const roleLabels = { publisher: 'ناشر (مشتري)', bidder: 'مقدم عرض (مورد)', admin: 'إدارة المنصة (Admin)' };
        const userNames = { admin: 'المدير التنفيذي', publisher: 'شركة النصر للاستيراد', bidder: 'مجموعة التقنيات المتقدمة' };

        document.getElementById('current-user-role').innerText = roleLabels[role];
        document.getElementById('current-user-name').innerText = userNames[role];

        // Render Sidebar for specific role
        if (typeof renderSidebar === 'function') renderSidebar();

        // Switch Visual Panes
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('app-layout').classList.remove('hidden');

        // Handle initial routing - Check for Deep Link (dealId)
        const urlParams = new URLSearchParams(window.location.search);
        const dealId = urlParams.get('dealId');

        if (dealId) {
            loadDealDetails(dealId);
        } else {
            // Default Dashboard per role
            const firstAction = sidebarConfig[role][0].action;
            if (window[firstAction]) window[firstAction]();
        }
    });
};

window.logout = function () {
    window.renderLoginView();
};

window.showRegisterView = function () {
    const loginScreen = document.getElementById('login-screen');
    if (!loginScreen) return;

    loginScreen.innerHTML = `
        <div class="login-card glass-panel" style="max-width: 650px; text-align: right; animation: fadeIn 0.8s ease-out; padding: 3rem;">
            <div class="login-header" style="text-align: center; margin-bottom: 2rem;">
                <i class="fa-solid fa-building-circle-arrow-right"></i>
                <h2 class="text-gradient">تسجيل شركة جديدة وتوثيق</h2>
                <p>قم بإدخال بيانات منشأتك الرسمية لبدء عملية الفحص والاعتماد الذكي</p>
            </div>

            <form id="registration-form" onsubmit="window.handleRegisterSubmit(event)">
                <!-- Business Section -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; margin-bottom: 1.5rem;">
                    <div class="form-group">
                        <label style="display: block; margin-bottom: 0.5rem; color: #94A3B8; font-size: 0.85rem;">اسم الشركة / المؤسسة</label>
                        <input type="text" id="reg-company-name" required placeholder="مثلاً: شركة النصر للمقاولات" 
                               style="width: 100%; padding: 0.75rem; border-radius: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; outline: none; transition: border-color 0.3s;"
                               onfocus="this.style.borderColor='var(--primary-light)'" onblur="this.style.borderColor='rgba(255,255,255,0.1)'">
                    </div>
                    <div class="form-group">
                        <label style="display: block; margin-bottom: 0.5rem; color: #94A3B8; font-size: 0.85rem;">رقم السجل التجاري</label>
                        <input type="number" id="reg-cr-number" required placeholder="12345678"
                               style="width: 100%; padding: 0.75rem; border-radius: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; outline: none; transition: border-color 0.3s;"
                               onfocus="this.style.borderColor='var(--primary-light)'" onblur="this.style.borderColor='rgba(255,255,255,0.1)'">
                    </div>
                    <div class="form-group">
                        <label style="display: block; margin-bottom: 0.5rem; color: #94A3B8; font-size: 0.85rem;">الرقم الضريبي (TIN)</label>
                        <input type="text" id="reg-tax-number" required placeholder="000-000-000"
                               style="width: 100%; padding: 0.75rem; border-radius: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; outline: none; transition: border-color 0.3s;"
                               onfocus="this.style.borderColor='var(--primary-light)'" onblur="this.style.borderColor='rgba(255,255,255,0.1)'">
                    </div>
                    <div class="form-group">
                        <label style="display: block; margin-bottom: 0.5rem; color: #94A3B8; font-size: 0.85rem;">اسم المفوض المسئول</label>
                        <input type="text" id="reg-rep-name" required placeholder="الاسم الرباعي للمفوض"
                               style="width: 100%; padding: 0.75rem; border-radius: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; outline: none; transition: border-color 0.3s;"
                               onfocus="this.style.borderColor='var(--primary-light)'" onblur="this.style.borderColor='rgba(255,255,255,0.1)'">
                    </div>
                    <div class="form-group">
                        <label style="display: block; margin-bottom: 0.5rem; color: #94A3B8; font-size: 0.85rem;">رقم الجوال (WhatsApp)</label>
                        <input type="tel" id="reg-rep-phone" required placeholder="+966XXXXXXXXX"
                               style="width: 100%; padding: 0.75rem; border-radius: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; outline: none; transition: border-color 0.3s;"
                               onfocus="this.style.borderColor='var(--primary-light)'" onblur="this.style.borderColor='rgba(255,255,255,0.1)'">
                    </div>
                    <div class="form-group">
                        <label style="display: block; margin-bottom: 0.5rem; color: #94A3B8; font-size: 0.85rem;">البريد الإلكتروني الرسمي</label>
                        <input type="email" id="reg-email" required placeholder="info@company.com"
                               style="width: 100%; padding: 0.75rem; border-radius: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; outline: none; transition: border-color 0.3s;"
                               onfocus="this.style.borderColor='var(--primary-light)'" onblur="this.style.borderColor='rgba(255,255,255,0.1)'">
                    </div>
                    <div class="form-group" style="grid-column: span 2;">
                        <label style="display: block; margin-bottom: 0.5rem; color: #94A3B8; font-size: 0.85rem;">مجال التخصص / النشاط الرئيسي</label>
                        <select id="reg-company-field" required 
                                style="width: 100%; padding: 0.75rem; border-radius: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; outline: none; font-family: var(--font-body);">
                             <option value="" disabled selected>اختر مجال التخصص الرئيسي لشركتك...</option>
                             ${mockDB.categories.map(cat => `<option value="${cat.name}">${cat.name}</option>`).join('')}
                        </select>
                    </div>
                </div>

                <!-- Document Upload Area -->
                <div style="margin-bottom: 2rem; background: rgba(255,255,255,0.02); padding: 1.5rem; border-radius: 16px; border: 1px dashed rgba(255,255,255,0.15);">
                    <h4 style="margin-bottom: 1.25rem; color: var(--accent-color); font-size: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                        <i class="fa-solid fa-file-shield"></i> الأوراق الرسمية المرفقة للتوثيق الآلي
                    </h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div class="upload-field" style="background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 12px;">
                            <label style="font-size: 0.8rem; color: #94A3B8; display: block; margin-bottom: 0.5rem;">صورة السجل التجاري (ساري)</label>
                            <input type="file" id="file-cr" required style="font-size: 0.7rem; color: #CBD5E1;">
                        </div>
                        <div class="upload-field" style="background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 12px;">
                            <label style="font-size: 0.8rem; color: #94A3B8; display: block; margin-bottom: 0.5rem;">خطاب تفويض معتمد</label>
                            <input type="file" id="file-auth" required style="font-size: 0.7rem; color: #CBD5E1;">
                        </div>
                    </div>
                    <p style="font-size: 0.75rem; color: #64748B; margin-top: 1rem;">
                        <i class="fa-solid fa-circle-info"></i> سيقوم الذكاء الاصطناعي بفحص الأوراق ومطابقتها فور الإرسال.
                    </p>
                </div>

                <div style="display: flex; gap: 1.25rem;">
                    <button type="submit" class="btn btn-primary" style="flex: 2; padding: 1.1rem; border-radius: 14px; font-size: 1rem;">
                        <i class="fa-solid fa-shield-check"></i> تسجيل وإرسال للفحص الذكي
                    </button>
                    <button type="button" class="btn" onclick="window.renderLoginView()" 
                            style="flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #94A3B8; border-radius: 14px;">
                        تراجع
                    </button>
                </div>
            </form>
        </div>
    `;
};

window.handleRegisterSubmit = function (event) {
    event.preventDefault();

    const companyName = document.getElementById('reg-company-name').value;
    const crNumber = document.getElementById('reg-cr-number').value;
    const taxNumber = document.getElementById('reg-tax-number').value;
    const repName = document.getElementById('reg-rep-name').value;
    const repPhone = document.getElementById('reg-rep-phone').value;
    const email = document.getElementById('reg-email').value;
    const field = document.getElementById('reg-company-field').value;

    const registrationData = {
        name: companyName,
        crNumber: crNumber,
        taxNumber: taxNumber,
        representativeName: repName,
        representativePhone: repPhone,
        email: email,
        field: field,
        status: "pending", // Default to pending for AI/Admin review
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    window.simulateAILoading([
        "جاري رفع المستندات إلى الخادم السحابي المؤمن...",
        "بدء المسح الضوئي الذكي (OCR) للبيانات الرسمية...",
        "التحقق من صحة وصلاحية السجل التجاري والضريبي...",
        "مطابقة بيانات المفوض مع قواعد بيانات النفاذ الموحد...",
        "تحليل توافق النشاط التجاري وحفظ البيانات في Firestore..."
    ], async () => {
        try {
            // Save to Firestore 'companies' collection (or 'registrations' if you prefer review first)
            // But to enable notifications immediately as requested, we save to 'companies'
            await window.db.collection("companies").add(registrationData);

            // Success View
            const loginScreen = document.getElementById('login-screen');
            if (!loginScreen) return;

            loginScreen.innerHTML = `
                <div class="login-card glass-panel" style="animation: fadeIn 0.8s ease-out; border-color: rgba(16, 185, 129, 0.3); text-align: center;">
                    <div class="login-header">
                        <i class="fa-solid fa-circle-check" style="color: var(--success); filter: drop-shadow(0 0 15px rgba(16, 185, 129, 0.5)); font-size: 4rem;"></i>
                        <h2 class="text-gradient" style="margin-top: 1.5rem;">تم التسجيل بنجاح!</h2>
                        <p style="margin-top: 0.5rem;">عزيزي ${repName}، تم حفظ بيانات شركة "${companyName}" وتوثيقها مبدئياً.</p>
                    </div>
                    
                    <div style="background: rgba(16, 185, 129, 0.05); padding: 1.5rem; border-radius: 20px; margin-bottom: 2.5rem; border: 1px solid rgba(16, 185, 129, 0.1); text-align: right;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="color: #64748B; font-size: 0.85rem;">حالة التدقيق الآلي:</span>
                            <span style="color: var(--success); font-weight: 700; font-size: 0.85rem;">مكتمل وموثق ✅</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="color: #64748B; font-size: 0.85rem;">الإشعارات البريدية:</span>
                            <span style="color: var(--success); font-weight: 700; font-size: 0.85rem;">مفعلة (${email})</span>
                        </div>
                        <p style="font-size: 0.8rem; color: #94A3B8; margin-top: 1rem; line-height: 1.4;">
                            <i class="fa-solid fa-circle-info"></i> ستصلك الآن تنبيهات الصفقات الجديدة في مجال "${field}" عبر البريد والواتساب فور نشرها.
                        </p>
                    </div>

                    <button class="btn btn-primary" onclick="window.renderLoginView()" style="width: 100%; padding: 1.1rem; border-radius: 14px; font-size: 1rem;">
                        العودة لساحة الدخول
                    </button>
                </div>
            `;
        } catch (error) {
            console.error("Firestore Save Error:", error);
            alert("حدث خطأ أثناء حفظ البيانات: " + error.message);
        }
    });
};

window.setupUserMenu = function () {
    const trigger = document.getElementById('user-profile-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        let dropdown = document.getElementById('user-dropdown');
        if (dropdown) {
            dropdown.remove();
            return;
        }

        dropdown = document.createElement('div');
        dropdown.id = 'user-dropdown';
        dropdown.className = 'glass-panel';
        dropdown.style.cssText = `
            position: absolute;
            top: 75px;
            left: 20px;
            padding: 0.8rem;
            z-index: 1000;
            min-width: 200px;
            animation: slideDown 0.3s ease-out;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        `;

        dropdown.innerHTML = `
            <div style="padding: 0.5rem; border-bottom: 1px solid var(--border-glass); margin-bottom: 0.5rem;">
                <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 2px;">المستخدم الحالي</p>
                <p style="font-weight: 700; font-size: 0.95rem;">${document.getElementById('current-user-name').innerText}</p>
            </div>
            <button class="btn" style="width:100%; justify-content: flex-start; background: transparent; color: var(--text-primary); border: 1px solid var(--border-glass); font-size: 0.9rem;" onclick="alert('الملف الشخصي: قيد التطوير')">
                <i class="fa-solid fa-user-circle"></i> <span>الملف الشخصي</span>
            </button>
            <button class="btn" style="width:100%; justify-content: flex-start; background:rgba(239, 68, 68, 0.1); color:var(--danger); border: none; font-size: 0.9rem;" onclick="window.logout()">
                <i class="fa-solid fa-right-from-bracket"></i> <span>تسجيل الخروج</span>
            </button>
        `;
        document.body.appendChild(dropdown);

        const close = (evt) => {
            if (!dropdown.contains(evt.target)) {
                dropdown.remove();
                document.removeEventListener('click', close);
            }
        };
        document.addEventListener('click', close);
    });
};

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
    if (!window.db) {
        window.renderPublisherDashboardView(mockDB.stats.publisher, mockDB.deals.filter(d => d.status === 'نشط'));
        return;
    }

    injectView(`
        <div style="padding: 5rem; text-align: center;">
            <i class="fa-solid fa-chart-pie fa-spin" style="font-size: 3rem; color: var(--primary-light);"></i>
            <p style="margin-top: 1rem; color: var(--text-secondary);">جاري تحديث لوحة التحكم ببيانات حية من Firestore...</p>
        </div>
    `);

    window.db.collection('deals').get().then(snap => {
        let allDeals = [];
        snap.forEach(doc => allDeals.push({ id: doc.id, ...doc.data() }));

        const activeDeals = allDeals.filter(d => d.status === 'نشط');
        const closedDeals = allDeals.filter(d => d.status === 'مغلق');
        const totalBids = allDeals.reduce((sum, d) => sum + (d.bidsCount || 0), 0);

        const stats = {
            activeTenders: activeDeals.length,
            receivedBids: totalBids,
            awardedDeals: 2, // Mock for now or fetch from awarded collection
            closedTenders: closedDeals.length
        };

        // Sort active deals by date for the widget
        activeDeals.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        window.renderPublisherDashboardView(stats, activeDeals.slice(0, 5));
    }).catch(err => {
        console.error("Dashboard Stats Error:", err);
        window.renderPublisherDashboardView(mockDB.stats.publisher, mockDB.deals.filter(d => d.status === 'نشط'));
    });
};

window.renderPublisherDashboardView = function (stats, recentDeals) {
    const html = `
        <div class="dashboard-header" style="margin-bottom: 2rem;">
            <h2 class="text-gradient">ملخص النشاط الحي (الناشر)</h2>
            <p style="color: var(--text-secondary);">بيانات حقيقية مستمدة من Firestore تظهر حالة صفقاتك الآن</p>
        </div>

        <div class="stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
            <div class="glass-panel" style="padding: 1.5rem; border-left: 4px solid var(--info);">
                <div style="font-size: 2rem; font-weight: bold; color: var(--text-primary);">${stats.activeTenders}</div>
                <div style="color: var(--text-secondary); font-size: 0.9rem;">صفقات نشطة (Firestore)</div>
            </div>
            <div class="glass-panel" style="padding: 1.5rem; border-left: 4px solid var(--success);">
                <div style="font-size: 2rem; font-weight: bold; color: var(--text-primary);">${stats.receivedBids}</div>
                <div style="color: var(--text-secondary); font-size: 0.9rem;">إجمالي العروض المستلمة</div>
            </div>
            <div class="glass-panel" style="padding: 1.5rem; border-left: 4px solid var(--accent-color);">
                <div style="font-size: 2rem; font-weight: bold; color: var(--text-primary);">${stats.awardedDeals}</div>
                <div style="color: var(--text-secondary); font-size: 0.9rem;">صفقات تمت ترسيتها</div>
            </div>
            <div class="glass-panel" style="padding: 1.5rem; border-left: 4px solid var(--danger);">
                <div style="font-size: 2rem; font-weight: bold; color: var(--text-primary);">${stats.closedTenders}</div>
                <div style="color: var(--text-secondary); font-size: 0.9rem;">صفقات مغلقة (مؤرشفة)</div>
            </div>
        </div>

        <div class="dashboard-widgets" style="display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem;">
            <div class="glass-panel" style="padding: 1.5rem;">
                <h3 style="margin-bottom: 1rem; border-bottom: 1px solid var(--border-glass); padding-bottom: 0.5rem;">أحدث الصفقات الحية</h3>
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
                        ${recentDeals.map(d => `
                            <tr style="border-bottom: 1px solid var(--border-glass);">
                                <td style="padding: 1rem 0; font-weight: 600; color: var(--primary-light); cursor: pointer;" onclick="loadDealDetails('${d.id}')">${d.title}</td>
                                <td>${d.type || 'مناقصة'}</td>
                                <td>${d.endDate}</td>
                                <td><span class="badge" style="background: var(--info); padding: 0.2rem 0.5rem; border-radius: 4px;">${d.bidsCount || 0} عروض</span></td>
                            </tr>
                        `).join('') || `<tr><td colspan="4" style="text-align:center; padding: 2rem; color: var(--text-muted);">لا توجد صفقات حقيقية حالياً.</td></tr>`}
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
    if (!window.db) {
        window.renderBidderDashboardView(mockDB.stats.bidder, mockDB.deals.filter(d => d.status === 'نشط').slice(0, 2));
        return;
    }

    injectView(`
        <div style="padding: 5rem; text-align: center;">
            <i class="fa-solid fa-rocket fa-spin" style="font-size: 3rem; color: var(--primary-light);"></i>
            <p style="margin-top: 1rem; color: var(--text-secondary);">جاري تحليل الفرص الحية لك من السحابة...</p>
        </div>
    `);

    window.db.collection('deals').where('status', '==', 'نشط').get().then(snap => {
        let activeDeals = [];
        snap.forEach(doc => activeDeals.push({ id: doc.id, ...doc.data() }));

        const stats = {
            availableTenders: activeDeals.length,
            submittedBids: 3, // Mock or fetch from 'bids' collection
            acceptedBids: 1,
            rejectedBids: 0
        };

        // Recommend top 3 deals by AI Score or Date
        activeDeals.sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0));

        window.renderBidderDashboardView(stats, activeDeals.slice(0, 3));
    }).catch(err => {
        console.error("Bidder Dashboard Error:", err);
        window.renderBidderDashboardView(mockDB.stats.bidder, mockDB.deals.filter(d => d.status === 'نشط').slice(0, 2));
    });
};

window.renderBidderDashboardView = function (stats, recommendedDeals) {
    const html = `
        <div class="dashboard-header" style="margin-bottom: 2rem;">
            <h2 class="text-gradient">ملخص النشاط المباشر (مقدم العروض)</h2>
            <p style="color: var(--text-secondary);">مرحباً بك. هذه البيانات مسترجعة لحظياً من Firestore لضمان أدق التفاصيل.</p>
        </div>

        <div class="stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
            <div class="glass-panel" style="padding: 1.5rem; border-left: 4px solid var(--primary-light);">
                <div style="font-size: 2rem; font-weight: bold; color: var(--text-primary);">${stats.availableTenders}</div>
                <div style="color: var(--text-secondary); font-size: 0.9rem;">فرص حية متاحة الآن</div>
            </div>
            <div class="glass-panel" style="padding: 1.5rem; border-left: 4px solid var(--info);">
                <div style="font-size: 2rem; font-weight: bold; color: var(--text-primary);">${stats.submittedBids}</div>
                <div style="color: var(--text-secondary); font-size: 0.9rem;">عروضك قيد التقييم</div>
            </div>
            <div class="glass-panel" style="padding: 1.5rem; border-left: 4px solid var(--success);">
                <div style="font-size: 2rem; font-weight: bold; color: var(--text-primary);">${stats.acceptedBids}</div>
                <div style="color: var(--text-secondary); font-size: 0.9rem;">عروض فازت بالترسية</div>
            </div>
            <div class="glass-panel" style="padding: 1.5rem; border-left: 4px solid var(--danger);">
                <div style="font-size: 2rem; font-weight: bold; color: var(--text-primary);">${stats.rejectedBids}</div>
                <div style="color: var(--text-secondary); font-size: 0.9rem;">عروض لم توفق</div>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem;">
            <!-- Recommended Deals -->
            <div class="glass-panel" style="padding: 1.5rem;">
                <h3 style="margin-bottom: 1rem; color: var(--text-primary); border-bottom: 1px solid var(--border-glass); padding-bottom: 0.5rem;">
                    <i class="fa-solid fa-wand-magic-sparkles" style="color: var(--accent-color);"></i> صفقات حية موصى بها لك (AI)
                </h3>
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    ${recommendedDeals.map(d => `
                        <div class="deal-row" style="padding: 1rem; border: 1px solid var(--border-glass); border-radius: 8px; display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.02);">
                            <div>
                                <h4 style="color: var(--primary-color); margin-bottom: 0.25rem;">${d.title}</h4>
                                <div style="font-size: 0.85rem; color: var(--text-secondary); display: flex; gap: 1rem; align-items: center;">
                                    <span>${d.type?.includes('مزاد') ? '<i class="fa-solid fa-gavel"></i>' : '<i class="fa-solid fa-file-contract"></i>'} ${d.type || 'مناقصة'}</span>
                                    <span><i class="fa-regular fa-clock"></i> ينتهي: ${d.endDate}</span>
                                    <span style="color: var(--success);"><i class="fa-solid fa-bolt"></i> مطابقة ذكية: ${d.aiScore || 90}%</span>
                                </div>
                            </div>
                            <button class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.85rem;" onclick="loadDealDetails('${d.id}')">تقديم عرض</button>
                        </div>
                    `).join('') || `<div style="text-align:center; padding: 2rem; color: var(--text-muted);">لا توجد صفقات حية حالياً.</div>`}
                </div>
                <div style="text-align: center; margin-top: 1rem;">
                    <button class="btn" style="background: transparent; border: 1px solid var(--primary-light); color: var(--primary-light); width: 100%;" onclick="loadExploreDeals()">استكشاف كافة الفرص الحقيقية</button>
                </div>
            </div>

            <!-- AI Market Insights -->
            <div class="glass-panel" style="padding: 1.5rem; background: linear-gradient(135deg, rgba(79, 70, 229, 0.05), rgba(52, 211, 153, 0.05)); border-color: rgba(79, 70, 229, 0.2);">
                <h3 style="margin-bottom: 1rem; color: var(--primary-light);"><i class="fa-solid fa-chart-line"></i> تحليلات السوق الحية</h3>
                <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">
                    هناك نشاط متزايد في قاعدة البيانات حالياً بنسبة <strong>22%</strong> على طلبات التوريد التقني. متوسط المنافسة هو <strong>4 عروض</strong> لكل صفقة.
                </p>
                <div style="background: var(--bg-surface); padding: 1rem; border-radius: 8px; border: 1px solid var(--border-glass);">
                    <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem;">احتمالية قبول عروضك اليوم</div>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div style="width: 100%; height: 8px; background: var(--border-glass); border-radius: 4px; overflow: hidden;">
                            <div style="height: 100%; width: 84%; background: var(--success);"></div>
                        </div>
                        <span style="font-weight: bold; color: var(--success);">84%</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    injectView(html);
};

// Global variable for current filter state
let currentDealsFilter = { query: '', type: 'all', category: 'all' };

window.loadExploreDeals = function () {
    if (!window.db) {
        window.renderExploreDealsView(mockDB.deals.filter(d => d.status === 'نشط'));
        return;
    }

    // Show Loading
    injectView(`
        <div style="padding: 5rem; text-align: center; animation: fadeIn 0.5s;">
            <i class="fa-solid fa-magnifying-glass fa-spin" style="font-size: 3.5rem; color: var(--primary-light); margin-bottom: 1.5rem;"></i>
            <h3 style="color: var(--text-primary);">في انتظار الصفقات الحقيقية...</h3>
            <p style="color: var(--text-secondary);">يتم الآن فحص قاعدة البيانات السحابية بحثاً عن فرص جديدة</p>
        </div>
    `);

    window.db.collection('deals')
        .where('status', '==', 'نشط')
        .get()
        .then(querySnapshot => {
            let deals = [];
            querySnapshot.forEach(doc => {
                deals.push({ id: doc.id, ...doc.data() });
            });
            deals.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            window._allActiveDeals = deals; // Cached for filtering
            window.renderExploreDealsView(deals);
        })
        .catch(err => {
            console.error("Explore Fetch Error:", err);
            window.renderExploreDealsView(mockDB.deals.filter(d => d.status === 'نشط'));
        });
};

function renderExploreDealsView(dealsFromSource) {
    const dealsToProcess = dealsFromSource || window._allActiveDeals || [];

    // Apply current filters
    const filteredDeals = dealsToProcess.filter(d => {
        const q = currentDealsFilter.query.toLowerCase();
        const matchesQuery = (d.title || "").toLowerCase().includes(q) || (d.description || "").toLowerCase().includes(q);
        const matchesType = currentDealsFilter.type === 'all' || d.type === currentDealsFilter.type;
        const matchesCat = currentDealsFilter.category === 'all' || d.category === currentDealsFilter.category;

        return matchesQuery && matchesType && matchesCat;
    });

    const categories = [...new Set(dealsToProcess.map(d => d.category))].filter(Boolean);

    const html = `
        <div class="dashboard-header" style="margin-bottom: 2rem;">
            <h2 class="text-gradient">استكشاف الصفقات الحقيقية</h2>
            <p style="color: var(--text-secondary);">ابحث في الفرص الحية المتاحة حالياً على المنصة والمسترجعة من Firestore</p>
        </div>

        <div class="glass-panel" style="padding: 1.5rem; margin-bottom: 2rem;">
            <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 1rem;">
                <div style="position: relative;">
                    <i class="fa-solid fa-search" style="position: absolute; right: 1rem; top: 1rem; color: var(--text-muted);"></i>
                    <input type="text" id="filter-query" placeholder="ابحث في عنوان أو وصف الصفقة..." value="${currentDealsFilter.query}" 
                        style="width: 100%; padding: 0.8rem 2.5rem 0.8rem 1rem; border-radius: 8px; border: 1px solid var(--border-glass); background: var(--bg-surface); color: var(--text-primary); font-family: var(--font-body);"
                        onkeyup="if(event.key === 'Enter') applyDealsFilter()">
                </div>
                
                <select id="filter-type" style="padding: 0.8rem; border-radius: 8px; border: 1px solid var(--border-glass); background: var(--bg-surface); color: var(--text-primary); font-family: var(--font-body);" onchange="applyDealsFilter()">
                    <option value="all" ${currentDealsFilter.type === 'all' ? 'selected' : ''}>جميع الأنواع</option>
                    <option value="مناقصة (شراء / توريد)" ${currentDealsFilter.type === 'مناقصة (شراء / توريد)' ? 'selected' : ''}>مناقصة</option>
                    <option value="مزاد" ${currentDealsFilter.type === 'مزاد' ? 'selected' : ''}>مزاد</option>
                </select>

                <select id="filter-category" style="padding: 0.8rem; border-radius: 8px; border: 1px solid var(--border-glass); background: var(--bg-surface); color: var(--text-primary); font-family: var(--font-body);" onchange="applyDealsFilter()">
                    <option value="all" ${currentDealsFilter.category === 'all' ? 'selected' : ''}>جميع المجالات</option>
                    ${categories.map(c => `<option value="${c}" ${currentDealsFilter.category === c ? 'selected' : ''}>${c}</option>`).join('')}
                </select>
            </div>
            <div style="margin-top: 1rem; display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 0.9rem; color: var(--text-secondary);">نتائج البحث: <strong>${filteredDeals.length}</strong> فرصة حية</span>
                <button class="btn btn-primary" onclick="window.simulateAIFormAssist()"><i class="fa-solid fa-robot"></i> تحليل ذكي للفرص</button>
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
    renderExploreDealsView();
};

window.loadDealDetails = function (dealId) {
    if (window.db) {
        // Fetch Deal and Bids in parallel
        Promise.all([
            window.db.collection("deals").doc(dealId).get(),
            window.db.collection("bids").where("dealId", "==", dealId).get()
        ])
            .then(([dealDoc, bidsSnapshot]) => {
                const bids = [];
                bidsSnapshot.forEach(doc => bids.push({ id: doc.id, ...doc.data() }));

                if (dealDoc.exists) {
                    window.renderDealDetailsView({ id: dealDoc.id, ...dealDoc.data() }, dealId, bids);
                } else {
                    const d = mockDB.deals.find(x => x.id === dealId);
                    if (d) window.renderDealDetailsView(d, dealId, bids);
                    else {
                        console.log("Deal not found in Mock or Firestore:", dealId);
                        loadExploreDeals();
                    }
                }
            })
            .catch(error => {
                console.error("Error loading deal details from Firestore:", error);
                const d = mockDB.deals.find(x => x.id === dealId);
                if (d) window.renderDealDetailsView(d, dealId, []);
                else loadExploreDeals();
            });
        return;
    }

    const d = mockDB.deals.find(x => x.id === dealId);
    if (d) {
        window.renderDealDetailsView(d, dealId);
    } else {
        loadExploreDeals();
    }
};

window.countdownInterval = null;

window.startCountdown = function (endDateStr, elementId) {
    if (window.countdownInterval) clearInterval(window.countdownInterval);

    console.log("Starting countdown for:", endDateStr, "on element:", elementId);

    if (!endDateStr) {
        console.warn("No end date provided for countdown.");
        return;
    }

    // Handle different date formats YYYY-MM-DD
    const dateFormatted = endDateStr.includes("T") ? endDateStr : endDateStr + "T23:59:59";
    const targetDate = new Date(dateFormatted);

    if (isNaN(targetDate.getTime())) {
        console.error("Invalid date for countdown:", endDateStr);
        return;
    }

    const container = document.getElementById(elementId);
    if (!container) return;

    function update() {
        const now = new Date();
        const diff = targetDate - now;

        if (diff <= 0) {
            container.innerHTML = `<div style="color: var(--danger); font-weight: bold; font-size: 1.2rem; animation: pulse 1s infinite;"><i class="fa-solid fa-hourglass-end"></i> انتهى وقت التقديم</div>`;
            clearInterval(window.countdownInterval);
            return;
        }

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        // Dynamic Color Logic
        let timerColor = "#d4250aff"; // Success Green
        let shadowColor = "rgba(226, 15, 15, 0.4)";
        if (d < 1) { timerColor = "#EF4444"; shadowColor = "rgba(239, 68, 68, 0.4)"; }
        else if (d < 3) { timerColor = "#F59E0B"; shadowColor = "rgba(245, 158, 11, 0.4)"; }

        container.innerHTML = `
            <div style="display: flex; gap: 0.8rem; align-items: center; justify-content: center; direction: rtl; font-family: 'Outfit', sans-serif;">
                ${[
                { val: s, label: "ثانية" },
                { val: m, label: "دقيقة" },
                { val: h, label: "ساعة" },
                { val: d, label: "يوم" }
            ].map(item => `
                    <div style="background: rgba(255, 255, 255, 0.6); backdrop-filter: blur(10px); padding: 0.6rem 0.8rem; border-radius: 12px; border: 1.5px solid ${timerColor}; box-shadow: 0 4px 15px rgba(0,0,0,0.05); min-width: 70px; text-align: center;">
                        <span style="display: block; font-size: 1.6rem; font-weight: 800; color: ${timerColor}; line-height: 1; margin-bottom: 0.2rem;">${String(item.val).padStart(2, '0')}</span>
                        <span style="display: block; font-size: 0.7rem; color: #64748B; font-weight: 600;">${item.label}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    update();
    window.countdownInterval = setInterval(update, 1000);
};

window.renderDealDetailsView = function (d, id, bids = []) {
    if (window.countdownInterval) clearInterval(window.countdownInterval);

    // Sort bids locally (Lowest Price First)
    const sortedBids = [...bids].sort((a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0));
    const lowestBid = sortedBids.length > 0 ? sortedBids[0].price : null;
    const bidsCount = Math.max(d.bidsCount || 0, bids.length);

    const html = `
        <div style="margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap;">
            <button class="btn" style="background: rgba(15, 23, 42, 0.05); border: 1px solid var(--border-glass); color: var(--text-secondary); padding: 0.5rem 1rem;" onclick="loadExploreDeals()">
                <i class="fa-solid fa-arrow-right"></i> العودة لاستكشاف الصفقات
            </button>
            <div style="display: flex; gap: 0.8rem;">
                <button class="btn" style="background: rgba(79, 70, 229, 0.05); color: var(--primary-color); border: 1px solid var(--primary-light);" onclick="window.print()">
                    <i class="fa-solid fa-print"></i> طباعة التفاصيل
                </button>
                <button class="btn btn-primary" onclick="loadSubmitBidForm('${id}')">
                    <i class="fa-solid fa-plus"></i> تقديم عرض سعر الآن
                </button>
            </div>
        </div>

        <!-- معلومات العداد والميزانية (قسم علوي بارز) -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 2.5rem;">
            <div class="glass-panel" style="padding: 1.8rem; display: flex; flex-direction: column; justify-content: center; align-items: center; border-top: 5px solid var(--primary-color); box-shadow: var(--shadow-md);">
                <span style="color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 1rem; font-weight: 600;">
                    <i class="fa-solid fa-clock-rotate-left"></i> الوقت المتبقي حتى إغلاق التقديم
                </span>
                <div id="countdown-timer-container" style="width: 100%; min-height: 80px;">
                    <div style="text-align: center; color: var(--text-muted); padding: 1rem;">جاري مزامنة الوقت حالياً...</div>
                </div>
            </div>
            
            <div class="glass-panel" style="padding: 1.8rem; display: flex; flex-direction: column; justify-content: center; align-items: center; border-top: 5px solid var(--success); box-shadow: var(--shadow-md);">
                <span style="color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 0.5rem; font-weight: 600;">
                    <i class="fa-solid fa-sack-dollar"></i> الميزانية التقديرية القصوى لهذا الطلب
                </span>
                <h2 style="color: var(--success); font-size: 2.4rem; font-weight: 900; margin: 0; letter-spacing: -1px;">${d.budget || "150,000 ج.م"}</h2>
                <span style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.4rem;">السعر الاسترشادي شامل كافة الرسوم</span>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 2.2fr 1fr; gap: 2rem;">
            <!-- القسم الأيمن: تفاصيل الصفقة والمنافسة -->
            <div style="display: flex; flex-direction: column; gap: 2rem;">
                <!-- بطاقة المحتوى الأساسي -->
                <div class="glass-panel" style="padding: 2.5rem;">
                    <div style="margin-bottom: 2rem; border-bottom: 1px solid var(--border-glass); padding-bottom: 1.5rem;">
                        <div style="display: flex; gap: 0.6rem; margin-bottom: 1rem;">
                            <span class="badge" style="background: rgba(79, 70, 229, 0.1); color: var(--primary-color); padding: 0.4rem 1rem; border-radius: 8px; font-weight: 700;">${d.category}</span>
                            <span class="badge" style="background: rgba(16, 185, 129, 0.1); color: var(--success); padding: 0.4rem 1rem; border-radius: 8px; font-weight: 700;">${d.type}</span>
                        </div>
                        <h1 style="color: var(--text-primary); font-size: 1.8rem; font-weight: 800; line-height: 1.3;">${d.title}</h1>
                    </div>

                    <div style="margin-bottom: 2.5rem;">
                        <h3 style="color: var(--primary-color); font-size: 1.2rem; margin-bottom: 1.2rem; display: flex; align-items: center; gap: 0.6rem;">
                            <i class="fa-solid fa-align-right"></i> وصف المشروع والمتطلبات
                        </h3>
                        <p style="color: var(--text-secondary); line-height: 1.9; white-space: pre-line; font-size: 1.05rem;">
                            ${d.description}
                        </p>
                    </div>

                    <div style="margin-bottom: 2.5rem; background: var(--bg-surface); padding: 1.8rem; border-radius: 14px; border: 1px solid var(--border-glass);">
                        <h3 style="color: var(--text-primary); font-size: 1.1rem; margin-bottom: 1.2rem;"><i class="fa-solid fa-paperclip"></i> المستندات والمرفقات المتاحة</h3>
                        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                            <a href="#" class="btn" style="background: white; border: 1px solid var(--border-glass); color: var(--info); font-size: 0.95rem; padding: 0.7rem 1.2rem;">
                                <i class="fa-solid fa-file-pdf"></i> تحميل كراسة الشروط والمواصفات.pdf
                            </a>
                            <a href="#" class="btn" style="background: white; border: 1px solid var(--border-glass); color: var(--accent-color); font-size: 0.95rem; padding: 0.7rem 1.2rem;">
                                <i class="fa-solid fa-image"></i> المعاينة الفنية والمخططات.zip
                            </a>
                        </div>
                        
                        <div style="margin-top: 1.5rem; display: flex; align-items: center; justify-content: space-between; padding: 1.2rem; border-radius: 12px; border: 1.5px dashed var(--primary-light); background: rgba(79, 70, 229, 0.03);">
                            <div style="display: flex; align-items: center; gap: 1rem;">
                                <i class="fa-solid fa-wand-magic-sparkles text-gradient" style="font-size: 1.8rem;"></i>
                                <div>
                                    <span style="display: block; font-weight: 800; color: var(--text-primary); font-size: 1rem;">مساعد المورد الذكي (AI)</span>
                                    <span style="color: var(--text-secondary); font-size: 0.85rem;">دع الذكاء الاصطناعي يلخص لك الشروط ويجيب على استفساراتك</span>
                                </div>
                            </div>
                            <button class="btn" style="background: white; border: 1.5px solid var(--primary-color); color: var(--primary-color); font-weight: 700;" onclick="openAIHelperModal('${d.title}')">
                                استشارة المساعد <i class="fa-solid fa-robot"></i>
                            </button>
                        </div>
                    </div>

                    <!-- ميزة "أقل سعر مقدم" - تفعيل التنافسية الذكية -->
                    <div style="background: linear-gradient(135deg, rgba(79, 70, 229, 0.08), rgba(16, 185, 129, 0.05)); padding: 2rem; border-radius: 16px; border: 1.5px solid var(--primary-light); position: relative; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.04);">
                        <div style="position: absolute; top: 0; right: 0; width: 6px; height: 100%; background: var(--primary-color);"></div>
                        <h3 style="color: var(--text-primary); font-size: 1.3rem; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between;">
                            <span><i class="fa-solid fa-ranking-star" style="color: var(--primary-light); margin-left: 0.7rem;"></i> مراقبة التنافسية المباشرة</span>
                            <span class="badge" style="background: var(--primary-color); color: white; padding: 0.4rem 1rem; border-radius: 30px; font-weight: 600; font-size: 0.85rem;">
                                <i class="fa-solid fa-users"></i> ${bidsCount} شركات تقدمت
                            </span>
                        </h3>
                        
                        ${lowestBid ? `
                            <div style="background: white; padding: 2rem; border-radius: 16px; border: 1px solid var(--border-glass); text-align: center; box-shadow: 0 5px 15px rgba(0,0,0,0.02);">
                                <span style="display: block; color: var(--text-secondary); font-size: 1rem; margin-bottom: 0.8rem; font-weight: 500;">أقل سعر معروض حالياً في السوق</span>
                                <strong style="color: var(--success); font-size: 3rem; font-weight: 900; line-height: 1; letter-spacing: -1px;">
                                    ${lowestBid.toLocaleString()} <small style="font-size: 1.2rem; font-weight: 700;">ج.م</small>
                                </strong>
                                <div style="margin-top: 1.5rem; display: flex; justify-content: center; gap: 0.8rem; flex-wrap: wrap;">
                                    <span style="background: rgba(16, 185, 129, 0.08); color: var(--success); padding: 0.4rem 1.2rem; border-radius: 30px; font-size: 0.85rem; font-weight: 600; border: 1px solid rgba(16, 185, 129, 0.2);">
                                        <i class="fa-solid fa-lock"></i> هويات المنافسين مشفرة تماماً
                                    </span>
                                    <span style="background: rgba(79, 70, 229, 0.08); color: var(--primary-color); padding: 0.4rem 1.2rem; border-radius: 30px; font-size: 0.85rem; font-weight: 600; border: 1px solid rgba(79, 70, 229, 0.2);">
                                        <i class="fa-solid fa-bolt-lightning"></i> تحديث لحظي
                                    </span>
                                </div>
                            </div>
                            <p style="text-align: center; color: var(--text-secondary); font-size: 0.95rem; margin-top: 1.5rem; line-height: 1.6; max-width: 500px; margin-left: auto; margin-right: auto;">
                                <i class="fa-solid fa-circle-info"></i> نوصيك بتقديم عرض سعر أكثر تنافسية لتصدر قائمة الموردين المرشحين للفوز بالصفقة.
                            </p>
                        ` : `
                            <div style="text-align:center; padding: 2.5rem; background: rgba(255,255,255,0.6); border-radius: 16px; border: 2px dashed var(--border-glass);">
                                <i class="fa-solid fa-trophy" style="font-size: 3.5rem; color: var(--accent-color); margin-bottom: 1.2rem; display: block; opacity: 0.3;"></i>
                                <h4 style="color: var(--text-primary); margin-bottom: 0.6rem; font-size: 1.2rem;">كن أنت الرائد وصاحب العرض الأول!</h4>
                                <p style="color: var(--text-secondary); font-size: 1rem; line-height: 1.5; max-width: 400px; margin: 0 auto;">
                                    لم يتم تقديم أي عروض متبادلة بعد. هذه فرصتك الذهبية لتحديد السعر الافتتاحي ورفع احتمالية قبول عرضك.
                                </p>
                            </div>
                        `}
                    </div>
                </div>
            </div>

            <!-- القسم الأيسر: ملخصات سريعة -->
            <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                <div class="glass-panel" style="padding: 1.8rem;">
                    <h3 style="margin-bottom: 1.8rem; color: var(--text-primary); border-bottom: 2px solid var(--border-glass); padding-bottom: 0.8rem; font-size: 1.1rem;">
                        <i class="fa-solid fa-clipboard-list" style="color: var(--primary-color);"></i> بطاقة البيانات الفنية
                    </h3>
                    
                    <ul style="list-style: none; display: flex; flex-direction: column; gap: 1.2rem; margin-bottom: 2.5rem;">
                        <li style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 0.6rem; border-bottom: 1px dashed var(--border-glass);">
                            <span style="color: var(--text-secondary); font-weight: 500;">تاريخ الإغلاق</span>
                            <strong style="color: var(--text-primary); font-size: 0.95rem;">${d.endDate || d.endDate}</strong>
                        </li>
                        <li style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 0.6rem; border-bottom: 1px dashed var(--border-glass);">
                            <span style="color: var(--text-secondary); font-weight: 500;">تأمين التقديم الابتدائي</span>
                            <strong style="color: var(--danger); font-size: 0.95rem;">5,000 ج.م</strong>
                        </li>
                        <li style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 0.6rem; border-bottom: 1px dashed var(--border-glass);">
                            <span style="color: var(--text-secondary); font-weight: 500;">حالة التوريد/العمل</span>
                            <span class="badge" style="background: rgba(16, 185, 129, 0.1); color: var(--success); font-weight: bold;">متاح للتقديم</span>
                        </li>
                    </ul>

                    <button class="btn btn-primary" style="width: 100%; font-size: 1.15rem; padding: 1.2rem; border-radius: 12px; box-shadow: 0 8px 20px rgba(50, 40, 180, 0.15);" onclick="loadSubmitBidForm('${id}')">
                        ابدأ تقديم العرض الآن
                    </button>
                    <p style="text-align: center; color: var(--text-muted); font-size: 0.75rem; margin-top: 1rem;">
                        * سيتم تحصيل مبلغ التأمين عند التقديم
                    </p>
                </div>

                <!-- نصيحة الذكاء الاصطناعي -->
                <div class="glass-panel" style="padding: 1.8rem; background: linear-gradient(to bottom right, rgba(245, 158, 11, 0.05), rgba(79, 70, 229, 0.03)); border-color: rgba(245, 158, 11, 0.2);">
                    <h4 style="color: var(--accent-color); margin-bottom: 0.8rem; font-size: 1.05rem;"><i class="fa-solid fa-robot"></i> رؤية المساعد الذكي</h4>
                    <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.7;">
                        بناءً على ملفك الشخصي، نرى أن هذه الصفقة تتوافق مع قدراتك بنسبة <strong>${d.aiScore || 92}%</strong>. 
                        أوقات التسليم المقترحة مناسبة، والميزانية المتوقعة تقع ضمن نطاق أسعارك المعتادة.
                    </p>
                </div>
            </div>
        </div>
    `;
    
    injectView(html);

    // Initialize Countdown
    if (d.endDate) {
        setTimeout(() => {
            window.startCountdown(d.endDate, 'countdown-timer-container');
        }, 300);
    }
};

window.loadSubmitBidForm = async function (dealId) {
    let d = mockDB.deals.find(x => x.id === dealId);
    let bids = [];

    if (window.db) {
        try {
            const dealDoc = await window.db.collection("deals").doc(dealId).get();
            if (dealDoc.exists) d = { id: dealDoc.id, ...dealDoc.data() };

            const bidsSnapshot = await window.db.collection("bids").where("dealId", "==", dealId).get();
            bidsSnapshot.forEach(doc => bids.push(doc.data()));
        } catch (e) {
            console.error("Error fetching data for bid form:", e);
        }
    }

    if (!d) return;

    // Sort bids to find lowest
    const sortedBids = [...bids].sort((a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0));
    const bidsCount = Math.max(d.bidsCount || 0, bids.length);

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
                        <h4 style="color: var(--text-secondary); margin-bottom: 0.8rem; font-size: 0.95rem;"><i class="fa-solid fa-users-viewfinder"></i> عروض المنافسين الحالية (هويات مخفية)</h4>
                        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                            ${sortedBids.length > 0 ?
                sortedBids.slice(0, 3).map((bid, i) => `
                                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.6rem; background: rgba(0,0,0,0.02); border: 1px dashed var(--border-glass); border-radius: 6px;">
                                        <span style="font-size: 0.85rem; color: var(--text-muted);"><i class="fa-solid fa-user-secret"></i> منافس #${i + 1}</span>
                                        <strong style="color: var(--primary-light); font-size: 0.9rem;">${(parseFloat(bid.price) || 0).toLocaleString()} ج.م</strong>
                                    </div>
                                    `).join('')
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
// Form Validation and Submission with real Firestore persistence
window.validateAndSubmitBid = function (dealId) {
    const price = document.getElementById('bid-price').value;
    const duration = document.getElementById('bid-duration').value;
    const notes = document.getElementById('bid-notes').value;
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
        "جاري إتمام عملية تحويل التأمين بقيمة 5,000 ج.م...",
        "تأكيد تشفير العرض وحفظه بأمان في Firestore..."
    ], async () => {
        try {
            const bidderName = document.getElementById('current-user-name').innerText;
            const bidderEmail = "bidder-demo@example.com"; // Mock email for current session
            
            const bidData = {
                dealId: dealId,
                price: parseFloat(price),
                duration: duration,
                notes: notes,
                bidderName: bidderName,
                bidderEmail: bidderEmail,
                status: "نشط",
                createdAt: new Date().toISOString()
            };

            // 1. Save Bid to Firestore
            const bidRef = await window.db.collection("bids").add(bidData);
            
            // 2. Increment Bid Count in Deal
            await window.db.collection("deals").doc(dealId).update({
                bidsCount: firebase.firestore.FieldValue.increment(1)
            });

            // 3. Notify Other Bidders (Competitive Alert)
            window.notifyCompetitorsOfNewBid(dealId, bidderEmail);

            injectView(`
                <div class="glass-panel" style="padding: 4rem 2rem; text-align: center; max-width: 600px; margin: 2rem auto;">
                    <div style="font-size: 5rem; color: var(--success); margin-bottom: 1.5rem;"><i class="fa-solid fa-circle-check"></i></div>
                    <h2 style="margin-bottom: 1rem; color: var(--text-primary); font-size: 2rem;">تم استلام العرض ودفع التأمين بنجاح!</h2>
                    <p style="color: var(--text-secondary); margin-bottom: 2.5rem; line-height: 1.8; font-size: 1.1rem;">
                        تم تخزين عرضك المالي والفني برقم المزايدة: <strong>#${bidRef.id.slice(0, 8).toUpperCase()}</strong>
                        <br>تم تحديث حالة الصفقة وإخطار المنافسين (بدون ذكر هويتك).
                    </p>
                    <div style="display: flex; gap: 1rem; justify-content: center;">
                        <button class="btn btn-primary" onclick="loadBidderDashboard()">العودة للوحة التحكم</button>
                        <button class="btn" style="border: 1px solid var(--border-glass);" onclick="loadExploreDeals()">استكشاف المزيد</button>
                    </div>
                </div>
            `);

        } catch (error) {
            console.error("Bid Submission Error:", error);
            alert("حدث خطأ أثناء تقديم العرض. يرجى المحاولة مرة أخرى.");
        }
    });
}

// Competitive Alert System
window.notifyCompetitorsOfNewBid = async function(dealId, currentBidderEmail) {
    if (!window.db) return;
    
    try {
        // Fetch all bids for this deal to get competitor emails
        const snapshot = await window.db.collection("bids").where("dealId", "==", dealId).get();
        const emails = new Set();
        
        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.bidderEmail && data.bidderEmail !== currentBidderEmail) {
                emails.add(data.bidderEmail);
            }
        });

        if (emails.size === 0) return;

        // Fetch deal title
        const dealDoc = await window.db.collection("deals").doc(dealId).get();
        const dealTitle = dealDoc.exists ? dealDoc.data().title : "صفقة نشطة";

        console.log(`Notifying ${emails.size} competitors for deal: ${dealTitle}`);

        emails.forEach(email => {
            const templateParams = {
                to_email: email,
                to_name: "شريكنا العزيز",
                from_name: "منصة الصفقات الذكية",
                message: `تنبيه تنافسي: لقد قامت شركة أخرى بتقديم عرض جديد على صفقة (${dealTitle}). ننصحك بمراجعة عرضك لضمان البقاء في دائرة المنافسة!`,
                link: window.location.href.split('?')[0] + "?dealId=" + dealId,
                deal_title: dealTitle
            };

            if (window.emailjs) {
                window.emailjs.send(window.gmailConfig.serviceId, window.gmailConfig.templateId, templateParams)
                    .then(() => console.log("Competition Alert Sent to:", email))
                    .catch(e => console.error("EmailJS Error:", e));
            }
        });

    } catch (err) {
        console.error("Notify Competitors Error:", err);
    }
};

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
    if (!window.db) {
        window.renderAdminDashboardView(mockDB.stats.admin);
        return;
    }

    injectView(`
        <div style="padding: 5rem; text-align: center;">
            <i class="fa-solid fa-gauge-high fa-spin" style="font-size: 3rem; color: var(--primary-light);"></i>
            <p style="margin-top: 1rem; color: var(--text-secondary);">جاري استخراج تقارير الأداء الحية من Firestore...</p>
        </div>
    `);

    window.db.collection('deals').get().then(snap => {
        let allDeals = [];
        snap.forEach(doc => allDeals.push({ id: doc.id, ...doc.data() }));

        const activeDeals = allDeals.filter(d => d.status === 'نشط');
        const closedDeals = allDeals.filter(d => d.status === 'مغلق');

        const totalVol = allDeals.reduce((sum, d) => {
            const b = d.budget || "0";
            return sum + (parseInt(b.replace(/[^0-9]/g, '')) || 0);
        }, 0);

        const stats = {
            totalVolume: totalVol.toLocaleString(),
            totalActiveDeals: activeDeals.length,
            activeBidders: 154,
            activePublishers: 42,
            pendingApprovals: 5
        };

        window.renderAdminDashboardView(stats);
    }).catch(err => {
        console.error("Admin Stats Error:", err);
        window.renderAdminDashboardView(mockDB.stats.admin);
    });
};

window.renderAdminDashboardView = function (s) {
    // Recent Activities HTML (Keep mock for logs unless we have a logs collection)
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
                <h2 class="text-gradient">مركز القيادة والإحصائيات الحية</h2>
                <p style="color: var(--text-secondary);">تقارير أداء المنصة المستخرجة لحظياً من قاعدة بيانات Firestore السحابية</p>
            </div>
            <div style="display: flex; gap: 1rem;">
                <button class="btn" style="background: var(--bg-surface); border: 1px solid var(--border-glass); color: var(--text-primary);"><i class="fa-solid fa-download"></i> تصدير التقرير</button>
                <button class="btn btn-primary" onclick="window.loadAdminDashboard()"><i class="fa-solid fa-rotate-right"></i> تحديث المؤشرات</button>
            </div>
        </div>

        <!-- Top KPIs -->
        <div class="stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem;">
            <div class="stat-card glass-panel" style="border-bottom: 3px solid var(--primary-color);">
                <div class="stat-icon" style="background: rgba(79, 70, 229, 0.1); color: var(--primary-color); padding: 1rem; border-radius: 50%; width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;"><i class="fa-solid fa-money-bill-trend-up"></i></div>
                <div class="stat-value" style="font-size: 1.6rem; font-weight: bold; color: var(--text-primary);">${s.totalVolume} <span style="font-size: 0.9rem; color: var(--text-secondary);">ج.م</span></div>
                <div class="stat-label" style="color: var(--text-secondary); font-size: 0.9rem;">إجمالي حجم الميزانيات</div>
                <div style="margin-top: 0.5rem; font-size: 0.8rem; color: var(--success);"><i class="fa-solid fa-arrow-trend-up"></i> بيانات حقيقية</div>
            </div>
            <div class="stat-card glass-panel" style="border-bottom: 3px solid var(--success);">
                <div class="stat-icon" style="background: rgba(16, 185, 129, 0.1); color: var(--success); padding: 1rem; border-radius: 50%; width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;"><i class="fa-solid fa-briefcase"></i></div>
                <div class="stat-value" style="font-size: 1.6rem; font-weight: bold; color: var(--text-primary);">${s.totalActiveDeals}</div>
                <div class="stat-label" style="color: var(--text-secondary); font-size: 0.9rem;">إجمالي الصفقات الجارية</div>
                <div style="margin-top: 0.5rem; font-size: 0.8rem; color: var(--text-muted);">مزادات ومناقصات</div>
            </div>
            <div class="stat-card glass-panel" style="border-bottom: 3px solid var(--info);">
                <div class="stat-icon" style="background: rgba(13, 138, 188, 0.1); color: var(--info); padding: 1rem; border-radius: 50%; width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;"><i class="fa-solid fa-users"></i></div>
                <div class="stat-value" style="font-size: 1.6rem; font-weight: bold; color: var(--text-primary);">${s.activeBidders + s.activePublishers}</div>
                <div class="stat-label" style="color: var(--text-secondary); font-size: 0.9rem;">المتداولين المسجلين</div>
                <div style="margin-top: 0.5rem; font-size: 0.8rem; color: var(--success);"><i class="fa-solid fa-arrow-trend-up"></i> مستخدمون حقيقون</div>
            </div>
            <div class="stat-card glass-panel" style="border-bottom: 3px solid var(--accent-color);">
                <div class="stat-icon" style="background: rgba(245, 158, 11, 0.1); color: var(--accent-color); padding: 1rem; border-radius: 50%; width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;"><i class="fa-solid fa-clipboard-check"></i></div>
                <div class="stat-value" style="font-size: 1.6rem; font-weight: bold; color: var(--text-primary);">${s.pendingApprovals}</div>
                <div class="stat-label" style="color: var(--text-secondary); font-size: 0.9rem;">تسجيلات بانتظار الاعتماد</div>
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
                    <h3 style="color: var(--text-primary); margin-bottom: 1.5rem; font-size: 1rem;"><i class="fa-solid fa-chart-pie" style="color: var(--info); margin-left: 0.5rem;"></i> توزيع الصفقات الحية</h3>
                    <div style="margin-bottom: 1.5rem;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.9rem;">
                            <span style="color: var(--text-primary);"><i class="fa-solid fa-file-contract"></i> مناقصات (65%)</span>
                            <span style="color: var(--text-muted);">${Math.round(s.totalActiveDeals * 0.65)} صفقة</span>
                        </div>
                        <div style="width: 100%; height: 8px; background: var(--border-glass); border-radius: 4px; overflow: hidden;">
                            <div style="width: 65%; height: 100%; background: var(--info);"></div>
                        </div>
                    </div>
                    <div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.9rem;">
                            <span style="color: var(--text-primary);"><i class="fa-solid fa-gavel"></i> مزادات (35%)</span>
                            <span style="color: var(--text-muted);">${Math.round(s.totalActiveDeals * 0.35)} صفقة</span>
                        </div>
                        <div style="width: 100%; height: 8px; background: var(--border-glass); border-radius: 4px; overflow: hidden;">
                            <div style="width: 35%; height: 100%; background: var(--accent-color);"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `);
};

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
    window.fetchDealsByStatus('نشط', "إدارة الصفقات النشطة", "قائمة بجميع المزادات والمناقصات الحقيقية والمباشرة من Firestore");
};

window.loadDealsArchive = function () {
    window.fetchDealsByStatus('مغلق', "أرشيف الصفقات المغلقة", "تاريخ الصفقات والمناقصات الحقيقية المؤرشفة سحابياً");
};

window.fetchDealsByStatus = function (status, title, subtitle) {
    if (!window.db) {
        const fallback = mockDB.deals.filter(d => d.status === status);
        window.renderDealsListView(fallback, title + " (محاكاة)", subtitle);
        return;
    }

    // Show Loading
    injectView(`
        <div style="padding: 5rem; text-align: center; animation: fadeIn 0.5s;">
            <i class="fa-solid fa-circle-notch fa-spin" style="font-size: 3.5rem; color: var(--primary-light); margin-bottom: 1.5rem;"></i>
            <h3 style="color: var(--text-primary);">جاري الاتصال بقاعدة البيانات...</h3>
            <p style="color: var(--text-secondary);">استرجاع بيانات الصفقات الحقيقية من السحابة</p>
        </div>
    `);

    window.db.collection('deals')
        .where('status', '==', status)
        .get()
        .then(querySnapshot => {
            let deals = [];
            querySnapshot.forEach(doc => {
                deals.push({ id: doc.id, ...doc.data() });
            });

            // Sort locally to avoid index creation requirement for now
            deals.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            window.renderDealsListView(deals, title, subtitle);
        })
        .catch(err => {
            console.error("Firestore Fetch Error:", err);
            const fallback = mockDB.deals.filter(d => d.status === status);
            window.renderDealsListView(fallback, title + " (خطأ في السحابة)", "تعذر جلب البيانات الحقيقية، يتم عرض البيانات المؤقتة");
        });
};

window.renderDealsListView = function (deals, title, subtitle) {
    const dealsHTML = deals.map(d => {
        let statusBadge = d.status === 'نشط'
            ? `<span class="badge" style="background: rgba(16, 185, 129, 0.1); color: var(--success); padding: 0.25rem 0.75rem; border-radius: 999px; border: 1px solid var(--success); font-size: 0.8rem;">نشط</span>`
            : `<span class="badge" style="background: rgba(239, 68, 68, 0.1); color: var(--danger); padding: 0.25rem 0.75rem; border-radius: 999px; border: 1px solid var(--danger); font-size: 0.8rem;">مغلق</span>`;

        let typeIcon = d.type?.includes('مزاد') ? '<i class="fa-solid fa-gavel" style="color: var(--accent-color);"></i>' : '<i class="fa-solid fa-file-contract" style="color: var(--info);"></i>';

        return `
            <div class="glass-panel deal-row" style="display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem; margin-bottom: 1rem; border-right: 4px solid ${d.status === 'نشط' ? 'var(--primary-light)' : 'var(--text-muted)'}; transition: var(--transition-normal);">
                <div style="flex: 2;">
                    <h4 style="font-size: 1.1rem; color: var(--primary-color); margin-bottom: 0.25rem;">${d.title}</h4>
                    <div style="font-size: 0.85rem; color: var(--text-secondary); display: flex; gap: 1rem; align-items: center;">
                        <span>${typeIcon} ${d.type || 'مناقصة'}</span>
                        <span><i class="fa-regular fa-folder" style="margin-left: 0.25rem;"></i>${d.category}</span>
                        <span><i class="fa-regular fa-clock" style="margin-left: 0.25rem;"></i>${d.status === 'نشط' ? 'ينتهي في' : 'انتهى في'}: ${d.endDate}</span>
                    </div>
                </div>
                <div style="flex: 1; text-align: center;">
                    ${statusBadge}
                </div>
                <div style="flex: 1; text-align: center;">
                    <div style="font-size: 1.5rem; font-weight: bold; color: var(--text-primary);">${d.bidsCount || 0}</div>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">عروض مقدمة</div>
                </div>
                <div style="flex: 1; display: flex; justify-content: flex-end; gap: 0.5rem;">
                    <button class="icon-btn" style="background: rgba(79, 70, 229, 0.1); color: var(--primary-light);" title="عرض التفاصيل" onclick="window.loadDealDetails('${d.id}')"><i class="fa-solid fa-eye"></i></button>
                    ${d.status === 'نشط' ? `
                        <button class="icon-btn" style="background: rgba(239, 68, 68, 0.1); color: var(--danger);" title="إغلاق وأرشفة" onclick="window.closeDeal('${d.id}')"><i class="fa-solid fa-box-archive"></i></button>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('') || `<div class="glass-panel" style="padding: 4rem; text-align: center; color: var(--text-muted); font-size: 1.1rem;">لا توجد صفقات حقيقية حالياً في هذا القسم.</div>`;

    injectView(`
        <div class="dashboard-header" style="margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center;">
            <div>
                <h2 class="text-gradient">${title}</h2>
                <p style="color: var(--text-secondary);">${subtitle}</p>
            </div>
            ${status === 'نشط' ? `<button class="btn btn-primary" onclick="loadNewDeal()"><i class="fa-solid fa-plus"></i> إنشاء صفقة جديدة</button>` : ''}
        </div>

        <div class="deals-container">
            ${dealsHTML}
        </div>
    `);
};

window.closeDeal = function (dealId) {
    if (!confirm("هل أنت متأكد من رغبتك في إغلاق هذه الصفقة ونقلها للأرشيف؟ لا يمكن للموردين تقديم عروض جديدة عليها بعد الإغلاق.")) return;

    window.simulateAILoading([
        "جاري التحقق من حالة العروض المقدمة...",
        "تحديث حالة الصفقة في قاعدة بيانات Firestore...",
        "تجميد عمليات المزايدة فورياً...",
        "إرسال تنبيهات نهائية للمشاركين...",
        "نقل البيانات التاريخية للأرشيف المؤمن..."
    ], () => {
        // Local update
        const deal = mockDB.deals.find(d => d.id === dealId);
        if (deal) {
            deal.status = 'مغلق';
        }

        // Firestore update
        if (window.db) {
            window.db.collection('deals').doc(dealId).update({
                status: 'مغلق',
                closedAt: new Date().toISOString()
            }).then(() => {
                console.log("Deal archived in Firestore.");
            }).catch(err => {
                console.error("Error archiving deal:", err);
            });
        }

        window.loadMyDeals(); // Go back to active deals
        alert("تم إغلاق الصفقة بنجاح ونقلها للأرشيف.");
    });
};


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
                    <input type="text" id="deal-title-input" placeholder="مثال: توريد شاشات تفاعلية للمكاتب الإدارية" style="width: 100%; padding: 0.8rem; border-radius: 8px; border: 1px solid var(--border-glass); background: var(--bg-surface); color: var(--text-primary); font-family: var(--font-body);">
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
                        <input type="date" id="deal-end-date-input" style="width: 100%; padding: 0.8rem; border-radius: 8px; border: 1px solid var(--border-glass); background: var(--bg-surface); color: var(--text-primary); font-family: var(--font-body);">
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-weight: 600;">قيمة التأمين الابتدائي (للمشاركة)</label>
                        <div style="position: relative;">
                            <input type="number" id="deal-insurance-input" placeholder="0" style="width: 100%; padding: 0.8rem 0.8rem 0.8rem 3rem; border-radius: 8px; border: 1px solid var(--border-glass); background: var(--bg-surface); color: var(--text-primary); font-family: var(--font-body);">
                            <span style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 0.9rem;">ج.م</span>
                        </div>
                    </div>
                </div>

                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-weight: 600;">الميزانية التقديرية (ج.م)</label>
                    <input type="number" id="deal-budget-input" placeholder="مثال: 100000" style="width: 100%; padding: 0.8rem; border-radius: 8px; border: 1px solid var(--border-glass); background: var(--bg-surface); color: var(--text-primary); font-family: var(--font-body);">
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
    const categorySelect = document.getElementById('deal-category-select');
    const filesInput = document.getElementById('new-deal-files');
    const filesError = document.getElementById('new-deal-files-error');

    const selectedCategory = categorySelect?.value;
    const dealTitle = titleInput?.value;
    const endDate = document.getElementById('deal-end-date-input')?.value || "";
    const budgetVal = document.getElementById('deal-budget-input')?.value || "";
    const insurance = document.getElementById('deal-insurance-input')?.value || "";

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
                    <button class="btn btn-primary" onclick="window.broadcastDealNotification('${selectedCategory}', '${dealTitle?.replace(/'/g, "\\'")}', '${descInput?.value?.replace(/\n/g, "\\'").replace(/'/g, "\\'")}', '${endDate}', '${budgetVal}', '${insurance}')"><i class="fa-solid fa-paper-plane"></i> نشر الصفقة وبدء تلقي العروض</button>
                    <button class="btn" style="border: 1px solid var(--border-glass);" onclick="loadMyDeals()">حفظ كمسودة</button>
                </div>
            </div>
        `;
        injectView(html);
    });
}

/**
 * sendGmailNotification
 * Uses EmailJS to send a real email via Gmail.
 */
window.sendGmailNotification = function (toEmail, companyName, dealDetails) {
    const config = window.gmailConfig;
    if (!config || config.publicKey === "YOUR_PUBLIC_KEY_HERE") {
        console.warn("Gmail (EmailJS) not configured. Skipping email to:", toEmail);
        return Promise.resolve({ status: "skipped" });
    }

    const templateParams = {
        to_email: toEmail,
        to_name: companyName || "شريكنا العزيز", // Fallback if name is empty
        company_name: companyName || "شريكنا العزيز",
        from_name: "منصة الصفقات الذكية",
        deal_title: dealDetails.title || "صفقة جديدة",
        deal_category: dealDetails.category || "عام",
        category: dealDetails.category || "عام",
        deal_link: dealDetails.link || "",
        link: dealDetails.link || "",
        message: `تم طرح صفقة جديدة تتوافق مع تخصصكم: ${dealDetails.title || 'صفقة جديدة'}`
    };

    console.log("PREPARING EMAILJS PARAMS:", templateParams);

    return emailjs.send(config.serviceId, config.templateId, templateParams)
        .then(response => {
            console.log("Email sent successfully to:", toEmail, response.status, response.text);
            return response;
        })
        .catch(error => {
            console.error("FAILED to send email to:", toEmail, error);
            throw error;
        });
};

window.broadcastDealNotification = function (category, title, description, overEndDate, overBudget, overInsurance) {
    const selectedCategory = category || document.getElementById('deal-category-select')?.value;
    const dealTitle = title || document.getElementById('deal-title-input')?.value || "صفقة جديدة";
    const dealDesc = description || document.getElementById('deal-description')?.value || "";

    // Use passed values if available (from Review screen), otherwise try getting from DOM
    const endDate = overEndDate || document.getElementById('deal-end-date-input')?.value || "2026-05-01";
    const budgetRaw = overBudget || document.getElementById('deal-budget-input')?.value || "100000";
    const insurance = overInsurance || document.getElementById('deal-insurance-input')?.value || "5000";

    const formatMoney = (val) => {
        if (!val) return "0 ج.م";
        const num = parseFloat(String(val).replace(/[^0-9.]/g, ''));
        return isNaN(num) ? "0 ج.م" : (num.toLocaleString() + " ج.م");
    };

    const budgetVal = formatMoney(budgetRaw);

    // Get file names for simulation
    const filesInput = document.getElementById('new-deal-files');
    const fileNames = filesInput ? Array.from(filesInput.files).map(f => f.name) : ["كراسة_الشروط.pdf"];

    if (!selectedCategory) {
        alert("الرجاء اختيار مجال النشاط أولاً.");
        return;
    }

    const newDealData = {
        title: dealTitle,
        description: dealDesc,
        category: selectedCategory,
        type: "مناقصة (شراء / توريد)",
        createdAt: new Date().toISOString(),
        endDate: endDate,
        budget: budgetVal,
        insuranceAmount: insurance,
        attachments: fileNames,
        status: "نشط",
        bidsCount: 0,
        aiScore: 95,
        publisher: mockDB.currentUser.name || "شركة توريدات كبرى"
    };

    console.log("Saving full deal data to Firestore:", newDealData);

    // Show initial UI
    simulateAILoading([
        "جاري إدراج الصفقة في قاعدة البيانات السحابية...",
        `المجال المستهدف: ${selectedCategory}`,
        "فحص مطابقة الموردين..."
    ], async () => {
        try {
            // Firestore Save
            const docRef = await window.db.collection("deals").add(newDealData);
            const dealId = docRef.id;
            console.log("Success! Deal saved with ID:", dealId);

            // Check for Twilio Config
            const isTwilioLive = window.twilioConfig && window.twilioConfig.authToken && window.twilioConfig.authToken !== "YOUR_AUTH_TOKEN_HERE";

            if (!isTwilioLive) {
                console.warn("Twilio not configured for real messaging.");
                runBroadcastSimulation(selectedCategory, dealId);
                return;
            }

            // Real Broadcast
            const querySnapshot = await window.db.collection("companies").where("field", "==", selectedCategory).get();
            const count = querySnapshot.size;

            if (count === 0) {
                alert(`تم حفظ الصفقة بنجاح تحت رقم (${dealId}).\nتنبيه: لم يتم العثور على موردين مسجلين في مجال "${selectedCategory}" لإرسال إشعارات.`);
                loadMyDeals();
                return;
            }

            simulateAILoading([
                `تم العثور على (${count}) شركة مطابقة.`,
                "توليد رسائل وتنبيهات Gmail...",
                "بدء البث المتزامن الآن..."
            ], async () => {
                let waSuccessCount = 0;
                let emailSuccessCount = 0;

                // Better dealLink for local/file paths
                const currentUrl = window.location.href.split('?')[0];
                const dealLink = currentUrl + "?dealId=" + dealId;

                const variables = { "1": dealTitle, "2": dealLink };
                const msgTemplate = window.twilioConfig.smsTemplate || "صفقة جديدة";
                const dealInfo = { title: dealTitle, category: selectedCategory, link: dealLink };

                // Initialize EmailJS if key exists
                if (window.gmailConfig && window.gmailConfig.publicKey !== "YOUR_PUBLIC_KEY_HERE") {
                    emailjs.init(window.gmailConfig.publicKey);
                }

                for (const doc of querySnapshot.docs) {
                    const company = doc.data();
                    const phone = company.representativePhone;
                    const email = company.email;
                    const name = company.name;

                    // 1. Send WhatsApp (Twilio)
                    if (phone) {
                        try {
                            const sent = await window.sendTwilioMessage(phone, msgTemplate, variables);
                            if (sent) waSuccessCount++;
                        } catch (e) { console.error("WA Error:", e); }
                    }

                    // 2. Send Email (Gmail/EmailJS)
                    if (email) {
                        try {
                            await window.sendGmailNotification(email, name, dealInfo);
                            emailSuccessCount++;
                        } catch (e) { console.error("Email Error:", e); }
                    }
                }

                alert(`تم النشر والتعميم بنجاح! 🎉\n- واتساب: ${waSuccessCount} شركة\n- بريد إلكتروني: ${emailSuccessCount} شركة\n(ID: ${dealId})`);
                loadMyDeals();
            });

        } catch (error) {
            console.error("CRITICAL ERROR DURING PUBLISH:", error);
            alert(`فشل الحفظ في Firestore: ${error.message}\nيرجى التأكد من إعدادات Firebase وقواعد الأمان (Security Rules).`);
        }
    });
};

// Internal simulation fallback
function runBroadcastSimulation(category, dealId = "sim_deal_99") {
    simulateAILoading([
        `تم حفظ الصفقة بنجاح في Firestore (ID: ${dealId})`,
        "جاري إرسال إشعارات محاكاة للموردين...",
        `التصنيف المستهدف: ${category}`,
        "تم إرسال (14) رسالة SMS وهمية بنجاح! ✅"
    ], () => {
        alert(`تم الحفظ والنشر (وضع المحاكاة)! 🎉\nالمورّدون سيصلهم الرابط الحقيقي: ?dealId=${dealId}\nيرجى ضبط Twilio AuthToken لتفعيل الإرسال الحقيقي.`);
        loadMyDeals();
    });
}

// ==========================================
// Twilio Messaging Engine (SMS & WhatsApp Content API)
// ==========================================
window.sendTwilioMessage = async function (toNumber, messageBody, contentVariables = null) {
    const { accountSid, authToken, whatsappFrom, contentSid } = window.twilioConfig;

    // Twilio API URL
    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

    // Ensure phone number has + sign and no spaces
    let formattedTo = toNumber.trim().replace(/\s/g, '');
    if (!formattedTo.startsWith('+')) {
        formattedTo = '+2' + formattedTo; // Default to Egypt if no country code
    }

    // Format Data
    const formData = new URLSearchParams();

    // Check if we use WhatsApp Content API or normal SMS
    if (whatsappFrom && contentSid) {
        formData.append('To', `whatsapp:${formattedTo}`);
        formData.append('From', whatsappFrom);
        formData.append('ContentSid', contentSid);
        if (contentVariables) {
            formData.append('ContentVariables', JSON.stringify(contentVariables));
        }
    } else {
        // Fallback to normal SMS
        formData.append('To', formattedTo);
        formData.append('From', window.twilioConfig.fromNumber);
        formData.append('Body', messageBody);
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + btoa(accountSid + ':' + authToken),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData
        });

        const result = await response.json();
        if (response.ok) {
            console.log("Twilio Message Sent Successfully:", result.sid);
            return true;
        } else {
            console.error("Twilio Error:", result.message);
            return false;
        }
    } catch (error) {
        console.error("Fetch Error for Twilio:", error);
        return false;
    }
};

// Legacy support if needed
window.sendSMS = window.sendTwilioMessage;

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
                        <th>البريد الإلكتروني</th>
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
                    <td style="font-size: 0.85rem; color: var(--text-secondary);">${data.email || '-'}</td>
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
                    <div style="margin-bottom: 1.2rem;">
                        <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary);">البريد الإلكتروني للشركة</label>
                        <input type="email" id="co-email" required placeholder="company@example.com" style="width: 100%; padding: 0.8rem; border-radius: 8px; border: 1px solid var(--border-glass); background: var(--bg-surface); color: var(--text-primary); text-align: left;" dir="ltr">
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
        email: document.getElementById("co-email").value,
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

window.downloadCompanyTemplate = function () {
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

window.importCompaniesFromExcel = function (event) {
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
