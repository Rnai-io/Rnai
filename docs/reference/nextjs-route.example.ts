/**
 * Rnai backend — example API route using the failover router
 * ===========================================================
 * REFERENCE for the rnai-platform (Next.js) repo. Shows how to make an existing
 * skill endpoint route through `routeSkill` so it automatically fails over to
 * the self-hosted backup when the primary provider is down.
 *
 * Place the router at lib/ai/ai-gateway-router.ts (from ../ai-gateway-router.ts),
 * then refactor each /api/v1/* handler to the pattern below.
 *
 * This example: app/api/v1/text/generate/route.ts (App Router).
 */

import { NextRequest, NextResponse } from 'next/server';
import { routeSkill, EXAMPLE_REGISTRY, type SkillId } from '@/lib/ai/ai-gateway-router';

// TODO: replace EXAMPLE_REGISTRY with your real providers (wire call()/health()).
const REGISTRY = EXAMPLE_REGISTRY;

// Map each backend route to its skill id. text/generate is shared by several
// skills, so let the caller pass `skillId`, defaulting to 'text-gen'.
export async function POST(req: NextRequest) {
  // 1) Auth — keep your existing Bearer-key / credit check here, unchanged.
  //    const user = await verifyToken(req); if (!user) return NextResponse.json({error:'auth'},{status:401});
  //    if (user.credits <= 0) return NextResponse.json({error:'no-credits'},{status:402});

  let body: any;
  try { body = await req.json(); } catch { body = {}; }

  const skillId = (body.skillId ?? 'text-gen') as SkillId;

  try {
    const result = await routeSkill(REGISTRY, {
      skillId,
      prompt: body.prompt ?? body.text,
      image: body.image,
      extra: body.extra,
    });

    // 2) On success: deduct credits, log usage (existing logic), and return.
    //    await chargeCredits(user, skillId);

    // `servedBy` lets the client/ops see whether a backup answered.
    return NextResponse.json(
      { text: result.content, kind: result.kind },
      { headers: { 'x-rnai-served-by': result.servedBy } },
    );
  } catch (err: any) {
    // Every provider (incl. self-hosted backup) failed — return a clean error.
    return NextResponse.json(
      { error: err?.message ?? 'All providers unavailable' },
      { status: 503 },
    );
  }
}
