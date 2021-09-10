import { DATA_MENU, SET_ID } from "../types";
const initialState = {
  id: "",
  data: '',
};

export const mainReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ID:
      return {
        ...state,
        id: action.payload,
      };
      case DATA_MENU:
        return {
          ...state,
          data: action.payload
        }

    default:
      return state;
  }
};
