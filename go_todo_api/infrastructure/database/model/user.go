package model

import "time"

type Users struct {
	ID        string    `gorm:"primaryKey;autoIncrement"`
	Email     string    `gorm:"uniqueIndex;type:varchar(100);not null"`
	Password  string    `gorm:"type:varchar(255);not null"`
	CreatedAt time.Time `gorm:"not null;autoCreateTime" json:"created_at"`
	UpdatedAt time.Time `gorm:"not null;autoUpdateTime" json:"updated_at"`
}
