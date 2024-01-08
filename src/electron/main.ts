import 'reflect-metadata';
import { container } from "tsyringe";
import { App } from "./app";

const app = container.resolve(App)
app.run()
