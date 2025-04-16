export const queryFilter = (query) => (entities) => {
    return entities.filter((entity) => matchesQuery(entity, query));
};
function matchesQuery(entity, query) {
    const { has, not, match, and, or } = query;
    const get = (sel) => {
        const [ns, key] = sel.split(".");
        return entity?.[ns]?.[key];
    };
    // First, short-circuit if `or` is present and satisfied
    if (or && matchesQuery(entity, or))
        return true;
    if (has) {
        const hasList = Array.isArray(has) ? has : [has];
        if (!hasList.every((sel) => get(sel) !== undefined))
            return false;
    }
    if (not) {
        const notList = Array.isArray(not) ? not : [not];
        if (notList.some((sel) => get(sel) !== undefined))
            return false;
    }
    if (match) {
        const value = get(match.key);
        switch (match.op || "==") {
            case "==":
                if (value !== match.value)
                    return false;
                break;
            case "!=":
                if (value === match.value)
                    return false;
                break;
            case "!":
                if (value)
                    return false;
                break;
            case "contains":
                if (value === undefined ||
                    (Array.isArray(value) && !value.includes(match.value)))
                    return false;
                break;
            case ">":
                if (!(value > Number(match.value)))
                    return false;
                break;
            case "<":
                if (!(value < Number(match.value)))
                    return false;
                break;
            case ">=":
                if (!(value >= Number(match.value)))
                    return false;
                break;
            case "<=":
                if (!(value <= Number(match.value)))
                    return false;
                break;
            case "r":
                if (!(typeof value === "string" &&
                    new RegExp(String(match.value)).test(value)))
                    return false;
                break;
            case "ri":
                if (!(typeof value === "string" &&
                    new RegExp(String(match.value), "i").test(value)))
                    return false;
                break;
        }
    }
    if (and && !matchesQuery(entity, and))
        return false;
    return true;
}
//# sourceMappingURL=queryFilter.js.map