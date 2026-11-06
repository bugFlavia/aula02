import grpc, { Server, ServerCredentials, } from '@grpc/grpc-js';
import type { ServerUnaryCall, sendUnaryData } from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';

type Empty = {};
type Task = { id: number, title: string};
type TaskList = { tasks: Task[] };

const tasks: Task[] = [
    { id: 1, title: 'Tarefa 1' },
    { id: 2, title: 'Tarefa 2' },
    { id: 3, title: 'Tarefa 3' }
];

const taskDef = loadSync('tasks.proto')
const taskproto = (grpc.loadPackageDefinition)(taskDef).task as any;

const server = new Server();
server.addService(taskproto.TaskService.service, {
    FindAll: (_: ServerUnaryCall<Empty, TaskList>, callback: sendUnaryData<TaskList>) => {
        callback(null, {tasks})
    },
    FindOne: (call: ServerUnaryCall<{ id: number }, Task>, callback: sendUnaryData<Task>) => {
        const task = tasks.find(t => t.id === call.request.id);
        if (task){
            callback(null, task);
        } else {
            callback(new Error('Tarefa não encontrada'), null);
        }
    }

});

server.bindAsync('0.0.0.0:50051', ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
        console.error('Falha ao subir o servidor:', err.message);
        process.exit(1);
    }
    console.log(`Servidor rodando na porta ${port}`);
});