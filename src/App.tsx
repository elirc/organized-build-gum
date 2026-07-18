import {
  ArrowUpRight,
  BadgeCheck,
  Banknote,
  BarChart3,
  Boxes,
  Check,
  ClipboardList,
  CreditCard,
  Download,
  Eye,
  FileCheck,
  Filter,
  Gauge,
  Globe2,
  Layers3,
  Lock,
  PackagePlus,
  ReceiptText,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
  TicketPercent,
  Trash2,
  TrendingUp,
  Users,
  WalletCards,
} from 'lucide-react'
import { useEffect, useState, type CSSProperties } from 'react'
import { activity, creator, discounts, metrics, orders, products, revenueSeries } from './data'
import type { Product, ViewKey } from './types'

const navItems: Array<{ key: ViewKey; label: string; icon: typeof Store }> = [
  { key: 'discover', label: 'Storefront', icon: Store },
  { key: 'dashboard', label: 'Dashboard', icon: Gauge },
  { key: 'products', label: 'Products', icon: Boxes },
  { key: 'orders', label: 'Orders', icon: ReceiptText },
  { key: 'analytics', label: 'Analytics', icon: BarChart3 },
  { key: 'admin', label: 'Admin', icon: ShieldCheck },
]

const formatMoney = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)

const formatCount = (value: number) => new Intl.NumberFormat('en-US').format(value)

function App() {
  const [view, setView] = useState<ViewKey>('discover')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(products[0].id)
  const [cartIds, setCartIds] = useState<string[]>(() => {
    const stored = window.localStorage.getItem('buildgum-cart')
    return stored ? (JSON.parse(stored) as string[]) : [products[0].id]
  })
  const [promo, setPromo] = useState('BUILD20')
  const [checkoutComplete, setCheckoutComplete] = useState(false)

  useEffect(() => {
    window.localStorage.setItem('buildgum-cart', JSON.stringify(cartIds))
  }, [cartIds])

  const selectedProduct = products.find((product) => product.id === selectedId) ?? products[0]
  const filteredProducts = products.filter((product) => {
    const haystack = [product.title, product.creator, product.category, product.kind, ...product.tags].join(' ').toLowerCase()
    return haystack.includes(query.toLowerCase())
  })
  const cartProducts = cartIds
    .map((id) => products.find((product) => product.id === id))
    .filter((product): product is Product => Boolean(product))

  const addToCart = (product: Product) => {
    setCartIds((current) => (current.includes(product.id) ? current : [...current, product.id]))
    setSelectedId(product.id)
    setCheckoutComplete(false)
  }

  const removeFromCart = (productId: string) => {
    setCartIds((current) => current.filter((id) => id !== productId))
  }

  return (
    <div className="app-shell">
      <aside className="side-nav" aria-label="Primary">
        <div className="brand-mark">
          <span className="brand-icon">bg</span>
          <div>
            <strong>Buildgum</strong>
            <span>Creator commerce</span>
          </div>
        </div>
        <nav>
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                className={view === item.key ? 'nav-item active' : 'nav-item'}
                key={item.key}
                onClick={() => setView(item.key)}
                type="button"
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
        <div className="creator-chip">
          <BadgeCheck size={18} />
          <div>
            <strong>{creator.name}</strong>
            <span>{formatCount(creator.followers)} followers</span>
          </div>
        </div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <label className="search-box">
            <Search size={18} />
            <input
              aria-label="Search products"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products, creators, tags"
              value={query}
            />
          </label>
          <div className="topbar-actions">
            <button className="icon-button" title="Open filters" type="button">
              <Filter size={18} />
            </button>
            <button className="cart-button" onClick={() => setView('checkout')} type="button">
              <ShoppingBag size={18} />
              <span>{cartProducts.length}</span>
            </button>
          </div>
        </header>

        <main>
          {view === 'discover' && (
            <Discover
              cartProducts={cartProducts}
              filteredProducts={filteredProducts}
              onAddToCart={addToCart}
              onCheckout={() => setView('checkout')}
              onSelect={setSelectedId}
              selectedProduct={selectedProduct}
            />
          )}
          {view === 'checkout' && (
            <Checkout
              cartProducts={cartProducts}
              checkoutComplete={checkoutComplete}
              onComplete={() => setCheckoutComplete(true)}
              onRemove={removeFromCart}
              promo={promo}
              setPromo={setPromo}
            />
          )}
          {view === 'dashboard' && <Dashboard />}
          {view === 'products' && <Products />}
          {view === 'orders' && <Orders />}
          {view === 'analytics' && <Analytics />}
          {view === 'admin' && <Admin />}
        </main>
      </div>
    </div>
  )
}

