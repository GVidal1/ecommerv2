import listOfCategories from '../constants/listOfCategories';
import { API_PRODUCTS } from '../constants/apiLinks';

interface Product {
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

    const filteredCategories = productsList.filter((product: Product) =>
      listOfCategories.includes(product.category)
    );

    return filteredCategories;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
