// allTodos
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTodos, Todo, getTodoDetail, updateTodo } from "../../model/todo_api";
import { searchTodos } from "../../model/todo_search_api";
import { toast } from "react-toastify";

export const useTodoListViewModel = () => {
  const router = useRouter();
  
  // State管理
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [edit, setEdit] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  
  // 検索条件
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "incomplete">("all");
  const [filterDueDateFrom, setFilterDueDateFrom] = useState("");
  const [filterDueDateTo, setFilterDueDateTo] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [loginChecked, setLoginChecked] = useState(false);
  const [status, setStatus] = useState<"loading" | "success">("loading");

  // 初期データ取得
  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      toast.warning("ログインが必要です");
      router.push("/login");
      return;
    }else{
      setLoginChecked(true);
    }

    // ユーザーデータ取得
    const email = localStorage.getItem("email");
    setEmail(email);

    const fetchTodos = async () => {
      try {
        const data = await getTodos(token);
        console.log('Fetched todos:', data);
        setTodos(data);
        setFilteredTodos(data);
        setStatus("success");
      } catch (err) {
        toast.error(`${(err as Error).message}`);
        console.error("Failed to fetch todos", err);
      }
    };

    fetchTodos();
  }, [router]);

  useEffect(() => {
    let result = [...todos];

    // キーワード検索
    if (searchKeyword.trim()) {
      result = result.filter(todo =>
        todo.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        todo.body.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    // 進捗状態フィルター
    if (filterStatus === "completed") {
      result = result.filter(todo => todo.isCompleted);
    } else if (filterStatus === "incomplete") {
      result = result.filter(todo => !todo.isCompleted);
    }

    // 期限フィルター
    if (filterDueDateFrom || filterDueDateTo) {
      result = result.filter(todo => {
        if (!todo.dueDate) return false;
        
        const dueDate = new Date(todo.dueDate);
        const fromDate = filterDueDateFrom ? new Date(filterDueDateFrom) : null;
        const toDate = filterDueDateTo ? new Date(filterDueDateTo) : null;

        if (fromDate && toDate) {
          return dueDate >= fromDate && dueDate <= toDate;
        } else if (fromDate) {
          return dueDate >= fromDate;
        } else if (toDate) {
          return dueDate <= toDate;
        }
        return true;
      });
    }

    setFilteredTodos(result);
  }, [searchKeyword, filterStatus, filterDueDateFrom, filterDueDateTo, todos]);

  // バックエンド検索処理
  const handleBackendSearch = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const toastId = toast.loading("検索中...");

    try {
      const todosData = await searchTodos(token, {
      keyword: searchKeyword,
      dueDateFrom: filterDueDateFrom,
      dueDateTo: filterDueDateTo,
      status: filterStatus,
    });

      setFilteredTodos(todosData);
      setHasSearched(true);
      setIsDrawerOpen(false);
      toast.dismiss();
      
    } catch (error: any) {
      toast.update(toastId, { 
        render:error.message, 
        type: "error",
        isLoading: false,
        autoClose: 1000,
      });
      console.error("Failed to search todos:", error);
    }
  };

  // 編集モード切り替え
  const handleEdit = () => {
    setEdit(true);
  };

  const handleEditCancel = () => {
    setEdit(false);
  };

  // フィルタークリア
  const clearFilters = () => {
    setSearchKeyword("");
    setFilterStatus("all");
    setFilterDueDateFrom("");
    setFilterDueDateTo("");
    setFilteredTodos(todos);
    setHasSearched(false);
    setIsDrawerOpen(false);
  };

  // 進捗更新のメイン処理
  const executeStatusUpdate = async (id: string, newStatus: boolean) => {
    const token = localStorage.getItem("token");
    if (!token || !id) return;

    const toastId = toast.loading("更新中...");

    try {
      const currentData = await getTodoDetail(id, token);

      await updateTodo(id, token, {
        title: currentData.title,
        body: currentData.body,
        dueDate: currentData.dueDate || "",
        isCompleted: newStatus
      });

      const updatedTodos = await getTodos(token);
      setTodos(updatedTodos);
      toast.update(toastId, { 
        render: "更新成功！", 
        type: "success", 
        isLoading: false, 
        autoClose: 2000 
      });
    } catch (err: any) {
      toast.update(toastId, { 
        render:err.message, 
        type: "error", 
        isLoading: false, 
        autoClose: 3000 
      });
      console.error("Failed to update todo:", err);
    }
  };

  // ログアウト実行
  const confirmLogout = () => {
    setLoginChecked(false);
    toast.success("ログアウトしました");
    localStorage.removeItem("token");
    router.push("/login");
  };

  // ログインページへ遷移
  const confirmLogin = () => {
    router.push("/login"); 
  };

  // ページ遷移
  const navigateToCreate = () => {
    router.push("/todos/create");
  };

  const navigateToDetail = (id: string) => {
    router.push(`/todos/${id}/detail`);
  };

  // ドロワー開閉
  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  return {
    // State
    todos,
    filteredTodos,
    edit,
    isDrawerOpen,
    searchKeyword,
    filterStatus,
    filterDueDateFrom,
    filterDueDateTo,
    hasSearched,
    loginChecked, 
    status,
    email,

    // State更新関数
    setSearchKeyword,
    setFilterStatus,
    setFilterDueDateFrom,
    setFilterDueDateTo,

    // アクション
    handleBackendSearch,
    handleEdit,
    handleEditCancel,
    clearFilters,
    executeStatusUpdate,  // 直接実行用（View側で確認ダイアログを表示）
    confirmLogout,         // 直接実行用（View側で確認ダイアログを表示）
    navigateToCreate,
    navigateToDetail,
    openDrawer,
    closeDrawer,
    confirmLogin,
  };
};