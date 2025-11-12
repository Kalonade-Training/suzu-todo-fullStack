package database

import (
	"fmt"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

// NewGormDB Gormを使ってMySQLに接続する関数
func NewGormDB() (*gorm.DB, error) {
	// Dockerで立ち上げたMySQL設定に合わせる
	user := "root"
	password := "root"
	host := "127.0.0.1"
	port := "3306"
	dbname := "go_todo_mysql"

	// DSN組み立て
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true&charset=utf8mb4",
		user, password, host, port, dbname)

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("failed to open DB: %w", err)
	}

	fmt.Println("✅ Gorm connected successfully!")
	return db, nil
}
