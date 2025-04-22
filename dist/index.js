import { EmitterChannel as g, MessageBus as S } from "@mjt-engine/mb";
import { toMany as k } from "@mjt-engine/object";
const b = Symbol("dirty"), L = () => {
  let i = !1, f = !1;
  const o = (e = "object") => {
    const u = e == "object" ? {} : [];
    return Object.defineProperty(u, b, {
      value: !1,
      writable: !0,
      enumerable: !1,
      configurable: !1
    }), new Proxy(u, {
      get(t, n, y) {
        if (n === b)
          return t[b];
        if (n === "toJSON")
          return function() {
            const v = {};
            for (const m of Object.keys(t)) {
              const d = t[m];
              d && typeof d == "object" && typeof d.toJSON == "function" ? v[m] = d.toJSON() : v[m] = d;
            }
            return v;
          };
        if (n !== Symbol.toStringTag)
          return !(n in t) && !f && (t[n] = o()), Reflect.get(t, n, y);
      },
      set(t, n, y, v) {
        return n !== b && !i && (t[b] = !0), Reflect.set(t, n, y, v);
      },
      has(t, n) {
        return Reflect.has(t, n);
      },
      ownKeys(t) {
        return Reflect.ownKeys(t);
      },
      getOwnPropertyDescriptor(t, n) {
        return Object.getOwnPropertyDescriptor(t, n);
      }
    });
  }, a = (e) => {
    if (e[b])
      return e[b];
    for (const u in e)
      if (e[u] && typeof e[u] == "object")
        return a(e[u]);
    return !1;
  }, r = (e) => {
    const u = Array.isArray(e) ? "array" : "object", t = o(u);
    for (const [n, y] of Object.entries(e))
      if (y !== void 0) {
        if (y === null) {
          t[n] = null;
          continue;
        }
        t[n] = typeof y == "object" ? r(y) : y;
      }
    return t;
  };
  return {
    isDirty: a,
    from: (e) => {
      if (e === void 0)
        return o();
      i = !0;
      const u = r(e);
      return i = !1, u;
    },
    setSuppressDirty: (e) => {
      i = e;
    },
    setSuppressLazy: (e) => {
      f = e;
    },
    toPlain: (e) => JSON.parse(JSON.stringify(e))
  };
}, D = (i) => (f) => f.filter((o) => w(o, i));
function w(i, f) {
  const { has: o, not: a, match: r, and: c, or: l } = f, p = (s) => {
    const [e, u] = s.split(".");
    return i?.[e]?.[u];
  };
  if (l && w(i, l)) return !0;
  if (o && !(Array.isArray(o) ? o : [o]).every((e) => p(e) !== void 0) || a && (Array.isArray(a) ? a : [a]).some((e) => p(e) !== void 0))
    return !1;
  if (r) {
    const s = p(r.key);
    switch (r.op || "==") {
      case "==":
        if (s !== r.value) return !1;
        break;
      case "!=":
        if (s === r.value) return !1;
        break;
      case "!":
        if (s) return !1;
        break;
      case "contains":
        if (s === void 0 || Array.isArray(s) && !s.includes(r.value))
          return !1;
        break;
      case ">":
        if (!(s > Number(r.value))) return !1;
        break;
      case "<":
        if (!(s < Number(r.value))) return !1;
        break;
      case ">=":
        if (!(s >= Number(r.value))) return !1;
        break;
      case "<=":
        if (!(s <= Number(r.value))) return !1;
        break;
      case "r":
        if (!(typeof s == "string" && new RegExp(String(r.value)).test(s)))
          return !1;
        break;
      case "ri":
        if (!(typeof s == "string" && new RegExp(String(r.value), "i").test(s)))
          return !1;
        break;
    }
  }
  return !(c && !w(i, c));
}
const O = (i, f) => {
  const o = /* @__PURE__ */ new WeakMap(), a = new AbortController();
  return {
    close: () => {
      a.abort();
    },
    emit: (r, ...c) => {
      f.postMessage(c[0]);
    },
    on: (r, c) => {
      const l = async (p) => c(p.data);
      o.set(c, l), i.addEventListener("message", l, {
        signal: a.signal
      });
    },
    off: (r, c) => {
      const l = o.get(c);
      i.removeEventListener("message", l);
    }
  };
}, z = (i = {}) => {
  const {
    localWindow: f = window,
    remoteWindow: o = window,
    signal: a,
    ...r
  } = i, c = O(
    f,
    o
  ), l = g(c);
  return a?.addEventListener("abort", () => {
    c.close();
  }), S({ channel: l, ...r });
}, A = (i) => {
  const f = /* @__PURE__ */ new Map();
  return { register: async ({
    name: a = `sys-${Date.now()}-${crypto.randomUUID()}`,
    query: r,
    system: c
  }) => (f.set(a, c), i.subscribe("runSystem", async (l) => {
    const { entities: p, ids: s, name: e } = l, u = f.get(e);
    if (!u)
      throw new Error(`System ${e} not found`);
    const t = L();
    t.setSuppressDirty(!0);
    const n = p.map((m) => t.from(m));
    t.setSuppressDirty(!1);
    const y = await u(n, [
      ...n.map((m, d) => d)
    ]);
    return {
      update: {
        // TODO pick out just the dirty entities for update
        entities: n.filter((m) => t.isDirty(m)).length > 0 ? n.map((m) => t.toPlain(m)) : [],
        ids: s
      },
      add: k(y ?? [])
    };
  }), await i.request("registerQuery", { name: a, query: r }), a) };
};
export {
  z as EcsBridgeMessageBus,
  L as LazyObjects,
  A as Systems,
  D as queryFilter
};
