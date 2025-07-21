import { getNextTeamJob } from "../queues/team-queue";
import { createInitialTeam } from "../services/team.service";

function startWorker() {
  setInterval(async () => {
    const job = getNextTeamJob();
    if (job) {
      console.log("👷 Processing team for user:", job.userId);
      await createInitialTeam(job.userId);
    }
  }, 1000); // Every second
}

startWorker();
