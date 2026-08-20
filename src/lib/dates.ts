import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

// Day boundaries must follow the shop's wall clock, not the server's. Vercel runs
// in UTC, so without this "today" would start at 03:00 local time.
export const SHOP_TIMEZONE = "Africa/Mogadishu";

export function shop_now() {
  return dayjs().tz(SHOP_TIMEZONE);
}

export function to_shop_time(date: Date | string) {
  return dayjs(date).tz(SHOP_TIMEZONE);
}

export function shop_day_key(date: Date | string) {
  return to_shop_time(date).format("YYYY-MM-DD");
}

export type DateRange = {
  start: Date;
  end: Date;
};

export type ResolvedRange = {
  current: DateRange;
  /** null when the filter has no meaningful prior period to compare against. */
  previous: DateRange | null;
};

/** Turns "YYYY-MM-DD" range inputs into absolute bounds on the shop's clock. */
export function range_from_day_strings(
  start_date: string,
  end_date: string,
): DateRange {
  return {
    start: dayjs.tz(`${start_date} 00:00:00`, SHOP_TIMEZONE).toDate(),
    end: dayjs.tz(`${end_date} 23:59:59.999`, SHOP_TIMEZONE).toDate(),
  };
}

export function resolve_range(filter: string): ResolvedRange {
  const today = shop_now();
  const end = today.endOf("day").toDate();

  if (filter === "weekly") {
    return {
      current: { start: today.subtract(6, "day").startOf("day").toDate(), end },
      previous: {
        start: today.subtract(13, "day").startOf("day").toDate(),
        end: today.subtract(7, "day").endOf("day").toDate(),
      },
    };
  }

  if (filter === "monthly") {
    return {
      current: { start: today.subtract(29, "day").startOf("day").toDate(), end },
      previous: {
        start: today.subtract(59, "day").startOf("day").toDate(),
        end: today.subtract(30, "day").endOf("day").toDate(),
      },
    };
  }

  if (filter === "all") {
    return {
      current: { start: new Date(0), end },
      previous: null,
    };
  }

  return {
    current: { start: today.startOf("day").toDate(), end },
    previous: {
      start: today.subtract(1, "day").startOf("day").toDate(),
      end: today.subtract(1, "day").endOf("day").toDate(),
    },
  };
}
