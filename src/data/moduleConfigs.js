export const moduleConfigs = {
  purchases: {
    eyebrow: 'إدارة المشتريات',
    title: 'المشتريات',
    description: 'متابعة الموردين، أوامر التوريد، والاستلام الفعلي للمخزون مع رؤية واضحة للكلفة.',
    actions: ['إضافة أمر شراء', 'استيراد أصناف', 'مراجعة الاستلام'],
    metrics: [
      { label: 'أوامر مفتوحة', value: '12', delta: '5 خلال هذا الأسبوع', tone: 'warning' },
      { label: 'قيمة مشتريات الشهر', value: 'EGP 218K', delta: '+8% عن الشهر الماضي', tone: 'success' },
      { label: 'الموردون النشطون', value: '34', delta: '3 موردين جدد', tone: 'info' },
      { label: 'متوسط مهلة التوريد', value: '4.2 يوم', delta: 'أفضل من الهدف بيوم', tone: 'neutral' },
    ],
    table: {
      title: 'أوامر الشراء الحالية',
      subtitle: 'آخر أوامر الشراء التي تحتاج متابعة أو استلام.',
      columns: [
        { key: 'code', label: 'الرقم' },
        { key: 'supplier', label: 'المورد' },
        { key: 'amount', label: 'القيمة' },
        { key: 'status', label: 'الحالة' },
      ],
      rows: [
        { code: 'PO-2218', supplier: 'شركة النور', amount: 'EGP 24,600', status: { kind: 'badge', label: 'بانتظار الاستلام', tone: 'warning' } },
        { code: 'PO-2217', supplier: 'المتحدة للأغذية', amount: 'EGP 12,300', status: { kind: 'badge', label: 'تم الشحن', tone: 'info' } },
        { code: 'PO-2214', supplier: 'أوكسجين التجارية', amount: 'EGP 9,870', status: { kind: 'badge', label: 'مغلق', tone: 'success' } },
      ],
    },
    checklist: {
      title: 'خطوات العمل',
      items: [
        { label: 'مراجعة الأصناف الناقصة قبل 12 ظهراً', hint: 'أصناف سريعة الدوران', status: 'ضروري' },
        { label: 'مطابقة أسعار الموردين الجدد', hint: 'قبل اعتماد أمر جديد', status: 'مراجعة' },
        { label: 'إرسال تنبيه للمخزن عند الاستلام الجزئي', hint: 'منع نقص المخزون', status: 'نشط' },
      ],
    },
    activity: {
      title: 'آخر التحديثات',
      items: [
        { title: 'تم تحديث حد إعادة الطلب لصنف قهوة تركي', meta: 'منذ 20 دقيقة', tone: 'info' },
        { title: 'استلام جزئي من شركة النور', meta: 'منذ ساعة', tone: 'warning' },
        { title: 'إغلاق أمر شراء PO-2214', meta: 'اليوم 08:15 ص', tone: 'success' },
      ],
    },
  },
  finance: {
    eyebrow: 'الإدارة المالية',
    title: 'المالية',
    description: 'مراقبة الخزائن، التدفقات النقدية، الالتزامات الضريبية، وتسوية الشفتات.',
    actions: ['إضافة حركة خزنة', 'إقفال شفت', 'تقرير الضريبة'],
    metrics: [
      { label: 'رصيد الخزنة الرئيسية', value: 'EGP 126,480', delta: 'متاح الآن', tone: 'success' },
      { label: 'مدفوعات معلقة', value: 'EGP 18,900', delta: '6 فواتير مستحقة', tone: 'warning' },
      { label: 'تحصيلات اليوم', value: 'EGP 48,320', delta: '4 قنوات دفع', tone: 'info' },
      { label: 'ضريبة متوقعة', value: 'EGP 6,140', delta: 'حتى نهاية الأسبوع', tone: 'neutral' },
    ],
    table: {
      title: 'حركات الخزنة',
      subtitle: 'ملخص آخر القيود المبسطة المرتبطة بالتشغيل.',
      columns: [
        { key: 'entry', label: 'الحركة' },
        { key: 'branch', label: 'الفرع' },
        { key: 'value', label: 'القيمة' },
        { key: 'state', label: 'الحالة' },
      ],
      rows: [
        { entry: 'إيداع مبيعات شفت صباحي', branch: 'المعادي', value: 'EGP 12,440', state: { kind: 'badge', label: 'مراجع', tone: 'success' } },
        { entry: 'مصروف مشتريات نظافة', branch: 'مدينة نصر', value: 'EGP 1,280', state: { kind: 'badge', label: 'بانتظار القيد', tone: 'warning' } },
        { entry: 'تسوية فرق خزنة', branch: 'الشيخ زايد', value: 'EGP 85', state: { kind: 'badge', label: 'حرج', tone: 'danger' } },
      ],
    },
    checklist: {
      title: 'رقابة يومية',
      items: [
        { label: 'مطابقة النقدية مع تقرير الشفت', hint: 'قبل التسليم للمحاسب', status: 'يومي' },
        { label: 'مراجعة العمولات البنكية', hint: 'تلقائياً آخر اليوم', status: 'آلي' },
        { label: 'تصدير ملف القيود إلى ERP', hint: 'كل ساعتين', status: 'مجدول' },
      ],
    },
    activity: {
      title: 'سجل المتابعة',
      items: [
        { title: 'إقفال شفت فرع المعادي', meta: '09:05 ص', tone: 'success' },
        { title: 'استلام كشف بنك جديد', meta: '08:40 ص', tone: 'info' },
        { title: 'إنذار فرق خزنة أعلى من المسموح', meta: 'أمس 11:17 م', tone: 'danger' },
      ],
    },
  },
  reports: {
    eyebrow: 'التحليلات',
    title: 'التقارير',
    description: 'مركز تقارير موحد لمراقبة المبيعات والمخزون والربحية على مستوى الفرع أو النشاط.',
    actions: ['تقرير يومي', 'مقارنة فروع', 'تصدير Excel'],
    metrics: [
      { label: 'تقارير مولدة اليوم', value: '23', delta: 'منها 8 تقارير آلية', tone: 'info' },
      { label: 'هامش الربح', value: '31%', delta: '+2.4 نقطة', tone: 'success' },
      { label: 'أصناف بطيئة الحركة', value: '17', delta: 'تحتاج تدخل', tone: 'warning' },
      { label: 'نسبة المرتجعات', value: '1.8%', delta: 'ضمن الحد الطبيعي', tone: 'neutral' },
    ],
    table: {
      title: 'آخر التقارير المحفوظة',
      subtitle: 'نماذج جاهزة للمراجعة السريعة أو التصدير.',
      columns: [
        { key: 'name', label: 'اسم التقرير' },
        { key: 'scope', label: 'النطاق' },
        { key: 'generated', label: 'وقت التوليد' },
        { key: 'status', label: 'الحالة' },
      ],
      rows: [
        { name: 'مبيعات اليوم', scope: 'كل الفروع', generated: '09:30 ص', status: { kind: 'badge', label: 'جاهز', tone: 'success' } },
        { name: 'ربحية الأصناف', scope: 'المعادي', generated: '09:05 ص', status: { kind: 'badge', label: 'محدث', tone: 'info' } },
        { name: 'جرد سريع', scope: 'المخزن الرئيسي', generated: '08:50 ص', status: { kind: 'badge', label: 'بحاجة مراجعة', tone: 'warning' } },
      ],
    },
    checklist: {
      title: 'تقارير مقترحة',
      items: [
        { label: 'مقارنة العروض مع المبيعات', hint: 'لقياس فعالية الخصومات', status: 'مهم' },
        { label: 'تقارير ساعات الذروة', hint: 'لتوزيع الموظفين', status: 'تحليلي' },
        { label: 'ربحية كل فرع بعد المصروفات', hint: 'لقرارات التوسع', status: 'إداري' },
      ],
    },
    activity: {
      title: 'تنبيهات التحليل',
      items: [
        { title: 'ارتفاع طلب مشروبات باردة 19%', meta: 'مقارنة بالأسبوع السابق', tone: 'success' },
        { title: 'انخفاض هامش صنف دونات شوكولاتة', meta: 'بسبب تكلفة المواد', tone: 'warning' },
        { title: 'تقرير الأداء الشهري جاهز للنشر', meta: 'تمت المراجعة', tone: 'info' },
      ],
    },
  },
  employees: {
    eyebrow: 'فريق العمل',
    title: 'الموظفين',
    description: 'إدارة الشفتات، الحضور، الأداء، وتتبع من يعمل الآن بكل فرع.',
    actions: ['إضافة موظف', 'جدولة شفت', 'طباعة كشف حضور'],
    metrics: [
      { label: 'إجمالي الموظفين', value: '68', delta: 'عبر 4 فروع', tone: 'neutral' },
      { label: 'حاضرون الآن', value: '26', delta: '9 كاشير و5 مشرفين', tone: 'success' },
      { label: 'استحقاقات متأخرة', value: '4', delta: 'تحتاج اعتماد الموارد البشرية', tone: 'warning' },
      { label: 'نسبة الالتزام', value: '96%', delta: 'آخر 30 يوماً', tone: 'info' },
    ],
    table: {
      title: 'الوردية الحالية',
      subtitle: 'من يعمل الآن وتوزيع الأدوار على الفروع.',
      columns: [
        { key: 'employee', label: 'الموظف' },
        { key: 'role', label: 'الدور' },
        { key: 'branch', label: 'الفرع' },
        { key: 'status', label: 'الحالة' },
      ],
      rows: [
        { employee: 'عمر سامي', role: 'كاشير', branch: 'المعادي', status: { kind: 'badge', label: 'على الشفت', tone: 'success' } },
        { employee: 'ريهام أحمد', role: 'مشرف فرع', branch: 'مدينة نصر', status: { kind: 'badge', label: 'متابعة', tone: 'info' } },
        { employee: 'يوسف حمدي', role: 'مخزن', branch: 'المخزن الرئيسي', status: { kind: 'badge', label: 'استراحة', tone: 'warning' } },
      ],
    },
    checklist: {
      title: 'تشغيل الفريق',
      items: [
        { label: 'مراجعة صلاحيات الكاشير الجديد', hint: 'قبل بدء العمل', status: 'اليوم' },
        { label: 'تفعيل بطاقات NFC لثلاثة موظفين', hint: 'من شاشة الدخول', status: 'بانتظار' },
        { label: 'اعتماد جدول نهاية الأسبوع', hint: 'يغطي الجمعة والسبت', status: 'مطلوب' },
      ],
    },
    activity: {
      title: 'سجل الموظفين',
      items: [
        { title: 'دخول عبر NFC للموظف عمر سامي', meta: '09:02 ص', tone: 'success' },
        { title: 'تغيير دور ريهام أحمد إلى مشرف', meta: 'أمس', tone: 'info' },
        { title: 'غياب غير مبرر لموظف مخزن', meta: 'أمس 07:10 ص', tone: 'danger' },
      ],
    },
  },
  integration: {
    eyebrow: 'الربط الخارجي',
    title: 'التكامل',
    description: 'إدارة بوابات الدفع، الطابعات، الباركود، والربط مع الأنظمة الخارجية والتطبيقات.',
    actions: ['إضافة موصل', 'اختبار API', 'تفعيل جهاز جديد'],
    metrics: [
      { label: 'تكاملات نشطة', value: '11', delta: '8 مستقرة و3 قيد التجربة', tone: 'info' },
      { label: 'أجهزة POS متصلة', value: '14', delta: 'كلها على الإنترنت', tone: 'success' },
      { label: 'طلبات API اليوم', value: '12.8K', delta: 'متوسط 180ms', tone: 'neutral' },
      { label: 'تنبيهات ربط', value: '2', delta: 'تحتاج متابعة', tone: 'warning' },
    ],
    table: {
      title: 'الموصلات الحالية',
      subtitle: 'قنوات الربط التي يعتمد عليها النظام في التشغيل.',
      columns: [
        { key: 'connector', label: 'الموصل' },
        { key: 'scope', label: 'الاستخدام' },
        { key: 'uptime', label: 'التوفر' },
        { key: 'status', label: 'الحالة' },
      ],
      rows: [
        { connector: 'بوابة الدفع Mada / Visa', scope: 'المدفوعات', uptime: '99.9%', status: { kind: 'badge', label: 'نشط', tone: 'success' } },
        { connector: 'Webhook التوصيل', scope: 'طلبات أونلاين', uptime: '98.7%', status: { kind: 'badge', label: 'مراقبة', tone: 'warning' } },
        { connector: 'واجهة ERP', scope: 'قيود يومية', uptime: '99.4%', status: { kind: 'badge', label: 'سليم', tone: 'info' } },
      ],
    },
    checklist: {
      title: 'إجراءات فنية',
      items: [
        { label: 'اختبار طابعة الحرارية الجديدة', hint: 'فرع الشيخ زايد', status: 'مفتوح' },
        { label: 'تجديد مفاتيح API للـ ERP', hint: 'قبل 5 أبريل', status: 'موعد' },
        { label: 'مراجعة أحداث Webhook الفاشلة', hint: 'مرتين يومياً', status: 'مراقبة' },
      ],
    },
    activity: {
      title: 'أحداث التكامل',
      items: [
        { title: 'نجاح إرسال 214 فاتورة إلى ERP', meta: 'اليوم 09:15 ص', tone: 'success' },
        { title: 'إعادة محاولة فاشلة لـ Webhook', meta: 'منذ 35 دقيقة', tone: 'warning' },
        { title: 'ربط جهاز NFC جديد في فرع المعادي', meta: 'اليوم 08:55 ص', tone: 'info' },
      ],
    },
  },
  businessSettings: {
    eyebrow: 'إدارة المنشأة',
    title: 'إعدادات النشاط التجاري',
    description: 'تجهيز بيانات النشاط، الضرائب، قنوات البيع، والسياسات التجارية الأساسية.',
    actions: ['تحديث بيانات المنشأة', 'إعداد الضرائب', 'تفعيل القنوات'],
    metrics: [
      { label: 'اكتمال الملف', value: '92%', delta: 'بيانان متبقيان', tone: 'success' },
      { label: 'قنوات البيع', value: '4', delta: 'فرع + أونلاين + توصيل', tone: 'info' },
      { label: 'سياسات مرتجعات', value: '3', delta: 'مفعلة حسب القناة', tone: 'neutral' },
      { label: 'متطلبات ضريبية', value: '1', delta: 'تحتاج تحديث', tone: 'warning' },
    ],
    table: {
      title: 'بيانات النشاط',
      subtitle: 'العناصر الأساسية التي يعتمد عليها النظام في التشغيل والطباعة.',
      columns: [
        { key: 'field', label: 'البيان' },
        { key: 'value', label: 'القيمة' },
        { key: 'scope', label: 'النطاق' },
        { key: 'status', label: 'الحالة' },
      ],
      rows: [
        { field: 'اسم النشاط', value: 'Nawa Cafe', scope: 'عام', status: { kind: 'badge', label: 'مكتمل', tone: 'success' } },
        { field: 'الرقم الضريبي', value: '312-55-9187', scope: 'الفواتير', status: { kind: 'badge', label: 'مفعل', tone: 'info' } },
        { field: 'سياسة الإلغاء', value: 'خلال 15 دقيقة', scope: 'المبيعات', status: { kind: 'badge', label: 'تحتاج مراجعة', tone: 'warning' } },
      ],
    },
    checklist: {
      title: 'تحسينات مقترحة',
      items: [
        { label: 'رفع شعار عالي الدقة للطباعة', hint: '80mm و A4', status: 'مقترح' },
        { label: 'ربط بيانات النشاط بالفرع تلقائياً', hint: 'لتسهيل التوسع', status: 'مفيد' },
        { label: 'إضافة سياسة استرجاع لكل قناة بيع', hint: 'محل وتوصيل', status: 'ضروري' },
      ],
    },
    activity: {
      title: 'آخر التعديلات',
      items: [
        { title: 'تحديث عنوان الفرع الرئيسي', meta: 'منذ 50 دقيقة', tone: 'info' },
        { title: 'إضافة سياسة مرتجعات للطلبات الأونلاين', meta: 'أمس', tone: 'success' },
        { title: 'الرقم الضريبي يحتاج إعادة تحقق', meta: 'منذ يومين', tone: 'warning' },
      ],
    },
  },
  purchaseRequest: {
    eyebrow: 'تشغيل المخزون',
    title: 'طلب شراء',
    description: 'إنشاء طلبات شراء داخلية من الفروع أو المخازن قبل اعتمادها من الإدارة.',
    actions: ['طلب جديد', 'نسخ من طلب سابق', 'إرفاق ملاحظة'],
    metrics: [
      { label: 'طلبات اليوم', value: '9', delta: 'من 3 فروع', tone: 'info' },
      { label: 'طلبات عاجلة', value: '2', delta: 'خلال 24 ساعة', tone: 'warning' },
      { label: 'بنود مطلوبة', value: '47', delta: 'أصناف خام واستهلاكية', tone: 'neutral' },
      { label: 'مطابقة الميزانية', value: '88%', delta: 'ضمن الحد الحالي', tone: 'success' },
    ],
    table: {
      title: 'قائمة الطلبات',
      subtitle: 'طلبات الشراء المرفوعة من الفروع أو الإدارة.',
      columns: [
        { key: 'request', label: 'الطلب' },
        { key: 'branch', label: 'الفرع' },
        { key: 'owner', label: 'الطالب' },
        { key: 'status', label: 'الحالة' },
      ],
      rows: [
        { request: 'PR-1184', branch: 'المعادي', owner: 'مشرف المخزن', status: { kind: 'badge', label: 'جديد', tone: 'info' } },
        { request: 'PR-1183', branch: 'مدينة نصر', owner: 'مدير الفرع', status: { kind: 'badge', label: 'عاجل', tone: 'warning' } },
        { request: 'PR-1178', branch: 'الشيخ زايد', owner: 'مساعد تشغيل', status: { kind: 'badge', label: 'تم الرفع', tone: 'success' } },
      ],
    },
    checklist: {
      title: 'قواعد الرفع',
      items: [
        { label: 'إدراج الكمية الحالية مع الطلب', hint: 'منع التكرار', status: 'إلزامي' },
        { label: 'ربط كل طلب بمركز تكلفة', hint: 'للمراجعة المالية', status: 'إلزامي' },
        { label: 'تحديد درجة الأولوية', hint: 'عادي أو عاجل', status: 'تشغيلي' },
      ],
    },
    activity: {
      title: 'التدفق الحالي',
      items: [
        { title: 'رفع طلب عاجل لمستلزمات تعبئة', meta: 'اليوم 09:12 ص', tone: 'warning' },
        { title: 'تم نسخ طلب أسبوعي تلقائياً', meta: 'اليوم 08:00 ص', tone: 'success' },
        { title: 'تعديل كمية صنف بن قبل الإرسال', meta: 'منذ 25 دقيقة', tone: 'info' },
      ],
    },
  },
  purchaseConfirmation: {
    eyebrow: 'الاعتماد',
    title: 'تأكيد طلب الشراء',
    description: 'شاشة اعتماد الطلبات المرفوعة وربطها بالميزانية والمورد الأنسب قبل تحويلها لأمر شراء.',
    actions: ['اعتماد دفعة', 'رفض مع ملاحظة', 'تحويل لأمر شراء'],
    metrics: [
      { label: 'بانتظار الاعتماد', value: '6', delta: '3 عاجلة', tone: 'warning' },
      { label: 'متوسط زمن الاعتماد', value: '2.1 ساعة', delta: 'تحسن 18%', tone: 'success' },
      { label: 'طلبات مرفوضة', value: '1', delta: 'اليوم', tone: 'danger' },
      { label: 'تحويلات لأوامر شراء', value: '11', delta: 'هذا الأسبوع', tone: 'info' },
    ],
    table: {
      title: 'لوحة الاعتماد',
      subtitle: 'الطلبات التي تحتاج قراراً قبل المتابعة مع الموردين.',
      columns: [
        { key: 'request', label: 'الطلب' },
        { key: 'costCenter', label: 'مركز التكلفة' },
        { key: 'budget', label: 'الميزانية' },
        { key: 'status', label: 'الحالة' },
      ],
      rows: [
        { request: 'PR-1184', costCenter: 'تشغيل الفروع', budget: 'EGP 8,700', status: { kind: 'badge', label: 'بانتظار القرار', tone: 'warning' } },
        { request: 'PR-1182', costCenter: 'تسويق', budget: 'EGP 2,400', status: { kind: 'badge', label: 'تمت الموافقة', tone: 'success' } },
        { request: 'PR-1179', costCenter: 'مخزون مركزي', budget: 'EGP 5,100', status: { kind: 'badge', label: 'مرفوض', tone: 'danger' } },
      ],
    },
    checklist: {
      title: 'سياسة الموافقات',
      items: [
        { label: 'أكثر من EGP 10,000 يحتاج مديرين', hint: 'مستويان اعتماد', status: 'سياسة' },
        { label: 'مطابقة المورد المعتمد', hint: 'حسب الفئة', status: 'إلزامي' },
        { label: 'مراجعة أثر الطلب على الميزانية', hint: 'قبل التحويل', status: 'مالي' },
      ],
    },
    activity: {
      title: 'آخر القرارات',
      items: [
        { title: 'اعتماد طلب مواد تعبئة فرع المعادي', meta: 'منذ 14 دقيقة', tone: 'success' },
        { title: 'رفض طلب غير مطابق للميزانية', meta: '08:48 ص', tone: 'danger' },
        { title: 'تحويل PR-1182 إلى أمر شراء', meta: '08:10 ص', tone: 'info' },
      ],
    },
  },
  employeeSettings: {
    eyebrow: 'إدارة الموارد',
    title: 'إعدادات الموظفين',
    description: 'تعريف الأدوار، الصلاحيات، سياسات الدوام، ووسائل تسجيل الدخول.',
    actions: ['إضافة دور', 'تعديل سياسة حضور', 'ربط بطاقات NFC'],
    metrics: [
      { label: 'الأدوار المعرفة', value: '8', delta: 'من كاشير إلى مدير منطقة', tone: 'neutral' },
      { label: 'بطاقات NFC مفعلة', value: '29', delta: 'قابلة للزيادة', tone: 'info' },
      { label: 'قواعد حضور', value: '4', delta: 'حسب نوع الفرع', tone: 'success' },
      { label: 'تنبيهات صلاحيات', value: '2', delta: 'تحتاج إعادة ضبط', tone: 'warning' },
    ],
    table: {
      title: 'الأدوار والصلاحيات',
      subtitle: 'نموذج مبسط لإدارة صلاحيات الموظفين.',
      columns: [
        { key: 'role', label: 'الدور' },
        { key: 'permissions', label: 'الصلاحيات' },
        { key: 'login', label: 'طريقة الدخول' },
        { key: 'status', label: 'الحالة' },
      ],
      rows: [
        { role: 'كاشير', permissions: 'بيع + مرتجعات', login: 'NFC / يوزر', status: { kind: 'badge', label: 'نشط', tone: 'success' } },
        { role: 'مشرف فرع', permissions: 'اعتماد خصومات', login: 'يوزر + PIN', status: { kind: 'badge', label: 'مفعل', tone: 'info' } },
        { role: 'محاسب', permissions: 'مالية وتقارير', login: 'يوزر فقط', status: { kind: 'badge', label: 'مراجعة', tone: 'warning' } },
      ],
    },
    checklist: {
      title: 'قواعد الوصول',
      items: [
        { label: 'فصل صلاحية الحذف عن البيع', hint: 'للأمان', status: 'مهم' },
        { label: 'استخدام NFC للعمليات السريعة', hint: 'عند نقاط البيع', status: 'مفضل' },
        { label: 'تفعيل PIN للموافقات', hint: 'للمشرفين فقط', status: 'سياسة' },
      ],
    },
    activity: {
      title: 'أحداث الإعداد',
      items: [
        { title: 'ربط بطاقة NFC جديدة للموظفة نور', meta: '09:10 ص', tone: 'info' },
        { title: 'تعديل صلاحية المرتجعات للكاشير', meta: 'أمس', tone: 'warning' },
        { title: 'إلغاء دور غير مستخدم', meta: 'منذ يومين', tone: 'success' },
      ],
    },
  },
  productSettings: {
    eyebrow: 'الكاتالوج',
    title: 'إعدادات المنتجات',
    description: 'إدارة التصنيفات، الباركود، وحدات القياس، حدود المخزون، والوصفات.',
    actions: ['إضافة صنف', 'استيراد Excel', 'تحديث باركود'],
    metrics: [
      { label: 'إجمالي الأصناف', value: '1,248', delta: '72 صنف خام', tone: 'neutral' },
      { label: 'أصناف بها حد إعادة طلب', value: '384', delta: 'مفعلة', tone: 'success' },
      { label: 'أصناف بدون باركود', value: '19', delta: 'تحتاج معالجة', tone: 'warning' },
      { label: 'وصفات نشطة', value: '62', delta: 'للمطابخ والقهوة', tone: 'info' },
    ],
    table: {
      title: 'ضبط الأصناف',
      subtitle: 'عناصر أساسية يجب إكمالها قبل البيع أو الطلب.',
      columns: [
        { key: 'item', label: 'الصنف' },
        { key: 'sku', label: 'SKU' },
        { key: 'stockRule', label: 'قاعدة المخزون' },
        { key: 'status', label: 'الحالة' },
      ],
      rows: [
        { item: 'قهوة تركي', sku: 'BEV-001', stockRule: 'حد إعادة طلب 20', status: { kind: 'badge', label: 'جاهز', tone: 'success' } },
        { item: 'عبوة تعبئة 8oz', sku: 'PKG-120', stockRule: 'بلا باركود', status: { kind: 'badge', label: 'تحتاج تحديث', tone: 'warning' } },
        { item: 'كيكة تمر', sku: 'DES-013', stockRule: 'مرتبطة بوصفة', status: { kind: 'badge', label: 'نشط', tone: 'info' } },
      ],
    },
    checklist: {
      title: 'قواعد الكاتالوج',
      items: [
        { label: 'توحيد وحدات القياس', hint: 'قطعة / كجم / لتر', status: 'أساسي' },
        { label: 'فصل الصنف الخام عن المباع', hint: 'لدقة التقارير', status: 'هام' },
        { label: 'ربط كل صنف بفئة ضريبية', hint: 'على مستوى الفاتورة', status: 'إلزامي' },
      ],
    },
    activity: {
      title: 'آخر التعديلات',
      items: [
        { title: 'إضافة صنف جديد: موكا بارد', meta: 'اليوم', tone: 'success' },
        { title: 'تحذير صنف بدون باركود', meta: 'منذ 40 دقيقة', tone: 'warning' },
        { title: 'تحديث صورة قائمة رقمية', meta: '08:30 ص', tone: 'info' },
      ],
    },
  },
  programSettings: {
    eyebrow: 'المنصة',
    title: 'إعدادات البرنامج',
    description: 'ضبط اللغة، النسخ الاحتياطي، الطباعة، الإشعارات، ووضع العمل دون اتصال.',
    actions: ['نسخة احتياطية', 'إعداد الإشعارات', 'تحديث الطابعات'],
    metrics: [
      { label: 'آخر نسخة احتياطية', value: '08:00 ص', delta: 'نجحت تلقائياً', tone: 'success' },
      { label: 'أجهزة تحتاج تحديث', value: '3', delta: 'إصدار جديد متاح', tone: 'warning' },
      { label: 'لغات الواجهة', value: '2', delta: 'العربية والإنجليزية', tone: 'info' },
      { label: 'وضع أوفلاين', value: 'مفعل', delta: 'حتى 4 ساعات', tone: 'neutral' },
    ],
    table: {
      title: 'إعدادات النظام العامة',
      subtitle: 'إعدادات تؤثر على كل الفروع والأجهزة.',
      columns: [
        { key: 'setting', label: 'الإعداد' },
        { key: 'value', label: 'القيمة' },
        { key: 'scope', label: 'النطاق' },
        { key: 'status', label: 'الحالة' },
      ],
      rows: [
        { setting: 'لغة الواجهة', value: 'العربية', scope: 'عام', status: { kind: 'badge', label: 'نشط', tone: 'success' } },
        { setting: 'طباعة إيصال تلقائي', value: 'بعد كل بيع', scope: 'الكاشير', status: { kind: 'badge', label: 'مفعل', tone: 'info' } },
        { setting: 'مزامنة أوفلاين', value: 'كل 5 دقائق', scope: 'الأجهزة', status: { kind: 'badge', label: 'مراقبة', tone: 'warning' } },
      ],
    },
    checklist: {
      title: 'أفضل الممارسات',
      items: [
        { label: 'نسخة احتياطية سحابية يومية', hint: 'مع تنبيه فشل', status: 'موصى به' },
        { label: 'قفل الجلسة بعد خمول', hint: 'للكاشير', status: 'أمني' },
        { label: 'اختبار الطباعة بعد كل تحديث', hint: 'قبل النشر للفروع', status: 'تشغيلي' },
      ],
    },
    activity: {
      title: 'عمليات النظام',
      items: [
        { title: 'نجاح نسخة احتياطية كاملة', meta: '08:00 ص', tone: 'success' },
        { title: 'تنبيه جهاز قديم في فرع مدينة نصر', meta: '07:55 ص', tone: 'warning' },
        { title: 'تحديث قالب إشعار انخفاض المخزون', meta: 'أمس', tone: 'info' },
      ],
    },
  },
  branchSettings: {
    eyebrow: 'إدارة الفروع',
    title: 'إعدادات الفرع',
    description: 'ضبط الفروع، المخازن التابعة، ساعات العمل، والطابعات والأجهزة المرتبطة بكل فرع.',
    actions: ['إضافة فرع', 'ربط مخزن', 'تخصيص طابعة'],
    metrics: [
      { label: 'عدد الفروع', value: '4', delta: 'وفرع إلكتروني', tone: 'neutral' },
      { label: 'مخازن مرتبطة', value: '7', delta: 'تشمل المخزن المركزي', tone: 'info' },
      { label: 'أجهزة POS', value: '14', delta: 'كلها متصلة', tone: 'success' },
      { label: 'تنبيهات إعداد', value: '1', delta: 'طابعة تحتاج معايرة', tone: 'warning' },
    ],
    table: {
      title: 'خريطة الفروع',
      subtitle: 'البيانات التشغيلية الأساسية لكل فرع.',
      columns: [
        { key: 'branch', label: 'الفرع' },
        { key: 'hours', label: 'ساعات العمل' },
        { key: 'warehouse', label: 'المخزن' },
        { key: 'status', label: 'الحالة' },
      ],
      rows: [
        { branch: 'المعادي', hours: '08:00 - 01:00', warehouse: 'WH-M01', status: { kind: 'badge', label: 'نشط', tone: 'success' } },
        { branch: 'مدينة نصر', hours: '09:00 - 12:00', warehouse: 'WH-N04', status: { kind: 'badge', label: 'مراقبة', tone: 'warning' } },
        { branch: 'الشيخ زايد', hours: '08:00 - 12:00', warehouse: 'WH-Z02', status: { kind: 'badge', label: 'سليم', tone: 'info' } },
      ],
    },
    checklist: {
      title: 'مهام الفرع',
      items: [
        { label: 'ربط كل فرع بمخزن افتراضي', hint: 'للسحب التلقائي', status: 'ضروري' },
        { label: 'ضبط ساعات الذروة حسب الفرع', hint: 'لتوزيع العمالة', status: 'مفيد' },
        { label: 'اختبار طابعة احتياطية', hint: 'لكل موقع بيع', status: 'استمرارية' },
      ],
    },
    activity: {
      title: 'سجل الفروع',
      items: [
        { title: 'تحديث ساعات عمل فرع مدينة نصر', meta: 'اليوم', tone: 'info' },
        { title: 'إضافة جهاز POS احتياطي', meta: 'أمس', tone: 'success' },
        { title: 'تنبيه طابعة ضعيفة الاتصال', meta: 'منذ ساعتين', tone: 'warning' },
      ],
    },
  },
  offerSettings: {
    eyebrow: 'التسويق والعروض',
    title: 'إعدادات العروض',
    description: 'إدارة الخصومات، العروض الزمنية، الباقات، وقواعد الولاء ونقاط البيع.',
    actions: ['إنشاء عرض', 'ربط بفئة', 'تفعيل ولاء'],
    metrics: [
      { label: 'عروض نشطة', value: '12', delta: '4 موسمية', tone: 'info' },
      { label: 'نسبة تأثير العروض', value: '18%', delta: 'زيادة في متوسط السلة', tone: 'success' },
      { label: 'عروض منتهية قريباً', value: '3', delta: 'خلال 48 ساعة', tone: 'warning' },
      { label: 'حملات ولاء', value: '2', delta: 'نقاط + كوبونات', tone: 'neutral' },
    ],
    table: {
      title: 'العروض الحالية',
      subtitle: 'العروض المطبقة على الفروع أو القنوات المختلفة.',
      columns: [
        { key: 'offer', label: 'العرض' },
        { key: 'scope', label: 'النطاق' },
        { key: 'period', label: 'الفترة' },
        { key: 'status', label: 'الحالة' },
      ],
      rows: [
        { offer: 'اشتر 2 واحصل على الثالث 50%', scope: 'المشروبات', period: 'حتى 5 أبريل', status: { kind: 'badge', label: 'نشط', tone: 'success' } },
        { offer: 'خصم 10% للطلاب', scope: 'المعادي فقط', period: 'طوال الأسبوع', status: { kind: 'badge', label: 'يحتاج مراجعة', tone: 'warning' } },
        { offer: 'باقة إفطار', scope: 'كل الفروع', period: '08:00 - 11:00', status: { kind: 'badge', label: 'مفعل', tone: 'info' } },
      ],
    },
    checklist: {
      title: 'قواعد التسعير',
      items: [
        { label: 'منع تداخل خصمين لنفس السلة', hint: 'حماية الهامش', status: 'سياسة' },
        { label: 'ربط العرض بمدة زمنية', hint: 'دعم الشفتات', status: 'عملي' },
        { label: 'إظهار العرض في الفاتورة', hint: 'وضوح للعميل', status: 'تجربة' },
      ],
    },
    activity: {
      title: 'آخر العروض',
      items: [
        { title: 'تفعيل باقة إفطار جديدة', meta: '09:00 ص', tone: 'success' },
        { title: 'إيقاف عرض منخفض الربحية', meta: 'أمس', tone: 'danger' },
        { title: 'تعديل مدة خصم الطلاب', meta: 'منذ ساعة', tone: 'info' },
      ],
    },
  },
  customerSettings: {
    eyebrow: 'العملاء والولاء',
    title: 'إعدادات العملاء',
    description: 'ضبط شرائح العملاء، حدود الائتمان، برامج الولاء، وحقول البيانات المطلوبة.',
    actions: ['إضافة شريحة', 'استيراد عملاء', 'تعديل الولاء'],
    metrics: [
      { label: 'عملاء مسجلون', value: '8,420', delta: '+320 هذا الشهر', tone: 'success' },
      { label: 'شرائح عملاء', value: '5', delta: 'جملة وفردي وVIP', tone: 'info' },
      { label: 'حسابات بائتمان', value: '42', delta: 'محددة بالسقف', tone: 'warning' },
      { label: 'نسبة اكتمال البيانات', value: '87%', delta: 'قابلة للتحسين', tone: 'neutral' },
    ],
    table: {
      title: 'سياسات العملاء',
      subtitle: 'إعدادات أساسية تؤثر على البيع والمرتجعات والولاء.',
      columns: [
        { key: 'segment', label: 'الشريحة' },
        { key: 'benefit', label: 'الميزة' },
        { key: 'rule', label: 'القاعدة' },
        { key: 'status', label: 'الحالة' },
      ],
      rows: [
        { segment: 'VIP', benefit: 'خصم 7%', rule: 'بعد 10 طلبات', status: { kind: 'badge', label: 'نشط', tone: 'success' } },
        { segment: 'جملة', benefit: 'سعر خاص', rule: 'حد أدنى 20 وحدة', status: { kind: 'badge', label: 'مفعل', tone: 'info' } },
        { segment: 'عملاء آجل', benefit: 'حد ائتمان', rule: 'حتى EGP 5,000', status: { kind: 'badge', label: 'رقابة', tone: 'warning' } },
      ],
    },
    checklist: {
      title: 'ضبط البيانات',
      items: [
        { label: 'إلزام الهاتف للطلبات الأونلاين', hint: 'تتبع التوصيل', status: 'مهم' },
        { label: 'تحديد حد مرتجعات لكل شريحة', hint: 'للرقابة', status: 'مطلوب' },
        { label: 'جمع تاريخ الميلاد للحملات', hint: 'تسويق مخصص', status: 'اختياري' },
      ],
    },
    activity: {
      title: 'آخر التحديثات',
      items: [
        { title: 'إضافة شريحة شركات', meta: 'أمس', tone: 'info' },
        { title: 'تعديل سقف ائتمان عميل جملة', meta: 'منذ ساعة', tone: 'warning' },
        { title: 'تفعيل نقاط الولاء لفرعين', meta: 'اليوم', tone: 'success' },
      ],
    },
  },
  supplierSettings: {
    eyebrow: 'الموردون',
    title: 'إعدادات الموردين',
    description: 'إدارة ملفات الموردين، شروط الدفع، الاعتماد، ومقاييس الأداء لكل مورد.',
    actions: ['إضافة مورد', 'اعتماد تعاقد', 'تحديث شروط الدفع'],
    metrics: [
      { label: 'موردون معتمدون', value: '34', delta: '6 فئات توريد', tone: 'success' },
      { label: 'شروط دفع مختلفة', value: '7', delta: 'نقدي وآجل', tone: 'neutral' },
      { label: 'موردون قيد التفعيل', value: '3', delta: 'ينتظرون المستندات', tone: 'warning' },
      { label: 'متوسط تقييم المورد', value: '4.4/5', delta: 'حسب الالتزام', tone: 'info' },
    ],
    table: {
      title: 'ملفات الموردين',
      subtitle: 'الحالة العامة للموردين الفعالين داخل النظام.',
      columns: [
        { key: 'supplier', label: 'المورد' },
        { key: 'terms', label: 'شروط الدفع' },
        { key: 'category', label: 'الفئة' },
        { key: 'status', label: 'الحالة' },
      ],
      rows: [
        { supplier: 'شركة النور', terms: '30 يوم', category: 'مواد غذائية', status: { kind: 'badge', label: 'معتمد', tone: 'success' } },
        { supplier: 'أوكسجين التجارية', terms: 'نقدي', category: 'تعبئة', status: { kind: 'badge', label: 'نشط', tone: 'info' } },
        { supplier: 'المؤسسة الذهبية', terms: '15 يوم', category: 'أجهزة', status: { kind: 'badge', label: 'مستندات ناقصة', tone: 'warning' } },
      ],
    },
    checklist: {
      title: 'حوكمة المورد',
      items: [
        { label: 'حفظ السجل التجاري والضريبي', hint: 'إلزامي للتفعيل', status: 'قانوني' },
        { label: 'تقييم الالتزام بالموعد', hint: 'شهرياً', status: 'تشغيلي' },
        { label: 'تحديد مورد بديل للفئات الحرجة', hint: 'ضمان استمرارية', status: 'هام' },
      ],
    },
    activity: {
      title: 'آخر التحديثات',
      items: [
        { title: 'استلام مستندات مورد جديد', meta: '08:25 ص', tone: 'info' },
        { title: 'خفض تقييم مورد متأخر', meta: 'أمس', tone: 'warning' },
        { title: 'اعتماد تعاقد جديد لمواد التعبئة', meta: 'اليوم', tone: 'success' },
      ],
    },
  },
  customerReturns: {
    eyebrow: 'خدمة العملاء',
    title: 'مرتجعات العملاء',
    description: 'إدارة طلبات الاسترجاع، السياسات، وربط المردود بالمخزون والحسابات.',
    actions: ['تسجيل مرتجع', 'استبدال منتج', 'اعتماد استرداد'],
    metrics: [
      { label: 'مرتجعات اليوم', value: '5', delta: '3 استبدال و2 استرداد', tone: 'warning' },
      { label: 'قيمة المرتجعات', value: 'EGP 1,280', delta: '1.8% من المبيعات', tone: 'neutral' },
      { label: 'استرداد فوري', value: '2', delta: 'نقدي ومحفظة', tone: 'info' },
      { label: 'حالات مغلقة', value: '14', delta: 'هذا الأسبوع', tone: 'success' },
    ],
    table: {
      title: 'طلبات المرتجع',
      subtitle: 'أحدث طلبات المرتجعات مع سبب العملية.',
      columns: [
        { key: 'ticket', label: 'المرجع' },
        { key: 'customer', label: 'العميل' },
        { key: 'reason', label: 'السبب' },
        { key: 'status', label: 'الحالة' },
      ],
      rows: [
        { ticket: 'CR-440', customer: 'مي عبد الله', reason: 'طعم غير مطابق', status: { kind: 'badge', label: 'مراجعة', tone: 'warning' } },
        { ticket: 'CR-438', customer: 'محمد رفعت', reason: 'تم الاستبدال', status: { kind: 'badge', label: 'مغلق', tone: 'success' } },
        { ticket: 'CR-437', customer: 'هدى شوقي', reason: 'خطأ في الطلب', status: { kind: 'badge', label: 'تم الاسترداد', tone: 'info' } },
      ],
    },
    checklist: {
      title: 'سياسة الخدمة',
      items: [
        { label: 'ربط المرتجع بالفاتورة الأصلية', hint: 'لمنع التلاعب', status: 'إلزامي' },
        { label: 'تصنيف السبب تحليلياً', hint: 'جودة أو خدمة أو سعر', status: 'تحليلي' },
        { label: 'إعادة الصنف للمخزون عند صلاحيته', hint: 'مع فحص جودة', status: 'تشغيلي' },
      ],
    },
    activity: {
      title: 'أحداث المرتجعات',
      items: [
        { title: 'اعتماد استرداد نقدي لفاتورة POS-8201', meta: '09:08 ص', tone: 'info' },
        { title: 'إغلاق حالة استبدال دونات', meta: '08:50 ص', tone: 'success' },
        { title: 'تنبيه ارتفاع سبب جودة مشروب بارد', meta: 'أمس', tone: 'warning' },
      ],
    },
  },
  purchaseReturns: {
    eyebrow: 'إرجاع للمورد',
    title: 'مرتجعات المشتريات',
    description: 'متابعة الأصناف المرتجعة للموردين بسبب تلف، خطأ توريد، أو اختلاف مواصفات.',
    actions: ['إنشاء مرتجع', 'إشعار المورد', 'خصم من الفاتورة'],
    metrics: [
      { label: 'مرتجعات الموردين', value: '3', delta: 'هذا الأسبوع', tone: 'warning' },
      { label: 'قيمة المرتجع', value: 'EGP 4,960', delta: 'بانتظار التسوية', tone: 'neutral' },
      { label: 'موردون متأثرون', value: '2', delta: 'مواد غذائية وتعبئة', tone: 'info' },
      { label: 'تسويات مكتملة', value: '5', delta: 'آخر 30 يوماً', tone: 'success' },
    ],
    table: {
      title: 'سجل المرتجعات للموردين',
      subtitle: 'الحالات المفتوحة والمغلقة المرتبطة بالمشتريات.',
      columns: [
        { key: 'returnNo', label: 'الرقم' },
        { key: 'supplier', label: 'المورد' },
        { key: 'reason', label: 'السبب' },
        { key: 'status', label: 'الحالة' },
      ],
      rows: [
        { returnNo: 'PRT-3004', supplier: 'شركة النور', reason: 'عبوات تالفة', status: { kind: 'badge', label: 'بانتظار المورد', tone: 'warning' } },
        { returnNo: 'PRT-3001', supplier: 'أوكسجين التجارية', reason: 'اختلاف مقاس', status: { kind: 'badge', label: 'تمت التسوية', tone: 'success' } },
        { returnNo: 'PRT-2998', supplier: 'المتحدة للأغذية', reason: 'تاريخ صلاحية قصير', status: { kind: 'badge', label: 'قيد الشحن', tone: 'info' } },
      ],
    },
    checklist: {
      title: 'خطوات الاعتماد',
      items: [
        { label: 'تصوير الأصناف المتضررة', hint: 'قبل الإرسال', status: 'إثبات' },
        { label: 'ربط المرتجع بالفاتورة الشرائية', hint: 'للتسوية المالية', status: 'إلزامي' },
        { label: 'تحديث المخزون بمجرد الإخراج', hint: 'منع البيع', status: 'فوري' },
      ],
    },
    activity: {
      title: 'آخر العمليات',
      items: [
        { title: 'إنشاء مرتجع جديد لعبوات تالفة', meta: 'اليوم 08:58 ص', tone: 'warning' },
        { title: 'تسوية خصم مع أوكسجين التجارية', meta: 'أمس', tone: 'success' },
        { title: 'إشعار مورد بتاريخ صلاحية قصير', meta: 'منذ يومين', tone: 'info' },
      ],
    },
  },
}
