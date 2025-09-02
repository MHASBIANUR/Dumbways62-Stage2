type Props = {
  value: string;
  onChange: (val: string) => void;
};

function SearchProduct({ value, onChange }: Props) {
  return (
    <input
      type="text"
      placeholder="Cari produk..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="search-input"
    />
  );
}

export default SearchProduct;
