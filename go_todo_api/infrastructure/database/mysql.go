package database

import (
	"fmt"
	"todo-app-go/infrastructure/database/model"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// NewGormDB Gormを使ってMySQLに接続する関数
func NewGormDB() (*gorm.DB, error) {
	// Dockerで立ち上げたMySQL設定に合わせる
	user := "root"
	password := "root"
	host := "127.0.0.1"
	port := "3306"
	dbname := "go_todo_mysql"

	// DSN組み立て(MySQLにどうやって接続するかの情報を表した文字列)
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true&charset=utf8mb4",
		user, password, host, port, dbname)

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{ //DB接続開始
		Logger: logger.Default.LogMode(logger.Silent), //SQLログを非表示
	})
	if err != nil {
		return nil, fmt.Errorf("データが読み込めません： %w", err)
	}

	// AutoMigrateでテーブル作成(自動でテーブルやカラムを生成・更新してくれる)
	if err := db.AutoMigrate(&model.Users{}, &model.Todos{}); err != nil {
		return nil, fmt.Errorf("failed to migrate User table: %w", err)
	}

	fmt.Println("✅ Gorm connected successfully!")
	return db, nil
}
