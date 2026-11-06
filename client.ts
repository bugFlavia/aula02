import grpc from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';

type Task = { id: number, title: string};
type TaskList = { tasks: Task[] };

const taskDef = loadSync('tasks.proto')
const taskproto = (grpc.loadPackageDefinition)(taskDef).task as any;

const client = new taskproto.TaskService('127.0.0.1:50051', (grpc.credentials).createInsecure());

client.FindAll({}, (err: Error | null, res: TaskList) => {
  if (err) {
    console.error('Erro ao chamar FindAll:', err.message);
    return;
  }
  console.table(res.tasks)
})

client.FindOne({ id: 2 }, (err: Error | null, res: Task) => {
  if (err) {
    console.error('Erro ao chamar FindOne:', err.message);
    return;
  }
  console.log(res)
})