function Discover({
  cartProducts,
  filteredProducts,
  onAddToCart,
  onCheckout,
  onSelect,
  selectedProduct,
}: {
  cartProducts: Product[]
  filteredProducts: Product[]
  onAddToCart: (product: Product) => void
  onCheckout: () => void
  onSelect: (id: string) => void
  selectedProduct: Product
}) {
  return (
    <section className="view-grid">
      <div className="market-column">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Featured marketplace</p>
            <h1>Digital products that ship like software.</h1>
          </div>
          <button className="primary-action" type="button">
            <PackagePlus size={18} />
            New product
          </button>
        </div>

        <div className="showcase-strip">
          <img alt="Creator commerce storefront dashboard with digital product cards" src="/storefront-preview.png" />
          <div className="showcase-stats">
            <span>GMV today</span>
            <strong>$28.4k</strong>
            <span>Checkout health</span>
            <strong>99.98%</strong>
          </div>
        </div>

        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              onAdd={() => onAddToCart(product)}
              onPreview={() => onSelect(product.id)}
              product={product}
              selected={selectedProduct.id === product.id}
            />
          ))}
        </div>
      </div>

      <aside className="detail-panel">
        <ProductPreview product={selectedProduct} />
        <div className="checkout-summary compact">
          <div className="summary-row">
            <span>Cart</span>
            <strong>{cartProducts.length} item(s)</strong>
          </div>
          <div className="summary-row">
            <span>Subtotal</span>
            <strong>{formatMoney(cartProducts.reduce((sum, product) => sum + product.price, 0))}</strong>
          </div>
          <button className="primary-action full" onClick={onCheckout} type="button">
            <CreditCard size={18} />
            Checkout
          </button>
        </div>
      </aside>
    </section>
  )
}

