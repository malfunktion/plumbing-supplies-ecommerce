import axios from 'axios';
import { IProduct } from '../types/product';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

interface ProductResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

interface PaginatedResponse<T> {
  products: T[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

class ProductService {
  private static instance: ProductService;
  private constructor() {}

  public static getInstance(): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService();
    }
    return ProductService.instance;
  }

  async getAllProducts(filters: ProductFilters = {}): Promise<ProductResponse<PaginatedResponse<IProduct>>> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });

      const response = await axios.get<ProductResponse<PaginatedResponse<IProduct>>>(
        `${API_URL}/products?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getProductById(id: string): Promise<ProductResponse<IProduct>> {
    try {
      const response = await axios.get<ProductResponse<IProduct>>(`${API_URL}/products/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createProduct(product: Omit<IProduct, '_id'>): Promise<ProductResponse<IProduct>> {
    try {
      const response = await axios.post<ProductResponse<IProduct>>(`${API_URL}/products`, product);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateProduct(id: string, product: Partial<IProduct>): Promise<ProductResponse<IProduct>> {
    try {
      const response = await axios.put<ProductResponse<IProduct>>(
        `${API_URL}/products/${id}`,
        product
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteProduct(id: string): Promise<ProductResponse<IProduct>> {
    try {
      const response = await axios.delete<ProductResponse<IProduct>>(`${API_URL}/products/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async bulkUpdateProducts(products: Array<Partial<IProduct> & { _id: string }>): Promise<ProductResponse<any>> {
    try {
      const response = await axios.post<ProductResponse<any>>(`${API_URL}/products/bulk`, { products });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message;
      const errorDetails = error.response?.data?.errors;
      
      if (errorDetails) {
        return new Error(`${message}: ${JSON.stringify(errorDetails)}`);
      }
      return new Error(message);
    }
    return error instanceof Error ? error : new Error('An unknown error occurred');
  }
}

export default ProductService.getInstance();