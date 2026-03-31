import { useEffect, useState } from 'react'
import { MetricGrid, PageHeader, Panel } from '../components/PageBlocks.jsx'
import { fetchJson } from '../lib/api.js'

const initialCategoryForm = {
  code: '',
  name: '',
  description: '',
}

const initialProductForm = {
  sku: '',
  name: '',
  barcode: '',
  salePrice: '',
  costPrice: '',
  stockOnHand: '',
  reorderLevel: '',
  unitName: 'قطعة',
  branchId: '',
  categoryId: '',
}

export function ProductSettingsPage() {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [branches, setBranches] = useState([])
  const [categoryForm, setCategoryForm] = useState(initialCategoryForm)
  const [productForm, setProductForm] = useState(initialProductForm)
  const [notice, setNotice] = useState(null)
  const [savingCategory, setSavingCategory] = useState(false)
  const [savingProduct, setSavingProduct] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadData() {
      try {
        const [categoriesData, productsData, branchesData] = await Promise.all([
          fetchJson('/api/product-categories'),
          fetchJson('/api/products'),
          fetchJson('/api/branches'),
        ])

        if (!cancelled) {
          setCategories(categoriesData)
          setProducts(productsData)
          setBranches(branchesData)
          setProductForm((current) => ({
            ...current,
            branchId: current.branchId || branchesData[0]?.id || '',
            categoryId: current.categoryId || categoriesData[0]?.id || '',
          }))
        }
      } catch (error) {
        if (!cancelled) {
          setNotice({
            tone: 'error',
            title: 'تعذر تحميل المنتجات',
            message: error instanceof Error ? error.message : 'حدث خطأ غير متوقع.',
          })
        }
      }
    }

    void loadData()

    return () => {
      cancelled = true
    }
  }, [])

  function handleCategoryChange(field) {
    return (event) => {
      setCategoryForm((current) => ({
        ...current,
        [field]: event.target.value,
      }))
    }
  }

  function handleProductChange(field) {
    return (event) => {
      setProductForm((current) => ({
        ...current,
        [field]: event.target.value,
      }))
    }
  }

  async function submitCategory(event) {
    event.preventDefault()
    setSavingCategory(true)
    setNotice(null)

    try {
      const created = await fetchJson('/api/product-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryForm),
      })

      setCategories((current) => [...current, created])
      setCategoryForm(initialCategoryForm)
      setProductForm((current) => ({
        ...current,
        categoryId: current.categoryId || created.id,
      }))
      setNotice({
        tone: 'success',
        title: 'تم حفظ التصنيف',
        message: `تم إنشاء تصنيف ${created.name}.`,
      })
    } catch (error) {
      setNotice({
        tone: 'error',
        title: 'تعذر حفظ التصنيف',
        message: error instanceof Error ? error.message : 'حدث خطأ غير متوقع.',
      })
    } finally {
      setSavingCategory(false)
    }
  }

  async function submitProduct(event) {
    event.preventDefault()
    setSavingProduct(true)
    setNotice(null)

    try {
      const created = await fetchJson('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productForm),
      })

      setProducts((current) => [created, ...current])
      setProductForm((current) => ({
        ...initialProductForm,
        branchId: current.branchId,
        categoryId: current.categoryId,
      }))
      setNotice({
        tone: 'success',
        title: 'تم حفظ الصنف',
        message: `تم إضافة الصنف ${created.name}.`,
      })
    } catch (error) {
      setNotice({
        tone: 'error',
        title: 'تعذر حفظ الصنف',
        message: error instanceof Error ? error.message : 'حدث خطأ غير متوقع.',
      })
    } finally {
      setSavingProduct(false)
    }
  }

  const metrics = [
    {
      label: 'الأصناف',
      value: String(products.length),
      delta: 'أصناف محفوظة في SQL Server',
      tone: products.length > 0 ? 'success' : 'warning',
    },
    {
      label: 'التصنيفات',
      value: String(categories.length),
      delta: 'تصنيفات متاحة للبيع',
      tone: 'info',
    },
    {
      label: 'إجمالي المخزون',
      value: String(products.reduce((sum, item) => sum + Number(item.stockOnHand || 0), 0)),
      delta: 'مجموع الكميات الحالية',
      tone: 'neutral',
    },
    {
      label: 'أصناف منخفضة',
      value: String(
        products.filter((item) => Number(item.stockOnHand || 0) <= Number(item.reorderLevel || 0)).length,
      ),
      delta: 'تحتاج إعادة طلب',
      tone: 'warning',
    },
  ]

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="الكاتالوج"
        title="إعدادات المنتجات"
        description="إدارة التصنيفات والأصناف الفعلية التي ستظهر داخل شاشة البيع."
        actions={['تصنيف جديد', 'صنف جديد']}
      />

      <MetricGrid items={metrics} />

      {notice ? (
        <div className={`notice-card ${notice.tone === 'error' ? 'notice-card-error' : 'notice-card-success'}`}>
          <strong>{notice.title}</strong>
          <p>{notice.message}</p>
        </div>
      ) : null}

      <div className="content-grid two-columns">
        <Panel title="التصنيفات والأصناف" subtitle="آخر البيانات المحفوظة داخل النظام.">
          <div className="entity-list">
            {products.map((product) => (
              <article key={product.id} className="entity-card">
                <div className="entity-topline">
                  <strong>{product.name}</strong>
                  <span className="badge badge-info">{product.sku}</span>
                </div>
                <p>
                  {product.category?.name || 'بدون تصنيف'} - {product.branch?.name || 'بدون فرع'}
                </p>
                <div className="entity-meta">
                  <span>بيع: {Number(product.salePrice)} EGP</span>
                  <span>تكلفة: {Number(product.costPrice)} EGP</span>
                </div>
                <div className="entity-meta">
                  <span>مخزون: {Number(product.stockOnHand)}</span>
                  <span>إعادة طلب: {Number(product.reorderLevel)}</span>
                </div>
              </article>
            ))}
          </div>
        </Panel>

        <div className="content-column">
          <Panel title="إضافة تصنيف" subtitle="تصنيف جديد للأصناف.">
            <form className="form-stack" onSubmit={submitCategory}>
              <div className="form-grid">
                <label className="field-row">
                  <span>الكود</span>
                  <input className="field-input" value={categoryForm.code} onChange={handleCategoryChange('code')} placeholder="BEV" />
                </label>
                <label className="field-row">
                  <span>الاسم</span>
                  <input className="field-input" value={categoryForm.name} onChange={handleCategoryChange('name')} placeholder="مشروبات" />
                </label>
              </div>
              <label className="field-row">
                <span>الوصف</span>
                <input className="field-input" value={categoryForm.description} onChange={handleCategoryChange('description')} placeholder="تصنيف المشروبات الساخنة والباردة" />
              </label>
              <button className="primary-button primary-button-wide" disabled={savingCategory} type="submit">
                {savingCategory ? 'جارٍ الحفظ...' : 'حفظ التصنيف'}
              </button>
            </form>
          </Panel>

          <Panel title="إضافة صنف" subtitle="صنف يظهر مباشرة في شاشة البيع.">
            <form className="form-stack" onSubmit={submitProduct}>
              <div className="form-grid">
                <label className="field-row">
                  <span>SKU</span>
                  <input className="field-input" value={productForm.sku} onChange={handleProductChange('sku')} placeholder="BEV-010" />
                </label>
                <label className="field-row">
                  <span>اسم الصنف</span>
                  <input className="field-input" value={productForm.name} onChange={handleProductChange('name')} placeholder="لاتيه" />
                </label>
              </div>
              <div className="form-grid">
                <label className="field-row">
                  <span>سعر البيع</span>
                  <input className="field-input" value={productForm.salePrice} onChange={handleProductChange('salePrice')} placeholder="45" />
                </label>
                <label className="field-row">
                  <span>التكلفة</span>
                  <input className="field-input" value={productForm.costPrice} onChange={handleProductChange('costPrice')} placeholder="23" />
                </label>
              </div>
              <div className="form-grid">
                <label className="field-row">
                  <span>المخزون</span>
                  <input className="field-input" value={productForm.stockOnHand} onChange={handleProductChange('stockOnHand')} placeholder="30" />
                </label>
                <label className="field-row">
                  <span>حد إعادة الطلب</span>
                  <input className="field-input" value={productForm.reorderLevel} onChange={handleProductChange('reorderLevel')} placeholder="8" />
                </label>
              </div>
              <div className="form-grid">
                <label className="field-row">
                  <span>الفرع</span>
                  <select className="field-input" value={productForm.branchId} onChange={handleProductChange('branchId')}>
                    <option value="">اختر فرعاً</option>
                    {branches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field-row">
                  <span>التصنيف</span>
                  <select className="field-input" value={productForm.categoryId} onChange={handleProductChange('categoryId')}>
                    <option value="">اختر تصنيفاً</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="form-grid">
                <label className="field-row">
                  <span>الباركود</span>
                  <input className="field-input" value={productForm.barcode} onChange={handleProductChange('barcode')} placeholder="622..." />
                </label>
                <label className="field-row">
                  <span>الوحدة</span>
                  <input className="field-input" value={productForm.unitName} onChange={handleProductChange('unitName')} placeholder="قطعة" />
                </label>
              </div>
              <button className="primary-button primary-button-wide" disabled={savingProduct} type="submit">
                {savingProduct ? 'جارٍ الحفظ...' : 'حفظ الصنف'}
              </button>
            </form>
          </Panel>
        </div>
      </div>
    </div>
  )
}