function ProductCard({
  onAdd,
  onPreview,
  product,
  selected,
}: {
  onAdd: () => void
  onPreview: () => void
  product: Product
  selected: boolean
}) {
  return (
    <article className={selected ? 'product-card selected' : 'product-card'}>
      <button className="product-cover" onClick={onPreview} style={{ '--accent': product.accent } as CSSProperties} type="button">
        <span>{product.kind}</span>
        <strong>{product.title.split(' ').slice(0, 2).join(' ')}</strong>
      </button>
      <div className="product-body">
        <div>
          <p className="muted">{product.creator}</p>
          <h2>{product.title}</h2>
        </div>
        <p>{product.description}</p>
        <div className="tag-row">
          {product.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
      <div className="product-footer">
        <div>
          <strong>{product.subscription ?? formatMoney(product.price)}</strong>
          {product.compareAt && <span>{formatMoney(product.compareAt)}</span>}
        </div>
        <button className="secondary-action" onClick={onAdd} type="button">
          <ShoppingBag size={17} />
          Add
        </button>
      </div>
    </article>
  )
}

function ProductPreview({ product }: { product: Product }) {
  return (
    <article className="preview-panel">
      <div className="large-cover" style={{ '--accent': product.accent } as CSSProperties}>
        <span>{product.category}</span>
        <strong>{product.title}</strong>
      </div>
      <div className="preview-copy">
        <p className="eyebrow">{product.creator} {product.handle}</p>
        <h2>{product.title}</h2>
        <p>{product.description}</p>
      </div>
      <dl className="fact-list">
        <div>
          <dt>Rating</dt>
          <dd>{product.rating}/5</dd>
        </div>
        <div>
          <dt>Sales</dt>
          <dd>{formatCount(product.sales)}</dd>
        </div>
        <div>
          <dt>Refunds</dt>
          <dd>{product.refundRate}%</dd>
        </div>
        <div>
          <dt>Conversion</dt>
          <dd>{product.conversion}%</dd>
        </div>
      </dl>
      <div className="delivery-box">
        <Download size={18} />
        <div>
          <strong>{product.delivery}</strong>
          <span>{product.license}</span>
        </div>
      </div>
    </article>
  )
}

function Checkout({
  cartProducts,
  checkoutComplete,
  onComplete,
  onRemove,
  promo,
  setPromo,
}: {
  cartProducts: Product[]
  checkoutComplete: boolean
  onComplete: () => void
  onRemove: (id: string) => void
  promo: string
  setPromo: (value: string) => void
}) {
  const appliedDiscount = discounts.find((discount) => discount.code === promo.trim().toUpperCase())
  const subtotal = cartProducts.reduce((sum, product) => sum + product.price, 0)
  const discount = appliedDiscount ? subtotal * (appliedDiscount.value / 100) : 0
  const tax = (subtotal - discount) * 0.0825
  const total = subtotal - discount + tax

  return (
    <section className="checkout-layout">
      <div className="checkout-main">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Secure checkout</p>
            <h1>Fast purchase, instant fulfillment.</h1>
          </div>
          <span className="secure-badge">
            <Lock size={16} />
            TLS enforced
          </span>
        </div>

        <div className="form-grid">
          <label>
            Email
            <input defaultValue="buyer@company.com" type="email" />
          </label>
          <label>
            Company
            <input defaultValue="Acme Studio" type="text" />
          </label>
          <label>
            Card
            <input defaultValue="4242 4242 4242 4242" inputMode="numeric" type="text" />
          </label>
          <label>
            Country
            <select defaultValue="US">
              <option value="US">United States</option>
              <option value="GB">United Kingdom</option>
              <option value="CA">Canada</option>
              <option value="DE">Germany</option>
            </select>
          </label>
        </div>

        <div className="line-list">
          {cartProducts.map((product) => (
            <article className="line-item" key={product.id}>
              <div className="mini-cover" style={{ '--accent': product.accent } as CSSProperties}>
                {product.kind.slice(0, 2)}
              </div>
              <div>
                <strong>{product.title}</strong>
                <span>{product.delivery}</span>
              </div>
              <strong>{formatMoney(product.price)}</strong>
              <button className="icon-button" onClick={() => onRemove(product.id)} title={`Remove ${product.title}`} type="button">
                <Trash2 size={17} />
              </button>
            </article>
          ))}
        </div>

        {checkoutComplete && (
          <div className="success-box">
            <Check size={20} />
            <div>
              <strong>Order BG-98241 confirmed</strong>
              <span>Licenses, receipts, and delivery links were issued.</span>
            </div>
          </div>
        )}
      </div>

      <aside className="checkout-summary">
        <h2>Order summary</h2>
        <label className="promo-field">
          Discount
          <span>
            <input onChange={(event) => setPromo(event.target.value)} value={promo} />
            <TicketPercent size={18} />
          </span>
        </label>
        <div className="summary-row">
          <span>Subtotal</span>
          <strong>{formatMoney(subtotal)}</strong>
        </div>
        <div className="summary-row">
          <span>{appliedDiscount ? appliedDiscount.code : 'Discount'}</span>
          <strong>-{formatMoney(discount)}</strong>
        </div>
        <div className="summary-row">
          <span>Estimated tax</span>
          <strong>{formatMoney(tax)}</strong>
        </div>
        <div className="summary-total">
          <span>Total</span>
          <strong>{formatMoney(total)}</strong>
        </div>
        <button className="primary-action full" disabled={!cartProducts.length} onClick={onComplete} type="button">
          <WalletCards size={18} />
          Pay now
        </button>
        <div className="trust-row">
          <ShieldCheck size={17} />
          <span>Fraud scoring, tax evidence, and license provisioning are enabled.</span>
        </div>
      </aside>
    </section>
  )
}

function Dashboard() {
  return (
    <section className="stacked-view">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Creator command center</p>
          <h1>Revenue, fulfillment, and risk in one place.</h1>
        </div>
        <button className="primary-action" type="button">
          <ArrowUpRight size={18} />
          Export report
        </button>
      </div>
      <MetricGrid />
      <div className="two-column">
        <RevenuePanel />
        <OperationsPanel />
      </div>
      <ActivityPanel />
    </section>
  )
}

function MetricGrid() {
  return (
    <div className="metric-grid">
      {metrics.map((metric) => (
        <article className="metric-tile" key={metric.label}>
          <span>{metric.label}</span>
          <strong>{metric.value}</strong>
          <em className={metric.tone}>{metric.delta}</em>
        </article>
      ))}
    </div>
  )
}

function RevenuePanel() {
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Monthly revenue</p>
          <h2>Gross volume</h2>
        </div>
        <TrendingUp size={20} />
      </div>
      <div className="bar-chart" aria-label="Monthly revenue chart">
        {revenueSeries.map((value, index) => (
          <span key={`${value}-${index}`} style={{ height: `${value}px` }} />
        ))}
      </div>
      <div className="summary-row">
        <span>Creator earnings</span>
        <strong>$386.1k</strong>
      </div>
      <div className="summary-row">
        <span>Platform fees</span>
        <strong>$42.6k</strong>
      </div>
    </section>
  )
}

function OperationsPanel() {
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Operations</p>
          <h2>Queues</h2>
        </div>
        <ClipboardList size={20} />
      </div>
      <div className="queue-list">
        <StatusRow icon={FileCheck} label="Content reviews" value="4 pending" />
        <StatusRow icon={Banknote} label="Payout batches" value="$62.4k ready" />
        <StatusRow icon={Globe2} label="Tax evidence" value="98.7% covered" />
        <StatusRow icon={Users} label="Affiliate approvals" value="21 new" />
      </div>
    </section>
  )
}

