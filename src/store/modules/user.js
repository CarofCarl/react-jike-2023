import { createSlice } from "@reduxjs/toolkit";
import { setToken, getToken, removeToken } from "@/utils";
import { loginAPI, getProfileAPI } from "@/apis/user";

const userStore = createSlice({
  name: "user",
  // 数据状态
  initialState: {
    token: getToken() || "",
    userInfo: {},
  },
  // 同步修改方法
  reducers: {
    setUserToken(state, action) {
      state.token = action.payload;
      // 存入本地
      setToken(action.payload);
    },
    setUserInfo(state, action) {
      state.userInfo = action.payload;
    },
    // 清除token方法
    clearUserInfo(state) {
      state.token = "";
      state.userInfo = {};
      removeToken();
    },
  },
});

// 解构出actionCreater
const { setUserToken, setUserInfo, clearUserInfo } = userStore.actions;

// 获取reducer函数
const userReducer = userStore.reducer;

const fetchLogin = (loginForm) => {
  return async (dispatch) => {
    const res = await loginAPI(loginForm);
    dispatch(setUserToken(res.data.token));
  };
};

// 获取个人用户信息异步方法
const fetchUserInfo = () => {
  return async (dispatch) => {
    const res = await getProfileAPI();
    dispatch(setUserInfo(res.data));
  };
};

export { fetchLogin, fetchUserInfo, clearUserInfo };

export default userReducer;
