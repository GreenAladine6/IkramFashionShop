import { useState } from "react";
import { Link } from "react-router";
import type { Product, ProductVariant } from "../../../types/domain";
import { useCart } from "../../../app/providers";
import { Button } from "../../../components/ui/Button";
import { Dialog } from "../../../components/ui/Dialog";
import { Icon } from "../../../components/ui/Icon";

export function SizePicker({ product, selected, onSelect }: { product: Product; selected?: ProductVariant; onSelect: (v: ProductVariant) => void }) {
  return <div className="size-picker">{product.variants.map((variant) => <button type="button" key={variant.id} disabled={!variant.active || variant.stock === 0} className={selected?.id === variant.id ? "selected" : ""} onClick={() => onSelect(variant)}>{variant.size}</button>)}</div>;
}

export function ProductCard({ product }: { product: Product }) {
  const [quick, setQuick] = useState(false);
  const [selected, setSelected] = useState<ProductVariant>();
  const [error, setError] = useState("");
  const { add } = useCart();
  const submit = () => {
    if (!selected) return setError("Choose an available size before adding this piece.");
    add(product, selected); setQuick(false); setError("");
  };
  return <article className="product-card"><div className="product-card__image"><Link to={`/products/${product.slug}`}><img src={product.image} alt={product.name} /></Link><span className="tag">{product.category.name}</span><Button className="quick-add" onClick={() => setQuick(true)}>Quick add <Icon name="plus" /></Button></div><div className="product-card__details"><div><h3><Link to={`/products/${product.slug}`}>{product.name}</Link></h3><p>{product.category.name} · {product.variants.length} sizes</p></div><div className="price">${product.price}</div></div>
    <Dialog open={quick} title="Choose your size" onClose={() => setQuick(false)} actions={<Button onClick={submit}>Add selected size</Button>}><div className="quick-product"><img src={product.image} alt="" /><div><b>{product.name}</b><span>${product.price}</span></div></div><SizePicker product={product} selected={selected} onSelect={(v) => { setSelected(v); setError(""); }} />{selected && <p className="stock-message">{selected.stock <= 4 ? `Only ${selected.stock} left in size ${selected.size}` : `Size ${selected.size} is in stock`}</p>}{error && <p className="form-error">{error}</p>}</Dialog>
  </article>;
}
