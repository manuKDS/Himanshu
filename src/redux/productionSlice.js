import { createSlice } from "@reduxjs/toolkit";

export const productionSlice = createSlice({
  name: "production",
  initialState: {
    production_name: null,
    production_id: null,
    search_visible: false,
    production_changes: false,
    production_list:[],
    active_menu: null,
  },
  reducers: {
    assignProduction: (state, action) => {
      state.production_name = action.payload.production_name;
      state.production_id = action.payload.production_id;
    },
    changeVisible: (state, action) => {
      state.search_visible = action.payload.search_visible;
    },
    menuCurrent: (state, action) => {
      state.active_menu = action.payload.active_menu;
    },
    changeProduction: (state, action) => {
      state.production_changes = action.payload.production_changes;
    },
    removeProduction: (state) => {
      state.production_name = null;
      state.production_id = null;
    },
    updateProductionList: (state,action) => {
      const data = JSON.parse(JSON.stringify(action.payload.data))
      const resultFinal = [];
      const result = data.filter((item) => item.parent_id == null);
      const resultNew = result.map((item) => {
        const productionId = item.production_id;
        if (item.type === 2) {
          data.map((series) => {
            if (series.parent_id == productionId) {
              series.production = item.production + " - " + series.production;
              resultFinal.push(series);
            }
          });
        } else {
          resultFinal.push(item);
        }
      });
      state.production_list=resultFinal
    }
  },
});

export const { assignProduction, removeProduction, changeVisible, updateProductionList, menuCurrent } = productionSlice.actions;

export default productionSlice.reducer;
