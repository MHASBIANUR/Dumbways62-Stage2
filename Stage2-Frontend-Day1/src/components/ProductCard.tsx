type ProductCardProps = {
    name: string;
    price: number;
    image: string;
    quantity: number;
    isInCart: boolean;
    onAddToCart: () => void;
    onRemoveFromCart: () => void;
};

function ProductCard({
    name,
    price,
    image,
    quantity,
    isInCart,
    onAddToCart,
    onRemoveFromCart,}: ProductCardProps) {
    return (
        <div className="product-card">
            <img src={image} alt={name} className="product-image" />
            <div className="product-info">
                <h3 className="product-name">{name}</h3>
                <p className="product-price">Rp {price.toLocaleString()}</p>

                <div className="cart-buttons">
                    <button onClick={onAddToCart}>
                        {isInCart ? `Tambah Lagi (${quantity})` : 'Tambah Cart'}
                    </button>

                    {isInCart && (
                        <button onClick={onRemoveFromCart}>
                            Hapus Cart ({quantity})
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProductCard;
