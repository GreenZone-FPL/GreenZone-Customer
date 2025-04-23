import api from '../../../services/api.ts';
import { EndPoint } from '../../../configs/EndPoint.ts';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Alert } from 'react-native';

export const getDataHome = createAsyncThunk(
  'fetchData/home',
  async (_, thunkAPI) => {
    try {
      const response = await api.get(EndPoint.home);
      if (response.status === 200) {
        return response.data;
      } else {
        return thunkAPI.rejectWithValue(response.status);
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
export const getDataExplore = createAsyncThunk(
  'fetchData/explore',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('getListCategoryDiscover/');
      if (response.status === 200) {
        return response.data;
      } else {
        return thunkAPI.rejectWithValue(response.status);
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
export const getDataStay = createAsyncThunk(
  'fetchData/Stay',
  async (_, thunkAPI) => {
    try {
      const response = await api.get(EndPoint.stay);
      if (response.status === 200) {
        return response.data;
      } else {
        return thunkAPI.rejectWithValue(response.status);
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
export const getDataTours = createAsyncThunk(
  'fetchData/Tours',
  async (_, thunkAPI) => {
    try {
      const response = await api.get(EndPoint.tours);
      if (response.status === 200) {
        return response.data;
      } else {
        return thunkAPI.rejectWithValue(response.status);
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
export const getDataFood = createAsyncThunk(
  'fetchData/food',
  async (numberPage: any, thunkAPI) => {
    try {
      const response = await api.get(EndPoint.food + `?page=${numberPage}`);
      if (response.status === 200) {
        return response.data;
      } else {
        return thunkAPI.rejectWithValue(response.status);
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
export const getDataShopping = createAsyncThunk(
  'fetchData/Shopping',
  async (_, thunkAPI) => {
    try {
      const response = await api.get(EndPoint.shopping);
      if (response.status === 200) {
        return response.data;
      } else {
        return thunkAPI.rejectWithValue(response.status);
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
export const getDataEvents = createAsyncThunk(
  'fetchData/Events',
  async (_, thunkAPI) => {
    try {
      const response = await api.get(EndPoint.event);
      if (response.status === 200) {
        return response.data;
      } else {
        return thunkAPI.rejectWithValue(response.status);
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
export const getDataCoffee = createAsyncThunk(
  'fetchData/Coffee',
  async (_, thunkAPI) => {
    try {
      const response = await api.get(EndPoint.coffee);
      if (response.status === 200) {
        return response.data;
      } else {
        return thunkAPI.rejectWithValue(response.status);
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
export const getDataUtilities = createAsyncThunk(
  'fetchData/utilities',
  async (_, thunkAPI) => {
    try {
      const response = await api.get(EndPoint.utilities);
      if (response.status === 200) {
        return response.data;
      } else {
        return thunkAPI.rejectWithValue(response.status);
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
export const getDataNews = createAsyncThunk(
  'fetchData/news',
  async (_, thunkAPI) => {
    try {
      const response = await api.get(EndPoint.news);
      if (response.status === 200) {
        return response.data;
      } else {
        return thunkAPI.rejectWithValue(response.status);
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
export const getDataDetail = createAsyncThunk(
  'fetchData/detail',
  async (data: any, thunkAPI) => {
    try {
      const response = await api.get(
        EndPoint.detail + `?name=${data.key}&id=${data.id}`
      );
      if (response.status === 200) {
        return response.data;
      } else {
        return thunkAPI.rejectWithValue(response.status);
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
export const getDataSearch = createAsyncThunk(
  'fetchData/search',
  async (_, thunkAPI) => {
    try {
      const response = await api.get(EndPoint.search);
      if (response.status === 200) {
        return response.data;
      } else {
        return thunkAPI.rejectWithValue(response.status);
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
export const fetchRate = createAsyncThunk(
  'fetchData/rate',
  async (data: any, thunkAPI) => {
    try {
      const response = await api.post(EndPoint.rate, data);
      if (response.status === 200) {
        Alert.alert(
          '',
          'Đã lưu đánh giá của bạn! \n' + 'Cảm ơn bạn đã đóng góp ý kiến.'
        );
        return response.data;
      } else {
        return thunkAPI.rejectWithValue(response.status);
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
export const fetchBooking = createAsyncThunk(
  'fetchData/booking',
  async (data: any, thunkAPI) => {
    try {
      const response = await api.post(EndPoint.booking, data);
      if (response.status === 200) {
        return response.data;
      } else {
        return thunkAPI.rejectWithValue(response.status);
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
export const getNotifition = createAsyncThunk(
  'fetchData/notification',
  async (_, thunkAPI) => {
    try {
      const response = await api.get(EndPoint.notification);
      if (response.status === 200) {
        return response.data;
      } else {
        return thunkAPI.rejectWithValue(response.status);
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
export const getDataSpa = createAsyncThunk(
  'fetchData/spa',
  async (_, thunkAPI) => {
    try {
      const response = await api.get(EndPoint.spa);
      if (response.status === 200) {
        return response.data;
      } else {
        return thunkAPI.rejectWithValue(response.status);
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
export const getDataExploreItem = createAsyncThunk(
  'fetchData/getDataExploreItem',
  async (data: any, thunkAPI) => {
    try {
      const response = await api.get(EndPoint.explore + data);
      if (response.status === 200) {
        return response.data;
      } else {
        return thunkAPI.rejectWithValue(response.status);
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
