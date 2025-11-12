package model

import "time"

type Users struct {
	ID        string    `gorm:"primaryKey;autoIncrement"`
	Email     string    `gorm:"uniqueIndex;type:varchar(100)"`
	Password  string    `gorm:"type:varchar(255)"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updated_at"`
}
