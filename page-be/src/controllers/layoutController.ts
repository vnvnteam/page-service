import type { Context } from "elysia";
import {
  createPageLayoutService,
  deletePageLayoutService,
  getPageLayoutByIdService,
  getPageLayoutsService,
  updatePageLayoutActiveService,
  updatePageLayoutService,
} from "@/services/layoutService";
import type { CreatePageLayoutInput, UpdatePageLayoutInput } from "@/types/types" 

export const getPageLayoutsController = async ({ query, set }: Context) => {
  try {
    const { tenantId } = query as { tenantId: string };

    const result = await getPageLayoutsService(tenantId);

    set.status = 200;
    return result;
  } catch (error) {
    console.error("Error in GET /page-layouts:", error);

    set.status = 500;
    return {
      success: false,
      message: "Internal Server Error",
    };
  }
};

export const getPageLayoutByIdController = async ({ params, set }: Context) => {
  try {
    const { id } = params as { id: string };

    const result = await getPageLayoutByIdService(id);

    if (!result) {
      set.status = 404;
      return {
        success: false,
        message: "Page layout not found",
      };
    }

    set.status = 200;
    return result;
  } catch (error) {
    console.error("Error in GET /page-layouts/:id:", error);

    set.status = 500;
    return {
      success: false,
      message: "Internal Server Error",
    };
  }
};

export const createPageLayoutController = async ({ body, set }: Context) => {
  try {
    const payload = body as CreatePageLayoutInput;

    const result = await createPageLayoutService(payload);

    set.status = 201;
    return result;
  } catch (error: any) {
    console.error("Error in POST /page-layouts:", error);

    if (error?.code === "23505") {
      set.status = 409;
      return {
        success: false,
        message: "Duplicate tenant_id + name + version",
      };
    }

    set.status = 500;
    return {
      success: false,
      message: "Internal Server Error",
    };
  }
};

export const updatePageLayoutController = async ({ params, body, set }: Context) => {
  try {
    const { id } = params as { id: string };
    const payload = body as UpdatePageLayoutInput;

    const result = await updatePageLayoutService(id, payload);

    if (!result) {
      set.status = 404;
      return {
        success: false,
        message: "Page layout not found",
      };
    }

    set.status = 200;
    return result;
  } catch (error: any) {
    console.error("Error in PUT /page-layouts/:id:", error);

    if (error?.code === "23505") {
      set.status = 409;
      return {
        success: false,
        message: "Duplicate tenant_id + name + version",
      };
    }

    set.status = 500;
    return {
      success: false,
      message: "Internal Server Error",
    };
  }
};

export const deletePageLayoutController = async ({ params, set }: Context) => {
  try {
    const { id } = params as { id: string };

    const result = await deletePageLayoutService(id);

    if (!result) {
      set.status = 404;
      return {
        success: false,
        message: "Page layout not found",
      };
    }

    set.status = 200;
    return {
      success: true,
      id: result.id,
    };
  } catch (error) {
    console.error("Error in DELETE /page-layouts/:id:", error);

    set.status = 500;
    return {
      success: false,
      message: "Internal Server Error",
    };
  }
};

export const updatePageLayoutActiveController = async ({
  params,
  body,
  set,
}: Context) => {
  try {
    const { id } = params as { id: string };
    const { isActive } = body as { isActive: boolean };

    const result = await updatePageLayoutActiveService(id, isActive);

    if (!result) {
      set.status = 404;
      return {
        success: false,
        message: "Page layout not found",
      };
    }

    set.status = 200;
    return result;
  } catch (error) {
    console.error("Error in PATCH /page-layouts/:id/active:", error);

    set.status = 500;
    return {
      success: false,
      message: "Internal Server Error",
    };
  }
};