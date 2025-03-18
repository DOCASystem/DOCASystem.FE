import TodoList from "@/components/todo/todo-list";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Todo List | DOCA System",
  description: "Manage your tasks with our simple todo list application",
};

export default function TodoPage() {
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Todo List</h1>
      <TodoList />
    </div>
  );
}
