// Stage 4 check against a running server. It writes to the ONE shared Redis store (vercel dev
// uses the live database), so everything it creates is removed at the end and the totals are
// compared with what they were before.
//   node --env-file=.env.local --env-file=.env --use-system-ca scripts/verify-builds.ts http://localhost:5207 --local
// --local also runs the report/hide/unhide checks. They need 3 different client IPs, which only
// vercel dev lets a script fake with x-forwarded-for, and the ADMIN_TOKEN from .env.
import { Redis } from "@upstash/redis";

const BASE = process.argv[2];
const LOCAL = process.argv.includes("--local");
if (!BASE) throw new Error("usage: verify-builds.ts <base url> [--local]");
const redis = new Redis({ url: process.env.KV_REST_API_URL!, token: process.env.KV_REST_API_TOKEN!, automaticDeserialization: false });

let failed = 0;
const ok = (cond: boolean, name: string, detail: unknown = "") => {
  if (!cond) failed++;
  console.log(`${cond ? "PASS" : "FAIL"}  ${name}${cond ? "" : `  -> ${JSON.stringify(detail)}`}`);
};
type Res = { status: number; body: any };
const call = async (path: string, body?: unknown, headers: Record<string, string> = {}): Promise<Res> => {
  const r = await fetch(BASE + path, {
    method: body === undefined ? "GET" : "POST",
    headers: { "content-type": "application/json", ...headers },
    body: body === undefined ? undefined : typeof body === "string" ? body : JSON.stringify(body),
  });
  return { status: r.status, body: await r.json().catch(() => null) };
};
const tag = Math.random().toString(36).slice(2, 8);
const NICK = `zzt${tag}`;
const IDEA = "money-0";
const IDEA2 = "jackpot-0";
const url = (n: string | number) => `https://verify-${tag}-${n}.example.com/`;
const created: { id: string; ideaId: string; url: string }[] = [];
const nicks = new Set<string>([NICK.toLowerCase(), `${NICK}b`.toLowerCase()]);
const post = async (b: Record<string, unknown>, headers?: Record<string, string>) => {
  const r = await call("/api/builds", { ideaId: IDEA, twist: null, url: url(created.length), title: "Verify build", nick: NICK, ...b }, headers);
  if (r.status === 201) created.push({ id: r.body.build.id, ideaId: r.body.build.ideaId, url: r.body.build.url });
  return r;
};
const rejects = async (name: string, b: Record<string, unknown> | string, status: number, words: string) => {
  const r = typeof b === "string" ? await call("/api/builds", b) : await post(b);
  ok(r.status === status && typeof r.body?.error === "string" && r.body.error.includes(words), `rejects ${name}: "${r.body?.error}"`, r);
};

