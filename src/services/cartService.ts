import type { CartItem } from '../types';
import { API_CART_URL } from '../constants/apiLinks';

interface CartResponse {
  id: number;
  userId: string;
  items: CartItem[];
}

export async function getCartFromApi(userId: string): Promise<CartItem[]> {
  try {
    const response = await fetch(`${API_CART_URL}/${userId}`);
    if (!response.ok) return [];

    const data: CartResponse = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error al obtener el carrito:', error);
    return [];
  }
}

export async function addItemToCartApi(
  userId: string,
  productId: number,
  quantity: number
): Promise<CartItem[]> {
  const response = await fetch(`${API_CART_URL}/${userId}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, quantity }),
  });

  if (!response.ok) throw new Error('Error al agregar al carrito');

  const data: CartResponse = await response.json();
  return data.items;
}

export async function removeItemFromCartApi(
  userId: string,
  productId: number
): Promise<CartItem[]> {
  const response = await fetch(
    `${API_CART_URL}/${userId}/remove/${productId}`,
    {
      method: 'DELETE',
    }
  );

  if (!response.ok) throw new Error('Error al eliminar del carrito');

  const data: CartResponse = await response.json();
  return data.items;
}

export async function updateCartQuantityApi(
  userId: string,
  productId: number,
  quantity: number
): Promise<CartItem[]> {
  const response = await fetch(
    `${API_CART_URL}/${userId}/update/${productId}?quantity=${quantity}`,
    {
      method: 'PUT',
    }
  );

  if (!response.ok) throw new Error('Error al actualizar cantidad');

  const data: CartResponse = await response.json();
  return data.items;
}

export async function clearCartApi(userId: string): Promise<void> {
  await fetch(`${API_CART_URL}/${userId}/clear`, {
    method: 'DELETE',
  });
}
