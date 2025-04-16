import { Query } from "../type/Query";
import { Component } from "../type/Component";
import { Entity } from "../type/Entity";

export const queryFilter =
  <Components extends Component[]>(query: Query<Components>) =>
  (entities: Entity<Components>[]): Entity<Components>[] => {
    return entities.filter((entity) => matchesQuery(entity, query));
  };

function matchesQuery<Components extends Component[]>(
  entity: Entity<Components>,
  query: Query<Components>
): boolean {
  const { has, not, match, and, or } = query;

  const get = (sel: string): any => {
    const [ns, key] = sel.split(".");
    return (entity as Record<string, Record<string, any>>)?.[ns]?.[key];
  };

  // First, short-circuit if `or` is present and satisfied
  if (or && matchesQuery(entity, or)) return true;

  if (has) {
    const hasList = Array.isArray(has) ? has : [has];
    if (!hasList.every((sel) => get(sel) !== undefined)) return false;
  }

  if (not) {
    const notList = Array.isArray(not) ? not : [not];
    if (notList.some((sel) => get(sel) !== undefined)) return false;
  }

  if (match) {
    const value = get(match.key);
    switch (match.op || "==") {
      case "==":
        if (value !== match.value) return false;
        break;
      case "!=":
        if (value === match.value) return false;
        break;
      case "!":
        if (value) return false;
        break;
      case "contains":
        if (
          value === undefined ||
          (Array.isArray(value) && !value.includes(match.value))
        )
          return false;
        break;
      case ">":
        if (!(value > Number(match.value))) return false;
        break;
      case "<":
        if (!(value < Number(match.value))) return false;
        break;
      case ">=":
        if (!(value >= Number(match.value))) return false;
        break;
      case "<=":
        if (!(value <= Number(match.value))) return false;
        break;
      case "r":
        if (
          !(
            typeof value === "string" &&
            new RegExp(String(match.value)).test(value)
          )
        )
          return false;
        break;
      case "ri":
        if (
          !(
            typeof value === "string" &&
            new RegExp(String(match.value), "i").test(value)
          )
        )
          return false;
        break;
    }
  }

  if (and && !matchesQuery(entity, and)) return false;

  return true;
}