const before = { recent: await redis.llen("builds:recent"), idea: await redis.llen(`builds:idea:${IDEA}`) };
try {
  // ---------- every validation rule, each with a clear message ----------
  await rejects("non-JSON body", "not json", 400, "JSON");
  await rejects("1 MB title", { title: "A".repeat(1_000_000) }, 400, "too big");
  await rejects("script tag title", { title: "<script>alert(1)</script>" }, 400, "< or >");
  await rejects("img onerror title", { title: '<img src=x onerror="alert(1)">' }, 400, "< or >");
  await rejects("2-char title", { title: "ab" }, 400, "3 to 80");
  await rejects("81-char title", { title: "x".repeat(81) }, 400, "3 to 80");
  await rejects("control char title", { title: "abc\u0000def" }, 400, "control");
  await rejects("missing title", { title: undefined }, 400, "title");
  await rejects("unknown idea", { ideaId: "money-99999" }, 400, "Unknown idea");
  await rejects("non-canonical idea", { ideaId: "money-00" }, 400, "Unknown idea");
  await rejects("bad twist", { twist: 999 }, 400, "twist");
  await rejects("string twist", { twist: "1" }, 400, "twist");
  await rejects("missing url", { url: undefined }, 400, "Paste");
  await rejects("unparseable url", { url: "not a url" }, 400, "not a valid link");
  await rejects("http url", { url: "http://example.com" }, 400, "https://");
  await rejects("javascript url", { url: "javascript:alert(1)" }, 400, "https://");
  await rejects("data url", { url: "data:text/html,<script>alert(1)</script>" }, 400, "https://");
  await rejects("localhost url", { url: "https://localhost:3000" }, 400, "localhost");
  await rejects("sub.localhost url", { url: "https://app.localhost" }, 400, "localhost");
  await rejects("IPv4 url", { url: "https://127.0.0.1" }, 400, "IP address");
  await rejects("decimal IP url", { url: "https://2130706433/" }, 400, "IP address");
  await rejects("IPv6 url", { url: "https://[::1]/" }, 400, "IP address");
  await rejects("credentials url", { url: "https://google.com@evil.example.com/" }, 400, "username");
  await rejects("dotless host", { url: "https://intranet/" }, 400, "domain");
  await rejects("301-char url", { url: `https://example.com/${"a".repeat(281)}` }, 400, "300");
  await rejects("short nick", { nick: "ab" }, 400, "Nicknames");
  await rejects("long nick", { nick: "a".repeat(21) }, 400, "Nicknames");
  await rejects("nick with space", { nick: "bad nick" }, 400, "Nicknames");
  await rejects("script tag nick", { nick: "<script>" }, 400, "Nicknames");
  await rejects("malformed secret", { secret: "short" }, 400, "recovery code");
  ok(created.length === 0, "no build was written by any rejected request", created);

  // ---------- claim, impostor, recovery ----------
  const first = await post({ twist: 3 });
  const secret: string = first.body?.secret;
  ok(first.status === 201 && /^[A-Za-z0-9_-]{43}$/.test(secret ?? ""), "first post claims the nick and returns a secret once", first);
  ok(first.body?.build?.twist === 3 && first.body?.build?.nick === NICK, "build stores twist and nick", first.body?.build);
  const noSecret = await post({});
  ok(noSecret.status === 403 && noSecret.body.error.includes("taken"), "impostor with no secret is refused", noSecret);
  const wrong = await post({ secret: "A".repeat(43) });
  ok(wrong.status === 403, "impostor with a wrong secret is refused", wrong);
  const upper = await post({ nick: NICK.toUpperCase() });
  ok(upper.status === 403, "same nick in other letter case is refused", upper);
  const again = await post({ secret });
  ok(again.status === 201 && again.body.secret === undefined, "recovery code lets another device post, no new secret", again);
  const viaUpper = await post({ nick: NICK.toUpperCase(), secret });
  ok(viaUpper.status === 201 && viaUpper.body.build.nick === NICK, "recovery code works with other letter case; display nick kept", viaUpper.body);
  const dup = await post({ secret, url: url(0) });
  ok(dup.status === 409 && dup.body.error.includes("already"), "duplicate link for the same idea is refused", dup);
  const dupNorm = await post({ secret, url: url(0).replace("verify", "VERIFY") });
  ok(dupNorm.status === 409, "duplicate link differing only in host case is refused", dupNorm);
  const otherIdea = await post({ secret, ideaId: IDEA2, url: url(0) });
  ok(otherIdea.status === 201, "the same link for a different idea is allowed", otherIdea);

  const gal = await call(`/api/builds?idea=${IDEA}`);
  const galIds = (gal.body?.builds ?? []).map((b: any) => b.id);
  ok(created.filter((c) => c.ideaId === IDEA).every((c) => galIds.includes(c.id)), "idea gallery lists this idea's builds", gal.body);
  ok(!galIds.includes(created.find((c) => c.ideaId === IDEA2)?.id), "idea gallery does not list other ideas' builds");
  const rec = await call("/api/builds");
  ok(created.every((c) => rec.body.builds.some((b: any) => b.id === c.id)), "recent wall lists all new builds");
  ok(gal.body.builds.every((b: any) => !("secretHash" in b) && !("hidden" in b)), "no secret hash or flags leak in listings");

  // the nick's daily limit: 4 posted so far, one more is the 5th, then 429
  const fifth = await post({ secret });
  const sixth = await post({ secret });
  ok(fifth.status === 201 && sixth.status === 429 && sixth.body.error.includes("5 builds"), "6th build of the day for one nick gets 429", sixth);

  // ---------- reports, hide, admin unhide ----------
  if (LOCAL) {
    const ip = (n: number) => ({ "x-forwarded-for": `203.0.113.${n}` });
    const report = (buildId: string, reporterId: string, n: number) => call("/api/report", { buildId, reporterId }, ip(n));
    const listed = async (id: string) => (await call(`/api/builds?idea=${IDEA}`)).body.builds.some((b: any) => b.id === id);
    const target = created[0].id;
    let r = await report(target, "reporter-aaaa", 1);
    ok(r.status === 200 && r.body.hidden === false, "1st report counted, not hidden", r);
    r = await report(target, "reporter-aaaa", 1);
    ok(r.body.hidden === false, "same reporter twice counts once");
    r = await report(target, "reporter-bbbb", 1);
    r = await report(target, "reporter-cccc", 1);
    ok(r.body.hidden === false && (await listed(target)), "3 reporter ids from ONE IP do not hide it", r);
    r = await report(target, "reporter-dddd", 2);
    ok(r.body.hidden === false, "2 IPs do not hide it");
    r = await report(target, "reporter-eeee", 3);
    ok(r.body.hidden === true && !(await listed(target)), "3 reporters from 3 IPs hide it", r);
    ok((await report("0".repeat(12), "reporter-aaaa", 1)).status === 404, "report of an unknown build is 404");
    ok((await call("/api/report", { buildId: "<script>", reporterId: "reporter-aaaa" })).status === 400, "report with a bad id is 400");

    const admin = (body: unknown, auth?: string) => call("/api/admin/unhide", body, auth ? { authorization: auth } : {});
    ok((await admin({ buildId: target })).status === 401, "unhide without a token is 401");
    ok((await admin({ buildId: target }, "Bearer wrong")).status === 401, "unhide with a wrong token is 401");
    const good = `Bearer ${process.env.ADMIN_TOKEN}`;
    r = await admin({ buildId: target }, good);
    ok(r.status === 200 && (await listed(target)), "admin unhide brings the build back", r);
    for (const n of [4, 5, 6]) r = await report(target, `reporter-z${n}zz`, n);
    ok(r.body.hidden === false && (await listed(target)), "a reviewed build cannot be hidden again by reports", r);

    // 3 hidden builds hide the nickname: its builds vanish and it cannot post
    for (const b of created.filter((c) => c.id !== target && c.ideaId === IDEA).slice(0, 3))
      for (const n of [7, 8, 9]) await report(b.id, `reporter-n${n}${b.id.slice(0, 4)}`, n);
    const nickHidden = await redis.hget<string>(`nick:${NICK.toLowerCase()}`, "hidden");
    ok(nickHidden === "1", "3 hidden builds hide the nickname", nickHidden);
    ok(!(await listed(target)), "a hidden nickname's builds leave the gallery");
    const blocked = await post({ secret, ideaId: IDEA2, url: url("x") }, ip(20));
    ok(blocked.status === 403 && blocked.body.error.includes("review"), "a hidden nickname cannot post", blocked);
    r = await admin({ nick: NICK }, good);
    ok(r.status === 200 && (await listed(target)), "admin unhide of the nickname restores its builds", r);
  }
} finally {
  // ---------- undo every write ----------
  // Also sweep the recent list for this run's nicks, so a request that failed after writing
  // (a 500 mid-way) cannot leave a build behind untracked.
  for (const id of await redis.lrange("builds:recent", 0, -1)) {
    if (created.some((c) => c.id === id)) continue;
    const flat = (await redis.hgetall(`build:${id}`)) as unknown as string[] | null;
    const b = Object.fromEntries(Array.from({ length: (flat?.length ?? 0) / 2 }, (_, i) => [flat![2 * i], flat![2 * i + 1]]));
    if (nicks.has(String(b.nick).toLowerCase())) created.push({ id, ideaId: b.ideaId, url: b.url });
  }
  const p = redis.pipeline();
  for (const c of created) {
    p.del(`build:${c.id}`, `reports:${c.id}`, `reportips:${c.id}`);
    p.lrem(`builds:idea:${c.ideaId}`, 0, c.id);
    p.lrem("builds:recent", 0, c.id);
    p.srem(`urls:${c.ideaId}`, c.url);
  }
  for (const n of nicks) p.del(`nick:${n}`);
  if (created.length) await p.exec();
  // Rate-limit counters from this run (it is a fresh feature: nobody else's quota is in here yet).
  for (const pattern of ["rl:build:*", "rl:report:*"]) {
    let cursor = "0";
    do {
      const [next, keys] = await redis.scan(cursor, { match: pattern, count: 200 });
      if (keys.length) await redis.del(...keys);
      cursor = String(next);
    } while (cursor !== "0");
  }
  const after = { recent: await redis.llen("builds:recent"), idea: await redis.llen(`builds:idea:${IDEA}`) };
  const leftover = await Promise.all(created.map((c) => redis.exists(`build:${c.id}`)));
  ok(after.recent === before.recent && after.idea === before.idea && leftover.every((x) => x === 0), `cleanup: ${created.length} test builds removed, list lengths back to ${JSON.stringify(before)}`, after);
  console.log(failed ? `\n${failed} FAILED` : "\nALL PASSED");
  process.exitCode = failed ? 1 : 0;
}
