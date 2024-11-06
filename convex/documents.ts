import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const archive = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("You must be signed in to access documents.");
    }

    const userId = identity.subject;
    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("Not found");
    }

    if (existingDocument.userId !== userId) {
      throw new Error("You do not have permission to archive this document.");
    }

    const recursiveArchive = async (documentId) => {
      const children = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", userId).eq("parentDocument", documentId)
        )
        .collect();

      for (const child of children) {
        await ctx.db.patch(child._id, { isArchived: true });
        await recursiveArchive(child._id);
      }
    };

    await recursiveArchive(args.id);
    const document = await ctx.db.patch(args.id, { isArchived: true });
    return document;
  }
});

export const getSidebar = query({
  args: {
    parentDocument: v.optional(v.id("documents"))
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("You must be signed in to access documents.");
    }

    const userId = identity.subject;
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user_parent", (q) =>
        q.eq("userId", userId).eq("parentDocument", args.parentDocument)
      )
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();

    return documents;
  }
});

export const create = mutation({
  args: {
    title: v.string(),
    parentDocument: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("You must be signed in to create a document.");
    }

    const userId = identity.subject;
    const document = await ctx.db.insert("documents", {
      title: args.title,
      parentDocument: args.parentDocument,
      userId,
      isArchived: false,
      isPublished: false,
    });

    return document;
  },
});

export const getTrash = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("You must be signed in to access documents.");
    }

    const userId = identity.subject;
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), true))
      .order("desc")
      .collect();

    return documents;
  }
});

export const restore = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("You must be signed in to access documents.");
    }

    const userId = identity.subject;
    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("Not found");
    }

    if (existingDocument.userId !== userId) {
      throw new Error("You do not have permission to restore this document.");
    }

    const recursiveRestore = async (documentId) => {
      const children = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", userId).eq("parentDocument", documentId)
        )
        .collect();

      for (const child of children) {
        await ctx.db.patch(child._id, { isArchived: false });
        await recursiveRestore(child._id);
      }
    };

    await recursiveRestore(args.id);
    const document = await ctx.db.patch(args.id, { isArchived: false });
    return document;
  }
});

export const remove = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("You must be signed in to access documents.");
    }

    const userId = identity.subject;
    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("Not found");
    }

    if (existingDocument.userId !== userId) {
      throw new Error("You do not have permission to delete this document.");
    }

    await ctx.db.delete(args.id);
    return { success: true };
  }
});

export const getSearch = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("You must be signed in to access documents.");
    }

    const userId = identity.subject;
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();

    return documents;
  }
});

export const getById = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    const document = await ctx.db.get(args.documentId);

    if (!document) {
      throw new Error("Not found");
    }

    if (document.isPublished && !document.isArchived) {
      return document;
    }

    if (!identity) {
      throw new Error("You must be signed in to access documents.");
    }

    const userId = identity.subject;

    if (document.userId !== userId) {
      throw new Error("You do not have permission to access this document.");
    }

    return document;
  }
});

export const update = mutation({
  args: {
    id: v.id("documents"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("You must be signed in to access documents.");
    }

    const userId = identity.subject;
    
    const { id, ...rest } = args;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("Not found");
    }

    if (existingDocument.userId !== userId) {
      throw new Error("You do not have permission to update this document.");
    }

    const document = await ctx.db.patch(args.id, {
      ...rest,
    });

    return document;
  }
});

export const removeIcon = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("You must be signed in to access documents.");
    }

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument){
      throw new Error("Not found");
    }

    if (existingDocument.userId !== userId){
      throw new Error("You do not have permission to update this document.");
    }

    const document = await ctx.db.patch(args.id, {
      icon: undefined,
    });

    return document;
  }
});

export const removeCoverImage = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    console.log("removeCoverImage called with args:", args);
    const identity = await ctx.auth.getUserIdentity();
    console.log("User identity:", identity);

    if (!identity) {
      throw new Error("You must be signed in to access documents.");
    }

    const userId = identity.subject;
    const existingDocument = await ctx.db.get(args.id);
    console.log("Existing document:", existingDocument);

    if (!existingDocument) {
      throw new Error("Not found");
    }

    if (existingDocument.userId !== userId) {
      throw new Error("You do not have permission to update this document.");
    }

    const document = await ctx.db.patch(args.id, {
      coverImage: undefined,
    });

    console.log("Document updated:", document);
    return document;
  }
});
