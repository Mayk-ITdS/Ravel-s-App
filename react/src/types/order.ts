export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  user_id: number;
  total_price: number;
  status: "pending" | "completed" | "canceled";
  items: OrderItem[];
}

export interface DashboardProps {
  orders: Order[];
}
