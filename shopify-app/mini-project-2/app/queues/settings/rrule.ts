import { RepeatOptions } from "bullmq";
import pkg from "rrule";

const { rrulestr } = pkg as any;
export const settingRepeatJobs = {
  repeatStrategy: (
    millis: number,
    opts: RepeatOptions,
    _jobName: string | undefined,
  ) => {
    const currentDate =
      opts.startDate && new Date(opts.startDate) > new Date(millis)
        ? new Date(opts.startDate)
        : new Date(millis);
    console.log("currentDate", currentDate);
    const rrule = rrulestr(opts.pattern);

    if (rrule.origOptions.count && !rrule.origOptions.dtstart) {
      throw new Error("DTSTART must be defined to use COUNT with rrule");
    }

    const next_occurrence = rrule.after(currentDate, false);
    console.log("next_occurrence", next_occurrence);
    return next_occurrence?.getTime();
  },
};
