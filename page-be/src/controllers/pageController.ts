import type { Context } from "elysia";
import {
  createPageService,
  deletePageService,
  getPageByIdService,
  getPagesService,
  updatePageService,
  type CreatePageInput,
  type UpdatePageInput,
} from "@/services/pageService";

export const getPagesController = async ({ query, set }: Context) => {
  try {
    const { tenantId } = query as { tenantId: string };

    const result = await getPagesService(tenantId);

    set.status = 200;
    return result;
  } catch (error) {
    console.error("Error in GET /pages:", error);

    set.status = 500;
    return {
      success: false,
      message: "Internal Server Error",
    };
  }
};

export const getPageByIdController = async ({ params, set }: Context) => {
  try {
    const { id } = params as { id: string };

    const result = await getPageByIdService(id);

    if (!result) {
      set.status = 404;
      return {
        success: false,
        message: "Page not found",
      };
    }

    set.status = 200;
    return result;
  } catch (error) {
    console.error("Error in GET /pages/:id:", error);

    set.status = 500;
    return {
      success: false,
      message: "Internal Server Error",
    };
  }
};

export const createPageController = async ({ body, set }: Context) => {
  try {
    const payload = body as CreatePageInput;

    const result = await createPageService(payload);

    set.status = 201;
    return result;
  } catch (error) {
    console.error("Error in POST /pages:", error);

    set.status = 500;
    return {
      success: false,
      message: "Internal Server Error",
    };
  }
};

export const updatePageController = async ({ params, body, set }: Context) => {
  try {
    const { id } = params as { id: string };
    const payload = body as UpdatePageInput;

    const result = await updatePageService(id, payload);

    if (!result) {
      set.status = 404;
      return {
        success: false,
        message: "Page not found",
      };
    }

    set.status = 200;
    return result;
  } catch (error) {
    console.error("Error in PUT /pages/:id:", error);

    set.status = 500;
    return {
      success: false,
      message: "Internal Server Error",
    };
  }
};

export const deletePageController = async ({ params, set }: Context) => {
  try {
    const { id } = params as { id: string };

    const result = await deletePageService(id);

    if (!result) {
      set.status = 404;
      return {
        success: false,
        message: "Page not found",
      };
    }

    set.status = 200;
    return {
      success: true,
      id: result.id,
    };
  } catch (error) {
    console.error("Error in DELETE /pages/:id:", error);

    set.status = 500;
    return {
      success: false,
      message: "Internal Server Error",
    };
  }
};