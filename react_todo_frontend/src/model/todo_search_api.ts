import {Todo} from "./todo_api"
import { searchValidation } from "../viewModel/value-object/validation";

//API通信を行う関数

export interface TodoSearchParams {
  keyword?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  status?: "all" | "completed" | "incomplete";
}

// APIのベースURL
const API_URL = 'http://localhost:8080';

// Todo検索API
export const searchTodos = async (
  token: string,
  params: TodoSearchParams
): Promise<Todo[]> => {
  const query = new URLSearchParams();

  if (params.keyword?.trim()) {
    query.append("title", params.keyword);
    query.append("body", params.keyword);
  }

  if (params.dueDateFrom) {
    query.append("due_date_from", params.dueDateFrom);
  }

  if (params.dueDateTo) {
    query.append("due_date_to", params.dueDateTo);
  }

  if (params.status && params.status !== "all") {
    query.append(
      "completed",
      (params.status === "completed").toString()
    );
  }
  const error = searchValidation(params.keyword || "");
  if (error) {
    throw new Error(error);
  }

  const res = await fetch(`${API_URL}/todos?${query.toString()}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const text = await res.text();
  console.log("ステータス:", res.status);
  console.log("レスポンス:", text);

  if (!res.ok) {
    try {
      const errorData = JSON.parse(text);
      throw new Error(errorData.error || "検索に失敗しました");
    } catch {
      throw new Error(`API Error: ${res.status} - ${text.substring(0, 100)}`);
    }
  }


  const data = JSON.parse(text);
  return Array.isArray(data.todos) ? data.todos : [];
};
