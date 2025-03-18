"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useQueryApi } from "./use-query-api";

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoInput {
  title: string;
}

export interface UpdateTodoInput {
  title?: string;
  completed?: boolean;
}

const TODOS_ENDPOINT = "/todos";
const TODOS_QUERY_KEY = ["todos"];

export function useTodos() {
  const queryClient = useQueryClient();
  const api = useQueryApi();

  // Fetch all todos
  const getTodos = useQuery({
    queryKey: TODOS_QUERY_KEY,
    queryFn: () => api.fetchData<Todo[]>(TODOS_ENDPOINT),
  });

  // Create a new todo
  const createTodo = useMutation({
    mutationFn: (data: CreateTodoInput) =>
      api.createItem<Todo, CreateTodoInput>(TODOS_ENDPOINT, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY });
    },
  });

  // Update a todo
  const updateTodo = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTodoInput }) =>
      api.updateItem<Todo, UpdateTodoInput>(TODOS_ENDPOINT, id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...TODOS_QUERY_KEY, variables.id],
      });
      queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY });
    },
  });

  // Delete a todo
  const deleteTodo = useMutation({
    mutationFn: (id: string) => api.deleteItem<Todo>(TODOS_ENDPOINT, id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [...TODOS_QUERY_KEY, id] });
      queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY });
    },
  });

  return {
    todos: getTodos.data || [],
    isLoading: getTodos.isLoading,
    isError: getTodos.isError,
    createTodo,
    updateTodo,
    deleteTodo,
  };
}

// Separate hook for fetching a single todo by ID
export function useTodoById(id: string) {
  const api = useQueryApi();

  const query = useQuery({
    queryKey: [...TODOS_QUERY_KEY, id],
    queryFn: () => api.fetchById<Todo>(TODOS_ENDPOINT, id),
    enabled: !!id,
  });

  return {
    todo: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
