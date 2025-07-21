type Job = { userId: number };

const queue: Job[] = [];
const queuedUserIds = new Set<number>();

export function addToTeamQueue(job: Job) {
  if (!queuedUserIds.has(job.userId)) {
    queue.push(job);
    queuedUserIds.add(job.userId);
  }
}

export function getNextTeamJob(): Job | undefined {
  const job = queue.shift();
  if (job) {
    queuedUserIds.delete(job.userId); // clean up tracking
  }
  return job;
}

export function isUserQueued(userId: number): boolean {
  return queuedUserIds.has(userId);
}
