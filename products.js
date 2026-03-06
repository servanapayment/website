import { useRouter } from 'next/router';

export async function getServerSideProps(context) {
  const { page = 1, provider = '', search = '' } = context.query;

  const res = await fetch(`http://localhost:8080/price-list?page=${page}&limit=20&provider=${provider}&search=${search}`);
  const data = await res.json();

  const resProviders = await fetch(`http://localhost:8080/providers`);
  const providerData = await resProviders.json();

  return { 
    props: { 
      products: data.data, 
      total: data.total, 
      page: Number(page), 
      provider, 
      search,
      providers: providerData.providers || []
    } 
  };
}

export default function Products({ products, total, page, provider, search, providers }) {
  const router = useRouter();

  const handleFilter = (e) => {
    router.push(`/products?provider=${e.target.value}&search=${search}&page=1`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const value = e.target.search.value;
    router.push(`/products?provider=${provider}&search=${value}&page=1`);
  };

  const nextPage = () => {
    router.push(`/products?provider=${provider}&search=${search}&page=${page + 1}`);
  };

  const prevPage = () => {
    router.push(`/products?provider=${provider}&search=${search}&page=${page - 1}`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Daftar Produk</h1>

      {/* Filter & Search */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <select value={provider} onChange={handleFilter}>
          <option value="">Semua Provider</option>
          {providers.map((prov) => (
            <option key={prov.kode} value={prov.kode}>
              {prov.nama}
            </option>
          ))}
        </select>

        <form onSubmit={handleSearch}>
          <input type="text" name="search" defaultValue={search} placeholder="Cari kode produk..." />
          <button type="submit">Cari</button>
        </form>
      </div>

      {/* Tabel Produk */}
      <table border="1" cellPadding="8" cellSpacing="0" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead style={{ backgroundColor: "#f2f2f2" }}>
          <tr>
            <th>Kode</th>
            <th>Nama Produk</th>
            <th>Provider</th>
            <th>Harga Jual</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.kode}>
              <td>{p.kode}</td>
              <td>{p.nama}</td>
              <td>{p.provider}</td>
              <td>Rp {p.harga_jual.toLocaleString("id-ID")}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
        <button disabled={page <= 1} onClick={prevPage}>Previous</button>
        <span>Halaman {page} dari {Math.ceil(total / 20)}</span>
        <button disabled={page * 20 >= total} onClick={nextPage}>Next</button>
      </div>
    </div>
  );
}
