"use client";

import { useState } from "react";
import { useTodos, CreateTodoInput } from "@/hooks/use-todo";
import { Button } from "@/components/ui";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { Skeleton } from "@/components/ui";

export default function TodoList() {
  const { todos, isLoading, createTodo, updateTodo, deleteTodo } = useTodos();
  const [newTodoTitle, setNewTodoTitle] = useState("");

  const handleCreateTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    const input: CreateTodoInput = {
      title: newTodoTitle.trim(),
    };

    createTodo.mutate(input, {
      onSuccess: () => {
        setNewTodoTitle("");
      },
    });
  };

  const handleToggleComplete = (id: string, completed: boolean) => {
    updateTodo.mutate({
      id,
      data: { completed: !completed },
    });
  };

  const handleDeleteTodo = (id: string) => {
    deleteTodo.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Todo List</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCreateTodo} className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Add a new todo..."
            value={newTodoTitle}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewTodoTitle(e.target.value)
            }
            disabled={createTodo.isPending}
            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:outline-none"
          />
          <Button
            type="submit"
            disabled={createTodo.isPending || !newTodoTitle.trim()}
          >
            Add
          </Button>
        </form>

        <div className="space-y-2">
          {todos.length === 0 ? (
            <p className="text-center py-4">No todos yet. Add one above!</p>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center justify-between p-3 border rounded-md"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() =>
                      handleToggleComplete(todo.id, todo.completed)
                    }
                    disabled={updateTodo.isPending}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <span
                    className={
                      todo.completed ? "line-through text-gray-500" : ""
                    }
                  >
                    {todo.title}
                  </span>
                </div>
                <Button
                  onClick={() => handleDeleteTodo(todo.id)}
                  disabled={deleteTodo.isPending}
                  className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded"
                >
                  Delete
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
      <CardFooter className="text-sm text-gray-500">
        {todos.length} {todos.length === 1 ? "item" : "items"} •{" "}
        {todos.filter((t) => t.completed).length} completed
      </CardFooter>
    </Card>
  );
}
