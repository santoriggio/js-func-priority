// priority.ts

const functionQueues: { [key: string]: { fn: Function; resolve: () => void }[] } = {
  HIGH: [],
  NORMAL: [],
  LOW: [],
};

export async function exec(fn: () => Promise<void>, priority: string): Promise<void> {
  const promise = new Promise<void>((resolve) => {
    functionQueues[priority].push({ fn, resolve });
    processQueue(priority);
  });

  await promise;
}

function processQueue(priority: string): void {
  if (functionQueues[priority].length === 1) {
    executeNext(priority);
  }
}

async function executeNext(priority: string): Promise<void> {
  const { fn, resolve } = functionQueues[priority][0];
  await fn();
  functionQueues[priority].shift();

  if (functionQueues[priority].length > 0) {
    executeNext(priority);
  } else {
    resolve();
  }
}
