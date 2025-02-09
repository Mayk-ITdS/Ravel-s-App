export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category?: string;
  image: string | null | File | any; // 🛠️ Zmieniamy BLOB na Base64 string | null
  onSave: () => void;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  date?: string;
  location?: string;
  image?: string | null | File | any; // 🛠️ Zmieniamy BLOB na Base64 string | null
  onSave: () => void;
}