function StatusRow({ icon: Icon, label, value }: { icon: typeof FileCheck; label: string; value: string }) {
  return (
    <div className="status-row">
      <Icon size={18} />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function ActivityPanel() {
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Audit log</p>
          <h2>Recent activity</h2>
        </div>
        <Eye size={20} />
      </div>
      <div className="activity-list">
        {activity.map((item) => (
          <article className={`activity-item ${item.severity.toLowerCase()}`} key={item.id}>
            <span>{item.severity}</span>
            <div>
              <strong>{item.actor}</strong>
              <p>{item.event}</p>
            </div>
            <time>{item.time}</time>
          </article>
        ))}
      </div>
    </section>
  )
}

function Products() {
  return (
    <section className="stacked-view">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Catalog</p>
          <h1>Products, prices, releases, and licensing.</h1>
        </div>
        <button className="primary-action" type="button">
          <PackagePlus size={18} />
          Create
        </button>
      </div>
      <div className="table-shell">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Status</th>
              <th>Price</th>
              <th>Sales</th>
              <th>Refunds</th>
              <th>Risk</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <strong>{product.title}</strong>
                  <span>{product.kind} · {product.updated}</span>
                </td>
                <td>
                  <span className={`pill ${product.status.toLowerCase()}`}>{product.status}</span>
                </td>
                <td>{product.subscription ?? formatMoney(product.price)}</td>
                <td>{formatCount(product.sales)}</td>
                <td>{product.refundRate}%</td>
                <td>
                  <span className={`risk ${product.risk.toLowerCase()}`}>{product.risk}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function Orders() {
  return (
    <section className="stacked-view">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Orders</p>
          <h1>Payments, disputes, licenses, and fulfillment.</h1>
        </div>
        <button className="secondary-action" type="button">
          <Download size={18} />
          CSV
        </button>
      </div>
      <div className="table-shell">
        <table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Risk</th>
              <th>Channel</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const product = products.find((item) => item.id === order.productId)
              return (
                <tr key={order.id}>
                  <td>
                    <strong>{order.id}</strong>
                    <span>{order.date}</span>
                  </td>
                  <td>{order.customer}</td>
                  <td>{product?.title ?? 'Unknown product'}</td>
                  <td>{formatMoney(order.amount)}</td>
                  <td>
                    <span className="pill">{order.status}</span>
                  </td>
                  <td>
                    <span className={`risk ${order.risk.toLowerCase()}`}>{order.risk}</span>
                  </td>
                  <td>{order.channel}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function Analytics() {
  const channels = [
    ['Direct', 38],
    ['Email', 24],
    ['Affiliate', 18],
    ['Search', 14],
    ['Social', 6],
  ]

  return (
    <section className="stacked-view">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Analytics</p>
          <h1>Funnels, cohorts, and creator economics.</h1>
        </div>
        <button className="primary-action" type="button">
          <Sparkles size={18} />
          Forecast
        </button>
      </div>
      <MetricGrid />
      <div className="two-column">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Funnel</p>
              <h2>Visit to paid</h2>
            </div>
            <Layers3 size={20} />
          </div>
          {[
            ['Product views', 100],
            ['Checkout starts', 31],
            ['Payments', 18],
            ['Upsells', 7],
          ].map(([label, value]) => (
            <div className="funnel-row" key={label}>
              <span>{label}</span>
              <div>
                <i style={{ width: `${value}%` }} />
              </div>
              <strong>{value}%</strong>
            </div>
          ))}
        </section>
        <section className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Channels</p>
              <h2>Revenue mix</h2>
            </div>
            <Globe2 size={20} />
          </div>
          {channels.map(([label, value]) => (
            <div className="channel-row" key={label}>
              <span>{label}</span>
              <strong>{value}%</strong>
            </div>
          ))}
        </section>
      </div>
    </section>
  )
}

function Admin() {
  const controls = [
    ['KYC coverage', '99.2%', 'Ready'],
    ['Chargeback SLA', '14h', 'Watch'],
    ['Payout reserve', '$118.4k', 'Ready'],
    ['Blocked domains', '42', 'Review'],
    ['EU VAT evidence', '98.7%', 'Ready'],
    ['Creator policy queue', '7', 'Watch'],
  ]

  return (
    <section className="stacked-view">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Enterprise controls</p>
          <h1>Compliance, fraud, payouts, and policy.</h1>
        </div>
        <button className="primary-action" type="button">
          <ShieldCheck size={18} />
          Run review
        </button>
      </div>
      <div className="control-grid">
        {controls.map(([label, value, state]) => (
          <article className="control-tile" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
            <em className={state === 'Ready' ? 'good' : 'warn'}>{state}</em>
          </article>
        ))}
      </div>
      <ActivityPanel />
    </section>
  )
}

export default App
