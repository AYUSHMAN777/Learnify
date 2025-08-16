import rootReducer from './rootReducer';
import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../features/api/authApi';
import { courseApi } from '@/features/api/courseApi';
import { purchaseApi } from '@/features/api/purchaseApi';
import { courseProgressApi } from '@/features/api/courseProgressApi';
const appStore = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware, courseApi.middleware,purchaseApi.middleware ,courseProgressApi.middleware),
});

const intiliazeApp = async () => {
    await appStore.dispatch(authApi.endpoints.loadUser.initiate({}, { forceRefetch: true }));
}

intiliazeApp();
export default appStore;