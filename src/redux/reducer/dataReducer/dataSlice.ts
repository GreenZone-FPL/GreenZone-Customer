import { createSlice } from '@reduxjs/toolkit';
import {
  fetchBooking,
  fetchRate,
  getDataCoffee,
  getDataDetail,
  getDataEvents,
  getDataExplore,
  getDataExploreItem,
  getDataFood,
  getDataHome,
  getDataNews,
  getDataSearch,
  getDataShopping,
  getDataSpa,
  getDataStay,
  getDataTours,
  getDataUtilities,
  getNotifition,
} from './fetchData';

const initialState = {
  error: '',

  loading: false,
  loadingHome: false,
  dataHome: null,
  dataExplore: null,
  dataStay: null,
  dataTours: null,
  dataFood: null,
  dataShopping: null,
  dataEvents: null,
  dataCoffee: null,
  modalVisible: false,
  dataUtilities: null,
  dataNews: null,
  dataDetail: null,
  loadingDetail: false,
  dataSearch: null,
  dataNotifition: null,
  spa: null,
};

const DataSlice = createSlice({
  name: 'fetchData',
  initialState,
  reducers: {
    resetNutrition: () => initialState,
    toggeDrawer: (state) => {
      state.modalVisible = !state.modalVisible;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDataHome.pending, (state) => {
        state.loadingHome = true;
        state.error = '';
      })
      .addCase(getDataHome.rejected, (state, action) => {
        state.loadingHome = false;
        state.error = action.payload as string;
      })
      .addCase(getDataHome.fulfilled, (state, action) => {
        state.loadingHome = false;
        state.dataHome = action.payload.data;
      })
      .addCase(getDataExplore.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(getDataExplore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getDataExplore.fulfilled, (state, action) => {
        state.loading = false;
        state.dataExplore = action.payload.data;
      })
      .addCase(getDataStay.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(getDataStay.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getDataStay.fulfilled, (state, action) => {
        state.loading = false;
        state.dataStay = action.payload.data;
      })
      .addCase(getDataTours.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(getDataTours.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getDataTours.fulfilled, (state, action) => {
        state.loading = false;
        state.dataTours = action.payload.data;
      })
      .addCase(getDataFood.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(getDataFood.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getDataFood.fulfilled, (state, action) => {
        state.loading = false;
        state.dataFood = action.payload.data;
      })
      .addCase(getDataShopping.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(getDataShopping.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getDataShopping.fulfilled, (state, action) => {
        state.loading = false;
        state.dataShopping = action.payload.data;
      })
      .addCase(getDataEvents.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(getDataEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getDataEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.dataEvents = action.payload.data;
      })
      .addCase(getDataCoffee.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(getDataCoffee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getDataCoffee.fulfilled, (state, action) => {
        state.loading = false;
        state.dataCoffee = action.payload.data;
      })
      .addCase(getDataUtilities.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(getDataUtilities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getDataUtilities.fulfilled, (state, action) => {
        state.loading = false;
        state.dataUtilities = action.payload.data;
      })
      .addCase(getDataNews.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(getDataNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getDataNews.fulfilled, (state, action) => {
        state.loading = false;
        state.dataNews = action.payload.data;
      })
      .addCase(getDataDetail.pending, (state) => {
        state.loadingDetail = true;
        state.error = '';
      })
      .addCase(getDataDetail.rejected, (state, action) => {
        state.loadingDetail = false;
        state.error = action.payload as string;
      })
      .addCase(getDataDetail.fulfilled, (state, action) => {
        state.loadingDetail = false;
        state.dataDetail = action.payload.data;
      })
      .addCase(getDataSearch.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(getDataSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getDataSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.dataSearch = action.payload.data;
      })
      .addCase(fetchRate.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchRate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchRate.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchBooking.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchBooking.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(getNotifition.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(getNotifition.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getNotifition.fulfilled, (state, action) => {
        state.loading = false;
        state.dataNotifition = action.payload.data;
      })
      .addCase(getDataSpa.pending, (state) => {
        state.error = '';
      })
      .addCase(getDataSpa.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(getDataSpa.fulfilled, (state, action) => {
        state.spa = action.payload.data;
      })
      .addCase(getDataExploreItem.pending, (state) => {
        state.error = '';
      })
      .addCase(getDataExploreItem.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(getDataExploreItem.fulfilled, (state, action) => {
        state.loading = false;
      });
  },
});
export const { resetNutrition, toggeDrawer } = DataSlice.actions;
export default DataSlice.reducer;
