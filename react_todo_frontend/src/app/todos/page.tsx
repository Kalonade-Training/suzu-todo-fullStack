// allTodosページ
"use client";

import { useTodoListViewModel } from "../../viewModel/todo/todo-view-model";
import { Plus, Pencil, Search, Filter, X,  } from "lucide-react";
import { toast } from "react-toastify";

export default function TodoListPage() {
  const {
    todos,
    filteredTodos,
    edit,
    isDrawerOpen,
    searchKeyword,
    filterStatus,
    filterDueDateFrom,
    filterDueDateTo,
    hasSearched,
    status,
    setSearchKeyword,
    setFilterStatus,
    setFilterDueDateFrom,
    setFilterDueDateTo,
    handleBackendSearch,
    handleEdit,
    handleEditCancel,
    clearFilters,
    executeStatusUpdate,
    navigateToCreate,
    navigateToDetail,
    openDrawer,
    closeDrawer,
  } = useTodoListViewModel();

  // 進捗更新確認ダイアログ
  const handleUpdate = (id: string, newStatus: boolean) => {
    toast.info(
      <div style={{ padding: "8px 4px"}}>
        <p style={{
          fontSize: "15px",
          fontWeight: "600",
          color: "#374151",
          marginBottom: "10px",
          textAlign: "center",
        }}>
          進捗状態を更新しますか？
        </p>
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "14px",
        }}>
          <button
            onClick={() => {
              toast.dismiss();
              executeStatusUpdate(id, newStatus);
            }}
            style={{
              minWidth: "80px",
              padding: "4px 0",
              backgroundColor: "#4f46e5",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss()}
            style={{
              minWidth: "80px",
              padding: "4px 0",
              backgroundColor: "#f3f4f6",
              color: "#374151",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            No
          </button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false }
    );
  };

  

  return (
    <>
      {/* 検索バー */}
      {todos.length > 0 && (
        <div style={{
          margin: '20px',
          display: 'flex',
          gap: '20px',
          alignItems: 'center'
        }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search style={{
              position: 'absolute',
              left: '12px',
              top: '35%',
              transform: 'translateY(-50%)',
              width: '20px',
              height: '20px',
              color: '#9ca3af',
              margin: '10px'
            }} />
            <input
              type="text"
              placeholder="タイトルまたは本文で検索..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleBackendSearch();
                }
              }}
              style={{
                width: '100%',
                padding: '12px 12px 12px 44px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '15px',
                outline: 'none',
                transition: 'border-color 0.2s',
                margin: '10px'
              }}
            />
          </div>
          <button
            onClick={openDrawer}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#6b7280',
              color: 'white',
              padding: '12px 20px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap'
            }}
          >
            <Filter style={{ width: '20px', height: '20px' }} />
            <p className="nonetext">詳細検索</p>
          </button>
        </div>
      )}

      {/* ドロワー（詳細検索） */}
      {isDrawerOpen && (
        <>
          <div
            onClick={closeDrawer}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 999
            }}
          />
          <div style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '400px',
            maxWidth: '90vw',
            height: '100vh',
            backgroundColor: 'white',
            boxShadow: '-4px 0 6px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '20px',
              borderBottom: '2px solid #e5e7eb'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>詳細検索</h2>
              <button
                onClick={closeDrawer}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <X style={{ width: '24px', height: '24px' }} />
              </button>
            </div>

            <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
              {/* 進捗状態フィルター */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: '#374151'
                }}>
                  進捗状態
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '15px',
                    cursor: 'pointer'
                  }}
                >
                  <option value="all">すべて</option>
                  <option value="completed">完了</option>
                  <option value="incomplete">未完了</option>
                </select>
              </div>

              {/* 期限フィルター */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: '#374151'
                }}>
                  期限
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '13px',
                      marginBottom: '4px',
                      color: '#6b7280'
                    }}>
                      開始日
                    </label>
                    <input
                      type="date"
                      value={filterDueDateFrom}
                      onChange={(e) => setFilterDueDateFrom(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '15px'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '13px',
                      marginBottom: '4px',
                      color: '#6b7280'
                    }}>
                      終了日
                    </label>
                    <input
                      type="date"
                      value={filterDueDateTo}
                      onChange={(e) => setFilterDueDateTo(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '15px'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* 検索結果数 */}
              <div style={{
                padding: '12px',
                backgroundColor: '#f3f4f6',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#6b7280'
              }}>
                {filteredTodos.length}件のタスクが見つかりました
              </div>
            </div>

            <div style={{
              padding: '20px',
              borderTop: '2px solid #e5e7eb',
              display: 'flex',
              gap: '10px'
            }}>
              <button
                onClick={clearFilters}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#f3f4f6',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  color: '#374151'
                }}
              >
                クリア
              </button>
              <button
                onClick={handleBackendSearch}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#4f46e5',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: "0 6px 16px rgba(79, 70, 229, 0.25)",
                  transition: "all 0.2s ease",
                }}
              >
                適用
              </button>
            </div>
          </div>
        </>
      )}

      {/* タスク一覧ヘッダー */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        {todos.length > 0 && (
          <>
            <h1 style={{ fontSize: '22px', margin: '0 0 10px 20px' }}>
              タスク一覧
            </h1>

            <div style={{ display: 'flex', gap: '10px', marginTop: '0' }}>
              <button
                onClick={navigateToCreate}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#4f46e5',
                  color: 'white',
                  padding: '12px 20px',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 2px 4px rgba(79, 70, 229, 0.2)',
                  marginRight: '20px'
                }}
              >
                <Plus style={{ width: '20px', height: '20px' }} />
                <p className="nonetext">新規タスクを作成</p>
              </button>
              {edit ? (
                <button
                  onClick={handleEditCancel}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: '#4f46e5',
                    color: 'white',
                    padding: '12px 20px',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 2px 4px rgba(79, 70, 229, 0.2)',
                    marginRight: '20px',
                  }}
                >
                  <X style={{ width: '20px', height: '20px' }} />
                  <p className="nonetext">編集をやめる</p>
                </button>
              ) : (
                <button
                  onClick={handleEdit}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: '#4f46e5',
                    color: 'white',
                    padding: '12px 20px',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 2px 4px rgba(79, 70, 229, 0.2)',
                    marginRight: '20px',
                  }}
                >
                  <Pencil style={{ width: '20px', height: '20px' }} />
                  <p className="nonetext">進捗状態を編集</p>
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* タスク一覧表示 */}
      {todos.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "80px 20px",
          color: "#6b7280",
        }}>
          <p className="text-align" style={{
            fontSize: "20px",
            fontWeight: "600",
            marginBottom: "8px",
            color: "#374151",
          }}>
            まだタスクがありません
          </p>
          <p style={{
            fontSize: "14px",
            marginBottom: "32px",
          }}>
            最初のタスクを作って、TODO管理を始めましょう
          </p>
          <button
            onClick={navigateToCreate}
            className="button"
            style={{
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 6px 16px rgba(79, 70, 229, 0.25)",
              transition: "all 0.2s ease",
            }}
          >
            <Plus style={{ width: "20px", height: "20px", display: "inline-block", marginRight: "8px" }} />
            新規タスクを作成
          </button>
        </div>
      ) : filteredTodos.length === 0 && hasSearched ? (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          color: '#6b7280'
        }}>
          <p style={{ fontSize: '18px', marginBottom: '10px' }}>
            検索条件に一致するタスクが見つかりませんでした
          </p>
          <button
            onClick={clearFilters}
            style={{
              marginTop: '10px',
              padding: '10px 20px',
              backgroundColor: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              boxShadow: "0 6px 16px rgba(79, 70, 229, 0.25)",
              transition: "all 0.2s ease",
            }}
          >
            検索条件をクリア
          </button>
        </div>
      ) : edit ? (
        <div>
          <ul>
            {filteredTodos.map((todo) => (
              <li
                className="todo-item"
                key={todo.id}
                onClick={() => navigateToDetail(todo.id)}
              >
                <h2 className="todo-title">{todo.title}</h2>
                <p className="todo-body">{todo.body}</p>
                <p className="todo-dueDate">
                  期限: {todo.dueDate || " 未設定"}
                </p>
                <div className="checkbox">
                  <label className="label">進捗：</label>
                  <input
                    type="checkbox"
                    checked={todo.isCompleted}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleUpdate(todo.id, e.target.checked);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    style={{ width: '20px', height: '20px' }}
                  />
                  <p style={{ margin: '0 10px' }}>
                    {todo.isCompleted ? "完了" : "未完了"}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <ul>
          {filteredTodos.map((todo) => (
            <li
              className="todo-item"
              key={todo.id}
              onClick={() => navigateToDetail(todo.id)}
            >
              <h2 className="todo-title">{todo.title}</h2>
              <p className="todo-body">{todo.body}</p>
              <p className="todo-dueDate">
                  期限: {todo.dueDate || " 未設定"}
              </p>
              <p className="todo-completed">
                進捗: {todo.isCompleted ? "✅" : "❌"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}