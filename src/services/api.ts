import { API_PRODUCTS } from '../constants/apiLinks';

export interface Product {
  id: number;
  title: string;
  price: number;
  rating: number;
  thumbnail: string;
  description: string;
  category: string;
  images: string[];
  discountPercentage: number;
  stock: number;
}

// --- OBTENER (GET) ---
export async function getProductsFromApi() {
  try {
    console.log('Obteniendo datos de la API...');
    const response = await fetch(API_PRODUCTS);

    if (!response.ok)
      throw new Error(
        'Error al obtener los datos de la API. Por favor, intente nuevamente.'
      );

    const data = await response.json();

    let productsList: Product[] = [];

    if (Array.isArray(data)) {
      productsList = data;
    } else if (data.products) {
      productsList = data.products;
    }

    return productsList;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

//-POST
export async function createProductApi(
  product: Partial<Product>
): Promise<Product> {
  const response = await fetch(API_PRODUCTS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });

  if (!response.ok) throw new Error('Error al crear el producto');
  return await response.json();
}

// PUT
export async function updateProductApi(
  id: number,
  product: Partial<Product>
): Promise<Product> {
  const response = await fetch(`${API_PRODUCTS}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });

  if (!response.ok) throw new Error('Error al actualizar el producto');
  return await response.json();
}

// DELETE
export async function deleteProductApi(id: number): Promise<void> {
  const response = await fetch(`${API_PRODUCTS}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) throw new Error('Error al eliminar el producto');
}
