/**
 * data.js - Mock Database for Smart Tendering Platform
 * Contains fake data for Users, Tenders, Auctions, Bids, and AI Recommendations.
 */

const mockDB = {
    currentUser: {
        id: "usr_1001",
        name: "أحمد حسن",
        role: "publisher", // Options: 'publisher', 'bidder', 'admin'
        avatar: "https://ui-avatars.com/api/?name=أحمد+حسن&background=0D8ABC&color=fff&rounded=true",
        company: "شركة البناء الحديث",
        balance: 500000
    },

    stats: {
        publisher: {
            activeTenders: 3,
            closedTenders: 12,
            receivedBids: 45,
            awardedDeals: 10
        },
        bidder: {
            availableTenders: 124,
            submittedBids: 8,
            acceptedBids: 3,
            rejectedBids: 4
        },
        admin: {
            totalVolume: "15,420,000",
            totalActiveDeals: 248,
            activePublishers: 156,
            activeBidders: 842,
            pendingApprovals: 12
        }
    },

    // Admin Recent Activities
    adminRecentActivities: [
        { id: 1, type: "ترسية", user: "شركة البناء الحديث", action: "قامت بترسية صفقة توريد حواسيب", date: "منذ 10 دقائق", status: "success" },
        { id: 2, type: "تسجيل", user: "مؤسسة الأفق المتقدم", action: "طلب تسجيل مورد جديد (بانتظار الموافقة)", date: "منذ ساعتين", status: "warning" },
        { id: 3, type: "دفع", user: "مجموعة الرواد", action: "سداد قيمة تأمين ابتدائي بقيمة 50,000 ج.م", date: "منذ 3 ساعات", status: "info" }
    ],

    // Admin AI Alerts
    adminAIAlerts: [
        { id: 1, severity: "high", message: "تنبيه احتيال محتمل: شركة (س) قدمت أسعار أقل بـ 60% من متوسط السوق في 3 مناقصات. يُنصح بتجميد الحساب مؤقتاً للمراجعة.", icon: "shield-halved" },
        { id: 2, severity: "medium", message: "ركود في قطاع المقاولات: توجد 5 مناقصات تنتهي هذا الأسبوع بدون أي عروض. يُنصح بإرسال تذكير مخصص للموردين بهذا القطاع.", icon: "chart-line-down" }
    ],

    // Mock Users Data for Admin Management
    adminUsersList: [
        { id: "usr_201", name: "مؤسسة الأفق المتقدم", type: "مورد (Bidder)", status: "بانتظار التوثيق", email: "info@alufuq.com", joinDate: "2026-03-08", aiSourced: false, docsScore: 65, missingDocs: "السجل التجاري" },
        { id: "usr_202", name: "شركة النظم الذكية", type: "ناشر (Publisher)", status: "موثق", email: "admin@smartsys.sa", joinDate: "2025-11-12", aiSourced: false, docsScore: 100, missingDocs: "لا يوجد" },
        { id: "usr_203", name: "مجموعة العمار", type: "مورد", status: "موثق", email: "contact@alamar.com", joinDate: "2026-03-01", aiSourced: true, docsScore: 100, missingDocs: "تم الاستقطاب عبر AI", aiMatchConfidence: "98%" },
        { id: "usr_204", name: "الشركة الوطنية للتقنية", type: "مورد", status: "بانتظار التوثيق", email: "sales@ntech.net", joinDate: "2026-03-07", aiSourced: true, docsScore: 40, missingDocs: "شهادة الزكاة والدخل، الهوية", aiMatchConfidence: "85%" }
    ],

    // List of deals (Auctions & Tenders)
    deals: [
        {
            id: "dl_001",
            title: "توريد أجهزة حواسيب لمقر الشركة الجديد",
            type: "مناقصة",
            category: "تقنية المعلومات",
            status: "نشط", // active
            startDate: "2026-03-01",
            endDate: "2026-03-20",
            bidsCount: 5,
            budget: "100,000 ج.م",
            aiScore: 95, // AI matching score
            description: "مطلوب توريد 50 جهاز حاسوب محمول بمواصفات عالية مخصصة لمهندسي البرمجيات مع ضمان 3 سنوات."
        },
        {
            id: "dl_002",
            title: "بيع معدات ثقيلة مستعملة",
            type: "مزاد",
            category: "معدات بناء",
            status: "مغلق",
            startDate: "2026-02-15",
            endDate: "2026-02-28",
            bidsCount: 12,
            budget: "يبدأ من 500,000 ج.م",
            aiScore: 82,
            description: "بيع عدد 5 رافعات شوكية و 3 جرافات موديل 2020 بحالة جيدة جداً."
        },
        {
            id: "dl_003",
            title: "تصميم وتطوير تطبيق جوال للمبيعات",
            type: "مناقصة",
            category: "برمجيات",
            status: "نشط",
            startDate: "2026-03-05",
            endDate: "2026-04-10",
            bidsCount: 0,
            budget: "غير محدد",
            aiScore: 98,
            description: "نبحث عن شركة برمجيات متخصصة في تطوير تطبيقات الجوال (iOS, Android) لإنشاء تطبيق مبيعات متكامل."
        }
    ],

    // Mock data for bidder's submitted bids
    myBids: [
        {
            id: "BID-10025",
            dealTitle: "توريد أجهزة حواسيب لمقر الشركة الجديد",
            submittedPrice: 95000,
            submittedDate: "2026-03-05",
            status: "قيد المراجعة",
            aiFeedback: "سعرك تنافسي بدرجة كبيرة، توقعات الفوز تتجاوز 80%.",
            type: "مناقصة"
        },
        {
            id: "BID-09884",
            dealTitle: "تصميم واجهات منصة رقمية",
            submittedPrice: 15000,
            submittedDate: "2026-02-20",
            status: "مقبول",
            aiFeedback: "تم الترسية لأن تقييمك الفني كان الأعلى وسعرك ضمن الميزانية.",
            type: "مناقصة"
        },
        {
            id: "BID-08552",
            dealTitle: "مزايدة على تأجير مستودعات",
            submittedPrice: 120000,
            submittedDate: "2026-01-10",
            status: "مرفوض",
            aiFeedback: "تم الرفض، السعر المقدم كان أعلى من متوسط السوق بنسبة 25%.",
            type: "مزاد"
        }
    ],

    // AI Simulated Search Results (e.g., when finding suppliers)
    aiSuppliers: [
        { name: "شركة الحلول التقنية المتقدمة", match: "98%", reason: "نفذت 15 مشروعاً مشابهاً بجودة عالية." },
        { name: "ألفا للبرمجيات", match: "92%", reason: "متخصصون في تطبيقات المبيعات وسجل تسليم ممتاز." },
        { name: "رواد التقنية", match: "85%", reason: "تقييم عالي من العملاء في المنصة." }
    ]
};

// Global helper to get current role config
function getCurrentRoleConfig() {
    return mockDB.currentUser.role;
}
