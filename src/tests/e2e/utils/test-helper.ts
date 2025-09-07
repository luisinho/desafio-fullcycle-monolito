import { createApi } from "../../../infrastructure/api/api";

export function setupTestApp() {
    const app = createApi();
    return app;
}