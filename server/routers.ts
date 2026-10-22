import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { createContactInquiry } from "./db";

const inquiryRateLimits = new Map<string, { count: number; resetAt: number }>();
const inquiryRateLimitWindow = 15 * 60 * 1000;
const inquiryRateLimitCount = 3;

function enforceInquiryRateLimit(clientIp: string) {
  const now = Date.now();
  const current = inquiryRateLimits.get(clientIp);
  if (!current || current.resetAt <= now) {
    inquiryRateLimits.set(clientIp, { count: 1, resetAt: now + inquiryRateLimitWindow });
  } else if (current.count >= inquiryRateLimitCount) {
    throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "Please wait before submitting another enquiry." });
  } else {
    current.count += 1;
  }

  if (inquiryRateLimits.size > 5000) {
    for (const [ip, limit] of inquiryRateLimits) {
      if (limit.resetAt <= now) inquiryRateLimits.delete(ip);
    }
  }
}

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  contact: router({
    submitInquiry: publicProcedure
      .input(z.object({
        name: z.string().trim().min(2).max(120),
        phone: z.string().trim().regex(/^\+?[0-9\s().-]{7,24}$/),
        email: z.union([z.string().trim().email().max(320), z.literal("")]).optional(),
        spaceType: z.enum(["Home / apartment", "Office / workspace", "Retail / hospitality", "Other"]),
        location: z.string().trim().max(160).optional(),
        budgetRange: z.enum(["Under RWF 5M", "RWF 5M–20M", "RWF 20M–50M", "Above RWF 50M", "Not sure yet"]).optional(),
        brief: z.string().trim().min(10).max(3000),
        consent: z.literal(true),
      }))
      .mutation(async ({ ctx, input }) => {
        enforceInquiryRateLimit(ctx.req.ip || "unknown");
        try {
          await createContactInquiry({
            name: input.name,
            phone: input.phone,
            email: input.email || null,
            spaceType: input.spaceType,
            location: input.location || null,
            budgetRange: input.budgetRange || null,
            brief: input.brief,
          });
          return { success: true } as const;
        } catch {
          console.error("[Contact] Failed to save an enquiry");
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "We could not save your enquiry. Please try again." });
        }
      }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
